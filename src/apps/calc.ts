// mines.ts

import { getDesktop } from "../../index.js";

/**
 * Mines application
 */
export const calc = () => {
    const desktop = getDesktop();
    const root = document.createElement("div");

    const mainFrame = document.createElement("iframe");
    mainFrame.width = "1000px";
    mainFrame.height = "px";

    mainFrame.src = "https://harsh98trivedi.github.io/Simple-JavaScript-Calculator/";
    root.appendChild(mainFrame);
    desktop.createWindow(600, 600, "Calculator", root);
}