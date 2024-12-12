const gameArea = document.getElementById("gameArea");
const pauseButton = document.getElementById("pauseButton");
const ship = document.getElementById("ship");
const scoreDisplay = document.createElement("div");

const shootSound = new Audio("./sound/laser2.mp3");
shootSound.volume = 0.3;

const SHOOT_INTERVAL = 600;
const ALIEN_SHOOT_INTERVAL = 2000; // Time interval for alien shooting (in ms)

let shipPositionX = gameArea.offsetWidth / 2 - ship.offsetWidth / 2;
let shipPositionY = gameArea.offsetHeight - ship.offsetHeight - 900;
let bulletSpeed = 5;
let shipSpeed = 20;
let bullets = [];
let aliens = [];
let alienBullets = []; // Array for alien bullets
let powerUps = [];
let alienSpeed = 2;
let isPaused = false;
let gameInterval;
let lastShotTime = 0; // Track the last time a bullet was fired
let lastAlienShootTime = 0; // Track the last time an alien shot a bullet

let score = 0;
let lives = 3;
let powerUpDuration = 10000; // 10 seconds power-up duration
let currentPowerUp = null;

// Power-up types
const POWER_UP_TYPES = [
  {
    type: "shield",
    color: "blue",
    effect: () => {
      ship.style.opacity = "0.5"; // Visual shield effect
      setTimeout(() => {
        ship.style.opacity = "1";
        currentPowerUp = null;
      }, powerUpDuration);
    },
  },
  {
    effect: () => {
      lives++;
      updateLivesDisplay();
      currentPowerUp = null;
    },
  },
];

function initGame() {
  // Set up score display
  scoreDisplay.id = "scoreDisplay";
  scoreDisplay.style.position = "absolute";
  scoreDisplay.style.top = "10px";
  scoreDisplay.style.right = "10px";
  scoreDisplay.style.color = "white";
  scoreDisplay.style.fontSize = "30px";
  scoreDisplay.style.fontFamily = "system-ui";
  scoreDisplay.textContent = `Score: ${score}`;
  gameArea.appendChild(scoreDisplay);

  // Add lives display
  const livesDisplay = document.createElement("div");
  livesDisplay.id = "livesDisplay";
  livesDisplay.style.position = "absolute";
  livesDisplay.style.top = "10px";
  livesDisplay.style.left = "10px";
  livesDisplay.style.color = "white";
  livesDisplay.style.fontSize = "30px";
  livesDisplay.style.fontFamily = "system-ui";
  livesDisplay.textContent = `Lives: ${lives}`;
  gameArea.appendChild(livesDisplay);

  ship.style.left = `${shipPositionX}px`;
  ship.style.bottom = `${shipPositionY}px`;
  createAliens();

  // Power-up spawn timer
  setInterval(spawnPowerUp, 10000); // Spawn a power-up every 10 seconds

  startGameLoop();
}

function updateLivesDisplay() {
  const livesDisplay = document.getElementById("livesDisplay");
  livesDisplay.textContent = `Lives: ${lives}`;
}

function spawnPowerUp() {
  if (isPaused) return;

  // Choose a random power-up type
  const powerUpType =
    POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];

  const powerUp = document.createElement("div");
  powerUp.classList.add("power-up");
  powerUp.style.position = "absolute";
  powerUp.style.width = "30px";
  powerUp.style.height = "30px";
  powerUp.style.backgroundColor = powerUpType.color;
  powerUp.style.borderRadius = "50%";

  // Spawn at a random horizontal position at the top
  powerUp.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
  powerUp.style.top = "0px";

  // Store the power-up type with the element
  powerUp.dataset.type = powerUpType.type;

  gameArea.appendChild(powerUp);
  powerUps.push(powerUp);
}

function checkPowerUpCollision() {
  const shipRect = ship.getBoundingClientRect();

  powerUps.forEach((powerUp, index) => {
    const powerUpRect = powerUp.getBoundingClientRect();

    // Check for collision
    if (
      shipRect.left < powerUpRect.right &&
      shipRect.right > powerUpRect.left &&
      shipRect.top < powerUpRect.bottom &&
      shipRect.bottom > powerUpRect.top
    ) {
      // Activate power-up
      const powerUpType = POWER_UP_TYPES.find(
        (p) => p.type === powerUp.dataset.type
      );

      if (powerUpType) {
        if (currentPowerUp) {
          SHOOT_INTERVAL = 700;
          ship.style.opacity = "1";
        }

        // Activate new power-up
        powerUpType.effect();
        currentPowerUp = powerUpType;
      }

      // Remove power-up from screen and array
      powerUp.remove();
      powerUps.splice(index, 1);
    }

    // Remove power-up if it falls off the screen
    let powerUpPosition = parseInt(powerUp.style.top.replace("px", ""));
    powerUpPosition += 3; // Falling speed

    if (powerUpPosition > gameArea.offsetHeight) {
      powerUp.remove();
      powerUps.splice(index, 1);
    } else {
      powerUp.style.top = `${powerUpPosition}px`;
    }
  });
}

