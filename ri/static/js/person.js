var VISEM = VISEM || {};

VISEM.Person = function(id, posX, posY, age, stationary, disability, ratio) {
	this.path = new Path();
	this.idPerson = id;
	this.positionX  = posX;
	this.positionY = posY;
	this.stationary = stationary;
	this.age = age;
	this.disability = disability;
	this.ratio = ratio;

	this.draw = function() {
		var color = this.color();

		//elderly person:
	    if(this.age > 60){		
	        this.path = createSquareInView(this, color);
	    }
	    
		//adult person:
	    if(18 < this.age && this.age < 60 ){        
	        this.path = createCircleInView(this, color);
	    }
	    
		//adolescent person:
	    if(12 < this.age && this.age < 18){        
	        this.path = createTriangleInView(this, color);        
	    }
	    
		//child person:
	    if(this.age < 12){                
	        this.path = createTriangleInView(this, color);
	    }    

	    //It indicates with an trace the disability person:
	    if(this.hasDisability()){		
	        createAnTraceInDisabilityPersonOfView(this);        
	    }                    
	        
	};

	//It indicates the color of the person as black or red:
	this.color = function() {
		if(this.stationary === true){		
			return 'black';    
		} else {		
			return 'red';		
		}
	}

	this.hasDisability = function() {
		return this.disability === 1 ? true : false; 
	};

	var createSquareInView = function(object, color){	
		var person = new Path.RegularPolygon(new Point(object.positionX*ratio, object.positionY*ratio), 4, 12);
		person.fillColor = color;
		person.strokeColor = color;	
		return person;
	};

	var createCircleInView = function(object, color){	
		var person = new Path.Circle({ position: new Point(object.positionX*ratio, object.positionY*ratio), radius: 8, strokeColor: color, fillColor: color});	
		return person;
	};

	var createTriangleInView = function(object, color){	
		var person = new Path.RegularPolygon(new Point(object.positionX*ratio, object.positionY*ratio), 3, 12);
		person.fillColor = color;	
		person.strokeColor = color;	
		return person;         
	};

	var createAnTraceInDisabilityPersonOfView = function(object){
		var line = new Path();
		line.strokeColor = 'black';    
		line.add(new Point(object.positionX*ratio, object.positionY*ratio));       
		line.add(new Point((object.positionX + 0.15)*ratio, (object.positionY - 0.15)*ratio));
		return line;
	};

	//While the mouse is moved up the person:
	this.path.onMouseMove = function(event) {
	    console.log(this);
	//     $("#textualInformation").html("idPerson :" + this.idPerson + 
	//     							  " positionX :" + this.positionX + 
	//     							  " positionY :" + this.positionY + 
	//     							  " stationary :" + this.stationary + 
	//     							  " age :" + this.age + 
	//     							  " disability :" + this.disability);
	};
};