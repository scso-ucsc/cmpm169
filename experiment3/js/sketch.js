// sketch.js - purpose and description here
// Author: Sean Eric So
// Date: January 31, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

var video;
var microphone;
var x; //For tracking where video is drawing
var y;
var curvePointX = 0; //Coordinates for curved lines
var curvePointY = 0;
var pointCount = 1; //Controls how many points are used to draw lines
var diffusion = 50;
var streamReady = false;
var audioReady = false;
var drawRate = 0;
let volume = 0;
let drawingActive = true;
let threshold = 50;

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
  console.log("HELLO!");
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

  background(255);
  x = canvasWidth / 2; //Starts at center of canvas
  y = canvasHeight / 2;
  video = createCapture(VIDEO, function() { //Initialise webcam
    streamReady = true;
  });
  video.size(canvasWidth * pixelDensity(), canvasHeight * pixelDensity()); //Resizes video to canvas dimensions
  video.hide(); //Hides video from canvas
  microphone = new p5.AudioIn();
  microphone.start(function() {
    audioReady = true;
    console.log("Microphone ready");
  });
  textAlign(CENTER, CENTER);
  noFill();
}

// draw() function is called repeatedly, it's the main animation loop
  function draw() {
    if(audioReady == false || streamReady == false) return;

    volume = int(microphone.getLevel() * 100);
    console.log(volume);
    
    if(volume >= threshold && drawingActive == true){
      endProgram();
    }

    if(mouseIsPressed) increaseDrawRate();
    if(volume >= 5 && drawingActive){
      for(var j = 0; j <= volume + drawRate; j++){ //Constant generation rate
        var c = color(video.get(width - x, y)); //Acquire colour from position on camera
        
        //c = prismaticEffect(c);
        
        var cHSV = chroma(red(c), green(c), blue(c)); //Converting c to HSV
        strokeWeight(cHSV.get('hsv.h') / 50); //Weight determined by hue value
        stroke(c);
        
        var diffuseVal = random(0, 600);
        diffusion = map(diffuseVal, 0, height, 5, 100); //Constant difusion rate
        
        beginShape();
        curveVertex(x, y);
        curveVertex(x, y); //Called twice to ensure curve starts smoothly
        
        for(var i = 0; i <= pointCount; i++){
          var rx = int(random(-diffusion, diffusion));
          curvePointX = constrain(x + rx, 0, width - 1);
          var ry = int(random(-diffusion, diffusion));
          curvePointY = constrain(y + ry, 0, height - 1);
          curveVertex(curvePointX, curvePointY);
        }
        
        curveVertex(curvePointX, curvePointY);
        endShape();
        
        x = curvePointX;
        y = curvePointY;
      }
    }
  }

  function increaseDrawRate(){
    drawRate = 50;
  }

  function mouseReleased() {
    drawRate = 5;
  }

  function endProgram(){
    drawingActive = false;
    background(0);
    noLoop();
    fill(255, 0, 0);
    textSize(55);
    text("YOU'RE TOO LOUD!", width / 2, height / 2 - 20);
    textSize(24);
    text("Click space to restart", width / 2, height / 2 + 50);
  }

  function keyPressed(){
    if(keyCode == 32 && drawingActive == false){
      clear();
      drawingActive = true;
      loop();
    }
  }