// Create aliens in rows and columns
function createAliens() {
  const alienCount = 10; // Number of aliens per row
  const rows = 3;
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
  } else if (e.key === "Escape") {
    // 'Escape' key to toggle play/pause
    togglePause();
  }
  ship.style.left = `${shipPositionX}px`;
});

function shootBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet", "bullet-laser");
  bullet.style.left = `${shipPositionX + ship.offsetWidth / 2 - 2}px`;
  bullet.style.bottom = `${shipPositionY + ship.offsetHeight}px`;
  gameArea.appendChild(bullet);
  bullets.push(bullet);

  // Play shooting sound
  shootSound.currentTime = 0; // Reset to start of sound
  shootSound.play();
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
  lives--;
  updateLivesDisplay();

  if (lives <= 0) {
    const gameStatus = document.getElementById("game-status");
    gameStatus.textContent = `Game Over! Aliens have invaded Earth!`;
    stopGameLoop();
  } else {
    // Reset ship position, clear bullets and aliens
    shipPositionX = gameArea.offsetWidth / 2 - ship.offsetWidth / 2;
    ship.style.left = `${shipPositionX}px`;

    // Clear existing bullets and aliens
    bullets.forEach((b) => b.remove());
    bullets = [];

    aliens.forEach((a) => a.remove());
    aliens = [];

    // Recreate aliens
    createAliens();
  }
}
// Create alien bullets
function shootAlienBullet(alien) {
  const alienBullet = document.createElement("div");
  alienBullet.classList.add("alien-bullet");
  alienBullet.style.position = "absolute";
  alienBullet.style.width = "5px";
  alienBullet.style.height = "10px";
  alienBullet.style.backgroundColor = "red";
  alienBullet.style.left = `${alien.offsetLeft + alien.offsetWidth / 2 - 2}px`; // Center of the alien
  alienBullet.style.top = `${alien.offsetTop + alien.offsetHeight}px`; // Start just below the alien
  gameArea.appendChild(alienBullet);
  alienBullets.push(alienBullet);
}

// Move alien bullets and check for collisions
function moveAlienBullets() {
  alienBullets.forEach((bullet, index) => {
    let bulletPosition = parseInt(bullet.style.top.replace("px", ""));
    bulletPosition -= 3; // Alien bullets move down (slow speed)

    if (bulletPosition < 0) {
      bullet.remove();
      alienBullets.splice(index, 1);
    } else {
      bullet.style.top = `${bulletPosition}px`;
      checkAlienBulletCollision(bullet);
    }
  });
}

// Check for collisions between alien bullets and the player's ship
function checkAlienBulletCollision(bullet) {
  const shipRect = ship.getBoundingClientRect();
  const bulletRect = bullet.getBoundingClientRect();

  if (
    bulletRect.left < shipRect.right &&
    bulletRect.right > shipRect.left &&
    bulletRect.top < shipRect.bottom &&
    bulletRect.bottom > shipRect.top
  ) {
    // Alien bullet hits the ship
    lives--;
    updateLivesDisplay();

    bullet.remove();
    alienBullets.splice(alienBullets.indexOf(bullet), 1);

    // If no lives are left, trigger game over
    if (lives <= 0) {
      gameOver();
    }
  }
}

// Handle alien shooting logic
function handleAlienShooting(currentTime) {
  if (currentTime - lastAlienShootTime > ALIEN_SHOOT_INTERVAL) {
    // Choose a random alien to shoot
    const randomAlienIndex = Math.floor(Math.random() * aliens.length);
    const randomAlien = aliens[randomAlienIndex];

    if (randomAlien) {
      shootAlienBullet(randomAlien);
    }

    lastAlienShootTime = currentTime;
  }
}

// Game loop to update bullet position and alien movement
function gameLoop(currentTime) {
  if (isPaused) return; // Skip updates if the game is paused

  // Automatic shooting mechanism
  if (currentTime - lastShotTime > SHOOT_INTERVAL) {
    shootBullet();
    lastShotTime = currentTime;
  }

  // Move bullets and check collisions
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

  // Check for power-up collisions and movement
  checkPowerUpCollision();

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
    document.getElementById(
      "game-status"
    ).textContent = `You save the Galaxy nice Job!`;
    stopGameLoop();
  }

  // Update score display
  scoreDisplay.textContent = `Score: ${score}`;

  // Handle alien shooting
  handleAlienShooting(currentTime);

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
      // Increase score when an alien is hit
      score += 10;

      alien.remove();
      bullet.remove();
      aliens.splice(index, 1);
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  });
}

initGame();
