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

        this.setX(x + 17);
        this.setY(y - 37);
    }

    setDirectionRight() {
        this.direction = 'RIGHT';
    }

    setDirectionLeft() {
        this.direction = 'LEFT';
    }

    moveDown() {
        this.setY(this.y + this.DownSpeed);
    }

    update() {
        if (this.direction === 'LEFT') {
            this.setX(this.x - this.Speed);
        } else {
            this.setX(this.x + this.Speed);
        }

        const bullet = this.getOverLappingBullet(this);
        if (bullet) {
            this.removeEnemy(this);
            this.removeBullet(bullet);
            this.addToScore(POINTS_PER_KILL);
        }
    }
}