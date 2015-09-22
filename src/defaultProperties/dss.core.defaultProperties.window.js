//File : src/defaultProperties/dss.defaultProperties.window.js

(function(dss) {
  'use strict';

  dss.addDefaultPropery('window', function() {
    return {
      context : window,
      event : 'resize',
      getter : function(e) {
        return {
          width : window.innerWidth,
          height : window.innerHeight
        };
      },

      start : function() { }
    };
  });
})(this.dss);
