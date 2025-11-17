# Neon Spud

A browser-based, Brotato-inspired survival arena. Pilot a neon potato, auto-fire at
incoming synth creatures, and survive twelve escalating waves while buying upgrades
between rounds.

## Play

Open `index.html` in your browser (or run a simple static server such as
`python -m http.server 8000` and visit `http://localhost:8000`). The canvas
resizes with the window, so fullscreen is recommended.

## Controls

- **Move:** WASD
- **Shoot:** Automatic (locks on the closest enemy)
- **Shop / Continue:** Click buttons when the between-wave overlay appears

## Loop

1. Survive the timer for each wave. Any remaining enemies must be cleared once
   the timer expires.
2. Collect materials dropped by enemies to spend on upgrades.
3. Between waves, choose from three shop cards, rerolling if needed.
4. Reach Wave 12 to claim victory.

The prototype focuses on the feel of Brotato—quick rounds, simple inputs, and a
steady drip of stat upgrades—wrapped in a neon seaside palette.
