// The five pages of the site. Each view returns the HTML for <main>; charts come from
// charts.js and every figure from data.js, with its source named under the chart.

import {
  META, POPULATION_HISTORY, AGE_PYRAMID_2024, AGE_SHARES, FERTILITY, LIFE_EXPECTANCY,
  GDP, PUBLIC_DEBT, TRADE_2024, LABOUR, SOCIETY, PREFECTURES, SOURCES,
} from './data.js';
import { lineChart, barChart, pyramidChart, shareBar, PALETTE } from './charts.js';

const src = text => `<p class="source">Source: ${text}</p>`;

function kpi(value, label, sub) {
  return `<div class="kpi"><div class="kpi-value">${value}</div><div class="kpi-label">${label}</div><div class="kpi-sub">${sub}</div></div>`;
}

function card(title, body, sourceText) {
  return `<section class="card"><h2>${title}</h2>${body}${sourceText ? src(sourceText) : ''}</section>`;
}

export function overviewView() {
  const pop = POPULATION_HISTORY;
  const merged = [...pop.census.slice(0, -1), ...pop.projection];
  const dashAt = merged.findIndex(p => p[0] === 2025) - 1;
  const latest = AGE_SHARES.years.length - 1;
  return `
  <div class="hero">
    <h1>Japan, in numbers</h1>
    <p class="lede">One hundred and twenty-four million people, the world's oldest population,
    and its fourth-largest economy. This site gathers Japan's official statistics — population,
    economy, society and all 47 prefectures — with the source and year on every figure.</p>
  </div>
  <div class="kpi-row">
    ${kpi('123.8M', 'Total population', 'Estimate, 1 Oct 2024 · falling since 2010')}
    ${kpi('29.3%', 'Aged 65 or over', 'The highest share of any country, 2024')}
    ${kpi('¥609T', 'GDP, nominal', 'Calendar 2024 · first year above ¥600 trillion')}
    ${kpi('1.15', 'Fertility rate', 'Children per woman, 2024 · a record low')}
  </div>
  ${card('Population since 1950 — and where the official projection takes it',
    lineChart(merged, { color: PALETTE.red, area: true, dashedFrom: dashAt, unit: 'M', yLabel: 'million people · solid: census · dashed: IPSS projection', endLabel: '87.0M in 2070 (projected)', aria: 'Japan population 1950 to 2070' }) +
    `<p>Japan's population peaked at <strong>128.06 million in 2010</strong> and has fallen every year since.
    The official medium projection has it below 100 million in the late 2050s and at about
    <strong>87 million in 2070</strong>, when nearly two in five people would be 65 or older.</p>`,
    pop.source)}
  <div class="two-col">
    ${card('Who makes up Japan in 2024',
      shareBar(
        [AGE_SHARES.under15[latest], AGE_SHARES.working[latest], AGE_SHARES.over65[latest]],
        ['Aged 0–14', 'Aged 15–64', 'Aged 65+'],
        [PALETTE.teal, PALETTE.blue, PALETTE.red]) +
      `<p>Children are now just <strong>11.2%</strong> of the population; in 1970 they were 24.0%.
      The 65-and-over group passed the under-15 group in 1997 and has grown ever since.</p>`,
      AGE_SHARES.source)}
    ${card('Explore the site',
      `<ul class="link-list">
        <li><a href="#/population">Population</a> — the age pyramid, fertility and life expectancy</li>
        <li><a href="#/economy">Economy</a> — GDP, public debt, trade and jobs</li>
        <li><a href="#/society">Society</a> — households, marriage and everyday life</li>
        <li><a href="#/regions">Regions &amp; sources</a> — all 47 prefectures, ranked, and where the figures come from</li>
      </ul>`,
      null)}
  </div>`;
}

