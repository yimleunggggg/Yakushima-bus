/** 区块插画分隔 — 与站点主色一致的内联 SVG */
const SectionDivider = {
  svg(kind) {
    const art = {
      bus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 40" fill="none" aria-hidden="true">
        <path fill="currentColor" opacity="0.12" d="M4 28h88v6H4z"/>
        <rect x="10" y="12" width="58" height="18" rx="5" fill="currentColor" opacity="0.22"/>
        <rect x="14" y="15" width="22" height="10" rx="2" fill="#fff" opacity="0.55"/>
        <rect x="40" y="15" width="22" height="10" rx="2" fill="#fff" opacity="0.4"/>
        <circle cx="22" cy="32" r="5" fill="currentColor" opacity="0.35"/>
        <circle cx="22" cy="32" r="2.5" fill="#fff" opacity="0.7"/>
        <circle cx="58" cy="32" r="5" fill="currentColor" opacity="0.35"/>
        <circle cx="58" cy="32" r="2.5" fill="#fff" opacity="0.7"/>
        <path d="M68 18h14l6 8h-8l-2-8z" fill="currentColor" opacity="0.3"/>
        <circle cx="78" cy="10" r="3" fill="currentColor" opacity="0.2"/>
      </svg>`,
      jetfoil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 40" fill="none" aria-hidden="true">
        <path fill="currentColor" opacity="0.1" d="M0 30c20-4 40-3 60-1 24 3 36 2 36 2v6H0z"/>
        <path d="M8 26l52-8 20 6-6 10H14l-6-8z" fill="currentColor" opacity="0.28"/>
        <path d="M58 14l18 4-4 8-14-4 0-8z" fill="currentColor" opacity="0.18"/>
        <rect x="22" y="20" width="18" height="5" rx="1.5" fill="#fff" opacity="0.45"/>
        <path d="M70 22h10l4 4H72z" fill="currentColor" opacity="0.35"/>
        <path stroke="currentColor" stroke-width="1.2" opacity="0.25" d="M12 28h44"/>
      </svg>`,
      ferry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 40" fill="none" aria-hidden="true">
        <path fill="currentColor" opacity="0.1" d="M0 31c24-2 48-1 72 1 16 2 24 1 24 1v6H0z"/>
        <path d="M12 24h52l8 10H16l-4-10z" fill="currentColor" opacity="0.26"/>
        <rect x="28" y="14" width="8" height="12" rx="1" fill="currentColor" opacity="0.2"/>
        <rect x="40" y="10" width="8" height="16" rx="1" fill="currentColor" opacity="0.24"/>
        <rect x="52" y="16" width="8" height="10" rx="1" fill="currentColor" opacity="0.18"/>
        <path d="M20 24l-6 8M76 24l6 8" stroke="currentColor" stroke-width="1.5" opacity="0.2" stroke-linecap="round"/>
        <ellipse cx="48" cy="33" rx="20" ry="2" fill="currentColor" opacity="0.08"/>
      </svg>`,
    };
    return art[kind] || art.bus;
  },

  html(kind, label) {
    const safe = String(label || "").replace(/</g, "&lt;");
    return `<div class="scene-divider scene-divider--${kind}" role="presentation" aria-hidden="true">
      <span class="scene-divider-line" aria-hidden="true"></span>
      <span class="scene-divider-core">
        <span class="scene-divider-art">${this.svg(kind)}</span>
        ${safe ? `<span class="scene-divider-label">${safe}</span>` : ""}
      </span>
      <span class="scene-divider-line" aria-hidden="true"></span>
    </div>`;
  },
};
