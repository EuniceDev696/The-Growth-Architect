import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PaperAirplaneIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { apiRequest } from "../../lib/api";
import { getClientUser } from "../../lib/clientSession";

const Messages = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const user = getClientUser() || { name: "Client", email: "" };

  useEffect(() => {
    apiRequest("/client/messages", { auth: "client" })
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const response = await apiRequest("/client/messages", {
      method: "POST",
      auth: "client",
      body: JSON.stringify({ text: newMessage.trim() }),
    });

    if (response?.message) {
      setMessages((prev) => [...prev, response.message]);
      setNewMessage("");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 lg:p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-lg text-gray-600">Chat with your Growth Architect, ask questions, share updates, or follow up.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col h-[70vh]">
        <div className="p-4 border-b bg-teal-50 flex items-center gap-3">
          <UserCircleIcon className="h-10 w-10 text-teal-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Stella Martins</h3>
            <p className="text-sm text-gray-600">Your Growth Architect</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="h-full flex items-center justify-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <PaperAirplaneIcon className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg">No messages yet</p>
              <p className="text-sm mt-2">Send a message to start the conversation</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`mb-4 flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    msg.sender === "client" ? "bg-teal-600 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.dateDisplay || msg.timestamp}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:bg-gray-300 transition flex items-center justify-center"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link to="/client/dashboard" className="text-teal-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Messages;
