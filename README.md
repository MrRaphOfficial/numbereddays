# numberedDays

A fun full-stack web application that transforms birthdays and milestone day counts into entertaining insights, facts, and milestones using modern web tech and AI.

---

## 🚀 Tech Stack

- **Frontend & UI:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Motion](https://motion.dev/)
- **Backend:** [Express](https://expressjs.com/) with TypeScript (`server.ts` powered by [tsx](https://github.com/privatenumber/tsx))
- **AI & Services:** [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Database & Auth:** [Firebase](https://firebase.google.com/)
- **Bundler / Build Tool:** [esbuild](https://esbuild.github.io/)

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have a modern runtime environment installed (such as Node.js v18+ or [Bun](https://bun.sh/)).

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/MrRaphOfficial/numberedDays.git](https://github.com/MrRaphOfficial/numberedDays.git)
cd numberedDays

```


2. **Install dependencies:**
Using npm or your preferred package manager:
```bash
npm install

```


*(Or `bun install` / `yarn install` depending on your setup)*
3. **Environment Setup:**
Create a `.env` file in the root directory based on your configuration requirements (incorporating your Gemini API keys and Firebase credentials).

---

## 📜 Available Scripts

Inside your project, you can run the following commands configured in `package.json`:

| Command | Action |
| --- | --- |
| `npm run dev` | Starts the development server using `tsx server.ts` |
| `npm run build` | Bundles the frontend with Vite and compiles the server into `dist/server.cjs` using esbuild |
| `npm run start` | Runs the production build from `dist/server.cjs` |
| `npm run clean` | Cleans up the distribution and build artifacts (`dist`, `server.js`, `server.cjs`) |
| `npm run lint` | Type-checks the codebase without emitting files using TypeScript (`tsc --noEmit`) |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/MrRaphOfficial/numberedDays/issues) or submit a pull request.

## 👤 Author

* **Raphael E. Ovonlen** — [@MrRaphOfficial](https://github.com/MrRaphOfficial)

```

```
