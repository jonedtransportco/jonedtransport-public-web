import { PublicDetailPage } from "../public-shell";

export default function CoveragePage() {
  return (
    <PublicDetailPage
      eyebrow="Coverage"
      title="Connected service across North America."
      introduction="Coverage is coordinated across Mexico, the United States, and Canada according to lane, capacity, and service requirements."
    >
      <div className="joned-coverage-map" aria-label="North American coverage representation">
        <span className="mexico">Mexico</span>
        <span className="usa">United States</span>
        <span className="canada">Canada</span>
      </div>
      <div className="joned-page-grid three">
        <article className="joned-page-card"><h2>Mexico</h2><p>Regional and cross-border coordination based on approved lane availability.</p></article>
        <article className="joned-page-card"><h2>United States</h2><p>Core operational coverage with responsive dispatch and customer support.</p></article>
        <article className="joned-page-card"><h2>Canada</h2><p>Cross-border service subject to route, documentation, and capacity review.</p></article>
      </div>
      <div className="joned-page-action">
        <h2>Confirm your lane with our team.</h2>
        <a href="/contact/" className="joned-yellow-btn">Contact us</a>
      </div>
    </PublicDetailPage>
  );
}
