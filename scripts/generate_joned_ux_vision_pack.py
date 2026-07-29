from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


PAGE_WIDTH, PAGE_HEIGHT = landscape((13.333 * inch, 7.5 * inch))

NAVY = colors.HexColor("#071b34")
NAVY_2 = colors.HexColor("#102942")
ORANGE = colors.HexColor("#ff6f2c")
ORANGE_SOFT = colors.HexColor("#ffd3bd")
CREAM = colors.HexColor("#f6f2ea")
SAND = colors.HexColor("#efe4d6")
INK = colors.HexColor("#16283a")
MUTED = colors.HexColor("#627381")
LINE = colors.HexColor("#dbe4ea")
WHITE = colors.white
GREEN = colors.HexColor("#3aa675")
BLUE = colors.HexColor("#6ca6cf")


def wrap(c, text, x, y, width, font="Helvetica", size=12, leading=16, color=INK):
    words = text.split()
    lines = []
    current = []
    for word in words:
        trial = " ".join(current + [word])
        if c.stringWidth(trial, font, size) <= width or not current:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    c.setFillColor(color)
    c.setFont(font, size)
    cursor = y
    for line in lines:
        c.drawString(x, cursor, line)
        cursor -= leading
    return cursor


def header(c, eyebrow, title, subtitle, dark=False):
    bg = NAVY if dark else CREAM
    fg = WHITE if dark else INK
    c.setFillColor(bg)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(36, PAGE_HEIGHT - 30, "JONED TRANSPORT CO.")
    c.setFillColor(ORANGE if dark else ORANGE)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(36, PAGE_HEIGHT - 55, eyebrow.upper())
    c.setStrokeColor(ORANGE)
    c.setLineWidth(2)
    c.line(36, PAGE_HEIGHT - 65, PAGE_WIDTH - 36, PAGE_HEIGHT - 65)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(36, PAGE_HEIGHT - 95, title)
    wrap(c, subtitle, 36, PAGE_HEIGHT - 120, 520, color=(colors.HexColor("#b5c4cd") if dark else MUTED))


def footer(c, page_no, label, dark=False):
    c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.08) if dark else colors.Color(0, 0, 0, alpha=0.08))
    c.line(36, 24, PAGE_WIDTH - 36, 24)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.6) if dark else colors.Color(0, 0, 0, alpha=0.6))
    c.setFont("Helvetica", 9)
    c.drawString(36, 10, f"Page {page_no} · {label}")
    c.drawRightString(PAGE_WIDTH - 36, 10, "JONED Enterprise UX Vision Pack v1")


def pill(c, x, y, w, text, fill, text_color):
    c.setFillColor(fill)
    c.roundRect(x, y, w, 24, 12, fill=1, stroke=0)
    c.setFillColor(text_color)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(x + w / 2, y + 8, text)


