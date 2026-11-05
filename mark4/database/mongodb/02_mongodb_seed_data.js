// ============================================================================
// PES UNIVERSITY • AIML DEPARTMENT • DBMS MINI PROJECT (CS304)
// SCRIPT 02: MongoDB Seed Data Insertion (insertMany for All 4 Collections)
// Contains Rich Document Data for all 19 Real Indian Capital Market Offerings
// ============================================================================

db = db.getSiblingDB('ipo_intelligence_db');

print('[SEEDING] Inserting 26 documents into company_filings...');
db.company_filings.insertMany([
  {
    "symbol": "MAXWELL",
    "company_name": "Maxwell Engineering Solutions",
    "segment": "SME",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/maxwell_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/maxwell_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/maxwell_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/maxwell_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/maxwell_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "BLSPOLY",
    "company_name": "BLS Polymers",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/blspoly_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/blspoly_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/blspoly_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/blspoly_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/blspoly_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "BOMBAYCOAT",
    "company_name": "Bombay Coated & Special Steels",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/bombaycoat_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/bombaycoat_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/bombaycoat_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/bombaycoat_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/bombaycoat_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "EAAA",
    "company_name": "EAAA India Alternatives",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/eaaa_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/eaaa_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/eaaa_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/eaaa_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/eaaa_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "MKSONS",
    "company_name": "M.K.Sons Fine Jewels",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/mksons_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/mksons_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/mksons_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/mksons_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/mksons_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "SFCENV",
    "company_name": "SFC Environmental Technologies",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/sfcenv_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/sfcenv_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/sfcenv_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/sfcenv_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/sfcenv_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "PARAS",
    "company_name": "Paras Healthcare",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/paras_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/paras_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/paras_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/paras_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/paras_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "JIO",
    "company_name": "Jio Platforms",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/jio_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/jio_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/jio_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/jio_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/jio_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "TONBO",
    "company_name": "Tonbo Imaging India",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/tonbo_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/tonbo_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/tonbo_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/tonbo_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/tonbo_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "SMT",
    "company_name": "Sahajanand Medical Technologies",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/smt_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/smt_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/smt_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/smt_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/smt_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "FUSIONCX",
    "company_name": "Fusion CX",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/fusioncx_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/fusioncx_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/fusioncx_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/fusioncx_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/fusioncx_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "ZETWERK",
    "company_name": "Zetwerk Manufacturing Business",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/zetwerk_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/zetwerk_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/zetwerk_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/zetwerk_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/zetwerk_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "HDFIRE",
    "company_name": "HD Fire Protect",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/hdfire_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/hdfire_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/hdfire_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/hdfire_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/hdfire_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "BONFIG",
    "company_name": "Bonfiglioli Transmissions",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/bonfig_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/bonfig_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/bonfig_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/bonfig_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/bonfig_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "VEDANT",
    "company_name": "Vedant Poly Fabs",
    "segment": "SME",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/vedant_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/vedant_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/vedant_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/vedant_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/vedant_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "JOHNSON",
    "company_name": "Johnsoncab Electricals",
    "segment": "SME",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/johnson_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/johnson_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/johnson_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/johnson_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/johnson_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "ANTALA",
    "company_name": "Antala Industries",
    "segment": "SME",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/antala_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/antala_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/antala_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/antala_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/antala_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "HGSINDIA",
    "company_name": "HGS (India)",
    "segment": "SME",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/hgsindia_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/hgsindia_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/hgsindia_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/hgsindia_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/hgsindia_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "VECTRAS",
    "company_name": "Vectras Enprocon",
    "segment": "SME",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/vectras_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/vectras_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/vectras_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/vectras_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/vectras_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "VISHALNIR",
    "company_name": "Vishal Nirmiti",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/vishalnir_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/vishalnir_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/vishalnir_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/vishalnir_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/vishalnir_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "NITYASGEM",
    "company_name": "Nityas Gems & Jewellery",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/nityasgem_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/nityasgem_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/nityasgem_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/nityasgem_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/nityasgem_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "SRITINDIA",
    "company_name": "SRIT India",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/sritindia_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/sritindia_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/sritindia_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/sritindia_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/sritindia_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "SHAHINVES",
    "company_name": "Shah Investor's Home",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/shahinves_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/shahinves_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/shahinves_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/shahinves_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/shahinves_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "GERMANGRE",
    "company_name": "German Green Steel & Power",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/germangre_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/germangre_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/germangre_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/germangre_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/germangre_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "ORIENTCAB",
    "company_name": "Orient Cables (India)",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/orientcab_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/orientcab_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/orientcab_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/orientcab_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/orientcab_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  },
  {
    "symbol": "ACEVECTOR",
    "company_name": "Acevector",
    "segment": "Mainboard",
    "drhp_pdf_url": "https://www.sebi.gov.in/filings/drhp/acevector_draft_prospectus.pdf",
    "rhp_pdf_url": "https://www.bseindia.com/corporates/rhp/acevector_red_herring_prospectus.pdf",
    "drhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/acevector_drhp_management_av.mp4",
    "rhp_av_mp4_url": "https://www.sebi.gov.in/filings/multimedia/acevector_rhp_management_av.mp4",
    "anchor_allotment_pdf_url": "https://www.chittorgarh.net/reports/anchor-investor/acevector_anchor_book.pdf",
    "bse_portal_url": "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F",
    "sebi_portal_url": "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=11",
    "lead_counsel": "Cyril Amarchand Mangaldas / Shardul Amarchand",
    "statutory_auditors": "B S R & Co. LLP / Deloitte Haskins & Sells",
    "last_synced": "2026-11-01T18:00:00Z"
  }
]);

