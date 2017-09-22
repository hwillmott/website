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
 size(605,806);
 background(#ccc7b6);
 smooth();
 frameRate(20);
 hiveX = width / 2 + 20;
 hiveY = height / 2  + 20;
 for(int i = 0; i < beeCount; i++)
 {
  bees[i] = new Bee(); 
 }
 img = loadImage("/images/pde/hive.png");
}

void mousePressed()
{
    hiveX = mouseX;
    hiveY = mouseY;
}

void draw()
{
 noStroke();
 fill(#ccc7b6, overlayAlpha);
 tint(255, overlayAlpha);
 image(img,0,0);
 
 stroke(0, beeAlpha);
 
 for(int i = 0; i < beeCount; i++)
 {
  bees[i].Update(); 
 }
}
