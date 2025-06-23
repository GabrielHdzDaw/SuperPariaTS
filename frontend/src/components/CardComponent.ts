import Card from '../models/Card';

export class CardComponent {
    public readonly element: HTMLDivElement;
    private readonly card: Card;

    constructor(card: Card, onClick: (component: CardComponent) => void) {
        this.card = card;
        this.element = this.createElement();
        this.element.addEventListener('click', () => onClick(this));
        this.element.addEventListener('mouseover', () => {
            console.log(`${this.card.value}${this.card.suit}`);
        });
    }

    private createElement(): HTMLDivElement {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        cardElement.dataset.suit = this.card.suit;
        cardElement.dataset.value = this.card.value;

        const inner = document.createElement('div');
        inner.className = 'card-inner';

        const front = document.createElement('div');
        front.className = 'card-front';
        front.style.backgroundImage = `url(${this.card.frontImage})`;

        const back = document.createElement('div');
        back.className = 'card-back';
        back.style.backgroundImage = `url(${this.card.backImage})`;

        inner.appendChild(front);
        inner.appendChild(back);
        cardElement.appendChild(inner);

        return cardElement;
    }

    public flip() {
        if (this.card.isMatched()) return; // No hacer nada si ya está emparejada

        this.card.flip(); // Cambia el estado lógico (isFlipped)
        // Sincronizar el estado visual con el lógico
        this.updateVisualState();
    }

    // Nuevo método para actualizar el estado visual
    private updateVisualState() {
        this.element.classList.toggle('flipped', this.card.isFlipped);
    }

    public getCard(): Card {
        return this.card;
    }

    // Helper methods for game logic
    public isFlipped(): boolean {
        return this.card.isFlipped;
    }

    public isMatched(): boolean {
        return this.card.isMatched();
    }

    public setMatched(matched: boolean): void {
        this.card.setMatched(matched);
        if (matched) {
            this.element.classList.add('matched');
            this.element.classList.add('flipped');
            this.element.classList.add('shiny');
            // Opcional: agregar efectos visuales para cartas matched
        } else {
            this.element.classList.remove('matched');
            this.element.classList.remove('flipped');
        }
    }
}