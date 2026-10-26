import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_table(ax, x, y, width, height, title, header_bg, fields, title_color='#ffffff'):
    # Header box
    header_height = 0.05
    header = patches.FancyBboxPatch(
        (x, y + height - header_height), width, header_height,
        boxstyle="round,pad=0.005,rounding_size=0.015",
        ec="#30363d", fc=header_bg, lw=1.5, zorder=2
    )
    ax.add_patch(header)
    ax.text(
        x + width / 2.0, y + height - header_height / 2.0, title,
        ha='center', va='center', color=title_color, fontsize=11, fontweight='bold', zorder=3
    )

    # Body box
    body = patches.FancyBboxPatch(
        (x, y), width, height - header_height,
        boxstyle="round,pad=0.005,rounding_size=0.01",
        ec="#30363d", fc='#161b22', lw=1.5, zorder=2
    )
    ax.add_patch(body)

    # Fields
    line_y = y + height - header_height - 0.025
    step = (height - header_height - 0.04) / max(len(fields), 1)
    for f in fields:
        is_pk = "[PK]" in f
        is_fk = "[FK]" in f
        txt_color = "#e6edf3"
        prefix = "  "
        if is_pk:
            prefix = "* "
            txt_color = "#f0883e"
        elif is_fk:
            prefix = "> "
            txt_color = "#58a6ff"

        ax.text(
            x + 0.012, line_y, prefix + f,
            ha='left', va='center', color=txt_color, fontsize=8.2, fontfamily='monospace', zorder=3
        )
        line_y -= step

def draw_arrow(ax, p1, p2, label="", color="#8b949e", style="1:N"):
    ax.annotate(
        "", xy=p2, xytext=p1,
        arrowprops=dict(
            arrowstyle="-|>", color=color, lw=2.0,
            shrinkA=5, shrinkB=5, mutation_scale=15
        ), zorder=1
    )
    # Midpoint label
    mid_x = (p1[0] + p2[0]) / 2.0
    mid_y = (p1[1] + p2[1]) / 2.0
    if label:
        ax.text(
            mid_x, mid_y, f" {label} ({style}) ",
            ha='center', va='center', color='#ffffff', fontsize=7.5,
            bbox=dict(boxstyle="round,pad=0.2", fc='#21262d', ec=color, lw=1),
            zorder=4
        )

