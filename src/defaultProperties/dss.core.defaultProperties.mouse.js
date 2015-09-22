//File : src/defaultProperties/dss.defaultProperties.mouse.js

(function(dss){
'use strict';

	dss.addDefaultPropery('mouse',function(){
		return{
			context : document,

			event : 'mousemove',

			getter : function(e){
				return {
					x : e.pageX || 0,
					y : e.pageY || 0,
				};
			}
		};
	});

})(this.dss);
