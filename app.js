const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");

const width = 15;

for (
  let i = 0;
  i < width * width;
  i++ //loops 225 times (15*15=225)
) {
  const square = document.createElement("div");
  grid.appendChild(square);
}
