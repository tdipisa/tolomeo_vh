/* 
 Tolomeo is a developing framework for visualization, editing,  
 geoprocessing and decisional support application based on cartography.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 This file is part of Tolomeo.
 
 Tolomeo is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License 
 as published by the Free Software Foundation; either version 3 of the License, 
 or (at your option) any later version.
 
 Tolomeo is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 
 You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo è un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo è un software libero; è possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo è distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo è sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

/**
 * TolomeoExt.lazyLoad
 *
 * @author Nieri Federico
 *******************************************************************
 * Class TolomeoExt.lazyLoad
 * Load javascript files onDemand
 **/
TolomeoExt.lazyLoad = function () {

    var debug = false;
    var containingScriptNames = ['build/toloExt-all.js','build/toloExt-all-debug.js'];
    var thisScriptName = 'toloLazyLoad.js';
    
    var objects = {
 //       gmap: {
 //           loaded: false,
 //           checkLoad: 'GMap2', /*Variable that must exists to confirm load*/           
 //           url: 'http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAZtXebGuEUyPUsb16TunzchQH1vzzQPdXCsLMkqVnPRtWvfSdoRToJrguncXU9Z0FgvbgReXeej9BDQ&sensor=false&async=2'
 //       },        
        proj4js: {
            loaded: false,
            checkLoad: 'Proj4js',
            relativeToThisScript : true,
            url: '../ext/proj4js/proj4js-compressed.js'
        }, 
		swfobject: {
            loaded: false,
            checkLoad: 'swfobject',
            relativeToThisScript : true,
            url: '../ext/swfobject/swfobject.js'
        },
        mootools12corecompressed: {
            loaded: false,
            checkLoad: 'MooTools',
            relativeToThisScript : true,
            url: '../ext/mootools/mootools-1.2-core-compressed.js'
        },
        mootools12morecompressed: {
            loaded: false,
            checkLoad: 'Drag',
            relativeToThisScript : true,
            url: '../ext/mootools/mootools-1.2-more-compressed.js'
        },
        iipmooviewer11compressed: {
            loaded: false,
            checkLoad: 'IIP',
            relativeToThisScript : true,
            url: '../ext/iipmooviewer/iipmooviewer-1.1.js'
        },
        mootoolscore145: {
            loaded: false,
            checkLoad: 'MooTools',
            relativeToThisScript : true,
            url: '../ext/mootools/mootools-core-1.4.5-full-nocompat-yc.js'
        },
        mootoolsmore1401: {
            loaded: false,
            checkLoad: 'Drag',
            relativeToThisScript : true,
            url: '../ext/mootools/mootools-more-1.4.0.1-compressed.js'
        },
        iipmooviewer20: {
            loaded: false,
            checkLoad: 'IIPMooViewer',
            relativeToThisScript : true,
            url: '../ext/iipmooviewer-2.0/javascript/iipmooviewer-2.0-compressed.js'
            //url: '../ext/iipmooviewer-2.0/src/iipmooviewer-2.0.js'
        },
        /*
        i18nPropertyReader: {
            loaded: false,
            checkLoad: 'Ext.i18n.PropertyReader',
            relativeToThisScript : true,
            url: '../ext/resourceBundle/PropertyReader.js'
        },
        i18nBundle: {
            loaded: false,
            checkLoad: 'Ext.i18n.Bundle',
            relativeToThisScript : true,
            url: '../ext/resourceBundle/Bundle.js'
        },*/
        
        i18nPropertyReader: {
            loaded: false,
            checkLoad: 'Ext.i18n.PropertyReader',
            relativeToThisScript : true,
            url: '../ext/i18n/reader/Property.js'
        },
        i18nJsonReader: {
            loaded: false,
            checkLoad: 'Ext.i18n.reader.Json',
            relativeToThisScript : true,
            url: '../ext/i18n/reader/Json.js'
        },
        i18nBundle: {
            loaded: false,
            checkLoad: 'Ext.i18n.Bundle',
            relativeToThisScript : true,
            url: '../ext/i18n/Bundle.js'
        },
        cswExplorer: {
            loaded: false,
            checkLoad: 'CSWPanel',
            relativeToThisScript : true,
            url: '../ext/csw/build/cswExplorer.js'
        },
        cesium: {
            loaded: false,
            checkLoad: 'Cesium',
            relativeToThisScript : true,
            url: '../ext/cesium/Build/Cesium/Cesium.js'
        }
    }
    
    return {
    	getScriptLocation: function () {    
    		if(TolomeoExt.lazyLoad.libPath) return TolomeoExt.lazyLoad.libPath;
    		
	        var scripts = document.getElementsByTagName('script');
	        for (var i = 0; i < scripts.length; i++) {
	            var src = scripts[i].getAttribute('src');
	            if (src) {	            	            		
	                var index = src.lastIndexOf(thisScriptName);
	                var scriptNameLen = thisScriptName.length;	                
	                // is it found, at the end of the URL?
	                if ((index > -1) && (index + scriptNameLen == src.length)) {
	                	TolomeoExt.lazyLoad.libPath = src.slice(0, -scriptNameLen);
	                    return TolomeoExt.lazyLoad.libPath;
	                }	            	
	            }
	        }
	        for (var i = 0; i < scripts.length; i++) {
	            var src = scripts[i].getAttribute('src');
	            if (src) {
	            	for(var s = 0; s < containingScriptNames.length; s++){
	            		var scriptName  = containingScriptNames[s];
		                var index = src.lastIndexOf(scriptName);
		                var scriptNameLen = scriptName.length;	                
		                // is it found, at the end of the URL?
		                if ((index > -1) && (index + scriptNameLen == src.length)) {
		                	TolomeoExt.lazyLoad.libPath = src.slice(0, -scriptNameLen);
		                    return TolomeoExt.lazyLoad.libPath;
		                }
	            	}
	            }
	        }
	        return "";
	    },
	    
        /*
         * @name Ext.ux.lazyLoad.get
         * Retrieve js files on demand if not loaded
         * @params
         *  -jsKey {String}: Js File name to load
         *  -callback {function}: function to be executed after
         *  -scope {Object}: Object scope to run the callback function
         **/
        get: function (jsKey, onLoad, onFail, scope) {
            /*Return if is not a valid object*/
            if (!objects[jsKey]) return false;

            /*Run thread*/
            var waitCounter = 0;
            this.thread(jsKey, onLoad, onFail, scope, waitCounter, 'loadScript' + Ext.id());
            return true;
        }
        /*
         *@name Ext.ux.lazyLoad.thread
         *Reusable thread to check if js file has been loaded
         *@params
         *  -jsKey{String}: js key from the objects array
         *  -callback{Function}: function to execute when file is loaded
         *  -scope {Object}: Object scope to run the callback function
         *  -waitCointer{Integer}: Current cycle number
         *  -id{String}: Id used to identify the script tag
         **/
        ,
        thread: function (jsKey, onLoad, onFail, scope, waitCounter, id) {

            /*If its loaded*/
            if (this.isLoaded(jsKey)) {
                onLoad.call(scope);
            } else {
                /*If script object hasnt been included, do it*/
                if (!Ext.get(id)) {
                    /*If hasnt been loaded*/
                    /*Prepare url*/
                    var url = objects[jsKey].url;
                    if(objects[jsKey].relativeToThisScript){
                    	url = this.getScriptLocation()+ url;
                    }

                    this.head = document.getElementsByTagName('head').item(0);
                    script = document.createElement('script');
                    script.defer = false;
                    script.src = url;
                    script.type = 'text/javascript';
                    script.id = id;
                    script.idDefer = null;
                    var me = this;
                    script.onload = function(){me.endLoading(true,onLoad,scope,id,jsKey);};
      				script.onerror = function(){me.endLoading(false,onFail,scope,id,jsKey);};
      				
      				if (Ext.isIE) {
				        script.onreadystatechange = function(){me.checkReadyState(this.readyState,onLoad,onFail,scope,id,jsKey);};
				    }
				    
                    this.head.appendChild(script);
                }
                //if (debug) Ext.get('testdiv').insertHtml('beforeEnd', jsKey + ' wait counter:' + waitCounter + '<br>');
                //console.debug(jsKey + ' wait counter:' + waitCounter);
                if(this.checkLoad(jsKey)){
                    this.endLoading(true,onLoad,scope,id,jsKey);
                    return;
                   
                } else {
                    if (waitCounter++<10) {
                        /*Will check 10 times every 2 seconds if the js has been loaded*/
                    	var scriptTag = document.getElementById(id);
                        scriptTag.idDefer = Ext.defer(this.thread,2000, this, [jsKey, onLoad, onFail, scope, waitCounter, id]);
                    } else {
                    	this.endLoading(false,onFail,scope,id,jsKey);
                    }
                }

            }
        },
        
        checkLoad : function(jsKey){        
        	try {
                return eval(objects[jsKey].checkLoad);                
            } catch(e) {
            	return false;
          	}
        },
        
        endLoading : function(ok,callMe,scope,id,jsKey){
        	this.clear(id);
        	if(ok){        		
        		objects[jsKey].loaded = true;
        	}else{
        		this.clean(id);
        	}
        	if(callMe){
        		callMe.call(scope);
        	}else if(!ok){
        		alert("Problema nel caricamento della libreria Javascript");
        	}
        	
        },
        
        checkReadyState: function(readyState,onLoad,onFail,scope,id,jsKey) {
	      if (readyState == 'loaded') {
	        if(this.checkLoad(jsKey)){                
                this.endLoading(true,onLoad,scope,id,jsKey);                
            } else {
            	this.endLoading(false,onFail,scope,id,jsKey);
          	}
	      }
	    },
	    
        clear: function (id) {
            var scriptTag = document.getElementById(id);
            if (scriptTag && scriptTag.idDefer) clearTimeout(scriptTag.idDefer);
        }
        /*
         * @name Ext.ux.lazyLoad.clean
         * Removes recently used script tag from dom
         **/
        ,
        clean: function (id) {
            var scriptTag = document.getElementById(id);
            if (scriptTag) this.head.removeChild(scriptTag);
        }
        /*
         * @name Ext.ux.lazyLoad.isLoaded
         * Getter function to retrieve status
         **/
        ,
        isLoaded: function (jsKey) {
            return objects[jsKey].loaded;
        }
    }
}();