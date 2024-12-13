class MainMenu {
  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add("main-menu");
    this.render();
  }

  render() {
    this.container.innerHTML = `
            <div class="menu-content">
                <h1>Space Invaders</h1>
                <button id="start-game">Start Game</button>
                <div class="instructions">
                    <p>Use Arrow Keys to Move</p>
                    <p>Use Spacebar to Shoot the enemies</p>
                </div>
            </div>
        `;

    const startButton = this.container.querySelector("#start-game");
    startButton.addEventListener("click", () => {
      document.body.innerHTML = ""; // Clear screen
      new Game().init(); // Start the game
    });

    document.body.appendChild(this.container);
  }
}

// Ensure this runs when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MainMenu();
});
