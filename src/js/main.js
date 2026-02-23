"use strict";
import "../scss/main.scss";

//Animation-btn movement
const playArea = document.getElementById("playArea");
const animatedBtn = document.getElementById("animatedBtn");

if (playArea && animatedBtn) {
    animatedBtn.addEventListener("click", () => {
        const areaRect = playArea.getBoundingClientRect();
        const btnRect = animatedBtn.getBoundingClientRect();

        const maxX = areaRect.width - btnRect.width;
        const maxY = areaRect.height - btnRect.height;

        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        
        animatedBtn.style.transform = `translate(${x}px, ${y}px)`;
    });
}