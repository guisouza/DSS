//File : src/core/dss.core.parseStyleSheets.js

(function(dss){
'use strict';

	dss.core.parseStyleSheets = function(sheet,path){
		var style = document.createElement('link');
		style.setAttribute('rel','stylesheet');
		style.setAttribute('href',path);
		style.setAttribute('type','text/css');
		document.head.appendChild(style);
		css(sheet).stylesheet.rules.forEach(dss.core.findDynamics);
		dss.rawStyleSheet = dss.core.generateCss(dss.core.refreshValues);
		dss.core.refreshDss();

		

	};

})(this.dss);
