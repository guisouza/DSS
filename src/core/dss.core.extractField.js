//File : src/core/dss.core.extractField.js

(function(dss){
	'use strict';

	dss.core.extractField = function(stringField, object, index) {
		stringField = stringField.replace(/\}\}/g,'').replace(/\{\{/g,'').trim();

		if (object) {
			var fieldPath = '';
			if (stringField.indexOf('.') > 0) {
				fieldPath = stringField.split('.');
				stringField = stringField.replace(fieldPath[0] + '.', '');
				return x.core.extractField(stringField, object[fieldPath[0]]);
			} else if (stringField.indexOf('][') > 0) {
				fieldPath = stringField.split('][');
			} else if(stringField.indexOf('[') > 0) {
				fieldPath = stringField.split('[');
			} else {
				return object[stringField];
			}
		}
	};
}(this.dss));
