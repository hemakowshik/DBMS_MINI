import os
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Polygon

from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def draw_er_diagram_image(output_image_path):
    fig, ax = plt.subplots(figsize=(22, 13.5), dpi=300)
    ax.set_xlim(0, 22)
    ax.set_ylim(0, 13.5)
    ax.axis('off')

    # Background canvas
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#F8FAFC')

    # Title & Academic Banner
    ax.text(11, 13.1, "PES UNIVERSITY • DEPARTMENT OF ARTIFICIAL INTELLIGENCE & MACHINE LEARNING", 
            ha='center', va='center', fontsize=12, fontweight='bold', color='#64748B', fontfamily='sans-serif')
    ax.text(11, 12.65, "IPOWatch Intelligence Platform (MARK4) — Entity-Relationship (ER) Architecture", 
            ha='center', va='center', fontsize=19, fontweight='heavy', color='#0F172A', fontfamily='sans-serif')
    ax.text(11, 12.25, "Hybrid Polyglot Schema: 9 BCNF Relational Tables + MongoDB Document Lake | Faculty Evaluator: Prof. Smitha G R", 
            ha='center', va='center', fontsize=10.5, fontstyle='italic', color='#0F766E', fontfamily='sans-serif')

    # Helper function to draw an entity box
    def draw_entity(x, y, w, h, title, pk_list, attr_list, header_bg='#1E293B', border_color='#0F172A'):
        # Outer box
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.04,rounding_size=0.15",
                              linewidth=1.8, edgecolor=border_color, facecolor='#FFFFFF', zorder=2)
        ax.add_patch(rect)
        
        # Header box
        header_h = 0.52
        header_rect = FancyBboxPatch((x, y + h - header_h), w, header_h, 
                                     boxstyle="round,pad=0.02,rounding_size=0.12",
                                     linewidth=0, facecolor=header_bg, zorder=3)
        ax.add_patch(header_rect)
        
        # Header text
        ax.text(x + w/2, y + h - header_h/2, title, ha='center', va='center', 
                fontsize=9.5, fontweight='bold', color='#FFFFFF', fontfamily='sans-serif', zorder=4)
        
        # Attribute text
        curr_y = y + h - header_h - 0.22
        line_spacing = 0.23
        
        # Draw PK / UK first
        for pk in pk_list:
            ax.text(x + 0.15, curr_y, pk, ha='left', va='center', 
                    fontsize=8.0, fontweight='bold', color='#B45309' if '[PK]' in pk else '#047857', 
                    fontfamily='monospace', zorder=4)
            curr_y -= line_spacing
            
        # Draw line separator
        if pk_list and attr_list:
            ax.plot([x + 0.1, x + w - 0.1], [curr_y + 0.1, curr_y + 0.1], 
                    color='#E2E8F0', linewidth=1.0, zorder=3)
            curr_y -= 0.08
            
        # Draw regular attributes
        for attr in attr_list:
            color = '#334155'
            if '[FK]' in attr:
                color = '#1D4ED8'
            ax.text(x + 0.15, curr_y, attr, ha='left', va='center', 
                    fontsize=7.6, color=color, fontfamily='sans-serif', zorder=4)
            curr_y -= line_spacing

    # Helper function to draw relationship diamond
    def draw_diamond(cx, cy, label, card_in="1", card_out="N", size=0.42, bg='#0284C7', fg='#FFFFFF'):
        d_poly = Polygon([
            (cx, cy + size),
            (cx + size*1.5, cy),
            (cx, cy - size),
            (cx - size*1.5, cy)
        ], facecolor=bg, edgecolor='#0369A1', linewidth=1.4, zorder=5)
        ax.add_patch(d_poly)
        ax.text(cx, cy, label, ha='center', va='center', fontsize=7.2, fontweight='bold', 
                color=fg, fontfamily='sans-serif', zorder=6)

    # 1. CENTER MASTER ENTITY: ipos
    draw_entity(
        x=9.0, y=5.0, w=4.0, h=3.3,
        title="ipos (Primary Offering Master)",
        pk_list=[
            "[PK] ipo_id: INT AUTO_INC",
            "[UK] symbol: VARCHAR(20) NOT NULL"
        ],
        attr_list=[
            "company_name: VARCHAR(150)",
            "exchange: VARCHAR(20) [NSE|BSE]",
            "segment: VARCHAR(20) [Mainboard|SME]",
            "issue_size_cr: DECIMAL(12,2)",
            "price_band_min / max: DECIMAL(10,2)",
            "lot_size: INTEGER",
            "open_date, close_date: DATE",
            "listing_date: DATE",
            "status: VARCHAR(20) [Open|Closed|List]"
        ],
        header_bg='#0F172A', border_color='#0F172A'
    )

    # 2. LEFT TOP: ipo_reservations
    draw_entity(
        x=0.8, y=8.8, w=3.8, h=2.6,
        title="ipo_reservations (Statutory Quotas)",
        pk_list=["[PK] reservation_id: INT AUTO_INC"],
        attr_list=[
            "[FK] ipo_id: INT -> ipos(ipo_id)",
            "category: VARCHAR(30) [QIB|NII|Retail]",
            "shares_offered: BIGINT",
            "pct_of_issue: DECIMAL(5,2)",
            "quota_amount_cr: DECIMAL(12,2)"
        ],
        header_bg='#0F766E', border_color='#0F766E'
    )

    # 3. LEFT MIDDLE: anchor_investors
    draw_entity(
        x=0.8, y=5.2, w=3.8, h=2.9,
        title="anchor_investors (Syndicate Allotments)",
        pk_list=["[PK] allocation_id: INT AUTO_INC"],
        attr_list=[
            "[FK] ipo_id: INT -> ipos(ipo_id)",
            "anchor_name: VARCHAR(200)",
            "category: VARCHAR(50) [MF|FPI|AIF|Ins]",
            "shares_allocated: BIGINT",
            "allocation_price: DECIMAL(10,2)",
            "pct_of_anchor_portion: DECIMAL(5,2)"
        ],
        header_bg='#3730A3', border_color='#3730A3'
    )

    # 4. LEFT BOTTOM: anchor_lockin_summary
    draw_entity(
        x=0.8, y=1.2, w=3.8, h=3.3,
        title="anchor_lockin_summary (Two-Tier Lock-in)",
        pk_list=["[PK] lockin_id: INT AUTO_INC"],
        attr_list=[
            "[FK, UK] ipo_id: INT -> ipos(ipo_id)",
            "bid_date: DATE",
            "allocation_price: DECIMAL(10,2)",
            "qib_portion_pct: DECIMAL(5,2)",
            "shares_locked_30d: BIGINT (50%)",
            "expiry_date_30d: DATE",
            "shares_locked_90d: BIGINT (50%)",
            "expiry_date_90d: DATE",
            "total_anchor_shares: BIGINT"
        ],
        header_bg='#581C87', border_color='#581C87'
    )

    # 5. TOP CENTER: drhp_rhp_diffs
    draw_entity(
        x=9.0, y=9.5, w=4.0, h=2.5,
        title="drhp_rhp_diffs (Post-SEBI Variance)",
        pk_list=["[PK] diff_id: INT AUTO_INC"],
        attr_list=[
            "[FK] ipo_id: INT -> ipos(ipo_id)",
            "section_name: VARCHAR(100)",
            "drhp_disclosure: TEXT",
            "rhp_disclosure: TEXT",
            "variance_category: VARCHAR(50)",
            "severity: VARCHAR(20) [High|Med|Low]"
        ],
        header_bg='#881337', border_color='#881337'
    )

    # 6. BOTTOM CENTER: subscription_bids
    draw_entity(
        x=9.0, y=1.2, w=4.0, h=2.9,
        title="subscription_bids (Day-by-Day Progression)",
        pk_list=["[PK] bid_id: INT AUTO_INC"],
        attr_list=[
            "[FK] ipo_id: INT -> ipos(ipo_id)",
            "bidding_day: VARCHAR(20) [Day 1-3|Final]",
            "qib_multiple: DECIMAL(6,2)",
            "nii_multiple: DECIMAL(6,2)",
            "retail_multiple: DECIMAL(6,2)",
            "total_multiple: DECIMAL(6,2)",
            "snapshot_time: TIMESTAMP"
        ],
        header_bg='#B45309', border_color='#B45309'
    )

    # 7. RIGHT TOP: secondary_listing_metrics
    draw_entity(
        x=17.4, y=8.8, w=3.8, h=2.9,
        title="secondary_listing_metrics (Price Discovery)",
        pk_list=["[PK] listing_id: INT AUTO_INC"],
        attr_list=[
            "[FK, UK] ipo_id: INT -> ipos(ipo_id)",
            "symbol: VARCHAR(20)",
            "listing_date: DATE",
            "issue_price: DECIMAL(10,2)",
            "listing_open_price: DECIMAL(10,2) [IEP]",
            "listing_gain_pct: DECIMAL(6,2)",
            "day1_close_price: DECIMAL(10,2)",
            "listing_status: [Premium|Par|Discount]"
        ],
        header_bg='#065F46', border_color='#065F46'
    )

    # 8. RIGHT MIDDLE: gmp_platform_records
    draw_entity(
        x=17.4, y=5.0, w=3.8, h=3.0,
        title="gmp_platform_records (Multi-Source Quotes)",
        pk_list=["[PK] gmp_id: INT AUTO_INC"],
        attr_list=[
            "[FK] ipo_id: INT -> ipos(ipo_id)",
            "platform: VARCHAR(50) [IG|Watch|Chittor]",
            "recorded_at: DATETIME",
            "gmp_price: DECIMAL(10,2)",
            "est_listing_price: DECIMAL(10,2)",
            "expected_gain_pct: DECIMAL(6,2)",
            "rating: VARCHAR(20)"
        ],
        header_bg='#155E75', border_color='#155E75'
    )

    # 9. RIGHT BOTTOM: gmp_accuracy_eval
    draw_entity(
        x=17.4, y=1.2, w=3.8, h=3.0,
        title="gmp_accuracy_eval (MAE Forensic Audit)",
        pk_list=["[PK] eval_id: INT AUTO_INC"],
        attr_list=[
            "[FK] ipo_id: INT -> ipos(ipo_id)",
            "platform: VARCHAR(50)",
            "predicted_listing_price: DECIMAL(10,2)",
            "actual_listing_price: DECIMAL(10,2) [IEP]",
            "prediction_error_rs: DECIMAL(10,2)",
            "absolute_error_pct: DECIMAL(6,2) [MAE]",
            "forecast_bias: [Overestimate|Underestimate]"
        ],
        header_bg='#334155', border_color='#334155'
    )

    # ==================== DRAW RELATIONSHIP DIAMONDS & CONNECTOR LINES ====================
    # Line styles
    l_kw = dict(color='#2563EB', linewidth=1.6, zorder=2)
    t_kw = dict(fontsize=8, fontweight='bold', color='#1E3A8A', fontfamily='sans-serif', zorder=6)

    # 1. ipos -> ipo_reservations (1 : N)
    draw_diamond(6.8, 8.4, "RESERVES\nQUOTAS", card_in="1", card_out="N", size=0.48, bg='#0F766E')
    ax.plot([9.0, 7.5], [7.2, 8.4], **l_kw)
    ax.plot([6.1, 4.6], [8.4, 9.5], **l_kw)
    ax.text(8.7, 7.0, "1", **t_kw)
    ax.text(4.8, 9.6, "N", **t_kw)

    # 2. ipos -> anchor_investors (1 : N)
    draw_diamond(6.7, 6.4, "ALLOCATES\nANCHORS", card_in="1", card_out="N", size=0.48, bg='#3730A3')
    ax.plot([9.0, 7.4], [6.4, 6.4], **l_kw)
    ax.plot([6.0, 4.6], [6.4, 6.4], **l_kw)
    ax.text(8.7, 6.55, "1", **t_kw)
    ax.text(4.8, 6.55, "N", **t_kw)

    # 3. ipos -> anchor_lockin_summary (1 : 1)
    draw_diamond(6.8, 3.8, "SCHEDULES\nLOCK-IN", card_in="1", card_out="1", size=0.48, bg='#581C87')
    ax.plot([9.0, 7.5], [5.6, 3.8], **l_kw)
    ax.plot([6.1, 4.6], [3.8, 2.8], **l_kw)
    ax.text(8.7, 5.75, "1", **t_kw)
    ax.text(4.8, 2.65, "1", **t_kw)

    # 4. ipos -> drhp_rhp_diffs (1 : N)
    draw_diamond(11.0, 8.9, "SURVEILS\nVARIANCES", card_in="1", card_out="N", size=0.48, bg='#881337')
    ax.plot([11.0, 11.0], [8.3, 8.4], **l_kw)
    ax.plot([11.0, 11.0], [9.4, 9.5], **l_kw)
    ax.text(11.15, 8.4, "1", **t_kw)
    ax.text(11.15, 9.35, "N", **t_kw)

    # 5. ipos -> subscription_bids (1 : N)
    draw_diamond(11.0, 4.4, "RECEIVES\nBIDS", card_in="1", card_out="N", size=0.48, bg='#B45309')
    ax.plot([11.0, 11.0], [5.0, 4.9], **l_kw)
    ax.plot([11.0, 11.0], [3.9, 4.1], **l_kw)
    ax.text(11.15, 4.85, "1", **t_kw)
    ax.text(11.15, 4.15, "N", **t_kw)

    # 6. ipos -> secondary_listing_metrics (1 : 1)
    draw_diamond(15.2, 8.4, "DISCOVERS\nPRICE", card_in="1", card_out="1", size=0.48, bg='#065F46')
    ax.plot([13.0, 14.5], [7.2, 8.4], **l_kw)
    ax.plot([15.9, 17.4], [8.4, 9.5], **l_kw)
    ax.text(13.2, 7.0, "1", **t_kw)
    ax.text(17.1, 9.6, "1", **t_kw)

    # 7. ipos -> gmp_platform_records (1 : N)
    draw_diamond(15.2, 6.4, "RECORDS\nGMP", card_in="1", card_out="N", size=0.48, bg='#155E75')
    ax.plot([13.0, 14.5], [6.4, 6.4], **l_kw)
    ax.plot([15.9, 17.4], [6.4, 6.4], **l_kw)
    ax.text(13.2, 6.55, "1", **t_kw)
    ax.text(17.1, 6.55, "N", **t_kw)

    # 8. ipos -> gmp_accuracy_eval (1 : N)
    draw_diamond(15.2, 3.8, "BENCHMARKS\nACCURACY", card_in="1", card_out="N", size=0.48, bg='#334155')
    ax.plot([13.0, 14.5], [5.6, 3.8], **l_kw)
    ax.plot([15.9, 17.4], [3.8, 2.8], **l_kw)
    ax.text(13.2, 5.75, "1", **t_kw)
    ax.text(17.1, 2.65, "N", **t_kw)

    # ==================== BOTTOM POLYGLOT NOSQL CLUSTER ====================
    # Container box for MongoDB Collections
    nosql_box = FancyBboxPatch((0.8, 0.1), 12.2, 0.9, boxstyle="round,pad=0.04,rounding_size=0.12",
                               linewidth=1.4, edgecolor='#10B981', facecolor='#F0FDF4', linestyle='--', zorder=2)
    ax.add_patch(nosql_box)
    
    ax.text(1.0, 0.75, "NoSQL Document Lake (MongoDB Atlas / Local JSON Collections) — Dynamic Polymorphic Storage:", 
            fontsize=8.5, fontweight='bold', color='#065F46', fontfamily='sans-serif', zorder=4)
    
    colls_text = (
        "• company_filings (DRHP/RHP PDFs, BSE links, AV MP4s)    "
        "• media_and_research (Analyst YouTube briefings, transcripts)\n"
        "• peer_comparison_matrix (Polymorphic metrics across sectors)    "
        "• drhp_rhp_deep_sections (Qualitative legal risk factors & footnotes)"
    )
    ax.text(1.0, 0.35, colls_text, fontsize=7.2, color='#047857', fontfamily='monospace', zorder=4)

    # Soft Link Arrow from ipos to NoSQL
    ax.annotate(
        "Soft Polyglot Link: {symbol}",
        xy=(7.0, 0.95), xytext=(9.2, 4.95),
        arrowprops=dict(arrowstyle="->", color='#10B981', lw=1.8, linestyle=':'),
        fontsize=7.8, fontweight='bold', color='#047857', fontfamily='sans-serif', zorder=5
    )

    # ==================== LEGEND BOX ====================
    leg_box = FancyBboxPatch((13.4, 0.1), 7.8, 0.9, boxstyle="round,pad=0.04,rounding_size=0.12",
                             linewidth=1.2, edgecolor='#94A3B8', facecolor='#FFFFFF', zorder=2)
    ax.add_patch(leg_box)
    
    ax.text(13.6, 0.78, "SCHEMA LEGEND & ARCHITECTURAL STANDARDS", 
            fontsize=8.0, fontweight='bold', color='#1E293B', fontfamily='sans-serif', zorder=4)
    
    legend_items = (
        "[PK] Primary Key (Unique Surrogate)    [FK] Foreign Key (ON DELETE CASCADE)    [UK] Unique Candidate Key\n"
        "— Relational Association Line (1:N, 1:1)    ◇ Relationship Diamond (Verb Phase)    ····· Polyglot Document Link\n"
        "Normalization: Boyce-Codd Normal Form (BCNF) — Zero Partial or Transitive Functional Dependencies"
    )
    ax.text(13.6, 0.32, legend_items, fontsize=6.8, color='#475569', fontfamily='sans-serif', zorder=4)

    plt.tight_layout()
    plt.savefig(output_image_path, format='png', dpi=300, bbox_inches='tight', pad_inches=0.15)
    plt.close()
    print(f"[SUCCESS] High-resolution ER Diagram image generated at: {output_image_path}")

