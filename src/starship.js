// import shipImage from '/src/images/ship.png'
import { Entity } from './entity.js';

export class StarShip extends Entity {
    constructor({ removeLife, getOverLappingBullet, removeBullet, GAME_Y }) {
        super({ tag: 'img' })
        this.el.src = "/src/images/ship.png";

        this.Speed = 3;
        this.Ship_Image_Width = 43;
        this.canFire = true;
        this.isAlive = true;

        this.removeLife = removeLife;
        this.getOverLappingBullet = getOverLappingBullet;
        this.removeBullet = removeBullet

        this.setXY(window.innerWidth / 2, window.innerHeight - ((window.innerHeight - GAME_Y) / 2) - 100);
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
        const bullet = this.getOverLappingBullet(this);
        if (bullet && bullet.isEnemy) {
            this.removeBullet(bullet);
            this.removeLife();
        }
    }
}