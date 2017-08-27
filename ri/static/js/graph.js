var VISEM = VISEM || {};

VISEM.Graph = function (name){
	this.path = Array();
	this.circleInitial;
	this.name = name;
	this.vertices = new Array();
	this.edges = new Array();
	this.distances = new Array();
	this.predecessors = new Array();
	this.paths = "";
	this.initialSource;
	this.shortestPath;
	this.matrix = new Array();
	this.dist = new Array();
	this.next = new Array();
	this.routes = new Array();
	this.type;
	this.BELLMAN_FORD = 1;
	this.FLOYD_WARSHALL = 2;
	this.BELLMAN_FORD_ALL_PATH = 3;
	this.HIGH_FLOW = 15;
	this.MEDIUM_FLOW = 10;
	this.LOW_FLOW = 5;
	this.rasters = new Array();
	this.newRoutes = new Array();
	this.newRoutesFW = new Array();
	this.newWeightRoutes = new Array();
	this.newBlockedRoutes = new Array();
	this.newBlockedRoutesFW = new Array();
	this.newWeightRoutesFW = new Array();
	this.flowAllRoutes = new Array();
	this.globalOut = new Array();
	this.blockedVertex = new Array();
	this.blockedRaster = new Array();
	this.caminhos = new Array();
	this.zoom = 0;
	this.initialSourceEvent;
};

VISEM.Graph.prototype.addVertex = function(vertex) {
	this.vertices.push(vertex);
};

VISEM.Graph.prototype.newPath = function() {
	this.path.push(new Path());
	return this.path.length - 1;
};

VISEM.Graph.prototype.removePath = function() {
	for(var i = 0; i < this.path.length; i++){
		this.path[i].removeSegments();
	}

	if(this.circleInitial != null){
		this.circleInitial.removeSegments();
	};
	
	return this.path.length - 1;
};

VISEM.Graph.prototype.getIndexOfMin = function(arr) {
    if (arr.length === 0) {
        return -1;
    };

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        };
    };

    return minIndex;
};

VISEM.Graph.prototype.getIndexOfMax = function(arr) {
    if (arr.length === 0) {
        return -1;
    };

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        };
    };

    return maxIndex;
};

VISEM.Graph.prototype.getIndexOfMinNotBlocked = function(arr) {
   
	if (arr.length === 0) {
        return -1;
   	};

   	var countBlocked = 0;

   	for(var i = 0; i < arr.length; i++){
   		if(this.newBlockedRoutes[i] === -1){
   			countBlocked = countBlocked + 1;
   		};
   	};

   	if(countBlocked === arr.length){
   		return -1;
   	};

   	if(arr.length === 1 && this.newBlockedRoutes[0] === -1){
   		return -1;
   	};

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if ((arr[i] < min && this.newBlockedRoutes[i] != -1) 
        	|| (minIndex === 0 && this.newBlockedRoutes[minIndex] === -1)) {
            minIndex = i;
            min = arr[i];
        };
    };

    return minIndex;
};

VISEM.Graph.prototype.getIndexOfMaxNotBlocked = function(arr) {
    if (arr.length === 0) {
        return -1;
    };

   	var countBlocked = 0;

   	for(var i = 0; i < arr.length; i++){
   		if(this.newBlockedRoutes[i] === -1){
   			countBlocked = countBlocked + 1;
   		};
   	};

   	if(countBlocked === arr.length){
   		return -1;
   	};

   	if(arr.length === 1 && this.newBlockedRoutes[0] === -1){
   		return -1;
   	};

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if ((arr[i] > max && this.newBlockedRoutes[i] != -1) 
        	|| (maxIndex === 0 && this.newBlockedRoutes[maxIndex] === -1)) {
            maxIndex = i;
            max = arr[i];
        };
    };

    return maxIndex;
};

VISEM.Graph.prototype.getVertex = function(codigo) {
	for (var i = 0; i < this.vertices.length; i++) {
		if(this.vertices[i].codigo === codigo){
			return this.vertices[i];
		};
	};
};

