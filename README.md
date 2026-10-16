# The Director's Cut — Portfolio

> A cinematic, magazine-style developer portfolio for **Tanish Ghosh** — built with Next.js 16, Subframe UI, and Tailwind CSS v4.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tanishghosh/portfolio-website)

---

## ✨ Concept

Inspired by film production design, the portfolio is styled as **"The Director's Cut"** — a cinematic editorial that uses SMPTE timecodes, film-leader countdowns, aperture-lens navigation, and a dark/light mode toggle to make a bold first impression.

---

## 🗂️ What's Been Built

| Section | Description |
|---|---|
| **Film Leader Intro** | Animated SMPTE-style countdown splash screen on first load |
| **Cover / Hero** | Full-screen magazine cover with live timecode ticker |
| **Career Timeline** | Work history laid out as a film-strip timeline |
| **Education** | Academic background section |
| **Projects** | Featured project showcases |
| **Specs / Skills** | Technical skills with animated metric bars |
| **Contact** | Contact form with "Transmit" send action |
| **Dark / Light Themes** | Full theme switcher with `/dark` and `/light` routes |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, static export)
- **UI Library**: [Subframe](https://subframe.com/) — 43 pre-built components synced locally
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/turbopack`)
- **Fonts**: Playfair Display · Inter · Geist Sans · Geist Mono (Google Fonts)
- **Language**: TypeScript

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:3000)
npm run dev
```

> Routes: `/` (default), `/dark`, `/light`

---

## 📦 Build & Static Export

```bash
npm run build
# Output is written to ./out/
```

The project is configured for **static export** (`output: "export"` in `next.config.ts`), making it deployable to any static host.

---

## 🌐 Deployment — Vercel

The project is deployed via **[Vercel](https://vercel.com)** — zero config required for Next.js.

1. Go to [vercel.com/new](https://vercel.com/new) and import the `tanishghosh/portfolio-website` repo
2. Leave all settings as defaults — Vercel auto-detects Next.js
3. Every push to `main` triggers an automatic production deployment

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Root page → DirectorsCutMagazine
│   ├── DirectorsCutMagazine.tsx  # Main portfolio component
│   ├── FilmLeaderIntro.tsx       # Animated intro splash
│   ├── dark/page.tsx             # Dark-mode route
│   ├── light/page.tsx            # Light-mode route
│   └── globals.css
└── ui/
    ├── components/               # 43 Subframe UI components
    ├── layouts/
    ├── index.ts
    └── tailwind.config.js
```

---

## 📄 License

[MIT](LICENSE)
