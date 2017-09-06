var VISEM = VISEM || {};

VISEM.Main = (function() {
    
    var self = this;
	paper.install(window);
	var canvas = document.getElementById('visemCanvas');
	var canvasWrapper = document.getElementById('wrapper');
	paper.setup(canvas);
	var plantFile = "/static/jsons/gsortPlant.json";
	var peopleFile = "/static/jsons/people3.json";
	var sliceFile = "https://visindoor-fernandotelles.c9users.io/visem/slice/json/";
//    var sliceFile = "http://localhost:8000/visem/slice/json/";

	var plant = new VISEM.Plant();
	var people = new Array();
	var slices = new Array();
 	var heatInstance = new VISEM.Heatmap(canvasWrapper);
 	
    var slice_hor_counter = 0;
    var slice_ver_counter = 0;
    
    var heatmap_check = document.getElementById("heatmap-check");
    var slice_check = document.getElementById("slice-check");
    var route_check = document.getElementById("route-check");
    heatmap_check.checked = true;
    
    heatmap_check.addEventListener("change", makeChange);
    slice_check.addEventListener("change", makeChange);
    route_check.addEventListener("change", makeChange);
    

    
	//Heatmap instance
// 	var heatInstance = h337.create({container: canvasWrapper});

	window.onload = function() {
        getResource("GET", plantFile, initPlant);
        plant.init(canvas);
        heatInstance.setRatio(plant.ratio);
        getResource("GET", peopleFile, initPeople);
        getResource("GET", sliceFile, initSlice);
		draw();
	};

	this.draw = function(event) {

		plant.draw();

        // if(heatmap_check.checked !== true){
        var peopleLayer = new Layer();
        for (var i = 0; i < people.length; i++) {
            people[i].draw();
        }
        // }

        initAreas();
        console.log(canvasWrapper.clientHeight);
        
        // if(slice_check.checked === true) {
        var vcounter = slice_ver_counter;
        var hcounter = slice_hor_counter;
        var sliceLayer = new Layer();
        
        for (var i = 0; i < slices.length; i++) {
            if(slices[i].type == "horizontal"){
                slices[i].init(canvasWrapper ,(canvasWrapper.clientHeight / (slice_hor_counter+1)) * hcounter+1);
                hcounter--;
            }
            else{
                slices[i].init(canvasWrapper, (canvasWrapper.clientWidth / (slice_ver_counter+1)) * vcounter+1);
                vcounter--;
            }
        }
        // }
        
        countPeople(plant.rooms, people);
        countPeople(plant.areas, people);
        
        // if(heatmap_check.checked === true && slice_check.checked === true)
        //initHeatMap(plant.areas);
        
        //if(heatmap_check.checked === true)
        heatInstance.init(plant.rooms);
		
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
    
    function makeChange(event){
    	console.log(event);
    	var checkboxes = document.getElementsByName("checkboxes");
    	
    	console.log(checkboxes);
    	
    	if(event.target.id === "slice-check"){
    		
    		console.log("SLICE is now", event.target.checked);
    	}
    	if(event.target.id === "heatmap-check"){
    		console.log("HEATMAP is now ", event.target.checked);
    	}
    	if(event.target.id === "route-check"){
    		console.log("ROUTES is now", event.target.checked);
    	}
    	
        //self.draw();
    }
})();
