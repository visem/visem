var VISEM = VISEM || {};

VISEM.Room = function(name, type, totalWidth, totalHeight, children, ratio){
	this.path = new Path();
	this.name = name;
	this.type = room;
	this.totalWidth = ;
	this.totalHeight = ;
	this.children = children;
	this.ratio = ratio;

	this.draw = function() {
		for (var i = this.children.length - 1; i >= 0; i--) {
			
			var object = new Path();

			if(this.children[i].type === "room"){
				object = createDoorInView(this.children[i]);
			}
			else if(this.children[i].type === "door"){
				object = createDoorInView(this.children[i]);
			}
			else {
				object = createEmergencyExitInView(this.children[i]);	
			}
			
		    this.path.add(object);
		};
	}

	var createDoorInView = function (object){
		
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
};
