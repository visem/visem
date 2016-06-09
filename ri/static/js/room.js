var VISEM = VISEM || {};

VISEM.Room = function(name, type, totalWidth, totalHeight, children, ratio){
	this.path = new Path();
	this.name = name;
	this.type = type;
	this.totalWidth = totalWidth;
	this.totalHeight = totalHeight;
	this.children = children;
	this.ratio = ratio;
	this.initialPoint = this.children[0].initialPoint;
	this.finalPoint = this.children[0].finalPoint;
	this.peopleCounter = 0;

	this.draw = function() {
		for (var i = 0; i < this.children.length; i++) {
			
			var object = new Path();
			
			this.initialPoint = lowerPoint(this.initialPoint, this.children[i].initialPoint);
			this.finalPoint = greaterPoint(this.finalPoint, this.children[i].finalPoint);

			if(this.children[i].type === "wall"){
				object = createWallInView(this.children[i]);
			}
			else if(this.children[i].type === "door"){
				object = createDoorInView(this.children[i]);
			}
			else {
				object = createEmergencyExitInView(this.children[i]);
			}
			
		    this.path.add(object);
		};

		this.path.closed = true;
		this.path.fillColor = 'green';
		console.log(this);
	}

	var createWallInView = function (object){
		
		var wall = new Path();
	    wall.strokeColor = 'black';
	    wall.add(new Point(object.initialPoint.x*ratio, object.initialPoint.y*ratio));
	    wall.add(new Point(object.finalPoint.x*ratio, object.finalPoint.y*ratio));

	    return wall;
	}

	//It's create an emergencyExit in view:
	var createEmergencyExitInView = function (object){
		
		var emergencyExit = new Path.Rectangle({
			topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
			bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
			strokeColor: 'green',
			fillColor: 'green'
		});

	    return emergencyExit;
	}

	//It's create an Door in view:
	var createDoorInView = function (object){
	    
	    var door = new Path.Rectangle({
	        topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
	        bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
	        strokeColor: 'red',
	        fillColor: 'red'
	    });

	    return door;    
	}

	this.path.onMouseDown = function(event){
		console.log(this.name);
	};

	var greaterPoint = function(pointA, pointB){
		return Point.max(pointA, pointB);
	}

	var lowerPoint = function(pointA, pointB){
		return Point.min(pointA, pointB);
	}
};
