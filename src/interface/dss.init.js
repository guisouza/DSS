//File : src/interface/dss.init.js

(function(dss){
'use strict';
	
	dss.core.defineMethod('init',dss.core.fetchStyleSheets);
	document.addEventListener('DOMContentLoaded', dss.init, false);

})(this.dss);