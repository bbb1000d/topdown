import { BrotatoLikeGame, TILE_SIZE } from './roguelike.js';

const MIN_WIDTH_TILES = 40;
const MIN_HEIGHT_TILES = 24;

function resizeCanvas(canvas) {
  const widthTiles = Math.max(MIN_WIDTH_TILES, Math.ceil(window.innerWidth / TILE_SIZE));
  const heightTiles = Math.max(MIN_HEIGHT_TILES, Math.ceil(window.innerHeight / TILE_SIZE));
  const width = widthTiles * TILE_SIZE;
  const height = heightTiles * TILE_SIZE;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }
  return false;
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ui = {
    healthFill: document.querySelector('[data-health-fill]'),
    healthValue: document.getElementById('health-value'),
    waveLabel: document.getElementById('wave-label'),
    waveTimer: document.getElementById('wave-timer'),
    currencyValue: document.getElementById('currency'),
    startScreen: document.getElementById('start-screen'),
    startButton: document.getElementById('start-button'),
    shopOverlay: document.getElementById('shop-overlay'),
    shopOptions: document.getElementById('shop-options'),
    shopWave: document.getElementById('shop-wave'),
    shopMaterials: document.getElementById('shop-materials'),
    rerollButton: document.getElementById('reroll-button'),
    skipButton: document.getElementById('skip-button'),
    gameOverOverlay: document.getElementById('game-over'),
    gameOverTitle: document.getElementById('game-over-title'),
    gameOverSubtitle: document.getElementById('game-over-subtitle'),
    gameOverStats: document.getElementById('game-over-stats'),
    playAgainButton: document.getElementById('play-again'),
  };

  for (const [key, element] of Object.entries(ui)) {
    if (!element) {
      throw new Error(`Missing UI element: ${key}`);
    }
  }

  resizeCanvas(canvas);
  const game = new BrotatoLikeGame({ canvas, ui });

  window.addEventListener('resize', () => {
    if (resizeCanvas(canvas)) {
      game.handleResize();
    }
  });

  ui.startButton.addEventListener('click', () => game.start());
  ui.skipButton.addEventListener('click', () => game.startNextWave());
  ui.rerollButton.addEventListener('click', () => game.rerollShop());
  ui.playAgainButton.addEventListener('click', () => game.start());
});