def generate_er_diagram():
    fig, ax = plt.subplots(figsize=(24, 15), dpi=300)
    fig.patch.set_facecolor('#0d1117')
    ax.set_facecolor('#0d1117')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')

    # Title & Subtitle Banner
    ax.text(0.5, 0.97, 'IPO INTELLIGENCE & CAPITAL MARKETS - RELATIONAL DATA MODEL',
            ha='center', va='center', color='#58a6ff', fontsize=20, fontweight='bold')
    ax.text(0.5, 0.942, 'Institutional Relational Architecture | 8 Core Normalized Entities | Primary & Secondary Market Schema',
            ha='center', va='center', color='#8b949e', fontsize=11)

    # 1. IPOS (Central Hub)
    # Position: center
    ipos_fields = [
        "ipo_id : INT [PK]",
        "company_name : VARCHAR(150)",
        "symbol : VARCHAR(30) [UK]",
        "isin : VARCHAR(20) [UK]",
        "bse_code : VARCHAR(20)",
        "issue_type : VARCHAR(40)",
        "sale_type : VARCHAR(40)",
        "price_band_min : DECIMAL(10,2)",
        "price_band_max : DECIMAL(10,2)",
        "issue_price : DECIMAL(10,2)",
        "lot_size : INT",
        "total_issue_shares : BIGINT",
        "total_issue_val_cr : DECIMAL(12,2)",
        "fresh_issue_cr : DECIMAL(12,2)",
        "ofs_val_cr : DECIMAL(12,2)",
        "open_date, close_date : DATE",
        "listing_date : DATE",
        "anchor_lockin_30d : DATE",
        "anchor_lockin_90d : DATE",
        "brlm_lead_manager : VARCHAR(255)",
        "registrar_name : VARCHAR(150)",
        "sector : VARCHAR(100)"
    ]
    draw_table(ax, 0.38, 0.38, 0.24, 0.50, "IPOS (Primary Master)", "#1f6feb", ipos_fields)

    # 2. IPO_RESERVATIONS (Top-Left)
    res_fields = [
        "reservation_id : INT [PK]",
        "ipo_id : INT [FK]",
        "category_name : VARCHAR(50)",
        "quota_percent : DECIMAL(5,2)",
        "shares_reserved : BIGINT",
        "min_investment_inr : DECIMAL(12,2)",
        "max_investment_inr : DECIMAL(12,2)"
    ]
    draw_table(ax, 0.05, 0.68, 0.25, 0.22, "IPO_RESERVATIONS", "#238636", res_fields)
    draw_arrow(ax, (0.38, 0.75), (0.30, 0.75), "has quotas", "#238636", "1:N")

    # 3. ANCHOR_INVESTORS (Mid-Left)
    anchor_fields = [
        "anchor_id : INT [PK]",
        "ipo_id : INT [FK]",
        "investor_name : VARCHAR(150)",
        "investor_category : VARCHAR(60)",
        "shares_allocated : BIGINT",
        "bid_price : DECIMAL(10,2)",
        "amount_cr : DECIMAL(12,2)",
        "lockin_period_days : INT (30/90)",
        "lockin_expiry_date : DATE"
    ]
    draw_table(ax, 0.05, 0.38, 0.25, 0.25, "ANCHOR_INVESTORS", "#8957e5", anchor_fields)
    draw_arrow(ax, (0.38, 0.52), (0.30, 0.52), "allocates", "#8957e5", "1:N")

    # 4. SUBSCRIPTION_BIDS (Bottom-Left)
    bids_fields = [
        "bid_id : INT [PK]",
        "ipo_id : INT [FK]",
        "day_number : INT (1,2,3)",
        "bidding_date : DATE",
        "qib_subscription_times : DECIMAL",
        "nii_subscription_times : DECIMAL",
        "retail_subscription_times : DECIMAL",
        "total_subscription_times : DECIMAL"
    ]
    draw_table(ax, 0.05, 0.08, 0.25, 0.24, "SUBSCRIPTION_BIDS", "#da3633", bids_fields)
    draw_arrow(ax, (0.42, 0.38), (0.30, 0.22), "daily bids", "#da3633", "1:N")

    # 5. SECONDARY_LISTING_METRICS (Bottom-Center)
    secondary_fields = [
        "metric_id : INT [PK]",
        "ipo_id : INT [FK, UK]",
        "prev_close : DECIMAL(10,2)",
        "iep : DECIMAL(10,2) [Pre-open]",
        "listing_day_open : DECIMAL(10,2)",
        "listing_day_close : DECIMAL(10,2)",
        "listing_gain_percent : DECIMAL(8,2)",
        "ieq : BIGINT",
        "indicative_val_lakhs : DECIMAL",
        "cancelled_buy_orders_count : INT",
        "cancelled_sell_orders_count : INT"
    ]
    draw_table(ax, 0.38, 0.04, 0.24, 0.28, "SECONDARY_LISTING_METRICS", "#d29922", secondary_fields)
    draw_arrow(ax, (0.50, 0.38), (0.50, 0.32), "discovers IEP", "#d29922", "1:1")

    # 6. GMP_PLATFORM_RECORDS (Top-Right)
    gmp_fields = [
        "record_id : INT [PK]",
        "ipo_id : INT [FK]",
        "platform_name : VARCHAR(100)",
        "quote_date : DATE",
        "gmp_inr : DECIMAL(10,2)",
        "estimated_listing_price : DECIMAL",
        "estimated_gain_percent : DECIMAL",
        "rating_sentiment : VARCHAR(30)"
    ]
    draw_table(ax, 0.70, 0.68, 0.25, 0.24, "GMP_PLATFORM_RECORDS", "#38bdf8", gmp_fields)
    draw_arrow(ax, (0.62, 0.75), (0.70, 0.75), "quotes GMP", "#38bdf8", "1:N")

    # 7. GMP_ACCURACY_EVAL (Mid-Right) - Novelty 1
    accuracy_fields = [
        "eval_id : INT [PK]",
        "ipo_id : INT [FK]",
        "platform_name : VARCHAR(100)",
        "last_gmp_predicted_gain_pct : DEC",
        "actual_listing_gain_pct : DEC",
        "absolute_error_pct : DECIMAL(8,2)",
        "error_direction : VARCHAR(30)"
    ]
    draw_table(ax, 0.70, 0.38, 0.25, 0.24, "GMP_ACCURACY_EVAL (Benchmark)", "#f0883e", accuracy_fields)
    draw_arrow(ax, (0.62, 0.52), (0.70, 0.52), "benchmarked by", "#f0883e", "1:N")

    # 8. DRHP_RHP_DIFFS (Bottom-Right) - Novelty 2
    diff_fields = [
        "diff_id : INT [PK]",
        "ipo_id : INT [FK]",
        "parameter_name : VARCHAR(120)",
        "drhp_val : VARCHAR(120)",
        "rhp_val : VARCHAR(120)",
        "percentage_change : DECIMAL(8,2)",
        "change_nature : VARCHAR(100)",
        "sebi_observation_noted : BOOLEAN"
    ]
    draw_table(ax, 0.70, 0.08, 0.25, 0.24, "DRHP_RHP_DIFFS (Surveillance)", "#a371f7", diff_fields)
    draw_arrow(ax, (0.58, 0.38), (0.70, 0.22), "SEBI diffs", "#a371f7", "1:N")

    # Legend at top
    ax.text(0.05, 0.94, 'Legend:  * [PK] Primary Key  |  > [FK] Foreign Key  |  [UK] Unique Key  |  1:N One-to-Many  |  1:1 One-to-One',
            color='#58a6ff', fontsize=9.5, fontweight='bold')

    out_dir = "C:/DBMS_MINI/docs"
    os.makedirs(out_dir, exist_ok=True)
    png_path = os.path.join(out_dir, "er_diagram.png")
    pdf_path = os.path.join(out_dir, "er_diagram.pdf")

    plt.savefig(png_path, dpi=300, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.savefig(pdf_path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"[SUCCESS] Saved high-resolution ER Diagram to:\n  - {png_path}\n  - {pdf_path}")

if __name__ == "__main__":
    generate_er_diagram()
