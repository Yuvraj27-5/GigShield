/* GigShield — Frontend App */
const API = '/api';
let STATE = { token: null, user: null };
let forecastChartInstance = null;

/* ─── Init ─────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('gs_token');
  const savedUser = localStorage.getItem('gs_user');
  if (saved && savedUser) {
    STATE.token = saved;
    STATE.user = JSON.parse(savedUser);
  }

  setTimeout(() => {
    document.getElementById('splash').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('splash').classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
      initApp();
    }, 600);
  }, 1400);
});

function initApp() {
  renderNav();
  loadTicker();
  if (STATE.user) {
    if (STATE.user.role === 'admin') showPage('admin');
    else if (STATE.user.kycStatus !== 'verified') showPage('onboard');
    else if (!STATE.user.activePolicy) showPage('plans');
    else { showPage('dashboard'); loadDashboard(); }
  } else {
    showPage('home');
  }
}

/* ─── Nav ───────────────────────────────────────────────── */
function renderNav() {
  const links = document.getElementById('navLinks');
  const actions = document.getElementById('navActions');
  links.innerHTML = '';
  actions.innerHTML = '';

  if (!STATE.user) {
    links.innerHTML = `
      <button class="nav-link" onclick="showPage('home')">Home</button>
      <button class="nav-link" onclick="showPage('how')">How It Works</button>
      <button class="nav-link" onclick="showPage('plans')">Plans</button>`;
    actions.innerHTML = `<button class="btn-primary" onclick="showPage('login')">Get Started</button>`;
  } else if (STATE.user.role === 'admin') {
    links.innerHTML = `<button class="nav-link" onclick="showPage('admin'); loadAdmin()">Dashboard</button>`;
    actions.innerHTML = `<span style="color:var(--text2);font-size:.85rem;margin-right:4px">${STATE.user.name}</span><button class="btn-logout" onclick="logout()">Logout</button>`;
  } else {
    links.innerHTML = `
      <button class="nav-link" onclick="showPage('dashboard'); loadDashboard()">Dashboard</button>
      <button class="nav-link" onclick="showPage('plans')">Plans</button>
      <button class="nav-link" onclick="showPage('how')">How It Works</button>`;
    actions.innerHTML = `<span style="color:var(--text2);font-size:.85rem;margin-right:4px">${STATE.user.name || STATE.user.mobile}</span><button class="btn-logout" onclick="logout()">Logout</button>`;
  }
}

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
}

function goBack(show, hide) {
  document.getElementById(hide).classList.add('hidden');
  document.getElementById(show).classList.remove('hidden');
}

function switchTab(tab) {
  document.getElementById('workerLogin').classList.toggle('hidden', tab !== 'worker');
  document.getElementById('adminLogin').classList.toggle('hidden', tab !== 'admin');
  document.getElementById('tabWorker').classList.toggle('active', tab === 'worker');
  document.getElementById('tabAdmin').classList.toggle('active', tab === 'admin');
}

/* ─── Auth ──────────────────────────────────────────────── */
async function sendOTP() {
  const mobile = document.getElementById('mobileInput').value.trim();
  if (!/^\d{10}$/.test(mobile)) return toast('Enter a valid 10-digit mobile number', 'error');
  try {
    const res = await post('/auth/send-otp', { mobile });
    if (res.success) {
      document.getElementById('otpMobile').textContent = '+91 ' + mobile;
      document.getElementById('otpStep1').classList.add('hidden');
      document.getElementById('otpStep2').classList.remove('hidden');
      if (res.otp) {
        const hint = document.getElementById('otpHint');
        hint.textContent = `Demo OTP: ${res.otp}`;
        hint.classList.remove('hidden');
      }
      toast('OTP sent successfully!', 'success');
    } else toast(res.message, 'error');
  } catch (e) { toast('Network error', 'error'); }
}

async function verifyOTP() {
  const mobile = document.getElementById('mobileInput').value.trim();
  const otp = document.getElementById('otpInput').value.trim();
  if (otp.length !== 6) return toast('Enter the 6-digit OTP', 'error');
  try {
    const res = await post('/auth/verify-otp', { mobile, otp });
    if (res.success) {
      setSession(res.token, res.user);
      toast('Welcome to GigShield! 🛡️', 'success');
      renderNav();
      if (res.user.kycStatus !== 'verified') showPage('onboard');
      else if (!res.user.activePolicy) showPage('plans');
      else { showPage('dashboard'); loadDashboard(); }
    } else toast(res.message, 'error');
  } catch (e) { toast('Network error', 'error'); }
}

async function adminLogin() {
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  try {
    const res = await post('/auth/admin-login', { email, password });
    if (res.success) {
      setSession(res.token, res.user);
      toast('Admin logged in', 'success');
      renderNav();
      showPage('admin');
      loadAdmin();
    } else toast(res.message, 'error');
  } catch (e) { toast('Network error', 'error'); }
}

