var maxCount = 5000;
var dropCount = 0;
var growing = true;
var dropping = false;
var currentCount = 0;
var maxDistanceSoFar = 1;
var a = 0;
var x = new Array(maxCount);
var y = new Array(maxCount);
var r = new Array(maxCount);

var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
canvas.style.zindex=-1;

function sketchProc(processing) 
{
    processing.setup = function()
    {
        processing.size(ctx.canvas.width,ctx.canvas.height);
        processing.noStroke();
        processing.colorMode(processing.HSB,360,100,100,100); 
        initiateValues();
    }

    function initiateValues()
    {
        a = processing.TWO_PI;
        x[0] = processing.width * 2 / 3;
        y[0] = processing.height * 2 / 3;
        r[0] = 2;
        currentCount = 1;      
    }

    function setFillForCell(i)
    {
        if (dropping && i < dropCount)
        {
            processing.fill(255);
        }
        else 
        {
            processing.fill(50, 30);
        }
    }

    function getRadiusForOldCell(i)
    {
        if (i == 0) return 1;

        if (i > currentCount - 500)
        {
            return 2;
        }
        else if (i > currentCount - 3000)
        {
            return 3;
        }
        else return 4;
    }

    function randomDist(maxDimension, newR)
    {
        return parseInt(processing.random(0 + newR, maxDimension-newR));
    }

    processing.mouseReleased = function()
    {
        dropCount = 0;
        dropping = true;
        growing = false;
    }  

    processing.draw = function() 
    {
        processing.background(255);
        processing.strokeWeight(0.5);

        if (growing)
        {
            var showDist = false;

            var newR = 2;
            
            if (currentCount % 2 == 0)
            {
                var newX = randomDist(processing.width, newR);
                var newY = randomDist(processing.height, newR);          
            }
            else
            {
                a = a + processing.random();
                var sin = processing.sin(a);
                var cos = processing.cos(a);
                var newX = (processing.width / 2) + parseInt(Math.random() * sin * processing.width / 2);
                var newY = (processing.height / 2) + parseInt(Math.random() * cos * processing.height / 2);
            }

            if (showDist)
            {
                x[currentCount] = newX;
                y[currentCount] = newY;
                r[currentCount] = newR;
            }
            else
            {
                var closestDist = 100000000;
                var closestIndex = 0;

                for(var i = 0; i < currentCount; i++)
                {
                    var newDist = processing.dist(newX, newY, x[i], y[i]);
                    if (newDist < closestDist)
                    {
                        closestDist = newDist;
                        closestIndex = i;
                    }
                }

                var distanceFromRoot = processing.dist(newX, newY, x[0], y[0]);
                if (distanceFromRoot > maxDistanceSoFar) 
                {
                    maxDistanceSoFar = distanceFromRoot;
                }

                var angle = processing.atan2(newY-y[closestIndex], newX-x[closestIndex]);
                x[currentCount] = x[closestIndex] + processing.cos(angle) * (r[closestIndex]+newR);
                y[currentCount] = y[closestIndex] + processing.sin(angle) * (r[closestIndex]+newR);
                r[currentCount] = newR;
            }

            currentCount++;
            if (currentCount > maxCount)
            {
                growing = false;
            }
        }

        for (var i = 0; i < currentCount; i++)
        {
            setFillForCell(i);
            var factor = getRadiusForOldCell(i);
            processing.ellipse(x[i],y[i],r[i]*factor,r[i]*factor);
        }

        if (dropping)
        {
            dropCount = dropCount + 20;
            if (dropCount > currentCount)
            {
                dropping = false;
                growing = true;
                initiateValues();
            }
        }
    }

  }; 

var p = new Processing(canvas, sketchProc);