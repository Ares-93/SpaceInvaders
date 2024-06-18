const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");

let currShooterIndex = 202; //where the shooter will spawn
const width = 15;
const aliensRemoved = [];
let invadersId = [];
let isGoingRight = true;
let direction = 1;
let results = 0;

//sound effects
const laserNoise = new Audio("audio/laser.mp3");
const hit = new Audio("audio/hit.mp3");

for (
  let i = 0;
  i < width * width;
  i++ //loops 225 times (15*15=225)
) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));
console.log(squares);

//making an array for the inital aliens so they can spwan in in the indices given
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
  e.preventDefault(); //stops default function of the keys which is to move the window
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
  }

  if (aliensRemoved.length === alienInvaders.length) {
    resultDisplay.innerHTML = "YOU WIN";
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

    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results++;
      resultDisplay.innerHTML = results;
      console.log(aliensRemoved);
    }
  }
  if (e.key === " ") {
    laserNoise.currentTime = 0;
    laserNoise.play();
    laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
