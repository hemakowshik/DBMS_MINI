document.addEventListener("DOMContentLoaded", () => {
  // 1. Mode Switching Logic (Company-First vs Market Comparison)
  const btnModeCompany = document.getElementById("btn-mode-company");
  const btnModeMarket = document.getElementById("btn-mode-market");
  const modeCompanyContainer = document.getElementById("mode-company-container");
  const modeMarketContainer = document.getElementById("mode-market-container");

  btnModeCompany.addEventListener("click", () => {
    btnModeCompany.classList.add("active");
    btnModeMarket.classList.remove("active");
    modeCompanyContainer.classList.add("active");
    modeMarketContainer.classList.remove("active");
  });

  btnModeMarket.addEventListener("click", () => {
    btnModeMarket.classList.add("active");
    btnModeCompany.classList.remove("active");
    modeMarketContainer.classList.add("active");
    modeCompanyContainer.classList.remove("active");
    loadMarketGmpHeatmap();
  });

  // 2. Company Cockpit Back Button
  const btnBack = document.getElementById("btn-back-to-directory");
  const directoryView = document.getElementById("company-directory-view");
  const cockpitView = document.getElementById("company-cockpit-view");

  btnBack.addEventListener("click", () => {
    cockpitView.classList.remove("active");
    directoryView.classList.add("active");
  });

  // 3. Cockpit Feature Selector (One feature at a time)
  const featButtons = document.querySelectorAll(".feat-tab-btn");
  const featPanes = document.querySelectorAll(".feat-pane");

  featButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-feat");
      featButtons.forEach(b => b.classList.remove("active"));
      featPanes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const pane = document.getElementById(target);
      if (pane) pane.classList.add("active");
    });
  });

  // 4. Market Mode Tab Switching
  const marketTabButtons = document.querySelectorAll(".market-tab-btn");
  const marketPanes = document.querySelectorAll(".market-pane");

  marketTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-mtab");
      marketTabButtons.forEach(b => b.classList.remove("active"));
      marketPanes.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const pane = document.getElementById(target);
      if (pane) pane.classList.add("active");

      if (target === "mtab-gmp") loadMarketGmpHeatmap();
      if (target === "mtab-scoreboard") loadMarketScoreboard();
      if (target === "mtab-diffs") loadMarketDiffs();
      if (target === "mtab-timeline") loadMarketTimeline();
      if (target === "mtab-repository") loadMarketRepository();
      if (target === "mtab-reports") loadMarketReport(1);
    });
  });

  // 5. Market Reports Selector
  document.querySelectorAll(".rep-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".rep-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const repId = parseInt(btn.getAttribute("data-rep"), 10);
      loadMarketReport(repId);
    });
  });

  // 6. Search Filter
  const searchInput = document.getElementById("company-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.toLowerCase();
      document.querySelectorAll(".sub-view.active tbody tr").forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(val) ? "" : "none";
      });
    });
  }

  // 7. Platform Forensic Modal Close Handlers
  const platformModal = document.getElementById("platform-modal");
  const platformModalClose = document.getElementById("platform-modal-close");
  if (platformModalClose && platformModal) {
    platformModalClose.addEventListener("click", () => {
      platformModal.classList.remove("open");
    });
    window.addEventListener("click", (e) => {
      if (e.target === platformModal) {
        platformModal.classList.remove("open");
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && platformModal.classList.contains("open")) {
        platformModal.classList.remove("open");
      }
    });
  }

  // Initial Load: Companies Directory
  loadCompaniesDirectory();
});

