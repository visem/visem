var VISEM = VISEM || {};

VISEM.Slice = function (id, type, position) {
	this.path = new Path();
	this.id = id;
	this.type = type;
	this.position = position;
	
	 this.create = function(canvas, position) {
		var newslice = new Path({
			strokeColor: "blue",
			selected: false,
			strokeWidth: 1
		});
		
		if (this.type === "vertical") {
			newslice.add(new Point(position, 0));
			newslice.add(new Point(position, canvas.clientHeight));	
		}
		else {
			newslice.add(new Point(0, position));
			newslice.add(new Point(canvas.clientWidth, position));
		}
		
		return newslice;
	}
};

VISEM.Slice.prototype.init = function (canvasWrapper, position) {
	this.path = this.create(canvasWrapper, position);
	paper.project.view.update();
};

VISEM.Slice.prototype.any = function() {
	this.path.selected = true;
	this.path.strokeColor = "red";
	this.path.strokeWidth = 5;
};

VISEM.Slice.prototype.drag = function(event) {
	this.path.selected = true;
	console.log(this.path);
}
	// this.path.onClick = function (event){
	// 	console.log('Point: ', event.point);
	// }
/*
	this.path.onmouseover = function (event) {
		console.log(event.point)
	}
	
	/*
	path.on('click', function(event) {
	    console.log('Point: ', event.point);
	});
	*/
/*	path.on('mousedown', function (event) {
		console.log('slicer onMouseDown', this, self);
	});
*/	
/*	path.on('mousedrag' ,function(event){
		console.log('OnMouseDrag');
		path.selected = true;
	    
	    if(this.type === "vertical")
	    	path.position.x += event.delta.x;
	    else
	    	path.position.y += event.delta.y;
	});
*/
/*	path.on('mouseup', function(event) {
	   console.log('up') ;
	});
*/	
/*	
	path.on('mouseleave', function (event) {
		// debugger;
		// if(this.path.selected)
		// 	this.path.selected = false;
		console.log(self.type);
		console.log('path', this);
	});
	
	path.on('mouseenter', function(event) {
	    console.log('Point: ', event.point);
	});
*/	

