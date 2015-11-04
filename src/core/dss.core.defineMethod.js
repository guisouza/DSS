//File : src/core/dss.core.defineMethod.js

(function(dss){
'use strict';

	dss.core.defineMethod = function(method,action){
		if (dss[method]){
			throw 'Method '+method+'() already exists';
		}
		dss[method] = action;
	};

})(this.dss);