var VISEM = VISEM || {};

VISEM.Slicer = function (type, position) {
	this.path = new Path();
	this.type = type;
	this.position = position;

	this.init = function () {
		this.path.strokeColor = "black";
		this.path.selected = false;

		if (type === "vertical"){
			this.path.add(new Point(window.innerWidth / 2, 0));
			this.path.add(new Point(window.innerWidth / 2, window.innerHeight));
		}
		else {
			this.path.add(new Point(0, window.innerHeight / 2));
			this.path.add(new Point(window.innerWidth, window.innerHeight/ 2));	
		}
	};

	this.onMouseDrag = this.path.onMouseDrag = function(event){
		this.path.selected = true;
	    
	    if(this.type === "vertical")
	    	this.path.position.x += event.delta.x;
	    else
	    	this.path.position.y += event.delta.y;
	};

	this.onMouseLeave = this.path.onMouseLeave = function (event) {
		if(this.path.selected)
			this.path.selected = false;
	}
}
