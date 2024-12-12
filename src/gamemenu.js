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
