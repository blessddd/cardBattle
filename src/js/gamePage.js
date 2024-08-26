"use strict";

const  gameSection  = document.querySelector(".game-section-container");
const   gameIntro   = document.querySelector(".game-intro");
const      line     = document.querySelector(".line");
const  startButton  = document.querySelector(".start-button");
const gameIntroContainer  = document.querySelector(".game-intro-container");
const inactiveGameSection = document.querySelector(".inactive-game");
const rulesButton = document.querySelector(".rules-button");
const rulesModal = document.querySelector(".modal");
const closeModalButton = document.querySelector(".modal__close-button");

startButton.addEventListener("click", () => {
    gameIntroContainer.style.display = "none";
    gameIntro.style.display   = "none";
    gameSection.style.display = "block";
    line.style.display = "block";
});

rulesButton.addEventListener("click", () => {
    rulesModal.style.display = "block";
});

closeModalButton.addEventListener("click", () => {
    rulesModal.style.display = "none";
})