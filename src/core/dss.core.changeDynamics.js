//File : src/core/dss.core.changeDynamics.js

(function(dss){
'use strict';

	dss.core.changeDynamics = function(selector,dynamicRule){
		dss.core.mySheet = '';
		dss.core.refreshValues.push([selector,dynamicRule]);
		var rules = [];
		dynamicRule.forEach(function(rule){
			var propertyValue = dss.core.findMatch(rule);
			rule = rule.property+':'+rule.value+';';
			rules.push(rule);
		});

		dss.core.putRule(selector,rules);
		dss.core.refreshDss(dss.core.refreshValues);
	};

})(this.dss);