//File : src/helpers/dss.if.js

(function(dss){
'use strict';

	dss.core.defineMethod('if',function(condition){
		return function(yeap){
			return function(nope){
				if (condition)
					return yeap;
				return nope;
			};
		};
	});

})(this.dss);