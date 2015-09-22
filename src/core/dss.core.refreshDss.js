//File : src/core/dss.core.refreshDss.js

(function(dss) {
  'use strict';

  dss.core.refreshDss = function (values) {
    dss.core.mySheet = '';
    dss.core.myRules = {};

    values.forEach(function(value) {
      dss.core.changeDynamicsOnTheGo(value[0], value[1]);
    });

    dss.core.render(values);
  };
})(this.dss);
