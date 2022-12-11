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

const giftPosition = {
  x: undefined,
  y: undefined,
}

let enemyPositions = [];

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

  const map = maps[1];
  const mapRows = map.trim().split('\n');
  const mapRowsCols = mapRows.map(row => row.trim().split(''));
  console.log({maps, mapRows, mapRowsCols});

  enemyPositions = [];

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
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }

      game.fillText(emoji, posX, posY);
    }) 
  })

  movePlayer();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  
  if (giftCollision) {
    console.log('Subiste de nisvel!');
  }

  const enemyColision = enemyPositions.some(enemy => {
    return (playerPosition.x == enemy.x) && (playerPosition.y == enemy.y)
  })

  if (enemyColision) {
    console.log('MORISTE!!');
  }

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
  if ((playerPosition.y - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}

function moveLeft() {
  if ((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}

function moveRight() {
  if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}

function moveDown() {
  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
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