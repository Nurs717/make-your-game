import { Entity } from './entity.js';
import { ENDGAME } from './index.js';

const explosion = new Audio("/src/sound/explosion.mp3");
const POINTS_PER_KILL = 20;

export class Enemy extends Entity {
    constructor({ x, y, getOverLappingBullet, removeEnemy, removeBullet, addToScore, GAME_Y, }) {
        super({ tag: 'img', className: 'enemy' })
        this.el.src = "/src/images/enemy.png";
        this.Speed = 1;
        this.DownSpeed = 10;
        this.direction = 'LEFT';
        this.maxY = (window.innerHeight - GAME_Y) / 2 + GAME_Y - 100;

        this.getOverLappingBullet = getOverLappingBullet;
        this.removeBullet = removeBullet;
        this.removeEnemy = removeEnemy;
        this.addToScore = addToScore;

        this.setXY(x + 17, y - 37);
    }

    setDirectionRight() {
        this.direction = 'RIGHT';
    }

    setDirectionLeft() {
        this.direction = 'LEFT';
    }

    moveDown() {
        this.setXY(this.x, this.y + this.DownSpeed);
    }

    update() {
        if (this.direction === 'LEFT') {
            this.setXY(this.x - this.Speed, this.y);
        } else {
            this.setXY(this.x + this.Speed, this.y);
        }

        if (this.y > this.maxY) {
            document.querySelector(".game-over").style.display = "block";
            ENDGAME.status = true;
            console.log('maxY')
        }

        const bullet = this.getOverLappingBullet(this);
        if (bullet && !bullet.isEnemy) {
            this.el.src = "/src/images/explosion.png";
            this.el.className = 'boom';
            let audio = explosion.cloneNode(false)
            audio.play();
            this.removeBullet(bullet);
            this.addToScore(POINTS_PER_KILL);
            setTimeout(() => {
                this.removeEnemy(this);
            }, 500);
        }
    }
}