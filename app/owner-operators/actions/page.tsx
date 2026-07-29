import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PublicFooter, PublicHeader } from "../../public-shell";

type Locale = "en" | "es";
type SearchParams = { lang?: string };

const copy: Record<Locale, any> = {
  en: {
    eyebrow: "Actions",
    title: "Owner-operator actions live here.",
    intro: "This page keeps the buttons out of the main article-style page and groups the useful shortcuts in one place.",
    cards: [
      ["Start intake", "Open the public owner-operator flow."],
      ["Switch language", "Move between English and Español."],
      ["Open portal", "Go to the protected Entra ID workspace."],
    ],
    primary: "Start owner-operator intake",
    secondary: "Open public owner page",
    portal: "Open protected portal",
  },
  es: {
    eyebrow: "Acciones",
    title: "Las acciones de owner-operator viven aquí.",
    intro: "Esta página deja los botones fuera de la página principal y agrupa los accesos útiles en un solo lugar.",
    cards: [
      ["Iniciar ingreso", "Abrir el flujo público de owner-operator."],
      ["Cambiar idioma", "Pasar entre English y Español."],
      ["Abrir portal", "Ir al espacio protegido con Entra ID."],
    ],
    primary: "Iniciar ingreso de owner-operator",
    secondary: "Abrir página pública",
    portal: "Abrir portal protegido",
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

export default async function OwnerOperatorActionsPage({ searchParams }: { searchParams?: SearchParams }) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const locale = getLocale(searchParams);

  if (isPortalHost(host)) {
    redirect("/");
  }

  const text = copy[locale];
  const localeToggleHref = locale === "es" ? "/owner-operators/actions/" : "/owner-operators/actions/es/";
  const publicHref = locale === "es" ? "/owner-operators/es/" : "/owner-operators/";
  const publicLangHref = locale === "es" ? "/owner-operators/" : "/owner-operators/es/";

  return (
    <main className="joned-public joned-intake-page">
      <PublicHeader locale={locale} localeToggleHref={localeToggleHref} />
      <section className="joned-page-hero">
        <span className="joned-eyebrow">{text.eyebrow}</span>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>
      </section>
      <section className="joned-page-content">
        <div className="joned-page-grid three">
          {(text.cards as [string, string][]).map(([title, body]) => (
            <article key={title} className="joned-page-card">
              <span>ACTION</span>
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="joned-button-row joned-action-row">
          <Link href={publicHref} className="joned-yellow-btn">
            {text.primary}
          </Link>
          <Link href={publicLangHref} className="joned-secondary-btn">
            {text.secondary}
          </Link>
          <a href="https://portal.jonedtransport.com/" className="joned-secondary-btn">
            {text.portal}
          </a>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
