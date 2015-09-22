//File : src/core/dss.core.changeDynamics.js

(function(dss) {
  'use strict';

  dss.core.changeDynamics = function(selector, dynamicRule) {
    var rules = [];

    dss.core.mySheet = '';
    dss.core.refreshValues.push([selector, dynamicRule]);

    dynamicRule.forEach(function(rule) {
      var propertyValue = dss.core.findMatch(rule);
      rule = propertyValue[0] + ':' + propertyValue[1] + ';';
      rules.push(rule);
    });

    dss.core.putRule(selector, rules);
    dss.core.refreshDss(dss.core.refreshValues);
  };
})(this.dss);
