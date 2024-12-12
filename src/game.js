const gameArea = document.getElementById("gameArea");
const pauseButton = document.getElementById("pauseButton");
const ship = document.getElementById("ship");
let shipPositionX = gameArea.offsetWidth / 2 - ship.offsetWidth / 2; // X to center the ship
let shipPositionY = gameArea.offsetHeight - ship.offsetHeight - 900; // Y position of the ship
let bulletSpeed = 5;
let shipSpeed = 20;
let bullets = [];
let aliens = [];
let alienSpeed = 2;
let isPaused = false; // Flag to track if the game is paused
let gameInterval; // To store the game loop interval
let lastShotTime = 0; // Track the last time a bullet was fired
const SHOOT_INTERVAL = 700; // 1 second between shots (adjust as needed)

function initGame() {
  ship.style.left = `${shipPositionX}px`;
  ship.style.bottom = `${shipPositionY}px`;
  createAliens();
  startGameLoop();
}

// Create aliens in rows and columns
function createAliens() {
  const alienCount = 10; // Number of aliens per row
  const rows = 3; // Number of rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < alienCount; c++) {
      const alien = document.createElement("img");
      alien.src = "./Image/WINK_1.PNG";
      alien.classList.add("alien");
      alien.style.position = "absolute";
      alien.style.width = "50px";
      alien.style.height = "50px";
      alien.style.left = `${c * 50 + 50}px`;
      alien.style.top = `${r * 50 + 50}px`;
      gameArea.appendChild(alien);
      aliens.push(alien);
    }
  }
}

// Move the spaceship with arrow keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    shipPositionX = Math.max(0, shipPositionX - shipSpeed);
  } else if (e.key === "ArrowRight") {
    shipPositionX = Math.min(
      gameArea.offsetWidth - ship.offsetWidth,
      shipPositionX + shipSpeed
    );
  } else if (e.key === "Escape" || e.key === "Escape") {
    // 'Escape' key to toggle play/pause
    togglePause();
  }
  ship.style.left = `${shipPositionX}px`;
});

function shootBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet", "bullet-laser");
  bullet.style.left = `${shipPositionX + ship.offsetWidth / 2 - 2}px`; // Center the bullet
  bullet.style.bottom = `${shipPositionY + ship.offsetHeight}px`;
  gameArea.appendChild(bullet);
  bullets.push(bullet);
}

function startGameLoop() {
  if (isPaused) return;
  gameInterval = requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
  cancelAnimationFrame(gameInterval);
}

// Toggle the game state between play and pause
function togglePause() {
  const gameStatus = document.getElementById("game-status");
  if (isPaused) {
    isPaused = false;
    gameStatus.textContent = "";
    startGameLoop();
  } else {
    isPaused = true;
    gameStatus.textContent = "Game paused";
    stopGameLoop();
  }
}

// Game over function
function gameOver() {
  const gameStatus = document.getElementById("game-status");
  gameStatus.textContent = "Game Over! Aliens have invaded Earth!";
  stopGameLoop();
  // Optional: Add additional game over logic like disabling controls
}

// Game loop to update bullet position and alien movement
function gameLoop(currentTime) {
  if (isPaused) return; // Skip updates if the game is paused

  // Automatic shooting mechanism
  if (currentTime - lastShotTime > SHOOT_INTERVAL) {
    shootBullet();
    lastShotTime = currentTime;
  }

  // Move bullets
  bullets.forEach((bullet, index) => {
    let bulletPosition = parseInt(bullet.style.bottom.replace("px", ""));
    bulletPosition += bulletSpeed;
    if (bulletPosition > gameArea.offsetHeight) {
      bullet.remove();
      bullets.splice(index, 1);
    } else {
      bullet.style.bottom = `${bulletPosition}px`;
      checkBulletCollision(bullet);
    }
  });

  // Move aliens
  let shouldChangeDirection = false;
  aliens.forEach((alien) => {
    let alienPositionX = parseInt(alien.style.left.replace("px", ""));
    let alienPositionY = parseInt(alien.style.top.replace("px", ""));

    alienPositionX += alienSpeed;

    // Check if aliens have reached the bottom of the screen
    if (alienPositionY >= gameArea.offsetHeight - alien.offsetHeight) {
      gameOver();
      return;
    }

    if (
      alienPositionX > gameArea.offsetWidth - alien.offsetWidth ||
      alienPositionX < 0
    ) {
      shouldChangeDirection = true;
    }

    alien.style.left = `${alienPositionX}px`;
  });

  // Change alien direction and move down if needed
  if (shouldChangeDirection) {
    alienSpeed = -alienSpeed;
    aliens.forEach((a) => {
      let alienTop = parseInt(a.style.top.replace("px", ""));
      a.style.top = `${alienTop + 10}px`; // Move all aliens down
    });
  }

  if (aliens.length === 0) {
    document.getElementById("game-status").textContent =
      "You save the Galaxy nice Job!";
    stopGameLoop();
  }

  // Call the next frame of the game loop
  startGameLoop();
}

// Check for bullet collisions with aliens
function checkBulletCollision(bullet) {
  aliens.forEach((alien, index) => {
    const bulletRect = bullet.getBoundingClientRect();
    const alienRect = alien.getBoundingClientRect();
    if (
      bulletRect.left < alienRect.right &&
      bulletRect.right > alienRect.left &&
      bulletRect.top < alienRect.bottom &&
      bulletRect.bottom > alienRect.top
    ) {
      alien.remove();
      bullet.remove();
      aliens.splice(index, 1);
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  });
}

initGame();
