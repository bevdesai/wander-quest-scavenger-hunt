# 📋 Project Charter: Wander Quest

## 1. Executive Summary
**Wander Quest** is an AI-powered, multilingual local scavenger hunt application designed to transform urban exploration into an interactive game. The app dynamically generates customized itineraries, cryptic riddles, native-language audio stories, and visual photo verification using Google’s Gemini API.

---

## 2. Project Vision & Objectives
* **Vision:** Create an accessible, immersive city exploration tool powered by generative and multimodal AI.
* **Core Objectives:**
  * Deliver dynamic, multi-stop scavenger hunts generated in under 10 seconds using `gemini-1.5-flash`.
  * Support full internationalization (i18n) across 5 languages (English, Spanish, French, Japanese, German) for both UI and content.
  * Implement lenient multimodal photo verification to validate user progress at each stop.
  * Provide a zero-cost **Demo Mode** for evaluation without live API keys.

---

## 3. Scope & Deliverables
* **In-Scope:**
  * Setup interface for city, duration, language, and theme selection.
  * Step-by-step card-based itinerary view with active state persistence (`localStorage`).
  * In-browser Text-to-Speech (TTS) audio narration for generated clues.
  * Camera upload modal integrated with Gemini Vision verification and progressive hint generation.
  * Header modal for custom Google AI Studio API key input and Demo Mode toggle.
* **Out-of-Scope:**
  * GPS-based real-time tracking/navigation (handled via visual step cards).
  * Native mobile app store releases (focused on web-first responsive design).

---

## 4. Stakeholders & Roles
* **Developer / Author:** [Your Name]
* **Target Audience:** Travelers, local explorers, families, and Coursera peer reviewers.
* **Evaluators:** Coursera Course Instructors & Peer Reviewers.

---

## 5. Technical Stack & AI Integration
* **Frontend:** React, TypeScript, Tailwind CSS, Vite.
* **AI Architecture:**
  * **Text & Logic:** `gemini-1.5-flash` with Structured JSON Output.
  * **Multimodal Vision:** Gemini Multimodal Vision API for landmark image matching.
* **State & Persistence:** Browser `localStorage` and React Context API.

---

## 6. Success Criteria
* 100% functional Demo Mode toggle allowing end-to-end testing without external API dependencies.
* Successful client-side UI translation across all 5 target languages.
* Robust error handling with fallbacks for obscure locations and image verification retries.
