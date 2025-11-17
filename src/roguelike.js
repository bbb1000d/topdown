export const TILE_SIZE = 32;

const PLAYER_BASE_STATS = {
  radius: 18,
  speed: 220,
  maxHealth: 100,
  damage: 12,
  attackDelay: 0.45,
  projectileSpeed: 560,
  projectileLifetime: 1.1,
  projectiles: 1,
  spread: 0.12,
  critChance: 0.05,
  critMultiplier: 1.8,
  armor: 0,
  pickupRange: 60,
};

export const CHARACTERS = [
  {
    id: 'aurora',
    name: 'Aurora Scout',
    role: 'Skirmisher',
    description: '+15% move speed, +20 pickup range, +10 max HP.',
    apply: (player) => {
      player.speed *= 1.15;
      player.pickupRange += 20;
      player.maxHealth += 10;
      player.health = player.maxHealth;
    },
  },
  {
    id: 'arc',
    name: 'Arc Gunner',
    role: 'Artillery',
    description: '+1 projectile, +35% projectile speed, -10% damage.',
    apply: (player) => {
      player.projectiles += 1;
      player.projectileSpeed *= 1.35;
      player.damage *= 0.9;
    },
  },
  {
    id: 'bulwark',
    name: 'Stonefruit Bulwark',
    role: 'Tank',
    description: '+40 max HP, +6 armor, -10% move speed.',
    apply: (player) => {
      player.maxHealth += 40;
      player.health = player.maxHealth;
      player.armor += 6;
      player.speed *= 0.9;
    },
  },
  {
    id: 'witch',
    name: 'Rift Witch',
    role: 'Hexer',
    description: '+35% damage, +15% crit chance, -20 max HP.',
    apply: (player) => {
      player.damage *= 1.35;
      player.critChance += 0.15;
      player.maxHealth = Math.max(40, player.maxHealth - 20);
      player.health = player.maxHealth;
    },
  },
];

const ENEMY_TYPES = [
  { id: 'chaser', color: '#ff6f91', health: 45, speed: 110, damage: 8, radius: 16, minWave: 1 },
  { id: 'swarmer', color: '#7dd3fc', health: 30, speed: 190, damage: 6, radius: 12, minWave: 2 },
  { id: 'howler', color: '#7ee0d1', health: 70, speed: 140, damage: 10, radius: 16, minWave: 3 },
  {
    id: 'gunner',
    color: '#a78bfa',
    health: 90,
    speed: 110,
    damage: 10,
    radius: 18,
    minWave: 3,
    behavior: 'shooter',
    attackDelay: 1.6,
    fireRange: 520,
    projectileSpeed: 280,
    projectileDamage: 12,
  },
  {
    id: 'charger',
    color: '#f97316',
    health: 85,
    speed: 95,
    damage: 16,
    radius: 20,
    minWave: 4,
    behavior: 'charger',
    chargeSpeed: 290,
    chargeCooldown: [2.2, 4],
  },
  {
    id: 'brute',
    color: '#fcd34d',
    health: 160,
    speed: 80,
    damage: 20,
    radius: 22,
    minWave: 5,
    behavior: 'tank',
  },
];

const BOSS_TYPES = [
  {
    id: 'titan',
    name: 'Pulse Titan',
    color: '#fb7185',
    health: 1800,
    speed: 80,
    damage: 24,
    radius: 44,
    behavior: 'shooter',
    attackDelay: 0.9,
    fireRange: 640,
    projectileSpeed: 320,
    projectileDamage: 20,
    dropMultiplier: 6,
  },
  {
    id: 'wyrm',
    name: 'Singularity Wyrm',
    color: '#38bdf8',
    health: 2200,
    speed: 70,
    damage: 32,
    radius: 48,
    behavior: 'charger',
    chargeSpeed: 320,
    chargeCooldown: [2, 3.2],
    dropMultiplier: 7,
  },
  {
    id: 'idol',
    name: 'Myriad Idol',
    color: '#c084fc',
    health: 2600,
    speed: 85,
    damage: 28,
    radius: 46,
    behavior: 'tank',
    dropMultiplier: 8,
  },
];

const MATERIAL_DROP = { min: 4, max: 10 };
const MAX_WAVES = 12;
const BASE_WAVE_DURATION = 32;
const REROLL_BASE_COST = 5;

