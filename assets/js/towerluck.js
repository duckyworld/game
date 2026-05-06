const towerCanvas = document.querySelector("[data-tower-canvas]");

if (towerCanvas) {
  const ctx = towerCanvas.getContext("2d");

  const statusTarget = document.querySelector("[data-tower-status]");
  const waveTarget = document.querySelector("[data-tower-wave]");
  const moneyTarget = document.querySelector("[data-tower-money]");
  const rollsTarget = document.querySelector("[data-tower-rolls]");
  const livesTarget = document.querySelector("[data-tower-lives]");
  const playerTarget = document.querySelector("[data-tower-player]");
  const rollNameTarget = document.querySelector("[data-tower-roll-name]");
  const rollCopyTarget = document.querySelector("[data-tower-roll-copy]");
  const rollMetaTarget = document.querySelector("[data-tower-roll-meta]");
  const selectedNameTarget = document.querySelector("[data-tower-selected-name]");
  const selectedCopyTarget = document.querySelector("[data-tower-selected-copy]");
  const upgradeCostTarget = document.querySelector("[data-tower-upgrade-cost]");
  const sellValueTarget = document.querySelector("[data-tower-sell-value]");
  const logTarget = document.querySelector("[data-tower-log]");

  const rollButton = document.querySelector("[data-tower-roll]");
  const rollBarrierButton = document.querySelector("[data-tower-roll-barrier]");
  const startButton = document.querySelector("[data-tower-start]");
  const autoButton = document.querySelector("[data-tower-auto]");
  const pauseButton = document.querySelector("[data-tower-pause]");
  const speedButton = document.querySelector("[data-tower-speed]");
  const sellButton = document.querySelector("[data-tower-sell]");
  const upgradeButton = document.querySelector("[data-tower-upgrade]");
  const resetButton = document.querySelector("[data-tower-reset]");

  const PATH_POINTS = [
    { x: 0, y: 270 },
    { x: 140, y: 270 },
    { x: 140, y: 130 },
    { x: 360, y: 130 },
    { x: 360, y: 410 },
    { x: 620, y: 410 },
    { x: 620, y: 180 },
    { x: 820, y: 180 },
    { x: 820, y: 300 },
    { x: 960, y: 300 }
  ];

  const BUILD_SLOTS = [
    { x: 92, y: 180 },
    { x: 92, y: 362 },
    { x: 252, y: 78 },
    { x: 252, y: 240 },
    { x: 252, y: 462 },
    { x: 480, y: 82 },
    { x: 480, y: 252 },
    { x: 480, y: 492 },
    { x: 720, y: 96 },
    { x: 720, y: 328 },
    { x: 884, y: 96 },
    { x: 884, y: 396 }
  ];

  const BARRIER_SLOTS = [
    { x: 44, y: 270, distance: 44 },
    { x: 140, y: 198, distance: 212 },
    { x: 250, y: 130, distance: 320 },
    { x: 360, y: 266, distance: 546 },
    { x: 484, y: 410, distance: 794 },
    { x: 620, y: 302, distance: 1032 },
    { x: 720, y: 180, distance: 1222 },
    { x: 820, y: 244, distance: 1346 }
  ];

  const TOWER_POOL = [
    {
      id: "chip-shooter",
      name: "Chip Shooter",
      rarity: "Common",
      description: "Fast low-stakes fire that keeps the lane honest.",
      color: "#d7dde7",
      cost: 45,
      damage: 14,
      range: 128,
      fireRate: 0.7,
      projectileSpeed: 260
    },
    {
      id: "dice-spitter",
      name: "Dice Spitter",
      rarity: "Common",
      description: "Reliable gambling kiosk that peppers whatever walks in.",
      color: "#d7dde7",
      cost: 55,
      damage: 11,
      range: 152,
      fireRate: 0.48,
      projectileSpeed: 320
    },
    {
      id: "scrap-arc",
      name: "Scrap Arc",
      rarity: "Common",
      description: "Cheap arc booth that pokes the lane with steady electric shots.",
      color: "#d7dde7",
      cost: 52,
      damage: 12,
      range: 140,
      fireRate: 0.58,
      projectileSpeed: 290
    },
    {
      id: "pawn-lamp",
      name: "Pawn Lamp",
      rarity: "Common",
      description: "Budget lamp tower with a simple but reliable tracking beam.",
      color: "#d7dde7",
      cost: 50,
      damage: 10,
      range: 160,
      fireRate: 0.5,
      projectileSpeed: 335
    },
    {
      id: "green-room",
      name: "Green Room",
      rarity: "Uncommon",
      description: "Quick-entry booth that fires faster once the lane gets crowded.",
      color: "#72ffa9",
      cost: 62,
      damage: 15,
      range: 150,
      fireRate: 0.56,
      projectileSpeed: 325
    },
    {
      id: "token-cycler",
      name: "Token Cycler",
      rarity: "Uncommon",
      description: "Clean midrange tower that converts loose chips into stable fire.",
      color: "#72ffa9",
      cost: 68,
      damage: 17,
      range: 162,
      fireRate: 0.64,
      projectileSpeed: 340
    },
    {
      id: "backroom-blink",
      name: "Backroom Blink",
      rarity: "Uncommon",
      description: "A nimble emitter that swings between targets before they settle.",
      color: "#72ffa9",
      cost: 70,
      damage: 13,
      range: 174,
      fireRate: 0.45,
      projectileSpeed: 360
    },
    {
      id: "pit-boss",
      name: "Pit Boss",
      rarity: "Uncommon",
      description: "Tighter spread, steadier hits, and better lane pressure than the starter rack.",
      color: "#72ffa9",
      cost: 72,
      damage: 18,
      range: 156,
      fireRate: 0.62,
      projectileSpeed: 330
    },
    {
      id: "neon-lancer",
      name: "Neon Lancer",
      rarity: "Rare",
      description: "Longer reach and stronger burst for cleaner picks.",
      color: "#55e4ff",
      cost: 78,
      damage: 26,
      range: 178,
      fireRate: 0.82,
      projectileSpeed: 360
    },
    {
      id: "magnet-grid",
      name: "Magnet Grid",
      rarity: "Rare",
      description: "Slows runners while it shocks them with static arcs.",
      color: "#55e4ff",
      cost: 84,
      damage: 18,
      range: 170,
      fireRate: 0.7,
      projectileSpeed: 300,
      slow: 0.72
    },
    {
      id: "prism-wheel",
      name: "Prism Wheel",
      rarity: "Rare",
      description: "Spins up bright line shots with better range than most mid-tier pulls.",
      color: "#55e4ff",
      cost: 88,
      damage: 24,
      range: 196,
      fireRate: 0.76,
      projectileSpeed: 390
    },
    {
      id: "coolant-bank",
      name: "Coolant Bank",
      rarity: "Rare",
      description: "A colder rig that trades raw burst for fast accurate lane control.",
      color: "#55e4ff",
      cost: 82,
      damage: 20,
      range: 182,
      fireRate: 0.58,
      projectileSpeed: 350
    },
    {
      id: "jackpot-mortar",
      name: "Jackpot Mortar",
      rarity: "Epic",
      description: "Slow shells that land like a lucky riot in the lane.",
      color: "#ff7bff",
      cost: 110,
      damage: 42,
      range: 210,
      fireRate: 1.35,
      projectileSpeed: 220,
      splash: 66
    },
    {
      id: "violet-maw",
      name: "Violet Maw",
      rarity: "Epic",
      description: "A hungry barrel that spits clustered damage into thick waves.",
      color: "#ff7bff",
      cost: 118,
      damage: 34,
      range: 202,
      fireRate: 0.76,
      projectileSpeed: 300,
      splash: 52
    },
    {
      id: "rift-roulette",
      name: "Rift Roulette",
      rarity: "Epic",
      description: "Hits harder than it should and thrives on lucky chain reactions.",
      color: "#ff7bff",
      cost: 124,
      damage: 38,
      range: 220,
      fireRate: 0.84,
      projectileSpeed: 380,
      pierce: 1
    },
    {
      id: "casino-fang",
      name: "Casino Fang",
      rarity: "Epic",
      description: "A surgical magenta turret with punchy boss damage and sharp follow-through.",
      color: "#ff7bff",
      cost: 120,
      damage: 40,
      range: 206,
      fireRate: 0.9,
      projectileSpeed: 400
    },
    {
      id: "vault-breaker",
      name: "Vault Breaker",
      rarity: "Legendary",
      description: "Heavy beam bursts that punch through stacked targets.",
      color: "#ffd166",
      cost: 145,
      damage: 68,
      range: 230,
      fireRate: 1.05,
      projectileSpeed: 420,
      pierce: 2
    },
    {
      id: "sunwire-array",
      name: "Sunwire Array",
      rarity: "Legendary",
      description: "Radiant long-lane hardware that cuts through backline pressure fast.",
      color: "#ffd166",
      cost: 152,
      damage: 58,
      range: 252,
      fireRate: 0.88,
      projectileSpeed: 460,
      pierce: 1
    },
    {
      id: "house-edge",
      name: "House Edge",
      rarity: "Legendary",
      description: "A gold control tower built to make every bad enemy trade worse.",
      color: "#ffd166",
      cost: 156,
      damage: 52,
      range: 236,
      fireRate: 0.68,
      projectileSpeed: 390,
      slow: 0.6
    },
    {
      id: "myth-grinder",
      name: "Myth Grinder",
      rarity: "Mythic",
      description: "Illegal shelling platform that turns crowded corners into dust.",
      color: "#ff5f87",
      cost: 174,
      damage: 78,
      range: 246,
      fireRate: 1.12,
      projectileSpeed: 260,
      splash: 82
    },
    {
      id: "rose-obliterator",
      name: "Rose Obliterator",
      rarity: "Mythic",
      description: "A pink-black sniper rig that rips huge chunks out of elite targets.",
      color: "#ff5f87",
      cost: 182,
      damage: 88,
      range: 274,
      fireRate: 1.04,
      projectileSpeed: 470
    },
    {
      id: "grave-jackpot",
      name: "Grave Jackpot",
      rarity: "Mythic",
      description: "Cursed gacha machinery with punishing pierce and ugly follow-up damage.",
      color: "#ff5f87",
      cost: 188,
      damage: 70,
      range: 260,
      fireRate: 0.82,
      projectileSpeed: 430,
      pierce: 2
    },
    {
      id: "eclipse-rack",
      name: "Eclipse Rack",
      rarity: "Exotic",
      description: "Forbidden rack that freezes lanes down while deleting the front line.",
      color: "#8a7dff",
      cost: 208,
      damage: 86,
      range: 270,
      fireRate: 0.74,
      projectileSpeed: 420,
      slow: 0.5
    },
    {
      id: "starrender-bank",
      name: "Starrender Bank",
      rarity: "Exotic",
      description: "A black-market rail engine with deep range and vicious lane piercing.",
      color: "#8a7dff",
      cost: 216,
      damage: 102,
      range: 298,
      fireRate: 0.98,
      projectileSpeed: 520,
      pierce: 3
    },
    {
      id: "seraph-desk",
      name: "Seraph Desk",
      rarity: "Divine",
      description: "Holy control station that floods the path with impossible golden pressure.",
      color: "#fff1a1",
      cost: 236,
      damage: 116,
      range: 304,
      fireRate: 0.84,
      projectileSpeed: 500,
      pierce: 2
    },
    {
      id: "halo-bloom",
      name: "Halo Bloom",
      rarity: "Divine",
      description: "Divine bloom cannon that turns every impact into a holy crowd wipe.",
      color: "#fff1a1",
      cost: 244,
      damage: 108,
      range: 286,
      fireRate: 1.04,
      projectileSpeed: 320,
      splash: 104
    },
    {
      id: "godsplit-array",
      name: "Godsplit Array",
      rarity: "Godlike",
      description: "Godlike line-breaker with brutal speed, range, and clean beam punishment.",
      color: "#fff7c7",
      cost: 268,
      damage: 144,
      range: 328,
      fireRate: 0.72,
      projectileSpeed: 560,
      pierce: 4
    },
    {
      id: "genesis-vault",
      name: "Genesis Vault",
      rarity: "Godlike",
      description: "An impossible tower core that melts bosses before they finish the turn.",
      color: "#fff7c7",
      cost: 280,
      damage: 158,
      range: 342,
      fireRate: 0.8,
      projectileSpeed: 580,
      splash: 72,
      pierce: 2
    },
    {
      id: "nathan-goat-post",
      name: "NATHAN GOAT POST",
      rarity: "Nathan",
      description: "One-in-ten-million tower pull. Ridiculous damage, speed, range, and floor control.",
      color: "#4b0082",
      cost: 360,
      damage: 280,
      range: 390,
      fireRate: 0.38,
      projectileSpeed: 720,
      splash: 132,
      pierce: 5,
      slow: 0.42
    }
  ];

  const RARITY_WEIGHTS = [
    { rarity: "Common", weight: 34 },
    { rarity: "Uncommon", weight: 23 },
    { rarity: "Rare", weight: 16 },
    { rarity: "Epic", weight: 11 },
    { rarity: "Legendary", weight: 7 },
    { rarity: "Mythic", weight: 4 },
    { rarity: "Exotic", weight: 1.8 },
    { rarity: "Divine", weight: 0.5 },
    { rarity: "Godlike", weight: 0.08 },
    { rarity: "Nathan", weight: 0.00001 }
  ];

  const BARRIER_POOL = [
    { id: "fungal-barricade", name: "Fungal Barricade", rarity: "Common", description: "Cheap mycelium wall that stalls the lane for a moment.", color: "#72ffa9", cost: 26, hp: 90, thorns: 0 },
    { id: "bone-fence", name: "Bone Fence", rarity: "Uncommon", description: "Tougher bone lattice with better lane delay.", color: "#8cffc2", cost: 32, hp: 132, thorns: 2 },
    { id: "glow-web", name: "Glow Web", rarity: "Rare", description: "Sticky barrier that slows enemies while it holds.", color: "#55e4ff", cost: 38, hp: 150, thorns: 3, slow: 0.72 },
    { id: "void-gate", name: "Void Gate", rarity: "Epic", description: "Dense occult seal with real stopping power.", color: "#ff7bff", cost: 48, hp: 220, thorns: 5 },
    { id: "amber-bulwark", name: "Amber Bulwark", rarity: "Legendary", description: "Gold-veined wall that bruises anything trying to break through.", color: "#ffd166", cost: 56, hp: 310, thorns: 8 },
    { id: "night-obelisk", name: "Night Obelisk", rarity: "Mythic", description: "Myth-tier lane blocker with ugly punishment on contact.", color: "#ff5f87", cost: 68, hp: 420, thorns: 10, slow: 0.6 },
    { id: "eclipse-spine", name: "Eclipse Spine", rarity: "Exotic", description: "Exotic spine wall that drags attackers down while it bleeds them.", color: "#8a7dff", cost: 78, hp: 520, thorns: 12, slow: 0.52 },
    { id: "seraph-bastion", name: "Seraph Bastion", rarity: "Divine", description: "Holy barricade that refuses to crack quickly.", color: "#fff1a1", cost: 92, hp: 650, thorns: 15, slow: 0.48 },
    { id: "godwall-engine", name: "Godwall Engine", rarity: "Godlike", description: "A near-unfair barricade that makes the lane kneel.", color: "#fff7c7", cost: 110, hp: 860, thorns: 18, slow: 0.42 },
    { id: "nathan-door", name: "NATHAN DOOR", rarity: "Nathan", description: "One-in-ten-million blockade. Horrifyingly durable and rude.", color: "#4b0082", cost: 150, hp: 1400, thorns: 28, slow: 0.34 }
  ];

  const nathanTowerBlueprint = TOWER_POOL.find((tower) => tower.rarity === "Nathan");
  const nathanBarrierBlueprint = BARRIER_POOL.find((barrier) => barrier.rarity === "Nathan");
  const adminCode = ["arrowup", "arrowup", "arrowup", "arrowdown", "arrowup", "arrowdown", "arrowleft"];
  const ADMIN_MAX_LEVEL = 5;

  const ENEMY_TYPES = {
    drifter: {
      name: "Drifter",
      color: "#ff7a90",
      hp: 54,
      speed: 58,
      reward: 10
    },
    runner: {
      name: "Runner",
      color: "#ffb703",
      hp: 34,
      speed: 88,
      reward: 9
    },
    brute: {
      name: "Brute",
      color: "#9f4dff",
      hp: 112,
      speed: 42,
      reward: 16
    }
  };

  const state = {
    wave: 0,
    money: 220,
    rolls: 5,
    lives: 20,
    activeWave: false,
    spawnTimer: 0,
    spawnQueue: [],
    currentRoll: null,
    selectedTowerId: null,
    placedTowers: [],
    placedBarriers: [],
    enemies: [],
    projectiles: [],
    particles: [],
    keys: {},
    enemyId: 0,
    towerId: 0,
    logLines: [],
    lastFrame: performance.now(),
    gameOver: false,
    adminCodeIndex: 0,
    adminMode: false,
    autoNextWave: false,
    autoWaveTimer: -1,
    paused: false,
    hiddenAt: null,
    speedMultiplier: 1,
    player: {
      x: 74,
      y: 458,
      radius: 12,
      speed: 220,
      hp: 100,
      maxHp: 100,
      damage: 24,
      range: 142,
      fireRate: 0.38,
      cooldown: 0,
      baseDamage: 24,
      baseFireRate: 0.38
    }
  };

  const pathMetrics = buildPathMetrics(PATH_POINTS);

  function buildPathMetrics(points) {
    const segments = [];
    let total = 0;

    for (let index = 0; index < points.length - 1; index += 1) {
      const start = points[index];
      const end = points[index + 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy);
      segments.push({ start, end, dx, dy, length, cumulative: total });
      total += length;
    }

    return { segments, total };
  }

  function getPointOnPath(distance) {
    const clamped = Math.max(0, Math.min(distance, pathMetrics.total));

    for (const segment of pathMetrics.segments) {
      if (clamped <= segment.cumulative + segment.length) {
        const ratio = (clamped - segment.cumulative) / segment.length;
        return {
          x: segment.start.x + segment.dx * ratio,
          y: segment.start.y + segment.dy * ratio
        };
      }
    }

    const lastPoint = PATH_POINTS[PATH_POINTS.length - 1];
    return { x: lastPoint.x, y: lastPoint.y };
  }

  function log(message) {
    state.logLines.unshift(message);
    state.logLines = state.logLines.slice(0, 8);
    logTarget.innerHTML = state.logLines.map((line) => `<p>&gt; ${line}</p>`).join("");
  }

  function setStatus(message) {
    statusTarget.textContent = message;
  }

  function getRandomTowerByRarity(rarity) {
    const options = TOWER_POOL.filter((tower) => tower.rarity === rarity);
    return options[Math.floor(Math.random() * options.length)];
  }

  function getRandomBarrierByRarity(rarity) {
    const options = BARRIER_POOL.filter((barrier) => barrier.rarity === rarity);
    return options[Math.floor(Math.random() * options.length)];
  }

  function rollRarity() {
    const totalWeight = RARITY_WEIGHTS.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const entry of RARITY_WEIGHTS) {
      roll -= entry.weight;
      if (roll <= 0) {
        return entry.rarity;
      }
    }

    return RARITY_WEIGHTS[RARITY_WEIGHTS.length - 1].rarity;
  }

  function updateHud() {
    waveTarget.textContent = String(state.wave);
    moneyTarget.textContent = String(state.money);
    rollsTarget.textContent = String(state.rolls);
    livesTarget.textContent = String(state.lives);
    playerTarget.textContent = String(Math.max(0, Math.round(state.player.hp)));

    if (state.currentRoll) {
      rollNameTarget.textContent = `${state.currentRoll.name} // ${state.currentRoll.rarity}`;
      rollCopyTarget.textContent = state.currentRoll.description;
      rollMetaTarget.textContent = `Rarity: ${state.currentRoll.rarity} // Cost: ${state.currentRoll.cost} chips`;
      rollNameTarget.className = `rarity-${state.currentRoll.rarity.toLowerCase()}`;
      rollMetaTarget.classList.toggle("is-unaffordable", state.money < state.currentRoll.cost);
    } else {
      rollNameTarget.textContent = "Empty rack";
      rollCopyTarget.textContent = "Spend a spin to pull your next tower card.";
      rollMetaTarget.textContent = "Rarity: none // Cost: --";
      rollNameTarget.className = "";
      rollMetaTarget.classList.remove("is-unaffordable");
    }

    const selectedTower = state.placedTowers.find((tower) => tower.id === state.selectedTowerId);

    if (selectedTower) {
      const baseTower = selectedTower.base;
      const upgradeCost = getUpgradeCost(selectedTower);
      const sellValue = Math.round(selectedTower.invested * 0.7);

      selectedNameTarget.textContent = `${baseTower.name} // L${selectedTower.level}`;
      selectedCopyTarget.textContent = `DMG ${Math.round(selectedTower.damage)} // RNG ${Math.round(selectedTower.range)} // SPD ${selectedTower.fireRate.toFixed(2)}s`;
      upgradeCostTarget.textContent = `${upgradeCost} chips`;
      sellValueTarget.textContent = `${sellValue} chips`;
    } else {
      const selectedBarrier = state.placedBarriers.find((barrier) => barrier.id === state.selectedTowerId);
      if (selectedBarrier) {
        const upgradeCost = getUpgradeCost(selectedBarrier);
        const sellValue = Math.round(selectedBarrier.invested * 0.7);
        selectedNameTarget.textContent = `${selectedBarrier.base.name} // L${selectedBarrier.level}`;
        selectedCopyTarget.textContent = `HP ${Math.round(selectedBarrier.hp)} // HOLD ${Math.round(selectedBarrier.maxHp)} // THORNS ${selectedBarrier.thorns}`;
        upgradeCostTarget.textContent = `${upgradeCost} chips`;
        sellValueTarget.textContent = `${sellValue} chips`;
      } else {
        selectedNameTarget.textContent = "No tower selected";
        selectedCopyTarget.textContent = "Click a placed tower or barrier to inspect it, upgrade it, or cash it out.";
        upgradeCostTarget.textContent = "--";
        sellValueTarget.textContent = "--";
      }
    }

    const canRoll = !state.gameOver && state.rolls > 0;
    rollButton.disabled = !canRoll;
    rollBarrierButton.disabled = !canRoll;
    startButton.disabled = state.gameOver || state.activeWave || state.spawnQueue.length > 0;
    upgradeButton.disabled = !selectedTower || state.gameOver;
    sellButton.disabled = !selectedTower || state.gameOver;
    autoButton.textContent = `Auto: ${state.autoNextWave ? "On" : "Off"}`;
    pauseButton.textContent = state.paused ? "Resume" : "Pause";
    if (speedButton) {
      speedButton.textContent = `Speed: ${state.speedMultiplier}x`;
    }
  }

  function getUpgradeCost(tower) {
    return Math.round(tower.base.cost * (0.8 + tower.level * 0.55));
  }

  function createTowerInstance(definition, slotIndex) {
    return {
      id: `tower-${state.towerId += 1}`,
      slotIndex,
      x: BUILD_SLOTS[slotIndex].x,
      y: BUILD_SLOTS[slotIndex].y,
      base: definition,
      level: 1,
      damage: definition.damage,
      range: definition.range,
      fireRate: definition.fireRate,
      cooldown: Math.random() * 0.35,
      projectileSpeed: definition.projectileSpeed,
      slow: definition.slow || null,
      splash: definition.splash || 0,
      pierce: definition.pierce || 0,
      invested: definition.cost,
      aimAngle: -Math.PI / 2
    };
  }

  function createBarrierInstance(definition, slotIndex) {
    return {
      id: `barrier-${state.towerId += 1}`,
      slotIndex,
      x: BARRIER_SLOTS[slotIndex].x,
      y: BARRIER_SLOTS[slotIndex].y,
      distance: BARRIER_SLOTS[slotIndex].distance,
      base: definition,
      level: 1,
      hp: definition.hp,
      maxHp: definition.hp,
      thorns: definition.thorns,
      slow: definition.slow || null,
      invested: definition.cost
    };
  }

  function createEnemy(typeKey, waveScale, offset) {
    const definition = ENEMY_TYPES[typeKey];
    return {
      id: `enemy-${state.enemyId += 1}`,
      typeKey,
      name: definition.name,
      color: definition.color,
      hp: definition.hp + waveScale * (typeKey === "brute" ? 24 : 12),
      maxHp: definition.hp + waveScale * (typeKey === "brute" ? 24 : 12),
      speed: definition.speed + waveScale * (typeKey === "runner" ? 4 : 2),
      reward: definition.reward + Math.floor(waveScale * 0.6),
      distance: -offset,
      slowFactor: 1,
      slowTimer: 0
    };
  }

  function queueWave() {
    state.wave += 1;
    state.activeWave = true;
    state.spawnQueue = [];
    state.spawnTimer = 0;

    const count = 6 + state.wave * 2;
    const scale = state.wave - 1;

    for (let index = 0; index < count; index += 1) {
      let typeKey = "drifter";
      if (state.wave >= 2 && index % 4 === 2) {
        typeKey = "runner";
      }
      if (state.wave >= 3 && index % 5 === 4) {
        typeKey = "brute";
      }
      state.spawnQueue.push(createEnemy(typeKey, scale, index * 44));
    }

    setStatus(`Wave ${state.wave} live. Hold the route.`);
    log(`Wave ${state.wave} started. ${count} hostiles incoming.`);
    updateHud();
  }

  function finishWave() {
    state.activeWave = false;
    const payout = 26 + state.wave * 8;
    const rollReward = state.wave % 2 === 0 ? 2 : 1;

    state.money += payout;
    state.rolls += rollReward;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 12);

    setStatus(`Wave ${state.wave} cleared. Collect chips and roll again.`);
    log(`Wave ${state.wave} clear. +${payout} chips // +${rollReward} spins.`);
    if (state.autoNextWave && !state.gameOver) {
      state.autoWaveTimer = 0.9;
      setStatus(`Wave ${state.wave} cleared. Auto next wave primed.`);
    }
    updateHud();
  }

  function toggleAutoNextWave() {
    state.autoNextWave = !state.autoNextWave;
    if (!state.autoNextWave) {
      state.autoWaveTimer = -1;
      setStatus("Auto next wave disabled.");
    } else {
      setStatus("Auto next wave enabled.");
      if (!state.activeWave && state.spawnQueue.length === 0 && !state.gameOver && state.wave > 0 && state.enemies.length === 0) {
        state.autoWaveTimer = 0.6;
      }
    }
    updateHud();
  }

  function togglePause() {
    if (state.gameOver) {
      return;
    }

    state.paused = !state.paused;
    state.lastFrame = performance.now();
    setStatus(state.paused ? "Run paused. Tap resume when you are back." : "Run resumed.");
    updateHud();
  }

  function toggleSpeed() {
    state.speedMultiplier = state.speedMultiplier === 1 ? 2 : 1;
    setStatus(`Simulation speed set to ${state.speedMultiplier}x.`);
    updateHud();
  }

  function resetRun() {
    state.wave = 0;
    state.money = 220;
    state.rolls = 5;
    state.lives = 20;
    state.activeWave = false;
    state.spawnTimer = 0;
    state.spawnQueue = [];
    state.currentRoll = null;
    state.selectedTowerId = null;
    state.placedTowers = [];
    state.placedBarriers = [];
    state.enemies = [];
    state.projectiles = [];
    state.particles = [];
    state.gameOver = false;
    state.adminCodeIndex = 0;
    state.adminMode = false;
    state.autoWaveTimer = -1;
    state.paused = false;
    state.hiddenAt = null;
    state.speedMultiplier = 1;
    state.player.x = 74;
    state.player.y = 458;
    state.player.hp = state.player.maxHp;
    state.player.cooldown = 0;
    state.player.damage = state.player.baseDamage;
    state.player.fireRate = state.player.baseFireRate;

    setStatus("Roll a tower or barrier, place it on a node, and move the delver with WASD or arrow keys.");
    log("Run reset. The underdark vault is breathing again.");
    updateHud();
  }

  function upgradeTowerToAdminCap(tower) {
    while (tower.level < ADMIN_MAX_LEVEL) {
      tower.level += 1;
      tower.damage *= 1.34;
      tower.range += 14;
      tower.fireRate = Math.max(0.08, tower.fireRate * 0.84);
      if (tower.splash) {
        tower.splash += 10;
      }
      tower.invested += tower.base.cost;
    }

    tower.damage *= 1.8;
    tower.range += 36;
    tower.fireRate = Math.max(0.06, tower.fireRate * 0.72);
    tower.projectileSpeed *= 1.2;
  }

  function upgradeBarrierToAdminCap(barrier) {
    while (barrier.level < ADMIN_MAX_LEVEL) {
      barrier.level += 1;
      barrier.maxHp = Math.round(barrier.maxHp * 1.45);
      barrier.hp = barrier.maxHp;
      barrier.thorns += 2;
      if (barrier.slow) {
        barrier.slow = Math.max(0.18, barrier.slow - 0.04);
      }
      barrier.invested += barrier.base.cost;
    }

    barrier.maxHp = Math.round(barrier.maxHp * 1.65);
    barrier.hp = barrier.maxHp;
    barrier.thorns += 10;
    if (barrier.slow) {
      barrier.slow = Math.max(0.14, barrier.slow - 0.05);
    }
  }

  function activateAdminAbuse() {
    if (!nathanTowerBlueprint || !nathanBarrierBlueprint) {
      return;
    }

    state.adminMode = true;
    state.currentRoll = null;
    state.placedTowers = BUILD_SLOTS.map((slot, index) => {
      const tower = createTowerInstance({ ...nathanTowerBlueprint }, index);
      tower.x = slot.x;
      tower.y = slot.y;
      upgradeTowerToAdminCap(tower);
      return tower;
    });
    state.placedBarriers = BARRIER_SLOTS.map((slot, index) => {
      const barrier = createBarrierInstance({ ...nathanBarrierBlueprint }, index);
      barrier.x = slot.x;
      barrier.y = slot.y;
      barrier.distance = slot.distance;
      upgradeBarrierToAdminCap(barrier);
      return barrier;
    });
    state.selectedTowerId = state.placedTowers[0]?.id || null;
    state.money = Math.max(state.money, 9999);
    state.rolls = Math.max(state.rolls, 99);
    state.player.damage = Math.round(state.player.baseDamage * 2.4);
    state.player.fireRate = Math.max(0.12, state.player.baseFireRate * 0.5);
    state.player.hp = state.player.maxHp;

    setStatus("ADMIN ABUSE LIVE // Nathan towers, Nathan barriers, max level, boosted damage and attack speed.");
    log("SECRET ACCEPTED // field overwritten with max Nathan gear.");
    updateHud();
  }

  function rollTower() {
    if (state.gameOver || state.rolls <= 0) {
      return;
    }

    state.rolls -= 1;
    const rarity = rollRarity();
    state.currentRoll = { ...getRandomTowerByRarity(rarity), category: "tower" };
    setStatus(`Blueprint pulled: ${state.currentRoll.name}. Place it on a free cavern node.`);
    log(`Rolled ${state.currentRoll.name} // ${state.currentRoll.rarity}.`);
    updateHud();
  }

  function rollBarrier() {
    if (state.gameOver || state.rolls <= 0) {
      return;
    }

    state.rolls -= 1;
    const rarity = rollRarity();
    state.currentRoll = { ...getRandomBarrierByRarity(rarity), category: "barrier" };
    setStatus(`Barrier pulled: ${state.currentRoll.name}. Place it on a lane seal point.`);
    log(`Rolled barrier ${state.currentRoll.name} // ${state.currentRoll.rarity}.`);
    updateHud();
  }

  function getFreeSlotAt(x, y) {
    for (let index = 0; index < BUILD_SLOTS.length; index += 1) {
      const slot = BUILD_SLOTS[index];
      const occupied = state.placedTowers.some((tower) => tower.slotIndex === index);
      if (occupied) {
        continue;
      }
      if (Math.hypot(slot.x - x, slot.y - y) <= 28) {
        return index;
      }
    }
    return null;
  }

  function getTowerAt(x, y) {
    return state.placedTowers.find((tower) => Math.hypot(tower.x - x, tower.y - y) <= 24) || null;
  }

  function getBarrierAt(x, y) {
    return state.placedBarriers.find((barrier) => Math.hypot(barrier.x - x, barrier.y - y) <= 26) || null;
  }

  function getFreeBarrierSlotAt(x, y) {
    for (let index = 0; index < BARRIER_SLOTS.length; index += 1) {
      const slot = BARRIER_SLOTS[index];
      const occupied = state.placedBarriers.some((barrier) => barrier.slotIndex === index);
      if (occupied) {
        continue;
      }
      if (Math.hypot(slot.x - x, slot.y - y) <= 22) {
        return index;
      }
    }
    return null;
  }

  function placeCurrentTower(slotIndex) {
    if (!state.currentRoll) {
      setStatus("No blueprint loaded. Roll a tower first.");
      return;
    }

    if (state.money < state.currentRoll.cost) {
      setStatus(`Not enough chips for ${state.currentRoll.name}. Need ${state.currentRoll.cost} chips.`);
      log(`Blocked ${state.currentRoll.name}. Need ${state.currentRoll.cost} chips.`);
      return;
    }

    const tower = createTowerInstance(state.currentRoll, slotIndex);
    state.money -= state.currentRoll.cost;
    state.placedTowers.push(tower);
    state.selectedTowerId = tower.id;
    log(`Placed ${tower.base.name} on pad ${slotIndex + 1}.`);
    setStatus(`${tower.base.name} rooted into the cavern. Hold the lane or start the wave.`);
    state.currentRoll = null;
    updateHud();
  }

  function placeCurrentBarrier(slotIndex) {
    if (!state.currentRoll) {
      setStatus("No barrier loaded. Roll a barrier first.");
      return;
    }

    if (state.money < state.currentRoll.cost) {
      setStatus(`Not enough chips for ${state.currentRoll.name}. Need ${state.currentRoll.cost} chips.`);
      log(`Blocked ${state.currentRoll.name}. Need ${state.currentRoll.cost} chips.`);
      return;
    }

    const barrier = createBarrierInstance(state.currentRoll, slotIndex);
    state.money -= state.currentRoll.cost;
    state.placedBarriers.push(barrier);
    state.selectedTowerId = barrier.id;
    log(`Placed ${barrier.base.name} on seal point ${slotIndex + 1}.`);
    setStatus(`${barrier.base.name} sealed into the lane.`);
    state.currentRoll = null;
    updateHud();
  }

  function upgradeSelectedTower() {
    const tower = state.placedTowers.find((entry) => entry.id === state.selectedTowerId);
    if (tower) {
      const cost = getUpgradeCost(tower);
      if (state.money < cost) {
        setStatus("Not enough chips to upgrade that tower.");
        return;
      }

      state.money -= cost;
      tower.level += 1;
      tower.invested += cost;
      tower.damage *= 1.34;
      tower.range += 14;
      tower.fireRate = Math.max(0.2, tower.fireRate * 0.9);
      if (tower.splash) {
        tower.splash += 6;
      }

      setStatus(`${tower.base.name} upgraded to level ${tower.level}.`);
      log(`${tower.base.name} hit level ${tower.level}.`);
      updateHud();
      return;
    }

    const barrier = state.placedBarriers.find((entry) => entry.id === state.selectedTowerId);
    if (!barrier) {
      return;
    }

    const cost = getUpgradeCost(barrier);
    if (state.money < cost) {
      setStatus("Not enough chips to upgrade that barrier.");
      return;
    }

    state.money -= cost;
    barrier.level += 1;
    barrier.invested += cost;
    barrier.maxHp = Math.round(barrier.maxHp * 1.45);
    barrier.hp = barrier.maxHp;
    barrier.thorns += 2;
    if (barrier.slow) {
      barrier.slow = Math.max(0.25, barrier.slow - 0.04);
    }

    setStatus(`${barrier.base.name} upgraded to level ${barrier.level}.`);
    log(`${barrier.base.name} reinforced to level ${barrier.level}.`);
    updateHud();
  }

  function sellSelectedTower() {
    const towerIndex = state.placedTowers.findIndex((entry) => entry.id === state.selectedTowerId);
    if (towerIndex !== -1) {
      const tower = state.placedTowers[towerIndex];
      const refund = Math.round(tower.invested * 0.7);
      state.money += refund;
      state.placedTowers.splice(towerIndex, 1);
      state.selectedTowerId = null;
      setStatus(`${tower.base.name} sold back to the floor.`);
      log(`Sold ${tower.base.name} for ${refund} chips.`);
      updateHud();
      return;
    }

    const barrierIndex = state.placedBarriers.findIndex((entry) => entry.id === state.selectedTowerId);
    if (barrierIndex === -1) {
      return;
    }

    const barrier = state.placedBarriers[barrierIndex];
    const refund = Math.round(barrier.invested * 0.7);
    state.money += refund;
    state.placedBarriers.splice(barrierIndex, 1);
    state.selectedTowerId = null;
    setStatus(`${barrier.base.name} broken down for salvage.`);
    log(`Sold ${barrier.base.name} for ${refund} chips.`);
    updateHud();
  }

  function onCanvasClick(event) {
    if (state.gameOver) {
      return;
    }

    const rect = towerCanvas.getBoundingClientRect();
    const scaleX = towerCanvas.width / rect.width;
    const scaleY = towerCanvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const tower = getTowerAt(x, y);
    if (tower) {
      state.selectedTowerId = tower.id;
      setStatus(`${tower.base.name} selected.`);
      updateHud();
      return;
    }

    const barrier = getBarrierAt(x, y);
    if (barrier) {
      state.selectedTowerId = barrier.id;
      setStatus(`${barrier.base.name} selected.`);
      updateHud();
      return;
    }

    if (state.currentRoll?.category === "barrier") {
      const barrierSlotIndex = getFreeBarrierSlotAt(x, y);
      if (barrierSlotIndex !== null) {
        placeCurrentBarrier(barrierSlotIndex);
        return;
      }
    }

    const slotIndex = getFreeSlotAt(x, y);
    if (slotIndex !== null && state.currentRoll?.category !== "barrier") {
      placeCurrentTower(slotIndex);
    }
  }

  function getEnemyPosition(enemy) {
    return getPointOnPath(enemy.distance);
  }

  function distanceBetween(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function pickTargetForTower(tower) {
    let bestEnemy = null;
    let bestDistance = -Infinity;

    for (const enemy of state.enemies) {
      const enemyPos = getEnemyPosition(enemy);
      const distance = Math.hypot(enemyPos.x - tower.x, enemyPos.y - tower.y);
      if (distance > tower.range) {
        continue;
      }
      if (enemy.distance > bestDistance) {
        bestDistance = enemy.distance;
        bestEnemy = enemy;
      }
    }

    return bestEnemy;
  }

  function fireTower(tower, target) {
    const targetPos = getEnemyPosition(target);
    const angle = Math.atan2(targetPos.y - tower.y, targetPos.x - tower.x);
    tower.aimAngle = angle;
    const muzzleLength = 22;
    state.projectiles.push({
      x: tower.x + Math.cos(tower.aimAngle) * muzzleLength,
      y: tower.y + Math.sin(tower.aimAngle) * muzzleLength,
      vx: Math.cos(tower.aimAngle) * tower.projectileSpeed,
      vy: Math.sin(tower.aimAngle) * tower.projectileSpeed,
      damage: tower.damage,
      color: tower.base.color,
      splash: tower.splash,
      slow: tower.slow,
      pierce: tower.pierce,
      hitIds: new Set(),
      radius: tower.splash ? 7 : 5
    });
  }

  function advanceAdminCode(key) {
    if (key === adminCode[state.adminCodeIndex]) {
      state.adminCodeIndex += 1;
      if (state.adminCodeIndex >= adminCode.length) {
        state.adminCodeIndex = 0;
        activateAdminAbuse();
      }
      return;
    }

    state.adminCodeIndex = key === adminCode[0] ? 1 : 0;
  }

  function updateTowerAim(tower, delta) {
    const target = pickTargetForTower(tower);
    if (!target) {
      return;
    }

    const targetPos = getEnemyPosition(target);
    const desiredAngle = Math.atan2(targetPos.y - tower.y, targetPos.x - tower.x);
    let angleDelta = desiredAngle - tower.aimAngle;

    while (angleDelta > Math.PI) {
      angleDelta -= Math.PI * 2;
    }
    while (angleDelta < -Math.PI) {
      angleDelta += Math.PI * 2;
    }

    const turnSpeed = Math.min(1, delta * 12);
    tower.aimAngle += angleDelta * turnSpeed;
  }

  function firePlayerBolt(target) {
    const targetPos = getEnemyPosition(target);
    const angle = Math.atan2(targetPos.y - state.player.y, targetPos.x - state.player.x);
    state.projectiles.push({
      x: state.player.x + Math.cos(angle) * 16,
      y: state.player.y + Math.sin(angle) * 16,
      vx: Math.cos(angle) * 420,
      vy: Math.sin(angle) * 420,
      damage: state.player.damage,
      color: "#9ff0ff",
      splash: 0,
      slow: null,
      pierce: 0,
      hitIds: new Set(),
      radius: 4,
      fromPlayer: true
    });
  }

  function getBlockingBarrier(enemy) {
    return state.placedBarriers.find(
      (barrier) => enemy.distance >= barrier.distance - 10 && enemy.distance <= barrier.distance + 14
    ) || null;
  }

  function burstParticles(x, y, color) {
    for (let index = 0; index < 8; index += 1) {
      const angle = (Math.PI * 2 * index) / 8;
      const speed = 36 + Math.random() * 28;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.25,
        color
      });
    }
  }

  function damageEnemy(enemy, amount, options = {}) {
    enemy.hp -= amount;
    if (options.slow) {
      enemy.slowFactor = Math.min(enemy.slowFactor, options.slow);
      enemy.slowTimer = 1.25;
    }
    burstParticles(getEnemyPosition(enemy).x, getEnemyPosition(enemy).y, options.color || "#ffffff");
  }

  function applySplash(x, y, radius, amount, slow, color) {
    for (const enemy of state.enemies) {
      const enemyPos = getEnemyPosition(enemy);
      if (Math.hypot(enemyPos.x - x, enemyPos.y - y) <= radius) {
        damageEnemy(enemy, amount * 0.7, { slow, color });
      }
    }
  }

  function killEnemy(enemy) {
    state.money += enemy.reward;
    log(`${enemy.name} dropped ${enemy.reward} chips.`);
  }

  function updateGame(delta) {
    const effectiveDelta = delta * state.speedMultiplier;

    if (state.autoWaveTimer > 0) {
      state.autoWaveTimer -= effectiveDelta;
      if (state.autoWaveTimer <= 0 && !state.activeWave && state.spawnQueue.length === 0 && !state.gameOver) {
        state.autoWaveTimer = -1;
        queueWave();
      }
    }

    if (state.activeWave && state.spawnQueue.length > 0) {
      state.spawnTimer -= effectiveDelta;
      if (state.spawnTimer <= 0) {
        state.enemies.push(state.spawnQueue.shift());
        state.spawnTimer = 0.72;
      }
    }

    updatePlayer(effectiveDelta);

    for (const tower of state.placedTowers) {
      updateTowerAim(tower, effectiveDelta);
      tower.cooldown -= effectiveDelta;
      if (tower.cooldown <= 0) {
        const target = pickTargetForTower(tower);
        if (target) {
          fireTower(tower, target);
          tower.cooldown = tower.fireRate;
        }
      }
    }

    for (let index = state.projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = state.projectiles[index];
      projectile.x += projectile.vx * effectiveDelta;
      projectile.y += projectile.vy * effectiveDelta;

      let removeProjectile = false;

      for (const enemy of state.enemies) {
        const enemyPos = getEnemyPosition(enemy);
        if (Math.hypot(enemyPos.x - projectile.x, enemyPos.y - projectile.y) <= 15) {
          if (projectile.hitIds.has(enemy.id)) {
            continue;
          }

          projectile.hitIds.add(enemy.id);
          damageEnemy(enemy, projectile.damage, { slow: projectile.slow, color: projectile.color });
          if (projectile.splash) {
            applySplash(enemyPos.x, enemyPos.y, projectile.splash, projectile.damage, projectile.slow, projectile.color);
          }

          if (projectile.pierce > 0 && projectile.hitIds.size <= projectile.pierce + 1) {
            continue;
          }

          removeProjectile = true;
          break;
        }
      }

      if (
        removeProjectile ||
        projectile.x < -20 ||
        projectile.x > towerCanvas.width + 20 ||
        projectile.y < -20 ||
        projectile.y > towerCanvas.height + 20
      ) {
        state.projectiles.splice(index, 1);
      }
    }

    for (let index = state.enemies.length - 1; index >= 0; index -= 1) {
      const enemy = state.enemies[index];

      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= effectiveDelta;
        if (enemy.slowTimer <= 0) {
          enemy.slowFactor = 1;
        }
      }

      const blockingBarrier = getBlockingBarrier(enemy);
      if (blockingBarrier && blockingBarrier.hp > 0) {
        blockingBarrier.hp -= (enemy.typeKey === "brute" ? 34 : enemy.typeKey === "runner" ? 20 : 24) * effectiveDelta;
        enemy.distance = Math.min(enemy.distance, blockingBarrier.distance - 6);
        if (blockingBarrier.thorns > 0) {
          enemy.hp -= blockingBarrier.thorns * effectiveDelta;
        }
        if (blockingBarrier.slow) {
          enemy.slowFactor = Math.min(enemy.slowFactor, blockingBarrier.slow);
          enemy.slowTimer = 0.18;
        }
      } else {
        enemy.distance += enemy.speed * enemy.slowFactor * effectiveDelta;
      }

      if (enemy.hp <= 0) {
        killEnemy(enemy);
        state.enemies.splice(index, 1);
        continue;
      }

      if (distanceBetween(state.player, getEnemyPosition(enemy)) <= state.player.radius + (enemy.typeKey === "brute" ? 14 : 10) + 4) {
        state.player.hp -= enemy.typeKey === "brute" ? 18 * effectiveDelta : enemy.typeKey === "runner" ? 11 * effectiveDelta : 14 * effectiveDelta;
      }

      if (enemy.distance >= pathMetrics.total) {
        state.lives -= enemy.typeKey === "brute" ? 2 : 1;
        log(`${enemy.name} slipped through. Core integrity hit.`);
        state.enemies.splice(index, 1);

        if (state.lives <= 0) {
          state.lives = 0;
          state.gameOver = true;
          state.activeWave = false;
          state.spawnQueue = [];
          setStatus("Core breach. Reset the run to spin it up again.");
          log("Vault collapsed. Run over.");
        }
      }
    }

    for (let index = state.placedBarriers.length - 1; index >= 0; index -= 1) {
      const barrier = state.placedBarriers[index];
      if (barrier.hp <= 0) {
        log(`${barrier.base.name} collapsed under pressure.`);
        if (state.selectedTowerId === barrier.id) {
          state.selectedTowerId = null;
        }
        state.placedBarriers.splice(index, 1);
      }
    }

    if (state.player.hp <= 0 && !state.gameOver) {
      state.gameOver = true;
      state.activeWave = false;
      state.spawnQueue = [];
      setStatus("The delver fell in the cavern. Reset the run to return underground.");
      log("Delver down. The underdark push overwhelmed you.");
    }

    for (let index = state.particles.length - 1; index >= 0; index -= 1) {
      const particle = state.particles[index];
      particle.x += particle.vx * effectiveDelta;
      particle.y += particle.vy * effectiveDelta;
      particle.life -= effectiveDelta;
      if (particle.life <= 0) {
        state.particles.splice(index, 1);
      }
    }

    if (
      state.activeWave &&
      state.spawnQueue.length === 0 &&
      state.enemies.length === 0 &&
      !state.gameOver
    ) {
      finishWave();
    }

    updateHud();
  }

  function pickTargetForPlayer() {
    let bestEnemy = null;
    let bestDistance = Infinity;

    for (const enemy of state.enemies) {
      const enemyPos = getEnemyPosition(enemy);
      const distance = Math.hypot(enemyPos.x - state.player.x, enemyPos.y - state.player.y);
      if (distance > state.player.range) {
        continue;
      }
      if (distance < bestDistance) {
        bestDistance = distance;
        bestEnemy = enemy;
      }
    }

    return bestEnemy;
  }

  function updatePlayer(delta) {
    const previousX = state.player.x;
    const previousY = state.player.y;
    let dx = 0;
    let dy = 0;

    if (state.keys.arrowup || state.keys.w) {
      dy -= 1;
    }
    if (state.keys.arrowdown || state.keys.s) {
      dy += 1;
    }
    if (state.keys.arrowleft || state.keys.a) {
      dx -= 1;
    }
    if (state.keys.arrowright || state.keys.d) {
      dx += 1;
    }

    if (dx !== 0 || dy !== 0) {
      const length = Math.hypot(dx, dy) || 1;
      dx /= length;
      dy /= length;
      state.player.x = Math.max(24, Math.min(towerCanvas.width - 24, state.player.x + dx * state.player.speed * delta));
      state.player.y = Math.max(24, Math.min(towerCanvas.height - 24, state.player.y + dy * state.player.speed * delta));
      resolvePlayerBarrierCollision(previousX, previousY);
    }

    state.player.cooldown -= delta;
    if (state.player.cooldown <= 0) {
      const target = pickTargetForPlayer();
      if (target) {
        firePlayerBolt(target);
        state.player.cooldown = state.player.fireRate;
      }
    }
  }

  function resolvePlayerBarrierCollision(previousX, previousY) {
    void previousX;
    void previousY;
  }

  function drawBackground() {
    ctx.clearRect(0, 0, towerCanvas.width, towerCanvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, towerCanvas.height);
    gradient.addColorStop(0, "#120b19");
    gradient.addColorStop(0.45, "#0d111f");
    gradient.addColorStop(1, "#05070d");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, towerCanvas.width, towerCanvas.height);

    const glowPockets = [
      { x: 168, y: 110, radius: 110, color: "rgba(96, 45, 150, 0.18)" },
      { x: 508, y: 432, radius: 140, color: "rgba(0, 160, 150, 0.12)" },
      { x: 798, y: 154, radius: 100, color: "rgba(160, 70, 220, 0.14)" }
    ];

    glowPockets.forEach((pocket) => {
      const pocketGradient = ctx.createRadialGradient(pocket.x, pocket.y, 12, pocket.x, pocket.y, pocket.radius);
      pocketGradient.addColorStop(0, pocket.color);
      pocketGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = pocketGradient;
      ctx.fillRect(pocket.x - pocket.radius, pocket.y - pocket.radius, pocket.radius * 2, pocket.radius * 2);
    });

    ctx.strokeStyle = "rgba(146, 108, 210, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= towerCanvas.width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, towerCanvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= towerCanvas.height; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(towerCanvas.width, y);
      ctx.stroke();
    }
  }

  function drawPath() {
    ctx.save();
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(72, 54, 36, 0.88)";
    ctx.lineWidth = 50;
    ctx.beginPath();
    ctx.moveTo(PATH_POINTS[0].x, PATH_POINTS[0].y);
    for (let index = 1; index < PATH_POINTS.length; index += 1) {
      ctx.lineTo(PATH_POINTS[index].x, PATH_POINTS[index].y);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(194, 156, 88, 0.55)";
    ctx.lineWidth = 5;
    ctx.setLineDash([18, 14]);
    ctx.stroke();
    ctx.restore();
  }

  function drawBuildSlots() {
    for (let index = 0; index < BUILD_SLOTS.length; index += 1) {
      const slot = BUILD_SLOTS[index];
      const occupiedTower = state.placedTowers.find((tower) => tower.slotIndex === index);
      ctx.save();
      ctx.translate(slot.x, slot.y);
      const ring = ctx.createRadialGradient(0, 0, 4, 0, 0, 30);
      ring.addColorStop(0, occupiedTower ? "rgba(102, 255, 194, 0.42)" : "rgba(145, 100, 220, 0.28)");
      ring.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = ring;
      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = occupiedTower ? "rgba(102, 255, 194, 0.76)" : "rgba(173, 135, 240, 0.58)";
      ctx.lineWidth = occupiedTower ? 3 : 2;
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = occupiedTower ? "rgba(102, 255, 194, 0.48)" : "rgba(120, 82, 180, 0.42)";
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(14, 0);
      ctx.moveTo(0, -14);
      ctx.lineTo(0, 14);
      ctx.stroke();

      ctx.fillStyle = occupiedTower ? "rgba(102, 255, 194, 0.88)" : "rgba(213, 192, 255, 0.7)";
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(7, 0);
      ctx.lineTo(0, 11);
      ctx.lineTo(-7, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function drawBarriers() {
    for (const slot of BARRIER_SLOTS) {
      const occupied = state.placedBarriers.find((barrier) => barrier.slotIndex === BARRIER_SLOTS.indexOf(slot));
      ctx.save();
      ctx.translate(slot.x, slot.y);
      ctx.strokeStyle = occupied ? "rgba(255, 90, 140, 0.88)" : "rgba(177, 126, 255, 0.42)";
      ctx.lineWidth = occupied ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(-16, -16);
      ctx.lineTo(16, -16);
      ctx.lineTo(16, 16);
      ctx.lineTo(-16, 16);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = occupied ? "rgba(255, 180, 208, 0.5)" : "rgba(205, 186, 255, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-10, -10);
      ctx.lineTo(10, 10);
      ctx.moveTo(10, -10);
      ctx.lineTo(-10, 10);
      ctx.stroke();

      if (occupied) {
        ctx.fillStyle = occupied.base.color;
        ctx.shadowColor = occupied.base.color;
        ctx.shadowBlur = 18;
        ctx.fillRect(-12, -12, 24, 24);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(10, 10, 15, 0.95)";
        ctx.fillRect(-14, -24, 28, 4);
        ctx.fillStyle = "#72ffa9";
        ctx.fillRect(-14, -24, 28 * Math.max(occupied.hp, 0) / occupied.maxHp, 4);
      }
      ctx.restore();
    }
  }

  function drawTowers() {
    const selectedTower = state.placedTowers.find((tower) => tower.id === state.selectedTowerId);

    if (selectedTower) {
      ctx.save();
      ctx.strokeStyle = "rgba(0, 255, 136, 0.18)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 8]);
      ctx.beginPath();
      ctx.arc(selectedTower.x, selectedTower.y, selectedTower.range, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const tower of state.placedTowers) {
      ctx.save();
      ctx.translate(tower.x, tower.y);
      ctx.shadowColor = tower.base.color;
      ctx.shadowBlur = 22;
      ctx.fillStyle = "rgba(34, 24, 40, 0.95)";
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(20, 16, 30, 0.94)";
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(12, -6);
      ctx.lineTo(14, 10);
      ctx.lineTo(0, 18);
      ctx.lineTo(-14, 10);
      ctx.lineTo(-12, -6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = tower.base.color;
      ctx.globalAlpha = 0.28;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.rotate(tower.aimAngle);
      ctx.fillStyle = "rgba(8, 10, 16, 0.95)";
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.lineTo(20, -8);
      ctx.lineTo(24, 0);
      ctx.lineTo(20, 8);
      ctx.lineTo(-6, 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = tower.base.color;
      ctx.beginPath();
      ctx.moveTo(0, -12);
      ctx.lineTo(18, -9);
      ctx.lineTo(24, 0);
      ctx.lineTo(18, 9);
      ctx.lineTo(0, 12);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.fillRect(12, -2, 10, 4);
      ctx.restore();

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(-5, -31, 10, 16);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = '12px "Share Tech Mono", monospace';
      ctx.textAlign = "center";
      ctx.fillText(String(tower.level), 0, 5);
      ctx.restore();
    }
  }

  function drawEnemies() {
    for (const enemy of state.enemies) {
      const position = getEnemyPosition(enemy);
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.fillStyle = enemy.color;
      ctx.shadowColor = enemy.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.typeKey === "brute" ? 14 : 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(10, 10, 15, 0.96)";
      ctx.fillRect(-18, -24, 36, 5);
      ctx.fillStyle = "#00ff88";
      ctx.fillRect(-18, -24, 36 * Math.max(enemy.hp, 0) / enemy.maxHp, 5);

      if (enemy.slowFactor < 1) {
        ctx.strokeStyle = "rgba(0, 212, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(state.player.x, state.player.y);

    const aura = ctx.createRadialGradient(0, 0, 4, 0, 0, 26);
    aura.addColorStop(0, "rgba(144, 255, 228, 0.38)");
    aura.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(129, 255, 224, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, state.player.range, 0, Math.PI * 2);
    ctx.setLineDash([8, 10]);
    ctx.globalAlpha = 0.08;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);

    ctx.fillStyle = "#8df9e2";
    ctx.shadowColor = "#8df9e2";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(10, -3);
    ctx.lineTo(8, 12);
    ctx.lineTo(0, 18);
    ctx.lineTo(-8, 12);
    ctx.lineTo(-10, -3);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#041014";
    ctx.fillRect(-3, -20, 6, 8);

    ctx.fillStyle = "rgba(10, 10, 15, 0.96)";
    ctx.fillRect(-22, -30, 44, 5);
    ctx.fillStyle = "#72ffa9";
    ctx.fillRect(-22, -30, 44 * Math.max(state.player.hp, 0) / state.player.maxHp, 5);
    ctx.restore();
  }

  function drawProjectiles() {
    for (const projectile of state.projectiles) {
      ctx.save();
      ctx.fillStyle = projectile.color;
      ctx.shadowColor = projectile.color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawParticles() {
    for (const particle of state.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(particle.life * 1.6, 0);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
      ctx.restore();
    }
  }

  function drawOverlay() {
    if (!state.currentRoll || state.gameOver) {
      if (!state.gameOver) {
        ctx.save();
        ctx.fillStyle = "rgba(193, 170, 255, 0.86)";
        ctx.font = '16px "Share Tech Mono", monospace';
        ctx.textAlign = "left";
        ctx.fillText("Delver online // Move with WASD or arrow keys", 24, 34);
        ctx.restore();
      }
      return;
    }

    ctx.save();
    ctx.fillStyle = "rgba(193, 170, 255, 0.92)";
    ctx.font = '18px "Share Tech Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillText(`Loaded blueprint: ${state.currentRoll.name}`, 24, 34);
    ctx.font = '15px "Share Tech Mono", monospace';
    ctx.fillText("Move delver with WASD or arrow keys", 24, 58);
    ctx.restore();
  }

  function drawGameOver() {
    if (!state.gameOver) {
      return;
    }

    ctx.save();
    ctx.fillStyle = "rgba(10, 10, 15, 0.72)";
    ctx.fillRect(0, 0, towerCanvas.width, towerCanvas.height);
    ctx.strokeStyle = "rgba(255, 51, 102, 0.7)";
    ctx.lineWidth = 4;
    ctx.strokeRect(120, 150, 720, 240);
    ctx.fillStyle = "#ff3366";
    ctx.textAlign = "center";
    ctx.font = '44px "Orbitron", monospace';
    ctx.fillText("CORE BREACH", towerCanvas.width / 2, 238);
    ctx.fillStyle = "#e0e0e0";
    ctx.font = '20px "JetBrains Mono", monospace';
    ctx.fillText("Reset run to spin the bastion back online.", towerCanvas.width / 2, 294);
    ctx.restore();
  }

  function drawPauseOverlay() {
    if (!state.paused || state.gameOver) {
      return;
    }

    ctx.save();
    ctx.fillStyle = "rgba(5, 7, 13, 0.44)";
    ctx.fillRect(0, 0, towerCanvas.width, towerCanvas.height);
    ctx.strokeStyle = "rgba(0, 212, 255, 0.6)";
    ctx.lineWidth = 3;
    ctx.strokeRect(318, 188, 324, 140);
    ctx.fillStyle = "#8df9e2";
    ctx.textAlign = "center";
    ctx.font = '36px "Orbitron", monospace';
    ctx.fillText("PAUSED", towerCanvas.width / 2, 246);
    ctx.fillStyle = "#e0e0e0";
    ctx.font = '18px "JetBrains Mono", monospace';
    ctx.fillText("The run is frozen until you resume.", towerCanvas.width / 2, 288);
    ctx.restore();
  }

  function render() {
    drawBackground();
    drawPath();
    drawBarriers();
    drawBuildSlots();
    drawTowers();
    drawEnemies();
    drawProjectiles();
    drawParticles();
    drawPlayer();
    drawOverlay();
    drawPauseOverlay();
    drawGameOver();
  }

  function catchUpSimulation(elapsedMs) {
    if (state.paused || state.gameOver) {
      return;
    }

    let remaining = Math.min(elapsedMs / 1000, 30);
    while (remaining > 0 && !state.paused && !state.gameOver) {
      const step = Math.min(0.05, remaining);
      updateGame(step);
      remaining -= step;
    }
  }

  function tick(now) {
    const delta = Math.min((now - state.lastFrame) / 1000, 0.033);
    state.lastFrame = now;

    if (!state.gameOver && !state.paused) {
      updateGame(delta);
    }
    render();
    window.requestAnimationFrame(tick);
  }

  rollButton.addEventListener("click", rollTower);
  rollBarrierButton.addEventListener("click", rollBarrier);
  autoButton.addEventListener("click", toggleAutoNextWave);
  pauseButton.addEventListener("click", togglePause);
  if (speedButton) {
    speedButton.addEventListener("click", toggleSpeed);
  }
  startButton.addEventListener("click", () => {
    if (state.activeWave || state.spawnQueue.length > 0 || state.gameOver) {
      return;
    }
    queueWave();
  });
  upgradeButton.addEventListener("click", upgradeSelectedTower);
  sellButton.addEventListener("click", sellSelectedTower);
  resetButton.addEventListener("click", resetRun);
  towerCanvas.addEventListener("click", onCanvasClick);
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key.startsWith("arrow")) {
      advanceAdminCode(key);
    }
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
      state.keys[key] = true;
      event.preventDefault();
    }
  });
  window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
      state.keys[key] = false;
      event.preventDefault();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      state.hiddenAt = Date.now();
      return;
    }

    if (state.hiddenAt) {
      catchUpSimulation(Date.now() - state.hiddenAt);
      state.hiddenAt = null;
    }
    state.lastFrame = performance.now();
  });

  resetRun();
  window.requestAnimationFrame(tick);
}
