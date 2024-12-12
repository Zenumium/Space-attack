function shootBullet() {
  const bullet = document.createElement("div");
  bullet.classList.add("bullet", "bullet-laser");
  bullet.style.left = `${shipPositionX + ship.offsetWidth / 2 - 2}px`;
  bullet.style.bottom = `${shipPositionY + ship.offsetHeight}px`;
  gameArea.appendChild(bullet);
  bullets.push(bullet);

  // Play shooting sound
  shootSound.currentTime = 0; // Reset to start of sound
  shootSound.play();
}
// Check for bullet collisions with aliens
function checkBulletCollision(bullet) {
  aliens.forEach((alien, index) => {
    const bulletRect = bullet.getBoundingClientRect();
    const alienRect = alien.getBoundingClientRect();
    if (
      bulletRect.left < alienRect.right &&
      bulletRect.right > alienRect.left &&
      bulletRect.top < alienRect.bottom &&
      bulletRect.bottom > alienRect.top
    ) {
      // Increase score when an alien is hit
      score += 10;

      alien.remove();
      bullet.remove();
      aliens.splice(index, 1);
      bullets.splice(bullets.indexOf(bullet), 1);
    }
  });
}
