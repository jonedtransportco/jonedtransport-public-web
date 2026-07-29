from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


PAGE_WIDTH, PAGE_HEIGHT = landscape((13.333 * inch, 7.5 * inch))


def hex_color(value: str):
    return colors.HexColor(value)


def rounded_rect(c, x, y, w, h, r, fill, stroke=None, stroke_width=1):
    c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(stroke_width)
    else:
        c.setStrokeColor(fill)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1)


def draw_label(c, text, x, y, color):
    c.setFillColor(color)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(x, y, text.upper())


def draw_wrapped(c, text, x, y, width, font="Helvetica", size=14, leading=20, color=colors.black):
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
    cursor_y = y
    for line in lines:
        c.drawString(x, cursor_y, line)
        cursor_y -= leading
    return cursor_y


def header(c, title, subtitle, bg, fg, accent):
    c.setFillColor(bg)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(36, PAGE_HEIGHT - 34, "JONED TRANSPORT CO.")
    c.setFont("Helvetica", 10)
    c.drawRightString(PAGE_WIDTH - 36, PAGE_HEIGHT - 30, "Public website direction preview")
    draw_label(c, title, 36, PAGE_HEIGHT - 60, accent)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 34)
    c.drawString(36, PAGE_HEIGHT - 92, subtitle)


def footer(c, page_label):
    c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.1))
    c.line(36, 28, PAGE_WIDTH - 36, 28)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.6))
    c.setFont("Helvetica", 9)
    c.drawString(36, 14, page_label)
    c.drawRightString(PAGE_WIDTH - 36, 14, "jonedtransport.com")


def page_corporate_one(c):
    bg = hex_color("#F4F0E8")
    fg = hex_color("#0D2234")
    accent = hex_color("#C96533")
    header(c, "Corporativa premium / ejemplo 1", "Balanced corporate landing", bg, fg, accent)
    c.setFillColor(hex_color("#576977"))
    y = draw_wrapped(
        c,
        "Una homepage sobria, limpia y segura para clientes y contratistas. "
        "Menos tarjetas repetidas, mejor jerarquia y una sensacion de empresa estable.",
        36,
        PAGE_HEIGHT - 132,
        420,
        size=13,
        leading=18,
        color=hex_color("#576977"),
    )
    rounded_rect(c, 36, y - 56, 160, 34, 17, accent)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(116, y - 43, "Request transport support")
    rounded_rect(c, 210, y - 56, 120, 34, 17, colors.white, stroke=hex_color("#D5DDE1"))
    c.setFillColor(fg)
    c.drawCentredString(270, y - 43, "Work with JONED")

    rounded_rect(c, 470, 120, 450, 310, 28, hex_color("#10283B"))
    rounded_rect(c, 498, 374, 170, 20, 10, colors.Color(1, 1, 1, alpha=0.08))
    rounded_rect(c, 680, 374, 106, 20, 10, colors.Color(1, 1, 1, alpha=0.08))
    rounded_rect(c, 800, 374, 92, 20, 10, accent)
    rounded_rect(c, 500, 158, 180, 180, 20, colors.white)
    rounded_rect(c, 698, 158, 194, 82, 20, colors.Color(1, 1, 1, alpha=0.12))
    rounded_rect(c, 698, 256, 194, 82, 20, colors.Color(1, 1, 1, alpha=0.12))
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(520, 314, "Company clarity")
    c.setFont("Helvetica", 11)
    draw_wrapped(c, "Services, recruiting and contact presented clearly on the public site.", 520, 294, 135, size=11, leading=14, color=hex_color("#607484"))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(720, 308, "Owner Operators")
    c.drawString(720, 210, "Drivers")
    c.setFont("Helvetica", 11)
    draw_wrapped(c, "Straight entry path for applicants.", 720, 288, 145, size=11, leading=14, color=colors.white)
    draw_wrapped(c, "Separate recruiting route, not mixed into portal access.", 720, 190, 145, size=11, leading=14, color=colors.white)

    for idx, label in enumerate(["Trusted operations", "Structured recruiting", "Clear separation"]):
        rounded_rect(c, 36 + idx * 146, 112, 132, 38, 19, colors.white, stroke=hex_color("#DCE4E8"))
        c.setFillColor(fg)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(102 + idx * 146, 126, label)
    footer(c, "Direction A1")


