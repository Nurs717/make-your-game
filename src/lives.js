import { Entity } from './entity.js';
import { ENDGAME } from './index.js';

const gameover = new Audio("/src/sound/gameover.mp3")
const minus = new Audio("/src/sound/minus.mp3")

export class Lives extends Entity {
    constructor() {
        super({ className: 'lives' });
        this.lives = 3;
        this.setXY(window.innerWidth / 2 - 25, window.innerHeight - 60);
        this.refreshText();
    }

    removeLife(amount) {
        this.lives--;
        minus.play();
        this.refreshText();
        if (this.lives === 0) {
            gameover.play();
            document.querySelector(".game-over").style.display = "block";
            ENDGAME.status = true;
        }
    }

    refreshText() {
        this.el.innerText = new Array(this.lives).fill(`❤`).join(' ');
    }
}