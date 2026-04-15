const pingPage = document.body.dataset.page === "game-02";

if (pingPage) {
  const canvas = document.querySelector("[data-ping-canvas]");
  const statusOutput = document.querySelector("[data-ping-status]");
  const playerScoreOutput = document.querySelector("[data-ping-player-score]");
  const aiScoreOutput = document.querySelector("[data-ping-ai-score]");
  const overlay = document.querySelector("[data-ping-overlay]");
  const overlayTitle = document.querySelector("[data-ping-overlay-title]");
  const overlayCopy = document.querySelector("[data-ping-overlay-copy]");
  const restartButton = document.querySelector("[data-ping-restart]");
  const modeButtons = document.querySelectorAll("[data-ping-mode]");

  if (
    canvas &&
    statusOutput &&
    playerScoreOutput &&
    aiScoreOutput &&
    overlay &&
    overlayTitle &&
    overlayCopy &&
    restartButton &&
    modeButtons.length
  ) {
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const table = {
      left: 96,
      right: width - 96,
      top: 104,
      bottom: height - 104,
    };

    const difficultyConfig = {
      easy: { aiSpeed: 3.3, aiAccuracy: 0.08, returnBoost: 0.92 },
      normal: { aiSpeed: 4.5, aiAccuracy: 0.03, returnBoost: 1.05 },
      hard: { aiSpeed: 5.8, aiAccuracy: 0.01, returnBoost: 1.16 },
    };

    const player = {
      x: centerX,
      y: height - 110,
      radius: 42,
      targetX: centerX,
      targetY: height - 110,
      swingUntil: 0,
      chargeStart: 0,
      chargeAmount: 0,
      charging: false,
    };

    const ai = {
      x: centerX,
      y: 110,
      radius: 42,
      swingUntil: 0,
    };

    const ball = {
      x: centerX,
      y: height * 0.68,
      vx: 0,
      vy: 0,
      radius: 10,
      trail: [],
      lastHitter: "player",
    };

    let mode = "easy";
    let playerScore = 0;
    let aiScore = 0;
    let isRunning = false;
    let awaitingServe = true;
    let animationFrame = 0;
    let lastTimestamp = 0;
    let resumeTimeoutId = 0;
    let rescueResolveTimeoutId = 0;
    const rescue = {
      active: false,
      type: "ring",
      centerX,
      centerY: height - 176,
      currentRadius: 0,
      startRadius: 116,
      targetRadius: 58,
      windowSize: 10,
      startedAt: 0,
      duration: 900,
      pendingWinner: "ai",
      label: "",
      labelUntil: 0,
      pickProgress: 0,
      pickDirection: 1,
      pickTargetStart: 0.44,
      pickTargetSize: 0.14,
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const distance = (aX, aY, bX, bY) => Math.hypot(aX - bX, aY - bY);
    const currentConfig = () => difficultyConfig[mode];
    const hasWinningMargin = () =>
      (playerScore >= 11 || aiScore >= 11) &&
      Math.abs(playerScore - aiScore) >= 2;

    const updateScores = () => {
      playerScoreOutput.textContent = String(playerScore);
      aiScoreOutput.textContent = String(aiScore);
    };

    const getChargePower = () => 1 + player.chargeAmount * 0.42;

    const clearResumeTimeout = () => {
      if (resumeTimeoutId) {
        window.clearTimeout(resumeTimeoutId);
        resumeTimeoutId = 0;
      }
    };

    const clearRescueTimeout = () => {
      if (rescueResolveTimeoutId) {
        window.clearTimeout(rescueResolveTimeoutId);
        rescueResolveTimeoutId = 0;
      }
    };

    const setStatus = (message) => {
      statusOutput.textContent = message;
    };

    const setOverlay = (title, copy, showButton = false, buttonLabel = "Play Again") => {
      overlayTitle.textContent = title;
      overlayCopy.textContent = copy;
      restartButton.textContent = buttonLabel;
      restartButton.classList.toggle("is-visually-hidden", !showButton);
      overlay.classList.remove("is-hidden");
    };

    const hideOverlay = () => {
      overlay.classList.add("is-hidden");
    };

    const updateModeButtons = () => {
      modeButtons.forEach((button) => {
        const active = button.dataset.pingMode === mode;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };

    const resetBall = (server = "player") => {
      ball.x = centerX;
      ball.y = server === "player" ? height * 0.68 : height * 0.32;
      ball.vx = 0;
      ball.vy = 0;
      ball.lastHitter = server;
      ball.trail = [];
      awaitingServe = true;
      isRunning = false;
    };

    const resetMatch = (preserveScores = false) => {
      clearResumeTimeout();
      clearRescueTimeout();

      if (!preserveScores) {
        playerScore = 0;
        aiScore = 0;
      }

      player.x = centerX;
      player.y = height - 110;
      player.targetX = centerX;
      player.targetY = height - 110;
      player.swingUntil = 0;
      player.chargeStart = 0;
      player.chargeAmount = 0;
      player.charging = false;
      rescue.active = false;
      rescue.type = "ring";
      rescue.label = "";
      rescue.labelUntil = 0;
      rescue.pickProgress = 0;
      rescue.pickDirection = 1;

      ai.x = centerX;
      ai.y = 110;
      ai.swingUntil = 0;

      updateModeButtons();
      updateScores();
      resetBall("player");
      setStatus("Move your mouse onto the table, then click to serve.");
      setOverlay(
        "Ping Protocol online",
        "Move your mouse to aim the paddle, then click to serve.",
        true,
        "Start Match"
      );
      draw(performance.now());
    };

    const playerZone = () => ({
      minX: table.left + 18,
      maxX: table.right - 18,
      minY: height / 2 + 46,
      maxY: table.bottom - 22,
    });

    const aiZone = () => ({
      minX: table.left + 18,
      maxX: table.right - 18,
      minY: table.top + 22,
      maxY: height / 2 - 46,
    });

    const beginCharge = () => {
      player.charging = true;
      player.chargeStart = performance.now();
      player.chargeAmount = 0;
      setStatus("Charge building // hold for power");
    };

    const releaseCharge = () => {
      if (!player.charging) {
        return;
      }

      player.charging = false;
      player.chargeAmount = clamp((performance.now() - player.chargeStart) / 900, 0, 1);
      player.swingUntil = performance.now() + (180 + player.chargeAmount * 50);
      setStatus(`Swing charged // power ${Math.round(getChargePower() * 100)}%`);
    };

    const serveBall = (server = "player") => {
      if (!awaitingServe) {
        return;
      }

      if (server === "player") {
        const servePower = getChargePower();
        ball.vx = 0;
        ball.vy = -7.4 * servePower;

        ball.lastHitter = "player";
        player.swingUntil = performance.now() + 180;
        player.chargeAmount = 0;
        player.charging = false;
      } else {
        const drift = clamp((ball.x - ai.x) / 90, -1, 1);
        ball.vx = drift * 3.6;
        ball.vy = 7.6;
        ball.lastHitter = "ai";
        ai.swingUntil = performance.now() + 180;
      }

      awaitingServe = false;
      isRunning = true;
      hideOverlay();
      setStatus(`${mode.toUpperCase()} mode // rally live`);
    };

    const scheduleNextServe = (server) => {
      clearResumeTimeout();
      setStatus(
        server === "player"
          ? "Next rally loading // your serve"
          : "AI serve incoming // get ready"
      );

      resumeTimeoutId = window.setTimeout(() => {
        serveBall(server);
      }, 650);
    };

    const resolveRescueFailure = () => {
      rescue.active = false;
      clearRescueTimeout();
      pointWonBy(rescue.pendingWinner);
    };

    const saveBallFromRescue = () => {
      rescue.active = false;
      clearRescueTimeout();
      ball.x = player.x;
      ball.y = player.y - 46;
      ball.vx = clamp((ball.x - centerX) / 18, -4.8, 4.8);
      ball.vy = -8.1;
      ball.trail = [];
      ball.lastHitter = "player";
      isRunning = true;
      awaitingServe = false;
      player.swingUntil = performance.now() + 150;
      player.chargeAmount = 0;
      setStatus("Save successful // rally continues");
    };

    const beginRescue = (type, winner) => {
      if (rescue.active) {
        return;
      }

      clearResumeTimeout();
      clearRescueTimeout();
      isRunning = false;
      awaitingServe = false;
      player.charging = false;
      rescue.active = true;
      rescue.type = type;
      rescue.pendingWinner = winner;
      rescue.startedAt = performance.now();
      rescue.currentRadius = rescue.startRadius;
      rescue.centerX = clamp(ball.x, table.left + 90, table.right - 90);
      rescue.centerY = clamp(ball.y, height / 2 + 48, table.bottom + 12);
      rescue.label = "";
      rescue.labelUntil = 0;
      rescue.pickProgress = 0;
      rescue.pickDirection = 1;
      rescue.pickTargetStart = 0.42 + Math.random() * 0.18;
      rescue.pickTargetSize = 0.14;
      setStatus(
        type === "picklock"
          ? "Back save // hit the pick zone"
          : "Side save // click or press space in the ring"
      );
    };

    const attemptRescue = () => {
      if (!rescue.active) {
        return false;
      }

      const success =
        rescue.type === "picklock"
          ? rescue.pickProgress >= rescue.pickTargetStart &&
            rescue.pickProgress <= rescue.pickTargetStart + rescue.pickTargetSize
          : Math.abs(rescue.currentRadius - rescue.targetRadius) <= rescue.windowSize;
      rescue.label = success ? "Saved" : "Miss";
      rescue.labelUntil = performance.now() + 320;

      if (success) {
        saveBallFromRescue();
      } else {
        rescueResolveTimeoutId = window.setTimeout(() => {
          resolveRescueFailure();
        }, 220);
      }

      return true;
    };

    const pointWonBy = (winner) => {
      isRunning = false;
      awaitingServe = true;

      if (winner === "player") {
        playerScore += 1;
        setStatus("Point secured // your serve");
      } else {
        aiScore += 1;
        setStatus("AI scored // reset and attack the next serve");
      }

      updateScores();

      if (hasWinningMargin()) {
        const playerWon = playerScore > aiScore;
        setOverlay(
          playerWon ? "Match complete" : "Protocol breached",
          playerWon
            ? `You beat the ${mode} AI ${playerScore}-${aiScore}.`
            : `The ${mode} AI takes it ${aiScore}-${playerScore}.`,
          true,
          "Play Again"
        );
        return;
      }

      resetBall(winner === "player" ? "player" : "ai");
      hideOverlay();
      scheduleNextServe(winner === "player" ? "player" : "ai");
    };

    const paddleHit = (paddleX, paddleY, paddle, hitter, returnDirection, boost) => {
      const reach = paddle.radius + ball.radius + 8;
      const gap = distance(ball.x, ball.y, paddleX, paddleY);

      if (gap > reach) {
        return false;
      }

      if ((hitter === "player" && ball.vy <= 0) || (hitter === "ai" && ball.vy >= 0)) {
        return false;
      }

      const offset = clamp((ball.x - paddleX) / paddle.radius, -1, 1);
      const config = currentConfig();

      const power = hitter === "player" ? boost * getChargePower() : boost;

      if (hitter === "player") {
        ball.vx = offset * (5.8 + player.chargeAmount * 2.6);
        ball.vy = -7.8 * power * config.returnBoost;
      } else {
        ball.vx = offset * 7;
        ball.vy = returnDirection * (8.5 * power * config.returnBoost);
      }

      ball.lastHitter = hitter;

      if (hitter === "player") {
        player.chargeAmount = 0;
      }

      const separation = reach - gap + 2;
      ball.y += returnDirection * separation;
      paddle.swingUntil = performance.now() + 120;
      return true;
    };

    const updatePlayerFromPointer = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      const zone = playerZone();

      player.targetX = clamp(x, zone.minX, zone.maxX);
      player.targetY = clamp(y, zone.minY, zone.maxY);
    };

    const drawTable = () => {
      context.clearRect(0, 0, width, height);

      context.fillStyle = "#100912";
      context.fillRect(0, 0, width, height);

      context.fillStyle = "rgba(255, 0, 255, 0.08)";
      context.fillRect(table.left, table.top, table.right - table.left, table.bottom - table.top);

      context.strokeStyle = "rgba(255, 255, 255, 0.5)";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(table.left + 26, height / 2);
      context.lineTo(table.right - 26, height / 2);
      context.stroke();

      context.strokeStyle = "rgba(255, 255, 255, 0.18)";
      context.setLineDash([12, 14]);
      context.beginPath();
      context.moveTo(centerX, table.top + 18);
      context.lineTo(centerX, table.bottom - 18);
      context.stroke();
      context.setLineDash([]);

      context.strokeStyle = "rgba(0, 212, 255, 0.24)";
      context.lineWidth = 2;
      context.strokeRect(table.left + 34, table.top + 34, table.right - table.left - 68, table.bottom - table.top - 68);

      context.fillStyle = "rgba(255, 255, 255, 0.82)";
      context.font = '700 26px "Orbitron"';
      context.textAlign = "center";
      context.fillText(`${playerScore}`, centerX - 42, height / 2 + 10);
      context.fillText(`${aiScore}`, centerX + 42, height / 2 + 10);

      context.fillStyle = "rgba(0, 212, 255, 0.72)";
      context.font = '600 11px "Share Tech Mono"';
      context.fillText("YOU", centerX - 42, height / 2 + 34);

      context.fillStyle = "rgba(255, 0, 255, 0.72)";
      context.fillText("AI", centerX + 42, height / 2 + 34);

      if (player.charging) {
        const barWidth = 150;
        const charge = clamp((performance.now() - player.chargeStart) / 900, 0, 1);
        context.strokeStyle = "rgba(0, 212, 255, 0.4)";
        context.strokeRect(centerX - barWidth / 2, table.bottom - 24, barWidth, 10);
        context.fillStyle = "rgba(0, 212, 255, 0.85)";
        context.fillRect(centerX - barWidth / 2 + 2, table.bottom - 22, (barWidth - 4) * charge, 6);
      }
    };

    const drawPaddle = (paddleX, paddleY, color, swingUntil, now) => {
      const swinging = swingUntil > now;
      context.save();
      context.translate(paddleX, paddleY);
      context.rotate(swinging ? 0.28 : 0);
      context.fillStyle = color;
      context.shadowBlur = 16;
      context.shadowColor = color;
      context.fillRect(-44, -9, 88, 18);
      context.shadowBlur = 0;
      context.restore();
    };

    const drawBall = () => {
      ball.trail.forEach((node, index) => {
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${0.08 + index * 0.05})`;
        context.arc(node.x, node.y, ball.radius - 3, 0, Math.PI * 2);
        context.fill();
      });

      context.beginPath();
      context.fillStyle = "#f8fbff";
      context.shadowBlur = 18;
      context.shadowColor = "rgba(255,255,255,0.65)";
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
    };

    const drawRescue = (now) => {
      if (!rescue.active) {
        return;
      }

      context.fillStyle = "rgba(5, 8, 10, 0.55)";
      context.fillRect(0, 0, width, height);

      context.fillStyle = "rgba(255,255,255,0.92)";
      context.font = '700 20px "Orbitron"';
      context.textAlign = "center";

      if (rescue.type === "picklock") {
        const barWidth = 220;
        const barX = rescue.centerX - barWidth / 2;
        const barY = rescue.centerY - 10;
        const targetX = barX + barWidth * rescue.pickTargetStart;
        const indicatorX = barX + barWidth * rescue.pickProgress;

        context.fillText("CLICK TO UNLOCK SAVE", rescue.centerX, rescue.centerY - 92);

        context.strokeStyle = "rgba(255,255,255,0.85)";
        context.lineWidth = 4;
        context.strokeRect(barX, barY, barWidth, 22);

        context.fillStyle = "rgba(0,255,136,0.32)";
        context.fillRect(targetX, barY + 2, barWidth * rescue.pickTargetSize, 18);

        context.fillStyle = "rgba(255,120,32,0.9)";
        context.fillRect(indicatorX - 4, barY - 6, 8, 34);
      } else {
        context.beginPath();
        context.lineWidth = 8;
        context.strokeStyle = "#ffffff";
        context.arc(rescue.centerX, rescue.centerY, rescue.targetRadius, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.lineWidth = 4;
        context.strokeStyle = "rgba(255,255,255,0.58)";
        context.arc(rescue.centerX, rescue.centerY, rescue.currentRadius, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.fillStyle = "rgba(255, 120, 32, 0.85)";
        context.moveTo(rescue.centerX, rescue.centerY);
        context.arc(rescue.centerX, rescue.centerY, rescue.currentRadius - 8, -0.35, 0.45);
        context.closePath();
        context.fill();

        context.fillText("CLICK TO SAVE", rescue.centerX, rescue.centerY - 136);
      }

      if (rescue.label && rescue.labelUntil > now) {
        context.fillStyle = rescue.label === "Saved" ? "rgba(0,255,136,0.95)" : "rgba(255,80,80,0.95)";
        context.fillText(rescue.label, rescue.centerX + 110, rescue.centerY - 96);
      }
    };

    const draw = (now) => {
      drawTable();
      drawPaddle(ai.x, ai.y, "#ff00ff", ai.swingUntil, now);
      drawPaddle(player.x, player.y, "#00d4ff", player.swingUntil, now);
      drawBall();
      drawRescue(now);
    };

    const updatePlayer = (delta) => {
      const lerp = 1 - Math.pow(0.001, delta / 16.67);
      player.x += (player.targetX - player.x) * lerp;
      player.y += (player.targetY - player.y) * lerp;
    };

    const updateAI = (delta) => {
      const config = currentConfig();
      const zone = aiZone();
      const trackX =
        ball.x + (Math.random() - 0.5) * width * config.aiAccuracy;
      const desiredX = clamp(trackX, zone.minX, zone.maxX);
      const moveAmount = config.aiSpeed * (delta / 16.67);

      if (Math.abs(desiredX - ai.x) <= moveAmount) {
        ai.x = desiredX;
      } else {
        ai.x += Math.sign(desiredX - ai.x) * moveAmount;
      }
    };

    const updateBall = (delta, now) => {
      ball.x += ball.vx * (delta / 16.67);
      ball.y += ball.vy * (delta / 16.67);

      ball.trail.push({ x: ball.x, y: ball.y });
      if (ball.trail.length > 6) {
        ball.trail.shift();
      }

      if (ball.x < table.left - 10 || ball.x > table.right + 10) {
        const winner = ball.lastHitter === "player" ? "ai" : "player";
        if (winner === "ai" && ball.y > height / 2) {
          beginRescue("ring", winner);
        } else {
          pointWonBy(winner);
        }
        return;
      }

      if (player.swingUntil > now) {
        paddleHit(player.x, player.y, player, "player", -1, 1.18);
      }

      paddleHit(ai.x, ai.y, ai, "ai", 1, 1.02);

      if (ball.y < table.top - 10) {
        pointWonBy("player");
      } else if (ball.y > table.bottom + 10) {
        beginRescue("picklock", "ai");
      }
    };

    const gameLoop = (timestamp) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const delta = Math.min(timestamp - lastTimestamp, 24);
      lastTimestamp = timestamp;

      updatePlayer(delta);

      if (rescue.active) {
        const elapsed = timestamp - rescue.startedAt;
        if (rescue.type === "picklock") {
          rescue.pickProgress += rescue.pickDirection * (delta / 700);

          if (rescue.pickProgress >= 1) {
            rescue.pickProgress = 1;
            rescue.pickDirection = -1;
          } else if (rescue.pickProgress <= 0) {
            rescue.pickProgress = 0;
            rescue.pickDirection = 1;
          }

          if (elapsed >= 1500) {
            resolveRescueFailure();
          }
        } else {
          const progress = clamp(elapsed / rescue.duration, 0, 1);
          rescue.currentRadius =
            rescue.startRadius + (rescue.targetRadius - rescue.startRadius) * progress;

          if (progress >= 1) {
            resolveRescueFailure();
          }
        }
      } else if (isRunning) {
        updateAI(delta);
        updateBall(delta, timestamp);
      }

      draw(timestamp);
      animationFrame = window.requestAnimationFrame(gameLoop);
    };

    canvas.addEventListener("mousemove", (event) => {
      updatePlayerFromPointer(event.clientX, event.clientY);
    });

    canvas.addEventListener("mousedown", (event) => {
      updatePlayerFromPointer(event.clientX, event.clientY);
      beginCharge();
    });

    canvas.addEventListener("mouseup", () => {
      if (!awaitingServe) {
        releaseCharge();
      }
    });

    canvas.addEventListener("mouseleave", () => {
      if (player.charging && !awaitingServe) {
        releaseCharge();
      }
    });

    canvas.addEventListener("click", (event) => {
      updatePlayerFromPointer(event.clientX, event.clientY);

      if (attemptRescue()) {
        return;
      }

      if (hasWinningMargin()) {
        resetMatch();
        hideOverlay();
        return;
      }

      if (awaitingServe) {
        clearResumeTimeout();
        serveBall("player");
        return;
      }

      releaseCharge();
    });

    window.addEventListener("keydown", (event) => {
      if (!rescue.active) {
        return;
      }

      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        attemptRescue();
      }
    });

    modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextMode = button.dataset.pingMode;

        if (!nextMode || nextMode === mode) {
          return;
        }

        mode = nextMode;
        resetMatch();
      });
    });

    restartButton.addEventListener("click", () => {
      if (hasWinningMargin()) {
        resetMatch();
        return;
      }

      if (awaitingServe) {
        hideOverlay();
        clearResumeTimeout();
        serveBall("player");
        return;
      }

      resetMatch();
    });

    updateScores();
    updateModeButtons();
    resetMatch();
    animationFrame = window.requestAnimationFrame(gameLoop);

    window.addEventListener("beforeunload", () => {
      clearResumeTimeout();
      clearRescueTimeout();
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    });
  }
}
