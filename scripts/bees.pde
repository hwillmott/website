int beeCount = 10;
Bee[] bees = new Bee[beeCount];
float noiseScale = 100;
float noiseStrength = PI;
float overlayAlpha = 30;
float beeAlpha = 90;
float strokeWidth = 0.5;
int hiveX;
int hiveY;
PImage img;

void setup()
{
 jProcessingJS(this, {fullscreen:true});
 background(#ccc7b6);
 smooth();
 frameRate(20);
 hiveX = width / 2 + 20;
 hiveY = height / 2  + 20;
 for(int i = 0; i < beeCount; i++)
 {
  bees[i] = new Bee(); 
 }
 img = loadImage("/images/hive.png");
}

void mousePressed()
{
    hiveX = mouseX;
    hiveY = mouseY;
}

void draw()
{
 noStroke();
 fill(#ccc7b6, overlayAlpha)
 rect(0,0,width/2 - 300, height);
 rect(width/2 + 305,0, width, height);
 tint(255, overlayAlpha);
 image(img,width / 2 - 300,0);
 
 stroke(0, beeAlpha);
 
 for(int i = 0; i < beeCount; i++)
 {
  bees[i].Update(); 
 }
}