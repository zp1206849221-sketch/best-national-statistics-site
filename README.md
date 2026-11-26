# Japan in Numbers — a national statistics site for Japan

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/zp1206849221-sketch/best-national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/zp1206849221-sketch/best-national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An entry for make.fun's **Make the best national statistics site** bounty ($50): a working
national statistics site for Japan, built as plain static files — no framework, no build step,
nothing loaded over the network.

## What is on the site

Five pages on hash routes, each reached from the top navigation:

- **Overview** (`#/`) — the headline figures: 123.8M people, 29.3% aged 65+, ¥609 trillion GDP,
  fertility of 1.15 — and a chart of population from the 1950 census to the official 2070 projection.
- **Population** (`#/population`) — the 2024 age pyramid, the fertility rate since 1970,
  births and deaths, life expectancy, and the shifting age shares.
- **Economy** (`#/economy`) — nominal GDP, public debt at 255% of GDP, the 2024 trade
  balance and the labour market.
- **Society** (`#/society`) — households (55.7M, 38.1% one-person), marriage ages,
  internet use and foreign residents.
- **Regions & sources** (`#/regions`) — all 47 prefectures ranked by 2020 census population,
  the ten densest prefectures by people per km², and the official sources behind every figure.

Every chart is an inline SVG drawn by `app/charts.js` from the numbers in `app/data.js`, and
every figure names its source office and year on the page. Charts share one axis helper so
line and bar charts always draw identical gridlines and tick labels. The whole app is about
34 KB of text — the first load is `index.html`, one stylesheet and four small modules, nothing else.

## Layout of the repository

- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to `/output` and writes
  `dossier.json` with the vendored library (`MAKEFUN_OUTPUT_DIR` stands in for `/output` locally).
- `serve.ts` — a tiny local server: `node serve.ts` then open http://localhost:8080.
- `app/index.html`, `app/style.css` — the page shell and the site's design.
- `app/data.js` — all statistics, grouped by topic, each with its source.
- `app/charts.js` — the SVG chart builders (line, bar, pyramid, share bar).
- `app/views.js` — the five page renderers; `app/main.js` — the hash router.
- `vendor/makefun-frontend.ts` — the make.fun hand-in library, shipped as-is.
- `screenshots/` — four screenshots of the running site (three desktop, one phone), listed in `shots.json`.

## Run it

```sh
node serve.ts            # preview at http://localhost:8080
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # produce the hand-in in out/
```

## License

MIT — see `LICENSE`. Statistics are the published figures of the offices named on the
Regions & sources page.
