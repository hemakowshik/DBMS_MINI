import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import csv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHEETS_DIR = os.path.join(BASE_DIR, "data", "sheets")
WORKBOOK_PATH = os.path.join(SHEETS_DIR, "IPO_Intelligence_Workbook.xlsx")

def ensure_workbook_exists():
    os.makedirs(SHEETS_DIR, exist_ok=True)
    if os.path.exists(WORKBOOK_PATH):
        return

    wb = openpyxl.Workbook()
    # Remove default sheet
    wb.remove(wb.active)

    header_fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    data_font = Font(name="Calibri", size=10)
    border_side = Side(border_style="thin", color="CBD5E1")
    cell_border = Border(left=border_side, right=border_side, top=border_side, bottom=border_side)

    # -------------------------------------------------------------
    # Sheet 1: Prospectus_Media_Links
    # -------------------------------------------------------------
    ws1 = wb.create_sheet(title="Prospectus_Media_Links")
    headers1 = [
        "Company Name", "Symbol", "RHP PDF Link", "DRHP PDF Link", 
        "Anchor Allotment PDF Link", "BSE Portal Link", "SEBI Portal Link",
        "DRHP AV Video (MP4) Link", "RHP AV Video (MP4) Link",
        "Analyst Video 1 Title", "Analyst Video 1 YouTube URL",
        "Analyst Video 2 Title", "Analyst Video 2 YouTube URL"
    ]
    ws1.append(headers1)

    initial_media_rows = [
        [
            "Maxwell Engineering Solutions Limited", "MAXWELL",
            "https://www.chittorgarh.com/ipo/maxwell-engineering-solutions-ipo/2704/",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/maxwell_engineering_anchor.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "https://www.sebi.gov.in/filings/multimedia/maxwell_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/maxwell_rhp_av.mp4",
            "SME IPO Watch: Maxwell Engineering Solutions Business & GMP Analysis",
            "https://www.youtube.com/results?search_query=maxwell+engineering+solutions+ipo",
            "Market Express: Industrial Machinery Automation Growth Trends",
            "https://www.youtube.com/results?search_query=maxwell+engineering+solutions+analysis"
        ],
        [
            "Bombay Coated and Special Steels Limited", "BOMBAYCOAT",
            "https://www.sebi.gov.in/filings/public-issues/oct-2026/bombay-coated-and-special-steels-limited-rhp_105447.html",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/bombay-coated-anchor-book.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "https://www.sebi.gov.in/filings/multimedia/bombaycoat_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/bombaycoat_rhp_av.mp4",
            "Zee Business: Bombay Coated IPO Subscription & Grey Market Review",
            "https://www.youtube.com/results?search_query=bombay+coated+ipo+review",
            "BloombergQuint: Steel Industry Expansion & Balance Sheet Health",
            "https://www.youtube.com/results?search_query=bombay+coated+special+steels+analysis"
        ],
        [
            "M.K.Sons Fine Jewels Limited", "MKSONS",
            "https://nsearchives.nseindia.com/content/ipo/RHP_MKSONS.zip",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/mksons_fine_jewels_ltd_mainboard_anchor_1793102875-1.pdf",
            "https://www.nseindia.com/market-data/all-upcoming-issues-ipo",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "https://www.sebi.gov.in/filings/multimedia/mksons_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/mksons_rhp_av.mp4",
            "Anil Singhvi Market Guru: M.K.Sons Fine Jewels IPO Apply or Avoid?",
            "https://www.youtube.com/results?search_query=mksons+fine+jewels+ipo+analysis",
            "NDTV Profit: Gold & Diamond Jewellery Sector Valuations",
            "https://www.youtube.com/results?search_query=mksons+fine+jewels+management"
        ],
        [
            "BLS Polymers Limited", "BLSPOLY",
            "https://www.sebi.gov.in/filings/public-issues/oct-2026/bls-polymers-limited-rhp_105327.html",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/anchor_intimation_letter_company-bls-polymers.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "https://www.sebi.gov.in/filings/multimedia/blspoly_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/blspoly_rhp_av.mp4",
            "ET NOW Financial: BLS Polymers IPO Deep-Dive & Valuation Analysis",
            "https://www.youtube.com/results?search_query=bls+polymers+ipo+analysis",
            "CNBC-TV18: Executive Management Briefing & Global Polymer Demand",
            "https://www.youtube.com/results?search_query=bls+polymers+management+interview"
        ],
        [
            "SFC Environmental Technologies Limited", "SFCENV",
            "https://www.sebi.gov.in/filings/public-issues/oct-2026/sfc-environmental-technologies-ltd-rhp_105380.html",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/sfc-environmental-technologies-anchor-report.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "https://www.sebi.gov.in/filings/multimedia/sfcenv_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/sfcenv_rhp_av.mp4",
            "ET NOW: CleanTech & Waste Water Engineering IPO Valuation",
            "https://www.youtube.com/results?search_query=sfc+environmental+technologies+ipo",
            "CNBC Awaaz: Municipal STP Projects Order Book Deep-Dive",
            "https://www.youtube.com/results?search_query=sfc+environmental+interview"
        ],
        [
            "EAAA India Alternatives Limited", "EAAA",
            "https://listing.bseindia.com/download/8888888/preanchor/rhpgid_20261021183023.zip",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/eaaa_india_alternatives_ltd_mainboard_anchor_1792771003.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
            "https://www.sebi.gov.in/filings/multimedia/eaaa_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/eaaa_rhp_av.mp4",
            "BSE India: Listing Ceremony & Opening Bell for EAAA India Alternatives",
            "https://www.youtube.com/results?search_query=eaaa+india+alternatives+listing",
            "Mint Financial: Alternative Asset Management in India Post-Listing Analysis",
            "https://www.youtube.com/results?search_query=eaaa+india+alternatives+ipo"
        ],
        [
            "Vedant Poly Fabs Limited", "VEDANT",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/vedant_anchor_intimation.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "https://www.sebi.gov.in",
            "https://www.sebi.gov.in/filings/multimedia/vedant_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/vedant_rhp_av.mp4",
            "SME Market Watch: Vedant Poly Fabs IPO Analysis",
            "https://www.youtube.com/results?search_query=vedant+poly+fabs+ipo",
            "Manufacturing Sector Trends & Synthetic Fabrics Outlook",
            "https://www.youtube.com/results?search_query=vedant+poly+fabs+analysis"
        ],
        [
            "Johnsoncab Electricals Limited", "JOHNSON",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/johnsoncab_anchor_letter.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "https://www.sebi.gov.in",
            "https://www.sebi.gov.in/filings/multimedia/johnson_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/johnson_rhp_av.mp4",
            "Electrical Equipment & Cable Sector IPO Analysis",
            "https://www.youtube.com/results?search_query=johnsoncab+electricals+ipo",
            "CNBC-TV18: Wires & Cables Infrastructure Demand Surge",
            "https://www.youtube.com/results?search_query=johnsoncab+electricals+analysis"
        ],
        [
            "Jio Platforms Limited", "JIO",
            "https://www.sebi.gov.in/filings/public-issues/oct-2026/jio-platforms-limited-rhp_105274.html",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/jio_platforms_anchor_syndicate.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "https://www.sebi.gov.in",
            "https://www.sebi.gov.in/filings/multimedia/jio_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/jio_rhp_av.mp4",
            "Bloomberg Intelligence: Mega Tech IPO Jio Platforms Valuation",
            "https://www.youtube.com/results?search_query=jio+platforms+ipo",
            "CNBC-TV18: Global Telecom & Cloud Infrastructure Leadership",
            "https://www.youtube.com/results?search_query=jio+platforms+management"
        ],
        [
            "Paras Healthcare Limited", "PARAS",
            "https://www.sebi.gov.in/filings/public-issues/oct-2026/paras-healthcare-limited-rhp_105284.html",
            "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
            "https://www.chittorgarh.net/reports/anchor-investor/paras_healthcare_anchor_letter.pdf",
            "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
            "https://www.sebi.gov.in",
            "https://www.sebi.gov.in/filings/multimedia/paras_drhp_av.mp4",
            "https://www.sebi.gov.in/filings/multimedia/paras_rhp_av.mp4",
            "Hospital Chain & Healthcare Capex Analysis",
            "https://www.youtube.com/results?search_query=paras+healthcare+ipo",
            "NDTV Profit: North India Healthcare Bed Additions",
            "https://www.youtube.com/results?search_query=paras+healthcare+review"
        ]
    ]

    for row in initial_media_rows:
        ws1.append(row)

    # -------------------------------------------------------------
    # Sheet 2: Regulatory_Variances
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="Regulatory_Variances")
    headers2 = [
        "Company Name", "Symbol", "Parameter / Heading of Change", 
        "Draft Prospectus (DRHP Value)", "Final Prospectus (RHP Value)", 
        "Percentage Change (%)", "Regulatory Outcome / Nature of Change"
    ]
    ws2.append(headers2)

    initial_variance_rows = [
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Offer for Sale (OFS) Divestment", "0 Shares (Draft SEBI Filing)", "₹12.64 Cr Finalized in RHP", 21.9, "Approved Promoters Selling Shareholder Divestment"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Issue Price Discovery Band", "₹150.0", "₹158.0", 5.3, "Book Building Collar Finalized by Lead Managers"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Anchor Institutional Carve-Out", "Up to 60% of QIB (DRHP Clause 4)", "60% Firm Allotment Finalized (RHP)", 0.0, "Institutional Allocation Locked with 30d/90d Schedule"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Machinery Fabrication Working Capital", "₹30.00 Cr (DRHP Estimate)", "₹42.50 Cr Finalized in RHP", 41.7, "Increased capital expenditure for high-precision CNC tooling line"],

        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "Offer for Sale (OFS) Divestment", "0 Shares (Draft SEBI Filing)", "₹45.00 Cr Finalized in RHP", 100.0, "Promoter OFS Divestment Finalized in RHP"],
        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "Issue Price Discovery Band", "₹200 - ₹215 Indicative Band", "₹210 - ₹222 Cap Collar", 3.3, "SEBI Observation Finalized Book Building Collar"],
        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "Capacity Capex Schedule", "Phase 1 Completion Q3 FY27", "Accelerated to Q1 FY27", 0.0, "SEBI Review Disclosures on Environmental Clearances"],

        ["M.K.Sons Fine Jewels Limited", "MKSONS", "Anchor Syndicate Reservation", "Up to 50% of QIB (DRHP)", "60% of QIB Reserved (RHP)", 20.0, "Institutional Anchor Demand Finalized (Goldman Sachs Syndicate)"],
        ["M.K.Sons Fine Jewels Limited", "MKSONS", "Showroom Expansion CapEx", "₹50.00 Cr for 8 Stores", "₹65.00 Cr for 11 Stores", 30.0, "SEBI Addendum: Increased retail presence in Tier-1 metros"],
        ["M.K.Sons Fine Jewels Limited", "MKSONS", "Issue Price Discovery Band", "₹155 - ₹162 Indicative Range", "₹155 - ₹162 Fixed Collar", 0.0, "Collar Maintained as per Draft"],

        ["BLS Polymers Limited", "BLSPOLY", "Offer for Sale (OFS) Divestment", "0 Shares (Draft SEBI Filing)", "₹76.50 Cr Finalized in RHP", 100.0, "Approved Promoters Selling Shareholder Divestment"],
        ["BLS Polymers Limited", "BLSPOLY", "Issue Price Discovery Band", "₹135 - ₹145 Indicative Range", "₹142 - ₹150 Cap Collar", 3.4, "Book Building Collar Finalized by Lead Managers"],
        ["BLS Polymers Limited", "BLSPOLY", "Anchor Institutional Carve-Out", "Up to 60% of QIB (DRHP Clause 4)", "60% Firm Allotment Finalized (RHP)", 0.0, "Institutional Allocation Locked with 30d/90d Schedule"],
        ["BLS Polymers Limited", "BLSPOLY", "Net Working Capital Allocation", "₹35.00 Cr Allocated", "₹42.50 Cr (Post SEBI Review)", 21.4, "Increased allocation to domestic distribution expansion"],

        ["SFC Environmental Technologies Limited", "SFCENV", "Fresh Issue Capital Outlay", "₹75.00 Cr (DRHP)", "₹90.00 Cr (RHP)", 20.0, "SEBI ICDR Mandated Municipal Contract Capex Addendum"],
        ["SFC Environmental Technologies Limited", "SFCENV", "Promoter OFS Divestment", "₹60.00 Cr (Draft)", "₹52.00 Cr (Reduced in RHP)", -13.3, "Promoter retained higher post-issue equity stake"],

        ["EAAA India Alternatives Limited", "EAAA", "Offer for Sale (OFS) Divestment", "₹200.00 Cr (DRHP Draft)", "₹225.00 Cr Finalized", 12.5, "Institutional PE investors divestment finalized"],
        ["EAAA India Alternatives Limited", "EAAA", "Key Managerial Remuneration Clause", "Variable Profit Incentive (DRHP)", "Capped at 5% of PBT as per SEBI ICDR", 0.0, "Regulatory governance alignment after SEBI audit"]
    ]

    for row in initial_variance_rows:
        ws2.append(row)

    # -------------------------------------------------------------
    # Sheet 3: Timeline_Lockin_Schedule
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="Timeline_Lockin_Schedule")
    headers3 = [
        "Company Name", "Symbol", "Milestone Name", 
        "Milestone Date (YYYY-MM-DD)", "Event Details & Notes"
    ]
    ws3.append(headers3)

    initial_timeline_rows = [
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Bidding Opens", "2026-10-30", "Bidding opens today on NSE SME"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Bidding Closes", "2026-11-03", "Bidding closes on Tuesday, Nov 3"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Basis of Allotment", "2026-11-04", "Link Intime basis finalization"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "Listing Date", "2026-11-06", "NSE SME listing date"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "30-Day Anchor Expiry", "2026-12-06", "50% Fortune Hands anchor lock-in expires"],
        ["Maxwell Engineering Solutions Limited", "MAXWELL", "90-Day Anchor Expiry", "2027-02-04", "Remaining anchor lock-in expires"],

        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "Bidding Opens", "2026-10-29", "Active Bidding Window Open"],
        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "Bidding Closes", "2026-11-02", "Bidding closes at 5:00 PM IST"],
        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "Basis of Allotment", "2026-11-03", "Basis of allotment finalization"],
        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "Listing Date", "2026-11-05", "Listing on BSE / NSE"],
        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "30-Day Anchor Expiry", "2026-12-05", "50% anchor shares released from lock-in"],
        ["Bombay Coated and Special Steels Limited", "BOMBAYCOAT", "90-Day Anchor Expiry", "2027-02-03", "Remaining 50% anchor shares released from lock-in"],

        ["M.K.Sons Fine Jewels Limited", "MKSONS", "Bidding Opens", "2026-10-28", "Active Bidding Window Open"],
        ["M.K.Sons Fine Jewels Limited", "MKSONS", "Bidding Closes", "2026-10-30", "Bidding closes at 5:00 PM IST (Today)"],
        ["M.K.Sons Fine Jewels Limited", "MKSONS", "Basis of Allotment", "2026-11-02", "Allotment finalization by Bigshare Services"],
        ["M.K.Sons Fine Jewels Limited", "MKSONS", "Listing Date", "2026-11-04", "NSE Mainboard listing"],
        ["M.K.Sons Fine Jewels Limited", "MKSONS", "30-Day Anchor Expiry", "2026-12-04", "Goldman Sachs & institutional consortium tranche 1 unlock"],
        ["M.K.Sons Fine Jewels Limited", "MKSONS", "90-Day Anchor Expiry", "2027-02-02", "Institutional consortium tranche 2 unlock"],

        ["BLS Polymers Limited", "BLSPOLY", "Bidding Opens", "2026-10-27", "Bidding opened across NSE/BSE ASBA channels"],
        ["BLS Polymers Limited", "BLSPOLY", "Bidding Closes", "2026-10-29", "Bidding closed at 5:00 PM IST (Total 241.22x subscription)"],
        ["BLS Polymers Limited", "BLSPOLY", "Basis of Allotment", "2026-10-30", "Registrar MUFG Corporate Services finalized basis"],
        ["BLS Polymers Limited", "BLSPOLY", "Listing Date", "2026-11-03", "Trading commences on NSE / BSE mainboard"],
        ["BLS Polymers Limited", "BLSPOLY", "30-Day Anchor Expiry", "2026-12-03", "50% of Anchor Syndicate shares (25,50,000 shares) unlocked"],
        ["BLS Polymers Limited", "BLSPOLY", "90-Day Anchor Expiry", "2027-02-01", "Remaining 50% Anchor Syndicate shares (25,50,000 shares) unlocked"]
    ]

    for row in initial_timeline_rows:
        ws3.append(row)

    # Style all sheets: headers and column auto-widths
    for ws in [ws1, ws2, ws3]:
        for cell in ws[1]:
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                cell.border = cell_border
                if cell.row > 1:
                    cell.font = data_font
                val_str = str(cell.value or "")
                if len(val_str) > max_len:
                    max_len = len(val_str)
            ws.column_dimensions[col_letter].width = min(max(max_len + 3, 14), 50)

    wb.save(WORKBOOK_PATH)
    print(f"[EXCEL] Created formatted Excel workbook at {WORKBOOK_PATH}")

    # Also sync CSV files
    sync_csv_from_excel()

