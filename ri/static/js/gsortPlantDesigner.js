//visual maintainability constants:
var clearance = 17;
margin = 5;

//It reads the json file:
var xmlhttp = new XMLHttpRequest();

var url = "/static/jsons/gsortPlant.json";

xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

		var objectArray = JSON.parse(xmlhttp.responseText);

        if(objectArray.type === "building"){
            dimensionDesigner(objectArray);
        }

        floorPlantDesigner(objectArray);
    }
}

xmlhttp.open("POST", url,true);
xmlhttp.send();

function dimensionDesigner(object) {       
    
    var wrapper = document.getElementById('wrapper');
    var canvas = document.getElementById('visemCanvas');

	//var canvasWidth = $(visemCanvas).width() - clearance;
    var canvasWidth = wrapper.clientWidth - clearance;

    var largerSide = diagonal(object.totalWidth, object.totalHeight);

	//visual maintainability constant:
    return ratio = canvasWidth / largerSide;
    
}

function diagonal(width, height){
    var diagonal = Math.pow(width,2) + Math.pow(height,2); 
    return Math.sqrt(diagonal);
}

//It's combine the objects of objectArray to the methods that create items in the view:
function floorPlantDesigner(objectArray) {
	
    var rooms = objectArray.children;
    var element;
    //TODO add function to track elements on canvas

    for(var i=0; i < rooms.length; i++){
    
        for (var j = 0; j < rooms[i].children.length; j++) {

            if(rooms[i].children[j].type === "wall"){
                element = createWallInView(rooms[i].children[j]);
            }
            
            if(rooms[i].children[j].type === "emergencyExit"){
                element = createEmergencyExitInView(rooms[i].children[j]);
            }

            if(rooms[i].children[j].type === "door"){
                element = createDoorInView(rooms[i].children[j]);
            }   
        }

        //TODO Function to fill the background of the room.
        //console.log(rooms[i]);
    }

    element.onMouseMove = function(event) {
        console.log(element);
        $("#textualInformation").html("idPerson :" + object.idPerson + " positionX :" + object.positionX + " positionY :" + object.positionY + " stationary :" + object.stationary + " age :" + object.age + " disability :" + object.disability);
    };
}

//It's create an wall in view:
function createWallInView(object) {
	
	var wall = new Path();
    wall.strokeColor = 'black';

	//initialPoint of wall:
    wall.add(new Point(object.initialPoint.x*ratio, object.initialPoint.y*ratio));

    //finalPoint of wall:
    wall.add(new Point(object.finalPoint.x*ratio, object.finalPoint.y*ratio));

    return wall;
}

//It's create an emergencyExit in view:
function createEmergencyExitInView(object){
	
	var emergencyExit = new Path.Rectangle({
		topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
		bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
		strokeColor: 'green',
		fillColor: 'green'
	});
    return emergencyExit;
}

//It's create an Door in view:
function createDoorInView(object){
    
    var door = new Path.Rectangle({
        topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
        bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
        strokeColor: 'red',
        fillColor: 'red'
    });

    return door;    
}

function onResize(){
    
}