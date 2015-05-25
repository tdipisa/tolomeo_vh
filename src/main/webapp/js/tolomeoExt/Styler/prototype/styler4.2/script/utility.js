var logProperties = function(object) {
	console.log("################################");
	for (var propertyName in object) {
		if (object.hasOwnProperty(propertyName)) {
			console.log("property name: " + propertyName);
			console.log("property value: " + object[propertyName]);
		}
	}
	console.log("################################");
}
