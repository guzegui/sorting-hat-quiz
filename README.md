# Facing the Sorting Hat: A Magical Vue.js Quiz

A chat-based interactive quiz inspired by the world of **Harry Potter**, built with **Vue 3**, **Pinia**, **Tailwind CSS**, and **Vite**.  
Answer a series of magical questions to discover which Hogwarts house truly matches your spirit — **Gryffindor**, **Hufflepuff**, **Ravenclaw**, or **Slytherin**.

---

## Project Overview

This project was developed as part of the **WITH Madrid front-end technical test**, titled **“Facing the Sorting Hat.”**  
It reimagines the classic Sorting Hat ceremony as a playful **chat conversation**, where each question and answer is animated to create a seamless, immersive user experience.

### Features

- Animated chat-like interface for all questions and answers
- Persistent state using **Pinia**
- Dynamic score visualization with **Chart.js**
- Fast development with **Vite**
- Styled using **Tailwind CSS**
- Fully responsive from mobile to desktop

---

## Tech Stack

| Technology                  | Purpose                         |
| --------------------------- | ------------------------------- |
| **Vue 3 (Composition API)** | Reactive front-end framework    |
| **Pinia**                   | State management                |
| **Vite**                    | Lightning-fast build tool       |
| **TypeScript**              | Type safety                     |
| **Tailwind CSS**            | Utility-first styling           |
| **Chart.js**                | Chart visualization for results |

---

## Dependencies

### Runtime

```json
{
  "chart.js": "^4.5.1",
  "pinia": "^3.0.4",
  "vue": "^3.5.22",
  "vue-router": "^4.6.3"
}
```

### Development

```json
{
  "@tailwindcss/vite": "^4.1.17",
  "@types/node": "^24.6.0",
  "@vitejs/plugin-vue": "^6.0.1",
  "@vue/tsconfig": "^0.8.1",
  "tailwindcss": "^4.1.17",
  "typescript": "~5.9.3",
  "vite": "^7.1.7",
  "vue-tsc": "^3.1.0"
}
```

---

## Build & Run Instructions

### Prerequisites

Make sure you have:

- **Node.js** ≥ 18
- **npm** ≥ 9

### Run in Development Mode

Start a local dev server with hot reload:

```bash
npm install
npm run dev
```

Then open your browser at [http://localhost:5173](http://localhost:5173).

### Build for Production

Compile an optimized production build:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

---

## How It Works

1. The quiz loads all questions from [`sorting_hat.json`](./sorting_hat.json).
2. Each answer contributes points to one or more houses.
3. After all questions are answered, the app calculates total scores.
4. The house with the highest score becomes your assigned house.
5. A results screen displays a **Chart.js graph** showing all house scores.

---

## Contributing

Contributions are very welcome! Follow these steps to collaborate on this open-source project.

### 1. Fork & Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sorting-hat-quiz.git
cd sorting-hat-quiz
npm install
```

### 2. Create a Feature Branch

```bash
git checkout -b feat/your-feature-name
```

### 3. Follow Conventional Commits

All commits must follow the **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** standard.
This ensures a clean commit history and helps automate versioning.

Examples:

```
feat: add animated transitions to question messages
fix: correct score calculation for Gryffindor answers
docs: update README with contribution guidelines
```

### 4. Commit and Push

```bash
git add .
git commit -m "feat: your descriptive message"
git push origin feat/your-feature-name
```

### 5. Open a Pull Request

Submit your pull request and describe your changes clearly.
Attach screenshots, demos, or context if relevant.

#### Contribution Guidelines

- Use **TypeScript** for new components or utilities.
- Keep **components modular** and follow Vue’s composition style.
- Use **TailwindCSS** for styling (avoid inline styles).
- Ensure `npm run build` succeeds before pushing.

---

## License

### MIT License

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

> _Disclaimer:_ This is a **non-commercial, fan-made educational project** inspired by the **Harry Potter** universe.
> All related names, characters, and settings are trademarks of **J.K. Rowling** and **Warner Bros. Entertainment Inc.**
> This project is not affiliated with or endorsed by either party.

---
