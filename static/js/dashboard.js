document.addEventListener("DOMContentLoaded", () => {
  // Tab Switching
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      tabButtons.forEach(b => b.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target).classList.add("active");

      // Lazy load tab data if needed
      if (target === "tab-gmp-heatmap") loadGmpHeatmap();
      if (target === "tab-gmp-scoreboard") loadGmpScoreboard();
      if (target === "tab-drhp-tracker") loadDrhpDiffs();
      if (target === "tab-timeline") loadTimeline();
      if (target === "tab-repository") loadRepository();
      if (target === "tab-reports") loadReport(1);
    });
  });

  // Live Market Clock Synchronizer
  function updateMarketClock() {
    const clockEl = document.getElementById("clock-display");
    if (clockEl) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-IN", { hour12: false });
      clockEl.textContent = `${timeStr} IST`;
    }
  }
  updateMarketClock();
  setInterval(updateMarketClock, 1000);

  // Load Primary IPOs
  loadPrimaryIpos();

  // Search filter
  const searchInput = document.getElementById("ipo-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase();
      document.querySelectorAll("#ipos-tbody tr").forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(val) ? "" : "none";
      });
    });
  }

  // Reports Button Switching
  document.querySelectorAll(".rep-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".rep-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const repId = parseInt(btn.getAttribute("data-rep"), 10);
      loadReport(repId);
    });
  });

  // Modal Close
  const modal = document.getElementById("ipo-modal");
  const modalClose = document.getElementById("modal-close");
  if (modalClose) {
    modalClose.addEventListener("click", () => modal.classList.remove("open"));
  }
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
});

// -------------------------------------------------------------
// 1. Primary IPOs Table
// -------------------------------------------------------------
function loadPrimaryIpos() {
  fetch("/api/ipos")
    .then(r => r.json())
    .then(ipos => {
      const tbody = document.getElementById("ipos-tbody");
      if (!tbody) return;
      tbody.innerHTML = "";
      ipos.forEach(ipo => {
        const tr = document.createElement("tr");
        const gain = ipo.listing_gain_percent;
        const gainBadge = gain >= 0 
          ? `<span class="badge badge-green">+${gain.toFixed(2)}%</span>`
          : `<span class="badge badge-red">${gain.toFixed(2)}%</span>`;

        tr.innerHTML = `
          <td><strong>${ipo.symbol}</strong></td>
          <td>${ipo.company_name}</td>
          <td><span class="badge badge-blue">${ipo.sector}</span></td>
          <td>₹${ipo.price_band_min} - ₹${ipo.price_band_max}</td>
          <td><strong>₹${ipo.issue_price}</strong></td>
          <td>₹${ipo.total_issue_val_cr.toLocaleString()} Cr</td>
          <td><span class="badge badge-yellow">${ipo.sale_type}</span></td>
          <td>₹${ipo.iep || ipo.issue_price}</td>
          <td>${gainBadge}</td>
          <td>
            <button class="btn-view" onclick="openIpoModal('${ipo.symbol}')">
              <i class="fa-solid fa-eye"></i> View All
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("ipos-tbody").innerHTML = `<tr><td colspan="10">Failed to load data.</td></tr>`;
    });
}

// -------------------------------------------------------------
// 2. GMP Heatmap
// -------------------------------------------------------------
function loadGmpHeatmap() {
  fetch("/api/gmp/heatmap")
    .then(r => r.json())
    .then(rows => {
      const container = document.getElementById("gmp-heatmap-container");
      container.innerHTML = "";

      // Group by symbol
      const groups = {};
      rows.forEach(r => {
        if (!groups[r.symbol]) groups[r.symbol] = { company: r.company_name, price: r.issue_price, list: [] };
        groups[r.symbol].list.push(r);
      });

      Object.entries(groups).forEach(([sym, data]) => {
        const card = document.createElement("div");
        card.className = "heatmap-card";
        let rowsHtml = "";
        data.list.forEach(item => {
          const badgeClass = item.rating_sentiment.includes("Bullish") ? "badge-green" : (item.rating_sentiment.includes("Bearish") ? "badge-red" : "badge-yellow");
          rowsHtml += `
            <div class="heatmap-row">
              <span class="heatmap-platform"><i class="fa-solid fa-globe"></i> ${item.platform_name}</span>
              <span class="badge ${badgeClass}">${item.rating_sentiment}</span>
              <span class="heatmap-val">+₹${item.gmp_inr} (${item.estimated_gain_percent > 0 ? '+' : ''}${item.estimated_gain_percent}%)</span>
            </div>
          `;
        });

        card.innerHTML = `
          <div class="heatmap-card-header">
            <div>
              <h4>${sym}</h4>
              <span class="text-muted" style="font-size: 0.8rem;">${data.company}</span>
            </div>
            <span class="badge badge-blue">Base: ₹${data.price}</span>
          </div>
          <div class="heatmap-rows">
            ${rowsHtml}
          </div>
        `;
        container.appendChild(card);
      });
    });
}

// -------------------------------------------------------------
// 3. Novelty 1: GMP Accuracy Scoreboard
// -------------------------------------------------------------
function loadGmpScoreboard() {
  fetch("/api/gmp/scoreboard")
    .then(r => r.json())
    .then(scores => {
      const tbody = document.getElementById("scoreboard-tbody");
      tbody.innerHTML = "";
      scores.forEach((s, idx) => {
        const tr = document.createElement("tr");
        let medal = `#${idx + 1}`;
        if (idx === 0) medal = `🥇 #1`;
        if (idx === 1) medal = `🥈 #2`;
        if (idx === 2) medal = `🥉 #3`;

        const ratingBadge = s.mean_absolute_error_pct < 10 
          ? `<span class="badge badge-green">★ Highly Reliable</span>`
          : (s.mean_absolute_error_pct < 25 
              ? `<span class="badge badge-yellow">Moderate Bias</span>` 
              : `<span class="badge badge-red">Significant Divergence</span>`);

        tr.innerHTML = `
          <td><strong>${medal}</strong></td>
          <td><strong>${s.platform_name}</strong></td>
          <td>${s.total_evaluated_ipos}</td>
          <td><strong style="color: var(--accent-yellow); font-size: 1.05rem;">${s.mean_absolute_error_pct}%</strong></td>
          <td><span class="badge badge-green">${s.best_prediction_error_pct}%</span></td>
          <td><span class="badge badge-red">${s.worst_prediction_error_pct}%</span></td>
          <td>${s.overestimation_count} IPOs</td>
          <td>${s.underestimation_count} IPOs</td>
          <td>${ratingBadge}</td>
        `;
        tbody.appendChild(tr);
      });
    });
}

