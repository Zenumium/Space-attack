document.addEventListener("DOMContentLoaded", () => {
  const gameArea = document.getElementById("game-area");
  const player = new Player(gameArea);
});
// Initialize Pause Menu
const pauseMenu = new PauseMenu(gameArea);

// Main game loop
const gameLoop = () => {};

// Start the game loop
const gameInterval = setInterval(gameLoop, 1000);

// Pass the interval to the pause menu
pauseMenu.setGameInterval(gameInterval);
