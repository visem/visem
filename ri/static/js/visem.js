var VISEM = VISEM || {};

VISEM.Main = (function() {

	paper.install(window);
	window.onload = function() {

		canvas = document.getElementById('visemCanvas');
		paper.setup(canvas);

		//get People

		draw();
	};

	this.draw = function(event) {
		path = new Path();
		path.strokeColor = 'red';

		path.add(event.point);

		drawPeople();
	};

	this.drawPeople = function() {
		//getResource()
		
	}

})();