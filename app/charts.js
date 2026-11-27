// charts.js — hand-rolled SVG bar charts. One job: turn a list of labelled
// numbers into a readable horizontal bar chart. No library, no network, no
// images: the chart is plain SVG built from the data it is given.
'use strict';

// Escape text that goes into SVG so a country name can never break the markup.
export function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Format a number the way the site shows it: thousands separators, and at most
// one decimal place when the value is not whole.
export function fmtNum(value, decimals) {
  const places = decimals === undefined ? (Number.isInteger(value) ? 0 : 1) : decimals;
  return value.toLocaleString('en-US', {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  });
}

// Horizontal bar chart.
// rows: [{label, value, note}] — note is the small text shown after the value.
// opts: {width, barHeight, gap, barColor, highlightIndex, valueFormat}
export function barChart(rows, opts) {
  const o = opts || {};
  const width = o.width || 640;
  const barHeight = o.barHeight || 22;
  const gap = o.gap || 10;
  const labelWidth = o.labelWidth || 110;
  const valueWidth = o.valueWidth || 96;
  const barColor = o.barColor || '#0f766e';
  const highlightColor = o.highlightColor || '#b45309';
  const max = Math.max.apply(null, rows.map(function (r) { return r.value; }));
  const inner = width - labelWidth - valueWidth - 8;
  const height = rows.length * (barHeight + gap) + 8;
  const parts = [];
  parts.push('<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Bar chart">');
  rows.forEach(function (row, i) {
    const y = 8 + i * (barHeight + gap);
    const w = Math.max(2, Math.round((row.value / max) * inner));
    const color = i === o.highlightIndex ? highlightColor : barColor;
    const shown = o.valueFormat ? o.valueFormat(row.value) : fmtNum(row.value);
    parts.push('<text x="0" y="' + (y + 15) + '" class="chart-label">' + esc(row.label) + '</text>');
    parts.push('<rect x="' + labelWidth + '" y="' + y + '" width="' + w + '" height="' + barHeight + '" fill="' + color + '" rx="2"/>');
    parts.push('<text x="' + (labelWidth + w + 8) + '" y="' + (y + 15) + '" class="chart-value">' + esc(shown) + (row.note ? ' ' + esc(row.note) : '') + '</text>');
  });
  parts.push('</svg>');
  return parts.join('\n');
}

// A compact vertical column chart for a single country's indicators against
// the world average: two bars per indicator (country in teal, world in grey).
// rows: [{label, country, world, format}]
export function compareChart(rows, opts) {
  const o = opts || {};
  const width = o.width || 640;
  const rowHeight = o.rowHeight || 54;
  const labelWidth = o.labelWidth || 120;
  const valueWidth = o.valueWidth || 110;
  const inner = width - labelWidth - valueWidth - 8;
  const height = rows.length * rowHeight + 26;
  const parts = [];
  parts.push('<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Country versus world average">');
  parts.push('<rect x="' + labelWidth + '" y="4" width="12" height="12" fill="#0f766e"/>');
  parts.push('<text x="' + (labelWidth + 18) + '" y="14" class="chart-legend">Country</text>');
  parts.push('<rect x="' + (labelWidth + 84) + '" y="4" width="12" height="12" fill="#9ca3af"/>');
  parts.push('<text x="' + (labelWidth + 102) + '" y="14" class="chart-legend">World average</text>');
  rows.forEach(function (row, i) {
    const y = 26 + i * rowHeight;
    const top = Math.max(row.country, row.world);
    const cw = Math.max(2, Math.round((row.country / top) * inner));
    const ww = Math.max(2, Math.round((row.world / top) * inner));
    const f = row.format || fmtNum;
    parts.push('<text x="0" y="' + (y + 12) + '" class="chart-label">' + esc(row.label) + '</text>');
    parts.push('<rect x="' + labelWidth + '" y="' + y + '" width="' + cw + '" height="15" fill="#0f766e" rx="2"/>');
    parts.push('<text x="' + (labelWidth + cw + 8) + '" y="' + (y + 12) + '" class="chart-value">' + esc(f(row.country)) + '</text>');
    parts.push('<rect x="' + labelWidth + '" y="' + (y + 20) + '" width="' + ww + '" height="15" fill="#9ca3af" rx="2"/>');
    parts.push('<text x="' + (labelWidth + ww + 8) + '" y="' + (y + 32) + '" class="chart-value chart-world">' + esc(f(row.world)) + '</text>');
  });
  parts.push('</svg>');
  return parts.join('\n');
}
