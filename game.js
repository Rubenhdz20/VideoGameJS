const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

let canvasSize;
let elementsSize;

const playerPosition = {
  x: undefined,
  y: undefined,
}

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
window.addEventListener('keydown', moveByKeys);

function setCanvasSize() {
  window.innerHeight > window.innerWidth
  ? canvasSize = window.innerWidth * 0.7
  : canvasSize = window.innerHeight * 0.7;
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10;
  console.log(elementsSize);

  startGame();
}

function startGame() {
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[0];
  const mapRows = map.trim().split('\n');
  const mapRowsCols = mapRows.map(row => row.trim().split(''));
  console.log({maps, mapRows, mapRowsCols});

  game.clearRect(0,0,canvasSize, canvasSize);

  mapRowsCols.forEach((row, indexRow) => {
    row.forEach((col, indexCol) => {
      const emoji = emojis[col];
      const posX = elementsSize * (indexCol  + 1);
      const posY = elementsSize * (indexRow + 1);

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({playerPosition});
        }
      }

      game.fillText(emoji, posX, posY);
    }) 
  })

  movePlayer();
}

function movePlayer () {
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function moveByKeys(event) {
  console.log(event);
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}

function moveUp() {
  if (playerPosition.y - elementsSize > 0) {
    playerPosition.y -= elementsSize;
    startGame();
  }
  console.log({playerPosition});
}

function moveLeft() {
  if (playerPosition.x - elementsSize >= elementsSize) {
    playerPosition.x -= elementsSize;
    startGame();
  }
  console.log({playerPosition});
}

function moveRight() {
  if (playerPosition.x + elementsSize < canvasSize + elementsSize) {
    playerPosition.x += elementsSize;
    startGame();
  }
  console.log({playerPosition});
}

function moveDown() {
  if (playerPosition.y + elementsSize < canvasSize + elementsSize)  {
    playerPosition.y += elementsSize;
    startGame();
  }
  console.log({playerPosition});
}

// for (let row = 1; row <= 10; row++) {
//   for (let col = 1; col <= 10; col++) {
//     game.fillText(emojis[mapRowsCols[row - 1][col - 1]], elementsSize * col, elementsSize * row);
//   }
// 

// PROPIEDADES DE UN CANVAS 
// game.fillRect(0, 100, 100, 100);
// game.clearRect(50,50,50,50);
// game.font = "25px Verdana"
// game.fillStyle = "purple";
// game.textAlign = "center";
// game.fillText('Ruben', 100, 50);s