// -------------------------------------------------------------
// 4. Novelty 2: DRHP vs RHP Diff Tracker
// -------------------------------------------------------------
function loadDrhpDiffs() {
  fetch("/api/drhp-diffs")
    .then(r => r.json())
    .then(diffs => {
      const container = document.getElementById("drhp-diff-container");
      container.innerHTML = "";

      diffs.forEach(d => {
        const card = document.createElement("div");
        card.className = "diff-card";
        const pctBadge = d.percentage_change !== 0 
          ? `<span class="badge ${d.percentage_change > 0 ? 'badge-yellow' : 'badge-green'}">${d.percentage_change > 0 ? '+' : ''}${d.percentage_change}%</span>`
          : "";

        card.innerHTML = `
          <div class="diff-title">
            <span><strong>${d.symbol}</strong> - ${d.parameter_name}</span>
            ${pctBadge}
          </div>
          <div class="diff-compare-box">
            <div class="diff-side">
              <label>Draft Prospectus (DRHP)</label>
              <div>${d.drhp_val}</div>
            </div>
            <div class="diff-side">
              <label>Final Prospectus (RHP)</label>
              <div style="color: var(--accent-blue); font-weight: 600;">${d.rhp_val}</div>
            </div>
          </div>
          <div style="font-size: 0.82rem; color: #cbd5e1;">
            <i class="fa-solid fa-circle-info" style="color: var(--accent-purple);"></i>
            <strong>Regulatory Reason:</strong> ${d.change_nature}
          </div>
        `;
        container.appendChild(card);
      });
    });
}