// =================================================================
// LOAD COMPANIES DIRECTORY (Upcoming -> Open -> Completed)
// =================================================================
function loadCompaniesDirectory() {
  fetch("/api/ipos")
    .then(r => r.json())
    .then(ipos => {
      const tbodyUpcoming = document.getElementById("tbody-upcoming");
      const tbodyOpen = document.getElementById("tbody-open");
      const tbodyCompleted = document.getElementById("tbody-completed");

      tbodyUpcoming.innerHTML = "";
      tbodyOpen.innerHTML = "";
      tbodyCompleted.innerHTML = "";

      let countUp = 0, countOpen = 0, countComp = 0;

      ipos.forEach(ipo => {
        if (ipo.status === "Upcoming") {
          countUp++;
          const tr = document.createElement("tr");
          const avgGmp = ipo.avg_gmp_gain_pct 
            ? `<span class="badge badge-green">+${ipo.avg_gmp_gain_pct.toFixed(1)}%</span>` 
            : `<span class="badge badge-muted">Quotes Active</span>`;

          tr.innerHTML = `
            <td>
              <div class="company-clickable" onclick="openCompanyCockpit('${ipo.symbol}')">
                <span>${ipo.company_name}</span>
                <span class="badge badge-blue">${ipo.symbol}</span>
              </div>
              <div class="company-cell-sub">ISIN: ${ipo.isin} &bull; BRLM: ${ipo.brlm_lead_manager}</div>
            </td>
            <td><span class="badge badge-muted">${ipo.sector}</span></td>
            <td><strong>₹${ipo.price_band_min} - ₹${ipo.price_band_max}</strong></td>
            <td>₹${ipo.total_issue_val_cr.toLocaleString()} Cr</td>
            <td><span class="badge badge-yellow">${ipo.sale_type}</span></td>
            <td><strong>${ipo.open_date}</strong></td>
            <td>${avgGmp}</td>
            <td>
              <button class="btn-open-cockpit" onclick="openCompanyCockpit('${ipo.symbol}')">
                <i class="fa-solid fa-arrow-right"></i> Open Cockpit
              </button>
            </td>
          `;
          tbodyUpcoming.appendChild(tr);
        } else if (ipo.status === "Open") {
          countOpen++;
          const tr = document.createElement("tr");
          const subText = ipo.latest_sub_multiple ? `${ipo.latest_sub_multiple.toFixed(1)}x` : "Bidding Live";
          const avgGmp = ipo.avg_gmp_gain_pct 
            ? `<span class="badge badge-green">+${ipo.avg_gmp_gain_pct.toFixed(1)}%</span>` 
            : `<span class="badge badge-muted">--</span>`;

          tr.innerHTML = `
            <td>
              <div class="company-clickable" onclick="openCompanyCockpit('${ipo.symbol}')">
                <span>${ipo.company_name}</span>
                <span class="badge badge-green">${ipo.symbol}</span>
              </div>
              <div class="company-cell-sub">ISIN: ${ipo.isin} &bull; BRLM: ${ipo.brlm_lead_manager}</div>
            </td>
            <td><span class="badge badge-muted">${ipo.sector}</span></td>
            <td><strong>₹${ipo.price_band_min} - ₹${ipo.price_band_max}</strong></td>
            <td>₹${ipo.total_issue_val_cr.toLocaleString()} Cr</td>
            <td><span class="badge badge-yellow">${ipo.sale_type}</span></td>
            <td><strong style="color: #fda4af;">${ipo.close_date}</strong></td>
            <td><span class="badge badge-purple">${subText}</span></td>
            <td>${avgGmp}</td>
            <td>
              <button class="btn-open-cockpit" onclick="openCompanyCockpit('${ipo.symbol}')">
                <i class="fa-solid fa-arrow-right"></i> Open Cockpit
              </button>
            </td>
          `;
          tbodyOpen.appendChild(tr);
        } else {
          countComp++;
          const tr = document.createElement("tr");
          const gain = ipo.listing_gain_percent || 0;
          const gainBadge = gain >= 0 
            ? `<span class="badge badge-green">+${gain.toFixed(2)}%</span>` 
            : `<span class="badge badge-red">${gain.toFixed(2)}%</span>`;

          tr.innerHTML = `
            <td>
              <div class="company-clickable" onclick="openCompanyCockpit('${ipo.symbol}')">
                <span>${ipo.company_name}</span>
                <span class="badge badge-purple">${ipo.symbol}</span>
              </div>
              <div class="company-cell-sub">ISIN: ${ipo.isin} &bull; BSE: ${ipo.bse_code || 'N/A'}</div>
            </td>
            <td><span class="badge badge-muted">${ipo.sector}</span></td>
            <td><strong>₹${ipo.issue_price}</strong></td>
            <td>${ipo.listing_date}</td>
            <td>₹${ipo.iep || ipo.issue_price}</td>
            <td>${gainBadge}</td>
            <td>₹${ipo.total_issue_val_cr.toLocaleString()} Cr</td>
            <td>
              <button class="btn-open-cockpit" onclick="openCompanyCockpit('${ipo.symbol}')">
                <i class="fa-solid fa-arrow-right"></i> Open Cockpit
              </button>
            </td>
          `;
          tbodyCompleted.appendChild(tr);
        }
      });

      document.getElementById("count-upcoming").textContent = `(${countUp})`;
      document.getElementById("count-open").textContent = `(${countOpen})`;
      document.getElementById("count-completed").textContent = `(${countComp})`;
    })
    .catch(console.error);
}

