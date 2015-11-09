//File : src/helpers/dss.ceil.js

(function(dss){
'use strict';

	dss.core.defineMethod('ceil',function(limitUp){
		return function(value){
			if (value > limitUp){
				return limitUp;
			}
			return value;
		};
	});

})(this.dss);