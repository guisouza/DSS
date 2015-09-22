//File : src/core/dss.core.parseStyleSheets.js

(function(dss){
'use strict';

	dss.core.parseStyleSheets = function(sheet,path){
		var style = document.createElement("link");
		style.setAttribute('rel','stylesheet');
		style.setAttribute('href',path);
		document.head.appendChild(style);
		var sheetMatches = sheet.match(/.*{[^}]*}/gmi);
		if (sheetMatches !== null)
			sheet.match(/.*{[^}]*}/gmi).forEach(dss.core.parseRule);
	};

})(this.dss);
