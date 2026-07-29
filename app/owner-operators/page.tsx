import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import OwnerOperatorPrequalificationForm from "./prequalification-form";

const profileCards = [
  {
    title: "Person with vehicle",
    body: "For applicants entering as individuals with their own vehicle or an associated operating unit.",
  },
  {
    title: "Business with vehicle",
    body: "For business applicants entering with commercial structure and vehicle-based operational support.",
  },
  {
    title: "Person without vehicle",
    body: "For driver-style or similar routes where the application does not begin with a self-provided unit.",
  },
];

const valueCards = [
  {
    title: "Structured process",
    body: "A clearer intake and review path from the beginning, without forcing every applicant into one universal checklist.",
  },
  {
    title: "Professional communication",
    body: "A more organized experience for applicants and operating partners before the internal review phase begins.",
  },
  {
    title: "Profile-based requirements",
    body: "The route should reveal the requirements that match the profile instead of assuming CDL, company formation, or one vehicle type.",
  },
  {
    title: "Operational continuity",
    body: "Built to support a real working relationship, not only a one-time document drop.",
  },
];

const prepGroups = [
  ["Applicant information", "Legal name, phone, email, city, state, and language preference."],
  ["License and compliance", "CDL or Non-CDL information, plus medical card only when it applies."],
  ["Vehicle and authority", "Vehicle type, registration, DOT, MC, or authority documents only when needed."],
  ["Insurance and payment", "COI, coverage details, W-9, and voided check only when the route requires them."],
];

const routeNotes = [
  "Applying as an individual or as a business",
  "Applying with a vehicle or without a vehicle",
  "CDL and Non-CDL paths",
  "Requirements shown according to your profile",
];

const faqItems = [
  [
    "Do I need a CDL to apply?",
    "Not always. Some routes require CDL and others follow a Non-CDL path. The application helps identify the right route.",
  ],
  [
    "Do I need to apply as a company?",
    "No. Some applicants apply as individuals and others as businesses. The form is designed to support both paths.",
  ],
  [
    "Do I need a vehicle to start?",
    "Not always. Some applicants start with a vehicle and others begin through a no-vehicle path.",
  ],
  [
    "Will I see the same checklist as everyone else?",
    "No. The application is designed to adapt to your route, vehicle path, and license path.",
  ],
];

function isPortalHost(value: string | null): boolean {
  if (!value) return false;
  const host = value.split(":")[0]?.toLowerCase() ?? "";
  return host === "portal.jonedtransport.com";
}

