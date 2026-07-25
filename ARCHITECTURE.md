# 02A — Portal Web | Frontend Foundation

Version: 1.0  
Lifecycle: Under Review  
Scope: GREENFIELD frontend foundation using local simulated data only.

## Architecture

The portal uses a presentation-first React/Next.js foundation compiled with Vinext for a Cloudflare Worker-compatible runtime. The public corporate experience, simulated Microsoft sign-in, authenticated shell, executive dashboard, module views, role indicators and responsive behavior are contained in the frontend surface.

The current data flow is deliberately local:

`UI components → typed view model → mock adapter → local fixtures`

The future data flow replaces only the adapter:

`UI components → typed view model → API adapter → authorized JONED APIs`

UI components never depend directly on Azure SQL, Microsoft Graph, SharePoint, mail, payment, payroll, dispatch or document-processing systems. Authorization indicators in this foundation are visual affordances only; real authorization decisions must be enforced server-side by the future identity and API layers.

## Frontend layers

- Experience: public corporate page, simulated sign-in, authenticated application shell.
- Navigation: responsive sidebar with all authorized foundation modules.
- Components: brand, buttons, cards, metrics, activity feed, chart, role status, tables and state badges.
- View models: stable UI-facing shapes designed to remain unchanged when the source adapter changes.
- Mock adapter: local, deterministic fixture responses represented by `contracts/mock-api.v1.json`.
- Integration boundary: versioned future REST contract under `/api/v1`, with no runtime implementation in this package.

## Visual system

- Primary: deep navy `#0B1F31` for trust, structure and authenticated navigation.
- Accent: transport orange `#E86D34` for movement, focus and primary actions.
- Support: slate blue, operational green, warm neutral and white surfaces.
- Typography: Geist with strong editorial scale, compact operational labels and accessible hierarchy.
- Geometry: restrained 3–8 px radii, low-elevation cards and dense but readable enterprise spacing.
- Responsive: desktop sidebar becomes a touch-friendly mobile drawer; metric and content grids collapse progressively.

## Roles and permissions

The UI supports a role label, visible module scope and permission summary. The included `Administrador de empresa` role is simulated. No frontend control is treated as an authorization boundary. Future APIs must return effective permissions and reject unauthorized operations independently of the UI.

## Replacement path

1. Implement an authenticated API adapter matching the mock contract.
2. Inject that adapter behind the existing view-model interface.
3. Map API errors, loading and empty states to the existing component states.
4. Enforce identity and authorization server-side.
5. Remove local fixtures only after parity tests pass.

No interface redesign is required for this replacement.

## Explicit non-connections

This version does not connect to Azure SQL, Microsoft Graph, operational SharePoint, email, document intake, payments, Gusto, PNC, OneRail, Frayt, ELD or any external operational integration. It does not implement business automation.
