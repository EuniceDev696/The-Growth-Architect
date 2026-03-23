import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    apiRequest("/subscribers")
      .then((data) => {
        if (mounted) setSubscribers(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (mounted) setStatusMessage(error.message || "Unable to load subscribers.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      setStatusMessage("Subject and content are required.");
      return;
    }
    setSending(true);
    setStatusMessage("");
    try {
      const response = await apiRequest("/subscribers/send", {
        method: "POST",
        body: JSON.stringify({
          subject: subject.trim(),
          content: content.trim(),
        }),
      });
      const sent = response?.campaign?.sent ?? 0;
      const attempted = response?.campaign?.attempted ?? 0;
      const failed = response?.campaign?.failed?.length ?? 0;
      setStatusMessage(`Newsletter sent. Delivered: ${sent}/${attempted}. Failed: ${failed}.`);
      setSubject("");
      setContent("");
    } catch (error) {
      setStatusMessage(error.message || "Unable to send newsletter.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Newsletter</h1>
        <p className="text-sm text-gray-600 mt-1">
          Send updates to all subscribed users.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold mb-2">Subscribers</h2>
        <p className="text-sm text-gray-600 mb-4">Active subscribers: {subscribers.length}</p>
        <div className="max-h-56 overflow-auto border rounded-lg">
          {subscribers.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No subscribers yet.</p>
          ) : (
            <ul>
              {subscribers.map((subscriber) => (
                <li key={subscriber.id} className="px-4 py-2 border-b last:border-b-0 text-sm">
                  {subscriber.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold">Compose Newsletter</h2>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your update here..."
          rows={8}
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
        >
          {sending ? "Sending..." : "Send Newsletter"}
        </button>
      </div>

      {statusMessage && <p className="text-sm text-indigo-700">{statusMessage}</p>}
    </div>
  );
}
