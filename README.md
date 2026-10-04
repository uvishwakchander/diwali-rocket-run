# 🚀 Diwali Rocket Run: CDC2 Chennai to BDC14 Bangalore

[![Play in Browser](https://img.shields.io/badge/Game-Play_Now-gold?style=for-the-badge&logo=google-chrome)](http://localhost:8080)
[![Author](https://img.shields.io/badge/Created_By-uvishwakchander-purple?style=for-the-badge&logo=github)](https://github.com/uvishwakchander/)
[![Cost](https://img.shields.io/badge/Hosting_Cost-100%25_FREE-brightgreen?style=for-the-badge)](https://github.com/uvishwakchander/)

A fun, festive **3D Diwali flight game** that runs directly in your web browser—no installation or downloads needed!

---

## 🌟 What is this Game About?

It is Diwali night! Your mission is to launch a traditional Indian festival rocket from **CDC2 Chennai** and fly it safely along the highway to the grand celebration at **BDC14 Bangalore** (a total distance of 350 km). 

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
| **Mouse / Touch Screen** | **Drag & Hold** to steer anywhere on the screen |
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

### ❌ Things to Dodge (Hazards!)

| Hazard | What it Looks Like | What Happens if You Hit It |
|:---:|---|---|
| 🌧️ | **Rain Clouds** | Wet storm clouds that kill your speed and damage the rocket. |
| 🐦 | **Birds** | Flying birds that knock your rocket and cost you **1 Heart**. |
| 🏙️ | **Tall Buildings** | High-rise concrete towers you must fly around (**-1 Heart**). |
| ⚡ | **Electric Wires** | Dangerous high-voltage power lines with sparking electricity (**-1 Heart**). |
| 🌀 | **Wind Gusts** | Spinning air funnels that blow your rocket off-course. |

---

## 📁 How the Code Works (Plain English Guide)

Everything in this game is organized into simple, dedicated files. Here is what each file does:

```
Diwali Rocket/
├── index.html       → The Game Screen (The Face)
├── play.bat         → One-Click Start Button
├── css/
│   └── style.css    → The Decorations & Colors (The Outfit)
└── js/
    ├── game.js      → The Referee & Scorekeeper (The Brain)
    ├── world.js     → The Scenery Builder (The Road & Sky)
    ├── models.js    → The 3D Artist (The Objects & Shapes)
    ├── entities3d.js→ The Flight Rules & Physics (The Engine)
    ├── audio.js     → The Sound Effects (The Music & SFX)
    ├── particles3d.js→ The Special Effects (Fireworks & Sparks)
    └── three.min.js → The 3D Graphics Library
```

---

### File-by-File Breakdown:

#### 1. `index.html` — *The Game Screen*
- This is the main webpage.
- Displays the **dashboard at the top**: your speed, health hearts, fuel gauge, score, and the route progress bar showing how close you are to Bangalore.
- Contains the pop-up windows: the **Start Screen**, **Pause Menu**, **Flight Instructions**, and the **Victory Celebration Screen**.

#### 2. `css/style.css` — *The Decorations & Festive Theme*
- Gives the game its rich Diwali festival look: golden borders, Rangoli-style designs, glowing night sky colors, and translucent glass cards.
- Controls mobile responsiveness so the game looks great on phones, tablets, and laptops.

#### 3. `js/game.js` — *The Referee & Game Director*
- The "master controller" of the game.
- It tracks your score, checks how far you have flown, moves the camera smoothly behind your rocket, and shows the celebration screen when you reach BDC14 Bangalore.
- Saves the **Top 5 High Scores** on your computer so you can compete with friends.

#### 4. `js/world.js` — *The Scenery Builder*
- Builds the 3D world you fly through:
  - The **highway road** connecting Chennai to Bangalore with roadside lights and clay Diyas.
  - The **night sky** filled with twinkling stars and a glowing full moon.
  - The **floating sky lanterns (Kandils)** gently rising into the air.
  - The **city entrance arches** that welcome you into Vellore, Krishnagiri, Hosur, and Bangalore.

#### 5. `js/models.js` — *The 3D Artist*
- Draws all the 3D objects in the game using code:
  - The traditional Diwali festival rocket (with its golden nosecone and wooden stick).
  - The spinning Lakshmi gold coins.
  - The earthen Diya lamps with flickering flames.
  - The obstacles: puffy rain clouds, flying birds, skyscrapers, and electrical poles.

#### 6. `js/entities3d.js` — *The Flight Rules & Physics*
- Handles how the rocket actually moves:
  - How fast it climbs when you press Spacebar, and how gravity pulls it down.
  - How it banks and tilts smoothly when you turn left or right.
  - How your fuel drops slowly over time and refills when you collect Nitro.
  - Checks for collisions: whether you grabbed a coin or hit a cloud.

#### 7. `js/audio.js` — *The Sound Generator*
- Makes all the sound effects **directly inside your web browser** without needing any downloaded sound files!
- Generates the roaring rocket engine, the magical chime when you grab a coin, the protective hum of the shield, the crash thud, and the triumphant victory music at the finish line.

#### 8. `js/particles3d.js` — *The Special Effects*
- Creates the visual magic:
  - The fiery exhaust and flying sparks trailing behind your rocket.
  - Colorful aerial fireworks bursting in the night sky.
  - Floating marigold flower petals and golden confetti showering down when you win in Bangalore.

#### 9. `play.bat` — *The Quick Launch Shortcut*
- A simple helper file for Windows. Just double-click it, and the game instantly opens in your favorite web browser!

---

## 🚀 How to Play Right Now

### On Your Own Computer:
1. Double-click the file named **`play.bat`**.
2. The game opens in your browser immediately.
3. Click **"IGNITE ROCKET 🚀"** and start flying!

---

## 🌐 How to Share it with Others for Free ($0)

Because this game is lightweight and runs entirely in the browser, you can put it on the internet for **100% free**:

1. **Option 1 (Drag & Drop in 30 Seconds):**
   - Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**.
   - Drag this entire `Diwali Rocket` folder onto the webpage.
   - You will instantly get a public link you can email or message to colleagues and friends!

2. **Option 2 (Using GitHub):**
   - Upload this project to your GitHub account under **[github.com/uvishwakchander](https://github.com/uvishwakchander/)**.
   - Turn on **GitHub Pages** in the repository settings.
   - You get a free permanent link like: `https://uvishwakchander.github.io/diwali-rocket-run/`

---

## 🏆 Scoring System

Your final score is calculated based on:
- **Distance Covered:** Points for every kilometer flown from Chennai towards Bangalore.
- **Coins Collected:** +250 points for every Lakshmi coin.
- **Speed Multipliers:** Double points when powered by a Sparkler!
- **Fuel Efficiency Bonus:** Extra bonus points for any leftover fuel when you cross the finish line.
- **Time Bonus:** The faster you complete the 350 km flight, the higher your score!

---

## 📄 Credits & License

- **Created by:** [uvishwakchander](https://github.com/uvishwakchander/)
- **Theme:** Indian Festival of Lights (Diwali) 🪔
- **Route:** NH48 Highway (CDC2 Chennai ➔ BDC14 Bangalore)
- **License:** Open-source and free to share under the [MIT License](https://opensource.org/licenses/MIT).
