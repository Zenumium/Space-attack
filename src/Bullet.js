class Bullet {
  constructor(x, y, isPlayerBullet) {
    this.width = 5;
    this.height = 15;
    this.x = x - this.width / 2;
    this.y = y;
    this.isPlayerBullet = isPlayerBullet;
    this.speed = isPlayerBullet ? -7 : 5;
    this.element = this.createBulletElement();
  }

  createBulletElement() {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.width = `${this.width}px`;
    bullet.style.height = `${this.height}px`;
    bullet.style.position = "absolute";
    bullet.style.left = `${this.x}px`;
    bullet.style.top = `${this.y}px`;
    bullet.style.backgroundColor = this.isPlayerBullet ? "white" : "red";
    return bullet;
  }

  move() {
    this.y += this.speed;
    this.element.style.top = `${this.y}px`;
  }

  isOutOfBounds(gameHeight) {
    return this.y < 0 || this.y > gameHeight;
  }
}
