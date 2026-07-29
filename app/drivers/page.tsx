import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PublicFooter, PublicHeader } from "../public-shell";
import DriversPrequalificationForm from "./prequalification-form";

type Locale = "en" | "es";
type SearchParams = { lang?: string };

const copy: Record<Locale, any> = {
  en: {
    eyebrow: "Public intake",
    title: "Driver intake without the blog-style clutter.",
    intro:
      "This page keeps the driver route simple, shows only the pieces that support the real process, and keeps private operations in the protected portal.",
    summaryTitle: "What stays on this page",
    summaryBody: "Only the working public intake flow, with the extra buttons moved to a separate action page.",
    summaryCards: [
      ["Public intake", "CDL and Non-CDL applicants can begin here."],
      ["Protected scope", "Internal driver data and location details stay behind Entra ID."],
      ["Separate actions", "Buttons and shortcuts live on the action page, not here."],
    ],
    processTitle: "What actually happens",
    processCards: [
      ["1. Identify the route", "The intake resolves applicant type and license path."],
      ["2. Show the right fields", "Only the fields that match the selected route appear."],
      ["3. Send to review", "The public page stops at intake. Internal handling stays in the portal."],
    ],
    actionNote: "If you need the buttons, open the separate action page.",
    actionLink: "Open driver actions",
  },
  es: {
    eyebrow: "Ingreso público",
    title: "Ingreso de conductores sin el ruido tipo blog.",
    intro:
      "Esta página mantiene simple la ruta del conductor, muestra solo las piezas que apoyan el proceso real y deja las operaciones privadas en el portal protegido.",
    summaryTitle: "Qué se queda en esta página",
    summaryBody: "Solo el flujo público que funciona, con los botones extra movidos a una página separada.",
    summaryCards: [
      ["Ingreso público", "Aquí pueden comenzar solicitantes CDL y Non-CDL."],
      ["Alcance protegido", "Los datos internos del conductor y las ubicaciones quedan detrás de Entra ID."],
      ["Acciones separadas", "Los botones y accesos rápidos viven en la página aparte."],
    ],
    processTitle: "Lo que realmente ocurre",
    processCards: [
      ["1. Identificar la ruta", "El ingreso resuelve tipo de solicitante y camino de licencia."],
      ["2. Mostrar los campos correctos", "Solo aparecen los campos que corresponden a la ruta elegida."],
      ["3. Enviar a revisión", "La página pública termina en el ingreso. El manejo interno sigue en el portal."],
    ],
    actionNote: "Si necesitas los botones, abre la página separada de acciones.",
    actionLink: "Abrir acciones de driver",
  },
};

function isPortalHost(value: string | null): boolean {
  if (!value) return false;
  const host = value.split(":")[0]?.toLowerCase() ?? "";
  return host === "portal.jonedtransport.com";
}

function getLocale(searchParams?: SearchParams): Locale {
  return searchParams?.lang === "es" ? "es" : "en";
}

export default async function DriversPage({ searchParams }: { searchParams?: SearchParams }) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const locale = getLocale(searchParams);

  if (isPortalHost(host)) {
    redirect("/");
  }

  const localeToggleHref = locale === "es" ? "/drivers/" : "/drivers/es/";
  const text = copy[locale];

  return (
    <main className="joned-public joned-intake-page joned-intake-page--drivers">
      <PublicHeader locale={locale} localeToggleHref={localeToggleHref} showActions={false} />

      <section className="joned-intake-hero joned-intake-hero--drivers">
        <div className="joned-intake-hero-copy">
          <span className="joned-eyebrow">{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.intro}</p>
          <p className="joned-inline-note">
            <Link href={locale === "es" ? "/drivers/actions/es/" : "/drivers/actions/"} className="joned-text-link">
              {text.actionLink}
            </Link>
          </p>
        </div>

        <aside className="joned-intake-panel">
          <span className="joned-eyebrow">Scope</span>
          <div className="joned-intake-panel-head">
            <div>
              <strong>{text.summaryTitle}</strong>
              <p>{text.summaryBody}</p>
            </div>
          </div>
          <div className="joned-intake-matrix">
            {(text.summaryCards as [string, string][]).map(([label, body]) => (
              <span key={label}>
                <strong>{label}</strong>
                {body}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="joned-page-content">
        <div className="joned-page-grid three">
          {(text.processCards as [string, string][]).map(([title, body]) => (
            <article key={title} className="joned-page-card">
              <span>PROCESS</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>

        <div className="joned-intake-note">
          <strong>{text.processTitle}</strong>
          <p>{text.actionNote}</p>
        </div>
      </section>

      <DriversPrequalificationForm locale={locale} />

      <PublicFooter />
    </main>
  );
}
