const laserSound = new Audio("/src/sound/laser.mp3");

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

import { Entity } from './entity.js';
import { ENDGAME } from './index.js';

export class StarShip extends Entity {
    constructor({ removeLife, getOverLappingBullet, getOverLappingEnemies, removeBullet, GAME_Y }) {
        super({ tag: 'img' })
        this.el.src = "/src/images/ship.png";

        this.Speed = 3;
        this.Ship_Image_Width = 43;
        this.canFire = true;
        this.isAlive = true;

        this.removeLife = removeLife;
        this.getOverLappingBullet = getOverLappingBullet;
        this.getOverLappingEnemies = getOverLappingEnemies;
        this.removeBullet = removeBullet

        this.setXY(windowWidth / 2, windowHeight - ((windowHeight - GAME_Y) / 2) - 80);
    }

    moveRight() {
        this.setXY(this.x + this.Speed, this.y);
    }

    moveLeft() {
        this.setXY(this.x - this.Speed, this.y);
    }

    fire({ createBullet }) {
        if (this.canFire) {
            this.canFire = false;
            let audio = laserSound.cloneNode(false)
            audio.play();
            createBullet({
                x: this.x,
                y: this.y,
            });
            setTimeout(() => {
                this.canFire = true;
            }, 1000);
        }
    }

    update() {
        const enemy = this.getOverLappingEnemies(this);
        if (enemy) {
            document.querySelector(".game-over").style.display = "block";
            ENDGAME.status = true;
        }

        const bullet = this.getOverLappingBullet(this);
        if (bullet && bullet.isEnemy) {
            this.removeBullet(bullet);
            this.removeLife();
        }
    }
}