export function populationView() {
  const latest = AGE_SHARES.years.length - 1;
  const pyramidTotal = AGE_PYRAMID_2024.groups.reduce((a, g) => a + g[1] + g[2], 0);
  return `
  <div class="page-head"><h1>Population</h1>
  <p class="lede">Japan is the world's oldest large country: median age about 49, and more
  people in their early seventies than in any younger five-year group except the early fifties.</p></div>
  <div class="kpi-row">
    ${kpi('123.8M', 'Population, 2024', 'Down 0.55M in a year — the fall is widening')}
    ${kpi('686,061', 'Births, 2024', 'First year below 700,000 · deaths: about 1.61M')}
    ${kpi('87.1 / 81.1', 'Life expectancy, F / M', 'Years at birth, 2023 — among the world\'s longest')}
    ${kpi('49.9', 'Median age, years', '2024 estimate · was 32.6 in 1980')}
  </div>
  ${card('The age pyramid, 2024 — millions by five-year group',
    pyramidChart(AGE_PYRAMID_2024.groups) +
    `<p>The pyramid's shape tells the story: bulges at <strong>70–74</strong> (the post-war baby boom)
    and <strong>50–54</strong> (their children), and a base that narrows every year — the 0–4 group
    (${(AGE_PYRAMID_2024.groups[0][1] + AGE_PYRAMID_2024.groups[0][2]).toFixed(1)}M) is barely half the size of the 50–54 group.
    The groups shown add to ${pyramidTotal.toFixed(1)} million, the 2024 total.</p>`,
    AGE_PYRAMID_2024.source)}
  <div class="two-col">
    ${card('Fertility: children per woman',
      lineChart(FERTILITY.tfr, { color: PALETTE.red, yLabel: 'total fertility rate · replacement level is 2.07', endLabel: '1.15 in 2024', aria: 'Japan total fertility rate 1970 to 2024' }) +
      `<p>The rate fell below replacement in 1974 and never returned. The 2024 figure of
      <strong>1.15</strong> is the lowest recorded; births fell to <strong>686,061</strong> while deaths
      reached about <strong>1.61 million</strong>, a natural decrease of over 900,000 people in one year.</p>`,
      FERTILITY.source)}
    ${card('An ageing society, in shares',
      shareBar([AGE_SHARES.under15[latest], AGE_SHARES.working[latest], AGE_SHARES.over65[latest]],
        ['0–14', '15–64', '65+'], [PALETTE.teal, PALETTE.blue, PALETTE.red]) +
      `<table class="mini-table"><tr><th>Year</th><th>0–14</th><th>15–64</th><th>65+</th></tr>
      ${AGE_SHARES.years.map((y, i) => `<tr><td>${y}</td><td>${AGE_SHARES.under15[i]}%</td><td>${AGE_SHARES.working[i]}%</td><td>${AGE_SHARES.over65[i]}%</td></tr>`).join('')}
      </table>`,
      AGE_SHARES.source)}
  </div>`;
}

export function economyView() {
  return `
  <div class="page-head"><h1>Economy</h1>
  <p class="lede">A ¥609 trillion economy with the developed world's heaviest public debt,
  a chronic trade deficit in goods since the energy shocks of the 2010s, and — despite the
  shrinking population — unemployment that has stayed near 2.5% for a decade.</p></div>
  <div class="kpi-row">
    ${kpi('¥609T', 'GDP, nominal 2024', GDP.worldShareNote)}
    ${kpi('255%', 'Govt debt / GDP, 2023', 'The highest ratio among advanced economies')}
    ${kpi('2.5%', 'Unemployment, 2024', 'Annual average · 67.8M people in work')}
    ${kpi('−¥5.3T', 'Trade balance, 2024', 'Exports ¥107.1T · imports ¥112.4T')}
  </div>
  <div class="two-col">
    ${card('GDP in trillion yen',
      barChart(GDP.series.map(([y, v]) => [String(y), v, PALETTE.blue]), { color: PALETTE.blue, aria: 'Japan nominal GDP by year' }) +
      `<p>Two decades of near-zero nominal growth, then a step up: prices and a weaker yen lifted
      nominal GDP from ¥543 trillion in 2020 to <strong>¥609 trillion in 2024</strong>, the first
      reading above ¥600 trillion. GDP per person was about <strong>$33,800 in 2023</strong>.</p>`,
      GDP.source)}
    ${card('Public debt: gross debt as a share of GDP',
      lineChart(PUBLIC_DEBT.ratio, { color: PALETTE.amber, area: true, unit: '%', endLabel: '255% in 2023', yLabel: 'percent of GDP', aria: 'Japan government debt to GDP 2000 to 2023' }) +
      `<p>Gross general-government debt reached about <strong>255% of GDP</strong>. Central-government
      bonds outstanding were about <strong>¥1,129 trillion</strong> at the end of March 2024 — roughly
      nine years of tax revenue — though almost all of it is held inside Japan, about half by the Bank of Japan.</p>`,
      PUBLIC_DEBT.source)}
  </div>
  <div class="two-col">
    ${card('Trade, 2024',
      barChart([['Exports', TRADE_2024.exports, PALETTE.teal], ['Imports', TRADE_2024.imports, PALETTE.red]], { color: PALETTE.teal, aria: 'Japan exports and imports 2024' }) +
      `<p>Motor vehicles are the largest single export at about <strong>¥17.8 trillion</strong>, followed by
      semiconductor devices and auto parts. Energy — crude oil and LNG — dominates imports, which is why
      the goods balance has been in deficit in most years since 2011.</p>`,
      TRADE_2024.source)}
    ${card('Jobs',
      `<p class="big-stat">2.5% <span>unemployed, 2024 average</span></p>
      <table class="mini-table">
        <tr><td>Labour force</td><td><strong>69.6M</strong> people</td></tr>
        <tr><td>In employment</td><td><strong>67.8M</strong> people</td></tr>
        <tr><td>Job offers per applicant</td><td><strong>1.25</strong> (2024 average)</td></tr>
      </table>
      <p>Employers report shortages, not surpluses: there were about five advertised openings for
      every four applicants through 2024, even as the working-age population shrank.</p>`,
      LABOUR.source)}
  </div>`;
}

