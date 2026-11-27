// NationScope data — the 30 most populous countries, reference year 2023.
// Every figure is a World Bank World Development Indicators value for 2023,
// except CO2 per capita (WDI, 2021 — the latest year published) and mean years
// of schooling (UNDP Human Development Report, 2023/24). Written by hand
// from the author's knowledge of the WDI; population and GDP of China, India
// and the United States were cross-checked against the WDI 2023 release.
// Columns, in order:
//   [ISO alpha-3, name, region, capital, population (millions), GDP ($bn, current US$),
//    GDP per capita (current US$), life expectancy (years), mean years of schooling (years),
//    internet users (% of population), CO2 per capita (metric tons, 2021), land area (sq km)]
// World totals for the home-page summary strip are at the end (World Bank WDI, 2023).
// CO2 per capita is rounded to one decimal for reading; DR Congo rounds to 0.0 t
// (its published value is about 0.03 t per person).
// Rows are listed in population order, largest first, so the table's default
// sort (population, descending) matches the file order. A row's position in
// this file is its population rank.
export const COUNTRIES = [
  ['IND', 'India', 'South Asia', 'New Delhi', 1438.1, 3568, 2481, 67.7, 6.5, 55, 1.9, 3287263],
  ['CHN', 'China', 'East Asia', 'Beijing', 1410.7, 17795, 12614, 78.2, 8.0, 77, 8.0, 9596961],
  ['USA', 'United States', 'North America', 'Washington, D.C.', 334.9, 27721, 82769, 78.4, 13.5, 92, 13.8, 9833517],
  ['IDN', 'Indonesia', 'Southeast Asia', 'Jakarta', 277.5, 1371, 4940, 71.9, 8.6, 79, 2.6, 1904569],
  ['PAK', 'Pakistan', 'South Asia', 'Islamabad', 240.5, 338, 1407, 66.1, 5.1, 36, 0.8, 881913],
  ['NGA', 'Nigeria', 'Sub-Saharan Africa', 'Abuja', 223.8, 365, 1627, 54.6, 7.0, 41, 0.7, 923768],
  ['BRA', 'Brazil', 'South America', 'Brasília', 216.4, 2174, 10044, 75.9, 8.1, 84, 2.1, 8514877],
  ['BGD', 'Bangladesh', 'South Asia', 'Dhaka', 173.0, 437, 2529, 73.8, 6.5, 44, 0.6, 148460],
  ['RUS', 'Russia', 'Europe & Central Asia', 'Moscow', 144.4, 2021, 13974, 71.9, 12.3, 92, 11.4, 17098242],
  ['MEX', 'Mexico', 'Latin America', 'Mexico City', 129.7, 1789, 13794, 75.4, 9.2, 83, 3.6, 1964375],
  ['ETH', 'Ethiopia', 'Sub-Saharan Africa', 'Addis Ababa', 126.5, 164, 1296, 66.9, 3.2, 19, 0.1, 1104300],
  ['JPN', 'Japan', 'East Asia', 'Tokyo', 124.6, 4213, 33806, 84.0, 12.6, 83, 8.5, 377975],
  ['PHL', 'Philippines', 'Southeast Asia', 'Manila', 117.3, 437, 3725, 72.3, 9.1, 86, 1.2, 300000],
  ['EGY', 'Egypt', 'Middle East & North Africa', 'Cairo', 112.7, 396, 3512, 71.6, 7.6, 72, 2.3, 1001450],
  ['COD', 'DR Congo', 'Sub-Saharan Africa', 'Kinshasa', 102.3, 66, 649, 61.4, 6.8, 18, 0.0, 2344858],
  ['VNM', 'Vietnam', 'Southeast Asia', 'Hanoi', 98.9, 430, 4346, 74.7, 8.3, 79, 2.5, 331212],
  ['IRN', 'Iran', 'Middle East & North Africa', 'Tehran', 89.2, 401, 4498, 77.1, 10.2, 81, 7.7, 1648195],
  ['TUR', 'Türkiye', 'Europe & Central Asia', 'Ankara', 85.3, 1118, 13105, 77.2, 8.8, 85, 5.0, 783562],
  ['DEU', 'Germany', 'Europe & Central Asia', 'Berlin', 84.7, 4526, 53445, 81.7, 14.3, 93, 7.3, 357588],
  ['THA', 'Thailand', 'Southeast Asia', 'Bangkok', 71.8, 515, 7166, 76.9, 8.7, 88, 3.7, 513120],
  ['GBR', 'United Kingdom', 'Europe & Central Asia', 'London', 68.4, 3341, 48867, 81.0, 13.1, 97, 4.7, 243610],
  ['FRA', 'France', 'Europe & Central Asia', 'Paris', 68.2, 3031, 44408, 82.9, 11.8, 94, 4.4, 551695],
  ['TZA', 'Tanzania', 'Sub-Saharan Africa', 'Dodoma', 65.6, 79, 1207, 66.3, 6.1, 32, 0.2, 947300],
  ['ZAF', 'South Africa', 'Sub-Saharan Africa', 'Pretoria', 60.4, 380, 6292, 65.9, 10.3, 72, 7.6, 1221037],
  ['ITA', 'Italy', 'Europe & Central Asia', 'Rome', 58.8, 2301, 39155, 83.1, 10.5, 92, 5.2, 302068],
  ['KEN', 'Kenya', 'Sub-Saharan Africa', 'Nairobi', 55.1, 108, 1952, 62.8, 6.9, 41, 0.3, 580876],
  ['MMR', 'Myanmar', 'Southeast Asia', 'Naypyidaw', 54.6, 65, 1190, 66.1, 5.5, 48, 0.4, 676578],
  ['COL', 'Colombia', 'Latin America', 'Bogotá', 52.3, 363, 6946, 77.0, 8.4, 77, 1.8, 1141748],
  ['KOR', 'South Korea', 'East Asia', 'Seoul', 51.7, 1713, 33110, 83.4, 12.3, 97, 10.4, 100210],
  ['UGA', 'Uganda', 'Sub-Saharan Africa', 'Kampala', 48.7, 51, 1044, 66.7, 6.2, 27, 0.1, 241550],
];

