//File : src/core/dss.core.loadStyleSheets.js

(function(dss){
	'use strict';

	dss.core.loadStyleSheets = function(path,callback){
		dss.core.ajax({
			url : path,
			callback : function parseStyleSheetsHook(sheet){
				dss.core.parseStyleSheets(sheet,path);
				callback();
			}
		});
	};

})(this.dss);
