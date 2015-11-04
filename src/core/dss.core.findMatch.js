//File : src/core/dss.core.findMatch.js

(function(dss){
	'use strict';

	function _parse(value){
		var newValue = value;
		for (var property in dss.core.dynamics) {
			if(typeof dss.core.dynamics[property] === 'number'){
				newValue = newValue.replace(new RegExp(property,'gmi'),dss.core.dynamics[property]);
			}

			if(typeof dss.core.dynamics[property] === 'string'){
				newValue = newValue.replace(new RegExp(property,'gmi'),"'"+dss.core.dynamics[property]+"'");
			}	
		}

		try{
			return eval(newValue);
		}catch(err){
			return newValue;
		}
	}

	function _parseFields(fullValue){
		var fields = fullValue.replace(/(\|\|[^\|]*\|\|)/gmi,function(value){
			var rawField = value.replace(/\|/gmi,'').split(':');
			if (dss.core.dynamics)
				if (dss.core.dynamics[rawField[0]])
					return dss.core.dynamics[rawField[0]];


				var parsedValue = _parse(rawField[0]);
				if (parsedValue !== false && rawField[0] !== parsedValue)
					return _parse(rawField[0]);
				


				return rawField[1] || false;

			});
		return fields;
	}


	dss.core.findMatch = function(porpertyValue){
		return _parseFields(porpertyValue);

	};

})(this.dss);



