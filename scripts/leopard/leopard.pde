Cluster[] clusters;
PImage backgroundImg;
PImage foregroundImg;

void setup()
{
    size(1092,800);
    this.initializeFromFile();
    frameRate(20);
    backgroundImg = loadImage("/images/pde/foreground.png");
    foregroundImg = loadImage("/images/pde/background.png");
}

void initializeFromFile()
{
    int[] data;
    String[] points = loadStrings("/data/points.txt");
    clusters = new Cluster[points.length];
    for (int i = 0; i < points.length; i++)
    {
        data = int(split(points[i],','));
        clusters[i] = new Cluster(new PVector(data[0], data[1]), data[2]);
    }
}

void draw()
{
    tint(255, 60);
 	image(backgroundImg,0,0);

    for (Cluster c : clusters)
    {
    	c.update();
    	c.render();
    }

    noTint();
    image(foregroundImg,0,0);
}
