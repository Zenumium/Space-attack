class Player {
  constructor(gameArea) {
    this.element = document.getElementById("player");
    this.gameArea = gameArea;
    this.speed = 20;

    // Set initial position
    this.element.style.left = "50%";

    // Bind event listeners for movement
    document.addEventListener("keydown", this.move.bind(this));
  }

  move(event) {
    const key = event.key;
    const playerRect = this.element.getBoundingClientRect();
    const gameRect = this.gameArea.getBoundingClientRect();

    // Calculate the current left position
    const currentLeft = parseInt(this.element.style.left || 0, 10);

    if (key === "ArrowLeft" && playerRect.left > gameRect.left) {
      this.element.style.left = `${currentLeft - this.speed}px`;
    } else if (key === "ArrowRight" && playerRect.right < gameRect.right) {
      this.element.style.left = `${currentLeft + this.speed}px`;
    }
  }
}
