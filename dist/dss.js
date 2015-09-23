//File : src/dss.js


(function(world){
  'use strict';

  /**
   * [dss description]
   * @return {[Object]}
   */
  world.dss = function(){ 

    return {
      core : {}
    };

  }();

})(this);
//File : src/core/dss.core.ajax.js

(function(dss){
	'use strict';

 dss.core.ajax = function(args){
 	var callback = args.callback || function(){return false;};
 	var url = args.url;
 	var method = args.method || 'GET';
 	var data = args.data || false;

 	var xhr;
 	
 	if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
 	else {
 		var versions = ["MSXML2.XmlHttp.5.0", 
 		"MSXML2.XmlHttp.4.0",
 		"MSXML2.XmlHttp.3.0", 
 		"MSXML2.XmlHttp.2.0",
 		"Microsoft.XmlHttp"];
 		
 		for(var i = 0, len = versions.length; i < len; i++) {
 			try {
 				xhr = new ActiveXObject(versions[i]);
 				break;
 			}
 			catch(e){}
 		}
 	}
 	xhr.onreadystatechange = ensureReadiness;
 	function ensureReadiness() {
 		if(xhr.readyState < 4) {
 			return;
 		}
 		if(xhr.status !== 200) {
 			return;
 		}
 		if(xhr.readyState === 4) {
 			callback(xhr.response);
 		}           
 	}

 	xhr.open(method, url, true);
 	if (method.toUpperCase() == 'POST'){
 		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 		data = x.core.serialize(data);
 		xhr.send(data);
 	}else{
 		xhr.send('');     	
 	}
 };
})(this.dss);

//File : src/core/dss.core.changeDynamics.js

(function(dss){
'use strict';

	dss.core.changeDynamics = function(selector,dynamicRule){
		dss.core.mySheet = '';
		dss.core.refreshValues.push([selector,dynamicRule]);
		var rules = [];
		dynamicRule.forEach(function(rule){
			var propertyValue = dss.core.findMatch(rule);
			rule = propertyValue[0]+':'+propertyValue[1]+';';
			rules.push(rule);
		});

		dss.core.putRule(selector,rules);
		dss.core.refreshDss(dss.core.refreshValues);
	};

})(this.dss);
//File : src/core/dss.core.changeDynamicsOnTheGo.js

(function(dss){
'use strict';
	
	dss.core.changeDynamicsOnTheGo = function (selector,dynamicRule){
		dss.core.rules = [];
		dynamicRule.forEach(function(rule){
			var propertyValue = dss.core.findMatch(rule);
			rule = propertyValue[0]+':'+propertyValue[1]+';';
			dss.core.rules.push(rule);
		});
		dss.core.putRule(selector,dss.core.rules);
	};

})(this.dss);
//File : src/core/dss.core.concatProps.js

(function(dss){
'use strict';
	dss.core.concatProps = function (props){
		var concattedProps = '';
		for (var prop in props){
			concattedProps+= prop+":"+props[prop]+';';
		}
		return concattedProps;

	};
})(this.dss);



//File : src/core/dss.core.defineMethod.js

(function(dss){
'use strict';

	dss.core.defineMethod = function(method,action){
		if (dss[method]){
			throw 'Method already '+method+'() exists';
		}
		dss[method] = action;
	};

})(this.dss);
//File : src/core/dss.core.extractField.js

(function(dss){
	'use strict';

	dss.core.extractField = function(stringField,object,index){
		stringField = stringField.replace(/\}\}/g,'').replace(/\{\{/g,'').trim();

		if (object){
			var fieldPath = '';
			if (stringField.indexOf('.') > 0){
				fieldPath = stringField.split('.');
				stringField = stringField.replace(fieldPath[0]+'.','');
				return x.core.extractField(stringField,object[fieldPath[0]]);
				}else if(stringField.indexOf('][') > 0){
					fieldPath = stringField.split('][');
				}else if(stringField.indexOf('[') > 0){
					fieldPath = stringField.split('[');
			}else{
				return object[stringField];
			}
		}
	};
}(this.dss));
//File : src/core/dss.core.fetchExternalStyleSheets.js