def page_corporate_two(c):
    bg = hex_color("#F7F6F2")
    fg = hex_color("#102436")
    accent = hex_color("#D7723B")
    header(c, "Corporativa premium / ejemplo 2", "Editorial trust-first homepage", bg, fg, accent)
    rounded_rect(c, 36, 118, 370, 294, 26, colors.white, stroke=hex_color("#E1E8EB"))
    draw_label(c, "About JONED", 60, 384, accent)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(60, 350, "A serious company presence")
    draw_wrapped(
        c,
        "Este enfoque se siente mas institucional. Usa paneles editoriales, cifras limpias y menos ruido visual. "
        "Sirve para dar confianza a clientes, contratistas y aliados.",
        60,
        322,
        308,
        size=12,
        leading=18,
        color=hex_color("#5E707B"),
    )
    for idx, (num, label) in enumerate([("01", "Services"), ("02", "Recruiting"), ("03", "Company")]):
        rounded_rect(c, 60 + idx * 98, 154, 84, 56, 16, hex_color("#F3F6F7"))
        c.setFillColor(fg)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(77 + idx * 98, 186, num)
        c.setFont("Helvetica", 10)
        c.drawString(77 + idx * 98, 168, label)

    rounded_rect(c, 442, 118, 478, 294, 30, hex_color("#0F2840"))
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 42)
    c.drawString(474, 362, "Reliable freight")
    c.drawString(474, 318, "built on order")
    draw_wrapped(c, "Hero amplio, tipografia fuerte y bloques laterales para servicios y rutas de aplicacion.", 474, 286, 240, size=13, leading=17, color=hex_color("#B6C7CF"))
    rounded_rect(c, 744, 286, 140, 84, 18, colors.Color(1, 1, 1, alpha=0.1))
    rounded_rect(c, 744, 184, 140, 84, 18, colors.Color(1, 1, 1, alpha=0.1))
    c.setFont("Helvetica-Bold", 14)
    c.drawString(764, 334, "Public company")
    c.drawString(764, 232, "Portal separate")
    c.setFont("Helvetica", 10)
    draw_wrapped(c, "Services and recruiting at the public layer.", 764, 316, 100, size=10, leading=13, color=colors.white)
    draw_wrapped(c, "Internal access remains distinct.", 764, 214, 100, size=10, leading=13, color=colors.white)
    footer(c, "Direction A2")


def page_logistics_one(c):
    bg = hex_color("#0B1E2A")
    fg = colors.white
    accent = hex_color("#F06D31")
    header(c, "Logística moderna / ejemplo 1", "Operational energy and motion", bg, fg, accent)
    c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.08))
    for x in range(36, int(PAGE_WIDTH) - 36, 52):
        c.line(x, 90, x, PAGE_HEIGHT - 86)
    for y in range(90, int(PAGE_HEIGHT) - 86, 52):
        c.line(36, y, PAGE_WIDTH - 36, y)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 48)
    c.drawString(36, 330, "Move freight with")
    c.drawString(36, 280, "speed and control")
    draw_wrapped(c, "Visual mas dinamico, con ritmo industrial, numeros grandes y secciones que parecen tablero comercial.", 36, 242, 360, size=13, leading=18, color=hex_color("#A7BBC6"))
    rounded_rect(c, 36, 156, 150, 38, 19, accent)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(111, 170, "Start with JONED")
    rounded_rect(c, 440, 126, 480, 288, 26, hex_color("#102A3B"), stroke=hex_color("#21465D"))
    for idx, height in enumerate([92, 146, 188, 120, 214]):
        rounded_rect(c, 486 + idx * 74, 164, 48, height, 12, [hex_color("#235B7A"), accent, hex_color("#5DA3C5"), hex_color("#204D65"), hex_color("#F59A5A")][idx])
    rounded_rect(c, 760, 290, 124, 90, 18, colors.white)
    c.setFillColor(hex_color("#102436"))
    c.setFont("Helvetica-Bold", 26)
    c.drawString(780, 340, "24/7")
    c.setFont("Helvetica", 11)
    c.drawString(780, 320, "coordination feel")
    for idx, text in enumerate(["Dispatch support", "Recruiting intake", "Public company presence"]):
        rounded_rect(c, 440 + idx * 158, 96, 146, 20, 10, colors.Color(1, 1, 1, alpha=0.08))
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(513 + idx * 158, 103, text)
    footer(c, "Direction B1")