def cover(c):
    header(
        c,
        "Vision Pack",
        "JONED Enterprise UX Vision Pack v1",
        "Unified visual direction for the public site, customer portal, driver portal, operations center, executive dashboard, administration, and mobile experience.",
        dark=True,
    )
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.06))
    c.roundRect(36, 74, 888, 318, 28, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 46)
    c.drawString(60, 312, "From company website")
    c.drawString(60, 260, "to logistics platform")
    wrap(c, "One visual system. Multiple roles. Clear separation between public experience and operational environments.", 60, 210, 350, size=14, leading=18, color=colors.HexColor("#d2dde4"))
    pill(c, 60, 128, 146, "Public website", ORANGE, WHITE)
    pill(c, 214, 128, 146, "Customer portal", colors.Color(1, 1, 1, alpha=0.12), WHITE)
    pill(c, 368, 128, 146, "Driver portal", colors.Color(1, 1, 1, alpha=0.12), WHITE)
    pill(c, 522, 128, 170, "Operations center", colors.Color(1, 1, 1, alpha=0.12), WHITE)
    pill(c, 700, 128, 150, "Administration", colors.Color(1, 1, 1, alpha=0.12), WHITE)
    c.setFillColor(WHITE)
    c.roundRect(544, 132, 330, 236, 24, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.roundRect(570, 160, 122, 156, 18, fill=1, stroke=0)
    c.roundRect(710, 160, 138, 70, 18, fill=1, stroke=0)
    c.roundRect(710, 246, 138, 70, 18, fill=1, stroke=0)
    footer(c, 1, "Vision")


def visual_system(c):
    header(
        c,
        "Design System",
        "Shared visual language across all experiences",
        "Dark premium navigation, high-contrast CTAs, clear cards, maps, metrics, status color coding, and generous spacing.",
    )
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.roundRect(36, 94, 270, 284, 24, fill=1, stroke=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(60, 344, "Brand palette")
    for i, (label, col) in enumerate([("Navy", NAVY), ("Slate", NAVY_2), ("Orange", ORANGE), ("Sand", SAND), ("Cream", CREAM)]):
        y = 300 - i * 42
        c.setFillColor(col)
        c.roundRect(60, y, 44, 24, 8, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(118, y + 8, label)
    c.setFillColor(WHITE)
    c.roundRect(328, 94, 286, 284, 24, fill=1, stroke=0)
    c.setStrokeColor(LINE)
    c.roundRect(328, 94, 286, 284, 24, fill=0, stroke=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(352, 344, "Interface rules")
    items = [
        "Public site uses editorial sections, photography and trust strips.",
        "Operational products use white workspaces over dark/navy framing.",
        "Orange is action, not decoration.",
        "Maps, KPIs and statuses are first-class UI elements.",
    ]
    y = 308
    for item in items:
        c.setFillColor(ORANGE)
        c.circle(358, y + 3, 3, fill=1, stroke=0)
        wrap(c, item, 370, y + 6, 210, size=11, leading=14, color=MUTED)
        y -= 54
    c.setFillColor(WHITE)
    c.roundRect(636, 94, 288, 284, 24, fill=1, stroke=0)
    c.setStrokeColor(LINE)
    c.roundRect(636, 94, 288, 284, 24, fill=0, stroke=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(660, 344, "Status language")
    pill(c, 660, 290, 88, "In transit", colors.HexColor("#e8f5ee"), GREEN)
    pill(c, 756, 290, 78, "Delayed", colors.HexColor("#fff1e7"), ORANGE)
    pill(c, 842, 290, 62, "Ready", colors.HexColor("#edf3f8"), NAVY_2)
    wrap(c, "Customer confidence depends on immediate readability of shipment state, deadlines, issues, and next actions.", 660, 246, 220, size=11, leading=15, color=MUTED)
    footer(c, 2, "Visual System")


def public_site(c):
    header(
        c,
        "Phase 1",
        "Public corporate website",
        "A premium dark-header transport website with a strong hero, quote/tracking CTAs, coverage, services, recruiting, and contact.",
        dark=True,
    )
    c.setFillColor(WHITE)
    c.roundRect(36, 84, 888, 300, 24, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.rect(36, 334, 888, 50, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 12)
    for i, txt in enumerate(["Inicio", "Servicios", "Cobertura", "Nosotros", "Contacto"]):
        c.drawString(280 + i * 76, 353, txt)
    pill(c, 744, 345, 132, "Solicitar cotización", colors.HexColor("#ffd24a"), INK)
    c.setFillColor(colors.Color(0, 0, 0, alpha=0.32))
    c.rect(36, 84, 888, 250, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(60, 282, "Transportamos tu carga,")
    c.drawString(60, 246, "impulsamos tu negocio.")
    wrap(c, "Soluciones terrestres confiables, seguras y eficientes para Estados Unidos, México y Canadá.", 60, 202, 250, size=13, leading=18, color=colors.HexColor("#dce4ea"))
    pill(c, 60, 132, 128, "Solicitar cotización", colors.HexColor("#ffd24a"), INK)
    pill(c, 196, 132, 114, "Rastrear envío", colors.Color(1, 1, 1, alpha=0.12), WHITE)
    for i, txt in enumerate(["Seguridad", "Puntualidad", "Cobertura", "Soporte 24/7"]):
        x = 60 + i * 208
        c.setFillColor(NAVY)
        c.roundRect(x, 96, 184, 28, 14, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 16, 106, txt)
    footer(c, 3, "Public Website", dark=True)


def customer_portal(c):
    header(
        c,
        "Phase 2",
        "Customer portal",
        "Self-service visibility for shipments, billing, POD, history, and document downloads. Minimal friction, clear statuses, and direct access to what matters.",
    )
    c.setFillColor(NAVY)
    c.roundRect(36, 84, 168, 302, 18, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(58, 350, "JONED")
    menu = ["Dashboard", "Envíos", "Facturas", "Documentos", "POD", "Historial"]
    y = 312
    for item in menu:
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.08) if item == "Dashboard" else NAVY)
        c.roundRect(50, y, 140, 28, 12, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica", 10)
        c.drawString(64, y + 10, item)
        y -= 38
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.roundRect(224, 84, 700, 302, 18, fill=1, stroke=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(248, 350, "My shipments")
    for i, (title, value) in enumerate([("Active", "12"), ("Delivered", "84"), ("Pending docs", "3"), ("Invoices due", "2")]):
        x = 248 + i * 162
        c.setFillColor(CREAM)
        c.roundRect(x, 284, 146, 52, 14, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Helvetica", 9)
        c.drawString(x + 12, 318, title)
        c.setFont("Helvetica-Bold", 22)
        c.drawString(x + 12, 294, value)
    c.setFillColor(colors.HexColor("#f8fbfc"))
    c.roundRect(248, 114, 286, 148, 16, fill=1, stroke=0)
    c.roundRect(548, 114, 352, 148, 16, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(266, 236, "Recent shipments")
    c.drawString(566, 236, "Tracking and delivery detail")
    footer(c, 4, "Customer Portal")


def driver_portal(c):
    header(
        c,
        "Phase 3",
        "Driver portal",
        "Mobile-first operational workspace for route tasks, check-in, vehicle inspection, image upload, signatures, and driver communication.",
        dark=True,
    )
    c.setFillColor(WHITE)
    c.roundRect(84, 82, 240, 304, 28, fill=1, stroke=0)
    c.setFillColor(INK)
    c.roundRect(104, 346, 200, 18, 9, fill=0, stroke=1)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(116, 318, "Today's route")
    c.setFillColor(CREAM)
    c.roundRect(104, 252, 200, 52, 14, fill=1, stroke=0)
    c.roundRect(104, 188, 200, 52, 14, fill=1, stroke=0)
    c.roundRect(104, 124, 200, 52, 14, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica", 10)
    for y, txt in [(276, "Check-in and departure"), (212, "Vehicle inspection"), (148, "Photo and POD upload")]:
        c.drawString(122, y, txt)
    c.setFillColor(WHITE)
    c.roundRect(356, 82, 530, 304, 24, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(382, 348, "Driver workflow")
    pill(c, 382, 298, 90, "Assigned", colors.HexColor("#edf4fb"), NAVY_2)
    pill(c, 478, 298, 94, "Checked in", colors.HexColor("#e8f5ee"), GREEN)
    pill(c, 578, 298, 106, "At pickup", colors.HexColor("#fff1e7"), ORANGE)
    wrap(c, "Every route presents a finite checklist: arrive, inspect, confirm load, upload evidence, complete handoff, and report exceptions.", 382, 258, 230, size=11, leading=15, color=MUTED)
    c.setFillColor(colors.HexColor("#f8fbfc"))
    c.roundRect(632, 122, 226, 150, 16, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(650, 246, "Exception center")
    wrap(c, "Damages, delays, missing documents, vehicle issues, or customer notes.", 650, 220, 170, size=11, leading=14, color=MUTED)
    footer(c, 5, "Driver Portal", dark=True)


def operations_center(c):
    header(
        c,
        "Phase 4",
        "Operations center",
        "The dispatcher workspace combines live KPIs, active loads, fleet map, route exceptions, customer status, and operational response in one screen.",
    )
    c.setFillColor(NAVY)
    c.roundRect(36, 84, 168, 302, 18, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(58, 350, "Ops Center")
    c.setFont("Helvetica", 10)
    y = 312
    for item in ["Dashboard", "Loads", "Map", "Drivers", "Vehicles", "Alerts", "Reports"]:
        c.drawString(60, y, item)
        y -= 34
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.roundRect(224, 84, 700, 302, 18, fill=1, stroke=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(248, 350, "Real-time operations")
    for i, (title, value, col) in enumerate([("Active loads", "128", BLUE), ("Delays", "7", ORANGE), ("Drivers online", "83", GREEN), ("Critical alerts", "2", NAVY_2)]):
        x = 248 + i * 162
        c.setFillColor(colors.HexColor("#f8fbfc"))
        c.roundRect(x, 284, 146, 52, 14, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Helvetica", 9)
        c.drawString(x + 12, 318, title)
        c.setFont("Helvetica-Bold", 22)
        c.drawString(x + 12, 294, value)
        c.setFillColor(col)
        c.circle(x + 124, 305, 6, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#f8fbfc"))
    c.roundRect(248, 114, 300, 148, 16, fill=1, stroke=0)
    c.roundRect(564, 114, 160, 148, 16, fill=1, stroke=0)
    c.roundRect(738, 114, 162, 148, 16, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(266, 236, "Fleet map")
    c.drawString(582, 236, "Load queue")
    c.drawString(756, 236, "Alerts")
    footer(c, 6, "Operations Center")


def executive_admin(c):
    header(
        c,
        "Phase 5",
        "Executive and administration layers",
        "Executive views simplify the network into KPIs, trends, utilization, and revenue health. Administration controls identity, roles, audit, and integrations.",
    )
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.roundRect(36, 84, 430, 302, 18, fill=1, stroke=1)
    c.roundRect(494, 84, 430, 302, 18, fill=1, stroke=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(60, 350, "Executive dashboard")
    c.drawString(518, 350, "Administration")
    for i, (title, value) in enumerate([("On-time rate", "96%"), ("Fleet utilization", "87%"), ("Revenue health", "$1.2M")]):
        x = 60 + i * 122
        c.setFillColor(CREAM)
        c.roundRect(x, 286, 110, 48, 12, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Helvetica", 8)
        c.drawString(x + 10, 318, title)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(x + 10, 296, value)
    wrap(c, "The CEO should not see dispatcher noise. Executive surfaces summarize risk, trend, and performance across the business.", 60, 244, 360, size=11, leading=15, color=MUTED)
    admin_items = [
        "Azure Entra ID sign-in",
        "User and role assignment",
        "Audit trail and activity history",
        "Configuration and integration switches",
    ]
    y = 304
    for item in admin_items:
        c.setFillColor(ORANGE)
        c.circle(520, y + 4, 3, fill=1, stroke=0)
        wrap(c, item, 530, y + 6, 320, size=11, leading=14, color=MUTED)
        y -= 48
    footer(c, 7, "Executive + Administration")


def build(output_path: Path):
    c = canvas.Canvas(str(output_path), pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    for drawer in [cover, visual_system, public_site, customer_portal, driver_portal, operations_center, executive_admin]:
        drawer(c)
        c.showPage()
    c.save()


def main():
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "output" / "pdf"
    out_dir.mkdir(parents=True, exist_ok=True)
    output_path = out_dir / "JONED_Enterprise_UX_Vision_Pack_v1_2026-07-29.pdf"
    build(output_path)
    print(output_path)


if __name__ == "__main__":
    main()
