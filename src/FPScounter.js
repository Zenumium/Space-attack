const fpsElem = document.querySelector("#fps");
let then = 0;
let fps = 0;
let frameCount = 0;

function render(now) {
  now *= 0.001; // convert to seconds
  const deltaTime = now - then;
  then = now;
  frameCount++;

  // Update FPS every second
  if (now - lastFpsUpdate >= 1) {
    fpsElem.textContent = frameCount;
    frameCount = 0;
    lastFpsUpdate = now;
  }

  requestAnimationFrame(render);
}

let lastFpsUpdate = 0;
requestAnimationFrame(render);

