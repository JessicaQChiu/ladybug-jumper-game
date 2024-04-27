import { updatePath, setupPath, updateForeground, setupForeground, updateBackground, setupBackground } from './landscape.js';
import { updateLadybug, setupLadybug, getLadybugRect, setLadybugLose } from './ladybug.js';
import { updateObstacle, setupObstacle, getObstacleRects } from './obstacle.js';

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");
const loseGameText = document.querySelector(".lose-info");
const textTitle = document.querySelector(".text-title");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true });
document.addEventListener("click", handleStart, { once: true });

// window.onload = function() {
//     document.getElementById("bg-music").play();
// }

/*Update loop - runs every single frame, scales to the response rate.*/
let lastTime;
let speedScale;
let score;
function update(time) {
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }
    const delta = time - lastTime;

    updateForeground(delta, speedScale);
    updateBackground(delta, speedScale);
    updatePath(delta, speedScale);
    updateLadybug(delta, speedScale);
    updateObstacle(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);

    /*Exit update loop if the player has met lose condition.*/
    if (checkLose()) {
        return handleLose();
    };

    lastTime = time;
    window.requestAnimationFrame(update);
};

function checkLose() {
    const ladybugRect = getLadybugRect();
    return getObstacleRects().some(rect => isCollision(rect, ladybugRect));
};

/*Collision boxes shifted to align with art*/
function isCollision(rect1, rect2) {
    return (
        rect1.left < (rect2.right - 15) &&
        rect1.top <(rect2.bottom - 15)&&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    );
};

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
};

function updateScore(delta) {
    score += delta * 0.01; //1 point = 100 milliseconds that passes.
    scoreElem.textContent = "Score:"+Math.floor(score);
};

function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupForeground();
    setupBackground();
    setupPath();
    setupLadybug();
    setupObstacle();
    document.removeEventListener("click", handleStart);
    document.removeEventListener("keydown", handleStart);
    document.getElementById("bg-music").play(); //Background music starts during first game run.
    startScreenElem.classList.add("hide"); //Hides start-screen HTML element.
    loseGameText.style.display="block"; //Displays game lose text whenever game is restarted.
    textTitle.style.display="none";
    window.requestAnimationFrame(update); //Update function calls itself, loops indefinitely until a lose condition.
};

function handleLose() {
    setLadybugLose();
    /*200ms pause - avoids an accidental immediate restart after losing + can see the .hide text indicating they lost.*/
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true });
        document.addEventListener("click", handleStart, { once: true });
        startScreenElem.classList.remove("hide");
    }, 200);
};

/*Function to scale for extreme width||height ratios using inital WORLD_variables*/
function setPixelToWorldScale() {
    let worldToPixelScale;

    /*Checks if WORLD > window's aspect ratio then adjusts scale*/
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH; /*Width determines aspect ratio.*/
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT; /*Height determines aspect ratio.*/
    }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
};