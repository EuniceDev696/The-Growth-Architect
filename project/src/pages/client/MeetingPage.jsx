import { useEffect, useMemo, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { getClientUser } from "../../lib/clientSession";

const normalizeRoomId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const MeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionIdInput, setSessionIdInput] = useState(id || "");
  const [joinReady, setJoinReady] = useState(false);
  const [startMutedAudio, setStartMutedAudio] = useState(false);
  const [startMutedVideo, setStartMutedVideo] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({ checking: false, message: "" });
  const [accessStatus, setAccessStatus] = useState("checking");
  const [accessMessage, setAccessMessage] = useState("");
  const [resolvedMeetingToken, setResolvedMeetingToken] = useState("");

  const safeId = useMemo(() => normalizeRoomId(id), [id]);
  const manualMode = searchParams.get("manual") === "1";
  const user = getClientUser();
  const meetingTokenCandidate = useMemo(() => {
    const urlToken = searchParams.get("t") || "";
    return urlToken;
  }, [searchParams]);

  useEffect(() => {
    setResolvedMeetingToken(meetingTokenCandidate);
  }, [meetingTokenCandidate]);

  useEffect(() => {
    let cancelled = false;

    const verifyAccess = async () => {
      if (!user?.email) {
        if (!cancelled) {
          setAccessStatus("denied");
          setAccessMessage("You need to log in to join meetings.");
        }
        return;
      }

      if (!safeId) {
        if (!cancelled) {
          setAccessStatus("denied");
          setAccessMessage("Meeting ID is missing or invalid.");
        }
        return;
      }

      if (manualMode) {
        if (!cancelled) {
          setAccessStatus("granted");
          setAccessMessage("");
        }
        return;
      }

      let activeToken = String(resolvedMeetingToken || "");
      if (!activeToken) {
        try {
          const recovery = await apiRequest("/meetings/client-token", {
            method: "POST",
            auth: "client",
            body: JSON.stringify({
              meetingId: safeId,
            }),
          });
          activeToken = String(recovery?.meetingToken || "");
          if (activeToken) {
            if (!cancelled) {
              setResolvedMeetingToken(activeToken);
              navigate(`/client/meeting/${safeId}?t=${encodeURIComponent(activeToken)}`, { replace: true });
            }
          }
        } catch (error) {
          if (!cancelled) {
            setAccessStatus("denied");
            setAccessMessage(error.message || "Could not recover meeting access token.");
          }
          return;
        }
      }

      if (!activeToken) {
        if (!cancelled) {
          setAccessStatus("denied");
          setAccessMessage("Missing secure meeting token. Please open the link from your Sessions page.");
        }
        return;
      }

      try {
        await apiRequest("/meetings/verify", {
          method: "POST",
          body: JSON.stringify({
            meetingToken: activeToken,
            meetingId: safeId,
            email: user.email,
          }),
        });
        if (!cancelled) {
          setAccessStatus("granted");
          setAccessMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setAccessStatus("denied");
          setAccessMessage(error.message || "Meeting access verification failed.");
        }
      }
    };

    verifyAccess();
    return () => {
      cancelled = true;
    };
  }, [resolvedMeetingToken, safeId, user?.email, navigate, manualMode]);

  const runDeviceCheck = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setDeviceStatus({ checking: false, message: "Device check not supported in this browser." });
      return;
    }
    setDeviceStatus({ checking: true, message: "" });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setDeviceStatus({ checking: false, message: "Camera and microphone are available." });
    } catch {
      setDeviceStatus({
        checking: false,
        message: "Could not access camera/microphone. You can still join and grant permissions in-call.",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Please log in</h2>
          <p className="mb-6">You need to be logged in to join meetings.</p>
          <button
            onClick={() => navigate("/client/auth")}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!safeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Meeting by Session ID</h1>
          <p className="text-gray-600 mb-6">
            Enter the session ID shared by your admin or coach (via WhatsApp, SMS, email, or call).
          </p>
          <input
            value={sessionIdInput}
            onChange={(e) => setSessionIdInput(e.target.value)}
            placeholder="session-123"
            className="w-full border rounded-xl px-4 py-3 mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/client/meeting/${normalizeRoomId(sessionIdInput)}?manual=1`)}
              disabled={!normalizeRoomId(sessionIdInput)}
              className="px-5 py-3 bg-teal-600 disabled:bg-gray-300 text-white rounded-xl"
            >
              Continue
            </button>
            <button
              onClick={() => navigate("/client/sessions")}
              className="px-5 py-3 bg-gray-200 text-gray-800 rounded-xl"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (accessStatus === "checking") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Verifying Meeting Access</h2>
          <p className="text-gray-600">Please wait while we validate your secure meeting link.</p>
        </div>
      </div>
    );
  }

  if (accessStatus !== "granted") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Meeting Access Not Available</h2>
          <p className="mb-6 text-gray-700">
            {accessMessage || "This secure link is invalid or expired. Please open the meeting from Sessions."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/client/sessions")}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
            >
              Go to Sessions
            </button>
            <button
              onClick={() => navigate("/client/meeting")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Join by Session ID
            </button>
            <button
              onClick={() => navigate("/client/messages")}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!joinReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pre-Join Check</h1>
          <p className="text-gray-600 mb-6">Session ID: {safeId}</p>
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 text-gray-700">
              <input
                type="checkbox"
                checked={startMutedAudio}
                onChange={(e) => setStartMutedAudio(e.target.checked)}
              />
              Join with microphone muted
            </label>
            <label className="flex items-center gap-3 text-gray-700">
              <input
                type="checkbox"
                checked={startMutedVideo}
                onChange={(e) => setStartMutedVideo(e.target.checked)}
              />
              Join with camera off
            </label>
          </div>
          <div className="flex gap-3 mb-3">
            <button
              onClick={runDeviceCheck}
              disabled={deviceStatus.checking}
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800"
            >
              {deviceStatus.checking ? "Checking..." : "Test Camera/Mic"}
            </button>
            <button onClick={() => setJoinReady(true)} className="px-5 py-2 bg-teal-600 text-white rounded-lg">
              Join Meeting
            </button>
          </div>
          {deviceStatus.message && <p className="text-sm text-gray-600">{deviceStatus.message}</p>}
        </div>
      </div>
    );
  }

  const roomName = `growth-architect-session-${safeId}`;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Meeting with Your Growth Architect</h1>
        <p className="text-gray-600">Session ID: {safeId} • Joined as {user.name}</p>
      </div>

      <div className="h-[calc(100vh-80px)]">
        <JitsiMeeting
          roomName={roomName}
          configOverwrite={{
            startWithAudioMuted: startMutedAudio,
            startWithVideoMuted: startMutedVideo,
            disableModeratorIndicator: true,
            requireDisplayName: true,
            enableWelcomePage: false,
            disableDeepLinking: true,
          }}
          interfaceConfigOverwrite={{
            TOOLBAR_BUTTONS: [
              "microphone",
              "camera",
              "desktop",
              "chat",
              "raisehand",
              "participants",
              "tileview",
              "fullscreen",
              "hangup",
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
          }}
          userInfo={{
            displayName: user.name || "Client",
            email: user.email,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
            iframeRef.allow = "camera *; microphone *; fullscreen *; display-capture *; autoplay *";
          }}
        />
      </div>
    </div>
  );
};

export default MeetingPage;
