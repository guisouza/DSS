//File : src/helpers/dss.bounds.js

(function(dss){
'use strict';

	dss.core.defineMethod('bounds',function(limitDown,limitUp){
		return function(value){
			if (value < limitDown){
				return limitDown;
			}
			if (value > limitUp){
				return limitUp;
			}
			return value;
		};
	});

})(this.dss);