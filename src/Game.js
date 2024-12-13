class Game {
  constructor() {
    this.gameWidth = 900;
    this.gameHeight = 600;
    this.gameContainer = null;
    this.player = null;
    this.enemyFormation = null;
    this.playerBullets = [];
    this.enemyBullets = [];
    this.score = 0;
    this.lives = 0;
    this.gameOver = false;
  }

  init() {
    // Create game container
    this.gameContainer = document.createElement("div");
    this.gameContainer.classList.add("game-container");
    this.gameContainer.style.width = `${this.gameWidth}px`;
    this.gameContainer.style.height = `${this.gameHeight}px`;
    this.gameContainer.style.position = "relative";
    this.gameContainer.style.margin = "0 auto";
    this.gameContainer.style.backgroundColor = "black";
    document.body.appendChild(this.gameContainer);

    // Create player (pass both gameWidth and gameHeight)
    this.player = new Player(this.gameWidth, this.gameHeight);
    this.gameContainer.appendChild(this.player.element);

    // Create enemy formation
    this.enemyFormation = new EnemyFormation(this.gameWidth, this.gameHeight);
    this.enemyFormation.enemies.forEach((enemy) => {
      this.gameContainer.appendChild(enemy.element);
    });

    // Create score display
    this.scoreDisplay = document.createElement("div");
    this.scoreDisplay.classList.add("score-display");
    this.scoreDisplay.textContent = `Score: ${this.score} | Lives: ${this.lives}`;
    this.scoreDisplay.style.position = "absolute";
    this.scoreDisplay.style.top = "10px";
    this.scoreDisplay.style.left = "10px";
    this.scoreDisplay.style.color = "white";
    this.gameContainer.appendChild(this.scoreDisplay);

    // Setup controls
    this.setupControls();

    // Start game loop
    this.gameLoop();
  }

  setupControls() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.player.moveLeft();
          break;
        case "ArrowRight":
          this.player.moveRight();
          break;
        case " ":
          const bullet = this.player.shoot();
          this.playerBullets.push(bullet);
          this.gameContainer.appendChild(bullet.element);
          break;
      }
    });
  }

  gameLoop() {
    if (this.gameOver) return;

    // Move enemy formation
    this.enemyFormation.moveFormation();

    // Move and manage player bullets
    this.playerBullets = this.playerBullets.filter((bullet) => {
      bullet.move();
      if (bullet.isOutOfBounds(this.gameHeight)) {
        this.gameContainer.removeChild(bullet.element);
        return false;
      }
      return true;
    });

    // Check for collisions between player bullets and enemies
    this.checkBulletEnemyCollisions();

    // Update score display
    this.scoreDisplay.textContent = `Score: ${this.score} | Lives: ${this.lives}`;

    // Continue game loop
    requestAnimationFrame(() => this.gameLoop());
  }

  updatePlayerBullets() {
    // Create a new array to store bullets that are still valid
    const validBullets = [];

    this.playerBullets.forEach((bullet) => {
      bullet.move();

      // Check if bullet is out of bounds
      if (!bullet.isOutOfBounds(this.gameHeight)) {
        validBullets.push(bullet);
      } else {
        // Remove bullet from the game container if it's out of bounds
        this.safeRemoveElement(bullet.element);
      }
    });

    // Update the bullets array
    this.playerBullets = validBullets;
  }
  checkBulletEnemyCollisions() {
    // Create an array to track bullets to remove and enemies to keep
    const bulletsToRemove = [];
    const survivingEnemies = [];

    // Iterate through each bullet
    this.playerBullets.forEach((bullet) => {
      let hitEnemy = false;

      // Check collision with each enemy
      this.enemyFormation.enemies.forEach((enemy) => {
        if (!hitEnemy && this.isColliding(bullet, enemy)) {
          // Mark bullet for removal
          bulletsToRemove.push(bullet);

          // Try to safely remove enemy element
          this.safeRemoveElement(enemy.element);

          // Increase score
          this.score += 10;
          hitEnemy = true;
        }
      });

      // If bullet didn't hit any enemy, keep it
      if (!hitEnemy) {
        survivingEnemies.push(enemy);
      }
    });

    // Remove hit bullets from game container and bullets array
    bulletsToRemove.forEach((bullet) => {
      this.safeRemoveElement(bullet.element);
      this.playerBullets = this.playerBullets.filter((b) => b !== bullet);
    });

    // Update enemy formation
    this.enemyFormation.enemies = survivingEnemies;
  }

  safeRemoveElement(element) {
    try {
      if (element && element.parentNode === this.gameContainer) {
        this.gameContainer.removeChild(element);
      }
    } catch (error) {
      console.warn("Error removing element:", error);
    }
  }

  checkBulletEnemyCollisions() {
    // Iterate through bullets to check for collisions
    this.playerBullets = this.playerBullets.filter((bullet) => {
      // Flag to track if this bullet hit an enemy
      let bulletHitEnemy = false;

      // Check collision with each enemy
      this.enemyFormation.enemies = this.enemyFormation.enemies.filter(
        (enemy) => {
          // Check if bullet collides with this enemy
          if (this.isColliding(bullet, enemy)) {
            // Mark that the bullet hit an enemy
            bulletHitEnemy = true;

            // Remove enemy element from game container
            if (enemy.element && enemy.element.parentNode) {
              this.gameContainer.removeChild(enemy.element);
            }

            // Remove bullet element from game container
            if (bullet.element && bullet.element.parentNode) {
              this.gameContainer.removeChild(bullet.element);
            }

            // Increase score
            this.score += 10;
            this.updateScoreDisplay();

            // Remove this enemy (return false to filter it out)
            return false;
          }

          // Keep this enemy (return true to keep it in the array)
          return true;
        }
      );

      // Return whether the bullet should be kept (false if it hit an enemy)
      return !bulletHitEnemy;
    });
  }

  updateScoreDisplay() {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `Score: ${this.score} | Lives: ${this.lives}`;
    }
  }
  // Safe method to remove an element from the game container
  safeRemoveElement(element) {
    try {
      if (element && element.parentNode === this.gameContainer) {
        this.gameContainer.removeChild(element);
      }
    } catch (error) {
      console.warn("Error removing element:", error);
    }
  }

  isColliding(bullet, enemy) {
    return (
      bullet.x < enemy.x + enemy.width &&
      bullet.x + bullet.width > enemy.x &&
      bullet.y < enemy.y + enemy.height &&
      bullet.y + bullet.height > enemy.y
    );
  }
}
