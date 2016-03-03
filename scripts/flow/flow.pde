import java.util.Iterator;

int cols, rows;
int resolution;
float xo, yo;

ArrayList<Particle> particles;

float[] gravity;
int timer = 0;
int displaySetting = 0;

void setup()
{
	jProcessingJS(this, {fullscreen:true});
	//size(800,600);
	colorMode(HSB, 360, 100, 100);

	resolution = 30;
	cols = width / resolution;
	rows = height / resolution;
	xo = yo = 4;
	
	particles = new ArrayList<Particle>();
	
	gravity = new float[]{0,0.2};
	background(180, 50, 7);
}

void draw()
{
	noStroke();
	fill(180, 50, 6, 10);
	//fill(200, 100, 5);
	rect(0, 0, width, height);

	if (timer % 9 == 0)
	{
	  addParticle();
	  timer = 0;
	}
	applyFlowFieldToParticles();
	applyForceToParticles(gravity);
	runParticles();

	updateFlowField();
	timer++;
}

// particle system stuff

void addParticle()
{
	particles.add(new Particle(random(0, width), 0));
}

void runParticles()
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

void applyFlowFieldToParticles()
{
	for (Particle p : particles)
    {
      float[] fieldForce = lookupFlowVector(p.location);
      normalize(fieldForce);
      p.applyForce(fieldForce);
    }
}

void normalize(float[] vector)
{
	float h = sqrt(vector[0]*vector[0] + vector[1]*vector[1]);
	vector[0] /= h;
	vector[1] /= h;
}

void applyForceToParticles(float[] force)
{
	for (Particle p : particles)
    {
      p.applyForce(force);
    }
}

void run()
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

float[] lookupFlowVector(float[] coords)
{
	int col = int(coords[0]/resolution);
	int row = int(coords[1]/resolution);
	col = min(col, cols - 1);
	row = min(row, rows - 1);
	col = max(col, 0);
	row = max(row, 0);

	float xOffset = xo + (col * 0.1);
	float yOffset = yo + (row * 0.1);
	float theta = map(noise(xOffset, yOffset), 0, 1, 2 * PI / 3, 5 * PI / 2);
	float x = cos(theta);
	float y = sin(theta);

	return new float[] {x, y};
}

void updateFlowField()
 {
	xo += 0.01;
	yo += 0.01;
 }