const SHOP_RARITY_WEIGHTS = {
  common: 55,
  rare: 30,
  epic: 15,
};

const SHOP_ITEMS = [
  {
    id: 'damage-up',
    name: 'Targeting Lens',
    description: '+25% damage.',
    cost: 25,
    rarity: 'rare',
    apply: (game) => {
      game.player.damage *= 1.25;
    },
  },
  {
    id: 'attack-speed',
    name: 'Trigger Gloves',
    description: '+25% attack speed.',
    cost: 30,
    rarity: 'rare',
    apply: (game) => {
      game.player.attackDelay = Math.max(0.12, game.player.attackDelay * 0.75);
    },
  },
  {
    id: 'scatter',
    name: 'Scatter Core',
    description: '+1 projectile, +5% spread.',
    cost: 35,
    rarity: 'rare',
    apply: (game) => {
      game.player.projectiles += 1;
      game.player.spread += 0.05;
    },
  },
  {
    id: 'speed',
    name: 'Jet Boots',
    description: '+15% movement speed.',
    cost: 28,
    rarity: 'common',
    apply: (game) => {
      game.player.speed *= 1.15;
    },
  },
  {
    id: 'health',
    name: 'Organic Armor',
    description: '+25 max HP, heal 25%.',
    cost: 32,
    rarity: 'common',
    apply: (game) => {
      game.player.maxHealth += 25;
      game.player.health = Math.min(
        game.player.maxHealth,
        game.player.health + game.player.maxHealth * 0.25
      );
    },
  },
  {
    id: 'lifesteal',
    name: 'Nanite Drink',
    description: 'Heal 2 HP per kill.',
    cost: 38,
    rarity: 'rare',
    apply: (game) => {
      game.player.lifeOnKill = (game.player.lifeOnKill || 0) + 2;
    },
  },
  {
    id: 'pickup',
    name: 'Magnet Drone',
    description: '+40 pickup range.',
    cost: 22,
    rarity: 'common',
    apply: (game) => {
      game.player.pickupRange += 40;
    },
  },
  {
    id: 'armor',
    name: 'Guard Plating',
    description: '+4 armor.',
    cost: 34,
    rarity: 'common',
    apply: (game) => {
      game.player.armor += 4;
    },
  },
  {
    id: 'crit',
    name: 'Volt Edge',
    description: '+8% crit chance, +0.4x crit damage.',
    cost: 33,
    rarity: 'rare',
    apply: (game) => {
      game.player.critChance += 0.08;
      game.player.critMultiplier += 0.4;
    },
  },
  {
    id: 'projectile-speed',
    name: 'Ion Thrusters',
    description: 'Shots travel 30% faster.',
    cost: 20,
    rarity: 'common',
    apply: (game) => {
      game.player.projectileSpeed *= 1.3;
    },
  },
  {
    id: 'temporal',
    name: 'Temporal Loop',
    description: 'Attack 35% faster, -10% damage.',
    cost: 45,
    rarity: 'epic',
    apply: (game) => {
      game.player.attackDelay = Math.max(0.12, game.player.attackDelay * 0.65);
      game.player.damage *= 0.9;
    },
  },
  {
    id: 'sprayer',
    name: 'Plasma Sprayer',
    description: '+2 projectiles, +10% spread.',
    cost: 55,
    rarity: 'epic',
    apply: (game) => {
      game.player.projectiles += 2;
      game.player.spread += 0.1;
    },
  },
  {
    id: 'bulwark',
    name: 'Stonehide',
    description: '+35 HP, +2 armor, -8% speed.',
    cost: 40,
    rarity: 'rare',
    apply: (game) => {
      game.player.maxHealth += 35;
      game.player.health = Math.min(game.player.maxHealth, game.player.health + 35);
      game.player.armor += 2;
      game.player.speed *= 0.92;
    },
  },
  {
    id: 'catalyst',
    name: 'Catalyst Core',
    description: '+15% damage, +10% attack speed.',
    cost: 44,
    rarity: 'rare',
    apply: (game) => {
      game.player.damage *= 1.15;
      game.player.attackDelay = Math.max(0.12, game.player.attackDelay * 0.9);
    },
  },
];

