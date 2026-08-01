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
    reviewSubmissions: string;
    openTracking: string;
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
        { label: "Shipment status", value: "Live", tone: "blue" },
        { label: "Document status", value: "Current", tone: "green" },
        { label: "Billing status", value: "Pending", tone: "yellow" },
        { label: "Exceptions", value: "None", tone: "red" },
      ],
      driver: [
        { label: "Route status", value: "Live", tone: "blue" },
        { label: "Required docs", value: "Current", tone: "green" },
        { label: "Check-in", value: "Pending", tone: "yellow" },
        { label: "Exceptions", value: "None", tone: "red" },
      ],
      operations: [
        { label: "Open expedientes", value: "Live", tone: "blue" },
        { label: "Owner cases", value: "Current", tone: "green" },
        { label: "Driver cases", value: "Pending", tone: "yellow" },
        { label: "Missing docs", value: "None", tone: "red" },
      ],
      executive: [
        { label: "Commercial trend", value: "Healthy", tone: "blue" },
        { label: "Margin", value: "Stable", tone: "green" },
        { label: "Service level", value: "Strong", tone: "yellow" },
        { label: "Exposure", value: "Low", tone: "red" },
      ],
      admin: [
        { label: "Users", value: "Managed", tone: "blue" },
        { label: "Active roles", value: "Ready", tone: "green" },
        { label: "Pending access", value: "Queued", tone: "yellow" },
        { label: "Security alerts", value: "None", tone: "red" },
      ],
    },
    records: {
      client: [
        { id: "SHIP-1001", title: "Shipment record", detail: "Approved customer context", status: "Active", eta: "Updated now" },
        { id: "SHIP-1002", title: "Shipment record", detail: "Awaiting a final update", status: "In review", eta: "Today" },
        { id: "SHIP-1003", title: "Shipment record", detail: "Ready for follow-up", status: "Pending", eta: "Later" },
      ],
      driver: [
        { id: "STOP-01", title: "Route step", detail: "Completed", status: "Done", eta: "Updated now" },
        { id: "STOP-02", title: "Route step", detail: "Next in sequence", status: "In progress", eta: "Today" },
        { id: "STOP-03", title: "Route step", detail: "Waiting for confirmation", status: "Pending", eta: "Later" },
      ],
      operations: [
        { id: "OO-CASE-001", title: "Owner expediente", detail: "Current review snapshot", status: "Under review", eta: "Now" },
        { id: "DR-CASE-014", title: "Driver expediente", detail: "Pending validation", status: "Missing docs", eta: "Updated now" },
        { id: "OO-CASE-006", title: "Business expediente", detail: "Queued for follow-up", status: "In review", eta: "Today" },
        { id: "DR-CASE-018", title: "Driver expediente", detail: "Needs resubmission", status: "Clarification", eta: "Updated 1 h ago" },
        { id: "OO-CASE-003", title: "Business expediente", detail: "Waiting for final step", status: "Review queued", eta: "Yesterday" },
      ],
      executive: [
        { id: "KPI-01", title: "Commercial signal", detail: "High-level performance snapshot", status: "Strong", eta: "Monthly" },
        { id: "KPI-02", title: "Capacity signal", detail: "Review demand against available lanes", status: "Watch", eta: "Weekly" },
        { id: "KPI-03", title: "Self-service signal", detail: "Tracking and portal adoption", status: "Strong", eta: "Weekly" },
      ],
      admin: [
        { id: "USR-01", title: "User 01", detail: "Client access", status: "Active", eta: "Updated now" },
        { id: "USR-02", title: "User 02", detail: "Driver access", status: "Active", eta: "Updated now" },
        { id: "USR-03", title: "User 03", detail: "Operations access", status: "Review", eta: "Updated 1 h ago" },
      ],
    },
    timeline: {
      client: [
        { title: "Shipment picked up", detail: "Pickup confirmed and case updated" },
        { title: "In transit to destination", detail: "Protected route context in progress" },
        { title: "Delivery and POD", detail: "Estimated completion window", state: "muted" },
      ],
      driver: [
        { title: "Check-in", detail: "Confirm arrival once safely stopped" },
        { title: "Upload evidence", detail: "Photos and POD after unloading" },
        { title: "Signature", detail: "Capture final handoff", state: "muted" },
      ],
      operations: [
        { title: "Submission summary", detail: "Review case id, route, current state, and missing items" },
        { title: "Role isolation", detail: "Keep owner and driver cases separated unless explicitly linked" },
        { title: "Operational handoff", detail: "Advance only approved summaries into follow-up", state: "muted" },
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
      title: "Sign in with your personal email to open your private case.",
      body: "Owners and drivers use Microsoft Entra ID with the personal email captured for their case. The same identity opens only the expediente assigned to that email.",
      footnote: "No local credentials · One email per case · No public access to private location or driver data",
      panelEyebrow: "Protected portal",
      panelTitle: "Sign in",
      panelBody: "Use the personal email linked to your expediente to continue.",
      cta: "Continue with personal email",
      note: "Authentication is handled by Microsoft Entra ID. The signed-in email is bound to one private case and its permitted role.",
    },
    sidebar: {
      accessTitle: "Access through Microsoft Entra ID",
      accessBody: "Your personal email opens only your private expediente. Role determines modules, data visibility, and allowed actions.",
      designView: "Design view by role",
      futureLabel: "READY TO ADAPT",
    },
    shell: {
      export: "Export",
      newAction: "New action",
      reviewSubmissions: "Review submissions",
      openTracking: "Open tracking",
      workspaceTitle: "Workspace overview",
      workspaceSubtitle: "Aligned to the approved workspace structure.",
      ready: "Prototype ready",
      context: "Context",
      status: "Status",
      eta: "ETA / update",
      locationAuthorized: "Authorized location context",
      locationRestricted: "Role-restricted information",
      locationVisibleBody: "Visible only after authentication and within assigned role scope.",
      locationRestrictedBody: "This role does not require operational location detail to perform its function.",
      mapLabelClient: "Authorized shipments",
      mapLabelDriver: "Driver context",
      mapLabelOperations: "Operational context",
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
        { label: "Estado de envíos", value: "Vivo", tone: "blue" },
        { label: "Estado de documentos", value: "Actual", tone: "green" },
        { label: "Estado de facturación", value: "Pendiente", tone: "yellow" },
        { label: "Excepciones", value: "Ninguna", tone: "red" },
      ],
      driver: [
        { label: "Estado de ruta", value: "Vivo", tone: "blue" },
        { label: "Documentos requeridos", value: "Actual", tone: "green" },
        { label: "Check-in", value: "Pendiente", tone: "yellow" },
        { label: "Excepciones", value: "Ninguna", tone: "red" },
      ],
      operations: [
        { label: "Estado de envíos", value: "Vivo", tone: "blue" },
        { label: "Estado de documentos", value: "Actual", tone: "green" },
        { label: "Estado de facturación", value: "Pendiente", tone: "yellow" },
        { label: "Excepciones", value: "Ninguna", tone: "red" },
      ],
      executive: [
        { label: "Tendencia comercial", value: "Sana", tone: "blue" },
        { label: "Margen", value: "Estable", tone: "green" },
        { label: "Nivel de servicio", value: "Fuerte", tone: "yellow" },
        { label: "Exposición", value: "Baja", tone: "red" },
      ],
      admin: [
        { label: "Usuarios", value: "Administrados", tone: "blue" },
        { label: "Roles activos", value: "Listos", tone: "green" },
        { label: "Accesos pendientes", value: "En cola", tone: "yellow" },
        { label: "Alertas de seguridad", value: "Ninguna", tone: "red" },
      ],
    },
    records: {
      client: [
        { id: "SHIP-1001", title: "Registro de envío", detail: "Contexto de cliente aprobado", status: "Activo", eta: "Actualizado ahora" },
        { id: "SHIP-1002", title: "Registro de envío", detail: "Esperando una actualización final", status: "En revisión", eta: "Hoy" },
        { id: "SHIP-1003", title: "Registro de envío", detail: "Listo para seguimiento", status: "Pendiente", eta: "Más tarde" },
      ],
      driver: [
        { id: "STOP-01", title: "Paso de ruta", detail: "Completado", status: "Hecho", eta: "Actualizado ahora" },
        { id: "STOP-02", title: "Paso de ruta", detail: "Siguiente en secuencia", status: "En progreso", eta: "Hoy" },
        { id: "STOP-03", title: "Paso de ruta", detail: "En espera de confirmación", status: "Pendiente", eta: "Más tarde" },
      ],
      operations: [
        { id: "COMP-01", title: "Expediente de empresa", detail: "Instantánea de revisión actual", status: "Under Review", eta: "Ahora" },
        { id: "DR-14", title: "Conductor vinculado", detail: "Validación pendiente", status: "Missing Documents", eta: "Actualizado ahora" },
        { id: "DR-18", title: "Conductor vinculado", detail: "Requiere reenvío", status: "Clarification", eta: "Actualizado hace 1 h" },
        { id: "COMP-02", title: "Expediente de empresa", detail: "En cola para seguimiento", status: "Initiated", eta: "Hoy" },
        { id: "COMP-03", title: "Expediente de empresa", detail: "Esperando el paso final", status: "Rejected", eta: "Ayer" },
      ],
      executive: [
        { id: "KPI-01", title: "Señal comercial", detail: "Instantánea de desempeño de alto nivel", status: "Fuerte", eta: "Mensual" },
        { id: "KPI-02", title: "Señal de capacidad", detail: "Revisar demanda contra las rutas disponibles", status: "Vigilar", eta: "Semanal" },
        { id: "KPI-03", title: "Señal de autoservicio", detail: "Adopción de rastreo y portal", status: "Fuerte", eta: "Semanal" },
      ],
      admin: [
        { id: "USR-01", title: "Usuario 01", detail: "Acceso cliente", status: "Activo", eta: "Actualizado ahora" },
        { id: "USR-02", title: "Usuario 02", detail: "Acceso conductor", status: "Activo", eta: "Actualizado ahora" },
        { id: "USR-03", title: "Usuario 03", detail: "Acceso operaciones", status: "Revisión", eta: "Actualizado hace 1 h" },
      ],
    },
    timeline: {
      client: [
        { title: "Envío recogido", detail: "Recogida confirmada y expediente actualizado" },
        { title: "En tránsito al destino", detail: "Contexto de ruta protegido en curso" },
        { title: "Entrega y POD", detail: "Ventana estimada de finalización", state: "muted" },
      ],
      driver: [
        { title: "Check-in", detail: "Confirma llegada cuando estés detenido de forma segura" },
        { title: "Subir evidencia", detail: "Fotos y POD después de descargar" },
        { title: "Firma", detail: "Captura la entrega final", state: "muted" },
      ],
      operations: [
        { title: "Primero empresa", detail: "Revisa el expediente padre antes de abrir conductores vinculados" },
        { title: "Conductores vinculados", detail: "Compara cada conductor con la solicitud de empresa" },
        { title: "Traspaso operativo", detail: "Solo el resumen aprobado pasa a seguimiento", state: "muted" },
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
      reviewSubmissions: "Revisar envíos",
      openTracking: "Abrir seguimiento",
      workspaceTitle: "Resumen del espacio de trabajo",
      workspaceSubtitle: "Alineado con la estructura aprobada del workspace.",
      ready: "Prototipo listo",
      context: "Contexto",
      status: "Estado",
      eta: "ETA / actualización",
      locationAuthorized: "Contexto de ubicación autorizado",
      locationRestricted: "Información restringida por rol",
      locationVisibleBody: "Visible solo después de autenticación y dentro del alcance del rol asignado.",
      locationRestrictedBody: "Este rol no necesita detalle de ubicación operativa para cumplir su función.",
      mapLabelClient: "Envíos autorizados",
      mapLabelDriver: "Contexto de conductor",
      mapLabelOperations: "Contexto operativo",
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
  const [pilotCase, setPilotCase] = useState<{ caseId: string; routeCode: string; reviewState: string; applicantName: string; email: string; submittedAt: string } | null>(null);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("JONED_DRIVER_PILOT_CASE");
      if (raw) {
        const parsed = JSON.parse(raw) as typeof pilotCase;
        if (parsed && parsed.caseId) {
          setPilotCase(parsed);
          setRole("operations");
        }
      }
    } catch {
      setPilotCase(null);
    }
  }, []);

  if (!authenticatedPreview) {
    return (
      <main className="joned-entra-page">
        <section className="joned-entra-story">
          <div className="joned-logo-shell joned-logo-shell--portal">
            <img
              src="/joned-logo-color-integrated.png"
              alt="Joned Transpor Co"
              className="joned-logo-image joned-logo-image--brand"
              loading="eager"
              decoding="async"
            />
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
              <img
                src="/joned-logo-color-integrated.png"
                alt="Joned Transpor Co"
                className="joned-logo-image joned-logo-image--brand"
                loading="eager"
                decoding="async"
              />
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
          <img
            src="/joned-logo-color-integrated.png"
            alt="Joned Transpor Co"
            className="joned-logo-image joned-logo-image--brand"
            loading="eager"
            decoding="async"
          />
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
        {pilotCase ? (
          <section className="joned-operations-bridge">
            <div>
              <span className="joned-eyebrow">Pilot case loaded</span>
              <h2>{pilotCase.caseId} · {pilotCase.routeCode}</h2>
              <p>{pilotCase.applicantName} · {pilotCase.email}</p>
            </div>
            <div className="joned-operations-bridge-grid">
              <div>
                <small>Status</small>
                <strong>{pilotCase.reviewState}</strong>
              </div>
              <div>
                <small>Source</small>
                <strong>Drivers submit</strong>
              </div>
              <div>
                <small>Submitted</small>
                <strong>{pilotCase.submittedAt}</strong>
              </div>
              <div>
                <small>Workspace</small>
                <strong>/workspace</strong>
              </div>
            </div>
            <div className="joned-button-row" style={{ marginTop: 18 }}>
              <a className="joned-secondary-btn" href="/workspace/application">
                {portalCopy.shell.reviewSubmissions}
              </a>
              <a className="joned-primary-btn" href="/workspace/tracking">
                {portalCopy.shell.openTracking}
              </a>
            </div>
          </section>
        ) : null}

        <header className="joned-portal-topbar">
          <div className="joned-portal-topbar-copy">
            <div className="joned-portal-brand">
              <div className="joned-logo-shell joned-logo-shell--portal joned-logo-shell--portal-dark">
                <img
                  src="/joned-logo-color-integrated.png"
                  alt="Joned Transpor Co"
                  className="joned-logo-image joned-logo-image--brand"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
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

      {role === "operations" ? (
        <section className="joned-operations-bridge">
          <div>
            <span className="joned-eyebrow">Same expediente bridge</span>
            <h2>{roleRecords[0].id} · {roleRecords[0].title}</h2>
            <p>{roleRecords[0].detail}</p>
          </div>
          <div className="joned-operations-bridge-grid">
            <div>
              <small>Case identity</small>
              <strong>{activeModule}</strong>
            </div>
            <div>
              <small>{portalCopy.shell.status}</small>
              <strong>{roleRecords[0].status}</strong>
            </div>
            <div>
              <small>{portalCopy.shell.eta}</small>
              <strong>{roleRecords[0].eta}</strong>
            </div>
            <div>
              <small>Next action</small>
              <strong>{roleTimeline[0]?.detail}</strong>
            </div>
          </div>
          <div className="joned-button-row" style={{ marginTop: 18 }}>
            <a className="joned-secondary-btn" href="/workspace/application">
              {portalCopy.shell.reviewSubmissions}
            </a>
            <a className="joned-primary-btn" href="/workspace/tracking">
              {portalCopy.shell.openTracking}
            </a>
          </div>
        </section>
      ) : null}

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
