//File : src/core/dss.core.parseRule.js

(function(dss){
'use strict';

	dss.core.parseRule = function(rule){
		dss.core.findDynamics(rule.selectors.join(','),rule.declarations);
	};

})(this.dss);
