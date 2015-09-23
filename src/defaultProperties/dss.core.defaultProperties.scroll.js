//File : src/defaultProperties/dss.defaultProperties.scroll.js

(function(dss){
'use strict';

	dss.addDefaultProperty('scroll',function(){
		return{
			context : document,

			event : 'scroll',

			getter : function(e){
				return {
					x : window.scrollX,
					y : window.scrollY,
				};
			}
		};
	});

})(this.dss);