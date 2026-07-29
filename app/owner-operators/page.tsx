import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PublicFooter, PublicHeader } from "../public-shell";
import OwnerOperatorPrequalificationForm from "./prequalification-form";

const routeCards = [
  {
    title: "Person or business",
    body: "The flow accepts individual and business entry without forcing one operating model on every applicant.",
  },
  {
    title: "With vehicle or without vehicle",
    body: "The route can narrow quickly once the applicant confirms whether a vehicle is part of the path.",
  },
  {
    title: "CDL and Non-CDL",
    body: "The form shows the right branch once the license path is clear, and keeps the rest out of view.",
  },
];

const requirementCards = [
  {
    title: "Profile",
    body: "Legal name, contact details, city, state, and preferred language to establish the applicant record.",
  },
  {
    title: "License",
    body: "License type, number, state, expiration date, and CDL details when those items apply.",
  },
  {
    title: "Vehicle and authority",
    body: "Vehicle and commercial authority fields only appear when the route calls for them.",
  },
  {
    title: "Insurance and tax",
    body: "COI, W-9, voided check, and similar items remain conditional rather than mandatory for every case.",
  },
];

const flowCards = [
  ["Identify the route", "Answer the first questions so the system can tell person, business, vehicle, and license apart."],
  ["Show only what applies", "The checklist opens up progressively instead of forcing one universal form."],
  ["Collect the intake", "Add the route-specific details and upload the items that actually belong to the selected path."],
  ["Send for review", "The public page ends at intake. Internal handling remains in the protected portal."],
];

const routeMatrix = [
  "P1 - person / vehicle / CDL",
  "P2 - person / vehicle / Non-CDL",
  "P3 - person / no vehicle / CDL",
  "P4 - person / no vehicle / Non-CDL",
  "B1 - business / vehicle / CDL",
  "B2 - business / vehicle / Non-CDL",
  "B3 - business / no vehicle / CDL",
  "B4 - business / no vehicle / Non-CDL",
];

const faqItems = [
  [
    "Do I need to be a company to start?",
    "No. The page supports both personal and business entry as long as the chosen route fits the applicant.",
  ],
  [
    "Will every applicant see the same checklist?",
    "No. Vehicle, authority, insurance, and payment items appear only when the route needs them.",
  ],
  [
    "Can I start if I am unsure about the route?",
    "Yes. The intake supports a not-sure starting point and helps narrow the path during the first steps.",
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
    <main className="joned-public joned-intake-page joned-intake-page--owner">
      <PublicHeader />

      <section className="joned-intake-hero joned-intake-hero--owner">
        <div className="joned-intake-hero-copy">
          <span className="joned-eyebrow">Public intake</span>
          <h1>Owner-operator applications presented like a real product, not a long article.</h1>
          <p>
            This page is for owner operators and similar contractor-style applicants. It keeps the public route
            clean, guides the user through route selection, and keeps the portal-only data behind Entra ID.
          </p>
          <div className="joned-button-row">
            <a href="#start" className="joned-yellow-btn">Start application</a>
            <a href="#requirements" className="joned-outline-btn">Review checklist</a>
          </div>
          <div className="joned-trust-inline">
            <span><strong>Person or business</strong>Both entry types are supported</span>
            <span><strong>With / without vehicle</strong>The flow narrows fast</span>
            <span><strong>Public scope</strong>No private driver or location data</span>
          </div>
        </div>

        <aside className="joned-intake-panel">
          <span className="joned-eyebrow">Route matrix</span>
          <div className="joned-intake-panel-head">
            <div>
              <strong>Owner-operator route map</strong>
              <p>Eight route codes, one public entry point.</p>
            </div>
            <span className="joned-intake-badge">Bilingual ready</span>
          </div>
          <div className="joned-intake-matrix">
            {routeMatrix.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div className="joned-intake-panel-note">
            <strong>The structure stays consistent across the public site.</strong>
            <p>The same navy, white, and yellow system is used here so the page feels native to the rest of JONED.</p>
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
            The form first resolves the route and then displays the fields, uploads, and conditional questions
            that belong to that exact path.
          </p>
        </div>

        <div className="joned-page-grid three">
          {requirementCards.map((card) => (
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
            <h2>Four steps that keep the route clear from start to review.</h2>
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
          <strong>Protected scope</strong>
          <p>
            Public intake stops before operational dispatch, private tracking, or internal portal information.
            Those details stay behind Entra ID by role.
          </p>
        </div>
      </section>

      <OwnerOperatorPrequalificationForm />

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
            <h2>The form below keeps the application structured while the private portal remains separate.</h2>
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
