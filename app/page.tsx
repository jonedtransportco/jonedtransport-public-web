import Link from "next/link";
import { headers } from "next/headers";
import PortalPage from "./portal/page";

const services = [
  {
    title: "Ground transportation",
    body: "Regional and cross-border coordination with controlled visibility and enterprise support.",
  },
  {
    title: "Dispatch support",
    body: "Operational coordination designed to keep timing, exceptions, and customer communication aligned.",
  },
  {
    title: "Protected tracking",
    body: "Public access stays limited to high-level status while operational detail remains role-protected.",
  },
  {
    title: "Carrier recruiting",
    body: "Public recruiting paths for owner operators and drivers without exposing the private operating portal.",
  },
];

const trustItems = [
  ["Security", "Your freight stays protected."],
  ["On-time focus", "Shipments are coordinated against committed windows."],
  ["Coverage", "Mexico, the United States, and Canada."],
  ["24/7 support", "Guided escalation and responsive service."],
];

const recruitingPaths = [
  {
    title: "Owner operators",
    body: "A structured intake for people or companies, with or without a vehicle, based on the route that actually applies.",
    href: "/owner-operators",
  },
  {
    title: "Drivers",
    body: "A separate public path for CDL and non-CDL applicants, kept outside the operational workspace.",
    href: "/drivers",
  },
];

function isPortalHost(value: string | null): boolean {
  if (!value) return false;
  const host = value.split(":")[0]?.toLowerCase() ?? "";
  return host === "portal.jonedtransport.com";
}

