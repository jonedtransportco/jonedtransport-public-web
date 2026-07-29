"use client";

import { useEffect, useState } from "react";

type Language = "en" | "es";
type RoleId = "client" | "driver" | "operations" | "executive" | "admin";
type Tone = "blue" | "green" | "yellow" | "red";

type Metric = { label: string; value: string; tone: Tone };
type RecordRow = { id: string; title: string; detail: string; status: string; eta: string };
type TimelineItem = { title: string; detail: string; state?: "muted" };

type PortalCopy = {
  roles: Record<RoleId, { label: string; subtitle: string }>;
  roleModules: Record<RoleId, string[]>;
  futureModules: Record<RoleId, string[]>;
  metrics: Record<RoleId, Metric[]>;
  records: Record<RoleId, RecordRow[]>;
  timeline: Record<RoleId, TimelineItem[]>;
  auth: {
    eyebrow: string;
    title: string;
    body: string;
    footnote: string;
    panelEyebrow: string;
    panelTitle: string;
    panelBody: string;
    cta: string;
    note: string;
  };
  sidebar: {
    accessTitle: string;
    accessBody: string;
    designView: string;
    futureLabel: string;
  };
  shell: {
    export: string;
    newAction: string;
    workspaceTitle: string;
    workspaceSubtitle: string;
    ready: string;
    context: string;
    status: string;
    eta: string;
    locationAuthorized: string;
    locationRestricted: string;
    locationVisibleBody: string;
    locationRestrictedBody: string;
    mapLabelClient: string;
    mapLabelDriver: string;
    mapLabelOperations: string;
    mapLabelPrivate: string;
    mapLabelPrivateBody: string;
    nextActionsTitle: string;
    nextActionsBody: string;
  };
};

