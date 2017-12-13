//visual maintainability constants:
var clearance = 17;
margin = 5;

//It reads the json file:
var xmlhttp = new XMLHttpRequest();

var url = "/static/jsons/floorPlant1.json";

xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

		var objectArray = JSON.parse(xmlhttp.responseText);

        if(objectArray[0].type === "dimension"){
            dimensionDesigner(objectArray[0]);
        }

        floorPlantDesigner(objectArray);
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();

function dimensionDesigner(object) {       
    
	var canvasWidth = /*$(visemCanvas).width()*/ window.innerWidth - clearance;    
    
        var largerSide = object.totalWidth > object.totalHeight ? object.totalWidth : object.totalHeight;
        
	//visual maintainability constant:
    return ratio = canvasWidth / largerSide;
}

//It's combine the objects of objectArray to the methods that create items in the view:
function floorPlantDesigner(objectArray) {
	
    for(var i=1; i < objectArray.length; i++){
        
        if(objectArray[i].type === "wall"){
            createWallInView(objectArray[i]);
        }
		
        if(objectArray[i].type === "emergencyExit"){
            createEmergencyExitInView(objectArray[i]);
        }        
    }
}

//It's create an wall in view:
function createWallInView(object) {
	
	var wall = new Path();
    wall.strokeColor = 'black';

	//initialPoint of wall:
    wall.add(new Point(object.initialPoint.x*ratio+margin, object.initialPoint.y*ratio+margin));

    //finalPoint of wall:
    wall.add(new Point(object.finalPoint.x*ratio+margin, object.finalPoint.y*ratio+margin));            
}

//It's create an emergencyExit in view:
function createEmergencyExitInView(object){
	
	var emergencyExit = new Path.Rectangle({
		topLeft: [object.initialPoint.x*ratio+margin, object.initialPoint.y*ratio+margin],
		bottomRight: [object.finalPoint.x*ratio+margin, object.finalPoint.y*ratio+margin],
		strokeColor: 'green',
		fillColor: 'green'
	});    
}
