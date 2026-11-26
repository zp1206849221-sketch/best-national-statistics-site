// Inline SVG charts, drawn from the numbers in data.js. No library, no network:
// every function returns an SVG string that the views drop straight into a page.
// The same vertical-scale helper backs the line and bar charts, so their axes
// always agree; the pyramid, share bar, donut and horizontal bars each have
// their own geometry, because their shapes have nothing in common.

const INK = '#22304a';
const FAINT = '#8a94a6';
const GRID = '#e3e7ee';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

// Pick a round ceiling just above the largest value: the axis steps are then
// 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8 or 10 times a power of ten.
function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const step = n <= 1 ? 1 : n <= 1.5 ? 1.5 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 3 ? 3
    : n <= 4 ? 4 : n <= 5 ? 5 : n <= 6 ? 6 : n <= 8 ? 8 : 10;
  return step * p;
}

// A shared vertical axis: a "nice" ceiling for the biggest value, a projector
// from value to pixel height, and the five horizontal gridlines with tick labels.
function yAxis(values, geom) {
  const { padL, padR, padT, padB, w, h } = geom;
  const yMax = niceMax(Math.max(...values) * 1.05);
  const Y = v => padT + (1 - v / yMax) * (h - padT - padB);
  let grid = '';
  for (let i = 0; i <= 4; i++) {
    const v = yMax * i / 4, y = Y(v);
    grid += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - padR}" y2="${y.toFixed(1)}" stroke="${GRID}"/>`;
    grid += `<text x="${padL - 6}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="tick">${Math.round(v * 10) / 10}</text>`;
  }
  return { yMax, Y, grid };
}

// A line chart of [x, y] points.
// options: { w, h, color, unit, yLabel, endLabel, aria, area, dashedFrom }.
// dashedFrom is the index where the solid line hands over to a dashed one —
// used for the population chart, where census gives way to projection.
export function lineChart(points, opts = {}) {
  const w = opts.w ?? 720, h = opts.h ?? 300;
  const padL = 46, padR = 14, padT = 14, padB = 28;
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const { Y, grid } = yAxis(ys, { padL, padR, padT, padB, w, h });
  const X = x => padL + (x - x0) / (x1 - x0) * (w - padL - padR);
  const trace = pts => pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');

  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="${esc(opts.aria ?? 'line chart')}">`;
  s += grid;
  // X tick labels: about six of them, evenly spaced — but never closer than
  // 48 px apart, so the last two points of a dense series (e.g. 2022 and 2023
  // in the emissions series) cannot print on top of each other.
  const step = Math.ceil(xs.length / 6);
  let lastLabelX = -Infinity;
  xs.forEach((x, i) => {
    const isLast = i === xs.length - 1;
    if ((i % step === 0 || isLast) && X(x) - lastLabelX >= 48) {
      s += `<text x="${X(x).toFixed(1)}" y="${h - 8}" text-anchor="middle" class="tick">${x}</text>`;
      lastLabelX = X(x);
    }
  });
  if (opts.area) {
    s += `<path d="${trace(points)} L${X(x1).toFixed(1)},${Y(0).toFixed(1)} L${X(x0).toFixed(1)},${Y(0).toFixed(1)} Z" fill="${opts.color}" opacity="0.10"/>`;
  }
  const split = opts.dashedFrom ?? points.length;
  s += `<path d="${trace(points.slice(0, split + 1))}" fill="none" stroke="${opts.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
  if (split < points.length) {
    s += `<path d="${trace(points.slice(split))}" fill="none" stroke="${opts.color}" stroke-width="2.5" stroke-dasharray="6 5" stroke-linejoin="round"/>`;
  }
  const last = points[points.length - 1];
  s += `<circle cx="${X(last[0]).toFixed(1)}" cy="${Y(last[1]).toFixed(1)}" r="4" fill="${opts.color}"/>`;
  s += `<text x="${(X(last[0]) - 6).toFixed(1)}" y="${(Y(last[1]) - 10).toFixed(1)}" text-anchor="end" class="chart-end">${esc(opts.endLabel ?? `${last[1]}${opts.unit ?? ''}`)}</text>`;
  if (opts.yLabel) s += `<text x="${padL}" y="${padT + 2}" class="chart-note">${esc(opts.yLabel)}</text>`;
  return s + '</svg>';
}

