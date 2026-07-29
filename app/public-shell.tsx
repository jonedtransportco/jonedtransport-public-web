import type { ReactNode } from "react";

export function PublicHeader() {
  return (
    <header className="joned-public-nav">
      <a href="/" className="joned-lockup" aria-label="Joned Transpor Co home">
        <span className="brand-mark">J</span>
        <span>
          <strong>JONED</strong>
          <small>TRANSPOR CO</small>
        </span>
      </a>
      <nav className="joned-public-links" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/services/">Services</a>
        <a href="/coverage/">Coverage</a>
        <a href="/about/">About</a>
        <a href="/resources/">Resources</a>
        <a href="/contact/">Contact</a>
      </nav>
      <div className="joned-public-actions">
        <a href="https://portal.jonedtransport.com/" className="joned-secondary-btn">
          Sign in
        </a>
        <a href="/quote/" className="joned-yellow-btn">Request quote</a>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="joned-public-footer">
      <div className="joned-lockup inverse">
        <span className="brand-mark">J</span>
        <span>
          <strong>JONED</strong>
          <small>TRANSPOR CO</small>
        </span>
      </div>
      <p>Reliable transportation. Protected enterprise access. Responsive support.</p>
      <div>
        <a href="/contact/">Contact</a>
        <a href="/tracking/">Tracking</a>
        <a href="https://portal.jonedtransport.com/">Private portal</a>
      </div>
    </footer>
  );
}

export function PublicDetailPage({
  eyebrow,
  title,
  introduction,
  children,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
}) {
  return (
    <main className="joned-public">
      <PublicHeader />
      <section className="joned-page-hero">
        <span className="joned-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{introduction}</p>
      </section>
      <section className="joned-page-content">{children}</section>
      <PublicFooter />
    </main>
  );
}
