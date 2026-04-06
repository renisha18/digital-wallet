/* ══════════════════════════════════════════
   wallet.js — API calls & shared helpers
   Base URL: http://localhost:3000
   ══════════════════════════════════════════ */

const API = 'http://localhost:3002';

/* ── Storage helpers ── */
const store = {
  get: (k)       => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v)    => localStorage.setItem(k, JSON.stringify(v)),
  remove: (k)    => localStorage.removeItem(k),
  clear: ()      => localStorage.clear(),
};

/* ── Auth guard: redirect to login if not authenticated ── */
function requireAuth() {
  const userId = store.get('userId');
  if (!userId) {
    window.location.href = 'login.html';
    return null;
  }
  return userId;
}

/* ── Logout ── */
function logout() {
  store.clear();
  window.location.href = 'login.html';
}

/* ── Generic fetch wrapper ── */
async function apiFetch(endpoint, options = {}) {
  const url = API + endpoint;
  const config = {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }

  return data;
}

/* ── API methods ── */
const API_CALLS = {

  /* POST /login — { userId, password } → { token?, user? } */
  async login(userId, password) {
  return apiFetch('/login', {
    method: 'POST',
    body: { id: Number(userId), password },
  });
},

  /* GET /balance/:id → { balance } */
  async getBalance(userId) {
    return apiFetch(`/balance/${encodeURIComponent(userId)}`);
  },

  /* POST /send — { senderId, receiverId, amount } → { message, balance? } */
  async sendMoney(senderId, receiverId, amount) {
  return apiFetch('/send', {
    method: 'POST',
    body: {
      fromUser: Number(senderId),
      toUser: Number(receiverId),
      amount: parseFloat(amount)
    },
  });
},

  /* GET /transactions?userId=... → [ {id, sender, receiver, amount, timestamp} ] */
  async getTransactions(userId) {
    return apiFetch(`/transactions?userId=${encodeURIComponent(userId)}`);
  },
};

/* ── UI Helpers ── */

/** Show a dismissable alert inside a container element */
function showAlert(container, message, type = 'info') {
  // type: 'success' | 'error' | 'info'
  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };

  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  el.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;

  // Clear existing alerts
  const old = container.querySelector('.alert');
  if (old) old.remove();

  container.prepend(el);

  // Auto-dismiss after 4s
  setTimeout(() => el.remove(), 4000);
}

/** Show loading state on a button */
function btnLoading(btn, loading = true) {
  if (loading) {
    btn._text = btn.innerHTML;
    btn.innerHTML = `<span class="loader" style="width:20px;height:20px;border-width:2.5px"></span>`;
    btn.disabled = true;
  } else {
    btn.innerHTML = btn._text || btn.innerHTML;
    btn.disabled = false;
  }
}

/** Format a number as currency */
function formatCurrency(amount, symbol = '₹') {
  return `${symbol}${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a date string nicely */
function formatDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;

  if (diff < 60000)   return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Get initials from a userId */
function getInitials(id = '') {
  return (id || 'U').slice(0, 2).toUpperCase();
}

/** Inject a navbar into the page */
function injectNavbar({ title = '', showBack = false, showAvatar = true } = {}) {
  const userId = store.get('userId') || '';
  const nav = document.getElementById('navbar');
  if (!nav) return;

  nav.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px">
      ${showBack
        ? `<button class="nav-back" onclick="history.back()">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
           </button>`
        : `<a href="dashboard.html" class="nav-logo">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 48 48" fill="none">
               <rect width="48" height="48" rx="14" fill="#1A73E8"/>
               <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="22" font-weight="700" font-family="Space Grotesk,sans-serif">W</text>
             </svg>
             WalletX
           </a>`
      }
      ${title ? `<span class="nav-title">${title}</span>` : ''}
    </div>
    ${showAvatar
      ? `<div class="nav-avatar" title="${userId}" onclick="if(confirm('Logout?'))logout()">${getInitials(userId)}</div>`
      : '<span></span>'
    }
  `;
}

/** Inject bottom navigation */
function injectBottomNav(active = 'dashboard') {
  const bn = document.getElementById('bottom-nav');
  if (!bn) return;

  const items = [
    { id: 'dashboard',    href: 'dashboard.html',    label: 'Home',    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
    { id: 'send',         href: 'send.html',         label: 'Send',    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>` },
    { id: 'transactions', href: 'transactions.html', label: 'History', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>` },
  ];

  bn.innerHTML = items.map(i => `
    <a href="${i.href}" class="bn-item ${active === i.id ? 'active' : ''}">
      ${i.icon}
      <span>${i.label}</span>
    </a>
  `).join('');
}