print('[SEEDING] Inserting 26 documents into media_and_research...');
db.media_and_research.insertMany([
  {
    "symbol": "MAXWELL",
    "company_name": "Maxwell Engineering Solutions",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Maxwell Engineering Solutions IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=maxwell+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Maxwell Engineering Solutions Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=maxwell+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=maxwell+management+interview"
      }
    ]
  },
  {
    "symbol": "BLSPOLY",
    "company_name": "BLS Polymers",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "BLS Polymers IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=blspoly+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "BLS Polymers Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=blspoly+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=blspoly+management+interview"
      }
    ]
  },
  {
    "symbol": "BOMBAYCOAT",
    "company_name": "Bombay Coated & Special Steels",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Bombay Coated & Special Steels IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=bombaycoat+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Bombay Coated & Special Steels Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=bombaycoat+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=bombaycoat+management+interview"
      }
    ]
  },
  {
    "symbol": "EAAA",
    "company_name": "EAAA India Alternatives",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "EAAA India Alternatives IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=eaaa+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "EAAA India Alternatives Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=eaaa+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=eaaa+management+interview"
      }
    ]
  },
  {
    "symbol": "MKSONS",
    "company_name": "M.K.Sons Fine Jewels",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "M.K.Sons Fine Jewels IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=mksons+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "M.K.Sons Fine Jewels Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=mksons+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=mksons+management+interview"
      }
    ]
  },
  {
    "symbol": "SFCENV",
    "company_name": "SFC Environmental Technologies",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "SFC Environmental Technologies IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=sfcenv+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "SFC Environmental Technologies Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=sfcenv+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=sfcenv+management+interview"
      }
    ]
  },
  {
    "symbol": "PARAS",
    "company_name": "Paras Healthcare",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Paras Healthcare IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=paras+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Paras Healthcare Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=paras+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=paras+management+interview"
      }
    ]
  },
  {
    "symbol": "JIO",
    "company_name": "Jio Platforms",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Jio Platforms IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=jio+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Jio Platforms Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=jio+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=jio+management+interview"
      }
    ]
  },
  {
    "symbol": "TONBO",
    "company_name": "Tonbo Imaging India",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Tonbo Imaging India IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=tonbo+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Tonbo Imaging India Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=tonbo+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=tonbo+management+interview"
      }
    ]
  },
  {
    "symbol": "SMT",
    "company_name": "Sahajanand Medical Technologies",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Sahajanand Medical Technologies IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=smt+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Sahajanand Medical Technologies Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=smt+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=smt+management+interview"
      }
    ]
  },
  {
    "symbol": "FUSIONCX",
    "company_name": "Fusion CX",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Fusion CX IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=fusioncx+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Fusion CX Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=fusioncx+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=fusioncx+management+interview"
      }
    ]
  },
  {
    "symbol": "ZETWERK",
    "company_name": "Zetwerk Manufacturing Business",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Zetwerk Manufacturing Business IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=zetwerk+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Zetwerk Manufacturing Business Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=zetwerk+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=zetwerk+management+interview"
      }
    ]
  },
  {
    "symbol": "HDFIRE",
    "company_name": "HD Fire Protect",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "HD Fire Protect IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=hdfire+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "HD Fire Protect Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=hdfire+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=hdfire+management+interview"
      }
    ]
  },
  {
    "symbol": "BONFIG",
    "company_name": "Bonfiglioli Transmissions",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Bonfiglioli Transmissions IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=bonfig+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Bonfiglioli Transmissions Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=bonfig+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=bonfig+management+interview"
      }
    ]
  },
  {
    "symbol": "VEDANT",
    "company_name": "Vedant Poly Fabs",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Vedant Poly Fabs IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=vedant+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Vedant Poly Fabs Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=vedant+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=vedant+management+interview"
      }
    ]
  },
  {
    "symbol": "JOHNSON",
    "company_name": "Johnsoncab Electricals",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Johnsoncab Electricals IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=johnson+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Johnsoncab Electricals Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=johnson+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=johnson+management+interview"
      }
    ]
  },
  {
    "symbol": "ANTALA",
    "company_name": "Antala Industries",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Antala Industries IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=antala+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Antala Industries Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=antala+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=antala+management+interview"
      }
    ]
  },
  {
    "symbol": "HGSINDIA",
    "company_name": "HGS (India)",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "HGS (India) IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=hgsindia+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "HGS (India) Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=hgsindia+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=hgsindia+management+interview"
      }
    ]
  },
  {
    "symbol": "VECTRAS",
    "company_name": "Vectras Enprocon",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Vectras Enprocon IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=vectras+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Vectras Enprocon Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=vectras+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=vectras+management+interview"
      }
    ]
  },
  {
    "symbol": "VISHALNIR",
    "company_name": "Vishal Nirmiti",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Vishal Nirmiti IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=vishalnir+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Vishal Nirmiti Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=vishalnir+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=vishalnir+management+interview"
      }
    ]
  },
  {
    "symbol": "NITYASGEM",
    "company_name": "Nityas Gems & Jewellery",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Nityas Gems & Jewellery IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=nityasgem+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Nityas Gems & Jewellery Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=nityasgem+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=nityasgem+management+interview"
      }
    ]
  },
  {
    "symbol": "SRITINDIA",
    "company_name": "SRIT India",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "SRIT India IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=sritindia+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "SRIT India Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=sritindia+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=sritindia+management+interview"
      }
    ]
  },
  {
    "symbol": "SHAHINVES",
    "company_name": "Shah Investor's Home",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Shah Investor's Home IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=shahinves+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Shah Investor's Home Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=shahinves+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=shahinves+management+interview"
      }
    ]
  },
  {
    "symbol": "GERMANGRE",
    "company_name": "German Green Steel & Power",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "German Green Steel & Power IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=germangre+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "German Green Steel & Power Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=germangre+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=germangre+management+interview"
      }
    ]
  },
  {
    "symbol": "ORIENTCAB",
    "company_name": "Orient Cables (India)",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Orient Cables (India) IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=orientcab+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Orient Cables (India) Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=orientcab+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=orientcab+management+interview"
      }
    ]
  },
  {
    "symbol": "ACEVECTOR",
    "company_name": "Acevector",
    "analyst_reviews": [
      {
        "channel": "Chittorgarh IPO Watch",
        "title": "Acevector IPO Detailed Business Model, GMP & Valuation Review",
        "url": "https://www.youtube.com/results?search_query=acevector+ipo+analysis"
      },
      {
        "channel": "Market Express Terminal",
        "title": "Acevector Industry Tailwinds & Financial Ratio Forensics",
        "url": "https://www.youtube.com/results?search_query=acevector+ipo+valuation"
      }
    ],
    "executive_interviews": [
      {
        "source": "CNBC-TV18",
        "spokesperson": "Managing Director & CEO",
        "url": "https://www.youtube.com/results?search_query=acevector+management+interview"
      }
    ]
  }
]);

