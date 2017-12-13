var VISEM = VISEM || {};

VISEM.Main = (function() {
    
    var self = this;
    paper.install(window);
    var canvas = document.getElementById('visemCanvas');
    var canvasWrapper = document.getElementById('wrapper');
    paper.setup(canvas);
    var plantFile = "/static/jsons/gsortPlantWithRoutesConf.json";

    var peopleFile = "/static/jsons/people3.json";

    var sliceLayer;
    var peopleLayer;
    var plantLayer;
    var sliceFile = "/visem/slice/json/";

    var plant = new VISEM.Plant();
    var people = new Array();

    var slices = new Array();
    var heatInstance = new VISEM.Heatmap(canvasWrapper);

    var slice_hor_counter = 0;
    var slice_ver_counter = 0;
    
    var heatmap_check = document.getElementById("heatmap-check");
    var slice_check = document.getElementById("slice-check");
    var route_check = document.getElementById("route-check");
    heatmap_check.checked = true;
    
    heatmap_check.addEventListener("change", makeChange);
    slice_check.addEventListener("change", makeChange);
    route_check.addEventListener("change", makeChange);
    
    var tool = new paper.Tool();
    

	window.onload = function() {
        getResource("GET", plantFile, initPlant);
        plant.init(canvas);
        heatInstance.setRatio(plant.ratio);
        getResource("GET", peopleFile, initPeople);
        getResource("GET", sliceFile, initSlice);
        draw();
        countPeople(plant.rooms, people);
        initRoute();

	};

    this.draw = function(event) {
        plantLayer = project.activeLayer;
        plant.draw();

        peopleLayer = new Layer();
        for (var i = 0; i < people.length; i++) {
            people[i].draw();
        }
        
        peopleLayer.visible = false;
        
        initAreas();
        console.log(canvasWrapper.clientHeight);
        
        var vcounter = slice_ver_counter;
        var hcounter = slice_hor_counter;
        sliceLayer = new Layer();
        console.log("Slice Layer",sliceLayer);
        
        for (var i = 0; i < slices.length; i++) {
            if(slices[i].type == "horizontal"){
                slices[i].init(canvasWrapper ,(canvasWrapper.clientHeight / (slice_hor_counter+1)) * hcounter+1);
                hcounter--;
            }
            else{
                slices[i].init(canvasWrapper, (canvasWrapper.clientWidth / (slice_ver_counter+1)) * vcounter+1);
                vcounter--;
            }
        }
        
        sliceLayer.visible = false;
        $("#slicewrapper").children().prop('disabled',true);
        countPeople(plant.rooms, people);
        countPeople(plant.areas, people);
        
        heatInstance.setMax(people.length);
        heatInstance.init(plant.rooms);

        var newLayer = new Layer();
        paper.project.view.update();
    };

    var initPlant = function(data) {
        if (data.type === "building") {
            plant = new VISEM.Plant(data.name, data.type, data.totalWidth, data.totalHeight, data.children);
        };
    };

    var initPeople = function(data) {
        for (var i = 0; i < data.length; i++) {
            people.push(new VISEM.Person(data[i].idPerson, data[i].positionX, data[i].positionY,
                                         data[i].age, data[i].stationary, data[i].disability, plant.ratio)); 
        };
    };

    var initSlice = function(data){
        var s =  data.slices;
        
        for (var i = 0; i < s.length; i++) {
            slices.push(new VISEM.Slice(s[i].slice_id, s[i].slice_type, s[i].slice_position));
            if(s[i].slice_type == "horizontal")
                slice_hor_counter++;
            else
                slice_ver_counter++;
        }
    };

    function countPeople(area, people) {
        for (var i = 0; i < area.length; i++) {
            var counter = 0;
            for (var j = 0; j < people.length; j++) {

                var point = new Point(people[j].positionX, people[j].positionY);
                
                if (isInside(point, area[i])) {
                    counter++;
                }
            }
            area[i].peopleCounter = counter;
        }
    }

    function initAreas(){
        var width = (canvas.clientWidth / (slice_ver_counter+1));
        var height = (canvas.clientHeight / (slice_hor_counter+1));
        
        for (var i = 0; i < (slice_hor_counter+1); i++) {
            for (var j = 0; j < (slice_ver_counter+1); j++){
                if(i==0 && j==0){
                    plant.areas.push({
                        peopleCounter: 0,
                        totalHeight: (height / plant.ratio),
                        totalWidth: (width / plant.ratio),
                        initialPoint: {x: i / plant.ratio, y: j / plant.ratio}, 
                        finalPoint: {x: width / plant.ratio, y: height / plant.ratio}
                    });
                }
                plant.areas.push({
                    peopleCounter: 0,
                    totalHeight: (height / plant.ratio),
                    totalWidth: (width / plant.ratio),
                    initialPoint: {x: (width * j) / plant.ratio, y: (height * i) / plant.ratio},
                    finalPoint: {x: (width * (j+1)) / plant.ratio, y: (height * (i+1)) / plant.ratio}
                });
            }
        }
        console.log(plant.areas);
    }

    function isInside(point, area){
        if (((point.x >= area.initialPoint.x) && (point.x <= area.finalPoint.x)) && 
            ((point.y >= area.initialPoint.y) && (point.y <= area.finalPoint.y)))
            return true;
        return false;
    }

    function euclideanDistance(a, b) {	
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
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
        
        /*
        *TODO Add Semantic Zoom event here
        * 
        * semanticZoom(event);
        */
        
        
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
                        var vertexCenter = new Point(vertexAux.centerPoint.x * vertexAux.ratio,
                                                     vertexAux.centerPoint.y * vertexAux.ratio);
                        
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

    function makeChange(event){
    	console.log(event);
    	var checkboxes = document.getElementsByName("checkboxes");
    	var heatcanvas = document.getElementsByClassName("heatmap-canvas")[0];
    	
    	console.log(checkboxes);
    	console.log(heatcanvas);
    	
    	if(event.target.id === "slice-check"){
    		
    		console.log("SLICE is now", event.target.checked);
    		callHeatInstance();
    	}
    	if(event.target.id === "heatmap-check"){
    		console.log("HEATMAP is now ", event.target.checked);
    		callHeatInstance();
    	}
    	if(event.target.id === "route-check"){
    		console.log("ROUTES is now", event.target.checked);
    	}
    }
    
    var callHeatInstance = function (argument) {
        console.log(heatInstance);
        var heatcanvas = document.getElementsByClassName("heatmap-canvas")[0];
        var div_slices = document.getElementById("slicewrapper");
        
        if(heatmap_check.checked === true && slice_check.checked === true){
            peopleLayer.visible = false;
            sliceLayer.visible = true;
            $("#slicewrapper").children().prop('disabled',false);
            paper.project.view.update();
            heatcanvas.style.display = "block";
            heatInstance.init(plant.areas);
            heatInstance.instance.repaint();
        } else if(heatmap_check.checked === true && slice_check.checked === false) {
            peopleLayer.visible = false;
            sliceLayer.visible = false;
            $("#slicewrapper").children().prop('disabled',true);
            paper.project.view.update();
            heatcanvas.style.display = "block";
            heatInstance.init(plant.rooms);
            heatInstance.instance.repaint();
        }
        
        if(heatmap_check.checked === false){
            heatcanvas.style.display = "none";
            sliceLayer.visible = false;
            peopleLayer.visible = true;
            paper.project.view.update();
        }
        
    }
    
    var semanticZoom = function (argument){
    
        var point = {
            x: argument.point.x / plant.ratio, 
            y: argument.point.y / plant.ratio
        }
        
        console.log("Ponto: ", argument.point, "Ponto em metros: ", point);
        
        if(slice_check.checked === true){
            console.log("True", argument.point);
            for (var i = plant.areas.length; i--; ) {
                if(isInside(point, plant.areas[i]))
                    console.log("Area: ", plant.areas[i], "Contains point: ", point);
            }
        }
        else{
            console.log("False", argument.point);
            for (var i = plant.rooms.length; i--; ) {
                if(isInside(point, plant.rooms[i]))
                    console.log("True Room: ", plant.rooms[i].name, "Contains point: ", point);
            }
        }
    }

})();
