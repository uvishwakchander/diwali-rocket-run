# 🚀 Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore

[![Play Live Online](https://img.shields.io/badge/Live_Game-Play_Online-gold?style=for-the-badge&logo=google-chrome)](https://uvishwakchander.github.io/diwali-rocket-run/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-uvishwakchander%2Fdiwali--rocket--run-purple?style=for-the-badge&logo=github)](https://github.com/uvishwakchander/diwali-rocket-run)
[![Hosting & Database](https://img.shields.io/badge/Cost-100%25_FREE-brightgreen?style=for-the-badge)](https://github.com/uvishwakchander/diwali-rocket-run)

A fun, fast-paced festive **3D Diwali flight runner** that runs directly in any modern web browser on laptops, phones, and tablets—no installations or downloads needed!

---

## 🌐 Play Live URL

The game is hosted for **100% free forever** on **GitHub Pages**:
### 🎮 👉 **[https://uvishwakchander.github.io/diwali-rocket-run/](https://uvishwakchander.github.io/diwali-rocket-run/)** 👈

---

## 🌟 What is this Game About?

It is Diwali night! Your mission is to launch a traditional Indian festival rocket from **CDC2 Chennai** and pilot it safely along the highway to the grand celebration at **BDC14 Bangalore** (a total distance of 350 km in a thrilling 60-second sprint!). 

Along the way, you fly through famous landmark cities:
1. 🏁 **CDC2 Chennai** (Starting Line)
2. 🏰 **Vellore** (Passing the historic stone fort)
3. ⛰️ **Krishnagiri** (Cruising past the rocky hills)
4. 🌉 **Hosur** (Crossing the border gateway)
5. 🎯 **BDC14 Bangalore** (Grand Diwali fireworks finale!)

To win, steer your rocket through the sky, dodge obstacles, keep your fuel tank full, and arrive in Bangalore in style!

---

## 🎮 How to Play

### Controls (Super Simple!)

| What to Press | What Happens |
|---|---|
| **Spacebar** / **Up Arrow** / **W** | **Climb & Thrust** (makes the rocket fly up) |
| **Down Arrow** / **S** | **Dive** (steers downwards) |
| **Left Arrow** / **A** | **Steer Left** |
| **Right Arrow** / **D** | **Steer Right** |
| **Mouse / Touch Screen** | **Drag & Hold** or tap on-screen joystick to steer anywhere |
| **P** or **Escape** | **Pause Game** |

---

## 🎯 What to Collect & What to Avoid

### ✅ Things to Capture (Good Items!)

| Item | What it Looks Like | What You Get |
|:---:|---|---|
| 🪙 | **Lakshmi Gold Coin** | **+250 Points** and a **+5% Fuel boost**! |
| 🚀 | **Nitro Rocket** | **Refills half your fuel tank (+50%)** and gives you turbo speed! |
| 🪔 | **Diya Shield** | Puts a golden glowing bubble around your rocket for **8 seconds of invulnerability**! |
| ✨ | **Sparkler Boost** | Shoots golden sparks, gives you **2X Double Points**, and speeds you up! |

---

## ❌ Things to Dodge (Hazards!)

| Hazard | What it Looks Like | What Happens if You Hit It |
|:---:|---|---|
| 🌧️ | **Rain Clouds** | Wet storm clouds that kill your speed and damage the rocket. |
| 🐦 | **Birds** | Flying birds that knock your rocket and cost you **1 Heart**. |
| 🏙️ | **Tall Buildings** | High-rise concrete towers you must fly around (**-1 Heart**). |
| ⚡ | **Electric Wires** | Dangerous high-voltage power lines with sparking electricity (**-1 Heart**). |
| 🌀 | **Wind Gusts** | Spinning air funnels that blow your rocket off-course. |

---

## 🌍 Global Champions Leaderboard & Telemetry Capture

This game features a **worldwide shared leaderboard** and **real-time play session telemetry** powered by a **100% free Google Sheets backend** ($0 / ₹0 forever):

1. **Global Champions**: Scores submitted by any player anywhere in the world appear on the in-game leaderboard across all devices!
2. **Telemetry Log**: Every single flight session logs:
   - Date & Time
   - Pilot Name
   - Celebration Score
   - Mission Status (`VICTORY` vs `CRASH`)
   - Milestone City reached
   - Distance traveled (km)
   - Lakshmi coins collected
   - Flight duration (seconds)
   - Remaining fuel percentage
   - Device platform (Mobile vs Desktop)

### How to Connect Your Own Private Google Sheet in 60 Seconds:
1. Open [Google Sheets](https://sheets.new) and create a new blank sheet named: `Diwali Rocket Run - Champions & Telemetry`.
2. Click **Extensions** ➔ **Apps Script**.
3. Delete existing code, paste the contents of [`backend/google-apps-script.js`](backend/google-apps-script.js), and click **Save** (💾).
4. Click **Deploy** (top-right blue button) ➔ **New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy your **Web app URL**.
5. Paste that URL into [`js/config.js`](js/config.js) in the `API_URL` property:
   ```javascript
   API_URL: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   ```
6. Commit & push! You can now watch real-time rows appearing in your Google Sheet whenever anyone plays!

*(Note: If `API_URL` is left blank, the game still works flawlessly using local offline storage and built-in festive champions).*

---

## 🚀 How to Enable GitHub Pages (1-Click Setup)

To turn on your live URL on GitHub:
1. Go to your repository settings:
   **[https://github.com/uvishwakchander/diwali-rocket-run/settings/pages](https://github.com/uvishwakchander/diwali-rocket-run/settings/pages)**
2. Under **Build and deployment**:
   - **Source:** Select **GitHub Actions** (recommended) OR **Deploy from a branch** (`main` / `root`).
3. GitHub will deploy the site within 60 seconds! Your live URL is:
   $$\text{https://uvishwakchander.github.io/diwali-rocket-run/}$$

---

## 📁 Code Architecture (Plain English Guide)

```
Diwali Rocket/
├── index.html                  → The Game Webpage & Festive Menus
├── play.bat                    → 1-Click Local Windows Launcher
├── .github/workflows/deploy.yml→ GitHub Pages Automatic Deployment
├── backend/
│   └── google-apps-script.js   → 100% Free Global Leaderboard & Telemetry Backend
├── css/
│   └── style.css               → Festive Styling, Rangoli Borders, Mobile UI
└── js/
    ├── config.js               → Global Game Configuration & Cloud API URL
    ├── game.js                 → Game Loop, Telemetry Dispatcher, HUD Director
    ├── entities3d.js           → Flight Mechanics, 60s Sprint Pacing, Collisions
    ├── models.js               → Procedural 3D Models (Rocket, Diyas, Coins, Hazards)
    ├── world.js                → Highway Scenery, Arch Gates, Skydome
    ├── particles3d.js          → Particle Systems (Fireworks, Sparks, Confetti)
    ├── audio.js                → Web Audio Procedural Sound Synthesizer
    └── three.min.js            → Bundled Offline Three.js (r128)
```

---

## 🏆 Scoring System

Your final celebration score is calculated based on:
- **Distance Covered:** Points earned for every kilometer covered from Chennai to Bangalore.
- **Lakshmi Coins:** +250 points for each coin collected.
- **Sparkler Multipliers:** Double points (2X) while powered by a sparkler.
- **Fuel Efficiency Bonus:** Leftover rocket fuel converts into bonus points upon victory!
- **Flight Time Bonus:** Faster flights earn massive bonus points at BDC14 Bangalore!

---

## 📄 Credits & License

- **Created by:** [uvishwakchander](https://github.com/uvishwakchander/)
- **Theme:** Indian Festival of Lights (Diwali) 🪔
- **Route:** NH48 Highway (CDC2 Chennai ➔ BDC14 Bangalore)
- **License:** Open-source and free to share under the [MIT License](https://opensource.org/licenses/MIT).