const copy: Record<Language, PortalCopy> = {
  en: {
    roles: {
      client: {
        label: "Client portal",
        subtitle: "Shipment visibility, documents, invoices, and POD.",
      },
      driver: {
        label: "Driver portal",
        subtitle: "Routes, check-in, evidence, signatures, and messaging.",
      },
      operations: {
        label: "Operations center",
        subtitle: "Authorized map, active loads, drivers, fleet, and alerts.",
      },
      executive: {
        label: "Executive view",
        subtitle: "KPI, service level, growth, risk, and trends.",
      },
      admin: {
        label: "Administration",
        subtitle: "Users, roles, audit, configuration, and integrations.",
      },
    },
    roleModules: {
      client: ["Overview", "Shipments", "Documents", "POD"],
      driver: ["Today", "Routes", "Check-in", "Photos", "Signature"],
      operations: ["Dashboard", "Operations", "Shipments", "Routes", "Drivers", "Fleet", "Reports"],
      executive: ["Executive dashboard", "KPI", "Clients", "Reports"],
      admin: ["Dashboard", "Operations", "Shipments", "Routes", "Drivers", "Fleet", "Clients", "Billing", "Documents", "Reports", "Settings", "Integrations"],
    },
    futureModules: {
      client: ["Quotes"],
      driver: ["Vehicle inspection"],
      operations: ["Clients", "Documents", "Advanced alerts"],
      executive: ["Consolidated risk", "Profitability"],
      admin: [],
    },
    metrics: {
      client: [
        { label: "Active shipments", value: "12", tone: "blue" },
        { label: "On time", value: "98.4%", tone: "green" },
        { label: "Open invoices", value: "3", tone: "yellow" },
        { label: "Incidents", value: "2", tone: "red" },
      ],
      driver: [
        { label: "Stops today", value: "4", tone: "blue" },
        { label: "Completed", value: "2", tone: "green" },
        { label: "Check-in pending", value: "1", tone: "yellow" },
        { label: "Exceptions", value: "0", tone: "red" },
      ],
      operations: [
        { label: "Company files", value: "28", tone: "blue" },
        { label: "Linked drivers", value: "46", tone: "green" },
        { label: "Pending review", value: "7", tone: "yellow" },
        { label: "Critical alerts", value: "2", tone: "red" },
      ],
      executive: [
        { label: "Monthly revenue", value: "$842K", tone: "blue" },
        { label: "Margin", value: "24.8%", tone: "green" },
        { label: "On-time service", value: "98.7%", tone: "yellow" },
        { label: "Exposure", value: "Low", tone: "red" },
      ],
      admin: [
        { label: "Users", value: "148", tone: "blue" },
        { label: "Active roles", value: "9", tone: "green" },
        { label: "Pending access", value: "4", tone: "yellow" },
        { label: "Security alerts", value: "0", tone: "red" },
      ],
    },
    records: {
      client: [
        { id: "JNE-24891", title: "Denver, CO -> Aurora, CO", detail: "Primary lane · customer priority", status: "In transit", eta: "14:35" },
        { id: "JNE-24887", title: "Boulder, CO -> Pueblo, CO", detail: "Retail replenishment", status: "On time", eta: "16:10" },
        { id: "JNE-24882", title: "Loveland, CO -> Denver, CO", detail: "Requires review", status: "Review", eta: "17:20" },
      ],
      driver: [
        { id: "STOP-01", title: "Denver Distribution Center", detail: "Pickup completed", status: "Done", eta: "12:42" },
        { id: "STOP-02", title: "Aurora Distribution Center", detail: "Next stop", status: "In transit", eta: "14:35" },
        { id: "STOP-03", title: "Lakewood Transfer Point", detail: "Pending", status: "Pending", eta: "16:05" },
      ],
      operations: [
        { id: "COMP-01", title: "Northstar Fleet LLC", detail: "Company parent record · 4 linked drivers · 6 vehicles", status: "Under Review", eta: "Now" },
        { id: "DR-14", title: "Rafael M.", detail: "Linked driver · CDL · ready for assignment", status: "Approved", eta: "Updated now" },
        { id: "DR-18", title: "Alex Chen", detail: "Linked driver · Non-CDL · documents missing", status: "Missing Documents", eta: "Updated 1 h ago" },
        { id: "COMP-02", title: "Blue Ridge Transport LLC", detail: "Company parent record · new intake submitted", status: "Initiated", eta: "Today" },
        { id: "COMP-03", title: "Summit Carrier LLC", detail: "Company parent record · final decision pending", status: "Rejected", eta: "Yesterday" },
      ],
      executive: [
        { id: "KPI-01", title: "Last-mile commercial growth", detail: "Denver Metro · +22%", status: "Strong", eta: "Monthly" },
        { id: "KPI-02", title: "Friday PM capacity", detail: "Demand 14% over planned availability", status: "Watch", eta: "Weekly" },
        { id: "KPI-03", title: "Customer self-service", detail: "96.2% tracking without support touch", status: "Strong", eta: "Weekly" },
      ],
      admin: [
        { id: "USR-01", title: "Elena Ruiz", detail: "Northstar Foods · Client Admin", status: "Active", eta: "Updated now" },
        { id: "USR-02", title: "Rafael M.", detail: "JONED · Driver", status: "Active", eta: "Updated now" },
        { id: "USR-03", title: "Alex Chen", detail: "JONED · Operations", status: "Review", eta: "Updated 1 h ago" },
      ],
    },
    timeline: {
      client: [
        { title: "Shipment picked up", detail: "12:42 · Denver Distribution Center" },
        { title: "In transit to destination", detail: "13:58 · Protected route context" },
        { title: "Delivery and POD", detail: "Estimated 14:35-14:50", state: "muted" },
      ],
      driver: [
        { title: "Check-in", detail: "Confirm arrival once safely stopped" },
        { title: "Upload evidence", detail: "Photos and POD after unloading" },
        { title: "Signature", detail: "Capture final handoff", state: "muted" },
      ],
      operations: [
        { title: "Company first", detail: "Review the parent business record before the child drivers" },
        { title: "Linked drivers", detail: "Compare each driver against the company-level intake" },
        { title: "Operational handoff", detail: "Advance only the approved summary into dispatch and follow-up", state: "muted" },
      ],
      executive: [
        { title: "Revenue", detail: "MTD performance vs. prior period" },
        { title: "Service", detail: "On-time and experience stability" },
        { title: "Risk", detail: "Capacity and operational exposure" },
      ],
      admin: [
        { title: "Identity", detail: "Microsoft Entra ID remains authority" },
        { title: "Governance", detail: "Roles, approvals, and audit trail" },
        { title: "Integrations", detail: "Only approved connectors advance", state: "muted" },
      ],
    },
    auth: {
      eyebrow: "Enterprise access",
      title: "One identity across the JONED platform.",
      body: "Employees, clients, drivers, and authorized external users sign in exclusively through Microsoft Entra ID. Visible modules and data depend on assigned role and scope.",
      footnote: "No local credentials · No public access to private location or driver data",
      panelEyebrow: "Protected portal",
      panelTitle: "Sign in",
      panelBody: "Use the account authorized by your organization to continue.",
      cta: "Continue with Microsoft Entra ID",
      note: "Authentication is handled by Microsoft Entra ID. Access is limited to accounts authorized by Joned Transpor Co.",
    },
    sidebar: {
      accessTitle: "Access through Microsoft Entra ID",
      accessBody: "The real role determines modules, data visibility, and allowed actions.",
      designView: "Design view by role",
      futureLabel: "READY TO ADAPT",
    },
    shell: {
      export: "Export",
      newAction: "New action",
      workspaceTitle: "Workspace overview",
      workspaceSubtitle: "Aligned to the approved portal structure.",
      ready: "Prototype ready",
      context: "Context",
      status: "Status",
      eta: "ETA / update",
      locationAuthorized: "Authorized location context",
      locationRestricted: "Role-restricted information",
      locationVisibleBody: "Visible only after authentication and within assigned role scope.",
      locationRestrictedBody: "This role does not require operational location detail to perform its function.",
      mapLabelClient: "Authorized shipments",
      mapLabelDriver: "4 stops today",
      mapLabelOperations: "46 connected units",
      mapLabelPrivate: "Private role context",
      mapLabelPrivateBody: "Role-based visibility only",
      nextActionsTitle: "Next actions",
      nextActionsBody: "Priorities and actions depend on the authorized role.",
    },
  },
  es: {
    roles: {
      client: {
        label: "Portal del cliente",
        subtitle: "Visibilidad de envíos, documentos, facturas y POD.",
      },
      driver: {
        label: "Portal del conductor",
        subtitle: "Rutas, check-in, evidencia, firmas y mensajería.",
      },
      operations: {
        label: "Centro de operaciones",
        subtitle: "Mapa autorizado, cargas activas, conductores, flota y alertas.",
      },
      executive: {
        label: "Vista ejecutiva",
        subtitle: "KPI, nivel de servicio, crecimiento, riesgo y tendencias.",
      },
      admin: {
        label: "Administración",
        subtitle: "Usuarios, roles, auditoría, configuración e integraciones.",
      },
    },
    roleModules: {
      client: ["Resumen", "Envíos", "Documentos", "POD"],
      driver: ["Hoy", "Rutas", "Check-in", "Fotos", "Firma"],
      operations: ["Dashboard", "Operaciones", "Envíos", "Rutas", "Conductores", "Flota", "Reportes"],
      executive: ["Dashboard ejecutivo", "KPI", "Clientes", "Reportes"],
      admin: ["Dashboard", "Operaciones", "Envíos", "Rutas", "Conductores", "Flota", "Clientes", "Facturación", "Documentos", "Reportes", "Configuración", "Integraciones"],
    },
    futureModules: {
      client: ["Cotizaciones"],
      driver: ["Inspección del vehículo"],
      operations: ["Clientes", "Documentos", "Alertas avanzadas"],
      executive: ["Riesgo consolidado", "Rentabilidad"],
      admin: [],
    },
    metrics: {
      client: [
        { label: "Envíos activos", value: "12", tone: "blue" },
        { label: "A tiempo", value: "98.4%", tone: "green" },
        { label: "Facturas abiertas", value: "3", tone: "yellow" },
        { label: "Incidencias", value: "2", tone: "red" },
      ],
      driver: [
        { label: "Paradas hoy", value: "4", tone: "blue" },
        { label: "Completadas", value: "2", tone: "green" },
        { label: "Check-in pendiente", value: "1", tone: "yellow" },
        { label: "Excepciones", value: "0", tone: "red" },
      ],
      operations: [
        { label: "Expedientes de empresa", value: "28", tone: "blue" },
        { label: "Conductores vinculados", value: "46", tone: "green" },
        { label: "En revisión", value: "7", tone: "yellow" },
        { label: "Alertas críticas", value: "2", tone: "red" },
      ],
      executive: [
        { label: "Ingresos del mes", value: "$842K", tone: "blue" },
        { label: "Margen", value: "24.8%", tone: "green" },
        { label: "Entregas a tiempo", value: "98.7%", tone: "yellow" },
        { label: "Exposición", value: "Baja", tone: "red" },
      ],
      admin: [
        { label: "Usuarios", value: "148", tone: "blue" },
        { label: "Roles activos", value: "9", tone: "green" },
        { label: "Accesos pendientes", value: "4", tone: "yellow" },
        { label: "Alertas de seguridad", value: "0", tone: "red" },
      ],
    },
    records: {
      client: [
        { id: "JNE-24891", title: "Denver, CO -> Aurora, CO", detail: "Carril principal · prioridad del cliente", status: "En tránsito", eta: "14:35" },
        { id: "JNE-24887", title: "Boulder, CO -> Pueblo, CO", detail: "Reabastecimiento retail", status: "A tiempo", eta: "16:10" },
        { id: "JNE-24882", title: "Loveland, CO -> Denver, CO", detail: "Requiere revisión", status: "Revisión", eta: "17:20" },
      ],
      driver: [
        { id: "STOP-01", title: "Centro de distribución Denver", detail: "Recogida completada", status: "Hecho", eta: "12:42" },
        { id: "STOP-02", title: "Centro de distribución Aurora", detail: "Siguiente parada", status: "En tránsito", eta: "14:35" },
        { id: "STOP-03", title: "Punto de transferencia Lakewood", detail: "Pendiente", status: "Pendiente", eta: "16:05" },
      ],
      operations: [
        { id: "COMP-01", title: "Northstar Fleet LLC", detail: "Expediente padre · 4 conductores vinculados · 6 unidades", status: "Under Review", eta: "Ahora" },
        { id: "DR-14", title: "Rafael M.", detail: "Conductor vinculado · CDL · listo para asignación", status: "Approved", eta: "Actualizado ahora" },
        { id: "DR-18", title: "Alex Chen", detail: "Conductor vinculado · Non-CDL · documentos faltantes", status: "Missing Documents", eta: "Actualizado hace 1 h" },
        { id: "COMP-02", title: "Blue Ridge Transport LLC", detail: "Expediente padre · nueva solicitud enviada", status: "Initiated", eta: "Hoy" },
        { id: "COMP-03", title: "Summit Carrier LLC", detail: "Expediente padre · decisión final pendiente", status: "Rejected", eta: "Ayer" },
      ],
      executive: [
        { id: "KPI-01", title: "Crecimiento comercial de última milla", detail: "Denver Metro · +22%", status: "Fuerte", eta: "Mensual" },
        { id: "KPI-02", title: "Capacidad viernes PM", detail: "Demanda 14% por encima de lo planificado", status: "Vigilar", eta: "Semanal" },
        { id: "KPI-03", title: "Autoservicio del cliente", detail: "96.2% de rastreo sin contacto de soporte", status: "Fuerte", eta: "Semanal" },
      ],
      admin: [
        { id: "USR-01", title: "Elena Ruiz", detail: "Northstar Foods · Admin cliente", status: "Activo", eta: "Actualizado ahora" },
        { id: "USR-02", title: "Rafael M.", detail: "JONED · Conductor", status: "Activo", eta: "Actualizado ahora" },
        { id: "USR-03", title: "Alex Chen", detail: "JONED · Operaciones", status: "Revisión", eta: "Actualizado hace 1 h" },
      ],
    },
    timeline: {
      client: [
        { title: "Envío recogido", detail: "12:42 · Centro de distribución Denver" },
        { title: "En tránsito al destino", detail: "13:58 · Contexto de ruta protegido" },
        { title: "Entrega y POD", detail: "Estimado 14:35-14:50", state: "muted" },
      ],
      driver: [
        { title: "Check-in", detail: "Confirma llegada cuando estés detenido de forma segura" },
        { title: "Subir evidencia", detail: "Fotos y POD después de descargar" },
        { title: "Firma", detail: "Captura la entrega final", state: "muted" },
      ],
      operations: [
        { title: "Primero empresa", detail: "Revisa el expediente padre antes de abrir los conductores hijos" },
        { title: "Conductores vinculados", detail: "Compara cada conductor con la solicitud de empresa" },
        { title: "Traspaso operativo", detail: "Solo el resumen aprobado pasa a Operaciones", state: "muted" },
      ],
      executive: [
        { title: "Ingresos", detail: "Desempeño MTD vs período anterior" },
        { title: "Servicio", detail: "Estabilidad de puntualidad y experiencia" },
        { title: "Riesgo", detail: "Exposición operativa y de capacidad" },
      ],
      admin: [
        { title: "Identidad", detail: "Microsoft Entra ID sigue siendo la autoridad" },
        { title: "Gobernanza", detail: "Roles, aprobaciones y auditoría" },
        { title: "Integraciones", detail: "Solo avanzan conectores aprobados", state: "muted" },
      ],
    },
    auth: {
      eyebrow: "Acceso empresarial",
      title: "Una sola identidad para toda la plataforma JONED.",
      body: "Empleados, clientes, conductores y externos autorizados ingresan exclusivamente mediante Microsoft Entra ID. Los módulos y datos visibles dependen del rol y alcance asignados.",
      footnote: "Sin credenciales locales · Sin acceso público a datos privados de ubicación o conductores",
      panelEyebrow: "Portal protegido",
      panelTitle: "Iniciar sesión",
      panelBody: "Usa la cuenta autorizada por tu organización para continuar.",
      cta: "Continuar con Microsoft Entra ID",
      note: "La autenticación es administrada por Microsoft Entra ID. El acceso está limitado a cuentas autorizadas por Joned Transpor Co.",
    },
    sidebar: {
      accessTitle: "Acceso mediante Microsoft Entra ID",
      accessBody: "El rol real determina módulos, visibilidad de datos y acciones permitidas.",
      designView: "Vista de diseño por rol",
      futureLabel: "PREPARADO PARA ADAPTAR",
    },
    shell: {
      export: "Exportar",
      newAction: "Nueva acción",
      workspaceTitle: "Resumen del espacio de trabajo",
      workspaceSubtitle: "Alineado con la estructura aprobada del portal.",
      ready: "Prototipo listo",
      context: "Contexto",
      status: "Estado",
      eta: "ETA / actualización",
      locationAuthorized: "Contexto de ubicación autorizado",
      locationRestricted: "Información restringida por rol",
      locationVisibleBody: "Visible solo después de autenticación y dentro del alcance del rol asignado.",
      locationRestrictedBody: "Este rol no necesita detalle de ubicación operativa para cumplir su función.",
      mapLabelClient: "Envíos autorizados",
      mapLabelDriver: "4 paradas hoy",
      mapLabelOperations: "46 unidades conectadas",
      mapLabelPrivate: "Contexto privado por rol",
      mapLabelPrivateBody: "Solo visibilidad según rol",
      nextActionsTitle: "Próximas acciones",
      nextActionsBody: "Las prioridades y acciones dependen del rol autorizado.",
    },
  },
};

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (["active", "done", "on time", "strong", "activo", "hecho", "a tiempo", "fuerte"].includes(normalized)) {
    return "live";
  }
  if (["review", "watch", "pending", "revisión", "vigilar", "pendiente"].includes(normalized)) {
    return "warn";
  }
  if (["attention", "atención"].includes(normalized)) {
    return "alert";
  }
  return "transit";
}