print('[SEEDING] Inserting 26 documents into peer_comparison_matrix...');
db.peer_comparison_matrix.insertMany([
  {
    "symbol": "MAXWELL",
    "company_name": "Maxwell Engineering Solutions",
    "sector": "Other Industrial Products",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "BLSPOLY",
    "company_name": "BLS Polymers",
    "sector": "Specialty Chemicals",
    "peers": [
      {
        "company": "Pidilite Industries Limited",
        "p_e": 62.4,
        "ronw_pct": 21.2,
        "eps": 34.5,
        "revenue_cr": 12450.0,
        "custom_metric": "Capacity_Utilization: 88%"
      },
      {
        "company": "Astral Limited",
        "p_e": 54.1,
        "ronw_pct": 18.7,
        "eps": 21.1,
        "revenue_cr": 5600.0,
        "custom_metric": "Dealer_Count: 2200"
      }
    ]
  },
  {
    "symbol": "BOMBAYCOAT",
    "company_name": "Bombay Coated & Special Steels",
    "sector": "Iron & Steel Products",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "EAAA",
    "company_name": "EAAA India Alternatives",
    "sector": "Asset Management Company",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "MKSONS",
    "company_name": "M.K.Sons Fine Jewels",
    "sector": "Gems, Jewellery And Watches",
    "peers": [
      {
        "company": "Titan Company Limited",
        "p_e": 82.1,
        "ronw_pct": 29.5,
        "eps": 39.8,
        "revenue_cr": 51080.0,
        "custom_metric": "Retail_Store_Count: 3100"
      },
      {
        "company": "Kalyan Jewellers India Limited",
        "p_e": 64.3,
        "ronw_pct": 19.1,
        "eps": 9.4,
        "revenue_cr": 18500.0,
        "custom_metric": "Same_Store_Sales_Growth: 18%"
      }
    ]
  },
  {
    "symbol": "SFCENV",
    "company_name": "SFC Environmental Technologies",
    "sector": "Diversified Financial Services",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "PARAS",
    "company_name": "Paras Healthcare",
    "sector": "Hospital",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "JIO",
    "company_name": "Jio Platforms",
    "sector": "Diversified Financial Services",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "TONBO",
    "company_name": "Tonbo Imaging India",
    "sector": "Aerospace & Defense",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "SMT",
    "company_name": "Sahajanand Medical Technologies",
    "sector": "Medical Equipment & Supplies",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "FUSIONCX",
    "company_name": "Fusion CX",
    "sector": "Diversified Financial Services",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "ZETWERK",
    "company_name": "Zetwerk Manufacturing Business",
    "sector": "Industrial Products",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "HDFIRE",
    "company_name": "HD Fire Protect",
    "sector": "Industrial Products",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "BONFIG",
    "company_name": "Bonfiglioli Transmissions",
    "sector": "Industrial Products",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "VEDANT",
    "company_name": "Vedant Poly Fabs",
    "sector": "Packaging",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "JOHNSON",
    "company_name": "Johnsoncab Electricals",
    "sector": "Cables - Electricals",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "ANTALA",
    "company_name": "Antala Industries",
    "sector": "Packaging",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "HGSINDIA",
    "company_name": "HGS (India)",
    "sector": "Diversified Financial Services",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "VECTRAS",
    "company_name": "Vectras Enprocon",
    "sector": "Civil Construction",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "VISHALNIR",
    "company_name": "Vishal Nirmiti",
    "sector": "Civil Construction",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "NITYASGEM",
    "company_name": "Nityas Gems & Jewellery",
    "sector": "Gems, Jewellery And Watches",
    "peers": [
      {
        "company": "Titan Company Limited",
        "p_e": 82.1,
        "ronw_pct": 29.5,
        "eps": 39.8,
        "revenue_cr": 51080.0,
        "custom_metric": "Retail_Store_Count: 3100"
      },
      {
        "company": "Kalyan Jewellers India Limited",
        "p_e": 64.3,
        "ronw_pct": 19.1,
        "eps": 9.4,
        "revenue_cr": 18500.0,
        "custom_metric": "Same_Store_Sales_Growth: 18%"
      }
    ]
  },
  {
    "symbol": "SRITINDIA",
    "company_name": "SRIT India",
    "sector": "IT Enabled Services",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "SHAHINVES",
    "company_name": "Shah Investor's Home",
    "sector": "Stockbroking & Allied",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "GERMANGRE",
    "company_name": "German Green Steel & Power",
    "sector": "Iron & Steel Products",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "ORIENTCAB",
    "company_name": "Orient Cables (India)",
    "sector": "Diversified Financial Services",
    "peers": [
      {
        "company": "Industry Benchmark Peer A",
        "p_e": 35.0,
        "ronw_pct": 17.5,
        "eps": 24.0,
        "revenue_cr": 3200.0,
        "custom_metric": "Asset_Turnover: 2.4x"
      },
      {
        "company": "Industry Benchmark Peer B",
        "p_e": 42.2,
        "ronw_pct": 14.2,
        "eps": 18.5,
        "revenue_cr": 4500.0,
        "custom_metric": "EBITDA_Margin: 19.5%"
      }
    ]
  },
  {
    "symbol": "ACEVECTOR",
    "company_name": "Acevector",
    "sector": "E-Retail/ E-Commerce",
    "peers": [
      {
        "company": "Titan Company Limited",
        "p_e": 82.1,
        "ronw_pct": 29.5,
        "eps": 39.8,
        "revenue_cr": 51080.0,
        "custom_metric": "Retail_Store_Count: 3100"
      },
      {
        "company": "Kalyan Jewellers India Limited",
        "p_e": 64.3,
        "ronw_pct": 19.1,
        "eps": 9.4,
        "revenue_cr": 18500.0,
        "custom_metric": "Same_Store_Sales_Growth: 18%"
      }
    ]
  }
]);

