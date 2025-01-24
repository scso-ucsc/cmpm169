// sketch.js - purpose and description here
// Author: Sean Eric So
// Date: January 23, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
var NORTH = 0;
var NORTHEAST = 1;
var EAST = 2;
var SOUTHEAST = 3;
var SOUTH = 4;
var SOUTHWEST = 5;
var WEST = 6;
var NORTHWEST = 7;
var direction;

var stepSize = 20;
var posX, posY;
var diameter = 20;

let colourChangeSound, dotSound, blockSound, snowflakeSound;
let shapeStyle;
let isPaused = false;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
var canvasWidth, canvasHeight;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

function preload(){
  colourChangeSound = loadSound("../audio/Ice1.mp3");
  dotSound = loadSound("../audio/pickupCoin.wav");
  blockSound = loadSound("../audio/hitHurt.wav");
  snowflakeSound = loadSound("../audio/click.wav");
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  resizeScreen();

  $(window).resize(function() {
    resizeScreen();
  });
  canvasWidth = canvasContainer.width();
  canvasHeight = canvasContainer.height();

  noStroke();
  fill(0, 0, 0, 100);
  
  posX = canvasWidth / 2;
  posY = canvasHeight / 2;
  
  shapeStyle = 0;
  isPaused = false;
  
  background(240, 240, 240);
  
  setInterval(playSound, 200);
}

function draw() {
  if(isPaused == false){
    direction = int(random(0, 8));

    if(direction == NORTH){
      posY -= stepSize;
    } else if(direction == NORTHEAST){
      posY -= stepSize;
      posX += stepSize;
    } else if(direction == EAST){
      posX += stepSize;
    } else if(direction == SOUTHEAST){
      posY += stepSize;
      posX += stepSize;
    } else if(direction == SOUTH){
      posY += stepSize;
    } else if(direction == SOUTHWEST){
      posY += stepSize;
      posX -= stepSize;
    } else if(direction == WEST){
      posX -= stepSize;
    } else if(direction == NORTHWEST){
      posY -= stepSize;
      posX -= stepSize;
    }

    //Considerations for off canvas
    if(posX > canvasWidth) posX = 0;
    if(posX < 0) posX = canvasWidth;
    if(posY > canvasHeight) posY = 0;
    if(posY < 0) posY = canvasHeight;

    //Drawing unique shape
    translate(posX, posY);

    if(shapeStyle == 0){
      ellipse(0, 0, diameter, diameter);
    } else if(shapeStyle == 1){
      rect(-diameter / 2, -diameter / 2, diameter, diameter)
    } else if(shapeStyle == 2){
      beginShape();
      for(let angle = 0; angle < TWO_PI; angle += 0.1){
        let radius = 1 + sin(angle * 5) * 10 + random(-5, 5);
        let x = radius * cos(angle);
        let y = radius * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE); 
    }
  }
}

function mousePressed(){
  colourChangeSound.play();
  let r = random(255);
  let g = random(255);
  let b = random(255);
  fill(r, g, b, 100);
  posX = mouseX;
  posY = mouseY;
}

function keyReleased(){
  if(keyCode == 32){
    setPauseOrPlay();
  } else if(keyCode == 49){
    shapeStyle = 0;
  } else if(keyCode == 50){
    shapeStyle = 1;
  } else if(keyCode == 51){
    shapeStyle = 2;
  }
}

function playSound(){
  if(isPaused == false){
    if(shapeStyle == 0){
    dotSound.play();
    } else if(shapeStyle == 1){
      blockSound.play();
    } else if(shapeStyle == 2){
      snowflakeSound.play(); 
    }
  }
}

function setPauseOrPlay(){
  if(isPaused == true){
    isPaused = false;
  } else{
    isPaused = true;
  }
}