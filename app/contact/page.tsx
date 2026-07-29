import { PublicDetailPage } from "../public-shell";

export default function ContactPage() {
  return (
    <PublicDetailPage
      eyebrow="Contact"
      title="Connect with the right JONED team."
      introduction="Use the appropriate contact route so your request reaches the correct business function."
    >
      <div className="joned-page-grid three">
        <article className="joned-page-card"><h2>Commercial</h2><p>New lanes, capacity, service questions, and business opportunities.</p><a href="mailto:commercialmanager@jonedtransport.com">commercialmanager@jonedtransport.com</a></article>
        <article className="joned-page-card"><h2>Accounting</h2><p>Authorized billing and accounting correspondence.</p><a href="mailto:accounting@jonedtransport.com">accounting@jonedtransport.com</a></article>
        <article className="joned-page-card"><h2>Enterprise portal</h2><p>Authorized employees and external users access protected workspaces through Microsoft Entra ID.</p><a href="https://portal.jonedtransport.com/">Open private portal</a></article>
      </div>
    </PublicDetailPage>
  );
}
