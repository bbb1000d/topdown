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

const ENEMY_TYPES = [
  { id: 'chaser', color: '#ff6f91', health: 40, speed: 110, damage: 8 },
  { id: 'howler', color: '#7dd3fc', health: 60, speed: 140, damage: 10 },
  { id: 'brute', color: '#fcd34d', health: 120, speed: 90, damage: 18 },
  { id: 'stalker', color: '#a78bfa', health: 80, speed: 160, damage: 12 },
];

const MATERIAL_DROP = { min: 4, max: 10 };
const MAX_WAVES = 12;
const BASE_WAVE_DURATION = 30;
const REROLL_BASE_COST = 5;

const SHOP_ITEMS = [
  {
    id: 'damage-up',
    name: 'Targeting Lens',
    description: '+25% damage.',
    cost: 25,
    apply: (game) => {
      game.player.damage *= 1.25;
    },
  },
  {
    id: 'attack-speed',
    name: 'Trigger Gloves',
    description: '+25% attack speed.',
    cost: 30,
    apply: (game) => {
      game.player.attackDelay = Math.max(0.12, game.player.attackDelay * 0.75);
    },
  },
  {
    id: 'spread',
    name: 'Scatter Core',
    description: '+1 projectile, +5% spread.',
    cost: 35,
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
    apply: (game) => {
      game.player.speed *= 1.15;
    },
  },
  {
    id: 'health',
    name: 'Organic Armor',
    description: '+25 max HP, heal 25%.',
    cost: 32,
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
    apply: (game) => {
      game.player.lifeOnKill = (game.player.lifeOnKill || 0) + 2;
    },
  },
  {
    id: 'pickup',
    name: 'Magnet Drone',
    description: '+40 pickup range.',
    cost: 22,
    apply: (game) => {
      game.player.pickupRange += 40;
    },
  },
  {
    id: 'armor',
    name: 'Guard Plating',
    description: '+4 armor.',
    cost: 34,
    apply: (game) => {
      game.player.armor += 4;
    },
  },
  {
    id: 'crit',
    name: 'Volt Edge',
    description: '+8% crit chance, +0.4x crit damage.',
    cost: 33,
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
    apply: (game) => {
      game.player.projectileSpeed *= 1.3;
    },
  },
];

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
    this.ui.healthFill.style.background = percent < 0.3 ? '#ff5678' : 'linear-gradient(90deg,#ff6f91,#f7ca57)';
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
      const info = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = option.name;
      const desc = document.createElement('p');
      desc.textContent = option.description;
      info.append(title, desc);
      const button = document.createElement('button');
      button.className = 'primary';
      button.textContent = `Buy (${option.cost})`;
      button.disabled = option.disabled;
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
    this.enemies = [];
    this.pickups = [];
    this.shopOptions = [];
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

  start() {
    this.reset();
    this.ui.toggleStartScreen(false);
    this.ui.toggleGameOver(false);
    this.startWave(1);
  }

  reset() {
    this.player = {
      ...PLAYER_BASE_STATS,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      health: PLAYER_BASE_STATS.maxHealth,
    };
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.materials = 0;
    this.wave = 1;
    this.waveTimer = 0;
    this.spawnTimer = 0;
    this.state = 'running';
    this.rerollCost = REROLL_BASE_COST;
    this.stats = { kills: 0 };
    this.ui.setMaterials(this.materials);
    this.ui.setHealth(this.player.health, this.player.maxHealth);
  }

  startWave(number) {
    this.wave = number;
    this.waveTimer = BASE_WAVE_DURATION + (number - 1) * 1.5;
    this.spawnTimer = 0;
    this.enemies = [];
    this.projectiles = [];
    this.pickups = [];
    this.state = 'running';
    this.rerollCost = REROLL_BASE_COST + Math.floor(number * 0.8);
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
            }
            this.dropMaterials(enemy);
          }
          return false;
        }
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
      const vx = (dx / distance) * enemy.speed * dt;
      const vy = (dy / distance) * enemy.speed * dt;
      enemy.x += vx;
      enemy.y += vy;
      if (distance < enemy.radius + this.player.radius) {
        const armorReduction = clamp(1 - this.player.armor * 0.02, 0.3, 1);
        const damage = Math.max(2, enemy.damage * armorReduction);
        this.player.health -= damage;
        this.ui.setHealth(this.player.health, this.player.maxHealth);
        enemy.health = 0;
        if (this.player.health <= 0) {
          this.player.health = 0;
          this.gameOver(false);
          return false;
        }
        return false;
      }
      return true;
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
    if (this.waveTimer <= 0 && this.enemies.length === 0) {
      if (this.wave >= MAX_WAVES) {
        this.gameOver(true);
        return;
      }
      this.openShop();
      return;
    }
    this.ui.setTimer(Math.max(0, this.waveTimer));
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0 && this.waveTimer > 0) {
      this.spawnEnemy();
      const baseInterval = Math.max(0.4, 1.4 - this.wave * 0.08);
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
      const item = SHOP_ITEMS[randInt(0, SHOP_ITEMS.length - 1)];
      choices.add(item);
    }
    this.shopOptions = Array.from(choices).map((item) => ({
      ...item,
      disabled: this.materials < item.cost,
    }));
    this.ui.setShopOptions(this.shopOptions, (option) => this.purchase(option));
  }

  purchase(option) {
    if (this.materials < option.cost) return;
    this.materials -= option.cost;
    this.ui.setMaterials(this.materials);
    option.apply(this);
    this.ui.setHealth(this.player.health, this.player.maxHealth);
    option.disabled = true;
    this.shopOptions = this.shopOptions.map((entry) => ({
      ...entry,
      disabled: entry === option ? true : this.materials < entry.cost,
    }));
    this.ui.setShopOptions(this.shopOptions, (opt) => this.purchase(opt));
  }

  spawnEnemy() {
    const tier = Math.min(ENEMY_TYPES.length, 1 + Math.floor((this.wave - 1) / 3));
    const type = ENEMY_TYPES[randInt(0, tier - 1)];
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
    this.enemies.push({
      ...type,
      x,
      y,
      radius: 16,
    });
  }

  dropMaterials(enemy) {
    const value = randInt(MATERIAL_DROP.min, MATERIAL_DROP.max);
    this.pickups.push({
      x: enemy.x,
      y: enemy.y,
      vx: randRange(-20, 20),
      vy: randRange(-20, 20),
      value,
      life: 10,
    });
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
    this.drawProjectiles(ctx);
    this.drawPlayer(ctx);
  }

  drawBackground(ctx) {
    ctx.save();
    ctx.fillStyle = '#04070f';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const grid = 64;
    for (let x = 0; x < this.canvas.width; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += grid) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawPlayer(ctx) {
    if (!this.player) return;
    ctx.save();
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
    this.projectiles.forEach((projectile) => {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawEnemies(ctx) {
    ctx.save();
    this.enemies.forEach((enemy) => {
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawPickups(ctx) {
    ctx.save();
    ctx.fillStyle = '#7cfc92';
    this.pickups.forEach((pickup) => {
      ctx.beginPath();
      ctx.arc(pickup.x, pickup.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
