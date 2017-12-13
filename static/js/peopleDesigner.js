//It reads the json file:
var xmlhttp = new XMLHttpRequest();
var url = "/static/jsons/people3.json"; //legend.json	/	people.json	/	solution2moment1.json	/	solution2moment2.json	/	solution2moment3.json

/*xmlhttp.onreadystatechange = function() {	
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {		
        var objectArray = JSON.parse(xmlhttp.responseText);        		
        peopleDesigner(objectArray);
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();*/



//It unites the objects of objectArray to the method that create the people in the view:
function peopleDesigner(objectArray) {	
    for(var i=0; i < objectArray.length; i++){        
		createPersonInView(objectArray[i]);		
    }

    paper.project.view.update();
}

getResource(url, "get", peopleDesigner);

//It's create an person in view:
function createPersonInView(object) {
	
    var color = stationary(object);
    
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

    //While the mouse is moved up the person:
    /*person.onMouseMove = function(event) {
        console.log(object);
        
        $("#textualInformation").html("idPerson :" + object.idPerson + " positionX :" + object.positionX + " positionY :" + object.positionY + " stationary :" + object.stationary + " age :" + object.age + " disability :" + object.disability);
    };*/
    
    //When the mouse is pressed up the person:
    //person.onMouseDown = function(event) {
     /* $.post("personIdStorer.php", {"idPerson": object.idPerson})
			.done(function(result){                    
			});
        $('#'+ 'visemCanvas').after("<a href=" + "personHistoricView.php" + ">View Historic</a>");
     */
    //};/**/        

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