export function societyView() {
  return `
  <div class="page-head"><h1>Society</h1>
  <p class="lede">Smaller households, later marriages, longer lives: the social statistics behind
  the population headlines.</p></div>
  <div class="kpi-row">
    ${kpi('55.7M', 'Households, 2020', 'Average size just 2.21 people — and falling')}
    ${kpi('38.1%', 'Live alone', 'Share of all households, 2020 census')}
    ${kpi('31.1 / 29.7', 'Age at first marriage', 'Men / women, 2023 · up from 27.8 / 25.2 in 1990')}
    ${kpi('3.77M', 'Foreign residents', 'End of 2024 · about 3% of the population')}
  </div>
  <div class="two-col">
    ${card('Households keep shrinking',
      `<table class="mini-table">
        <tr><td>Households</td><td><strong>55.7 million</strong> (2020)</td></tr>
        <tr><td>People per household</td><td><strong>2.21</strong> (2020) · 3.41 in 1970</td></tr>
        <tr><td>One-person households</td><td><strong>38.1%</strong> of all households</td></tr>
        <tr><td>Households with someone 65+</td><td><strong>about 45%</strong></td></tr>
      </table>
      <p>The typical Japanese household is no longer a family: more than a third of homes have a
      single resident, and one-person households are the largest single type in every prefecture.</p>`,
      SOCIETY.source)}
    ${card('Connected, and marrying later',
      `<table class="mini-table">
        <tr><td>Internet users</td><td><strong>84.9%</strong> of people aged 6+ (2023)</td></tr>
        <tr><td>First marriage, men</td><td><strong>31.1 years</strong> (2023)</td></tr>
        <tr><td>First marriage, women</td><td><strong>29.7 years</strong> (2023)</td></tr>
        <tr><td>Never married by 50</td><td><strong>about 28% of men, 18% of women</strong> (2020)</td></tr>
      </table>
      <p>Late and non-marriage is the single biggest driver of the birth rate: most children in Japan
      are born to married couples, so a wedding postponed is, statistically, a birth postponed too.</p>`,
      SOCIETY.source)}
  </div>
  ${card('Long lives',
    `<p>Life expectancy in 2023 was <strong>87.14 years for women</strong> and <strong>81.09 years for men</strong> —
    figures that have recovered after the pandemic dip and remain among the highest ever recorded for a large
    country. Healthy life expectancy (years lived in full health) was about 75 years for women and 73 for men
    at the last WHO estimate.</p>`,
    LIFE_EXPECTANCY.source)}`;
}

export function regionsView() {
  const rows = [...PREFECTURES.rows].sort((a, b) => b[1] - a[1]);
  const top10 = rows.slice(0, 10);
  const total = rows.reduce((a, r) => a + r[1], 0);
  return `
  <div class="page-head"><h1>Regions &amp; sources</h1>
  <p class="lede">Japan's 47 prefectures hold very unequal shares of the country: the top three —
  Tokyo, Kanagawa and Osaka — are home to one person in four.</p></div>
  ${card('The ten largest prefectures, 2020 census',
    barChart(top10.map(([n, v]) => [n, Math.round(v / 100) / 10, PALETTE.blue]), { color: PALETTE.blue, aria: 'Ten largest prefectures by population' }) +
    `<p>Values in millions. Tokyo's 14.0 million is more than the smallest twenty prefectures combined.
    ${PREFECTURES.densityNote}</p>`,
    PREFECTURES.source)}
  ${card('All 47 prefectures, ranked — 2020 census, thousand people',
    `<div class="pref-table-wrap"><table class="pref-table"><thead><tr><th>#</th><th>Prefecture</th><th>People (000s)</th><th>Share</th></tr></thead>
    <tbody>${rows.map(([n, v], i) => `<tr><td>${i + 1}</td><td>${n}</td><td>${v.toLocaleString('en-US')}</td><td>${(v / total * 100).toFixed(1)}%</td></tr>`).join('')}</tbody></table></div>
    <p>The 47 figures add to ${(total / 1000).toFixed(1)} million, the 2020 census total for the country.
    The smallest prefecture, Tottori (553 thousand), has one twenty-fifth of Tokyo's population.</p>`,
    PREFECTURES.source)}
  ${card('Where every figure comes from',
    `<ul class="src-list">${SOURCES.map(([name, what]) => `<li><strong>${name}</strong> — ${what}</li>`).join('')}</ul>
    <p>Figures are the published values of these offices, in the units and years shown beside each chart.
    Projections after 2020 are the IPSS medium variant; they are estimates of the future, not counts.
    This site is an explainer, not an official publication — for the underlying tables, use e-Stat.</p>`,
    null)}`;
}
