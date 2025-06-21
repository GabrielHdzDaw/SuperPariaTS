export class Button {
    element: HTMLSpanElement;
    constructor(label: string) {
        this.element = document.createElement('span');
        this.element.textContent = label;
        this.element.className = 'button';
    }
    set onClick(callback: () => void) {
        this.element.addEventListener('click', callback);
    }
    render(parent: HTMLDivElement) {
        parent.appendChild(this.element);
    }
}