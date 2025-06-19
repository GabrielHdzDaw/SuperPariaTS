import Card from "./models/Card";
import { getPairs } from "./utils/CreateDeck";


// const playArea = document.getElementById("playArea");
// const deck: Card[] = getPairs();

// deck.forEach((card) => {
//   const cardElement = document.createElement("div");
//   cardElement.className = "card";
//   cardElement.dataset.suit = card.suit;
//   cardElement.dataset.value = card.value;
//   cardElement.style.backgroundImage = `url(${card.currentImage})`;
//   cardElement.title = `${card.suit}${card.value}`;

//   cardElement.addEventListener("click", () => {
//     card.flip();
//     cardElement.style.backgroundImage = `url(${card.currentImage})`;
//   });

//   playArea?.appendChild(cardElement);
// });

import { startShaderBackground } from './backgroundShader';
import fragShaderSrc from './assets/shader.frag?raw';

startShaderBackground(fragShaderSrc);
