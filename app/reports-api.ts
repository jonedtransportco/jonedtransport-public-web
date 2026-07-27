export type MockState = "ready" | "loading" | "empty" | "error" | "partial";

export type RecordItem = {
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

export type RoleAction = {
  label: string;
  permission: string;
  tone: "primary" | "ghost" | "warning";
  when: "always" | "ready" | "partial" | "error";
};

export type StageItem = {
  label: string;
  state: "done" | "current" | "next";
  detail: string;
};

export type DetailSection = {
  title: string;
  items: string[];
};

export type AdapterContract = {
  endpoint: string;
  fixtureSet: string;
  requestShape: string;
  responseShape: string;
  futureSource: string;
  cacheKey: string;
};

export type InternalTabKey = "primary" | "secondary" | "tertiary";

export type InternalTabDef = {
  key: InternalTabKey;
  label: string;
  hint: string;
};

export type FilterGroup = {
  label: string;
  values: string[];
};

export type DomainConfig = {
  eyebrow: string;
  title: string;
  copy: string;
  accent:
    | "grid" | "people" | "driver" | "truck" | "client" | "vendor"
    | "doc" | "chart" | "shield" | "gear" | "bell" | "arrow"
    | "search" | "menu" | "close" | "check" | "clock" | "route" | "lock"
    | "filter" | "spark" | "alert" | "form" | "refresh" | "retry" | "sort"
    | "chevron" | "database";
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

export type ReportsApiEnvelope = {
  data: {
    reportCatalog?: Array<{
      id: string;
      title: string;
      audience: string;
      cadence: string;
      status: string;
      updatedAt: string;
      widgetCount?: number;
      widgetCoverage?: { available: number; total: number };
      owner: string;
      route?: string;
      health?: string;
    }>;
    metrics?: {
      publishedReportsCount?: number;
      widgetsVisibleCount?: number;
      refreshCadence?: string;
    };
    filters?: {
      audience?: string[];
      periodicity?: string[];
      domain?: string[];
    };
    detailSections?: Array<{
      title: string;
      items: string[];
    }>;
    summary?: string[];
    totalRecords?: number;
  };
  meta?: {
    state?: MockState;
    source?: string;
    partial?: boolean;
    refreshable?: boolean;
    retryable?: boolean;
    generatedAt?: string;
  };
  error?: {
    code?: string;
    message?: string;
    correlationId?: string;
    retryable?: boolean;
  };
};

export type ReportsResolution = {
  data: DomainConfig;
  mode: "mock" | "api-real";
  source: "mock-fixture" | "reports-api" | "mock-fallback";
  parityStatus: "not-applicable" | "passed" | "failed";
  reason: string;
};

export function resolveIntegrationMode(
  globalMode: string | undefined,
  domainMode: string | undefined,
): "mock" | "api-real" {
  if (globalMode === "api-real" && domainMode === "api-real") {
    return "api-real";
  }

  return "mock";
}

function normalizeStatus(status: string): string {
  const lowered = status.trim().toLowerCase();

  if (["active", "activo", "ready", "available"].includes(lowered)) return "Activo";
  if (["partial", "parcial"].includes(lowered)) return "Parcial";
  if (["pending", "pendiente", "draft", "borrador"].includes(lowered)) return "Pendiente";
  if (["error", "failed", "unavailable"].includes(lowered)) return "Error";

  return status;
}

function normalizeHealth(health: string | undefined, status: string): RecordItem["health"] {
  const lowered = health?.trim().toLowerCase();
  if (lowered === "operativo") return "Operativo";
  if (lowered === "en revisión" || lowered === "en revision") return "En revisión";
  if (lowered === "atención" || lowered === "atencion") return "Atención";

  const normalizedStatus = normalizeStatus(status);
  if (normalizedStatus === "Activo") return "Operativo";
  if (normalizedStatus === "Parcial") return "Atención";
  if (normalizedStatus === "Pendiente") return "En revisión";
  return "Atención";
}

function buildMetric(item: NonNullable<ReportsApiEnvelope["data"]["reportCatalog"]>[number]): string {
  if (item.widgetCoverage) {
    return `${item.widgetCoverage.available}/${item.widgetCoverage.total} widgets`;
  }
  if (typeof item.widgetCount === "number") {
    return `${item.widgetCount} widgets`;
  }
  return "Cobertura no disponible";
}

function ensureStringArray(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : fallback;
}

export function normalizeReportsApiPayload(
  payload: ReportsApiEnvelope,
  base: DomainConfig,
): ReportsResolution {
  const catalog = payload.data.reportCatalog;

  if (!Array.isArray(catalog) || catalog.length === 0) {
    throw new Error("Approved reports API payload did not include reportCatalog entries.");
  }

  const metrics = payload.data.metrics ?? {};
  const metaState = payload.meta?.state;
  const resolvedState: MockState =
    metaState === "ready" || metaState === "loading" || metaState === "empty" || metaState === "error" || metaState === "partial"
      ? metaState
      : payload.meta?.partial
        ? "partial"
        : "ready";

  const records: RecordItem[] = catalog.map((item) => ({
    id: item.id,
    name: item.title,
    subtitle: `${item.audience} · ${item.cadence}`,
    status: normalizeStatus(item.status),
    updatedAt: item.updatedAt,
    metric: buildMetric(item),
    owner: item.owner,
    route: item.route ?? "Catálogo > API real",
    health: normalizeHealth(item.health, item.status),
  }));

  const next: DomainConfig = {
    ...base,
    metrics: [
      {
        label: "Reportes publicados",
        value: String(metrics.publishedReportsCount ?? records.length),
      },
      {
        label: "Widgets",
        value: String(metrics.widgetsVisibleCount ?? records.reduce((sum, item) => {
          const matched = /^(\d+)/.exec(item.metric);
          return sum + Number(matched?.[1] ?? 0);
        }, 0)),
      },
      {
        label: "Cortes",
        value: metrics.refreshCadence ?? "API real",
      },
    ],
    filters: [
      {
        label: "Audiencia",
        values: ensureStringArray(payload.data.filters?.audience, base.filters[0]?.values ?? ["Todas"]),
      },
      {
        label: "Periodicidad",
        values: ensureStringArray(payload.data.filters?.periodicity, base.filters[1]?.values ?? ["Todas"]),
      },
      {
        label: "Dominio",
        values: ensureStringArray(payload.data.filters?.domain, base.filters[2]?.values ?? ["Todos"]),
      },
    ],
    records,
    detailSections:
      Array.isArray(payload.data.detailSections) && payload.data.detailSections.every((section) =>
        section && typeof section.title === "string" && Array.isArray(section.items),
      )
        ? payload.data.detailSections
        : base.detailSections,
    summary:
      Array.isArray(payload.data.summary) && payload.data.summary.every((item) => typeof item === "string")
        ? payload.data.summary
        : base.summary,
    state: resolvedState,
    totalRecords: payload.data.totalRecords ?? records.length,
    partial:
      resolvedState === "partial"
        ? "La API real devolvió catálogo legible con cobertura parcial de widgets; el fallback de UX permanece activo."
        : base.partial,
    error:
      payload.error?.message ??
      "La API real de reportes no devolvió un error detallado; mantener rollback a mock si el contrato no es estable.",
    refreshHint:
      payload.meta?.generatedAt
        ? `API real generada en ${payload.meta.generatedAt}. Refresh y retry siguen siendo de solo lectura.`
        : "API real de solo lectura activa para Reportes.",
    adapter: {
      ...base.adapter,
      fixtureSet: payload.meta?.source ?? "reports-api",
    },
  };

  return {
    data: next,
    mode: "api-real",
    source: "reports-api",
    parityStatus: "passed",
    reason: "Approved reports API payload matched the normalized reports adapter contract.",
  };
}
