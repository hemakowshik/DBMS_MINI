// ============================================================================
// PES UNIVERSITY • AIML DEPARTMENT • DBMS MINI PROJECT (CS304)
// SCRIPT 03: MongoDB Demonstration Aggregation Pipelines & NoSQL Queries
// Demonstrates $unwind, $group, $project, $lookup, and regex matching
// Faculty Evaluator: Prof. Smitha G R
// ============================================================================

db = db.getSiblingDB('ipo_intelligence_db');

print("====================================================================");
print("PIPELINE 1: Analyst Video Coverage Frequency by YouTube Channel");
print("Business Goal: Unwinds nested analyst reviews array and ranks channels by coverage");
print("====================================================================");
db.media_and_research.aggregate([
  { $unwind: "$analyst_reviews" },
  {
    $group: {
      _id: "$analyst_reviews.channel",
      total_reviews_published: { $sum: 1 },
      covered_offerings: { $addToSet: "$symbol" }
    }
  },
  { $sort: { total_reviews_published: -1 } },
  {
    $project: {
      channel_name: "$_id",
      total_reviews_published: 1,
      total_companies_covered: { $size: "$covered_offerings" },
      covered_offerings: 1,
      _id: 0
    }
  }
]).forEach(printjson);

print("====================================================================");
print("PIPELINE 2: Cross-Collection $lookup (Joining Filings with Peer Matrix)");
print("Business Goal: Polyglot document join between statutory URLs and competitor metrics");
print("====================================================================");
db.company_filings.aggregate([
  {
    $lookup: {
      from: "peer_comparison_matrix",
      localField: "symbol",
      foreignField: "symbol",
      as: "competitor_intelligence"
    }
  },
  { $unwind: "$competitor_intelligence" },
  {
    $project: {
      symbol: 1,
      company_name: 1,
      segment: 1,
      rhp_pdf_url: 1,
      sector: "$competitor_intelligence.sector",
      peer_companies_tracked: { $size: "$competitor_intelligence.peers" },
      _id: 0
    }
  },
  { $limit: 5 }
]).forEach(printjson);

print("====================================================================");
print("PIPELINE 3: Filter High-Severity Legal Disclosures ($regexMatch)");
print("Business Goal: Scans unstructured risk factors for litigations and foreign exchange risks");
print("====================================================================");
db.drhp_rhp_deep_sections.aggregate([
  {
    $match: {
      $or: [
        { risk_factors_summary: { $regex: /litigation|foreign exchange|dependence/i } },
        { promoter_litigation: { $regex: /proceedings|dispute/i } }
      ]
    }
  },
  {
    $project: {
      symbol: 1,
      company_name: 1,
      risk_factors_summary: 1,
      objects_count: { $size: "$objects_of_issue" },
      _id: 0
    }
  },
  { $limit: 5 }
]).forEach(printjson);

print("====================================================================");
print("PIPELINE 4: Sector-Wise Peer Valuation Multiples Statistical Summary");
print("Business Goal: Computes average P/E ratio and maximum RoNW across sector peers");
print("====================================================================");
db.peer_comparison_matrix.aggregate([
  { $unwind: "$peers" },
  {
    $group: {
      _id: "$sector",
      avg_peer_pe_ratio: { $avg: "$peers.p_e" },
      max_peer_ronw_pct: { $max: "$peers.ronw_pct" },
      total_peer_benchmarks: { $sum: 1 }
    }
  },
  { $sort: { avg_peer_pe_ratio: -1 } }
]).forEach(printjson);
