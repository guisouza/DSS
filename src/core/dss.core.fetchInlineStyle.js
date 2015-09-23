//File : src/core/dss.core.fetchInlineStyle.js

(function(dss){
'use strict';

	dss.core.fetchInlineStyle = function(){
	    var inlineStyles = document.querySelectorAll('style[dss-enabled]');
		[].forEach.call(inlineStyles,function(style){
			dss.core.parseInlineStyleSheets(style.textContent);

			var newStyle = document.createElement("style");
			newStyle.setAttribute('dss-enabled', 'true');
			newStyle.appendChild(document.createTextNode(style.textContent));
			document.head.appendChild(newStyle);
		});


	};

})(this.dss);