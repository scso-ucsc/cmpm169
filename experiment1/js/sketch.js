// sketch.js - Vector Art, Animation, and Interactivity Experiment
// Author: Sean Eric So
// Date: 19/01/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
var tileCount = 15;
var seed = 0;

var circleAlpha = 130;
var fillAlpha = 100;
var circleColour;
var fillColour;
var circleSize;
var fillColourCurrent;
let angle = 0;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  createCanvas(650, 650); //Sets up canvas of (width, height)
  randomSeed(125);
  
  circleColour = color(0, 0, 0, circleAlpha); //RGB for circle
  fillColourCurrent = 3;
  fillColour = color(255, 0, 0, fillAlpha)
  fill(fillColour);
  
  setInterval(changeColour, 1000); //Call changeColour() every 1000ms aka 1second
  
  rectMode(CENTER);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(20, 125, 10 + mouseY / 2); //Background Colour
  
  translate(width / tileCount / 2, height / tileCount / 2); //Adds uniformity to circle positions

  randomSeed(seed); //Assigns random seed
  
  circleColour = color(mouseX / 2, mouseY / 2, (mouseX / 4) + (mouseY / 4));
  circleSize = mouseY / 15;
  
  stroke(circleColour); //Sets stroke colour
  
  strokeWeight(1 + (mouseY / 60)); //Sets stroke width
  
  for(var gridX = 0; gridX < tileCount; gridX++){
    for(var gridY = 0; gridY < tileCount; gridY++){
      
      var posX = width / tileCount * gridX;
      var posY = height / tileCount * gridY;
      var shiftX = random(-mouseX, mouseX) / 20;
      var shiftY = random(-mouseX, mouseX) / 20;
      
      rect(posX + shiftX, posY + shiftY, circleSize, circleSize);
    }
  }
  
  translate(width / 2, height / 2);
  rotate(angle);
  if(mouseOverCanvas() == true){
    angle += 0.05; 
  }
  rect(0, 0, 500, 500);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  seed = random(1000);
}

function changeColour(){
  if(fillColourCurrent == 1){
    fillColour = color(255, 0, 0, fillAlpha);
    fillColourCurrent = 2;
  } else if(fillColourCurrent == 2){
    fillColour = color(0, 255, 0, fillAlpha);
    fillColourCurrent = 3;
  } else if(fillColourCurrent == 3){
    fillColour = color(0, 0, 255, fillAlpha); 
    fillColourCurrent = 1;
  }
  fill(fillColour); //Sets fill colour
}

function mouseOverCanvas(){
  if(mouseX > 0 && mouseX <= width && mouseY > 0 && mouseY <= height){
    return true;
  } else{
    return false;
  }
}