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
    
	//Heatmap instance
	var heatInstance = h337.create({container: canvasWrapper});

	window.onload = function() {
		draw();

		countPeople(plant.rooms, people);
		
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
        
        var slice_hor_counter = 0;
        var slice_ver_counter = 0;
        
        for(var i = 0; i < slices.length; i++){
            if(slices[i].type == "horizontal") 
                slice_hor_counter++;
            else
                slice_ver_counter++;
        };
		
        var vcounter = slice_ver_counter;
        var hcounter = slice_hor_counter;
        
        console.log(canvasWrapper.clientHeight);
        
		for (var i = 0; i < slices.length; i++) {
            if(slices[i].type == "horizontal"){
                slices[i].init((canvasWrapper.clientHeight / (slice_hor_counter+1)) * hcounter);
                hcounter--;
            }
            else{
                slices[i].init((canvasWrapper.clientWidth / (slice_ver_counter+1)) * vcounter);
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
		}
		console.log(slices);
	}
	
	var initHeatMap = function(data){
				
    	var dataset = prepareData(data);
		//console.log(data);
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
					//console.log("Sala: "+room[i].name+" Tem "+counter+" Pessoas.")
				}
			}
			room[i].peopleCounter = counter;
		}
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