export default async function Home() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (isPortalHost(host)) {
    return <PortalPage />;
  }

  return (
    <main className="joned-public">
      <header className="joned-public-nav">
        <Link href="/" className="joned-lockup" aria-label="Joned Transpor Co home">
          <span className="brand-mark">J</span>
          <span>
            <strong>JONED</strong>
            <small>TRANSPOR CO</small>
          </span>
        </Link>
        <nav className="joned-public-links" aria-label="Primary">
          <a href="#">Home</a>
          <a href="#services">Services</a>
          <a href="#coverage">Coverage</a>
          <a href="#about">About</a>
          <a href="#recruiting">Resources</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="joned-public-actions">
          <Link href="/portal" className="joned-secondary-btn">
            Sign in
          </Link>
          <a href="#quotation" className="joned-yellow-btn">
            Request quote
          </a>
        </div>
      </header>

      <section className="joned-hero">
        <div className="joned-hero-copy">
          <span className="joned-eyebrow">Transport and logistics</span>
          <h1>
            We move your freight and help grow <em>your business.</em>
          </h1>
          <p>
            Reliable, secure, and efficient ground transportation solutions across
            Mexico, the United States, and Canada.
          </p>
          <div className="joned-button-row">
            <a href="#quotation" className="joned-yellow-btn">
              Request quote
            </a>
            <a href="#tracking" className="joned-hero-outline-btn">
              Track shipment
            </a>
          </div>
        </div>
        <div className="joned-hero-photo-space" aria-hidden="true" />
        <aside className="joned-hero-login" aria-label="JONED Enterprise Platform sign in">
          <div className="joned-hero-login-card">
            <div className="joned-login-brand">
              <span className="brand-mark">J</span>
              <span>
                <strong>JONED</strong>
                <small>ENTERPRISE PLATFORM</small>
              </span>
            </div>
            <span className="joned-eyebrow">Protected access</span>
            <h2>Sign in</h2>
            <p>Access your workspace and continue securely with Microsoft.</p>
            <Link className="joned-entra-button" href="/portal">
              <span className="joned-ms-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              Continue with Microsoft
            </Link>
            <span className="joned-login-divider">or use your work email</span>
            <input aria-label="Work email" placeholder="Work email" type="email" />
            <button className="joned-login-submit" type="button">Continue</button>
            <small className="joned-login-note">Private portal access is role-based and protected.</small>
          </div>
        </aside>
      </section>

      <section className="joned-trust-strip" id="coverage" aria-label="Service commitments">
        {trustItems.map(([title, body]) => (
          <article key={title}>
            <span className="joned-trust-icon" aria-hidden="true">
              ✓
            </span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="joned-section" id="services">
        <div className="joned-section-head">
          <span className="joned-eyebrow">Services</span>
          <h2>Enterprise capacity for every move.</h2>
          <p>
            The public website routes each visitor toward services, quoting, protected
            tracking, recruiting, or controlled portal access.
          </p>
        </div>
        <div className="joned-grid four">
          {services.map((service) => (
            <article key={service.title} className="joned-card service">
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="joned-section alt" id="tracking">
        <div className="joned-section-head">
          <span className="joned-eyebrow">Tracking</span>
          <h2>Public status without exposing operations.</h2>
          <p>
            A valid reference can return high-level shipment status. Driver identity,
            exact location, detailed routing, and evidence remain protected behind
            Microsoft Entra ID.
          </p>
        </div>
        <div className="joned-grid tracking">
          <article className="joned-card tracking-card">
            <div className="joned-search-shell">
              <input defaultValue="JNE-24891" aria-label="Tracking number" />
              <button className="joned-primary-btn" type="button">
                Check status
              </button>
            </div>
            <div className="joned-grid two compact">
              <div className="joned-card soft">
                <span className="joned-status transit">In transit</span>
                <h3>Shipment JNE-24891</h3>
                <p>Estimated delivery remains inside the confirmed customer window.</p>
              </div>
              <div className="joned-card soft">
                <strong>Protected summary</strong>
                <p>Operational detail requires an authorized account and role.</p>
              </div>
            </div>
          </article>
          <article className="joned-card joned-privacy-card">
            <span className="joned-privacy-icon" aria-hidden="true">
              ✓
            </span>
            <h3>Privacy by design</h3>
            <p>
              The public site does not expose driver names, GPS position, stops,
              speed, or detailed route intelligence. That information is available
              only inside the authenticated portal and only within assigned scope.
            </p>
            <Link className="joned-outline-btn" href="/portal">
              Access with Microsoft Entra ID
            </Link>
          </article>
        </div>
      </section>

      <section className="joned-product-preview" aria-label="JONED platform preview">
        <div className="joned-product-preview-copy">
          <span className="joned-eyebrow">JONED Enterprise Platform</span>
          <h2>One operating view for every move.</h2>
          <p>
            Customers track shipments, drivers complete their routes, and operations
            teams work from the same role-protected workspace.
          </p>
          <Link href="/portal" className="joned-outline-btn">Open the private portal</Link>
        </div>
        <div className="joned-product-preview-window" aria-hidden="true">
          <div className="joned-preview-sidebar">
            <strong>JONED</strong>
            <span>Dashboard</span>
            <span>Operations</span>
            <span>Shipments</span>
            <span>Routes</span>
            <span>Reports</span>
          </div>
          <div className="joned-preview-main">
            <div className="joned-preview-topline"><span>Operations center</span><i /></div>
            <div className="joned-preview-metrics">
              <span><small>Active loads</small><strong>84</strong></span>
              <span><small>On time</small><strong>98.7%</strong></span>
              <span><small>At risk</small><strong>7</strong></span>
            </div>
            <div className="joned-preview-content">
              <div className="joned-preview-table"><b>Active shipments</b><span>JNE-24891 <i>In transit</i></span><span>JNE-24887 <i>On time</i></span><span>JNE-24882 <i>Review</i></span></div>
              <div className="joned-preview-map"><em /><em /><em /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="joned-section" id="quotation">
        <div className="joned-section-head">
          <span className="joned-eyebrow">Quoting</span>
          <h2>A structured request that is easy to review.</h2>
          <p>
            The future quote flow can collect route, freight, service, and contact
            basics without opening access to private portal information.
          </p>
        </div>
        <form className="joned-form-card">
          <div className="joned-grid two form">
            <label>
              <span>Origin</span>
              <input type="text" placeholder="City, state, or ZIP code" />
            </label>
            <label>
              <span>Destination</span>
              <input type="text" placeholder="City, state, or ZIP code" />
            </label>
            <label>
              <span>Pickup date</span>
              <input type="date" defaultValue="2026-07-30" />
            </label>
            <label>
              <span>Service type</span>
              <select defaultValue="scheduled">
                <option value="scheduled">Scheduled</option>
                <option value="dedicated">Dedicated</option>
                <option value="last-mile">Last mile</option>
              </select>
            </label>
            <label>
              <span>Estimated weight</span>
              <input type="text" placeholder="Example: 12,500 lb" />
            </label>
            <label>
              <span>Company</span>
              <input type="text" placeholder="Company name" />
            </label>
            <label className="full">
              <span>Shipment notes</span>
              <textarea
                rows={4}
                placeholder="Special handling, site access, appointment windows..."
              />
            </label>
          </div>
          <div className="joned-form-actions">
            <button type="button" className="joned-primary-btn">
              Continue to review
            </button>
          </div>
        </form>
      </section>

      <section className="joned-section alt" id="recruiting">
        <div className="joned-section-head">
          <span className="joned-eyebrow">Resources</span>
          <h2>Public recruiting. Private operations.</h2>
          <p>
            Applicants start on the public website and follow the correct path without
            entering client, dispatch, or administration areas.
          </p>
        </div>
        <div className="joned-grid two">
          {recruitingPaths.map((path) => (
            <article key={path.title} className="joned-card recruiting">
              <h3>{path.title}</h3>
              <p>{path.body}</p>
              <Link href={path.href} className="joned-outline-btn">
                Open application path
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="joned-section" id="about">
        <div className="joned-section-head">
          <span className="joned-eyebrow">About</span>
          <h2>Built for controlled growth and enterprise trust.</h2>
          <p>
            Joned Transpor Co is shaping a logistics experience that separates public access,
            operational control, recruiting intake, and authenticated role-based
            collaboration.
          </p>
        </div>
        <div className="joned-grid two">
          <article className="joned-card">
            <h3>Public website</h3>
            <p>
              Corporate presentation, service positioning, public recruiting, future
              quoting, and protected tracking entry points.
            </p>
          </article>
          <article className="joned-card">
            <h3>Private portal</h3>
            <p>
              Client, driver, operations, executive, and admin workspaces gated by
              Microsoft Entra ID and role assignment.
            </p>
          </article>
        </div>
      </section>

      <section className="joned-section alt" id="contact">
        <div className="joned-section-head">
          <span className="joned-eyebrow">Contact</span>
          <h2>Start the conversation from the right entry point.</h2>
          <p>
            Public communication stays separate from protected operational workflows.
            Use quoting, recruiting, or authorized portal access according to need.
          </p>
        </div>
        <div className="joned-button-row">
          <a
            href="mailto:commercialmanager@jonedtransport.com?subject=JONED%20transport%20request"
            className="joned-yellow-btn"
          >
            Contact Joned Transpor Co
          </a>
          <Link href="/portal" className="joned-secondary-btn">
            Portal sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