const SHOP_ITEMS_BY_ID = SHOP_ITEMS.reduce((map, item) => {
  map[item.id] = item;
  return map;
}, {});

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pickShopItem() {
  const total = SHOP_ITEMS.reduce((sum, item) => sum + (SHOP_RARITY_WEIGHTS[item.rarity] || 1), 0);
  let roll = Math.random() * total;
  for (const item of SHOP_ITEMS) {
    roll -= SHOP_RARITY_WEIGHTS[item.rarity] || 1;
    if (roll <= 0) return item;
  }
  return SHOP_ITEMS[SHOP_ITEMS.length - 1];
}

class InputHandler {
  constructor() {
    this.keys = new Set();
    window.addEventListener('keydown', (event) => this.#handleDown(event));
    window.addEventListener('keyup', (event) => this.#handleUp(event));
  }

  #handleDown(event) {
    const key = event.key.toLowerCase();
    if (['w', 'a', 's', 'd'].includes(key)) {
      event.preventDefault();
      this.keys.add(key);
    }
  }

  #handleUp(event) {
    const key = event.key.toLowerCase();
    if (this.keys.has(key)) {
      event.preventDefault();
      this.keys.delete(key);
    }
  }

  getMovementVector() {
    let vx = 0;
    let vy = 0;
    if (this.keys.has('w')) vy -= 1;
    if (this.keys.has('s')) vy += 1;
    if (this.keys.has('a')) vx -= 1;
    if (this.keys.has('d')) vx += 1;
    if (vx === 0 && vy === 0) return { x: 0, y: 0 };
    const length = Math.hypot(vx, vy) || 1;
    return { x: vx / length, y: vy / length };
  }
}

class HUDController {
  constructor(ui) {
    this.ui = ui;
  }

  setHealth(current, max) {
    const percent = clamp(current / max, 0, 1);
    this.ui.healthFill.style.transform = `scaleX(${percent})`;
    this.ui.healthValue.textContent = `${Math.max(0, Math.ceil(current))} / ${Math.ceil(max)}`;
    this.ui.healthFill.style.background =
      percent < 0.3 ? '#ff5678' : 'linear-gradient(90deg,#ff6f91,#f7ca57)';
  }

  setHero(name) {
    this.ui.heroLabel.textContent = name;
  }

  setWave(wave) {
    this.ui.waveLabel.textContent = wave;
    this.ui.shopWave.textContent = wave;
  }

  setTimer(time) {
    this.ui.waveTimer.textContent = `${time.toFixed(1)}s`;
  }

  setMaterials(amount) {
    this.ui.currencyValue.textContent = amount;
    this.ui.shopMaterials.textContent = amount;
  }

  toggleStartScreen(show) {
    this.ui.startScreen.classList.toggle('hidden', !show);
  }

  toggleShop(show) {
    this.ui.shopOverlay.classList.toggle('hidden', !show);
  }

  toggleGameOver(show) {
    this.ui.gameOverOverlay.classList.toggle('hidden', !show);
  }

  setShopOptions(options, onPurchase) {
    this.ui.shopOptions.innerHTML = '';
    options.forEach((option) => {
      const li = document.createElement('li');
      li.className = 'shop-option';
      li.dataset.rarity = option.rarity;
      const info = document.createElement('header');
      const rarity = document.createElement('span');
      rarity.className = 'rarity';
      rarity.textContent = option.rarity;
      const title = document.createElement('h3');
      title.textContent = option.name;
      const desc = document.createElement('p');
      desc.textContent = option.description;
      info.append(rarity, title, desc);
      const button = document.createElement('button');
      button.className = 'primary';
      button.textContent = option.soldOut ? 'Purchased' : `Buy (${option.cost})`;
      button.disabled = option.soldOut || option.disabled;
      button.addEventListener('click', () => onPurchase(option));
      li.append(info, button);
      this.ui.shopOptions.appendChild(li);
    });
  }

  setRerollCost(cost) {
    this.ui.rerollButton.textContent = `Reroll (${cost})`;
  }

