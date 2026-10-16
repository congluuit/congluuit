// Generate Matrix-rain SVG banners matching nanodev.io.vn hero style.
// Chars + palette mirror src/components/MatrixRain.tsx.
// Usage: node gen-banner.mjs  (run from this folder; writes ./assets/*.svg)
import { writeFileSync } from "fs";

const CHARS = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃ0123456789<>/{}$#";
const BG = "#05060f";
const ACCENT = "#39ff6a";
const ACCENT_STRONG = "#7dff9e";
const HEAD = "#eafff0";
const MUTED = "#a4a8c0";
const FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

const rnd = (a, b) => a + Math.random() * (b - a);
const esc = (c) => c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c;
const pick = () => esc(CHARS[Math.floor(Math.random() * CHARS.length)]);

// One falling stream: head char at y=0, trail above (negative y).
// calcMode="discrete" steps row-by-row like the canvas version.
function stream(x, H, fs) {
  const len = 6 + Math.floor(rnd(0, 11));
  const travel = H + len * fs + 60;
  const steps = Math.ceil(travel / fs);
  const dur = (steps * rnd(0.07, 0.13)).toFixed(2);
  const begin = (-rnd(0, 14)).toFixed(2);
  const values = Array.from({ length: steps + 1 }, (_, i) => `0 ${i * fs}`).join(";");

  let tspans = "";
  for (let j = len - 1; j >= 0; j--) {
    let fill = ACCENT, op = Math.max(0.08, 0.72 - j * 0.06);
    if (j === 0) { fill = HEAD; op = 1; }
    else if (j === 1) { fill = ACCENT_STRONG; op = 0.95; }
    tspans += `<tspan x="${x}" y="${-j * fs}" fill="${fill}" fill-opacity="${op.toFixed(2)}">${pick()}</tspan>`;
  }
  return `<text font-family="${FONT}" font-size="${fs}">${tspans}<animateTransform attributeName="transform" type="translate" calcMode="discrete" values="${values}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></text>`;
}

// Static faint column (fallback + depth layer, no animation)
function staticCol(x, H, fs, maxOp) {
  const len = 5 + Math.floor(rnd(0, 10));
  const y0 = Math.floor(rnd(-40, H));
  let t = "";
  for (let j = 0; j < len; j++) {
    const y = y0 + j * fs;
    if (y > H + fs) break;
    const fade = 1 - j / len;
    const fill = j === 0 ? HEAD : ACCENT;
    const op = (0.06 + fade * maxOp).toFixed(2);
    t += `<tspan x="${x}" y="${y}" fill="${fill}" fill-opacity="${op}">${pick()}</tspan>`;
  }
  return `<text font-family="${FONT}" font-size="${fs}">${t}</text>`;
}

function rain(W, H, { fs = 16, step = 22, animOp = 1 } = {}) {
  let s = "", a = "";
  for (let x = 10; x < W - 4; x += step) {
    const r = Math.random();
    if (r < 0.35) s += staticCol(x, H, fs, 0.3);
    else if (r < 0.85) a += stream(x, H, fs);
  }
  return `<g opacity="${animOp}">${s}${a}</g>`;
}

const vignette = (id) =>
  `<radialGradient id="${id}" cx="50%" cy="50%" r="72%"><stop offset="0%" stop-color="${BG}" stop-opacity="0.15"/><stop offset="78%" stop-color="${BG}" stop-opacity="0.9"/></radialGradient>`;

const glow =
  `<filter id="glow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="${ACCENT}" flood-opacity="0.55"/></filter>`;

// ----------------------------- header.svg -----------------------------
const W = 1200, H = 300;
const header = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lưu Đức Thành Công - NANO - Technical Lead">
  <defs>${vignette("vig")}${glow}</defs>
  <rect width="${W}" height="${H}" rx="14" fill="${BG}"/>
  ${rain(W, H)}
  <rect width="${W}" height="${H}" rx="14" fill="url(#vig)"/>
  <text x="600" y="105" text-anchor="middle" font-family="${FONT}" font-size="16" fill="${MUTED}" letter-spacing="1">// accessing profile…</text>
  <text x="600" y="160" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="54" font-weight="800" fill="#ffffff" letter-spacing="2" filter="url(#glow)">LƯU ĐỨC THÀNH CÔNG</text>
  <text x="600" y="200" text-anchor="middle" font-family="${FONT}" font-size="18" letter-spacing="1"><tspan fill="${MUTED}">aka </tspan><tspan fill="${ACCENT}" font-weight="700">Pret</tspan><tspan fill="${MUTED}"> · NANO · Technical Lead · Software Engineer</tspan></text>
</svg>`;

// ----------------------------- footer.svg -----------------------------
const W2 = 1200, H2 = 170;
const footer = `<svg width="${W2}" height="${H2}" viewBox="0 0 ${W2} ${H2}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Footer - Thanks for visiting">
  <defs>${vignette("vig2")}${glow}</defs>
  <rect width="${W2}" height="${H2}" rx="14" fill="${BG}"/>
  ${rain(W2, H2, { step: 26 })}
  <rect width="${W2}" height="${H2}" rx="14" fill="url(#vig2)"/>
  <text x="600" y="72" text-anchor="middle" font-family="${FONT}" font-size="15" fill="${MUTED}" letter-spacing="1">// end of transmission</text>
  <text x="600" y="108" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff" letter-spacing="2" filter="url(#glow)">Thanks for visiting</text>
  <text x="600" y="140" text-anchor="middle" font-family="${FONT}" font-size="15" fill="${ACCENT}" letter-spacing="2">nanodev.io.vn · github.com/congluuit</text>
</svg>`;

writeFileSync("assets/header.svg", header, "utf8");
writeFileSync("assets/footer.svg", footer, "utf8");
console.log("generated", header.length, footer.length);
