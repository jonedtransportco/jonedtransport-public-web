"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { normalizeReportsApiPayload, resolveIntegrationMode, type ReportsResolution } from "./reports-api";

type IconName =
  | "grid" | "people" | "driver" | "truck" | "client" | "vendor"
  | "doc" | "chart" | "shield" | "gear" | "bell" | "arrow"
  | "search" | "menu" | "close" | "check" | "clock" | "route" | "lock"
  | "filter" | "spark" | "alert" | "form" | "refresh" | "retry" | "sort"
  | "chevron" | "database";

const icons: Record<IconName, string> = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  driver: "M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0M8 9h8M9 5.5 10 3h4l1 2.5",
  truck: "M3 6h11v10H3zM14 10h4l3 3v3h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  client: "M3 21h18M5 21V7l7-4 7 4v14M9 10h1M14 10h1M9 14h1M14 14h1M10 21v-3h4v3",
  vendor: "M4 10h16M5 10l1-6h12l1 6M6 10v10h12V10M9 20v-6h6v6",
  doc: "M6 2h8l4 4v16H6zM14 2v5h5M9 13h6M9 17h6M9 9h2",
  chart: "M4 19V5M4 19h16M8 16v-5M12 16V7M16 16v-8M20 16V4",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-5",
  gear: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-3v-.09a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 14.7a1.7 1.7 0 0 0-1.55-1H5v-3h.09A1.7 1.7 0 0 0 6.65 9.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.3 4.4V4h3v.09a1.7 1.7 0 0 0 1.1 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1H21v3h-.09A1.7 1.7 0 0 0 19.4 15z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  arrow: "M5 12h14M13 6l6 6-6 6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6 6 18",
  check: "M5 12l4 4L19 6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  route: "M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 16c0-5 12-3 12-9",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6zM12 15v2",
  filter: "M4 5h16M7 12h10M10 19h4",
  spark: "M12 3l1.8 4.7L18.5 9l-4.7 1.3L12 15l-1.8-4.7L5.5 9l4.7-1.3L12 3z",
  alert: "M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.73 3h16.9a2 2 0 0 0 1.73-3L13.7 3.86a2 2 0 0 0-3.46 0z",
  form: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  refresh: "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6",
  retry: "M3 12a9 9 0 0 1 15.36-6.36L21 8M3 21v-6h6",
  sort: "M7 6h10M7 12h7M7 18h4",
  chevron: "M9 6l6 6-6 6",
  database: "M12 4c-4.42 0-8 1.34-8 3v10c0 1.66 3.58 3 8 3s8-1.34 8-3V7c0-1.66-3.58-3-8-3zM4 12c0 1.66 3.58 3 8 3s8-1.34 8-3M4 17c0 1.66 3.58 3 8 3s8-1.34 8-3",
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={name === "grid" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[name]} /></svg>;
}

const modules = [
  ["Resumen ejecutivo", "grid"], ["Recursos Humanos", "people"], ["Conductores", "driver"],
  ["Flota", "truck"], ["Clientes", "client"], ["Proveedores", "vendor"],
  ["Documentos", "doc"], ["Reportes", "chart"], ["Administración", "shield"],
  ["Configuración", "gear"], ["Notificaciones", "bell"],
] as const;

type ModuleName = (typeof modules)[number][0];
type WorkspaceModule = Exclude<ModuleName, "Resumen ejecutivo">;
type RoleId = "administration" | "operations" | "human-resources" | "drivers" | "executive";
type MockState = "ready" | "loading" | "empty" | "error" | "partial";
type TabId = "listado" | "detalle" | "resumen" | "formulario";
type InternalTabKey = "primary" | "secondary" | "tertiary";
type SortField = "name" | "status" | "updatedAt";
type SortDirection = "asc" | "desc";
type RecordItem = {
  id: string;
  name: string;
  subtitle: string;
  status: string;
  updatedAt: string;
  metric: string;
  owner: string;
  route: string;
  severity?: "Alta" | "Media" | "Baja";
  health?: "Operativo" | "En revisión" | "Atención";
};

type RoleConfig = { label: string; short: string; title: string; permissions: string[]; modules: ModuleName[] };
type RoleAction = { label: string; permission: string; tone: "primary" | "ghost" | "warning"; when: "always" | "ready" | "partial" | "error" };
type StageItem = { label: string; state: "done" | "current" | "next"; detail: string };
type DetailSection = { title: string; items: string[] };
type AdapterContract = { endpoint: string; fixtureSet: string; requestShape: string; responseShape: string; futureSource: string; cacheKey: string };
type InternalTabDef = { key: InternalTabKey; label: string; hint: string };
type FilterGroup = { label: string; values: string[] };
type DomainConfig = {
  eyebrow: string;
  title: string;
  copy: string;
  accent: IconName;
  formTitle: string;
  metrics: { label: string; value: string }[];
  records: RecordItem[];
  filters: FilterGroup[];
  summary: string[];
  detailSections: DetailSection[];
  internalTabs: InternalTabDef[];
  actions: RoleAction[];
  stages: StageItem[];
  adapter: AdapterContract;
  error: string;
  empty: string;
  partial: string;
  refreshHint: string;
  state: MockState;
  totalRecords: number;
};

type IntegrationStatus = {
  mode: "mock" | "api-real";
  source: "mock-fixture" | "reports-api" | "mock-fallback";
  parityStatus: "not-applicable" | "passed" | "failed";
  reason: string;
};

type PersistedModuleState = {
  filters: Record<string, string>;
  internalTab: InternalTabKey;
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  selectedIds: string[];
  expandedId: string | null;
};

const roles: Record<RoleId, RoleConfig> = {
  administration: {
    label: "Administración",
    short: "Admin",
    title: "Administración · control visual completo",
    permissions: ["view", "create", "edit", "approve-mock", "manage-users-interface"],
    modules: modules.map(([label]) => label),
  },
  operations: {
    label: "Operaciones",
    short: "Ops",
    title: "Operaciones · ejecución diaria simulada",
    permissions: ["view", "create", "edit", "dispatch-interface"],
    modules: ["Resumen ejecutivo", "Conductores", "Flota", "Clientes", "Proveedores", "Documentos", "Reportes", "Notificaciones"],
  },
  "human-resources": {
    label: "Human Resources",
    short: "HR",
    title: "Human Resources · personas y cumplimiento",
    permissions: ["view", "create", "edit", "hr-interface"],
    modules: ["Resumen ejecutivo", "Recursos Humanos", "Conductores", "Documentos", "Reportes", "Notificaciones"],
  },
  drivers: {
    label: "Drivers",
    short: "Driver",
    title: "Drivers · autoservicio visual",
    permissions: ["view-self", "submit-mock", "acknowledge"],
    modules: ["Resumen ejecutivo", "Conductores", "Documentos", "Notificaciones", "Configuración"],
  },
  executive: {
    label: "Executive read-only",
    short: "Exec",
    title: "Executive read-only · visibilidad sin edición",
    permissions: ["view", "export-mock"],
    modules: ["Resumen ejecutivo", "Clientes", "Reportes", "Notificaciones"],
  },
};

const permissionLabels: Record<string, string> = {
  view: "Lectura",
  create: "Crear",
  edit: "Editar",
  "approve-mock": "Aprobación mock",
  "manage-users-interface": "Usuarios UI",
  "dispatch-interface": "Despacho UI",
  "hr-interface": "HR UI",
  "view-self": "Lectura propia",
  "submit-mock": "Enviar mock",
  acknowledge: "Acusar recibo",
  "export-mock": "Exportar mock",
};

const roleActionAccess: Record<string, RoleId[]> = {
  view: ["administration", "operations", "human-resources", "drivers", "executive"],
  create: ["administration", "operations", "human-resources"],
  edit: ["administration", "operations", "human-resources"],
  "approve-mock": ["administration"],
  "manage-users-interface": ["administration"],
  "dispatch-interface": ["operations"],
  "hr-interface": ["human-resources"],
  "view-self": ["drivers"],
  "submit-mock": ["drivers"],
  acknowledge: ["drivers"],
  "export-mock": ["executive"],
};

const stats = [
  { label: "Entregas completadas", value: "1,284", delta: "+8.2%", tone: "mint", detail: "este mes" },
  { label: "Flota activa", value: "47", delta: "94%", tone: "blue", detail: "de 50 unidades" },
  { label: "Conductores disponibles", value: "32", delta: "+4", tone: "amber", detail: "en turno" },
  { label: "Satisfacción del cliente", value: "96.8%", delta: "+1.4%", tone: "violet", detail: "últimos 30 días" },
];

const activities = [
  ["Ruta JT-2847 completada", "Denver → Aurora", "Hace 8 min", "check"],
  ["Mantenimiento programado", "Unidad FL-038 · 29 Jul", "Hace 26 min", "truck"],
  ["Nuevo conductor incorporado", "Daniel Reyes · Región Norte", "Hace 1 h", "people"],
  ["Documento por revisar", "Póliza de seguro · FL-012", "Hace 2 h", "doc"],
] as const;

