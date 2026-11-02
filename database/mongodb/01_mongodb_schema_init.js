// ============================================================================
// PES UNIVERSITY • AIML DEPARTMENT • DBMS MINI PROJECT (CS304)
// IPOWatch Intelligence & Primary Offering Forensics Platform (MARK4)
// SCRIPT 01: MongoDB NoSQL Schema Definition & Strict JSON Schema Validation
// Database: ipo_intelligence_db
// Shell Command: mongosh mongodb://localhost:27017/ipo_intelligence_db 01_mongodb_schema_init.js
// Faculty Evaluator: Prof. Smitha G R
// ============================================================================

db = db.getSiblingDB('ipo_intelligence_db');

// Drop existing collections for clean reproducible build
db.company_filings.drop();
db.media_and_research.drop();
db.peer_comparison_matrix.drop();
db.drhp_rhp_deep_sections.drop();

// ----------------------------------------------------------------------------
// COLLECTION 1: company_filings
// Purpose: Stores statutory documents, DRHP/RHP PDFs, BSE circulars, and MP4 AVs
// Schema Validation: Enforces required fields, string URL formats, and symbols
// ----------------------------------------------------------------------------
db.createCollection("company_filings", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["symbol", "company_name", "drhp_pdf_url", "rhp_pdf_url"],
         properties: {
            symbol: {
               bsonType: "string",
               description: "NSE/BSE trading ticker symbol - required string"
            },
            company_name: {
               bsonType: "string",
               description: "Full statutory corporate entity name - required string"
            },
            drhp_pdf_url: {
               bsonType: "string",
               description: "Preliminary Draft Red Herring Prospectus PDF URL"
            },
            rhp_pdf_url: {
               bsonType: "string",
               description: "Final Approved Red Herring Prospectus PDF URL"
            },
            drhp_av_mp4_url: {
               bsonType: "string",
               description: "Official executive audio-visual management walkthrough video (MP4)"
            },
            rhp_av_mp4_url: {
               bsonType: "string",
               description: "Post-approval revised executive management walkthrough video (MP4)"
            },
            bse_portal_url: {
               bsonType: "string",
               description: "Official BSE Corporate Filing Notice Page"
            },
            sebi_portal_url: {
               bsonType: "string",
               description: "SEBI Registered Public Issue Document Repository URL"
            },
            lead_counsel: {
               bsonType: "string"
            },
            statutory_auditors: {
               bsonType: "string"
            }
         }
      }
   }
});

// ----------------------------------------------------------------------------
// COLLECTION 2: media_and_research
// Purpose: Variable-length hierarchical arrays of YouTube analyst reviews & interviews
// Enables dynamic Google NotebookLM tree rendering without SQL table joins
// ----------------------------------------------------------------------------
db.createCollection("media_and_research", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["symbol", "analyst_reviews"],
         properties: {
            symbol: {
               bsonType: "string",
               description: "Unique trading ticker symbol"
            },
            analyst_reviews: {
               bsonType: "array",
               description: "List of third-party certified analyst YouTube reviews",
               items: {
                  bsonType: "object",
                  required: ["channel", "title", "url"],
                  properties: {
                     channel: { bsonType: "string" },
                     title: { bsonType: "string" },
                     url: { bsonType: "string" }
                  }
               }
            },
            executive_interviews: {
               bsonType: "array",
               items: {
                  bsonType: "object",
                  properties: {
                     source: { bsonType: "string" },
                     spokesperson: { bsonType: "string" },
                     url: { bsonType: "string" }
                  }
               }
            }
         }
      }
   }
});

// ----------------------------------------------------------------------------
// COLLECTION 3: peer_comparison_matrix
// Purpose: Polymorphic competitor comparison metrics
// Solves the RDBMS 'Sparse Matrix Problem' (NULL column bloat across diverse sectors)
// ----------------------------------------------------------------------------
db.createCollection("peer_comparison_matrix", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["symbol", "peers"],
         properties: {
            symbol: { bsonType: "string" },
            sector: { bsonType: "string" },
            peers: {
               bsonType: "array",
               items: {
                  bsonType: "object",
                  required: ["company", "p_e"],
                  properties: {
                     company: { bsonType: "string" },
                     p_e: { bsonType: ["double", "int", "string"] },
                     ronw_pct: { bsonType: ["double", "int", "string"] },
                     eps: { bsonType: ["double", "int", "string"] },
                     revenue_cr: { bsonType: ["double", "int", "string"] }
                  }
               }
            }
         }
      }
   }
});

// ----------------------------------------------------------------------------
// COLLECTION 4: drhp_rhp_deep_sections
// Purpose: Unstructured full-text regulatory disclosures, qualitative risk factors,
// objects of issue, and litigation footnotes without rigid schema constraints
// ----------------------------------------------------------------------------
db.createCollection("drhp_rhp_deep_sections", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["symbol"],
         properties: {
            symbol: { bsonType: "string" },
            risk_factors_summary: { bsonType: "string" },
            promoter_litigation: { bsonType: "string" },
            objects_of_issue: { bsonType: "array", items: { bsonType: "string" } },
            regulatory_footnotes: { bsonType: "string" }
         }
      }
   }
});

// Create Indexes on symbol for O(1) document-level retrieval
db.company_filings.createIndex({ symbol: 1 }, { unique: true });
db.media_and_research.createIndex({ symbol: 1 }, { unique: true });
db.peer_comparison_matrix.createIndex({ symbol: 1 }, { unique: true });
db.drhp_rhp_deep_sections.createIndex({ symbol: 1 }, { unique: true });

print("[SUCCESS] MongoDB Database 'ipo_intelligence_db' and 4 validated collections initialized!");
