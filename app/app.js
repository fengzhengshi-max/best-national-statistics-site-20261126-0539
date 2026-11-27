// app.js — NationScope routing and rendering. One job: take the dataset from
// data.js and turn it into the four hash-routed pages of the site.
// Routes: #/ (home), #/country/XXX (detail), #/indicators, #/sources.
import { COUNTRIES, INDICATORS, FIELDS, WORLD } from './data.js';
import { barChart, compareChart, fmtNum } from './charts.js';

const mount = document.getElementById('main');
const SOURCE_LINE = 'World Bank WDI, 2023';

// Turn a compact row array into an object keyed by field name.
function asObject(row) {
  const out = {};
  FIELDS.forEach(function (key, i) { out[key] = row[i]; });
  return out;
}
const DATA = COUNTRIES.map(asObject);
const BY_CODE = {};
DATA.forEach(function (c) { BY_CODE[c.code] = c; });

// A country's rank (1 = largest) by a given indicator, highest first.
function rankOf(code, key) {
  const sorted = DATA.slice().sort(function (a, b) { return b[key] - a[key]; });
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].code === code) return i + 1;
  }
  return null;
}

// Format one cell value for its indicator: population in millions, GDP in
// billions, everything else as stored. The unit is always shown next to it.
function cellValue(country, key) {
  if (key === 'pop') return fmtNum(country.pop) + ' m';
  if (key === 'gdp') return '$' + fmtNum(country.gdp) + ' bn';
  if (key === 'gdppc') return '$' + fmtNum(country.gdppc);
  if (key === 'co2') return fmtNum(country.co2, 1) + ' t';
  if (key === 'area') return fmtNum(country.area) + ' km²';
  if (key === 'internet') return fmtNum(country.internet) + '%';
  if (key === 'life') return fmtNum(country.life, 1) + ' yrs';
  if (key === 'school') return fmtNum(country.school, 1) + ' yrs';
  return fmtNum(country[key]);
}

// ---------- Home page ----------
let homeState = { sortKey: 'pop', sortDir: -1, query: '', indicator: 'pop' };

function renderHome() {
  const ind = INDICATORS.find(function (x) { return x.key === homeState.indicator; });
  const q = homeState.query.trim().toLowerCase();
  let rows = DATA.filter(function (c) {
    return !q || c.name.toLowerCase().indexOf(q) !== -1 || c.region.toLowerCase().indexOf(q) !== -1;
  });
  rows = rows.slice().sort(function (a, b) {
    const d = (a[homeState.sortKey] - b[homeState.sortKey]) * homeState.sortDir;
    return d !== 0 ? d : a.name.localeCompare(b.name);
  });
  const top10 = DATA.slice().sort(function (a, b) { return b[homeState.indicator] - a[homeState.indicator]; }).slice(0, 10);

  const head = INDICATORS.map(function (x) {
    const arrow = homeState.sortKey === x.key ? (homeState.sortDir === -1 ? ' ▼' : ' ▲') : '';
    return '<th><button class="sort-btn" data-sort="' + x.key + '">' + x.label + arrow + '</button></th>';
  }).join('');

  const body = rows.map(function (c, i) {
    const cells = INDICATORS.map(function (x) {
      const rank = rankOf(c.code, x.key);
      const leader = rank === 1 ? ' class="leader"' : '';
      return '<td' + leader + '>' + cellValue(c, x.key) + '</td>';
    }).join('');
    return '<tr><td>' + (i + 1) + '</td><td><a href="#/country/' + c.code + '">' + c.name + '</a></td><td>' + c.region + '</td>' + cells + '</tr>';
  }).join('');

  const chartRows = top10.map(function (c) {
    return { label: c.name, value: c[homeState.indicator] };
  });
  const chart = barChart(chartRows, {
    width: 640, highlightIndex: 0,
    valueFormat: function (v) { return cellValue({ pop: v, gdp: v, gdppc: v, life: v, school: v, internet: v, co2: v, area: v }, homeState.indicator); },
  });

  mount.innerHTML =
    '<section class="summary-strip" aria-label="World totals">' +
    '<div><strong>' + fmtNum(WORLD.pop) + ' m</strong><span>World population · ' + SOURCE_LINE + '</span></div>' +
    '<div><strong>$' + fmtNum(WORLD.gdp) + ' bn</strong><span>World GDP · ' + SOURCE_LINE + '</span></div>' +
    '<div><strong>$' + fmtNum(WORLD.gdppc) + '</strong><span>World GDP per capita · ' + SOURCE_LINE + '</span></div>' +
    '<div><strong>' + fmtNum(WORLD.life, 1) + ' yrs</strong><span>World life expectancy · ' + SOURCE_LINE + '</span></div>' +
    '<div><strong>' + WORLD.countries + '</strong><span>Countries in the World Bank database</span></div>' +
    '</section>' +
    '<section class="intro"><h1>The 30 most populous countries, ranked</h1>' +
    '<p>Eight indicators for the thirty largest countries by population — population, economy, health, ' +
    'education, connectivity, emissions and land. Every figure comes from the World Bank’s World Development ' +
    'Indicators, reference year 2023 (CO2: 2021, the latest published year). Click a column heading to sort, ' +
    'type to filter, or pick an indicator to re-rank the table and the chart.</p></section>' +
    '<section class="controls">' +
    '<label>Rank by <select id="indicator-select">' +
    INDICATORS.map(function (x) {
      return '<option value="' + x.key + '"' + (x.key === homeState.indicator ? ' selected' : '') + '>' + x.label + '</option>';
    }).join('') +
    '</select></label>' +
    '<label>Search <input id="search" type="search" placeholder="Country or region…" value="' + homeState.query.replace(/"/g, '&quot;') + '"></label>' +
    '<p class="showing">' + rows.length + ' of 30 countries shown · ranked by ' + ind.label + ' · Source: ' + ind.source + ', ' + ind.year + '</p>' +
    '</section>' +
    '<section class="chart-box"><h2>Top 10 by ' + ind.label + ' (' + ind.unit + ')</h2>' + chart +
    '<p class="source-note">Source: ' + ind.source + ', ' + ind.year + '. The amber bar is the leader.</p></section>' +
    '<section class="table-wrap"><table class="rank-table"><thead><tr><th>#</th><th>Country</th><th>Region</th>' + head + '</tr></thead>' +
    '<tbody>' + (body || '<tr><td colspan="11">No country matches your search.</td></tr>') + '</tbody></table>' +
    '<p class="source-note">All figures: ' + SOURCE_LINE + ' (CO2 per capita: World Bank WDI, 2021). Amber cells mark the world leader in that column.</p></section>';

  document.querySelectorAll('.sort-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.getAttribute('data-sort');
      if (homeState.sortKey === key) homeState.sortDir = -homeState.sortDir;
      else { homeState.sortKey = key; homeState.sortDir = -1; }
      renderHome();
    });
  });
  document.getElementById('indicator-select').addEventListener('change', function (e) {
    homeState.indicator = e.target.value;
    homeState.sortKey = e.target.value;
    homeState.sortDir = -1;
    renderHome();
  });
  document.getElementById('search').addEventListener('input', function (e) {
    homeState.query = e.target.value;
    renderHome();
    const box = document.getElementById('search');
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
  });
}