def page_logistics_two(c):
    bg = hex_color("#091822")
    fg = colors.white
    accent = hex_color("#FF7D3E")
    header(c, "Logística moderna / ejemplo 2", "Command-center style landing", bg, fg, accent)
    rounded_rect(c, 36, 126, 264, 290, 24, hex_color("#10293A"), stroke=hex_color("#1C4258"))
    draw_label(c, "Why this style", 58, 382, accent)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(58, 348, "A more active public face")
    draw_wrapped(c, "Se ve mas potente y comercial. Funciona si quieres que la web proyecte respuesta, control y movimiento.", 58, 318, 214, size=12, leading=18, color=hex_color("#A9BDC8"))
    rounded_rect(c, 334, 126, 586, 290, 24, colors.white)
    rounded_rect(c, 362, 334, 220, 54, 18, hex_color("#F4F7F8"))
    rounded_rect(c, 604, 334, 130, 54, 18, hex_color("#0F2840"))
    rounded_rect(c, 750, 334, 140, 54, 18, accent)
    rounded_rect(c, 362, 164, 528, 144, 24, hex_color("#F3F6F8"))
    c.setFillColor(hex_color("#102436"))
    c.setFont("Helvetica-Bold", 22)
    c.drawString(388, 258, "Homepage with motion, metrics and sharper structure")
    c.setFont("Helvetica", 12)
    draw_wrapped(c, "Hero mas ancho, indicadores visibles, modulos operativos y secciones que guian al visitante sin verse como blog.", 388, 230, 468, size=12, leading=18, color=hex_color("#5D707B"))
    for idx, (x, label) in enumerate([(388, "Service"), (518, "Owner"), (648, "Drivers"), (778, "Contact")]):
        rounded_rect(c, x, 184, 102, 28, 14, colors.white, stroke=hex_color("#D6E0E5"))
        c.setFillColor(hex_color("#102436"))
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(x + 51, 194, label)
    footer(c, "Direction B2")


def page_executive_one(c):
    bg = hex_color("#F8F4EE")
    fg = hex_color("#111C2C")
    accent = hex_color("#B88354")
    header(c, "Alta gama ejecutiva / ejemplo 1", "Quiet luxury corporate homepage", bg, fg, accent)
    rounded_rect(c, 36, 112, 884, 312, 34, hex_color("#EFE6D9"))
    rounded_rect(c, 468, 144, 420, 248, 28, hex_color("#142233"))
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 44)
    c.drawString(68, 330, "A refined")
    c.drawString(68, 282, "executive presence")
    draw_wrapped(c, "Esta opcion se siente mas exclusiva. Menos elementos, mejor proporción, tonos mas maduros y una narrativa premium.", 68, 242, 328, size=13, leading=18, color=hex_color("#5F5A52"))
    rounded_rect(c, 68, 154, 126, 34, 17, accent)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(131, 166, "Explore JONED")
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(500, 346, "Services")
    c.drawString(500, 248, "Recruiting")
    c.drawString(500, 150, "Company")
    c.setFont("Helvetica", 12)
    draw_wrapped(c, "Large, elegant section anchors instead of crowded cards.", 500, 322, 280, size=12, leading=16, color=hex_color("#CDD6DC"))
    draw_wrapped(c, "Owner operators and drivers framed as premium entry paths.", 500, 224, 280, size=12, leading=16, color=hex_color("#CDD6DC"))
    draw_wrapped(c, "Public identity separated from the private operational portal.", 500, 126, 300, size=12, leading=16, color=hex_color("#CDD6DC"))
    footer(c, "Direction C1")


def page_executive_two(c):
    bg = hex_color("#FCF8F2")
    fg = hex_color("#162336")
    accent = hex_color("#A26C43")
    header(c, "Alta gama ejecutiva / ejemplo 2", "Minimal prestige and confidence", bg, fg, accent)
    c.setStrokeColor(hex_color("#E6DBCC"))
    c.setLineWidth(1)
    c.line(36, 404, PAGE_WIDTH - 36, 404)
    c.line(36, 112, PAGE_WIDTH - 36, 112)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 52)
    c.drawString(36, 318, "Professional")
    c.drawString(36, 262, "without noise")
    c.setFont("Helvetica", 14)
    draw_wrapped(c, "Una web de presencia ejecutiva. Mucho espacio, muy poco ruido, mensajes cortos y una imagen de control y madurez.", 36, 222, 360, size=14, leading=19, color=hex_color("#605A54"))
    rounded_rect(c, 474, 146, 446, 226, 18, colors.white, stroke=hex_color("#E4D8CA"))
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(fg)
    c.drawString(504, 330, "Homepage composition")
    c.setFont("Helvetica", 12)
    draw_wrapped(c, "Large type, discreet accent color, elegant dividers and clear entry points for clients and applicants.", 504, 304, 380, size=12, leading=18, color=hex_color("#61707B"))
    for idx, (title, value) in enumerate([("Tone", "Executive"), ("Feel", "Premium"), ("Audience", "Clients + contractors")]):
        y = 252 - idx * 50
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(accent)
        c.drawString(504, y, title.upper())
        c.setFillColor(fg)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(590, y, value)
    footer(c, "Direction C2")


