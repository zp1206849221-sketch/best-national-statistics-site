// Japan's headline statistics, in one data file. Every series names the office that
// publishes it and the year it describes; the Regions & sources page lists them in full.
// Values are the published official figures (censuses, annual estimates and accounts),
// rounded only where the label says so.

export const META = {
  country: 'Japan',
  capital: 'Tokyo',
  landAreaKm2: 377975,
  currency: 'yen (JPY)',
  dataAsOf: 'October 2025',
};

// Total population at each census, in millions (Statistics Bureau, Population Census),
// with the IPSS 2023 medium-variant projection appended as estimates.
export const POPULATION_HISTORY = {
  source: 'Statistics Bureau of Japan, Population Census; IPSS 2023 projection (medium variant)',
  census: [
    [1950, 83.20], [1955, 89.28], [1960, 94.30], [1965, 99.21], [1970, 104.67],
    [1975, 111.94], [1980, 117.06], [1985, 121.05], [1990, 123.61], [1995, 125.57],
    [2000, 126.93], [2005, 127.77], [2010, 128.06], [2015, 127.09], [2020, 126.15],
  ],
  projection: [
    [2020, 126.15], [2025, 123.26], [2030, 121.89], [2040, 112.84], [2050, 104.69],
    [2060, 96.15], [2070, 86.96],
  ],
  latest: { year: 2024, total: 123.80, note: 'Estimate at 1 October 2024' },
  peak: { year: 2010, total: 128.06 },
};

// Age pyramid at 1 October 2024, five-year groups, millions of people [male, female].
export const AGE_PYRAMID_2024 = {
  source: 'Statistics Bureau of Japan, Population Estimates, 1 October 2024',
  groups: [
    ['0–4', 2.27, 2.16], ['5–9', 2.53, 2.41], ['10–14', 2.72, 2.59], ['15–19', 2.86, 2.72],
    ['20–24', 3.08, 2.92], ['25–29', 3.14, 2.99], ['30–34', 3.19, 3.05], ['35–39', 3.39, 3.26],
    ['40–44', 3.74, 3.60], ['45–49', 4.22, 4.04], ['50–54', 4.82, 4.63], ['55–59', 4.19, 4.06],
    ['60–64', 3.80, 3.74], ['65–69', 3.83, 3.94], ['70–74', 4.30, 4.67], ['75–79', 3.54, 4.07],
    ['80–84', 2.62, 3.31], ['85–89', 1.58, 2.36], ['90+', 0.79, 1.83],
  ],
};

// The three broad age groups, share of the whole population, percent.
export const AGE_SHARES = {
  source: 'Statistics Bureau of Japan, Population Census and Estimates',
  years: [1970, 1980, 1990, 2000, 2010, 2020, 2024],
  under15: [24.0, 23.5, 18.2, 14.6, 13.2, 12.0, 11.2],
  working: [68.9, 67.4, 69.7, 68.1, 63.8, 59.5, 59.5],
  over65: [7.1, 9.1, 12.1, 17.4, 23.0, 28.6, 29.3],
};

// Total fertility rate (children per woman) and births, selected years.
export const FERTILITY = {
  source: 'Ministry of Health, Labour and Welfare, Vital Statistics',
  tfr: [
    [1970, 2.13], [1975, 1.91], [1980, 1.75], [1985, 1.76], [1990, 1.54], [1995, 1.42],
    [2000, 1.36], [2005, 1.26], [2010, 1.39], [2015, 1.45], [2020, 1.33], [2021, 1.30],
    [2022, 1.26], [2023, 1.20], [2024, 1.15],
  ],
  births2024: 686061,
  deaths2024: 1605000,
  replacement: 2.07,
};

// Life expectancy at birth, years.
export const LIFE_EXPECTANCY = {
  source: 'Ministry of Health, Labour and Welfare, Abridged Life Tables 2023',
  male: 81.09,
  female: 87.14,
  year: 2023,
};

// Nominal GDP, trillion yen (Cabinet Office, Annual Report on National Accounts).
export const GDP = {
  source: 'Cabinet Office, National Accounts of Japan',
  series: [
    [2000, 535], [2005, 524], [2010, 500], [2015, 538], [2019, 559], [2020, 543],
    [2021, 552], [2022, 564], [2023, 595], [2024, 609],
  ],
  gdp2024TrillionYen: 609,
  gdpPerCapitaUsd2023: 33800,
  worldShareNote: 'Fourth-largest economy in US-dollar terms in 2024 (IMF)',
};

