var VISEM = VISEM || {} ;

VISEM.Plant = function () {
	this.path = new Path();
	this.name = name;
	this.type = type;
	this.width = width;
	this.height = height;
	this.rooms = new Array();
	this.ratio;
	this.largerSide;
	this.diagonal;
    this.clearance
}

VISEM.Plant.prototype.init = function(canvasWrapper, canvas) {

    this.width = canvasWrapper.clientWidth - this.clearance;

    this.largerSide = diagonal(this.width, this.height);

    console.log(Math.floor(getRatio(this.width,largerSide)));

    this.ratio = getRatio(this.width, largerSide);
};

VISEM.Plant.prototype.getRatio = function(canvasWidth, largerSide) {
    return canvasWidth / largerSide;
};

VISEM.Plant.prototype.diagonal = function (width, height){
    var diagonal = Math.pow(width,2) + Math.pow(height,2); 
    return Math.sqrt(diagonal);
};

//It's combine the objects of objectArray to the methods that create items in the view:
VISEM.Plant.prototype.floorPlantDesigner = function (objectArray) {
	
    var rooms = objectArray.children;
    var element;
    //TODO add function to track elements on canvas

    //TODO Turn these objects composite
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
    }

    element.onMouseMove = function(event) {
        console.log(element);
        $("#textualInformation").html("idPerson :" + object.idPerson + " positionX :" + object.positionX + " positionY :" + object.positionY + " stationary :" + object.stationary + " age :" + object.age + " disability :" + object.disability);
    };
}

//It's create an wall in view:
VISEM.Plant.prototype.createWallInView = function (object) {
	
	var wall = new Path();
    wall.strokeColor = 'black';

	//initialPoint of wall:
    wall.add(new Point(object.initialPoint.x*ratio, object.initialPoint.y*ratio));

    //finalPoint of wall:
    wall.add(new Point(object.finalPoint.x*ratio, object.finalPoint.y*ratio));

    return wall;
}

//It's create an emergencyExit in view:
VISEM.Plant.prototype.createEmergencyExitInView = function(object){
	
	var emergencyExit = new Path.Rectangle({
		topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
		bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
		strokeColor: 'green',
		fillColor: 'green'
	});
    return emergencyExit;
}

//It's create an Door in view:
VISEM.Plant.prototype.createDoorInView = function(object){
    
    var door = new Path.Rectangle({
        topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
        bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
        strokeColor: 'red',
        fillColor: 'red'
    });

    return door;    
}

VISEM.Plant.prototype.addRoom = function(room) {
	this.rooms.push(room);
};