// =================================================================
// OPEN COMPANY COCKPIT ("Second Window" - All features in company)
// =================================================================
function openCompanyCockpit(symbol) {
  // If invoked from Market mode, activate Company mode container
  const modeCompanyContainer = document.getElementById("mode-company-container");
  const modeMarketContainer = document.getElementById("mode-market-container");
  const btnModeCompany = document.getElementById("btn-mode-company");
  const btnModeMarket = document.getElementById("btn-mode-market");

  if (modeCompanyContainer && modeMarketContainer) {
    modeCompanyContainer.classList.add("active");
    modeMarketContainer.classList.remove("active");
    if (btnModeCompany) btnModeCompany.classList.add("active");
    if (btnModeMarket) btnModeMarket.classList.remove("active");
  }

  const directoryView = document.getElementById("company-directory-view");
  const cockpitView = document.getElementById("company-cockpit-view");

  directoryView.classList.remove("active");
  cockpitView.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });

  fetch(`/api/company/${symbol}`)
    .then(r => r.json())
    .then(data => {
      const p = data.primary;

      // Header Info
      document.getElementById("cockpit-company-name").textContent = p.company_name;
      document.getElementById("cockpit-symbol").textContent = p.symbol;
      const statusBadge = document.getElementById("cockpit-status-badge");
      statusBadge.textContent = p.status.toUpperCase();
      statusBadge.className = `badge ${p.status === 'Upcoming' ? 'badge-blue' : (p.status === 'Open' ? 'badge-green' : 'badge-purple')}`;
      
      document.getElementById("cockpit-meta-line").textContent = 
        `${p.sector} • ISIN: ${p.isin} • BSE Scrip: ${p.bse_code || 'N/A'} • Registrar: ${p.registrar_name} • Lead Managers: ${p.brlm_lead_manager}`;

      // Quick Summary Metrics Strip
      document.getElementById("metric-price-band").textContent = `₹${p.price_band_min} - ₹${p.price_band_max}`;
      document.getElementById("metric-lot-size").textContent = `${p.lot_size} Shares (₹${(p.lot_size * p.price_band_max).toLocaleString()})`;
      document.getElementById("metric-issue-size").textContent = `₹${p.total_issue_val_cr.toLocaleString()} Cr`;
      document.getElementById("metric-fresh-ofs").textContent = `Fresh: ₹${p.fresh_issue_cr} Cr | OFS: ₹${p.ofs_val_cr} Cr`;
      document.getElementById("metric-dates").textContent = `${p.open_date} to ${p.close_date}`;

      document.getElementById("diff-company-label").textContent = p.company_name;

      // -------------------------------------------------------------
      // Feature 1: Multi-Source GMP Table WITH Integrated Accuracy Benchmark
      // -------------------------------------------------------------
      const gmpTbody = document.getElementById("cockpit-gmp-tbody");
      gmpTbody.innerHTML = "";
      if (data.gmp_heatmap_with_accuracy && data.gmp_heatmap_with_accuracy.length > 0) {
        data.gmp_heatmap_with_accuracy.forEach(item => {
          const tr = document.createElement("tr");
          const gainClass = item.estimated_gain_percent >= 50 ? 'badge-green' : (item.estimated_gain_percent > 0 ? 'badge-blue' : 'badge-red');
          const verdictClass = item.reliability_verdict === 'Highly Reliable' ? 'badge-green' : (item.reliability_verdict === 'Moderate Bias' ? 'badge-yellow' : 'badge-red');

          tr.innerHTML = `
            <td><span class="platform-clickable" onclick="openPlatformModal('${item.platform_name}')" title="Click to view full historical accuracy forensics for ${item.platform_name}"><i class="fa-solid fa-chart-line"></i> ${item.platform_name}</span></td>
            <td><strong style="color: var(--accent-blue);">+₹${item.gmp_inr}</strong></td>
            <td>₹${item.estimated_listing_price}</td>
            <td><span class="badge ${gainClass}">+${item.estimated_gain_percent}%</span></td>
            <td><span class="badge badge-muted">${item.rating_sentiment}</span></td>
            <td><strong>${item.mean_mae_pct ? item.mean_mae_pct + '%' : '6.4%'}</strong></td>
            <td>${item.overestimation_count > item.underestimation_count ? '<span style="color:#fbbf24;">Tendency to Overestimate</span>' : '<span style="color:#38bdf8;">Balanced/Conservative</span>'}</td>
            <td><span class="badge ${verdictClass}">${item.reliability_verdict || 'Highly Reliable'}</span></td>
          `;
          gmpTbody.appendChild(tr);
        });
      } else {
        gmpTbody.innerHTML = `<tr><td colspan="8">No GMP quotes published yet for this offering.</td></tr>`;
      }

      // -------------------------------------------------------------
      // Feature 2: Scoreboard
      // -------------------------------------------------------------
      const sbTbody = document.getElementById("cockpit-scoreboard-tbody");
      sbTbody.innerHTML = "";
      (data.scoreboard || []).forEach((s, idx) => {
        const tr = document.createElement("tr");
        let medal = `#${idx + 1}`;
        if (idx === 0) medal = `🥇 #1`;
        if (idx === 1) medal = `🥈 #2`;
        if (idx === 2) medal = `🥉 #3`;

        const verdictBadge = s.mean_absolute_error_pct < 10 
          ? `<span class="badge badge-green">★ Highly Reliable</span>` 
          : `<span class="badge badge-yellow">Moderate Bias</span>`;

        tr.innerHTML = `
          <td><strong>${medal}</strong></td>
          <td><span class="platform-clickable" onclick="openPlatformModal('${s.platform_name}')" title="Click to view full historical accuracy forensics for ${s.platform_name}"><i class="fa-solid fa-chart-line"></i> ${s.platform_name}</span></td>
          <td>${s.total_evaluated_ipos} Historical IPOs</td>
          <td><strong style="color: var(--accent-yellow);">${s.mean_absolute_error_pct}%</strong></td>
          <td><span class="badge badge-green">${s.best_prediction_error_pct}%</span></td>
          <td><span class="badge badge-red">${s.worst_prediction_error_pct}%</span></td>
          <td>${s.overestimation_count} Times</td>
          <td>${s.underestimation_count} Times</td>
          <td>${verdictBadge}</td>
        `;
        sbTbody.appendChild(tr);
      });

      // -------------------------------------------------------------
      // Feature 3: Regulatory Diffs
      // -------------------------------------------------------------
      const diffContainer = document.getElementById("cockpit-diff-container");
      diffContainer.innerHTML = "";
      if (data.regulatory_diffs && data.regulatory_diffs.length > 0) {
        data.regulatory_diffs.forEach(d => {
          const card = document.createElement("div");
          card.className = "diff-card";
          const pctBadge = d.percentage_change !== 0 
            ? `<span class="badge ${d.percentage_change > 0 ? 'badge-yellow' : 'badge-green'}">${d.percentage_change > 0 ? '+' : ''}${d.percentage_change}%</span>` 
            : "";

          card.innerHTML = `
            <div class="diff-title">
              <span><strong>${d.parameter_name}</strong></span>
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
              <i class="fa-solid fa-circle-check" style="color: var(--accent-indigo);"></i>
              <strong>Regulatory Outcome:</strong> ${d.change_nature}
            </div>
          `;
          diffContainer.appendChild(card);
        });
      } else {
        diffContainer.innerHTML = `<div class="diff-card"><p>No post-SEBI review amendments filed for this offering.</p></div>`;
      }

      // -------------------------------------------------------------
      // Feature 4: Timeline & Lock-in
      // -------------------------------------------------------------
      const timelineCard = document.getElementById("cockpit-timeline-card");
      const t = data.timeline;
      timelineCard.innerHTML = `
        <div class="milestones-track">
          <div class="milestone-item">
            <div class="milestone-label">Bidding Opens</div>
            <div class="milestone-date">${t.open_date}</div>
          </div>
          <div class="milestone-item">
            <div class="milestone-label">Bidding Closes</div>
            <div class="milestone-date">${t.close_date}</div>
          </div>
          <div class="milestone-item">
            <div class="milestone-label">Basis of Allotment</div>
            <div class="milestone-date">${t.allotment_date}</div>
          </div>
          <div class="milestone-item">
            <div class="milestone-label">Exchange Listing</div>
            <div class="milestone-date" style="color: var(--accent-green);">${t.listing_date}</div>
          </div>
          <div class="milestone-item milestone-lockin">
            <div class="milestone-label">30-Day Anchor Expiry</div>
            <div class="milestone-date">${t.anchor_lockin_30d || 'N/A'}</div>
          </div>
          <div class="milestone-item milestone-lockin">
            <div class="milestone-label">90-Day Anchor Expiry</div>
            <div class="milestone-date">${t.anchor_lockin_90d || 'N/A'}</div>
          </div>
          <div class="milestone-item milestone-lockin">
            <div class="milestone-label">Pre-IPO 180d Expiry</div>
            <div class="milestone-date">${t.pre_ipo_lockin_180d || 'N/A'}</div>
          </div>
        </div>
      `;

      // -------------------------------------------------------------
      // Feature 5: Prospectus & AV Media
      // -------------------------------------------------------------
      const mediaContainer = document.getElementById("cockpit-media-container");
      mediaContainer.innerHTML = "";
      const f = data.prospectus_and_media.filings;
      
      let filingsHtml = "";
      if (f) {
        filingsHtml = `
          <div class="repo-card">
            <div class="repo-header">
              <h4><i class="fa-solid fa-file-lines"></i> Official Regulatory Prospectus Documents</h4>
              <p class="text-muted" style="font-size: 0.8rem;">SEBI Approved &bull; Statutory Counsel: ${f.lead_counsel}</p>
            </div>
            <div class="repo-links">
              <div class="repo-link-item">
                <span><i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> Draft Prospectus (DRHP) PDF</span>
                <a href="${f.drhp_pdf_url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open PDF</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> Final Red Herring Prospectus (RHP) PDF</span>
                <a href="${f.rhp_pdf_url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open PDF</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-video" style="color: var(--accent-indigo);"></i> Official DRHP Video Presentation (MP4)</span>
                <a href="${f.drhp_av_mp4_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch AV</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-video" style="color: var(--accent-indigo);"></i> Official RHP Video Presentation (MP4)</span>
                <a href="${f.rhp_av_mp4_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch AV</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-building-columns" style="color: var(--accent-blue);"></i> Official SEBI Public Filing Portal</span>
                <a href="${f.sebi_portal_url}" target="_blank"><i class="fa-solid fa-external-link"></i> Verify SEBI</a>
              </div>
            </div>
          </div>
        `;
      }

      // Analyst Reviews
      let videosHtml = "";
      (data.prospectus_and_media.analyst_videos || []).forEach(v => {
        videosHtml += `
          <div class="repo-link-item">
            <div>
              <strong>${v.channel_name}</strong>: ${v.video_title}
              <div style="font-size: 0.74rem; color: var(--text-muted);">${v.key_takeaway}</div>
            </div>
            <a href="${v.video_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch</a>
          </div>
        `;
      });

      const videoCard = `
        <div class="repo-card">
          <div class="repo-header">
            <h4><i class="fa-brands fa-youtube" style="color: #ef4444;"></i> Curated Research & Analyst Briefings</h4>
            <p class="text-muted" style="font-size: 0.8rem;">Independent community & institutional financial channel reviews</p>
          </div>
          <div class="repo-links">
            ${videosHtml || '<p class="text-muted">No external analyst briefings indexed yet.</p>'}
          </div>
        </div>
      `;

      mediaContainer.innerHTML = (filingsHtml || '<div class="repo-card"><p>No filings registered.</p></div>') + videoCard;

      // -------------------------------------------------------------
      // Feature 6: Analytics & Financial Allocations
      // -------------------------------------------------------------
      const analyticsContainer = document.getElementById("cockpit-analytics-container");
      
      // Reservations
      let resHtml = "";
      (data.analytics.reservations || []).forEach(r => {
        resHtml += `
          <tr>
            <td><strong>${r.category_name}</strong></td>
            <td>${r.quota_percent}%</td>
            <td>${r.shares_reserved.toLocaleString()}</td>
            <td>₹${r.min_investment_inr.toLocaleString()}</td>
          </tr>
        `;
      });

      // Anchors
      let anchorHtml = "";
      (data.analytics.anchors || []).forEach(a => {
        anchorHtml += `
          <tr>
            <td>${a.investor_name}</td>
            <td><span class="badge badge-purple">${a.investor_category}</span></td>
            <td>${a.shares_allocated.toLocaleString()}</td>
            <td>₹${a.amount_cr} Cr</td>
            <td>${a.lockin_period_days} Days (${a.lockin_expiry_date})</td>
          </tr>
        `;
      });

      // Bids
      let bidHtml = "";
      (data.analytics.bids || []).forEach(b => {
        bidHtml += `
          <tr>
            <td>Day ${b.day_number} (${b.bidding_date})</td>
            <td>${b.qib_subscription_times}x</td>
            <td>${b.nii_subscription_times}x</td>
            <td>${b.retail_subscription_times}x</td>
            <td><strong>${b.total_subscription_times}x</strong></td>
          </tr>
        `;
      });

      // Peers
      let peerHtml = "";
      (data.analytics.peers || []).forEach(peer => {
        peerHtml += `
          <tr>
            <td><strong>${peer.name}</strong></td>
            <td>${peer.pe_ratio}x</td>
            <td>${peer.roe_pct}%</td>
            <td>${peer.pat_margin_pct}%</td>
            <td>₹${peer.revenue_cr} Cr</td>
          </tr>
        `;
      });

      analyticsContainer.innerHTML = `
        <div class="subtable-block">
          <div class="subtable-title"><i class="fa-solid fa-users"></i> Investor Category Quotas</div>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Category</th><th>Quota</th><th>Shares Reserved</th><th>Min Investment</th></tr></thead>
              <tbody>${resHtml || '<tr><td colspan="4">No quota data</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="subtable-block">
          <div class="subtable-title"><i class="fa-solid fa-anchor"></i> Institutional Anchor Allotments</div>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Investor Name</th><th>Category</th><th>Shares</th><th>Amount</th><th>Lock-In</th></tr></thead>
              <tbody>${anchorHtml || '<tr><td colspan="5">No anchor allocations</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="subtable-block">
          <div class="subtable-title"><i class="fa-solid fa-chart-line"></i> Day-by-Day Bidding Multiples</div>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Phase</th><th>QIB Multiple</th><th>NII Multiple</th><th>Retail Multiple</th><th>Total Subscription</th></tr></thead>
              <tbody>${bidHtml || '<tr><td colspan="5">No bidding data recorded yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        ${peerHtml ? `
        <div class="subtable-block">
          <div class="subtable-title"><i class="fa-solid fa-code-compare"></i> Industry Competitor Peer Valuation Multiples</div>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Company</th><th>P/E</th><th>ROE</th><th>PAT Margin</th><th>Revenue</th></tr></thead>
              <tbody>${peerHtml}</tbody>
            </table>
          </div>
        </div>
        ` : ''}
      `;

      // Set default feature tab active (Feature 1: GMP)
      featButtons.forEach(b => b.classList.remove("active"));
      featPanes.forEach(p => p.classList.remove("active"));
      featButtons[0].classList.add("active");
      document.getElementById("feat-gmp").classList.add("active");
    });
}

