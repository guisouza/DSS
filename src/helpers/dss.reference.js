//File : src/helpers/dss.reference.js

(function(dss){
'use strict';

	dss.core.defineMethod('reference',function(selector,property,relation){

			if (dss.core.refreshValues[selector])
				if(dss.core.refreshValues[selector][property])
					return dss.core.refreshValues[selector][property].value;
			return dss.core.nonDynamicRules[selector][property];
	});

})(this.dss);