export const TILE_SIZE = 32;

const DIRECTIONS = {
  w: { x: 0, y: -1 },
  a: { x: -1, y: 0 },
  s: { x: 0, y: 1 },
  d: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowDown: { x: 0, y: 1 },
  ArrowRight: { x: 1, y: 0 },
};

const AIM_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);
const MOVE_KEYS = new Set(['w', 'a', 's', 'd']);

const WORLD_PADDING_TILES = 24;
const MIN_WORLD_WIDTH_TILES = 260;
const MIN_WORLD_HEIGHT_TILES = 240;
const PLAYER_BASE_SPEED = 3.8; // tiles per second
const PLAYER_SPRINT_SPEED = 6.6;
const PLAYER_ACCELERATION = 16;
const PLAYER_FRICTION = 11;
const PLAYER_BASE_HEALTH = 140;
const PLAYER_DASH_DISTANCE = 4.4;
const PLAYER_DASH_COOLDOWN = 1.7;
const PLAYER_SHOT_INTERVAL = 0.38;
const PLAYER_BASE_DAMAGE = 14;
const PLAYER_PROJECTILE_SPEED = 12.5;
const PLAYER_PROJECTILE_LIFETIME = 2.6;

const PLAYER_HOUSE_PROGRESS_TARGET = 160;

const ENEMY_BASE_HEALTH = 34;
const ENEMY_BASE_SPEED = 1.45;
const ENEMY_SPAWN_INTERVAL = 8.2;
const ENEMY_CONTACT_DAMAGE = 9;
const ENEMY_RANGE = 11;
const ENEMY_FIRE_INTERVAL = 3.1;
const ENEMY_PROJECTILE_SPEED = 8.5;
const ENEMY_PROJECTILE_DAMAGE = 10;
const ENEMY_PROJECTILE_LIFETIME = 4.2;

const BOSS_HEALTH = 280;
const BOSS_FIRE_INTERVAL = 1.45;
const BOSS_PROJECTILE_SPEED = 14;
const BOSS_CONTACT_DAMAGE = 20;
const BOSS_PROJECTILE_DAMAGE = 16;

const PICKUP_ATTRACTION_RANGE = 3.2;
const PICKUP_ATTRACTION_SPEED = 2.7;

const XP_PER_LEVEL = 64;
const LEVEL_XP_GROWTH = 28;

const DAY_NIGHT_DURATION = 180;
const SKY_STARS = 45;

const TILE_TYPES = {
  grass: { color: '#2f6f52', variants: ['#32795a', '#2a6247', '#3a7f5c'] },
  meadow: { color: '#3c8b63', variants: ['#3f946b', '#35805a', '#45a06f'] },
  grove: { color: '#2b4e7d', variants: ['#2f5888', '#2c4f80', '#336091'] },
  path: { color: '#8c6b4d', variants: ['#966f50', '#a17758', '#b08262'] },
  sand: { color: '#d0a871', variants: ['#d7b17c', '#e0bc87', '#cfa36b'] },
  water: { color: '#1d4d7a', variants: ['#1f5888', '#226497', '#2670a6'], blocked: true },
  stone: { color: '#4b5568', variants: ['#5b6476', '#4f5a6d', '#616b83'], blocked: true },
  plaza: { color: '#58537b', variants: ['#5f5b85', '#66628f', '#6d69a0'] },
  townTile: { color: '#4f4a82', variants: ['#5a5591', '#655f9f', '#7069ae'] },
  farmland: { color: '#7c5f43', variants: ['#8a6a4b', '#9b7855', '#a8845d'] },
  sanctuary: { color: '#284b76', variants: ['#2e5686', '#335f93', '#3a6aa3'] },
  dungeonFloor: { color: '#2d323f', variants: ['#343a48', '#3a4151', '#41495a'] },
  dungeonWall: { color: '#1b1f28', variants: ['#202531', '#242a38', '#293041'], blocked: true },
};

const SCENERY_COLORS = {
  treeTrunk: '#6b3f22',
  treeLeaves: ['#2f6846', '#34744f', '#3a7f58'],
  blossom: '#f6cbd1',
  lampPost: '#fcd34d',
  houseWall: '#f8f0e0',
  houseRoof: '#c084fc',
  marketStall: '#38bdf8',
  farmCrop: '#facc15',
  npcCloak: ['#38bdf8', '#f472b6', '#facc15'],
};

const ENEMY_PALETTE = ['#f472b6', '#fb7185', '#60a5fa'];
const BULLET_COLOR = '#facc15';
const ENEMY_BULLET_COLOR = '#38bdf8';

const BOSS_PALETTE = ['#f97316', '#a855f7', '#38bdf8'];

const GOLD_RANGES = {
  mob: [8, 18],
  boss: [70, 110],
  chestTown: [18, 30],
  chestDungeon: [30, 54],
  chestCapital: [44, 78],
};

const HOTBAR_SIZE = 8;
let ITEM_UID = 0;

const ABILITY_LIBRARY = {
  'solar-burst': {
    id: 'solar-burst',
    name: 'Solar Burst',
    key: 'q',
    cooldown: 12,
    description: 'Unleash a ring of solar fire that scorches nearby foes and staggers them.',
  },
  'astral-step': {
    id: 'astral-step',
    name: 'Astral Step',
    key: 'r',
    cooldown: 9,
    description: 'Blink a short distance in the aim direction, leaving a slowing wake.',
  },
  'tempest-field': {
    id: 'tempest-field',
    name: 'Tempest Field',
    key: 'c',
    cooldown: 18,
    description: 'Summon a storm that damages and weakens enemies within a wide radius.',
  },
};

const SKILL_TREE_NODES = [
  {
    id: 'vital-surge',
    name: 'Vital Surge',
    description: 'Increase maximum health by 25 and restore 25 health.',
    cost: 1,
    apply: (game) => {
      game.player.maxHealth += 25;
      game.player.health = clamp(game.player.health + 25, 0, game.player.maxHealth);
    },
  },
  {
    id: 'wind-step',
    name: 'Wind Step',
    description: 'Increase movement speed by 12% and dash distance by 1 tile.',
    cost: 1,
    apply: (game) => {
      game.player.speed *= 1.12;
      game.player.dashDistance += 1;
    },
  },
  {
    id: 'solar-burst',
    name: 'Solar Burst',
    description: 'Unlock the Solar Burst ability (press Q).',
    cost: 1,
    prerequisites: ['vital-surge'],
    unlocksAbility: 'solar-burst',
  },
  {
    id: 'astral-step',
    name: 'Astral Step',
    description: 'Unlock the Astral Step ability (press R).',
    cost: 1,
    prerequisites: ['wind-step'],
    unlocksAbility: 'astral-step',
  },
  {
    id: 'aurora-ward',
    name: 'Aurora Ward',
    description: 'Gain a permanent barrier that refreshes faster.',
    cost: 1,
    prerequisites: ['vital-surge'],
    apply: (game) => {
      if (!game.player.shield) {
        game.player.shield = { cooldown: 16, timer: 16, active: true };
      } else {
        game.player.shield.cooldown = Math.max(10, game.player.shield.cooldown - 2);
      }
      game.player.maxHealth += 10;
    },
  },
  {
    id: 'luminous-archer',
    name: 'Luminous Archer',
    description: 'Projectiles travel 15% faster and deal +4 damage.',
    cost: 1,
    prerequisites: ['wind-step'],
    apply: (game) => {
      game.player.projectileSpeed *= 1.15;
      game.player.damage += 4;
    },
  },
  {
    id: 'radiant-volley',
    name: 'Radiant Volley',
    description: 'Gain an additional split shot and extend projectile lifetime.',
    cost: 2,
    prerequisites: ['luminous-archer'],
    apply: (game) => {
      game.player.doubleShot = true;
      game.player.projectileLifetime += 0.4;
    },
  },
  {
    id: 'forest-harmony',
    name: 'Forest Harmony',
    description: 'Regenerate 20 health whenever you level up and improve sanctuary healing.',
    cost: 2,
    prerequisites: ['aurora-ward'],
    apply: (game) => {
      game.player.onLevelUpRegen = (game.player.onLevelUpRegen || 0) + 20;
      game.player.sanctuaryRegen = (game.player.sanctuaryRegen || 0) + 6;
    },
  },
  {
    id: 'tempest-field',
    name: 'Tempest Field',
    description: 'Unlock the Tempest Field ability (press C).',
    cost: 2,
    prerequisites: ['radiant-volley', 'forest-harmony'],
    unlocksAbility: 'tempest-field',
  },
  {
    id: 'zenith-mastery',
    name: 'Zenith Mastery',
    description: 'Greatly increase all stats and empower abilities with lingering effects.',
    cost: 3,
    prerequisites: ['tempest-field'],
    apply: (game) => {
      game.player.damage += 6;
      game.player.maxHealth += 30;
      game.player.speed *= 1.08;
      game.player.abilityEmpowered = true;
    },
  },
];

const QUEST_LIBRARY = [
  {
    id: 'rebuild-home',
    name: 'Radiant Foundations',
    giver: 'artisan',
    description: 'Deliver 6 timber and 6 polished stone to complete your hillside home.',
    requirements: { timber: 6, stone: 6 },
    onComplete: (game) => {
      game.houseProject.completed = true;
      game.ui.showToast('Your home now overlooks Radiant Hearth.');
    },
  },
  {
    id: 'boss-hunt',
    name: 'Silence the Guardian',
    giver: 'scout',
    description: 'Defeat any awakened dungeon guardian to secure the valley routes.',
    onComplete: (game) => {
      game.gold += 80;
      game.ui.setGold(game.gold);
      game.log.push('Scout Emil rewards you for protecting the valley.');
    },
  },
  {
    id: 'city-of-light',
    name: 'City of Light',
    giver: 'mayor',
    description: 'Visit each of the four towns and rekindle their plaza braziers.',
  },
];

const ENEMY_TYPES = {
  emberkin: { id: 'emberkin', health: 42, speed: 1.55, color: '#fb923c', attack: 'firebolt', damage: 12 },
  gloomstalker: { id: 'gloomstalker', health: 48, speed: 1.35, color: '#6366f1', attack: 'dash', damage: 14 },
  frostwisp: { id: 'frostwisp', health: 32, speed: 1.5, color: '#38bdf8', attack: 'slow', damage: 11 },
  thornbeast: { id: 'thornbeast', health: 56, speed: 1.25, color: '#22c55e', attack: 'spread', damage: 13 },
  astralSentinel: { id: 'astralSentinel', health: 60, speed: 1.2, color: '#a855f7', attack: 'beam', damage: 15 },
};

const DUNGEON_THEMES = {
  catacombs: { tint: '#64748b', enemyPool: ['gloomstalker', 'frostwisp'], boss: 'umbra-titan' },
  ember: { tint: '#ea580c', enemyPool: ['emberkin', 'thornbeast'], boss: 'ember-colossus' },
  observatory: { tint: '#818cf8', enemyPool: ['astralSentinel', 'frostwisp'], boss: 'star-custodian' },
  warrens: { tint: '#22c55e', enemyPool: ['thornbeast', 'gloomstalker'], boss: 'briar-queen' },
  vault: { tint: '#c084fc', enemyPool: ['astralSentinel', 'emberkin'], boss: 'auric-warden' },
};

const ITEM_LIBRARY = {
  timber: {
    id: 'timber',
    name: 'Bundle of Timber',
    description: 'Useful for rebuilding town structures.',
    type: 'material',
    value: 12,
    stackable: true,
    actions: [],
  },
  stone: {
    id: 'stone',
    name: 'Polished Stone',
    description: 'Perfect for sturdy foundations.',
    type: 'material',
    value: 10,
    stackable: true,
    actions: [],
  },
  silk: {
    id: 'silk',
    name: 'Shimmering Silk',
    description: 'NPCs love receiving this rare cloth.',
    type: 'material',
    value: 18,
    stackable: true,
    actions: [],
  },
  'sun-elixir': {
    id: 'sun-elixir',
    name: 'Sun Elixir',
    description: 'Instantly restores 40 health when consumed.',
    type: 'consumable',
    heal: 40,
    stackable: true,
    actions: ['use', 'assign'],
  },
  'moondrop-elixir': {
    id: 'moondrop-elixir',
    name: 'Moondrop Elixir',
    description: 'Restore 70 health and reduce dash cooldown by 10% temporarily.',
    type: 'consumable',
    heal: 70,
    stackable: true,
    actions: ['use', 'assign'],
    onUse: (game) => {
      game.addTimedModifier({
        id: 'moondrop-dash',
        duration: 45,
        apply: (player) => {
          player.dashCooldown *= 0.9;
        },
        remove: (player) => {
          player.dashCooldown /= 0.9;
        },
      });
    },
  },
  'ember-blade': {
    id: 'ember-blade',
    name: 'Ember Blade',
    description: 'A blazing weapon that increases damage output.',
    type: 'weapon',
    slot: 'weapon',
    bonuses: { damage: 8 },
    actions: ['equip'],
    onEquip: (player) => {
      player.infernoTrails = true;
    },
    onUnequip: (player) => {
      player.infernoTrails = false;
    },
  },
  'aurora-lance': {
    id: 'aurora-lance',
    name: 'Aurora Lance',
    description: 'Arrows pierce one additional foe after striking.',
    type: 'weapon',
    slot: 'weapon',
    bonuses: { damage: 4 },
    actions: ['equip'],
    onEquip: (player) => {
      player.piercingShots = true;
    },
    onUnequip: (player) => {
      player.piercingShots = false;
    },
  },
  dawnshield: {
    id: 'dawnshield',
    name: 'Dawnshield Bulwark',
    description: 'Reinforces health and refreshes the protective barrier quickly.',
    type: 'shield',
    slot: 'shield',
    bonuses: { maxHealth: 35 },
    actions: ['equip'],
    onEquip: (player) => {
      player.shield = player.shield ?? { cooldown: 18, timer: 18, active: true };
      player.shield.cooldown = Math.max(10, player.shield.cooldown * 0.75);
      player.shield.timer = player.shield.cooldown;
      player.shield.active = true;
    },
  },
  'gale-cloak': {
    id: 'gale-cloak',
    name: 'Gale Cloak',
    description: 'Light armour that boosts movement speed and dash distance.',
    type: 'armor',
    slot: 'armor',
    bonuses: { speedMultiplier: 1.1, dashDistance: 1 },
    actions: ['equip'],
  },
  'starlight-charm': {
    id: 'starlight-charm',
    name: 'Starlight Charm',
    description: 'A charm that increases experience gain by 12%.',
    type: 'trinket',
    slot: 'trinket',
    actions: ['equip'],
    onEquip: (player) => {
      player.xpBonus = (player.xpBonus || 0) + 0.12;
    },
    onUnequip: (player) => {
      player.xpBonus = Math.max(0, (player.xpBonus || 0) - 0.12);
    },
  },
  'ember-medal': {
    id: 'ember-medal',
    name: 'Ember Medal',
    description: 'Valley traders will buy this medal for 45 gold.',
    type: 'medal',
    goldValue: 45,
    consumedOnPickup: true,
  },
  'star-medal': {
    id: 'star-medal',
    name: 'Starforged Medal',
    description: 'A radiant medal worth a hefty 75 gold.',
    type: 'medal',
    goldValue: 75,
    consumedOnPickup: true,
  },
};

const RESOURCE_DROPS = ['timber', 'stone', 'silk'];

const CHEST_LOOT_TABLES = {
  town: ['timber', 'stone', 'sun-elixir', 'gale-cloak', 'ember-medal'],
  dungeon: [
    'ember-blade',
    'gale-cloak',
    'dawnshield',
    'aurora-lance',
    'sun-elixir',
    'moondrop-elixir',
    'starlight-charm',
    'star-medal',
  ],
  capital: [
    'ember-blade',
    'dawnshield',
    'aurora-lance',
    'gale-cloak',
    'moondrop-elixir',
    'starlight-charm',
    'star-medal',
  ],
};

const BOSS_LOOT_TABLE = [
  'ember-blade',
  'dawnshield',
  'aurora-lance',
  'gale-cloak',
  'starlight-charm',
  'star-medal',
];

const SHOP_LIBRARY = [
  {
    id: 'weapons',
    name: 'Gleam & Arrow Forge',
    description: 'Upgrade weapons forged with starlit alloys.',
    stock: [
      { id: 'bowstring', label: 'Silver Bowstring', cost: 35, effect: (player) => (player.damage += 6) },
      {
        id: 'scope',
        label: 'Aurora Scope',
        cost: 45,
        effect: (player) => {
          player.projectileSpeed *= 1.2;
          player.projectileLifetime += 0.6;
        },
      },
    ],
  },
  {
    id: 'armory',
    name: 'Luminous Warding',
    description: 'Protective cloaks woven from moonthread.',
    stock: [
      {
        id: 'cloak',
        label: 'Moonthread Cloak',
        cost: 40,
        effect: (player) => {
          player.maxHealth += 20;
          player.health = Math.min(player.maxHealth, player.health + 20);
        },
      },
      {
        id: 'boots',
        label: 'Glider Boots',
        cost: 32,
        effect: (player) => {
          player.speed *= 1.1;
          player.dashCooldown *= 0.9;
        },
      },
    ],
  },
  {
    id: 'alchemy',
    name: 'Bramblebrew Cart',
    description: 'Potions to refresh mind, body, and spirit.',
    stock: [
      {
        id: 'tonic',
        label: 'Soothing Tonic',
        cost: 22,
        effect: (player) => {
          player.health = Math.min(player.maxHealth, player.health + 30);
        },
      },
      {
        id: 'elixir',
        label: 'Farsight Elixir',
        cost: 28,
        effect: (player) => {
          player.shootInterval *= 0.85;
          player.damage += 2;
        },
      },
    ],
  },
];

