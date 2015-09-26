//File : src/core/dss.core.flatProperties.js

(function(dss){
'use strict';

	dss.core.flatProperties = function(properties){
		properties = [].concat.apply([], properties);
		properties = [].concat.apply([], properties);
		var flattedProperties = {};
		properties.forEach(function(property){
			var propertyValue = property.match(/[^\;]*/gmi)[0].split(':');
			console.log(propertyValue);
			flattedProperties[propertyValue[0].trim()] = propertyValue.splice(1).join('').trim();
		});

		return flattedProperties;
	};

})(this.dss);