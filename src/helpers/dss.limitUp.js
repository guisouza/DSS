//File : src/helpers/dss.limitUp.js

(function(dss){
'use strict';

	dss.core.defineMethod('limitUp',function(limitUp){
		return function(value){
			if (value > limitUp){
				return limitUp;
			}
			return value;
		};
	});

})(this.dss);