import type { ReactNode } from "react";
import Link from "next/link";

type Locale = "en" | "es";

export function PublicHeader({
  locale = "en",
  localeToggleHref,
  showActions = true,
}: {
  locale?: Locale;
  localeToggleHref?: string;
  showActions?: boolean;
}) {
  return (
    <header className="joned-public-nav">
      <a href="/" className="joned-logo-shell" aria-label="Joned Transpor Co home">
        <img src="/joned-logo-color.png" alt="Joned Transpor Co" className="joned-logo-image" />
      </a>
      <nav className="joned-public-links" aria-label="Primary">
        <a href="/">Home</a>
        <a href="/services/">Services</a>
        <a href="/coverage/">Coverage</a>
        <a href="/resources/">Resources</a>
        <a href="/contact/">Contact</a>
      </nav>
      <div className="joned-public-actions">
        {localeToggleHref ? (
          <Link href={localeToggleHref} className="joned-lang-switch" aria-label={locale === "es" ? "Cambiar a English" : "Switch to Español"}>
            <span className="joned-lang-switch__current">{locale === "es" ? "Español" : "English"}</span>
            <span className="joned-lang-switch__next">{locale === "es" ? "English" : "Español"}</span>
          </Link>
        ) : null}
        {showActions ? (
          <>
            <a href="https://portal.jonedtransport.com/" className="joned-secondary-btn">
              {locale === "es" ? "Iniciar sesión" : "Sign in"}
            </a>
            <a href="/quote/" className="joned-yellow-btn">
              {locale === "es" ? "Solicitar cotización" : "Request quote"}
            </a>
          </>
        ) : null}
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="joned-public-footer">
      <div className="joned-logo-shell">
        <img src="/joned-logo-color.png" alt="Joned Transpor Co" className="joned-logo-image" />
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