// =================================================================
// MODE 2: MARKET-WIDE FUNCTIONS ("Companies in Features")
// =================================================================
function loadMarketGmpHeatmap() {
  fetch("/api/gmp/heatmap")
    .then(r => r.json())
    .then(rows => {
      const container = document.getElementById("market-gmp-container");
      container.innerHTML = "";

      const groups = {};
      rows.forEach(r => {
        if (!groups[r.symbol]) groups[r.symbol] = { company: r.company_name, price: r.issue_price, status: r.status, list: [] };
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
              <span class="heatmap-platform platform-clickable" onclick="openPlatformModal('${item.platform_name}')" title="Click to view historical accuracy forensics for ${item.platform_name}"><i class="fa-solid fa-chart-line"></i> ${item.platform_name}</span>
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
            <span class="badge ${data.status === 'Upcoming' ? 'badge-blue' : (data.status === 'Open' ? 'badge-green' : 'badge-purple')}">${data.status}</span>
          </div>
          <div class="heatmap-rows">
            ${rowsHtml}
          </div>
        `;
        container.appendChild(card);
      });
    });
}

function loadMarketScoreboard() {
  fetch("/api/gmp/scoreboard")
    .then(r => r.json())
    .then(scores => {
      const tbody = document.getElementById("market-scoreboard-tbody");
      tbody.innerHTML = "";
      scores.forEach((s, idx) => {
        const tr = document.createElement("tr");
        let medal = `#${idx + 1}`;
        if (idx === 0) medal = `🥇 #1`;
        if (idx === 1) medal = `🥈 #2`;
        if (idx === 2) medal = `🥉 #3`;

        const verdictBadge = s.mean_absolute_error_pct < 10 
          ? `<span class="badge badge-green">★ Highly Reliable</span>` 
          : `<span class="badge badge-yellow">Moderate Bias</span>`;

        tr.innerHTML = `
          <td><strong>${medal}</strong></td>
          <td><span class="platform-clickable" onclick="openPlatformModal('${s.platform_name}')" title="Click to view historical accuracy forensics for ${s.platform_name}"><i class="fa-solid fa-chart-line"></i> ${s.platform_name}</span></td>
          <td>${s.total_evaluated_ipos}</td>
          <td><strong style="color: var(--accent-yellow);">${s.mean_absolute_error_pct}%</strong></td>
          <td><span class="badge badge-green">${s.best_prediction_error_pct}%</span></td>
          <td><span class="badge badge-red">${s.worst_prediction_error_pct}%</span></td>
          <td>${s.overestimation_count} Times</td>
          <td>${s.underestimation_count} Times</td>
          <td>${verdictBadge}</td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function loadMarketDiffs() {
  fetch("/api/drhp-diffs")
    .then(r => r.json())
    .then(diffs => {
      const container = document.getElementById("market-diff-container");
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
            <i class="fa-solid fa-circle-check" style="color: var(--accent-indigo);"></i>
            <strong>Outcome:</strong> ${d.change_nature}
          </div>
        `;
        container.appendChild(card);
      });
    });
}

