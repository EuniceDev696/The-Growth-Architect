import { useMemo, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const normalizeRoomId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const MeetingSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sessionIdInput, setSessionIdInput] = useState(id || "");
  const [joinReady, setJoinReady] = useState(false);
  const [startMutedAudio, setStartMutedAudio] = useState(false);
  const [startMutedVideo, setStartMutedVideo] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({ checking: false, message: "" });
  const { isAuthenticated } = useAuth();

  const safeId = useMemo(() => normalizeRoomId(id), [id]);
  const roomName = safeId ? `growth-architect-session-${safeId}` : "";

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold text-red-600 mb-5">Access Restricted</h2>
          <p className="text-lg text-gray-700 mb-8">You need an active admin session to manage meetings.</p>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium"
          >
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  if (!safeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Open Meeting Room</h1>
          <p className="text-gray-600 mb-6">Enter a session ID to start or rejoin a meeting.</p>
          <input
            value={sessionIdInput}
            onChange={(e) => setSessionIdInput(e.target.value)}
            placeholder="session-123"
            className="w-full border rounded-xl px-4 py-3 mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/meeting/${normalizeRoomId(sessionIdInput)}`)}
              disabled={!normalizeRoomId(sessionIdInput)}
              className="px-5 py-3 bg-indigo-600 disabled:bg-gray-300 text-white rounded-xl"
            >
              Continue
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-5 py-3 bg-gray-200 text-gray-800 rounded-xl"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!joinReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pre-Join Check (Admin)</h1>
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
            <button
              onClick={() => setJoinReady(true)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Join Meeting
            </button>
          </div>
          {deviceStatus.message && <p className="text-sm text-gray-600">{deviceStatus.message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Managing Session: {safeId}</h1>
          <p className="text-gray-600 mt-1">Growth Architect Session • Host/Admin mode</p>
        </div>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="flex-1 relative">
        <JitsiMeeting
          roomName={roomName}
          domain="meet.jit.si"
          configOverwrite={{
            startWithAudioMuted: startMutedAudio,
            startWithVideoMuted: startMutedVideo,
            disableModeratorIndicator: false,
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
              "recording",
              "livestreaming",
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_BRAND_WATERMARK: false,
            SHOW_DEEP_LINKING_IMAGE: false,
            JITSI_WATERMARK_LINK: "",
          }}
          userInfo={{
            displayName: "Growth Architect (Admin)",
            email: "admin@growtharchitect.local",
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
            iframeRef.style.position = "absolute";
            iframeRef.style.top = "0";
            iframeRef.style.left = "0";
            iframeRef.allow = "camera *; microphone *; fullscreen *; display-capture *; autoplay *";
          }}
        />
      </div>

      <div className="bg-white border-t px-6 py-3 text-sm text-gray-600 flex justify-between">
        <div>
          Session ID: <strong>{safeId}</strong>
        </div>
        <div>{new Date().toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default MeetingSession;