(function(dss){
'use strict';

	dss.core.fetchExternalStyleSheets = function(){
		var stylesheets = document.querySelectorAll('link[dss-enabled]');
		var qStylesheets = stylesheets.length;
		var loadedStylesheets = 0;
		if (qStylesheets === 0){
			dss.core.IS_INITIALIZED = true;
		}
		return [].forEach.call(stylesheets, function(stylesheet) {
			if (stylesheet.attributes.href){
				return dss.core.loadStyleSheets(stylesheet.attributes.href.value,
					function styleSheetLoaded(){
						loadedStylesheets++;
						if (qStylesheets === loadedStylesheets){
							dss.core.IS_INITIALIZED = true;
						}
					}
				);
			}
			
			qStylesheets--;
		});
	};

})(this.dss);
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
//File : src/core/dss.core.fetchStyleSheets.js

(function(dss){
'use strict';

	dss.core.fetchStyleSheets = function(){
		dss.core.fetchExternalStyleSheets();
		dss.core.fetchInlineStyle();
	};

})(this.dss);
 /*jshint -W061 */
//File : src/core/dss.core.findDynamics.js

(function(dss){
'use strict';

	dss.core.findDynamics = function(selector,rules){
	    var pattern = /(.*)-dss:.*;/gmi;
	    var match;
	    var dynamics = [];

	    while (!!(match = pattern.exec(rules))) {
	        dynamics.push(match[0]);
	    }

	    dss.core.changeDynamics(selector, dynamics);
	};

})(this.dss);

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

	function _parseFields(fullValue) {

	    if (dss.core.dynamics)
	        if (dss.core.dynamics[fullValue])
	            return dss.core.dynamics[fullValue];

	    if (_parse(fullValue) !== false)
	        return _parse(fullValue);

	    return fullValue || false;

	}


	dss.core.findMatch = function (porpertyValue) {


	    var valuePattern = /\:(.*);/gmi;
	    var propertyPattern = /([^:]*)-dss:.*;/gmi;
	    var property = propertyPattern.exec(porpertyValue)[1].trim();
	    var fullValue = valuePattern.exec(porpertyValue)[1];

	    return [property, _parseFields(fullValue)];

	};

})(this.dss);




//File : src/core/dss.core.flatProperties.js

(function(dss){
'use strict';

	dss.core.flatProperties = function(properties){
		properties = [].concat.apply([], properties);
		properties = [].concat.apply([], properties);
		var flattedProperties = {};
		properties.forEach(function(property){
			var propertyValue = property.match(/[^\;]*/gmi)[0].split(':');
			flattedProperties[propertyValue[0].trim()] = propertyValue[1].trim();
		});

		return flattedProperties;
	};

})(this.dss);
//File : src/core/dss.core.flatRules.js

(function(dss){
'use strict';

	dss.core.flatRules = function(){
		var flattedRules = {};

		for(var rule in dss.core.myRules){
			if (!flattedRules.hasOwnProperty(rule.trim()))
				flattedRules[rule.trim()] = [];
			flattedRules[rule.trim()].push(dss.core.myRules[rule]);
		}
		for(var _rule in flattedRules){
			flattedRules[_rule] = dss.core.flatProperties(flattedRules[_rule]);
		}

		return flattedRules;
	};

})(this.dss);
//File : src/core/dss.core.generateCss.js

(function(dss){
'use strict';
	dss.core.generateCss = function (rules){
		var generatedCss = '';
		for (var rule in rules){
			generatedCss += rule+'{'+dss.core.concatProps(rules[rule])+'}';
		}

		return generatedCss;

	};
})(this.dss);



//File : src/core/dss.core.loadStyleSheets.js

(function(dss){
'use strict';

	dss.core.loadStyleSheets = function(path,callback){
		dss.core.ajax({
			url : path,
			callback : function parseStyleSheetsHook(sheet){
				dss.core.parseStyleSheets(sheet,path);
				callback();
			}
		});
	};

})(this.dss);

//File : src/core/dss.core.parseInlineStyleSheets.js

(function(dss){
'use strict';

	dss.core.parseInlineStyleSheets = function(sheet){
		sheet.match(/.*{[^}]*}/gmi).forEach(dss.core.parseRule);
	};

})(this.dss);

//File : src/core/dss.core.parseRule.js

(function(dss){
'use strict';

	dss.core.parseRule = function(rule){
		var pattern = /(.*){([^}]*)}/gmi;
		var x = pattern.exec(rule);
		dss.core.findDynamics(x[1],x[2]);
	};

})(this.dss);

//File : src/core/dss.core.parseStyleSheets.js

