import { Entity } from './entity.js';

export class Bullet extends Entity {
    constructor({ x, y }) {
        super({ tag: 'img', className: 'bullet' })
        this.el.src = "/src/images/bullet.png";
        this.Speed = 4;

        this.setX(x + 17);
        this.setY(y - 37);
    }

    update() {
        this.setY(this.y - this.Speed);
    }
}