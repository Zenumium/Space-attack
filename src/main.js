document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("game-area");

  // Initialize Player
  const player = new Player(gameArea);

  // Spawn enemies
  const enemies = [];
  for (let i = 0; i < 5; i++) {
    const x = i * 60 + 20;
    const y = 20;
    enemies.push(new Enemy(x, y, gameArea));
  }

  // Initialize Pause Menu
  const pauseMenu = new PauseMenu(gameArea);

  // Main game loop
  const gameLoop = () => {
    enemies.forEach((enemy) => enemy.moveDown());
  };

  // Start the game loop
  const gameInterval = setInterval(gameLoop, 1000);

  // Pass the interval to the pause menu
  pauseMenu.setGameInterval(gameInterval);

  // Shoot bullets
  document.addEventListener("keydown", (event) => {
    if (event.key === " " && !pauseMenu.isPaused) {
      const playerRect = player.element.getBoundingClientRect();
      const gameRect = gameArea.getBoundingClientRect();
      new Bullet(
        playerRect.left + playerRect.width / 2 - gameRect.left,
        playerRect.top - gameRect.top,
        gameArea
      );
    }
  });
});
