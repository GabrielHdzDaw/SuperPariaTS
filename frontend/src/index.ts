import Card from "./models/Card";
import { getPairs } from "./utils/CreateDeck";


const playArea = document.getElementById("playArea");
const deck: Card[] = getPairs();

deck.forEach((card) => {
  const cardElement = document.createElement("div");
  cardElement.className = "card";

  const cardInner = document.createElement("div");
  cardInner.className = "card-inner";

  const cardFront = document.createElement("div");
  cardFront.className = "card-front";
  cardFront.style.backgroundImage = `url(${card.frontImage})`;

  const cardBack = document.createElement("div");
  cardBack.className = "card-back";
  cardBack.style.backgroundImage = `url(${card.backImage})`;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  cardElement.appendChild(cardInner);

  cardElement.addEventListener("click", () => {
    card.flip();
    cardElement.classList.toggle("flipped");
  });

  playArea?.appendChild(cardElement);
});

import { startShaderBackground } from './backgroundShader';
import fragShaderSrc from './assets/shader.frag?raw';

startShaderBackground(fragShaderSrc);