VISEM.Graph.prototype.getIndexOfVertex = function(codigo) {
	for (var i = 0; i < this.vertices.length; i++) {
		if(this.vertices[i].codigo === codigo){
			return i;
		}
	};
};

VISEM.Graph.prototype.addEdge = function(edge) {
	this.edges.push(edge);
};

VISEM.Graph.prototype.addInitialSource = function(codigo) {
	this.initialSource = this.getVertex(codigo);
};

VISEM.Graph.prototype.removeLastVertexInitial = function(){
	newVertices = new Array();

	if(this.initialSource != null){
		for(var i = 0; i < this.vertices.length; i++){
			if(this.vertices[i].codigo != this.initialSource){
				newVertices.push(this.vertices[i]);
			};
		};
		
		this.vertices = new Array();
		this.vertices = newVertices;
	};
};

VISEM.Graph.prototype.removeLastEdgesInitial = function(){
	newEdges = new Array();

	if(this.initialSource != null){
		for(var i = 0; i < this.edges.length; i++){
			if(this.edges[i].source != this.initialSource){
				newEdges.push(this.edges[i]);
			};
		};
		
		this.edges = new Array();
		this.edges = newEdges;
	};
};

VISEM.Graph.prototype.runBellmanFord = function(){

	//Initialize
	for (var i = 0; i < this.vertices.length; i++) {
		this.distances[i] = Number.MAX_VALUE;
		this.predecessors[i] = -1;
	};

	this.distances[this.initialSource] = 0;

	//relax
	for (var i = 1; i <= this.vertices.length - 1; i++) {
		for (var j = 0; j < this.edges.length; j++) {
			s = this.edges[j].source;
			w = this.edges[j].weight;
			d = this.edges[j].distance;

			if(this.distances[s] != Number.MAX_VALUE && (this.distances[s] + w) < this.distances[d]){
				this.distances[d] = this.distances[s] + w;
				this.predecessors[d] = s;
			};
		};
	};

	// negative-weight cycle check
	for (var i = 0; i < this.edges.length; i++) {
		if((this.distances[this.edges[i].source] + this.edges[i].weight) < this.distances[this.edges[i].distance]){
			return "The graph contains a negative-weight cycle";
		};
	};
};

VISEM.Graph.prototype.createFlows = function(rooms, people, penaltTable){

	for (var i = 0; i < rooms.length; i++) {
		for (var j = 0; j < rooms[i].children.length; j++) {
			if(rooms[i].children[j].type === "door"){
				for (var k = 0; k < this.vertices.length; k++) {
					if(rooms[i].children[j].codigo == this.vertices[k].codigo){
						this.vertices[k].penalty = 0;
						var penalty = 0;

						for (var l = 0; l < people.length; l++) {
							var point = new Point(people[l].positionX, people[l].positionY);

							if (rooms[i].isInside(point)) {
							    
							    if(people[l].age < 12){
							        if(people[l].stationary === true){		
										penalty = penalty + penaltTable[0][0];
									}else{		
										penalty = penalty + penaltTable[1][0];
									};

								    if(people[l].hasDisability()){		
								        penalty = penalty + penaltTable[2][0];      
								    }else{
								    	penalty = penalty + penaltTable[3][0];
								    };
							    };

							    if(12 < people[l].age && people[l].age < 18){
							        if(people[l].stationary === true){		
										penalty = penalty + penaltTable[0][1];
									}else{		
										penalty = penalty + penaltTable[1][1];
									};

								    if(people[l].hasDisability()){		
								        penalty = penalty + penaltTable[2][1];      
								    }else{
								    	penalty = penalty + penaltTable[3][1];
								    };    
							    };
							    
							    if(18 < people[l].age && people[l].age < 60){        
							     	if(people[l].stationary === true){		
										penalty = penalty + penaltTable[0][2];
									}else{		
										penalty = penalty + penaltTable[1][2];
									};

								    if(people[l].hasDisability()){		
								        penalty = penalty + penaltTable[2][2];      
								    }else{
								    	penalty = penalty + penaltTable[3][2];
								    };   
							    };
							    
							    if(people[l].age > 60){                
							    	if(people[l].stationary === true){		
										penalty = penalty + penaltTable[0][3];
									}else{		
										penalty = penalty + penaltTable[1][3];
									};

								    if(people[l].hasDisability()){		
								        penalty = penalty + penaltTable[2][3];      
								    }else{
								    	penalty = penalty + penaltTable[3][3];
								    };  
							    };
							};

							this.vertices[k].penalty = penalty / rooms[i].peopleCounter;
						};
					};
				};			
			};
		};
	};
};

