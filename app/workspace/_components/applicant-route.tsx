"use client";

import { useMemo, useState } from "react";

type Language = "en" | "es";
type Role = "owner" | "driver";
type Screen = "case" | "documents" | "tracking";

type CaseModel = {
  caseId: string;
  applicantName: string;
  routeCode: string;
  currentState: string;
  progress: string;
  nextAction: string;
  reviewer: string;
  lastUpdate: string;
  missingCount: number;
  summary: string;
  checklist: Array<{ label: string; status: "complete" | "current" | "pending" }>;
  timeline: Array<{ title: string; detail: string; state?: "muted" }>;
  documents: Array<{ label: string; note: string; file: string; status: string }>;
};

const copy = {
  en: {
    brand: "Private workspace",
    user: "Authenticated user",
    case: "Application start",
    documents: "Document upload",
    tracking: "Private tracking",
    status: "In progress",
    summary: "Case summary",
    route: "Assigned route",
    next: "Next action",
    progress: "Overall progress",
    links: "Quick links",
    viewDocs: "Go to documents",
    viewTracking: "View tracking",
    upload: "Upload required document",
    checklist: "Document checklist",
    uploadTitle: "Upload document",
    drop: "Drag and drop files here",
    choose: "Choose files",
    uploaded: "Uploaded documents",
    complete: "completed",
    missing: "Missing",
    current: "Current state",
    reviewer: "Reviewer",
    update: "Last update",
    timeline: "Application timeline",
    contact: "Contact support",
    secure: "Secure, private, trusted.",
    ownerFields: "Company · Equipment · COI · Authority · W-9",
    driverFields: "License · Medical · Experience · Readiness",
    roleOwner: "Owner operator",
    roleDriver: "Driver",
    roleCase: "Private expediente",
    roleDocs: "Private documents",
    roleTrack: "Private tracking",
    caseLabel: "Case ID",
    caseState: "Review-only case",
  },
  es: {
    brand: "Workspace privado",
    user: "Usuario autenticado",
    case: "Inicio del expediente",
    documents: "Carga documental",
    tracking: "Seguimiento privado",
    status: "En progreso",
    summary: "Resumen del caso",
    route: "Ruta asignada",
    next: "Próxima acción",
    progress: "Progreso general",
    links: "Accesos rápidos",
    viewDocs: "Ir a documentos",
    viewTracking: "Ver seguimiento",
    upload: "Cargar documento requerido",
    checklist: "Lista documental",
    uploadTitle: "Cargar documento",
    drop: "Arrastra y suelta los archivos aquí",
    choose: "Elegir archivos",
    uploaded: "Documentos cargados",
    complete: "completados",
    missing: "Faltantes",
    current: "Estado actual",
    reviewer: "Revisor",
    update: "Última actualización",
    timeline: "Línea de tiempo",
    contact: "Contactar soporte",
    secure: "Seguro, privado y confiable.",
    ownerFields: "Empresa · Equipo · COI · Autoridad · W-9",
    driverFields: "Licencia · Médico · Experiencia · Preparación",
    roleOwner: "Owner operator",
    roleDriver: "Conductor",
    roleCase: "Expediente privado",
    roleDocs: "Documentos privados",
    roleTrack: "Seguimiento privado",
    caseLabel: "Caso",
    caseState: "Caso de revisión",
  },
} as const;

