//File : src/core/dss.core.flatProperties.js

(function(dss) {
	'use strict';

	dss.core.flatProperties = function(properties) {
		var flattedProperties = {};
		var propertyValue = '';
		properties = [].concat.apply([], properties);
		properties = [].concat.apply([], properties);

		properties.forEach(function(property) {
			propertyValue = property.match(/[^\;]*/gmi)[0].split(':');
			flattedProperties[propertyValue[0].trim()] = propertyValue[1].trim();
		});

		return flattedProperties;
	};
})(this.dss);
