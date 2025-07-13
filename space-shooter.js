const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 230, y: 550, width: 40, height: 20 };
let bullets = [];
let enemies = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").textContent = highScore;

let keys = {};
let gameOver = false;

// Draw functions
function drawPlayer() {
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
}

// Update functions
function updateBullets() {
  bullets.forEach(b => b.y -= 5);
  bullets = bullets.filter(b => b.y > 0);
}

function updateEnemies() {
  enemies.forEach(e => e.y += 1);
}

// Detect enemy missed
function checkMissedEnemies() {
  for (let e of enemies) {
    if (e.y + e.height >= canvas.height) {
      endGame();
      return;
    }
  }
}

// Collision detection
function collision() {
  bullets.forEach((b, i) => {
    enemies.forEach((e, j) => {
      if (
        b.x < e.x + e.width &&
        b.x + 4 > e.x &&
        b.y < e.y + e.height &&
        b.y + 10 > e.y
      ) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        score++;
        document.getElementById("score").textContent = score;
      }
    });
  });
}

function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= 5;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width)
    player.x += 5;
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  updateBullets();
  updateEnemies();
  collision();
  checkMissedEnemies();

  drawPlayer();
  drawBullets();
  drawEnemies();

  requestAnimationFrame(gameLoop);
}

// 🧨 Spawn enemy at random X every second
function spawnEnemy() {
  const x = Math.random() * (canvas.width - 40); // prevent overflow
  enemies.push({
    x: x,
    y: 0,
    width: 40,
    height: 20
  });
  if (!gameOver) {
    setTimeout(spawnEnemy, 1000); // spawn every 1 sec
  }
}

// Game end
function endGame() {
  gameOver = true;
  document.getElementById("popup").style.display = "block";
  document.getElementById("finalScore").textContent = score;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    document.getElementById("highScore").textContent = score;
  }
}

// Restart
function restartGame() {
  location.reload();
}

// Controls
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === " ") {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y });
  }
});
document.addEventListener("keyup", e => keys[e.key] = false);

// Start game
spawnEnemy();
gameLoop();
