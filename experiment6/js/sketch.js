// sketch.js - purpose and description here
// Author: Sean Eric So
// Date: 15 February, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
let table;
let dates = [];
let months = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let runningDates = [];

let b = 4; //Spacing of spiral
let size = 13;
let scale = 1.3;
let streakAlpha = [75, 100, 150, 200, 250];
let streak = 0;
let fontR, fontB;
let rotationSpeed = 0.02;
let streakMultiplier = 1;

let hoveredDate = null;
let hoveredDatePosition = {x: 0, y: 0};

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;
var canvasWidth, canvasHeight;

function preload(){
  table = loadTable("./assets/sample.csv", "csv", "header");
  fontR = loadFont("./assets/Outfit-Regular.ttf");
  fontB = loadFont("./assets/Outfit-Black.ttf");
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

  textSize(size);
  textAlign(CENTER, CENTER);
  noStroke();
  
  for(let i = 0; i < months.length; i++){
    for(let j = 0; j < months[i]; j++){
      dates.push({month: i + 1, date: j + 1});
    }
  }
  
  for(row = 0; row < table.getRowCount(); row++){
    let runningMonth = table.getNum(row, "month"); //Getting specific row value of column "month"
    let runningDate = table.getNum(row, "date");
    
    let didIRun = (element) => element.month == runningMonth && element.date == runningDate;
    let index = dates.findIndex(didIRun);
    if(index != -1){ //If date is present in data, then push to runningDates
      runningDates.push(index);
    }
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background("#e3e4db");
  translate(canvasWidth / 2, canvasHeight / 2);
  
  hoveredDate = null;
  
  for(let i = 0; i < runningDates.length; i++){
    let val = runningDates[i];
    let angle = sqrt(val) * b;
    let r = b * angle;
    let x = r * cos(angle);
    let y = r * sin(angle);
    
    if(i != 0){
      checkForStreak(i);
    }
    
    fill(7, 94, 205, streakAlpha[streak]);
    let sizeFactor = 1 + (streak * 0.1);
    
    if(dist(mouseX - canvasWidth / 2, mouseY - canvasHeight / 2, x, y) < size * scale / 2){
      hoveredDate = dates[val];
      hoveredDatePosition = {x: x, y: y};
    }
    
    push();
    translate(x, y);
    rotate(angle + frameCount * rotationSpeed * streakMultiplier);
    rect(-size * sizeFactor * scale / 2, -size * sizeFactor * scale / 2, size * sizeFactor * scale, size * sizeFactor * scale);
    pop();
  }
  
  for(let i = 0; i < dates.length; i++){
    let angle = sqrt(i) * b;
    let r = b * angle;
    let x = r * cos(angle);
    let y = r * sin(angle);
    
    if(dates[i].date == 1){ //Setting font
      textFont(fontB);
      fill("#FF0000");
    } else{
      textFont(fontR);
      fill(0);
    }
    
    push();
    translate(x, y); //Move to coordinate to rotate appropriately
    if(i != 0){
       rotate(angle + PI/2); 
    }
    text(dates[i].date, 0, 0);
    pop();
  }
  
  if(hoveredDate){
    push();
    let rectWidth = textWidth(`Date: ${hoveredDate.month}/${hoveredDate.date}` + 20);
    let rectHeight = 30;
    fill(255, 255, 255, 180);
    rect(hoveredDatePosition.x - 14, hoveredDatePosition.y - rectHeight / 2 - 20, rectWidth * 1.8, rectHeight, 10);
    
    fill(0);
    textSize(16);
    textFont(fontR);
    text(`Date: ${hoveredDate.month}/${hoveredDate.date}`, hoveredDatePosition.x + 30, hoveredDatePosition.y - 21);
    pop();
  }
}

function checkForStreak(i){
  let previousDate = dates[runningDates[i - 1]];
  let currentDate = dates[runningDates[i]];

  if(currentDate.date == 1){ //Accounting for first of month
    let previousMonth = currentDate.month - 1;
    let lastDayOfPreviousMonth = months[previousMonth - 1];
    
    if(previousMonth == 2){
      lastDayOfPreviousMonth = 29;
    }
    
    if(previousDate.date == lastDayOfPreviousMonth && previousDate.month == currentDate.month - 1){
      streak++;
    } else{
      streak = 0;
    }
  } else{
    if(currentDate.date == previousDate.date + 1 && currentDate.month == previousDate.month && streak < 4){
      streak++;
    } else if(currentDate.date != previousDate.date + 1 && currentDate.month == previousDate.month){
      streak = 0;
    } 
  }
  
  streakMultiplier = 1 + (streak * 0.5);
}