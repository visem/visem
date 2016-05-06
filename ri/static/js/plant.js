var VISEM = VISEM || {} ;

VISEM.Plant = function (name, type, width, height, children) {
	this.path = new Path();
	this.name = name;
	this.type = type;
	this.width = width;
	this.height = height;
	this.rooms = new Array();
	this.ratio;
	this.largerSide;
	this.diagonal;
    this.clearance  = 5;
    this.children = children;
};

VISEM.Plant.prototype.init = function(canvasWrapper, canvas) {

    this.width = canvasWrapper.clientWidth - this.clearance;
    this.largerSide = diagonal(this.width, this.height);
    this.ratio = getRatio(this.width, largerSide);


    for (var i = 0; i < this.children.length; i++) {
       var room = new VISEM.Room(
            this.children.name,
            this.children.type,
            this.children.totalWidth,
            this.children.totalHeight,
            this.children.children,
            this.ratio
        );

       this.addRoom(room);
    };
};

VISEM.Plant.prototype.draw = function() {
    this.rooms.draw();
};

VISEM.Plant.prototype.getRatio = function(canvasWidth, largerSide) {
    return canvasWidth / largerSide;
};

VISEM.Plant.prototype.diagonal = function (width, height){
    var diagonal = Math.pow(width,2) + Math.pow(height,2); 
    return Math.sqrt(diagonal);
};

VISEM.Plant.prototype.addRoom = function(room) {
	this.rooms.push(room);
};