import { PublicDetailPage } from "../public-shell";

export default function ResourcesPage() {
  return (
    <PublicDetailPage
      eyebrow="Resources"
      title="Choose the path that matches your relationship with JONED."
      introduction="Public application routes remain separate from the private operating portal."
    >
      <div className="joned-page-grid two">
        <article className="joned-page-card feature">
          <span>Owner operators</span>
          <h2>Bring your business and capacity.</h2>
          <p>Review requirements and begin the route that applies to you or your company.</p>
          <a href="/owner-operators/" className="joned-yellow-btn">Owner operator path</a>
        </article>
        <article className="joned-page-card feature">
          <span>Drivers</span>
          <h2>Explore driver opportunities.</h2>
          <p>Start with the appropriate CDL or non-CDL prequalification path.</p>
          <a href="/drivers/" className="joned-yellow-btn">Driver path</a>
        </article>
      </div>
    </PublicDetailPage>
  );
}
