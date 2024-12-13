class Player {
  constructor(gameWidth, gameHeight) {
    this.width = 50;
    this.height = 30;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.x = gameWidth / 2 - this.width / 2;
    this.y = gameHeight - this.height - 10;
    this.speed = 10;
    this.element = this.createPlayerElement();
  }

  createPlayerElement() {
    const player = document.createElement("div");
    player.classList.add("player");
    player.style.width = `${this.width}px`;
    player.style.height = `${this.height}px`;
    player.style.position = "absolute";
    player.style.left = `${this.x}px`;
    player.style.bottom = "10px";
    player.style.backgroundColor = "green";
    return player;
  }

  moveLeft() {
    this.x = Math.max(0, this.x - this.speed);
    this.updatePosition();
  }

  moveRight() {
    this.x = Math.min(this.gameWidth - this.width, this.x + this.speed);
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
  }

  shoot() {
    return new Bullet(this.x + this.width / 2, this.y, true);
  }
}
