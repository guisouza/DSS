//File : src/core/dss.core.generateCss.js

(function(dss) {
  'use strict';

	dss.core.generateCss = function (rules) {
		var generatedCss = '';

		for (var rule in rules) {
			generatedCss += rule + '{' + dss.core.concatProps(rules[rule]) + '}';
		}

		return generatedCss;
	};
})(this.dss);


