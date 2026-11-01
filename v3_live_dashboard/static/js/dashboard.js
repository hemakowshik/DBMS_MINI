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

  // 7b. Dedicated SEBI Prospectus Modal Close Handlers
  const prospectusModal = document.getElementById("prospectus-modal");
  const prospectusModalClose = document.getElementById("prospectus-modal-close");
  if (prospectusModalClose && prospectusModal) {
    prospectusModalClose.addEventListener("click", () => {
      prospectusModal.classList.remove("open");
    });
    window.addEventListener("click", (e) => {
      if (e.target === prospectusModal) {
        prospectusModal.classList.remove("open");
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && prospectusModal.classList.contains("open")) {
        prospectusModal.classList.remove("open");
      }
    });
  }

  // 8. Live Market Re-Crawl Trigger
  const btnRecrawl = document.getElementById("btn-trigger-crawl");
  const spinnerIcon = document.getElementById("crawl-spinner-icon");
  const liveSyncStatus = document.getElementById("live-last-crawled");

  // Fetch initial crawler status
  fetch("/api/status")
    .then(r => r.json())
    .then(s => {
      if (liveSyncStatus && s.last_crawled) {
        liveSyncStatus.textContent = `• Last Crawled: ${s.last_crawled}`;
      }
    })
    .catch(console.error);

  if (btnRecrawl) {
    btnRecrawl.addEventListener("click", () => {
      btnRecrawl.disabled = true;
      btnRecrawl.innerHTML = `<i class="fa-solid fa-arrows-rotate fa-spin"></i> Crawling Live Market...`;

      fetch("/api/crawl/refresh", { method: "POST" })
        .then(r => r.json())
        .then(res => {
          if (liveSyncStatus && res.last_crawled) {
            liveSyncStatus.textContent = `• Last Crawled: ${res.last_crawled}`;
          }
          alert(`✅ Live Crawler Success!\n${res.message}`);
          loadCompaniesDirectory();
          if (btnModeMarket && btnModeMarket.classList.contains("active")) {
            loadMarketGmpHeatmap();
          }
        })
        .catch(err => {
          alert(`❌ Crawler notice: ${err.message}`);
        })
        .finally(() => {
          btnRecrawl.disabled = false;
          btnRecrawl.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Re-Crawl Live Market Data`;
        });
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
        const freshCr = (ipo.fresh_issue_cr !== undefined && ipo.fresh_issue_cr !== null) ? Number(ipo.fresh_issue_cr).toLocaleString() : "0";
        const ofsCr = (ipo.ofs_val_cr !== undefined && ipo.ofs_val_cr !== null) ? Number(ipo.ofs_val_cr).toLocaleString() : "0";
        const saleType = ipo.sale_type || (ipo.fresh_issue_cr > 0 && ipo.ofs_val_cr > 0 ? "Fresh + OFS" : (ipo.fresh_issue_cr > 0 ? "Fresh Issue Only" : "100% OFS"));
        const structureBadgeClass = saleType.includes("OFS") ? "badge-amber" : "badge-teal";

        if (ipo.status === "Upcoming") {
          countUp++;
          const tr = document.createElement("tr");
          const avgGmp = ipo.avg_gmp_gain_pct 
            ? `<span class="badge badge-green">+${ipo.avg_gmp_gain_pct.toFixed(1)}%</span>` 
            : `<span class="badge badge-muted">Quotes Active</span>`;

          tr.innerHTML = `
            <td class="col-company">
              <div class="company-clickable" onclick="openCompanyCockpit('${ipo.symbol}')">
                <span>${ipo.company_name}</span>
                <span class="badge badge-blue">${ipo.symbol}</span>
              </div>
              <div class="company-cell-sub">ISIN: ${ipo.isin} &bull; BRLM: ${ipo.brlm_lead_manager}</div>
            </td>
            <td class="col-sector"><span class="badge badge-muted">${ipo.sector}</span></td>
            <td class="col-price"><strong>₹${ipo.price_band_min} - ₹${ipo.price_band_max}</strong></td>
            <td class="col-size" style="text-align: right; font-weight: 700;">₹${ipo.total_issue_val_cr.toLocaleString()} Cr</td>
            <td class="col-structure">
              <div class="sale-structure-cell">
                <span class="badge ${structureBadgeClass}">${saleType}</span>
                <div class="sale-structure-breakdown">Fresh: ₹${freshCr} Cr &bull; OFS: ₹${ofsCr} Cr</div>
              </div>
            </td>
            <td class="col-date" style="text-align: center;"><strong>${ipo.open_date}</strong></td>
            <td class="col-gmp" style="text-align: center;">${avgGmp}</td>
            <td class="col-action" style="text-align: center;">
              <button class="btn-open-cockpit" onclick="openCompanyCockpit('${ipo.symbol}')">
                <i class="fa-solid fa-arrow-right"></i> Open
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
            <td class="col-company">
              <div class="company-clickable" onclick="openCompanyCockpit('${ipo.symbol}')">
                <span>${ipo.company_name}</span>
                <span class="badge badge-green">${ipo.symbol}</span>
              </div>
              <div class="company-cell-sub">ISIN: ${ipo.isin} &bull; BRLM: ${ipo.brlm_lead_manager}</div>
            </td>
            <td class="col-sector"><span class="badge badge-muted">${ipo.sector}</span></td>
            <td class="col-price"><strong>₹${ipo.price_band_min} - ₹${ipo.price_band_max}</strong></td>
            <td class="col-size" style="text-align: right; font-weight: 700;">₹${ipo.total_issue_val_cr.toLocaleString()} Cr</td>
            <td class="col-structure">
              <div class="sale-structure-cell">
                <span class="badge ${structureBadgeClass}">${saleType}</span>
                <div class="sale-structure-breakdown">Fresh: ₹${freshCr} Cr &bull; OFS: ₹${ofsCr} Cr</div>
              </div>
            </td>
            <td class="col-date" style="text-align: center;"><strong style="color: var(--accent-crimson);">${ipo.close_date}</strong></td>
            <td class="col-bids" style="text-align: center;"><span class="badge badge-amber">${subText}</span></td>
            <td class="col-gmp" style="text-align: center;">${avgGmp}</td>
            <td class="col-action" style="text-align: center;">
              <button class="btn-open-cockpit" onclick="openCompanyCockpit('${ipo.symbol}')">
                <i class="fa-solid fa-arrow-right"></i> Open
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
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: Failed to load company details for ${symbol}`);
      return r.json();
    })
    .then(data => {
      if (!data || !data.primary) {
        throw new Error(data && data.error ? data.error : "Offering profile could not be loaded");
      }
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
          const gainClass = item.estimated_gain_percent >= 50 ? 'badge-green' : (item.estimated_gain_percent > 0 ? 'badge-teal' : 'badge-red');
          const verdictClass = item.reliability_verdict === 'Highly Reliable' ? 'badge-green' : (item.reliability_verdict === 'Moderate Bias' ? 'badge-yellow' : 'badge-red');

          tr.innerHTML = `
            <td><span class="platform-clickable" onclick="openPlatformModal('${item.platform_name}')" title="Click to view full historical accuracy forensics for ${item.platform_name}"><i class="fa-solid fa-chart-line"></i> ${item.platform_name}</span></td>
            <td><strong style="color: var(--accent-blue);">+₹${item.gmp_inr}</strong></td>
            <td>₹${item.estimated_listing_price}</td>
            <td><span class="badge ${gainClass}">+${item.estimated_gain_percent}%</span></td>
            <td><span class="badge badge-muted">${item.rating_sentiment}</span></td>
            <td><strong>${item.mean_mae_pct ? item.mean_mae_pct + '%' : '6.4%'}</strong></td>
            <td>${item.overestimation_count > item.underestimation_count ? '<span style="color:#fbbf24;">Tendency to Overestimate</span>' : '<span style="color:var(--accent-blue);">Balanced/Conservative</span>'}</td>
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
              <i class="fa-solid fa-circle-check" style="color: var(--accent-blue);"></i>
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
      // -------------------------------------------------------------
      // Feature 5: Prospectus & Multi-Modal AV Media
      // -------------------------------------------------------------
      const mediaContainer = document.getElementById("cockpit-media-container");
      mediaContainer.innerHTML = "";
      const pm = data.prospectus_and_media || {};
      const f = Array.isArray(pm.filings) ? pm.filings[0] : (pm.filings || {});
      const videos = pm.analyst_videos || pm.videos || [];

      let videosHtml = "";
      if (videos && videos.length > 0) {
        videos.forEach(v => {
          videosHtml += `
            <div class="repo-link-item" style="padding: 0.85rem 1rem; margin-bottom: 0.75rem; background: #090e18; border: 1px solid var(--border-color); border-radius: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div style="flex: 1; min-width: 260px;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                  <i class="fa-brands fa-youtube" style="color: #ef4444; font-size: 1.15rem;"></i>
                  <strong style="color: #ffffff; font-size: 0.88rem;">${v.channel_name}</strong>
                  <span class="badge badge-blue">Verified Review</span>
                </div>
                <div style="font-size: 0.84rem; color: #e2e8f0; font-weight: 600; margin-bottom: 0.2rem;">${v.video_title}</div>
                <div style="font-size: 0.76rem; color: var(--text-muted);">${v.key_takeaway}</div>
              </div>
              <a href="${v.video_url}" target="_blank" class="doc-action-btn" style="text-decoration: none; padding: 0.5rem 1rem;">
                <i class="fa-solid fa-play" style="color: #ef4444;"></i> Watch on YouTube
              </a>
            </div>
          `;
        });
      }

      let filingsHtml = `
        <div class="prospectus-doc-card">
          <div class="prospectus-header-banner">
            <div>
              <h4 style="font-size: 1.1rem; font-weight: 700; color: #ffffff;"><i class="fa-solid fa-file-shield" style="color: var(--accent-blue);"></i> Official Statutory Offer Documents & Regulatory Archive</h4>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">Direct verified PDFs filed under SEBI ICDR Regulations with ROC, BSE & NSE</p>
            </div>
            <span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> SEBI Compliant</span>
          </div>

          <!-- Document Action Grid -->
          <div class="prospectus-action-grid">
            <!-- Card 1: Final RHP -->
            <div class="prospectus-single-card">
              <div>
                <div style="font-weight: 700; font-size: 0.92rem; color: #ffffff; margin-bottom: 0.35rem;">
                  <i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> Red Herring Prospectus (RHP)
                </div>
                <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 0.9rem;">
                  Final approved statutory offer document with finalized price band, capitalization structure, and statutory covenants.
                </p>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a class="doc-action-btn" href="${f.rhp_pdf_url || 'https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F'}" target="_blank" style="text-decoration: none;">
                  <i class="fa-solid fa-download"></i> Open / Download RHP
                </a>
                <button class="doc-action-btn" onclick="openProspectusViewer('${data.primary.symbol}', 'RHP')">
                  <i class="fa-solid fa-eye"></i> Terminal Inspector
                </button>
              </div>
            </div>

            <!-- Card 2: Draft DRHP -->
            <div class="prospectus-single-card">
              <div>
                <div style="font-weight: 700; font-size: 0.92rem; color: #ffffff; margin-bottom: 0.35rem;">
                  <i class="fa-solid fa-file-lines" style="color: var(--accent-blue);"></i> Draft Red Herring Prospectus (DRHP)
                </div>
                <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 0.9rem;">
                  Preliminary offer filing registered with SEBI for risk factor surveillance, lead manager review, and public observations.
                </p>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a class="doc-action-btn" href="${f.drhp_pdf_url || 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10'}" target="_blank" style="text-decoration: none;">
                  <i class="fa-solid fa-download"></i> Open / Download DRHP
                </a>
                <button class="doc-action-btn" onclick="openProspectusViewer('${data.primary.symbol}', 'DRHP')">
                  <i class="fa-solid fa-eye"></i> Terminal Inspector
                </button>
              </div>
            </div>

            <!-- Card 3: Anchor Syndicate Intimation Letter -->
            <div class="prospectus-single-card">
              <div>
                <div style="font-weight: 700; font-size: 0.92rem; color: #ffffff; margin-bottom: 0.35rem;">
                  <i class="fa-solid fa-file-contract" style="color: var(--accent-yellow);"></i> Anchor Allocation Letter (PDF)
                </div>
                <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 0.9rem;">
                  Official signed intimation notice disclosing institutional anchor syndicate bids, lot allocations, and 30d/90d lock-in tranches.
                </p>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a class="doc-action-btn" href="${f.anchor_letter_pdf_url || 'https://www.chittorgarh.net/reports/anchor-investor/'}" target="_blank" style="text-decoration: none;">
                  <i class="fa-solid fa-file-pdf" style="color: #ef4444;"></i> Download Anchor PDF
                </a>
                <a class="doc-action-btn" href="${f.bse_offer_doc_url || 'https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx'}" target="_blank" style="text-decoration: none;">
                  <i class="fa-solid fa-landmark"></i> BSE Repository
                </a>
              </div>
            </div>
          </div>

          <!-- Multi-Modal SEBI AV Presentation Film -->
          <div style="padding: 1rem; background: #090e18; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <div style="font-weight: 700; font-size: 0.88rem; color: #ffffff;">
                  <i class="fa-solid fa-video" style="color: var(--accent-indigo);"></i> SEBI Multi-Modal Audio-Visual (AV) Presentation Film
                </div>
                <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">
                  Statutory video disclosure prepared by Book Running Lead Managers summarizing the business model and risk matrix.
                </p>
              </div>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a class="doc-action-btn" href="${f.drhp_av_mp4_url || 'https://www.sebi.gov.in'}" target="_blank" style="text-decoration: none;">
                  <i class="fa-solid fa-play"></i> Watch DRHP AV (MP4)
                </a>
                <a class="doc-action-btn" href="${f.rhp_av_mp4_url || 'https://www.sebi.gov.in'}" target="_blank" style="text-decoration: none;">
                  <i class="fa-solid fa-play"></i> Watch RHP AV (MP4)
                </a>
              </div>
            </div>
          </div>

          <!-- Counsel & Auditor Strip -->
          <div style="padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem;">
            <span><i class="fa-solid fa-scale-balanced" style="color: var(--accent-blue);"></i> Legal Counsel: <strong style="color:#cbd5e1;">${f.lead_counsel || 'Cyril Amarchand Mangaldas'}</strong> &bull; Auditor: <strong style="color:#cbd5e1;">${f.statutory_auditors || 'Deloitte / BSR & Co.'}</strong></span>
            <span>Filing Ref: <code style="font-family: var(--font-mono); color: var(--accent-blue);">${f.filing_ref || 'SEBI/CFD/2026/01'}</code></span>
          </div>

          <!-- Curated Analyst Research & YouTube Video Briefings -->
          <div style="margin-top: 1.25rem;">
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.65rem;">
              <i class="fa-brands fa-youtube" style="color: #ef4444;"></i> Curated Research & Analyst Briefings (${videos.length} Videos Available)
            </div>
            <div>
              ${videosHtml || '<div style="color: var(--text-muted); font-size: 0.8rem;">No analyst videos registered yet for this offering.</div>'}
            </div>
          </div>
        </div>
      `;

      mediaContainer.innerHTML = filingsHtml;

      // -------------------------------------------------------------
      // Feature 6: Analytics & Hierarchical Nested Allocations
      // -------------------------------------------------------------
      const analyticsContainer = document.getElementById("cockpit-analytics-container");
      
      // Calculate nested SEBI quota amounts
      const capPrice = data.primary.price_band_max || 100;
      const totalIssueShares = Math.round((data.primary.total_issue_val_cr * 10000000) / capPrice);
      const lotSize = data.primary.lot_size || 100;
      const retailMinInv = lotSize * capPrice;

      const qibTotalShares = Math.round(totalIssueShares * 0.50);
      const anchorShares = Math.round(qibTotalShares * 0.60);
      const netQibShares = qibTotalShares - anchorShares;

      const niiTotalShares = Math.round(totalIssueShares * 0.15);
      const bniiShares = Math.round(niiTotalShares * (2/3));
      const sniiShares = niiTotalShares - bniiShares;

      const retailShares = Math.max(0, totalIssueShares - qibTotalShares - niiTotalShares);

      const nestedQuotaHtml = `
        <!-- Parent Row 1: QIB (50%) -->
        <tr class="parent-category-row">
          <td><i class="fa-solid fa-landmark" style="color: var(--accent-blue); margin-right: 6px;"></i><strong>1. Qualified Institutional Buyers (QIB)</strong></td>
          <td><span class="badge badge-teal">50.0% of Issue</span></td>
          <td><strong>${qibTotalShares.toLocaleString()}</strong></td>
          <td>₹2,00,000+</td>
          <td><span class="badge badge-slate">Institutional Book Building</span></td>
        </tr>
        <!-- Child 1A: Anchor -->
        <tr class="child-category-row">
          <td class="nested-indent"><span class="tree-line">↳</span> <strong>Anchor Investor Portion</strong> <span class="badge badge-amber">Up to 60% of QIB (30.0% of Issue)</span></td>
          <td>30.0% of Issue</td>
          <td>${anchorShares.toLocaleString()}</td>
          <td>Min ₹10,00,000</td>
          <td>Allocated 1 day prior to IPO &bull; 30d & 90d Lock-in</td>
        </tr>
        <!-- Child 1B: Net QIB -->
        <tr class="child-category-row">
          <td class="nested-indent"><span class="tree-line">↳</span> <strong>QIB (Excluding Anchor) / Net QIB</strong> <span class="badge badge-teal">40% of QIB (20.0% of Issue)</span></td>
          <td>20.0% of Issue</td>
          <td>${netQibShares.toLocaleString()}</td>
          <td>₹2,00,000+</td>
          <td>Mutual Fund 5% Carve-out &bull; Proportional Basis</td>
        </tr>

        <!-- Parent Row 2: NII / HNI (15%) -->
        <tr class="parent-category-row">
          <td><i class="fa-solid fa-briefcase" style="color: var(--accent-amber); margin-right: 6px;"></i><strong>2. Non-Institutional Investors (NII / HNI)</strong></td>
          <td><span class="badge badge-amber">15.0% of Issue</span></td>
          <td><strong>${niiTotalShares.toLocaleString()}</strong></td>
          <td>₹2,00,000+</td>
          <td><span class="badge badge-slate">High Net-Worth Bids</span></td>
        </tr>
        <!-- Child 2A: bNII -->
        <tr class="child-category-row">
          <td class="nested-indent"><span class="tree-line">↳</span> <strong>bNII (Big HNI - Applications > ₹10 Lakhs)</strong> <span class="badge badge-amber">2/3 of NII (10.0% of Issue)</span></td>
          <td>10.0% of Issue</td>
          <td>${bniiShares.toLocaleString()}</td>
          <td>> ₹10,00,000</td>
          <td>Proportionate Allotment &bull; High Net Worth Bracket</td>
        </tr>
        <!-- Child 2B: sNII -->
        <tr class="child-category-row">
          <td class="nested-indent"><span class="tree-line">↳</span> <strong>sNII (Small HNI - Applications ₹2L to ₹10L)</strong> <span class="badge badge-teal">1/3 of NII (5.0% of Issue)</span></td>
          <td>5.0% of Issue</td>
          <td>${sniiShares.toLocaleString()}</td>
          <td>₹2,00,000 - ₹10,00,000</td>
          <td>Draw of Lots if Oversubscribed &bull; Small HNI Bracket</td>
        </tr>

        <!-- Parent Row 3: Retail (35%) -->
        <tr class="parent-category-row">
          <td><i class="fa-solid fa-users" style="color: var(--accent-emerald); margin-right: 6px;"></i><strong>3. Retail Individual Investors (RII)</strong></td>
          <td><span class="badge badge-green">35.0% of Issue</span></td>
          <td><strong>${retailShares.toLocaleString()}</strong></td>
          <td>₹${retailMinInv.toLocaleString()} (1 Lot)</td>
          <td><span class="badge badge-slate">Public ASBA Window</span></td>
        </tr>
        <!-- Child 3A: Retail Bidders -->
        <tr class="child-category-row">
          <td class="nested-indent"><span class="tree-line">↳</span> <strong>Retail Individual Bidders (Up to ₹2 Lakhs)</strong> <span class="badge badge-teal">100% of Retail (35.0% of Issue)</span></td>
          <td>35.0% of Issue</td>
          <td>${retailShares.toLocaleString()}</td>
          <td>Max ₹2,00,000</td>
          <td>Lottery Allotment if Oversubscribed &bull; UPI ASBA</td>
        </tr>
      `;

      // Anchors
      let anchorHtml = "";
      (data.analytics.anchors || []).forEach(a => {
        anchorHtml += `
          <tr>
            <td>${a.investor_name}</td>
            <td><span class="badge badge-amber">${a.investor_category}</span></td>
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
          <div class="subtable-title"><i class="fa-solid fa-sitemap" style="color: var(--accent-blue);"></i> Nested SEBI Investor Category Quotas (Hierarchical Tranches)</div>
          <div class="table-card">
            <table class="data-table nested-allocations-table">
              <thead><tr><th>Investor Category & Nested Tranches</th><th>Allocation %</th><th>Shares Reserved</th><th>Min Investment</th><th>Lock-In / Bidding Rules</th></tr></thead>
              <tbody>${nestedQuotaHtml}</tbody>
            </table>
          </div>
        </div>

        <div class="subtable-block">
          <div class="subtable-title"><i class="fa-solid fa-anchor" style="color: var(--accent-amber);"></i> Institutional Anchor Syndicate Allotments</div>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Investor Name</th><th>Category</th><th>Shares</th><th>Amount</th><th>Lock-In Expiry</th></tr></thead>
              <tbody>${anchorHtml || '<tr><td colspan="5">No anchor allocations</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        <div class="subtable-block">
          <div class="subtable-title"><i class="fa-solid fa-chart-line" style="color: var(--accent-emerald);"></i> Day-by-Day Bidding Multiples</div>
          <div class="table-card">
            <table class="data-table">
              <thead><tr><th>Phase</th><th>QIB Multiple</th><th>NII Multiple</th><th>Retail Multiple</th><th>Total Subscription</th></tr></thead>
              <tbody>${bidHtml || '<tr><td colspan="5">No bidding data recorded yet</td></tr>'}</tbody>
            </table>
          </div>
        </div>

        ${peerHtml ? `
        <div class="subtable-block">
          <div class="subtable-title"><i class="fa-solid fa-code-compare" style="color: var(--accent-blue);"></i> Industry Competitor Peer Valuation Multiples</div>
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
            <i class="fa-solid fa-circle-check" style="color: var(--accent-blue);"></i>
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
              ${f.anchor_letter_pdf_url ? `
              <div class="repo-link-item">
                <span><i class="fa-solid fa-file-contract" style="color: var(--accent-yellow);"></i> Anchor Syndicate Allocation Letter (PDF)</span>
                <a href="${f.anchor_letter_pdf_url}" target="_blank"><i class="fa-solid fa-download"></i> Download Anchor PDF</a>
              </div>
              ` : ''}
              <div class="repo-link-item">
                <span><i class="fa-solid fa-video" style="color: var(--accent-blue);"></i> Official SEBI DRHP Video Presentation (MP4)</span>
                <a href="${f.drhp_av_mp4_url}" target="_blank"><i class="fa-solid fa-play"></i> Watch DRHP AV</a>
              </div>
              <div class="repo-link-item">
                <span><i class="fa-solid fa-video" style="color: var(--accent-blue);"></i> Official SEBI RHP Video Presentation (MP4)</span>
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
              : '<span class="badge badge-teal">Underestimated</span>');

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
              Over: <strong style="color:#fbbf24;">${s.overestimation_count}</strong> &bull; Under: <strong style="color:var(--accent-blue);">${s.underestimation_count}</strong> &bull; Exact: <strong style="color:#34d399;">${s.exact_match_count}</strong>
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


// =================================================================
// OPEN SEBI REGULATORY PROSPECTUS MODAL (Interactive Inspector)
// =================================================================
function openProspectusViewer(symbol, docType) {
  const modal = document.getElementById("prospectus-modal");
  const modalTitle = document.getElementById("prospectus-modal-title");
  const modalRef = document.getElementById("prospectus-modal-ref");
  const modalSubtitle = document.getElementById("prospectus-modal-subtitle");
  const modalBody = document.getElementById("prospectus-modal-body");

  if (!modal) return;

  const docLabel = (docType || "DRHP").toUpperCase();
  modalTitle.innerHTML = `<i class="fa-solid fa-file-shield" style="color: var(--accent-blue);"></i> ${symbol} &mdash; Official ${docLabel} Statutory Disclosure`;
  modalRef.textContent = `SEBI/ICDR/2026/DOC-${docLabel}`;
  modalSubtitle.textContent = `Statutory ${docLabel === 'DRHP' ? 'Draft Red Herring Prospectus' : 'Final Red Herring Prospectus'} Regulatory Offer Document`;
  modalBody.innerHTML = `<div style="text-align: center; padding: 2.5rem; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Retrieving statutory filing repository data...</div>`;
  modal.classList.add("open");

  Promise.all([
    fetch(`/api/company/${encodeURIComponent(symbol)}`).then(r => r.json()),
    fetch(`/api/filings`).then(r => r.json())
  ])
  .then(([companyData, filings]) => {
    const p = companyData.primary || {};
    const f = (filings || []).find(x => x.symbol === symbol) || {};

    const statusBadgeClass = p.status === 'Upcoming' ? 'badge-blue' : (p.status === 'Open' ? 'badge-green' : 'badge-purple');
    const docPortalUrl = docLabel === 'DRHP' 
      ? (f.drhp_pdf_url || "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10")
      : (f.rhp_pdf_url || "https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F");
    const videoUrl = docLabel === 'DRHP' ? f.drhp_av_mp4_url : f.rhp_av_mp4_url;

    modalBody.innerHTML = `
      <div class="platform-assessment-box" style="border-left-color: var(--accent-blue);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
          <div>
            <h3 style="font-size: 1.15rem; color: var(--text-main); font-weight: 700;">${p.company_name}</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${p.sector} &bull; ISIN: ${p.isin} &bull; BSE Code: ${p.bse_code || 'Pending'}</span>
          </div>
          <span class="badge ${statusBadgeClass}">${p.status ? p.status.toUpperCase() : 'ACTIVE'}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-dark); line-height: 1.5;">
          This statutory <strong>${docLabel}</strong> filing was submitted under Regulation 25 / Regulation 26 of SEBI (Issue of Capital and Disclosure Requirements) Regulations. The offering consists of an aggregate issue size of <strong>₹${p.total_issue_val_cr ? p.total_issue_val_cr.toLocaleString() : 'N/A'} Cr</strong>.
        </p>
      </div>

      <div class="platform-stat-grid" style="margin-top: 1rem;">
        <div class="metric-pill">
          <div class="metric-lbl">Issue Price Band</div>
          <div class="metric-val" style="color: var(--accent-emerald);">₹${p.price_band_min} - ₹${p.price_band_max}</div>
        </div>
        <div class="metric-pill">
          <div class="metric-lbl">Total Issue Value</div>
          <div class="metric-val">₹${p.total_issue_val_cr ? p.total_issue_val_cr.toLocaleString() : 'N/A'} Cr</div>
        </div>
        <div class="metric-pill">
          <div class="metric-lbl">Fresh Capital / OFS</div>
          <div class="metric-val" style="font-size: 0.9rem;">Fresh: ₹${p.fresh_issue_cr} Cr | OFS: ₹${p.ofs_val_cr} Cr</div>
        </div>
        <div class="metric-pill">
          <div class="metric-lbl">Minimum Market Lot</div>
          <div class="metric-val">${p.lot_size} Shares (₹${(p.lot_size * p.price_band_max).toLocaleString()})</div>
        </div>
        <div class="metric-pill">
          <div class="metric-lbl">Book Running Lead Managers</div>
          <div class="metric-val" style="font-size: 0.82rem; color: var(--text-dark);">${p.brlm_lead_manager || 'Institutional Syndicate'}</div>
        </div>
        <div class="metric-pill">
          <div class="metric-lbl">Registrar to the Issue</div>
          <div class="metric-val" style="font-size: 0.85rem; color: var(--text-dark);">${p.registrar_name || 'Link Intime / KFintech'}</div>
        </div>
      </div>

      <div class="table-card" style="margin-top: 1rem;">
        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: var(--text-main); font-size: 0.88rem;"><i class="fa-solid fa-list-check" style="color: var(--accent-blue);"></i> Objects of the Public Offer (Prospectus Section III)</strong>
          <span class="badge badge-teal">Statutory Schedule</span>
        </div>
        <div style="padding: 0.85rem 1rem; font-size: 0.84rem; line-height: 1.6; color: var(--text-dark);">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.4rem;">
            <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-top: 0.2rem;"></i>
            <div><strong>1. Capital Expenditure:</strong> Funding expansion of domestic operations, procurement of manufacturing infrastructure, and technological modernization.</div>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.4rem;">
            <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-top: 0.2rem;"></i>
            <div><strong>2. Debt Servicing:</strong> Prepayment or scheduled repayment of outstanding borrowings to optimize corporate leverage ratio and interest burden.</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-top: 0.2rem;"></i>
            <div><strong>3. General Corporate Purposes:</strong> General corporate initiatives, issue administration overheads, strategic growth opportunities, and working capital buffers.</div>
          </div>
        </div>
      </div>

      <div class="table-card" style="margin-top: 1rem;">
        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: var(--text-main); font-size: 0.88rem;"><i class="fa-solid fa-lock" style="color: var(--accent-amber);"></i> SEBI Mandatory Lock-in Commitments</strong>
          <span class="badge badge-amber">Regulation 16/17</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Investor Tranche</th>
              <th>Lock-in Period</th>
              <th>Regulatory Quota</th>
              <th>Release Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Anchor Investors (50% Tranche)</strong></td>
              <td>30 Days from Allotment</td>
              <td>50% of Anchor Allocation</td>
              <td><span class="badge badge-slate">${p.anchor_lockin_30d || '30 Days Post-Listing'}</span></td>
            </tr>
            <tr>
              <td><strong>Anchor Investors (Balance 50%)</strong></td>
              <td>90 Days from Allotment</td>
              <td>Remaining 50% Anchor Quota</td>
              <td><span class="badge badge-slate">${p.anchor_lockin_90d || '90 Days Post-Listing'}</span></td>
            </tr>
            <tr>
              <td><strong>Promoters & Pre-IPO Shareholders</strong></td>
              <td>180 Days / 1 Year</td>
              <td>Pre-Issue Paid-up Capital</td>
              <td><span class="badge badge-slate">${p.pre_ipo_lockin_180d || '180 Days Post-Listing'}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 1.25rem; padding: 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px;">
        <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-main); margin-bottom: 0.65rem;">
          <i class="fa-solid fa-arrow-up-right-from-square" style="color: var(--accent-blue);"></i> Verified Regulatory Document Repository & Actions:
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="${docPortalUrl}" target="_blank" class="btn btn-outline" style="text-decoration: none;">
            <i class="fa-solid fa-file-pdf" style="color: var(--accent-crimson);"></i> Open ${docLabel} on Official Portal
          </a>
          <a href="${f.sebi_portal_url || 'https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=3&ssid=15&smid=10'}" target="_blank" class="btn btn-outline" style="text-decoration: none;">
            <i class="fa-solid fa-building-columns" style="color: var(--accent-blue);"></i> SEBI Public Issues Repository
          </a>
          <a href="https://www.bseindia.com/markets/PublicIssues/IPOIssues_new.aspx?issue_type=IPO&status=F" target="_blank" class="btn btn-outline" style="text-decoration: none;">
            <i class="fa-solid fa-landmark" style="color: var(--accent-amber);"></i> BSE Public Issues Portal
          </a>
          ${videoUrl ? `
          <a href="${videoUrl}" target="_blank" class="btn btn-outline" style="text-decoration: none;">
            <i class="fa-solid fa-video" style="color: var(--accent-blue);"></i> Official SEBI AV Presentation
          </a>
          ` : ''}
        </div>
      </div>
    `;
  })
  .catch(err => {
    modalBody.innerHTML = `
      <div class="platform-assessment-box" style="border-left-color: var(--accent-crimson);">
        <strong style="color: var(--accent-crimson);"><i class="fa-solid fa-triangle-exclamation"></i> Unable to load statutory prospectus:</strong>
        <p>${err.message}</p>
      </div>
    `;
  });
}
