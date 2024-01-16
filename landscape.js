import {
    getCustomProperty,
    incrementCustomProperty, 
    setCustomProperty
} from "./updateCustomProperty.js";

const SPEEDFAST = 0.06;
const SPEEDAVG = 0.05;
const SPEEDSLOW = 0.03;
const pathElems = document.querySelectorAll("[data-path]");
const foregroundElems = document.querySelectorAll("[data-foreground]");
const backgroundElems = document.querySelectorAll("[data-background]");

/* PATH */
export function setupPath() {
    setCustomProperty(pathElems[0], "--left", 0);
    setCustomProperty(pathElems[1], "--left", 150);
};

/* Will increment the path position and move it to the left every time we call the update function.*/
export function updatePath(delta, speedScale) {
    pathElems.forEach(path => {
        incrementCustomProperty(path, "--left", delta * speedScale * SPEEDAVG  * -1);

        /*If the path img has moved off the screen, then attach the first path img to the end of the second path img.*/
        if (getCustomProperty(path, "--left") <= -150) {
            incrementCustomProperty(path, "--left", 300);
        };
    });
};

/* FOREGROUND */
export function setupForeground() {
    setCustomProperty(foregroundElems[0], "--left", 0);
    setCustomProperty(foregroundElems[1], "--left", 100);
};

export function updateForeground(delta, speedScale) {
    foregroundElems.forEach(foreground => {
        incrementCustomProperty(foreground, "--left", delta * speedScale * SPEEDFAST * -1);

        if (getCustomProperty(foreground, "--left") <= -100) {
            incrementCustomProperty(foreground, "--left", 200);
        };
    });
};

/* BACKGROUND */
export function setupBackground() {
    setCustomProperty(backgroundElems[0], "--left", 0);
    setCustomProperty(backgroundElems[1], "--left", 100);
};

export function updateBackground(delta, speedScale) {
    backgroundElems.forEach(background => {
        incrementCustomProperty(background, "--left", delta * speedScale * SPEEDSLOW * -1);

        if (getCustomProperty(background, "--left") <= -100) {
            incrementCustomProperty(background, "--left", 200);
        };
    });
};