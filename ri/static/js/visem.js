var VISEM = VISEM || {};

VISEM.Main = (function() {

	paper.install(window);
	var canvas = document.getElementById('visemCanvas');
	var canvasWrapper = document.getElementById('wrapper');
	paper.setup(canvas);
	var plantFile = "/static/jsons/gsortPlant.json";
	var peopleFile = "/static/jsons/gsortPlant.json";
	var plant = new VISEM.Plant();
	//var people = new VISEM.Person();

	window.onload = function() {
		draw();
	};

	this.draw = function(event) {
		getResource("GET", plantFile, initPlant);
		//getResource("GET", plantFile, initPeople);

		plant.init(canvasWrapper);
		plant.draw();
	};

	var initPlant = function(data){
		if (data.type === "building") {
			plant = new VISEM.Plant(data.name, data.type, data.totalWidth, data.totalHeight, data.children);
		};
	};

	var initPeople = function(data){
		//people = new VISEM.Person();
	};

})();