  showResults({ victory, wave, materials, kills }) {
    this.ui.gameOverTitle.textContent = victory ? 'Victory!' : 'Run Over';
    this.ui.gameOverSubtitle.textContent = victory
      ? `You survived all ${MAX_WAVES} waves.`
      : `You fell during wave ${wave}.`;
    this.ui.gameOverStats.innerHTML = '';
    const stats = [
      ['Waves cleared', victory ? MAX_WAVES : Math.max(0, wave - 1)],
      ['Enemies defeated', kills],
      ['Materials banked', materials],
    ];
    stats.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      this.ui.gameOverStats.append(dt, dd);
    });
  }
}

export class BrotatoLikeGame {
  constructor({ canvas, ui }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ui = new HUDController(ui);
    this.input = new InputHandler();
    this.lastTime = 0;
    this.state = 'start';
    this.stats = { kills: 0 };
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.enemies = [];
    this.pickups = [];
    this.shopOptions = [];
    this.selectedHero = null;
    this.hero = null;
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
    this.ui.toggleStartScreen(true);
    this.ui.toggleShop(false);
    this.ui.toggleGameOver(false);
  }

  handleResize() {
    if (!this.player) return;
    this.player.x = clamp(this.player.x, this.player.radius, this.canvas.width - this.player.radius);
    this.player.y = clamp(this.player.y, this.player.radius, this.canvas.height - this.player.radius);
  }

  start(heroId) {
    if (heroId) {
      this.selectedHero = heroId;
    }
    if (!this.selectedHero) return;
    this.reset();
    this.ui.toggleStartScreen(false);
    this.ui.toggleGameOver(false);
    this.startWave(1);
  }

  backToHeroSelect() {
    this.state = 'start';
    this.ui.toggleGameOver(false);
    this.ui.toggleShop(false);
    this.ui.toggleStartScreen(true);
  }

  reset() {
    const hero = CHARACTERS.find((entry) => entry.id === this.selectedHero) || CHARACTERS[0];
    this.hero = hero;
    this.player = {
      ...PLAYER_BASE_STATS,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      health: PLAYER_BASE_STATS.maxHealth,
    };
    if (hero?.apply) {
      hero.apply(this.player);
    }
    this.ui.setHero(hero?.name || 'Hero');
    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.pickups = [];
    this.materials = 0;
    this.wave = 1;
    this.waveTimer = 0;
    this.waveDuration = 0;
    this.spawnTimer = 0;
    this.state = 'running';
    this.rerollCost = REROLL_BASE_COST;
    this.stats = { kills: 0 };
    this.ui.setMaterials(this.materials);
    this.ui.setHealth(this.player.health, this.player.maxHealth);
  }

  startWave(number) {
    this.wave = number;
    this.waveDuration = BASE_WAVE_DURATION + (number - 1) * 1.6;
    this.waveTimer = this.waveDuration;
    this.spawnTimer = 0;
    this.enemies = [];
    this.projectiles = [];
    this.enemyProjectiles = [];
    this.pickups = [];
    this.state = 'running';
    this.rerollCost = REROLL_BASE_COST + Math.floor(number * 0.8);
    this.bossQueued = number % 4 === 0;
    this.bossSpawned = false;
    this.ui.setWave(this.wave);
    this.ui.setTimer(this.waveTimer);
    this.ui.setMaterials(this.materials);
    this.ui.toggleShop(false);
  }

  startNextWave() {
    if (this.state !== 'shop') return;
    this.startWave(this.wave + 1);
  }

  rerollShop() {
    if (this.state !== 'shop') return;
    if (this.materials < this.rerollCost) return;
    this.materials -= this.rerollCost;
    this.ui.setMaterials(this.materials);
    this.generateShop();
    this.rerollCost = Math.ceil(this.rerollCost * 1.5);
    this.ui.setRerollCost(this.rerollCost);
  }

  loop(timestamp) {
    const delta = (timestamp - this.lastTime) / 1000 || 0;
    this.lastTime = timestamp;
    if (this.state === 'running') {
      this.update(delta);
    }
    this.render();
    requestAnimationFrame(this.loop);
  }

  update(dt) {
    this.updatePlayer(dt);
    this.updateProjectiles(dt);
    this.updateEnemyProjectiles(dt);
    this.updateEnemies(dt);
    this.updatePickups(dt);
    this.handleWave(dt);
  }

