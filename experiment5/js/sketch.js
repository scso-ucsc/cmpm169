// sketch.js - purpose and description here
// Author: Sean Eric So
// Date: 15 February, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,^`'.                                 "

let video;
let videoWidth = 64;
let videoHeight = 48;
let videoScale = 10;
let w;
let h;

var streamReady = false;

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
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  resizeScreen();

  $(window).resize(function() {
    resizeScreen();
  });
  canvasWidth = canvasContainer.width();
  canvasHeight = canvasContainer.height();

  video = createCapture(VIDEO, function() {
    streamReady = true;
  });
  video.size(videoWidth, videoHeight);
  video.hide();
  w = canvasWidth / video.width;
  h = canvasHeight / video.height;
  
  fill(255);
  textSize(w);
  textAlign(CENTER, CENTER);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(20);
  if(streamReady){
    video.loadPixels(); //Loads pixel data into video.pixels
  
    for (let i = 0; i < video.width; i++) {
      for (let j = 0; j < video.height; j++) {
        let pixelIndex = (i + j * video.width) * 4;
        let r = video.pixels[pixelIndex + 0];
        let g = video.pixels[pixelIndex + 1];
        let b = video.pixels[pixelIndex + 2];

        let bright = (r + g + b) / 3; //Calculating brightness
        let tIndex = floor(map(bright, 0, 255, 0, asciiChar.length));

        let pulseFactor = sin(frameCount * 0.1 + i * 0.1 + j * 0.1);
        let lerpedIndex = lerp(tIndex, tIndex + floor(pulseFactor * 3), 0.1);
        lerpedIndex = constrain(floor(lerpedIndex), 0, asciiChar.length - 1);

        let pulseR = sin(frameCount * 0.1 + i * 0.1 + j * 0.1) * 50;
        let pulseG = sin(frameCount * 0.1 + i * 0.1 + j * 0.2) * 50;
        let pulseB = sin(frameCount * 0.1 + i * 0.1 + j * 0.3) * 50;

        let rShifted = constrain(r + pulseR, 0, 255);
        let gShifted = constrain(g + pulseG, 0, 255);
        let bShifted = constrain(b + pulseB, 0, 255);

        colourShift = color(rShifted, gShifted, bShifted, 200);

        let x = i * w + w / 2; //Calculating position on canvas
        let y = j * h + h / 2;

        fill(colourShift);
        let t = asciiChar.charAt(lerpedIndex);
        text(t, x, y);

        let backgroundShift = color(r * 0.8, g * 0.8, b * 0.8);
        fill(backgroundShift.levels[0], backgroundShift.levels[1], backgroundShift.levels[2], 100);
        stroke(255, 100);
        text(t, x + random(-10, 10), y + random(-10, 10));
      }
    } 
  }
}