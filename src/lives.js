import { Entity } from './entity.js';

export class Lives extends Entity {
    constructor() {
        super({ className: 'lives' });
        this.lives = 3;
        this.setXY(window.innerWidth / 2, window.innerHeight - 50);
        this.refreshText();
    }

    removeLife(amount) {
        this.lives--;
        this.refreshText();
    }

    refreshText() {
        this.el.innerText = new Array(this.lives).fill(`❤`).join(' ');
    }
}