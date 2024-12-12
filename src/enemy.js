class Enemy {
  constructor(x, y, gameArea) {
    this.gameArea = gameArea;
    this.element = document.createElement("div");
    this.element.className = "enemy";
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.gameArea.appendChild(this.element);
  }

  // Move the enemy down
  moveDown() {
    const currentTop = parseInt(this.element.style.top || "0", 10);
    this.element.style.top = `${currentTop + 5}px`;
  }

  // Check collision with another element
  checkCollision(otherElement) {
    const enemyRect = this.element.getBoundingClientRect();
    const otherRect = otherElement.getBoundingClientRect();

    return !(
      enemyRect.right < otherRect.left ||
      enemyRect.left > otherRect.right ||
      enemyRect.bottom < otherRect.top ||
      enemyRect.top > otherRect.bottom
    );
  }

  // Handle collision with bullet
  handleBulletCollision(bulletsArray) {
    bulletsArray.forEach((bullet, index) => {
      if (this.checkCollision(bullet.element)) {
        this.destroy();
        bullet.destroy();
        bulletsArray.splice(index, 1); // Remove bullet from array
      }
    });
  }

  // Handle collision with player
  handlePlayerCollision(player) {
    if (this.checkCollision(player.element)) {
      alert("Game Over!"); // Trigger game over logic
      location.reload(); // Reload the game
    }
  }

  // Destroy the enemy
  destroy() {
    this.element.remove();
  }
}