// -------------------------------------------------------------
// 5. Timeline & Lock-in Expiry
// -------------------------------------------------------------
function loadTimeline() {
  fetch("/api/timeline")
    .then(r => r.json())
    .then(rows => {
      const container = document.getElementById("timeline-list");
      container.innerHTML = "";

      rows.forEach(item => {
        const card = document.createElement("div");
        card.className = "timeline-card";
        card.innerHTML = `
          <div class="timeline-header">
            <div>
              <h3>${item.company_name} (${item.symbol})</h3>
            </div>
            <span class="badge badge-blue">Listing: ${item.listing_date}</span>
          </div>
          <div class="milestones-track">
            <div class="milestone-item">
              <div class="milestone-label">Bidding Opens</div>
              <div class="milestone-date">${item.open_date}</div>
            </div>
            <div class="milestone-item">
              <div class="milestone-label">Bidding Closes</div>
              <div class="milestone-date">${item.close_date}</div>
            </div>
            <div class="milestone-item">
              <div class="milestone-label">Basis Allotment</div>
              <div class="milestone-date">${item.allotment_date}</div>
            </div>
            <div class="milestone-item">
              <div class="milestone-label">Exchange Listing</div>
              <div class="milestone-date" style="color: var(--accent-green);">${item.listing_date}</div>
            </div>
            <div class="milestone-item milestone-lockin">
              <div class="milestone-label">30-Day Anchor Expiry</div>
              <div class="milestone-date">${item.anchor_lockin_30d || 'N/A'}</div>
            </div>
            <div class="milestone-item milestone-lockin">
              <div class="milestone-label">90-Day Anchor Expiry</div>
              <div class="milestone-date">${item.anchor_lockin_90d || 'N/A'}</div>
            </div>
            <div class="milestone-item milestone-lockin">
              <div class="milestone-label">Pre-IPO 180d Expiry</div>
              <div class="milestone-date">${item.pre_ipo_lockin_180d || 'N/A'}</div>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    });
}

// -------------------------------------------------------------
// 6. Multi-Modal Repository (MongoDB Document Store)
// -------------------------------------------------------------
function loadRepository() {
  fetch("/api/filings")
    .then(r => r.json())
    .then(filings => {
      const container = document.getElementById("repository-container");
      container.innerHTML = "";

      filings.forEach(f => {
        const card = document.createElement("div");
        card.className = "repo-card";
        card.innerHTML = `
          <div class="repo-header">
            <h4><i class="fa-solid fa-landmark"></i> ${f.company_name} (${f.symbol})</h4>
            <p class="text-muted" style="font-size: 0.8rem;">SEBI Approved: ${f.sebi_approval_date} | Counsel: ${f.lead_counsel}</p>
          </div>
          <div class="repo-links">
            <div class="repo-link-item">
              <span><i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> DRHP Prospectus (PDF)</span>
              <a href="${f.drhp_pdf_url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a>
            </div>
            <div class="repo-link-item">
              <span><i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> Final RHP Prospectus (PDF)</span>
              <a href="${f.rhp_pdf_url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a>
            </div>
            <div class="repo-link-item">
              <span><i class="fa-solid fa-video" style="color: var(--accent-purple);"></i> Official DRHP Video (MP4)</span>
              <a href="${f.drhp_av_mp4_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch AV</a>
            </div>
            <div class="repo-link-item">
              <span><i class="fa-solid fa-video" style="color: var(--accent-purple);"></i> Official RHP Video (MP4)</span>
              <a href="${f.rhp_av_mp4_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch AV</a>
            </div>
            <div class="repo-link-item">
              <span><i class="fa-solid fa-building-columns" style="color: var(--accent-blue);"></i> SEBI Public Portal</span>
              <a href="${f.sebi_portal_url}" target="_blank"><i class="fa-solid fa-external-link"></i> Verify SEBI</a>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    });
}

// -------------------------------------------------------------
// 7. Interactive Reports Demo
// -------------------------------------------------------------
function loadReport(repId) {
  fetch(`/api/reports/${repId}`)
    .then(r => r.json())
    .then(rep => {
      document.getElementById("report-title").textContent = rep.title;
      document.getElementById("report-desc").textContent = rep.description;
      
      const queryBox = document.getElementById("report-query-code");
      const badge = document.getElementById("report-engine-badge");
      if (rep.sql_query) {
        queryBox.textContent = rep.sql_query;
        badge.textContent = "SQL Relational Aggregation";
      } else {
        queryBox.textContent = rep.mongo_pipeline;
        badge.textContent = "MongoDB Aggregation Pipeline";
      }

      const thead = document.getElementById("report-thead");
      const tbody = document.getElementById("report-tbody");
      thead.innerHTML = "";
      tbody.innerHTML = "";

      if (!rep.data || rep.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">No records returned.</td></tr>`;
        return;
      }

      // Generate columns dynamically
      const keys = Object.keys(rep.data[0]);
      const headerTr = document.createElement("tr");
      keys.forEach(k => {
        const th = document.createElement("th");
        th.textContent = k.replace(/_/g, " ").toUpperCase();
        headerTr.appendChild(th);
      });
      thead.appendChild(headerTr);

      rep.data.forEach(row => {
        const tr = document.createElement("tr");
        keys.forEach(k => {
          const td = document.createElement("td");
          const val = row[k];
          if (typeof val === "number") {
            td.textContent = val.toLocaleString();
            td.style.fontFamily = "var(--font-mono)";
          } else {
            td.textContent = val !== null && val !== undefined ? val : "N/A";
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    });
}

// -------------------------------------------------------------
// 8. Single IPO Full Drill-Down Modal
// -------------------------------------------------------------
function openIpoModal(symbol) {
  const modal = document.getElementById("ipo-modal");
  modal.classList.add("open");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalBody = document.getElementById("modal-body");

  modalTitle.textContent = `Loading ${symbol}...`;
  modalSubtitle.textContent = "";
  modalBody.innerHTML = `<p class="loading">Loading offering child records and regulatory filings...</p>`;

  fetch(`/api/ipo/${symbol}`)
    .then(r => r.json())
    .then(data => {
      const p = data.primary;
      modalTitle.textContent = `${p.company_name} (${p.symbol})`;
      modalSubtitle.textContent = `ISIN: ${p.isin} | BSE Code: ${p.bse_code} | Lead Manager: ${p.brlm_lead_manager}`;

      // Build Reservations Table
      let resRows = "";
      (data.reservations || []).forEach(r => {
        resRows += `
          <tr>
            <td><strong>${r.category_name}</strong></td>
            <td>${r.quota_percent}%</td>
            <td>${r.shares_reserved.toLocaleString()}</td>
            <td>₹${r.min_investment_inr.toLocaleString()}</td>
          </tr>
        `;
      });

      // Build Anchors Table
      let anchorRows = "";
      (data.anchors || []).forEach(a => {
        anchorRows += `
          <tr>
            <td>${a.investor_name}</td>
            <td><span class="badge badge-purple">${a.investor_category}</span></td>
            <td>${a.shares_allocated.toLocaleString()}</td>
            <td>₹${a.amount_cr} Cr</td>
            <td>${a.lockin_period_days} Days (${a.lockin_expiry_date})</td>
          </tr>
        `;
      });

      // Build Subscription Bids Table
      let bidRows = "";
      (data.bids || []).forEach(b => {
        bidRows += `
          <tr>
            <td>Day ${b.day_number} (${b.bidding_date})</td>
            <td>${b.qib_subscription_times}x</td>
            <td>${b.nii_subscription_times}x</td>
            <td>${b.retail_subscription_times}x</td>
            <td><strong>${b.total_subscription_times}x</strong></td>
          </tr>
        `;
      });

      // Peer Multiples (from MongoDB)
      let peerRows = "";
      const peers = (data.nosql_data && data.nosql_data.peer_multiples) ? data.nosql_data.peer_multiples.peers : [];
      peers.forEach(peer => {
        peerRows += `
          <tr>
            <td><strong>${peer.name}</strong></td>
            <td>${peer.pe_ratio}x</td>
            <td>${peer.roe_pct}%</td>
            <td>${peer.pat_margin_pct}%</td>
            <td>₹${peer.revenue_cr} Cr</td>
          </tr>
        `;
      });

      modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div class="milestone-item">
            <div class="milestone-label">Price Band</div>
            <div class="milestone-date">₹${p.price_band_min} - ₹${p.price_band_max}</div>
          </div>
          <div class="milestone-item">
            <div class="milestone-label">Lot Size</div>
            <div class="milestone-date">${p.lot_size} Shares</div>
          </div>
          <div class="milestone-item">
            <div class="milestone-label">Total Issue Value</div>
            <div class="milestone-date">₹${p.total_issue_val_cr.toLocaleString()} Cr</div>
          </div>
          <div class="milestone-item">
            <div class="milestone-label">Fresh / OFS Split</div>
            <div class="milestone-date">₹${p.fresh_issue_cr} Cr / ₹${p.ofs_val_cr} Cr</div>
          </div>
        </div>

        <h4 class="modal-subtable-title"><i class="fa-solid fa-users"></i> Investor Category Reservations</h4>
        <table class="data-table">
          <thead><tr><th>Category</th><th>Quota</th><th>Shares Reserved</th><th>Min Investment</th></tr></thead>
          <tbody>${resRows || '<tr><td colspan="4">No reservations data</td></tr>'}</tbody>
        </table>

        <h4 class="modal-subtable-title"><i class="fa-solid fa-anchor"></i> Anchor Institutional Allocations</h4>
        <table class="data-table">
          <thead><tr><th>Investor Name</th><th>Category</th><th>Shares</th><th>Amount</th><th>Lock-In</th></tr></thead>
          <tbody>${anchorRows || '<tr><td colspan="5">No anchor allocations</td></tr>'}</tbody>
        </table>

        <h4 class="modal-subtable-title"><i class="fa-solid fa-chart-line"></i> Day-by-Day Bidding Multiples</h4>
        <table class="data-table">
          <thead><tr><th>Bidding Phase</th><th>QIB</th><th>NII</th><th>Retail</th><th>Total Subscription</th></tr></thead>
          <tbody>${bidRows || '<tr><td colspan="5">No bidding data</td></tr>'}</tbody>
        </table>

        ${peerRows ? `
          <h4 class="modal-subtable-title"><i class="fa-solid fa-code-compare"></i> Industry Peer Valuation Multiples</h4>
          <table class="data-table">
            <thead><tr><th>Company</th><th>P/E</th><th>ROE</th><th>PAT Margin</th><th>Revenue</th></tr></thead>
            <tbody>${peerRows}</tbody>
          </table>
        ` : ''}
      `;
    });
}
