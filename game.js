const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
};
let enemyPositions = [];

window.addEventListener('load', setCanbasSize);
window.addEventListener('resize', setCanbasSize);

// function fixNumber(n) {
//     return Number(n.toFixed(0));
// }

function setCanbasSize() {
    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementsSize = canvasSize / 10;

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}

function startGame() {
    game.font = elementsSize + 'px Verdana';
    game.textAlign = 'end';

    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map, mapRows, mapRowCols});

    showLives();

    enemyPositions = [];
    game.clearRect(0, 0 , canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

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
                    y: posY
                })
            }

            game.fillText(emoji, posX, posY);
        })
    });

    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col++) {
    //         game.fillText(emojis[mapRowCols[row - 1][col - 1]],  elementsSize * col, elementsSize * row);
    //     }
    // }

    movePlayer()
}

function movePlayer() {
    const giftColitionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftColitionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftColition = giftColitionX && giftColitionY;
    if(giftColition) {
        levelWin()
    }

    const enemyCollition = enemyPositions.find(enemy => {
        const enemyCollitionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollitionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollitionX && enemyCollitionY;
    });
    if(enemyCollition) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++
    startGame();
}

function levelFail() {
    console.log('colisionaste!');
    lives--;

    if(lives <= 0) {
        level = 0;  
        lives = 3;
        timeStart = undefined;
    } 

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function gameWin() {
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime) {
        if(recordTime > playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record!!! 🎇';
        }else {
            pResult.innerHTML = 'Lo siento no superaste el record';
        }
    }else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primera vez? Muy bien, trata ahora de superar tu tiempo!'
    }

    console.log({recordTime, playerTime});
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']) ;
    console.log(heartsArray);

    spanLives.innerHTML = '';
    heartsArray.forEach(heart => spanLives.append(heart));
    // spanLives.innerHTML = heatsArray;
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}


window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight(); 
    else if (event.key == 'ArrowDown') moveDown();
    else console.log('presiona las que son loco!');
}

function moveUp() {
    console.log('arriba');
    if ((playerPosition.y - elementsSize) < elementsSize) {
        console.log('out');
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log('izquierda');
    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('out');
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight() {
    console.log('derecha');
    if ((playerPosition.x + elementsSize) > canvasSize) {
        console.log('out');
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown() {
    console.log('abajo');
    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('out');
    } else {
        playerPosition.y += elementsSize;
        startGame();
    }
}