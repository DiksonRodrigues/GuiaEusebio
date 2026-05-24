type TrackPayload = {
  business_id?: string;
  coupon_id?: string;
  metadata?: Record<string, unknown>;
};

export function track(event_type: string, payload: TrackPayload = {}) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_type, ...payload }),
    keepalive: true,
  }).catch(() => {});
}
