const cubePage = document.body.dataset.page === "game-03";

if (cubePage) {
  const canvas = document.querySelector("[data-cube-canvas]");
  const statusOutput = document.querySelector("[data-cube-status]");
  const levelOutput = document.querySelector("[data-cube-level]");
  const movesOutput = document.querySelector("[data-cube-moves]");
  const overlay = document.querySelector("[data-cube-overlay]");
  const overlayTitle = document.querySelector("[data-cube-overlay-title]");
  const overlayCopy = document.querySelector("[data-cube-overlay-copy]");
  const actionButton = document.querySelector("[data-cube-action]");

  if (
    canvas &&
    statusOutput &&
    levelOutput &&
    movesOutput &&
    overlay &&
    overlayTitle &&
    overlayCopy &&
    actionButton
  ) {
    const context = canvas.getContext("2d");
    const tileSize = 70;
    const offset = 35;

    const levels = [
      [
        "########",
        "#......#",
        "#.P.BT.#",
        "#......#",
        "#..B.T.#",
        "#......#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#..T...#",
        "#.P.B..#",
        "#......#",
        "#..B...#",
        "#....T.#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#..T...#",
        "#.P.B..#",
        "#......#",
        "#..B.T.#",
        "#..B...#",
        "#....T.#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#..T...#",
        "#.P.B..#",
        "#...B..#",
        "#..T...#",
        "#...B.T#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#......#",
        "#.P.BT.#",
        "#..#...#",
        "#..B...#",
        "#..#.T.#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#..T...#",
        "#..B...#",
        "#.P...B#",
        "#...T..#",
        "#......#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#.T...T#",
        "#.P.B..#",
        "#......#",
        "#..B.B.#",
        "#......#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#......#",
        "#.P.B..#",
        "#..#T..#",
        "#..B...#",
        "#..#T..#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#..T...#",
        "#.P.B..#",
        "#......#",
        "#..B...#",
        "#...B.T#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#.T...T#",
        "#.P.B..#",
        "#......#",
        "#..B...#",
        "#...B..#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#..T...#",
        "#..B...#",
        "#.P.B..#",
        "#...T..#",
        "#...B..#",
        "#....E.#",
        "########",
      ],
      [
        "########",
        "#.T...T#",
        "#.P.B..#",
        "#..#...#",
        "#..B...#",
        "#..#.BT#",
        "#....E.#",
        "########",
      ],
    ];

    let levelIndex = 0;
    let board = [];
    let player = { x: 0, y: 0 };
    let blocks = [];
    let targets = [];
    let exit = { x: 0, y: 0 };
    let moves = 0;
    let gameStarted = false;
    let levelSolved = false;
    let autoResetTimeoutId = 0;

    const setStatus = (message) => {
      statusOutput.textContent = message;
    };

    const setOverlay = (title, copy, buttonLabel) => {
      overlayTitle.textContent = title;
      overlayCopy.textContent = copy;
      actionButton.textContent = buttonLabel;
      overlay.classList.remove("is-hidden");
    };

    const hideOverlay = () => {
      overlay.classList.add("is-hidden");
    };

    const blockAt = (x, y) => blocks.find((block) => block.x === x && block.y === y);
    const targetAt = (x, y) => targets.some((target) => target.x === x && target.y === y);
    const exitUnlocked = () =>
      targets.every((target) => blockAt(target.x, target.y));
    const isWall = (x, y) => board[y]?.[x] === "#" || typeof board[y]?.[x] === "undefined";
    const isSolidForDeadlock = (x, y, ignoreBlock) => {
      if (isWall(x, y)) {
        return true;
      }

      return blocks.some(
        (block) => block !== ignoreBlock && block.x === x && block.y === y && !targetAt(block.x, block.y)
      );
    };

    const clearAutoResetTimeout = () => {
      if (autoResetTimeoutId) {
        window.clearTimeout(autoResetTimeoutId);
        autoResetTimeoutId = 0;
      }
    };

    const hasCornerDeadlock = () =>
      blocks.some((block) => {
        if (targetAt(block.x, block.y)) {
          return false;
        }

        const up = isSolidForDeadlock(block.x, block.y - 1, block);
        const down = isSolidForDeadlock(block.x, block.y + 1, block);
        const left = isSolidForDeadlock(block.x - 1, block.y, block);
        const right = isSolidForDeadlock(block.x + 1, block.y, block);

        return (up && left) || (up && right) || (down && left) || (down && right);
      });

    const autoRestartLevel = () => {
      clearAutoResetTimeout();
      resetLevel();
      setOverlay(
        `Cube Escape // level ${levelIndex + 1}`,
        "Deadlock detected. The puzzle was reset for you, so try a different route.",
        "Restart Puzzle"
      );
      setStatus("Deadlock detected // puzzle reset");
    };

    const parseLevel = () => {
      const source = levels[levelIndex];
      board = source.map((row) => row.split(""));
      blocks = [];
      targets = [];
      moves = 0;
      levelSolved = false;

      source.forEach((row, y) => {
        row.split("").forEach((cell, x) => {
          if (cell === "P") {
            player = { x, y };
            board[y][x] = ".";
          } else if (cell === "B") {
            blocks.push({ x, y });
            board[y][x] = ".";
          } else if (cell === "T") {
            targets.push({ x, y });
            board[y][x] = ".";
          } else if (cell === "E") {
            exit = { x, y };
            board[y][x] = ".";
          }
        });
      });

      levelOutput.textContent = String(levelIndex + 1);
      movesOutput.textContent = "0";
      setStatus("Use arrow keys or WASD to move the cube.");
      draw();
    };

    const resetLevel = () => {
      clearAutoResetTimeout();
      parseLevel();
      gameStarted = false;
      setOverlay(
        `Cube Escape // level ${levelIndex + 1}`,
        "Use arrow keys or WASD to move. Push every block onto a pressure plate, then reach the exit.",
        "Start Puzzle"
      );
    };

    const drawTile = (x, y, fill) => {
      const px = offset + x * tileSize;
      const py = offset + y * tileSize;

      context.fillStyle = fill;
      context.fillRect(px, py, tileSize - 4, tileSize - 4);
      context.strokeStyle = "rgba(255,255,255,0.08)";
      context.lineWidth = 2;
      context.strokeRect(px + 1, py + 1, tileSize - 6, tileSize - 6);
    };

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#081119";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgba(0,212,255,0.28)";
      context.lineWidth = 4;
      context.strokeRect(offset - 10, offset - 10, board[0].length * tileSize - 8, board.length * tileSize - 8);

      for (let y = 0; y < board.length; y += 1) {
        for (let x = 0; x < board[y].length; x += 1) {
          const wall = board[y][x] === "#";

          drawTile(x, y, wall ? "#18232f" : "#0d1d28");

          if (wall) {
            context.strokeStyle = "rgba(255,255,255,0.18)";
            context.lineWidth = 3;
            context.strokeRect(offset + x * tileSize + 4, offset + y * tileSize + 4, tileSize - 12, tileSize - 12);
          }

          if (targetAt(x, y)) {
            context.strokeStyle = "rgba(0,255,136,0.82)";
            context.lineWidth = 3;
            context.strokeRect(offset + x * tileSize + 14, offset + y * tileSize + 14, tileSize - 32, tileSize - 32);
          }

          if (exit.x === x && exit.y === y) {
            context.fillStyle = exitUnlocked() ? "rgba(0,255,136,0.28)" : "rgba(255,0,255,0.16)";
            context.fillRect(offset + x * tileSize + 12, offset + y * tileSize + 12, tileSize - 28, tileSize - 28);
          }
        }
      }

      blocks.forEach((block) => {
        context.fillStyle = targetAt(block.x, block.y) ? "#00ff88" : "#00d4ff";
        context.shadowBlur = 18;
        context.shadowColor = targetAt(block.x, block.y) ? "rgba(0,255,136,0.5)" : "rgba(0,212,255,0.45)";
        context.fillRect(offset + block.x * tileSize + 14, offset + block.y * tileSize + 14, tileSize - 32, tileSize - 32);
        context.shadowBlur = 0;
      });

      context.fillStyle = "#ffffff";
      context.shadowBlur = 20;
      context.shadowColor = "rgba(255,255,255,0.45)";
      context.fillRect(offset + player.x * tileSize + 18, offset + player.y * tileSize + 18, tileSize - 40, tileSize - 40);
      context.shadowBlur = 0;
    };

    const finishLevel = () => {
      levelSolved = true;
      gameStarted = false;

      if (levelIndex === levels.length - 1) {
        setStatus("Escape complete // all puzzle sectors cleared");
        setOverlay(
          "Cube escaped",
          `You cleared all ${levels.length} puzzle sectors in ${moves} moves on the final level.`,
          "Replay From Level 1"
        );
      } else {
        setStatus("Sector unlocked // advancing to the next puzzle");
        setOverlay(
          "Escape route open",
          `Level ${levelIndex + 1} cleared in ${moves} moves. Ready for the next chamber?`,
          "Next Puzzle"
        );
      }
    };

    const tryMove = (dx, dy) => {
      if (!gameStarted) {
        hideOverlay();
        gameStarted = true;
      }

      const nextX = player.x + dx;
      const nextY = player.y + dy;
      const nextCell = board[nextY]?.[nextX];

      if (nextCell === "#" || typeof nextCell === "undefined") {
        setStatus("Path blocked // wall detected");
        return;
      }

      const blockingBlock = blockAt(nextX, nextY);

      if (blockingBlock) {
        const pushX = nextX + dx;
        const pushY = nextY + dy;
        const pushCell = board[pushY]?.[pushX];

        if (pushCell === "#" || typeof pushCell === "undefined" || blockAt(pushX, pushY)) {
          setStatus("Block jammed // no push route");
          return;
        }

        blockingBlock.x = pushX;
        blockingBlock.y = pushY;
      }

      player.x = nextX;
      player.y = nextY;
      moves += 1;
      movesOutput.textContent = String(moves);

      if (exitUnlocked()) {
        setStatus("Exit unlocked // get the cube to the gate");
      } else {
        setStatus("Route updated // power the remaining plates");
      }

      draw();

      if (!levelSolved && hasCornerDeadlock()) {
        setStatus("Deadlock detected // resetting puzzle");
        clearAutoResetTimeout();
        autoResetTimeoutId = window.setTimeout(() => {
          autoRestartLevel();
        }, 650);
        return;
      }

      if (exitUnlocked() && player.x === exit.x && player.y === exit.y) {
        finishLevel();
      }
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
      KeyR: "reset",
    };

    window.addEventListener("keydown", (event) => {
      const command = controls[event.code];

      if (!command) {
        return;
      }

      event.preventDefault();

      if (command === "reset") {
        resetLevel();
        return;
      }

      if (levelSolved) {
        return;
      }

      tryMove(command.x, command.y);
    });

    actionButton.addEventListener("click", () => {
      if (levelSolved) {
        if (levelIndex === levels.length - 1) {
          levelIndex = 0;
        } else {
          levelIndex += 1;
        }
      }

      resetLevel();
      hideOverlay();
      gameStarted = true;
      setStatus("Puzzle live // find the escape route");
    });

    window.addEventListener("beforeunload", () => {
      clearAutoResetTimeout();
    });

    resetLevel();
  }
}
