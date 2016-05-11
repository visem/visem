var VISEM = VISEM || {};

function getResource (method, url, callbackFunction) {
	var xmlhttp = new XMLHttpRequest();
	var resource;

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			resource = JSON.parse(xmlhttp.responseText);
			callbackFunction(resource);
	    }
	}
	xmlhttp.open(method, url,false);
	xmlhttp.send();
}