VISEM.Graph.prototype.createRoutes = function(type){

	this.removePath();

	if(type == this.BELLMAN_FORD){

		//Path setup
		var pathIndex = this.newPath();

		this.path[pathIndex].strokeColor = '#0052cc';
		this.path[pathIndex].strokeWidth = 5;
		this.path[pathIndex].strokeJoin = 'bevel';
		
		this.path[pathIndex].simplify(); 
		
		this.path[pathIndex].shadowColor = new Color(0, 0, 0);
		this.path[pathIndex].shadowBlur = 12;
		this.path[pathIndex].shadowOffset = new Point(5, 5);
		
		// route
		var minPath = this.getIndexOfMinNotBlocked(this.newWeightRoutes);
		var route = this.newRoutes[minPath];
		
		route = route.reverse();

		var sourceInitial = this.getVertex(this.initialSource);

		var pathIndexInitial = this.newPath();
		this.path[pathIndexInitial].add(this.initialSourceEvent.point);
		this.path[pathIndexInitial].add(new Point(sourceInitial.centerPoint.x*sourceInitial.ratio,sourceInitial.centerPoint.y*sourceInitial.ratio));
		
		//point
		for(var i = 0; i < route.length; i++){
			if(i+1 < route.length){
				var source = this.getVertex(route[i]);
				var distance = this.getVertex(route[i+1]);

				this.path[pathIndex].add(new Point(source.centerPoint.x*source.ratio,source.centerPoint.y*source.ratio));
				this.path[pathIndex].add(new Point(distance.centerPoint.x*distance.ratio,distance.centerPoint.y*distance.ratio));
			};
		};
	}else if(type == this.FLOYD_WARSHALL){
		var pathIndex = new Array(); 

		for(var i = 0; i < this.caminhos.length; i++){
			pathIndex[i] = this.newPath();
			var route = this.caminhos[i];
			var routeBlocked = false;

			for(var k = 0; k < route.length; k++){
				if(this.isBlocked(route[k])){
					routeBlocked = true;
					this.newBlockedRoutesFW[i] = -1;
					break;
				}
			};
			
			if(!routeBlocked){
				this.newBlockedRoutes[i] = 0;
				for(var j = 0; j < route.length; j++){

					if(j+1 < route.length){
						var source = this.getVertex(route[j]);
						var distance = this.getVertex(route[j+1]);	

						this.path[i].add(new Point(source.centerPoint.x * source.ratio, source.centerPoint.y * source.ratio));
						this.path[i].add(new Point(distance.centerPoint.x * distance.ratio, distance.centerPoint.y * distance.ratio));					
					};
				};

				this.path[i].strokeColor = '#333333';	
				this.path[i].strokeWidth = 5;
				this.path[i].strokeJoin = 'bevel';
				
				this.path[i].shadowColor = new Color(0, 0, 0);
				this.path[i].shadowBlur = 12;
				this.path[i].shadowOffset = new Point(5, 5);
			};
		};
	}else if(type == this.BELLMAN_FORD_ALL_PATH){
		var pathIndex = new Array();
		
		for(var i = 0; i < this.newRoutes.length; i++){
			pathIndex[i] = this.newPath();
			var route = this.newRoutes[i];
			var routeBlocked = false;

			route = route.reverse();

		
			for(var k = 0; k < route.length; k++){
				if(this.isBlocked(route[k])){
					routeBlocked = true;
					this.newBlockedRoutes[i] = -1;
					break;
				}
			};


			if(!routeBlocked){
				this.newBlockedRoutes[i] = 0;

				for(var j = 0; j < route.length; j++){

					if(j+1 < route.length){
						var source = this.getVertex(route[j]);
						var distance = this.getVertex(route[j+1]);	

						this.path[i].add(new Point(source.centerPoint.x * source.ratio, source.centerPoint.y * source.ratio));
						this.path[i].add(new Point(distance.centerPoint.x * distance.ratio, distance.centerPoint.y * distance.ratio));					
					};
				};
			
				var minPath = this.getIndexOfMinNotBlocked(this.newWeightRoutes);
				var maxPath = this.getIndexOfMaxNotBlocked(this.newWeightRoutes);

				
				if(minPath === -1 || maxPath === -1){
					return;
				};

				if(this.newWeightRoutes[i] <= this.newWeightRoutes[minPath]){
					this.path[i].strokeColor = '#0052cc';
					this.path[i].data.route = 'great';
				}else if(this.newWeightRoutes[i] >= this.newWeightRoutes[maxPath]){
					this.path[i].strokeColor = '#ff0000';
					this.path[i].data.route = 'bad';	
				}else{
					this.path[i].strokeColor = '#ffff00';
					this.path[i].data.route = 'good';	
				};

				var minFlow = this.getIndexOfMinNotBlocked(this.flowAllRoutes);
				var maxFlow = this.getIndexOfMaxNotBlocked(this.flowAllRoutes);

				if(minFlow === -1 || maxFlow === -1){
					return;
				};

				if(this.flowAllRoutes[i] <= this.flowAllRoutes[minFlow]){
					this.path[i].strokeWidth = this.LOW_FLOW;
				}else if(this.flowAllRoutes[i] >= this.flowAllRoutes[maxFlow]){
					this.path[i].strokeWidth = this.HIGH_FLOW;
				}else{
					this.path[i].strokeWidth = this.MEDIUM_FLOW;
				};

				this.path[i].strokeJoin = 'bevel';
				this.path[i].shadowColor = new Color(0, 0, 0);
				this.path[i].shadowBlur = 12;
				this.path[i].shadowOffset = new Point(5, 5);
			};

			for(var t = 0; t < pathIndex.length; t++){
				if(this.path[i].data.route == 'great'){
					this.path[i].insertAbove(this.path[pathIndex[t]]);
				}
			};
		};
			this.path.closed = true;
	};

	if(type != this.FLOYD_WARSHALL && !this.isAllRoutesBFBlocked()){		
		var vtxInitial = this.getVertex(this.initialSource);
		
		if(vtxInitial != null){
			this.circleInitial = new Path.Circle(new Point(vtxInitial.centerPoint.x * vtxInitial.ratio, 
				vtxInitial.centerPoint.y * vtxInitial.ratio), 10);

			this.circleInitial.style = {
	    		fillColor: '#ffffff',
	    		strokeColor: 'black',
	    		strokeWidth: 2
			};
		};
	};
};


