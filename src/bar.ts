// bar.ts

import { getDesktop } from "../index.js";
import { Desktop } from "./desktop";
import { notepad } from "./apps/notepad.js"
import { calc } from "./apps/calc.js"

/**
 *  Object entirely controlling bottom taskbar
 */
export class Bar {
    element: HTMLDivElement;
    mainMenu: MainMenu;

    constructor (rootElement:HTMLElement) {
        this.element = document.createElement("div");
        this.element.setAttribute("class", "bar");
        rootElement.appendChild(this.element);

        // Two stripes that separate desktop and bar
        for (let i=0; i<2; ++i) {
            let barSepElement = document.createElement("div");
            barSepElement.setAttribute("class", `bar-separator-${i}`)
            this.element.appendChild(barSepElement)
        }
    
        // Button with popup menu
        this.mainMenu = new MainMenu(this.element);
    };   
}

/**
 * The menu button and its following menu
 */
class MainMenu {
    isOpen: boolean;
    buttonElement: HTMLButtonElement;
    listElement: HTMLDivElement;

    constructor (rootElement:HTMLElement) {
        this.buttonElement = document.createElement("button");
        this.buttonElement.setAttribute("class", "mm-button");
        this.buttonElement.addEventListener("click", this.buttonOnClick);

        const buttonIcon = document.createElement("img");
        buttonIcon.setAttribute("src", "menu_icon.svg")
        buttonIcon.setAttribute("class", "mm-icon")

        const buttonText = document.createElement("div");
        buttonText.textContent = "Notepad";
        buttonText.setAttribute("class", "mm-text");

        this.buttonElement.appendChild(buttonIcon);
        this.buttonElement.appendChild(buttonText);
        rootElement.appendChild(this.buttonElement);

        this.listElement = document.createElement("div");
        this.listElement.setAttribute("class", "mm-list");

        this.isOpen = false;
    }

    /**
     * Action called by main button click
     */
    buttonOnClick() {
        notepad("", "");
    }
}
