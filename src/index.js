const requestAnimationFrame = window.requestAnimationFrame;

import { Bullet } from './bullet.js';
import { StarShip } from './starship.js';
import { Enemy } from './enemy.js';
import { Score } from './score.js';
import { Lives } from './lives.js';
import { Timer } from './timer.js';

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    [' ']: false,
    p: false
};

document.addEventListener('keydown', (event) => {
    if (keys[event] !== 'p') {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (keys[event] !== 'p') {
        keys[event.key] = false;
    }
});

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const GAME_X = 800;
const GAME_Y = 600;

const starshipMax = windowWidth - ((windowWidth - GAME_X) / 2) - 43;
const starshipMin = (windowWidth - GAME_X) / 2;
const enemyLeftBorder = (windowWidth - GAME_X) / 2;
const enemyRightBorder = windowWidth - ((windowWidth - GAME_X) / 2) - 30;

const ENEMY_ROWS = 3;
const ENEMY_COLS = 6;

var PAUSED = false;
export var ENDGAME = {
    status: false,
}

const bullets = [];
const enemies = [];
const enemiesGrid = [];
const scoreGui = new Score();
const livesGui = new Lives();

var secondRAF = 0;
var time = 0;

const timer = new Timer();

document.querySelector(".continue").addEventListener("click", (e) => {
    document.querySelector(".pause").style.display = "none";
    PAUSED = false;
})

const removeEnemy = (enemy) => {
    enemies.splice(enemies.indexOf(enemy), 1);
    enemy.remove();
    if (enemies.length === 0) {
        document.querySelector(".congrats").style.display = "block";
        ENDGAME.status = true;
    }
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

const getOverLappingEnemies = (entity) => {
    for (let enemy of enemies) {
        if (isOverLapping(entity, enemy)) {
            return enemy;
        }
    }
    return null
};

const starShip = new StarShip({
    removeLife: () => livesGui.removeLife(),
    getOverLappingBullet,
    getOverLappingEnemies,
    removeBullet,
    GAME_Y,
});

for (let row = 0; row < ENEMY_ROWS; row++) {
    const enemiesCol = [];
    for (let col = 0; col < ENEMY_COLS; col++) {
        const enemy = new Enemy({
            x: ((windowWidth - GAME_X) / 2) + col * 125 + 40,
            y: ((windowHeight - GAME_Y) / 2) + row * 80 + 40,
            getOverLappingBullet,
            removeEnemy,
            removeBullet,
            addToScore: (amount) => scoreGui.addToScore(amount),
            GAME_Y,
        });
        enemies.push(enemy);
        enemiesCol.push(enemy);
    }
    enemiesGrid.push(enemiesCol);
}

const getBottomEnemies = () => {
    const bottomEnemies = [];
    for (let col = 0; col < ENEMY_COLS; col++) {
        for (let row = ENEMY_ROWS - 1; row >= 0; row--) {
            if (enemiesGrid[row][col].el) {
                bottomEnemies.push(enemiesGrid[row][col]);
                break;
            }
        }
    }
    return bottomEnemies;
};

const getRandomEnemy = (enemyList) => {
    return enemyList[
        parseInt(Math.random() * enemyList.length)
    ];
}

const enemyFireBullet = () => {
    const bottomEnemies = getBottomEnemies();
    const randomEnemy = getRandomEnemy(bottomEnemies);

    if (!PAUSED && !ENDGAME.status) {
        createBullet({
            x: randomEnemy.x + 5,
            y: randomEnemy.y + 76,
            isEnemy: true,
        });
    };
};

setInterval(enemyFireBullet, 3000);

const getLeftMostEnemy = () => {
    if (!ENDGAME.status) {
        return enemies.reduce((minimumEnemy, currentEnemy) => {
            return currentEnemy.x < minimumEnemy.x ?
                currentEnemy :
                minimumEnemy;
        });
    }
}

const getRightMostEnemy = () => {
    return enemies.reduce((maximumEnemy, currentEnemy) => {
        return currentEnemy.x > maximumEnemy.x ?
            currentEnemy :
            maximumEnemy;
    });
}

const createBullet = ({ x, y, isEnemy = false }) => {
    bullets.push(
        new Bullet({
            x,
            y,
            isEnemy,
        })
    );
}

const update = () => {
    if (secondRAF === 60) {
        secondRAF = 0;
        time++;
        timer.formatTime(time);
    }
    secondRAF++

    if (keys['ArrowRight'] && starShip.x < starshipMax) {
        starShip.moveRight();
    } else if (keys['ArrowLeft'] && starShip.x > starshipMin) {
        starShip.moveLeft();
    }

    if (keys[' ']) {
        starShip.fire({
            createBullet,
        });
    }

    starShip.update();

    bullets.forEach(bullet => {

        bullet.update();

        if (bullet.y < 0) {
            bullet.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        } else if (bullet.y > windowHeight) {
            bullet.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });

    enemies.forEach((enemy) => {
        enemy.update();
    });

    if (!ENDGAME.status) {
        const leftMostEnemy = getLeftMostEnemy();
        if (leftMostEnemy.x < enemyLeftBorder) {
            enemies.forEach((enemy) => {
                enemy.setDirectionRight();
                enemy.moveDown();
            });
        }

        const rightMostEnemy = getRightMostEnemy();
        if (rightMostEnemy.x > enemyRightBorder) {
            enemies.forEach((enemy) => {
                enemy.setDirectionLeft();
                enemy.moveDown();
            });
        }
    }
};

function startAnimating() {
    requestAnimationFrame(startAnimating);
    if (!ENDGAME.status && !PAUSED) {
        update();
    }

    if (keys['p']) {
        if (!PAUSED) {
            PAUSED = true;
            keys['p'] = false;
        } else {
            PAUSED = false;
            keys['p'] = false;
        }
    }

    if (PAUSED) {
        document.querySelector(".pause").style.display = "block";
    } else {
        document.querySelector(".pause").style.display = "none";
    }
};
startAnimating();