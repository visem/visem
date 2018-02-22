var VISEM = VISEM || {};

VISEM.Heatmap = function(container) {
    this.instance = h337.create({container: container});
    this.ratio = 0;
    this._max = 1;
    var self = this;
    this.colors = ['#83b5d1', '#7698b3', '#726e97', '#7f557d', '#673c4f'];

    this.init = function(data) {
        var dataset = prepareData(data);
        var dataPoints = {
            max: this._max * 100,
            min: 0,
            data: dataset
        };

        this.instance.setData(dataPoints);
    };
    
    this.initByRoom = function(data) {
        var self = this;
        data.forEach(function(d){
             d.path.fillColor = getColorByQuantity.call(self, d.peopleCounter);
        });
    };
    
    this.setRatio = function(ratio) {
        this.ratio = ratio;
    };

    this.setMax = function(max){
        this._max = max;
    };
    
    this.cleanRoomHeatmap = function(rooms) {
        rooms.forEach(function(room){
             room.path.fillColor = 'white';
        });
        
        paper.project.view.update();
    }

    var prepareData = function(data){
        var preparedData = new Array();
        var number = data.length;
        var point = {};
        for (var i = 0; i < number; i++) {
            point = {
                x: Math.round(((data[i].totalWidth/2) + data[i].initialPoint.x) * self.ratio),
                y: Math.round(((data[i].totalHeight/2) + data[i].initialPoint.y) * self.ratio),
                value: data[i].peopleCounter * 300,
                radius: data[i].peopleCounter * 50
            };
            preparedData.push(point);
        }
        
        return preparedData;
    };
    
    var getColorByQuantity = function (number){
    
        if (number < 5)
            return this.colors[0];
        else if (number >= 5 && number < 10)
            return this.colors[1];
        else 
            return this.colors[2];
    }

};
