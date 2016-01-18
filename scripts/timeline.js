var companies;
var positions;
var durations;
var months;
var descriptions;
var colorsxml;

var sum = 0;
var startHeight = 50;
var rectangleHeight = 20;
var focusPadding = 5;
var focusIndx = 0;

function readXml(xmlFile)
{
    var xmlDoc;

    if(typeof window.DOMParser != "undefined") {
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET",xmlFile,false);
        if (xmlhttp.overrideMimeType){
            xmlhttp.overrideMimeType('text/xml');
        }
        xmlhttp.send();
        xmlDoc=xmlhttp.responseXML;
    }
    else{
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async="false";
        xmlDoc.load(xmlFile);
    }

    var jobs = xmlDoc.getElementsByTagName("job");
    companies = new Array(jobs.length);
    positions = new Array(jobs.length);
    durations = new Array(jobs.length);
    months = new Array(jobs.length);
    descriptions = new Array(jobs.length);
    colorsxml = new Array(jobs.length);

    for(var i = 0; i < jobs.length; i++)
    {
        companies[i] = jobs[i].getAttribute("company");
        positions[i] = jobs[i].getAttribute("position");
        durations[i] = jobs[i].getAttribute("duration");
        months[i] = parseInt(jobs[i].getAttribute("months"));
        colorsxml[i] = parseInt(jobs[i].getAttribute("color"));
        descriptions[i] = jobs[i].textContent;

        sum = sum + months[i];
    }
}

function sketchProc(processing)
{
    var colors;

    processing.setup = function()
    {
        processing.size(1000,290);
        processing.noStroke();
        initColors()
    }

    processing.draw = function()
    {
        processing.background(300);
        drawEndDates();
        var x = 0;
        for(var i = 0; i < companies.length; i++)
        {
            var rectangleWidth = months[i] / sum * processing.width;
            if (processing.mouseY >= startHeight && processing.mouseY <= (startHeight + rectangleHeight)
                && processing.mouseX > x && processing.mouseX < (x + rectangleWidth))
            {
                focusIndx = i;
            }
            drawRectangle(i, x, rectangleWidth);
            drawLabel(i, x);
            x = x + rectangleWidth;
        }
    }

    function drawEndDates()
    {
        processing.text("2009", 0, 26);
        processing.textAlign(processing.RIGHT);
        processing.text("Present", processing.width - 3, 26);
        processing.stroke(30);
        processing.line(1,30,1,startHeight + rectangleHeight - 2);
        processing.line(processing.width - 1, 30, processing.width - 1, startHeight + rectangleHeight - 2);
        processing.noStroke();
        processing.textAlign(processing.LEFT);      
    }

    function drawRectangle(i, x, rectangleWidth)
    {
        processing.fill(colors[colorsxml[i]]);
        if (i == focusIndx)
        {
            processing.rect(x, startHeight + focusPadding, rectangleWidth, rectangleHeight);
            drawContent(i);
        }
        else
        {
            processing.rect(x, startHeight, rectangleWidth, rectangleHeight);
        }
    }

    function drawLabel(i, x)
    {
        processing.fill(0);
        processing.textSize(12);
        if (i == focusIndx)
        {
            processing.text(companies[i], x + 4, 50);
        }
        else
        {
            processing.text(companies[i], x + 4, 45);
        }
    }

    function drawContent(i)
    {
        processing.fill(0);
        processing.textSize(16);
        processing.text(positions[i], 15, 120);
        processing.text(durations[i], 15, 140);
        processing.textSize(14);
        processing.text(descriptions[i], 15, 160);
    }

    function initColors()
    {
        colors = new Array(companies.length);
        colors[0] = processing.color(219, 97, 97);
        colors[1] = processing.color(219, 144, 97);
        colors[2] = processing.color(219, 195, 97);
        colors[3] = processing.color(144, 219, 97);
        colors[4] = processing.color(97, 219, 213);
        colors[5] = processing.color(97, 109, 219);
        colors[6] = processing.color(219, 97, 217);
    }
}

readXml("data/workexperience.xml");

var canvas = document.getElementById("canvas2");

var p = new Processing(canvas, sketchProc);