const moduleCopy: Record<WorkspaceModule, DomainConfig> = {
  "Recursos Humanos": {
    eyebrow: "Personas y cultura",
    title: "El equipo, en un solo lugar",
    copy: "Directorio, incorporación, licencias y documentación laboral preparados para futuras APIs.",
    accent: "people",
    formTitle: "Alta mock de colaborador",
    metrics: [{ label: "Colaboradores", value: "128" }, { label: "Onboarding activo", value: "6" }, { label: "Licencias", value: "14" }],
    filters: [{ label: "Región", values: ["Todas", "Norte", "Centro", "Oeste"] }, { label: "Contrato", values: ["Todos", "Full-time", "Part-time", "Seasonal"] }, { label: "Documental", values: ["Todos", "Completo", "Pendiente"] }],
    summary: ["Panel de headcount por región", "Cumplimiento documental simulado", "Cola de incorporaciones no operativa"],
    records: [
      { id: "HR-001", name: "Daniel Reyes", subtitle: "Supervisor regional · Norte", status: "Activo", updatedAt: "Hoy, 08:20", metric: "Expediente 98%", owner: "Talent Ops", route: "Onboarding > Expediente", health: "Operativo" },
      { id: "HR-002", name: "Marta Solís", subtitle: "Analista de talento · Centro", status: "Pendiente", updatedAt: "Ayer, 17:45", metric: "Onboarding", owner: "People Services", route: "Licencias > Revisión", health: "En revisión" },
      { id: "HR-003", name: "Kevin Brooks", subtitle: "Capacitación · Oeste", status: "Activo", updatedAt: "Hoy, 09:10", metric: "3 cursos", owner: "Learning Desk", route: "Capacitación > Seguimiento", health: "Operativo" },
      { id: "HR-004", name: "Leslie Moore", subtitle: "Recruiting · Norte", status: "Parcial", updatedAt: "Hoy, 10:05", metric: "2/3 docs", owner: "Talent Ops", route: "Candidatos > Expediente", health: "Atención" },
    ],
    detailSections: [{ title: "Perfil", items: ["Datos base simulados", "Asignación regional visible", "Estado contractual mock"] }, { title: "Cumplimiento", items: ["Checklist documental local", "Licencias y capacitación", "Alertas sin automatización"] }],
    internalTabs: [{ key: "primary", label: "Perfil", hint: "Ficha base" }, { key: "secondary", label: "Cumplimiento", hint: "Checks y alertas" }, { key: "tertiary", label: "Historial", hint: "Cambios recientes" }],
    actions: [{ label: "Crear expediente mock", permission: "create", tone: "primary", when: "always" }, { label: "Aprobar onboarding", permission: "hr-interface", tone: "ghost", when: "partial" }, { label: "Reintentar sincronía", permission: "edit", tone: "warning", when: "error" }, { label: "Exportar snapshot", permission: "export-mock", tone: "ghost", when: "ready" }],
    stages: [{ label: "Directorio", state: "done", detail: "Fixture consolidado" }, { label: "Onboarding", state: "current", detail: "Formulario base activo" }, { label: "Integración API futura", state: "next", detail: "Contrato separado" }],
    adapter: { endpoint: "/api/v1/human-resources", fixtureSet: "people-core.v2", requestShape: "HRWorkspaceQuery", responseShape: "HumanResourcesWorkspace", futureSource: "HR domain API", cacheKey: "hr-workspace" },
    error: "No fue posible cargar el tablero de licencias mock. Reintento local sugerido.",
    empty: "No hay candidatos simulados para esta combinación de filtros.",
    partial: "Parte del expediente está disponible, pero quedan campos pendientes en el fixture local.",
    refreshHint: "Última actualización local en 42 segundos.",
    state: "partial",
    totalRecords: 14,
  },
  Conductores: {
    eyebrow: "Operación en movimiento",
    title: "Conductores listos para la ruta",
    copy: "Disponibilidad, credenciales y desempeño en una vista clara y accionable.",
    accent: "driver",
    formTitle: "Asignación mock de turno",
    metrics: [{ label: "Disponibles", value: "32" }, { label: "En ruta", value: "21" }, { label: "Credenciales por vencer", value: "4" }],
    filters: [{ label: "Terminal", values: ["Todas", "Denver", "Aurora", "Pueblo"] }, { label: "Disponibilidad", values: ["Todas", "Disponible", "En ruta", "Pendiente"] }, { label: "Vigencia CDL", values: ["Todas", "Al día", "Próxima", "Vencida"] }],
    summary: ["Lista priorizada por disponibilidad", "Detalle de credenciales simulado", "Flujo de ack para mensajes internos"],
    records: [
      { id: "DRV-101", name: "Alicia Moore", subtitle: "Terminal Denver · Clase A", status: "Disponible", updatedAt: "Hace 12 min", metric: "Score 97", owner: "Dispatch West", route: "Disponibilidad > Turnos", severity: "Media", health: "Operativo" },
      { id: "DRV-144", name: "Jorge Medina", subtitle: "Terminal Aurora · Sleeper", status: "En ruta", updatedAt: "Hace 4 min", metric: "ETA 13:40", owner: "Linehaul", route: "Ruta > Seguimiento", severity: "Baja", health: "Operativo" },
      { id: "DRV-188", name: "Pam Fields", subtitle: "Terminal Pueblo · Local", status: "Pendiente", updatedAt: "Hace 1 h", metric: "Docs 2/3", owner: "Driver Care", route: "Credenciales > Revisión", severity: "Alta", health: "Atención" },
      { id: "DRV-204", name: "Marco Hill", subtitle: "Terminal Denver · Relay", status: "Parcial", updatedAt: "Hace 18 min", metric: "Ack 1/2", owner: "Dispatch Core", route: "Mensajes > Ack", severity: "Media", health: "En revisión" },
    ],
    detailSections: [{ title: "Disponibilidad", items: ["Estado de turno", "Terminal asignada", "ETA simulado"] }, { title: "Credenciales", items: ["Vigencia CDL", "Checklist documental", "Mensajes por ack mock"] }],
    internalTabs: [{ key: "primary", label: "Disponibilidad", hint: "Turnos y cola" }, { key: "secondary", label: "Credenciales", hint: "Revisión" }, { key: "tertiary", label: "Mensajes", hint: "Ack y refresh" }],
    actions: [{ label: "Asignar turno mock", permission: "dispatch-interface", tone: "primary", when: "always" }, { label: "Enviar confirmación", permission: "submit-mock", tone: "ghost", when: "partial" }, { label: "Ver autoservicio", permission: "view-self", tone: "ghost", when: "ready" }, { label: "Retry local", permission: "edit", tone: "warning", when: "error" }],
    stages: [{ label: "Disponibilidad", state: "done", detail: "Vista consolidada" }, { label: "Ack de mensajes", state: "current", detail: "Rol conductor visible" }, { label: "Adaptador API futura", state: "next", detail: "Sin ELD real" }],
    adapter: { endpoint: "/api/v1/drivers", fixtureSet: "drivers-liveboard.v2", requestShape: "DriverWorkspaceQuery", responseShape: "DriverWorkspace", futureSource: "Driver operations API", cacheKey: "drivers-workspace" },
    error: "El mock de telemetría del conductor no respondió. No se consulta ELD real.",
    empty: "No hay conductores simulados disponibles para el filtro seleccionado.",
    partial: "La vista muestra datos base, pero las credenciales permanecen parcialmente cargadas desde fixtures.",
    refreshHint: "Refresh visual disponible sin conectar ELD real.",
    state: "loading",
    totalRecords: 32,
  },
  Flota: {
    eyebrow: "Activos y mantenimiento",
    title: "Control visual de la flota",
    copy: "Estado, ubicación simulada y próximos servicios de cada unidad.",
    accent: "truck",
    formTitle: "Programación mock de mantenimiento",
    metrics: [{ label: "Unidades activas", value: "47" }, { label: "Taller", value: "3" }, { label: "Próximo servicio", value: "5" }],
    filters: [{ label: "Estado", values: ["Todos", "Activo", "Mantenimiento", "Pendiente"] }, { label: "Terminal", values: ["Todas", "Denver", "Aurora", "Pueblo"] }, { label: "Tipo", values: ["Todos", "Tractor", "Trailer", "Reefer"] }],
    summary: ["Mapa y rutas solo visuales", "Calendario mock de servicios", "Alertas de mantenimiento sin backend"],
    records: [
      { id: "FLT-038", name: "Volvo VNL 760", subtitle: "Aurora · Tractor sleeper", status: "Mantenimiento", updatedAt: "29 Jul", metric: "Servicio A", owner: "Fleet Care", route: "Mantenimiento > Agenda", health: "En revisión" },
      { id: "FLT-012", name: "Freightliner Cascadia", subtitle: "Denver · Tractor linehaul", status: "Activo", updatedAt: "Hace 25 min", metric: "94% uptime", owner: "Dispatch Core", route: "Disponibilidad > Patio", health: "Operativo" },
      { id: "FLT-044", name: "Utility Reefer", subtitle: "Pueblo · Trailer", status: "Pendiente", updatedAt: "Hoy, 11:05", metric: "Inspección", owner: "Yard Ops", route: "Inspección > Cola", health: "Atención" },
      { id: "FLT-061", name: "Kenworth T680", subtitle: "Denver · Tractor regional", status: "Parcial", updatedAt: "Hace 33 min", metric: "Parts 2/4", owner: "Fleet Care", route: "Repuestos > Seguimiento", health: "En revisión" },
    ],
    detailSections: [{ title: "Activo", items: ["Ubicación visual", "Tipo de unidad", "Estado de servicio"] }, { title: "Mantenimiento", items: ["Calendario mock", "Semáforos de revisión", "Sin telemetría real"] }],
    internalTabs: [{ key: "primary", label: "Activo", hint: "Disponibilidad" }, { key: "secondary", label: "Mantenimiento", hint: "Servicios y agenda" }, { key: "tertiary", label: "Cobertura", hint: "Cobertura regional" }],
    actions: [{ label: "Programar servicio", permission: "edit", tone: "primary", when: "always" }, { label: "Actualizar estado", permission: "dispatch-interface", tone: "ghost", when: "partial" }, { label: "Retry local", permission: "edit", tone: "warning", when: "error" }],
    stages: [{ label: "Inventario", state: "done", detail: "Fixture local" }, { label: "Mantenimiento", state: "current", detail: "Panel de servicio" }, { label: "API telemetría futura", state: "next", detail: "No conectada" }],
    adapter: { endpoint: "/api/v1/fleet", fixtureSet: "fleet-control.v2", requestShape: "FleetWorkspaceQuery", responseShape: "FleetWorkspace", futureSource: "Fleet domain API", cacheKey: "fleet-workspace" },
    error: "La capa mock de disponibilidad no completó el refresh visual de flota.",
    empty: "No hay unidades simuladas en esta terminal.",
    partial: "La flota quedó visible con alertas parciales de mantenimiento provenientes solo de fixtures.",
    refreshHint: "El refresh solo recalcula el orden visual local.",
    state: "partial",
    totalRecords: 47,
  },
  Clientes: {
    eyebrow: "Relaciones comerciales",
    title: "Una visión completa del cliente",
    copy: "Cuentas, contactos, actividad y servicio, sin conectar sistemas operativos.",
    accent: "client",
    formTitle: "Alta mock de cuenta",
    metrics: [{ label: "Cuentas activas", value: "84" }, { label: "Renovaciones", value: "9" }, { label: "SLA simulado", value: "96.8%" }],
    filters: [{ label: "Segmento", values: ["Todos", "Estratégico", "Regional", "Nacional"] }, { label: "Región", values: ["Todas", "Denver", "Boulder", "Colorado Springs"] }, { label: "Estado", values: ["Todos", "Activo", "Pendiente"] }],
    summary: ["Pipeline visual sin CRM real", "Detalle de contactos y SLA mock", "Búsqueda y filtros compartidos con otros módulos"],
    records: [
      { id: "CL-201", name: "Rocky Mountain Foods", subtitle: "Cuenta estratégica · Denver", status: "Activo", updatedAt: "Hoy, 10:15", metric: "SLA 99%", owner: "Commercial West", route: "Cuenta > Servicio", health: "Operativo" },
      { id: "CL-244", name: "Front Range Retail", subtitle: "Cuenta regional · Boulder", status: "Pendiente", updatedAt: "Ayer, 14:00", metric: "Renovación", owner: "Account Desk", route: "Renovación > Revisión", health: "En revisión" },
      { id: "CL-269", name: "Mesa Industrial", subtitle: "Cuenta nacional · Colorado Springs", status: "Activo", updatedAt: "Hace 40 min", metric: "12 lanes", owner: "Enterprise Team", route: "Cobertura > Operación", health: "Operativo" },
      { id: "CL-277", name: "Canyon Fresh", subtitle: "Cuenta regional · Denver", status: "Parcial", updatedAt: "Hace 55 min", metric: "Contactos 2/3", owner: "Account Desk", route: "Cuenta > Contactos", health: "Atención" },
    ],
    detailSections: [{ title: "Cuenta", items: ["Segmento y cobertura", "Contactos visibles", "SLA mock"] }, { title: "Servicio", items: ["Lanes priorizados", "Actividad reciente", "Renovaciones simuladas"] }],
    internalTabs: [{ key: "primary", label: "Cuenta", hint: "Vista comercial" }, { key: "secondary", label: "Servicio", hint: "Cobertura y SLA" }, { key: "tertiary", label: "Actividad", hint: "Seguimiento local" }],
    actions: [{ label: "Crear cuenta mock", permission: "create", tone: "primary", when: "always" }, { label: "Preparar renovación", permission: "edit", tone: "ghost", when: "partial" }, { label: "Exportar resumen", permission: "export-mock", tone: "ghost", when: "ready" }],
    stages: [{ label: "Cartera", state: "done", detail: "Catálogo local" }, { label: "SLA y actividad", state: "current", detail: "Vista ampliada" }, { label: "CRM/API futura", state: "next", detail: "Sin integración real" }],
    adapter: { endpoint: "/api/v1/clients", fixtureSet: "commercial-accounts.v2", requestShape: "ClientWorkspaceQuery", responseShape: "ClientWorkspace", futureSource: "Customer domain API", cacheKey: "clients-workspace" },
    error: "El resumen comercial mock no se pudo hidratar. No se usa CRM operativo.",
    empty: "No hay clientes simulados que cumplan los filtros activos.",
    partial: "Algunas cuentas muestran SLA y contactos base, con historial detallado aún parcial en fixture local.",
    refreshHint: "La búsqueda y el ordenamiento se recomputan localmente.",
    state: "ready",
    totalRecords: 84,
  },
  Proveedores: {
    eyebrow: "Red de suministro",
    title: "Proveedores organizados",
    copy: "Perfiles, categorías y estado documental preparados para integración.",
    accent: "vendor",
    formTitle: "Alta mock de proveedor",
    metrics: [{ label: "Proveedores activos", value: "56" }, { label: "Categorías", value: "8" }, { label: "Vencimientos próximos", value: "7" }],
    filters: [{ label: "Categoría", values: ["Todas", "Combustible", "Taller", "PPE"] }, { label: "Cobertura", values: ["Todas", "Regional", "Norte", "Multi-site"] }, { label: "Documental", values: ["Todos", "Activo", "Pendiente"] }],
    summary: ["Catálogo de proveedores simulado", "Semáforos documentales no conectados", "Pestañas para perfil, cobertura y riesgo mock"],
    records: [
      { id: "VN-021", name: "Atlas Fuel Services", subtitle: "Combustible · Regional", status: "Activo", updatedAt: "Hace 30 min", metric: "3 contratos", owner: "Procurement", route: "Perfil > Cobertura", health: "Operativo" },
      { id: "VN-044", name: "Peak Repairs", subtitle: "Taller móvil · Norte", status: "Pendiente", updatedAt: "Hoy, 07:50", metric: "COI vence", owner: "Fleet Support", route: "Riesgo > Seguro", health: "Atención" },
      { id: "VN-052", name: "Mesa Safety Supply", subtitle: "PPE · Multi-site", status: "Activo", updatedAt: "Ayer, 18:10", metric: "12 SKUs", owner: "Ops Supply", route: "Catálogo > Seguimiento", health: "Operativo" },
    ],
    detailSections: [{ title: "Perfil", items: ["Cobertura simulada", "Categoría de servicio", "Propietario interno"] }, { title: "Riesgo", items: ["Estado documental", "COI y contratos mock", "Sin sourcing real"] }],
    internalTabs: [{ key: "primary", label: "Perfil", hint: "Ficha base" }, { key: "secondary", label: "Cobertura", hint: "Huella regional" }, { key: "tertiary", label: "Riesgo", hint: "Riesgo documental" }],
    actions: [{ label: "Registrar proveedor", permission: "create", tone: "primary", when: "always" }, { label: "Revisar vencimientos", permission: "edit", tone: "ghost", when: "partial" }],
    stages: [{ label: "Catálogo", state: "done", detail: "Fixture listo" }, { label: "Riesgo documental", state: "current", detail: "Semáforos mock" }, { label: "API compras futura", state: "next", detail: "Sin pagos reales" }],
    adapter: { endpoint: "/api/v1/vendors", fixtureSet: "vendor-network.v2", requestShape: "VendorWorkspaceQuery", responseShape: "VendorWorkspace", futureSource: "Vendor management API", cacheKey: "vendors-workspace" },
    error: "La evaluación mock de riesgo de proveedor no pudo cargar.",
    empty: "No hay proveedores simulados bajo la categoría actual.",
    partial: "El riesgo documental está disponible parcialmente y mantiene el resto del contrato desacoplado.",
    refreshHint: "El filtro persistente conserva la categoría elegida.",
    state: "empty",
    totalRecords: 56,
  },
  Documentos: {
    eyebrow: "Información gobernada",
    title: "Documentos con contexto",
    copy: "Experiencia visual no operativa, sin acceso al runtime documental ni SharePoint.",
    accent: "doc",
    formTitle: "Registro mock de documento",
    metrics: [{ label: "Expedientes", value: "412" }, { label: "Por revisar", value: "18" }, { label: "Plantillas", value: "24" }],
    filters: [{ label: "Tipo", values: ["Todos", "Seguro", "Onboarding", "Contrato"] }, { label: "Estado", values: ["Todos", "Pendiente", "Activo", "Error mock"] }, { label: "Propietario", values: ["Todos", "Document Control", "People Docs", "Legal Support"] }],
    summary: ["Listado documental basado en fixtures", "Sin lectura de SharePoint operativo", "Sin intake ni automatización de negocio"],
    records: [
      { id: "DOC-118", name: "Póliza FL-012", subtitle: "Seguro flota · Renovación", status: "Pendiente", updatedAt: "Hoy, 09:42", metric: "Revisión legal", owner: "Document Control", route: "Seguro > Renovación", health: "Atención" },
      { id: "DOC-145", name: "Kit onboarding DRV-188", subtitle: "Conductores · Alta mock", status: "Activo", updatedAt: "Hace 15 min", metric: "4 adjuntos", owner: "People Docs", route: "Onboarding > Bundle", health: "Operativo" },
      { id: "DOC-151", name: "Contrato vendor VN-044", subtitle: "Proveedores · COI", status: "Error mock", updatedAt: "Ayer, 16:30", metric: "Falta firma", owner: "Legal Support", route: "Contratos > Excepción", health: "Atención" },
    ],
    detailSections: [{ title: "Expediente", items: ["Metadatos simulados", "Propietario visible", "Estado del expediente"] }, { title: "Revisión", items: ["Checklist mock", "Trazas visuales", "Sin intake real"] }],
    internalTabs: [{ key: "primary", label: "Expediente", hint: "Ficha visible" }, { key: "secondary", label: "Revisión", hint: "Checklist" }, { key: "tertiary", label: "Adjuntos", hint: "Metadatos" }],
    actions: [{ label: "Registrar documento", permission: "create", tone: "primary", when: "always" }, { label: "Solicitar revisión", permission: "edit", tone: "ghost", when: "partial" }, { label: "Retry local", permission: "edit", tone: "warning", when: "error" }],
    stages: [{ label: "Listado", state: "done", detail: "Fixtures locales" }, { label: "Estado de revisión", state: "current", detail: "Error mock controlado" }, { label: "Adaptador documental futuro", state: "next", detail: "Sin SharePoint operativo" }],
    adapter: { endpoint: "/api/v1/documents", fixtureSet: "document-registry.v2", requestShape: "DocumentWorkspaceQuery", responseShape: "DocumentWorkspace", futureSource: "Document services API", cacheKey: "documents-workspace" },
    error: "Error mock controlado en la vista documental. No se accede a runtime documental ni SharePoint operativo.",
    empty: "No hay documentos simulados asociados a este filtro.",
    partial: "La metadata de adjuntos está disponible, pero el detalle de revisión se mantiene parcial para simular respuestas incompletas.",
    refreshHint: "El retry vuelve a calcular solo el fixture local.",
    state: "error",
    totalRecords: 412,
  },
  Reportes: {
    eyebrow: "Inteligencia empresarial",
    title: "Decisiones con perspectiva",
    copy: "Catálogo inicial de reportes con datos exclusivamente simulados.",
    accent: "chart",
    formTitle: "Solicitud mock de reporte",
    metrics: [{ label: "Reportes publicados", value: "14" }, { label: "Widgets", value: "28" }, { label: "Cortes", value: "Diario" }],
    filters: [{ label: "Audiencia", values: ["Todas", "Operaciones", "HR", "Executive"] }, { label: "Periodicidad", values: ["Todas", "Diario", "Semanal", "Mensual"] }, { label: "Dominio", values: ["Todos", "Operaciones", "People", "Customer"] }],
    summary: ["Tablero y catálogo mock desacoplados", "Exportación visual no operativa", "Sin mezcla con lógica financiera real", "Frontera preparada para api-real con fallback"],
    records: [
      { id: "REP-01", name: "Pulse operativo", subtitle: "Operaciones · Diario", status: "Activo", updatedAt: "Hoy, 06:00", metric: "7 widgets", owner: "BI Mock", route: "Catálogo > Diario", health: "Operativo" },
      { id: "REP-08", name: "People snapshot", subtitle: "HR · Semanal", status: "Activo", updatedAt: "Lun, 08:00", metric: "5 widgets", owner: "People Analytics", route: "Catálogo > Semanal", health: "Operativo" },
      { id: "REP-12", name: "Customer health", subtitle: "Executive · Mensual", status: "Pendiente", updatedAt: "01 Ago mock", metric: "Borrador", owner: "Executive Insights", route: "Borradores > Aprobación", health: "En revisión" },
      { id: "REP-18", name: "Alerts digest", subtitle: "Cross-domain · Diario", status: "Parcial", updatedAt: "Hoy, 07:25", metric: "3/5 widgets", owner: "Portal Analytics", route: "Widgets > Coverage", health: "Atención" },
    ],
    detailSections: [{ title: "Catálogo", items: ["Periodicidad", "Audiencia", "Origen fixture"] }, { title: "Consumo", items: ["Widgets visibles", "Estados de carga", "Exportación no operativa"] }],
    internalTabs: [{ key: "primary", label: "Catálogo", hint: "Inventario" }, { key: "secondary", label: "Widgets", hint: "Cobertura parcial" }, { key: "tertiary", label: "Programación", hint: "No operativa" }],
    actions: [{ label: "Solicitar reporte", permission: "create", tone: "primary", when: "always" }, { label: "Abrir dashboard", permission: "view", tone: "ghost", when: "ready" }, { label: "Exportar vista", permission: "export-mock", tone: "ghost", when: "partial" }],
    stages: [{ label: "Catálogo", state: "done", detail: "Reportes mock" }, { label: "Consumo multirol", state: "current", detail: "Resumen + detalle" }, { label: "API analítica futura", state: "next", detail: "Sin mezcla financiera real" }],
    adapter: { endpoint: "/api/v1/reports", fixtureSet: "insights-catalog.v2", requestShape: "ReportWorkspaceQuery", responseShape: "ReportWorkspace", futureSource: "Reporting API", cacheKey: "reports-workspace" },
    error: "El dataset mock del reporte no quedó disponible. No se consultan fuentes reales.",
    empty: "No hay reportes simulados para esta audiencia.",
    partial: "El catálogo se mantiene estable y algunos widgets llegan en modo parcial para validar fallback de UX.",
    refreshHint: "El refresh repinta widgets locales y conserva filtros persistentes.",
    state: "partial",
    totalRecords: 14,
  },
  Administración: {
    eyebrow: "Control de acceso",
    title: "Administración segura por diseño",
    copy: "Roles, permisos y auditoría visual listos para conectarse a servicios reales.",
    accent: "shield",
    formTitle: "Alta mock de rol",
    metrics: [{ label: "Roles UI", value: "5" }, { label: "Políticas mock", value: "12" }, { label: "Alertas", value: "3" }],
    filters: [{ label: "Rol", values: ["Todos", "Administration", "Operations", "Human Resources", "Executive"] }, { label: "Módulo", values: ["Todos", "Conductores", "Documentos", "Configuración"] }, { label: "Política", values: ["Todas", "Activa", "Pendiente"] }],
    summary: ["Gobierno visual de roles", "Matriz por módulo reutilizable", "Sin control real de identidad ni permisos backend"],
    records: [
      { id: "ADM-01", name: "Administración", subtitle: "Cobertura total de interfaz", status: "Activo", updatedAt: "Hoy, 08:30", metric: "11 módulos", owner: "Platform Admin", route: "Roles > Matriz", health: "Operativo" },
      { id: "ADM-03", name: "Human Resources", subtitle: "Acceso personas y documentos", status: "Activo", updatedAt: "Hoy, 09:05", metric: "6 módulos", owner: "Identity Mock", route: "Roles > Alcance", health: "Operativo" },
      { id: "ADM-05", name: "Executive read-only", subtitle: "Visibilidad sin edición", status: "Pendiente", updatedAt: "Ayer, 12:10", metric: "4 módulos", owner: "Audit Desk", route: "Revisión > Excepciones", health: "En revisión" },
      { id: "ADM-09", name: "Operations", subtitle: "Despacho y flota", status: "Parcial", updatedAt: "Hoy, 11:10", metric: "2 excepciones", owner: "Platform Admin", route: "Políticas > Review", health: "Atención" },
    ],
    detailSections: [{ title: "Rol", items: ["Permisos visuales", "Módulos visibles", "Estados mock"] }, { title: "Auditoría", items: ["Actividad simulada", "Alertas locales", "Sin identidad real"] }],
    internalTabs: [{ key: "primary", label: "Rol", hint: "Matriz base" }, { key: "secondary", label: "Políticas", hint: "Excepciones" }, { key: "tertiary", label: "Auditoría", hint: "Eventos locales" }],
    actions: [{ label: "Crear rol mock", permission: "manage-users-interface", tone: "primary", when: "always" }, { label: "Revisar permisos", permission: "approve-mock", tone: "ghost", when: "partial" }],
    stages: [{ label: "Roles", state: "done", detail: "Matriz estable" }, { label: "Políticas UI", state: "current", detail: "Acciones por rol" }, { label: "IAM/API futura", state: "next", detail: "Sin control backend" }],
    adapter: { endpoint: "/api/v1/administration", fixtureSet: "role-governance.v2", requestShape: "AdministrationWorkspaceQuery", responseShape: "AdministrationWorkspace", futureSource: "Identity governance API", cacheKey: "administration-workspace" },
    error: "La matriz mock de permisos no se pudo sincronizar con los fixtures locales.",
    empty: "No hay políticas simuladas bajo este filtro.",
    partial: "La matriz de políticas combina filas listas y parciales para validar privilegios condicionados por rol.",
    refreshHint: "El refresh no muta permisos reales y conserva la selección.",
    state: "partial",
    totalRecords: 12,
  },
  Configuración: {
    eyebrow: "Identidad empresarial",
    title: "Tu empresa, a tu manera",
    copy: "Preferencias, sedes y parámetros presentados como configuración no operativa.",
    accent: "gear",
    formTitle: "Ajuste mock de preferencia",
    metrics: [{ label: "Sedes", value: "4" }, { label: "Preferencias", value: "17" }, { label: "Perfiles", value: "5" }],
    filters: [{ label: "Dominio", values: ["Todos", "Branding", "Autoservicio", "Alertas"] }, { label: "Sede", values: ["Todas", "Denver", "Aurora", "Pueblo"] }, { label: "Propietario", values: ["Todos", "Brand Ops", "Mobile UX", "Portal Config"] }],
    summary: ["Parámetros visuales sin efecto operativo", "Preferencias reutilizan el mismo formulario base", "Preparado para futuros contratos reales"],
    records: [
      { id: "CFG-11", name: "Branding regional", subtitle: "Denver · Identidad", status: "Activo", updatedAt: "Ayer, 19:20", metric: "Tema 2", owner: "Brand Ops", route: "Marca > Regional", health: "Operativo" },
      { id: "CFG-14", name: "Preferencias conductor", subtitle: "Autoservicio · Móvil", status: "Pendiente", updatedAt: "Hoy, 08:05", metric: "3 flags", owner: "Mobile UX", route: "Preferencias > Driver", health: "En revisión" },
      { id: "CFG-17", name: "Parámetros de alerta", subtitle: "Centro de actividad", status: "Activo", updatedAt: "Hace 1 h", metric: "12 reglas UI", owner: "Portal Config", route: "Alertas > Reglas", health: "Operativo" },
    ],
    detailSections: [{ title: "Preferencias", items: ["Branding visual", "Flags de experiencia", "Sin efecto operativo"] }, { title: "Parámetros", items: ["Sedes y perfiles", "Reglas de alerta", "Preparado para contratos futuros"] }],
    internalTabs: [{ key: "primary", label: "Preferencias", hint: "Base visual" }, { key: "secondary", label: "Parámetros", hint: "Reglas UI" }, { key: "tertiary", label: "Perfiles", hint: "Segmentación" }],
    actions: [{ label: "Editar preferencia", permission: "edit", tone: "primary", when: "always" }, { label: "Ver perfiles", permission: "view", tone: "ghost", when: "ready" }],
    stages: [{ label: "Preferencias", state: "done", detail: "Fixture estable" }, { label: "Parámetros reutilizables", state: "current", detail: "Consistencia UI" }, { label: "API settings futura", state: "next", detail: "Sin runtime real" }],
    adapter: { endpoint: "/api/v1/company-settings", fixtureSet: "company-settings.v2", requestShape: "CompanySettingsQuery", responseShape: "CompanySettingsWorkspace", futureSource: "Company settings API", cacheKey: "configuration-workspace" },
    error: "La configuración mock no se pudo renderizar en este intento.",
    empty: "No hay preferencias simuladas en esta categoría.",
    partial: "La configuración mantiene estructura lista para endpoints, con algunas reglas todavía en partial data.",
    refreshHint: "Las tabs conservan estado entre cambios de módulo.",
    state: "ready",
    totalRecords: 17,
  },
  Notificaciones: {
    eyebrow: "Centro de actividad",
    title: "Lo importante, sin ruido",
    copy: "Alertas simuladas priorizadas por contexto, módulo y nivel de atención.",
    accent: "bell",
    formTitle: "Regla mock de notificación",
    metrics: [{ label: "Sin leer", value: "3" }, { label: "Prioridad alta", value: "2" }, { label: "Canales UI", value: "4" }],
    filters: [{ label: "Severidad", values: ["Todas", "Alta", "Media", "Baja"] }, { label: "Módulo", values: ["Todos", "Documentos", "Conductores", "Proveedores"] }, { label: "Estado", values: ["Todos", "Sin leer", "Ack pendiente", "Seguimiento"] }],
    summary: ["Inbox unificado de actividad mock", "Bandeja móvil y desktop consistente", "Sin correo, Graph ni automatizaciones reales"],
    records: [
      { id: "NT-301", name: "Vencimiento documental", subtitle: "Documentos · FL-012", status: "Alta", updatedAt: "Hace 6 min", metric: "Crítico", owner: "Activity Center", route: "Inbox > Prioridad alta", severity: "Alta", health: "Atención" },
      { id: "NT-314", name: "Turno confirmado", subtitle: "Conductores · DRV-101", status: "Media", updatedAt: "Hace 18 min", metric: "Ack pendiente", owner: "Driver Comms", route: "Inbox > Confirmaciones", severity: "Media", health: "En revisión" },
      { id: "NT-321", name: "Revisión de contrato", subtitle: "Proveedores · VN-044", status: "Baja", updatedAt: "Hoy, 07:45", metric: "Seguimiento", owner: "Vendor Alerts", route: "Inbox > Seguimiento", severity: "Baja", health: "Operativo" },
      { id: "NT-330", name: "Refresh pendiente", subtitle: "Reportes · REP-18", status: "Parcial", updatedAt: "Hace 11 min", metric: "Widget incompleto", owner: "Portal Analytics", route: "Inbox > Refresh", severity: "Media", health: "Atención" },
    ],
    detailSections: [{ title: "Inbox", items: ["Severidad", "Dominio origen", "Estado de lectura mock"] }, { title: "Entrega", items: ["Canales visuales", "Ack por rol", "Sin correo ni Graph"] }],
    internalTabs: [{ key: "primary", label: "Inbox", hint: "Prioridad" }, { key: "secondary", label: "Canales", hint: "Cobertura UI" }, { key: "tertiary", label: "Reglas", hint: "Preferencias locales" }],
    actions: [{ label: "Marcar leído mock", permission: "acknowledge", tone: "primary", when: "partial" }, { label: "Crear regla", permission: "edit", tone: "ghost", when: "ready" }, { label: "Ver severidades", permission: "view", tone: "ghost", when: "always" }, { label: "Retry local", permission: "edit", tone: "warning", when: "error" }],
    stages: [{ label: "Inbox", state: "done", detail: "Desktop y mobile" }, { label: "Canales por rol", state: "current", detail: "Acciones coherentes" }, { label: "API notificaciones futura", state: "next", detail: "Sin correo real" }],
    adapter: { endpoint: "/api/v1/notifications", fixtureSet: "activity-center.v2", requestShape: "NotificationWorkspaceQuery", responseShape: "NotificationWorkspace", futureSource: "Notification hub API", cacheKey: "notifications-workspace" },
    error: "El feed mock de alertas no se pudo ordenar. No se usa correo ni Graph operativo.",
    empty: "No hay notificaciones simuladas en esta bandeja.",
    partial: "La bandeja conserva eventos clave mientras un subconjunto de reglas permanece en partial data.",
    refreshHint: "Las notificaciones conservan selección de filas y tab activa.",
    state: "partial",
    totalRecords: 19,
  },
};

