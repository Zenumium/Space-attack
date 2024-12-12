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

function startGameLoop() {
  if (isPaused) return;
  gameInterval = requestAnimationFrame(gameLoop);
}

function stopGameLoop() {
  cancelAnimationFrame(gameInterval);
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

initGame();