def build_pdf(output_path: Path):
    c = canvas.Canvas(str(output_path), pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    for drawer in [
        page_corporate_one,
        page_corporate_two,
        page_logistics_one,
        page_logistics_two,
        page_executive_one,
        page_executive_two,
    ]:
        drawer(c)
        c.showPage()
    c.save()


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def build_preview_png(output_path: Path, title: str, bg: str, fg: str, accent: str, style: str):
    width, height = 1600, 900
    image = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(image)
    font_title = load_font(44, bold=True)
    font_sub = load_font(24, bold=True)
    font_text = load_font(22, bold=False)
    font_small = load_font(18, bold=False)

    draw.text((60, 40), "JONED TRANSPORT CO.", fill=fg, font=font_sub)
    draw.text((60, 96), title, fill=accent, font=font_small)
    draw.line((60, 134, width - 60, 134), fill=accent, width=3)

    if style == "corporate":
        draw.rounded_rectangle((60, 180, 680, 740), radius=38, fill="white", outline="#DDE4E8", width=2)
        draw.rounded_rectangle((740, 180, 1540, 740), radius=42, fill="#10283B")
        draw.text((96, 236), "Professional clarity", fill=fg, font=font_title)
        draw.text((96, 318), "A calmer, cleaner and more trusted public homepage.", fill="#5D707B", font=font_text)
        for i, label in enumerate(["Services", "Recruiting", "Company"]):
            x0 = 96 + i * 170
            draw.rounded_rectangle((x0, 560, x0 + 140, 620), radius=26, fill="#F4F7F8", outline="#DDE4E8")
            draw.text((x0 + 24, 580), label, fill=fg, font=font_small)
        draw.rounded_rectangle((820, 244, 1120, 560), radius=30, fill="white")
        draw.rounded_rectangle((1160, 244, 1460, 388), radius=28, fill="#FFFFFF22")
        draw.rounded_rectangle((1160, 416, 1460, 560), radius=28, fill="#FFFFFF22")
    elif style == "logistics":
        draw.rounded_rectangle((60, 180, 1540, 740), radius=40, fill="#10293A", outline="#21465D", width=2)
        for x in range(120, 1540, 80):
            draw.line((x, 220, x, 700), fill="#18384D", width=1)
        draw.text((96, 236), "Operational energy", fill="white", font=font_title)
        draw.text((96, 318), "A more active, high-response logistics presence.", fill="#A8BDC8", font=font_text)
        heights = [180, 250, 330, 220, 380]
        cols = ["#235B7A", "#F06D31", "#5DA3C5", "#204D65", "#F59A5A"]
        for i, h in enumerate(heights):
            x0 = 760 + i * 128
            draw.rounded_rectangle((x0, 680 - h, x0 + 74, 680), radius=18, fill=cols[i])
        draw.rounded_rectangle((96, 572, 280, 636), radius=28, fill=accent)
        draw.text((138, 592), "Start with JONED", fill="white", font=font_small)
    else:
        draw.rounded_rectangle((60, 180, 1540, 740), radius=40, fill="#EFE6D9", outline="#E4D8CA", width=2)
        draw.rounded_rectangle((820, 240, 1460, 660), radius=38, fill="#142233")
        draw.text((96, 236), "Executive presence", fill=fg, font=font_title)
        draw.text((96, 318), "A premium, quieter and more mature company image.", fill="#605A54", font=font_text)
        for idx, label in enumerate(["Services", "Recruiting", "Company"]):
            draw.text((860, 300 + idx * 110), label, fill="white", font=font_sub)

    image.save(output_path)


def main():
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "output" / "pdf"
    out_dir.mkdir(parents=True, exist_ok=True)
    output_path = out_dir / "JONED_Public_Web_Design_Directions_2026-07-29.pdf"
    build_pdf(output_path)
    preview_dir = root / "output" / "pdf-previews"
    preview_dir.mkdir(parents=True, exist_ok=True)
    for name, title, bg, fg, accent, style in [
        ("A1", "Corporativa premium - ejemplo 1", "#F4F0E8", "#0D2234", "#C96533", "corporate"),
        ("A2", "Corporativa premium - ejemplo 2", "#F7F6F2", "#102436", "#D7723B", "corporate"),
        ("B1", "Logistica moderna - ejemplo 1", "#0B1E2A", "#FFFFFF", "#F06D31", "logistics"),
        ("B2", "Logistica moderna - ejemplo 2", "#091822", "#FFFFFF", "#FF7D3E", "logistics"),
        ("C1", "Alta gama ejecutiva - ejemplo 1", "#F8F4EE", "#111C2C", "#B88354", "executive"),
        ("C2", "Alta gama ejecutiva - ejemplo 2", "#FCF8F2", "#162336", "#A26C43", "executive"),
    ]:
        build_preview_png(preview_dir / f"{name}.png", title, bg, fg, accent, style)
    print(output_path)


if __name__ == "__main__":
    main()
