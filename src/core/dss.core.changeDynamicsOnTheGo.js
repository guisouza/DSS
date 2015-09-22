//File : src/core/dss.core.changeDynamicsOnTheGo.js

(function(dss){
'use strict';
	
	dss.core.changeDynamicsOnTheGo = function (selector,dynamicRule){
		dss.core.rules = [];
		dynamicRule.forEach(function(rule){
			var propertyValue = dss.core.findMatch(rule);
			rule = propertyValue[0]+':'+propertyValue[1]+';';
			dss.core.rules.push(rule);
		});
		dss.core.putRule(selector,dss.core.rules);
	};

})(this.dss);