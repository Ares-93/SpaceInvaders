const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");

let currShooterIndex = 202; //where the shooter will spawn

const width = 15;

const aliensRemoved = [];

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
