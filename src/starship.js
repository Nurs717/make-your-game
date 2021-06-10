// import shipImage from '/src/images/ship.png'
import { Entity } from './entity.js';

export class StarShip extends Entity {
    constructor() {
        super({ tag: 'img' })
        this.el.src = "/src/images/ship.png";

        this.Speed = 2;
        this.Ship_Image_Width = 43;
        this.canFire = true;

        this.setX(window.innerWidth / 2);
        this.setY(window.innerHeight - 150);
    }

    moveRight() {
        this.setX(this.x + this.Speed);
    }

    moveLeft() {
        this.setX(this.x - this.Speed);
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
}