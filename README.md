<img width="1918" height="873" alt="image" src="https://github.com/user-attachments/assets/d0ee471f-5bf6-4d73-984d-84bfa7f4b2ee" />
# Crash Game

A simple, offline-capable browser "crash" game rendered on HTML5 canvas. This repo uses a clean, modular structure (no frameworks) and runs via any static HTTP server.


## Project structure

```
Crash.html           # Main page with markup
crash.css            # Styles
constants.js         # Global state and constants (canvas, ctx, gameState, etc.)
effects.js           # Visual helpers (glow pulse, side multipliers, seconds)
logic.js             # Core game logic (start, cashout, update loop, drawing)
ui.js                # UI wiring (init, event listeners, offline init)
Crash.js             # Thin aggregator (kept for backward compatibility)
docs/screenshots/    # Put images/GIFs here for README
```

## How it works 
- Offline-first: `OFFLINE_MODE = true` simulates balance locally (no backend required).
- UI flow: set bet → Start (green button shows Cashout amount) → either Cashout or wait (risk crash).
- Canvas draws the curve in real time; glow color and bottom panel update with game state.


## Development notes<img width="1918" height="873" alt="crashgame" src="https://github.com/user-attachments/assets/7837a362-8b4a-4999-b848-0556a5c1f67d" />

- This codebase is intentionally framework-free and uses global scope for simplicity.
- If you later add a backend, set `OFFLINE_MODE = false` and implement `/api/crash/bet`, `/api/crash/cashout`, `/api/crash/loss`.


## License
Choose a license before publishing (MIT is a common default). Add a `LICENSE` file to the repo root. 
