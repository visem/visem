var VISEM = VISEM || {};

VISEM.Main = (function() {

	paper.install(window);
	var canvas = document.getElementById('visemCanvas');
	var canvasWrapper = document.getElementById('wrapper');
	paper.setup(canvas);
	var plantFile = "/static/jsons/gsortPlant.json";
	var number = Math.round(Math.random()*10);
	var peopleFile = "/static/jsons/people3.json";
	var plant = new VISEM.Plant();
	var people = new Array();
	// var slicer = new VISEM.Slicer("vertical", 300);
	// slicer.init();
//	console.log(slicer);
	//Heatmap instance
	var heatInstance = h337.create({container: canvasWrapper});

	window.onload = function() {
		draw();

		//countPeople(plant.rooms, people);
		
	};

	this.draw = function(event) {
		getResource("GET", plantFile, initPlant);
		
		plant.init(canvasWrapper);
		plant.draw();

		getResource("GET", peopleFile, initPeople);
		
		for (var i = 0; i < people.length; i++) {
			people[i].draw();
		};
		
		countPeople(plant.rooms, people);

		//getResource("GET", plantFile, initHeatMap);
		initHeatMap(plant);
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
		//console.log(data);
    	var dataPoints = {
			max: people.length * 100,
			min: 0,
			data: dataset
		};

		heatInstance.setData(dataPoints);
		console.log(heatInstance);
	};

	var prepareData = function(object){
		var preparedData = new Array();

		//console.log("Planta: ",object);
		/*
			[{ x: 0, y: 0, value 0	}];
		*/
		// debugger;
		// for(var i=0; i < object.length; i++){   
		// 	var point = {
		// 		x: object[i].positionX * Math.floor(plant.ratio), 
		// 		y: object[i].positionY * Math.floor(plant.ratio),
		// 		value:  Math.floor(Math.random()*100)
		// 	};	
		// 	preparedData.push(point);
	 //   }
		var number = object.children.length;
		var data = object.rooms;
		for (var i = 0; i < number; i++) {
			var pt = {
				x: Math.round(((data[i].totalWidth * data[i].totalHeight)/2) + data[i].initialPoint.x),
				y: Math.round(((data[i].totalWidth * data[i].totalHeight)/2) + data[i].initialPoint.y)
			};
			console.log(((data[i].totalWidth * data[i].totalHeight)/2)+ data[i].initialPoint.x);
			var point = {
		 	//   	x: Math.round(data[i].finalPoint.x) * Math.round(plant.ratio), 
				// y: Math.round(data[i].finalPoint.y) * Math.round(plant.ratio),
				x: pt.x * Math.round(plant.ratio), 
				y: pt.y * Math.round(plant.ratio),
				value: data[i].peopleCounter * 200
			};	
			console.log(point.x, point.y);
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
					//console.log("Sala: "+room[i].name+" Tem "+counter+" Pessoas.")
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

})();