class Player {
  constructor(gameArea) {
    this.element = document.getElementById("player");
    this.gameArea = gameArea;
    this.speed = 10;

    document.addEventListener("keydown", this.move.bind(this));
  }

  move(event) {
    const key = event.key;
    const playerRect = this.element.getBoundingClientRect();
    const gameRect = this.gameArea.getBoundingClientRect();

    if (key === "ArrowLeft" && playerRect.left > gameRect.left) {
      this.element.style.left = `${
        playerRect.left - this.speed - gameRect.left
      }px`;
    } else if (key === "ArrowRight" && playerRect.right < gameRect.right) {
      this.element.style.left = `${
        playerRect.left + this.speed - gameRect.left
      }px`;
    }
  }
}
