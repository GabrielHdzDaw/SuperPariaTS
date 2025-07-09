import Card from "./models/Card";
import { CardComponent } from './components/CardComponent';
import { getPairs } from "./utils/CreateDeck";
import { setupParallaxMouse } from './effects/parallax';
import { startShaderBackground } from './backgroundShader';
import { Button } from './components/Button';
import { playSound } from './audio/audioManager';
import { circleTransition } from './effects/circle';

import fragShaderSrc from './assets/shaders/backgroundShader.frag?raw';

const TIME_LIMIT = 60; // Tiempo límite en segundos

const playArea = document.getElementById("playArea") as HTMLDivElement | null;
const blur = document.querySelector(".blur") as HTMLDivElement | null;
const gameBoardOptions = document.querySelector(".gameboard-options") as HTMLDivElement | null;
const timerElement = document.querySelector(".timer") as HTMLSpanElement | null;
let deck: Card[] = getPairs();
let flippedCards: CardComponent[] = [];
let lockBoard = false;
let matchedPairs = 0;
let gameComponents: CardComponent[] = [];
let timeLeft = TIME_LIMIT; // Tiempo inicial en segundos
let countdownInterval: number | undefined;



function dealCards(gameComponents: CardComponent[]): void {
  gameComponents.forEach((component, index) => {
    setTimeout(() => {
      component.element.classList.remove("invisible");
      playSound.flip();


    }, index * 100);
  });

  const totalDelay = gameComponents.length * 100 + 300;

  setTimeout(() => {

    gameComponents.forEach((component) => component.flip());

    playSound.flip();

    setTimeout(() => {

      gameComponents.forEach((component) => {
        component.flip();

        component.element.classList.remove("disabled");

      });

      playSound.flip();
    }, 1000);
    startCountdown();
  }, totalDelay);

}

function createGameBoard(): void {
  circleTransition().then(() => {
    playArea!.innerHTML = '';
    deck.forEach((card) => {
      const cardComponent = new CardComponent(card, (clickedCardComponent) => {
        handleCardClick(clickedCardComponent);
      });

      gameComponents.push(cardComponent);
      playArea?.appendChild(cardComponent.element);
    });
    gameComponents.forEach((component) => {
      component.element.classList.add("invisible", "disabled");

    });
    dealCards(gameComponents);

  }).catch((error) => {
    console.error("Error al crear el tablero de juego:", error);
  });
}

function handleCardClick(clickedCardComponent: CardComponent): void {
  if (lockBoard || flippedCards.includes(clickedCardComponent) || clickedCardComponent.isMatched()) return;

  clickedCardComponent.flip();
  playSound.flip();

  flippedCards.push(clickedCardComponent);

  if (flippedCards.length === 2) {
    lockBoard = true;

    const [first, second] = flippedCards;

    if (first.getCard().isMatch(second.getCard())) {
      console.log("Match found!");

      first.setMatched(true);
      second.setMatched(true);

      matchedPairs++;

      flippedCards.length = 0;
      lockBoard = false;

      if (matchedPairs === deck.length / 2) {
        setTimeout(() => {
          if (blur) {
            blur.style.display = "block";
          }

          clearInterval(countdownInterval);
          
          endGame();
        }, 500);
      }
    } else {
      console.log("No match");

      setTimeout(() => {
        first.flip();
        second.flip();
        flippedCards.length = 0;
        lockBoard = false;
      }, 500);
    }
  }
}

function startCountdown(): void {
  const timerElement = document.querySelector(".timer") as HTMLSpanElement | null;
  if (!timerElement) return;

  if (countdownInterval !== undefined) {
    clearInterval(countdownInterval);
  }

  timerElement.textContent = `TIME: ${timeLeft}`;

  countdownInterval = window.setInterval(() => {
    timeLeft--;
    timerElement.textContent = `TIME: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);
}

function endGame(): void {
  lockBoard = true;
}

function resetGame(): void {
  console.log("Resetting game...");
  clearInterval(countdownInterval);
  timeLeft = TIME_LIMIT;
  if (playArea) {
    playArea.innerHTML = '';
  }

  flippedCards.length = 0;
  lockBoard = false;
  matchedPairs = 0;
  gameComponents.length = 0;
  if (blur) {
    blur.style.display = "none";
  }
  // Crear nuevo deck y recrear el tablero
  deck = getPairs();
  createGameBoard();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Creando el tablero de juego...");
  createGameBoard();
});

if (gameBoardOptions) {
  const startButton = new Button("restart");
  startButton.onClick = () => {
    resetGame();
  };
  startButton.render(gameBoardOptions);

  const resetButton = new Button("main menu");
  resetButton.onClick = () => {
    console.log("Main menu");
  };
  resetButton.render(gameBoardOptions);

  const timer = document.createElement("span");
  timer.className = "timer";
  timer.textContent = `TIME: ${timeLeft}`;
  gameBoardOptions.appendChild(timer);


}

setupParallaxMouse('gameBoard');
startShaderBackground(fragShaderSrc);