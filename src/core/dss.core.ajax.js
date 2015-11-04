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
 		if(xhr.status !== 200 && xhr.status !== 0) {
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
