//File : src/core/dss.core.parseInlineStyleSheets.js

(function(dss) {
  'use strict';

	dss.core.parseInlineStyleSheets = function(sheet) {
		sheet.match(/.*{[^}]*}/gmi).forEach(dss.core.parseRule);
	};
})(this.dss);
