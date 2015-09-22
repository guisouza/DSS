//File : src/core/dss.core.putRule.js

(function(dss){
'use strict';
	dss.core.putRule = function (selector,rule){
		if (!dss.core.myRules)
			dss.core.myRules = {};
		if (!dss.core.myRules[selector])
				dss.core.myRules[selector] = [];

		dss.core.myRules[selector].push(rule);
	};

})(this.dss);