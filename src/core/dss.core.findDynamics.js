 /*jshint -W061 */
//File : src/core/dss.core.findDynamics.js

(function(dss) {
  'use strict';

  dss.core.findDynamics = function(selector, rules) {
    var pattern = /(.*):.*\|\|.*\|\|.*;/gmi;
    var match;
    var dynamics = [];

    while (!!(match = pattern.exec(rules))) {
      dynamics.push(match[0]);
    }

    dss.core.changeDynamics(selector,dynamics);
  };
})(this.dss);
