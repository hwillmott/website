var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var tileSize = 10;
var dimensionX = Math.floor(window.innerWidth / tileSize);
var dimensionY = Math.floor(window.innerHeight / tileSize);
var addedCells = new Array(dimensionX);
var gameBoard = new Array(dimensionX);
var gameBoardParent = new Array(dimensionX);
var generationCells = 0;


function initializeBoard()
{
    for (var i = 0; i < dimensionX; i++)
    {
        gameBoard[i] = new Array(dimensionY);
        gameBoardParent[i] = new Array(dimensionY);
        addedCells[i] = new Array(dimensionY);
        for (var j = 0; j < dimensionY; j++)
        {
            gameBoard[i][j] = Math.random() <= 0.5;
            gameBoardParent[i][j] = false;
            addedCells[i][j] = false;
        }
    }
}

function updateBoard()
{
    var newBoard = new Array(dimensionX);
    for (var i = 0 ; i < dimensionX; i++)
    {
        newBoard[i] = new Array(dimensionY);
        for (var j = 0; j < dimensionY; j++)
        {
            var neighbourCount = countNeighbours(i, j)
            var currentCell = gameBoard[i][j];

            var newCell = (addedCells[i][j] || currentCell && (neighbourCount == 2 || neighbourCount == 3)) || (!currentCell && neighbourCount == 3);
            newBoard[i][j] = newCell;
            addedCells[i][j] = false;
        }
    }
    gameBoardParent = gameBoard;
    gameBoard = newBoard;
}

function countNeighbours(i, j)
{
    var sum = 0;
    for(var x = -1; x <= 1; x++)
    {
        // deal with edge case: modular with dimension?
        var m = (i + x + dimensionX) % dimensionX;
        for(var y = -1; y <=1; y++)
        {
            // deal with edge case
            var n = (j + y + dimensionY) % dimensionY;
            sum += gameBoard[m][n] ? 1 : 0;
        }
    }

    // subtract value of tile in question
    return sum - (gameBoard[i][j] ? 1 : 0);
}

function sketchProc(processing) 
{
    processing.setup = function()
    {
        processing.size(window.innerWidth, window.innerHeight);
        processing.noStroke();
        processing.colorMode(processing.HSB,360,100,100,100); 
    }

    var backgroundColor = processing.color(10, 65, 85);
    var deadFor1GenerationColor = processing.color(10, 65, 85);
    var justDiedColor = processing.color(10, 65, 85);
    var justBornColor = processing.color(140, 150, 50, 40);
    var aliveFor1GenerationColor = processing.color(140, 150, 50, 100);

    function getCellColor(i, j)
    {
        if (gameBoard[i][j])
        {
            if (gameBoardParent[i][j])
            {
                return aliveFor1GenerationColor;
            }
            else
            {
                return justBornColor;
            }
        }
        else
        {
            if (gameBoardParent[i][j])
            {
                return justDiedColor;
            }
            else
            {
                return deadFor1GenerationColor;
            }
        }
    }

    function addSomeCells()
    {
        var cellX = parseInt(processing.mouseX / tileSize);
        var cellY = parseInt(processing.mouseY / tileSize);

        for(var x = -1; x <= 1; x++)
        {
            // deal with edge case: modular with dimension?
            var m = (cellX + x + dimensionX) % dimensionX;
            for(var y = -1; y <=1; y++)
            {
                // deal with edge case
                var n = (cellY + y + dimensionY) % dimensionY;
                addedCells[m][n] = Math.random() <= 0.7;
            }
        }
    }


    processing.mousePressed = function()
    {
        addSomeCells();
    } 

    processing.draw = function() 
    {
        // erase background
        processing.background(backgroundColor);

        for (var i = 0; i < dimensionX; i++)
        {
            for (var j = 0; j < dimensionY; j++)
            {
                if (gameBoard[i][j])
                {
                  processing.fill(getCellColor(i,j));
                }
                else
                {
                  processing.fill(getCellColor(i,j));
                }

                var posX = tileSize*i;
                var posY = tileSize*j;      
                processing.rect(posX, posY, tileSize, tileSize); 
            }
        }
    }   
}

initializeBoard();

var canvas = document.getElementById("canvas1");

var p = new Processing(canvas, sketchProc);

setInterval(function(){
    updateBoard();
    generationCells += 1;
}, 300);