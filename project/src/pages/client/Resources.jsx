import { Link } from "react-router-dom";
import { useState } from "react";

const resources = [
  {
    id: "worksheet-1",
    title: "Leadership Influence Model Worksheet",
    type: "Document",
    description: "A practical worksheet to clarify leadership priorities and influence points.",
    fileName: "leadership-influence-worksheet.doc",
    filePath: "resources/leadership-influence-worksheet.doc",
  },
  {
    id: "template-1",
    title: "Growth Metrics Tracker Template",
    type: "Document",
    description: "Track weekly KPIs and execution health in one place.",
    fileName: "growth-metrics-tracker.doc",
    filePath: "resources/growth-metrics-tracker.doc",
  },
  {
    id: "checklist-1",
    title: "Discovery Call Preparation Checklist",
    type: "Document",
    description: "Use this checklist to prepare your documents and decisions before your session.",
    fileName: "discovery-call-checklist.doc",
    filePath: "resources/discovery-call-checklist.doc",
  },
];

export default function Resources() {
  const [downloadingId, setDownloadingId] = useState("");

  const buildResourceUrl = (filePath) => {
    const base = import.meta.env.BASE_URL || "/";
    const normalizedBase = base.endsWith("/") ? base : `${base}/`;
    return `${normalizedBase}${filePath}`;
  };

  const handleDownload = async (item) => {
    try {
      setDownloadingId(item.id);
      const response = await fetch(buildResourceUrl(item.filePath), { credentials: "same-origin" });
      if (!response.ok) {
        throw new Error(`Unable to download ${item.fileName}`);
      }
      const rawBytes = await response.arrayBuffer();
      const blob = new Blob([rawBytes], { type: "application/octet-stream" });
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = item.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert(error.message || "Download failed. Please try again.");
    } finally {
      setDownloadingId("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resources & Library</h1>
        <p className="mt-2 text-gray-600">Reference materials to support your growth journey.</p>
      </header>

      <div className="grid gap-4">
        {resources.map((item) => (
          <article key={item.id} className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-teal-700 font-semibold">{item.type}</p>
            <h2 className="text-xl font-semibold text-gray-900 mt-1">{item.title}</h2>
            <p className="text-gray-600 mt-2">{item.description}</p>
            <button
              type="button"
              onClick={() => handleDownload(item)}
              disabled={downloadingId === item.id}
              className="inline-flex mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition"
            >
              {downloadingId === item.id ? "Downloading..." : "Download Material"}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/client/dashboard" className="text-teal-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
