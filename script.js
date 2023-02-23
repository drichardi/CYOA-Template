// global variables used throughout
let gameState, selectedChoice, actionButton, descrip, title, sel, sceneImg;

// state refers to what situation we are currently showing
const state = {
    start: 0,
    sleep: 1,
    wakeup: 2,
    jumpOutWindow: 3,
    tryDoor: 4
}
// stateChoices refer to text shown in the decision drop down
// ** they must be in the same order as the states they select **
const stateChoices = [
    "Restart",
    "I want to keep sleeping...",
    "Decide to wakeup",
    "Rush to jump out of the window",
    "Make your way to the door"
]

// game stores all our information as an array of objects [0, 1, 2, 3, etc..]
// each object {} has properties that will be inserted into html dynamically
// based on what state our game is currently showing.
// note: id is not currently used, but it's a nice label to know which state it represents. 
// ** This order needs to be the same as state and stateChoices **
const game = [
    {
        id: state.start,
        backgroundImg: 'images/bed.jpg',
        description: "You groggily begin to stir from a deep sleep. You hope you're in your own bed.",
        choices: [state.wakeup, state.sleep]
    },
    {
        id: state.sleep,
        description: "You decide to fall back asleep, ignoring the voice stirring in your subconscious. You don't get a chance to wakeup again.",
        choices: [state.start]
    },
    {
        id: state.wakeup,
        description: "You bolt upright, a sense of dread filling your head as you know something is not right. You hear a whooshing noise to your left and have trouble breathing. There's a fire.",
        choices: [state.jumpOutWindow, state.tryDoor]
    }
]

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    textWrap(WORD); // setting if you use the text() function
    noLoop(); // Must have this, otherwise text gets blurry
    gameState = state.start; // Set intial state on page load

    // Story name and settings
    let title = createDiv(`<h1>Waking Nightmares</h1>`);
    title.position(windowWidth / 2 - 300, 10);
    title.style("font-size", "24px");

    // Create Div tag to show game state description and settings
    descrip = createDiv();
    descrip.position(windowWidth / 2 - 300, 150);
    descrip.style("font-size", "30px");
    descrip.style("width", "500px");

    // Create Select tag to create dropdown options and settings
    sel = createSelect();
    sel.position(windowWidth / 2 - 200, 400);
    sel.style("height: 35px");
    sel.style("font-family: Garamond");
    sel.style("font-size: 24px");

    // create image tag and settings
    sceneImg = createImg();
    sceneImg.position(50, 150);
    sceneImg.style("width: 250px");
    
}

function draw() {
    clear();

    // Shows img from current state if there is one
    if (game[gameState].backgroundImg) {
        sceneImg.attribute('src', game[gameState].backgroundImg);    
        sceneImg.show();
    }
    
    // Choose 1 of the 2 below methods to display your descriptions
    // method1: Display through html element -> allows using css to style
    descrip.html(`<p style="text-decoration: underline;">Method 1</p>
                  <p>${game[gameState].description}</p>`);

    // method2: Display with text p5 settings
    textFont('Helvetica', 24);
    text("Method 2: " + game[gameState].description, windowWidth / 2 + 250, 200, 300);

    // Create array of choices based on current state
    let choices = [];
    for (let i = 0; i < game[gameState].choices.length; i++) {
        choices.push(game[gameState].choices[i]);
    } 

    // Add choices to options dropdown box
    for (let i = 0; i < choices.length; i++) {
        sel.option(stateChoices[choices[i]], state[i]);
    }

    // Set initial selected choice to first item in dropdown list
    sel.selected(game[gameState].choices[0]);
    selectedChoice = game[gameState].choices[0];

    // calls updateSelectedChoice function if new item in dropdown is selected
    sel.changed(updateSelectedChoice);

    // Create selection button to change states from current to selected state
    actionBtn = createButton("Choose");
    actionBtn.position(windowWidth / 2 - 150, 500);
    actionBtn.mousePressed(makeChoice);
    
}

// updates global selectedChoice to store state selected in dropdown
function updateSelectedChoice() {
    let choice = sel.value();

    for (let i = 0; i < stateChoices.length; i++) {
        if (choice === stateChoices[i]) {
            selectedChoice = i;
        }
    }
}

// update global gameState to the new selected state
// clears options list for new entries, hides img 
// calls draw to refresh page
function makeChoice() {
    gameState = selectedChoice;
    clearOptions();
    sceneImg.hide();
    redraw();
}

// Clears dropdown select box to be ready to add new options
function clearOptions() {
    for (let i = sel.elt.length - 1; i >= 0; i--) {
        sel.elt.remove(i);
    }
}
