/**
* Classe per la gestione della comunicazione tra diversi domini (Cross Domain Problem)
*/
function CrossDomainRequest(URL, method, scope) {
	/**
	* @property {String} URL
	* dominio con il quale comunicare
	*/
	this.URL = URL;
	/**
	* @property {String} method
	* tipo di comunicazione
	*/
	this.method = method;
	/**
	* @property  scope
	* oggetto al quale passare la risposta
	*/
	if (scope) {
		this.scope = scope;
	} else {
		this.scope = this;
	}
	/**
	* @property {String} parameters
	*parametri da inviare
	*/
	this.parameters = "";
	/**
	* @property {Boolean} IE8
	* tipo di browser
	*/
	this.IE8 = false;
	/**
	* @property {String} authHeaderStr
	* stringa di autenticazione
	*/
	this.authHeaderStr = "";
	/**
	* @method
	* setta la richiesta in funzione del browser
	*/
	this._getXmlHttpRequest = function() {
		xmlHttpRequest = null;
		this.IE8 = window.XDomainRequest ? true : false;
		if (window.XMLHttpRequest) {
			xmlHttpRequest = new XMLHttpRequest();
		} else if (this.IE8) {
			xmlHttpRequest = new window.XDomainRequest();
		} else if (window.ActiveXObject) {
			try {
				xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
				}
			}
		}
		return xmlHttpRequest;
	};
	this.xml_http_request = this._getXmlHttpRequest();
	if (this.xml_http_request != null) {
		this.xml_http_request.parent=this;
		var hdl_onload = function() {
			if (this.readyState == 4) {
				switch (this.status){
					case 401: {
						if (this.parent.scope.onAuthorizationFailure) {
							this.parent.scope.onAuthorizationFailure(this);
						} else {
							this.parent.onAuthorizationFailure(this);
						}
						break;
					}
					case 200: {
						if (this.parent.scope.onSuccess) {
							this.parent.scope.onSuccess(this);
						} else {
							this.parent.onSuccess(this);
						}
						break;
					}
					default: {
						if (this.parent.scope.onFailure) {
							this.parent.scope.onFailure(this);
						} else {
							this.parent.onFailure(this);
						}
						break;
					}
				}
			}
		};
		if (this.IE8) {
			this.xml_http_request.onload = hdl_onload;
		} else {
			this.xml_http_request.onreadystatechange = hdl_onload;
		}
	}
	/**
	* @method
	* Imposta i parametri di autorizzazione.
	* @param {String} usr Nome utente.
	* @param {String} psw Password.
	*/
	this.setAuthorization = function(usr, psw){
		var cmpstr = usr+":"+psw;
		var auth = CrossDomainRequest.base64_encode(cmpstr);
		this.authHeaderStr = 'Basic '+ auth;
	}
	/**
	* @method
	*	Imposta un parametro da inviare.
	* @param {String} parameterName Nome del parametro.
	* @param {String} parameterValue Valore del parametro.
	*/
	this.addParameter = function(parameterName, parameterValue) {
		if (this.parameters.length) {
			this.parameters += "&";
		}
		this.parameters += encodeURIComponent(parameterName) + "=" + encodeURIComponent(parameterValue);
	};
	/**
	* @method
	* invia la richiesta e gestisce la risposta
	*/
	this.send = function() {
		if (this.xml_http_request != null) {
			if (this.IE8) {
				this.xml_http_request.open(this.method, this.URL, true);
				this.xml_http_request.send(this.parameters);
			} else {
				this.xml_http_request.open(this.method, this.URL, true);
				if (this.authHeaderStr.length > 1){
					this.addParameter('Authorization', this.authHeaderStr);
					//this.xml_http_request.setRequestHeader('Authorization',this.authHeaderStr);
				}
				this.xml_http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				//this.xml_http_request.setRequestHeader('Content-length', this.parameters.length);
				//this.xml_http_request.setRequestHeader('Connection', 'close');   
				this.xml_http_request.send(this.parameters);
			}
		} else {
			this.onFailure(null);
		}
	};
	/**
	* @method
	* Gestisce la risposta in caso di successo nella comunicazione.
	* @param {Object} response Risposta.
	*/
	this.onSuccess = function(response) {
	};
	/**
	* @method
	* Gestisce la risposta in caso di fallimento nella comunicazione.
	* @param {Object} response Risposta.
	*/
	this.onFailure = function(response) {
	};
	/**
	* @method
	*	Gestisce la risposta in caso di mancata autorizzazione. 
	* @param {Object} response Risposta.
	*/
	this.onAuthorizationFailure = function(response) {
		alert("Autenticazione Tolomeo Fallita: UTENTE NON ABILITATO");
	};
}
/**
* @method
* Codifica una stringa in BASE64.
* @param {String} data Stringa da codificare.
* @return {String} Stringa codificata.
* @static 
*/
CrossDomainRequest.base64_encode = function(data) {
	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
	ac = 0,
	enc = "",
	tmp_arr = []; 
    if (!data) {
	return data;
    }
    data = CrossDomainRequest.utf8_encode(data + '');
    do { // pack three octets into four hexets
	o1 = data.charCodeAt(i++);
	o2 = data.charCodeAt(i++);        
	o3 = data.charCodeAt(i++);
	bits = o1 << 16 | o2 << 8 | o3;
	h1 = bits >> 18 & 0x3f;        
	h2 = bits >> 12 & 0x3f;
	h3 = bits >> 6 & 0x3f;
	h4 = bits & 0x3f;
	// use hexets to index into b64, and append result to encoded string        
	tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
    enc = tmp_arr.join('');
	var r = data.length % 3;
    
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
};
/**
* @method
* Codifica una stringa in UTF8.
* @param {String} data Stringa da codificare.
* @return {String} Stringa codificata.
* @static 
*/
CrossDomainRequest.utf8_encode = function(argString) {
    if (argString === null || typeof argString === "undefined") {
	return "";
    }
     var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
	start, end, stringl = 0;
 
    start = end = 0;    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
	var c1 = string.charCodeAt(n);
	var enc = null;
	 if (c1 < 128) {
	    end++;
	} else if (c1 > 127 && c1 < 2048) {
	    enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
	} else {            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
	}
	if (enc !== null) {
	    if (end > start) {
	        utftext += string.slice(start, end);            }
	    utftext += enc;
	    start = end = n + 1;
	}
    } 
    if (end > start) {
	utftext += string.slice(start, stringl);
    }
     return utftext;
};
