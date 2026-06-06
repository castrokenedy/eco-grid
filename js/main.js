/* ────────────────────────────────────────────────
   ECOGRID — main.js
   ──────────────────────────────────────────────── */

// ── NAV SCROLL ──────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ── HAMBURGER ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav__links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav__links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── TABS ────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const id = 'tab-' + tab.dataset.tab;
    document.getElementById(id).classList.add('active');
    // re-renderiza chart se precisar
    if (tab.dataset.tab === 'analytics') renderAnalyticsChart();
  });
});

// ── STEPS ───────────────────────────────────────
const steps = document.querySelectorAll('.step');
const flowNodes = document.querySelectorAll('.flow-node');
steps.forEach((step, i) => {
  step.addEventListener('click', () => {
    steps.forEach(s => s.classList.remove('active'));
    flowNodes.forEach(n => n.classList.remove('active'));
    step.classList.add('active');
    if (flowNodes[i]) flowNodes[i].classList.add('active');
  });
});

// ── COUNTER ANIMATION ───────────────────────────
function animateCounters() {
  document.querySelectorAll('.kpi__value[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const isInt  = Number.isInteger(target);
    const duration = 1200;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = isInt ? Math.round(val) : val.toFixed(1);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ── INTERSECTION OBSERVER ───────────────────────
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObserver.disconnect(); } });
}, { threshold: .3 });
const dashPreview = document.querySelector('.dashboard-preview');
if (dashPreview) heroObserver.observe(dashPreview);

// ── CHART DEFAULTS ──────────────────────────────
Chart.defaults.color = '#6b9a78';
Chart.defaults.font.family = "'DM Sans', sans-serif";
Chart.defaults.font.size   = 11;

// ── MINI CHART (hero) ───────────────────────────
const miniCtx = document.getElementById('miniChart');
if (miniCtx) {
  const labels = ['00h','03h','06h','09h','12h','15h','18h','21h','24h'];
  const data   = [18,15,12,22,38,42,35,29,24];
  new Chart(miniCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#22c55e',
        borderWidth: 2,
        pointRadius: 0,
        tension: .4,
        fill: true,
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 80);
          g.addColorStop(0, 'rgba(34,197,94,.25)');
          g.addColorStop(1, 'rgba(34,197,94,0)');
          return g;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: { duration: 1200, easing: 'easeOutQuart' },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// ── DASH CHART ──────────────────────────────────
const dashCtx = document.getElementById('dashChart');
if (dashCtx) {
  const hours = Array.from({length: 24}, (_, i) => `${String(i).padStart(2,'0')}h`);
  const vals  = [12,10,9,8,8,10,18,28,36,42,44,45,43,40,38,39,41,44,42,35,28,22,18,14];
  new Chart(dashCtx, {
    type: 'line',
    data: {
      labels: hours,
      datasets: [{
        data: vals,
        borderColor: '#22c55e',
        borderWidth: 2,
        pointRadius: 0,
        tension: .4,
        fill: true,
        backgroundColor: (ctx) => {
          const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 100);
          g.addColorStop(0, 'rgba(34,197,94,.2)');
          g.addColorStop(1, 'rgba(34,197,94,0)');
          return g;
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: 'rgba(34,197,94,.05)' }, ticks: { maxTicksLimit: 8 } },
        y: { grid: { color: 'rgba(34,197,94,.05)' } }
      }
    }
  });
}

// ── PIE CHART ───────────────────────────────────
const pieCtx = document.getElementById('pieChart');
if (pieCtx) {
  new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['TI','Climatiz.','Iluminação','Outros'],
      datasets: [{
        data: [35, 28, 22, 15],
        backgroundColor: ['#22c55e','#2dd4bf','#38bdf8','#fbbf24'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900 },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 8, padding: 8, font: { size: 10 } }
        }
      }
    }
  });
}

// ── ANALYTICS CHART ─────────────────────────────
let analyticsInstance = null;
function renderAnalyticsChart() {
  const ctx = document.getElementById('analyticsChart');
  if (!ctx) return;
  if (analyticsInstance) { analyticsInstance.destroy(); analyticsInstance = null; }
  const days = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const consumo = [210, 195, 230, 218, 205, 140, 86];
  const economia = [38, 42, 35, 45, 40, 55, 60];
  analyticsInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Consumo (kWh)',
          data: consumo,
          backgroundColor: 'rgba(34,197,94,.6)',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Economia (%)',
          data: economia,
          type: 'line',
          borderColor: '#2dd4bf',
          borderWidth: 2,
          pointRadius: 3,
          tension: .4,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800 },
      plugins: { legend: { position: 'top', labels: { boxWidth: 10 } } },
      scales: {
        x: { grid: { color: 'rgba(34,197,94,.05)' } },
        y:  { grid: { color: 'rgba(34,197,94,.05)' }, position: 'left'  },
        y1: { grid: { display: false },               position: 'right', min: 0, max: 100 }
      }
    }
  });
}

// ── SCROLL REVEAL ───────────────────────────────
const revealEls = document.querySelectorAll(
  '.bcard, .tech-item, .step, .problema__card'
);
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animation = `fadeUp .5s ease both`;
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));
