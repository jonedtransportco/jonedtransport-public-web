import { PublicDetailPage } from "../public-shell";

export default function AboutPage() {
  return (
    <PublicDetailPage
      eyebrow="About Joned"
      title="A transportation company built for accountable service."
      introduction="Joned Transpor Co brings operations, customer communication, and controlled digital access into one consistent service experience."
    >
      <div className="joned-page-grid three">
        <article className="joned-page-card"><span>01</span><h2>Reliable</h2><p>Commitments are coordinated against real operating conditions and service windows.</p></article>
        <article className="joned-page-card"><span>02</span><h2>Secure</h2><p>Driver, location, route, document, and billing detail remains protected by role.</p></article>
        <article className="joned-page-card"><span>03</span><h2>Responsive</h2><p>Customers and operating teams receive clear escalation paths when conditions change.</p></article>
      </div>
      <article className="joned-page-story">
        <span className="joned-eyebrow">Our operating idea</span>
        <h2>Public clarity outside. Protected operations inside.</h2>
        <p>The corporate website explains services and opens controlled contact paths. The private JONED Enterprise Platform is a separate environment for authorized employees and external users.</p>
      </article>
    </PublicDetailPage>
  );
}
