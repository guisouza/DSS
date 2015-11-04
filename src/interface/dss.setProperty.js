//File : src/interface/dss.setProperty.js

(function(dss){
'use strict';

	dss.core.defineMethod('setProperty',function(property,value){
		var shouldRender = false;
		if (!dss.core.dynamics)
			dss.core.dynamics = {};
		if (dss.core.dynamics[property] !== value){
			dss.core.dynamics[property] = value;
			shouldRender = true;
		}

		if (dss.core.IS_INITIALIZED && shouldRender){
			dss.core.refreshDss(property);
		}
	});

})(this.dss);