//File : src/core/dss.core.render.js

(function(dss){
'use strict';
	dss.core.render = function (){
		var styles = document.querySelectorAll('[rel="dss-generated-stylesheet"]');
		[].forEach.call(styles,function(style){
			document.head.removeChild(style);
		});
		var style = document.createElement("style");
		style.setAttribute('rel','dss-generated-stylesheet');
		style.appendChild(document.createTextNode(dss.core.generateCss(dss.core.flatRules())));
		document.head.appendChild(style);
	};
})(this.dss);


