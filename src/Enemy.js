// Create aliens in rows and columns
function createAliens() {
  const alienCount = 10; // Number of aliens per row
  const rows = 3;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < alienCount; c++) {
      const alien = document.createElement("img");
      alien.src = "./Image/WINK_1.PNG";
      alien.classList.add("alien");
      alien.style.position = "absolute";
      alien.style.width = "50px";
      alien.style.height = "50px";
      alien.style.left = `${c * 50 + 50}px`;
      alien.style.top = `${r * 50 + 50}px`;
      gameArea.appendChild(alien);
      aliens.push(alien);
    }
  }
}

// Create alien bullets
function shootAlienBullet(alien) {
  const alienBullet = document.createElement("div");
  alienBullet.classList.add("alien-bullet");
  alienBullet.style.position = "absolute";
  alienBullet.style.width = "5px";
  alienBullet.style.height = "10px";
  alienBullet.style.backgroundColor = "red";
  alienBullet.style.left = `${alien.offsetLeft + alien.offsetWidth / 2 - 2}px`; // Center of the alien
  alienBullet.style.top = `${alien.offsetTop + alien.offsetHeight}px`; // Start just below the alien
  gameArea.appendChild(alienBullet);
  alienBullets.push(alienBullet);
}

// Move alien bullets and check for collisions
function moveAlienBullets() {
  alienBullets.forEach((bullet, index) => {
    let bulletPosition = parseInt(bullet.style.top.replace("px", ""));
    bulletPosition -= 3; // Alien bullets move down (slow speed)

    if (bulletPosition < 0) {
      bullet.remove();
      alienBullets.splice(index, 1);
    } else {
      bullet.style.top = `${bulletPosition}px`;
      checkAlienBulletCollision(bullet);
    }
  });
}

// Check for collisions between alien bullets and the player's ship
function checkAlienBulletCollision(bullet) {
  const shipRect = ship.getBoundingClientRect();
  const bulletRect = bullet.getBoundingClientRect();

  if (
    bulletRect.left < shipRect.right &&
    bulletRect.right > shipRect.left &&
    bulletRect.top < shipRect.bottom &&
    bulletRect.bottom > shipRect.top
  ) {
    // Alien bullet hits the ship
    lives--;
    updateLivesDisplay();

    bullet.remove();
    alienBullets.splice(alienBullets.indexOf(bullet), 1);

    // If no lives are left, trigger game over
    if (lives <= 0) {
      gameOver();
    }
  }
}
// Create alien bullets
function shootAlienBullet(alien) {
  const alienBullet = document.createElement("div");
  alienBullet.classList.add("alien-bullet");
  alienBullet.style.position = "absolute";
  alienBullet.style.width = "5px";
  alienBullet.style.height = "10px";
  alienBullet.style.backgroundColor = "red";
  alienBullet.style.left = `${alien.offsetLeft + alien.offsetWidth / 2 - 2}px`; // Center of the alien
  alienBullet.style.top = `${alien.offsetTop + alien.offsetHeight}px`; // Start just below the alien
  gameArea.appendChild(alienBullet);
  alienBullets.push(alienBullet);
}

// Move alien bullets and check for collisions
function moveAlienBullets() {
  alienBullets.forEach((bullet, index) => {
    let bulletPosition = parseInt(bullet.style.top.replace("px", ""));
    bulletPosition -= 3; // Alien bullets move down (slow speed)

    if (bulletPosition < 0) {
      bullet.remove();
      alienBullets.splice(index, 1);
    } else {
      bullet.style.top = `${bulletPosition}px`;
      checkAlienBulletCollision(bullet);
    }
  });
}

// Check for collisions between alien bullets and the player's ship
function checkAlienBulletCollision(bullet) {
  const shipRect = ship.getBoundingClientRect();
  const bulletRect = bullet.getBoundingClientRect();

  if (
    bulletRect.left < shipRect.right &&
    bulletRect.right > shipRect.left &&
    bulletRect.top < shipRect.bottom &&
    bulletRect.bottom > shipRect.top
  ) {
    // Alien bullet hits the ship
    lives--;
    updateLivesDisplay();

    bullet.remove();
    alienBullets.splice(alienBullets.indexOf(bullet), 1);

    // If no lives are left, trigger game over
    if (lives <= 0) {
      gameOver();
    }
  }
}
// Handle alien shooting logic
function handleAlienShooting(currentTime) {
  if (currentTime - lastAlienShootTime > ALIEN_SHOOT_INTERVAL) {
    // Choose a random alien to shoot
    const randomAlienIndex = Math.floor(Math.random() * aliens.length);
    const randomAlien = aliens[randomAlienIndex];

    if (randomAlien) {
      shootAlienBullet(randomAlien);
    }

    lastAlienShootTime = currentTime;
  }
}