// Vertical bars for [label, value, color?, secondLine?] rows.
export function barChart(rows, opts = {}) {
  const w = opts.w ?? 720, h = opts.h ?? 300;
  const padL = 46, padR = 14, padT = 20, padB = 40;
  const { Y, grid } = yAxis(rows.map(r => r[1]), { padL, padR, padT, padB, w, h });
  const slot = (w - padL - padR) / rows.length;
  const bw = slot * 0.62;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="${esc(opts.aria ?? 'bar chart')}">`;
  s += grid;
  rows.forEach((r, i) => {
    const x = padL + i * slot + (slot - bw) / 2;
    s += `<rect x="${x.toFixed(1)}" y="${Y(r[1]).toFixed(1)}" width="${bw.toFixed(1)}" height="${(Y(0) - Y(r[1])).toFixed(1)}" rx="3" fill="${r[2] ?? opts.color}"/>`;
    s += `<text x="${(x + bw / 2).toFixed(1)}" y="${(Y(r[1]) - 5).toFixed(1)}" text-anchor="middle" class="bar-val">${r[1]}</text>`;
    s += `<text x="${(x + bw / 2).toFixed(1)}" y="${h - 22}" text-anchor="middle" class="tick">${esc(r[0])}</text>`;
    if (r[3]) s += `<text x="${(x + bw / 2).toFixed(1)}" y="${h - 8}" text-anchor="middle" class="tick">${esc(r[3])}</text>`;
  });
  return s + '</svg>';
}

// A population pyramid: groups are [label, male, female] in millions, youngest
// first. Men grow left from the centre column, women right; the age label sits
// in the middle so the two halves can be compared at a glance.
export function pyramidChart(groups, opts = {}) {
  const w = opts.w ?? 720, rowH = 21, h = groups.length * rowH + 34;
  const mid = w / 2, gutter = 26;
  const maxV = niceMax(Math.max(...groups.flatMap(g => [g[1], g[2]])));
  const scale = (mid - gutter - 52) / maxV;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="Population pyramid">`;
  s += `<text x="${mid - gutter - 4}" y="14" text-anchor="end" class="pyr-head" fill="#2f6fb2">Male</text>`;
  s += `<text x="${mid + gutter + 4}" y="14" class="pyr-head" fill="#c2436b">Female</text>`;
  s += `<text x="${mid}" y="14" text-anchor="middle" class="pyr-head">Age</text>`;
  groups.forEach((g, i) => {
    const y = 24 + i * rowH, bh = rowH - 5, ty = y + bh - 4;
    s += `<rect x="${(mid - gutter - g[1] * scale).toFixed(1)}" y="${y}" width="${(g[1] * scale).toFixed(1)}" height="${bh}" rx="2" fill="#2f6fb2"/>`;
    s += `<rect x="${mid + gutter}" y="${y}" width="${(g[2] * scale).toFixed(1)}" height="${bh}" rx="2" fill="#c2436b"/>`;
    s += `<text x="${(mid - gutter - g[1] * scale - 5).toFixed(1)}" y="${ty}" text-anchor="end" class="tick">${g[1]}</text>`;
    s += `<text x="${(mid + gutter + g[2] * scale + 5).toFixed(1)}" y="${ty}" class="tick">${g[2]}</text>`;
    s += `<text x="${mid}" y="${ty}" text-anchor="middle" class="tick">${g[0]}</text>`;
  });
  return s + '</svg>';
}

