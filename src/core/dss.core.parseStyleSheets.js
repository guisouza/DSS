//File : src/core/dss.core.parseStyleSheets.js

(function(dss){
'use strict';

	dss.core.parseStyleSheets = function(sheet,path){
		var style = document.createElement('link');
		style.setAttribute('rel','stylesheet');
		style.setAttribute('href',path);
		style.setAttribute('type','text/css');
		document.head.appendChild(style);
		var sheetMatches = sheet
			.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '')
			.match(/.*{[^}]*}/gmi);
		if (sheetMatches !== null)
			sheetMatches.forEach(dss.core.parseRule);
	};

})(this.dss);
