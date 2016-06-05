var VISEM = VISEM || {};

VISEM.Main = (function() {

	paper.install(window);
	var canvas = document.getElementById('visemCanvas');
	var canvasWrapper = document.getElementById('wrapper');
	paper.setup(canvas);
	var plantFile = "/static/jsons/gsortPlant.json";
	var peopleFile = "/static/jsons/people3.json";
	var plant = new VISEM.Plant();
	var people = new Array();

	//Heatmap instance
	var heatInstance = h337.create({container: canvasWrapper});

	window.onload = function() {
		draw();
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

		heatInstance.setData(dataPoints);
		console.log(heatInstance);
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

})();