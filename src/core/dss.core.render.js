//File : src/core/dss.core.render.js

(function(dss){
	'use strict';
	dss.core.render = function (){
		var styles = document.querySelectorAll('[rel="dss-generated-stylesheet"]');

		if (styles[0]){
			var generatedDSS = dss.core.generateCss(dss.core.refreshValues);
			if (dss.lastDSSSheet !== generatedDSS){
				dss.lastDSSSheet = generatedDSS;
				styles[0].innerHTML = generatedDSS;
			}
			
		}else{
			var style = document.createElement("style");
			style.setAttribute('rel','dss-generated-stylesheet');
			dss.lastDSSSheet = dss.core.generateCss(dss.core.refreshValues);
			style.appendChild(document.createTextNode(dss.lastDSSSheet));
			document.head.appendChild(style);			
		}
		dss.trigger('render');
	};
})(this.dss);


