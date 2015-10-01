//File : src/helpers/dss.pon.js

(function(dss){
'use strict';

	dss.core.defineMethod('pon',function(num){
		return Math.max(0,num);
	});

})(this.dss);