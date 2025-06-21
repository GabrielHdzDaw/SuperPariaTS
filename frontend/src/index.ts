import Card from "./models/Card";
import { getPairs } from "./utils/CreateDeck";
import { setupParallaxMouse } from './effects/parallax';
import { startShaderBackground } from './backgroundShader';
import { Button } from './components/Button';
import fragShaderSrc from './assets/shader.frag?raw';




const playArea = document.getElementById("playArea");
const gameBoardOptions = document.querySelector(".gameboard-options") as HTMLDivElement | null;
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

if (gameBoardOptions) {
  const startButton = new Button("restart");
  startButton.onClick = () => {
    console.log("Game reset");
    // Aquí puedes agregar la lógica para iniciar el juego
  };
  startButton.render(gameBoardOptions);

  const resetButton = new Button("main menu");
  resetButton.onClick = () => {
    console.log("Main menu");
    // Aquí puedes agregar la lógica para reiniciar el juego
  };
  resetButton.render(gameBoardOptions);
  const timer = document.createElement("span");
  timer.className = "timer";
  timer.textContent = "TIME: 00:00";
  gameBoardOptions.appendChild(timer);
}

setupParallaxMouse('gameBoard');


startShaderBackground(fragShaderSrc);
