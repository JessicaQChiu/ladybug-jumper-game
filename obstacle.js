import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js";

const SPEED = 0.05;//Must match path speed.
const OBSTACLE_INTERVAL_MIN = 600; //Millisecond, ms.
const OBSTACLE_INTERVAL_MAX = 2000; //Millisecond, ms.

const worldElem = document.querySelector("[data-world]"); //To add the Obstacle to the screen as there is no img/div element for it.

let nextObstacleTime;

export function setupObstacle() {
    nextObstacleTime = OBSTACLE_INTERVAL_MIN;
    /*Remove all obstacles when the game is set up/reset.*/
    document.querySelectorAll("[data-obstacle]").forEach(obstacle => {
        obstacle.remove();
    });
};

export function updateObstacle(delta, speedScale) {
    /*GROUND used as a reference - obstacle needs to move in proportion*/
    document.querySelectorAll("[data-obstacle]").forEach(obstacle => {
        incrementCustomProperty(obstacle, "--left", delta * speedScale * SPEED * -1);

        /*Remove obstacle if it has moved far off the left edge of the window.*/
        if (getCustomProperty(obstacle, "--left") <= -100) {
            obstacle.remove();
        }
    });

    if (nextObstacleTime <= 0) {
        createObstacle();
        nextObstacleTime = randomNumberBetween(OBSTACLE_INTERVAL_MIN, OBSTACLE_INTERVAL_MAX) / speedScale; //As the game gets faster, create more obstacles.
    };

    nextObstacleTime -= delta; //Reduces time in proportion to framerate for the next obstacle.
};

/*Getting obstacle elements' size and position to determine collision mechanics*/
export function getObstacleRects() {
    return [...document.querySelectorAll("[data-obstacle")] //Spread operator to access all individual obstacle elements.
    .map(obstacle => {
        return obstacle.getBoundingClientRect();
    });
};

function createObstacle() {
    const obstacle = document.createElement("img"); 
    obstacle.dataset.obstacle = true; //Adds data attribute data-obstacle to the element.
    obstacle.src = "imgs/obstacle1.png"; 
    setCustomProperty(obstacle, "--left", 100); //100 is converted to a %, left edge of the obstacle will be on the right edge of the window.
    obstacle.classList.add("obstacle"); //Adds .obstacle to the element to apply CSS styling.
    worldElem.append(obstacle);
};

/* Returns whole number rather than decimal, random between the (min and max +1 which gives the full range) that begins from the min #.*/
function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};