//File : src/core/dss.core.findDynamics.js

(function(dss){
	'use strict';

	dss.core.findDynamics = function(rules){


		var declarations = rules.declarations.filter(function(rule){
			return rule.value.indexOf('||') !== -1;
		}).map(function(prop){
			var obj = {};
			obj[prop.property] = prop.value;
			return obj;
		});


		if (declarations.length > 0){
			dss.core.refreshValues[rules.selectors.join(',')] = declarations;	

			var newObj = {};
			dss.core.refreshValues[rules.selectors.join(',')].map(function(property){

				Object.keys(property).map(function(prop){
					newObj[prop] = property[prop];
				});

			});

			dss.core.refreshValues[rules.selectors.join(',')] = newObj;
		}
	};

})(this.dss);
