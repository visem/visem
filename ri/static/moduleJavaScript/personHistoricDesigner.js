//It reads the json file:
var xmlhttp = new XMLHttpRequest();
var url = "jsons/personHistoric.json";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var objectArray = JSON.parse(xmlhttp.responseText);        
		organizer(objectArray);        
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();

//It unites the objects of objectArray to the methods that create the people and the person's route in the view:
function organizer(objectArray) {
    for(var i=0; i < objectArray.length; i++){
        createPersonInView(objectArray[i]);
		createPersonRouteInView(objectArray[i]);
    }
}

var counter = 0;

//It creates an person in view:
function createPersonInView(object) {
    var color;
    if(counter === 5){        
        color = stationary(object);      
    } else {
		color = 'white';
	}	
	counter++;        
    
	var person;

	//elderly person:
    if(object.age > 60){		
        person = createSquareInView(object, color);
    }
    
	//adult person:
    if(18 < object.age && object.age < 60 ){        
        person = createCircleInView(object, color);
    }
    
	//adolescent person:
    if(12 < object.age && object.age < 18){        
        person = createTriangleInView(object, color);        
    }
    
	//child person:
    if(object.age < 12){                
        person = createTriangleInView(object, color);
    }    

    //It indicates with an trace the disability person:
    if(object.disability === 1){		
        createAnTraceInDisabilityPersonOfView(object);        
    }  	               
	
    //While the mouse is moved up the Person:
    person.onMouseMove = function(event) {
		$("#textualInformation").html("idPerson :" + object.idPerson + " positionX :" + object.positionX + " positionY :" + object.positionY + " stationary :" + object.stationary + " age :" + object.age + " disability :" + object.disability);
    };
}

//It indicates the color of the person as black or red:
function stationary(object) {
	if(object.stationary === true){
		return 'black';
    } else {
        return 'red';
    }
}

function createSquareInView(object, color){	
	var person = new Path.RegularPolygon(new Point(object.positionX*ratio+margin, object.positionY*ratio+margin), 4, 12);
	person.fillColor = color;
	person.strokeColor = 'black';	
	return person;
}

function createCircleInView(object, color){	
	var person = new Path.Circle({ position: new Point(object.positionX*ratio+margin, object.positionY*ratio+margin), radius: 8, strokeColor: 'black', fillColor: color});	
	return person;
}

function createTriangleInView(object, color){	
	var person = new Path.RegularPolygon(new Point(object.positionX*ratio+margin, object.positionY*ratio+margin), 3, 12);	
	person.fillColor = color;	
	person.strokeColor = 'black';	
	return person;         
}

function createAnTraceInDisabilityPersonOfView(object){
	var wall = new Path();
	wall.strokeColor = 'black';    
	wall.add(new Point(object.positionX*ratio+margin, object.positionY*ratio+margin));       
	wall.add(new Point((object.positionX + 0.15)*ratio+margin, (object.positionY - 0.15)*ratio+margin));
}

var auxX = -1;
var auxY = -1;

//It creates the person's route in view:
function createPersonRouteInView(object){
	if(auxX !== -1){
		var wall = new Path();
        wall.strokeColor = 'red';        
        wall.add(new Point(auxX, auxY));        
        wall.add(new Point(object.positionX*ratio+margin, object.positionY*ratio+margin));                
    }
    
    auxX = object.positionX*ratio+margin;
    auxY = object.positionY*ratio+margin;	
}