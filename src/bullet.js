import { Entity } from './entity.js';

export class Bullet extends Entity {
    constructor({ x, y, isEnemy }) {
        super({ tag: 'img', className: 'bullet' })
        this.Speed = 4;
        this.isEnemy = isEnemy;
        this.isEnemy ? this.el.src = "/src/images/enemybullet.png" : this.el.src = "/src/images/bullet.png";

        this.setXY(x + 17, y - 37);
    }

    update() {
        const dy = this.isEnemy ? this.Speed : -this.Speed
        this.setXY(this.x, this.y + dy);
    }
}