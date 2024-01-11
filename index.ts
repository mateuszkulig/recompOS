import { stylesheets } from "./src/styles.js";
import { Bar } from "./src/bar.js";
import { Desktop } from "./src/desktop.js";


/**
 *  Link all stylesheets listed in styles.ts in head
 */
const connectStyles = () => {
    const headTag = document.getElementsByTagName("head")[0];

    stylesheets.forEach(element => {
        const newStyleLink = document.createElement("link");
        newStyleLink.setAttribute("rel", "stylesheet");
        newStyleLink.setAttribute("href", element)
        headTag.appendChild(newStyleLink)
    });
};

/**
 *  Get the root element and return it; create one if necessary
 */
const getRootElement = (): HTMLElement => {
    let root = document.getElementById("root");
    if (root == null) {
        root = document.createElement("div");
    }
    return root;
}

/**
 * Entry point of app
 */
connectStyles();
let root = getRootElement();
const desktop = new Desktop(root);
const bar = new Bar(root);

export const getDesktop = (): Desktop => {
    return desktop;
}
