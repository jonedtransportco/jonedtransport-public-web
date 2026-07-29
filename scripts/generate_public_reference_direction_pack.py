from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


PAGE_WIDTH, PAGE_HEIGHT = landscape((13.333 * inch, 7.5 * inch))
PNG_WIDTH, PNG_HEIGHT = 1600, 900


def hx(value: str):
    return colors.HexColor(value)


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Trebuchet MS Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Trebuchet MS.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            try:
                return ImageFont.truetype(str(path), size=size)
            except Exception:
                continue
    return ImageFont.load_default()


def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    current = []
    for word in words:
        trial = " ".join(current + [word])
        if draw.textlength(trial, font=font) <= max_width or not current:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines


def pdf_wrap(c, text, x, y, width, font="Helvetica", size=13, leading=18, color=colors.black):
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


def draw_pdf_header(c, label, title, bg, fg, accent):
    c.setFillColor(bg)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(36, PAGE_HEIGHT - 32, "JONED TRANSPORT CO.")
    c.setFont("Helvetica", 10)
    c.drawRightString(PAGE_WIDTH - 36, PAGE_HEIGHT - 30, "Public homepage reference pack")
    c.setFillColor(accent)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(36, PAGE_HEIGHT - 60, label)
    c.setStrokeColor(accent)
    c.setLineWidth(2)
    c.line(36, PAGE_HEIGHT - 72, PAGE_WIDTH - 36, PAGE_HEIGHT - 72)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 32)
    c.drawString(36, PAGE_HEIGHT - 100, title)


def draw_pdf_footer(c, note):
    c.setStrokeColor(colors.Color(0, 0, 0, alpha=0.08))
    c.line(36, 26, PAGE_WIDTH - 36, 26)
    c.setFillColor(colors.Color(0, 0, 0, alpha=0.6))
    c.setFont("Helvetica", 9)
    c.drawString(36, 12, note)
    c.drawRightString(PAGE_WIDTH - 36, 12, "References reviewed: XPO, J.B. Hunt, Knight-Swift, DHL, DSV, Maersk")


def page_one(c):
    bg = hx("#F6F3ED")
    fg = hx("#102437")
    accent = hx("#D56F37")
    draw_pdf_header(c, "Proposal 1", "Corporate logistics premium", bg, fg, accent)
    pdf_wrap(
        c,
        "This direction mixes Maersk clarity, XPO conversion focus, and DHL-level corporate trust. "
        "It is the strongest fit for JONED if the goal is to look established, disciplined, and scalable.",
        36,
        PAGE_HEIGHT - 132,
        460,
        size=13,
        leading=18,
        color=hx("#60717C"),
    )
    c.setFillColor(colors.white)
    c.setStrokeColor(hx("#D9E2E6"))
    c.roundRect(36, 116, 400, 294, 26, fill=1, stroke=1)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(64, 344, "Public company presence")
    pdf_wrap(c, "Balanced hero, trust metrics, strong recruiting entry, and a cleaner corporate rhythm.", 64, 314, 330, size=12, leading=16, color=hx("#637682"))
    for i, txt in enumerate(["Request a quote", "Owner operators", "Drivers"]):
        x = 64 + i * 108
        c.setFillColor(hx("#F4F7F8"))
        c.setStrokeColor(hx("#DCE5E8"))
        c.roundRect(x, 170, 94, 34, 17, fill=1, stroke=1)
        c.setFillColor(fg)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(x + 47, 182, txt)
    c.setFillColor(hx("#122B3F"))
    c.setStrokeColor(hx("#122B3F"))
    c.roundRect(470, 116, 450, 294, 28, fill=1, stroke=1)
    c.setFillColor(colors.white)
    c.roundRect(500, 166, 180, 174, 18, fill=1, stroke=0)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.12))
    c.roundRect(704, 248, 184, 92, 18, fill=1, stroke=0)
    c.roundRect(704, 138, 184, 92, 18, fill=1, stroke=0)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(524, 304, "Services")
    c.drawString(732, 302, "Owner Operators")
    c.drawString(732, 192, "Drivers")
    c.setFont("Helvetica", 11)
    c.setFillColor(hx("#6A7D87"))
    pdf_wrap(c, "Hero visual with a premium information frame.", 524, 284, 132, size=11, leading=14, color=hx("#6A7D87"))
    c.setFillColor(colors.white)
    pdf_wrap(c, "Clear recruiting path.", 732, 282, 120, size=11, leading=14, color=colors.white)
    pdf_wrap(c, "Separate applicant route.", 732, 172, 120, size=11, leading=14, color=colors.white)
    draw_pdf_footer(c, "Recommendation: strongest default for JONED")