// General government gross debt as a share of GDP, percent (IMF World Economic Outlook).
export const PUBLIC_DEBT = {
  source: 'IMF World Economic Outlook; Ministry of Finance, Japanese Government Bonds',
  ratio: [
    [2000, 135], [2005, 174], [2010, 208], [2015, 231], [2019, 237], [2020, 259],
    [2021, 255], [2022, 260], [2023, 255],
  ],
  bondsOutstandingTrillionYen: 1129,
  bondsYear: 'end of March 2024',
};

// Merchandise trade, trillion yen, customs basis (Ministry of Finance, Trade Statistics).
export const TRADE_2024 = {
  source: 'Ministry of Finance, Trade Statistics of Japan, 2024',
  exports: 107.1,
  imports: 112.4,
  balance: -5.3,
  topExports: [
    ['Motor vehicles', 17.8], ['Semiconductor devices', 6.4], ['Auto parts', 5.6],
    ['Semiconductor-making equipment', 5.4], ['Electrical machinery, other', 12.9],
  ],
  unit: 'trillion yen, 2024 (machinery groups are approximate shares of the total)',
};

// Labour market, annual averages.
export const LABOUR = {
  source: 'Statistics Bureau, Labour Force Survey; MHLW',
  unemployment2024: 2.5,
  labourForceMillions: 69.6,
  employedMillions: 67.8,
  jobsToApplicants2024: 1.25,
};

// Households and how people live.
export const SOCIETY = {
  source: 'Statistics Bureau, Population Census 2020; MHLW; MIC Communications Usage Survey',
  householdsMillions: 55.7,
  personsPerHousehold: 2.21,
  singleHouseholdsShare: 38.1,
  marriageAge: { male: 31.1, female: 29.7, year: 2023 },
  internetUseShare: 84.9,
  internetYear: 2023,
  foreignResidentsMillions: 3.77,
  foreignResidentsYear: 2024,
};

// Population of all 47 prefectures, 2020 census, thousands of people.
export const PREFECTURES = {
  source: 'Statistics Bureau of Japan, Population Census 2020',
  unit: 'thousand people',
  rows: [
    ['Hokkaido', 5225], ['Aomori', 1238], ['Iwate', 1211], ['Miyagi', 2302], ['Akita', 960],
    ['Yamagata', 1068], ['Fukushima', 1834], ['Ibaraki', 2867], ['Tochigi', 1933], ['Gunma', 1939],
    ['Saitama', 7345], ['Chiba', 6284], ['Tokyo', 14048], ['Kanagawa', 9237], ['Niigata', 2201],
    ['Toyama', 1035], ['Ishikawa', 1133], ['Fukui', 767], ['Yamanashi', 810], ['Nagano', 2049],
    ['Gifu', 1979], ['Shizuoka', 3633], ['Aichi', 7542], ['Mie', 1770], ['Shiga', 1414],
    ['Kyoto', 2578], ['Osaka', 8838], ['Hyogo', 5465], ['Nara', 1325], ['Wakayama', 923],
    ['Tottori', 553], ['Shimane', 671], ['Okayama', 1888], ['Hiroshima', 2800], ['Yamaguchi', 1342],
    ['Tokushima', 719], ['Kagawa', 951], ['Ehime', 1335], ['Kochi', 692], ['Fukuoka', 5135],
    ['Saga', 811], ['Nagasaki', 1312], ['Kumamoto', 1738], ['Oita', 1123], ['Miyazaki', 1070],
    ['Kagoshima', 1588], ['Okinawa', 1467],
  ],
  densityNote: 'Tokyo is the densest prefecture at about 6,400 people per km²; Hokkaido the sparsest at about 63 per km².',
};

// The offices behind the figures, for the sources page.
export const SOURCES = [
  ['Statistics Bureau of Japan (MIC)', 'Population Census every five years, monthly population estimates, Labour Force Survey, Family Income and Expenditure Survey.'],
  ['e-Stat — Portal Site of Official Statistics', 'The government portal where the published tables behind these charts can be downloaded.'],
  ['Cabinet Office (ESRI)', 'National Accounts: GDP and its components, quarterly and annual.'],
  ['Ministry of Health, Labour and Welfare', 'Vital Statistics (births, deaths, marriages, fertility) and the Abridged Life Tables.'],
  ['Ministry of Finance', 'Trade Statistics of Japan and the public-debt and government-bond accounts.'],
  ['National Institute of Population and Social Security Research (IPSS)', 'The official population projections used for the years after 2020.'],
  ['IMF World Economic Outlook', 'Cross-country debt ratios and dollar GDP comparisons quoted on the Economy page.'],
];
