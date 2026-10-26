// MongoDB Initialization Script for IPO Intelligence
// Run: mongosh mongodb://localhost:27017/ipo_nosql_db mongo_init.js

db = db.getSiblingDB('ipo_nosql_db');

// Drop existing collections for clean re-run
db.company_filings.drop();
db.drhp_rhp_deep_sections.drop();
db.media_and_research.drop();
db.peer_comparison_matrix.drop();

// 1. Company Filings (DRHP, RHP, Audio-Visual Videos, SEBI links)
db.company_filings.insertMany([
  {
    symbol: "TONBO",
    company_name: "Tonbo Imaging India Limited",
    drhp_pdf_url: "https://tonboimaging.com/main/wp-content/uploads/2026/08/Tonbo-Imaging-India-Limited-DRHP.pdf",
    rhp_pdf_url: "https://tonboimaging.com/main/wp-content/uploads/2026/10/Red-Herring-Prospectus.pdf",
    drhp_av_mp4_url: "https://tonboimaging.com/main/wp-content/uploads/2026/08/Tonbo-DRHP-English-AV.mp4",
    rhp_av_mp4_url: "https://tonboimaging.com/main/wp-content/uploads/2026/10/Tonbo-RHP-AV-English.mp4",
    sebi_portal_url: "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    sebi_filing_date: "2026-08-14",
    sebi_approval_date: "2026-10-04",
    lead_counsel: "Cyril Amarchand Mangaldas",
    statutory_auditors: "Deloitte Haskins & Sells LLP",
    registered_office: "Electronic City Phase 1, Bengaluru, Karnataka 560100"
  },
  {
    symbol: "TATATECH",
    company_name: "Tata Technologies Limited",
    drhp_pdf_url: "https://www.tatatechnologies.com/investors/drhp.pdf",
    rhp_pdf_url: "https://www.tatatechnologies.com/investors/rhp.pdf",
    drhp_av_mp4_url: "https://www.tatatechnologies.com/investors/av/drhp_brief.mp4",
    rhp_av_mp4_url: "https://www.tatatechnologies.com/investors/av/rhp_brief.mp4",
    sebi_portal_url: "https://www.sebi.gov.in/filings/tata_tech.html",
    sebi_filing_date: "2023-03-09",
    sebi_approval_date: "2023-06-27",
    lead_counsel: "Shardul Amarchand Mangaldas",
    statutory_auditors: "B S R & Co. LLP",
    registered_office: "Plot No 25, Rajiv Gandhi Infotech Park, Hinjawadi, Pune 411057"
  },
  {
    symbol: "SWIGGY",
    company_name: "Swiggy Limited",
    drhp_pdf_url: "https://www.swiggy.com/corporate-governance/drhp.pdf",
    rhp_pdf_url: "https://www.swiggy.com/corporate-governance/rhp.pdf",
    drhp_av_mp4_url: "https://www.swiggy.com/corporate-governance/swiggy_drhp_av.mp4",
    rhp_av_mp4_url: "https://www.swiggy.com/corporate-governance/swiggy_rhp_av.mp4",
    sebi_portal_url: "https://www.sebi.gov.in/filings/swiggy_2024.html",
    sebi_filing_date: "2024-04-26",
    sebi_approval_date: "2024-09-24",
    lead_counsel: "AZB & Partners",
    statutory_auditors: "Price Waterhouse LLP",
    registered_office: "Devarabisanahalli, Outer Ring Road, Bengaluru 560103"
  },
  {
    symbol: "HYUNDAI",
    company_name: "Hyundai Motor India Limited",
    drhp_pdf_url: "https://www.hyundai.com/in/investors/ipo/drhp.pdf",
    rhp_pdf_url: "https://www.hyundai.com/in/investors/ipo/rhp.pdf",
    drhp_av_mp4_url: "https://www.hyundai.com/in/investors/ipo/drhp_av_walkthrough.mp4",
    rhp_av_mp4_url: "https://www.hyundai.com/in/investors/ipo/rhp_av_walkthrough.mp4",
    sebi_portal_url: "https://www.sebi.gov.in/filings/hyundai_2024.html",
    sebi_filing_date: "2024-06-15",
    sebi_approval_date: "2024-09-18",
    lead_counsel: "Shardul Amarchand Mangaldas",
    statutory_auditors: "S.R. Batliboi & Associates LLP",
    registered_office: "Irungattukottai, Sriperumbudur, Tamil Nadu 602117"
  },
  {
    symbol: "BAJAJHFL",
    company_name: "Bajaj Housing Finance Limited",
    drhp_pdf_url: "https://www.bajajhousingfinance.in/investors/drhp.pdf",
    rhp_pdf_url: "https://www.bajajhousingfinance.in/investors/rhp.pdf",
    drhp_av_mp4_url: "https://www.bajajhousingfinance.in/investors/av/drhp_summary.mp4",
    rhp_av_mp4_url: "https://www.bajajhousingfinance.in/investors/av/rhp_summary.mp4",
    sebi_portal_url: "https://www.sebi.gov.in/filings/bajajhfl_2024.html",
    sebi_filing_date: "2024-06-08",
    sebi_approval_date: "2024-08-02",
    lead_counsel: "Cyril Amarchand Mangaldas",
    statutory_auditors: "KKC & Associates LLP",
    registered_office: "Cerebrum IT Park, Kalyani Nagar, Pune 411014"
  }
]);