VISEM.Graph.prototype.isAllRoutesBFBlocked = function(){
	for(var i = 0; i < this.newBlockedRoutes.length; i++){
		if(this.newBlockedRoutes[i] === 0){
			return false;
		};
	};

	return true;
};

var greaterPoint = function(pointA, pointB){
	return Point.max(pointA, pointB);
}

var lowerPoint = function(pointA, pointB){
	return Point.min(pointA, pointB);
}

VISEM.Graph.prototype.printVertices = function(){
	var pv = "";
	
	for (var i = 0; i < this.vertices.length; i++) {
		if(pv.length != 0){
			pv = pv + " , ";	
		};

		pv = pv + this.vertices[i].codigo;	
	};

	return pv;
};

VISEM.Graph.prototype.printEdges = function(){
	var pe = ""; 
	
	for (var i = 0; i < this.edges.length; i++) {
		if(pe.length != 0){
			pe = pe + " , ";	
		};

		pe = pe + this.edges[i].source + " -> " + this.edges[i].distance + " [Peso: " + this.edges[i].weight + "]";
	};

	return pe;
};

VISEM.Graph.prototype.hasGlobalOut = function(out){
	for (var i = 0; i < this.globalOut.length; i++) {
		if(this.globalOut[i] == out){
			return true;
		};
	};

	return false;
};


