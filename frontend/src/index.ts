import Card from "./models/Card";
import { getPairs } from "./utils/CreateDeck";

let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = window.innerHeight - e.clientY; // Invertir Y para GL
});

const gameBoard = document.getElementById('gameBoard')!;
if (!gameBoard) throw new Error('#gameBoard no encontrado');

let smoothMouse = { x: 0, y: 0 };

function updateParallax() {
  smoothMouse.x += (mouse.x - smoothMouse.x) * 0.05;
  smoothMouse.y += (mouse.y - smoothMouse.y) * 0.05;

  const xOffset = ((smoothMouse.x / window.innerWidth) - 0.5) * -10;
  const yOffset = ((smoothMouse.y / window.innerHeight) - 0.5) * 5;

  gameBoard.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

  requestAnimationFrame(updateParallax);
}

updateParallax();

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