def page_two(c):
    bg = hx("#0B1C29")
    fg = colors.white
    accent = hx("#FF7432")
    draw_pdf_header(c, "Proposal 2", "Commercial operations command", bg, fg, accent)
    pdf_wrap(
        c,
        "This direction pulls harder from XPO and modern logistics patterns: fast action, more energy, more movement, more conversion pressure.",
        36,
        PAGE_HEIGHT - 132,
        460,
        size=13,
        leading=18,
        color=hx("#A9BDC8"),
    )
    c.setFillColor(hx("#10293A"))
    c.setStrokeColor(hx("#244960"))
    c.roundRect(36, 108, 884, 304, 28, fill=1, stroke=1)
    for x in range(70, 900, 54):
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.06))
        c.line(x, 138, x, 378)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 34)
    c.drawString(62, 324, "Move freight with speed")
    c.drawString(62, 286, "and visible control")
    pdf_wrap(c, "Big headline, stronger CTA, operational metrics, and a more active visual language.", 62, 254, 300, size=12, leading=16, color=hx("#A8BDC8"))
    c.setFillColor(accent)
    c.roundRect(62, 176, 146, 36, 18, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(135, 188, "Start with JONED")
    bar_colors = [hx("#2D678B"), accent, hx("#6EABD0"), hx("#326382"), hx("#F59B5B")]
    heights = [116, 180, 228, 152, 256]
    for i, (col, height) in enumerate(zip(bar_colors, heights)):
        x = 520 + i * 74
        c.setFillColor(col)
        c.roundRect(x, 152, 48, height, 12, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.roundRect(760, 284, 124, 74, 16, fill=1, stroke=0)
    c.setFillColor(hx("#102437"))
    c.setFont("Helvetica-Bold", 24)
    c.drawString(782, 326, "24/7")
    c.setFont("Helvetica", 10)
    c.drawString(782, 308, "response feel")
    draw_pdf_footer(c, "Best if JONED wants stronger commercial impact")


def page_three(c):
    bg = hx("#FBF7F1")
    fg = hx("#162437")
    accent = hx("#B27A4D")
    draw_pdf_header(c, "Proposal 3", "Executive trust and prestige", bg, fg, accent)
    pdf_wrap(
        c,
        "This direction is inspired by premium corporate composition rather than generic logistics sites. "
        "It gives JONED a more mature and elevated presence, with less noise and higher perceived quality.",
        36,
        PAGE_HEIGHT - 132,
        470,
        size=13,
        leading=18,
        color=hx("#655D56"),
    )
    c.setFillColor(hx("#EFE4D6"))
    c.setStrokeColor(hx("#E2D5C6"))
    c.roundRect(36, 112, 884, 298, 32, fill=1, stroke=1)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 40)
    c.drawString(64, 324, "A more refined")
    c.drawString(64, 280, "company image")
    pdf_wrap(c, "Minimal but high-confidence. Better for premium positioning, partnerships, and a serious first impression.", 64, 240, 300, size=12, leading=16, color=hx("#625B54"))
    c.setFillColor(hx("#1A2C40"))
    c.roundRect(512, 148, 364, 224, 28, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 21)
    c.drawString(540, 302, "Services")
    c.drawString(540, 232, "Recruiting")
    c.drawString(540, 162, "Company")
    c.setFont("Helvetica", 11)
    pdf_wrap(c, "Large anchors replace repetitive cards.", 664, 300, 176, size=11, leading=14, color=hx("#D0D8DE"))
    pdf_wrap(c, "Owner operators and drivers framed cleanly.", 664, 230, 176, size=11, leading=14, color=hx("#D0D8DE"))
    pdf_wrap(c, "Public trust first, portal separate.", 664, 160, 176, size=11, leading=14, color=hx("#D0D8DE"))
    draw_pdf_footer(c, "Best if JONED wants a more premium executive look")


def build_pdf(output_path: Path):
    c = canvas.Canvas(str(output_path), pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    for drawer in [page_one, page_two, page_three]:
        drawer(c)
        c.showPage()
    c.save()


def png_base(draw, title, subtitle, bg, fg, accent):
    draw.rectangle((0, 0, PNG_WIDTH, PNG_HEIGHT), fill=bg)
    draw.text((60, 38), "JONED TRANSPORT CO.", fill=fg, font=load_font(34, True))
    draw.text((60, 98), title, fill=accent, font=load_font(22, False))
    draw.line((60, 136, PNG_WIDTH - 60, 136), fill=accent, width=3)
    draw.text((60, 164), subtitle, fill=fg, font=load_font(44, True))


def build_png_one(path: Path):
    image = Image.new("RGB", (PNG_WIDTH, PNG_HEIGHT), "#F6F3ED")
    draw = ImageDraw.Draw(image)
    png_base(draw, "Proposal 1", "Corporate logistics premium", "#F6F3ED", "#102437", "#D56F37")
    draw.rounded_rectangle((60, 230, 690, 760), radius=42, fill="white", outline="#DAE3E7", width=2)
    draw.text((96, 290), "Public company presence", fill="#102437", font=load_font(40, True))
    draw.text((96, 360), "Balanced, trusted, scalable.", fill="#60717C", font=load_font(24, False))
    for i, label in enumerate(["Quote", "Owner", "Drivers"]):
        x = 96 + i * 154
        draw.rounded_rectangle((x, 620, x + 128, 680), radius=30, fill="#F3F7F8", outline="#D9E2E6")
        draw.text((x + 32, 640), label, fill="#102437", font=load_font(22, True))
    draw.rounded_rectangle((750, 230, 1540, 760), radius=44, fill="#122B3F")
    draw.rounded_rectangle((804, 330, 274 + 804, 620), radius=30, fill="white")
    draw.rounded_rectangle((1124, 330, 1468, 466), radius=28, fill="#FFFFFF")
    draw.rounded_rectangle((1124, 498, 1468, 634), radius=28, fill="#FFFFFF")
    image.save(path)


def build_png_two(path: Path):
    image = Image.new("RGB", (PNG_WIDTH, PNG_HEIGHT), "#0B1C29")
    draw = ImageDraw.Draw(image)
    png_base(draw, "Proposal 2", "Commercial operations command", "#0B1C29", "#FFFFFF", "#FF7432")
    draw.rounded_rectangle((60, 230, 1540, 760), radius=44, fill="#10293A", outline="#254A60", width=2)
    for x in range(110, 1500, 72):
        draw.line((x, 272, x, 718), fill="#1B3C52", width=1)
    draw.text((96, 300), "Move freight with speed", fill="#FFFFFF", font=load_font(42, True))
    draw.text((96, 366), "and visible control", fill="#FFFFFF", font=load_font(42, True))
    draw.rounded_rectangle((96, 604, 316, 670), radius=34, fill="#FF7432")
    draw.text((138, 624), "Start with JONED", fill="#FFFFFF", font=load_font(24, True))
    heights = [210, 310, 390, 260, 450]
    cols = ["#2D678B", "#FF7432", "#6EABD0", "#326382", "#F59B5B"]
    for i, (h, col) in enumerate(zip(heights, cols)):
        x0 = 820 + i * 118
        draw.rounded_rectangle((x0, 700 - h, x0 + 76, 700), radius=18, fill=col)
    draw.rounded_rectangle((1290, 324, 1440, 420), radius=22, fill="#FFFFFF")
    draw.text((1320, 348), "24/7", fill="#102437", font=load_font(34, True))
    image.save(path)


def build_png_three(path: Path):
    image = Image.new("RGB", (PNG_WIDTH, PNG_HEIGHT), "#FBF7F1")
    draw = ImageDraw.Draw(image)
    png_base(draw, "Proposal 3", "Executive trust and prestige", "#FBF7F1", "#162437", "#B27A4D")
    draw.rounded_rectangle((60, 230, 1540, 760), radius=46, fill="#EFE4D6", outline="#E2D5C6", width=2)
    draw.text((96, 298), "A more refined", fill="#162437", font=load_font(46, True))
    draw.text((96, 360), "company image", fill="#162437", font=load_font(46, True))
    draw.text((96, 446), "Minimal, premium, mature.", fill="#655D56", font=load_font(24, False))
    draw.rounded_rectangle((936, 292, 1460, 666), radius=36, fill="#1A2C40")
    for idx, label in enumerate(["Services", "Recruiting", "Company"]):
        draw.text((984, 364 + idx * 112), label, fill="#FFFFFF", font=load_font(34, True))
    image.save(path)


def main():
    root = Path(__file__).resolve().parents[1]
    pdf_dir = root / "output" / "pdf"
    pdf_dir.mkdir(parents=True, exist_ok=True)
    preview_dir = root / "output" / "reference-previews"
    preview_dir.mkdir(parents=True, exist_ok=True)

    pdf_path = pdf_dir / "JONED_Public_Web_Reference_Directions_2026-07-29.pdf"
    build_pdf(pdf_path)
    build_png_one(preview_dir / "proposal-1-corporate-logistics-premium.png")
    build_png_two(preview_dir / "proposal-2-commercial-operations-command.png")
    build_png_three(preview_dir / "proposal-3-executive-trust-and-prestige.png")
    print(pdf_path)


if __name__ == "__main__":
    main()