export default async function OwnerOperatorsPage() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (isPortalHost(host)) {
    redirect("/");
  }

  return (
    <main className="owner-page">
      <header className="site-header owner">
        <Link href="/" className="brand brand-dark">
          <span className="brand-mark">J</span>
          <div>
            <b>JONED</b>
            <small>TRANSPORT CO.</small>
          </div>
        </Link>
        <nav className="site-nav" aria-label="Owner Operators">
          <a href="#fit">Who this is for</a>
          <a href="#why-joned">Why JONED</a>
          <a href="#prepare">What to prepare</a>
          <a href="#process">How it works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="site-actions">
          <Link href="/" className="ghost-link">Back to main site</Link>
          <Link href="/portal" className="nav-login dark">Portal access</Link>
        </div>
      </header>

      <section className="owner-hero">
        <div className="owner-hero-copy">
          <span>OWNER OPERATORS</span>
          <h1>Apply through the path that fits your operation.</h1>
          <p>
            Whether you are applying as a person or as a business, with a vehicle or without one,
            the intake should guide you to the requirements that actually apply to your profile.
          </p>
          <div className="hero-actions">
            <a href="#start" className="primary-cta">Start application</a>
            <a href="#prepare" className="ghost-link large">See what to prepare</a>
          </div>
        </div>
        <div className="owner-hero-panel">
          <b>What this page is designed to support</b>
          <ul>
            <li>Person and business applicants</li>
            <li>With vehicle and without vehicle paths</li>
            <li>CDL and Non-CDL routes</li>
            <li>Dynamic checklist by profile</li>
          </ul>
        </div>
      </section>

      <section className="site-section" id="fit">
        <div className="section-head">
          <span>WHO THIS PATH IS FOR</span>
          <h2>A broader intake path, not one rigid contractor label.</h2>
          <p>
            This page is designed for applicants who may work with JONED in different operating setups.
            Some apply as people, some as businesses, some bring a vehicle, and some begin on a no-vehicle path.
          </p>
        </div>
        <div className="service-grid">
          {profileCards.map((card) => (
            <article key={card.title} className="service-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <div className="owner-route-note">
          <b>If you are not sure which category fits you, you can still start the application.</b>
          <p>The form should guide you instead of blocking you at the first decision.</p>
        </div>
        <div className="owner-route-list">
          {routeNotes.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="site-section muted" id="why-joned">
        <div className="section-head">
          <span>WHY WORK WITH JONED</span>
          <h2>A more practical entry path for long-term operating relationships.</h2>
          <p>
            This page should feel serious, clear, and useful. It should help applicants understand
            that JONED is building a more organized process from the first step.
          </p>
        </div>
        <div className="service-grid">
          {valueCards.map((card) => (
            <article key={card.title} className="service-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section" id="prepare">
        <div className="section-head">
          <span>WHAT TO PREPARE</span>
          <h2>You do not need every document unless it applies to your route.</h2>
          <p>
            The application should first identify your profile, then show the fields and uploads that match
            your route instead of pushing everyone through the same checklist.
          </p>
        </div>
        <div className="prep-grid">
          {prepGroups.map(([title, body]) => (
            <article key={title} className="prep-card">
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="owner-route-note compact">
          <b>Only the items that apply to your route should be requested.</b>
          <p>Some business, authority, insurance, and payment items may appear only when your route requires them.</p>
        </div>
      </section>

      <section className="site-section muted" id="process">
        <div className="section-head">
          <span>HOW THE PROCESS WORKS</span>
          <h2>A guided route from first questions to intake submission.</h2>
          <p>
            The goal is to make the intake feel understandable and finite without implying instant
            approval, real-time onboarding, or operational activation.
          </p>
        </div>
        <div className="process-grid owner-flow">
          <article className="process-card">
            <b>01</b>
            <h3>Tell us about your path</h3>
            <p>Answer a few short questions about person or business, vehicle path, and CDL or Non-CDL.</p>
          </article>
          <article className="process-card">
            <b>02</b>
            <h3>See your requirements</h3>
            <p>The form should reveal the checklist that actually fits your route.</p>
          </article>
          <article className="process-card">
            <b>03</b>
            <h3>Submit your information</h3>
            <p>Complete the fields and upload the documents you have available for your route.</p>
          </article>
          <article className="process-card">
            <b>04</b>
            <h3>JONED reviews your application</h3>
            <p>Internal review and follow-up remain on the portal side, not on the public page.</p>
          </article>
        </div>
      </section>

      <section className="site-section owner-start" id="start">
        <div className="section-head">
          <span>READY TO BEGIN?</span>
          <h2>Start your application and let the form guide the route.</h2>
          <p>
            If you are not sure whether your path is CDL, Non-CDL, with vehicle, or without vehicle,
            you should still be able to continue.
          </p>
        </div>
        <div className="contact-actions">
          <a className="primary-cta compact" href="mailto:commercialmanager@jonedtransport.com?subject=Owner%20Operators%20Application%20Start">Start application</a>
          <Link className="ghost-link large" href="/">Back to main site</Link>
        </div>
        <p className="owner-cta-note">
          If you are not sure whether your path is CDL, Non-CDL, with vehicle, or without vehicle,
          you can still continue.
        </p>
      </section>

      <OwnerOperatorPrequalificationForm />

      <section className="site-section muted" id="faq">
        <div className="section-head">
          <span>FAQ</span>
          <h2>Questions applicants usually need answered before they begin.</h2>
        </div>
        <div className="faq-list">
          {faqItems.map(([question, answer]) => (
            <article key={question} className="faq-card">
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section owner-footer-cta">
        <div className="owner-footer-box">
          <span>STILL INTERESTED?</span>
          <h2>Start your application and we will guide you to the right path.</h2>
          <p>
            This public page is the beginning of the route. Internal status handling and operational
            review remain on the portal side after submission.
          </p>
          <div className="contact-actions">
            <a className="primary-cta compact" href="mailto:commercialmanager@jonedtransport.com?subject=Owner%20Operators%20Application%20Start">Start application</a>
            <Link className="ghost-link large" href="/">Return to jonedtransport.com</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
