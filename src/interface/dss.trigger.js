//File : src/interface/dss.trigger.js

(function(dss){
'use strict';
	
	dss.core.defineMethod('trigger',function(label){
		if (dss.core.events[label])
			dss.core.events[label].map(function(event){
				event();
			});
	});

})(this.dss);