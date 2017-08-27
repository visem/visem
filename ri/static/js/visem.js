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
// 	var sliceFile = "https://visindoor-fernandotelles.c9users.io/visem/slice/json/";
    var sliceFile = "http://localhost:8000/visem/slice/json/";
    var slice_hor_counter = 0;
    var slice_ver_counter = 0;
    
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
		
// 		for (var i = 0; i < people.length; i++) {
// 			people[i].draw();
// 		}
		
		getResource("GET", sliceFile, initSlice);
		
        var vcounter = slice_ver_counter;
        var hcounter = slice_hor_counter;
        
        initAreas();
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
        }

 		countPeople(plant.rooms, people);
        
        countPeople(plant.areas, people);
//         console.log("Areas", plant.areas.length);
//         for(var i=0; i < plant.areas.length; i++)
//             console.log("Contador de Area: ", plant.areas[i].peopleCounter, "Area",i);
        
		initHeatMap(plant.areas);
		
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
	};
	
	var initSlice = function(data){
		var s =  data.slices;
		for (var i = 0; i < s.length; i++) {
			slices.push(new VISEM.Slice(s[i].slice_id, s[i].slice_type, s[i].slice_position));
            if(s[i].slice_type == "horizontal")
                slice_hor_counter++;
            else
                slice_ver_counter++;
		}
	};
	
	var initHeatMap = function(data){
        
    	var dataset = prepareData(data);
    	var dataPoints = {
			max: people.length * 100,
			min: 0,
			data: dataset
		};

		heatInstance.setData(dataPoints);
	};

	var prepareData = function(data){
		var preparedData = new Array();
		var number = data.length;
        var point = {};
		for (var i = 0; i < number; i++) {
            point = {
                x: Math.round(((data[i].totalWidth/2) + data[i].initialPoint.x) * plant.ratio),
                y: Math.round(((data[i].totalHeight/2) + data[i].initialPoint.y) * plant.ratio),
                value: data[i].peopleCounter * 300,
                radius: data[i].peopleCounter * 50
            };
			preparedData.push(point);
		}
		
		return preparedData;
	};

	function countPeople(area, people) {
		for (var i = 0; i < area.length; i++) {
			var counter = 0;
			for (var j = 0; j < people.length; j++) {

				var point = new Point(people[j].positionX, people[j].positionY);
				
				if (isInside(point, area[i])) {
					counter++;
				}
			}
			area[i].peopleCounter = counter;
		}
	}

    function initAreas(){
		var width = (canvas.clientWidth / (slice_ver_counter+1));
		var height = (canvas.clientHeight / (slice_hor_counter+1));
		
		for (var i = 0; i < (slice_hor_counter+1); i++) {
			for (var j = 0; j < (slice_ver_counter+1); j++){
                if(i==0 && j==0){
                    plant.areas.push({
                        peopleCounter: 0,
                        totalHeight: (height / plant.ratio),
                        totalWidth: (width / plant.ratio),
                        initialPoint: {x: i / plant.ratio, y: j / plant.ratio}, 
                        finalPoint: {x: width / plant.ratio, y: height / plant.ratio}
                    });
                }
                plant.areas.push({
                    peopleCounter: 0,
                    totalHeight: (height / plant.ratio),
                    totalWidth: (width / plant.ratio),
                    initialPoint: {x: (width * j) / plant.ratio, y: (height * i) / plant.ratio},
                    finalPoint: {x: (width * (j+1)) / plant.ratio, y: (height * (i+1)) / plant.ratio}
                });
			}
		}
		console.log(plant.areas);
	}
	
	function isInside(point, area){
		if (((point.x >= area.initialPoint.x) && (point.x <= area.finalPoint.x)) && ((point.y >= area.initialPoint.y) && (point.y <= area.finalPoint.y)))
			return true;
		return false;
	}

	function euclideanDistance(a, b) {	
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}
	
// 	function mediumPoint(object) {
//         var counter = 0;
//         var points = []
//         for(var i = 0; i < object.length; i++) {
//             points.push({
//                 
//             });
//         }
//     }

})();
