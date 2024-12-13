class Enemy {
  constructor(x, y, type) {
    this.width = 40;
    this.height = 30;
    this.x = x;
    this.y = y;
    this.type = type;
    this.element = this.createEnemyElement();
  }

  createEnemyElement() {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.width = `${this.width}px`;
    enemy.style.height = `${this.height}px`;
    enemy.style.position = "absolute";
    enemy.style.left = `${this.x}px`;
    enemy.style.top = `${this.y}px`;

    // Different colors for different enemy types
    switch (this.type) {
      case "basic":
        enemy.style.backgroundColor = "red";
        break;
      case "advanced":
        enemy.style.backgroundColor = "yellow";
        break;
      case "boss":
        enemy.style.backgroundColor = "purple";
        break;
    }

    return enemy;
  }

  shoot() {
    return new Bullet(this.x + this.width / 2, this.y + this.height, false);
  }
}

class EnemyFormation {
  constructor(gameWidth, gameHeight) {
    this.enemies = [];
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.direction = 1; // 1 for right, -1 for left
    this.createFormation();
  }

  createFormation() {
    const rows = 5;
    const cols = 10;
    const startX = 50;
    const startY = 50;
    const horizontalSpacing = 60;
    const verticalSpacing = 50;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let type = "basic";
        if (row >= 2 && row < 4) type = "advanced";
        if (row >= 4) type = "boss";

        const enemy = new Enemy(
          startX + col * horizontalSpacing,
          startY + row * verticalSpacing,
          type
        );
        this.enemies.push(enemy);
      }
    }
  }

  moveFormation() {
    let shouldChangeDirection = false;

    this.enemies.forEach((enemy) => {
      enemy.x += 2 * this.direction;

      // Check if formation hits screen edges
      if (enemy.x + enemy.width > this.gameWidth || enemy.x < 0) {
        shouldChangeDirection = true;
      }

      enemy.element.style.left = `${enemy.x}px`;
    });

    if (shouldChangeDirection) {
      this.direction *= -1;
      // Move formation down slightly when changing direction
      this.enemies.forEach((enemy) => {
        enemy.y += 20;
        enemy.element.style.top = `${enemy.y}px`;
      });
    }
  }
}
