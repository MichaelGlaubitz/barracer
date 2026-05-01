const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const scoreElement = document.querySelector("#score");
const bestElement = document.querySelector("#best");

const keys = new Set();
const player = {
  x: 120,
  y: canvas.height / 2,
  width: 26,
  height: 72,
  speed: 440,
};

let obstacles = [];
let score = 0;
let best = Number(localStorage.getItem("bar-racer-best") || 0);
let speed = 260;
let crashed = false;
let lastTime = performance.now();
let spawnTimer = 0;

bestElement.textContent = best;

function resetGame() {
  obstacles = [];
  score = 0;
  speed = 260;
  crashed = false;
  spawnTimer = 0;
  player.y = canvas.height / 2 - player.height / 2;
  lastTime = performance.now();
}

function spawnObstacle() {
  const gapHeight = 170;
  const gapTop = 58 + Math.random() * (canvas.height - gapHeight - 116);

  obstacles.push({
    x: canvas.width + 40,
    width: 36,
    gapTop,
    gapHeight,
    passed: false,
  });
}

function update(delta) {
  if (crashed) return;

  const direction =
    Number(keys.has("ArrowDown") || keys.has("s")) -
    Number(keys.has("ArrowUp") || keys.has("w"));

  player.y += direction * player.speed * delta;
  player.y = Math.max(28, Math.min(canvas.height - player.height - 28, player.y));

  spawnTimer -= delta;
  if (spawnTimer <= 0) {
    spawnObstacle();
    spawnTimer = Math.max(0.72, 1.35 - score * 0.012);
  }

  speed += delta * 7;
  obstacles.forEach((obstacle) => {
    obstacle.x -= speed * delta;

    if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
      obstacle.passed = true;
      score += 1;
      scoreElement.textContent = score;

      if (score > best) {
        best = score;
        bestElement.textContent = best;
        localStorage.setItem("bar-racer-best", String(best));
      }
    }
  });

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > -40);

  crashed = obstacles.some((obstacle) => {
    const overlapsX =
      player.x < obstacle.x + obstacle.width && player.x + player.width > obstacle.x;
    const hitsTop = player.y < obstacle.gapTop;
    const hitsBottom = player.y + player.height > obstacle.gapTop + obstacle.gapHeight;
    return overlapsX && (hitsTop || hitsBottom);
  });
}

function drawTrack() {
  context.fillStyle = "#0d1117";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#26313d";
  context.lineWidth = 2;
  context.setLineDash([18, 18]);
  context.beginPath();
  context.moveTo(0, canvas.height / 2);
  context.lineTo(canvas.width, canvas.height / 2);
  context.stroke();
  context.setLineDash([]);
}

function drawPlayer() {
  context.fillStyle = crashed ? "#ff5d5d" : "#42d392";
  context.fillRect(player.x, player.y, player.width, player.height);

  context.fillStyle = "#101216";
  context.fillRect(player.x + 7, player.y + 10, player.width - 14, player.height - 20);
}

function drawObstacles() {
  context.fillStyle = "#f4c430";
  obstacles.forEach((obstacle) => {
    context.fillRect(obstacle.x, 0, obstacle.width, obstacle.gapTop);
    context.fillRect(
      obstacle.x,
      obstacle.gapTop + obstacle.gapHeight,
      obstacle.width,
      canvas.height - obstacle.gapTop - obstacle.gapHeight,
    );
  });
}

function drawCrashMessage() {
  if (!crashed) return;

  context.fillStyle = "rgba(16, 18, 22, 0.72)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#f5f7fa";
  context.font = "700 42px system-ui";
  context.textAlign = "center";
  context.fillText("Crash", canvas.width / 2, canvas.height / 2 - 12);

  context.fillStyle = "#a8b0bc";
  context.font = "20px system-ui";
  context.fillText("Press Space to restart", canvas.width / 2, canvas.height / 2 + 28);
}

function render() {
  drawTrack();
  drawObstacles();
  drawPlayer();
  drawCrashMessage();
}

function loop(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  update(delta);
  render();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  keys.add(event.key);

  if (event.code === "Space" && crashed) {
    resetGame();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key);
});

resetGame();
requestAnimationFrame(loop);

