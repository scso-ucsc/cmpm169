// sketch.js - purpose and description here
// Author: Sean Eric So
// Date: 2 March, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let videoFeed;
let streamReady;
let handPose;
let hands = [];

let size = 35;
let font;
let magnets = [];
let magnetNum = 5;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
var canvasWidth, canvasHeight;

function preload(){
  handPose = ml5.handPose({flipped: true}); //Importing ml5 hand pose model
  font = loadFont("./assets/Outfit-Regular.ttf");
  
  soundFiles[0] = loadSound("./assets/Piano1.wav");
  soundFiles[1] = loadSound("./assets/Piano2.wav");
  soundFiles[2] = loadSound("./assets/Piano3.wav");
  soundFiles[3] = loadSound("./assets/Piano4.wav");
  soundFiles[4] = loadSound("./assets/Piano5.wav");
  soundFiles[5] = loadSound("./assets/Piano6.wav");
  soundFiles[6] = loadSound("./assets/Piano7.wav");
}

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

  rectMode(CENTER);
  textFont(font);
  
  videoFeed = createCapture(VIDEO, {flipped: true}, function() {
    streamReady = true;
  });
  videoFeed.hide();
  
  handPose.detectStart(videoFeed, gotHands);
  
  for(let i = 0; i < magnetTexts.length; i++){
     magnets[i] = new Magnet(i); 
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(220);
  if(streamReady){
    image(videoFeed, 0, 0, canvasWidth, canvasHeight);
    
    if(hands.length > 0){
      let index = hands[0].keypoints[8];
      let thumb = hands[0].keypoints[4];

      let scaleX = canvasWidth / videoFeed.width;
      let scaleY = canvasHeight / videoFeed.height;

      index.x *= scaleX;
      index.y *= scaleY;
      thumb.x *= scaleX;
      thumb.y *= scaleY;
      
      noFill();
      stroke(0, 255, 0);
      text("index", index.x, index.y);
      text("thumb", thumb.x, thumb.y);

      console.log('Index Finger:', index, 'Thumb Finger:', thumb);
      
      for(let i = 0; i < magnets.length; i++){ //Enabling Magnet movement
        magnets[i].touch(thumb.x, thumb.y, index.x, index.y)
      }
      
      let distBetweenFingers = dist(thumb.x, thumb.y, index.x, index.y);
      if(distBetweenFingers > 40 && pickedUpMagnet){
        pickedUpMagnet.release(); //Resetting pickedUpMagnet to null
      }
    }
    
    for(let i = 0; i < magnets.length; i++){ //Displaying Magnets
      magnets[i].display();
    }
  }
}

function gotHands(results){
  hands = results;
}