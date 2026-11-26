// Inline SVG charts, drawn from the numbers in data.js. No library and no network:
// each function returns an SVG string the views drop into the page.

const INK = '#22304a';
const FAINT = '#8a94a6';
const GRID = '#e3e7ee';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 1.5 ? 1.5 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 3 ? 3 : n <= 4 ? 4 : n <= 5 ? 5 : n <= 6 ? 6 : n <= 8 ? 8 : 10) * p;
}

// Shared vertical scale for the line and bar charts: a "nice" ceiling for the largest
// value, a y(value) projector, and the five gridlines with their tick labels.
// Both charts used to build these inline; one helper keeps their axes identical.
function yAxis(values, { padL, padR, padT, padB, w, h }) {
  const yMax = niceMax(Math.max(...values) * 1.05);
  const Y = v => padT + (1 - v / yMax) * (h - padT - padB);
  let grid = '';
  for (let i = 0; i <= 4; i++) {
    const v = yMax * i / 4, y = Y(v);
    grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="${GRID}"/>`;
    grid += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" class="tick">${Math.round(v * 10) / 10}</text>`;
  }
  return { yMax, Y, grid };
}

// A line chart of [x, y] points. options: { w, h, color, unit, yLabel, dashedFrom (index where a
// second, dashed series starts, sharing points), area }
export function lineChart(points, opts = {}) {
  const w = opts.w ?? 720, h = opts.h ?? 300;
  const padL = 46, padR = 14, padT = 14, padB = 28;
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const { Y, grid } = yAxis(ys, { padL, padR, padT, padB, w, h });
  const X = x => padL + (x - x0) / (x1 - x0) * (w - padL - padR);
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="${esc(opts.aria ?? 'line chart')}">`;
  s += grid;
  const step = Math.ceil(xs.length / 6);
  xs.forEach((x, i) => {
    if (i % step === 0 || i === xs.length - 1) s += `<text x="${X(x)}" y="${h - 8}" text-anchor="middle" class="tick">${x}</text>`;
  });
  const path = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
  if (opts.area) {
    s += `<path d="${path(points)} L${X(x1)},${Y(0)} L${X(x0)},${Y(0)} Z" fill="${opts.color}" opacity="0.10"/>`;
  }
  const split = opts.dashedFrom ?? points.length;
  s += `<path d="${path(points.slice(0, split + 1))}" fill="none" stroke="${opts.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (split < points.length) {
    s += `<path d="${path(points.slice(split))}" fill="none" stroke="${opts.color}" stroke-width="2.5" stroke-dasharray="6 5" stroke-linejoin="round"/>`;
  }
  const last = points[points.length - 1];
  s += `<circle cx="${X(last[0])}" cy="${Y(last[1])}" r="4" fill="${opts.color}"/>`;
  s += `<text x="${X(last[0]) - 6}" y="${Y(last[1]) - 10}" text-anchor="end" class="chart-end">${esc(opts.endLabel ?? `${last[1]}${opts.unit ?? ''}`)}</text>`;
  if (opts.yLabel) s += `<text x="${padL}" y="${padT + 2}" class="chart-note">${esc(opts.yLabel)}</text>`;
  return s + '</svg>';
}

// Vertical bars for [label, value] pairs.
export function barChart(rows, opts = {}) {
  const w = opts.w ?? 720, h = opts.h ?? 300;
  const padL = 46, padR = 14, padT = 20, padB = 40;
  const { Y, grid } = yAxis(rows.map(r => r[1]), { padL, padR, padT, padB, w, h });
  const X = i => padL + i * (w - padL - padR) / rows.length;
  const bw = (w - padL - padR) / rows.length * 0.62;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="${esc(opts.aria ?? 'bar chart')}">`;
  s += grid;
  rows.forEach((r, i) => {
    const x = X(i) + ((w - padL - padR) / rows.length - bw) / 2;
    s += `<rect x="${x}" y="${Y(r[1])}" width="${bw}" height="${Y(0) - Y(r[1])}" rx="3" fill="${r[2] ?? opts.color}"/>`;
    s += `<text x="${x + bw / 2}" y="${Y(r[1]) - 5}" text-anchor="middle" class="bar-val">${r[1]}</text>`;
    s += `<text x="${x + bw / 2}" y="${h - 22}" text-anchor="middle" class="tick">${esc(r[0])}</text>`;
    if (r[3]) s += `<text x="${x + bw / 2}" y="${h - 8}" text-anchor="middle" class="tick">${esc(r[3])}</text>`;
  });
  return s + '</svg>';
}

// A population pyramid: groups are [label, male, female] in millions.
export function pyramidChart(groups, opts = {}) {
  const w = opts.w ?? 720, rowH = 21, h = groups.length * rowH + 34;
  const mid = w / 2, gutter = 26; // half-width of the centre column that carries the age labels
  const maxV = niceMax(Math.max(...groups.flatMap(g => [g[1], g[2]])));
  const scale = (mid - gutter - 52) / maxV;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="Population pyramid">`;
  s += `<text x="${mid - gutter - 4}" y="14" text-anchor="end" class="pyr-head" fill="#2f6fb2">Male</text>`;
  s += `<text x="${mid + gutter + 4}" y="14" class="pyr-head" fill="#c2436b">Female</text>`;
  s += `<text x="${mid}" y="14" text-anchor="middle" class="pyr-head">Age</text>`;
  groups.forEach((g, i) => {
    const y = 24 + i * rowH, bh = rowH - 5, ty = y + bh - 4;
    s += `<rect x="${mid - gutter - g[1] * scale}" y="${y}" width="${g[1] * scale}" height="${bh}" rx="2" fill="#2f6fb2"/>`;
    s += `<rect x="${mid + gutter}" y="${y}" width="${g[2] * scale}" height="${bh}" rx="2" fill="#c2436b"/>`;
    s += `<text x="${mid - gutter - g[1] * scale - 5}" y="${ty}" text-anchor="end" class="tick">${g[1]}</text>`;
    s += `<text x="${mid + gutter + g[2] * scale + 5}" y="${ty}" class="tick">${g[2]}</text>`;
    s += `<text x="${mid}" y="${ty}" text-anchor="middle" class="tick">${g[0]}</text>`;
  });
  return s + '</svg>';
}

// Horizontal 100% stacked share bar for one year of AGE_SHARES-style data.
export function shareBar(shares, labels, colors) {
  const w = 720, h = 64;
  let x = 0, s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="Age shares">`;
  shares.forEach((v, i) => {
    const bw = v / 100 * w;
    s += `<rect x="${x}" y="6" width="${Math.max(bw - 2, 0)}" height="26" rx="4" fill="${colors[i]}"/>`;
    s += `<text x="${x + bw / 2}" y="52" text-anchor="middle" class="share-lab">${esc(labels[i])} ${v}%</text>`;
    x += bw;
  });
  return s + '</svg>';
}

export const PALETTE = { ink: INK, blue: '#2f6fb2', red: '#bc002d', teal: '#1f8a70', amber: '#d98e04', grey: FAINT };