// A horizontal 100% stacked share bar for one year of AGE_SHARES-style data:
// three coloured segments with their labels underneath.
export function shareBar(shares, labels, colors) {
  const w = 720, h = 64;
  let x = 0;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="Age shares">`;
  shares.forEach((v, i) => {
    const bw = v / 100 * w;
    s += `<rect x="${x.toFixed(1)}" y="6" width="${Math.max(bw - 2, 0).toFixed(1)}" height="26" rx="4" fill="${colors[i]}"/>`;
    s += `<text x="${(x + bw / 2).toFixed(1)}" y="52" text-anchor="middle" class="share-lab">${esc(labels[i])} ${v}%</text>`;
    x += bw;
  });
  return s + '</svg>';
}

// A donut chart for [label, value, color] rows, with the total in the middle.
// Values are normalised to the sum of what is passed, so shares that were
// published rounded (and add to slightly more or less than 100) still draw a
// complete ring; the legend next to the chart shows the published numbers.
export function donutChart(rows, opts = {}) {
  const w = opts.w ?? 340, h = opts.h ?? 340;
  const cx = w / 2, cy = h / 2, rOuter = Math.min(w, h) / 2 - 8, rInner = rOuter * 0.62;
  const total = rows.reduce((a, r) => a + r[1], 0);
  const polar = (angle, r) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart donut" aria-label="${esc(opts.aria ?? 'donut chart')}">`;
  let angle = -Math.PI / 2;
  rows.forEach(([label, value, color]) => {
    const sweep = value / total * Math.PI * 2;
    if (sweep <= 0) return;
    const [x1, y1] = polar(angle, rOuter);
    const [x2, y2] = polar(angle + sweep, rOuter);
    const [x3, y3] = polar(angle + sweep, rInner);
    const [x4, y4] = polar(angle, rInner);
    const large = sweep > Math.PI ? 1 : 0;
    s += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${rOuter},${rOuter} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} A${rInner},${rInner} 0 ${large} 0 ${x4.toFixed(1)},${y4.toFixed(1)} Z" fill="${color}"><title>${esc(label)} ${value}%</title></path>`;
    angle += sweep;
  });
  s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${esc(opts.centreTop ?? '')}</text>`;
  s += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-sub">${esc(opts.centreBottom ?? '')}</text>`;
  return s + '</svg>';
}

// A legend for a donut or any coloured series: a swatch, a label and a value
// per row, laid out as a plain list so it stays readable on a narrow screen.
export function legendList(rows, valueSuffix = '%') {
  return `<ul class="legend">${rows.map(([label, value, color]) =>
    `<li><span class="legend-swatch" style="background:${color}"></span>${esc(label)}<strong>${value}${valueSuffix}</strong></li>`).join('')}</ul>`;
}

// Horizontal bars for [label, value, color] rows — the right shape when the
// labels are long (country names) or there are only a few rows to compare.
export function hbarChart(rows, opts = {}) {
  const w = opts.w ?? 720, rowH = 40, padL = 118, padR = 64, padT = 8;
  const h = rows.length * rowH + padT + 12;
  const maxV = niceMax(Math.max(...rows.map(r => r[1])));
  const bw = v => (w - padL - padR) * v / maxV;
  let s = `<svg viewBox="0 0 ${w} ${h}" role="img" class="chart" aria-label="${esc(opts.aria ?? 'horizontal bar chart')}">`;
  rows.forEach((r, i) => {
    const y = padT + i * rowH;
    s += `<text x="${padL - 10}" y="${y + 22}" text-anchor="end" class="hbar-lab">${esc(r[0])}</text>`;
    s += `<rect x="${padL}" y="${y + 8}" width="${Math.max(bw(r[1]), 2).toFixed(1)}" height="20" rx="3" fill="${r[2] ?? opts.color}"/>`;
    s += `<text x="${(padL + bw(r[1]) + 8).toFixed(1)}" y="${y + 23}" class="bar-val">${r[1]}${opts.unit ?? ''}</text>`;
  });
  return s + '</svg>';
}

export const PALETTE = { ink: INK, blue: '#2f6fb2', red: '#bc002d', teal: '#1f8a70', amber: '#d98e04', purple: '#7a4a9e', grey: FAINT };