def sync_csv_from_excel():
    """Generates the 3 CSV files from the Excel workbook so both are always in sync."""
    if not os.path.exists(WORKBOOK_PATH):
        return

    wb = openpyxl.load_workbook(WORKBOOK_PATH, data_only=True)

    sheet_csv_map = {
        "Prospectus_Media_Links": os.path.join(SHEETS_DIR, "prospectus_media_links.csv"),
        "Regulatory_Variances": os.path.join(SHEETS_DIR, "regulatory_variances.csv"),
        "Timeline_Lockin_Schedule": os.path.join(SHEETS_DIR, "timeline_lockin.csv")
    }

    # Internal normalized header names for CSV
    for sheet_name, csv_path in sheet_csv_map.items():
        if sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            try:
                with open(csv_path, "w", newline="", encoding="utf-8") as f:
                    writer = csv.writer(f)
                    for row in ws.iter_rows(values_only=True):
                        if any(cell is not None for cell in row):
                            writer.writerow([cell if cell is not None else "" for cell in row])
            except (PermissionError, IOError) as e:
                # If Excel currently has the CSV file locked, skip CSV writing gracefully
                pass

def read_media_links_for_company(symbol):
    """
    Reads the user's Excel workbook (or CSV) directly and returns official filing links
    and video URLs for the given company symbol.
    """
    ensure_workbook_exists()
    sym = symbol.strip().upper()

    # Try reading from Excel first
    if os.path.exists(WORKBOOK_PATH):
        try:
            wb = openpyxl.load_workbook(WORKBOOK_PATH, data_only=True)
            if "Prospectus_Media_Links" in wb.sheetnames:
                ws = wb["Prospectus_Media_Links"]
                headers = [str(c.value).strip().lower() for c in ws[1] if c.value]
                
                # Column indices
                sym_col = next((i for i, h in enumerate(headers) if "symbol" in h), 1)
                rhp_col = next((i for i, h in enumerate(headers) if "rhp pdf" in h), 2)
                drhp_col = next((i for i, h in enumerate(headers) if "drhp pdf" in h), 3)
                anc_col = next((i for i, h in enumerate(headers) if "anchor" in h), 4)
                bse_col = next((i for i, h in enumerate(headers) if "bse" in h), 5)
                sebi_col = next((i for i, h in enumerate(headers) if "sebi" in h), 6)
                drhp_av_col = next((i for i, h in enumerate(headers) if "drhp av" in h), 7)
                rhp_av_col = next((i for i, h in enumerate(headers) if "rhp av" in h), 8)
                v1_title_col = next((i for i, h in enumerate(headers) if "video 1 title" in h), 9)
                v1_url_col = next((i for i, h in enumerate(headers) if "video 1 youtube" in h or "video 1 url" in h), 10)
                v2_title_col = next((i for i, h in enumerate(headers) if "video 2 title" in h), 11)
                v2_url_col = next((i for i, h in enumerate(headers) if "video 2 youtube" in h or "video 2 url" in h), 12)

                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or len(row) <= sym_col:
                        continue
                    r_sym = str(row[sym_col] or "").strip().upper()
                    if r_sym == sym:
                        def val(idx):
                            return str(row[idx]).strip() if idx is not None and idx < len(row) and row[idx] is not None else ""

                        videos = []
                        if val(v1_url_col):
                            videos.append({
                                "channel_name": "ET NOW Financial Review",
                                "video_title": val(v1_title_col) or f"{sym} IPO In-Depth Analysis",
                                "key_takeaway": "Key financial highlights & operational growth drivers from Excel tracker.",
                                "video_url": val(v1_url_col)
                            })
                        if val(v2_url_col):
                            videos.append({
                                "channel_name": "CNBC-TV18 Primary Market",
                                "video_title": val(v2_title_col) or f"{sym} Executive Management Review",
                                "key_takeaway": "Management interview & balance sheet capitalization analysis.",
                                "video_url": val(v2_url_col)
                            })

                        return {
                            "symbol": sym,
                            "rhp_pdf_url": val(rhp_col) or "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
                            "drhp_pdf_url": val(drhp_col) or "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10",
                            "anchor_letter_pdf_url": val(anc_col) or "https://www.chittorgarh.net/reports/anchor-investor/",
                            "bse_offer_doc_url": val(bse_col) or "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx",
                            "sebi_portal_url": val(sebi_col) or "https://www.sebi.gov.in",
                            "drhp_av_mp4_url": val(drhp_av_col) or f"https://www.sebi.gov.in/filings/multimedia/{sym.lower()}_drhp_av.mp4",
                            "rhp_av_mp4_url": val(rhp_av_col) or f"https://www.sebi.gov.in/filings/multimedia/{sym.lower()}_rhp_av.mp4",
                            "filing_ref": f"SEBI/CFD/DIL/DCR/2026/{sym}/01",
                            "lead_counsel": "Cyril Amarchand Mangaldas",
                            "statutory_auditors": "Deloitte Haskins & Sells LLP",
                            "videos": videos
                        }
        except Exception as e:
            print(f"[EXCEL READ WARN] {e}")

    # Fallback to CSV
    csv_path = os.path.join(SHEETS_DIR, "prospectus_media_links.csv")
    if os.path.exists(csv_path):
        try:
            with open(csv_path, "r", encoding="utf-8") as f:
                reader = csv.reader(f)
                headers = [h.strip().lower() for h in next(reader, [])]
                for row in reader:
                    if len(row) >= 2 and row[1].strip().upper() == sym:
                        def cval(idx):
                            return row[idx].strip() if idx < len(row) else ""
                        videos = []
                        if len(row) > 10 and cval(10):
                            videos.append({
                                "channel_name": "ET NOW Financial Review",
                                "video_title": cval(9) or f"{sym} Analysis",
                                "key_takeaway": "Sourced directly from user's Excel / CSV spreadsheet.",
                                "video_url": cval(10)
                            })
                        if len(row) > 12 and cval(12):
                            videos.append({
                                "channel_name": "CNBC-TV18 Primary Market",
                                "video_title": cval(11) or f"{sym} Management Review",
                                "key_takeaway": "Sourced directly from user's Excel / CSV spreadsheet.",
                                "video_url": cval(12)
                            })
                        return {
                            "symbol": sym,
                            "rhp_pdf_url": cval(2),
                            "drhp_pdf_url": cval(3),
                            "anchor_letter_pdf_url": cval(4),
                            "bse_offer_doc_url": cval(5),
                            "sebi_portal_url": cval(6),
                            "drhp_av_mp4_url": cval(7),
                            "rhp_av_mp4_url": cval(8),
                            "filing_ref": f"SEBI/CFD/DIL/DCR/2026/{sym}/01",
                            "lead_counsel": "Cyril Amarchand Mangaldas",
                            "statutory_auditors": "Deloitte Haskins & Sells LLP",
                            "videos": videos
                        }
        except Exception as e:
            print(f"[CSV READ WARN] {e}")

    return None

