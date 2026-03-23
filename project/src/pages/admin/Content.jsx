import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";

const DEFAULT_CONTENT = {
  home: {
    heroTitle: "",
    heroSubtitle: "",
    primaryCta: "",
  },
};

export default function Content() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    apiRequest("/content")
      .then((data) => {
        if (!mounted) return;
        setContent({ ...DEFAULT_CONTENT, ...data, home: { ...DEFAULT_CONTENT.home, ...(data?.home || {}) } });
      })
      .catch((error) => {
        if (mounted) setStatusMessage(error.message || "Unable to load content.");
      });
    return () => {
      mounted = false;
    };
  }, []);

  const save = async () => {
    try {
      const saved = await apiRequest("/content", {
        method: "POST",
        body: JSON.stringify(content),
      });
      setContent({ ...content, ...saved });
      setStatusMessage("Content updated successfully.");
    } catch (error) {
      setStatusMessage(error.message || "Unable to save content.");
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Website Content</h1>

      <section className="bg-white rounded-xl shadow p-5 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Home Hero</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={content.home?.heroTitle || ""}
            onChange={(e) => setContent((prev) => ({ ...prev, home: { ...prev.home, heroTitle: e.target.value } }))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <textarea
            rows={4}
            value={content.home?.heroSubtitle || ""}
            onChange={(e) => setContent((prev) => ({ ...prev, home: { ...prev.home, heroSubtitle: e.target.value } }))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Primary CTA Label</label>
          <input
            type="text"
            value={content.home?.primaryCta || ""}
            onChange={(e) => setContent((prev) => ({ ...prev, home: { ...prev.home, primaryCta: e.target.value } }))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </section>

      <button onClick={save} className="mt-5 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Save Content
      </button>
      {statusMessage && <p className="mt-3 text-sm text-indigo-700">{statusMessage}</p>}
    </div>
  );
}
