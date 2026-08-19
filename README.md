

# 🗺️ Wander Quest — Multilingual Local Scavenger Hunt Generator

**Wander Quest** is an interactive, web-based scavenger hunt app powered by Google's Gemini models (`gemini-1.5-flash`). It transforms any city or town into an immersive, localized adventure featuring cryptic riddles, native-language audio stories, and lenient AI photo verification.

---

## 🌟 Key Features

* **AI-Generated Quests:** Crafts customized 3-stop scavenger hunt itineraries using structured JSON from `gemini-1.5-flash` based on location, duration, and theme.
* **Multilingual UI & Audio Stories:** Full internationalization (i18n) across English, Spanish, French, Japanese, and German. Generates and plays localized audio stories for each stop using browser Text-to-Speech.
* **Lenient Vision Verification:** Uses Gemini Multimodal Vision to verify landmark photo uploads with a forgiving threshold (accepts night shots, odd angles, or slight blur).
* **Progressive Visual Hints:** If photo verification fails, Gemini provides targeted feedback on missing visual elements to help players retry.
* **Demo Mode & API Key Modal:** Toggle **Demo Mode** ON to test the full flow with pre-loaded mock data without consuming API tokens, or input your own Google AI Studio API key directly into the application.
* **Obscure Location Fallback:** Includes optional county/state/region fields to prevent AI hallucination for small or ambiguous towns.
* **State Persistence:** Automatically saves active quest progress and API keys to `localStorage`.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS
* **Build Tool:** Vite
* **AI Model:** Google AI Studio (`gemini-1.5-flash`)
* **State & Persistence:** React Context API + `localStorage`

---

## 🚀 Quick Start Guide

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* A free [Google AI Studio API Key](https://aistudio.google.com/)

### Installation & Local Setup

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/wander-quest-scavenger-hunt.git
cd wander-quest-scavenger-hunt

```


2. **Install dependencies:**
```bash
npm install

```


3. **Start the local development server:**
```bash
npm run dev

```


4. **Access the application:**
Open `http://localhost:5173` in your browser.

---

## 🎯 How to Use

1. **Demo Mode (Instant Testing):** Switch the **Demo Mode** toggle in the header to **ON** to instantly test the app using sample hunt data and mock verification photos.
2. **Live AI Mode:** Click the **API Key** button in the top header, paste your Google AI Studio API key, turn **Demo Mode** OFF, and enter any location in the setup screen to generate a live hunt.

---

## 📜 License

This project was by Bhairavi Desai. Video : https://youtu.be/KAqC7vlF80o