// ---------- Country detail page ----------
function renderCountry(code) {
  const c = BY_CODE[code];
  if (!c) {
    mount.innerHTML = '<section class="intro"><h1>Country not found</h1><p>We cover the 30 most populous countries. <a href="#/">Back to the ranking</a>.</p></section>';
    return;
  }
  const peers = DATA.filter(function (x) { return x.region === c.region && x.code !== c.code; })
    .sort(function (a, b) { return b.pop - a.pop; }).slice(0, 3);

  const cards = INDICATORS.map(function (x) {
    const rank = rankOf(c.code, x.key);
    return '<div class="stat-card"><span class="stat-label">' + x.label + '</span>' +
      '<strong>' + cellValue(c, x.key) + '</strong>' +
      '<span class="stat-rank">Rank ' + rank + ' of 30</span>' +
      '<span class="stat-source">' + x.source + ', ' + x.year + '</span></div>';
  }).join('');

  const chartRows = [
    { label: 'Population (m)', country: c.pop, world: WORLD.pop / 30, format: function (v) { return fmtNum(v) + ' m'; } },
    { label: 'GDP per capita ($)', country: c.gdppc, world: WORLD.gdppc, format: function (v) { return '$' + fmtNum(v); } },
    { label: 'Life expectancy (yrs)', country: c.life, world: WORLD.life, format: function (v) { return fmtNum(v, 1); } },
    { label: 'Internet users (%)', country: c.internet, world: WORLD.internet, format: function (v) { return fmtNum(v) + '%'; } },
  ];
  const chart = compareChart(chartRows, { width: 640 });

  const tableRows = INDICATORS.map(function (x) {
    return '<tr><td><a href="#/indicators">' + x.label + '</a></td><td>' + cellValue(c, x.key) + '</td>' +
      '<td>' + x.unit + '</td><td>' + x.source + ', ' + x.year + '</td></tr>';
  }).join('');

  mount.innerHTML =
    '<nav class="crumbs"><a href="#/">All countries</a> › ' + c.name + '</nav>' +
    '<section class="intro"><h1>' + c.name + '</h1>' +
    '<p>Capital: ' + c.capital + ' · Region: ' + c.region + ' · Ranked ' + rankOf(c.code, 'pop') +
    ' of 30 by population. Figures below are ' + SOURCE_LINE + ' unless a row says otherwise.</p></section>' +
    '<section class="stat-grid">' + cards + '</section>' +
    '<section class="chart-box"><h2>' + c.name + ' against the world average</h2>' + chart +
    '<p class="source-note">Population bar compares against the average country of the 30 (world population ÷ 30). ' +
    'World figures: World Bank WDI, 2023.</p></section>' +
    '<section class="table-wrap"><h2>All indicators for ' + c.name + '</h2>' +
    '<table class="rank-table"><thead><tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Source &amp; year</th></tr></thead>' +
    '<tbody>' + tableRows + '</tbody></table></section>' +
    '<section class="peers"><h2>Compare with neighbours in ' + c.region + '</h2><ul>' +
    peers.map(function (p) { return '<li><a href="#/country/' + p.code + '">' + p.name + '</a> — ' + fmtNum(p.pop) + ' m people, $' + fmtNum(p.gdp) + ' bn GDP (' + SOURCE_LINE + ')</li>'; }).join('') +
    '</ul><p><a href="#/">← Back to the full ranking</a></p></section>';
}

