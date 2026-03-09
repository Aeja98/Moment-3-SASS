"use strict";
import "../scss/main.scss";

//Import page initializers then run them
import { initChartsPage } from "./pages/diagram.js";
import { initMapPage } from "./pages/karta.js";
initChartsPage();
initMapPage();

//Animation-btn movement
const playArea = document.getElementById("playArea");
const animatedBtn = document.getElementById("animatedBtn");

//Only works on specific page & area
if (playArea && animatedBtn) {
    animatedBtn.addEventListener("click", () => {
        //Get size of container & btn
        const areaRect = playArea.getBoundingClientRect();
        const btnRect = animatedBtn.getBoundingClientRect();
        
        //Make sure btn stays inside container
        const maxX = areaRect.width - btnRect.width;
        const maxY = areaRect.height - btnRect.height;

        //Random position
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        
        //Moves using transform
        animatedBtn.style.transform = `translate(${x}px, ${y}px)`;
    });
}