VISEM.Graph.prototype.hasGlobalOutRoute = function(route){
	
	for (var i = 0; i < route.length; i++) {
		if(this.hasGlobalOut(route[i])){
			return true;
		};
	};

	return false;
};

VISEM.Graph.prototype.hasInitialSource = function(source){

	if(source == this.initialSource){
		return true;
	}else{
		return false;		
	}
};

VISEM.Graph.prototype.hasInitialSourceRoute = function(route){
	
	for (var i = 0; i < route.length; i++) {
		if(this.hasInitialSource(route[i])){
			return true;
		};
	};

	return false;
};

VISEM.Graph.prototype.printPathBF = function(){
	var nextRoute = 0;

	for(var i = 0; i < this.predecessors.length; i++){
		if(this.predecessors[i] != -1 && this.hasGlobalOut(i)){
			nextRouteString =  i + ";" ;
			nextRouteString = nextRouteString + this.recusivePath(this.predecessors[i]);
				
			newpath = nextRouteString.split(";");

			for(var j = 0; j < newpath.length; j++) {
				newpath[j] = +newpath[j]; 
			}; 

			this.newRoutes[nextRoute] = newpath;
			this.calcWeightRouteBF(this.newRoutes[nextRoute], nextRoute);
			this.calcFlowRouteBF(this.newRoutes[nextRoute], nextRoute);

			nextRoute = nextRoute + 1;
		};
	};
};

VISEM.Graph.prototype.printPathFW2 = function(){
	var nextRouteX = 0;
	var nextRouteY = 0;

    for (var i = 0; i < this.next.length; i++) {
        this.newRoutesFW[nextRouteX] = new Array();
        nextRouteY = 0;
        for (var j = 0; j < this.next.length; j++) {
	        if (this.next[i][j] != -1) {
	        	this.newRoutesFW[nextRouteX][nextRouteY] = this.next[i][j];
	        	nextRouteY = nextRouteY + 1;
	        };
        };

        this.calcWeightRouteFW(this.newRoutesFW[nextRouteX], nextRouteX);
        nextRouteX = nextRouteX + 1;
    };
};

VISEM.Graph.prototype.recusivePath = function(next){
	return next == this.initialSource ? this.initialSource : next + ";"  + this.recusivePath(this.predecessors[next]);
};

VISEM.Graph.prototype.calcWeightRouteBF = function(route, index){
	var countDistanceRoute = 0;
	
	for(var i = 0; i < route.length; i++){
		countDistanceRoute = countDistanceRoute + this.distances[route[i]];
	};

	this.newWeightRoutes[index] = countDistanceRoute;
	this.newBlockedRoutes[index] = 0;
};

VISEM.Graph.prototype.calcFlowRouteBF = function(route, index){
	var countPenaltyRoute = 0;
	
	for(var i = 0; i < route.length; i++){
		var vtx = this.getVertex(route[i]);

		countPenaltyRoute = countPenaltyRoute + vtx.penalty;
	};

	this.flowAllRoutes[index] = countPenaltyRoute;
};

VISEM.Graph.prototype.printPredecessors = function(){
    var tp = "";
    
    for (var i = 0; i < this.predecessors.length; i++){
		if(tp.length != 0){
			tp = tp + " , ";
		};
       
       tp = tp + this.predecessors[i];
    };

    return tp;
};

VISEM.Graph.prototype.printDistances = function(){
    var td = "";
    
    for (var i = 0; i < this.distances.length; i++){
       	if(td.length != 0){
			td = td + " , ";
		};

       td = td + "V" + i + " => " + this.distances[i];
    };

    return td;
};

