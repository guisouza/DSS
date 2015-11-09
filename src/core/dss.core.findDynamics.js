//File : src/core/dss.core.findDynamics.js

(function(dss){
	'use strict';

	dss.core.findDynamics = function(rules){

		var pseudo = false;
		var selectors = rules.selectors.join(',');
		var explicitDssProperty = false;
		var isDynamic = false;

		var declarations = rules.declarations.filter(function(rule){
			isDynamic = rule.value.indexOf('||') !== -1 || rule.parent.selectors.join('').indexOf(':dss') !== -1 || rule.property.indexOf('dss-') !== -1;
			if (!isDynamic){
				if (!dss.core.nonDynamicRules[selectors])
					dss.core.nonDynamicRules[selectors] = {};
				dss.core.nonDynamicRules[selectors][rule.property] = rule.value;
			}
			return isDynamic;
		}).map(function(prop){
			var obj = {};
			obj[prop.property] = prop.value;
			return obj;
		});



		if (declarations.length > 0){
			pseudo = selectors.indexOf(':dss') !== -1;
			if (pseudo)
				selectors = selectors.replace(/:dss/gmi,'');

			if (!dss.core.refreshValues[selectors]){
				dss.core.refreshValues[selectors] = {};
			}

			declarations.map(function(property){
				Object.keys(property).map(function(prop){
					var propName = prop.replace('dss-','');
					explicitDssProperty = false;
					explicitDssProperty = prop.indexOf('dss-') !== -1;
					if (pseudo || explicitDssProperty){
						dss.core.refreshValues[selectors][propName] = '||'+property[prop]+'||';
					}else{
						dss.core.refreshValues[selectors][propName] = property[prop];
					}
				});
			});
		}
	};

})(this.dss);
