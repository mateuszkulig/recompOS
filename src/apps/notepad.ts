// notepad.ts

import { getDesktop } from "../../index.js";

/**
 * Notepad application
 */
export const notepad = (filename: string, content: string) => {
    const desktop = getDesktop();
    const root = document.createElement("div");

    // Input configuration
    const mainInput = document.createElement("textarea");
    mainInput.style.resize = "none";
    mainInput.setAttribute("rows", "30");
    mainInput.setAttribute("cols", "64");
    mainInput.value = content;

    const fileInput = document.createElement("input");
    fileInput.style.width = "400px";
    fileInput.style.marginRight = "5px";
    fileInput.value = filename;

    // Button that saves the file
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save file";
    saveButton.style.padding = "0px 12px";
    saveButton.addEventListener("click", () => {
        fetch("/api/create-file", {
            method: "POST",
            body: JSON.stringify({filename: fileInput.value, content: mainInput.value}),
            headers: {'Content-Type': 'application/json'}})
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
        desktop.refresh();
    })
    
    root.appendChild(mainInput);
    root.appendChild(fileInput);
    root.appendChild(saveButton);

    // 502 width to fit 64 rows
    desktop.createWindow(502, 510, "Notepad", root);
}
