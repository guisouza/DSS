//File : src/core/dss.core.fetchInlineStyle.js

(function(dss) {
  'use strict';

  dss.core.fetchInlineStyle = function() {
    var inlineStyles = document.querySelectorAll('style[type="dynamic-stylesheet"]');
    [].forEach.call(inlineStyles, function(style) {
      dss.core.parseInlineStyleSheets(style.textContent);

      var newStyle = document.createElement('style');
      newStyle.setAttribute('rel', 'inline-stylesheet');
      newStyle.appendChild(document.createTextNode(style.textContent));
      document.head.appendChild(newStyle);
    });
  };
})(this.dss);
