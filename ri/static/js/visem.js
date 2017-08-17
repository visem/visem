var VISEM = VISEM || {};

VISEM.Main = (function() {

	paper.install(window);
	var canvas = document.getElementById('visemCanvas');
	var canvasWrapper = document.getElementById('wrapper');
	paper.setup(canvas);
	var plantFile = "/static/jsons/gsortPlant.json";
	var number = Math.round(Math.random()*10);
	var peopleFile = "/static/jsons/people3.json";
	var plant = new VISEM.Plant();
	var people = new Array();
	var slices = new Array();
	//var sliceFile = "/static/jsons/slice.json";
// 	var sliceFile = "https://visindoor-fernandotelles.c9users.io/visem/slice/json/";
    var sliceFile = "http://localhost:8000/visem/slice/json/";
    var slice_hor_counter = 0;
    var slice_ver_counter = 0;
    var areas = [];
    
	//Heatmap instance
	var heatInstance = h337.create({container: canvasWrapper});

	window.onload = function() {
		draw();

		countPeople(plant.rooms, people);
        
        initAreas();
		
	};

	this.draw = function(event) {
		getResource("GET", plantFile, initPlant);
		
		plant.init(canvasWrapper);
		plant.draw();

		getResource("GET", peopleFile, initPeople);
		
		// for (var i = 0; i < people.length; i++) {
		// 	people[i].draw();
		// }
		
		getResource("GET", sliceFile, initSlice);
		
        var vcounter = slice_ver_counter;
        var hcounter = slice_hor_counter;
        
        console.log(canvasWrapper.clientHeight);
        
		for (var i = 0; i < slices.length; i++) {
            if(slices[i].type == "horizontal"){
                slices[i].init((canvasWrapper.clientHeight / (slice_hor_counter+1)) * hcounter+1);
                hcounter--;
            }
            else{
                slices[i].init((canvasWrapper.clientWidth / (slice_ver_counter+1)) * vcounter+1);
                vcounter--;
            }
            console.log(vcounter, hcounter);
            console.log(" Tipo: " + slices[i].type,
                        " posX: " + ((canvasWrapper.clientWidth / slice_ver_counter+1) * vcounter),
                        " posY: " + ((canvasWrapper.clientHeight / slice_hor_counter+1) * hcounter));

        }
		// console.log(slices);
		
		// //O PROGRESSO ESTÁ AQUI!!!!!
		// this.onclick = function(event) {
		// 	console.log("Event:", event)
		// 	for (var i = slices.length; i--; ) {
		// 		slices[i].any();
		// 	}
			
		// 	//console.log(slices[1].drag(event));
		// }
		
		countPeople(plant.rooms, people);
        
		initHeatMap(plant);
		
		paper.project.view.update();
	};

	var initPlant = function(data){
		if (data.type === "building") {
			plant = new VISEM.Plant(data.name, data.type, data.totalWidth, data.totalHeight, data.children);
		};
	};

	var initPeople = function(data){
		for (var i = 0; i < data.length; i++) {
			people.push(new VISEM.Person(data[i].idPerson, data[i].positionX, data[i].positionY, data[i].age, data[i].stationary, data[i].disability, plant.ratio));
		}
	}
	
	var initSlice = function(data){
		var s =  data.slices;
		for (var i = 0; i < s.length; i++) {
			slices.push(new VISEM.Slice(s[i].slice_id, s[i].slice_type, s[i].slice_position));
            if(s[i].slice_type == "horizontal")
                slice_hor_counter++;
            else
                slice_ver_counter++;
		}
		console.log(slices);
	}
	
	var initHeatMap = function(data){
				
    	var dataset = prepareData(data);
    	var dataPoints = {
			max: people.length * 100,
			min: 0,
			data: dataset
		};

		heatInstance.setData(dataPoints);
		//console.log(heatInstance);
	};

	var prepareData = function(object){
		var preparedData = new Array();
		var number = object.children.length;
		var data = object.rooms;
		for (var i = 0; i < number; i++) {
			 var pt = {
				x: (data[i].totalWidth /2) + data[i].initialPoint.x,
				y: (data[i].totalHeight/2) + data[i].initialPoint.y
			};

			var point = {
				x: Math.round(pt.x * plant.ratio), 
				y: Math.round(pt.y * plant.ratio),
				value: data[i].peopleCounter * 300,
				radius: data[i].peopleCounter * 50
			};	
			console.log("Point: "+point.x, point.y);
			preparedData.push(point);
		}
		
		return preparedData;
	};

	function countPeople(room, people) {
		for (var i = 0; i < room.length; i++) {
			var counter = 0;
			for (var j = 0; j < people.length; j++) {

				var point = new Point(people[j].positionX, people[j].positionY);
				
				if (isInside(point,room[i])) {
					counter++;
				}
			}
			room[i].peopleCounter = counter;
		}
	}

function initAreas(){
		var width = (canvas.clientWidth / (slice_ver_counter+1));
		var height = (canvas.clientHeight / (slice_hor_counter+1));
		
		for (var i = 0; i < (slice_hor_counter+1); i++) {
			for (var j = 0; j < (slice_ver_counter+1); j++){
                if(i==0 && j==0){
                    areas.push({initialX: i ,initialY: j, finalX: width, finalY: height});
                }
               areas.push({initialX: (width * j), initialY: (height * i), finalX: (width * (j+1)), finalY: (height * (i+1))});
               var fim = new Path.Circle({ position: new Point((width * j),  (height * i)), radius: 3, strokeColor: "red", fillColor: "red"});
               var fim = new Path.Circle({ position: new Point((width * (j+1)),  (height * (i+1))), radius: 8, strokeColor: "green", fillColor: "green"});
               paper.project.view.update();
			}
		}
		console.log(areas);
	}
	
	function isInside(point, room){
		if (((point.x >= room.initialPoint.x) && (point.x <= room.finalPoint.x)) && ((point.y >= room.initialPoint.y) && (point.y <= room.finalPoint.y)))
			return true;
		return false;
	}

	function euclideanDistance(a, b) {	
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}

})();