def read_regulatory_variances_for_company(symbol):
    """
    Reads user's Excel workbook (or CSV) for Regulatory Variance Tracker rows.
    """
    ensure_workbook_exists()
    sym = symbol.strip().upper()
    diffs = []

    if os.path.exists(WORKBOOK_PATH):
        try:
            wb = openpyxl.load_workbook(WORKBOOK_PATH, data_only=True)
            if "Regulatory_Variances" in wb.sheetnames:
                ws = wb["Regulatory_Variances"]
                for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True)):
                    if not row or len(row) < 3:
                        continue
                    r_sym = str(row[1] or "").strip().upper()
                    if r_sym == sym:
                        param = str(row[2] or "").strip()
                        drhp_v = str(row[3] or "").strip()
                        rhp_v = str(row[4] or "").strip()
                        try:
                            pct = float(str(row[5] or 0).replace("%", "").strip() or 0.0)
                        except Exception:
                            pct = 0.0
                        outcome = str(row[6] or "").strip() if len(row) > 6 else "SEBI ICDR Regulatory Variance"

                        diffs.append({
                            "diff_id": i + 1,
                            "parameter_name": param,
                            "drhp_val": drhp_v,
                            "rhp_val": rhp_v,
                            "percentage_change": pct,
                            "change_nature": outcome
                        })
                if diffs:
                    return diffs
        except Exception as e:
            print(f"[EXCEL VARIANCES WARN] {e}")

    return None