// ---------- Indicators glossary ----------
function renderIndicators() {
  const rows = INDICATORS.map(function (x) {
    return '<tr><td><strong>' + x.label + '</strong></td><td>' + x.about + '</td><td>' + x.unit + '</td><td>' + x.source + ', ' + x.year + '</td></tr>';
  }).join('');
  mount.innerHTML =
    '<section class="intro"><h1>What each indicator means</h1>' +
    '<p>Eight indicators, in plain words. Every number on this site carries its source and year next to it; ' +
    'this page collects the definitions in one place so you can check what a figure actually counts.</p></section>' +
    '<section class="table-wrap"><table class="rank-table wrap"><thead><tr><th>Indicator</th><th>Definition</th><th>Unit</th><th>Source &amp; year</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table>' +
    '<p class="source-note">Coverage: the 30 most populous countries, 2023. CO2 per capita uses 2021 because the ' +
    'World Bank has not published a later year; schooling comes from the UNDP Human Development Report.</p></section>';
}

// ---------- Sources & methodology ----------
function renderSources() {
  mount.innerHTML =
    '<section class="intro"><h1>Sources &amp; methodology</h1>' +
    '<p>NationScope is an independent reference site. It is not affiliated with the World Bank, the United ' +
    'Nations, or any national statistics office. It exists to answer one question quickly: what are the key ' +
    'figures for a country, and where did they come from?</p></section>' +
    '<section class="method"><h2>Where the numbers come from</h2><ul>' +
    '<li><strong>Population, GDP, GDP per capita, life expectancy, internet users, CO2 per capita, land area</strong> — ' +
    'World Bank, World Development Indicators (WDI), reference year 2023. CO2 per capita: WDI, 2021, the latest year published.</li>' +
    '<li><strong>Mean years of schooling</strong> — United Nations Development Programme, Human Development Report 2023/24.</li>' +
    '<li><strong>World totals</strong> — World Bank WDI, 2023: world population 8,091.7 million, world GDP $106,172 billion, ' +
    'world GDP per capita $13,121, world life expectancy 73.3 years, 69% of people online.</li></ul>' +
    '<h2>How to read the site</h2><ul>' +
    '<li>On the home page, click any column heading to sort the ranking; the arrow shows the direction. The amber cell in a column is the world leader for that indicator.</li>' +
    '<li>The indicator selector re-ranks both the table and the top-10 chart. The search box filters by country or region name.</li>' +
    '<li>Every country name is a link to its detail page, which shows all eight indicators, a comparison against the world average, and peer countries from the same region.</li>' +
    '<li>Figures are rounded for reading: population to 0.1 million, GDP to whole billions, GDP per capita to whole dollars. Rounding never changes a rank.</li></ul>' +
    '<h2>About NationScope</h2>' +
    '<p>NationScope is a static site: five small files, no tracking, no cookies, no network requests. The data is a snapshot of the 2023 WDI release as published by the World Bank; ' +
    'figures are revised by the Bank from time to time, so treat them as the 2023 vintage, not as live data.</p></section>';
}

// ---------- Router ----------
function route() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  if (parts[0] === 'country' && parts[1]) renderCountry(parts[1].toUpperCase());
  else if (parts[0] === 'indicators') renderIndicators();
  else if (parts[0] === 'sources') renderSources();
  else renderHome();
  const titles = {
    '': 'NationScope — World Statistics Explorer',
    country: 'Country detail — NationScope',
    indicators: 'Indicators — NationScope',
    sources: 'Sources & method — NationScope',
  };
  document.title = titles[parts[0]] || titles[''];
  document.querySelectorAll('nav.site-nav a').forEach(function (a) {
    const target = a.getAttribute('href');
    const on = (target === '#/' && (parts[0] === '' || parts[0] === 'country')) ||
      (target === '#/indicators' && parts[0] === 'indicators') ||
      (target === '#/sources' && parts[0] === 'sources');
    a.classList.toggle('active', on);
  });
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
