#!/usr/bin/env python3
"""Render the Academy 'how to sell or gift a course' one-pager to PDF.

Usage: python3 scripts/academy-onepager.py ~/Desktop/Academy-Course-Access-Guide.pdf
Edit the CODES / PRICES tables below when codes or prices change.
"""
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

OUT = sys.argv[1] if len(sys.argv) > 1 else "Academy-Course-Access-Guide.pdf"
SITE = "https://www.brettlechtenberg.com/academy"

COURSES = [
    ("The Master's Edge Framework", "$99", "FRAMEWORK-3CTT"),
    ("Master's Edge Business Tools", "$499", "TOOLS-V384"),
    ("Reclaiming the Clock", "$499", "CLOCK-2JJU"),
    ("The Master's Edge Book", "$999", "BOOK-SXBP"),
]

GOLD = colors.HexColor("#b8860b")
INK = colors.HexColor("#1a1a1a")
MUTED = colors.HexColor("#555555")

ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=ss["Title"], fontSize=18, leading=22, textColor=INK, spaceAfter=2, alignment=0)
SUB = ParagraphStyle("Sub", parent=ss["Normal"], fontSize=9.5, textColor=MUTED, spaceAfter=8)
H2 = ParagraphStyle("H2", parent=ss["Heading2"], fontSize=11.5, leading=14, textColor=GOLD, spaceBefore=8, spaceAfter=3)
BODY = ParagraphStyle("Body", parent=ss["Normal"], fontSize=9.2, leading=12)
STEP = ParagraphStyle("Step", parent=BODY, leftIndent=14, firstLineIndent=-14, spaceAfter=1.5)
SMALL = ParagraphStyle("Small", parent=BODY, fontSize=8.2, leading=10.5, textColor=MUTED)


def steps(items):
    return [Paragraph(f"<b>{i}.</b>&nbsp; {t}", STEP) for i, t in enumerate(items, 1)]


doc = SimpleDocTemplate(
    OUT, pagesize=letter, leftMargin=0.7 * inch, rightMargin=0.7 * inch, topMargin=0.55 * inch, bottomMargin=0.5 * inch,
    title="Master's Edge Academy — Selling & Gifting Courses", author="Brett Lechtenberg",
)

story = [
    Paragraph("Master's Edge Academy — Selling &amp; Gifting Courses", H1),
    Paragraph(f"One-page operator guide · {SITE} · updated Sep 8, 2026", SUB),
]

# Course table
rows = [["Course", "Price", "Gift code (100% off)"]] + [list(c) for c in COURSES]
t = Table(rows, colWidths=[3.2 * inch, 0.9 * inch, 2.4 * inch])
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), INK),
    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
    ("FONTNAME", (2, 1), (2, -1), "Courier-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 9.5),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
    ("GRID", (0, 0), (-1, -1), 0.4, colors.lightgrey),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
]))
story += [t, Spacer(1, 4)]
story.append(Paragraph(
    "Joining the Academy is free. Each course is unlocked separately — by paying, or by entering that "
    "course's gift code at checkout. A gift code only works for its own course.", BODY))

story.append(Paragraph("A. Someone wants to BUY a course", H2))
story += steps([
    f"Send them this link: <b>{SITE}</b>",
    "They click <b>Sign up</b> (name, email, password — no code needed) and land on their dashboard.",
    "They open <b>Modules</b>, find the course, and click <b>Unlock course · $price</b>.",
    "Stripe Checkout opens. They pay by card. They're sent straight back to the course, unlocked.",
    "You'll see the payment in Stripe → <b>Payments</b>. Nothing else to do — access is automatic.",
])

story.append(Paragraph("B. You want to GIVE a course away", H2))
story += steps([
    "Copy the gift code for that course from the table above.",
    f"Send them: “Go to <b>{SITE}</b>, sign up (free), open Modules, click <b>Unlock course</b> "
    "on <i>[course name]</i>, then click <b>Add promotion code</b> on the Stripe page and enter "
    "<b>[CODE]</b>. Total becomes $0.00 — click <b>Complete order</b>.”",
    "They're sent back to the course, unlocked. No card is asked for.",
])
story.append(Paragraph(
    "Ready-to-paste message: “I'd like to gift you <i>Reclaiming the Clock</i>. Sign up free at "
    f"{SITE}, open Modules, click Unlock course on Reclaiming the Clock, then on the checkout page click "
    "‘Add promotion code’ and enter CLOCK-2JJU. It'll show $0.00 — just click Complete order and you're in.”",
    SMALL))

story.append(Paragraph("C. Managing gift codes (Stripe dashboard, Brettlechtenberg account)", H2))
story += steps([
    "The four codes above have <b>no redemption limit</b>. Anyone with the code can use it — share carefully.",
    "<b>One-person code:</b> Stripe → Product catalog → <b>Coupons</b> → open the course's “… — gift” coupon "
    "→ <b>Add promotion code</b> → type a code (e.g. CLOCK-JANE) → Max redemptions <b>1</b> → Save.",
    "<b>Kill a code:</b> Coupons → open the coupon → Promotion codes → toggle the code <b>Inactive</b>.",
    "<b>Change a price:</b> Product catalog → the course → Add another price → set it as default. "
    "The site shows the new price immediately (no redeploy) as long as you paste the new price ID into "
    "Vercel → Settings → Environment Variables (STRIPE_PRICE_…) — or ask Claude Code to do it.",
])

story.append(Paragraph("D. If something goes wrong", H2))
story += steps([
    "<b>“Paid but still locked”:</b> tell them to log out and back in, then open Modules. If still locked, "
    "check Stripe → Developers → Webhooks → the brettlechtenberg.com endpoint → recent deliveries.",
    "<b>Grant access by hand</b> (no Stripe): ask Claude Code to “grant &lt;email&gt; the &lt;course&gt; course” — "
    "it inserts a row in <b>me_course_access</b> with source = admin.",
    "<b>Refund:</b> Stripe → Payments → the payment → Refund. Then ask Claude Code to revoke that course.",
])

story.append(Spacer(1, 6))
story.append(Paragraph(
    "Course IDs (for support requests): framework · business-tools · reclaiming-the-clock · masters-edge-book. "
    "Full technical runbook: docs/ACADEMY.md → Paywall, in the website repo.", SMALL))

doc.build(story)
print(f"wrote {OUT}")
