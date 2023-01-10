const canvas = document.getElementById('game');
const game = canvas.getContext("2d");
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const playerLives = document.getElementById('lives');
const playerTime = document.getElementById('time');
const record = document.getElementById('record');
const pResult = document.querySelector('#pResult');
const NewGame= document.getElementById("newGame");

let canvasSize;
let canvasElement;
let timeInterval
let time_playing

const playerDetails = {
    lives: 3,
    timeStart:  undefined,
    timePlaying: undefined,
    render: function () {
        showLives()

        if (!this.timeStart) {
            this.timeStart = Date.now()
            timeInterval = setInterval(showTime, 100)
        }
        showRecord()
    }
}

const map = {
    lvl: 0,

    playerPosition: {
        x: undefined,
        y: undefined,
        render: function () {
            game.fillText(emojis["PLAYER"], this.y, this.x);
            const coincideX = Math.floor(this.x) === Math.floor(map.giftPosition.x);
            const coincideY = Math.floor(this.y) === Math.floor(map.giftPosition.y);

            if (coincideY && coincideX) {
                console.log("Subiste de nivel")
                upgradeLevel()
            }

            resetGame()
        }
    },

    giftPosition: {
        x: undefined,
        y: undefined,
    },

    bombPosition: [],

    render: function () {
        if (!maps[this.lvl]) {
            winGame();
            return;
        }

        const Map = maps[this.lvl].match(/[IXO\-]+/g).map(a => a.split("")) || console.log("No more maps");

        game.font = canvasElement + "px Verdana";
        game.textAlign = "end";
        game.clearRect(0, 0, canvasSize, canvasSize);

        Map.forEach((x, xi) => {
            x.forEach((y, yi) => {
                const posX = canvasElement * (xi + 1);
                const posY = canvasElement * (yi + 1);
                game.fillText(emojis[y], posY, posX);

                if (y === "O") {
                    if (this.playerPosition.x === undefined && this.playerPosition.y === undefined) {
                        this.playerPosition.x = posX;
                        this.playerPosition.y = posY;
                    }
                }
                if (y === "I") {
                    this.giftPosition.x = posX;
                    this.giftPosition.y = posY;
                }
                if (y === "X") {
                    this.bombPosition.push({ x: posX, y: posY });
                }
            })
        })
        this.playerPosition.render();
    }
}


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
NewGame.addEventListener('click', newGame);

function newGame(){
    map.lvl = 0;
    playerDetails.lives = 3;
    clearInterval( timeInterval );
    playerDetails.timeStart = undefined;
    map.playerPosition.x = undefined;
    map.playerPosition.y = undefined;
    pResult.innerText = " ";
    startGame();
}

function setCanvasSize() {
    window.innerHeight > window.innerWidth
    ? canvasSize = window.innerWidth * 0.7
    : canvasSize = window.innerHeight * 0.7;

    canvas.setAttribute("height", canvasSize);
    canvas.setAttribute("width", canvasSize);
    canvasElement = canvasSize / 10;
    map.playerPosition.x = undefined;
    map.playerPosition.y = undefined;
    startGame();
}

function startGame() {
    map.bombPosition = [];
    map.render();
    playerDetails.render();
}

function upgradeLevel() {
    map.lvl += 1;
    startGame();
}

function colision() {
    const enemyColition = map.bombPosition.find(a => {
        const coincideX = map.playerPosition.x.toFixed(3) === a.x.toFixed(3);
        const coincideY = map.playerPosition.y.toFixed(3) === a.y.toFixed(3);
        return coincideY && coincideX
    })

    if (enemyColition && playerDetails.lives <= 0) {
        playerDetails.timeStart = undefined;
        pResult.innerHTML = "You Loose!";
    } 
    return enemyColition;
}

function resetGame() {
    if (colision()) {
        playerDetails.lives--;
        canvasMsg("chocaste");
        if (playerDetails.lives <= 0) {
            map.lvl = 0;
            playerDetails.lives = 3;
            clearInterval(timeInterval);
            playerDetails.timeStart = undefined;
        }

        map.playerPosition.x = undefined;
        map.playerPosition.y = undefined;
        startGame();
    }
}

function winGame() {
    const record = localStorage.getItem("record");

    if (record === null) {
        pResult.innerText ="You did it!!!";
        localStorage.setItem("record", time_playing);
    }

    if (time_playing < localStorage.getItem("record")) {
        localStorage.setItem("record", time_playing);
        pResult.innerText = "New Record!";
    }

    if (time_playing > localStorage.getItem("record")) {
        pResult.innerText = "Keep trying!"
    }

    clearInterval(timeInterval);
    console.log("Ganaste");
}


//Detalles del jugador

function showLives() {
    const lives = Array(playerDetails.lives).fill(emojis["HEART"]).join("");
    playerLives.innerText = lives;
}

function showTime() {
    time_playing = formatTime(Date.now() - playerDetails.timeStart);
    playerTime.innerHTML = time_playing;
}

function showRecord() {
    record.innerText = localStorage.getItem("record");
}

function formatTime(ms){
  const cs = parseInt(ms/10) % 100;
  const seg = parseInt(ms/1000) % 60;
  const min = parseInt(ms/60000) % 60;
  const csStr = `${cs}`.padStart(2,"0");
  const segStr = `${seg}`.padStart(2,"0");
  const minStr = `${min}`.padStart(2,"0");
  return`${minStr}:${segStr}:${csStr}`;
}


//moviemientos

window.addEventListener("keyup", moveByKey);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveUp() {
    map.playerPosition.x - canvasElement < canvasElement
    ? map.playerPosition.x = canvasElement
    : map.playerPosition.x -= canvasElement;

    startGame();
}

function moveLeft() {
    map.playerPosition.y - canvasElement < canvasElement
    ? map.playerPosition.y = canvasElement
    : map.playerPosition.y -= canvasElement
    startGame();
}

function moveRight() {
    map.playerPosition.y + canvasElement > canvasSize
    ? map.playerPosition.y = canvasSize
    : map.playerPosition.y += canvasElement;
    startGame();
}

function moveDown() {
    map.playerPosition.x + canvasElement > canvasSize
    ? map.playerPosition.x = canvasSize
    : map.playerPosition.x += canvasElement;

    startGame();
}

function moveByKey(event) {
    if (event.key === "ArrowUp") moveUp();
    if (event.key === "ArrowLeft") moveLeft();
    if (event.key === "ArrowRight") moveRight();
    if (event.key === "ArrowDown") moveDown();
}

function startAgain(){
  location.reload();
}

// Con local storage tienes que guardar el record de los jugadores usando el metodo SET ITEM - GET ITEM 

// Cada vez que juegen van a demorarse cierto tiempo y si ese tiempo ES MENOR a la variable RECORD que hayas guardado en local storage vamos a concluir que superaron el record guardando esa nueva variable en localstorage

// Cuando termine el juego y se ejecute esa funcion gameWIN busquemos en el local storage esa variable record, verifiquemos que el tiempo es mayor o menor al tiempo en que nuestros jugadores hayan tardado en jugar, siendo el caso actualizar 