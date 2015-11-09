//File : src/core/dss.core.fetchStyleSheets.js

(function(dss){
'use strict';

	dss.core.fetchStyleSheets = function(){
		var stylesheets = document.querySelectorAll('link[rel="dynamic-stylesheet"]');
		var qStylesheets = stylesheets.length;
		var loadedStylesheets = 0;
		if (qStylesheets === 0){
			dss.core.IS_INITIALIZED = true;
		}
		return [].forEach.call(stylesheets, function(stylesheet) {
			if (stylesheet.attributes.href){
				return dss.core.loadStyleSheets(stylesheet.attributes.href.value,
					function styleSheetLoaded(){
						loadedStylesheets++;
						if (qStylesheets === loadedStylesheets){
							dss.core.IS_INITIALIZED = true;
							dss.core.refreshDss();
							dss.trigger('init');
						}
					}
				);
			}
			
			qStylesheets--;
		});
	};

})(this.dss);