//File : src/core/dss.core.render.js

(function(dss){
'use strict';
	dss.core.render = function (){

		var style = document.createElement("style");
		style.setAttribute('rel','dss-generated-stylesheet');
		document.head.appendChild(style);

		dss.core.render = function(){

			while(style.firstChild){
				style.removeChild(style.firstChild);
			}

			style.appendChild(document.createTextNode(dss.core.generateCss(dss.core.flatRules())));
		};
	};
})(this.dss);

