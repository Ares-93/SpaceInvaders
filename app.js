const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");

let currShooterIndex = 202; // where the shooter will spawn
const width = 15;
const aliensRemoved = [];
let invadersId = [];
let isGoingRight = true;
let direction = 1;
let results = 0;
let bossHits = 5; // Number of hits the boss can take
let bossIndex = Math.floor(width / 2) - 1; // Boss starting position

// Sound effects
const laserNoise = new Audio("audio/laser.mp3");
const hit = new Audio("audio/hit.mp3");
const win = new Audio("audio/win.mp3");
const lose = new Audio("audio/lose.mp3");

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));
console.log(squares);

// Making an array for the initial aliens so they can spawn in the indices given
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}

draw();

squares[currShooterIndex].classList.add("shooter");

// Add the boss to the grid
const boss = document.createElement("div");
boss.classList.add("boss");
grid.appendChild(boss);

// Add warning message
const warningMessage = document.createElement("div");
warningMessage.classList.add("warning");
warningMessage.innerText = "WARNING: Boss Incoming!";
grid.appendChild(warningMessage);

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove("invader");
  }
}

function moveShooter(e) {
  squares[currShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currShooterIndex % width !== 0) currShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currShooterIndex % width < width - 1) currShooterIndex += 1;
      break;
  }
  squares[currShooterIndex].classList.add("shooter");
  e.preventDefault(); // stops default function of the keys which is to move the window
}
document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = -1;
      isGoingRight = false;
    }
  } else if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = 1;
      isGoingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }
  draw();

  if (squares[currShooterIndex].classList.contains("invader")) {
    resultDisplay.innerHTML = "GAME OVER!";
    console.log("Game Over: Shooter hit by invader.");
    lose.play();
  }

  if (aliensRemoved.length === alienInvaders.length) {
    console.log("All invaders removed. Showing warning...");
    showWarning();
    setTimeout(showBoss, 3000); // Show boss after 3 seconds
    clearInterval(invadersId);
  }
}

invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currShooterIndex;

  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add("laser");

    // Check for collision with invaders
    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");
      hit.currentTime = 0;
      hit.play();

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      resultDisplay.innerHTML = results;
      console.log("Alien removed:", alienRemoved);
      console.log("Aliens removed:", aliensRemoved);
    }

    // Check for collision with boss
    if (boss.style.display !== "none" && currentLaserIndex === bossIndex) {
      bossHits--;
      squares[currentLaserIndex].classList.remove("laser");
      hit.currentTime = 0;
      hit.play();
      console.log("Boss hit! Remaining hits:", bossHits);
      if (bossHits <= 0) {
        boss.style.display = "none";
        setTimeout(() => {
          resultDisplay.innerHTML = "YOU WIN!";
          win.play();
        }, 500); // Delay the "YOU WIN" message slightly
      }
      clearInterval(laserId);
    }
  }
  if (e.key === " ") {
    laserNoise.currentTime = 0;
    laserNoise.play();
    laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);

function showWarning() {
  warningMessage.style.display = "block";
  setTimeout(() => {
    warningMessage.style.display = "none";
  }, 2000); // Display warning for 2 seconds
}

function showBoss() {
  console.log("Boss showing up...");
  boss.style.display = "block";
}
