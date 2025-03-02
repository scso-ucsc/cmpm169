let magnetTexts = ["Drag Me!!!"];
let pickedUpMagnet = null;
let soundFiles = [];

class Magnet{
  constructor(indexVal){
    this.t = magnetTexts[indexVal];
    this.x = random(canvasWidth);
    this.y = random(canvasHeight);
    let pos;
    this.angle = random(TWO_PI);
    this.colour = color(255);
    this.boxBounds = font.textBounds(this.t, this.x, this.y, size);
    this.pos = createVector(this.boxBounds.x, this.boxBounds.y) //Dynamic position variable
    this.w = this.boxBounds.w;
    this.h = this.boxBounds.h;
    
    this.fingerX = 0;
    this.fingerY = 0;
    this.rotationOffset = 0;
    this.lastAngle = 0;
    
    this.sound;
  }
  
  display(){
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    fill(this.colour);
    rect(0, 0, this.w, this.h);
    
    fill(0);
    noStroke();
    textSize(size / 2);
    textAlign(CENTER, CENTER);
    text(this.t, 0, 0);
    pop();
    
    fill(255, 0, 0);
    
    if(pickedUpMagnet){
      this.playSoundBasedOnY();
    }
  }
  
  touch(thumbX, thumbY, indexX, indexY){
    let distBetweenFingers = dist(thumbX, thumbY, indexX, indexY);
    this.fingerX = abs(thumbX - indexX) + min(thumbX, indexX);
    this.fingerY = abs(thumbY - indexY) + min(thumbY, indexY);
    let distFromFingers = dist(this.pos.x, this.pos.y, this.fingerX, this.fingerY);
    
    this.updateColour();
    if(!pickedUpMagnet){
      if(distBetweenFingers < 40 && distFromFingers < this.w / 2){
        pickedUpMagnet = this;
      } else{
        this.colour = color(255);
      } 
    }
    
    if(pickedUpMagnet === this){
      this.pos.x = this.fingerX;
      this.pos.y = this.fingerY;
      
      let newAngle = atan2(indexY - thumbY, indexX - thumbX);
      
      this.angle = lerp(this.angle, newAngle + this.rotationOffset, 0.2); //Adding smoothness
    }
  }
  
  release(){
    this.rotationOffset += this.angle - this.lastAngle;
    pickedUpMagnet = null;
    this.lastAngle = this.angle;
  }
  
  playSoundBasedOnY(){
    let magnetY = this.pos.y;
    
    let soundIndex = int(map(magnetY, 0, canvasHeight, 0, soundFiles.length - 1));
    
    this.sound = soundFiles[soundIndex];
    let volume = map(this.angle, -PI, PI, 0.1, 1);
    this.sound.setVolume(volume);
    
    let panValue = map(this.pos.x, 0, canvasWidth, -1, 1);
    this.sound.pan(panValue);
    
    if(!this.sound.isPlaying()){
      this.sound.play();
    }
  }
  
  updateColour(){
    let r = map(this.pos.x, 0, canvasWidth, 100, 255);
    let g = map(this.pos.y, 0, canvasHeight, 100, 255);
    let b = map(dist(this.pos.x, this.pos.y, canvasWidth / 2, canvasHeight / 2), 0, Math.sqrt(Math.pow(canvasWidth, 2) + Math.pow(canvasHeight, 2)), 100, 255);
    
    this.colour = color(r, g, b);
  }
}