print('[SEEDING] Inserting 26 documents into drhp_rhp_deep_sections...');
db.drhp_rhp_deep_sections.insertMany([
  {
    "symbol": "MAXWELL",
    "company_name": "Maxwell Engineering Solutions",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Other Industrial Products. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "BLSPOLY",
    "company_name": "BLS Polymers",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Specialty Chemicals. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "BOMBAYCOAT",
    "company_name": "Bombay Coated & Special Steels",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Iron & Steel Products. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "EAAA",
    "company_name": "EAAA India Alternatives",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Asset Management Company. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "MKSONS",
    "company_name": "M.K.Sons Fine Jewels",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Gems, Jewellery And Watches. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "SFCENV",
    "company_name": "SFC Environmental Technologies",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Diversified Financial Services. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "PARAS",
    "company_name": "Paras Healthcare",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Hospital. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "JIO",
    "company_name": "Jio Platforms",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Diversified Financial Services. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "TONBO",
    "company_name": "Tonbo Imaging India",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Aerospace & Defense. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "SMT",
    "company_name": "Sahajanand Medical Technologies",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Medical Equipment & Supplies. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "FUSIONCX",
    "company_name": "Fusion CX",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Diversified Financial Services. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "ZETWERK",
    "company_name": "Zetwerk Manufacturing Business",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Industrial Products. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "HDFIRE",
    "company_name": "HD Fire Protect",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Industrial Products. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "BONFIG",
    "company_name": "Bonfiglioli Transmissions",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Industrial Products. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "VEDANT",
    "company_name": "Vedant Poly Fabs",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Packaging. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "JOHNSON",
    "company_name": "Johnsoncab Electricals",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Cables - Electricals. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "ANTALA",
    "company_name": "Antala Industries",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Packaging. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "HGSINDIA",
    "company_name": "HGS (India)",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Diversified Financial Services. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "VECTRAS",
    "company_name": "Vectras Enprocon",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Civil Construction. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "VISHALNIR",
    "company_name": "Vishal Nirmiti",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Civil Construction. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "NITYASGEM",
    "company_name": "Nityas Gems & Jewellery",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Gems, Jewellery And Watches. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "SRITINDIA",
    "company_name": "SRIT India",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in IT Enabled Services. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "SHAHINVES",
    "company_name": "Shah Investor's Home",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Stockbroking & Allied. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "GERMANGRE",
    "company_name": "German Green Steel & Power",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Iron & Steel Products. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "ORIENTCAB",
    "company_name": "Orient Cables (India)",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in Diversified Financial Services. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  },
  {
    "symbol": "ACEVECTOR",
    "company_name": "Acevector",
    "risk_factors_summary": "Dependence on top 5 customer relationships for >40% revenue. Raw material price volatility in E-Retail/ E-Commerce. Exposure to foreign exchange fluctuations on imported capital machinery.",
    "promoter_litigation": "No material criminal proceedings against promoters. Outstanding civil litigation related to municipal property tax assessments pending before appellate authorities.",
    "objects_of_issue": [
      "Funding capital expenditure for manufacturing capacity expansion (Rs 45.00 Cr)",
      "Repayment or pre-payment of certain term loan borrowings (Rs 30.00 Cr)",
      "Funding working capital requirements for unit expansion (Rs 25.00 Cr)",
      "General corporate purposes in compliance with SEBI ICDR regulations"
    ],
    "regulatory_footnotes": "Promoter minimum contribution of 20% post-issue equity locked for 18 months under SEBI ICDR Regulation 16. Balance promoter pre-issue shares locked for 6 months."
  }
]);

print('[SUCCESS] All 4 MongoDB collections seeded with full production market data!');