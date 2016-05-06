var VISEM = VISEM || {};

VISEM.Main = (function() {

	paper.install(window);
	window.onload = function() {

		var plantFile = "";
		var peopleFile = "";
		
		canvas = document.getElementById('visemCanvas');
		paper.setup(canvas);

		draw();
	};

	this.draw = function(event) {

		getResource()
	};

	var initPlant = function(data){

		if (data.type === "building") {
			this.plant = new VISEM.Plant(data.name, data.type, data.width, data.height, data.children);
		};
	};

})();