async function submitKYC() {
  const name = document.getElementById('onboardName').value.trim();
  const city = document.getElementById('onboardCity').value;
  const platform = document.getElementById('onboardPlatform').value;
  const aadhaarLast4 = document.getElementById('onboardAadhaar').value.trim();
  const upiId = document.getElementById('onboardUpi').value.trim();
  if (!name || !aadhaarLast4 || !upiId) return toast('All fields are required', 'error');
  if (aadhaarLast4.length !== 4) return toast('Enter last 4 digits of Aadhaar', 'error');
  try {
    const res = await put('/auth/kyc', { name, city, platform, aadhaarLast4, upiId });
    if (res.success) {
      STATE.user = { ...STATE.user, ...res.user };
      localStorage.setItem('gs_user', JSON.stringify(STATE.user));
      toast('KYC verified! ✅', 'success');
      renderNav();
      showPage('plans');
    } else toast(res.message, 'error');
  } catch (e) { toast('Network error', 'error'); }
}

async function selectPlan(tier) {
  if (!STATE.user) { toast('Please login first', 'error'); showPage('login'); return; }
  if (STATE.user.kycStatus !== 'verified') { toast('Complete KYC first', 'error'); showPage('onboard'); return; }
  try {
    const res = await post('/policy/subscribe', { tier });
    if (res.success) {
      STATE.user.activePolicy = res.policy;
      localStorage.setItem('gs_user', JSON.stringify(STATE.user));
      toast(`${tier.charAt(0).toUpperCase()+tier.slice(1)} plan activated! 🎉`, 'success');
      showPage('dashboard');
      loadDashboard();
    } else toast(res.message, 'error');
  } catch (e) { toast('Network error', 'error'); }
}

function logout() {
  STATE = { token: null, user: null };
  localStorage.removeItem('gs_token');
  localStorage.removeItem('gs_user');
  renderNav();
  showPage('home');
  toast('Logged out', '');
}

function setSession(token, user) {
  STATE.token = token;
  STATE.user = user;
  localStorage.setItem('gs_token', token);
  localStorage.setItem('gs_user', JSON.stringify(user));
}

/* ─── Dashboard ─────────────────────────────────────────── */
async function loadDashboard() {
  const h = new Date().getHours();
  document.getElementById('greeting').textContent = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  document.getElementById('dashName').textContent = STATE.user?.name || STATE.user?.mobile || 'Worker';
  document.getElementById('dashCity').textContent = `📍 ${STATE.user?.city || 'Mumbai'} • ${STATE.user?.platform || 'Swiggy'}`;

  try {
    const [dash, triggers, payouts] = await Promise.all([
      get('/analytics/dashboard'),
      get('/triggers/active'),
      get('/payout/history')
    ]);

    if (dash.success) {
      const s = dash.stats;
      document.getElementById('dcPolicy').textContent = s.activePolicy ? '🟢 Active' : '⚠️ None';
      document.getElementById('dcTier').textContent = s.activePolicy ? `${s.activePolicy.tier} plan • ₹${s.activePolicy.weeklyPremium}/wk` : 'No active plan';
      document.getElementById('dcReceived').textContent = `₹${(s.totalReceived||0).toLocaleString('en-IN')}`;
      document.getElementById('dcClaims').textContent = `${s.claimsCount||0} claims processed`;
      document.getElementById('dcTriggers').textContent = s.activeTriggers || 0;
      document.getElementById('dcMaxPayout').textContent = s.activePolicy ? `₹${s.activePolicy.maxWeeklyPayout.toLocaleString('en-IN')}` : '₹0';
      renderForecastChart(dash.forecast || []);
    }

    if (triggers.success) renderTriggersList('liveTriggersList', triggers.triggers);
    if (payouts.success) renderPayoutsList('payoutHistoryList', payouts.payouts);
  } catch (e) { toast('Failed to load dashboard', 'error'); }
}

function renderForecastChart(forecast) {
  const ctx = document.getElementById('forecastChart').getContext('2d');
  if (forecastChartInstance) forecastChartInstance.destroy();
  forecastChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: forecast.map(f => f.day),
      datasets: [
        {
          label: 'Risk Score',
          data: forecast.map(f => f.riskScore),
          backgroundColor: forecast.map(f => f.riskScore > 60 ? 'rgba(248,113,113,0.7)' : f.riskScore > 35 ? 'rgba(251,146,60,0.7)' : 'rgba(110,231,183,0.7)'),
          borderRadius: 6, borderSkipped: false
        },
        {
          label: 'Trigger Probability',
          data: forecast.map(f => f.triggerProbability),
          type: 'line',
          borderColor: 'rgba(59,130,246,0.8)',
          backgroundColor: 'rgba(59,130,246,0.1)',
          borderWidth: 2, pointRadius: 4, tension: 0.4, fill: true,
          yAxisID: 'y'
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#8899AA', font: { size: 11 } } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899AA' } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#8899AA' }, min: 0, max: 100 }
      }
    }
  });
}

