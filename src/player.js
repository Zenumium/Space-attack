class Player {
  constructor(gameArea) {
    this.element = document.getElementById("player");
    this.gameArea = gameArea;
    this.speed = 20;

    // Set the initial position of the player to the center of the game area
    const gameRect = this.gameArea.getBoundingClientRect();
    const playerWidth = this.element.offsetWidth; // Get the width of the player
    const initialLeft = gameRect.width / 2 - playerWidth / 2; // Calculate the center position
    this.element.style.position = "absolute"; // Ensure the player is positioned absolutely
    this.element.style.left = `${initialLeft}px`; // Set the initial left position

    // Bind event listeners for movement
    document.addEventListener("keydown", this.move.bind(this));
  }

  move(event) {
    const key = event.key;
    const playerRect = this.element.getBoundingClientRect();
    const gameRect = this.gameArea.getBoundingClientRect();

    // Calculate the current left position
    const currentLeft = parseInt(this.element.style.left || 0, 10);

    if (key === "ArrowLeft") {
      // Move left only if it doesn't go out of bounds
      if (playerRect.left > gameRect.left) {
        this.element.style.left = `${Math.max(currentLeft - this.speed, 0)}px`;
      }
    } else if (key === "ArrowRight") {
      // Move right only if it doesn't go out of bounds
      const maxRight = gameRect.width - playerRect.width; // Calculate the maximum left position for the right edge
      this.element.style.left = `${Math.min(
        currentLeft + this.speed,
        maxRight
      )}px`;
    }
  }
}
