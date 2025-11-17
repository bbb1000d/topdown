import { BrotatoLikeGame, TILE_SIZE, CHARACTERS } from './roguelike.js';

const MIN_WIDTH_TILES = 52;
const MIN_HEIGHT_TILES = 30;

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
    heroLabel: document.getElementById('hero-label'),
    startScreen: document.getElementById('start-screen'),
    startButton: document.getElementById('start-button'),
    characterGrid: document.getElementById('character-grid'),
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
    changeHeroButton: document.getElementById('change-hero'),
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

  let selectedHero = null;

  function selectHero(hero) {
    selectedHero = hero;
    ui.startButton.disabled = !hero;
    Array.from(ui.characterGrid.children).forEach((card) => {
      const match = card.dataset.id === hero?.id;
      card.setAttribute('data-selected', match ? 'true' : 'false');
      card.setAttribute('aria-selected', match ? 'true' : 'false');
    });
  }

  CHARACTERS.forEach((hero) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'character-card';
    card.dataset.id = hero.id;
    card.setAttribute('role', 'option');
    card.setAttribute('aria-selected', 'false');
    card.innerHTML = `
      <div class="tag">${hero.role}</div>
      <h3>${hero.name}</h3>
      <p>${hero.description}</p>
    `;
    card.addEventListener('click', () => selectHero(hero));
    ui.characterGrid.appendChild(card);
  });

  ui.startButton.addEventListener('click', () => {
    if (!selectedHero) return;
    game.start(selectedHero.id);
  });

  ui.skipButton.addEventListener('click', () => game.startNextWave());
  ui.rerollButton.addEventListener('click', () => game.rerollShop());
  ui.playAgainButton.addEventListener('click', () => {
    if (selectedHero) {
      game.start(selectedHero.id);
    }
  });

  ui.changeHeroButton.addEventListener('click', () => {
    game.backToHeroSelect();
    selectedHero = null;
    ui.startButton.disabled = true;
    Array.from(ui.characterGrid.children).forEach((card) => {
      card.setAttribute('data-selected', 'false');
      card.setAttribute('aria-selected', 'false');
    });
  });
});
