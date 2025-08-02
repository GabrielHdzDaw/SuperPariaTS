import Card from "./models/Card";
import { CardComponent } from './components/CardComponent';
import { getPairs } from "./utils/CreateDeck";
import { setupParallaxMouse } from './effects/parallax';
import { startShaderBackground } from './backgroundShader';
import { Button } from './components/Button';
import { playSound } from './audio/audioManager';
import { circleTransition } from './effects/circle';


const shaderModules = import.meta.glob('./assets/shaders/*.frag', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const shaderMap: Record<string, string> = {};

for (const path in shaderModules) {
  const name = path.split('/').pop()?.replace('.frag', '');
  if (name) shaderMap[name] = shaderModules[path] as string;
}

const TIME_LIMIT = 63; // Tiempo límite en segundos

const playArea = document.getElementById("playArea") as HTMLDivElement | null;
const blur = document.querySelector(".blur") as HTMLDivElement | null;
const gameBoardOptions = document.querySelector(".gameboard-options") as HTMLDivElement | null;
const startTitle = document.querySelector(".start-title") as HTMLDivElement | null;
const loseTitle = document.querySelector(".lose-title") as HTMLDivElement | null;
const winTitle = document.querySelector(".win-title") as HTMLDivElement | null;
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
      component.element.style.animation = 'deal 0.5s forwards';
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
    startCountdown();

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
          win();
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
      gameOver();
    }
  }, 1000);
}

function endGame(): void {
  lockBoard = true;
}

function gameOver(): void {
  console.log("Game Over");
  if (blur) {
    blur.style.display = "block";
  }
  loseTitle!.style.display = "block";
}

function win(): void {
  console.log("You win!");
  if (blur) {
    blur.style.display = "block";
  }
  winTitle!.style.display = "block";
}


function resetGame(): void {
  console.log("Resetting game...");
  if (countdownInterval !== undefined) {
    clearInterval(countdownInterval);
  }

  timeLeft = TIME_LIMIT;
  if (playArea) {
    playArea.innerHTML = '';
  }

  if (loseTitle) {
    loseTitle.style.display = "none";
  }
  if (winTitle) {
    winTitle.style.display = "none";
  }
  flippedCards.length = 0;
  lockBoard = false;
  matchedPairs = 0;
  gameComponents.length = 0;
  if (blur) {
    blur.style.display = "none";
  }

  deck = getPairs();
  createGameBoard();
}

document.addEventListener("DOMContentLoaded", () => {
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

const currentShader = 'balatroShader2';
const fragShaderSrc = shaderMap[currentShader];
startShaderBackground(fragShaderSrc);