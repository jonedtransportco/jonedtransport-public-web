import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PublicFooter, PublicHeader } from "../public-shell";
import DriversPrequalificationForm from "./prequalification-form";

const routeCards = [
  {
    title: "Driver-first intake",
    body: "Built for applicants who are entering through the driver route and need a clear public starting point.",
  },
  {
    title: "CDL and Non-CDL",
    body: "The route can adapt to either license path without forcing the applicant to guess the wrong branch.",
  },
  {
    title: "Personal or business",
    body: "Applicants can begin as an individual or through a business when that is the correct route for them.",
  },
];

const checklistCards = [
  {
    title: "Identity",
    body: "Legal name, contact details, city, state, and preferred language.",
  },
  {
    title: "License",
    body: "License number, issuing state, expiration date, and CDL or Non-CDL details when applicable.",
  },
  {
    title: "Readiness",
    body: "Experience summary, availability, manual transmission comfort, and training review flags.",
  },
  {
    title: "Conditional items",
    body: "Medical card, business name, and other fields appear only when the chosen route needs them.",
  },
];

const flowCards = [
  ["Choose your route", "Select personal or business and CDL or Non-CDL so the intake can narrow the path."],
  ["Enter core details", "Provide the basic information needed to identify the applicant and contact path."],
  ["Review the checklist", "The form reveals only the documents and questions that match the selected route."],
  ["Submit for review", "The public page collects the intake. Internal review stays inside the controlled portal."],
];

const faqItems = [
  [
    "Does this page show internal driver locations?",
    "No. The public route stays high level and does not expose private operational locations.",
  ],
  [
    "Can I start if I am not sure whether I am CDL or Non-CDL?",
    "Yes. The intake supports a not-sure starting point and then narrows the route.",
  ],
  [
    "Can I apply as a person or as a business?",
    "Yes. Both entry types are supported when they fit the driver path.",
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
    <main className="joned-public joned-intake-page">
      <PublicHeader />

      <section className="joned-intake-hero joned-intake-hero--drivers">
        <div className="joned-intake-hero-copy">
          <span className="joned-eyebrow">Public intake</span>
          <h1>Driver applications with the same enterprise visual language as the rest of JONED.</h1>
          <p>
            This page is for driver applicants. It keeps the route public, guides the user through a short
            prequalification flow, and leaves internal review inside the protected portal.
          </p>
          <div className="joned-button-row">
            <a href="#start" className="joned-yellow-btn">Start prequalification</a>
            <a href="#requirements" className="joned-outline-btn">View requirements</a>
          </div>
          <div className="joned-trust-inline">
            <span><strong>CDL / Non-CDL</strong>Route is narrowed after first questions</span>
            <span><strong>Personal / business</strong>Both entry types are supported</span>
            <span><strong>Private data</strong>No internal locations or driver rosters</span>
          </div>
        </div>

        <aside className="joned-intake-panel">
          <span className="joned-eyebrow">Route snapshot</span>
          <div className="joned-intake-panel-head">
            <div>
              <strong>Driver prequalification</strong>
              <p>Public entry before internal review.</p>
            </div>
            <span className="joned-intake-badge">English / Español</span>
          </div>
          <div className="joned-intake-panel-grid">
            <article>
              <small>Who can start</small>
              <b>Drivers entering as people or businesses</b>
            </article>
            <article>
              <small>Route split</small>
              <b>CDL, Non-CDL, and not sure yet</b>
            </article>
            <article>
              <small>Public scope</small>
              <b>Eligibility and contact only</b>
            </article>
            <article>
              <small>Internal scope</small>
              <b>Remains inside the protected portal</b>
            </article>
          </div>
          <div className="joned-intake-panel-note">
            <strong>Designed to feel like a product, not a blog post.</strong>
            <p>The route uses clear cards, short blocks, and a strong visual hierarchy so applicants can scan it quickly.</p>
          </div>
        </aside>
      </section>

      <section className="joned-page-content">
        <div className="joned-page-grid three">
          {routeCards.map((card) => (
            <article key={card.title} className="joned-page-card">
              <span>ROUTE FIT</span>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <div className="joned-intake-note" id="requirements">
          <strong>What the public route collects</strong>
          <p>
            The intake starts with route identification, then reveals the fields and conditional questions
            that actually apply to the selected driver path.
          </p>
        </div>

        <div className="joned-page-grid three">
          {checklistCards.map((card) => (
            <article key={card.title} className="joned-page-card">
              <span>CHECKLIST</span>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>

        <section className="joned-intake-band">
          <div className="joned-intake-band-copy">
            <span className="joned-eyebrow">How it works</span>
            <h2>Four short steps from first answer to review-ready intake.</h2>
          </div>
          <div className="joned-page-grid four">
            {flowCards.map(([title, body], index) => (
              <article key={title} className="joned-page-card joned-page-card--compact">
                <span>{`0${index + 1}`}</span>
                <h2>{title}</h2>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="joned-intake-note joned-intake-note--dark">
          <strong>Public scope only</strong>
          <p>
            The page stays focused on prequalification. Access-controlled location data, driver operations,
            and other internal details remain behind Entra ID.
          </p>
        </div>
      </section>

      <DriversPrequalificationForm />

      <section className="joned-page-content">
        <div className="joned-page-grid three">
          {faqItems.map(([question, answer]) => (
            <article key={question} className="joned-page-card">
              <span>FAQ</span>
              <h2>{question}</h2>
              <p>{answer}</p>
            </article>
          ))}
        </div>

        <div className="joned-intake-band joned-intake-band--cta">
          <div className="joned-intake-band-copy">
            <span className="joned-eyebrow">Next step</span>
            <h2>If you are ready, the form below will guide the route without exposing the private portal.</h2>
          </div>
          <div className="joned-button-row">
            <Link href="/portal" className="joned-secondary-btn">Portal access</Link>
            <a href="#start" className="joned-yellow-btn">Begin intake</a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
