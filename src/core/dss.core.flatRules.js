//File : src/core/dss.core.flatRules.js

(function(dss) {
  'use strict';

	dss.core.flatRules = function() {
		var flattedRules = {};

		for(var rule in dss.core.myRules){
			if (!flattedRules.hasOwnProperty(rule.trim())) {
				flattedRules[rule.trim()] = [];
      }
			flattedRules[rule.trim()].push(dss.core.myRules[rule]);
		}

		for(var _rule in flattedRules) {
			flattedRules[_rule] = dss.core.flatProperties(flattedRules[_rule]);
		}

		return flattedRules;
	};
})(this.dss);
