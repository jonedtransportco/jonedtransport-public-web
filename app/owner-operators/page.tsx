import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PublicFooter, PublicHeader } from "../public-shell";
import OwnerOperatorPrequalificationForm from "./prequalification-form";

type Locale = "en" | "es";
type SearchParams = { lang?: string };

const copy: Record<Locale, any> = {
  en: {
    eyebrow: "Public intake",
    title: "Owner-operator intake without the extra noise.",
    intro:
      "This page keeps the public route clear, shows only the working parts of the process, and keeps private operations in the protected portal.",
    summaryTitle: "What stays on this page",
    summaryBody: "Only the real public intake flow, with no technical explainer blocks, route matrices, or blog-style filler.",
    summaryCards: [
      ["Public intake", "Business or person applicants can start here."],
      ["Protected scope", "Private drivers, locations, and internal review stay behind Entra ID."],
      ["Separate actions", "Buttons and shortcuts live on the action page, not in the main flow."],
    ],
    processTitle: "What actually happens",
    processCards: [
      ["1. Identify the route", "The intake resolves person or business, with or without vehicle, and the license path."],
      ["2. Show the right fields", "Only the fields that belong to the selected path are revealed."],
      ["3. Send to review", "The public page stops at intake. Internal handling stays in the portal."],
    ],
    actionNote: "If you need the buttons, open the separate action page.",
    actionLink: "Open owner-operator actions",
  },
  es: {
    eyebrow: "Ingreso público",
    title: "Ingreso de owner-operator sin ruido extra.",
    intro:
      "Esta página mantiene clara la ruta pública, muestra solo las partes que funcionan del proceso y deja las operaciones privadas en el portal protegido.",
    summaryTitle: "Qué se queda en esta página",
    summaryBody: "Solo el flujo real de ingreso público, sin bloques técnicos, matrices de rutas ni relleno tipo blog.",
    summaryCards: [
      ["Ingreso público", "Aquí pueden comenzar solicitantes como persona o empresa."],
      ["Alcance protegido", "Conductores privados, ubicaciones y revisión interna quedan detrás de Entra ID."],
      ["Acciones separadas", "Los botones y accesos rápidos viven en la página aparte."],
    ],
    processTitle: "Lo que realmente ocurre",
    processCards: [
      ["1. Identificar la ruta", "El ingreso resuelve persona o empresa, con vehículo o sin vehículo, y la licencia."],
      ["2. Mostrar los campos correctos", "Solo se revelan los campos que pertenecen a la ruta elegida."],
      ["3. Enviar a revisión", "La página pública termina en el ingreso. El manejo interno sigue en el portal."],
    ],
    actionNote: "Si necesitas los botones, abre la página separada de acciones.",
    actionLink: "Abrir acciones de owner-operator",
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

export default async function OwnerOperatorsPage({ searchParams }: { searchParams?: SearchParams }) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const locale = getLocale(searchParams);

  if (isPortalHost(host)) {
    redirect("/");
  }

  const localeToggleHref = locale === "es" ? "/owner-operators/" : "/owner-operators/es/";
  const text = copy[locale];

  return (
    <main className="joned-public joned-intake-page joned-intake-page--owner">
      <PublicHeader locale={locale} localeToggleHref={localeToggleHref} showActions={false} />

      <section className="joned-intake-hero joned-intake-hero--owner">
        <div className="joned-intake-hero-copy">
          <span className="joned-eyebrow">{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.intro}</p>
          <p className="joned-inline-note">
            <Link href={locale === "es" ? "/owner-operators/actions/es/" : "/owner-operators/actions/"} className="joned-text-link">
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

      <OwnerOperatorPrequalificationForm locale={locale} />

      <PublicFooter />
    </main>
  );
}