const caseModel: Record<Role, CaseModel> = {
  owner: {
    caseId: "OO-CASE-001",
    applicantName: "Owner applicant",
    routeCode: "P1",
    currentState: "Under review",
    progress: "68%",
    nextAction: "Waiting for Operations to confirm company details and documents.",
    reviewer: "Operations review",
    lastUpdate: "Jul 31, 2026 · 11:28 AM",
    missingCount: 1,
    summary: "Owner-operator expediente linked to the company review path.",
    checklist: [
      { label: "Identity and contact", status: "complete" },
      { label: "CDL and medical card", status: "complete" },
      { label: "COI and authority", status: "current" },
      { label: "Vehicle registration", status: "pending" },
      { label: "W-9 and final review", status: "pending" },
    ],
    timeline: [
      { title: "Case created", detail: "Route P1 submitted into controlled review." },
      { title: "Documents received", detail: "Identity and required documents validated." },
      { title: "Operations review", detail: "Company documents are being checked.", state: "muted" },
    ],
    documents: [
      { label: "Company profile", note: "Verified", file: "company-profile.pdf", status: "Complete" },
      { label: "Medical card", note: "Required for all license paths", file: "medical-card.pdf", status: "Complete" },
      { label: "COI", note: "Certificate holder verified", file: "coi.pdf", status: "In review" },
      { label: "Authority document", note: "Needed for business review", file: "authority.pdf", status: "Pending" },
      { label: "W-9", note: "Awaiting upload", file: "w9.pdf", status: "Pending" },
    ],
  },
  driver: {
    caseId: "DR-CASE-014",
    applicantName: "Driver applicant",
    routeCode: "P4",
    currentState: "Documents pending",
    progress: "54%",
    nextAction: "Upload the remaining license documents to continue.",
    reviewer: "Operations review",
    lastUpdate: "Jul 31, 2026 · 10:42 AM",
    missingCount: 2,
    summary: "Driver expediente linked to the private review path.",
    checklist: [
      { label: "Identity and contact", status: "complete" },
      { label: "License type", status: "complete" },
      { label: "Medical card", status: "current" },
      { label: "Experience record", status: "pending" },
      { label: "Readiness review", status: "pending" },
    ],
    timeline: [
      { title: "Case created", detail: "Route P4 submitted into private review." },
      { title: "License confirmed", detail: "Non-CDL path accepted for review." },
      { title: "Awaiting medical card", detail: "One required item is still missing.", state: "muted" },
    ],
    documents: [
      { label: "Driver license", note: "Verified", file: "license.pdf", status: "Complete" },
      { label: "Medical card", note: "Required for all license paths", file: "medical-card.pdf", status: "Missing" },
      { label: "Experience record", note: "Under review", file: "experience.pdf", status: "In review" },
      { label: "Readiness acknowledgment", note: "Pending completion", file: "readiness.pdf", status: "Pending" },
    ],
  },
};

