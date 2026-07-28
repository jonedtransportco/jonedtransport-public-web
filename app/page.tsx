import Link from "next/link";
import { headers } from "next/headers";
import PortalPage from "./portal/page";

const services = [
  {
    title: "Transporte regional",
    body: "Operación coordinada para mover carga con seguimiento, claridad y continuidad.",
  },
  {
    title: "Soporte logístico",
    body: "Visibilidad operativa para mantener prioridades, tiempos y comunicación bajo control.",
  },
  {
    title: "Control documental",
    body: "Procesos más ordenados para respaldar cumplimiento y respuesta en la operación.",
  },
  {
    title: "Atención a conductores y contratistas",
    body: "Un punto de entrada más claro para perfiles que trabajan con JONED en campo.",
  },
];

const processSteps = [
  ["Recibimos la necesidad", "Entendemos el contexto operativo y el tipo de servicio o perfil."],
  ["Definimos la ruta", "Alineamos personas, operación y requisitos según cada caso."],
  ["Damos seguimiento", "Mantenemos visibilidad y respuesta en los puntos críticos."],
  ["Cerramos con continuidad", "La información queda ordenada para la siguiente decisión."],
];

const ownerOperatorHighlights = [
  "Aplicación como persona o como empresa",
  "Rutas con vehículo y sin vehículo",
  "Perfiles CDL y Non-CDL",
  "Checklist dinámico según tu caso",
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
    <main className="public-site">
      <header className="site-header">
        <Link href="/" className="brand brand-dark">
          <span className="brand-mark">J</span>
          <div>
            <b>JONED</b>
            <small>TRANSPORT CO.</small>
          </div>
        </Link>
        <nav className="site-nav" aria-label="Principal">
          <a href="#services">Servicios</a>
          <a href="#coverage">Cobertura</a>
          <a href="#operators">Owner Operators</a>
          <a href="#contact">Contacto</a>
        </nav>
        <div className="site-actions">
          <Link href="/owner-operators" className="ghost-link">Owner Operators</Link>
          <Link href="/portal" className="nav-login dark">Acceso al portal</Link>
        </div>
      </header>

      <section className="site-hero">
        <div className="site-hero-copy">
          <span className="kicker dark"><i /> Transporte y logística con estructura</span>
          <h1>Operación confiable para mover carga, personas y decisiones.</h1>
          <p>
            JONED Transport Co. conecta ejecución, seguimiento y claridad operativa para sostener
            servicio con más control, mejor coordinación y una experiencia profesional para clientes,
            conductores y contratistas.
          </p>
          <div className="hero-actions">
            <Link href="/owner-operators" className="primary-cta">
              Start application
            </Link>
            <Link href="/portal" className="ghost-link large">Acceso al portal</Link>
          </div>
          <div className="trust-row dark">
            <span>Proceso estructurado</span>
            <span>Visibilidad operativa</span>
            <span>Entrada clara para contratistas y drivers</span>
          </div>
        </div>
        <div className="site-hero-card">
          <div className="site-stack-card">
            <span>JONED PUBLIC SITE</span>
            <b>Una entrada pública para marca, reclutamiento y contacto.</b>
            <p>El portal operativo queda separado para uso interno y controlado.</p>
          </div>
          <div className="site-stack-grid">
            <article>
              <strong>Servicios</strong>
              <small>Operación y soporte</small>
            </article>
            <article>
              <strong>Owner Operators</strong>
              <small>Aplicación guiada</small>
            </article>
            <article>
              <strong>Drivers</strong>
              <small>Ruta siguiente</small>
            </article>
            <article>
              <strong>Portal</strong>
              <small>Acceso controlado</small>
            </article>
          </div>
        </div>
      </section>

      <section className="site-section" id="services">
        <div className="section-head">
          <span>SERVICIOS</span>
          <h2>Una web pública para explicar la operación sin mezclarla con el portal.</h2>
          <p>El sitio principal presenta la compañía, la cobertura y las rutas de entrada correctas para cada perfil.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article key={service.title} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section muted" id="coverage">
        <div className="section-head">
          <span>CÓMO TRABAJAMOS</span>
          <h2>La operación se explica mejor cuando el proceso es visible.</h2>
        </div>
        <div className="process-grid">
          {processSteps.map(([title, body], index) => (
            <article key={title} className="process-card">
              <b>0{index + 1}</b>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section owner-section" id="operators">
        <div className="section-head">
          <span>OWNER OPERATORS</span>
          <h2>Una ruta pública más clara para perfiles que trabajan con JONED.</h2>
          <p>
            La aplicación ya no parte de un PDF universal. Primero identifica si aplicas como persona
            o empresa, con vehículo o sin vehículo, y bajo ruta CDL o Non-CDL.
          </p>
        </div>
        <div className="owner-grid">
          <article className="owner-card lead">
            <b>Qué cambia</b>
            <p>
              En vez de empujar a todos por el mismo checklist, la web prepara una ruta guiada que
              muestra solo los requisitos que aplican al perfil real del solicitante.
            </p>
            <Link href="/owner-operators" className="primary-cta compact">Ver página Owner Operators</Link>
          </article>
          <article className="owner-card">
            <b>La experiencia pública debe soportar</b>
            <ul>
              {ownerOperatorHighlights.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="site-section contact-section" id="contact">
        <div className="section-head">
          <span>CONTACTO</span>
          <h2>Una web pública para presentar la compañía. Un portal separado para operar.</h2>
          <p>
            `jonedtransport.com` queda como entrada principal de marca y reclutamiento. `portal.jonedtransport.com`
            queda reservado para acceso controlado y trabajo interno.
          </p>
        </div>
        <div className="contact-actions">
          <a className="ghost-link large" href="mailto:commercialmanager@jonedtransport.com">Solicitar información</a>
          <Link className="nav-login dark" href="/portal">Acceso al portal</Link>
        </div>
      </section>
    </main>
  );
}