const NPC_LIBRARY = [
  {
    id: 'mayor',
    name: 'Mayor Lyra',
    line: 'The valley thrives when its lamps are lit. Thank you for rebuilding.',
    journal: 'Lyra promised to help furnish my home once the frame is finished.',
  },
  {
    id: 'scout',
    name: 'Scout Emil',
    line: 'Dungeons only wake when brave souls enter. I can guide you to each door.',
    journal: 'Emil marked the entrances to Duskwater Catacombs and Emberfen Gate.',
  },
  {
    id: 'artisan',
    name: 'Artisan Mila',
    line: 'Bring timber and stone and we will raise walls that shimmer like dawn.',
    journal: 'Mila will help finish my house once I supply more materials.',
  },
  {
    id: 'sage',
    name: 'Sage Miren',
    line: 'Every plaza whispers clues about hidden keeps. Listen closely.',
    journal: 'Miren urged me to visit each town before braving the deeper vaults.',
  },
  {
    id: 'captain',
    name: 'Captain Roan',
    line: 'Return with medals and the outposts will flourish again.',
    journal: 'Roan promised to trade medals for gold the moment I recover them.',
  },
];

const STORY_BEATS = [
  { id: 'arrival', text: 'Visit Radiant Hearth and meet the valley townsfolk.' },
  { id: 'first-dungeon', text: 'Clear your first dungeon to recover ancient plans.' },
  { id: 'house-finished', text: 'Finish building your home overlooking Radiant Hearth.' },
  { id: 'boss-victory', text: 'Defeat a dungeon boss to secure the valley.' },
];

const ACHIEVEMENT_LIBRARY = [
  {
    id: 'first-steps',
    label: 'First Steps',
    check: (stats) => stats.distance > 40,
    description: 'Travel forty tiles through the valley.',
  },
  {
    id: 'spark-collector',
    label: 'Spark Collector',
    check: (stats) => stats.skillsUnlocked >= 3,
    description: 'Unlock three skills.',
  },
  {
    id: 'calm-guardian',
    label: 'Calm Guardian',
    check: (stats) => stats.damageTaken < 50 && stats.timeAlive > 120,
    description: 'Survive two minutes while taking minimal damage.',
  },
  {
    id: 'glow-hunter',
    label: 'Glow Hunter',
    check: (stats) => stats.enemiesDefeated >= 12,
    description: 'Defeat twelve luminous foes.',
  },
];

const GOALS = [
  'Support Radiant Hearth by finishing your cozy home',
  'Chart a course through all four towns of the valley',
  'Defeat a guardian deep within one of the five dungeons',
  'Collect timber and stone to help the townsfolk rebuild',
  'Calm the sanctuary fireflies to restore the valley glow',
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(randRange(min, max + 1));
}

function pick(array) {
  return array[randInt(0, array.length - 1)];
}

function randomGold(range) {
  return randInt(range[0], range[1]);
}

function cloneItem(id) {
  const template = ITEM_LIBRARY[id];
  if (!template) {
    throw new Error(`Unknown item id: ${id}`);
  }
  return {
    ...template,
    actions: template.actions ? [...template.actions] : [],
    quantity: template.stackable ? 1 : 1,
    instanceId: `${id}-${ITEM_UID++}`,
  };
}

function vectorLength(v) {
  return Math.hypot(v.x, v.y);
}

