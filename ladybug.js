import { incrementCustomProperty, getCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const ladybugElem = document.querySelector("[data-ladybug]");
const JUMP_SPEED = 0.45; //Vertical displacement.
const GRAVITY = 0.0015;
const LADYBUG_FRAME_COUNT = 2;
const FRAME_TIME = 100; //Every frame should last 100ms.

let isJumping;
let ladybugFrame;
let currentFrameTime;
let yVelocity;

export function setupLadybug() {
    isJumping = false;
    ladybugFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;
    setCustomProperty(ladybugElem, "--bottom", 0);

    /*Setup is called every time the game is lost - need to remove in case it already exists to restart it.*/
    document.removeEventListener("keydown", onJump);
    document.addEventListener("keydown", onJump);
};

export function updateLadybug(delta, speedScale) {
    handleRun(delta, speedScale);
    handleJump(delta);
};

/*Get ladybug element's size and position to determine collision mechanics.*/
export function getLadybugRect() {
    return ladybugElem.getBoundingClientRect();
};

export function setLadybugLose() {
    ladybugElem.src = "imgs/ladybug-lose.png";
};

function handleRun(delta, speedScale) {
    if (isJumping) {
        ladybugElem.src = "imgs/ladybug-jump.png";
        return;
    };

    if (currentFrameTime >= FRAME_TIME) {
        ladybugFrame = (ladybugFrame + 1) % LADYBUG_FRAME_COUNT; //Updates frame to the next frame, loops between the two.
        ladybugElem.src = `imgs/ladybug-run-${ladybugFrame}.png`;
        currentFrameTime -= FRAME_TIME; //Resets back down to 0 and will start counting again for the next frame change. 
    }
    currentFrameTime += delta * speedScale; //Game progress will speed up ladybug animation.
};

function handleJump(delta) {
    if (!isJumping) {
        return;
    } else {

        //Ladybug will move up, yVelocity will decrease until 0 - peak of the jump, then move down when yVelocity is a negative #.*/
        incrementCustomProperty(ladybugElem, "--bottom", yVelocity * delta);

        /*Checks to ensure bottom of the ladybug does not move lower than the ground and ends jumping.*/
        if (getCustomProperty(ladybugElem, "--bottom",) <= 0) {
            setCustomProperty(ladybugElem, "--bottom", 0);
            isJumping = false;
        };

        yVelocity -= GRAVITY * delta; //Moves ladybug down, scaling with gravity and framerate.
    };
};

function onJump(e) {
    if (e.code !== "Space" || isJumping) return;
    yVelocity = JUMP_SPEED;
    isJumping = true;
};





