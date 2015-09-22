//File : src/core/dss.core.fetchStyleSheets.js

(function(dss){
'use strict';

	dss.core.fetchStyleSheets = function(){
		dss.core.fetchExternalStyleSheets();
		dss.core.fetchInlineStyle();
	};

})(this.dss);