//File : src/core/dss.core.generateCss.js

(function(dss){
	'use strict';
	dss.core.generateCss = function (rules){

		return Object.keys(rules).map(function(rule){

			if (Object.keys(rules[rule]).length === 1){
				var key = Object.keys(rules[rule]);
				return rule+'{'+key+':'+rules[rule][key].value+'}';
			}

			return '\n'+rule+'\n{'+Object.keys(rules[rule]).reduce(function(acc,a,i,fullArr){

				if (i === 1){
					if(typeof rules[rule][acc] === 'string'){
						acc = acc+':'+rules[rule][acc]+';';
					}else{
						acc = acc+':'+rules[rule][acc].value+';';	
					}
					
					if(typeof rules[rule][a] === 'string'){
						return acc+a+':'+rules[rule][a]+';';
					}
					return acc+a+':'+rules[rule][a].value+';';
				}

				if(typeof rules[rule][a] === 'string'){
					return acc+a+':'+rules[rule][a]+';';
				}
				return acc+a+':'+rules[rule][a].value+';';
			})+'}';
		}).join('');

	};
})(this.dss);


