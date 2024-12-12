class Enemy {
  constructor(x, y, gameArea) {
    this.gameArea = gameArea;

    // Create enemy element
    this.element = document.createElement("div");
    this.element.classList.add("enemy");
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    gameArea.appendChild(this.element);
  }

  moveDown() {
    const enemyTop = parseInt(this.element.style.top, 10);
    this.element.style.top = `${enemyTop + 20}px`;
  }

  destroy() {
    this.element.remove();
  }
}
