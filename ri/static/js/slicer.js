var VISEM = VISEM || {};

VISEM.Slice = function (id, type, position) {
	var path;
	path = new Path();
	this.id = id;
	this.type = type;
	this.position = position;
	self = this;
	this.pa;

	this.init = function () {
		
		path.strokeColor = "blue";
		path.selected = false;
		path.style.strokeWidth = 3;
		if (type === "vertical"){
			// path.add(new Point(window.innerWidth / 2, 0));
			// path.add(new Point(window.innerWidth / 2, window.innerHeight));
			path.add(new Point(this.position, 0));
			path.add(new Point(this.position, window.innerHeight));	
		}
		else {
			// path.add(new Point(0, window.innerHeight / 2));
			// path.add(new Point(window.innerWidth, window.innerHeight/ 2));
			path.add(new Point(0, this.position));
			path.add(new Point(window.innerWidth, this.position));
		}
		//path = new Path.Circle({ position: new Point(window.innerWidth/2, window.innerHeight/2), radius: 20, strokeColor: 'black', fillColor: 'green'});
		
	};
	
	path.on('click', function(event) {
	    console.log('Point: ',event.point);
	});
	
	path.on('mousedown', function (event) {
		console.log('slicer onMouseDown', this, self);
	});
	
	path.on('mousedrag' ,function(event){
		console.log('OnMouseDrag');
		path.selected = true;
	    
	    if(this.type === "vertical")
	    	path.position.x += event.delta.x;
	    else
	    	path.position.y += event.delta.y;
	});
	
	path.on('mouseup', function(event) {
	   console.log('up') ;
	});
	
	path.on('mouseleave', function (event) {
		// debugger;
		// if(this.path.selected)
		// 	this.path.selected = false;
		console.log(self.type);
		console.log('path', this);
	});
	
	path.on('mouseenter', function(event) {
	    console.log('Point: ',event.point);
	});
	
	this.pa = path;
}