  updatePlayer(dt) {
    const movement = this.input.getMovementVector();
    this.player.x = clamp(
      this.player.x + movement.x * this.player.speed * dt,
      this.player.radius,
      this.canvas.width - this.player.radius
    );
    this.player.y = clamp(
      this.player.y + movement.y * this.player.speed * dt,
      this.player.radius,
      this.canvas.height - this.player.radius
    );
    this.player.cooldown = (this.player.cooldown || 0) - dt;
    if (this.player.cooldown <= 0) {
      const target = this.getClosestEnemy();
      if (target) {
        this.fireAt(target);
      }
    }
  }

  fireAt(target) {
    this.player.cooldown = this.player.attackDelay;
    const origin = { x: this.player.x, y: this.player.y };
    for (let i = 0; i < this.player.projectiles; i += 1) {
      const angle = Math.atan2(target.y - origin.y, target.x - origin.x);
      const spread = (Math.random() - 0.5) * this.player.spread * Math.PI;
      const heading = angle + spread;
      const speed = this.player.projectileSpeed;
      this.projectiles.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(heading) * speed,
        vy: Math.sin(heading) * speed,
        life: this.player.projectileLifetime,
        damage: this.player.damage,
      });
    }
  }

  updateProjectiles(dt) {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.life -= dt;
      if (projectile.life <= 0) return false;
      if (
        projectile.x < -50 ||
        projectile.y < -50 ||
        projectile.x > this.canvas.width + 50 ||
        projectile.y > this.canvas.height + 50
      ) {
        return false;
      }
      for (const enemy of this.enemies) {
        if (enemy.dead) continue;
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        if (dist < enemy.radius + 4) {
          let damage = projectile.damage;
          if (Math.random() < this.player.critChance) {
            damage *= this.player.critMultiplier;
          }
          enemy.health -= damage;
          if (enemy.health <= 0) {
            enemy.dead = true;
            this.stats.kills += 1;
            if (this.player.lifeOnKill) {
              this.player.health = Math.min(
                this.player.maxHealth,
                this.player.health + this.player.lifeOnKill
              );
              this.ui.setHealth(this.player.health, this.player.maxHealth);
            }
            this.dropMaterials(enemy);
          }
          return false;
        }
      }
      return true;
    });
  }

  updateEnemyProjectiles(dt) {
    this.enemyProjectiles = this.enemyProjectiles.filter((projectile) => {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.life -= dt;
      if (projectile.life <= 0) return false;
      if (
        projectile.x < -60 ||
        projectile.y < -60 ||
        projectile.x > this.canvas.width + 60 ||
        projectile.y > this.canvas.height + 60
      ) {
        return false;
      }
      const dist = Math.hypot(projectile.x - this.player.x, projectile.y - this.player.y);
      if (dist < this.player.radius + 6) {
        if (this.damagePlayer(projectile.damage)) {
          return false;
        }
        return false;
      }
      return true;
    });
  }

  updateEnemies(dt) {
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.dead) return false;
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.hypot(dx, dy) || 1;
      let speed = enemy.speed;
      enemy.attackCooldown = (enemy.attackCooldown || randRange(0, 0.6)) - dt;
      enemy.chargeTimer = (enemy.chargeTimer || randRange(1, 3)) - dt;

      if (enemy.behavior === 'charger') {
        if (enemy.chargeTimer <= 0) {
          enemy.charging = 0.8;
          const [min, max] = enemy.chargeCooldown || [2, 4];
          enemy.chargeTimer = randRange(min, max);
        }
        if (enemy.charging) {
          enemy.charging -= dt;
          speed = enemy.chargeSpeed || (enemy.speed * 2);
        }
      }

      if (enemy.behavior === 'shooter') {
        if (distance < (enemy.fireRange || 480) && enemy.attackCooldown <= 0) {
          this.spawnEnemyProjectile(enemy);
          enemy.attackCooldown = enemy.attackDelay || 1.2;
        }
        speed *= 0.65;
      }

      enemy.x += (dx / distance) * speed * dt;
      enemy.y += (dy / distance) * speed * dt;
      const newDistance = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
      if (newDistance < enemy.radius + this.player.radius) {
        if (this.damagePlayer(enemy.damage)) {
          return false;
        }
        if (!enemy.boss) {
          enemy.dead = true;
          this.stats.kills += 1;
          this.dropMaterials(enemy);
          return false;
        }
        return true;
      }
      if (enemy.health <= 0) {
        enemy.dead = true;
        this.stats.kills += 1;
        this.dropMaterials(enemy);
        return false;
      }
      return true;
    });
  }

  spawnEnemyProjectile(enemy) {
    const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
    const speed = enemy.projectileSpeed || 260;
    this.enemyProjectiles.push({
      x: enemy.x,
      y: enemy.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 2.5,
      damage: enemy.projectileDamage || enemy.damage,
    });
  }

  updatePickups(dt) {
    this.pickups = this.pickups.filter((pickup) => {
      const dx = this.player.x - pickup.x;
      const dy = this.player.y - pickup.y;
      const distance = Math.hypot(dx, dy);
      if (distance < this.player.pickupRange && distance > 0) {
        const pull = clamp((this.player.pickupRange - distance) / this.player.pickupRange, 0.2, 1);
        pickup.vx = (dx / distance) * 150 * pull;
        pickup.vy = (dy / distance) * 150 * pull;
      }
      pickup.x += pickup.vx * dt;
      pickup.y += pickup.vy * dt;
      pickup.life -= dt;
      const postDistance = Math.hypot(this.player.x - pickup.x, this.player.y - pickup.y);
      if (postDistance < this.player.radius + 4) {
        this.materials += pickup.value;
        this.ui.setMaterials(this.materials);
        return false;
      }
      return pickup.life > 0;
    });
  }

  handleWave(dt) {
    this.waveTimer -= dt;
    if (this.waveTimer <= 0 && this.enemies.length === 0 && this.enemyProjectiles.length === 0) {
      if (this.wave >= MAX_WAVES) {
        this.gameOver(true);
        return;
      }
      this.openShop();
      return;
    }
    this.ui.setTimer(Math.max(0, this.waveTimer));
    if (this.bossQueued && !this.bossSpawned && this.waveTimer < this.waveDuration - 5) {
      this.spawnBoss();
      this.bossSpawned = true;
    }
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.waveTimer > 0) {
      this.spawnEnemy();
      const baseInterval = Math.max(0.35, 1.4 - this.wave * 0.08);
      this.spawnTimer = randRange(baseInterval * 0.6, baseInterval * 1.2);
    }
  }

  openShop() {
    this.state = 'shop';
    this.generateShop();
    this.ui.setRerollCost(this.rerollCost);
    this.ui.toggleShop(true);
  }

  generateShop() {
    const choices = new Set();
    while (choices.size < 3) {
      const item = pickShopItem();
      choices.add(item.id);
    }
    this.shopOptions = Array.from(choices).map((id) => {
      const base = SHOP_ITEMS_BY_ID[id];
      return {
        ...base,
        disabled: this.materials < base.cost,
        soldOut: false,
      };
    });
    this.ui.setShopOptions(this.shopOptions, (option) => this.purchase(option));
  }

  purchase(option) {
    if (option.soldOut) return;
    if (this.materials < option.cost) return;
    this.materials -= option.cost;
    this.ui.setMaterials(this.materials);
    option.apply(this);
    this.ui.setHealth(this.player.health, this.player.maxHealth);
    option.soldOut = true;
    option.disabled = true;
    this.shopOptions = this.shopOptions.map((entry) => ({
      ...entry,
      soldOut: entry === option ? true : entry.soldOut,
      disabled: entry === option ? true : this.materials < entry.cost,
    }));
    this.ui.setShopOptions(this.shopOptions, (opt) => this.purchase(opt));
  }

  spawnEnemy() {
    const available = ENEMY_TYPES.filter((type) => this.wave >= type.minWave);
    const type = available[randInt(0, available.length - 1)];
    const { x, y } = this.randomEdgeSpawn();
    this.enemies.push({
      ...type,
      x,
      y,
      attackCooldown: randRange(0.2, 0.8),
    });
  }

  spawnBoss() {
    const index = Math.min(BOSS_TYPES.length - 1, Math.floor(this.wave / 4) - 1);
    const boss = BOSS_TYPES[index];
    const { x, y } = this.randomEdgeSpawn();
    this.enemies.push({
      ...boss,
      x,
      y,
      boss: true,
      health: boss.health,
      attackCooldown: 0,
    });
  }

  randomEdgeSpawn() {
    const edge = Math.floor(Math.random() * 4);
    let x;
    let y;
    if (edge === 0) {
      x = randRange(0, this.canvas.width);
      y = -40;
    } else if (edge === 1) {
      x = this.canvas.width + 40;
      y = randRange(0, this.canvas.height);
    } else if (edge === 2) {
      x = randRange(0, this.canvas.width);
      y = this.canvas.height + 40;
    } else {
      x = -40;
      y = randRange(0, this.canvas.height);
    }
    return { x, y };
  }

  dropMaterials(enemy) {
    const drops = enemy.boss ? enemy.dropMultiplier || 6 : 1;
    for (let i = 0; i < drops; i += 1) {
      const bonus = enemy.boss ? randInt(18, 28) : 0;
      const value = randInt(MATERIAL_DROP.min, MATERIAL_DROP.max) + bonus;
      this.pickups.push({
        x: enemy.x,
        y: enemy.y,
        vx: randRange(-40, 40),
        vy: randRange(-40, 40),
        value,
        life: 10,
      });
    }
  }

  getClosestEnemy() {
    let closest = null;
    let bestDist = Infinity;
    for (const enemy of this.enemies) {
      if (enemy.dead) continue;
      const dist = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
      if (dist < bestDist) {
        bestDist = dist;
        closest = enemy;
      }
    }
    return closest;
  }

  damagePlayer(amount) {
    const armorReduction = clamp(1 - this.player.armor * 0.02, 0.25, 1);
    const damage = Math.max(2, amount * armorReduction);
    this.player.health -= damage;
    this.ui.setHealth(this.player.health, this.player.maxHealth);
    if (this.player.health <= 0) {
      this.player.health = 0;
      this.gameOver(false);
      return true;
    }
    return false;
  }

  gameOver(victory) {
    if (this.state === 'gameover') return;
    this.state = 'gameover';
    this.ui.toggleShop(false);
    this.ui.toggleGameOver(true);
    this.ui.showResults({
      victory,
      wave: this.wave,
      materials: this.materials,
      kills: this.stats.kills,
    });
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground(ctx);
    this.drawPickups(ctx);
    this.drawEnemies(ctx);
    this.drawEnemyProjectiles(ctx);
    this.drawProjectiles(ctx);
    this.drawPlayer(ctx);
  }

  drawBackground(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#050912');
    gradient.addColorStop(1, '#020308');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    const grid = 64;
    for (let x = 0; x < this.canvas.width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x + (Date.now() * 0.01) % grid, 0);
      ctx.lineTo(x + (Date.now() * 0.01) % grid, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }
  }

  drawPlayer(ctx) {
    if (!this.player) return;
    ctx.save();
    ctx.shadowColor = '#f7ca57';
    ctx.shadowBlur = 25;
    const gradient = ctx.createRadialGradient(
      this.player.x - 5,
      this.player.y - 5,
      6,
      this.player.x,
      this.player.y,
      this.player.radius
    );
    gradient.addColorStop(0, '#f7ca57');
    gradient.addColorStop(1, '#ff6f91');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawProjectiles(ctx) {
    ctx.save();
    ctx.fillStyle = '#fdd663';
    ctx.shadowColor = '#fdd663';
    ctx.shadowBlur = 15;
    this.projectiles.forEach((projectile) => {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawEnemyProjectiles(ctx) {
    ctx.save();
    ctx.fillStyle = '#7dd3fc';
    ctx.shadowColor = '#7dd3fc';
    ctx.shadowBlur = 12;
    this.enemyProjectiles.forEach((projectile) => {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawEnemies(ctx) {
    ctx.save();
    this.enemies.forEach((enemy) => {
      ctx.fillStyle = enemy.color;
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = enemy.boss ? 40 : 15;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
      if (enemy.boss) {
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  drawPickups(ctx) {
    ctx.save();
    ctx.fillStyle = '#7cfc92';
    ctx.shadowColor = '#7cfc92';
    ctx.shadowBlur = 12;
    this.pickups.forEach((pickup) => {
      ctx.beginPath();
      ctx.arc(pickup.x, pickup.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
