var VISEM = VISEM || {};

VISEM.Vertex = function (codigo, centerPoint, ratio, idRoom){
	this.path = new Path();
	this.codigo = codigo;
	this.centerPoint = centerPoint;
	this.ratio = ratio;
	this.blocked = false;
	this.idRoom = idRoom;
	this.penalty;
};
