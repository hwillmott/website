import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.Iterator; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class flow extends PApplet {



int cols, rows;
int resolution;
float xo, yo;

ArrayList<Particle> particles;

float[] gravity;
int timer = 0;
int displaySetting = 0;

public void setup()
{
	//jProcessingJS(this, {fullscreen:true});
	
	colorMode(HSB, 360, 100, 100);

	resolution = 30;
	cols = width / resolution;
	rows = height / resolution;
	xo = yo = 4;
	//initializeNoise(xo, yo);
	
	particles = new ArrayList<Particle>();
	
	gravity = new float[]{0,0.4f};
	background(0, 12, 12);
}

public void mousePressed()
{
	displaySetting = (displaySetting + 1) % 3;
}

public void draw()
{
	noStroke();
	fill(200, 100, 5, 10);
	rect(0, 0, width, height);

	if (displaySetting == 0)
	{
		if (timer % 10 == 0)
		{
		  addParticle();
		  timer = 0;
		}
		applyFlowFieldToParticles();
		applyForceToParticles(gravity);
		runParticles();
	}
	else if (displaySetting == 1)
	{
		displayFlowField();		
	}
	else
	{
		displayFlowField2();
	}

	updateFlowField();
	timer++;
}

// particle system stuff

public void addParticle()
{
	particles.add(new Particle(random(0, width), 0));
}

public void runParticles()
{
	Iterator<Particle> it = particles.iterator();
    while (it.hasNext())
    {
      Particle p = it.next();
      p.run();
      if (p.isDead())
      {
        it.remove();
      }
    }
}

public void applyFlowFieldToParticles()
{
	for (Particle p : particles)
    {
      float[] fieldForce = lookupFlowVector(p.location);
      normalize(fieldForce);
      p.applyForce(fieldForce);
    }
}

public void normalize(float[] vector)
{
	float h = sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
	vector[0] /= h;
	vector[1] /= h;
}

public void applyForceToParticles(float[] force)
{
	for (Particle p : particles)
    {
      p.applyForce(force);
    }
}

public void run()
{
	Iterator<Particle> it = particles.iterator();
	while (it.hasNext())
	{
		Particle p = it.next();
		p.run();
		if (p.isDead())
		{
			it.remove();
		}
	}
}

// flow field stuff

/*void initializeNoise(float xoff, float yoff)
 {
   for (int i = 0; i < rows; i++)
   {
   	fieldX[i] = new float[cols];
   	fieldY[i] = new float[cols];
     for (int j = 0; j < cols; j++)
     {
       float theta = map(noise(xoff, yoff + (j * 0.1)), 0, 1, PI / 2, 5 * PI / 2);
       fieldX[j][i] = cos(theta);
       fieldY[j][i] = sin(theta);
     }
     yoff += 0.1;
     xoff += 0.1;
   }   
 } */

public float[] lookupFlowVector(float[] coords)
{
	int col = PApplet.parseInt(coords[0]/resolution);
	int row = PApplet.parseInt(coords[1]/resolution);
	col = min(col, cols - 1);
	row = min(row, rows - 1);
	col = max(col, 0);
	row = max(row, 0);

	float xOffset = xo + (col * 0.1f);
	float yOffset = yo + (row * 0.1f);
	float theta = map(noise(xOffset, yOffset), 0, 1, PI /2, 5 * PI / 2);
	float x = cos(theta);
	float y = sin(theta);
	return new float[] {x, y};
}

public void updateFlowField()
 {
   xo += 0.01f;
   yo += 0.01f;
 }

public void displayFlowField()
 {
   for (int i = 0; i < cols; i++)
   {
     for (int j = 0; j < rows; j++)
     {
     	float[] angle = lookupFlowVector(new float[]{i, j});
       float theta = atan2(angle[0], angle[1]);
       stroke(255);
       strokeWeight(1);
       pushMatrix();
       translate(resolution * i + resolution / 2, resolution * j + resolution / 2);
       rotate(theta);
       line(0, 0, 4, 4);
       popMatrix();
     }     
   }
 } 
 
 public void displayFlowField2()
 {
   for (int i = 0; i < cols; i++)
   {
     for (int j = 0; j < rows; j++)
     {
       float[] angle = lookupFlowVector(new float[]{i, j});
       float theta = atan2(angle[0], angle[1]);
       stroke(255);
       strokeWeight(1);
       translate(resolution * i + resolution / 2, resolution * j + resolution / 2);
       rotate(theta);
       line(0, 0, width, height);
     }     
   }
 } 
class FlowField
{
 float[][][] field;
 int cols, rows;
 int resolution;
 float xo, yo;
 float r;
 
 FlowField()
 {
   resolution = 30;
   cols = width / resolution;
   rows = height / resolution;
   field = new float[cols][rows][2];
   xo = yo = 4;
   r = 3;
   initializeNoise(xo, yo);
 }
 
 public void initializeNoise(float xoff, float yoff)
 {
   for (int i = 0; i < rows; i++)
   {
     for (int j = 0; j < cols; j++)
     {
       float theta = map(noise(xoff, yoff + (j * 0.1f)), 0, 1, PI / 2, 5 * PI / 2);
       field[j][i][0] = cos(theta);
       field[j][i][1] = sin(theta);
     }
     yoff += 0.1f;
     xoff += 0.1f;
   }   
 }
 
 public float[] lookup(float[] coords)
 {
   int col = PApplet.parseInt(coords[0]/resolution);
   int row = PApplet.parseInt(coords[1]/resolution);
   col = min(col, cols - 1);
   row = min(row, rows - 1);
   col = max(col, 0);
   row = max(row, 0);
   return field[col][row];
 }
 
 public void display()
 {
   for (int i = 0; i < cols; i++)
   {
     for (int j = 0; j < rows; j++)
     {
       float theta = atan2(field[i][j][0], field[i][j][1]);
       stroke(255);
       strokeWeight(1);
       pushMatrix();
       translate(resolution * i + resolution / 2, resolution * j + resolution / 2);
       rotate(theta);
       line(0, 0, 4, 4);
        popMatrix();
     }     
   }
 } 
 
 public void display2()
 {
   for (int i = 0; i < cols; i++)
   {
     for (int j = 0; j < rows; j++)
     {
       float theta = atan2(field[i][j][0], field[i][j][1]);
       stroke(255);
       strokeWeight(1);
       translate(resolution * i + resolution / 2, resolution * j + resolution / 2);
       rotate(theta);
       line(0, 0, width, height);
     }     
   }
 } 
 
 public void update()
 {
   xo += 0.01f;
   yo += 0.01f;
   initializeNoise(xo,yo);
 }
}
class Particle
{
  float[] location;
  float[] velocity;
  float[] acceleration;
  float lifespan;
  float mass;
  float maxSpeed;
  int displayTimer;
 
  Particle(float x, float y)
  {
    location = new float[]{x, y};
    velocity = new float[]{0,0};
    acceleration = new float[]{0,0};
    lifespan = 400;
    mass = 10;
    maxSpeed = 1.5f;
    displayTimer = 0;
  }
 
  public void applyForce(float[] coords)
  {
    acceleration[0] += coords[0] / mass;
    acceleration[1] += abs(coords[1]) / mass;
  }
 
  public void update()
  {
    velocity[0] += acceleration[0];
    velocity[1] += acceleration[1];
    limit(velocity, maxSpeed);
    location[0] += velocity[0];
    location[1] += velocity[1];
    acceleration[0] = 0;
    acceleration[1] = 0;
    lifespan -= 1;
  }
    
  public void display()
  {
    if (displayTimer % 5 == 0)
    {
      strokeWeight(2);
      stroke(200, 100, 40, lifespan);
      noFill();
      ellipse(location[0], location[1], 5, 5);
      displayTimer = 0;
    }
    displayTimer += 1;
  }
    
  public void limit(float[] vector, float max)
  {
      float lengthSquared = vector[0] * vector[0] + vector[1] * vector[1];

      if (lengthSquared > max * max)
      {
        float ratio = max / sqrt(lengthSquared);
        vector[0] *= ratio;
        vector[1] *= ratio;
      }
  }

  public void normalize(float[] vector)
  {
    float h = sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
    vector[0] /= h;
    vector[1] /= h;
  }

  public void run()
  {
    display();
    update();
  }

  public boolean isDead()
  {
    if (lifespan < 0) return true;
    else return false;
  }
}
class ParticleSystem
{
  int total = 30;
  ArrayList<Particle> particles;
  
  ParticleSystem()
  {
    particles = new ArrayList<Particle>();
  }
  
  public void addParticle()
  {
    particles.add(new Particle(random(0, width), 0));
  }
  
  public void applyForce(FlowField f)
  {
    int count = 0;
    for (Particle p : particles)
    {
      float[] fieldForce = f.lookup(p.location);
      normalize(fieldForce);
      p.applyForce(fieldForce);
      stroke(1);
      fill(255);
      count += 1;
    }
  }

  public void normalize(float[] vector)
  {
    float h = sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
    vector[0] /= h;
    vector[1] /= h;
  }
  
  public void applyForce(float[] force)
  {
    for (Particle p : particles)
    {
      p.applyForce(force);
    }
  }
  
  public void run()
  {
    Iterator<Particle> it = particles.iterator();
    while (it.hasNext())
    {
      Particle p = it.next();
      p.run();
      if (p.isDead())
      {
        it.remove();
      }
    }
  }

  public void printDebug()
  {
    int count = 0;
    Iterator<Particle> it = particles.iterator();
    while (it.hasNext())
    {
      Particle p = it.next();
      String text = "velocity: " + p.velocity[0] + ", " + p.velocity[1] + " acceleration: " + p.acceleration[0] + ", " + p.acceleration[1]; 
      stroke(1);
      fill(255);
      text(text, 10, count * 15);
      count += 1;
    }
  }
}
  public void settings() { 	size(800,600); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "flow" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
