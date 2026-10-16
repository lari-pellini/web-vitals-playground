# web-vitals-playground

![HTML](https://img.shields.io/badge/HTML%2FCSS%2FJS-no%20build-e34f26)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

Side-by-side **bad vs. good** demos of the three Core Web Vitals — **LCP**, **CLS** and **INP** — each with a live overlay that measures the metric while you use the page. Made to explain page experience to marketing, content and design teams without a single line of jargon-heavy tooling.

🔗 **Live demo:** https://lari-pellini.github.io/web-vitals-playground/ (Chrome or Edge)

> 🇧🇷 [Leia em português](#-português)

## The demos

| Metric | What it feels like | Bad version | Fix shown |
| --- | --- | --- | --- |
| **LCP** — Largest Contentful Paint | "Is this page loading?" | Hero rendered by JavaScript after a slow API call (~4 s) | Hero in the initial HTML |
| **CLS** — Cumulative Layout Shift | "The text jumped while I was reading" | Promo banner injected at the top + image without `width`/`height` | Reserved slot (`min-height`) + image dimensions |
| **INP** — Interaction to Next Paint | "I clicked and nothing happened" | ~550 ms of work inside the click handler before updating the UI | Update the UI first, defer heavy work until after the next paint |

Thresholds (75th percentile of real users, per Google):

| | Good | Needs improvement | Poor |
| --- | --- | --- | --- |
| LCP | ≤ 2.5 s | ≤ 4 s | > 4 s |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| INP | ≤ 200 ms | ≤ 500 ms | > 500 ms |

## How the overlay works

[`vitals.js`](vitals.js) is ~100 lines of plain JavaScript on top of `PerformanceObserver`:

- **LCP** — last `largest-contentful-paint` entry before the first user input
- **CLS** — largest *session window* of `layout-shift` entries (gaps < 1 s, window ≤ 5 s), ignoring shifts right after input
- **INP** — slowest `event` entry with an `interactionId`

It's a teaching tool, simplified on purpose. For production monitoring use Google's [`web-vitals`](https://github.com/GoogleChrome/web-vitals) library or field data from CrUX / Search Console.

> Note: browsers don't report LCP for pages loaded in a background tab, so open the demo in a visible tab.

## Run locally

No build step — any static server works:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Contributing

Ideas: a demo for web fonts (FOIT/FOUT and CLS), lazy-loading the hero image (LCP), third-party chat widgets (INP), a PT-BR translation of the pages. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🇧🇷 Português

Demonstrações lado a lado, versão **ruim × boa**, das três Core Web Vitals — **LCP** (carregamento), **CLS** (estabilidade visual) e **INP** (resposta a cliques) — com um painel que mede a métrica ao vivo enquanto você usa a página.

Feito para explicar experiência de página para times de marketing, conteúdo e design: abra a versão ruim, sinta o problema, abra a versão corrigida e veja o número mudar.

## License

MIT © Larissa Pellini