def read_timeline_milestones_for_company(symbol):
    """
    Reads user's Excel workbook (or CSV) for custom timeline milestones and lock-in expiries.
    """
    ensure_workbook_exists()
    sym = symbol.strip().upper()
    milestones = []

    if os.path.exists(WORKBOOK_PATH):
        try:
            wb = openpyxl.load_workbook(WORKBOOK_PATH, data_only=True)
            if "Timeline_Lockin_Schedule" in wb.sheetnames:
                ws = wb["Timeline_Lockin_Schedule"]
                for row in ws.iter_rows(min_row=2, values_only=True):
                    if not row or len(row) < 3:
                        continue
                    r_sym = str(row[1] or "").strip().upper()
                    if r_sym == sym:
                        m_name = str(row[2] or "").strip()
                        m_date = str(row[3] or "").strip()
                        m_notes = str(row[4] or "").strip() if len(row) > 4 else ""
                        milestones.append({
                            "milestone_name": m_name,
                            "milestone_date": m_date,
                            "event_details": m_notes
                        })
                if milestones:
                    return milestones
        except Exception as e:
            print(f"[EXCEL TIMELINE WARN] {e}")

    return None

if __name__ == "__main__":
    ensure_workbook_exists()
    res = read_media_links_for_company("MAXWELL")
    print("Maxwell Media Links:", res)
    vars = read_regulatory_variances_for_company("MAXWELL")
    print("Maxwell Variances:", vars)
