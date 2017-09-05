var VISEM = VISEM || {};

VISEM.Main = (function() {

	paper.install(window);
	var canvas = document.getElementById('visemCanvas');
	var canvasWrapper = document.getElementById('wrapper');
	paper.setup(canvas);
	var plantFile = "/static/jsons/gsortPlantWithRoutesConf.json";
	var peopleFile = "/static/jsons/people3.json";
	var plant = new VISEM.Plant();
	var people = new Array();
	var tool = new paper.Tool();

	//Heatmap instance
	//var heatInstance = h337.create({container: canvasWrapper});

	window.onload = function() {
		draw();

		countPeople(plant.rooms, people);
		initRoute();
	};

	this.draw = function(event) {
		getResource("GET", plantFile, initPlant);
		

		plant.init(canvasWrapper);
		plant.draw();

		getResource("GET", peopleFile, initPeople);
		for (var i = 0; i < people.length; i++) {
			people[i].draw();
		};

		getResource("GET", peopleFile, initHeatMap);

		paper.project.view.update();
	};

	var initPlant = function(data){
		if (data.type === "building") {
			plant = new VISEM.Plant(data.name, data.type, data.totalWidth, data.totalHeight, data.children);
		};
	};

	var initPeople = function(data){
		for (var i = 0; i < data.length; i++) {
			people.push(new VISEM.Person(data[i].idPerson, data[i].positionX, data[i].positionY, data[i].age, data[i].stationary, data[i].disability, plant.ratio)); 
		};
	};

	var initHeatMap = function(data){
				
    	var dataset = prepareData(data);

    	var dataPoints = {
			max: 100,
			min: 0,
			data: dataset
		};

		//heatInstance.setData(dataPoints);
		//console.log(heatInstance);
	};

	var prepareData = function(object){
		var preparedData = new Array();

		/*
			[{ x: 0, y: 0, value 0	}];
		*/

		for(var i=0; i < object.length; i++){   
			var point = {
				x: object[i].positionX * Math.floor(plant.ratio), 
				y: object[i].positionY * Math.floor(plant.ratio),
				value:  Math.floor(Math.random()*100)
			};	
			preparedData.push(point);
	    }

		return preparedData;
	};

	function countPeople(room, people) {
		for (var i = 0; i < room.length; i++) {
			var counter = 0;
			for (var j = 0; j < people.length; j++) {

				var point = new Point(people[j].positionX, people[j].positionY);
				
				if (isInside(point,room[i])) {
					counter++;
					console.log("Sala: "+room[i].name+" Tem "+counter+" Pessoas.")
				};
			};
			room[i].peopleCounter = counter;
		};
	};

	function isInside(point, room){
		if (((point.x >= room.initialPoint.x) && (point.x <= room.finalPoint.x)) && ((point.y >= room.initialPoint.y) && (point.y <= room.finalPoint.y)))
			return true;
		return false;
	};

	function euclideanDistance(a, b) {	
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
	}

	function initRoute(){
		console.log("===================== Graph =====================");
		
		plant.graph.unit();
		plant.graph.initialSource = 4;
		console.log("The initial vertices is: " + plant.graph.initialSource + "\n");

		plant.graph.globalOut[0] = 0;
		plant.graph.globalOut[1] = 6;
		plant.graph.globalOut[2] = 7;

 		var penaltT = new Array();

 		penaltT[0] = new Array(0.3, 0.2, 0.2, 0.3);
 		penaltT[1] = new Array(0.2, 0.1, 0.1, 0.2);
 		penaltT[2] = new Array(0.4, 0.3, 0.3, 0.4);
 		penaltT[3] = new Array(0.0, 0.0, 0.0, 0.0);

 		plant.graph.createFlows(plant.rooms, people, penaltT);

		console.log("The global out are: " + plant.graph.globalOut + "\n");

		console.log("The vertices is: " + plant.graph.printVertices() + "\n");
		console.log("The edges is: " + plant.graph.printEdges() + "\n");

		console.log("Run Bellman Ford Algorithm " + "\n");
		plant.graph.runBellmanFord();

		plant.graph.printPathBF();

		console.log("The distances in the graph is: " + plant.graph.printDistances() + "\n");
		console.log("The shortestpath in the graph is: " + plant.graph.newRoutes + "\n");
		
		console.log("Run Floyd Warshall Algorithm " + "\n");
		console.log(plant.graph.runFloydWarshall());

		plant.graph.printPathFW3();
		
		console.log("The matrix in the graph is: " + plant.graph.printMatrix() + "\n");
		console.log("The matrix distances in the graph is: " + plant.graph.printDistM() + "\n");
		console.log("The matrix shortestpath in the graph is: " + plant.graph.printNext() + "\n");
		console.log("The all shortestpath in the graph is: " + plant.graph.newRoutesFW + "\n");

		console.log("===================== Graph =====================");
	};

	/*
	===================== Mouse Event =====================
	The mouse handler functions receive an event object which contains information about the mouse event. 
	*/

	paper.tool.onMouseDown = function (event){
		
		if(plant.graph.zoom == 0)
			return;
		
		if (event.event.detail > 1) {			

			if(plant.graph.zoom == plant.graph.BELLMAN_FORD
				|| plant.graph.zoom == plant.graph.BELLMAN_FORD_ALL_PATH){
				plant.graph.removeLastVertexInitial();	
				plant.graph.removeLastEdgesInitial();
			};

			for (var i = 0; i < plant.rooms.length; i++) {	
				if (plant.rooms[i].isInsideRatio(event.point, plant.rooms[i])) {
					var vtx = plant.rooms[i].getCloserDoor(event.point);
					var newVertexInitial = new VISEM.Vertex(plant.graph.vertices.length, event.point, 1, plant.rooms[i].idRoom);

					plant.graph.addVertex(newVertexInitial);

					var doors = plant.rooms[i].getDoors();

					for(var j = 0; j < doors.length; j++){			
						var edge = new VISEM.Edge(plant.graph.edges.length, newVertexInitial.codigo, doors[j].codigo, 1);
                    	plant.graph.addEdge(edge);	
					};

					if(vtx != -1){
						plant.graph.initialSource = newVertexInitial.codigo;
						plant.graph.initialSourceEvent = event; 
						plant.graph.runBellmanFord();
						plant.graph.printPathBF();
						plant.graph.createRoutes(plant.graph.BELLMAN_FORD_ALL_PATH);
						plant.graph.zoom = plant.graph.BELLMAN_FORD_ALL_PATH;
						paper.project.view.update();
					}else{
						alert("Não foi possível escolher a fonte!");
					}
				};
			};
			
		}else{

			if(plant.graph.circleInitial != null && plant.graph.circleInitial.contains(event.point)){
				plant.graph.createRoutes(plant.graph.BELLMAN_FORD);
				plant.graph.zoom = plant.graph.BELLMAN_FORD;
				return;
			};

			var vtx = plant.isInsideDoor(event.point);

			if(vtx != -1){
				
				if(plant.graph.isBlocked(vtx)){
					plant.graph.unlock(vtx);
				}else{
					var vertexAux = plant.graph.getVertex(vtx);

					var raster = plant.graph.lock(vtx);

					if(raster === null){
						var vertexCenter = new Point(vertexAux.centerPoint.x * vertexAux.ratio, vertexAux.centerPoint.y * vertexAux.ratio);
						
						raster = new Raster('block');
						raster.position = vertexCenter;
						raster.name = vtx;
						plant.graph.blockedRaster.push(raster);
					};

					plant.graph.blockedVertex.push(vtx);
				};

				plant.graph.reorganizePath(vtx);
			 };
		};
	};

	$( "#escape_route" ).click(function() {
		if(plant.graph.zoom == 0){
	  		plant.graph.zoom = plant.graph.FLOYD_WARSHALL;
	  		plant.graph.createRoutes(plant.graph.zoom);
		}else{
			plant.graph.zoom = 0;
			plant.graph.removePath();
		};
		paper.project.view.update();
	});

})();
