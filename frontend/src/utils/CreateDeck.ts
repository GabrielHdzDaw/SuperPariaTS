import Card from '../models/Card';

const suits = ["H", "D", "C", "S"];
const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck(): Card[] {
    const deck: Card[] = [];

    suits.forEach(suit => {
        values.forEach(value => {
            const frontImage = `./src/assets/images/cards1/${suit}${value}.png`;
            deck.push(new Card(suit, value, frontImage));
        });
    });

    return deck;
}

type playingDeck = [
    Card, Card, Card, Card,
    Card, Card, Card, Card,
    Card, Card, Card, Card,
    Card, Card, Card, Card,
];

export function getPairs(): Card[] {
    const deck: Card[] = createDeck();
    deck.sort(() => Math.random() - 0.5);
    
    const cards: playingDeck = [
        deck[0], deck[0].copy(), deck[1], deck[1].copy(),
        deck[2], deck[2].copy(), deck[3], deck[3].copy(),
        deck[4], deck[4].copy(), deck[5], deck[5].copy(),
        deck[6], deck[6].copy(), deck[7], deck[7].copy(),
    ];
    cards.sort(() => Math.random() - 0.5);

    return cards
}