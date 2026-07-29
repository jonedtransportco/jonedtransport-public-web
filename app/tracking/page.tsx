import { PublicDetailPage } from "../public-shell";

export default function TrackingPage() {
  return (
    <PublicDetailPage
      eyebrow="Tracking"
      title="Check a shipment reference."
      introduction="Public tracking is intentionally limited to high-level status. Driver identity, exact location, stops, detailed routing, and evidence remain protected."
    >
      <div className="joned-tracking-page">
        <div className="joned-search-shell">
          <input aria-label="Tracking reference" placeholder="Enter shipment reference" />
          <button className="joned-primary-btn" type="button">Check status</button>
        </div>
        <article>
          <strong>Privacy by design</strong>
          <p>Detailed shipment information is available only through the authenticated portal and within the user&apos;s assigned role.</p>
          <a href="https://portal.jonedtransport.com/">Access the private portal</a>
        </article>
      </div>
    </PublicDetailPage>
  );
}
