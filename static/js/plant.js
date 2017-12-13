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
    this.clearance  = 20;
    this.children = children;

    this.graph = new VISEM.Graph(this.name);

    this.areas = new Array();

};

VISEM.Plant.prototype.init = function(canvasWrapper) {
    var menu = document.getElementById("menubar");
    var canvasWidth = canvasWrapper.clientWidth - this.clearance;
    var canvasHeight = canvasWrapper.clientHeight - this.clearance/* - menu.clientHeight*/;
    this.largerSide = this.diagonal(this.width, this.height);
//     this.ratio = this.getRatio(canvasWidth, this.largerSide);
    var canvasLargerSide = this.diagonal(canvasWidth, canvasHeight);
    this.ratio = this.getRatio(canvasWidth, this.largerSide);
    console.log("Ratio>", this.ratio);

    for (var i = 0; i < this.children.length; i++) {
       var room = new VISEM.Room(
            this.children[i].name,
            this.children[i].type,
            this.children[i].totalWidth,
            this.children[i].totalHeight,
            this.children[i].children,
            this.ratio
        );

       this.addRoom(room);
    };

    //Initialize the Graph with your vertices and edges.
    for (var i = 0; i < this.rooms.length; i++) {
        var tempChildren = this.rooms[i].children;
        var route;
        for (var j = 0; j < tempChildren.length; j++) {
            if(tempChildren[j].type === "door"){
                
                for (var k = 0; k < tempChildren[j].relativePaths.length; k++) {
                    var edge = new VISEM.Edge(k, tempChildren[j].codigo, tempChildren[j].relativePaths[k].distance,
                                              tempChildren[j].relativePaths[k].weight);
                    this.graph.addEdge(edge);    
                };
                
                var initialPoint = new Point(tempChildren[j].initialPoint.x, tempChildren[j].initialPoint.y);
                var finalPoint = new Point(tempChildren[j].finalPoint.x, tempChildren[j].finalPoint.y);

                var centerPoint = new Point((initialPoint.x + finalPoint.x) / 2, (initialPoint.y + finalPoint.y) / 2);

                var vertex = new VISEM.Vertex(tempChildren[j].codigo, centerPoint, this.ratio, this.rooms[i].idRoom);
                
                this.graph.addVertex(vertex);
            };
        };
    };
};

VISEM.Plant.prototype.draw = function() {
    for (var i = 0; i < this.rooms.length; i++) {
        this.rooms[i].draw();
    };
    paper.project.view.update();
};

VISEM.Plant.prototype.getRatio = function(canvasWidth, largerSide) {
    return canvasWidth / largerSide;
};

VISEM.Plant.prototype.diagonal = function (width, height){
    return Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
};

VISEM.Plant.prototype.addRoom = function(room) {
    this.rooms.push(room);
};

VISEM.Plant.prototype.isInsideDoor = function(point){
    
    for (var i = 0; i < this.rooms.length; i++) {
        var codigoAux = this.rooms[i].isInsideDoor2(point);

        if(codigoAux != -1){
            return codigoAux;
        };
    };

    return -1;
};

