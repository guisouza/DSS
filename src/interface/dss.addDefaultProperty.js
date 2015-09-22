//File : src/interface/dss.addDefaultProperty.js

(function(dss) {
  'use strict';

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  dss.core.defineMethod('addDefaultPropery', function(nameSpace, defaultProperty) {
    defaultProperty = defaultProperty();
    defaultProperty.context.addEventListener(
      defaultProperty.event,
      function dssDefaultPropertyEventHandler() {
        var properties = defaultProperty.getter.apply(defaultProperty,arguments);
        for(var prop in properties) {
          dss.setProperty(nameSpace + capitalizeFirstLetter(prop), properties[prop]);
        }
      }
    );
  });

  dss.core.defineMethod('addDynamicPropery', function(nameSpace, defaultProperty) {
    defaultProperty = defaultProperty();
    defaultProperty.context.addEventListener(
      defaultProperty.event,
      function dssDefaultPropertyEventHandler() {
        var properties = defaultProperty.getter.apply(defaultProperty, arguments);
        for(var prop in properties) {
          dss.setProperty(nameSpace + capitalizeFirstLetter(prop), properties[prop]);
        }
      }
    );
  });
})(this.dss);
