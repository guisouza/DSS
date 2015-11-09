//File : src/helpers/dss.floor.js

(function(dss){
'use strict';

	dss.core.defineMethod('floor',function(limitDown){
		return function(value){
			if (value < limitDown){
				return limitDown;
			}
			return value;
		};
	});

})(this.dss);