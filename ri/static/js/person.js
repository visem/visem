var VISEM = VISEM || {};

VISEM.Person = function(id,posX, posY, age, stationary, disability){
	this.path = new Path();
	this.idPerson = id;
	this.positionX  = posX;
	this.positionY = posY;
	this.stationary = stationary;
	this.age = age;
	this.disability = disability;

	//While the mouse is moved up the person:
    this.path.onMouseMove = function(event) {
        
        $("#textualInformation").html("idPerson :" + this.idPerson + 
        							  " positionX :" + this.positionX + 
        							  " positionY :" + this.positionY + 
        							  " stationary :" + this.stationary + 
        							  " age :" + this.age + 
        							  " disability :" + this.disability);
    };

} 

VISEM.Person.prototype.draw = function() {
	var color = stationary();

	//elderly person:
    if(object.age > 60){		
        this.path = createSquareInView(object, color);
    }
    
	//adult person:
    if(18 < object.age && object.age < 60 ){        
        this.path = createCircleInView(object, color);
    }
    
	//adolescent person:
    if(12 < object.age && object.age < 18){        
        this.path = createTriangleInView(object, color);        
    }
    
	//child person:
    if(object.age < 12){                
        this.path = createTriangleInView(object, color);
    }    

    //It indicates with an trace the disability person:
    if(this.hasDisability()){		
        createAnTraceInDisabilityPersonOfView(object);        
    }                    
        
};

VISEM.Person.prototype.method_name = function(first_argument) {
	// body...
};

//It indicates the color of the person as black or red:
function stationary(object) {
	if(object.stationary === true){		
		return 'black';    
	} else {		
        return 'red';		
    }
}

VISEM.Person.prototype.hasDisability = function() {
	return this.disability === 1 ? true : false; 
};

function createSquareInView(object, color){	
	var person = new Path.RegularPolygon(new Point(object.positionX*ratio, object.positionY*ratio), 4, 12);
	person.fillColor = color;
	person.strokeColor = color;	
	return person;
}

function createCircleInView(object, color){	
	var person = new Path.Circle({ position: new Point(object.positionX*ratio, object.positionY*ratio), radius: 8, strokeColor: color, fillColor: color});	
	return person;
}

function createTriangleInView(object, color){	
	var person = new Path.RegularPolygon(new Point(object.positionX*ratio, object.positionY*ratio), 3, 12);	
	person.fillColor = color;	
	person.strokeColor = color;	
	return person;         
}

function createAnTraceInDisabilityPersonOfView(object){
	var wall = new Path();
	wall.strokeColor = 'black';    
	wall.add(new Point(object.positionX*ratio, object.positionY*ratio));       
	wall.add(new Point((object.positionX + 0.15)*ratio, (object.positionY - 0.15)*ratio));
}