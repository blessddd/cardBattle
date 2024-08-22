"use strict";

const  gameSection  = document.querySelector(".game-section-container");
const   gameIntro   = document.querySelector(".game-intro");
const      line     = document.querySelector(".line");
const  startButton  = document.querySelector(".start-button");
const gameIntroContainer = document.querySelector(".game-intro-container");
const inactiveGameSection = document.querySelector(".inactive-game");

startButton.addEventListener("click", () => {
    gameIntroContainer.style.display = "none";
    gameIntro.style.display   = "none";
    gameSection.style.display = "block";
    line.style.display = "block";
});