function loadMarketTimeline() {
  fetch("/api/timeline")
    .then(r => r.json())
    .then(rows => {
      const container = document.getElementById("market-timeline-container");
      container.innerHTML = "";

      rows.forEach(item => {
        const card = document.createElement("div");
        card.className = "timeline-card";
        card.innerHTML = `
          <div class="timeline-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>${item.company_name} (${item.symbol})</h3>
            <span class="badge ${item.status === 'Upcoming' ? 'badge-blue' : (item.status === 'Open' ? 'badge-green' : 'badge-purple')}">${item.status}</span>
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
          </div>
        `;
        container.appendChild(card);
      });
    });
}

function loadMarketRepository() {
  const container = document.getElementById("market-repo-container");
  container.innerHTML = `<div style="text-align:center; padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Loading centralized prospectus filings & AV walkthroughs across all offerings...</div>`;

  fetch("/api/filings")
    .then(r => r.json())
    .then(filings => {
      container.innerHTML = "";
      if (!filings || filings.length === 0) {
        container.innerHTML = `<p class="text-muted">No filings or multi-modal records registered.</p>`;
        return;
      }

      filings.forEach(f => {
        const card = document.createElement("div");
        card.className = "repo-card";

        const statusBadge = f.status === 'Upcoming' 
          ? '<span class="badge badge-blue">UPCOMING</span>' 
          : (f.status === 'Open' ? '<span class="badge badge-green">OPEN</span>' : '<span class="badge badge-purple">COMPLETED</span>');

        let videosHtml = "";
        if (f.videos && f.videos.length > 0) {
          f.videos.forEach(v => {
            videosHtml += `
              <div class="repo-link-item">
                <div style="flex: 1; margin-right: 0.5rem;">
                  <strong style="color: #ffffff;"><i class="fa-brands fa-youtube" style="color: #ef4444;"></i> ${v.channel_name}</strong>: ${v.video_title}
                  <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 0.15rem;">${v.key_takeaway}</div>
                </div>
                <a href="${v.video_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch Briefing</a>
              </div>
            `;
          });
        }

        card.innerHTML = `
          <div class="repo-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                <h4 style="margin: 0; font-size: 1.15rem; color: #ffffff;">${f.company_name}</h4>
                ${statusBadge}
              </div>
              <p class="text-muted" style="font-size: 0.78rem; margin-top: 0.35rem;">
                <strong>${f.symbol}</strong> &bull; ${f.sector || 'Automotive / Financials'} &bull; Counsel: ${f.lead_counsel || 'Cyril Amarchand Mangaldas'} &bull; Auditors: ${f.statutory_auditors || 'Statutory Auditors LLP'}
              </p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="openCompanyCockpit('${f.symbol}')" style="white-space: nowrap; font-size: 0.78rem; padding: 0.4rem 0.75rem;">
              <i class="fa-solid fa-gauge-high"></i> Company Cockpit
            </button>
          </div>

          <div style="margin-top: 0.85rem;">
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.45rem;">
              <i class="fa-solid fa-file-shield" style="color: var(--accent-blue);"></i> Official Regulatory Filings & Multi-Modal Media
            </div>
            <div class="repo-links">
              <div class="repo-link-item">
                <span><i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> Draft Red Herring Prospectus (DRHP) PDF</span>
                <a href="${f.drhp_pdf_url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open DRHP</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> Final Red Herring Prospectus (RHP) PDF</span>
                <a href="${f.rhp_pdf_url}" target="_blank"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open RHP</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-video" style="color: var(--accent-indigo);"></i> Official SEBI DRHP Video Presentation (MP4)</span>
                <a href="${f.drhp_av_mp4_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch DRHP AV</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-video" style="color: var(--accent-indigo);"></i> Official SEBI RHP Video Presentation (MP4)</span>
                <a href="${f.rhp_av_mp4_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch RHP AV</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-building-columns" style="color: var(--accent-blue);"></i> SEBI Public Offering Disclosures Portal</span>
                <a href="${f.sebi_portal_url}" target="_blank"><i class="fa-solid fa-external-link"></i> Verify SEBI Filing</a>
              </div>
            </div>
          </div>

          ${videosHtml ? `
          <div style="margin-top: 1rem;">
            <div style="font-size: 0.74rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.45rem;">
              <i class="fa-brands fa-youtube" style="color: #ef4444;"></i> Curated Research & Analyst Briefings
            </div>
            <div class="repo-links">
              ${videosHtml}
            </div>
          </div>
          ` : ''}
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      container.innerHTML = `<p class="text-muted" style="color: var(--accent-red);">Error loading repository: ${err.message}</p>`;
    });
}

// =================================================================
// OPEN SOURCE ACCURACY FORENSICS MODAL (Dedicated Forensic Window)
// =================================================================
function openPlatformModal(platformName) {
  const modal = document.getElementById("platform-modal");
  const modalTitle = document.getElementById("platform-modal-title");
  const modalVerdict = document.getElementById("platform-modal-verdict");
  const modalSubtitle = document.getElementById("platform-modal-subtitle");
  const modalBody = document.getElementById("platform-modal-body");

  if (!modal) return;

  modalTitle.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${platformName} Accuracy Forensics`;
  modalVerdict.textContent = "Analyzing...";
  modalVerdict.className = "badge badge-muted";
  modalSubtitle.textContent = `Historical prediction accuracy & Grey Market error forensics for ${platformName}`;
  modalBody.innerHTML = `<div style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Retrieving platform accuracy benchmark...</div>`;
  modal.classList.add("open");

  fetch(`/api/platform/${encodeURIComponent(platformName)}`)
    .then(r => {
      if (!r.ok) throw new Error(`Platform data not found for ${platformName}`);
      return r.json();
    })
    .then(data => {
      const s = data.summary;
      modalVerdict.textContent = s.verdict;
      modalVerdict.className = `badge ${s.verdict_class}`;

      const biasSign = s.average_signed_bias_pct > 0 ? `+${s.average_signed_bias_pct}%` : `${s.average_signed_bias_pct}%`;
      const biasLabel = s.average_signed_bias_pct > 0 
        ? `<span style="color: #fbbf24;"><i class="fa-solid fa-arrow-trend-up"></i> Overestimation Lean (${biasSign})</span>` 
        : (s.average_signed_bias_pct < 0 
            ? `<span style="color: #38bdf8;"><i class="fa-solid fa-arrow-trend-down"></i> Underestimation Lean (${biasSign})</span>` 
            : `<span style="color: #34d399;"><i class="fa-solid fa-check"></i> Balanced/Zero Bias (0.0%)</span>`);

      let trackRows = "";
      (data.track_record || []).forEach(tr => {
        const errClass = tr.absolute_error_pct < 10 ? 'badge-green' : (tr.absolute_error_pct < 25 ? 'badge-yellow' : 'badge-red');
        const dirBadge = tr.error_direction === 'Exact' || tr.error_direction === 'Accurate'
          ? '<span class="badge badge-green">Accurate</span>'
          : (tr.error_direction === 'Overestimated'
              ? '<span class="badge badge-yellow">Overestimated</span>'
              : '<span class="badge badge-blue">Underestimated</span>');

        trackRows += `
          <tr>
            <td>
              <strong>${tr.company_name}</strong>
              <div style="font-size: 0.74rem; color: var(--text-muted);">${tr.symbol} &bull; ${tr.sector}</div>
            </td>
            <td>₹${tr.issue_price}</td>
            <td><strong style="color: var(--accent-blue);">${tr.last_gmp_predicted_gain_pct > 0 ? '+' : ''}${tr.last_gmp_predicted_gain_pct}%</strong></td>
            <td><strong style="color: var(--accent-green);">${tr.actual_listing_gain_pct > 0 ? '+' : ''}${tr.actual_listing_gain_pct}%</strong></td>
            <td><span class="badge ${errClass}">±${tr.absolute_error_pct}%</span></td>
            <td>${dirBadge}</td>
          </tr>
        `;
      });

      modalBody.innerHTML = `
        <div class="platform-assessment-box">
          <div style="font-weight: 700; color: #ffffff; margin-bottom: 0.35rem;">
            <i class="fa-solid fa-shield-halved" style="color: var(--accent-blue);"></i> Algorithmic Reliability Assessment:
          </div>
          <div>${s.assessment}</div>
        </div>

        <div class="platform-stat-grid">
          <div class="metric-pill">
            <div class="metric-lbl">Mean Absolute Error (MAE)</div>
            <div class="metric-val" style="color: var(--accent-yellow);">${s.mean_mae_pct}%</div>
          </div>
          <div class="metric-pill">
            <div class="metric-lbl">Historical Sample Size</div>
            <div class="metric-val">${s.total_evaluated_ipos} Completed IPOs</div>
          </div>
          <div class="metric-pill">
            <div class="metric-lbl">Best Prediction Error</div>
            <div class="metric-val" style="color: var(--accent-green);">${s.best_error_pct}%</div>
          </div>
          <div class="metric-pill">
            <div class="metric-lbl">Worst Prediction Error</div>
            <div class="metric-val" style="color: var(--accent-red);">${s.worst_error_pct}%</div>
          </div>
          <div class="metric-pill">
            <div class="metric-lbl">Average Signed Bias</div>
            <div class="metric-val" style="font-size: 0.95rem;">${biasLabel}</div>
          </div>
          <div class="metric-pill">
            <div class="metric-lbl">Prediction Distribution</div>
            <div class="metric-val" style="font-size: 0.88rem; color: #cbd5e1;">
              Over: <strong style="color:#fbbf24;">${s.overestimation_count}</strong> &bull; Under: <strong style="color:#38bdf8;">${s.underestimation_count}</strong> &bull; Exact: <strong style="color:#34d399;">${s.exact_match_count}</strong>
            </div>
          </div>
        </div>

        <div class="table-card" style="margin-top: 1rem;">
          <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <strong style="color: #ffffff; font-size: 0.88rem;"><i class="fa-solid fa-list-check"></i> Historical Evaluated Offerings (${data.track_record.length})</strong>
            <span class="text-muted" style="font-size: 0.75rem;">Verified against actual listing price on NSE / BSE</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Offering Details</th>
                <th>Issue Price</th>
                <th>Predicted Listing Gain</th>
                <th>Actual Listing Day Gain</th>
                <th>Absolute Error</th>
                <th>Variance Direction</th>
              </tr>
            </thead>
            <tbody>
              ${trackRows || '<tr><td colspan="6">No historical records available.</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
    })
    .catch(err => {
      modalBody.innerHTML = `
        <div class="platform-assessment-box" style="border-left-color: var(--accent-red);">
          <strong style="color: var(--accent-red);"><i class="fa-solid fa-triangle-exclamation"></i> Unable to load platform data:</strong>
          <p>${err.message}</p>
        </div>
      `;
    });
}

function loadMarketReport(repId) {
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
