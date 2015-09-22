//File : src/core/dss.core.concatProps.js

(function(dss){
  'use strict';

	dss.core.concatProps = function (props) {
		var concattedProps = '';
		for (var prop in props) {
			concattedProps += prop + ':' + props[prop] + ';';
		}
		return concattedProps;
	};
})(this.dss);


