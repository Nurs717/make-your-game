import { Entity } from './entity.js';

export class Timer extends Entity {
    constructor() {
        super({ className: 'timer' });
        this.setXY(50, 20);
        this.time = new Date(0).toISOString().substr(14, 5);
        this.refreshText();
    }

    formatTime(seconds) {
        this.time = new Date(seconds * 1000).toISOString().substr(14, 5);
        this.refreshText()
    }

    refreshText() {
        this.el.innerText = `Time: ${this.time}`;
    }
}