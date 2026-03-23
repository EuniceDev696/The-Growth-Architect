const toPayload = (event, properties = {}) => ({
  event,
  timestamp: new Date().toISOString(),
  path: typeof window !== "undefined" ? window.location.pathname : "",
  ...properties,
});

export function trackEvent(event, properties = {}) {
  if (!event) return;
  const payload = toPayload(event, properties);

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);

    if (typeof window.gtag === "function") {
      window.gtag("event", event, properties);
    }

  }
}
