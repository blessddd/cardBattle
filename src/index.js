"use strict"

const head = document.head;

const queryIcons = () => {
    let link = document.createElement("link");
    link.rel = "stylesheet"
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    head.appendChild(link);
}

if(navigator.onLine) 
    queryIcons();
