//File : src/core/dss.core.parseRule.js

(function(dss){
'use strict';

	dss.core.parseRule = function(rule){
		if (rule.selectors)
			dss.core.findDynamics(rule.selectors.join(','),rule.declarations);
	};

})(this.dss);