function renderTriggersList(containerId, triggers) {
  const el = document.getElementById(containerId);
  if (!triggers || triggers.length === 0) {
    el.innerHTML = '<p style="color:var(--text3);font-size:.85rem;text-align:center;padding:20px">No active triggers</p>';
    return;
  }
  el.innerHTML = triggers.slice(0,5).map(t => `
    <div class="trigger-item">
      <div class="trigger-dot ${t.type}"></div>
      <div class="trigger-info">
        <div class="trigger-title">${t.description}</div>
        <div class="trigger-meta">${t.city} • ${t.affectedWorkers} workers • ₹${(t.totalPayout||0).toLocaleString('en-IN')} payout pool</div>
      </div>
      <span class="trigger-badge ${t.status}">${t.status}</span>
      <span class="trigger-badge ${t.severity}">${t.severity}</span>
    </div>`).join('');
}

function renderPayoutsList(containerId, payouts) {
  const el = document.getElementById(containerId);
  if (!payouts || payouts.length === 0) {
    el.innerHTML = '<p style="color:var(--text3);font-size:.85rem;text-align:center;padding:20px">No payouts yet</p>';
    return;
  }
  el.innerHTML = payouts.map(p => `
    <div class="payout-item">
      <div class="payout-left">
        <div class="payout-txn">${p.txnId} • ${p.triggerType?.toUpperCase() || 'N/A'}</div>
        <div class="payout-date">${new Date(p.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</div>
      </div>
      <div class="payout-amount ${p.status}">₹${p.amount.toLocaleString('en-IN')}</div>
    </div>`).join('');
}

/* ─── Admin ─────────────────────────────────────────────── */
async function loadAdmin() {
  try {
    const [analytics, workers, payouts] = await Promise.all([
      get('/analytics/admin'),
      get('/admin/workers'),
      get('/admin/payouts')
    ]);

    if (analytics.success) {
      const o = analytics.overview;
      document.getElementById('adWorkers').textContent = o.totalWorkers;
      document.getElementById('adPolicies').textContent = o.activePolicies;
      document.getElementById('adPayouts').textContent = `₹${(o.totalPayouts||0).toLocaleString('en-IN')}`;
      document.getElementById('adFraud').textContent = o.fraudCases;
      renderTriggersList('adminTriggersList', o.recentTriggers || []);
    }

    if (workers.success) {
      document.getElementById('adminWorkersList').innerHTML = `
        <table><thead><tr><th>Name</th><th>Mobile</th><th>City</th><th>Platform</th><th>KYC</th><th>Policy</th></tr></thead>
        <tbody>${workers.workers.map(w => `
          <tr>
            <td>${w.name}</td><td>${w.mobile}</td>
            <td>${w.city||'—'}</td><td>${w.platform||'—'}</td>
            <td><span class="badge ${w.kycStatus==='verified'?'verified':'pending'}">${w.kycStatus}</span></td>
            <td><span class="badge ${w.activePolicy?'active':'pending'}">${w.activePolicy?w.activePolicy.tier:'none'}</span></td>
          </tr>`).join('')}
        </tbody></table>`;
    }

    if (payouts.success) {
      document.getElementById('adminPayoutsList').innerHTML = `
        <table><thead><tr><th>TXN ID</th><th>Worker</th><th>Amount</th><th>Trigger</th><th>City</th><th>Status</th></tr></thead>
        <tbody>${payouts.payouts.map(p => `
          <tr>
            <td style="font-size:.78rem">${p.txnId}</td>
            <td>${p.worker?.name||'—'}</td>
            <td>₹${p.amount.toLocaleString('en-IN')}</td>
            <td>${p.triggerType||'—'}</td>
            <td>${p.city||'—'}</td>
            <td><span class="badge ${p.status}">${p.status}</span></td>
          </tr>`).join('')}
        </tbody></table>`;
    }
  } catch (e) { toast('Failed to load admin panel', 'error'); }
}

/* ─── Ticker ────────────────────────────────────────────── */
async function loadTicker() {
  try {
    const res = await get('/triggers/active');
    if (res.success && res.triggers.length > 0) {
      const text = res.triggers.map(t => `⚡ ${t.type.toUpperCase()} in ${t.city} — ${t.description}`).join('   ·   ');
      document.getElementById('tickerTrack').textContent = text;
    }
  } catch (e) {}
}

/* ─── Simulate ──────────────────────────────────────────── */
async function simulateTrigger() {
  try {
    const res = await get('/triggers/simulate');
    if (res.success) {
      toast(`Trigger fired: ${res.trigger.type.toUpperCase()} in ${res.trigger.city}`, 'success');
      loadDashboard();
    }
  } catch (e) { toast('Simulation failed', 'error'); }
}

/* ─── HTTP Helpers ──────────────────────────────────────── */
const headers = () => {
  const h = { 'Content-Type': 'application/json' };
  if (STATE.token) h['Authorization'] = `Bearer ${STATE.token}`;
  return h;
};
const get = async (path) => (await fetch(API + path, { headers: headers() })).json();
const post = async (path, body) => (await fetch(API + path, { method: 'POST', headers: headers(), body: JSON.stringify(body) })).json();
const put = async (path, body) => (await fetch(API + path, { method: 'PUT', headers: headers(), body: JSON.stringify(body) })).json();

/* ─── Toast ─────────────────────────────────────────────── */
let toastTimer;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'toast hidden'; }, 3200);
}
