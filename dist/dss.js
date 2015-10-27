	// http://www.w3.org/TR/CSS21/grammar.html
	// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
	var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g

	var css =  function(css, options){
	  options = options || {};

	  /**
	   * Positional.
	   */

	  var lineno = 1;
	  var column = 1;

	  /**
	   * Update lineno and column based on `str`.
	   */

	  function updatePosition(str) {
	    var lines = str.match(/\n/g);
	    if (lines) lineno += lines.length;
	    var i = str.lastIndexOf('\n');
	    column = ~i ? str.length - i : column + str.length;
	  }

	  /**
	   * Mark position and patch `node.position`.
	   */

	  function position() {
	    return function(node){
	      whitespace();
	      return node;
	    };
	  }

	  /**
	   * Error `msg`.
	   */

	  var errorsList = [];

	  function error(msg) {
	  	console.log(msg)
	    // var err = new Error(options.source + ':' + lineno + ':' + column + ': ' + msg);
	    // err.reason = msg;
	    // err.filename = options.source;
	    // err.line = lineno;
	    // err.column = column;
	    // err.source = css;

	    // if (options.silent) {
	    //   errorsList.push(err);
	    // } else {
	    //   throw err;
	    // }
	  }

	  /**
	   * Parse stylesheet.
	   */

	  function stylesheet() {
	    var rulesList = rules();

	    return {
	      type: 'stylesheet',
	      stylesheet: {
	        rules: rulesList,
	        parsingErrors: errorsList
	      }
	    };
	  }

	  /**
	   * Opening brace.
	   */

	  function open() {
	    return match(/^{\s*/);
	  }

	  /**
	   * Closing brace.
	   */

	  function close() {
	    return match(/^}/);
	  }

	  /**
	   * Parse ruleset.
	   */

	  function rules() {
	    var node;
	    var rules = [];
	    whitespace();
	    comments(rules);
	    while (css.length && css.charAt(0) != '}' && (node = atrule() || rule())) {
	      if (node !== false) {
	        rules.push(node);
	        comments(rules);
	      }
	    }
	    return rules;
	  }

	  /**
	   * Match `re` and return captures.
	   */

	  function match(re) {
	    var m = re.exec(css);
	    if (!m) return;
	    var str = m[0];
	    updatePosition(str);
	    css = css.slice(str.length);
	    return m;
	  }

	  /**
	   * Parse whitespace.
	   */

	  function whitespace() {
	    match(/^\s*/);
	  }

	  /**
	   * Parse comments;
	   */

	  function comments(rules) {
	    var c;
	    rules = rules || [];
	    while (c = comment()) {
	      if (c !== false) {
	        rules.push(c);
	      }
	    }
	    return rules;
	  }

	  /**
	   * Parse comment.
	   */

	  function comment() {
	    var pos = position();
	    if ('/' != css.charAt(0) || '*' != css.charAt(1)) return;

	    var i = 2;
	    while ("" != css.charAt(i) && ('*' != css.charAt(i) || '/' != css.charAt(i + 1))) ++i;
	    i += 2;

	    if ("" === css.charAt(i-1)) {
	      return error('End of comment missing');
	    }

	    var str = css.slice(2, i - 2);
	    column += 2;
	    updatePosition(str);
	    css = css.slice(i);
	    column += 2;

	    return pos({
	      type: 'comment',
	      comment: str
	    });
	  }

	  /**
	   * Parse selector.
	   */

	  function selector() {
	    var m = match(/^([^{]+)/);
	    if (!m) return;
	    /* @fix Remove all comments from selectors
	     * http://ostermiller.org/findcomment.html */
	    return trim(m[0])
	      .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
	      .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function(m) {
	        return m.replace(/,/g, '\u200C');
	      })
	      .split(/\s*(?![^(]*\)),\s*/)
	      .map(function(s) {
	        return s.replace(/\u200C/g, ',');
	      });
	  }

	  /**
	   * Parse declaration.
	   */

	  function declaration() {
	    var pos = position();

	    // prop
	    var prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
	    if (!prop) return;
	    prop = trim(prop[0]);

	    // :
	    if (!match(/^:\s*/)) return error("property missing ':'");

	    // val
	    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);

	    var ret = pos({
	      type: 'declaration',
	      property: prop.replace(commentre, ''),
	      value: val ? trim(val[0]).replace(commentre, '') : ''
	    });

	    // ;
	    match(/^[;\s]*/);

	    return ret;
	  }

	  /**
	   * Parse declarations.
	   */

	  function declarations() {
	    var decls = [];

	    if (!open()) return error("missing '{'");
	    comments(decls);

	    // declarations
	    var decl;
	    while (decl = declaration()) {
	      if (decl !== false) {
	        decls.push(decl);
	        comments(decls);
	      }
	    }

	    if (!close()) return error("missing '}'");
	    return decls;
	  }

	  /**
	   * Parse keyframe.
	   */

	  function keyframe() {
	    var m;
	    var vals = [];
	    var pos = position();

	    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
	      vals.push(m[1]);
	      match(/^,\s*/);
	    }

	    if (!vals.length) return;

	    return pos({
	      type: 'keyframe',
	      values: vals,
	      declarations: declarations()
	    });
	  }

	  /**
	   * Parse keyframes.
	   */

	  function atkeyframes() {
	    var pos = position();
	    var m = match(/^@([-\w]+)?keyframes\s*/);

	    if (!m) return;
	    var vendor = m[1];

	    // identifier
	    var m = match(/^([-\w]+)\s*/);
	    if (!m) return error("@keyframes missing name");
	    var name = m[1];

	    if (!open()) return error("@keyframes missing '{'");

	    var frame;
	    var frames = comments();
	    while (frame = keyframe()) {
	      frames.push(frame);
	      frames = frames.concat(comments());
	    }

	    if (!close()) return error("@keyframes missing '}'");

	    return pos({
	      type: 'keyframes',
	      name: name,
	      vendor: vendor,
	      keyframes: frames
	    });
	  }

	  /**
	   * Parse supports.
	   */

	  function atsupports() {
	    var pos = position();
	    var m = match(/^@supports *([^{]+)/);

	    if (!m) return;
	    var supports = trim(m[1]);

	    if (!open()) return error("@supports missing '{'");

	    var style = comments().concat(rules());

	    if (!close()) return error("@supports missing '}'");

	    return pos({
	      type: 'supports',
	      supports: supports,
	      rules: style
	    });
	  }

	  /**
	   * Parse host.
	   */

	  function athost() {
	    var pos = position();
	    var m = match(/^@host\s*/);

	    if (!m) return;

	    if (!open()) return error("@host missing '{'");

	    var style = comments().concat(rules());

	    if (!close()) return error("@host missing '}'");

	    return pos({
	      type: 'host',
	      rules: style
	    });
	  }

	  /**
	   * Parse media.
	   */

	  function atmedia() {
	    var pos = position();
	    var m = match(/^@media *([^{]+)/);

	    if (!m) return;
	    var media = trim(m[1]);

	    if (!open()) return error("@media missing '{'");

	    var style = comments().concat(rules());

	    if (!close()) return error("@media missing '}'");

	    return pos({
	      type: 'media',
	      media: media,
	      rules: style
	    });
	  }


	  /**
	   * Parse custom-media.
	   */

	  function atcustommedia() {
	    var pos = position();
	    var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
	    if (!m) return;

	    return pos({
	      type: 'custom-media',
	      name: trim(m[1]),
	      media: trim(m[2])
	    });
	  }

	  /**
	   * Parse paged media.
	   */

	  function atpage() {
	    var pos = position();
	    var m = match(/^@page */);
	    if (!m) return;

	    var sel = selector() || [];

	    if (!open()) return error("@page missing '{'");
	    var decls = comments();

	    // declarations
	    var decl;
	    while (decl = declaration()) {
	      decls.push(decl);
	      decls = decls.concat(comments());
	    }

	    if (!close()) return error("@page missing '}'");

	    return pos({
	      type: 'page',
	      selectors: sel,
	      declarations: decls
	    });
	  }

	  /**
	   * Parse document.
	   */

	  function atdocument() {
	    var pos = position();
	    var m = match(/^@([-\w]+)?document *([^{]+)/);
	    if (!m) return;

	    var vendor = trim(m[1]);
	    var doc = trim(m[2]);

	    if (!open()) return error("@document missing '{'");

	    var style = comments().concat(rules());

	    if (!close()) return error("@document missing '}'");

	    return pos({
	      type: 'document',
	      document: doc,
	      vendor: vendor,
	      rules: style
	    });
	  }

	  /**
	   * Parse font-face.
	   */

	  function atfontface() {
	    var pos = position();
	    var m = match(/^@font-face\s*/);
	    if (!m) return;

	    if (!open()) return error("@font-face missing '{'");
	    var decls = comments();

	    // declarations
	    var decl;
	    while (decl = declaration()) {
	      decls.push(decl);
	      decls = decls.concat(comments());
	    }

	    if (!close()) return error("@font-face missing '}'");

	    return pos({
	      type: 'font-face',
	      declarations: decls
	    });
	  }

	  /**
	   * Parse import
	   */

	  var atimport = _compileAtrule('import');

	  /**
	   * Parse charset
	   */

	  var atcharset = _compileAtrule('charset');

	  /**
	   * Parse namespace
	   */

	  var atnamespace = _compileAtrule('namespace');

	  /**
	   * Parse non-block at-rules
	   */


	  function _compileAtrule(name) {
	    var re = new RegExp('^@' + name + '\\s*([^;]+);');
	    return function() {
	      var pos = position();
	      var m = match(re);
	      if (!m) return;
	      var ret = { type: name };
	      ret[name] = m[1].trim();
	      return pos(ret);
	    }
	  }

	  /**
	   * Parse at rule.
	   */

	  function atrule() {
	    if (css[0] != '@') return;

	    return atkeyframes()
	      || atmedia()
	      || atcustommedia()
	      || atsupports()
	      || atimport()
	      || atcharset()
	      || atnamespace()
	      || atdocument()
	      || atpage()
	      || athost()
	      || atfontface();
	  }

	  /**
	   * Parse rule.
	   */

	  function rule() {
	    var pos = position();
	    var sel = selector();

	    if (!sel) return error('selector missing');
	    comments();

	    return pos({
	      type: 'rule',
	      selectors: sel,
	      declarations: declarations()
	    });
	  }

	  return addParent(stylesheet());
	};

	/**
	 * Trim `str`.
	 */

	function trim(str) {
	  return str ? str.replace(/^\s+|\s+$/g, '') : '';
	}

	/**
	 * Adds non-enumerable parent node reference to each node.
	 */

	function addParent(obj, parent) {
	  var isNode = obj && typeof obj.type === 'string';
	  var childParent = isNode ? obj : parent;

	  for (var k in obj) {
	    var value = obj[k];
	    if (Array.isArray(value)) {
	      value.forEach(function(v) { addParent(v, childParent); });
	    } else if (value && typeof value === 'object') {
	      addParent(value, childParent);
	    }
	  }

	  if (isNode) {
	    Object.defineProperty(obj, 'parent', {
	      configurable: true,
	      writable: true,
	      enumerable: false,
	      value: parent || null
	    });
	  }

	  return obj;
	}

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
			rule = rule.property+':'+rule.value+';';
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
		var stylesheets = document.querySelectorAll('link[rel="dynamic-stylesheet"]');
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
		var inlineStyles = document.querySelectorAll('style[type="dynamic-stylesheet"]');
		[].forEach.call(inlineStyles,function(style){
			dss.core.parseInlineStyleSheets(style.textContent);

			var newStyle = document.createElement("style");
			newStyle.setAttribute('rel','inline-stylesheet');
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
//File : src/core/dss.core.findDynamics.js

(function(dss){
'use strict';

	dss.core.findDynamics = function(selector,rules){
		
		rules = rules.filter(function(rule){
			return rule.value.indexOf('||') !== -1;
		});

		dss.core.changeDynamics(selector,rules);
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
		return [porpertyValue.property,_parseFields(porpertyValue.value)];

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
			flattedProperties[propertyValue[0].trim()] = propertyValue.splice(1).join('').trim();
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
		if (rule.selectors)
			dss.core.findDynamics(rule.selectors.join(','),rule.declarations);
	};

})(this.dss);

//File : src/core/dss.core.parseStyleSheets.js

(function(dss){
'use strict';

	dss.core.parseStyleSheets = function(sheet,path){
		var style = document.createElement('link');
		style.setAttribute('rel','stylesheet');
		style.setAttribute('href',path);
		style.setAttribute('type','text/css');
		document.head.appendChild(style);
		css(sheet).stylesheet.rules.forEach(dss.core.parseRule);
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
		if (defaultProperty.default){
			var defaults = defaultProperty.default();
			for(var prop in defaults){
					dss.setProperty(nameSpace+capitalizeFirstLetter(prop),defaults[prop]);
			}
		}
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
//File : src/helpers/dss.bounds.js

(function(dss){
'use strict';

	dss.core.defineMethod('bounds',function(limitDown,limitUp){
		return function(value){
			if (value < limitDown){
				return limitDown;
			}
			if (value > limitUp){
				return limitUp;
			}
			return value;
		};
	});

})(this.dss);
//File : src/helpers/dss.if.js

(function(dss){
'use strict';

	dss.core.defineMethod('if',function(condition){
		return function(yeap){
			return function(nope){
				if (condition)
					return yeap;
				return nope;
			};
		};
	});

})(this.dss);
//File : src/helpers/dss.limitDown.js

(function(dss){
'use strict';

	dss.core.defineMethod('limitDown',function(limitDown){
		return function(value){
			if (value < limitDown){
				return limitDown;
			}
			return value;
		};
	});

})(this.dss);
//File : src/helpers/dss.limitUp.js

(function(dss){
'use strict';

	dss.core.defineMethod('limitUp',function(limitUp){
		return function(value){
			if (value > limitUp){
				return limitUp;
			}
			return value;
		};
	});

})(this.dss);
//File : src/helpers/dss.pon.js

(function(dss){
'use strict';

	dss.core.defineMethod('pon',function(num){
		return Math.max(0,num);
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
					height : window.innerHeight
				};
			},
			default : function(){
				return {
					width : window.innerWidth,
					height : window.innerHeight
				};
			}
		};
	});

})(this.dss);