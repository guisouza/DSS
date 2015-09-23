//File : src/core/dss.core.parseRule.js

(function(dss) {
  'use strict';

  dss.core.parseRule = function(rule) {
    var pattern = /(.*){([^}]*)}/gmi;
    var x = pattern.exec(rule);
    dss.core.findDynamics(x[1], x[2]);
  };
})(this.dss);