export default function ApplicantRoute({ screen }: { screen: Screen }) {
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<Role>("owner");
  const t = copy[language];
  const data = useMemo(() => caseModel[role], [role]);
  const roleLabel = role === "owner" ? t.roleOwner : t.roleDriver;
  const title = screen === "case" ? t.case : screen === "documents" ? t.documents : t.tracking;
  const caseDescription = role === "owner" ? t.ownerFields : t.driverFields;

  return (
    <main className="joned-applicant-shell">
      <header className="joned-applicant-topbar">
        <a href="/workspace" className="joned-applicant-brand">
          <img src="/joned-logo-color-integrated.png" alt="Joned Transpor Co" />
          <span>◈ {t.brand}</span>
        </a>
        <div className="joned-applicant-user">
          <span>{t.user}</span>
          <b>JD</b>
          <small className="joned-applicant-user-email">Personal email linked to case</small>
          <button type="button" onClick={() => setLanguage(language === "en" ? "es" : "en")}>
            {language === "en" ? "ESPAÑOL" : "ENGLISH"}
          </button>
        </div>
      </header>

      <div className="joned-applicant-layout">
        <aside className="joned-applicant-sidebar">
          <small>JONED TRANSPOR CO</small>
          <strong>{roleLabel} application</strong>
          <button className={screen === "case" ? "active" : ""} onClick={() => (location.href = "/workspace/application")}>01 · {t.case}</button>
          <button className={screen === "documents" ? "active" : ""} onClick={() => (location.href = "/workspace/documents")}>02 · {t.documents}</button>
          <button className={screen === "tracking" ? "active" : ""} onClick={() => (location.href = "/workspace/tracking")}>03 · {t.tracking}</button>

          <div className="joned-applicant-role">
            <small>Applicant type</small>
            <div>
              <button className={role === "owner" ? "selected" : ""} onClick={() => setRole("owner")}>Owner</button>
              <button className={role === "driver" ? "selected" : ""} onClick={() => setRole("driver")}>Driver</button>
            </div>
          </div>
        </aside>

        <section className="joned-applicant-main">
          <section className="joned-case-bridge">
            <div>
              <span className="joned-eyebrow">
                {t.roleCase} · {roleLabel}
              </span>
              <p className="joned-case-identity-note">
                Signed in with the personal email bound to this expediente.
              </p>
              <h2>{data.caseId} · {data.routeCode}</h2>
              <p>{data.summary}</p>
            </div>
            <div className="joned-case-bridge-grid">
              <div>
                <small>{t.current}</small>
                <strong>{data.currentState}</strong>
              </div>
              <div>
                <small>{t.next}</small>
                <strong>{data.nextAction}</strong>
              </div>
              <div>
                <small>{t.missing}</small>
                <strong>{data.missingCount} items</strong>
              </div>
              <div>
                <small>{t.update}</small>
                <strong>{data.lastUpdate}</strong>
              </div>
            </div>
            <div className="joned-case-bridge-flow" aria-label="Workspace flow">
              <span className={screen === "case" ? "active" : ""}>01 Application</span>
              <span className={screen === "documents" ? "active" : ""}>02 Documents</span>
              <span className={screen === "tracking" ? "active" : ""}>03 Tracking</span>
            </div>
          </section>

          <div className="joned-applicant-heading">
            <div>
              <span className="joned-eyebrow">
                {roleLabel} · {t.status}
              </span>
              <h1>{title}</h1>
              <p>
                {data.applicantName} · {caseDescription}
              </p>
            </div>
            <span className="joned-applicant-state">
              {data.routeCode} · {data.currentState}
            </span>
          </div>

          {screen === "case" && <CaseView t={t} data={data} />}
          {screen === "documents" && <DocumentsView t={t} data={data} />}
          {screen === "tracking" && <TrackingView t={t} data={data} />}

          <footer className="joned-applicant-footer">
            ◈ {t.secure}
            <span>
              Help · {t.contact}
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}

function CaseView({ t, data }: { t: typeof copy.en; data: CaseModel }) {
  return (
    <>
      <div className="applicant-grid applicant-grid--summary">
        <article>
          <small>{t.summary}</small>
          <h2>{data.applicantName}</h2>
          <p>
            {t.caseLabel} {data.caseId} · {data.summary}
          </p>
        </article>
        <article>
          <small>{t.progress}</small>
          <strong className="applicant-progress-value">{data.progress}</strong>
          <div className="applicant-progress">
            <i />
          </div>
          <p>
            {data.missingCount} {t.missing.toLowerCase()} items
          </p>
        </article>
      </div>

      <div className="applicant-grid applicant-grid--two">
        <article>
          <small>{t.route}</small>
          <h2>{data.routeCode}</h2>
          <p>{data.nextAction}</p>
          <span className="applicant-route-pill">{t.roleCase}</span>
        </article>
        <article>
          <small>{t.next}</small>
          <h2>{data.currentState}</h2>
          <p>{data.lastUpdate}</p>
          <a className="joned-yellow-btn" href="/workspace/documents">
            {t.viewDocs}
          </a>
        </article>
      </div>

      <article className="applicant-link-panel">
        <small>{t.links}</small>
        <a href="/workspace/documents">{t.viewDocs} →</a>
        <a href="/workspace/tracking">{t.viewTracking} →</a>
      </article>
    </>
  );
}

function DocumentsView({ t, data }: { t: typeof copy.en; data: CaseModel }) {
  return (
    <div className="applicant-docs-grid">
      <aside className="applicant-checklist">
        <small>{t.checklist}</small>
        <strong>
          {data.checklist.filter((item) => item.status === "complete").length} of {data.checklist.length} {t.complete}
        </strong>
        {data.checklist.map((item) => (
          <div className={item.status === "current" ? "current" : ""} key={item.label}>
            <span>{item.status === "complete" ? "✓" : item.status === "current" ? "○" : "·"}</span>
            {item.label}
            <small>{item.status === "complete" ? "Complete" : item.status === "current" ? "In progress" : "Pending"}</small>
          </div>
        ))}
      </aside>

      <section className="applicant-upload">
        <small>{t.uploadTitle}</small>
        <h2>{data.routeCode}</h2>
        <p>{data.summary}</p>
        <div className="applicant-dropzone">
          ⇧
          <strong>{t.drop}</strong>
          <button className="joned-yellow-btn">{t.choose}</button>
        </div>
        <small>{t.uploaded}</small>
        {data.documents.map((doc) => (
          <div className="applicant-file" key={doc.label}>
            {doc.label} · {doc.file}
            <span>{doc.status}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function TrackingView({ t, data }: { t: typeof copy.en; data: CaseModel }) {
  return (
    <div className="applicant-tracking-grid">
      <article>
        <small>{t.current}</small>
        <h2>{data.currentState}</h2>
        <p>
          {data.missingCount} {t.missing.toLowerCase()} items
        </p>
        <div className="applicant-timeline">
          {data.timeline.map((item, index) => (
            <div className={index === 0 ? "current" : item.state === "muted" ? "muted" : ""} key={item.title}>
              <i />
              {item.title}
              <small>{item.detail}</small>
            </div>
          ))}
        </div>
      </article>
      <aside>
        <small>{t.reviewer}</small>
        <h2>{data.reviewer}</h2>
        <p>{t.caseState}</p>
        <small>{t.update}</small>
        <p>{data.lastUpdate}</p>
        <button className="joned-yellow-btn">{t.contact}</button>
      </aside>
    </div>
  );
}
