class LivesManager {
  constructor(initialLives, gameArea) {
    this.lives = initialLives;
    this.gameArea = gameArea;
    this.livesElement = document.getElementById("lives-count");
    this.updateLivesDisplay();
  }

  // Update the lives display
  updateLivesDisplay() {
    this.livesElement.textContent = this.lives;
  }

  // Decrease lives by 1
  loseLife() {
    if (this.lives > 0) {
      this.lives -= 1;
      this.updateLivesDisplay();
      if (this.lives === 0) {
        this.triggerGameOver();
      }
    }
  }

  // Trigger game-over logic
  triggerGameOver() {
    alert("Game Over!");
    this.resetGame();
  }

  // Reset the game (can be customized)
  resetGame() {
    location.reload(); // Simple reload to restart the game
  }

  // Check if enemy reaches the bottom
  handleEnemyReachBottom(enemy, enemiesArray, gameInterval) {
    const enemyRect = enemy.element.getBoundingClientRect();
    const gameRect = this.gameArea.getBoundingClientRect();

    if (enemyRect.bottom >= gameRect.bottom) {
      this.loseLife();
      enemy.destroy();
      const index = enemiesArray.indexOf(enemy);
      if (index > -1) {
        enemiesArray.splice(index, 1);
      }

      if (this.lives === 0) {
        clearInterval(gameInterval);
      }
    }
  }
}
