float[] starsX;
float[] starsY;
float[] starsR;
int count = 1000;
float angle = 0;
color color1; 
color color2;

void setup()
{
  jProcessingJS(this, {fullscreen:true});
  frameRate(10);
  starsX = new float[count];
  starsY = new float[count];
  starsR = new float[count];
  color1 = color(#111e36);
  color2 = color(#192b4d);
  float hypotenuse = sqrt(width * width + height * height);
  for (int i = 0; i < count; i++)
  {
   starsX[i] = random(-hypotenuse, hypotenuse);
   starsY[i] = random(-hypotenuse, hypotenuse);
   starsR[i] = random(2,4);
  }
  
}

void draw()
{
  //background(#111e36);
    noFill();
    for (int i = 0; i <= height; i++) {
      float inter = map(i, height, 0, 1, 0);
      color c = lerpColor(color1, color2, inter);
      stroke(c);
      line(0, i, width, i);
    }

  translate(width/2, height);
    rotate(angle);
    angle += PI / 10000;
    for (int i = 0; i < count; i++)
    {
      fill(255);
     ellipse(starsX[i], starsY[i], starsR[i], starsR[i]); 
    } 
}