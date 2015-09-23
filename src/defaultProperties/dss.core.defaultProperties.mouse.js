//File : src/defaultProperties/dss.defaultProperties.mouse.js

(function(dss){
'use strict';

	dss.addDefaultProperty('mouse',function(){
		return{
			context : document,

			event : 'mousemove',

			getter : function(e){
				return {
					x : e.pageX,
					y : e.pageY,
				};
			}
		};
	});

})(this.dss);