//File : src/interface/dss.setProperty.js

(function(dss){
'use strict';

	dss.core.defineMethod('setProperty',function(property,value){
		if (!dss.core.dynamics)
			dss.core.dynamics = [];
		dss.core.dynamics[property] = value;
		if (dss.core.IS_INITIALIZED){
			dss.core.refreshDss(dss.core.refreshValues);
		}
	});

})(this.dss);