export default class Card {
    private static readonly DEFAULT_BACK_IMAGE = "./src/assets/images/cards1/reverse.png";
    public readonly suit: string;
    public readonly value: string;
    public readonly frontImage: string;
    public isFlipped: boolean;

    constructor(suit: string, value: string, frontImage: string, isFlipped: boolean = false) {
        this.suit = suit;
        this.value = value;
        this.frontImage = frontImage;
        this.isFlipped = isFlipped;
    }

    flip(): void {
        this.isFlipped = !this.isFlipped;
    }

    get currentImage(): string {
        return this.isFlipped ? this.frontImage : this.backImage;
    }

    get backImage(): string {
        return Card.DEFAULT_BACK_IMAGE;
    }

    isMatch(otherCard: Card): boolean {
        return this.value === otherCard.value && this.suit === otherCard.suit;
    }
}