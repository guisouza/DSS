//File : src/core/dss.core.refreshDss.js

(function(dss){
'use strict';
	
	dss.core.refreshDss = function (property){
		Object.keys(dss.core.refreshValues).map(function(selector){
			Object.keys(dss.core.refreshValues[selector]).map(function(_property){
				if (typeof dss.core.refreshValues[selector][_property] === 'string'){
					 dss.core.refreshValues[selector][_property] = {
					 	originalValue : dss.core.refreshValues[selector][_property],
					 	value : dss.core.findMatch(dss.core.refreshValues[selector][_property])
					 };
				}else{
					if (property && typeof property === 'object'){
						var mustRefreshValues = false;
						property.forEach(function(prop){
							if (dss.core.refreshValues[selector][_property].originalValue.indexOf(prop) !== -1){
								mustRefreshValues = true;
								return;
							}
						});
						if (mustRefreshValues){
							dss.core.refreshValues[selector][_property].value = dss.core.findMatch(dss.core.refreshValues[selector][_property].originalValue);
						}
					}else{
						if (dss.core.refreshValues[selector][_property].originalValue.indexOf(property) !== -1 ||property === undefined){
							dss.core.refreshValues[selector][_property].value = dss.core.findMatch(dss.core.refreshValues[selector][_property].originalValue);
						}
					}
				}
			});
		});

		dss.core.render();	
	};

})(this.dss);