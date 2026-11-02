-- ============================================================================
-- PES UNIVERSITY • AIML DEPARTMENT • DBMS MINI PROJECT (CS304)
-- MASTER DATABASE DEPLOYMENT RUNNER (00_master_deploy.sql)
-- Executes full schema build, data seeding, views, indexes, triggers, & reports
-- ============================================================================

-- To execute in SQLite:
--   sqlite3 ipo_intelligence.db < 00_master_deploy.sql
--
-- To execute in MySQL / MariaDB:
--   mysql -u root -p ipo_intelligence_db < 00_master_deploy.sql

.read 01_schema_ddl.sql
.read 02_insert_seed_data.sql
.read 03_views_triggers_indexes.sql
.read 04_analytical_reports.sql

SELECT 'DEPLOYMENT COMPLETE: 9 BCNF Relational Tables, 4 Views, 11 Indexes, 2 Triggers, and 5 Reports Successfully Loaded!' AS status;