// Indicator metadata: key, short label, full label, unit, source, year, plain-language definition.
export const INDICATORS = [
  { key: 'pop', label: 'Population', unit: 'million people', source: 'World Bank WDI', year: 2023,
    about: 'The total number of people living in the country in the middle of the year, including everyone who usually lives there.' },
  { key: 'gdp', label: 'GDP', unit: '$ billion, current US$', source: 'World Bank WDI', year: 2023,
    about: 'The total value of everything produced inside the country in a year, converted to US dollars at the market exchange rate.' },
  { key: 'gdppc', label: 'GDP per capita', unit: 'current US$', source: 'World Bank WDI', year: 2023,
    about: 'GDP divided by the population: a rough average of economic output per person. It says nothing about how income is shared.' },
  { key: 'life', label: 'Life expectancy', unit: 'years', source: 'World Bank WDI', year: 2023,
    about: 'How long a newborn would live on average if the death rates of this year stayed the same for their whole life.' },
  { key: 'school', label: 'Schooling', unit: 'mean years', source: 'UNDP Human Development Report', year: 2023,
    about: 'The average number of years of education completed by adults aged 25 and older.' },
  { key: 'internet', label: 'Internet users', unit: '% of population', source: 'World Bank WDI', year: 2023,
    about: 'The share of people who used the internet in the last three months, from any device.' },
  { key: 'co2', label: 'CO2 per capita', unit: 'metric tons', source: 'World Bank WDI', year: 2021,
    about: 'Carbon dioxide emissions from burning fossil fuels and making cement, divided by the population. 2021 is the latest year the World Bank has published.' },
  { key: 'area', label: 'Land area', unit: 'sq km', source: 'World Bank WDI', year: 2023,
    about: 'The country’s land area, excluding inland water. It is the only figure here that changes slowly, so it is shown for scale.' },
];

// Column order of the compact country rows above, matched to the indicator keys.
export const FIELDS = ['code', 'name', 'region', 'capital', 'pop', 'gdp', 'gdppc', 'life', 'school', 'internet', 'co2', 'area'];

// World totals shown on the home page (World Bank WDI, 2023).
export const WORLD = {
  pop: 8091.7, gdp: 106172, gdppc: 13121, life: 73.3, internet: 69,
  countries: 217, note: 'World totals: World Bank WDI, 2023.',
};
