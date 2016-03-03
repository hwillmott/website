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
    lifespan = int(height * 2 / 3);
    mass = 10;
    maxSpeed = 1.5;
    displayTimer = 0;
  }
 
  void applyForce(float[] coords)
  {
    acceleration[0] += coords[0] / mass * 1.5;
    acceleration[1] += abs(coords[1]) / mass;
  }
 
  void update()
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
    
  void display()
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
    
  void limit(float[] vector, float max)
  {
      float lengthSquared = vector[0] * vector[0] + vector[1] * vector[1];

      if (lengthSquared > max * max)
      {
        float ratio = max / sqrt(lengthSquared);
        vector[0] *= ratio;
        vector[1] *= ratio;
      }
  }

  void normalize(float[] vector)
  {
    float h = sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
    vector[0] /= h;
    vector[1] /= h;
  }

  void run()
  {
    display();
    update();
  }

  boolean isDead()
  {
    if (lifespan < 0) return true;
    else return false;
  }
}