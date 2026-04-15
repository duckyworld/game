const snakePage = document.body.dataset.page === "game-01";

if (snakePage) {
  const canvas = document.querySelector("[data-snake-canvas]");
  const scoreOutput = document.querySelector("[data-snake-score]");
  const statusOutput = document.querySelector("[data-snake-status]");
  const overlay = document.querySelector("[data-snake-overlay]");
  const overlayTitle = document.querySelector("[data-snake-overlay-title]");
  const overlayCopy = document.querySelector("[data-snake-overlay-copy]");
  const restartButton = document.querySelector("[data-snake-restart]");
  const modeButtons = document.querySelectorAll("[data-snake-mode]");

  if (
    canvas &&
    scoreOutput &&
    statusOutput &&
    overlay &&
    overlayTitle &&
    overlayCopy &&
    restartButton &&
    modeButtons.length
  ) {
    const context = canvas.getContext("2d");
    const gridSize = 24;
    const tileCount = canvas.width / gridSize;
    const backgroundLayer = document.createElement("canvas");
    const backgroundContext = backgroundLayer.getContext("2d");
    const modeConfig = {
      normal: {
        stepMs: 110,
        rocks: 0,
        eagle: false,
      },
      hard: {
        stepMs: 78,
        rocks: 10,
        eagle: true,
        eagleStepMs: 150,
        eagleSpawnMin: 4000,
        eagleSpawnMax: 8500,
      },
    };

    backgroundLayer.width = canvas.width;
    backgroundLayer.height = canvas.height;
    context.imageSmoothingEnabled = false;

    let mode = "normal";
    let snake = [];
    let previousSnake = [];
    let direction = { x: 1, y: 0 };
    let pendingDirection = { x: 1, y: 0 };
    let apple = { x: 0, y: 0 };
    let rocks = [];
    let score = 0;
    let gameStarted = false;
    let isGameOver = false;
    let isRespawning = false;
    let lastTick = 0;
    let respawnTimeoutId = 0;
    let respawnIntervalId = 0;
    let eagle = {
      active: false,
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      lastMove: 0,
      nextSpawnAt: 0,
    };

    const getConfig = () => modeConfig[mode];
    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const randomCell = () => ({
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    });
    const cellsEqual = (a, b) => a.x === b.x && a.y === b.y;
    const cellInSnake = (cell) => snake.some((segment) => cellsEqual(segment, cell));
    const cellInRocks = (cell) => rocks.some((rock) => cellsEqual(rock, cell));
    const eagleOccupies = (cell) =>
      eagle.active && eagle.x === cell.x && eagle.y === cell.y;
    const cellBlocked = (cell) => cellInSnake(cell) || cellInRocks(cell) || eagleOccupies(cell);

    const updateScore = () => {
      scoreOutput.textContent = String(score);
    };

    const getSafeStartDirection = (nextDirection) => {
      if (!nextDirection) {
        return direction;
      }

      const reversingAtSpawn =
        nextDirection.x === -direction.x &&
        nextDirection.y === -direction.y;

      return reversingAtSpawn ? direction : nextDirection;
    };

    const clearRespawnCountdown = () => {
      if (respawnTimeoutId) {
        window.clearTimeout(respawnTimeoutId);
        respawnTimeoutId = 0;
      }

      if (respawnIntervalId) {
        window.clearInterval(respawnIntervalId);
        respawnIntervalId = 0;
      }
    };

    const setStatus = (message) => {
      statusOutput.textContent = message;
    };

    const updateModeButtons = () => {
      modeButtons.forEach((button) => {
        const isActive = button.dataset.snakeMode === mode;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    };

    const showOverlay = (title, copy, buttonLabel = "", showButton = false) => {
      overlayTitle.textContent = title;
      overlayCopy.textContent = copy;
      restartButton.textContent = buttonLabel;
      restartButton.classList.toggle("is-visually-hidden", !showButton);
      overlay.classList.remove("is-hidden");
    };

    const hideOverlay = () => {
      overlay.classList.add("is-hidden");
    };

    const scheduleNextEagle = (timestamp = 0) => {
      const config = getConfig();

      if (!config.eagle) {
        eagle.nextSpawnAt = Number.POSITIVE_INFINITY;
        return;
      }

      eagle.nextSpawnAt =
        timestamp + randomBetween(config.eagleSpawnMin, config.eagleSpawnMax);
    };

    const placeApple = () => {
      let nextApple = randomCell();

      while (cellBlocked(nextApple)) {
        nextApple = randomCell();
      }

      apple = nextApple;
    };

    const placeRocks = () => {
      const config = getConfig();
      rocks = [];
      let attempts = 0;

      const blockedByWallsOrRocks = (x, y, draftRocks) => {
        if (x < 0 || x >= tileCount || y < 0 || y >= tileCount) {
          return true;
        }

        return draftRocks.some((rock) => rock.x === x && rock.y === y);
      };

      const createsDeadEnds = (draftRocks) => {
        for (let y = 0; y < tileCount; y += 1) {
          for (let x = 0; x < tileCount; x += 1) {
            const isRock = draftRocks.some((rock) => rock.x === x && rock.y === y);

            if (isRock) {
              continue;
            }

            const exits = [
              { x: x + 1, y },
              { x: x - 1, y },
              { x, y: y + 1 },
              { x, y: y - 1 },
            ].filter((neighbor) => !blockedByWallsOrRocks(neighbor.x, neighbor.y, draftRocks)).length;

            if (exits <= 1) {
              return true;
            }
          }
        }

        return false;
      };

      while (rocks.length < config.rocks && attempts < 800) {
        attempts += 1;
        const candidate = randomCell();

        if (
          cellInSnake(candidate) ||
          cellInRocks(candidate) ||
          (candidate.x >= 6 && candidate.x <= 11 && candidate.y >= 8 && candidate.y <= 12)
        ) {
          continue;
        }

        const nextRocks = [...rocks, candidate];

        if (createsDeadEnds(nextRocks)) {
          continue;
        }

        rocks = nextRocks;
      }
    };

    const spawnEagle = (timestamp) => {
      let attempts = 0;
      let spawn;

      do {
        const edge = Math.floor(Math.random() * 4);
        spawn =
          edge === 0
            ? { x: 0, y: Math.floor(Math.random() * tileCount) }
            : edge === 1
              ? { x: tileCount - 1, y: Math.floor(Math.random() * tileCount) }
              : edge === 2
                ? { x: Math.floor(Math.random() * tileCount), y: 0 }
                : { x: Math.floor(Math.random() * tileCount), y: tileCount - 1 };
        attempts += 1;
      } while (
        attempts < 20 &&
        (cellInRocks(spawn) || cellInSnake(spawn) || cellsEqual(spawn, apple))
      );

      if (cellInRocks(spawn) || cellInSnake(spawn) || cellsEqual(spawn, apple)) {
        scheduleNextEagle(timestamp + 1000);
        return;
      }

      eagle.active = true;
      eagle.x = spawn.x;
      eagle.y = spawn.y;
      eagle.prevX = spawn.x;
      eagle.prevY = spawn.y;
      eagle.lastMove = timestamp;
      setStatus("Threat detected // eagle inbound");
    };

    const resetGame = () => {
      clearRespawnCountdown();
      snake = [
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
      ];
      previousSnake = snake.map((segment) => ({ ...segment }));
      direction = { x: 1, y: 0 };
      pendingDirection = { x: 1, y: 0 };
      score = 0;
      gameStarted = false;
      isGameOver = false;
      isRespawning = false;
      lastTick = 0;
      eagle = {
        active: false,
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        lastMove: 0,
        nextSpawnAt: 0,
      };

      placeRocks();
      placeApple();
      scheduleNextEagle(performance.now());
      updateScore();
      updateModeButtons();
      setStatus(
        mode === "hard"
          ? "Hard mode armed // rocks loaded, eagle on watch"
          : "Press any arrow key to begin"
      );
      showOverlay(
        mode === "hard" ? "Hard mode standby" : "Snake.exe standby",
        mode === "hard"
          ? "Press any arrow key to start hard mode. Rocks, a faster snake, and a hunting eagle are active."
          : "Press any arrow key to start.",
        "",
        false
      );
      draw();
    };

    const launchRun = () => {
      gameStarted = true;
      isGameOver = false;
      isRespawning = false;
      lastTick = 0;
      hideOverlay();
      setStatus(
        mode === "hard"
          ? "Hard mode active // stay ahead of the eagle"
          : "Run active // collect apples"
      );

      if (getConfig().eagle && !eagle.active) {
        scheduleNextEagle(performance.now());
      }
    };

    const drawCell = (x, y, fillStyle, glowStyle, inset = 2) => {
      const px = x * gridSize + inset;
      const py = y * gridSize + inset;
      const size = gridSize - inset * 2;

      context.fillStyle = fillStyle;
      context.shadowBlur = 12;
      context.shadowColor = glowStyle;
      context.fillRect(px, py, size, size);
      context.shadowBlur = 0;
    };

    const buildGridLayer = () => {
      backgroundContext.clearRect(0, 0, canvas.width, canvas.height);
      backgroundContext.fillStyle = "rgba(4, 14, 10, 0.98)";
      backgroundContext.fillRect(0, 0, canvas.width, canvas.height);

      backgroundContext.strokeStyle = "rgba(0, 255, 136, 0.09)";
      backgroundContext.lineWidth = 1;

      for (let line = 0; line <= tileCount; line += 1) {
        const offset = line * gridSize + 0.5;
        backgroundContext.beginPath();
        backgroundContext.moveTo(offset, 0);
        backgroundContext.lineTo(offset, canvas.height);
        backgroundContext.stroke();

        backgroundContext.beginPath();
        backgroundContext.moveTo(0, offset);
        backgroundContext.lineTo(canvas.width, offset);
        backgroundContext.stroke();
      }
    };

    const interpolateSegment = (from, to, alpha) => ({
      x: from.x + (to.x - from.x) * alpha,
      y: from.y + (to.y - from.y) * alpha,
    });

    const drawRocks = () => {
      rocks.forEach((rock) => {
        drawCell(rock.x, rock.y, "#7f8c8d", "rgba(160, 171, 173, 0.4)", 3);
      });
    };

    const drawEagle = (alpha, now) => {
      if (!eagle.active) {
        return;
      }

      const config = getConfig();
      const stepWindow = config.eagleStepMs || 1;
      const progress = Math.min((now - eagle.lastMove) / stepWindow, 1);
      const eagleAlpha = Math.max(alpha, progress);
      const position = interpolateSegment(
        { x: eagle.prevX, y: eagle.prevY },
        { x: eagle.x, y: eagle.y },
        eagleAlpha
      );

      drawCell(position.x, position.y, "#ffd166", "rgba(255, 209, 102, 0.7)", 1);
    };

    const draw = (alpha = 1, now = 0) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(backgroundLayer, 0, 0);

      drawRocks();
      drawCell(apple.x, apple.y, "#ff3366", "rgba(255, 51, 102, 0.8)");

      snake.forEach((segment, index) => {
        const isHead = index === 0;
        const fromSegment =
          previousSnake[index] ??
          previousSnake[previousSnake.length - 1] ??
          segment;
        const interpolated = interpolateSegment(fromSegment, segment, alpha);

        drawCell(
          interpolated.x,
          interpolated.y,
          isHead ? "#00ff88" : "#00d4ff",
          isHead ? "rgba(0, 255, 136, 0.8)" : "rgba(0, 212, 255, 0.65)"
        );
      });

      drawEagle(alpha, now);
    };

    const endGame = (reason) => {
      isGameOver = true;
      gameStarted = false;

      const details =
        reason === "rock"
          ? "The snake hit a rock."
          : reason === "eagle"
            ? "The eagle caught the snake."
            : "The snake crashed into forbidden space.";

      setStatus(`Signal lost // ${details}`);
      showOverlay(
        "Run terminated",
        `Final score: ${score}. ${details} Ready for another run?`,
        "Try Again",
        true
      );
      draw(1, performance.now());
    };

    const startRespawn = (nextDirection = null) => {
      if (isRespawning) {
        return;
      }

      isRespawning = true;
      restartButton.classList.add("is-visually-hidden");
      let countdown = 2;

      showOverlay(
        "Respawning",
        `New run starts in ${countdown}...`,
        "",
        false
      );
      setStatus("Reinitializing snake runtime...");

      respawnIntervalId = window.setInterval(() => {
        countdown -= 1;

        if (countdown > 0) {
          overlayCopy.textContent = `New run starts in ${countdown}...`;
        }
      }, 1000);

      respawnTimeoutId = window.setTimeout(() => {
        clearRespawnCountdown();
        resetGame();

        if (nextDirection) {
          pendingDirection = getSafeStartDirection(nextDirection);
        }

        launchRun();
      }, 2000);
    };

    const moveEagle = (timestamp) => {
      if (!eagle.active || isGameOver) {
        return;
      }

      eagle.prevX = eagle.x;
      eagle.prevY = eagle.y;

      const target = snake[0];
      const dx = target.x - eagle.x;
      const dy = target.y - eagle.y;

      if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) {
        eagle.x += Math.sign(dx);
      } else if (dy !== 0) {
        eagle.y += Math.sign(dy);
      } else if (dx !== 0) {
        eagle.x += Math.sign(dx);
      }

      eagle.lastMove = timestamp;

      const hitRock = cellInRocks(eagle);
      const hitSnake = snake.some((segment) => cellsEqual(segment, eagle));

      if (hitRock) {
        eagle.active = false;
        scheduleNextEagle(timestamp);
        setStatus("Threat evaded // eagle broke off near the rocks");
        return;
      }

      if (hitSnake) {
        endGame("eagle");
      }
    };

    const tick = () => {
      previousSnake = snake.map((segment) => ({ ...segment }));
      direction = pendingDirection;

      const nextHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };
      const willEatApple = cellsEqual(nextHead, apple);
      const bodyToCheck = willEatApple ? snake : snake.slice(0, -1);

      const hitWall =
        nextHead.x < 0 ||
        nextHead.x >= tileCount ||
        nextHead.y < 0 ||
        nextHead.y >= tileCount;

      const hitSelf = bodyToCheck.some((segment) => cellsEqual(segment, nextHead));
      const hitRock = cellInRocks(nextHead);
      const hitEagle = eagle.active && cellsEqual(nextHead, eagle);

      if (hitWall || hitSelf) {
        endGame("crash");
        return;
      }

      if (hitRock) {
        endGame("rock");
        return;
      }

      if (hitEagle) {
        endGame("eagle");
        return;
      }

      snake.unshift(nextHead);

      if (willEatApple) {
        score += 1;
        updateScore();
        setStatus(
          mode === "hard"
            ? `Apple captured // score ${score} // stay alert`
            : `Apple captured // score ${score}`
        );
        placeApple();
      } else {
        snake.pop();
      }
    };

    const loop = (timestamp) => {
      if (gameStarted && !isGameOver) {
        const config = getConfig();

        if (!lastTick) {
          lastTick = timestamp;
        }

        while (timestamp - lastTick >= config.stepMs) {
          tick();
          lastTick += config.stepMs;

          if (isGameOver) {
            break;
          }
        }

        if (
          config.eagle &&
          !eagle.active &&
          timestamp >= eagle.nextSpawnAt
        ) {
          spawnEagle(timestamp);
        }

        if (
          config.eagle &&
          eagle.active &&
          timestamp - eagle.lastMove >= config.eagleStepMs
        ) {
          moveEagle(timestamp);
        }

        const alpha = Math.min((timestamp - lastTick) / config.stepMs, 1);
        draw(alpha, timestamp);
      }

      window.requestAnimationFrame(loop);
    };

    const controls = {
      ArrowUp: { x: 0, y: -1 },
      KeyW: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      KeyS: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      KeyA: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      KeyD: { x: 1, y: 0 },
    };

    window.addEventListener("keydown", (event) => {
      const nextDirection = controls[event.code];

      if (!nextDirection) {
        return;
      }

      event.preventDefault();

      if (isGameOver || isRespawning) {
        if (isGameOver) {
          startRespawn(nextDirection);
        }
        return;
      }

      if (!gameStarted) {
        pendingDirection = getSafeStartDirection(nextDirection);
        launchRun();
        return;
      }

      const reversing =
        nextDirection.x === -pendingDirection.x &&
        nextDirection.y === -pendingDirection.y;

      if (reversing) {
        return;
      }

      pendingDirection = nextDirection;
    });

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextMode = button.dataset.snakeMode;

        if (!nextMode || nextMode === mode) {
          return;
        }

        mode = nextMode;
        resetGame();
      });
    });

    restartButton.addEventListener("click", () => {
      if (isGameOver) {
        startRespawn();
      }
    });

    buildGridLayer();
    resetGame();
    window.requestAnimationFrame(loop);
  }
}
