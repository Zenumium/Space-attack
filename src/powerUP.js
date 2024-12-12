function spawnPowerUp() {
  if (isPaused) return;

  // Choose a random power-up type
  const powerUpType =
    POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];

  const powerUp = document.createElement("div");
  powerUp.classList.add("power-up");
  powerUp.style.position = "absolute";
  powerUp.style.width = "30px";
  powerUp.style.height = "30px";
  powerUp.style.backgroundColor = powerUpType.color;
  powerUp.style.borderRadius = "50%";

  // Spawn at a random horizontal position at the top
  powerUp.style.left = `${Math.random() * (gameArea.offsetWidth - 30)}px`;
  powerUp.style.top = "0px";

  // Store the power-up type with the element
  powerUp.dataset.type = powerUpType.type;

  gameArea.appendChild(powerUp);
  powerUps.push(powerUp);
}

function checkPowerUpCollision() {
  const shipRect = ship.getBoundingClientRect();

  powerUps.forEach((powerUp, index) => {
    const powerUpRect = powerUp.getBoundingClientRect();

    // Check for collision
    if (
      shipRect.left < powerUpRect.right &&
      shipRect.right > powerUpRect.left &&
      shipRect.top < powerUpRect.bottom &&
      shipRect.bottom > powerUpRect.top
    ) {
      // Activate power-up
      const powerUpType = POWER_UP_TYPES.find(
        (p) => p.type === powerUp.dataset.type
      );

      if (powerUpType) {
        if (currentPowerUp) {
          SHOOT_INTERVAL = 700;
          ship.style.opacity = "1";
        }

        // Activate new power-up
        powerUpType.effect();
        currentPowerUp = powerUpType;
      }

      // Remove power-up from screen and array
      powerUp.remove();
      powerUps.splice(index, 1);
    }

    // Remove power-up if it falls off the screen
    let powerUpPosition = parseInt(powerUp.style.top.replace("px", ""));
    powerUpPosition += 3; // Falling speed

    if (powerUpPosition > gameArea.offsetHeight) {
      powerUp.remove();
      powerUps.splice(index, 1);
    } else {
      powerUp.style.top = `${powerUpPosition}px`;
    }
  });
}
