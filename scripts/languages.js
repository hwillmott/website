var names;
var sizes;
var languageTexts;
var angles;
var colors;

var sum = 0;
var diameter = 300;
var focusSlice = 0;
var originX;
var originY;

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

    var languages = xmlDoc.getElementsByTagName("language");
    names = new Array(languages.length);
    sizes = new Array(languages.length);
    languageTexts = new Array(languages.length);

    for (var i = 0; i < languages.length; i++)
    {
        names[i] = languages[i].getAttribute("name");
        sizes[i] = parseInt(languages[i].getAttribute("strength"));
        languageTexts[i] = languages[i].textContent;

        sum = sum + sizes[i];
    }

}

function sketchProc(processing)
{
    processing.setup = function()
    {
        processing.size(700,350);
        processing.noStroke();

        angles = new Array(names.length);
        var angle = 0;
        for (var i = 0; i < names.length; i++)
        {
            angle = angle + sizes[i] / sum * processing.TWO_PI;
            angles[i] = angle; 
        }
        initColors();
        originX = 180;
        originY = 180;
    }

    processing.draw = function()
    {
        processing.background(300);

        var angle = 0;

        if (processing.dist(processing.mouseX, processing.mouseY, originX, originY) < diameter / 2)
        {
            var a = processing.atan2(processing.mouseY - originY, processing.mouseX - originX);
            a = (a + processing.TWO_PI) % processing.TWO_PI;
            var indx = 0;
            for (var i = 0; i < angles.length; i++)
            {
                if (a < angles[i]) break;
                indx++;
            }
            focusSlice = indx;
        }

        for (var i = 0; i < names.length; i++)
        {
            processing.fill(colors[i % (colors.length)]);
            if (i == focusSlice)
            {
                processing.arc(originX, originY, diameter + 20, diameter + 20, angle, angles[i]);
                processing.fill(0, 0, 0);
                processing.textSize(14);
                processing.text(names[i], 400, 130);
                processing.textSize(12);
                processing.text(languageTexts[i], 400, 150, 300, 200);
            }
            else
            {
                processing.arc(originX, originY, diameter, diameter, angle, angles[i]);
            }
            angle = angles[i];
        }
    }

    function initColors()
    {
        colors = new Array(7);
        colors[0] = processing.color(219, 97, 97);
        colors[1] = processing.color(219, 144, 97);
        colors[2] = processing.color(219, 195, 97);
        colors[3] = processing.color(144, 219, 97);
        colors[4] = processing.color(97, 219, 213);
        colors[5] = processing.color(97, 109, 219);
        colors[6] = processing.color(219, 97, 217);
    }
}

readXml("data/languagedata.xml");

var canvas = document.getElementById("canvas1");

var p = new Processing(canvas, sketchProc);