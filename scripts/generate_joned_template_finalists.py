from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


PAGE_WIDTH, PAGE_HEIGHT = landscape((13.333 * inch, 7.5 * inch))
PNG_WIDTH, PNG_HEIGHT = 1600, 900


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
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


def pdf_wrap(c, text, x, y, width, font="Helvetica", size=12, leading=16, color=colors.black):
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


def draw_pdf_header(c, title, subtitle, bg, fg, accent):
    c.setFillColor(bg)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(36, PAGE_HEIGHT - 30, "JONED TRANSPORT CO.")
    c.setFillColor(accent)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(36, PAGE_HEIGHT - 58, title)
    c.setStrokeColor(accent)
    c.setLineWidth(2)
    c.line(36, PAGE_HEIGHT - 68, PAGE_WIDTH - 36, PAGE_HEIGHT - 68)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 31)
    c.drawString(36, PAGE_HEIGHT - 96, subtitle)


def page_cargoplus(c):
    bg = colors.HexColor("#F6F2EA")
    fg = colors.HexColor("#091B33")
    accent = colors.HexColor("#FF6F2C")
    draw_pdf_header(c, "Finalist 1 / based on Cargo+", "Structured corporate logistics system", bg, fg, accent)
    pdf_wrap(c, "This line is stronger for a serious company website: modular structure, cleaner hierarchy, and better room for services, recruiting and company trust.", 36, PAGE_HEIGHT - 126, 430, color=colors.HexColor("#61717D"))
    c.setFillColor(colors.white)
    c.setStrokeColor(colors.HexColor("#DDE5E8"))
    c.roundRect(36, 120, 370, 290, 24, fill=1, stroke=1)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(60, 344, "A cleaner public")
    c.drawString(60, 312, "presence for JONED")
    c.setFont("Helvetica", 12)
    pdf_wrap(c, "Company, services and recruiting separated clearly under one premium public experience.", 60, 274, 290, color=colors.HexColor("#61717D"))
    for i, label in enumerate(["Quote", "Owner operators", "Drivers"]):
        x = 60 + i * 98
        c.setFillColor(colors.HexColor("#F3F6F8"))
        c.roundRect(x, 160, 88, 32, 16, fill=1, stroke=0)
        c.setFillColor(fg)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(x + 44, 171, label)
    c.setFillColor(colors.HexColor("#102942"))
    c.roundRect(438, 120, 482, 290, 28, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.roundRect(470, 160, 190, 176, 18, fill=1, stroke=0)
    c.roundRect(690, 256, 198, 80, 18, fill=1, stroke=0)
    c.roundRect(690, 160, 198, 80, 18, fill=1, stroke=0)
    c.setFillColor(fg)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(492, 312, "Services")
    c.drawString(712, 306, "Owner path")
    c.drawString(712, 210, "Driver path")


def page_logitex(c):
    bg = colors.HexColor("#06182E")
    fg = colors.white
    accent = colors.HexColor("#FF6F2C")
    draw_pdf_header(c, "Finalist 2 / based on Logitex", "Modern commercial transport homepage", bg, fg, accent)
    pdf_wrap(c, "This line is more dynamic and sales-oriented. Better if you want stronger impact, motion, and a more modern market-facing tone.", 36, PAGE_HEIGHT - 126, 430, color=colors.HexColor("#AABCC7"))
    c.setFillColor(colors.HexColor("#102740"))
    c.setStrokeColor(colors.HexColor("#26455D"))
    c.roundRect(36, 110, 884, 300, 26, fill=1, stroke=1)
    for x in range(70, 900, 56):
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.06))
        c.line(x, 138, x, 378)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 34)
    c.drawString(60, 330, "Freight, recruiting")
    c.drawString(60, 292, "and visibility in motion")
    c.setFillColor(accent)
    c.roundRect(60, 174, 132, 34, 17, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(126, 186, "Get started")
    cols = [colors.HexColor("#2D678B"), accent, colors.HexColor("#70A9CC"), colors.HexColor("#2F5C79"), colors.HexColor("#F69B5B")]
    heights = [110, 170, 230, 150, 270]
    for i, (col, h) in enumerate(zip(cols, heights)):
        x = 514 + i * 74
        c.setFillColor(col)
        c.roundRect(x, 152, 48, h, 12, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.roundRect(760, 288, 122, 70, 16, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#0D2238"))
    c.setFont("Helvetica-Bold", 24)
    c.drawString(785, 326, "24/7")


def build_pdf(output_path: Path):
    c = canvas.Canvas(str(output_path), pagesize=(PAGE_WIDTH, PAGE_HEIGHT))
    page_cargoplus(c)
    c.showPage()
    page_logitex(c)
    c.showPage()
    c.save()


def draw_common(draw, title, subtitle, bg, fg, accent):
    draw.rectangle((0, 0, PNG_WIDTH, PNG_HEIGHT), fill=bg)
    draw.text((60, 38), "JONED TRANSPORT CO.", fill=fg, font=load_font(34, True))
    draw.text((60, 98), title, fill=accent, font=load_font(22, False))
    draw.line((60, 136, PNG_WIDTH - 60, 136), fill=accent, width=3)
    draw.text((60, 168), subtitle, fill=fg, font=load_font(46, True))


def build_png_cargoplus(path: Path):
    image = Image.new("RGB", (PNG_WIDTH, PNG_HEIGHT), "#F6F2EA")
    draw = ImageDraw.Draw(image)
    draw_common(draw, "Finalist 1 / based on Cargo+", "Structured corporate logistics system", "#F6F2EA", "#091B33", "#FF6F2C")
    draw.rounded_rectangle((60, 240, 660, 760), radius=40, fill="white", outline="#DDE5E8", width=2)
    draw.text((96, 316), "A cleaner public", fill="#091B33", font=load_font(40, True))
    draw.text((96, 374), "presence for JONED", fill="#091B33", font=load_font(40, True))
    draw.text((96, 456), "Company, services and recruiting", fill="#61717D", font=load_font(24, False))
    draw.text((96, 494), "separated clearly and professionally.", fill="#61717D", font=load_font(24, False))
    for i, label in enumerate(["Quote", "Owner", "Drivers"]):
        x = 96 + i * 144
        draw.rounded_rectangle((x, 632, x + 116, 690), radius=26, fill="#F3F6F8", outline="#DCE5E8")
        draw.text((x + 26, 650), label, fill="#091B33", font=load_font(22, True))
    draw.rounded_rectangle((760, 240, 780 + 20, 760), radius=44, fill="#102942")
    draw.rounded_rectangle((812, 340, 1102, 640), radius=30, fill="white")
    draw.rounded_rectangle((1140, 340, 1460, 470), radius=28, fill="white")
    draw.rounded_rectangle((1140, 510, 1460, 640), radius=28, fill="white")
    image.save(path)


def build_png_logitex(path: Path):
    image = Image.new("RGB", (PNG_WIDTH, PNG_HEIGHT), "#06182E")
    draw = ImageDraw.Draw(image)
    draw_common(draw, "Finalist 2 / based on Logitex", "Modern commercial transport homepage", "#06182E", "#FFFFFF", "#FF6F2C")
    draw.rounded_rectangle((60, 240, 1540, 760), radius=42, fill="#102740", outline="#26455D", width=2)
    for x in range(110, 1500, 72):
        draw.line((x, 284, x, 716), fill="#1A3A50", width=1)
    draw.text((96, 328), "Freight, recruiting", fill="#FFFFFF", font=load_font(42, True))
    draw.text((96, 390), "and visibility in motion", fill="#FFFFFF", font=load_font(42, True))
    draw.rounded_rectangle((96, 622, 314, 688), radius=34, fill="#FF6F2C")
    draw.text((136, 642), "Get started", fill="#FFFFFF", font=load_font(24, True))
    heights = [200, 300, 390, 250, 455]
    cols = ["#2D678B", "#FF6F2C", "#70A9CC", "#2F5C79", "#F69B5B"]
    for i, (h, col) in enumerate(zip(heights, cols)):
        x0 = 820 + i * 118
        draw.rounded_rectangle((x0, 706 - h, x0 + 76, 706), radius=18, fill=col)
    draw.rounded_rectangle((1290, 342, 1450, 440), radius=22, fill="#FFFFFF")
    draw.text((1326, 370), "24/7", fill="#0D2238", font=load_font(34, True))
    image.save(path)


def main():
    root = Path(__file__).resolve().parents[1]
    pdf_dir = root / "output" / "pdf"
    pdf_dir.mkdir(parents=True, exist_ok=True)
    preview_dir = root / "output" / "template-finalists"
    preview_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = pdf_dir / "JONED_Template_Finalists_2026-07-29.pdf"
    build_pdf(pdf_path)
    build_png_cargoplus(preview_dir / "finalist-1-cargoplus-inspired.png")
    build_png_logitex(preview_dir / "finalist-2-logitex-inspired.png")
    print(pdf_path)


if __name__ == "__main__":
    main()
