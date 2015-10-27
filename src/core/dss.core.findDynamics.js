 /*jshint -W061 */
//File : src/core/dss.core.findDynamics.js

(function(dss){
'use strict';

	dss.core.findDynamics = function(selector,rules){
		rules.filter(function(rule){
			return rule.value.indexOf('||') !== -1;
		});

		dss.core.changeDynamics(selector,rules);
	};

})(this.dss);
