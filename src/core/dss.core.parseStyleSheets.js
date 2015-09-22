//File : src/core/dss.core.parseStyleSheets.js

(function(dss) {
  'use strict';

	dss.core.parseStyleSheets = function(sheet, path){
		var style = document.createElement('link');
    var sheetMatches = sheet.match(/.*{[^}]*}/gmi);

    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', path);

    document.head.appendChild(style);

		if (sheetMatches !== null) {
			sheet.match(/.*{[^}]*}/gmi).forEach(dss.core.parseRule);
    }
	};
})(this.dss);
