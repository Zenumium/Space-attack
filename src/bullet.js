class Bullet {
  constructor(x, y, gameArea) {
    this.gameArea = gameArea;

    // Create bullet element
    this.element = document.createElement("div");
    this.element.classList.add("bullet");
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    gameArea.appendChild(this.element);
    this.interval = setInterval(this.move.bind(this), 20);
  }

  move() {
    const bulletTop = parseInt(this.element.style.top, 10);
    if (bulletTop < 0) {
      this.destroy();
    } else {
      this.element.style.top = `${bulletTop - 5}px`;
    }
  }

  destroy() {
    clearInterval(this.interval);
    this.element.remove();
  }
}