# Numbered Canvas for PDF
class NumberedCanvasLandscape(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Header on pages > 1
        if self._pageNumber > 1:
            self.drawString(54, 8.5 * inch - 36, "IPOWatch Intelligence MARK4 | Entity-Relationship (ER) Architecture & Relational Mapping")
            self.drawRightString(11 * inch - 54, 8.5 * inch - 36, "Dept of AIML • PES University • CS304")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 8.5 * inch - 40, 11 * inch - 54, 8.5 * inch - 40)

        # Footer on all pages
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 28, "DBMS Mini Project Viva Voce Defense Dossier | Evaluator: Prof. Smitha G R")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(11 * inch - 54, 28, page_str)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 38, 11 * inch - 54, 38)
        self.restoreState()

def build_er_pdf(pdf_path, er_image_path):
    # Landscape Letter: 11 x 8.5 inches = 792 x 612 pt
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=landscape(letter),
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    primary_color = colors.HexColor("#0F172A")
    accent_blue = colors.HexColor("#1E40AF")
    teal_dark = colors.HexColor("#0F766E")
    slate_dark = colors.HexColor("#334155")
    card_bg = colors.HexColor("#F8FAFC")
    border_color = colors.HexColor("#E2E8F0")

    h1_style = ParagraphStyle(
        'H1_Land',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=accent_blue,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'H2_Land',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=teal_dark,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Land',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=slate_dark,
        spaceAfter=4
    )

    tbl_hdr = ParagraphStyle(
        'TableHdrLand',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.0,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    tbl_cell = ParagraphStyle(
        'TableCellLand',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.0,
        leading=8.8,
        textColor=slate_dark,
        alignment=TA_LEFT
    )

    tbl_cell_bold = ParagraphStyle(
        'TableCellBoldLand',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.0,
        leading=8.8,
        textColor=primary_color,
        alignment=TA_LEFT
    )

    tbl_cell_code = ParagraphStyle(
        'TableCellCodeLand',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=8.5,
        textColor=colors.HexColor("#0F766E"),
        alignment=TA_LEFT
    )

    story = []

    # ==================== PAGE 1: THE ER DIAGRAM ====================
    # Image fits inside 720 x 530 pt printable area
    img_w = 720
    img_h = 525
    story.append(Image(er_image_path, width=img_w, height=img_h))
    story.append(PageBreak())

    # ==================== PAGE 2: RELATIONAL SCHEMA MAPPING & BCNF PROOF ====================
    story.append(Paragraph("Relational Schema Mapping & Formal BCNF Normalization Specification", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=accent_blue, spaceBefore=1, spaceAfter=4))
    
    story.append(Paragraph(
        "The conceptual ER diagram above maps directly to <b>9 Boyce-Codd Normal Form (BCNF) Relational Schemas</b>. "
        "Every functional dependency has a candidate key on the left-hand side. Referential integrity is strictly maintained "
        "via foreign keys with <code>ON DELETE CASCADE</code>.",
        body_style
    ))

    # Relational Schemas Table
    mapping_data = [
        [Paragraph("Relational Table", tbl_hdr), Paragraph("Formal Relational Schema Notation (PK underlined, FK dashed/bold)", tbl_hdr), Paragraph("Cardinality & Foreign Key Constraint", tbl_hdr)],
        [
            Paragraph("<b>ipos</b> (Master)", tbl_cell_bold),
            Paragraph("<u>ipo_id</u>, <b>symbol</b> [UK], company_name, exchange, segment, issue_size_cr, price_band_min, price_band_max, lot_size, open_date, close_date, listing_date, status", tbl_cell_code),
            Paragraph("Parent Entity. Primary Key: <code>ipo_id</code>. Candidate Key: <code>symbol</code>.", tbl_cell)
        ],
        [
            Paragraph("<b>ipo_reservations</b>", tbl_cell_bold),
            Paragraph("<u>reservation_id</u>, <b>ipo_id [FK]</b>, category, shares_offered, pct_of_issue, quota_amount_cr", tbl_cell_code),
            Paragraph("1 : N from <code>ipos</code>. <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
        [
            Paragraph("<b>anchor_investors</b>", tbl_cell_bold),
            Paragraph("<u>allocation_id</u>, <b>ipo_id [FK]</b>, anchor_name, category, shares_allocated, allocation_price, pct_of_anchor_portion", tbl_cell_code),
            Paragraph("1 : N from <code>ipos</code>. <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
        [
            Paragraph("<b>anchor_lockin_summary</b>", tbl_cell_bold),
            Paragraph("<u>lockin_id</u>, <b>ipo_id [FK, UK]</b>, bid_date, allocation_price, qib_portion_pct, shares_locked_30d, expiry_date_30d, shares_locked_90d, expiry_date_90d, total_anchor_shares", tbl_cell_code),
            Paragraph("1 : 1 from <code>ipos</code> (Unique FK). <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
        [
            Paragraph("<b>subscription_bids</b>", tbl_cell_bold),
            Paragraph("<u>bid_id</u>, <b>ipo_id [FK]</b>, bidding_day, qib_multiple, nii_multiple, retail_multiple, total_multiple, snapshot_time", tbl_cell_code),
            Paragraph("1 : N from <code>ipos</code>. <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
        [
            Paragraph("<b>secondary_listing_metrics</b>", tbl_cell_bold),
            Paragraph("<u>listing_id</u>, <b>ipo_id [FK, UK]</b>, symbol, listing_date, issue_price, listing_open_price, listing_gain_pct, day1_close_price, listing_status", tbl_cell_code),
            Paragraph("1 : 1 from <code>ipos</code> (Unique FK). <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
        [
            Paragraph("<b>gmp_platform_records</b>", tbl_cell_bold),
            Paragraph("<u>gmp_id</u>, <b>ipo_id [FK]</b>, platform, recorded_at, gmp_price, est_listing_price, expected_gain_pct, rating", tbl_cell_code),
            Paragraph("1 : N from <code>ipos</code>. <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
        [
            Paragraph("<b>gmp_accuracy_eval</b>", tbl_cell_bold),
            Paragraph("<u>eval_id</u>, <b>ipo_id [FK]</b>, platform, predicted_listing_price, actual_listing_price, prediction_error_rs, absolute_error_pct, forecast_bias", tbl_cell_code),
            Paragraph("1 : N from <code>ipos</code>. <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
        [
            Paragraph("<b>drhp_rhp_diffs</b>", tbl_cell_bold),
            Paragraph("<u>diff_id</u>, <b>ipo_id [FK]</b>, section_name, drhp_disclosure, rhp_disclosure, variance_category, severity", tbl_cell_code),
            Paragraph("1 : N from <code>ipos</code>. <code>FOREIGN KEY (ipo_id) REFERENCES ipos(ipo_id) ON DELETE CASCADE</code>", tbl_cell)
        ],
    ]
    mapping_table = Table(mapping_data, colWidths=[110, 410, 200])
    mapping_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1E293B")),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, card_bg]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(mapping_table)
    story.append(Spacer(1, 4))

    # BCNF Proof Box
    story.append(Paragraph("Formal Boyce-Codd Normal Form (BCNF) Mathematical Justification", h2_style))
    bcnf_data = [
        [
            Paragraph("<b>Definition:</b> A relation schema <i>R</i> is in BCNF with respect to a set <i>F</i> of functional dependencies if, for all functional dependencies in <i>F<sup>+</sup></i> of the form <i>X &rarr; Y</i>, where <i>X &sube; R</i> and <i>Y &sube; R</i>, at least one of the following holds: (1) <i>X &rarr; Y</i> is a trivial dependency (<i>Y &sube; X</i>), or (2) <i>X</i> is a <b>superkey</b> for <i>R</i>.<br/>"
                      "<b>Application in MARK4:</b><br/>"
                      "&bull; In <code>ipos</code>: Candidate keys are <i>{ipo_id}</i> and <i>{symbol}</i>. Any FD such as <i>ipo_id &rarr; {company_name, price_band_max}</i> has <i>ipo_id</i> as a superkey. There are zero non-superkey determinants.<br/>"
                      "&bull; <b>Elimination of Partial Dependencies (1NF &rarr; 2NF):</b> No composite primary keys exist. All non-key attributes depend on the whole surrogate primary key.<br/>"
                      "&bull; <b>Elimination of Transitive Dependencies (2NF &rarr; 3NF &rarr; BCNF):</b> Anchor investor details, quotas, and bids were factored into independent relations, eliminating dependencies like <i>ipo_id &rarr; anchor_name &rarr; anchor_category</i>.", body_style)
        ]
    ]
    bcnf_table = Table(bcnf_data, colWidths=[720])
    bcnf_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#93C5FD")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(bcnf_table)
    story.append(PageBreak())

    # ==================== PAGE 3: POLYGLOT QUERY WORKFLOW & VIVA DEFENSE ====================
    story.append(Paragraph("Polyglot Relational vs NoSQL Architecture & Viva Voce Defense Guide", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=accent_blue, spaceBefore=1, spaceAfter=4))
    
    story.append(Paragraph(
        "This section illustrates how queries are routed between the Relational SQLite/MySQL engine and the MongoDB Document Lake, "
        "and equips the student team with definitive answers to faculty ER diagram questions.",
        body_style
    ))

    # Polyglot vs Relational Table
    poly_data = [
        [Paragraph("Data Entity / Domain", tbl_hdr), Paragraph("Storage Engine", tbl_hdr), Paragraph("Structural Schema Justification", tbl_hdr), Paragraph("Primary Query Pattern in Application", tbl_hdr)],
        [
            Paragraph("Core Offering Parameters", tbl_cell_bold),
            Paragraph("RDBMS (<code>ipos</code>)", tbl_cell),
            Paragraph("Rigid schema; numeric constraints (<code>CHECK > 0</code>, <code>UNIQUE</code>); BCNF normalized.", tbl_cell),
            Paragraph("<code>SELECT * FROM ipos WHERE status='Open' ORDER BY open_date DESC;</code>", tbl_cell_code)
        ],
        [
            Paragraph("Quotas & Anchor Books", tbl_cell_bold),
            Paragraph("RDBMS (<code>ipo_reservations</code>, <code>anchor_investors</code>)", tbl_cell),
            Paragraph("ACID consistency; prevents quota over-allocation (>100%); referential cascade.", tbl_cell),
            Paragraph("<code>SELECT category, SUM(shares_offered) FROM ipo_reservations GROUP BY category;</code>", tbl_cell_code)
        ],
        [
            Paragraph("Two-Tier Lock-in Schedule", tbl_cell_bold),
            Paragraph("RDBMS (<code>anchor_lockin_summary</code>)", tbl_cell),
            Paragraph("SEBI statutory 30d/90d split; temporal expiry queries; numerical float calculation.", tbl_cell),
            Paragraph("<code>SELECT * FROM anchor_lockin_summary WHERE expiry_date_30d >= CURRENT_DATE;</code>", tbl_cell_code)
        ],
        [
            Paragraph("Statutory Disclosures & Filings", tbl_cell_bold),
            Paragraph("MongoDB (<code>company_filings</code>)", tbl_cell),
            Paragraph("Semi-structured URLs (PDFs, BSE notices, MP4s); avoids empty URL columns in RDBMS.", tbl_cell),
            Paragraph("<code>db.company_filings.findOne({symbol: 'HYUNDAI'})</code>", tbl_cell_code)
        ],
        [
            Paragraph("Analyst Video & Media Tree", tbl_cell_bold),
            Paragraph("MongoDB (<code>media_and_research</code>)", tbl_cell),
            Paragraph("Hierarchical arrays of nested video reviews for Google NotebookLM visual tree.", tbl_cell),
            Paragraph("<code>db.media_and_research.find({symbol: 'SWIGGY'}, {analyst_reviews: 1})</code>", tbl_cell_code)
        ],
        [
            Paragraph("Cross-Industry Peer Matrix", tbl_cell_bold),
            Paragraph("MongoDB (<code>peer_comparison_matrix</code>)", tbl_cell),
            Paragraph("Polymorphic attributes (Fintech AUM vs Chemical plant capacity) without schema locks.", tbl_cell),
            Paragraph("<code>db.peer_comparison_matrix.findOne({symbol: 'BLS'})</code>", tbl_cell_code)
        ],
    ]
    poly_table = Table(poly_data, colWidths=[120, 150, 230, 220])
    poly_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0F766E")),
        ('GRID', (0, 0), (-1, -1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, card_bg]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(poly_table)
    story.append(Spacer(1, 4))

    # Top 4 ER Viva Questions
    story.append(Paragraph("Faculty ER Diagram Viva Voce Quick Defense", h2_style))
    er_qa_data = [
        [
            Paragraph("<b>Faculty: Why do you have a 1:1 relationship between <code>ipos</code> and <code>anchor_lockin_summary</code> instead of putting it inside <code>ipos</code>?</b><br/>"
                      "<b>Answer:</b> Under Boyce-Codd Normal Form (BCNF), putting anchor lock-in data directly into <code>ipos</code> would cause NULL value anomalies for offerings that do not have an anchor syndicate (e.g. small SME IPOs that do not utilize anchor allocations). Separating it into <code>anchor_lockin_summary</code> with a unique foreign key ensures that lock-in schedules are only created when an anchor book exists, preventing NULL bloat in the master table.<br/><br/>"
                      "<b>Faculty: Explain how cardinality is enforced in your SQL database schema.</b><br/>"
                      "<b>Answer:</b> 1:N cardinality is enforced by placing the parent's primary key (<code>ipo_id</code>) as a Foreign Key in child tables (<code>ipo_reservations</code>, <code>anchor_investors</code>, <code>subscription_bids</code>) without a unique constraint, allowing multiple child rows per IPO. 1:1 cardinality is enforced by adding a <code>UNIQUE</code> constraint on the foreign key column (e.g. <code>ipo_id INT NOT NULL UNIQUE</code> in <code>secondary_listing_metrics</code>).", body_style)
        ]
    ]
    er_qa_table = Table(er_qa_data, colWidths=[720])
    er_qa_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(er_qa_table)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvasLandscape)
    print(f"[SUCCESS] ER Diagram PDF successfully generated at: {pdf_path}")

if __name__ == "__main__":
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    er_img = os.path.join(docs_dir, "er_diagram_hires.png")
    out_pdf = os.path.join(docs_dir, "DBMS_Mini_Project_ER_Diagram_MARK4.pdf")
    
    # 1. Render high-res image
    draw_er_diagram_image(er_img)
    # 2. Build PDF
    build_er_pdf(out_pdf, er_img)
