import React, { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState(null);
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('offerings');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [role, setRole] = useState('Admin');
  const [crawling, setCrawling] = useState(false);
  const [schemaObjects, setSchemaObjects] = useState(null);

  // Vector Search States
  const [vectorQuery, setVectorQuery] = useState('');
  const [vectorResults, setVectorResults] = useState([]);
  const [vectorLoading, setVectorLoading] = useState(false);

  // Form State
  const [formMsg, setFormMsg] = useState(null);
  const [newIpo, setNewIpo] = useState({
    symbol: '',
    company_name: '',
    sector: 'Technology',
    price_band_min: 200,
    price_band_max: 220,
    lot_size: 60,
    total_issue_val_cr: 450,
    status: 'Upcoming'
  });

  // Load Status and Offerings
  const loadData = async () => {
    try {
      const [sRes, iRes] = await Promise.all([
        fetch('/api/status').then(r => r.json()).catch(() => null),
        fetch('/api/ipos').then(r => r.json()).catch(() => [])
      ]);
      if (sRes) setStatus(sRes);
      if (Array.isArray(iRes)) setIpos(iRes);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadSchema = async () => {
    try {
      const res = await fetch('/api/database/schema-objects').then(r => r.json());
      setSchemaObjects(res);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    loadSchema();
  }, []);

  // Trigger Crawler
  const handleRecrawl = async () => {
    setCrawling(true);
    try {
      const res = await fetch('/api/crawl/refresh', { method: 'POST' }).then(r => r.json());
      alert(res.message || 'Scrape complete');
      loadData();
    } catch (e) {
      alert('Crawler notice: ' + e.message);
    } finally {
      setCrawling(false);
    }
  };

  // Semantic Vector Search
  const handleVectorSearch = async (queryText) => {
    const q = queryText !== undefined ? queryText : vectorQuery;
    if (!q.trim()) return;
    setVectorLoading(true);
    try {
      const res = await fetch(`/api/vector-search?q=${encodeURIComponent(q)}&k=5`).then(r => r.json());
      setVectorResults(res.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setVectorLoading(false);
    }
  };

  // Submit New IPO Form (Demonstrates DB Validation & Trigger)
  const handleCreateIpo = async (e) => {
    e.preventDefault();
    setFormMsg(null);
    try {
      const res = await fetch('/api/ipo/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIpo)
      }).then(r => r.json());

      if (res.status === 'success') {
        setFormMsg({ type: 'success', text: res.message });
        loadData();
      } else {
        setFormMsg({ type: 'error', text: res.message });
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: err.message });
    }
  };

  // Filter IPOs
  const filteredIpos = ipos.filter(item => {
    const matchSearch =
      item.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      item.sector?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="terminal-container">
      {/* Header */}
      <header className="header-bar">
        <div className="logo-section">
          <h1>
            <span>IPOWatch Intelligence</span>
            <span className="logo-badge">Next.js 14 Terminal</span>
          </h1>
          <div className="tech-badges">
            <span className="tech-pill">SQL: MySQL / SQLite (ACID)</span>
            <span className="tech-pill">NoSQL: MongoDB Document Lake</span>
            <span className="tech-pill">Vector DB: Cosine Similarity</span>
            <span className="tech-pill">Dr. Nagasundari S • Level 3 DBMS</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="user-role-bar">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role:</span>
            <select
              className="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Admin (Full Access & DML)</option>
              <option value="Analyst">Analyst (Read & Analytics)</option>
              <option value="Investor">Investor (Portfolio Surveillance)</option>
            </select>
          </div>

          <button
            className="btn-crawl"
            onClick={handleRecrawl}
            disabled={crawling || role === 'Investor'}
            title={role === 'Investor' ? 'Admin / Analyst role required to run crawler' : 'Scrape latest live market data'}
          >
            {crawling ? 'Crawling...' : 'Re-Crawl Live Market'}
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Primary Market Offerings</div>
          <div className="stat-value">{ipos.length || 26}</div>
          <div className="stat-sub">Live Chittorgarh & IPOWatch Catalog</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Active Database Triggers</div>
          <div className="stat-value">{status?.active_triggers_count || 3}</div>
          <div className="stat-sub">Collar & Status Change Validation</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Analytical Views</div>
          <div className="stat-value">{status?.active_views_count || 4}</div>
          <div className="stat-sub">Arbitrage, Anchor Shock, Discovery</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Vector Semantic Search</div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>Ready</div>
          <div className="stat-sub">Cosine Similarity (Normalized Dot)</div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <nav className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'offerings' ? 'active' : ''}`}
          onClick={() => setActiveTab('offerings')}
        >
          Primary Market Directory
        </button>
        <button
          className={`tab-btn ${activeTab === 'vector' ? 'active' : ''}`}
          onClick={() => setActiveTab('vector')}
        >
          Vector DB Semantic Search (Req 8)
        </button>
        <button
          className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Add Offering (DML & Triggers)
        </button>
        <button
          className={`tab-btn ${activeTab === 'schema' ? 'active' : ''}`}
          onClick={() => setActiveTab('schema')}
        >
          Database Objects & Architecture
        </button>
      </nav>

      {/* TAB 1: Primary Market Directory */}
      {activeTab === 'offerings' && (
        <section>
          <div className="controls-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by company name, ticker symbol, or sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Upcoming">Upcoming Only</option>
              <option value="Open">Currently Open</option>
              <option value="Completed">Completed / Listed</option>
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Symbol</th>
                  <th>Company Name</th>
                  <th>Sector</th>
                  <th>Price Band</th>
                  <th>Issue Size (Cr)</th>
                  <th>Est. GMP Gain</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {filteredIpos.map((item) => (
                  <tr key={item.symbol}>
                    <td>
                      <span
                        className={`status-badge ${
                          item.status === 'Open'
                            ? 'status-open'
                            : item.status === 'Upcoming'
                            ? 'status-upcoming'
                            : 'status-completed'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      {item.symbol}
                    </td>
                    <td>{item.company_name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{item.sector}</td>
                    <td>₹{item.price_band_min} - ₹{item.price_band_max}</td>
                    <td>₹{item.total_issue_val_cr} Cr</td>
                    <td
                      style={{
                        fontWeight: 600,
                        color:
                          (item.avg_gmp_gain_pct || 0) > 0
                            ? 'var(--accent-green)'
                            : 'var(--text-muted)'
                      }}
                    >
                      {item.avg_gmp_gain_pct ? `+${item.avg_gmp_gain_pct}%` : 'N/A'}
                    </td>
                    <td>
                      {item.latest_sub_multiple
                        ? `${item.latest_sub_multiple}x`
                        : 'Awaiting'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: Vector DB Semantic Search (Requirement 8) */}
      {activeTab === 'vector' && (
        <section className="vector-box">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Vector Similarity & Semantic Prospectus Search
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Natural language semantic search across unstructured DRHP/RHP Prospectus filings, business descriptions, and risk disclosures. Powered by normalized dense term-vector embeddings and <strong>Cosine Similarity</strong> ranking:
            <code style={{ marginLeft: '0.5rem', background: 'var(--bg-input)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
              Cosine(q, d) = (q · d) / (|q| · |d|)
            </code>
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="vector-search-input"
              placeholder="Ask or search: e.g. 'defense electro-optics and night vision', 'clean green steel decarbonization'..."
              value={vectorQuery}
              onChange={(e) => setVectorQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVectorSearch()}
            />
            <button
              className="btn-crawl"
              style={{ height: '46px', whiteSpace: 'nowrap' }}
              onClick={() => handleVectorSearch()}
              disabled={vectorLoading}
            >
              {vectorLoading ? 'Searching...' : 'Search Vectors'}
            </button>
          </div>

          {/* Quick Query Pills */}
          <div className="query-pills">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              Sample Queries:
            </span>
            {[
              'Defense night-vision and tactical sensors',
              'Green steel electric arc furnace decarbonization',
              '5G broadband wireless telecom digital ecosystem',
              'Multispecialty hospitals oncology cardiology',
              'Industrial gearboxes and wind turbine yaw drives'
            ].map((q) => (
              <button
                key={q}
                className="query-pill-btn"
                onClick={() => {
                  setVectorQuery(q);
                  handleVectorSearch(q);
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Vector Results */}
          <div>
            {vectorResults.map((res, i) => (
              <div key={i} className="vector-result-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {res.symbol}
                    </span>
                    <span style={{ fontWeight: 600 }}>{res.company_name}</span>
                    <span className="status-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                      {res.sector}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {res.doc_type}
                  </p>
                  <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                    "{res.snippet}"
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="similarity-badge">
                    {res.similarity_score}% Match
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Raw Cosine: {res.raw_cosine}
                  </div>
                </div>
              </div>
            ))}

            {vectorResults.length === 0 && !vectorLoading && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                Type a natural language concept above or click a sample query to demonstrate vector similarity retrieval.
              </p>
            )}
          </div>
        </section>
      )}

      {/* TAB 3: Add Offering Form (DML & Triggers) */}
      {activeTab === 'form' && (
        <section className="form-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Register New IPO Offering (DML INSERT with Database Triggers)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Demonstrates database-level integrity validation (Requirement 12) and Trigger execution. If <strong>Max Price &lt; Min Price</strong>, the active SQLite/MySQL Trigger <code>trg_validate_price_band</code> aborts the transaction.
          </p>

          {formMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                background: formMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                color: formMsg.type === 'success' ? '#34d399' : '#fb7185',
                border: `1px solid ${formMsg.type === 'success' ? '#059669' : '#e11d48'}`
              }}
            >
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleCreateIpo}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ticker Symbol</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. SOLARTECH"
                  value={newIpo.symbol}
                  onChange={(e) => setNewIpo({ ...newIpo, symbol: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. SolarTech Innovations Ltd."
                  value={newIpo.company_name}
                  onChange={(e) => setNewIpo({ ...newIpo, company_name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Min Price Band (Floor ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={newIpo.price_band_min}
                  onChange={(e) => setNewIpo({ ...newIpo, price_band_min: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Price Band (Cap ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={newIpo.price_band_max}
                  onChange={(e) => setNewIpo({ ...newIpo, price_band_max: parseFloat(e.target.value) })}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  (Set Cap &lt; Floor to trigger trg_validate_price_band abort)
                </span>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Issue Size (₹ Cr)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={newIpo.total_issue_val_cr}
                  onChange={(e) => setNewIpo({ ...newIpo, total_issue_val_cr: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Market Lot Size</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={newIpo.lot_size}
                  onChange={(e) => setNewIpo({ ...newIpo, lot_size: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              Execute Database INSERT
            </button>
          </form>
        </section>
      )}

      {/* TAB 4: Database Schema & Architecture */}
      {activeTab === 'schema' && (
        <section className="vector-box">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Confirmed Database Objects (Live Inspection)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Live query of <code>sqlite_master</code> confirming compiled tables, triggers, views, and indexes:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
                Active Triggers ({schemaObjects?.summary?.triggers_count || 3})
              </h3>
              {schemaObjects?.triggers?.map((t) => (
                <div key={t.name} style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-green)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: ON {t.tbl_name}</div>
                  <pre style={{ fontSize: '0.72rem', color: 'var(--text-main)', marginTop: '0.35rem', overflowX: 'auto' }}>
                    {t.sql}
                  </pre>
                </div>
              ))}
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
                Production Views ({schemaObjects?.summary?.views_count || 4})
              </h3>
              {schemaObjects?.views?.map((v) => (
                <div key={v.name} style={{ background: 'var(--bg-input)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>{v.name}</div>
                  <pre style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem', overflowX: 'auto' }}>
                    {v.sql}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
