var VISEM = VISEM || {};

VISEM.Edge = function (cod, source, distance, weight){
	this.path = new Path();
	this.cod = cod;
	this.source = source;
	this.distance = distance;
	this.weight = weight;
};