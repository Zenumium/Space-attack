// Move the spaceship with arrow keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    shipPositionX = Math.max(0, shipPositionX - shipSpeed);
  } else if (e.key === "ArrowRight") {
    shipPositionX = Math.min(
      gameArea.offsetWidth - ship.offsetWidth,
      shipPositionX + shipSpeed
    );
  } else if (e.key === "Escape") {
    // 'Escape' key to toggle play/pause
    togglePause();
  }
  ship.style.left = `${shipPositionX}px`;
});
