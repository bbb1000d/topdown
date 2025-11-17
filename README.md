# Neon Spud

A Brotato-style arena survivor. Choose a potato hero, survive neon synth
creatures for twelve waves, and spend the scrap you scoop up on wild upgrades
between rounds.

## Features

- **4 playable characters** with unique stat kits (crit-stacked witch, tanky
  bulwark, hyper-mobile scout, and a gunner that floods the arena with bolts).
- **Expanded enemy roster** including swarmers, chargers, gunners that shoot back
  and wave-gated bosses with huge health pools and bespoke drops.
- **Large arena** that scales with your viewport so kiting space always feels
  generous on desktop monitors.
- **Rarity-driven shop** stocked with a dozen items spanning common, rare, and
  epic tiers plus escalating reroll costs.
- **Combat polish** such as glowing gradients, parallax grids, bullet trails, and
  different projectile colors for enemies and the player.

## Play

Open `index.html` in your browser (or run a simple static server such as
`python -m http.server 8000` and visit `http://localhost:8000`). The canvas
resizes with the window, so fullscreen is recommended.

## Controls

- **Move:** WASD
- **Shoot:** Automatic (locks on the closest enemy)
- **Shop / Continue:** Click buttons when the between-wave overlay appears

## Loop

1. Pick a hero on the start screen and launch the run.
2. Survive the timer for each wave. Any remaining enemies must be cleared once
   the timer expires.
3. Collect materials dropped by enemies to spend on upgrades and rerolls.
4. Every fourth wave spawns a neon boss—beat it for a shower of loot.
5. Reach Wave 12 to claim victory.
