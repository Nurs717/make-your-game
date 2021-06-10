const requestAnimationFrame = window.requestAnimationFrame;

import { Bullet } from './bullet.js';
import { StarShip } from './starship.js';
import { Enemy } from './enemy.js';
import { Score } from './score.js'

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    [' ']: false,
};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    console.log(keys)
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
    console.log(keys)
});

const starShip = new StarShip();
const bullets = [];
const enemies = [];
const scoreGui = new Score();

const removeEnemy = (enemy) => {
    enemies.splice(enemies.indexOf(enemy), 1);
    enemy.remove();
}

const removeBullet = (bullet) => {
    bullets.splice(bullets.indexOf(bullet), 1);
    bullet.remove();
}

const isOverLapping = (entity1, entity2) => {
    const rect1 = entity1.el.getBoundingClientRect();
    const rect2 = entity2.el.getBoundingClientRect();
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

const getOverLappingBullet = (entity) => {
    for (let bullet of bullets) {
        if (isOverLapping(entity, bullet)) {
            return bullet;
        }
    }
    return null
};

for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 9; col++) {
        const enemy = new Enemy({
            x: col * 130 + 240,
            y: row * 120 + 80,
            getOverLappingBullet,
            removeEnemy,
            removeBullet,
            addToScore: (amount) => scoreGui.addToScore(amount),
        });
        enemies.push(enemy);
    }
}

const getLeftMostEnemy = () => {
    return enemies.reduce((minimumEnemy, currentEnemy) => {
        return currentEnemy.x < minimumEnemy.x ?
            currentEnemy :
            minimumEnemy;
    });
}

const getRightMostEnemy = () => {
    return enemies.reduce((maximumEnemy, currentEnemy) => {
        return currentEnemy.x > maximumEnemy.x ?
            currentEnemy :
            maximumEnemy;
    });
}

const createBullet = ({ x, y }) => {
    bullets.push(
        new Bullet({
            x,
            y,
        })
    );
}

