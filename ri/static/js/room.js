var VISEM = VISEM || {};

VISEM.Room = function(name, type, totalWidth, totalHeight, children, ratio){
    this.path = new CompoundPath();
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
                
            this.path.insertChild(object);
        }

        this.path.closed = true;
        this.path.fillColor = 'red';
        console.log(this);
    };

    var createWallInView = function (object){
            
        var wall = new Path();
        wall.strokeColor = 'black';
        wall.add(new Point(object.initialPoint.x*ratio, object.initialPoint.y*ratio));
        wall.add(new Point(object.finalPoint.x*ratio, object.finalPoint.y*ratio));
        wall.style.strokeWidth = 3;
        return wall;
    }

    //It's create an emergencyExit in view:
    var createEmergencyExitInView = function (object){
            
            var emergencyExit = new Path.Rectangle({
                    topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
                    bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
                    strokeColor: 'green',
                    fillColor: 'green',
                    strokeWidth: 5
            });

        return emergencyExit;
    }

    //It's create an Door in view:
    var createDoorInView = function (object){
        
        var door = new Path.Rectangle({
            topLeft: [object.initialPoint.x*ratio, object.initialPoint.y*ratio],
            bottomRight: [object.finalPoint.x*ratio, object.finalPoint.y*ratio],
            strokeColor: 'red',
            fillColor: 'red',
            strokeWidth: 5
        });

        return door;    
    };

    this.path.onMouseDown = function(event){
            console.log(this.name);
    };

    var greaterPoint = function(pointA, pointB){
            return Point.max(pointA, pointB);
    };

    var lowerPoint = function(pointA, pointB){
            return Point.min(pointA, pointB);
<<<<<<< HEAD
    }

    VISEM.Room.prototype.isInside = function(point){
            if (((point.x >= this.initialPoint.x) && (point.x <= this.finalPoint.x)) && 
                ((point.y >= this.initialPoint.y) && (point.y <= this.finalPoint.y)))
                    return true;
            return false;
    };

    VISEM.Room.prototype.isInsideRatio = function(point){
            if (((point.x >= this.initialPoint.x*ratio) && (point.x <= this.finalPoint.x*ratio)) && 
                ((point.y >=this.initialPoint.y*ratio) && (point.y <= this.finalPoint.y*ratio)))
                    return true;
            return false;
    };

    VISEM.Room.prototype.isInsideDoor2 = function(point){
        for (var i = 0; i < this.children.length; i++) {
            if(this.children[i].type === "door"){

                var door = createDoorInView(this.children[i]);
                door.visible = false;
                
                if(door.contains(point)){
                    door.removeSegments();
                    return this.children[i].codigo;
                };    
            };
        };

        return -1;
    };

    VISEM.Room.prototype.getCloserDoor = function(point){
        var closerDoorNumber = null;
        var closerDoor = -1;

        for (var i = 0; i < this.children.length; i++) {
            if(this.children[i].type === "door"){
                var pointDoor = new Point(this.children[i].initialPoint.x*ratio, this.children[i].initialPoint.y*ratio);
                var dist = point.getDistance(pointDoor);
                if(closerDoorNumber === null || (dist < closerDoorNumber)){
                    closerDoorNumber = dist;
                    closerDoor = this.children[i].codigo;
                };    
            };
        };

        return closerDoor;
    };

    VISEM.Room.prototype.getDoors = function(){
        var doors = new Array();

        for (var i = 0; i < this.children.length; i++) {
            if(this.children[i].type === "door") {
                    doors.push(this.children[i]); 
            };
        };
        
        return doors;
    };
};