VISEM.Graph.prototype.runFloydWarshall = function(){

	var log = "";

	for (var i = 0; i < this.edges.length; i++) {
		this.matrix[i] = new Array(this.edges[i].source, this.edges[i].distance, this.edges[i].weight);
	};

	/*log += "Matrix";
	log += this.printMatrix();
	log += "\n";*/

	for (var i = 0; i < this.vertices.length; i++) {
		this.dist[i] = new Array(this.vertices.length);
		this.next[i] = new Array(this.vertices.length);
	};
	
	/*log += "distances";
	log += this.printDistM();
	log += "\n";

	log += "Next";
	log += this.printNext();
	log += "\n";*/

	for (var i = 0; i < this.vertices.length; i++) {
		for (var j = 0; j < this.vertices.length; j++) {
			
			if(i == j){
				this.dist[i][j] = 0;	
			}else{
				this.dist[i][j] = Number.MAX_VALUE;
			}

			this.next[i][j] = 0;
		};
	};

	/*log += "distances inicializadas";
	log += this.printDistM();
	log += "\n";

	log += "Next inicializadas";
	log += this.printNext();
	log += "\n";*/

	for (var i = 0; i < this.matrix.length; i++) {
		this.dist[this.matrix[i][0]][this.matrix[i][1]] = this.matrix[i][2];
	};

	/*log += "distances com valores ";
	log += this.printDistM();
	log += "\n";*/

	for (var i = 0; i < this.vertices.length; i++) {
		for (var j = 0; j < this.vertices.length; j++) {
			if (this.dist[i][j] == Number.MAX_VALUE){
				this.next[i][j] = -1;	
			}else{
		 		this.next[i][j] = j;
			};
		};
	};

	/*log += "Next com valores";
	log += this.printNext();
	log += "\n";*/
 
    for (var k = 0; k < this.vertices.length; k++){
    	for (var i = 0; i < this.vertices.length; i++){
  			for (var j = 0; j < this.vertices.length; j++){
  				if (this.dist[i][k] != Number.MAX_VALUE && this.dist[k][j] != Number.MAX_VALUE){
	                if ((this.dist[i][k] + this.dist[k][j] < this.dist[i][j])) {
	                    this.dist[i][j] = this.dist[i][k] + this.dist[k][j];
	                    this.next[i][j] = this.next[k][j];
	                }; 					
  				};
  			};
    	};
    };

    /*log += "distances final";
	log += this.printDistM();
	log += "\n";

	log += "Next final";
	log += this.printNext();
	log += "\n";*/

	return log;
};

VISEM.Graph.prototype.printMatrix = function(){
	var pm = "\n";

	for (var i = 0; i < this.matrix.length; i++) {
		pm = pm + "[";

		for (var j = 0; j < this.matrix[i].length; j++) {
			if(j != 0){
				pm = pm + " , ";	
			};

			pm = pm + this.matrix[i][j]; 
		};
		
		pm = pm + "] \n";
	};

	return pm;
};

VISEM.Graph.prototype.printPathFW = function(){
	var pfw = "\n";

    for (var i = 0; i < this.next.length; i++) {
        this.newRoutesFW[i] = new Array();
        for (var j = 0; j < this.next.length; j++) {
	        if (this.next[i][j] != -1) {	        	
	        	pfw = pfw + this.next[i][j];
	        	pfw = pfw + " <- ";	
	        	this.newRoutesFW[i][j] = this.next[i][j];
	        };
        };
        this.calcWeightRouteFW(this.newRoutesFW[i], i);
        pfw = pfw + "\n";
    };

	return pfw;
};

VISEM.Graph.prototype.calcWeightRouteFW = function(route, index){
	var countDistanceRoute = 0;
	
	for(var j = 0; j < route.length; j++){
		countDistanceRoute = countDistanceRoute + this.dist[index][route[j]];
	};

	this.newWeightRoutesFW[index] = countDistanceRoute;
	this.newBlockedRoutesFW[index] = 0;
};

