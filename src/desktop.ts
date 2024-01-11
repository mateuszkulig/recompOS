// desktop.ts

import { notepad } from "./apps/notepad.js"

/**
 * Sizes of border measured in viewport units, smaller height one for both to keep squareness
 */
const borderSize = 0.21;

/**
 *  Object controlling windows and icons
 */
export class Desktop {
    element: HTMLDivElement;
    windows: Window[];

    constructor (rootElement: HTMLElement) {
        this.windows = [];
        this.element = document.createElement("div");
        this.element.setAttribute("class", "desktop");
        rootElement.appendChild(this.element);
        this.refresh();
    }

    /**
     * Create new window filled with content
     * @param width Width of window
     * @param height Height of window
     * @param title Title of window
     * @param content HTMLDivElement with window contents
     */
    createWindow(width: number, height: number, title: string, content: HTMLDivElement) {
        this.windows.push(new Window(this.element, width, height, title, content));
    }

    /**
     * Refresh the icons on the desktop
     */
    refresh() {
        this.clearIcons();
        fetch("/api/get-files", {method: "GET"})
        .then((response) => response.json())
        .then((data: {[key: string]: string}[]) => {
            let newIcon: HTMLDivElement;
            let newText: HTMLDivElement;
            let newImg: HTMLImageElement;

            data.forEach(el => {
                newIcon = document.createElement("div");
                newIcon.setAttribute("class", "desktop-icon")
                newIcon.addEventListener("click", () => {
                    notepad(el["filename"], el["content"])
                })

                newText = document.createElement("div");
                newText.textContent = el["filename"];
                newImg = document.createElement("img");
                newImg.src = "file_icon.svg"
                newImg.setAttribute("class", "desktop-icon-img")
                
                newIcon.appendChild(newImg);
                newIcon.appendChild(newText);
                
                this.element.appendChild(newIcon);
            });
        })
    }

    /**
     * Clear the icon elements from the desktop
     */
    clearIcons() {
        const allIcons = document.getElementsByClassName("desktop-icon");
        while (allIcons.item(0)) {
            allIcons.item(0).remove();
        }
    }
}


/**
 * Window layout and controls inside it
 */
class Window {
    element: HTMLDivElement;
    borderElement: HTMLDivElement;
    titleElement: HTMLDivElement;
    closeElement: HTMLDivElement;
    contentElement: HTMLDivElement;
    content: HTMLDivElement;
    width: number;
    height: number;
    title: string;
    mousePos1: number;
    mousePos2: number;
    mousePos3: number;
    mousePos4: number;
    isClosed: boolean;

    /**
     * Constructior generating window
     * @param rootElement Desktop
     * @param width Width of window
     * @param height Height of window
     * @param title Title of window
     */
    constructor(rootElement: HTMLElement, width: number, height: number, title: string, content: HTMLDivElement) {
        this.width = width;
        this.height = height;
        this.title = title;
        this.isClosed = false;
        this.content = content;

        this.borderElement = document.createElement("div");
        this.element = document.createElement("div");
        this.titleElement = document.createElement("div");
        this.closeElement = document.createElement("div");
        this.contentElement = document.createElement("div");

        this.resize();

        this.borderElement.setAttribute("class", "window-border")
        this.element.setAttribute("class", "window");
        this.titleElement.setAttribute("class", "window-title");
        this.titleElement.textContent = this.title;
        this.titleElement.addEventListener("mousedown", this.dragMouse)
        this.closeElement.setAttribute("class", "close-icon")
        this.closeElement.textContent = "X";
        this.closeElement.addEventListener("click", this.closeWindow)
        this.contentElement.setAttribute("class", "content-space")
        
        this.titleElement.appendChild(this.closeElement);
        this.contentElement.appendChild(content);
        this.element.appendChild(this.titleElement);
        this.element.appendChild(this.contentElement);
        this.borderElement.appendChild(this.element);
        rootElement.appendChild(this.borderElement);
    }

    /**
     * Change the window size by changing style propeties of element
     */
    resize() {
        let borderStyleString = "";
        let styleString = "";

        // Embedded border size added to fit both borders of windows, doubled for border each side
        let extraBorderSize = Math.floor(this.convertVhToPx(borderSize)) * 2;
        extraBorderSize = extraBorderSize == 0 ? 2 : extraBorderSize;
        
        borderStyleString = borderStyleString.concat(`width: ${this.width+extraBorderSize}px; `);
        borderStyleString = borderStyleString.concat(`height: ${this.height+extraBorderSize}px; `);
        styleString = styleString.concat(`width: ${this.width}px; `);
        styleString = styleString.concat(`height: ${this.height}px; `);

        this.borderElement.setAttribute("style", borderStyleString);
        this.element.setAttribute("style", styleString);
    }

    /**
     * Convert viewport units to pixels
     * @param vh Viewport height in float
     * @returns Converted pixel number
     */
    convertVhToPx(vh: number) {
        return (vh * window.innerHeight) / 100;
    }

    /**
     * Move the window on mouse dragging title element
     * @param e Event fired by mouse
     */
    dragMouse(e: MouseEvent) {
        console.log("Mouse Down set");
        e.preventDefault();
        this.mousePos3 = e.clientX;
        this.mousePos4 = e.clientY;
        
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        document.onmousemove = (e) => {
            e.preventDefault();
            if (e.target instanceof Element) {
                const elem = e.target.parentElement.parentElement;
                // Do not move if mouse event is fired from anywhere else
                if (elem.getAttribute("class") == "window-border") {
                    this.mousePos1 = this.mousePos3 - e.clientX;
                    this.mousePos2 = this.mousePos4 - e.clientY;
                    this.mousePos3 = e.clientX;
                    this.mousePos4 = e.clientY;

                    elem.style.top = (elem.offsetTop - this.mousePos2) + "px";
                    elem.style.left = (elem.offsetLeft - this.mousePos1) + "px";
                }
            }
        };
    }

    /**
     * Destroy the window with all its contents
     * @param e Event fired by mouse
     */
    closeWindow(e: MouseEvent) {
        if (e.target instanceof Element) {
            // Third parent is the main border window
            e.target.parentElement.parentElement.parentElement.remove();
        }
        this.isClosed = true;
    }
}
