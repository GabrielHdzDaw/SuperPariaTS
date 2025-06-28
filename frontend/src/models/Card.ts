import { playSound } from '../audio/audioManager';
export default class Card {
    private static readonly DEFAULT_BACK_IMAGE = "./src/assets/images/cards1/reverse.png";
    public readonly suit: string;
    public readonly value: string;
    public readonly frontImage: string;
    public isFlipped: boolean = false;
    private matched: boolean = false;

    constructor(suit: string, value: string, frontImage: string, isFlipped: boolean = false) {
        this.suit = suit;
        this.value = value;
        this.frontImage = frontImage;
        this.isFlipped = isFlipped;
    }

    flip(force?: boolean): void {
        if (force) {
            this.isFlipped = force;
        }
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

    isMatched(): boolean {
        return this.matched;
    }

    setMatched(matched: boolean): void {
        this.matched = matched;
    }

    copy(): Card {
        return new Card(this.suit, this.value, this.frontImage, this.isFlipped);
    }
}