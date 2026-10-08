# 🕵️‍♂️ CodePhantom — AI-Powered Debugging Arena

> *“Every bug leaves a shadow. AI creates the mystery. You solve it.”*

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-Production%20Ready-8B5CF6.svg)](https://github.com/p2480240-cmd/CodePhantom)
[![Git Branch](https://img.shields.io/badge/Branch-main%20only-22D3EE.svg)](https://github.com/p2480240-cmd/CodePhantom)
[![Repository Size](https://img.shields.io/badge/Repo%20Size-%3C%202%20MB%20(Limit%2010MB)-14B8A6.svg)](https://github.com/p2480240-cmd/CodePhantom)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 1. Project Overview & Problem Statement

### The Problem
Beginners learn faster by finding and fixing broken code than by passively reading theory, watching video courses, or answering rote memorization questions. However, conventional practice exercises quickly run out and lack excitement.

### The Solution: CodePhantom
**CodePhantom** is a gamified cyber-detective debugging arena where:
1. **The AI creates the bug:** Google Gemini synthesizes deliberate, reproducible, educational code anomalies on demand.
2. **The learner investigates:** The detective reads realistic story cases, examines broken snippets, and follows 3-tiered progressive clues (*Spot the Shadow*, *Follow the Clue*, *Narrow the Search*).
3. **The learner fixes the code:** Using an interactive, syntax-aware code editor, learners edit and run tests inside a secure client-side sandbox.
4. **The system validates:** Test cases verify inputs, expected outputs, execution times, and edge cases.
5. **The learner masters the concept:** Post-mortem analysis explains *why* the bug occurred and compares faulty logic against corrected logic.

---

## 🎮 2. Core Features

- **Cyber-Detective Visual Identity:** High-contrast Dark Cyberpunk theme featuring *Phantom Midnight* (`#080D1B`), *Spectral Purple* (`#8B5CF6`), and *Phantom Cyan* (`#22D3EE`), with animated vector mascot and floating bug glyphs.
- **AI-Powered Bug Synthesis:** Server/Client Gemini 2.5 Flash integration with JSON schema validation, test verification (ensures broken code fails and reference solution passes), and automatic fallback to verified curated cases.
- **Story-Driven Campaign (5 Sectors):**
  - **Sector 1: The Neon Outskirts** — Loops and introductory logic bugs.
  - **Sector 2: The Phantom Vault** — Compound boolean logic and permission flaws.
  - **Sector 3: Cybernetic Core** — State mutation, telemetry accumulation, and scope leaks.
  - **Sector 4: Temporal Nexus** — Chrono off-by-one errors and indexing edge-cases.
  - **Sector 5: Deep Shadow Matrix** — Deduplication, truthy/falsy evaluation, and algorithmic traps.
- **Interactive Learn Mode (No Boring Lectures):** Micro-lessons featuring in-place code editing, instant validation, and concise architectural takeaways.
- **Debugging Arena (Hunt Mode):** Real-time code execution, line-numbered editor, Tab indentation, test case diffs (`Expected vs Got`), standard output logs, and progressive clues.
- **3-Stage Progressive Clues:**
  - *Hint 1 — Spot the Shadow:* Points toward the suspicious block.
  - *Hint 2 — Follow the Clue:* Explains the underlying programming principle.
  - *Hint 3 — Narrow the Search:* Suggests actionable debugging directions.
  - *Reference Solution:* Forfeits independent bonus to reveal the full verified fix.
- **Gamified Progression & Quests:** XP gains, Detective Ranks (from *Novice Detective* to *Grand Phantom Master*), daily quests, and 8 unique achievement trophies.
- **Forensic Reports & 365-Day Activity Heatmap:** GitHub-style interactive contribution grid, concept radar, monthly case debriefs, annual recap, and shareable detective cards.
- **Arena Leaderboard:** Weekly, Monthly, and All-Time rankings with clear labels distinguishing local demo mode from live rankings.
- **One-Click Judge Demo Mode:** Instantly experience the full platform without creating an account or supplying an API key.

---

## 🛠️ 3. Technology Stack

- **Frontend Core:** React 18, TypeScript, Vite
- **Styling & Theme:** Tailwind CSS with custom neon palettes and responsive dark mode
- **Icons & Visuals:** Lucide Icons, 100% vector SVG mascot & logo (zero heavy raster images)
- **Effects:** Canvas Confetti for victory celebrations
- **Execution Engine:** Secure in-browser JavaScript sandbox & Python logic interpreter with timeout watchdogs
- **AI Integration:** Google Gemini 2.5 Flash via REST API

---

## 🏗️ 4. Architecture

```
CodePhantom/
├── .gitignore              # Strict ignore rules (node_modules, dist, secrets, caches)
├── .env.example            # Environment variables documentation
├── index.html              # Custom SVG favicon & viewport setup
├── package.json            # Lightweight dependencies (< 5 packages)
├── tsconfig.json           # Modern TypeScript compiler options
├── tailwind.config.js      # Dark cyberpunk design tokens
├── vite.config.ts          # Vite build configuration
└── src/
    ├── types/              # Comprehensive TypeScript interfaces
    ├── services/
    │   ├── storageService.ts        # LocalStorage persistence & streak tracker
    │   ├── challengeService.ts      # Curated story mission collection
    │   ├── aiChallengeService.ts    # Gemini 2.5 synthesis & validation
    │   ├── codeExecutionService.ts  # Sandboxed execution & test runner
    │   └── learnService.ts          # Interactive concept micro-lessons
    ├── components/
    │   ├── PhantomLogo.tsx          # Custom SVG code brackets + magnifier
    │   ├── PhantomMascot.tsx       # Animated hooded phantom detective SVG
    │   ├── CodeEditor.tsx           # Line-numbered syntax editor with Tab key support
    │   ├── TestResultsPanel.tsx     # Test suite diagnostics & diffs
    │   ├── ProgressiveHintsPanel.tsx# 3-tier clues & solution reveal
    │   ├── HeatmapGrid.tsx          # 365-day interactive contribution grid
    │   ├── BadgeIcon.tsx            # SVG achievement badge icons
    │   ├── VictoryModal.tsx         # Victory celebration & post-mortem debrief
    │   ├── AICaseGeneratorModal.tsx # On-demand Gemini prompt modal
    │   ├── SettingsModal.tsx        # API key & preference configuration
    │   ├── AuthModal.tsx            # One-click demo mode & alias setup
    │   ├── OnboardingModal.tsx      # 4-step induction protocol wizard
    │   ├── Navbar.tsx               # Responsive nav with streak & status pill
    │   └── Footer.tsx               # Links & repository metrics
    ├── pages/
    │   ├── LandingPage.tsx          # Hero with live coding preview (matches design mockup)
    │   ├── DashboardPage.tsx        # Detective hub answering 3 core questions
    │   ├── HuntPage.tsx             # Main debugging arena workspace
    │   ├── LearnPage.tsx            # Guided concept debugging lessons
    │   ├── MissionMapPage.tsx       # 5 cyber campaign sectors
    │   ├── LeaderboardPage.tsx      # Weekly / monthly / all-time leaderboards
    │   ├── ReportsPage.tsx          # 365-day heatmap & monthly/annual recaps
    │   └── AchievementsPage.tsx     # Trophy case & unlock criteria
    ├── App.tsx                      # Main app shell & router
    ├── main.tsx                     # Entry point
    └── index.css                    # Tailwind directives & glow utilities
```

---

## 🚀 5. Getting Started & Setup

### Prerequisites
- Node.js `v18+` or `v20+` (tested on Node v24.20.0)
- npm `v9+` or `v11+`

### Installation
```bash
# 1. Clone repository
git clone https://github.com/p2480240-cmd/CodePhantom.git
cd CodePhantom

# 2. Install lightweight dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔑 6. Configuration & Environment Variables

Create a `.env.local` file in the root directory (optional):

```bash
cp .env.example .env.local
```

### Supported Variables
| Variable | Description | Default |
|---|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for on-demand AI case synthesis | *Empty (uses curated fallback)* |
| `VITE_GEMINI_MODEL` | Gemini model identifier | `gemini-2.5-flash` |
| `VITE_SANDBOX_API_URL` | Optional remote isolated Docker/gVisor runner | *Empty (uses client-side sandbox)* |

> **Privacy & Security Guarantee:**
> CodePhantom operates 100% locally by default. If a Gemini API key is configured (either in `.env.local` or through the in-app Settings modal), it is stored solely in your browser's `localStorage` and never committed or sent to any third-party telemetry.

---

## 🔒 7. Execution Sandbox & Security

1. **Untrusted Code Isolation:**
   - User submissions and AI snippets are treated as untrusted input.
   - The browser-based JavaScript sandbox shadows critical global objects (`window`, `document`, `fetch`, `XMLHttpRequest`, `localStorage`, `Worker`) to prevent tampering.
   - Deep-cloned inputs ensure test cases cannot mutate shared memory state.
2. **Infinite Loop Protection:**
   - Loop execution limits and timeouts prevent browser thread freezes.
3. **Remote Container Integration (Production Ready):**
   - For enterprise deployments, specify `VITE_SANDBOX_API_URL` to route code execution through an isolated containerized worker (Docker / gVisor).

---

## 🏆 8. Hackathon Verification & Constraints

### 1. Single Branch Constraint
CodePhantom maintains **exactly one Git branch**, named `main`. No dev, feature, or backup branches exist.

Verify with:
```bash
git branch --list
# Expected output: * main
```

### 2. Repository Size Under 10 MB Constraint
The entire repository is engineered to remain well under 2 MB (strictly below the 10 MB limit) by avoiding large raster illustrations, node_modules commits, and heavy dependencies.

Verify with:
```bash
# Check Git object database size
git count-objects -vH

# Check working tree status (clean, no untracked build artifacts)
git status --short
```

---

## 📜 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