function normalize(v) {
  const len = vectorLength(v);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const bigint = parseInt(value, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function mixColor(a, bColor, t) {
  const colorA = hexToRgb(a);
  const colorB = hexToRgb(bColor);
  const lerpChannel = (channel) =>
    Math.round(colorA[channel] + (colorB[channel] - colorA[channel]) * t);
  const red = lerpChannel('r');
  const green = lerpChannel('g');
  const blue = lerpChannel('b');
  return `rgb(${red}, ${green}, ${blue})`;
}

class InputHandler {
  #pressed = new Set();
  #aim = new Set();
  #shootListeners = new Set();
  #dashListeners = new Set();
  #pauseListeners = new Set();
  #interactListeners = new Set();
  #inventoryListeners = new Set();
  #questListeners = new Set();
  #skillTreeListeners = new Set();
  #mapListeners = new Set();
  #hotbarListeners = new Map();
  #abilityListeners = new Map();
  #abilityActiveKeys = new Set();

  constructor() {
    window.addEventListener('keydown', (event) => this.#handleKeyDown(event));
    window.addEventListener('keyup', (event) => this.#handleKeyUp(event));
  }

  #handleKeyDown(event) {
    const key = event.key;
    if (MOVE_KEYS.has(key)) {
      this.#pressed.add(key);
      event.preventDefault();
    }

    if (AIM_KEYS.has(key)) {
      this.#aim.add(key);
      event.preventDefault();
    }

    if (key === ' ') {
      event.preventDefault();
      this.#shootListeners.forEach((cb) => cb());
    }

    if (key === 'e' || key === 'E') {
      event.preventDefault();
      this.#dashListeners.forEach((cb) => cb());
    }

    if (key === 'f' || key === 'F') {
      event.preventDefault();
      this.#interactListeners.forEach((cb) => cb());
    }

    if (key === 'Escape') {
      event.preventDefault();
      this.#pauseListeners.forEach((cb) => cb());
    }

    if (key === 'i' || key === 'I') {
      event.preventDefault();
      this.#inventoryListeners.forEach((cb) => cb());
    }

    if (key === 'j' || key === 'J') {
      event.preventDefault();
      this.#questListeners.forEach((cb) => cb());
    }

    if (key === 'k' || key === 'K') {
      event.preventDefault();
      this.#skillTreeListeners.forEach((cb) => cb());
    }

    if (key === 'm' || key === 'M') {
      event.preventDefault();
      this.#mapListeners.forEach((cb) => cb());
    }

    if (key >= '1' && key <= '8') {
      const index = Number.parseInt(key, 10) - 1;
      const listener = this.#hotbarListeners.get(index);
      if (listener) {
        event.preventDefault();
        listener();
      }
    }

    const lowerKey = key.toLowerCase();
    const ability = this.#abilityListeners.get(lowerKey);
    if (ability && !this.#abilityActiveKeys.has(lowerKey)) {
      event.preventDefault();
      this.#abilityActiveKeys.add(lowerKey);
      ability();
    }
  }

  #handleKeyUp(event) {
    const key = event.key;
    if (MOVE_KEYS.has(key)) {
      this.#pressed.delete(key);
      event.preventDefault();
    }

    if (AIM_KEYS.has(key)) {
      this.#aim.delete(key);
      event.preventDefault();
    }

    const lowerKey = key.toLowerCase();
    if (this.#abilityActiveKeys.has(lowerKey)) {
      this.#abilityActiveKeys.delete(lowerKey);
      event.preventDefault();
    }
  }

  getMovementVector() {
    let vx = 0;
    let vy = 0;
    for (const key of this.#pressed) {
      vx += DIRECTIONS[key].x;
      vy += DIRECTIONS[key].y;
    }
    if (vx === 0 && vy === 0) return { x: 0, y: 0 };
    return normalize({ x: vx, y: vy });
  }

  getAimVector(fallback) {
    let vx = 0;
    let vy = 0;
    for (const key of this.#aim) {
      vx += DIRECTIONS[key].x;
      vy += DIRECTIONS[key].y;
    }
    if (vx === 0 && vy === 0) {
      return fallback || { x: 0, y: -1 };
    }
    return normalize({ x: vx, y: vy });
  }

  onShoot(callback) {
    this.#shootListeners.add(callback);
    return () => this.#shootListeners.delete(callback);
  }

  onDash(callback) {
    this.#dashListeners.add(callback);
    return () => this.#dashListeners.delete(callback);
  }

  onInteract(callback) {
    this.#interactListeners.add(callback);
    return () => this.#interactListeners.delete(callback);
  }

  onPause(callback) {
    this.#pauseListeners.add(callback);
    return () => this.#pauseListeners.delete(callback);
  }

  onToggleInventory(callback) {
    this.#inventoryListeners.add(callback);
    return () => this.#inventoryListeners.delete(callback);
  }

  onToggleQuests(callback) {
    this.#questListeners.add(callback);
    return () => this.#questListeners.delete(callback);
  }

  onToggleSkillTree(callback) {
    this.#skillTreeListeners.add(callback);
    return () => this.#skillTreeListeners.delete(callback);
  }

  onToggleMap(callback) {
    this.#mapListeners.add(callback);
    return () => this.#mapListeners.delete(callback);
  }

  bindHotbar(index, callback) {
    this.#hotbarListeners.set(index, callback);
    return () => this.#hotbarListeners.delete(index);
  }

  bindAbility(key, callback) {
    this.#abilityListeners.set(key.toLowerCase(), callback);
    return () => this.#abilityListeners.delete(key.toLowerCase());
  }
}

class EventLog {
  constructor(element, maxEntries = 8) {
    this.element = element;
    this.maxEntries = maxEntries;
    this.entries = [];
  }

  push(message) {
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    this.entries.unshift({ message, time });
    this.entries = this.entries.slice(0, this.maxEntries);
    this.render();
  }

  render() {
    if (!this.element) return;
    this.element.innerHTML = '';
    for (const entry of this.entries) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${entry.time}</strong> ${entry.message}`;
      this.element.appendChild(li);
    }
  }
}

class UIController {
  constructor(ui) {
    this.ui = ui;
    this.inventoryHandlers = {};
    this.hotbarSlots = ui.hotbarSlots ?? [];
    this.skillTreeHandler = null;
  }

  setHealth(current, max) {
    const clamped = clamp(current, 0, max);
    this.ui.healthValue.textContent = `${Math.round(clamped)} / ${Math.round(max)}`;
    const ratio = max === 0 ? 0 : (clamped / max) * 100;
    this.ui.healthFill.style.width = `${ratio}%`;
    this.ui.healthFill.parentElement?.setAttribute('aria-valuenow', `${Math.round(ratio)}`);
  }

  setExperience(level, current, required) {
    this.ui.progressValue.textContent = `Level ${level}`;
    const ratio = required === 0 ? 0 : clamp((current / required) * 100, 0, 100);
    this.ui.progressFill.style.width = `${ratio}%`;
    this.ui.progressFill.parentElement?.setAttribute('aria-valuenow', `${Math.round(ratio)}`);
  }

  setSkillPoints(points) {
    this.ui.skillPointsValue.textContent = `${points}`;
    if (this.ui.skillTreePoints) {
      this.ui.skillTreePoints.textContent = `${points}`;
    }
  }

  setGold(value) {
    this.ui.currencyValue.textContent = `${value}`;
  }

  setGoal(text) {
    this.ui.goalValue.textContent = text;
  }

  setZone(text) {
    this.ui.zoneLabel.textContent = text;
  }

  setTimeOfDay(text) {
    if (this.ui.timeOfDayValue) {
      this.ui.timeOfDayValue.textContent = text;
    }
  }

  setTownProgress(label, ratio) {
    this.ui.townLabel.textContent = label;
    const clamped = clamp(ratio, 0, 1);
    const percent = Math.round(clamped * 100);
    this.ui.townFill.style.width = `${percent}%`;
    const container = this.ui.townFill.closest('[role="progressbar"], .town-progress');
    container?.setAttribute('aria-valuenow', `${percent}`);
  }

  setHotbar(slots) {
    for (let i = 0; i < this.hotbarSlots.length; i += 1) {
      const slotElement = this.hotbarSlots[i];
      const slot = slots[i];
      if (!slotElement) continue;
      if (slot) {
        slotElement.dataset.empty = 'false';
        slotElement.dataset.name = slot.label ?? slot.name ?? '';
        if (typeof slot.cooldownLabel === 'string' && slot.cooldownLabel.length > 0) {
          slotElement.dataset.cooldown = slot.cooldownLabel;
        } else {
          delete slotElement.dataset.cooldown;
        }
        if (slot.active) {
          slotElement.classList.add('active');
        } else {
          slotElement.classList.remove('active');
        }
      } else {
        slotElement.dataset.empty = 'true';
        slotElement.dataset.name = '';
        delete slotElement.dataset.cooldown;
        slotElement.classList.remove('active');
      }
    }
  }

  setUpgrades(upgrades) {
    this.ui.skillList.innerHTML = '';
    if (upgrades.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No skills unlocked yet. Earn sparks to learn new techniques.';
      this.ui.skillList.appendChild(li);
      return;
    }
    for (const upgrade of upgrades) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${upgrade.name}</strong><p>${upgrade.description}</p>`;
      this.ui.skillList.appendChild(li);
    }
  }

  setAchievements(achievements) {
    this.ui.achievementList.innerHTML = '';
    if (achievements.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Discover hidden feats to fill this list.';
      this.ui.achievementList.appendChild(li);
      return;
    }
    for (const achievement of achievements) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${achievement.label}</strong><br/>${achievement.description}`;
      this.ui.achievementList.appendChild(li);
    }
  }

  setMapClues(clues) {
    this.ui.mapInfo.innerHTML = '';
    for (const clue of clues) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${clue.title}</strong><br/>${clue.description}`;
      this.ui.mapInfo.appendChild(li);
    }
  }

  setInventory(items, handlers = {}) {
    this.inventoryHandlers = handlers;
    this.ui.inventoryList.innerHTML = '';
    if (items.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Your satchel is empty. Venture into the dungeons to gather loot.';
      this.ui.inventoryList.appendChild(li);
      return;
    }
    for (const item of items) {
      const li = document.createElement('li');
      const meta = [];
      if (item.type) {
        meta.push(item.type.charAt(0).toUpperCase() + item.type.slice(1));
      }
      if (item.slot) {
        meta.push(`Slot: ${item.slot}`);
      }
      if (item.goldValue) {
        meta.push(`Sell: ${item.goldValue} gold`);
      } else if (item.value && item.type === 'material') {
        meta.push(`Trade: ${item.value} gold`);
      }
      if (item.bonuses) {
        const bonusText = Object.entries(item.bonuses)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1')} ${value > 0 ? '+' : ''}${value}`)
          .join(' · ');
        if (bonusText) meta.push(bonusText);
      }
      const header = document.createElement('strong');
      header.textContent = item.name;
      li.appendChild(header);
      const description = document.createElement('p');
      description.textContent = item.description;
      li.appendChild(description);
      if (meta.length > 0) {
        const metaDiv = document.createElement('div');
        metaDiv.className = 'item-meta';
        metaDiv.textContent = meta.join(' · ');
        li.appendChild(metaDiv);
      }
      const actions = document.createElement('div');
      actions.className = 'item-actions';
      if (item.actions?.includes('equip') && handlers.onEquip) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'primary';
        button.textContent = item.equipped ? 'Equipped' : 'Equip';
        button.disabled = !!item.equipped;
        button.addEventListener('click', () => handlers.onEquip(item));
        actions.appendChild(button);
      }
      if (item.actions?.includes('use') && handlers.onUse) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Use';
        button.addEventListener('click', () => handlers.onUse(item));
        actions.appendChild(button);
      }
      if (item.actions?.includes('assign') && handlers.onAssign) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Assign to hotbar';
        button.addEventListener('click', () => handlers.onAssign(item));
        actions.appendChild(button);
      }
      if (actions.childElementCount > 0) {
        li.appendChild(actions);
      }
      this.ui.inventoryList.appendChild(li);
    }
  }

  setEquipment(equipment) {
    this.ui.equipmentList.innerHTML = '';
    if (!equipment || Object.keys(equipment).length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No gear equipped yet.';
      this.ui.equipmentList.appendChild(li);
      return;
    }
    for (const [slot, item] of Object.entries(equipment)) {
      const li = document.createElement('li');
      if (item) {
        li.innerHTML = `<strong>${item.name}</strong><p>${item.description}</p><div class="item-meta">${slot}</div>`;
      } else {
        li.innerHTML = `<strong>${slot}</strong><p>Empty slot</p>`;
      }
      this.ui.equipmentList.appendChild(li);
    }
  }

  setAbilities(abilities) {
    this.ui.abilitiesList.innerHTML = '';
    if (!abilities || abilities.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No abilities unlocked yet. Explore the skill tree!';
      this.ui.abilitiesList.appendChild(li);
      return;
    }
    for (const ability of abilities) {
      const li = document.createElement('li');
      const key = ability.key ? `<span class="item-meta">Key: ${ability.key.toUpperCase()}</span>` : '';
      li.innerHTML = `<strong>${ability.name}</strong><p>${ability.description}</p>${key}`;
      this.ui.abilitiesList.appendChild(li);
    }
  }

  setQuests(quests) {
    this.ui.questsList.innerHTML = '';
    if (!quests || quests.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No active quests. Speak with townsfolk in the city plazas.';
      this.ui.questsList.appendChild(li);
      return;
    }
    for (const quest of quests) {
      const li = document.createElement('li');
      const status = quest.status ? `<div class="item-meta">${quest.status}</div>` : '';
      li.innerHTML = `<strong>${quest.name}</strong><p>${quest.description}</p>${status}`;
      this.ui.questsList.appendChild(li);
    }
  }

  setStory(text) {
    this.ui.storyline.textContent = text;
  }

  setJournal(entries) {
    this.ui.npcJournal.innerHTML = '';
    if (entries.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No journal notes yet. Talk to townsfolk to learn more.';
      this.ui.npcJournal.appendChild(li);
      return;
    }
    for (const entry of entries) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${entry.name}</strong><br/>${entry.note}`;
      this.ui.npcJournal.appendChild(li);
    }
  }

  setLog(entries) {
    this.ui.log.innerHTML = '';
    for (const entry of entries) {
      const li = document.createElement('li');
      li.textContent = entry;
      this.ui.log.appendChild(li);
    }
  }

  showMenu(show) {
    this.ui.pauseMenu.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  showStartMenu(show) {
    this.ui.startMenu.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  showShop(shop, onPurchase, onClose) {
    this.ui.shopName.textContent = shop.name;
    this.ui.shopDescription.textContent = shop.description;
    this.ui.shopOptions.innerHTML = '';
    for (const item of shop.stock) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'upgrade-option';
      button.innerHTML = `<h3>${item.label}</h3><p>Cost: ${item.cost} gold</p>`;
      button.addEventListener('click', () => onPurchase(item));
      this.ui.shopOptions.appendChild(button);
    }
    this.ui.leaveShop.onclick = onClose;
    this.ui.shopOverlay.setAttribute('aria-hidden', 'false');
    const firstButton = this.ui.shopOptions.querySelector('button');
    firstButton?.focus();
  }

  hideShop() {
    this.ui.shopOverlay.setAttribute('aria-hidden', 'true');
    this.ui.shopOptions.innerHTML = '';
  }

  showInventory(show) {
    this.ui.inventoryOverlay?.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  showQuests(show) {
    this.ui.questsOverlay?.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  showSkillTree(show) {
    this.ui.skillTreeOverlay?.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  showAtlas(show) {
    this.ui.mapOverlay?.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  showPrompt(text) {
    if (!text) {
      this.ui.prompt.textContent = '';
      this.ui.prompt.classList.remove('show');
      return;
    }
    this.ui.prompt.textContent = text;
    this.ui.prompt.classList.add('show');
  }

  clearPrompt() {
    this.showPrompt('');
  }

  showToast(message) {
    const toast = this.ui.toast;
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hidden');
    }, 2400);
  }

  renderSkillTree(nodes, unlocked, available, handler, points = 0) {
    this.skillTreeHandler = handler;
    this.ui.skillTree.innerHTML = '';
    const nameLookup = new Map(nodes.map((node) => [node.id, node.name]));
    for (const node of nodes) {
      const card = document.createElement('article');
      card.className = 'skill-node';
      const state = unlocked.has(node.id)
        ? 'unlocked'
        : available.has(node.id)
        ? 'available'
        : 'locked';
      card.dataset.state = state;
      const title = document.createElement('h3');
      title.textContent = node.name;
      const desc = document.createElement('p');
      desc.textContent = node.description;
      const meta = document.createElement('div');
      meta.className = 'node-meta';
      const prereqNames = node.prerequisites?.map((id) => nameLookup.get(id) ?? id) ?? [];
      const requirementText = prereqNames.length
        ? `Requires: ${prereqNames.join(', ')}`
        : 'Base technique';
      const cost = node.cost ?? 1;
      meta.textContent = `${requirementText} • Cost: ${cost} spark${cost > 1 ? 's' : ''}`;
      card.append(title, desc, meta);
      if (state === 'available') {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `Unlock (${cost} spark${cost > 1 ? 's' : ''})`;
        if (cost > points) {
          button.disabled = true;
          button.title = 'Earn more sparks to unlock this skill.';
        }
        button.addEventListener('click', () => handler(node));
        card.appendChild(button);
      }
      this.ui.skillTree.appendChild(card);
    }
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawn(point, options) {
    this.particles.push({
      x: point.x,
      y: point.y,
      vx: options.vx ?? randRange(-0.5, 0.5),
      vy: options.vy ?? randRange(-0.5, 0.5),
      radius: options.radius ?? randRange(0.1, 0.25),
      life: options.life ?? randRange(0.5, 1.2),
      color: options.color ?? '#ffffff',
    });
  }

  update(dt) {
    this.particles = this.particles
      .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, life: p.life - dt }))
      .filter((p) => p.life > 0);
  }

  draw(context, view) {
    for (const particle of this.particles) {
      const alpha = clamp(particle.life, 0, 1);
      if (
        view &&
        (particle.x < view.offsetX - 2 ||
          particle.x > view.offsetX + view.viewWidth + 2 ||
          particle.y < view.offsetY - 2 ||
          particle.y > view.offsetY + view.viewHeight + 2)
      ) {
        continue;
      }
      context.fillStyle = particle.color;
      context.globalAlpha = alpha;
      context.beginPath();
      context.arc(
        particle.x * TILE_SIZE,
        particle.y * TILE_SIZE,
        particle.radius * TILE_SIZE,
        0,
        Math.PI * 2
      );
      context.fill();
      context.globalAlpha = 1;
    }
  }
}

class MinimapRenderer {
  constructor(minimapCanvas, atlasCanvas) {
    this.canvas = minimapCanvas;
    this.ctx = minimapCanvas?.getContext('2d') ?? null;
    this.atlasCanvas = atlasCanvas;
    this.atlasCtx = atlasCanvas?.getContext('2d') ?? null;
    this.baseMini = null;
    this.baseAtlas = null;
  }

  setWorld(world) {
    this.world = world;
    if (!world) return;
    this.#renderMinimapBase();
    this.#renderAtlasBase();
  }

  draw(player) {
    if (!this.ctx || !this.baseMini || !this.world) return;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.baseMini, 0, 0, canvas.width, canvas.height);
    const scaleX = canvas.width / this.world.width;
    const scaleY = canvas.height / this.world.height;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(player.x * scaleX, player.y * scaleY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawAtlas(player) {
    if (!this.atlasCtx || !this.baseAtlas || !this.world) return;
    const { atlasCtx: ctx, atlasCanvas: canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.baseAtlas, 0, 0, canvas.width, canvas.height);
    const scaleX = canvas.width / this.world.width;
    const scaleY = canvas.height / this.world.height;
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(player.x * scaleX, player.y * scaleY, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  #renderMinimapBase() {
    if (!this.canvas || !this.world) return;
    const offscreen = document.createElement('canvas');
    offscreen.width = this.world.width;
    offscreen.height = this.world.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.createImageData(offscreen.width, offscreen.height);
    let index = 0;
    for (let y = 0; y < this.world.height; y += 1) {
      for (let x = 0; x < this.world.width; x += 1) {
        const tile = this.world.getTile(x, y);
        const color = TILE_TYPES[tile.type]?.color ?? '#111827';
        const rgb = hexToRgb(color);
        imageData.data[index++] = rgb.r;
        imageData.data[index++] = rgb.g;
        imageData.data[index++] = rgb.b;
        imageData.data[index++] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    this.baseMini = offscreen;
  }

  #renderAtlasBase() {
    if (!this.atlasCanvas || !this.world) return;
    const offscreen = document.createElement('canvas');
    offscreen.width = this.world.width;
    offscreen.height = this.world.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    for (let y = 0; y < this.world.height; y += 1) {
      for (let x = 0; x < this.world.width; x += 1) {
        const tile = this.world.getTile(x, y);
        const info = TILE_TYPES[tile.type];
        ctx.fillStyle = info?.color ?? '#111827';
        ctx.fillRect(x, y, 1, 1);
      }
    }
    ctx.fillStyle = '#f59e0b';
    for (const town of this.world.towns ?? []) {
      ctx.fillRect(town.center.x - 2, town.center.y - 2, 4, 4);
    }
    ctx.fillStyle = '#38bdf8';
    for (const dungeon of this.world.dungeons ?? []) {
      ctx.fillRect(dungeon.bounds.x1, dungeon.bounds.y1, dungeon.bounds.x2 - dungeon.bounds.x1, 1);
      ctx.fillRect(dungeon.bounds.x1, dungeon.bounds.y2, dungeon.bounds.x2 - dungeon.bounds.x1, 1);
    }
    this.baseAtlas = offscreen;
  }
}

class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tiles = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({ type: 'meadow', variant: randInt(0, 2), zone: 'wilds' }))
    );
    this.decorations = [];
    this.lamps = [];
    this.signs = [];
    this.mapClues = [];
    this.shops = [];
    this.npcs = [];
    this.towns = [];
    this.dungeons = [];
    this.housePlots = [];
    this.chests = [];
    this.enemySpawns = [];
  }

  static generate(width, height) {
    const world = new World(width, height);
    world.#generateTerrain();
    world.#buildSettlements();
    world.#carveDungeons();
    world.#decorate();
    world.#placeSignsAndClues();
    return world;
  }

  getTile(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return { type: 'stone', variant: 0, zone: 'void' };
    }
    return this.tiles[Math.floor(y)][Math.floor(x)];
  }

  #setTile(x, y, type, zone) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    const tile = this.tiles[Math.floor(y)][Math.floor(x)];
    tile.type = type;
    tile.variant = randInt(0, (TILE_TYPES[type]?.variants?.length || 1) - 1);
    if (zone) {
      tile.zone = zone;
    }
  }

  isWalkable(x, y) {
    const tile = this.getTile(Math.floor(x), Math.floor(y));
    if (!tile) return false;
    const info = TILE_TYPES[tile.type];
    return !(info?.blocked ?? false);
  }

  isTown(x, y) {
    return this.getTile(Math.floor(x), Math.floor(y)).zone === 'town';
  }

  isSanctuary(x, y) {
    const zone = this.getTile(Math.floor(x), Math.floor(y)).zone;
    return zone === 'sanctuary';
  }

  getTownAt(x, y) {
    return this.towns.find((town) =>
      x >= town.bounds.x1 &&
      x <= town.bounds.x2 &&
      y >= town.bounds.y1 &&
      y <= town.bounds.y2
    );
  }

  getZoneName(x, y) {
    const dungeon = this.getDungeonAt(x, y);
    if (dungeon) return `${dungeon.name}`;
    const town = this.getTownAt(x, y);
    if (town) return town.name;
    if (this.isSanctuary(x, y)) return 'Glittering Sanctuary';
    return 'Sunset Wilds';
  }

  getDungeonAt(x, y) {
    return this.dungeons.find((d) =>
      x >= d.bounds.x1 &&
      x <= d.bounds.x2 &&
      y >= d.bounds.y1 &&
      y <= d.bounds.y2
    );
  }

  getShopNear(x, y) {
    return this.shops.find((shop) => Math.hypot(shop.x - x, shop.y - y) < 1.6);
  }

  getNpcNear(x, y) {
    return this.npcs.find((npc) => Math.hypot(npc.x - x, npc.y - y) < 1.6);
  }

  getHousePlotNear(x, y) {
    return this.housePlots.find((plot) => Math.hypot(plot.x - x, plot.y - y) < 1.2);
  }

  getChestNear(x, y) {
    return this.chests.find(
      (chest) => !chest.opened && Math.hypot(chest.x - x, chest.y - y) < 1.1
    );
  }

  #generateTerrain() {
    const midY = this.height / 2;
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const vertical = Math.abs(y - midY) / midY;
        const blend = clamp(vertical, 0, 1);
        const type = blend < 0.35 ? 'meadow' : blend < 0.6 ? 'grass' : 'grove';
        this.#setTile(x, y, type, 'wilds');
      }
    }

    this.spawnPoint = {
      x: Math.floor(this.width / 2) + randInt(-4, 4),
      y: Math.floor(this.height / 2) + randInt(-4, 4),
    };

    this.#carveRiver();
    this.#carvePath(
      this.spawnPoint.x,
      this.spawnPoint.y,
      clamp(this.spawnPoint.x + randInt(-10, 10), 6, this.width - 6),
      clamp(this.spawnPoint.y - randInt(10, 16), 6, this.height - 6),
      2
    );
  }

  #carveRiver() {
    let rx = randInt(Math.floor(this.width * 0.25), Math.floor(this.width * 0.4));
    for (let y = 0; y < this.height; y += 1) {
      const width = 2 + Math.floor(Math.sin(y / 5) * 1.8 + Math.random() * 1.8);
      for (let x = -width; x <= width; x += 1) {
        const worldX = clamp(rx + x, 1, this.width - 2);
        this.#setTile(worldX, y, 'water', 'wilds');
        for (const dir of Object.values(DIRECTIONS)) {
          const nx = worldX + dir.x;
          const ny = y + dir.y;
          const tile = this.getTile(nx, ny);
          if (tile.type !== 'water') {
            this.#setTile(nx, ny, 'sand', 'wilds');
          }
        }
      }
      rx = clamp(rx + randInt(-1, 1), 2, this.width - 3);
    }
  }

  #carvePath(x1, y1, x2, y2, width = 1) {
    let cx = x1;
    let cy = y1;
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
    for (let i = 0; i < steps; i += 1) {
      for (let wy = -width; wy <= width; wy += 1) {
        for (let wx = -width; wx <= width; wx += 1) {
          this.#setTile(cx + wx, cy + wy, 'path', 'wilds');
        }
      }
      if (Math.hypot(cx - x2, cy - y2) < 2) break;
      const dirX = clamp(Math.sign(x2 - cx) + randInt(-1, 1), -1, 1);
      const dirY = clamp(Math.sign(y2 - cy) + randInt(-1, 1), -1, 1);
      cx = clamp(cx + dirX, 2, this.width - 3);
      cy = clamp(cy + dirY, 2, this.height - 3);
    }
  }

  #buildSettlements() {
    this.#buildTown({
      name: 'Radiant Hearth',
      center: this.spawnPoint,
      size: 8,
      housePlots: 4,
      shops: ['weapons', 'armory', 'alchemy'],
      npcs: ['mayor', 'artisan', 'sage'],
      chests: 2,
      hasHome: true,
      tier: 'capital',
    });

    const additionalTowns = [
      {
        name: 'Glimmergrove Market',
        offset: { x: -28, y: -12 },
        size: 6,
        housePlots: 2,
        shops: ['alchemy'],
        npcs: ['scout', 'sage'],
        chests: 1,
      },
      {
        name: 'Sunspire Outpost',
        offset: { x: 28, y: -10 },
        size: 5,
        housePlots: 1,
        shops: ['weapons'],
        npcs: ['captain'],
        chests: 1,
      },
      {
        name: 'Duskridge Hollow',
        offset: { x: -20, y: 26 },
        size: 6,
        housePlots: 2,
        shops: ['armory'],
        npcs: ['artisan'],
        chests: 1,
      },
    ];

    let lastTownCenter = this.spawnPoint;
    for (const config of additionalTowns) {
      const center = {
        x: clamp(this.spawnPoint.x + config.offset.x, 8, this.width - 8),
        y: clamp(this.spawnPoint.y + config.offset.y, 8, this.height - 8),
      };
      this.#carvePath(this.spawnPoint.x, this.spawnPoint.y, center.x, center.y, 2);
      if (lastTownCenter !== this.spawnPoint) {
        this.#carvePath(lastTownCenter.x, lastTownCenter.y, center.x, center.y, 1);
      }
      this.#buildTown({
        name: config.name,
        center,
        size: config.size,
        housePlots: config.housePlots,
        shops: config.shops,
        npcs: config.npcs,
        chests: config.chests,
      });
      lastTownCenter = center;
    }

    const sanctuaryCenter = {
      x: clamp(this.spawnPoint.x - randInt(18, 24), 6, this.width - 6),
      y: clamp(this.spawnPoint.y - randInt(18, 24), 6, this.height - 6),
    };
    this.#carvePath(this.spawnPoint.x, this.spawnPoint.y, sanctuaryCenter.x, sanctuaryCenter.y, 1);
    for (let y = -3; y <= 3; y += 1) {
      for (let x = -3; x <= 3; x += 1) {
        const dist = Math.hypot(x, y);
        if (dist <= 3.2) {
          this.#setTile(sanctuaryCenter.x + x, sanctuaryCenter.y + y, 'sanctuary', 'sanctuary');
        }
      }
    }
    this.decorations.push({ x: sanctuaryCenter.x, y: sanctuaryCenter.y, type: 'campfire' });
    this.lamps.push({ x: sanctuaryCenter.x + 0.5, y: sanctuaryCenter.y + 0.4 });
  }

  #buildTown({
    name,
    center,
    size,
    housePlots,
    shops,
    npcs,
    chests = 0,
    hasHome = false,
    tier = 'town',
  }) {
    const bounds = {
      x1: clamp(center.x - size, 2, this.width - 3),
      y1: clamp(center.y - size, 2, this.height - 3),
      x2: clamp(center.x + size, 2, this.width - 3),
      y2: clamp(center.y + size, 2, this.height - 3),
    };

    const occupied = new Set();
    const mark = (x, y) => occupied.add(`${x},${y}`);

    for (let y = bounds.y1; y <= bounds.y2; y += 1) {
      for (let x = bounds.x1; x <= bounds.x2; x += 1) {
        const dx = Math.abs(x - center.x);
        const dy = Math.abs(y - center.y);
        if (dx <= 1 && dy <= 1) {
          this.#setTile(x, y, 'plaza', 'town');
        } else {
          this.#setTile(x, y, 'townTile', 'town');
        }
      }
    }

    const plotCount = Math.max(0, housePlots - (hasHome ? 1 : 0));
    if (hasHome) {
      const hx = clamp(center.x + 1, bounds.x1 + 1, bounds.x2 - 1);
      const hy = clamp(center.y + 1, bounds.y1 + 1, bounds.y2 - 1);
      this.housePlots.push({ x: hx, y: hy, progress: 0, home: true });
      this.decorations.push({ x: hx, y: hy, type: 'house-frame' });
      mark(hx, hy);
    }

    let attempts = 0;
    let plotsPlaced = 0;
    while (plotsPlaced < plotCount && attempts < 200) {
      attempts += 1;
      const px = clamp(
        center.x + randInt(-size + 1, size - 1),
        bounds.x1 + 1,
        bounds.x2 - 1
      );
      const py = clamp(
        center.y + randInt(-size + 1, size - 1),
        bounds.y1 + 1,
        bounds.y2 - 1
      );
      const key = `${px},${py}`;
      if (occupied.has(key)) continue;
      this.housePlots.push({ x: px, y: py, progress: 0 });
      this.decorations.push({ x: px, y: py, type: 'house-frame' });
      mark(px, py);
      plotsPlaced += 1;
    }

    const farmlandRows = tier === 'capital' ? 4 : 3;
    for (let x = bounds.x1 - 2; x <= bounds.x2 + 2; x += 1) {
      for (let y = bounds.y2 + 1; y <= bounds.y2 + farmlandRows; y += 1) {
        this.#setTile(x, y, 'farmland', 'town');
        if (Math.random() < 0.35) {
          this.decorations.push({ x, y, type: 'crop' });
        }
      }
    }

    for (const shopId of shops) {
      const libraryEntry = SHOP_LIBRARY.find((item) => item.id === shopId);
      if (!libraryEntry) continue;
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const sx = clamp(
          center.x + randInt(-size + 1, size - 1),
          bounds.x1 + 1,
          bounds.x2 - 1
        );
        const sy = clamp(
          center.y + randInt(-size + 1, size - 1),
          bounds.y1 + 1,
          bounds.y2 - 1
        );
        const key = `${sx},${sy}`;
        if (occupied.has(key)) continue;
        this.shops.push({
          id: libraryEntry.id,
          name: libraryEntry.name,
          description: libraryEntry.description,
          stock: libraryEntry.stock.map((item) => ({ ...item })),
          x: sx + 0.5,
          y: sy + 0.5,
        });
        this.decorations.push({ x: sx, y: sy, type: 'market' });
        this.lamps.push({ x: sx + 0.5, y: sy - 0.3 });
        mark(sx, sy);
        break;
      }
    }

    for (const npcId of npcs) {
      const info = NPC_LIBRARY.find((entry) => entry.id === npcId);
      if (!info) continue;
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const nx = clamp(
          center.x + randInt(-size + 1, size - 1),
          bounds.x1 + 1,
          bounds.x2 - 1
        );
        const ny = clamp(
          center.y + randInt(-size + 1, size - 1),
          bounds.y1 + 1,
          bounds.y2 - 1
        );
        if (occupied.has(`${nx},${ny}`)) continue;
        this.npcs.push({
          id: info.id,
          name: info.name,
          line: info.line,
          journal: info.journal,
          x: nx + 0.5,
          y: ny + 0.5,
          color: pick(SCENERY_COLORS.npcCloak),
        });
        mark(nx, ny);
        break;
      }
    }

    for (let i = 0; i < chests; i += 1) {
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const cx = clamp(
          center.x + randInt(-size + 1, size - 1),
          bounds.x1 + 1,
          bounds.x2 - 1
        );
        const cy = clamp(
          center.y + randInt(-size + 1, size - 1),
          bounds.y1 + 1,
          bounds.y2 - 1
        );
        const key = `${cx},${cy}`;
        if (occupied.has(key)) continue;
        this.#placeChestAt(cx, cy, tier === 'capital' ? 'capital' : 'town');
        mark(cx, cy);
        break;
      }
    }

    this.towns.push({ name, bounds, center, tier });
  }

  #placeChestAt(x, y, tier = 'town') {
    this.chests.push({ x: x + 0.5, y: y + 0.5, opened: false, tier });
  }

  #carveDungeons() {
    const dungeonConfigs = [
      {
        name: 'Duskwater Catacombs',
        center: {
          x: clamp(this.spawnPoint.x + randInt(-28, -18), 6, this.width - 6),
          y: clamp(this.spawnPoint.y + randInt(18, 26), 6, this.height - 6),
        },
        size: randInt(7, 9),
        chests: 2,
      },
      {
        name: 'Emberfen Gate',
        center: {
          x: clamp(this.spawnPoint.x + randInt(22, 32), 6, this.width - 6),
          y: clamp(this.spawnPoint.y - randInt(18, 26), 6, this.height - 6),
        },
        size: randInt(7, 9),
        chests: 2,
      },
      {
        name: 'Starfall Observatory',
        center: {
          x: clamp(this.spawnPoint.x + randInt(-6, 14), 6, this.width - 6),
          y: clamp(this.spawnPoint.y + randInt(30, 40), 6, this.height - 6),
        },
        size: randInt(8, 10),
        chests: 2,
      },
      {
        name: 'Thornhollow Warrens',
        center: {
          x: clamp(this.spawnPoint.x - randInt(32, 42), 6, this.width - 6),
          y: clamp(this.spawnPoint.y + randInt(6, 18), 6, this.height - 6),
        },
        size: randInt(7, 9),
        chests: 2,
      },
      {
        name: 'Glimmerdeep Vault',
        center: {
          x: clamp(this.spawnPoint.x + randInt(24, 36), 6, this.width - 6),
          y: clamp(this.spawnPoint.y + randInt(-32, -22), 6, this.height - 6),
        },
        size: randInt(9, 10),
        chests: 3,
      },
    ];

    for (const config of dungeonConfigs) {
      const size = config.size ?? randInt(6, 8);
      const bounds = {
        x1: clamp(config.center.x - size, 3, this.width - 4),
        y1: clamp(config.center.y - size, 3, this.height - 4),
        x2: clamp(config.center.x + size, 3, this.width - 4),
        y2: clamp(config.center.y + size, 3, this.height - 4),
      };

      for (let y = bounds.y1; y <= bounds.y2; y += 1) {
        for (let x = bounds.x1; x <= bounds.x2; x += 1) {
          const edge = x === bounds.x1 || x === bounds.x2 || y === bounds.y1 || y === bounds.y2;
          this.#setTile(x, y, edge ? 'dungeonWall' : 'dungeonFloor', 'dungeon');
        }
      }

      const entranceX = clamp(config.center.x, bounds.x1 + 1, bounds.x2 - 1);
      const entranceY = bounds.y1;
      this.#setTile(entranceX, entranceY, 'path', 'wilds');
      this.#carvePath(entranceX, entranceY, this.spawnPoint.x, this.spawnPoint.y, 1);

      const spawnPoints = [];
      for (let i = 0; i < 4; i += 1) {
        spawnPoints.push({
          x: randInt(bounds.x1 + 1, bounds.x2 - 1) + randRange(-0.2, 0.2),
          y: randInt(bounds.y1 + 1, bounds.y2 - 1) + randRange(-0.2, 0.2),
        });
      }

      this.dungeons.push({
        name: config.name,
        bounds,
        spawnPoints,
        boss: { spawned: false, defeated: false },
        entrance: { x: entranceX + 0.5, y: entranceY + 0.5 },
      });

      for (let i = 0; i < (config.chests ?? 1); i += 1) {
        for (let attempt = 0; attempt < 40; attempt += 1) {
          const cx = randInt(bounds.x1 + 1, bounds.x2 - 1);
          const cy = randInt(bounds.y1 + 1, bounds.y2 - 1);
          const tile = this.getTile(cx, cy);
          if (tile.type !== 'dungeonFloor') continue;
          this.#placeChestAt(cx, cy, 'dungeon');
          break;
        }
      }

      this.signs.push({ x: entranceX, y: entranceY - 1, text: config.name });
    }
  }

  #decorate() {
    const area = this.width * this.height;
    for (let i = 0; i < area * 0.04; i += 1) {
      const x = randInt(2, this.width - 3);
      const y = randInt(2, this.height - 3);
      const tile = this.getTile(x, y);
      if (tile.zone === 'wilds' && (tile.type === 'grass' || tile.type === 'meadow')) {
        this.decorations.push({ x, y, type: 'tree', color: pick(SCENERY_COLORS.treeLeaves) });
        if (Math.random() < 0.1) {
          this.decorations.push({ x, y, type: 'blossom', color: SCENERY_COLORS.blossom });
        }
      }
    }

    for (let i = 0; i < area * 0.02; i += 1) {
      const x = randInt(3, this.width - 4);
      const y = randInt(3, this.height - 4);
      const tile = this.getTile(x, y);
      if (tile.zone === 'wilds' && tile.type !== 'water') {
        this.decorations.push({ x, y, type: 'rock', color: '#94a3b8' });
      }
    }

    for (const town of this.towns) {
      for (let i = 0; i < 4; i += 1) {
        const angle = (i / 4) * Math.PI * 2;
        const radius = randRange(2.5, 3.5);
        const lx = Math.round(town.center.x + Math.cos(angle) * radius);
        const ly = Math.round(town.center.y + Math.sin(angle) * radius);
        this.lamps.push({ x: lx + 0.5, y: ly + 0.5 });
      }
    }
  }

  #placeSignsAndClues() {
    const clues = [];
    for (const town of this.towns) {
      const description =
        town.tier === 'capital'
          ? 'The bustling heart of the valley and the site of your home.'
          : 'A peaceful haven where you can trade, rest, and continue building.';
      clues.push({
        title: town.name,
        description,
      });
    }

    for (const dungeon of this.dungeons) {
      clues.push({
        title: dungeon.name,
        description: 'Dangerous depths hide relics and bosses. Enemies only awaken inside.',
      });
    }

    clues.push({
      title: 'Glittering Sanctuary',
      description: 'A safe grove where glowing fireflies gather. Stand here to recover.',
    });

    clues.push({
      title: 'Radiant Hearth Home',
      description: 'Bring timber and stone from dungeons to finish building your valley home.',
    });

    this.mapClues = clues;
  }
}


function createProjectile({
  x,
  y,
  direction,
  speed,
  damage,
  lifetime,
  friendly,
  spread = 0,
  slowField = false,
  penetration = 0,
}) {
  const angle = Math.atan2(direction.y, direction.x) + spread;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    damage,
    lifetime,
    age: 0,
    friendly,
    slowField,
    penetration,
  };
}

export class RoguelikeGame {
  constructor({ canvas, ui }) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context unavailable.');
    }
    this.context = context;
    this.input = new InputHandler();
    this.ui = new UIController(ui);
    this.log = new EventLog(ui.log);
    this.particles = new ParticleSystem();
    this.minimap = new MinimapRenderer(ui.minimap, ui.atlas);
    this.lastTime = 0;
    this.state = 'menu';
    this.started = false;
    this.loopRunning = false;
    this.timeOfDay = DAY_NIGHT_DURATION * 0.4;
    this.camera = { x: 0, y: 0 };
    this.stars = Array.from({ length: SKY_STARS }, () => ({
      x: Math.random(),
      y: Math.random(),
      phase: Math.random(),
    }));
    this.stats = {
      distance: 0,
      enemiesDefeated: 0,
      damageTaken: 0,
      skillsUnlocked: 0,
      timeAlive: 0,
    };

    this.hotbar = Array.from({ length: HOTBAR_SIZE }, () => null);
    this.abilityState = new Map();
    this.activeModifiers = [];
    this.unlockedSkills = new Set();
    this.availableSkillPoints = 0;
    this.quests = [];
    this.visitedTowns = new Set();
    this.overlayState = { inventory: false, quests: false, skillTree: false, atlas: false };

    this.input.onShoot(() => this.#handleShoot());
    this.input.onDash(() => this.#handleDash());
    this.input.onPause(() => this.toggleMenu());
    this.input.onInteract(() => this.#handleInteract());
    this.input.onToggleInventory(() => this.toggleInventory());
    this.input.onToggleQuests(() => this.toggleQuests());
    this.input.onToggleSkillTree(() => this.toggleSkillTree());
    this.input.onToggleMap(() => this.toggleAtlas());
    for (let i = 0; i < HOTBAR_SIZE; i += 1) {
      this.input.bindHotbar(i, () => this.#useHotbarItem(i));
    }

    this.achievements = new Set();
    this.goal = pick(GOALS);
    this.gold = 0;
    this.inventory = [];
    this.journalEntries = [];
    this.completedStoryBeats = new Set();
    this.currentStory = STORY_BEATS[0];
    this.houseProject = null;
    this.currentDungeon = null;
    this.dungeonTimer = 0;
    this.activeShop = null;
    this.nearbyShop = null;
    this.nearbyNpc = null;
    this.nearbyPlot = null;
    this.lastZoneName = null;

    for (const button of ui.closeButtons ?? []) {
      button.addEventListener('click', () => {
        const overlay = button.closest('.overlay');
        if (overlay?.id === 'inventory-overlay') this.overlayState.inventory = false;
        if (overlay?.id === 'quests-overlay') this.overlayState.quests = false;
        if (overlay?.id === 'skilltree-overlay') this.overlayState.skillTree = false;
        if (overlay?.id === 'map-overlay') this.overlayState.atlas = false;
        overlay?.setAttribute('aria-hidden', 'true');
      });
    }

    this.#startLoop();
  }

  start() {
    this.#startLoop();
    this.started = true;
    this.restart();
  }

  restart() {
    this.state = 'running';
    this.ui.showMenu(false);
    this.ui.showStartMenu(false);
    this.ui.hideShop();
    this.ui.clearPrompt();
    this.ui.showInventory(false);
    this.ui.showQuests(false);
    this.ui.showSkillTree(false);
    this.ui.showAtlas(false);

    this.overlayState = { inventory: false, quests: false, skillTree: false, atlas: false };
    this.availableSkillPoints = 0;
    this.unlockedSkills.clear();
    this.abilityState.clear();
    this.activeModifiers = [];
    this.hotbar = Array.from({ length: HOTBAR_SIZE }, () => null);
    this.achievements.clear();
    this.goal = pick(GOALS);
    this.stats = {
      distance: 0,
      enemiesDefeated: 0,
      damageTaken: 0,
      skillsUnlocked: 0,
      timeAlive: 0,
    };
    this.gold = 0;
    this.inventory = [];
    this.journalEntries = [];
    this.completedStoryBeats = new Set();
    this.currentStory = STORY_BEATS[0];
    this.houseProject = {
      label: 'Build Cozy Home',
      progress: 0,
      target: PLAYER_HOUSE_PROGRESS_TARGET,
      completed: false,
    };
    this.currentDungeon = null;
    this.dungeonTimer = 0;
    this.activeShop = null;
    this.nearbyShop = null;
    this.nearbyNpc = null;
    this.nearbyPlot = null;
    this.nearbyChest = null;
    this.timeOfDay = DAY_NIGHT_DURATION * 0.4;
    this.quests = [];
    this.visitedTowns.clear();

    this.world = World.generate(
      Math.max(
        Math.floor(this.canvas.width / TILE_SIZE) + WORLD_PADDING_TILES,
        MIN_WORLD_WIDTH_TILES
      ),
      Math.max(
        Math.floor(this.canvas.height / TILE_SIZE) + WORLD_PADDING_TILES,
        MIN_WORLD_HEIGHT_TILES
      )
    );

    this.player = {
      x: this.world.spawnPoint.x + 0.5,
      y: this.world.spawnPoint.y + 0.5,
      vx: 0,
      vy: 0,
      health: PLAYER_BASE_HEALTH,
      maxHealth: PLAYER_BASE_HEALTH,
      level: 1,
      experience: 0,
      experienceToLevel: XP_PER_LEVEL,
      shootInterval: PLAYER_SHOT_INTERVAL,
      shootTimer: 0,
      dashCooldown: PLAYER_DASH_COOLDOWN,
      dashTimer: 0,
      dashDistance: PLAYER_DASH_DISTANCE,
      projectileSpeed: PLAYER_PROJECTILE_SPEED,
      projectileLifetime: PLAYER_PROJECTILE_LIFETIME,
      damage: PLAYER_BASE_DAMAGE,
      doubleShot: false,
      dashTrail: false,
      glowShots: false,
      spiritWalk: false,
      piercingShots: false,
      shield: null,
      onLevelUpRegen: 0,
      speed: PLAYER_BASE_SPEED,
      aim: { x: 0, y: -1 },
      upgrades: [],
      equipment: {
        weapon: null,
        armor: null,
        shield: null,
        trinket: null,
      },
      abilities: [],
      xpBonus: 0,
      sanctuaryRegen: 0,
      abilityEmpowered: false,
    };

    this.camera.x = this.player.x;
    this.camera.y = this.player.y;

    this.projectiles = [];
    this.enemyProjectiles = [];
    this.enemies = [];
    this.pickups = [];
    this.particles = new ParticleSystem();
    this.spawnTimer = ENEMY_SPAWN_INTERVAL;
    this.slowFields = [];

    this.minimap?.setWorld(this.world);
    this.minimap?.draw(this.player);

    this.log.entries = [];
    this.log.render();

    this.ui.setHealth(this.player.health, this.player.maxHealth);
    this.ui.setExperience(
      this.player.level,
      this.player.experience,
      this.player.experienceToLevel
    );
    this.ui.setSkillPoints(this.availableSkillPoints);
    this.ui.setUpgrades([]);
    this.ui.setAchievements([]);
    this.ui.setGoal(this.goal);
    this.ui.setMapClues(this.world.mapClues);
    this.ui.setGold(this.gold);
    this.#refreshInventoryUI();
    this.ui.setEquipment(this.player.equipment);
    this.ui.setAbilities(this.#describeAbilities());
    this.ui.setQuests(this.quests);
    this.ui.setJournal(this.journalEntries);
    this.ui.setStory(this.currentStory.text);
    this.ui.setZone(this.world.getZoneName(this.player.x, this.player.y));
    this.ui.setTimeOfDay(this.#describeTimeOfDay());
    this.ui.setTownProgress(this.houseProject.label, 0);
    this.ui.setHotbar(this.hotbar);
    this.#refreshSkillTreeUI();

    this.log.push('Radiant Hearth hums with possibility. Press F to chat, trade, and build.');
    this.log.push('Press I for inventory, K for the skill tree, and J for quests.');

    this.lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  }

  toggleInventory(force) {
    if (this.state !== 'running' && force !== true) return;
    const next = force ?? !this.overlayState.inventory;
    this.overlayState.inventory = next;
    this.ui.showInventory(next);
    if (next) {
      this.#refreshInventoryUI();
    }
  }

  toggleQuests(force) {
    if (this.state !== 'running' && force !== true) return;
    const next = force ?? !this.overlayState.quests;
    this.overlayState.quests = next;
    this.ui.showQuests(next);
    if (next) {
      this.ui.setQuests(this.quests);
    }
  }

  toggleSkillTree(force) {
    if (this.state !== 'running' && force !== true) return;
    const next = force ?? !this.overlayState.skillTree;
    this.overlayState.skillTree = next;
    this.ui.showSkillTree(next);
    if (next) {
      this.#refreshSkillTreeUI();
    }
  }

  #refreshSkillTreeUI() {
    if (!this.ui?.renderSkillTree) return;
    if (!this.player) return;
    const unlocked = this.unlockedSkills ?? new Set();
    const available = new Set();
    for (const node of SKILL_TREE_NODES) {
      const requirements = node.prerequisites ?? [];
      if (requirements.every((id) => unlocked.has(id))) {
        available.add(node.id);
      }
    }

    this.ui.renderSkillTree(
      SKILL_TREE_NODES,
      unlocked,
      available,
      (node) => this.#unlockSkill(node.id),
      this.availableSkillPoints
    );

    const unlockedNodes = SKILL_TREE_NODES.filter((node) => unlocked.has(node.id));
    this.player.upgrades = unlockedNodes;
    this.ui.setUpgrades(unlockedNodes);
    this.ui.setSkillPoints(this.availableSkillPoints);
  }

  #unlockSkill(skillId) {
    const node = SKILL_TREE_NODES.find((entry) => entry.id === skillId);
    if (!node) return;
    if (this.unlockedSkills.has(node.id)) return;
    const requirements = node.prerequisites ?? [];
    const missing = requirements.filter((id) => !this.unlockedSkills.has(id));
    if (missing.length > 0) {
      this.ui.showToast('Unlock prerequisite skills first.');
      return;
    }
    const cost = Math.max(1, node.cost ?? 1);
    if (this.availableSkillPoints < cost) {
      this.ui.showToast('You need more sparks to learn this skill.');
      return;
    }

    this.availableSkillPoints -= cost;
    this.unlockedSkills.add(node.id);
    if (typeof node.apply === 'function') {
      node.apply(this);
    }
    let toastMessage = `${node.name} unlocked.`;
    if (node.unlocksAbility) {
      const ability = ABILITY_LIBRARY[node.unlocksAbility];
      this.#unlockAbility(node.unlocksAbility, { silent: true });
      if (ability) {
        toastMessage = `${node.name} unlocked. Ability ready: ${ability.name}.`;
      }
    }

    this.stats.skillsUnlocked += 1;
    this.ui.showToast(toastMessage);
    this.ui.setHealth(this.player.health, this.player.maxHealth);
    this.ui.setSkillPoints(this.availableSkillPoints);
    this.#refreshSkillTreeUI();
  }

  toggleAtlas(force) {
    if (this.state !== 'running' && force !== true) return;
    const next = force ?? !this.overlayState.atlas;
    this.overlayState.atlas = next;
    this.ui.showAtlas(next);
    if (next) {
      this.minimap?.drawAtlas?.(this.player);
    }
  }

  #refreshInventoryUI() {
    const items = this.inventory.map((item) => ({ ...item }));
    this.ui.setInventory(items, {
      onEquip: (item) => this.#equipItem(item.instanceId),
      onUse: (item) => this.#useItem(item.instanceId),
      onAssign: (item) => this.#assignHotbar(item.instanceId),
    });
  }

  #equipItem(instanceId) {
    const item = this.inventory.find((entry) => entry.instanceId === instanceId);
    if (!item || !item.slot) return;
    const slot = item.slot;
    const current = this.player.equipment[slot];
    if (current?.instanceId === instanceId) {
      this.ui.showToast(`${item.name} already equipped`);
      return;
    }
    if (current) {
      this.#unequipSlot(slot);
    }
    this.player.equipment[slot] = item;
    item.equipped = true;
    this.#applyEquipmentBonuses(item, true);
    if (typeof item.onEquip === 'function') {
      item.onEquip(this.player);
    }
    this.ui.showToast(`${item.name} equipped`);
    this.#refreshInventoryUI();
    this.ui.setEquipment(this.player.equipment);
  }

  #unequipSlot(slot) {
    const current = this.player.equipment[slot];
    if (!current) return;
    current.equipped = false;
    this.#applyEquipmentBonuses(current, false);
    if (typeof current.onUnequip === 'function') {
      current.onUnequip(this.player);
    }
    this.player.equipment[slot] = null;
  }

  #applyEquipmentBonuses(item, apply) {
    const direction = apply ? 1 : -1;
    const bonuses = item.bonuses || {};
    if (bonuses.damage) {
      this.player.damage += bonuses.damage * direction;
    }
    if (bonuses.maxHealth) {
      this.player.maxHealth += bonuses.maxHealth * direction;
      this.player.health = clamp(this.player.health, 0, this.player.maxHealth);
    }
    if (bonuses.dashDistance) {
      this.player.dashDistance += bonuses.dashDistance * direction;
    }
    if (bonuses.speedMultiplier) {
      const multiplier = bonuses.speedMultiplier;
      this.player.speed = apply
        ? this.player.speed * multiplier
        : this.player.speed / multiplier;
    }
  }

  #useItem(instanceId) {
    const item = this.inventory.find((entry) => entry.instanceId === instanceId);
    if (!item) return;
    if (item.type !== 'consumable') {
      this.ui.showToast('Only consumables can be used directly.');
      return;
    }
    let consumed = false;
    if (item.heal) {
      const before = this.player.health;
      this.player.health = clamp(this.player.health + item.heal, 0, this.player.maxHealth);
      const healed = Math.round(this.player.health - before);
      if (healed > 0) {
        this.ui.showToast(`Restored ${healed} health`);
        consumed = true;
      }
    }
    if (typeof item.onUse === 'function') {
      item.onUse(this);
      consumed = true;
    }
    if (consumed) {
      item.quantity = Math.max(0, (item.quantity ?? 1) - 1);
      if (item.quantity <= 0) {
        this.inventory = this.inventory.filter((entry) => entry.instanceId !== instanceId);
      }
      this.#syncHotbar();
      this.ui.setHealth(this.player.health, this.player.maxHealth);
      this.#refreshInventoryUI();
    } else {
      this.ui.showToast('Already at full effect.');
    }
  }

  #assignHotbar(instanceId) {
    const slotIndex = this.hotbar.findIndex((slot) => !slot);
    if (slotIndex === -1) {
      this.ui.showToast('Hotbar full. Remove an item before assigning.');
      return;
    }
    const item = this.inventory.find((entry) => entry.instanceId === instanceId);
    if (!item) return;
    this.hotbar[slotIndex] = { type: 'item', instanceId, label: item.name };
    this.#syncHotbar();
    this.ui.showToast(`${item.name} added to hotbar slot ${slotIndex + 1}`);
  }

  #useHotbarItem(index) {
    const slot = this.hotbar[index];
    if (!slot) return;
    if (slot.type === 'item') {
      this.#useItem(slot.instanceId);
    }
  }

  #syncHotbar() {
    const display = this.hotbar.map((slot) => {
      if (!slot) return null;
      if (slot.type === 'item') {
        const item = this.inventory.find((entry) => entry.instanceId === slot.instanceId);
        if (!item) {
          return null;
        }
        return {
          label: item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name,
          cooldownLabel: '',
          active: false,
        };
      }
      return null;
    });
    this.ui.setHotbar(display);
  }

  #describeAbilities() {
    return this.player.abilities.map((abilityId) => {
      const ability = ABILITY_LIBRARY[abilityId];
      const cooldown = this.abilityState.get(abilityId)?.timer ?? 0;
      return {
        id: abilityId,
        name: ability.name,
        description: ability.description,
        key: ability.key,
        cooldown: cooldown,
      };
    });
  }

  #unlockAbility(abilityId, options = {}) {
    if (this.player.abilities.includes(abilityId)) return;
    const ability = ABILITY_LIBRARY[abilityId];
    if (!ability) return;
    this.player.abilities.push(abilityId);
    this.abilityState.set(abilityId, { cooldown: ability.cooldown, timer: 0 });
    this.input.bindAbility(ability.key, () => this.#triggerAbility(abilityId));
    if (!options.silent) {
      this.ui.showToast(`${ability.name} unlocked`);
    }
    this.ui.setAbilities(this.#describeAbilities());
  }

  #triggerAbility(abilityId) {
    const state = this.abilityState.get(abilityId);
    if (!state) return;
    if (state.timer > 0) {
      this.ui.showToast('Ability recharging');
      return;
    }
    const ability = ABILITY_LIBRARY[abilityId];
    if (!ability) return;
    this.#activateAbility(abilityId, ability);
    state.timer = ability.cooldown;
    this.ui.setAbilities(this.#describeAbilities());
    this.#syncHotbar();
  }

  #activateAbility(abilityId, ability) {
    if (abilityId === 'solar-burst') {
      const radius = 4.5;
      for (const enemy of [...this.enemies]) {
        const distance = Math.hypot(enemy.x - this.player.x, enemy.y - this.player.y);
        if (distance <= radius) {
          enemy.health -= this.player.damage * 2.2;
          enemy.slowTimer = 1.5;
          if (enemy.health <= 0) {
            this.#onEnemyDefeated(enemy);
            this.enemies = this.enemies.filter((target) => target !== enemy);
          }
        }
      }
      this.particles.spawn({ x: this.player.x, y: this.player.y }, { color: '#f97316', radius: 0.6, life: 0.8 });
      this.ui.showToast('Solar Burst unleashed');
    } else if (abilityId === 'astral-step') {
      const direction = normalize(this.player.aim);
      const distance = 3.5;
      const targetX = this.player.x + direction.x * distance;
      const targetY = this.player.y + direction.y * distance;
      if (this.world.isWalkable(targetX, targetY)) {
        this.player.x = targetX;
        this.player.y = targetY;
        this.player.vx = 0;
        this.player.vy = 0;
        this.slowFields = this.slowFields || [];
        this.slowFields.push({ x: targetX, y: targetY, radius: 2, slow: 0.45, age: 0, duration: 3 });
        this.ui.showToast('Astral Step used');
      }
    } else if (abilityId === 'tempest-field') {
      const center = { x: this.player.x, y: this.player.y };
      this.slowFields = this.slowFields || [];
      this.slowFields.push({ x: center.x, y: center.y, radius: 5, slow: 0.35, damage: 12, age: 0, duration: 6 });
      this.ui.showToast('Tempest Field conjured');
    }
  }

  addTimedModifier(modifier) {
    const existing = this.activeModifiers.find((mod) => mod.id === modifier.id);
    if (existing) {
      existing.remaining = modifier.duration;
      return;
    }
    this.activeModifiers.push({
      ...modifier,
      remaining: modifier.duration,
      applied: false,
    });
  }

  #updateAbilityCooldowns(dt) {
    for (const [id, state] of this.abilityState.entries()) {
      if (state.timer > 0) {
        state.timer = Math.max(0, state.timer - dt);
      }
    }
  }

  #updateModifiers(dt) {
    const survivors = [];
    for (const mod of this.activeModifiers) {
      if (!mod.applied) {
        mod.apply?.(this.player);
        mod.applied = true;
      }
      mod.remaining -= dt;
      if (mod.remaining > 0) {
        survivors.push(mod);
      } else {
        mod.remove?.(this.player);
      }
    }
    this.activeModifiers = survivors;
  }
  showStartMenu(show) {
    this.ui.showStartMenu(show);
  }

  handleResize() {
    if (!this.started) {
      return;
    }
    this.restart();
  }

  toggleMenu() {
    if (this.state === 'running') {
      this.state = 'menu';
      this.ui.showMenu(true);
    } else if (this.state === 'menu' && this.player?.health > 0) {
      this.state = 'running';
      this.ui.showMenu(false);
    }
  }

  resume() {
    if (this.state !== 'menu') return;
    if (this.player?.health <= 0) return;
    this.state = 'running';
    this.ui.showMenu(false);
  }

  openShop(shop) {
    if (this.activeShop === shop) return;
    this.activeShop = shop;
    this.ui.showShop(
      shop,
      (item) => this.#purchaseShopItem(shop, item),
      () => this.leaveShop()
    );
    this.log.push(`You browse the wares at ${shop.name}.`);
  }

  leaveShop() {
    if (!this.activeShop) return;
    this.activeShop = null;
    this.ui.hideShop();
    this.ui.clearPrompt();
  }

  #purchaseShopItem(shop, item) {
    if (!this.activeShop || this.activeShop !== shop) return;
    if (this.gold < item.cost) {
      this.ui.showToast('Not enough gold. Explore dungeons for more.');
      return;
    }
    this.gold -= item.cost;
    this.ui.setGold(this.gold);
    item.effect(this.player);
    this.ui.setHealth(this.player.health, this.player.maxHealth);
    this.ui.showToast(`Purchased ${item.label}!`);
    this.log.push(`You purchase ${item.label} from ${shop.name}.`);
  }

  #handleInteract() {
    if (this.state !== 'running') return;
    if (this.activeShop) {
      this.leaveShop();
      return;
    }

    const shop = this.world.getShopNear(this.player.x, this.player.y);
    if (shop) {
      this.openShop(shop);
      return;
    }

    const chest = this.world.getChestNear(this.player.x, this.player.y);
    if (chest) {
      this.#openChest(chest);
      return;
    }

    const npc = this.world.getNpcNear(this.player.x, this.player.y);
    if (npc) {
      this.#talkToNpc(npc);
      return;
    }

    const plot = this.world.getHousePlotNear(this.player.x, this.player.y);
    if (plot) {
      this.#progressHouse(plot);
    }
  }

  #talkToNpc(npc) {
    this.log.push(`${npc.name}: ${npc.line}`);
    if (!this.journalEntries.find((entry) => entry.id === npc.id)) {
      this.journalEntries.push({ id: npc.id, name: npc.name, note: npc.journal });
      this.ui.setJournal(this.journalEntries);
      this.ui.showToast(`${npc.name} shares guidance.`);
      if (npc.id === 'mayor') {
        this.#advanceStory('arrival');
      }
    }
  }

  #progressHouse(plot) {
    if (this.houseProject?.completed) {
      this.ui.showToast('Your home already gleams with lantern light.');
      return;
    }
    const materialIndex = this.inventory.findIndex((item) =>
      item.id === 'timber' || item.id === 'stone'
    );
    if (materialIndex === -1) {
      this.ui.showToast('Bring timber or stone from a dungeon to keep building.');
      return;
    }
    const item = this.inventory.splice(materialIndex, 1)[0];
    const contribution = item.id === 'timber' ? 15 : 12;
    this.houseProject.progress = clamp(
      this.houseProject.progress + contribution,
      0,
      this.houseProject.target
    );
    plot.progress = this.houseProject.progress;
    this.ui.setInventory(this.inventory);
    this.ui.setTownProgress(
      this.houseProject.label,
      this.houseProject.progress / this.houseProject.target
    );
    this.ui.showToast(`Contributed materials toward your home (+${contribution}).`);
    this.log.push('You add sturdy beams to your future home.');

    if (this.houseProject.progress >= this.houseProject.target) {
      this.houseProject.completed = true;
      this.houseProject.label = 'Home Complete';
      this.log.push('Your home stands finished, welcoming and warm.');
      this.ui.showToast('Home completed!');
      this.ui.setTownProgress('Home Complete', 1);
      this.#advanceStory('house-finished');
      // swap decoration to a finished house
      const deco = this.world.decorations.find(
        (entry) => entry.x === plot.x && entry.y === plot.y && entry.type === 'house-frame'
      );
      if (deco) deco.type = 'house';
    }
  }

  #openChest(chest) {
    if (chest.opened) {
      this.ui.showToast('The chest has already been emptied.');
      return;
    }
    chest.opened = true;
    this.ui.showToast('Chest opened!');
    this.log.push('You crack open the chest and collect its trove.');
    this.#spawnChestLoot(chest);
    this.nearbyChest = null;
    this.ui.clearPrompt();
  }

  #spawnChestLoot(chest) {
    const tier = chest.tier ?? 'town';
    const table = CHEST_LOOT_TABLES[tier] ?? CHEST_LOOT_TABLES.town;
    const dropCount = tier === 'capital' ? 3 : tier === 'dungeon' ? 3 : 2;
    for (let i = 0; i < dropCount; i += 1) {
      this.#spawnLootItem(pick(table), chest.x, chest.y, 0.55, 24);
    }
    const goldRange =
      tier === 'capital'
        ? GOLD_RANGES.chestCapital
        : tier === 'dungeon'
        ? GOLD_RANGES.chestDungeon
        : GOLD_RANGES.chestTown;
    this.#dropGold(chest.x, chest.y, randomGold(goldRange), 0.45);
    if (tier !== 'town') {
      const rareId = tier === 'capital' ? 'moondrop-elixir' : 'sun-elixir';
      this.#spawnLootItem(rareId, chest.x, chest.y, 0.5, 24);
    }
  }

  #advanceStory(id) {
    if (this.completedStoryBeats.has(id)) return;
    this.completedStoryBeats.add(id);
    const next = STORY_BEATS.find((beat) => !this.completedStoryBeats.has(beat.id));
    if (next) {
      this.currentStory = next;
      this.ui.setStory(next.text);
    } else {
      this.currentStory = { id: 'free', text: 'Enjoy the valley. Help townsfolk and explore freely.' };
      this.ui.setStory(this.currentStory.text);
    }
  }

  #loop(time) {
    const dt = Math.min(0.06, (time - this.lastTime) / 1000 || 0);
    this.lastTime = time;

    if (this.state === 'running') {
      this.#update(dt);
    }

    this.#render();
    requestAnimationFrame((next) => this.#loop(next));
  }

  #startLoop() {
    if (this.loopRunning) {
      return;
    }
    this.loopRunning = true;
    this.lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    requestAnimationFrame((time) => this.#loop(time));
  }

  #update(dt) {
    this.stats.timeAlive += dt;
    this.timeOfDay = (this.timeOfDay + dt * 0.45) % DAY_NIGHT_DURATION;
    this.#updateCamera(dt);
    this.ui.setTimeOfDay(this.#describeTimeOfDay());
    const movement = this.input.getMovementVector();
    const aim = this.input.getAimVector(this.player.aim);
    this.player.aim = aim;

    const desiredVx = movement.x * this.player.speed;
    const desiredVy = movement.y * this.player.speed;
    const acceleration = PLAYER_ACCELERATION * (this.player.spiritWalk ? 1.25 : 1);
    const friction = PLAYER_FRICTION;

    const applyAcceleration = (current, desired) => {
      const delta = desired - current;
      const step = acceleration * dt;
      if (Math.abs(delta) <= step) return desired;
      return current + Math.sign(delta) * step;
    };

    this.player.vx = applyAcceleration(this.player.vx, desiredVx);
    this.player.vy = applyAcceleration(this.player.vy, desiredVy);

    if (movement.x === 0 && movement.y === 0) {
      const decay = clamp(friction * dt, 0, 1);
      this.player.vx = lerp(this.player.vx, 0, decay);
      this.player.vy = lerp(this.player.vy, 0, decay);
    }

    const nextX = this.player.x + this.player.vx * dt;
    const nextY = this.player.y + this.player.vy * dt;

    if (this.world.isWalkable(nextX, this.player.y)) {
      this.stats.distance += Math.abs(nextX - this.player.x);
      this.player.x = nextX;
    } else {
      this.player.vx = 0;
    }

    if (this.world.isWalkable(this.player.x, nextY)) {
      this.stats.distance += Math.abs(nextY - this.player.y);
      this.player.y = nextY;
    } else {
      this.player.vy = 0;
    }

    this.player.shootTimer = Math.max(0, this.player.shootTimer - dt);
    this.player.dashTimer = Math.max(0, this.player.dashTimer - dt);

    this.#updateAbilityCooldowns(dt);
    this.#updateModifiers(dt);
    if (this.player.abilities.length > 0) {
      this.ui.setAbilities(this.#describeAbilities());
    }

    if (this.player.shield) {
      this.player.shield.timer = Math.min(
        this.player.shield.cooldown,
        this.player.shield.timer + dt
      );
      if (this.player.shield.timer >= this.player.shield.cooldown) {
        this.player.shield.active = true;
      }
    }

    this.#updateZoneState(dt);
    this.#updateProjectiles(dt);
    this.#updateEnemies(dt);
    this.#updateEnemyProjectiles(dt);
    this.#updatePickups(dt);
    this.particles.update(dt);
    this.#checkAchievements();

    if (this.currentDungeon) {
      this.spawnTimer -= dt;
      this.dungeonTimer += dt;
      if (this.spawnTimer <= 0) {
        this.#spawnEnemyWave();
        this.spawnTimer = ENEMY_SPAWN_INTERVAL + randRange(-2, 2);
      }
      if (
        !this.currentDungeon.boss.spawned &&
        !this.currentDungeon.boss.defeated &&
        this.dungeonTimer > 25
      ) {
        this.#spawnBoss(this.currentDungeon);
      }
    } else {
      this.spawnTimer = ENEMY_SPAWN_INTERVAL;
    }
  }

  #updateZoneState(dt) {
    const zoneName = this.world.getZoneName(this.player.x, this.player.y);
    if (zoneName !== this.lastZoneName) {
      this.ui.setZone(zoneName);
      this.lastZoneName = zoneName;
    }

    const shop = this.world.getShopNear(this.player.x, this.player.y);
    const npc = this.world.getNpcNear(this.player.x, this.player.y);
    const chest = this.world.getChestNear(this.player.x, this.player.y);
    const plot = this.world.getHousePlotNear(this.player.x, this.player.y);

    if (
      this.activeShop &&
      Math.hypot(this.activeShop.x - this.player.x, this.activeShop.y - this.player.y) > 2.2
    ) {
      this.leaveShop();
    }

    this.nearbyShop = shop;
    this.nearbyNpc = npc;
    this.nearbyChest = chest;
    this.nearbyPlot = plot;

    let prompt = '';
    if (this.activeShop) {
      prompt = 'Press F to leave the shop';
    } else if (shop) {
      prompt = `Press F to trade with ${shop.name}`;
    } else if (chest && !chest.opened) {
      prompt = 'Press F to open the chest';
    } else if (plot && this.houseProject && !this.houseProject.completed) {
      const hasMaterials = this.inventory.some(
        (item) => item.id === 'timber' || item.id === 'stone'
      );
      prompt = hasMaterials
        ? 'Press F to deliver building materials'
        : 'Find timber or stone to keep building your home';
    } else if (npc) {
      prompt = `Press F to speak with ${npc.name}`;
    }

    if (prompt) {
      this.ui.showPrompt(prompt);
    } else {
      this.ui.clearPrompt();
    }

    const inTown = this.world.isTown(this.player.x, this.player.y);
    const inSanctuary = this.world.isSanctuary(this.player.x, this.player.y);
    if ((inTown || inSanctuary) && this.player.health < this.player.maxHealth) {
      const rate = inSanctuary ? 26 : 14;
      this.player.health = clamp(this.player.health + rate * dt, 0, this.player.maxHealth);
      this.ui.setHealth(this.player.health, this.player.maxHealth);
    }

    const dungeon = this.world.getDungeonAt(this.player.x, this.player.y);
    if (dungeon !== this.currentDungeon) {
      if (dungeon) {
        this.currentDungeon = dungeon;
        this.spawnTimer = 1.5;
        this.dungeonTimer = 0;
        if (!dungeon.visited) {
          dungeon.visited = true;
          this.log.push(`You descend into ${dungeon.name}.`);
        } else {
          this.log.push(`You return to ${dungeon.name}.`);
        }
        this.ui.showToast(`${dungeon.name} awakens!`);
        this.#advanceStory('first-dungeon');
      } else if (this.currentDungeon) {
        this.log.push('You step back into the fresh valley air.');
        this.currentDungeon = null;
        this.enemies = [];
        this.enemyProjectiles = [];
        this.dungeonTimer = 0;
        this.spawnTimer = ENEMY_SPAWN_INTERVAL;
      }
    }

    if (!this.currentDungeon && (inTown || inSanctuary)) {
      this.spawnTimer = ENEMY_SPAWN_INTERVAL;
    }
  }

  #spawnBoss(dungeon) {
    const spawn = pick(dungeon.spawnPoints);
    const boss = {
      x: spawn.x,
      y: spawn.y,
      health: BOSS_HEALTH,
      color: pick(BOSS_PALETTE),
      boss: true,
      fireTimer: 0.8,
      patternTimer: 0,
      dungeon,
    };
    this.enemies.push(boss);
    dungeon.boss.spawned = true;
    dungeon.boss.defeated = false;
    this.ui.showToast('A guardian emerges!');
    this.log.push(`The guardian of ${dungeon.name} materializes.`);
  }

  #handleShoot() {
    if (this.state !== 'running') return;
    if (this.player.shootTimer > 0) return;
    const direction = this.player.aim;
    if (vectorLength(direction) === 0) return;

    this.player.shootTimer = this.player.shootInterval;
    const baseProjectile = createProjectile({
      x: this.player.x,
      y: this.player.y,
      direction,
      speed: this.player.projectileSpeed,
      damage: this.player.damage,
      lifetime: this.player.projectileLifetime,
      friendly: true,
      slowField: this.player.glowShots,
      penetration: this.player.piercingShots ? 1 : 0,
    });

    this.projectiles.push(baseProjectile);

    if (this.player.doubleShot) {
      const spreadAngle = randRange(-0.25, 0.25);
      this.projectiles.push(
        createProjectile({
          x: this.player.x,
          y: this.player.y,
          direction,
          speed: this.player.projectileSpeed * 0.92,
          damage: Math.round(this.player.damage * 0.8),
          lifetime: this.player.projectileLifetime,
          friendly: true,
          spread: spreadAngle,
          slowField: this.player.glowShots,
          penetration: this.player.piercingShots ? 1 : 0,
        })
      );
    }

    this.particles.spawn({ x: this.player.x, y: this.player.y }, {
      color: BULLET_COLOR,
      radius: 0.2,
      life: 0.4,
      vx: -direction.x * 0.5,
      vy: -direction.y * 0.5,
    });
    this.log.push('You release a burst of luminous light.');
  }

  #handleDash() {
    if (this.state !== 'running') return;
    if (this.player.dashTimer > 0) return;
    const direction = this.input.getMovementVector();
    if (vectorLength(direction) === 0) return;

    this.player.dashTimer = this.player.dashCooldown;
    const dashDistance = this.player.dashDistance;
    const steps = Math.ceil(dashDistance);
    let dx = direction.x;
    let dy = direction.y;
    if (!this.player.spiritWalk) {
      const norm = normalize(direction);
      dx = norm.x;
      dy = norm.y;
    }
    for (let i = 0; i < steps; i += 1) {
      const nextX = this.player.x + dx;
      const nextY = this.player.y + dy;
      if (!this.world.isWalkable(nextX, nextY)) break;
      this.player.x = nextX;
      this.player.y = nextY;
      if (this.player.dashTrail) {
        this.particles.spawn({ x: nextX, y: nextY }, {
          color: 'rgba(251, 191, 36, 0.8)',
          radius: 0.25,
          life: 0.5,
          vx: randRange(-0.3, 0.3),
          vy: randRange(-0.3, 0.3),
        });
      }
    }
    this.log.push('You dash in a streak of warm light.');
  }

  resume() {
    if (this.player?.health <= 0) return;
    this.state = 'running';
    this.ui.showMenu(false);
  }

  #updateProjectiles(dt) {
    const newProjectiles = [];
    for (const projectile of this.projectiles) {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.age += dt;

      if (!this.world.isWalkable(projectile.x, projectile.y)) {
        if (projectile.slowField) {
          this.#spawnSlowField(projectile.x, projectile.y);
        }
        continue;
      }

      let consumed = false;
      for (const enemy of this.enemies) {
        const distance = Math.hypot(enemy.x - projectile.x, enemy.y - projectile.y);
        if (distance < 0.6) {
          enemy.health -= projectile.damage;
          this.particles.spawn({ x: enemy.x, y: enemy.y }, {
            color: '#fbbf24',
            radius: 0.18,
            life: 0.5,
            vx: randRange(-0.6, 0.6),
            vy: randRange(-0.6, 0.6),
          });
          if (projectile.slowField) {
            this.#spawnSlowField(enemy.x, enemy.y);
          }
          if (projectile.penetration && projectile.penetration > 0) {
            projectile.penetration -= 1;
            continue;
          }
          consumed = true;
          break;
        }
      }

      if (!consumed && projectile.age < projectile.lifetime) {
        newProjectiles.push(projectile);
      }
    }
    this.projectiles = newProjectiles;

    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.health > 0) return true;
      this.#onEnemyDefeated(enemy);
      return false;
    });
  }

  #spawnSlowField(x, y) {
    const field = {
      x,
      y,
      radius: 1.8,
      duration: 3,
      age: 0,
    };
    if (!this.slowFields) this.slowFields = [];
    this.slowFields.push(field);
  }

  #dropGold(x, y, amount, scatter = 0.45) {
    if (amount <= 0) return;
    this.pickups.push({
      kind: 'gold',
      x: x + randRange(-scatter, scatter),
      y: y + randRange(-scatter, scatter),
      vx: randRange(-0.25, 0.25),
      vy: randRange(-0.25, 0.25),
      amount: Math.round(amount),
      life: 18,
    });
  }

  #spawnLootItem(itemOrId, x, y, scatter = 0.4, life = 18) {
    const item = typeof itemOrId === 'string' ? cloneItem(itemOrId) : { ...itemOrId };
    this.pickups.push({
      kind: 'loot',
      x: x + randRange(-scatter, scatter),
      y: y + randRange(-scatter, scatter),
      vx: randRange(-0.3, 0.3),
      vy: randRange(-0.3, 0.3),
      item,
      life,
    });
  }

  #updateEnemyProjectiles(dt) {
    const survivors = [];
    for (const projectile of this.enemyProjectiles) {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.age += dt;

      const distance = Math.hypot(
        projectile.x - this.player.x,
        projectile.y - this.player.y
      );
      if (distance < 0.6) {
        this.#damagePlayer(ENEMY_PROJECTILE_DAMAGE);
        continue;
      }

      if (!this.world.isWalkable(projectile.x, projectile.y)) {
        continue;
      }

      if (projectile.age < projectile.lifetime) {
        survivors.push(projectile);
      }
    }
    this.enemyProjectiles = survivors;
  }

  #updateEnemies(dt) {
    for (const enemy of this.enemies) {
      enemy.fireTimer -= dt;
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.hypot(dx, dy);
      const slowed = this.#isInSlowField(enemy.x, enemy.y);
      const speedMultiplier = slowed ? 0.5 : 1;
      const isBoss = enemy.boss === true;

      if (distance > 0.1) {
        const dir = normalize({ x: dx, y: dy });
        const baseSpeed = (isBoss ? ENEMY_BASE_SPEED * 0.75 : ENEMY_BASE_SPEED) * speedMultiplier;
        if (isBoss) {
          enemy.patternTimer = (enemy.patternTimer || 0) + dt;
          const sweepX = Math.cos(enemy.patternTimer * 1.4) * 0.5;
          const sweepY = Math.sin(enemy.patternTimer * 1.2) * 0.35;
          const swayX = enemy.x + sweepX * dt;
          const swayY = enemy.y + sweepY * dt;
          if (this.world.isWalkable(swayX, enemy.y)) enemy.x = swayX;
          if (this.world.isWalkable(enemy.x, swayY)) enemy.y = swayY;
        }
        const nextX = enemy.x + dir.x * baseSpeed * dt;
        const nextY = enemy.y + dir.y * baseSpeed * dt;
        if (this.world.isWalkable(nextX, enemy.y)) {
          enemy.x = nextX;
        }
        if (this.world.isWalkable(enemy.x, nextY)) {
          enemy.y = nextY;
        }
      }

      if (distance < (isBoss ? 1.5 : 1.2)) {
        const damage = isBoss ? BOSS_CONTACT_DAMAGE : ENEMY_CONTACT_DAMAGE;
        this.#damagePlayer(damage * dt);
      }

      if (distance < (isBoss ? ENEMY_RANGE + 2 : ENEMY_RANGE) && enemy.fireTimer <= 0) {
        if (isBoss) {
          enemy.fireTimer = BOSS_FIRE_INTERVAL + randRange(-0.3, 0.3);
          const baseAngle = Math.atan2(dy, dx);
          const spreads = [-0.35, -0.1, 0.1, 0.35];
          for (const offset of spreads) {
            const angle = baseAngle + offset;
            const projectile = {
              x: enemy.x,
              y: enemy.y,
              vx: Math.cos(angle) * BOSS_PROJECTILE_SPEED,
              vy: Math.sin(angle) * BOSS_PROJECTILE_SPEED,
              damage: BOSS_PROJECTILE_DAMAGE,
              lifetime: ENEMY_PROJECTILE_LIFETIME + 1,
              age: 0,
              friendly: false,
            };
            this.enemyProjectiles.push(projectile);
          }
          this.particles.spawn({ x: enemy.x, y: enemy.y }, {
            color: ENEMY_BULLET_COLOR,
            radius: 0.28,
            life: 0.55,
          });
        } else {
          enemy.fireTimer = ENEMY_FIRE_INTERVAL + randRange(-0.6, 0.6);
          const projectile = createProjectile({
            x: enemy.x,
            y: enemy.y,
            direction: normalize({ x: dx, y: dy }),
            speed: ENEMY_PROJECTILE_SPEED,
            damage: ENEMY_PROJECTILE_DAMAGE,
            lifetime: ENEMY_PROJECTILE_LIFETIME,
            friendly: false,
          });
          this.enemyProjectiles.push(projectile);
          this.particles.spawn({ x: enemy.x, y: enemy.y }, {
            color: ENEMY_BULLET_COLOR,
            radius: 0.18,
            life: 0.45,
          });
        }
      }
    }

    if (this.slowFields) {
      this.slowFields = this.slowFields
        .map((field) => ({ ...field, age: field.age + dt }))
        .filter((field) => field.age < field.duration);
    }
  }

  #updatePickups(dt) {
    const survivors = [];
    for (const pickup of this.pickups) {
      const dx = this.player.x - pickup.x;
      const dy = this.player.y - pickup.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 0.6) {
        if (pickup.kind === 'xp') {
          this.player.experience += pickup.value;
          this.log.push('You collect a glowing memory shard.');
          this.ui.showToast(`+${pickup.value} experience`);
          this.#checkLevelUp();
        } else if (pickup.kind === 'loot' && pickup.item) {
          this.#collectLoot(pickup.item);
        } else if (pickup.kind === 'gold') {
          const amount = Math.max(1, Math.round(pickup.amount ?? 0));
          this.gold += amount;
          this.ui.setGold(this.gold);
          this.ui.showToast(`+${amount} gold`);
          this.log.push('You gather glittering coins.');
        }
        continue;
      }

      if (distance < PICKUP_ATTRACTION_RANGE) {
        const dir = normalize({ x: dx, y: dy });
        pickup.vx = lerp(pickup.vx, dir.x * PICKUP_ATTRACTION_SPEED, 0.2);
        pickup.vy = lerp(pickup.vy, dir.y * PICKUP_ATTRACTION_SPEED, 0.2);
      }

      pickup.x += pickup.vx * dt;
      pickup.y += pickup.vy * dt;
      pickup.life -= dt;

      if (pickup.life > 0) {
        survivors.push(pickup);
      }
    }
    this.pickups = survivors;
  }

  #collectLoot(item) {
    if (item.type === 'medal' && item.goldValue) {
      const amount = Math.round(item.goldValue);
      this.gold += amount;
      this.ui.setGold(this.gold);
      this.ui.showToast(`+${amount} gold (medal traded)`);
      this.log.push('You trade the radiant medal for a pouch of gold.');
      return;
    }

    if (item.consumedOnPickup) {
      if (item.heal) {
        const healed = Math.round(
          Math.max(0, Math.min(item.heal, this.player.maxHealth - this.player.health))
        );
        this.player.health = clamp(this.player.health + item.heal, 0, this.player.maxHealth);
        this.ui.setHealth(this.player.health, this.player.maxHealth);
        if (healed > 0) {
          this.ui.showToast(`Restored ${healed} health`);
        }
      }
      return;
    }

    const stackable = item.stackable ?? false;
    if (stackable) {
      const existing = this.inventory.find((entry) => entry.id === item.id);
      if (existing) {
        existing.quantity = (existing.quantity ?? 1) + 1;
        this.ui.showToast(`+1 ${item.name}`);
        this.log.push(`You gather more ${item.name.toLowerCase()}.`);
        this.#refreshInventoryUI();
        this.#syncHotbar();
        return;
      }
    } else {
      const duplicate = this.inventory.some((entry) => entry.id === item.id);
      if (duplicate) {
        const stipend = item.goldValue ?? randInt(18, 32);
        this.gold += stipend;
        this.ui.setGold(this.gold);
        this.ui.showToast(`Duplicate ${item.name} traded for ${stipend} gold`);
        this.log.push(`You exchange a spare ${item.name} for supplies.`);
        return;
      }
    }

    this.inventory.push(item);
    this.ui.showToast(`${item.name} added to your satchel.`);
    this.log.push(`You collect ${item.name.toLowerCase()}.`);
    this.#refreshInventoryUI();
    this.#syncHotbar();
  }

  #checkLevelUp() {
    let leveled = false;
    while (this.player.experience >= this.player.experienceToLevel) {
      this.player.experience -= this.player.experienceToLevel;
      this.player.level += 1;
      this.player.experienceToLevel = Math.round(
        this.player.experienceToLevel + LEVEL_XP_GROWTH
      );
      this.availableSkillPoints += 1;
      leveled = true;
      if (this.player.onLevelUpRegen) {
        this.player.health = clamp(
          this.player.health + this.player.onLevelUpRegen,
          0,
          this.player.maxHealth
        );
      }
      this.ui.showToast(`Level ${this.player.level}! Skill spark earned.`);
      this.log.push('A new spark flares within you.');
    }

    if (leveled) {
      this.#refreshSkillTreeUI();
    }

    this.ui.setSkillPoints(this.availableSkillPoints);
    this.ui.setExperience(
      this.player.level,
      this.player.experience,
      this.player.experienceToLevel
    );
    this.ui.setHealth(this.player.health, this.player.maxHealth);
  }

  #onEnemyDefeated(enemy) {
    this.stats.enemiesDefeated += 1;
    if (enemy.boss) {
      this.log.push('The guardian shatters into drifting light.');
      this.ui.showToast('Boss defeated!');
      this.#advanceStory('boss-victory');
      if (enemy.dungeon?.boss) {
        enemy.dungeon.boss.spawned = false;
        enemy.dungeon.boss.defeated = true;
      }
    } else {
      this.log.push('A hostile shade dissolves into sparks.');
    }
    const xpValue = (enemy.boss ? 40 : 12) + Math.round(Math.random() * (enemy.boss ? 20 : 6));
    this.pickups.push({
      kind: 'xp',
      x: enemy.x,
      y: enemy.y,
      vx: randRange(-0.2, 0.2),
      vy: randRange(-0.2, 0.2),
      value: xpValue,
      life: 14,
    });
    if (enemy.boss) {
      this.pickups.push({
        kind: 'xp',
        x: enemy.x + randRange(-0.5, 0.5),
        y: enemy.y + randRange(-0.5, 0.5),
        vx: randRange(-0.2, 0.2),
        vy: randRange(-0.2, 0.2),
        value: xpValue / 2,
        life: 14,
      });
    }

    const goldRange = enemy.boss ? GOLD_RANGES.boss : GOLD_RANGES.mob;
    this.#dropGold(enemy.x, enemy.y, randomGold(goldRange), enemy.boss ? 0.55 : 0.4);

    if (enemy.boss) {
      this.#spawnLootItem('moondrop-elixir', enemy.x, enemy.y, 0.45, 24);
      for (let i = 0; i < 2; i += 1) {
        this.#spawnLootItem(pick(BOSS_LOOT_TABLE), enemy.x, enemy.y, 0.55, 26);
      }
    } else {
      if (Math.random() < 0.45) {
        this.#spawnLootItem(pick(RESOURCE_DROPS), enemy.x, enemy.y);
      }
      if (Math.random() < 0.3) {
        this.#spawnLootItem('sun-elixir', enemy.x, enemy.y, 0.35, 18);
      }
    }
    this.particles.spawn({ x: enemy.x, y: enemy.y }, {
      color: '#fbbf24',
      radius: 0.3,
      life: 0.6,
    });
  }

  #damagePlayer(amount) {
    if (amount <= 0) return;
    if (this.player.shield?.active) {
      this.player.shield.active = false;
      this.player.shield.timer = 0;
      this.log.push('Your aurora shell absorbs the impact.');
      this.ui.showToast('Shield absorbed a hit');
      return;
    }
    this.player.health = clamp(this.player.health - amount, 0, this.player.maxHealth);
    this.stats.damageTaken += amount;
    this.ui.setHealth(this.player.health, this.player.maxHealth);
    this.particles.spawn({ x: this.player.x, y: this.player.y }, {
      color: '#f87171',
      radius: 0.25,
      life: 0.6,
    });
    if (this.player.health <= 0) {
      this.log.push('You rest as the valley reknits itself. Press Restart to try again.');
      this.state = 'menu';
      this.ui.showMenu(true);
    }
  }

  #spawnEnemyWave() {
    if (!this.currentDungeon) return;
    if (this.enemies.length > 18) return;
    const spawnCount = (this.currentDungeon.boss.spawned ? 2 : 3) + randInt(0, 1);
    for (let i = 0; i < spawnCount; i += 1) {
      const source = pick(this.currentDungeon.spawnPoints);
      const enemy = {
        x: source.x + randRange(-1.5, 1.5),
        y: source.y + randRange(-1.5, 1.5),
        health: ENEMY_BASE_HEALTH * randRange(0.9, 1.3),
        color: pick(ENEMY_PALETTE),
        fireTimer: randRange(0.4, ENEMY_FIRE_INTERVAL),
        boss: false,
        dungeon: this.currentDungeon,
      };
      if (this.world.isWalkable(enemy.x, enemy.y)) {
        this.enemies.push(enemy);
      }
    }
    this.log.push(`Shadows gather within ${this.currentDungeon.name}.`);
  }

  #checkAchievements() {
    const unlocked = [];
    for (const achievement of ACHIEVEMENT_LIBRARY) {
      if (this.achievements.has(achievement.id)) continue;
      if (achievement.check(this.stats)) {
        this.achievements.add(achievement.id);
        unlocked.push(achievement);
        this.log.push(`Achievement unlocked: ${achievement.label}`);
        this.ui.showToast(`Achievement: ${achievement.label}`);
      }
    }
    if (unlocked.length > 0) {
      const list = [...this.achievements]
        .map((id) => ACHIEVEMENT_LIBRARY.find((item) => item.id === id))
        .filter(Boolean);
      this.ui.setAchievements(list);
    }
  }

  #render() {
    const ctx = this.context;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.#drawSky(ctx);
    if (!this.world) {
      this.#drawAtmosphere(ctx);
      return;
    }
    const view = this.#getCameraView();
    ctx.save();
    ctx.translate(-view.offsetX * TILE_SIZE, -view.offsetY * TILE_SIZE);
    this.#drawWorld(ctx, view);
    this.#drawDecorations(ctx, view);
    this.#drawChests(ctx, view);
    this.#drawNpcs(ctx, view);
    this.#drawSigns(ctx, view);
    this.#drawPlayer(ctx, view);
    this.#drawEnemies(ctx, view);
    this.#drawProjectiles(ctx, view);
    this.#drawPickups(ctx, view);
    if (this.slowFields) {
      for (const field of this.slowFields) {
        this.#drawSlowField(ctx, field, view);
      }
    }
    this.particles.draw(ctx, view);
    ctx.restore();
    this.#drawAtmosphere(ctx, view);
  }

  #getCameraView() {
    const viewWidth = Math.ceil(this.canvas.width / TILE_SIZE);
    const viewHeight = Math.ceil(this.canvas.height / TILE_SIZE);
    const offsetX = this.camera.x - viewWidth / 2;
    const offsetY = this.camera.y - viewHeight / 2;
    return {
      viewWidth,
      viewHeight,
      offsetX,
      offsetY,
    };
  }

  #drawSky(ctx) {
    const t = (this.timeOfDay % DAY_NIGHT_DURATION) / DAY_NIGHT_DURATION;
    const light = this.#getLightLevel();
    const top = mixColor('#020617', '#0ea5e9', light);
    const mid = mixColor('#111827', '#38bdf8', light);
    const horizon = mixColor('#1f2937', '#fcd34d', Math.pow(light, 0.6));
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, top);
    gradient.addColorStop(0.45, mid);
    gradient.addColorStop(1, horizon);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (light < 0.55) {
      ctx.save();
      ctx.globalAlpha = clamp((0.55 - light) * 1.6, 0, 0.85);
      ctx.fillStyle = '#f8fafc';
      for (const star of this.stars) {
        const twinkle = (Math.sin((t + star.phase) * Math.PI * 2) + 1) / 2;
        const alpha = clamp(0.35 + twinkle * 0.65, 0, 1);
        ctx.globalAlpha = alpha * clamp((0.55 - light) * 1.2, 0, 1);
        const x = star.x * this.canvas.width;
        const y = star.y * this.canvas.height * 0.6;
        ctx.fillRect(x, y, 2, 2);
      }
      ctx.restore();
    }
  }

  #drawAtmosphere(ctx, view) {
    const light = this.#getLightLevel();
    if (light < 0.6) {
      ctx.fillStyle = `rgba(15, 23, 42, ${0.25 * (0.6 - light)})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    const glow = ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.min(this.canvas.width, this.canvas.height) * 0.1,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) * 0.75
    );
    glow.addColorStop(0, `rgba(251, 191, 36, ${0.05 + light * 0.08})`);
    glow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  #updateCamera(dt) {
    const smoothing = 1 - Math.exp(-dt * 6);
    this.camera.x = lerp(this.camera.x, this.player.x, smoothing);
    this.camera.y = lerp(this.camera.y, this.player.y, smoothing);
  }

  #getLightLevel() {
    const t = (this.timeOfDay % DAY_NIGHT_DURATION) / DAY_NIGHT_DURATION;
    return (Math.sin(t * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  }

  #describeTimeOfDay() {
    const t = (this.timeOfDay % DAY_NIGHT_DURATION) / DAY_NIGHT_DURATION;
    if (t < 0.18 || t >= 0.92) return 'Starlit Night';
    if (t < 0.3) return 'Aurora Dawn';
    if (t < 0.52) return 'Golden Noon';
    if (t < 0.7) return 'Amber Afternoon';
    if (t < 0.85) return 'Rose Dusk';
    return 'Violet Evening';
  }

  #drawWorld(ctx, view) {
    const shimmer = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
    const light = this.#getLightLevel();
    const startX = Math.max(0, Math.floor(view.offsetX) - 2);
    const endX = Math.min(this.world.width - 1, Math.ceil(view.offsetX + view.viewWidth) + 2);
    const startY = Math.max(0, Math.floor(view.offsetY) - 2);
    const endY = Math.min(this.world.height - 1, Math.ceil(view.offsetY + view.viewHeight) + 2);

    for (let y = startY; y <= endY; y += 1) {
      for (let x = startX; x <= endX; x += 1) {
        const tile = this.world.getTile(x, y);
        const info = TILE_TYPES[tile.type];
        const color = info?.variants?.[tile.variant] ?? info?.color ?? '#000';
        const screenX = x * TILE_SIZE;
        const screenY = y * TILE_SIZE;
        ctx.fillStyle = color;
        ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);

        if (tile.type === 'water') {
          const wave = Math.sin(shimmer * 1.4 + x * 0.7 + y * 0.4);
          const highlight = clamp((wave + 1) / 2, 0, 1);
          const gradient = ctx.createLinearGradient(
            screenX,
            screenY,
            screenX,
            screenY + TILE_SIZE
          );
          gradient.addColorStop(0, `rgba(59, 130, 246, ${0.25 + highlight * 0.2})`);
          gradient.addColorStop(1, `rgba(14, 165, 233, ${0.18 + highlight * 0.15})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
        } else if (tile.type === 'sanctuary') {
          ctx.fillStyle = 'rgba(96, 165, 250, 0.18)';
          ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
        } else if (tile.type === 'farmland') {
          ctx.save();
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.38)';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(screenX + 2, screenY + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.restore();
        }

        const distance = Math.hypot(x - this.player.x, y - this.player.y);
        const glow = clamp(1 - distance / 24, 0, 1) * (0.14 + light * 0.08);
        if (glow > 0) {
          ctx.fillStyle = `rgba(248, 250, 252, ${glow})`;
          ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
        }

        const duskShade = clamp(0.45 - light * 0.35, 0, 0.45);
        if (duskShade > 0) {
          ctx.fillStyle = `rgba(15, 23, 42, ${duskShade})`;
          ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
        } else if (light > 0.6) {
          const sunKiss = (light - 0.6) * 0.18;
          if (sunKiss > 0) {
            ctx.fillStyle = `rgba(253, 224, 71, ${sunKiss})`;
            ctx.fillRect(screenX, screenY, TILE_SIZE + 1, TILE_SIZE + 1);
          }
        }
      }
    }
  }

  #drawDecorations(ctx, view) {
    for (const deco of this.world.decorations) {
      if (
        deco.x < view.offsetX - 2 ||
        deco.x > view.offsetX + view.viewWidth + 2 ||
        deco.y < view.offsetY - 2 ||
        deco.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = deco.x * TILE_SIZE;
      const screenY = deco.y * TILE_SIZE;
      if (deco.type === 'tree') {
        ctx.fillStyle = SCENERY_COLORS.treeTrunk;
        ctx.fillRect(screenX + TILE_SIZE * 0.45, screenY + TILE_SIZE * 0.52, TILE_SIZE * 0.1, TILE_SIZE * 0.48);
        const leafGradient = ctx.createRadialGradient(
          screenX + TILE_SIZE / 2,
          screenY + TILE_SIZE * 0.36,
          TILE_SIZE * 0.05,
          screenX + TILE_SIZE / 2,
          screenY + TILE_SIZE * 0.36,
          TILE_SIZE * 0.48
        );
        const leafColor = deco.color ?? SCENERY_COLORS.treeLeaves[0];
        leafGradient.addColorStop(0, 'rgba(248, 250, 252, 0.16)');
        leafGradient.addColorStop(1, leafColor);
        ctx.fillStyle = leafGradient;
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE * 0.36, TILE_SIZE * 0.48, 0, Math.PI * 2);
        ctx.fill();
      } else if (deco.type === 'blossom') {
        ctx.fillStyle = deco.color ?? SCENERY_COLORS.blossom;
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE / 2, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else if (deco.type === 'rock') {
        ctx.fillStyle = deco.color ?? '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(
          screenX + TILE_SIZE / 2,
          screenY + TILE_SIZE * 0.7,
          TILE_SIZE * 0.36,
          TILE_SIZE * 0.26,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (deco.type === 'house-frame') {
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.45)';
        ctx.lineWidth = 2.2;
        ctx.strokeRect(screenX + TILE_SIZE * 0.15, screenY + TILE_SIZE * 0.35, TILE_SIZE * 0.7, TILE_SIZE * 0.58);
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.25)';
        ctx.beginPath();
        ctx.moveTo(screenX + TILE_SIZE * 0.15, screenY + TILE_SIZE * 0.35);
        ctx.lineTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.1);
        ctx.lineTo(screenX + TILE_SIZE * 0.85, screenY + TILE_SIZE * 0.35);
        ctx.stroke();
      } else if (deco.type === 'market') {
        ctx.fillStyle = SCENERY_COLORS.marketStall;
        ctx.fillRect(screenX + TILE_SIZE * 0.15, screenY + TILE_SIZE * 0.42, TILE_SIZE * 0.7, TILE_SIZE * 0.38);
        const stripes = [0, 0.33, 0.66];
        ctx.fillStyle = 'rgba(15, 118, 110, 0.65)';
        for (const stripe of stripes) {
          ctx.fillRect(
            screenX + TILE_SIZE * (0.15 + stripe * 0.7),
            screenY + TILE_SIZE * 0.3,
            TILE_SIZE * 0.23,
            TILE_SIZE * 0.14
          );
        }
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(screenX + TILE_SIZE * 0.2, screenY + TILE_SIZE * 0.57, TILE_SIZE * 0.12, TILE_SIZE * 0.28);
        ctx.fillRect(screenX + TILE_SIZE * 0.68, screenY + TILE_SIZE * 0.57, TILE_SIZE * 0.12, TILE_SIZE * 0.28);
      } else if (deco.type === 'house') {
        ctx.fillStyle = SCENERY_COLORS.houseWall;
        ctx.fillRect(screenX + TILE_SIZE * 0.1, screenY + TILE_SIZE * 0.3, TILE_SIZE * 0.8, TILE_SIZE * 0.62);
        const roofGradient = ctx.createLinearGradient(
          screenX + TILE_SIZE * 0.05,
          screenY + TILE_SIZE * 0.1,
          screenX + TILE_SIZE * 0.95,
          screenY + TILE_SIZE * 0.35
        );
        roofGradient.addColorStop(0, '#d8b4fe');
        roofGradient.addColorStop(1, SCENERY_COLORS.houseRoof);
        ctx.fillStyle = roofGradient;
        ctx.beginPath();
        ctx.moveTo(screenX + TILE_SIZE * 0.05, screenY + TILE_SIZE * 0.35);
        ctx.lineTo(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.05);
        ctx.lineTo(screenX + TILE_SIZE * 0.95, screenY + TILE_SIZE * 0.35);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(screenX + TILE_SIZE * 0.4, screenY + TILE_SIZE * 0.55, TILE_SIZE * 0.2, TILE_SIZE * 0.35);
        ctx.fillStyle = 'rgba(252, 211, 77, 0.88)';
        ctx.fillRect(screenX + TILE_SIZE * 0.22, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.16, TILE_SIZE * 0.16);
        ctx.fillRect(screenX + TILE_SIZE * 0.62, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.16, TILE_SIZE * 0.16);
      } else if (deco.type === 'crop') {
        ctx.fillStyle = SCENERY_COLORS.farmCrop;
        ctx.beginPath();
        ctx.ellipse(
          screenX + TILE_SIZE * 0.5,
          screenY + TILE_SIZE * 0.7,
          TILE_SIZE * 0.25,
          TILE_SIZE * 0.18,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (deco.type === 'campfire') {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.5)';
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.5, TILE_SIZE * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(screenX + TILE_SIZE * 0.5, screenY + TILE_SIZE * 0.55, TILE_SIZE * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const lamp of this.world.lamps) {
      if (
        lamp.x < view.offsetX - 2 ||
        lamp.x > view.offsetX + view.viewWidth + 2 ||
        lamp.y < view.offsetY - 2 ||
        lamp.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = lamp.x * TILE_SIZE;
      const screenY = lamp.y * TILE_SIZE;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.beginPath();
      ctx.arc(screenX, screenY, TILE_SIZE * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = SCENERY_COLORS.lampPost;
      ctx.beginPath();
      ctx.arc(screenX, screenY, TILE_SIZE * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  #drawChests(ctx, view) {
    for (const chest of this.world.chests) {
      if (
        chest.x < view.offsetX - 2 ||
        chest.x > view.offsetX + view.viewWidth + 2 ||
        chest.y < view.offsetY - 2 ||
        chest.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = chest.x * TILE_SIZE;
      const screenY = chest.y * TILE_SIZE;
      if (!chest.opened) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.arc(screenX, screenY, TILE_SIZE * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.save();
      ctx.translate(screenX, screenY);
      const bodyColor = chest.opened ? 'rgba(148, 163, 184, 0.45)' : '#f59e0b';
      ctx.fillStyle = bodyColor;
      ctx.fillRect(-TILE_SIZE * 0.24, -TILE_SIZE * 0.05, TILE_SIZE * 0.48, TILE_SIZE * 0.3);
      ctx.fillRect(-TILE_SIZE * 0.2, -TILE_SIZE * 0.22, TILE_SIZE * 0.4, TILE_SIZE * 0.18);
      if (!chest.opened) {
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-TILE_SIZE * 0.24, -TILE_SIZE * 0.05, TILE_SIZE * 0.48, TILE_SIZE * 0.06);
        ctx.fillStyle = '#fcd34d';
        ctx.fillRect(-TILE_SIZE * 0.02, -TILE_SIZE * 0.05, TILE_SIZE * 0.04, TILE_SIZE * 0.16);
      } else {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.fillRect(-TILE_SIZE * 0.2, -TILE_SIZE * 0.22, TILE_SIZE * 0.4, TILE_SIZE * 0.06);
      }
      ctx.restore();
    }
  }

  #drawNpcs(ctx, view) {
    for (const npc of this.world.npcs) {
      if (
        npc.x < view.offsetX - 2 ||
        npc.x > view.offsetX + view.viewWidth + 2 ||
        npc.y < view.offsetY - 2 ||
        npc.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = npc.x * TILE_SIZE;
      const screenY = npc.y * TILE_SIZE;
      ctx.fillStyle = npc.color ?? '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(screenX, screenY, TILE_SIZE * 0.24, TILE_SIZE * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(screenX, screenY - TILE_SIZE * 0.18, TILE_SIZE * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  #drawSigns(ctx, view) {
    ctx.fillStyle = '#f8fafc';
    ctx.font = `${Math.floor(TILE_SIZE * 0.35)}px 'Trebuchet MS', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    for (const sign of this.world.signs) {
      if (
        sign.x < view.offsetX - 2 ||
        sign.x > view.offsetX + view.viewWidth + 2 ||
        sign.y < view.offsetY - 2 ||
        sign.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = sign.x * TILE_SIZE;
      const screenY = sign.y * TILE_SIZE;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(
        screenX - TILE_SIZE * 0.3,
        screenY - TILE_SIZE * 0.9,
        TILE_SIZE * 0.6,
        TILE_SIZE * 0.4
      );
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(
        screenX - TILE_SIZE * 0.04,
        screenY - TILE_SIZE * 0.5,
        TILE_SIZE * 0.08,
        TILE_SIZE * 0.5
      );
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(sign.text, screenX, screenY - TILE_SIZE * 0.95);
    }
  }

  #drawPlayer(ctx, view) {
    const screenX = this.player.x * TILE_SIZE;
    const screenY = this.player.y * TILE_SIZE;
    const light = this.#getLightLevel();

    ctx.save();
    ctx.translate(screenX, screenY);
    const gradient = ctx.createRadialGradient(0, 0, TILE_SIZE * 0.08, 0, 0, TILE_SIZE * 0.46);
    gradient.addColorStop(0, '#fefce8');
    gradient.addColorStop(0.55, '#fde68a');
    gradient.addColorStop(1, mixColor('#f59e0b', '#fbbf24', light));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, TILE_SIZE * 0.38, 0, Math.PI * 2);
    ctx.fill();

    const velocityGlow = clamp(Math.hypot(this.player.vx, this.player.vy) / (PLAYER_SPRINT_SPEED * 1.2), 0, 1);
    if (velocityGlow > 0) {
      ctx.fillStyle = `rgba(252, 211, 77, ${0.18 + 0.25 * velocityGlow})`;
      ctx.beginPath();
      ctx.ellipse(
        -this.player.vx * TILE_SIZE * 0.08,
        -this.player.vy * TILE_SIZE * 0.08,
        TILE_SIZE * 0.48,
        TILE_SIZE * 0.3,
        Math.atan2(this.player.vy, this.player.vx),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, -TILE_SIZE * 0.14, TILE_SIZE * 0.08, 0, Math.PI * 2);
    ctx.fill();

    if (this.player.shield?.active) {
      ctx.strokeStyle = 'rgba(190, 242, 100, 0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, TILE_SIZE * 0.48, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  #drawEnemies(ctx, view) {
    ctx.lineWidth = 2;
    for (const enemy of this.enemies) {
      if (
        enemy.x < view.offsetX - 3 ||
        enemy.x > view.offsetX + view.viewWidth + 3 ||
        enemy.y < view.offsetY - 3 ||
        enemy.y > view.offsetY + view.viewHeight + 3
      ) {
        continue;
      }
      const screenX = enemy.x * TILE_SIZE;
      const screenY = enemy.y * TILE_SIZE;
      const isBoss = enemy.boss === true;
      const radius = TILE_SIZE * (isBoss ? 0.45 : 0.32);
      if (isBoss) {
        const aura = ctx.createRadialGradient(screenX, screenY, TILE_SIZE * 0.2, screenX, screenY, TILE_SIZE * 0.75);
        aura.addColorStop(0, 'rgba(88, 28, 135, 0.35)');
        aura.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(screenX, screenY, TILE_SIZE * 0.72, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isBoss ? 'rgba(250, 204, 21, 0.55)' : 'rgba(248, 250, 252, 0.35)';
      ctx.lineWidth = isBoss ? 3 : 2;
      ctx.beginPath();
      ctx.arc(screenX, screenY, radius + TILE_SIZE * 0.04, 0, Math.PI * 2);
      ctx.stroke();

      const maxHealth = isBoss ? BOSS_HEALTH : ENEMY_BASE_HEALTH;
      const ratio = clamp(enemy.health / maxHealth, 0, 1);
      const barWidth = TILE_SIZE * (isBoss ? 0.9 : 0.6);
      const barHeight = TILE_SIZE * 0.12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fillRect(screenX - barWidth / 2, screenY - TILE_SIZE * 0.55, barWidth, barHeight);
      ctx.fillStyle = isBoss ? 'rgba(250, 204, 21, 0.9)' : 'rgba(251, 191, 36, 0.8)';
      ctx.fillRect(screenX - barWidth / 2, screenY - TILE_SIZE * 0.55, barWidth * ratio, barHeight);
    }
  }

  #drawProjectiles(ctx, view) {
    for (const projectile of this.projectiles) {
      if (
        projectile.x < view.offsetX - 2 ||
        projectile.x > view.offsetX + view.viewWidth + 2 ||
        projectile.y < view.offsetY - 2 ||
        projectile.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = projectile.x * TILE_SIZE;
      const screenY = projectile.y * TILE_SIZE;
      ctx.fillStyle = BULLET_COLOR;
      ctx.beginPath();
      ctx.arc(screenX, screenY, TILE_SIZE * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const projectile of this.enemyProjectiles) {
      if (
        projectile.x < view.offsetX - 2 ||
        projectile.x > view.offsetX + view.viewWidth + 2 ||
        projectile.y < view.offsetY - 2 ||
        projectile.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = projectile.x * TILE_SIZE;
      const screenY = projectile.y * TILE_SIZE;
      ctx.fillStyle = ENEMY_BULLET_COLOR;
      ctx.beginPath();
      ctx.arc(screenX, screenY, TILE_SIZE * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  #drawPickups(ctx, view) {
    for (const pickup of this.pickups) {
      if (
        pickup.x < view.offsetX - 2 ||
        pickup.x > view.offsetX + view.viewWidth + 2 ||
        pickup.y < view.offsetY - 2 ||
        pickup.y > view.offsetY + view.viewHeight + 2
      ) {
        continue;
      }
      const screenX = pickup.x * TILE_SIZE;
      const screenY = pickup.y * TILE_SIZE;
      if (pickup.kind === 'gold') {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.9)';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - TILE_SIZE * 0.2);
        ctx.lineTo(screenX + TILE_SIZE * 0.2, screenY);
        ctx.lineTo(screenX, screenY + TILE_SIZE * 0.2);
        ctx.lineTo(screenX - TILE_SIZE * 0.2, screenY);
        ctx.closePath();
        ctx.fill();
        continue;
      }
      ctx.beginPath();
      if (pickup.kind === 'loot') {
        ctx.fillStyle = 'rgba(129, 140, 248, 0.85)';
      } else {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      }
      ctx.arc(screenX, screenY, TILE_SIZE * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  #drawSlowField(ctx, field, view) {
    if (
      field.x < view.offsetX - 3 ||
      field.x > view.offsetX + view.viewWidth + 3 ||
      field.y < view.offsetY - 3 ||
      field.y > view.offsetY + view.viewHeight + 3
    ) {
      return;
    }
    const screenX = field.x * TILE_SIZE;
    const screenY = field.y * TILE_SIZE;
    const alpha = clamp(1 - field.age / field.duration, 0, 1) * 0.4;
    ctx.fillStyle = `rgba(96, 165, 250, ${alpha})`;
    ctx.beginPath();
    ctx.arc(screenX, screenY, field.radius * TILE_SIZE, 0, Math.PI * 2);
    ctx.fill();
  }

  #isInSlowField(x, y) {
    if (!this.slowFields) return false;
    return this.slowFields.some((field) => Math.hypot(field.x - x, field.y - y) < field.radius);
  }
}
