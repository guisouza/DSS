//File : src/helpers/dss.limitDown.js

(function(dss){
'use strict';

	dss.core.defineMethod('limitDown',function(limitDown){
		return function(value){
			if (value < limitDown){
				return limitDown;
			}
			return value;
		};
	});

})(this.dss);