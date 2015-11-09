//File : src/interface/dss.setProperty.js


(function(dss){
'use strict';

	dss.core.defineMethod('setProperty',function(propertyOrObject,value){
		var shouldRender = false;

		if (typeof propertyOrObject === 'object'){
			var properties = Object.keys(propertyOrObject);
			var refreshedProperties = [];
			properties.map(function(property){
				if (dss.core.dynamics[property] !== propertyOrObject[property]){
					dss.core.dynamics[property] = propertyOrObject[property];
					refreshedProperties.push(property);
					shouldRender = true;
				}
			});

			if (dss.core.IS_INITIALIZED && shouldRender){
				dss.core.refreshDss(refreshedProperties);
			}

		}

		if (typeof propertyOrObject === 'string')
			if (dss.core.dynamics[propertyOrObject] !== value){
				dss.core.dynamics[propertyOrObject] = value;
				shouldRender = true;

				if (dss.core.IS_INITIALIZED && shouldRender){
					dss.core.refreshDss(propertyOrObject);
				}
			}
	});

})(this.dss);