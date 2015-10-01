//File : src/helpers/dss.intOrZerp.js

(function(dss){
'use strict';

	dss.core.defineMethod('intOrZero',function(num){
		return Math.max(0,num);
	});

})(this.dss);