const requestAnimationFrame = window.requestAnimationFrame;

import { Bullet } from './bullet.js';
import { StarShip } from './starship.js';
import { Enemy } from './enemy.js';
import { Score } from './score.js'
import { Lives } from './lives.js'

const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    [' ']: false,
    p: false
};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    if (keys[event] !== 'p') {
        keys[event.key] = false;
    };
});

const GAME_X = 1000;
const GAME_Y = 800;

const ENEMY_ROWS = 5;
const ENEMY_COLS = 7;

var PAUSED = false;

const bullets = [];
const enemies = [];
const enemiesGrid = [];
const scoreGui = new Score();
const livesGui = new Lives();

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

const starShip = new StarShip({
    removeLife: () => livesGui.removeLife(),
    getOverLappingBullet,
    removeBullet,
    GAME_Y,
});

for (let row = 0; row < ENEMY_ROWS; row++) {
    const enemiesCol = [];
    for (let col = 0; col < ENEMY_COLS; col++) {
        const enemy = new Enemy({
            x: ((window.innerWidth - GAME_X) / 2) + col * 100 + 240,
            y: ((window.innerHeight - GAME_Y) / 2) + row * 80 + 40,
            getOverLappingBullet,
            removeEnemy,
            removeBullet,
            addToScore: (amount) => scoreGui.addToScore(amount),
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

    if (!PAUSED) {
        createBullet({
            x: randomEnemy.x + 5,
            y: randomEnemy.y + 76,
            isEnemy: true,
        });
    };
};

setInterval(enemyFireBullet, 3000);

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
    if (keys['ArrowRight'] && starShip.x < window.innerWidth - ((window.innerWidth - GAME_X) / 2) - starShip.Ship_Image_Width && !PAUSED) {
        starShip.moveRight();
    } else if (keys['ArrowLeft'] && starShip.x > (window.innerWidth - GAME_X) / 2 && !PAUSED) {
        starShip.moveLeft();
    }

    if (keys[' '] && !PAUSED) {
        starShip.fire({
            createBullet,
        });
    }

    if (keys['p']) {
        if (!PAUSED) {
            PAUSED = true;
        } else {
            PAUSED = false;
        }
    }

    starShip.update();

    bullets.forEach(bullet => {
        if (!PAUSED) {
            bullet.update();
        };

        if (bullet.y < 0) {
            bullet.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        } else if (bullet.y > window.innerHeight) {
            console.log(window.innerHeight)
            bullet.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });

    enemies.forEach((enemy) => {
        if (!PAUSED) {
            enemy.update();
        };
    });

    const leftMostEnemy = getLeftMostEnemy();
    if (leftMostEnemy.x < (window.innerWidth - GAME_X) / 2) {
        enemies.forEach((enemy) => {
            enemy.setDirectionRight();
            enemy.moveDown();
        });
    }

    const rightMostEnemy = getRightMostEnemy();
    if (rightMostEnemy.x > window.innerWidth - ((window.innerWidth - GAME_X) / 2) - 30) {
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