const tabs: { id: TabId; label: string; icon: IconName }[] = [
  { id: "listado", label: "Listado", icon: "grid" },
  { id: "detalle", label: "Detalle", icon: "spark" },
  { id: "resumen", label: "Resumen", icon: "chart" },
  { id: "formulario", label: "Formulario", icon: "form" },
];

const moduleStateLabel: Record<MockState, string> = {
  ready: "Ready mock",
  loading: "Loading mock",
  empty: "Empty mock",
  error: "Error mock",
  partial: "Partial data",
};

const globalIntegrationMode = resolveIntegrationMode(
  process.env.NEXT_PUBLIC_PORTAL_API_MODE,
  process.env.NEXT_PUBLIC_PORTAL_DOMAIN_REPORTES_SOURCE,
);

const storageKey = "joned-02a05-portal-state";

function getDefaultWorkspaceState(): PersistedModuleState {
  return { filters: {}, internalTab: "primary", sortField: "updatedAt", sortDirection: "desc", page: 1, selectedIds: [], expandedId: null };
}

function normalizePersistedState(value: unknown): PersistedModuleState {
  const fallback = getDefaultWorkspaceState();
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as Partial<PersistedModuleState>;
  return {
    filters: typeof candidate.filters === "object" && candidate.filters ? candidate.filters as Record<string, string> : {},
    internalTab: candidate.internalTab ?? "primary",
    sortField: candidate.sortField ?? "updatedAt",
    sortDirection: candidate.sortDirection ?? "desc",
    page: typeof candidate.page === "number" && candidate.page > 0 ? candidate.page : 1,
    selectedIds: Array.isArray(candidate.selectedIds) ? candidate.selectedIds : [],
    expandedId: typeof candidate.expandedId === "string" ? candidate.expandedId : null,
  };
}

