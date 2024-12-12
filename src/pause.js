class PauseMenu {
  constructor(gameArea) {
    this.isPaused = false;
    this.gameArea = gameArea;
    this.pauseMenu = document.getElementById("pause-menu");

    // Add an event listener for the Escape key
    document.addEventListener("keydown", this.togglePause.bind(this));
  }

  togglePause(event) {
    if (event.key === "Escape") {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show() {
    this.pauseMenu.style.display = "flex";
    this.stopGame();
  }

  hide() {
    this.pauseMenu.style.display = "none";
    this.resumeGame();
  }

  stopGame() {
    clearInterval(this.gameInterval); // Stops the main game loop
    document.querySelectorAll(".bullet").forEach((bullet) => {
      clearInterval(bullet.bulletInterval); // Stops bullet movement
    });
  }

  resumeGame() {
    this.startGame(); // Resumes the main game loop
  }

  setGameInterval(interval) {
    this.gameInterval = interval;
  }

  startGame() {
    this.gameInterval();
  }
}
