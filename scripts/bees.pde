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
 size(600,600,P2D);
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

void draw()
{
 tint(255, overlayAlpha);
 image(img,0,0);
 
 stroke(0, beeAlpha);
 
 for(int i = 0; i < beeCount; i++)
 {
  bees[i].Update(); 
 }
}