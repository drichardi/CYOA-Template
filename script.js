// Names:

// global variables used throughout
let gameState, selectedChoice, actionButton, descrip, title, sel, sceneImg, backpack;
let inventory = [];

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
let game = [
    {
        id: state.start,
        backgroundImg: 'images/bed.jpg',
        title: "Early Morning",
        description: "You groggily begin to stir from a deep sleep. You hope you're in your own bed.",
        choices: [state.wakeup, state.sleep],
        items: ['gloves', 'keys', 'knife', 'sword', 'shield'], // list items available to collect (if any) as strings
        requiredItems: []
        
    },
    {
        id: state.sleep,
        backgroundImg: 'images/sleep.jpg',
        title: "Deep Sleep",
        description: "You decide to fall back asleep, ignoring the voice stirring in your subconscious. You don't get a chance to wakeup again.",
        choices: [state.start],
        items: [],
        requiredItems: []
    },
    {
        id: state.wakeup,
        description: "You bolt upright, a sense of dread filling your head as you know something is not right. You hear a whooshing noise to your left and have trouble breathing. There's a fire.",
        choices: [state.jumpOutWindow, state.tryDoor],
        items: [],
        requiredItems: [['gloves', state.tryDoor]] // list of items required for choices in (item, choice) format.
        
    },
    
]

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255);
    textWrap(WORD); // setting if you use the text() function
    noLoop(); // Must have this, otherwise text gets blurry
    gameState = state.start; // Set intial state on page load

    // Story name and settings
    let title = createDiv(`<h1>Waking Nightmares</h1>`);
    title.position(0, 10);
    title.style("font-size", "24px");

    // Create Div tag to show game state description and settings
    descrip = createDiv();
    descrip.position(windowWidth / 2 - 250, 150);
    descrip.style("font-size", "30px");
    descrip.style("width", "500px");

    // Div tag for items in room
    visibleItems = createDiv(`<div id='vis-items'>You see following nearby items: </div>`);
    visibleItems.position(30, 350);
    visibleItems.style("font-size: 18px");

    backpack = createDiv(`<h3>Backpack</h3>
                          <div id='inv'></div>`);
    backpack.position(windowWidth - 250, 150);
    backpack.style("font-size: 30px");
    

    // Create Select tag to create dropdown options and settings
    sel = createSelect();
    sel.position(windowWidth / 2 - 200, 600);
    sel.style("height: 35px");
    sel.style("font-family: Garamond");
    sel.style("font-size: 24px");

    // create image tag and settings
    sceneImg = createImg();
    sceneImg.position(50, 150);
    sceneImg.style("width: 250px");

    // Create selection button to change states from current to selected state
    actionBtn = createButton("Choose");
    actionBtn.position(windowWidth / 2 - 150, 700);
    actionBtn.mousePressed(makeChoice);
    
}

function draw() {
    clear();

    // Shows img from current state if there is one
    if (game[gameState].backgroundImg) {
        // the sceneImg is the smaller img
        sceneImg.attribute('src', game[gameState].backgroundImg);    
        sceneImg.show();
        // change the actual background-image property
        let bkgrnd = select('.background');
        bkgrnd.style("background-image: url(" + game[gameState].backgroundImg + ")");
    }
    
    // Choose 1 of the 2 below methods to display your descriptions
    // method1: Display through html element -> allows using css to style
    descrip.html(`<p class="scene-title">${game[gameState].title}</p>
                  <p>${game[gameState].description}</p>`);

    // // method2: Display with text p5 settings
    // textFont('Helvetica', 24);
    // text("Method 2: " + game[gameState].description, windowWidth / 2 + 250, 200, 300);

    // Create array of choices based on current state
    let choices = [];
    for (let i = 0; i < game[gameState].choices.length; i++) {
        choices.push(game[gameState].choices[i]);
    } 

    // Add choices to options dropdown box
    for (let i = 0; i < choices.length; i++) {
        sel.option(stateChoices[choices[i]], choices[i]);
        if (game[gameState].requiredItems.length > 0) {
            let options = document.getElementsByTagName('option');
            // Check for required items to progress to next state
            // Disable option if required item not in inventory
            for (let j = 0; j < game[gameState].requiredItems.length; j++) {
                if (!inventory.includes(game[gameState].requiredItems[j][0]) && game[gameState].requiredItems[j][1] === choices[i]) {
                    for (let k = 0; k < options.length; k++) {
                        if (options[k].label === stateChoices[choices[i]]) {
                            options[k].disabled = true;
                        }
                    }
                } else {
                    for (let k = 0; k < options.length; k++) {
                        if (options[k].label === stateChoices[choices[i]]) {
                            options[k].disabled = false;
                        }
                    }
                }  
            }
        }  
    }

    // Set initial selected choice to first item in dropdown list
    sel.selected(game[gameState].choices[0]);
    selectedChoice = game[gameState].choices[0];

    // calls updateSelectedChoice function if new item in dropdown is selected
    sel.changed(updateSelectedChoice);

   

    // display inventory / backpack
    let backpackItem = select('#inv');
    for (let i = 0; i < inventory.length; i++) {
        backpackItem.html(`<p class='item' onclick='DropItem(event)'>${inventory[i]}</p>`, true);
    }

    // display visible items to pickup
    let visItems = select('#vis-items');
    if (game[gameState].items.length > 0) {
        for (let i = 0; i < game[gameState].items.length; i++) {
            visItems.html(`<p class='item' onclick='PickupItem(event)'>${game[gameState].items[i]}</p>`, true);
        }
    }
    
}
// Called when clicking on items on ground to add to inventory / backpack
function PickupItem(event) {
    // Capture which element was clicked on and add text to inventory array
    let item = event.target;
    inventory.push(item.innerHTML);

    // Remove from gamestate items array
    let index = game[gameState].items.indexOf(item.innerHTML);
    game[gameState].items.splice(index, 1);

    // remove all items to prevent duplicates when redrawn
    ClearInventoryItemsForRedraw();
    
    redraw();
}

// Called when clicking on items in inventory / backpack to drop back into current game state [items]
function DropItem(event) {
    // Capture which element was clicked on and add text to gamestate items array
    let item = event.target;
    game[gameState].items.push(item.innerHTML);

    // remove from inventory array
    let index = inventory.indexOf(item.innerHTML);
    inventory.splice(index, 1);

    ClearInventoryItemsForRedraw();
   
    redraw();
}

function ClearInventoryItemsForRedraw() {
    // remove all items to prevent duplicates when redrawn
    let items = document.querySelectorAll(".item");
    for (let i = 0; i < items.length; i++) {
        items[i].remove();
    }
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
    ClearInventoryItemsForRedraw();
    redraw();
}

// Clears dropdown select box to be ready to add new options
function clearOptions() {
    for (let i = sel.elt.length - 1; i >= 0; i--) {
        sel.elt.remove(i);
    }
}