export default function Home() {
  const [active, setActive] = useState<ModuleName>("Resumen ejecutivo");
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<RoleId>("administration");
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tab, setTab] = useState<TabId>("listado");
  const [workspaceState, setWorkspaceState] = useState<Record<WorkspaceModule, PersistedModuleState>>(() => {
    const base = {} as Record<WorkspaceModule, PersistedModuleState>;
    (Object.keys(moduleCopy) as WorkspaceModule[]).forEach((module) => {
      base[module] = getDefaultWorkspaceState();
    });
    if (typeof window === "undefined") return base;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return base;
    try {
      const parsed = JSON.parse(raw) as Partial<Record<WorkspaceModule, PersistedModuleState>>;
      (Object.keys(moduleCopy) as WorkspaceModule[]).forEach((module) => {
        base[module] = normalizePersistedState(parsed[module]);
      });
      return base;
    } catch {
      window.localStorage.removeItem(storageKey);
      return base;
    }
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const deferredSearch = useDeferredValue(searchValue);
  const currentRole = roles[role];

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(workspaceState));
  }, [workspaceState]);

  const visibleModules = modules.filter(([label]) => currentRole.modules.includes(label));

  function handleRefresh() {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 900);
  }

  return (
    <main className="app-shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="sidebar-head"><Brand /><button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><Icon name="close" /></button></div>
        <div className="workspace"><span>ESPACIO DE TRABAJO</span><b>JONED Transport Co.</b><small>Denver, Colorado</small></div>
        <div className="role-switcher" aria-label="Rol simulado">
          {(Object.keys(roles) as RoleId[]).map((id) => (
            <button
              key={id}
              className={role === id ? "selected" : ""}
              onClick={() => {
                setRole(id);
                if (!roles[id].modules.includes(active)) {
                  setActive("Resumen ejecutivo");
                  setTab("listado");
                }
              }}
            >
              {roles[id].short}
            </button>
          ))}
        </div>
        <nav className="side-nav" aria-label="Módulos del portal">
          {visibleModules.map(([label, icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setTab("listado"); setMenuOpen(false); }}><Icon name={icon} /><span>{label}</span>{label === "Notificaciones" && <i>3</i>}</button>)}
          {modules.filter(([label]) => !currentRole.modules.includes(label)).map(([label, icon]) => <button key={label} className="locked" aria-disabled="true" title="No visible para este rol simulado"><Icon name={icon} /><span>{label}</span><Icon name="lock" size={13} /></button>)}
        </nav>
        <div className="user-card"><div className="avatar">AM</div><div><b>Alex Morgan</b><span>{currentRole.label}</span></div><button type="button" title="Sesión protegida por el sitio"><Icon name="lock" size={14} /></button></div>
      </aside>
      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />}
      <section className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Icon name="menu" /></button>
          <div className="search"><Icon name="search" size={18} /><input aria-label="Buscar" placeholder="Buscar en el portal…" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} /><kbd>⌘ K</kbd></div>
          <div className="top-actions">
            <span className="mock-badge">
              {globalIntegrationMode === "api-real"
                ? "MODO MIXTO · REPORTES API-REAL"
                : "MODO MOCK · FIXTURES LOCALES"}
            </span>
            <button aria-label="Refresh visual" onClick={handleRefresh}><Icon name="refresh" /></button>
            <button aria-label="Notificaciones"><Icon name="bell" /><i /></button>
            <div className="avatar small">AM</div>
          </div>
        </header>
        {active === "Resumen ejecutivo"
          ? <Dashboard role={currentRole} onOpen={() => setShowModal(true)} isRefreshing={isRefreshing} />
          : <ModuleWorkspace
              name={active}
              role={currentRole}
              roleId={role}
              searchValue={deferredSearch}
              tab={tab}
              onTabChange={setTab}
              onOpen={() => setShowModal(true)}
              isRefreshing={isRefreshing}
              state={workspaceState[active]}
              onStateChange={(next) => setWorkspaceState((prev) => ({ ...prev, [active]: next }))}
            />}
      </section>
      {showModal && <div className="modal-layer" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="permissions-title"><button className="modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar"><Icon name="close" /></button><span>PERMISOS DE INTERFAZ</span><h2 id="permissions-title">{currentRole.title}</h2><p>Esta matriz es mock y gobierna solo visibilidad de interfaz. La autorización real deberá implementarse en APIs aprobadas.</p><div className="permission-pills">{currentRole.permissions.map((p) => <b key={p}>{permissionLabels[p] ?? p}</b>)}</div></section></div>}
    </main>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? "light" : ""}`}><span className="brand-mark">J</span><div><b>JONED</b><small>TRANSPORT CO.</small></div></div>;
}

function Dashboard({ role, onOpen, isRefreshing }: { role: RoleConfig; onOpen: () => void; isRefreshing: boolean }) {
  return <div className="content">
    <div className="page-heading"><div><span>SÁBADO, 25 DE JULIO DE 2026 · ENTORNO MOCK</span><h2>Buenos días, Alex.</h2><p>Aquí está el pulso de tu operación hoy.</p></div><button className="period">Últimos 30 días <span>⌄</span></button></div>
    <div className="stat-grid">{stats.map((s, i) => <article className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><Icon name={(["check", "truck", "driver", "chart"] as IconName[])[i]} /></div><span>{s.label}</span><div className="stat-value">{s.value}<em className={i === 2 ? "neutral" : ""}>{s.delta}</em></div><small>{s.detail}</small></article>)}</div>
    <section className="component-strip" aria-label="Estados reutilizables"><span className="badge success">Activo</span><span className="badge warning">Pendiente</span><span className="badge info">Solo lectura</span><span className="badge partial">Partial data</span><button className="filter-chip"><Icon name="filter" size={14} /> Filtro persistente</button><div className="loading-line" aria-label="Estado de carga simulado" /><span className="error-chip">Error mock controlado</span>{isRefreshing && <span className="badge info">Refresh visual</span>}</section>
    <div className="dashboard-grid">
      <article className="panel performance"><div className="panel-title"><div><span>RENDIMIENTO OPERATIVO</span><h3>Entregas por semana</h3></div><div className="legend"><i /> Completadas <i /> Objetivo</div></div><div className="chart-wrap"><div className="y-axis"><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div><div className="bars">{[68, 79, 66, 88, 76, 91, 83].map((h, i) => <div className="bar-col" key={i}><div className="goal" style={{ height: `${Math.min(h + 9, 98)}%` }} /><div className="bar" style={{ height: `${h}%` }} /><span>{["S1", "S2", "S3", "S4", "S5", "S6", "S7"][i]}</span></div>)}</div></div></article>
      <article className="panel fleet"><div className="panel-title"><div><span>ESTADO DE FLOTA</span><h3>Disponibilidad</h3></div><button>Ver flota <Icon name="arrow" size={14} /></button></div><div className="donut-row"><div className="donut"><div><b>47</b><span>activas</span></div></div><div className="fleet-legend"><p><i className="green" />En ruta <b>31</b></p><p><i className="blue-dot" />Disponibles <b>16</b></p><p><i className="orange" />Mantenimiento <b>3</b></p></div></div><div className="fleet-note"><Icon name="clock" size={17} /><span><b>Próximo servicio</b> · FL-038 en 2 días</span></div></article>
      <article className="panel activity"><div className="panel-title"><div><span>ACTIVIDAD RECIENTE</span><h3>Lo que está pasando</h3></div><button>Ver todo</button></div><div className="activity-list">{activities.map(([title, detail, time, icon]) => <div className="activity-item" key={title}><div className="activity-icon"><Icon name={icon as IconName} size={18} /></div><div><b>{title}</b><span>{detail}</span></div><time>{time}</time></div>)}</div></article>
      <article className="panel role-panel"><div className="role-head"><Icon name="shield" /><div><span>TU NIVEL DE ACCESO</span><h3>{role.title}</h3></div></div><p>Visibilidad actual: {role.modules.length} módulos. Los permisos son solamente de interfaz y usan fixtures locales.</p><div className="permissions">{role.permissions.slice(0, 3).map((p) => <span key={p}><Icon name="check" size={14} /> {permissionLabels[p] ?? p}</span>)}</div><button onClick={onOpen}>Revisar permisos <Icon name="arrow" size={14} /></button></article>
    </div>
    <footer className="data-note"><Icon name="shield" size={15} /> Todos los datos que ves en esta versión son simulados y no representan operaciones reales.</footer>
  </div>;
}

function ModuleWorkspace({
  name,
  role,
  roleId,
  searchValue,
  tab,
  onTabChange,
  onOpen,
  isRefreshing,
  state,
  onStateChange,
}: {
  name: WorkspaceModule;
  role: RoleConfig;
  roleId: RoleId;
  searchValue: string;
  tab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpen: () => void;
  isRefreshing: boolean;
  state: PersistedModuleState;
  onStateChange: (state: PersistedModuleState) => void;
}) {
  const data = moduleCopy[name];
  const [reportsResolution, setReportsResolution] = useState<ReportsResolution | null>(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsFailure, setReportsFailure] = useState<string | null>(null);
  const reportsIntegrationEnabled = name === "Reportes" && globalIntegrationMode === "api-real";

  useEffect(() => {
    if (!reportsIntegrationEnabled) {
      return;
    }

    const controller = new AbortController();

    async function loadReports() {
      setReportsLoading(true);
      setReportsFailure(null);

      try {
        const response = await fetch(data.adapter.endpoint, {
          method: "GET",
          headers: { accept: "application/json" },
          signal: controller.signal,
          cache: "no-store",
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "The controlled reports API route returned a non-success status.");
        }

        const normalized = normalizeReportsApiPayload(payload, data);
        setReportsResolution(normalized);
      } catch (error) {
        if (controller.signal.aborted) return;
        const reason = error instanceof Error ? error.message : "Unknown reports adapter failure.";
        setReportsFailure(reason);
        setReportsResolution({
          data: {
            ...data,
            error: `Fallback a mock para Reportes: ${reason}`,
          },
          mode: "mock",
          source: "mock-fallback",
          parityStatus: "failed",
          reason,
        });
      } finally {
        if (!controller.signal.aborted) {
          setReportsLoading(false);
        }
      }
    }

    void loadReports();

    return () => controller.abort();
  }, [data, reportsIntegrationEnabled]);

  const visibleReportsFailure = reportsIntegrationEnabled ? reportsFailure : null;
  const resolvedData = reportsIntegrationEnabled ? reportsResolution?.data ?? data : data;
  const integrationStatus: IntegrationStatus =
    name === "Reportes"
      ? reportsResolution
        ? {
            mode: reportsResolution.mode,
            source: reportsResolution.source,
            parityStatus: reportsResolution.parityStatus,
            reason: reportsResolution.reason,
          }
        : globalIntegrationMode === "api-real"
          ? {
              mode: "api-real",
              source: "mock-fallback",
              parityStatus: "not-applicable",
              reason: reportsLoading
                ? "Controlled reports adapter loading from the read-only API route."
                : "Controlled reports adapter pending first response.",
            }
          : {
              mode: "mock",
              source: "mock-fixture",
              parityStatus: "not-applicable",
              reason: "Reportes remains in mock mode until explicit api-real activation.",
            }
      : {
          mode: "mock",
          source: "mock-fixture",
          parityStatus: "not-applicable",
          reason: "This domain remains mock-only in the current phase.",
        };
  const activeFilters = state.filters;
  const selectedInternalTab = resolvedData.internalTabs.find((item) => item.key === state.internalTab) ?? resolvedData.internalTabs[0];

  const filteredRecords = useMemo(() => {
    let next = [...resolvedData.records];
    const query = searchValue.trim().toLowerCase();
    if (query) {
      next = next.filter((record) => [record.id, record.name, record.subtitle, record.status, record.metric, record.owner].some((part) => part.toLowerCase().includes(query)));
    }
    resolvedData.filters.forEach((filterGroup) => {
      const value = activeFilters[filterGroup.label];
      if (value && value !== "Todos" && value !== "Todas") {
        next = next.filter((record) => [record.subtitle, record.status, record.route, record.owner].join(" ").includes(value));
      }
    });
    next.sort((left, right) => {
      const field = state.sortField;
      const leftValue = left[field].toLowerCase();
      const rightValue = right[field].toLowerCase();
      const direction = state.sortDirection === "asc" ? 1 : -1;
      return leftValue.localeCompare(rightValue) * direction;
    });
    return next;
  }, [activeFilters, resolvedData.filters, resolvedData.records, searchValue, state.sortDirection, state.sortField]);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const page = Math.min(state.page, totalPages);
  const pagedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);
  const activeRecord = pagedRecords.find((record) => record.id === state.expandedId) ?? pagedRecords[0] ?? filteredRecords[0] ?? resolvedData.records[0];
  const stateMessage =
    reportsLoading && name === "Reportes" && globalIntegrationMode === "api-real" ? "Cargando adaptador api-real de Reportes..." :
    resolvedData.state === "loading" ? "Cargando fixtures locales..." :
      resolvedData.state === "error" ? resolvedData.error :
        resolvedData.state === "empty" ? resolvedData.empty :
          resolvedData.state === "partial" ? resolvedData.partial :
            "Datos simulados listos para validación visual.";
  const visibleActions = resolvedData.actions
    .filter((action) => roleActionAccess[action.permission]?.includes(roleId) && (action.when === "always" || action.when === resolvedData.state))
    .filter((action) => !(name === "Reportes" && integrationStatus.mode === "api-real" && (action.label === "Solicitar reporte" || action.label === "Exportar vista")));
  const hasSelection = state.selectedIds.length > 0;
  const isReports = name === "Reportes";
  const activeFilterSummary = resolvedData.filters
    .map((filterGroup) => `${filterGroup.label}: ${activeFilters[filterGroup.label] ?? filterGroup.values[0]}`)
    .join(" · ");
  const reportsCoverageSummary = isReports
    ? `${filteredRecords.filter((record) => record.status === "Activo").length} listos · ${filteredRecords.filter((record) => record.status === "Parcial").length} parciales · ${filteredRecords.filter((record) => record.status === "Pendiente").length} en preparación`
    : null;
  const reportsLeadRecord = isReports ? filteredRecords[0] ?? resolvedData.records[0] : null;
  const reportsBoundary = isReports
    ? [
        { label: "Modo", value: integrationStatus.mode === "api-real" ? "api-real controlado" : "mock local" },
        { label: "Frontera", value: resolvedData.adapter.endpoint },
        { label: "Fallback", value: integrationStatus.mode === "api-real" ? "mock activado si falla paridad" : "mock nativo" },
      ]
    : [];

  function updateState(patch: Partial<PersistedModuleState>) {
    startTransition(() => onStateChange({ ...state, ...patch }));
  }

  return (
    <div className="content module-view">
      <div className="module-hero">
        <div>
          <span>{resolvedData.eyebrow.toUpperCase()}</span>
          <h2>{resolvedData.title}</h2>
          <p>{resolvedData.copy}</p>
        </div>
        <div className="module-watermark">{name.slice(0, 1)}</div>
      </div>

      <section className="module-toolbar">
        <div className="toolbar-left">
          <span className={`state-pill ${resolvedData.state}`}>{moduleStateLabel[resolvedData.state]}</span>
          <p>{stateMessage}</p>
        </div>
        <div className="toolbar-right">
          <button className="toolbar-btn" type="button">
            <Icon name="database" size={15} />
            {integrationStatus.mode === "api-real" ? "Reportes api-real" : "Mock"}
          </button>
          <button className="toolbar-btn"><Icon name="filter" size={15} /> Filtros</button>
          <button className="toolbar-btn"><Icon name="database" size={15} /> Contrato mock</button>
        </div>
      </section>

      <div className="module-kpis">
        {resolvedData.metrics.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{integrationStatus.source === "reports-api" ? "API real controlada" : "Fixture local"}</small></article>)}
      </div>

      {isReports && reportsLeadRecord && (
        <section className="reports-intel-strip" aria-label="Contexto de Reportes">
          <article className="reports-intel-card primary">
            <span>ENFOQUE ACTUAL</span>
            <b>{reportsLeadRecord.name}</b>
            <p>{reportsLeadRecord.subtitle} · {reportsLeadRecord.metric} · {reportsLeadRecord.owner}</p>
          </article>
          <article className="reports-intel-card">
            <span>LECTURA DE COBERTURA</span>
            <b>{reportsCoverageSummary}</b>
            <p>El estado parcial se mantiene visible para validar consumo analítico sin ocultar gaps del fixture.</p>
          </article>
          <article className="reports-intel-card">
            <span>FILTROS ACTIVOS</span>
            <b>{filteredRecords.length} visibles</b>
            <p>{activeFilterSummary}</p>
          </article>
        </section>
      )}

      {isReports && (
        <section className="reports-boundary-band" aria-label="Frontera de Reportes">
          <div className="reports-boundary-title">
            <span>Frontera de integración</span>
            <b>Reportes es el único dominio con conmutación mock ↔ api-real</b>
          </div>
          <div className="reports-boundary-cards">
            {reportsBoundary.map((item) => (
              <article key={item.label} className="reports-boundary-card">
                <span>{item.label}</span>
                <b>{item.value}</b>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="workspace-grid">
        <section className="workspace-main">
          <div className="tab-row">
            {tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => onTabChange(item.id)}><Icon name={item.icon} size={15} /> {item.label}</button>)}
          </div>

          {tab === "listado" && (
            <article className="module-card">
              <div className="card-head"><div><span>LISTADO</span><h3>{name}</h3></div><button onClick={onOpen}>Rol y acceso <Icon name="arrow" size={14} /></button></div>
              <div className="filter-row">
                {resolvedData.filters.map((filterGroup) => (
                  <button
                    key={filterGroup.label}
                    className="filter-token"
                    type="button"
                    onClick={() => {
                      const currentIndex = filterGroup.values.indexOf(activeFilters[filterGroup.label] ?? filterGroup.values[0]);
                      const nextValue = filterGroup.values[(currentIndex + 1) % filterGroup.values.length];
                      updateState({ filters: { ...activeFilters, [filterGroup.label]: nextValue }, page: 1 });
                    }}
                  >
                    <Icon name="filter" size={12} /> {filterGroup.label}: {activeFilters[filterGroup.label] ?? filterGroup.values[0]}
                  </button>
                ))}
              </div>
              <div className="action-row">
                {visibleActions.map((action) => <button key={action.label} className={action.tone === "primary" ? "primary-btn slim" : action.tone === "warning" ? "warning-btn slim" : "ghost-btn slim"} type="button">{action.label}</button>)}
                <button className="ghost-btn slim" type="button" onClick={() => updateState({ selectedIds: [], expandedId: null })}><Icon name="retry" size={14} /> Retry</button>
              </div>
              <div className="list-controls">
                <div className="stacked-meta">
                  <span>{filteredRecords.length} de {resolvedData.totalRecords} registros visibles</span>
                  <small>{resolvedData.refreshHint}</small>
                </div>
                <div className="list-actions">
                  <button className="toolbar-btn compact" type="button" onClick={() => updateState({ sortField: state.sortField === "name" ? "updatedAt" : "name" })}><Icon name="sort" size={14} /> Sort: {state.sortField}</button>
                  <button className="toolbar-btn compact" type="button" onClick={() => updateState({ sortDirection: state.sortDirection === "asc" ? "desc" : "asc" })}>{state.sortDirection === "asc" ? "Asc" : "Desc"}</button>
                  <button className="toolbar-btn compact" type="button"><Icon name="refresh" size={14} /> {isRefreshing ? "Refreshing..." : "Refresh"}</button>
                </div>
              </div>
              {isReports && (
                <div className="reports-callout">
                  <b>Lectura rápida de Reportes</b>
                  <p>Usa filtros para acotar audiencia y periodicidad; el detalle conserva la interpretación por secciones y la programación sigue en estado no operativo.</p>
                </div>
              )}
              {reportsLoading && name === "Reportes" && globalIntegrationMode === "api-real"
                ? <LoadingBlock />
                : resolvedData.state === "loading"
                  ? <LoadingBlock />
                  : resolvedData.state === "error"
                    ? <ErrorBlock message={resolvedData.error} />
                    : filteredRecords.length === 0 || resolvedData.state === "empty"
                      ? <EmptyBlock message={resolvedData.empty} />
                      : <RecordTable records={pagedRecords} selectedIds={state.selectedIds} expandedId={state.expandedId} onSelect={(id) => updateState({ selectedIds: state.selectedIds.includes(id) ? state.selectedIds.filter((current) => current !== id) : [...state.selectedIds, id] })} onExpand={(id) => updateState({ expandedId: state.expandedId === id ? null : id })} />}
              <div className="pagination-bar">
                <span>{hasSelection ? `${state.selectedIds.length} filas seleccionadas` : "Sin selección activa"}</span>
                <div className="pagination-actions">
                  <button className="ghost-btn slim" type="button" disabled={page === 1} onClick={() => updateState({ page: Math.max(1, page - 1) })}>Anterior</button>
                  <small>Página {page} de {totalPages}</small>
                  <button className="ghost-btn slim" type="button" disabled={page === totalPages} onClick={() => updateState({ page: Math.min(totalPages, page + 1) })}>Siguiente</button>
                </div>
              </div>
            </article>
          )}

          {tab === "detalle" && (
            <article className="module-card">
              <div className="card-head"><div><span>DETALLE</span><h3>{activeRecord.name}</h3></div><span className="card-hint">{activeRecord.id}</span></div>
              <div className="internal-tab-row">
                {resolvedData.internalTabs.map((item) => (
                  <button key={item.key} className={selectedInternalTab.key === item.key ? "active" : ""} type="button" onClick={() => updateState({ internalTab: item.key })}>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="detail-grid">
                <div className="detail-panel">
                  <b>{activeRecord.subtitle}</b>
                  <p>Estado: {activeRecord.status}</p>
                  <p>Última actualización: {activeRecord.updatedAt}</p>
                  <p>Métrica: {activeRecord.metric}</p>
                  <p>Responsable visible: {activeRecord.owner}</p>
                  <p>Subflujo: {activeRecord.route}</p>
                </div>
                <div className="detail-panel muted">
                  <span>{selectedInternalTab.label.toUpperCase()}</span>
                  <ul>
                    <li>{selectedInternalTab.hint}</li>
                    {resolvedData.detailSections.map((section) => <li key={section.title}>{section.title}</li>)}
                  </ul>
                </div>
                {isReports && (
                  <div className="detail-panel reportes-context">
                    <span>LECTURA ANALÍTICA</span>
                    <p>Este detalle sigue una ruta de consumo mock: catálogo legible, widgets parcialmente visibles y exportación solo visual hasta autorización futura.</p>
                  </div>
                )}
                <div className="detail-panel full">
                  <span>SECCIONES</span>
                  <div className="section-grid">
                    {resolvedData.detailSections.map((section) => <div key={section.title} className="section-card"><b>{section.title}</b>{section.items.map((item) => <p key={item}>{item}</p>)}</div>)}
                  </div>
                </div>
              </div>
            </article>
          )}

          {tab === "resumen" && (
            <article className="module-card">
              <div className="card-head"><div><span>PANELES</span><h3>Resumen del dominio</h3></div><span className="card-hint">Desktop + mobile</span></div>
              <div className="summary-grid">{resolvedData.summary.map((item) => <div key={item} className="summary-item"><Icon name="spark" size={16} /><p>{item}</p></div>)}</div>
              <div className="stage-strip">{resolvedData.stages.map((stage) => <div key={stage.label} className={`stage-item ${stage.state}`}><b>{stage.label}</b><span>{stage.detail}</span></div>)}</div>
              <div className="summary-grid summary-grid-extra">
                <div className="summary-item"><Icon name="database" size={16} /><p>Adaptador desacoplado listo para sustituir fixtures por endpoints aprobados sin rehacer pantallas.</p></div>
                <div className="summary-item"><Icon name="refresh" size={16} /><p>Refresh, retry, selección, tabs y filtros persisten por módulo.</p></div>
                <div className="summary-item"><Icon name="route" size={16} /><p>Listado, detalle, paginación, filtros, búsqueda, ordenamiento, errores, vacíos y respuestas parciales quedan normalizados para el cambio controlado mock ↔ API.</p></div>
                <div className="summary-item"><Icon name="shield" size={16} /><p>{integrationStatus.reason}</p></div>
              </div>
            </article>
          )}

          {tab === "formulario" && (
            <article className="module-card">
              <div className="card-head"><div><span>FORMULARIO BASE</span><h3>{resolvedData.formTitle}</h3></div><span className="card-hint">No operativo</span></div>
              <form className="mock-form">
                <label><span>Nombre</span><input readOnly value={activeRecord.name} /></label>
                <label><span>Categoría</span><input readOnly value={name} /></label>
                <label><span>Responsable</span><input readOnly value="Alex Morgan" /></label>
                <label><span>Adaptador</span><input readOnly value={resolvedData.adapter.responseShape} /></label>
                <label><span>Notas</span><textarea readOnly value="Formulario base preparado para futura sustitución por API real. Persistencia actual limitada a read-only, fixtures locales y estado de interfaz." /></label>
                <div className="form-actions"><button type="button" className="ghost-btn">Guardar borrador mock</button><button type="button" className="primary-btn">Enviar simulación</button></div>
              </form>
            </article>
          )}
        </section>

        <aside className="workspace-side">
          <article className="module-card compact">
            <div className="card-head"><div><span>CONTRATO MOCK</span><h3>API desacoplada</h3></div><Icon name={resolvedData.accent} size={18} /></div>
            <code>{resolvedData.adapter.endpoint}</code>
            <p>Fuente actual: `{resolvedData.adapter.fixtureSet}`. Respuesta tipada `{resolvedData.adapter.responseShape}` preparada para reemplazo por {resolvedData.adapter.futureSource}.</p>
            <div className="adapter-meta"><span>Query: {resolvedData.adapter.requestShape}</span><span>Modo: {integrationStatus.mode}</span><span>Cache key: {resolvedData.adapter.cacheKey}</span></div>
          </article>
          <article className="module-card compact">
            <div className="card-head"><div><span>ACCESO POR ROL</span><h3>{role.label}</h3></div><button className="icon-btn" onClick={onOpen}><Icon name="shield" size={16} /></button></div>
            <div className="permissions">{role.permissions.map((permission) => <span key={permission}><Icon name="check" size={14} /> {permissionLabels[permission] ?? permission}</span>)}</div>
          </article>
          <article className="module-card compact">
            <div className="card-head"><div><span>SEPARACIÓN</span><h3>Frontend mock / backend real</h3></div><Icon name="route" size={18} /></div>
            <ul className="guardrail-list">
              <li>{integrationStatus.mode === "api-real" ? "Reportes puede usar una ruta read-only controlada; los demás dominios siguen en mock." : "Solo datos simulados o fixtures locales."}</li>
              <li>Cero conexiones a sistemas reales.</li>
              <li>Sin automatizaciones de negocio.</li>
              <li>Adapter cache y request shape quedan listos para endpoint futuro.</li>
            </ul>
          </article>
          <article className="module-card compact">
            <div className="card-head"><div><span>MODO DE INTEGRACIÓN</span><h3>Conmutación futura controlada</h3></div><Icon name="database" size={18} /></div>
            <ul className="guardrail-list">
              <li>{integrationStatus.mode === "api-real" ? "Reportes api-real habilitado por flags con read-only route controlada." : "Mock mode activo con fixtures locales exclusivamente."}</li>
              <li>{integrationStatus.mode === "api-real" ? `Paridad de contrato: ${integrationStatus.parityStatus}.` : "API real futura deshabilitada en esta fase."}</li>
              <li>Switch strategy: env flag + adapter registry + contract parity checks.</li>
              {visibleReportsFailure ? <li>Fallback activo: {visibleReportsFailure}</li> : null}
              <li>La frontera por módulo queda documentada para Recursos Humanos, Conductores, Flota, Clientes, Proveedores, Documentos, Reportes, Administración, Configuración y Notificaciones.</li>
            </ul>
          </article>
        </aside>
      </div>

      <footer className="data-note"><Icon name="shield" size={15} /> Vista no operativa · Sin conexiones a servicios externos ni datos reales. {integrationStatus.mode === "api-real" ? "Reportes usa una ruta read-only controlada con fallback a mock." : "Mock mode activo y API real futura deshabilitada."}</footer>
    </div>
  );
}

function RecordTable({
  records,
  selectedIds,
  expandedId,
  onSelect,
  onExpand,
}: {
  records: RecordItem[];
  selectedIds: string[];
  expandedId: string | null;
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
}) {
  return (
    <div className="empty-preview">
      <div className="table-head"><span>Elemento</span><span>Responsable</span><span>Estado</span><span>Última actualización</span></div>
      {records.map((record) => (
        <div key={record.id} className={expandedId === record.id ? "record-shell expanded" : "record-shell"}>
          <div className="table-row">
            <label className="row-main"><input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => onSelect(record.id)} /><div><b>{record.name}</b><small>{record.subtitle}</small></div></label>
            <small>{record.owner}</small>
            <span><i /> {record.status}</span>
            <div className="row-meta"><time>{record.updatedAt}</time><button className="icon-btn inline" type="button" onClick={() => onExpand(record.id)} aria-label="Expandir detalle"><Icon name="chevron" size={14} /></button></div>
          </div>
          {expandedId === record.id && <div className="expanded-panel"><p><b>{record.metric}</b> · {record.route}</p><small>{record.health ?? "Operativo"} · selección y detalle expandible desde fixtures locales.</small></div>}
        </div>
      ))}
    </div>
  );
}

function LoadingBlock() {
  return <div className="state-block"><div className="loading-line" /><div className="loading-line short" /><p>Estado de carga simulado con fixtures locales.</p></div>;
}

function ErrorBlock({ message }: { message: string }) {
  return <div className="state-block error"><Icon name="alert" /><p>{message}</p></div>;
}

function EmptyBlock({ message }: { message: string }) {
  return <div className="state-block empty"><Icon name="grid" /><p>{message}</p></div>;
}
