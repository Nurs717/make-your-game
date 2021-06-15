import { Entity } from './entity.js';

const POINTS_PER_KILL = 10;

export class Enemy extends Entity {
    constructor({ x, y, getOverLappingBullet, removeEnemy, removeBullet, addToScore, }) {
        super({ tag: 'img', className: 'enemy' })
        this.el.src = "/src/images/enemy.png";
        this.Speed = 1;
        this.DownSpeed = 20;
        this.direction = 'LEFT';

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

        const bullet = this.getOverLappingBullet(this);
        if (bullet && !bullet.isEnemy) {
            this.removeEnemy(this);
            this.removeBullet(bullet);
            this.addToScore(POINTS_PER_KILL);
        }
    }
}