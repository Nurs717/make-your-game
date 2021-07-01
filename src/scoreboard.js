import { Entity } from './entity.js';

export class ScoreBoard extends Entity {
    constructor() {
        super({ className: 'scoreboard' });
        // this.button = document.createElement('button');
        // this.el.appendChild(this.button.el);
        // this.setXY(window.innerWidth / 2 - 200, 20);
        this.el.innerText = `scoreboard`
    }
}