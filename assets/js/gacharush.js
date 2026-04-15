const relicPage = document.body.dataset.page === "game-04";

if (relicPage) {
  const statusOutput = document.querySelector("[data-relic-status]");
  const waveOutput = document.querySelector("[data-relic-wave]");
  const rollsOutput = document.querySelector("[data-relic-rolls]");
  const bossesOutput = document.querySelector("[data-relic-bosses]");
  const levelOutput = document.querySelector("[data-relic-level]");
  const xpOutput = document.querySelector("[data-relic-xp]");
  const ratesOutput = document.querySelector("[data-relic-rates]");
  const weaponOutput = document.querySelector("[data-relic-weapon]");
  const utilityOutput = document.querySelector("[data-relic-utility]");
  const moduleOutput = document.querySelector("[data-relic-module]");
  const weaponCopy = document.querySelector("[data-relic-weapon-copy]");
  const utilityCopy = document.querySelector("[data-relic-utility-copy]");
  const moduleCopy = document.querySelector("[data-relic-module-copy]");
  const playerBar = document.querySelector("[data-player-bar]");
  const enemyBar = document.querySelector("[data-enemy-bar]");
  const playerHp = document.querySelector("[data-player-hp]");
  const enemyHp = document.querySelector("[data-enemy-hp]");
  const playerPower = document.querySelector("[data-player-power]");
  const playerUtilityState = document.querySelector("[data-player-utility-state]");
  const enemyName = document.querySelector("[data-enemy-name]");
  const enemyType = document.querySelector("[data-enemy-type]");
  const enemyIntent = document.querySelector("[data-enemy-intent]");
  const log = document.querySelector("[data-relic-log]");
  const startButton = document.querySelector("[data-relic-start]");
  const utilityButton = document.querySelector("[data-relic-utility-use]");
  const resetButton = document.querySelector("[data-relic-reset]");
  const rollButtons = document.querySelectorAll("[data-roll-type]");
  const canvas = document.querySelector("[data-relic-canvas]");

  if (
    statusOutput &&
    waveOutput &&
    rollsOutput &&
    bossesOutput &&
    levelOutput &&
    xpOutput &&
    ratesOutput &&
    weaponOutput &&
    utilityOutput &&
    moduleOutput &&
    weaponCopy &&
    utilityCopy &&
    moduleCopy &&
    playerBar &&
    enemyBar &&
    playerHp &&
    enemyHp &&
    playerPower &&
    playerUtilityState &&
    enemyName &&
    enemyType &&
    enemyIntent &&
    log &&
    startButton &&
    utilityButton &&
    resetButton &&
    canvas &&
    rollButtons.length
  ) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Relic Rush canvas failed to initialize.");
    }

    const rarityWeights = {
      Common: 34,
      Uncommon: 23,
      Rare: 16,
      Epic: 11,
      Legendary: 7,
      Mythic: 4,
      Exotic: 1.8,
      Divine: 0.5,
      Godlike: 0.08,
    };

    const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic", "Exotic", "Divine", "Godlike"];

    const weapons = [
      { name: "Rust Blaster", rarity: "Common", attack: 12, speed: 0.9, crit: 0.08, range: 138, style: "gun", copy: "Reliable starter firearm with flat damage." },
      { name: "Ash Repeater", rarity: "Common", attack: 10, speed: 1.45, crit: 0.05, range: 128, style: "gun", copy: "Fast attack cycle that chips monsters down." },
      { name: "Scrap Pike", rarity: "Uncommon", attack: 14, speed: 1.02, crit: 0.09, range: 112, style: "blade", copy: "A rough spear rig that stabs through rushing mobs." },
      { name: "Ion Slicer", rarity: "Uncommon", attack: 13, speed: 1.32, crit: 0.1, range: 92, style: "blade", copy: "Fast mono-edge that flickers through short sweep arcs." },
      { name: "Volt Lance", rarity: "Rare", attack: 17, speed: 1.05, crit: 0.16, range: 156, style: "gun", copy: "Long pulse strikes that crit harder the longer the fight runs." },
      { name: "Orbit Saber", rarity: "Rare", attack: 15, speed: 1.18, crit: 0.12, range: 82, style: "blade", copy: "Balanced close-range blade loop with steady output." },
      { name: "Prism Carbine", rarity: "Rare", attack: 18, speed: 1.12, crit: 0.14, range: 174, style: "gun", copy: "A cleaner rifle roll that keeps pressure from deep range." },
      { name: "Null Cannon", rarity: "Epic", attack: 24, speed: 0.72, crit: 0.22, range: 164, style: "gun", copy: "Heavy impact bursts built for bosses." },
      { name: "Rift Talon", rarity: "Epic", attack: 20, speed: 1.28, crit: 0.19, range: 88, style: "blade", copy: "Close-range arc blade that carves wide neon sweeps." },
      { name: "Storm Halberd", rarity: "Epic", attack: 22, speed: 1.0, crit: 0.17, range: 108, style: "blade", copy: "Sweeping pole-arm that clips multiple melee lanes." },
      { name: "Sunwire Bow", rarity: "Legendary", attack: 28, speed: 1.0, crit: 0.24, range: 224, style: "gun", copy: "Long-range radiant shots that punish backline enemies." },
      { name: "Nebula Drifter", rarity: "Legendary", attack: 26, speed: 1.26, crit: 0.21, range: 196, style: "gun", copy: "High-tier rifle that deletes ranged enemies before they settle." },
      { name: "Event Horizon", rarity: "Mythic", attack: 36, speed: 0.82, crit: 0.3, range: 208, style: "gun", copy: "Forbidden relic cannon that hits like a boss weapon." },
      { name: "Abyss Fang", rarity: "Mythic", attack: 32, speed: 1.22, crit: 0.27, range: 96, style: "blade", copy: "A myth-tier saber that leaves a brutal violet sweep trail." },
      { name: "Void Psalm", rarity: "Mythic", attack: 38, speed: 1.08, crit: 0.28, range: 188, style: "gun", copy: "Myth-tier burst relic that chains brutal mid-range volleys." },
      { name: "Night Crown", rarity: "Mythic", attack: 35, speed: 1.16, crit: 0.31, range: 104, style: "blade", copy: "A cursed monarch blade with wider, nastier sweep pressure." },
      { name: "Starrender Rail", rarity: "Exotic", attack: 42, speed: 0.92, crit: 0.34, range: 252, style: "gun", copy: "An illegal rail relic tuned to erase sniper lines." },
      { name: "Seraph Arc", rarity: "Divine", attack: 52, speed: 1.04, crit: 0.4, range: 238, style: "blade", copy: "Celestial edge that paints giant light sweeps across the graph." },
      { name: "Halo Rupture", rarity: "Divine", attack: 56, speed: 0.96, crit: 0.43, range: 244, style: "gun", copy: "Divine fracture cannon built to split entire lanes open." },
      { name: "Godsplitter", rarity: "Godlike", attack: 68, speed: 1.08, crit: 0.48, range: 122, style: "blade", copy: "Godlike execution saber with enormous sweep damage and radiant reach." },
      { name: "Genesis Coil", rarity: "Godlike", attack: 74, speed: 0.88, crit: 0.5, range: 272, style: "gun", copy: "Godlike coil engine that erases elites before they can set up." },
    ];

    const utilities = [
      { name: "Pulse Medkit", rarity: "Common", type: "heal", power: 28, charges: 1, copy: "Heals you on command during a fight." },
      { name: "Panic Injector", rarity: "Common", type: "heal", power: 20, charges: 1, copy: "Emergency patch that keeps a run alive." },
      { name: "Flash Step", rarity: "Uncommon", type: "dash", power: 72, charges: 2, copy: "Short burst reposition to break melee pressure." },
      { name: "Mirror Shield", rarity: "Rare", type: "shield", power: 18, charges: 2, copy: "Creates a shield that absorbs the next heavy hit." },
      { name: "Overclock Burst", rarity: "Rare", type: "boost", power: 1.35, charges: 2, copy: "Temporarily amplifies your weapon damage." },
      { name: "Scrap Drone", rarity: "Epic", type: "drone", power: 10, charges: 1, copy: "Deploys a support drone for bonus shots." },
      { name: "Gravity Well", rarity: "Legendary", type: "nova", power: 44, charges: 1, copy: "Crushes nearby hostiles with a short-range burst." },
      { name: "Phase Battery", rarity: "Mythic", type: "heal", power: 52, charges: 2, copy: "Illicit recovery cell that massively stabilizes doomed runs." },
      { name: "Blacksite Bloom", rarity: "Mythic", type: "nova", power: 56, charges: 2, copy: "Myth-tier bloom burst that collapses close swarms on demand." },
      { name: "Grave Current", rarity: "Mythic", type: "boost", power: 1.72, charges: 2, copy: "Mythic combat stimulant that pushes both damage and pace higher." },
      { name: "Prism Vault", rarity: "Exotic", type: "shield", power: 34, charges: 2, copy: "Exotic reflective shield built to blank ranged bursts." },
      { name: "Saint Protocol", rarity: "Divine", type: "boost", power: 1.62, charges: 2, copy: "Forbidden utility that spikes movement and damage together." },
      { name: "Solar Baptism", rarity: "Divine", type: "heal", power: 74, charges: 2, copy: "Divine recovery surge that can drag a near-dead run back online." },
      { name: "Throne Override", rarity: "Godlike", type: "boost", power: 2.05, charges: 3, copy: "Godlike overclock that turns every weapon into a run-ending engine." },
      { name: "Judgment Halo", rarity: "Godlike", type: "shield", power: 58, charges: 3, copy: "Godlike barrier stack built to survive boss volleys and brute hits." },
    ];

    const modules = [
      { name: "Static Core", rarity: "Common", type: "flat", value: 2, copy: "Basic passive that keeps your damage stable." },
      { name: "Reactive Plating", rarity: "Common", type: "maxHp", value: 22, copy: "Adds extra life to every run." },
      { name: "Ghost Wiring", rarity: "Uncommon", type: "speed", value: 1.12, copy: "Shaves just enough delay off your attack loop." },
      { name: "Vulture Drive", rarity: "Rare", type: "loot", value: 1, copy: "Earn extra roll credits from cleared waves." },
      { name: "Frenzy Loop", rarity: "Rare", type: "speed", value: 1.24, copy: "Accelerates your attack cycle." },
      { name: "Boss Hunter Sigil", rarity: "Epic", type: "boss", value: 1.35, copy: "Multiplies damage into boss targets." },
      { name: "Railmind Lens", rarity: "Legendary", type: "flat", value: 8, copy: "High-end targeting core that makes every shot hurt." },
      { name: "Crown of Static", rarity: "Mythic", type: "boss", value: 1.68, copy: "Illegal crown-module built purely to erase apex targets." },
      { name: "Eclipse Relay", rarity: "Exotic", type: "speed", value: 1.42, copy: "Exotic relay that turns all weapons into terrifying loop machines." },
      { name: "Throne Kernel", rarity: "Divine", type: "flat", value: 14, copy: "Divine compute core that overloads every strike with raw force." },
      { name: "Origin Kernel", rarity: "Godlike", type: "flat", value: 20, copy: "Godlike compute shard that floods every strike with impossible output." },
    ];

    const arena = {
      width: canvas.width,
      height: canvas.height,
      cols: 16,
      rows: 9,
      tileW: canvas.width / 16,
      tileH: canvas.height / 9,
      inset: 24,
    };

    const state = {
      rolls: 6,
      wave: 0,
      bossesCleared: 0,
      level: 1,
      xp: 0,
      xpToNext: 40,
      inRun: false,
      animationFrame: 0,
      lastTime: 0,
      weapon: weapons[0],
      utility: utilities[0],
      module: modules[0],
      player: {
        x: canvas.width * 0.22,
        y: canvas.height * 0.5,
        hp: 120,
        maxHp: 120,
        shield: 0,
        boost: 0,
        speed: 180,
        attackCooldown: 0,
        poisonTimer: 0,
        poisonTickTimer: 0,
      },
      enemies: [],
      projectiles: [],
      pickups: [],
      veins: [],
      utilityCharges: 1,
      droneTimer: 0,
      keys: new Set(),
      targetPulse: 0,
      swingTimer: 0,
      swingAngle: 0,
    };

    const rarityLabel = (item) => `${item.name} // ${item.rarity}`;
    const rarityClassName = (item) => `rarity-${item.rarity.toLowerCase()}`;
    const randomItem = (pool) => {
      const totalWeight = pool.reduce((sum, item) => sum + (rarityWeights[item.rarity] || 1), 0);
      let roll = Math.random() * totalWeight;

      for (const item of pool) {
        roll -= rarityWeights[item.rarity] || 1;
        if (roll <= 0) {
          return item;
        }
      }

      return pool[pool.length - 1];
    };

    const renderRates = () => {
      const totalWeight = rarityOrder.reduce((sum, rarity) => sum + rarityWeights[rarity], 0);
      ratesOutput.innerHTML = "";

      rarityOrder.forEach((rarity) => {
        const row = document.createElement("div");
        const label = document.createElement("span");
        const value = document.createElement("strong");
        row.className = "odds-row";
        label.textContent = rarity;
        value.textContent = `${((rarityWeights[rarity] / totalWeight) * 100).toFixed(rarity === "Godlike" ? 2 : 1)}%`;
        value.className = `rarity-${rarity.toLowerCase()}`;
        row.append(label, value);
        ratesOutput.append(row);
      });
    };

    const logLine = (text) => {
      const line = document.createElement("p");
      line.textContent = `> ${text}`;
      log.prepend(line);
      while (log.childElementCount > 8) {
        log.removeChild(log.lastChild);
      }
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const angleTo = (from, to) => Math.atan2(to.y - from.y, to.x - from.x);

    const computeStats = () => {
      const maxHp = 120 + (state.module.type === "maxHp" ? state.module.value : 0) + (state.level - 1) * 18;
      const attackBase = state.weapon.attack + (state.module.type === "flat" ? state.module.value : 0);
      const attackRate = state.weapon.speed * (state.module.type === "speed" ? state.module.value : 1);
      return {
        maxHp,
        attackBase,
        attackRate,
        range: state.weapon.range,
      };
    };

    const createEnemy = (kind, laneOffset, wave) => {
      if (kind === "boss") {
        return {
          kind: "Boss",
          name: `Apex ${wave / 5}`,
          x: canvas.width * 0.8,
          y: canvas.height * 0.5,
          hp: 180 + wave * 22,
          maxHp: 180 + wave * 22,
          damage: 16 + wave * 2,
          speed: 68 + wave * 2,
          radius: 28,
          attackTimer: 0,
          attackCadence: 1.25,
          range: 170,
          projectileSpeed: 0,
          summonTimer: 4.8,
          veinTimer: 3.2,
        };
      }

      if (kind === "ranger") {
        return {
          kind: "Ranger",
          name: `Sniper ${laneOffset + 1}`,
          x: canvas.width * 0.76 + (laneOffset % 2) * 34,
          y: canvas.height * (0.18 + laneOffset * 0.2),
          hp: 30 + wave * 8,
          maxHp: 30 + wave * 8,
          damage: 8 + wave,
          speed: 48 + wave * 2,
          radius: 16,
          attackTimer: 0,
          attackCadence: 1.65,
          range: 210,
          preferredRange: 170,
          projectileSpeed: 280 + wave * 7,
          veinTimer: 0,
        };
      }

      if (kind === "poison") {
        return {
          kind: "Venom",
          name: `Toxic Spitter ${laneOffset + 1}`,
          x: canvas.width * 0.74 + (laneOffset % 2) * 30,
          y: canvas.height * (0.2 + laneOffset * 0.16),
          hp: 34 + wave * 8,
          maxHp: 34 + wave * 8,
          damage: 5 + Math.floor(wave * 0.8),
          poison: 4 + Math.floor(wave * 0.35),
          speed: 56 + wave * 2,
          radius: 15,
          attackTimer: 0,
          attackCadence: 1.4,
          range: 182,
          preferredRange: 138,
          projectileSpeed: 244 + wave * 6,
          veinTimer: 2.7,
        };
      }

      if (kind === "brute") {
        return {
          kind: "Brute",
          name: `Maul Tank ${laneOffset + 1}`,
          x: canvas.width * 0.78 + (laneOffset % 2) * 28,
          y: canvas.height * (0.22 + laneOffset * 0.18),
          hp: 70 + wave * 15,
          maxHp: 70 + wave * 15,
          damage: 14 + wave * 2,
          speed: 34 + wave,
          radius: 24,
          attackTimer: 0,
          attackCadence: 1.8,
          range: 46,
          projectileSpeed: 0,
          veinTimer: 0,
        };
      }

      return {
        kind: "Monster",
        name: `Mob ${laneOffset + 1}`,
        x: canvas.width * 0.75 + (laneOffset % 2) * 36,
        y: canvas.height * (0.2 + laneOffset * 0.18),
        hp: 42 + wave * 11,
        maxHp: 42 + wave * 11,
        damage: 6 + wave,
        speed: 58 + wave * 3,
        radius: 18,
        attackTimer: 0,
        attackCadence: 1.45,
        range: 40,
        projectileSpeed: 0,
        veinTimer: 0,
      };
    };

    const getPrimaryEnemy = () => {
      if (!state.enemies.length) {
        return null;
      }

      let primary = state.enemies[0];
      let bestDistance = distance(state.player, primary);

      for (let index = 1; index < state.enemies.length; index += 1) {
        const current = state.enemies[index];
        const currentDistance = distance(state.player, current);
        if (currentDistance < bestDistance) {
          primary = current;
          bestDistance = currentDistance;
        }
      }

      return primary;
    };

    const setStatus = (message) => {
      statusOutput.textContent = message;
    };

    const refreshUi = () => {
      const stats = computeStats();
      state.player.maxHp = stats.maxHp;
      state.player.hp = Math.min(state.player.hp, state.player.maxHp);

      waveOutput.textContent = String(state.wave);
      rollsOutput.textContent = String(state.rolls);
      bossesOutput.textContent = String(state.bossesCleared);
      levelOutput.textContent = String(state.level);
      xpOutput.textContent = `${state.xp} / ${state.xpToNext}`;
      weaponOutput.textContent = rarityLabel(state.weapon);
      utilityOutput.textContent = rarityLabel(state.utility);
      moduleOutput.textContent = rarityLabel(state.module);
      weaponOutput.className = rarityClassName(state.weapon);
      utilityOutput.className = rarityClassName(state.utility);
      moduleOutput.className = rarityClassName(state.module);
      weaponCopy.textContent = state.weapon.copy;
      utilityCopy.textContent = state.utility.copy;
      moduleCopy.textContent = state.module.copy;
      playerPower.textContent = `ATK ${stats.attackBase} // SPD ${stats.attackRate.toFixed(2)} // RNG ${Math.round(stats.range)}`;
      playerUtilityState.textContent = `${state.utility.name} // ${state.utilityCharges} charge${state.utilityCharges === 1 ? "" : "s"}${state.player.shield > 0 ? ` // shield ${Math.ceil(state.player.shield)}` : ""}${state.player.poisonTimer > 0 ? " // poisoned" : ""}`;
      playerHp.textContent = `${Math.max(0, Math.ceil(state.player.hp))} / ${state.player.maxHp}`;
      playerBar.style.width = `${clamp((state.player.hp / state.player.maxHp) * 100, 0, 100)}%`;

      const primaryEnemy = getPrimaryEnemy();
      if (primaryEnemy) {
        enemyName.textContent = primaryEnemy.name;
        enemyType.textContent = `${primaryEnemy.kind} // ${state.enemies.length} live`;
        enemyIntent.textContent = `DMG ${primaryEnemy.damage}${primaryEnemy.poison ? `+${primaryEnemy.poison} tox` : ""} // SPD ${Math.round(primaryEnemy.speed)} // CAD ${primaryEnemy.attackCadence.toFixed(2)}s`;
        enemyHp.textContent = `${Math.max(0, Math.ceil(primaryEnemy.hp))} / ${primaryEnemy.maxHp}`;
        enemyBar.style.width = `${clamp((primaryEnemy.hp / primaryEnemy.maxHp) * 100, 0, 100)}%`;
      } else {
        enemyName.textContent = "No target";
        enemyType.textContent = "Waiting";
        enemyIntent.textContent = "No hostile signal";
        enemyHp.textContent = "0 / 0";
        enemyBar.style.width = "0%";
      }

      rollButtons.forEach((button) => {
        button.disabled = state.inRun || state.rolls <= 0;
      });
      startButton.disabled = state.inRun;
      startButton.textContent = state.wave === 0 ? "Start Run" : "Fight Next Wave";
      utilityButton.disabled = !state.inRun || state.utilityCharges <= 0;
      utilityButton.textContent = `Use Utility (${state.utilityCharges})`;
    };

    const spawnWave = () => {
      state.wave += 1;
      const isBossWave = state.wave % 5 === 0;
      state.enemies = isBossWave
        ? [createEnemy("boss", 0, state.wave)]
        : Array.from({ length: Math.min(6, 2 + Math.floor(state.wave / 2)) }, (_, index) => {
            if (state.wave >= 6 && index === 0) {
              return createEnemy("brute", index, state.wave);
            }
            if (state.wave >= 3 && index % 4 === 1) {
              return createEnemy("poison", index, state.wave);
            }
            if (index % 3 === 2 || (state.wave >= 4 && index === 0)) {
              return createEnemy("ranger", index, state.wave);
            }
            return createEnemy("mob", index, state.wave);
          });
      state.projectiles = [];
      state.veins = [];
      state.utilityCharges = state.utility.charges;
      state.player.attackCooldown = 0;
      state.droneTimer = 0;
      state.player.x = canvas.width * 0.2;
      state.player.y = canvas.height * 0.5;
      setStatus(isBossWave ? "Boss wave live // kite and survive" : "Wave live // move through the graph");
      logLine(isBossWave ? `Boss // ${state.enemies[0].name} breached the arena.` : `Wave ${state.wave} deployed ${state.enemies.length} hostiles.`);
      refreshUi();
    };

    const stopRun = () => {
      state.inRun = false;
      state.lastTime = 0;
      if (state.animationFrame) {
        window.cancelAnimationFrame(state.animationFrame);
        state.animationFrame = 0;
      }
      refreshUi();
    };

    const handleVictory = () => {
      const bossWave = state.wave % 5 === 0;
      const reward = 2 + (state.module.type === "loot" ? state.module.value : 0) + (bossWave ? 2 : 0);
      if (bossWave) {
        state.bossesCleared += 1;
      }
      state.rolls += reward;
      logLine(`Wave ${state.wave} cleared. +${reward} roll credits.`);
      setStatus(bossWave ? "Boss down // reroll and prep the next bracket" : "Wave cleared // reroll or press Start");
      state.enemies = [];
      state.projectiles = [];
      state.veins = [];
      stopRun();
    };

    const handleDefeat = () => {
      logLine("Operator down. Run lost.");
      setStatus("Run failed // rebuild and try again");
      state.enemies = [];
      state.projectiles = [];
      state.pickups = [];
      state.veins = [];
      stopRun();
    };

    const resetBuild = () => {
      stopRun();
      state.rolls = 6;
      state.wave = 0;
      state.bossesCleared = 0;
      state.level = 1;
      state.xp = 0;
      state.xpToNext = 40;
      state.weapon = weapons[0];
      state.utility = utilities[0];
      state.module = modules[0];
      state.player = {
        x: canvas.width * 0.22,
        y: canvas.height * 0.5,
        hp: 120,
        maxHp: 120,
        shield: 0,
        boost: 0,
        speed: 180,
        attackCooldown: 0,
        poisonTimer: 0,
        poisonTickTimer: 0,
      };
      state.enemies = [];
      state.projectiles = [];
      state.pickups = [];
      state.veins = [];
      state.utilityCharges = 1;
      state.droneTimer = 0;
      state.keys.clear();
      state.swingTimer = 0;
      log.innerHTML = "";
      setStatus("Roll your starter kit, then begin the run.");
      logLine("Draft credits restored.");
      refreshUi();
      draw();
    };

    const useUtility = () => {
      if (!state.inRun || state.utilityCharges <= 0) {
        return;
      }

      state.utilityCharges -= 1;

      if (state.utility.type === "heal") {
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + state.utility.power);
        logLine(`${state.utility.name} restored ${state.utility.power} HP.`);
      } else if (state.utility.type === "shield") {
        state.player.shield += state.utility.power;
        logLine(`${state.utility.name} granted ${state.utility.power} shield.`);
      } else if (state.utility.type === "boost") {
        state.player.boost = 5;
        logLine(`${state.utility.name} overclocked your damage.`);
      } else if (state.utility.type === "drone") {
        state.droneTimer = 8;
        logLine(`${state.utility.name} deployed a support drone.`);
      } else if (state.utility.type === "dash") {
        state.player.x = clamp(state.player.x + state.utility.power, arena.inset, arena.width - arena.inset);
        logLine(`${state.utility.name} blinked you forward.`);
      } else if (state.utility.type === "nova") {
        state.enemies.forEach((enemy) => {
          if (distance(state.player, enemy) <= 118) {
            enemy.hp -= state.utility.power;
          }
        });
        logLine(`${state.utility.name} crushed nearby targets.`);
      }

      refreshUi();
    };

    const gainXp = (amount) => {
      state.xp += amount;
      while (state.xp >= state.xpToNext) {
        state.xp -= state.xpToNext;
        state.level += 1;
        const previousMaxHp = state.player.maxHp;
        state.xpToNext = Math.round(state.xpToNext * 1.35 + 12);
        refreshUi();
        const maxGain = state.player.maxHp - previousMaxHp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + Math.max(18, maxGain));
        logLine(`Level up // operator rank ${state.level}. Max HP boosted.`);
      }
    };

    const dropPickups = (enemy) => {
      const xpDrops = enemy.kind === "Boss" ? 4 : 1;
      const healthDrops = enemy.kind === "Boss" ? 2 : 1;

      for (let index = 0; index < xpDrops; index += 1) {
        if (enemy.kind === "Boss" || Math.random() < 0.7) {
          state.pickups.push({
            type: "xp",
            x: enemy.x + (Math.random() - 0.5) * 30,
            y: enemy.y + (Math.random() - 0.5) * 30,
            radius: 9,
            value: (enemy.kind === "Boss" ? 18 : 10) + Math.round(state.wave * (enemy.kind === "Boss" ? 2.8 : 1.8)),
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }

      for (let index = 0; index < healthDrops; index += 1) {
        if (enemy.kind === "Boss" || Math.random() < 0.4) {
          state.pickups.push({
            type: "health",
            x: enemy.x + (Math.random() - 0.5) * 30,
            y: enemy.y + (Math.random() - 0.5) * 30,
            radius: 10,
            value: (enemy.kind === "Boss" ? 22 : 14) + Math.round(state.wave * (enemy.kind === "Boss" ? 2.2 : 1.5)),
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const updatePickups = (delta) => {
      state.pickups = state.pickups.filter((pickup) => {
        pickup.pulse += delta * 4;
        const dx = state.player.x - pickup.x;
        const dy = state.player.y - pickup.y;
        const gap = Math.hypot(dx, dy) || 1;

        if (gap < 88) {
          const pull = pickup.type === "xp" ? 180 : 156;
          pickup.x += dx / gap * pull * delta;
          pickup.y += dy / gap * pull * delta;
        }

        if (gap <= pickup.radius + 16) {
          if (pickup.type === "xp") {
            gainXp(pickup.value);
            logLine(`Collected ${pickup.value} XP.`);
          } else {
            const healed = Math.min(state.player.maxHp - state.player.hp, pickup.value);
            state.player.hp += healed;
            logLine(`Recovered ${healed} HP.`);
          }
          return false;
        }

        return true;
      });
    };

    const spawnVein = (x, y, radius = 34, duration = 6) => {
      state.veins.push({
        x: clamp(x, arena.inset + radius, arena.width - arena.inset - radius),
        y: clamp(y, arena.inset + radius, arena.height - arena.inset - radius),
        radius,
        duration,
        tickTimer: 0.45,
        pulse: Math.random() * Math.PI * 2,
      });
    };

    const updateVeins = (delta) => {
      state.veins = state.veins.filter((vein) => {
        vein.duration -= delta;
        vein.tickTimer -= delta;
        vein.pulse += delta * 5;

        if (distance(vein, state.player) <= vein.radius + 14 && vein.tickTimer <= 0) {
          let incoming = 7;
          if (state.player.shield > 0) {
            const absorbed = Math.min(state.player.shield, incoming);
            state.player.shield -= absorbed;
            incoming -= absorbed;
          }
          if (incoming > 0) {
            state.player.hp -= incoming;
            logLine(`Vein burst hit for ${incoming}.`);
          }
          vein.tickTimer = 0.6;
        }

        return vein.duration > 0;
      });
    };

    const updateMovement = (delta) => {
      let moveX = 0;
      let moveY = 0;

      if (state.keys.has("arrowleft") || state.keys.has("a")) {
        moveX -= 1;
      }
      if (state.keys.has("arrowright") || state.keys.has("d")) {
        moveX += 1;
      }
      if (state.keys.has("arrowup") || state.keys.has("w")) {
        moveY -= 1;
      }
      if (state.keys.has("arrowdown") || state.keys.has("s")) {
        moveY += 1;
      }

      const magnitude = Math.hypot(moveX, moveY) || 1;
      state.player.x += moveX / magnitude * state.player.speed * delta;
      state.player.y += moveY / magnitude * state.player.speed * delta;
      state.player.x = clamp(state.player.x, arena.inset, arena.width - arena.inset);
      state.player.y = clamp(state.player.y, arena.inset, arena.height - arena.inset);
    };

    const updateEnemies = (delta) => {
      const stats = computeStats();
      const primaryEnemy = getPrimaryEnemy();

      state.player.attackCooldown -= delta;
      state.targetPulse += delta * 4;

      if (state.player.boost > 0) {
        state.player.boost -= delta;
      }
      if (state.player.poisonTimer > 0) {
        state.player.poisonTimer -= delta;
        state.player.poisonTickTimer -= delta;
        if (state.player.poisonTickTimer <= 0) {
          state.player.hp -= 4;
          state.player.poisonTickTimer = 1;
          logLine("Poison tick for 4.");
        }
      } else {
        state.player.poisonTickTimer = 0;
      }
      if (state.swingTimer > 0) {
        state.swingTimer -= delta;
      }
      if (state.droneTimer > 0) {
        state.droneTimer -= delta;
      }

      updateVeins(delta);

      state.enemies.forEach((enemy) => {
        const dx = state.player.x - enemy.x;
        const dy = state.player.y - enemy.y;
        const gap = Math.hypot(dx, dy) || 1;

        if (enemy.kind === "Ranger" || enemy.kind === "Venom") {
          if (gap < enemy.preferredRange - 12) {
            enemy.x -= dx / gap * enemy.speed * delta;
            enemy.y -= dy / gap * enemy.speed * delta;
          } else if (gap > enemy.preferredRange + 18) {
            enemy.x += dx / gap * enemy.speed * delta;
            enemy.y += dy / gap * enemy.speed * delta;
          }
        } else if (gap > enemy.radius + 26) {
          enemy.x += dx / gap * enemy.speed * delta;
          enemy.y += dy / gap * enemy.speed * delta;
        }

        enemy.attackTimer -= delta;
        if (enemy.veinTimer > 0) {
          enemy.veinTimer -= delta;
        }

        if (enemy.kind === "Boss" && enemy.summonTimer > 0) {
          enemy.summonTimer -= delta;
        }

        if (enemy.kind === "Boss" && enemy.summonTimer <= 0 && state.enemies.length < 7) {
          enemy.summonTimer = 5.8;
          state.enemies.push(createEnemy("mob", state.enemies.length % 4, state.wave));
          logLine(`${enemy.name} summoned a fresh mob.`);
        }

        if ((enemy.kind === "Boss" || enemy.kind === "Venom") && enemy.veinTimer <= 0) {
          if (enemy.kind === "Boss") {
            spawnVein(state.player.x + (Math.random() - 0.5) * 90, state.player.y + (Math.random() - 0.5) * 90, 42, 7);
            enemy.veinTimer = 3.6;
            logLine(`${enemy.name} ruptured the floor.`);
          } else {
            spawnVein(enemy.x, enemy.y, 30, 5.2);
            enemy.veinTimer = 4.4;
          }
        }

        if (enemy.kind === "Ranger" && gap <= enemy.range && enemy.attackTimer <= 0) {
          enemy.attackTimer = enemy.attackCadence;
          const theta = angleTo(enemy, state.player);
          state.projectiles.push({
            x: enemy.x,
            y: enemy.y,
            vx: Math.cos(theta) * enemy.projectileSpeed,
            vy: Math.sin(theta) * enemy.projectileSpeed,
            damage: enemy.damage,
            from: "enemy",
            life: 1.5,
            color: "#ff88d0",
          });
        } else if (enemy.kind === "Venom" && gap <= enemy.range && enemy.attackTimer <= 0) {
          enemy.attackTimer = enemy.attackCadence;
          const theta = angleTo(enemy, state.player);
          state.projectiles.push({
            x: enemy.x,
            y: enemy.y,
            vx: Math.cos(theta) * enemy.projectileSpeed,
            vy: Math.sin(theta) * enemy.projectileSpeed,
            damage: enemy.damage,
            poison: enemy.poison,
            from: "enemy",
            life: 1.55,
            color: "#7dff7a",
          });
        } else if (gap <= enemy.radius + 32 && enemy.attackTimer <= 0) {
          enemy.attackTimer = enemy.attackCadence;
          let incoming = enemy.damage;

          if (state.player.shield > 0) {
            const absorbed = Math.min(state.player.shield, incoming);
            state.player.shield -= absorbed;
            incoming -= absorbed;
            if (absorbed > 0) {
              logLine(`Shield absorbed ${absorbed}.`);
            }
          }

          if (incoming > 0) {
            state.player.hp -= incoming;
            logLine(`${enemy.name} hit for ${incoming}.`);
            if (enemy.kind === "Venom") {
              state.player.poisonTimer = Math.max(state.player.poisonTimer, 4);
              state.player.poisonTickTimer = 1;
              logLine("Poisoned // recover a health orb.");
            }
          }
        }
      });

      if (primaryEnemy && state.player.attackCooldown <= 0 && distance(state.player, primaryEnemy) <= stats.range) {
        let damage = stats.attackBase;
        const strikeAngle = angleTo(state.player, primaryEnemy);
        if (Math.random() < state.weapon.crit) {
          damage *= 1.7;
          logLine(`${state.weapon.name} crit for ${Math.round(damage)}.`);
        }
        if (state.player.boost > 0) {
          damage *= state.utility.power || 1.2;
        }
        if (state.module.type === "boss" && primaryEnemy.kind === "Boss") {
          damage *= state.module.value;
        }

        if (state.weapon.style === "blade") {
          state.swingTimer = 0.18;
          state.swingAngle = strikeAngle;
          state.enemies.forEach((enemy) => {
            if (distance(state.player, enemy) <= stats.range + 18) {
              const arcGap = Math.abs(Math.atan2(Math.sin(angleTo(state.player, enemy) - strikeAngle), Math.cos(angleTo(state.player, enemy) - strikeAngle)));
              if (arcGap <= 0.8) {
                enemy.hp -= damage;
              }
            }
          });
        } else {
          primaryEnemy.hp -= damage;
        }

        state.player.attackCooldown = 1 / stats.attackRate;
      }

      if (state.droneTimer > 0 && primaryEnemy) {
        primaryEnemy.hp -= state.utility.power * delta * 1.6;
      }

      state.projectiles = state.projectiles.filter((projectile) => {
        projectile.x += projectile.vx * delta;
        projectile.y += projectile.vy * delta;
        projectile.life -= delta;

        if (
          projectile.x < arena.inset ||
          projectile.x > arena.width - arena.inset ||
          projectile.y < arena.inset ||
          projectile.y > arena.height - arena.inset ||
          projectile.life <= 0
        ) {
          return false;
        }

        if (projectile.from === "enemy" && distance(projectile, state.player) <= 22) {
          let incoming = projectile.damage;
          if (state.player.shield > 0) {
            const absorbed = Math.min(state.player.shield, incoming);
            state.player.shield -= absorbed;
            incoming -= absorbed;
          }
          if (incoming > 0) {
            state.player.hp -= incoming;
            logLine(`Ranged hit for ${incoming}.`);
            if (projectile.poison) {
              state.player.poisonTimer = Math.max(state.player.poisonTimer, 4.5);
              state.player.poisonTickTimer = 1;
              logLine("Toxic hit // poison applied.");
            }
          }
          return false;
        }

        return true;
      });

      const survivors = [];
      state.enemies.forEach((enemy) => {
        if (enemy.hp > 0) {
          survivors.push(enemy);
        } else {
          dropPickups(enemy);
          logLine(`${enemy.name} deleted from the graph.`);
        }
      });
      state.enemies = survivors;
      updatePickups(delta);

      if (state.player.hp <= 0) {
        handleDefeat();
        return;
      }

      if (!state.enemies.length) {
        handleVictory();
        return;
      }

      refreshUi();
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0d1a25";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(64, 230, 255, 0.08)";
      ctx.fillRect(arena.inset, arena.inset, arena.width - arena.inset * 2, arena.height - arena.inset * 2);

      ctx.strokeStyle = "rgba(92, 255, 222, 0.12)";
      ctx.lineWidth = 1;
      for (let col = 0; col <= arena.cols; col += 1) {
        const x = col * arena.tileW;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, arena.height);
        ctx.stroke();
      }

      for (let row = 0; row <= arena.rows; row += 1) {
        const y = row * arena.tileH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(arena.width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255, 0, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(arena.inset, arena.inset, arena.width - arena.inset * 2, arena.height - arena.inset * 2);
    };

    const draw = () => {
      drawGrid();

      const primaryEnemy = getPrimaryEnemy();
      const stats = computeStats();

      if (state.inRun) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 136, 0.08)";
        ctx.lineWidth = 1.5;
        ctx.arc(state.player.x, state.player.y, stats.range, 0, Math.PI * 2);
        ctx.stroke();
      }

      state.veins.forEach((vein) => {
        const pulseRadius = vein.radius + Math.sin(vein.pulse) * 3;
        const gradient = ctx.createRadialGradient(vein.x, vein.y, 4, vein.x, vein.y, pulseRadius);
        gradient.addColorStop(0, "rgba(255, 70, 120, 0.45)");
        gradient.addColorStop(0.65, "rgba(165, 20, 84, 0.26)");
        gradient.addColorStop(1, "rgba(165, 20, 84, 0)");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(vein.x, vein.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 85, 145, 0.72)";
        ctx.lineWidth = 2;
        ctx.arc(vein.x, vein.y, pulseRadius - 3, 0, Math.PI * 2);
        ctx.stroke();
      });

      state.enemies.forEach((enemy) => {
        const isPrimary = primaryEnemy === enemy;
        ctx.beginPath();
        ctx.fillStyle =
          enemy.kind === "Boss"
            ? "#ff00ff"
            : enemy.kind === "Ranger"
              ? "#ffd166"
              : enemy.kind === "Venom"
                ? "#7dff7a"
                : enemy.kind === "Brute"
                  ? "#ff8a42"
                  : "#ff4d88";
        ctx.shadowBlur = enemy.kind === "Boss" ? 26 : 16;
        ctx.shadowColor = ctx.fillStyle;
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#0a0a0f";
        ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 14, enemy.radius * 2, 6);
        ctx.fillStyle = "#ff779f";
        ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 14, enemy.radius * 2 * clamp(enemy.hp / enemy.maxHp, 0, 1), 6);

        if (isPrimary) {
          const pulse = 6 + Math.sin(state.targetPulse * 4) * 2;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 2;
          ctx.strokeRect(enemy.x - enemy.radius - pulse, enemy.y - enemy.radius - pulse, enemy.radius * 2 + pulse * 2, enemy.radius * 2 + pulse * 2);
        }
      });

      state.pickups.forEach((pickup) => {
        const pulseRadius = pickup.radius + Math.sin(pickup.pulse) * 1.5;
        ctx.beginPath();
        ctx.fillStyle = pickup.type === "xp" ? "#9e7dff" : "#00ff88";
        ctx.shadowBlur = 18;
        ctx.shadowColor = ctx.fillStyle;
        ctx.arc(pickup.x, pickup.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.strokeStyle = pickup.type === "xp" ? "rgba(158, 125, 255, 0.8)" : "rgba(0, 255, 136, 0.8)";
        ctx.lineWidth = 2;
        ctx.arc(pickup.x, pickup.y, pulseRadius + 5, 0, Math.PI * 2);
        ctx.stroke();
      });

      state.projectiles.forEach((projectile) => {
        ctx.beginPath();
        ctx.fillStyle = projectile.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = projectile.color;
        ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (state.droneTimer > 0) {
        ctx.beginPath();
        ctx.fillStyle = "#00d4ff";
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#00d4ff";
        ctx.arc(state.player.x + 24, state.player.y - 24, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = "#00d4ff";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00d4ff";
      ctx.fillRect(state.player.x - 16, state.player.y - 16, 32, 32);
      ctx.shadowBlur = 0;

      if (state.swingTimer > 0) {
        ctx.beginPath();
        ctx.strokeStyle = state.weapon.rarity === "Divine" ? "rgba(255, 240, 180, 0.95)" : "rgba(0, 212, 255, 0.9)";
        ctx.lineWidth = 8;
        ctx.arc(state.player.x, state.player.y, stats.range * 0.65, state.swingAngle - 0.65, state.swingAngle + 0.65);
        ctx.stroke();
      }

      if (state.player.shield > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
        ctx.lineWidth = 3;
        ctx.arc(state.player.x, state.player.y, 24, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (state.player.poisonTimer > 0) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(125, 255, 122, 0.9)";
        ctx.lineWidth = 3;
        ctx.arc(state.player.x, state.player.y, 30, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "#e6faff";
      ctx.font = '12px "Share Tech Mono", monospace';
      ctx.fillText(`X ${Math.round(state.player.x)}  Y ${Math.round(state.player.y)}`, 18, 22);
      ctx.fillText(`Hostiles ${state.enemies.length}`, 18, 40);
      ctx.fillText(`LV ${state.level} // XP ${state.xp}/${state.xpToNext}`, 18, 58);
    };

    const animate = (timestamp) => {
      if (!state.inRun) {
        draw();
        return;
      }

      if (!state.lastTime) {
        state.lastTime = timestamp;
      }

      const delta = Math.min((timestamp - state.lastTime) / 1000, 0.05);
      state.lastTime = timestamp;

      updateMovement(delta);
      updateEnemies(delta);
      draw();

      if (state.inRun) {
        state.animationFrame = window.requestAnimationFrame(animate);
      }
    };

    rollButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (state.inRun || state.rolls <= 0) {
          return;
        }

        state.rolls -= 1;
        const type = button.dataset.rollType;

        if (type === "weapon") {
          state.weapon = randomItem(weapons);
          logLine(`Rolled weapon: ${state.weapon.name}.`);
        } else if (type === "utility") {
          state.utility = randomItem(utilities);
          logLine(`Rolled utility: ${state.utility.name}.`);
        } else {
          state.module = randomItem(modules);
          logLine(`Rolled module: ${state.module.name}.`);
        }

        refreshUi();
        draw();
      });
    });

    startButton.addEventListener("click", () => {
      if (state.inRun) {
        return;
      }

      spawnWave();
      state.inRun = true;
      state.lastTime = 0;
      refreshUi();
      draw();
      state.animationFrame = window.requestAnimationFrame(animate);
    });

    utilityButton.addEventListener("click", () => {
      useUtility();
      draw();
    });

    resetButton.addEventListener("click", () => {
      resetBuild();
    });

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " ", "enter"].includes(key)) {
        event.preventDefault();
      }
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        state.keys.add(key);
      }
      if ((key === " " || key === "enter") && state.inRun) {
        useUtility();
      }
    });

    window.addEventListener("keyup", (event) => {
      state.keys.delete(event.key.toLowerCase());
    });

    resetBuild();
    renderRates();
  }
}
