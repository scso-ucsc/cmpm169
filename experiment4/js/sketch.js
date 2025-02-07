// sketch.js - purpose and description here
// Author: Sean Eric So
// Date: February 6, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let rotationDirection = 1; //Will rotate clockwise
let distance, size, rotationSpeed, sides;

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

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  resizeScreen();

  $(window).resize(function() {
    resizeScreen();
  });
  canvasWidth = canvasContainer.width();
  canvasHeight = canvasContainer.height();

  angleMode(DEGREES); //Switching to degrees for easier understanding
  noFill();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(30);
  rotateX(60); //Rotates scene 60 degrees around x-axis
  
  push();
  translate(0, 0, -100);
  createBark();
  pop();
  
  translate(0, 0, 40);
  createStructure();
  
  push(); //Saves transformation values to stack
  translate(0, 0, 100);
  rotateX(180);
  createStructure();
  pop(); //Restores original transformation values
  
  push();
  rotateX(180);
  translate(100, 0, -50);
  createStructure();
  pop();
  
  push();
  rotateX(180);
  translate(-100, 0, -50);
  createStructure();
  pop();
  
  push();
  rotateX(180);
  translate(0, 100, -50);
  createStructure();
  pop();
  
  push();
  rotateX(180);
  translate(0, -100, -50);
  createStructure();
  pop();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  rotationDirection *= -1;
}

function createStructure(){
  distance = dist(mouseX, mouseY, width / 2, height / 2);
  size = map(distance, 0, width / 2, 1, 5);
  
  rotationSpeed = map(mouseX, 0, width, 50, 10);
  sides = map(mouseY, 0, height, 10, 120);
  
  for(var i = 0; i < 50; i++){
    var r = map(sin(frameCount / 2), -1, 1, 100, 200); //Mapping the sin value
    var g = map(i, 0, 50, 100, 200);
    var b = map(cos(frameCount), -1, 1, 200, 100);
    stroke(r, g, b); //Setting dynamic colour
    
    rotate(rotationDirection * frameCount / rotationSpeed); //Rotates scene
    
    beginShape();
    for(var j = 0; j < 360; j += sides){
      var rad = i * size;
      var x = rad * cos(j);
      var y = rad * sin(j);
      var z = sin(frameCount * 2 + i * 5) * 50; //z-position oscillates based on frameCount
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
  }
}

function createBark(){
  for(var i = 0; i < 50; i++){
    var r = map(cos(frameCount), -1, 1, 255, 0);
    var g = map(sin(frameCount / 2), -1, 1, 0, 255);
    var b = map(i, 0, 50, 0, 255);
    stroke(r, g, b); //Setting dynamic colour
    
    rotate(rotationDirection * frameCount / 50);
    beginShape();
    for(var j = 0; j < 360; j += map(cos(frameCount), -1, 1, 30, 120)){
      var rad = i;
      var x = rad * cos(j);
      var y = rad * sin(j);
      var z = sin(i * 10) * -150;
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
  }
}