(function(dss){
'use strict';

	dss.core.parseStyleSheets = function(sheet,path){
		var style = document.createElement("link");
		style.setAttribute('rel','stylesheet');
		style.setAttribute('href',path);
		document.head.appendChild(style);
		var sheetMatches = sheet.match(/.*{[^}]*}/gmi);
		if (sheetMatches !== null)
			sheet.match(/.*{[^}]*}/gmi).forEach(dss.core.parseRule);
	};

})(this.dss);

//File : src/core/dss.core.putRule.js

(function(dss){
'use strict';
	dss.core.putRule = function (selector,rule){
		if (!dss.core.myRules)
			dss.core.myRules = {};
		if (!dss.core.myRules[selector])
				dss.core.myRules[selector] = [];

		dss.core.myRules[selector].push(rule);
	};

})(this.dss);
//File : src/core/dss.core.refreshDss.js

(function(dss){
'use strict';
	
	dss.core.refreshDss = function (values){
		dss.core.mySheet = '';
		dss.core.myRules = {};
		values.forEach(function(value){
			dss.core.changeDynamicsOnTheGo(value[0],value[1]);
		});
		dss.core.render(values);
	};

})(this.dss);
//File : src/core/dss.core.refreshValues.js

(function(dss){
'use strict';

	dss.core.refreshValues = [];

})(this.dss);
//File : src/core/dss.core.render.js

(function(dss){
'use strict';
	dss.core.render = function (){
		var styles = document.querySelectorAll('[rel="dss-generated-stylesheet"]');
		[].forEach.call(styles,function(style){
			document.head.removeChild(style);
		});
		var style = document.createElement("style");
		style.setAttribute('rel','dss-generated-stylesheet');
		style.appendChild(document.createTextNode(dss.core.generateCss(dss.core.flatRules())));
		document.head.appendChild(style);
	};
})(this.dss);



//File : src/interface/dss.addDefaultProperty.js

(function(dss){
'use strict';

	function capitalizeFirstLetter(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	dss.core.defineMethod('addDefaultProperty',function(nameSpace,defaultProperty){
		defaultProperty = defaultProperty();
		defaultProperty.context.addEventListener(defaultProperty.event,
			function dssDefaultPropertyEventHandler(){
				var properties = defaultProperty.getter.apply(defaultProperty,arguments);
				for(var prop in properties){
					dss.setProperty(nameSpace+capitalizeFirstLetter(prop),properties[prop]);
				}
			});
	});

	dss.core.defineMethod('setDynamicProperty',function(nameSpace,defaultProperty){
		defaultProperty = defaultProperty();
		defaultProperty.context.addEventListener(defaultProperty.event,
			function dssDefaultPropertyEventHandler(){
				var properties = defaultProperty.getter.apply(defaultProperty,arguments);
				for(var prop in properties){
					dss.setProperty(nameSpace+capitalizeFirstLetter(prop),properties[prop]);
				}
			});
	});

})(this.dss);


//File : src/interface/dss.init.js

(function(dss){
'use strict';
	
	dss.core.defineMethod('init',dss.core.fetchStyleSheets);
	document.addEventListener('DOMContentLoaded', dss.init, false);

})(this.dss);
//File : src/interface/dss.setProperty.js

(function(dss){
'use strict';

	dss.core.defineMethod('setProperty',function(property,value){
		if (!dss.core.dynamics)
			dss.core.dynamics = {};
		dss.core.dynamics[property] = value;
		if (dss.core.IS_INITIALIZED){
			dss.core.refreshDss(dss.core.refreshValues);
		}
	});

})(this.dss);
//File : src/defaultProperties/dss.defaultProperties.mouse.js

(function(dss){
'use strict';

	dss.addDefaultProperty('mouse',function(){
		return{
			context : document,

			event : 'mousemove',

			getter : function(e){
				return {
					x : e.pageX,
					y : e.pageY,
				};
			}
		};
	});

})(this.dss);
//File : src/defaultProperties/dss.defaultProperties.scroll.js

(function(dss){
'use strict';

	dss.addDefaultProperty('scroll',function(){
		return{
			context : document,

			event : 'scroll',

			getter : function(e){
				return {
					x : window.scrollX,
					y : window.scrollY,
				};
			}
		};
	});

})(this.dss);
//File : src/defaultProperties/dss.defaultProperties.window.js

(function(dss){
'use strict';

	dss.addDefaultProperty('window',function(){
		return{
			context : window,

			event : 'resize',

			getter : function(e){
				return {
					width : window.innerWidth,
					height : window.innerHeight,
				};
			},
			start : function(){
				
			}
		};
	});

})(this.dss);