VISEM.Graph.prototype.getPathFW = function(){
	var allPath = new Array();

    for (var i = 0; i < this.next.length; i++) {
    	allPath.push(new Array());
        for (var j = this.next[i].length -1; j >= 0; j--) {
	        if (this.next[i][j] != -1) {	        	
	        	allPath[i].push(this.next[i][j]);
	        };
        };
    };

	return allPath;
};

VISEM.Graph.prototype.printDist = function(){
	var pd = "";

    for (var i = 0; i < this.next.length; i++) {
        for (var j = 0; j < this.next.length; j++) {
            if (i != j) {
                pd = pd + "V" + i + j + " = " + this.dist[i][j] + " ";
            };
        };
    };

	return pd;
};

VISEM.Graph.prototype.printDistM = function(){
	var pn = "\n";

	for (var i = 0; i < this.dist.length; i++) {
	
		pn = pn + "["
	
		for (var j = 0; j < this.dist[i].length; j++) {
			if(j != 0){
				pn = pn + " , ";	
			};

			pn = pn + this.dist[i][j]; 
		};

		pn = pn + "] \n";
	};

	return pn;
};

VISEM.Graph.prototype.printNext = function(){
	var pn = "\n";

	for (var i = 0; i < this.next.length; i++) {
	
		pn = pn + "["
	
		for (var j = 0; j < this.next[i].length; j++) {
			if(j != 0){
				pn = pn + " , ";	
			};

			pn = pn + this.next[i][j]; 
		};

		pn = pn + "] \n";
	};

	return pn;
};

VISEM.Graph.prototype.reorganizePath = function(vtx){
	this.createRoutes(this.zoom);
};

VISEM.Graph.prototype.hasEdge = function(s, d){
	for (var i= 0; i < this.edges.length; i++) {
		if((this.edges[i].source == s) && (this.edges[i].distance == d)){
			return true;
		};
	};

	return false;
};

VISEM.Graph.prototype.printPathFW3 = function(){
	var nextRouteX = 0;
	for (var i = 0; i < this.next.length; i++) {	
		for (var j = 0; j < this.next.length; j++) {
			if(this.next[i][j] != -1 && this.next[i][j] != i){
				if(this.hasEdge(i, this.next[i][j])){
					this.caminhos[nextRouteX] = new Array();
					this.caminhos[nextRouteX][0] = i;
					this.caminhos[nextRouteX][1] = this.next[i][j];
					nextRouteX = nextRouteX + 1;
				};
			};
		};
	};
};

VISEM.Graph.prototype.unit = function(){
	this.path = new Array();
	this.distances = new Array();
	this.predecessors = new Array();
	this.matrix = new Array();
	this.dist = new Array();
	this.next = new Array();
	this.newRoutes = new Array();
	this.newRoutesFW = new Array();
	this.newWeightRoutes = new Array();
	this.newBlockedRoutes = new Array();
	this.newBlockedRoutesFW = new Array();
	this.newWeightRoutesFW = new Array();
	this.flowAllRoutes = new Array();
	this.globalOut = new Array();
	this.blockedVertex = new Array();
};

VISEM.Graph.prototype.isBlocked = function(vtx){
	for(var i = 0; i < this.blockedVertex.length; i++){
		if(this.blockedVertex[i] === vtx){
			return true;
		};
	};

	return false;
};

VISEM.Graph.prototype.unlock = function(vtx){
	var newBlockedVertex = new Array();
	
	for(var i = 0; i < this.blockedVertex.length; i++){
		if(this.blockedVertex[i] != vtx){
			newBlockedVertex.push(this.blockedVertex[i]);
		};
	};

	this.blockedVertex = new Array();
	this.blockedVertex = newBlockedVertex;

	for(var i = 0; i < this.blockedRaster.length; i++){
		if(this.blockedRaster[i].name === vtx){
			this.blockedRaster[i].visible = false;
		};
	};
};

VISEM.Graph.prototype.lock = function(vtx){

	for(var i = 0; i < this.blockedRaster.length; i++){
		if(this.blockedRaster[i].name === vtx){
			this.blockedRaster[i].visible = true;
			return this.blockedRaster[i];
		};
	};
	return null;
};