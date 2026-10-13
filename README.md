# 💊 CareDose (MediCare+): Smart Medication & Family Care System

> **A Next-Generation Healthcare Management App** built for college project submission and clinical compliance demonstration. Beyond simple alarms, CareDose solves real-world challenges: missed doses, stock depletion, prescription management, elderly family care coordination, and emergency missed-dose escalation.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-3.8_Flash-8e75ff?logo=google)](https://ai.google.dev/)

---

## 🌟 Key Real-World Features

1. **⏰ Smart Medication Reminders**
   - Displays medicine name, dose strength, exact quantity, food timings (*After dinner*, *Empty stomach*, *Before breakfast*), schedule hour, and daily recurrence.
   - Interactive dose confirmation: `[ TAKEN ✓ ]`, `[ SKIPPED ]` (with symptom reason logging), and `[ SNOOZE 15m ]`.
   - Real-time Web Audio API synthesized medical alert chimes.

2. **📸 AI Medicine Strip Scanner (OCR)**
   - Multimodal optical analysis via `@google/genai` (`gemini-3.8-flash`).
   - Supports camera snapshot, file upload, or pre-loaded college demonstration strips (*Metformin*, *Augmentin*, *Atorvastatin*, *Paracetamol*).
   - Extracts: **Brand Name**, **Strength**, **Dosage Form**, **Expiry Date**, **Manufacturer**, **Active Chemical Salt**, and **Dietary Cautions**.
   - Includes a full verification form to review and edit extracted parameters before saving.

3. **📦 Dynamic Stock Tracking & Consumption Estimation**
   - Calculates real-time supply: remaining units divided by daily dosing rate provides accurate **days of medication remaining**.
   - Automatic decrement from stock on dose confirmation (and automatic rollback if undone).

4. **🛒 Automated Refill Reminders & Pharmacy Order Slips**
   - Color-coded depletion progress indicators with urgent low-stock thresholds.
   - 1-click **Record Refill** (+15, +30, +60 units).
   - **Pharmacy Order Slip Generator**: Formatted, copyable, and printable order summaries ready to share with pharmacists on WhatsApp.

5. **👨‍👩‍👦 Multi-Generational Family Care Hub**
   - Unified multi-profile switcher: *Self (Alex)*, *Father (Robert)*, *Mother (Elena)*, *Grandparent (Arthur)*, and *Child (Leo)*.
   - Displays real-time compliance for each family member in one place.
   - Dedicated guardian contact assignment (Phone, Email, Relationship).

6. **🚨 Missed Dose Escalation System**
   - Dedicated elderly safety protocol:
     - **T + 0m**: Primary reminder chime.
     - **T + 15m**: Repeated urgent snooze alert.
     - **T + 45m**: Automatic escalation alert dispatched to the designated family member's phone via SMS & push notification.
   - Built-in **Live Escalation Simulator** with audio sirens and simulated SMS gateway payload.

7. **📊 Adherence Analytics & Clinical Telemetry**
   - Clinical 92% adherence scorecard across 14-day history.
   - Monday–Sunday weekly checklist tracking taken vs. missed doses.
   - **Export CSV**: Complete raw adherence telemetry formatted for EHR systems.
   - **Export PDF / Print**: Formatted printable clinical doctor summary report with physician sign-off block.

8. **🧾 Prescription Vault**
   - Secure digital storage for doctor consultation slips, clinic names, prescription dates, and linked medications.
   - Full-resolution document viewer with zoom and print options.

9. **👨‍⚕️ Doctor Appointment Reminders**
   - Follow-up visit reminders with clinic details, reason for visit, and calendar `.ics` download for Google & Apple Calendar.

10. **🛡️ Medicine Safety & Pharmacology Guide**
    - Non-diagnostic clinical reference database for drug-food interactions (Metformin GI comfort rules, Levothyroxine fasting rules, grapefruit contraindications).
    - Duplicate salt detector preventing accidental double-dosing of compounds (e.g., duplicate Paracetamol).

---

## 🏗️ System Architecture

```text
       CLIENT LAYER: Flutter / React Web Applet (Responsive)
       ┌───────────────────┼────────────────────┐
     Patient           Family Caregiver       Admin / Doctor
       │                   │                    │
       └───────────────────┼────────────────────┘
                           ↓ (REST / gRPC)
             BACKEND & CLOUD PLATFORM
       ┌───────────────────┼────────────────────┐
       ↓                   ↓                    ↓
  Firebase Auth     Cloud Firestore       Firebase Storage
  (Multi-User)             │              (Prescription Vault)
   • Login/Register        ├── users      (Encrypted Blobs)
   • Role RBAC             ├── medicines
   • Family Linking        ├── dose_logs
                           ├── appointments
                           └── escalations
                                   │
                                   ↓
                   NOTIFICATION ESCALATION ENGINE
                 Firebase Cloud Messaging (FCM) & SMS Gateway
                  • Scheduled Cron Reminder Worker
                  • Missed Dose Escalation Trigger
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18 or later
- **npm** or **yarn**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/caredose-medicare-app.git
cd caredose-medicare-app

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
NODE_ENV="development"
```
*(Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Deployment on Render

This repository is pre-configured with `render.yaml` for 1-click deployment on [Render](https://render.com):

1. Push this repository to GitHub.
2. In Render Dashboard, click **New +** -> **Web Service**.
3. Select your repository.
4. Settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
6. Click **Deploy**!

---

## 📄 License
This project is open-source under the [Apache-2.0 License](LICENSE).
