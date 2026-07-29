import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DriversPrequalificationForm from "./prequalification-form";

const fitCards = [
  {
    title: "CDL drivers",
    body: "For applicants whose route requires CDL, including cases where endorsements, medical card review, or heavier-route compliance may apply.",
  },
  {
    title: "Non-CDL drivers",
    body: "For driver paths that do not require CDL but still need structured intake, license review, and route-fit screening.",
  },
  {
    title: "Personal or business route",
    body: "For applicants entering individually or through a registered business, without forcing either model as the only valid starting point.",
  },
];

const whyCards = [
  {
    title: "Clearer first step",
    body: "A public route that explains the path before the applicant is pushed into internal review logic.",
  },
  {
    title: "Profile-based intake",
    body: "The route should adapt to CDL or Non-CDL needs instead of treating every driver as the same case.",
  },
  {
    title: "Professional follow-up",
    body: "Applicants should see a more organized intake experience before handoff to the internal portal side.",
  },
  {
    title: "Operational continuity",
    body: "The process is meant to support real hiring and onboarding preparation, not just a one-time form submission.",
  },
];

const prepGroups = [
  ["Applicant information", "Legal name, phone, email, city, state, and preferred language."],
  ["License details", "CDL or Non-CDL information, plus endorsements, restrictions, or class details only when they apply."],
  ["Compliance items", "Medical card when required, plus route-specific compliance information for the selected driving path."],
  ["Work readiness", "Availability, role interest, experience context, and whether additional training or route review may be needed."],
];

const routeNotes = [
  "Personal applicants can start without needing to register as a company first",
  "Business applicants can identify themselves without changing the driver-first structure",
  "CDL and Non-CDL paths are handled separately",
  "No bring-your-own-vehicle questions are shown in this route",
];

const processSteps = [
  ["Tell us about your path", "Answer a few short questions about CDL status, role type, and work-readiness basics."],
  ["See what applies", "The route should show the requirements that match your driver profile."],
  ["Submit your information", "Complete the intake and provide the documents currently available for your path."],
  ["JONED reviews your application", "Internal review, follow-up, and next-step coordination remain on the controlled portal side."],
];

const faqItems = [
  [
    "Do I need a CDL to apply?",
    "Not always. Some driver routes require CDL and others follow a Non-CDL path.",
  ],
  [
    "Do I need a vehicle to apply as a driver?",
    "No. This page is intended mainly for driver paths that do not begin with a self-provided vehicle.",
  ],
  [
    "Can I apply as a person or as a business?",
    "Yes. This route can begin as a personal application or as a business-linked application, depending on how you are entering the process.",
  ],
  [
    "Do I need every document before I begin?",
    "No. The intake should identify your route first, then request the items that actually apply.",
  ],
  [
    "Is this the internal portal?",
    "No. This is a public recruiting-facing path. Internal review and operational handling stay on the portal side.",
  ],
];

function isPortalHost(value: string | null): boolean {
  if (!value) return false;
  const host = value.split(":")[0]?.toLowerCase() ?? "";
  return host === "portal.jonedtransport.com";
}

export default async function DriversPage() {
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
        <nav className="site-nav" aria-label="Drivers">
          <a href="#fit">Who this path is for</a>
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
          <span>DRIVERS</span>
          <h1>Apply through the driver path that fits your role.</h1>
          <p>
            This page is designed mainly for driver applicants without a self-provided vehicle path,
            including both CDL and Non-CDL routes, while keeping internal review separate from the public site.
            It should support applicants entering personally or through a business without adding unnecessary barriers at the first step.
          </p>
          <div className="hero-actions">
            <a href="#start" className="primary-cta">Start application</a>
            <a href="#prepare" className="ghost-link large">See what to prepare</a>
          </div>
        </div>
        <div className="owner-hero-panel">
          <b>What this page is designed to support</b>
          <ul>
            <li>Drivers without a bring-your-own-vehicle route</li>
            <li>CDL and Non-CDL paths</li>
            <li>Role-based requirement visibility</li>
            <li>Public intake before internal review</li>
          </ul>
        </div>
      </section>

      <section className="site-section" id="fit">
        <div className="section-head">
          <span>WHO THIS PATH IS FOR</span>
          <h2>A driver path built around the route, not around one assumption.</h2>
          <p>
            This page is aimed mainly at people entering as drivers without a self-provided vehicle.
            It should support CDL and Non-CDL paths, plus personal or business applicant context,
            without mixing driver intake into the owner-operator flow.
          </p>
        </div>
        <div className="service-grid">
          {fitCards.map((card) => (
            <article key={card.title} className="service-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <div className="owner-route-note">
          <b>If you are not fully sure whether your route is CDL or Non-CDL, you should still be able to start.</b>
          <p>The intake should clarify the route instead of forcing the applicant to already know every internal category.</p>
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
          <h2>A more organized public entry into the driver hiring path.</h2>
          <p>
            This route should feel clear, professional, and practical, while keeping internal decision-making
            and operational handling inside the controlled portal environment.
          </p>
        </div>
        <div className="service-grid">
          {whyCards.map((card) => (
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
          <h2>The route should request only what applies to the driver path.</h2>
          <p>
            Not every applicant should see the same checklist. The public flow should first identify
            the driver route, then reveal the documents and fields that match that path.
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
          <p>CDL-specific, business-linked, and compliance-specific fields should appear only when the selected path requires them.</p>
        </div>
      </section>

      <section className="site-section muted" id="process">
        <div className="section-head">
          <span>HOW THE PROCESS WORKS</span>
          <h2>A guided route from first questions to application review.</h2>
          <p>
            The process should feel understandable and finite without implying immediate approval,
            instant onboarding, or direct operational activation from the public site.
          </p>
        </div>
        <div className="process-grid owner-flow">
          {processSteps.map(([title, body], index) => (
            <article key={title} className="process-card">
              <b>{`0${index + 1}`}</b>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section owner-start">
        <div className="section-head">
          <span>BEFORE YOU START</span>
          <h2>The form should adapt to your profile instead of rejecting you too early.</h2>
          <p>
            If you are not yet sure whether your route is CDL or Non-CDL, or whether you should enter
            personally or through a business, you should still be able to continue and let the flow clarify the path.
          </p>
        </div>
      </section>

      <DriversPrequalificationForm />

      <section className="site-section muted" id="faq">
        <div className="section-head">
          <span>FAQ</span>
          <h2>Questions applicants often need answered before they begin.</h2>
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
          <h2>Start your driver application and we will guide you to the right path.</h2>
          <p>
            This page is a public recruiting entry point only. Internal review, status handling,
            and operational workflow remain separate inside the portal side of the project.
          </p>
          <div className="contact-actions">
            <a className="primary-cta compact" href="#start">Start application</a>
            <Link className="ghost-link large" href="/">Return to jonedtransport.com</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
