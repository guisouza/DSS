//File : src/interface/dss.on.js

(function(dss){
'use strict';
	
	dss.core.defineMethod('on',function(label,event){
		if (!dss.core.events[label])
			dss.core.events[label] = [];
		dss.core.events[label].push(event);
	});

})(this.dss);