export default function PortalPage({
  initialAuthenticatedPreview = false,
}: {
  initialAuthenticatedPreview?: boolean;
}) {
  const [authenticatedPreview] = useState(initialAuthenticatedPreview);
  const [language, setLanguage] = useState<Language>("en");
  const [role, setRole] = useState<RoleId>("operations");

  const portalCopy = copy[language];
  const modules = portalCopy.roleModules[role];
  const roleDefaultModule: Record<RoleId, string> = {
    client: modules[0],
    driver: modules[0],
    operations: modules[0],
    executive: modules[0],
    admin: modules[0],
  };
  const [activeModule, setActiveModule] = useState(roleDefaultModule[role]);

  const roleMetrics = portalCopy.metrics[role];
  const roleRecords = portalCopy.records[role];
  const roleTimeline = portalCopy.timeline[role];

  useEffect(() => {
    const nextModule = portalCopy.roleModules[role][0];
    setActiveModule(nextModule);
  }, [language, role, portalCopy]);

  useEffect(() => {
    if (!modules.includes(activeModule)) {
      setActiveModule(modules[0]);
    }
  }, [activeModule, modules]);

  if (!authenticatedPreview) {
    return (
      <main className="joned-entra-page">
        <section className="joned-entra-story">
          <div className="joned-logo-shell joned-logo-shell--portal">
            <img src="/joned-logo-color.png" alt="Joned Transpor Co" className="joned-logo-image" />
          </div>
          <div className="joned-language-switcher auth">
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={language === "es" ? "active" : ""}
              onClick={() => setLanguage("es")}
            >
              ES
            </button>
          </div>
          <div>
            <span className="joned-eyebrow">{portalCopy.auth.eyebrow}</span>
            <h1>{portalCopy.auth.title}</h1>
            <p>{portalCopy.auth.body}</p>
          </div>
          <small>{portalCopy.auth.footnote}</small>
        </section>
        <section className="joned-entra-panel">
          <div className="joned-entra-card">
            <div className="joned-logo-shell joned-logo-shell--portal">
              <img src="/joned-logo-color.png" alt="Joned Transpor Co" className="joned-logo-image" />
            </div>
            <span className="joned-eyebrow">{portalCopy.auth.panelEyebrow}</span>
            <h2>{portalCopy.auth.panelTitle}</h2>
            <p>{portalCopy.auth.panelBody}</p>
            <a
              className="joned-entra-button"
              href="/.auth/login/aad?post_login_redirect_uri=/workspace"
            >
              <span className="joned-ms-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              {portalCopy.auth.cta}
            </a>
            <div className="joned-entra-note">{portalCopy.auth.note}</div>
          </div>
        </section>
      </main>
    );
  }

  const locationVisible = role === "client" || role === "driver" || role === "operations";
  const locationLabel =
    role === "driver"
      ? portalCopy.shell.mapLabelDriver
      : role === "operations"
        ? portalCopy.shell.mapLabelOperations
        : portalCopy.shell.mapLabelClient;

  return (
    <main className="joned-portal">
      <aside className="joned-portal-sidebar">
        <div className="joned-logo-shell joned-logo-shell--portal">
          <img src="/joned-logo-color.png" alt="Joned Transpor Co" className="joned-logo-image" />
        </div>
        <div className="joned-portal-note">
          <strong>{portalCopy.sidebar.accessTitle}</strong>
          <small>{portalCopy.sidebar.accessBody}</small>
        </div>
        <div className="joned-language-switcher">
          <button
            type="button"
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            English
          </button>
          <button
            type="button"
            className={language === "es" ? "active" : ""}
            onClick={() => setLanguage("es")}
          >
            Español
          </button>
        </div>
        <small className="joned-design-role-label">{portalCopy.sidebar.designView}</small>
        <div className="joned-role-switcher">
          {(Object.keys(portalCopy.roles) as RoleId[]).map((item) => (
            <button
              key={item}
              className={item === role ? "selected" : ""}
              type="button"
              onClick={() => setRole(item)}
            >
              {portalCopy.roles[item].label}
            </button>
          ))}
        </div>
        <nav className="joned-module-nav" aria-label="Portal modules">
          {modules.map((module) => (
            <button
              key={module}
              className={module === activeModule ? "active" : ""}
              type="button"
              onClick={() => setActiveModule(module)}
              aria-pressed={module === activeModule}
            >
              {module}
            </button>
          ))}
        </nav>
        <div className="joned-future-modules">
          <small>{portalCopy.sidebar.futureLabel}</small>
          {portalCopy.futureModules[role].map((module) => (
            <span key={module}>{module}</span>
          ))}
        </div>
      </aside>

      <section className="joned-portal-main">
        <header className="joned-portal-topbar">
          <div>
            <span className="joned-eyebrow">{portalCopy.roles[role].label}</span>
            <h1>{activeModule}</h1>
            <p>{portalCopy.roles[role].subtitle}</p>
          </div>
          <div className="joned-button-row">
            <button type="button" className="joned-secondary-btn">
              {portalCopy.shell.export}
            </button>
            <button type="button" className="joned-primary-btn">
              {portalCopy.shell.newAction}
            </button>
          </div>
        </header>

        <div className="joned-grid four portal-metrics">
          {roleMetrics.map((item) => (
            <article key={item.label} className={`joned-metric ${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="joned-grid portal-layout">
          <article className="joned-card">
            <div className="joned-card-head">
              <div>
                <h3>{portalCopy.shell.workspaceTitle}</h3>
                <p>{activeModule} {portalCopy.shell.workspaceSubtitle}</p>
              </div>
              <span className="joned-status live">{portalCopy.shell.ready}</span>
            </div>
            <div className="joned-table-shell">
              <table className="joned-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{portalCopy.shell.context}</th>
                    <th>{portalCopy.shell.status}</th>
                    <th>{portalCopy.shell.eta}</th>
                  </tr>
                </thead>
                <tbody>
                  {roleRecords.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>
                        <strong>{row.title}</strong>
                        <small>{row.detail}</small>
                      </td>
                      <td>
                        <span className={`joned-status ${statusClass(row.status)}`}>{row.status}</span>
                      </td>
                      <td>{row.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="joned-side-stack">
            <article className="joned-card map-panel">
              <div className="joned-card-head">
                <div>
                  <h3>
                    {locationVisible
                      ? portalCopy.shell.locationAuthorized
                      : portalCopy.shell.locationRestricted}
                  </h3>
                  <p>
                    {locationVisible
                      ? portalCopy.shell.locationVisibleBody
                      : portalCopy.shell.locationRestrictedBody}
                  </p>
                </div>
              </div>
              {locationVisible ? (
                <div className="joned-map compact">
                  <span className="joned-route-line" />
                  <span className="joned-pin start" />
                  <span className="joned-pin mid" />
                  <span className="joned-pin end" />
                  <div className="joned-map-badge">
                    <strong>{locationLabel}</strong>
                    <small>{portalCopy.shell.mapLabelPrivateBody}</small>
                  </div>
                </div>
              ) : (
                <div className="joned-location-restricted">
                  <strong>{portalCopy.shell.locationRestricted}</strong>
                  <small>{portalCopy.shell.locationRestrictedBody}</small>
                </div>
              )}
            </article>

            <article className="joned-card">
              <div className="joned-card-head">
                <div>
                  <h3>{portalCopy.shell.nextActionsTitle}</h3>
                  <p>{portalCopy.shell.nextActionsBody}</p>
                </div>
              </div>
              <div className="joned-timeline">
                {roleTimeline.map((item) => (
                  <div
                    key={item.title}
                    className={`joned-timeline-item ${item.state === "muted" ? "muted" : ""}`}
                  >
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
