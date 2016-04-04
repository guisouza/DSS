//File : src/defaultProperties/dss.defaultProperties.window.js

(function(dss){
'use strict';

	dss.addDefaultProperty('window',function(){
		return{
			context : window,

			event : 'resize',

			getter : function(e){
				return {
					innerWidth : window.innerWidth,
					innerHeight : window.innerHeight,
					outerWidth: window.outerWidth,
					outerHeight: window.outerHeight
				};
			},
			default : function(){
				return {
					innerWidth : window.innerWidth,
					innerHeight : window.innerHeight,
					outerWidth: window.outerWidth,
					outerHeight: window.outerHeight
				};
			}
		};
	});

})(this.dss);