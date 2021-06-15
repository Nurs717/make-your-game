import { Entity } from './entity.js';

export class Score extends Entity {
    constructor() {
        super();
        this.score = 0;
        this.setXY(window.innerWidth / 2, 20);
        this.refreshText();
    }

    addToScore(amount) {
        this.score += amount;
        this.refreshText();
    }

    refreshText() {
        this.el.innerText = `Score: ${this.score}`
    }
}