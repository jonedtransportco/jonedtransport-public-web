import { PublicFooter, PublicHeader } from "./public-shell";

const trustItems = [
  ["Security", "Protected freight and controlled access."],
  ["On-time focus", "Coordination against committed windows."],
  ["Coverage", "Mexico, the United States, and Canada."],
  ["24/7 support", "Responsive help when operations change."],
];

export default function Home() {
  return (
    <main className="joned-public">
      <PublicHeader />

      <section className="joned-hero joned-home-hero">
        <div className="joned-hero-copy">
          <span className="joned-eyebrow">Transport and logistics</span>
          <h1>
            We move your freight and help grow <em>your business.</em>
          </h1>
          <p>
            Reliable, secure, and efficient ground transportation across Mexico,
            the United States, and Canada.
          </p>
          <div className="joned-button-row">
            <a href="/quote/" className="joned-yellow-btn">
              Request quote
            </a>
            <a href="/tracking/" className="joned-hero-outline-btn">
              Track shipment
            </a>
          </div>
        </div>
        <div className="joned-hero-photo-space" aria-hidden="true" />
      </section>

      <section className="joned-trust-strip" aria-label="Service commitments">
        {trustItems.map(([title, body]) => (
          <article key={title}>
            <span className="joned-trust-icon" aria-hidden="true">✓</span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="joned-home-paths" aria-label="Primary website destinations">
        <a href="/services/" className="joned-home-path">
          <span>01</span>
          <h2>Transportation services</h2>
          <p>Explore ground capacity, dispatch support, protected tracking, and carrier solutions.</p>
          <strong>Explore services →</strong>
        </a>
        <a href="/coverage/" className="joned-home-path">
          <span>02</span>
          <h2>Cross-border coverage</h2>
          <p>Understand the service footprint across Mexico, the United States, and Canada.</p>
          <strong>View coverage →</strong>
        </a>
        <a href="/resources/" className="joned-home-path">
          <span>03</span>
          <h2>Carrier opportunities</h2>
          <p>Choose the dedicated application path for drivers or owner operators.</p>
          <strong>Open resources →</strong>
        </a>
      </section>

      <section className="joned-home-cta">
        <div>
          <span className="joned-eyebrow">Ready to move?</span>
          <h2>Build your next lane with Joned Transpor Co.</h2>
        </div>
        <div className="joned-button-row">
          <a href="/quote/" className="joned-yellow-btn">Request quote</a>
          <a href="/contact/" className="joned-outline-btn">Contact our team</a>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
