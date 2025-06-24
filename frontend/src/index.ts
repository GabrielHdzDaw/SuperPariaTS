import Card from "./models/Card";
import { CardComponent } from './components/CardComponent';
import { getPairs } from "./utils/CreateDeck";
import { setupParallaxMouse } from './effects/parallax';
import { startShaderBackground } from './backgroundShader';
import { Button } from './components/Button';
import { playSound } from './audio/audioManager';

import fragShaderSrc from './assets/backgroundShader.frag?raw';


const playArea = document.getElementById("playArea");
const gameBoardOptions = document.querySelector(".gameboard-options") as HTMLDivElement | null;
let deck: Card[] = getPairs();
let flippedCards: CardComponent[] = [];
let lockBoard = false;
let matchedPairs = 0;
let gameComponents: CardComponent[] = [];

function dealCards(gameComponents: CardComponent[]): void {
  gameComponents.forEach((component, index) => {
    setTimeout(() => {
      component.element.style.transform = "scale(1.2)";
      component.element.style.visibility = "visible";
      component.element.style.opacity = "1";
      component.element.style.pointerEvents = "auto";
      playSound.flip();

      setTimeout(() => {
        component.element.style.transform = "scale(1)";
      }, 200);
    }, index * 100);
  });

  const totalDelay = gameComponents.length * 100 + 300;

  setTimeout(() => {
    // Forzar reflow y esperar al siguiente frame
    requestAnimationFrame(() => {
      gameComponents.forEach((component) => {
        component.flip();
      });
      playSound.flip();

      setTimeout(() => {
        gameComponents.forEach((component) => {
          component.flip();
        });
      }, 1000);
    });
  }, totalDelay);
}

function createGameBoard(): void {
  deck.forEach((card) => {
    const cardComponent = new CardComponent(card, (clickedCardComponent) => {
      if (lockBoard || flippedCards.includes(clickedCardComponent) || clickedCardComponent.isMatched()) return;

      clickedCardComponent.flip();
      playSound.flip();

      flippedCards.push(clickedCardComponent);

      if (flippedCards.length === 2) {
        lockBoard = true;

        const [first, second] = flippedCards;

        if (first.getCard().isMatch(second.getCard())) {
          // Match encontrado

          console.log("Match found!");

          // Marcar ambas cartas como matched
          first.setMatched(true);
          second.setMatched(true);

          matchedPairs++;

          // Limpiar array y desbloquear tablero
          flippedCards.length = 0;
          lockBoard = false;

          // Verificar si el juego terminó
          if (matchedPairs === deck.length / 2) {
            setTimeout(() => {
              alert("¡Felicitaciones! Has completado el juego.");
            }, 500);
          }
        } else {
          // No hay match
          console.log("No match");

          setTimeout(() => {
            first.flip();
            second.flip();
            flippedCards.length = 0;
            lockBoard = false;
          }, 1000);
        }
      }
    });

    gameComponents.push(cardComponent);
    playArea?.appendChild(cardComponent.element);
  });
  gameComponents.forEach((component) => {
    component.element.style.visibility = "hidden"; // antes era "none" (inválido)
    component.element.style.opacity = "0";         // mejor que display: none
    component.element.style.pointerEvents = "none";
  });
  dealCards(gameComponents);
}

function resetGame(): void {
  console.log("Resetting game...");

  // Limpiar el área de juego
  if (playArea) {
    playArea.innerHTML = '';
  }

  // Resetear variables del juego
  flippedCards.length = 0;
  lockBoard = false;
  matchedPairs = 0;
  gameComponents.length = 0;

  // Crear nuevo deck y recrear el tablero
  deck = getPairs();
  createGameBoard();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Creando el tablero de juego...");
  createGameBoard();
  console.log("Tablero de juego creado"); // Esto primero crea las cartas
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
    // Aquí puedes agregar la lógica para ir al menú principal
  };
  resetButton.render(gameBoardOptions);

  const timer = document.createElement("span");
  timer.className = "timer";
  timer.textContent = "TIME: 00:00";
  gameBoardOptions.appendChild(timer);
}

setupParallaxMouse('gameBoard');
startShaderBackground(fragShaderSrc);