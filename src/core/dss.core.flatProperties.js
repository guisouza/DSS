//File : src/core/dss.core.flatProperties.js

(function(dss){
'use strict';

	dss.core.flatProperties = function(properties){
		properties = [].concat.apply([], properties);
		properties = [].concat.apply([], properties);
		var flattedProperties = {};
		properties.forEach(function(property){
			var propertyValue = property.match(/[^\;]*/gmi)[0].split(':');
			flattedProperties[propertyValue[0].trim()] = propertyValue[1].trim();
		});

		return flattedProperties;
	};

})(this.dss);