const update = () => {
    if (keys['ArrowRight'] && starShip.x < window.innerWidth - starShip.Ship_Image_Width) {
        starShip.moveRight();
    } else if (keys['ArrowLeft'] && starShip.x > 0) {
        starShip.moveLeft();
    }

    if (keys[' ']) {
        starShip.fire({
            createBullet,
        });
    }

    bullets.forEach(bullet => {
        bullet.update();

        if (bullet.y < 0) {
            bullet.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });

    enemies.forEach((enemy) => {
        enemy.update();
    });

    const leftMostEnemy = getLeftMostEnemy();
    if (leftMostEnemy.x < 30) {
        enemies.forEach((enemy) => {
            enemy.setDirectionRight();
            enemy.moveDown();
        });
    }

    const rightMostEnemy = getRightMostEnemy();
    if (rightMostEnemy.x > window.innerWidth - 82) {
        enemies.forEach((enemy) => {
            enemy.setDirectionLeft();
            enemy.moveDown();
        });
    }
};

function startAnimating() {
    requestAnimationFrame(startAnimating);
    update();
};
startAnimating();

// setInterval(update, 20);










































// const grid = document.querySelector('.grid');
// const resultsDisplay = document.querySelector('#results');
// const timerDisplay = document.querySelector('#time');
// const lifesDisplay = document.querySelector('#life');
// const requestAnimationFrame = window.requestAnimationFrame;
// const pause = document.getElementById('pause');
// const event = window.event;
// let lifes = 3;
// let currentShooterIndex = 825;
// let width = 30;
// let direction = 1;
// let invadersId;
// let goingRight = true;function startAnimating() {
//     speedInterval = 600;
//     then = Date.now();
//     startTime = Date.now();
//     animate();
// };
// startAnimating();
// const squares = Array.from(document.querySelectorAll('.grid div'));

// const alienInvaders = [
//     0, 2, 4, 6, 8, 10, 12, 14, 16, 18,
//     60, 62, 64, 66, 68, 70, 72, 74, 76, 78,
//     120, 122, 124, 126, 128, 130, 132, 134, 136, 138
// ]


// function draw() {
//     for (let i = 0; i < alienInvaders.length; i++) {
//         if (!aliensRemoved.includes(i)) {
//             squares[alienInvaders[i]].classList.add('invader');
//         };
//     };
// };

// draw();

// function remove() {
//     for (let i = 0; i < alienInvaders.length; i++) {
//         squares[alienInvaders[i]].classList.remove('invader');
//     };
// };

// squares[currentShooterIndex].classList.add('shooter');


// function moveShooter(e) {
//     squares[currentShooterIndex].classList.remove('shooter')
//     switch (e.key) {
//         case 'ArrowLeft':
//             if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
//             break
//         case 'ArrowRight':
//             if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
//             break
//     };
//     squares[currentShooterIndex].classList.add('shooter');
// };
// document.addEventListener('keydown', moveShooter);


// function moveInvaders() {
//     const leftEdge = alienInvaders[0] % width === 0;
//     const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
//     remove();

//     if (rightEdge && goingRight) {
//         for (let i = 0; i < alienInvaders.length; i++) {
//             alienInvaders[i] += width + 1;
//             direction = -1;
//             goingRight = false;
//         };
//     };

//     if (leftEdge && !goingRight) {
//         for (let i = 0; i < alienInvaders.length; i++) {
//             alienInvaders[i] += width - 1;
//             direction = 1;
//             goingRight = true;
//         };
//     };

//     for (let i = 0; i < alienInvaders.length; i++) {
//         alienInvaders[i] += direction;
//     };

//     draw();

//     if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
//         lifes--;
//         if (lifes === 0) {
//             resultsDisplay.innerHTML = 'GAME OVER';
//         };
//         alienInvaders = alienInvadersrefresh
//     };

//     for (let i = 0; i < alienInvaders.length; i++) {
//         if (alienInvaders[i] > (squares.length)) {
//             lifes--;
//             if (lifes === 0) {
//                 resultsDisplay.innerHTML = 'GAME OVER';
//             };
//             clearInterval(invadersId)
//         };
//     };
//     if (aliensRemoved.length === alienInvaders.length) {
//         resultsDisplay.innerHTML = 'YOU WIN';
//         // clearInterval(invadersId)
//     };
// };

// function startAnimating() {
//     speedInterval = 600;
//     then = Date.now();
//     startTime = Date.now();
//     animate();
// };
// startAnimating();

// function animate() {
//     // pause2 = event;
//     // console.log(pause2);

//     // calc elapsed time since last loop

//     now = Date.now();
//     elapsed = now - then;

//     lifesDisplay.innerHTML = lifes;

//     // request another frame
//     if (now < (startTime + 14000)) {
//         requestAnimationFrame(animate);
//         if (timeflag <= 60) {
//             timeflag++;
//         } else {
//             timer--;
//             timeflag = 0;
//         };
//         timerDisplay.innerHTML = timer;
//     } else {
//         resultsDisplay.innerHTML = 'GAME OVER';
//     };

//     // if enough time has elapsed, draw the next frame

//     if (elapsed > speedInterval) {
//         // console.log("animated");
//         moveInvaders();
//         // Get ready for next frame by setting then=now, but also adjust for your
//         // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
//         then = now - (elapsed % speedInterval);

//         // Put your drawing code here

//     };
// };

// function shoot(e) {
//     let laserId;
//     let currentLaserIndex = currentShooterIndex;

//     function moveLaser() {
//         if (squares[currentLaserIndex] != undefined) {
//             squares[currentLaserIndex].classList.remove('laser');
//             currentLaserIndex -= width;
//             if (squares[currentLaserIndex] != undefined) {
//                 squares[currentLaserIndex].classList.add('laser');

//                 if (squares[currentLaserIndex].classList.contains('invader')) {
//                     squares[currentLaserIndex].classList.remove('laser');
//                     squares[currentLaserIndex].classList.remove('invader');
//                     squares[currentLaserIndex].classList.add('boom');

//                     setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
//                     clearInterval(laserId);

//                     const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
//                     aliensRemoved.push(alienRemoved);
//                     results++;
//                     resultsDisplay.innerHTML = results;
//                     // console.log(aliensRemoved);

//                 };
//             };
//         };

//     };
//     switch (e.keyCode) {
//         case 32:
//             laserId = setInterval(moveLaser, 100);
//     };
// };

// document.addEventListener('keydown', shoot);