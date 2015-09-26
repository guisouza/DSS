//File : src/defaultProperties/dss.defaultProperties.window.js

(function(dss){
'use strict';

	dss.addDefaultProperty('window',function(){
		return{
			context : window,

			event : 'resize',

			getter : function(e){
				return {
					width : window.innerWidth,
					height : window.innerHeight
				};
			},
			default : function(){
				return {
					width : window.innerWidth,
					height : window.innerHeight
				};
			}
		};
	});

})(this.dss);