// 2. DRHP vs RHP Deep Unstructured Section Diffs
db.drhp_rhp_deep_sections.insertMany([
  {
    symbol: "TONBO",
    section: "Objects of the Issue",
    drhp_clause: "Funds of Rs 250 Cr allocated towards Setting up of dedicated electro-optics manufacturing fab in Hosur.",
    rhp_clause: "SEBI advisory reflected: Split into Rs 180 Cr for Hosur Fab and Rs 70 Cr for Long-term working capital and global defense R&D testing.",
    regulatory_impact: "Detailed escrow deployment milestones mandated by SEBI."
  },
  {
    symbol: "TONBO",
    section: "Risk Factors & Litigations",
    drhp_clause: "Disclosed 2 pending vendor contractual disputes totaling Rs 4.2 Cr.",
    rhp_clause: "Added high-priority risk factor regarding export licenses for Dual-Use Thermal Sight technology under Indian SCOMET regulations.",
    regulatory_impact: "Crucial regulatory transparency enhancement for retail investors."
  },
  {
    symbol: "SWIGGY",
    section: "Dark Stores Quick Commerce Capex",
    drhp_clause: "Rs 982 Cr allocated towards dark store expansion across Tier-1 metros.",
    rhp_clause: "Increased to Rs 1,178 Cr following rapid Instamart footprint scale-up and Zepto/Blinkit competitive dynamics.",
    regulatory_impact: "Capex accelerated by 20% in final prospectus."
  }
]);

// 3. Media & Research Videos
db.media_and_research.insertMany([
  {
    symbol: "TONBO",
    channel_name: "Pranjal Kamra - Finology",
    video_title: "Tonbo Imaging IPO Review: India's Defense Tech Gamechanger?",
    video_url: "https://www.youtube.com/watch?v=exampleTonbo1",
    view_count: 142000,
    sentiment: "Very Bullish",
    key_takeaway: "High gross margins in defense electro-optics; strong order book from Indian Armed Forces & NATO allies."
  },
  {
    symbol: "TONBO",
    channel_name: "Akshat Shrivastava",
    video_title: "Deep Tech Investing: Should You Apply for Tonbo IPO?",
    video_url: "https://www.youtube.com/watch?v=exampleTonbo2",
    view_count: 285000,
    sentiment: "Bullish with Long-Term Horizon",
    key_takeaway: "Proprietary AI thermal night vision algorithms give Tonbo 45% EBITDA margins; high barrier to entry."
  },
  {
    symbol: "TATATECH",
    channel_name: "CA Rachana Ranade",
    video_title: "Tata Technologies IPO Complete Analysis & Allotment Strategy",
    video_url: "https://www.youtube.com/watch?v=exampleTataTech",
    view_count: 620000,
    sentiment: "Super Bullish",
    key_takeaway: "First Tata Group IPO in almost 2 decades; massive listing pop anticipated due to parent brand trust."
  },
  {
    symbol: "BAJAJHFL",
    channel_name: "Asset Yogi",
    video_title: "Bajaj Housing Finance IPO: Is it a Multibagger or Overpriced?",
    video_url: "https://www.youtube.com/watch?v=exampleBajajHFL",
    view_count: 510000,
    sentiment: "Bullish",
    key_takeaway: "Lowest NPA ratio in housing finance industry; reasonable valuation relative to parent Bajaj Finance."
  }
]);

// 4. Peer Comparison Multiples
db.peer_comparison_matrix.insertMany([
  {
    symbol: "TONBO",
    peers: [
      { name: "Tonbo Imaging", pe_ratio: 38.4, roe_pct: 22.8, pat_margin_pct: 18.2, revenue_cr: 340.5 },
      { name: "Data Patterns India", pe_ratio: 54.2, roe_pct: 17.4, pat_margin_pct: 28.5, revenue_cr: 520.1 },
      { name: "Zen Technologies", pe_ratio: 62.1, roe_pct: 26.5, pat_margin_pct: 31.0, revenue_cr: 440.0 },
      { name: "Astra Microwave", pe_ratio: 44.8, roe_pct: 15.2, pat_margin_pct: 12.8, revenue_cr: 810.0 }
    ]
  },
  {
    symbol: "TATATECH",
    peers: [
      { name: "Tata Technologies", pe_ratio: 32.5, roe_pct: 23.7, pat_margin_pct: 15.8, revenue_cr: 4414.0 },
      { name: "KPIT Technologies", pe_ratio: 78.4, roe_pct: 25.1, pat_margin_pct: 11.2, revenue_cr: 4871.0 },
      { name: "L&T Technology Services", pe_ratio: 41.2, roe_pct: 24.3, pat_margin_pct: 14.1, revenue_cr: 9647.0 },
      { name: "Tata Elxsi", pe_ratio: 52.8, roe_pct: 29.8, pat_margin_pct: 22.4, revenue_cr: 3552.0 }
    ]
  }
]);

print("MongoDB IPO Intelligence collections seeded successfully!");
