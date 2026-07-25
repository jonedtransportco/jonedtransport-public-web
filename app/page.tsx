"use client";

import { useState } from "react";

type IconName =
  | "grid" | "people" | "driver" | "truck" | "client" | "vendor"
  | "doc" | "chart" | "shield" | "gear" | "bell" | "arrow"
  | "search" | "menu" | "close" | "check" | "clock" | "route";

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

const moduleCopy: Record<string, { eyebrow: string; title: string; copy: string }> = {
  "Recursos Humanos": { eyebrow: "Personas y cultura", title: "El equipo, en un solo lugar", copy: "Directorio, incorporación, licencias y documentación laboral preparados para futuras APIs." },
  Conductores: { eyebrow: "Operación en movimiento", title: "Conductores listos para la ruta", copy: "Disponibilidad, credenciales y desempeño en una vista clara y accionable." },
  Flota: { eyebrow: "Activos y mantenimiento", title: "Control visual de la flota", copy: "Estado, ubicación simulada y próximos servicios de cada unidad." },
  Clientes: { eyebrow: "Relaciones comerciales", title: "Una visión completa del cliente", copy: "Cuentas, contactos, actividad y servicio, sin conectar sistemas operativos." },
  Proveedores: { eyebrow: "Red de suministro", title: "Proveedores organizados", copy: "Perfiles, categorías y estado documental preparados para integración." },
  Documentos: { eyebrow: "Información gobernada", title: "Documentos con contexto", copy: "Experiencia visual no operativa, sin acceso al runtime documental ni SharePoint." },
  Reportes: { eyebrow: "Inteligencia empresarial", title: "Decisiones con perspectiva", copy: "Catálogo inicial de reportes con datos exclusivamente simulados." },
  Administración: { eyebrow: "Control de acceso", title: "Administración segura por diseño", copy: "Roles, permisos y auditoría visual listos para conectarse a servicios reales." },
  Configuración: { eyebrow: "Identidad empresarial", title: "Tu empresa, a tu manera", copy: "Preferencias, sedes y parámetros presentados como configuración no operativa." },
  Notificaciones: { eyebrow: "Centro de actividad", title: "Lo importante, sin ruido", copy: "Alertas simuladas priorizadas por contexto, módulo y nivel de atención." },
};

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  const [active, setActive] = useState("Resumen ejecutivo");
  const [menuOpen, setMenuOpen] = useState(false);

  if (!signedIn) {
    return (
      <main className="public-shell">
        <header className="public-nav">
          <Brand light />
          <nav aria-label="Navegación pública">
            <a href="#capabilities">Capacidades</a><a href="#platform">Plataforma</a><a href="#about">Nosotros</a>
          </nav>
          <button className="nav-login" onClick={() => setSignedIn(true)}>Acceso al portal <Icon name="arrow" size={16} /></button>
        </header>
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker"><i /> Logística que conecta posibilidades</span>
            <h1>Movemos tu negocio.<br /><em>Impulsamos tu futuro.</em></h1>
            <p>Una plataforma empresarial diseñada para dar claridad a cada operación, conectar a cada equipo y mantener el crecimiento en movimiento.</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={() => setSignedIn(true)}>Entrar con Microsoft <Icon name="arrow" size={18} /></button>
              <a href="#capabilities">Conocer la plataforma</a>
            </div>
            <div className="trust-row"><span><Icon name="shield" size={17} /> Acceso empresarial</span><span><Icon name="check" size={17} /> Datos protegidos</span><span><Icon name="clock" size={17} /> Visibilidad continua</span></div>
          </div>
          <div className="hero-visual" aria-label="Vista previa del portal JONED">
            <div className="route-orbit orbit-one"><span>DEN</span></div>
            <div className="route-orbit orbit-two"><span>AUS</span></div>
            <div className="portal-preview">
              <div className="preview-top"><span className="preview-mark">J</span><small>JONED PORTAL</small><div className="preview-avatar">AM</div></div>
              <div className="preview-body">
                <div className="mini-sidebar">{[1,2,3,4,5].map(n => <i key={n} className={n === 1 ? "on" : ""} />)}</div>
                <div className="mini-main"><small>BUENOS DÍAS, ALEX</small><strong>El negocio está en movimiento.</strong><div className="mini-stats"><i /><i /><i /></div><div className="mini-chart"><span/><span/><span/><span/><span/><span/><span/></div></div>
              </div>
              <div className="floating-card"><Icon name="route" /><div><b>47 unidades activas</b><small>94% de disponibilidad</small></div></div>
            </div>
          </div>
        </section>
        <section className="capability-strip" id="capabilities">
          <span>Una sola plataforma</span><b>Personas</b><b>Flota</b><b>Clientes</b><b>Documentos</b><b>Decisiones</b>
        </section>
      </main>
    );
  }

  const sub = moduleCopy[active];
  return (
    <main className="app-shell">
      <aside className={menuOpen ? "sidebar open" : "sidebar"}>
        <div className="sidebar-head"><Brand /><button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"><Icon name="close" /></button></div>
        <div className="workspace"><span>ESPACIO DE TRABAJO</span><b>JONED Transport Co.</b><small>Denver, Colorado</small></div>
        <nav className="side-nav" aria-label="Módulos del portal">
          {modules.map(([label, icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setMenuOpen(false); }}><Icon name={icon} /><span>{label}</span>{label === "Notificaciones" && <i>3</i>}</button>)}
        </nav>
        <div className="user-card"><div className="avatar">AM</div><div><b>Alex Morgan</b><span>Administrador</span></div><button onClick={() => setSignedIn(false)} title="Cerrar sesión">↗</button></div>
      </aside>
      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />}
      <section className="main-panel">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menú"><Icon name="menu" /></button>
          <div className="search"><Icon name="search" size={18} /><input aria-label="Buscar" placeholder="Buscar en el portal…" /><kbd>⌘ K</kbd></div>
          <div className="top-actions"><span className="mock-badge">ENTORNO SIMULADO</span><button aria-label="Notificaciones"><Icon name="bell" /><i /></button><div className="avatar small">AM</div></div>
        </header>
        {active === "Resumen ejecutivo" ? <Dashboard /> : <ModuleView name={active} data={sub} />}
      </section>
    </main>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? "light" : ""}`}><span className="brand-mark">J</span><div><b>JONED</b><small>TRANSPORT CO.</small></div></div>;
}

function Dashboard() {
  return <div className="content">
    <div className="page-heading"><div><span>VIERNES, 25 DE JULIO</span><h2>Buenos días, Alex.</h2><p>Aquí está el pulso de tu operación hoy.</p></div><button className="period">Últimos 30 días <span>⌄</span></button></div>
    <div className="stat-grid">{stats.map((s, i) => <article className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><Icon name={(["check","truck","driver","chart"] as IconName[])[i]} /></div><span>{s.label}</span><div className="stat-value">{s.value}<em className={i === 2 ? "neutral" : ""}>{s.delta}</em></div><small>{s.detail}</small></article>)}</div>
    <div className="dashboard-grid">
      <article className="panel performance"><div className="panel-title"><div><span>RENDIMIENTO OPERATIVO</span><h3>Entregas por semana</h3></div><div className="legend"><i /> Completadas <i /> Objetivo</div></div><div className="chart-wrap"><div className="y-axis"><span>400</span><span>300</span><span>200</span><span>100</span><span>0</span></div><div className="bars">{[68,79,66,88,76,91,83].map((h, i) => <div className="bar-col" key={i}><div className="goal" style={{height:`${Math.min(h+9,98)}%`}}/><div className="bar" style={{height:`${h}%`}}/><span>{["S1","S2","S3","S4","S5","S6","S7"][i]}</span></div>)}</div></div></article>
      <article className="panel fleet"><div className="panel-title"><div><span>ESTADO DE FLOTA</span><h3>Disponibilidad</h3></div><button>Ver flota <Icon name="arrow" size={14}/></button></div><div className="donut-row"><div className="donut"><div><b>47</b><span>activas</span></div></div><div className="fleet-legend"><p><i className="green"/>En ruta <b>31</b></p><p><i className="blue-dot"/>Disponibles <b>16</b></p><p><i className="orange"/>Mantenimiento <b>3</b></p></div></div><div className="fleet-note"><Icon name="clock" size={17}/><span><b>Próximo servicio</b> · FL-038 en 2 días</span></div></article>
      <article className="panel activity"><div className="panel-title"><div><span>ACTIVIDAD RECIENTE</span><h3>Lo que está pasando</h3></div><button>Ver todo</button></div><div className="activity-list">{activities.map(([title, detail, time, icon]) => <div className="activity-item" key={title}><div className="activity-icon"><Icon name={icon as IconName} size={18}/></div><div><b>{title}</b><span>{detail}</span></div><time>{time}</time></div>)}</div></article>
      <article className="panel role-panel"><div className="role-head"><Icon name="shield" /><div><span>TU NIVEL DE ACCESO</span><h3>Administrador de empresa</h3></div></div><p>Tienes acceso completo a los módulos, ajustes y gestión de usuarios.</p><div className="permissions"><span><Icon name="check" size={14}/> 11 módulos</span><span><Icon name="check" size={14}/> Gestión de usuarios</span><span><Icon name="check" size={14}/> Reportes</span></div><button>Revisar permisos <Icon name="arrow" size={14}/></button></article>
    </div>
    <footer className="data-note"><Icon name="shield" size={15}/> Todos los datos que ves en esta versión son simulados y no representan operaciones reales.</footer>
  </div>;
}

function ModuleView({ name, data }: { name: string; data: { eyebrow: string; title: string; copy: string } }) {
  return <div className="content module-view">
    <div className="module-hero"><div><span>{data.eyebrow.toUpperCase()}</span><h2>{data.title}</h2><p>{data.copy}</p></div><div className="module-watermark">{name.slice(0,1)}</div></div>
    <div className="foundation-grid">
      <article><div className="foundation-icon"><Icon name="grid"/></div><span>VISTA FUNDACIONAL</span><h3>{name}</h3><p>La estructura visual, los estados y la navegación están listos para enlazar el contrato de integración futuro.</p><button>Explorar vista <Icon name="arrow" size={15}/></button></article>
      <article className="access-card"><div className="foundation-icon"><Icon name="shield"/></div><span>ACCESO POR ROL</span><h3>Administrador</h3><p>Lectura y gestión simuladas. Las decisiones de autorización reales se resolverán en backend.</p><div className="access-line"><i/><b>Acceso visual habilitado</b></div></article>
      <article className="contract-card"><div className="foundation-icon"><Icon name="route"/></div><span>CONTRATO MOCK</span><h3>API desacoplada</h3><p>Fuente actual: fixtures locales. Adaptador preparado para sustituirse sin rediseñar esta interfaz.</p><code>GET /api/v1/{name.toLowerCase().replaceAll(" ", "-")}</code></article>
    </div>
    <div className="empty-preview"><div className="table-head"><span>Elemento</span><span>Estado</span><span>Última actualización</span></div>{["Registro de ejemplo A","Registro de ejemplo B","Registro de ejemplo C"].map((x,i)=><div className="table-row" key={x}><b>{x}</b><span><i/> {i===1?"Pendiente":"Activo"}</span><time>Datos simulados</time></div>)}</div>
    <footer className="data-note"><Icon name="shield" size={15}/> Vista no operativa · Sin conexiones a servicios externos ni datos reales.</footer>
  </div>;
}
