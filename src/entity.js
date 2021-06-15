export class Entity {
    constructor({ tag = 'div', className = '' } = {}) {
        this.el = document.createElement(tag);
        document.body.appendChild(this.el);
        this.el.className = 'entity ' + className;
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    remove() {
        this.el.remove();
        this.el = null;
    }
}