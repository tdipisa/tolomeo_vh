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

/*
 * Fix OpenLayers IE
 */
if(document.namespaces == null){document.createElement('namespaces');}

/*
 * Fix vari non contenuto nella public release
 */
Ext.namespace("TolomeoExt");

//Corregge il fatto che la window "ruba" il focus di un eventuale campo di una form .Per esempio in windowToponomastica
/*Ext.override(Ext.Window, {
    toFront : function(e){
        if(this.manager.bringToFront(this)){
            if(e && !e.getTarget().focus){
                this.focus();
            }
        }
        return this;
    }
});
*/

/**
 * @method applyIfEmpty
 * Fix per diverso comportamento applyIf tra 3.0 e 3.1
 * 
 * Parameters:
 * o - .
 * c - .
 */	
TolomeoExt.applyIfEmpty = function (o,c) {
	if(o){
        for(var p in c){
        	//o["aaa"] = 'ale';
        	//o["TOLOMEOServer"] = c["TOLOMEOServer"];
        	
        	if (Ext.isEmpty(o[p])) {
                o[p] = c[p];
            //    alert(c[p]);
            }
        }
    }
}


if(Ext.isIE8) {
	Ext.form.ComboBox.prototype.shadow = false;
    Ext.Panel.prototype.shadow = false;
    Ext.menu.Menu.prototype.shadow = false;
    Ext.ToolTip.prototype.floating.shadow = false;
    Ext.ToolTip.prototype.floating.shim = true;
    Ext.ToolTip.prototype.floating.useDisplay = true;
    Ext.ToolTip.prototype.floating.constrain = false;
}

/*
 * Ovveride per connessioni SSL
 */
if(Ext.isSecure) {
	Ext.BLANK_IMAGE_URL= "https://pratomaps.comune.prato.it/img/pixel.gif";
	Ext.chart.Chart.CHART_URL = "/js/images/blankfile";
	Ext.FlashComponent.EXPRESS_INSTALL_URL = "/js/images/blankfile"
	Ext.SSL_SECURE_URL='javascript:false';
}else{
	Ext.BLANK_IMAGE_URL= "http://pratomaps.comune.prato.it/img/pixel.gif";
}


OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

/*
 * Cambio la risoluzione in base al sistema operativo
 */
/*
if(Ext.isWindows) {
	OpenLayers.DOTS_PER_INCH = 96;
} else if (Ext.isMac) {
	OpenLayers.DOTS_PER_INCH = 72;
} else if (Ext.isLinux) {
	OpenLayers.DOTS_PER_INCH = 72;
}
*/


/**
 * Sostituisce un parametro di una url con un altro
 * 
 * @param url - url nella quale viene effettuata la sostituzione
 * @param paramname - nome del parametro
 * @param paramvalue - nuovo valore del parametro
 * 
 */

TolomeoExt.urlAddOrChangeParameter = function (url, paramname, paramvalue) {

	var inizio = 0;
	var pre = "";
	var post = "";
	
	if (url.indexOf(paramname+"=")!=-1) {
		pre = url.substring(0,url.indexOf(paramname+"="));
		inizio = url.indexOf(paramname+"=");
		if (url.indexOf("&",inizio)!=-1) {
			var fine = url.indexOf("&",inizio);
			post = url.substring(fine); 
		} 
	} else {
		pre = url;
	}
	
	return pre + paramname+'=' + paramvalue + post;
	
}


/**
 * @method loadScript
 * Copyright (C) 2006-2007 Dao Gottwald
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * Contact information:
 *   Dao Gottwald  <dao@design-noir.de>
 *
 * version  1.6
 * url      http://design-noir.de/webdev/JS/loadScript/
 */
function loadScript(url, callback) {
	var f = arguments.callee;
	if (!("queue" in f))
		f.queue = {};
	var queue =  f.queue;
	if (url in queue) { // script is already in the document
		if (callback) {
			if (queue[url]) // still loading
				queue[url].push(callback);
			else // loaded
				callback();
		}
		return;
	}
	queue[url] = callback ? [callback] : [];
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.onload = script.onreadystatechange = function() {
		if (script.readyState && script.readyState != "loaded" && script.readyState != "complete")
			return;
		script.onreadystatechange = script.onload = null;
		while (queue[url].length)
			queue[url].shift()();
		queue[url] = null;
	};
	script.src = url;
	document.getElementsByTagName("head")[0].appendChild(script);
}
/* Esempio di utilizzo
 * 
   <html>
	<head>
		<title>Test</title>
	</head>
	<body>
		<script type="text/javacript" src="scriptloader.js"></script>
		<script type="text/javascript">
			alert("Start");

			loadScript("otherscript.js",function() {
				// Call something in other script
				DoOther();
			});

			alert("Stop");
		</script>
	</body>
  </html>
 * 
 * 
 * 
 * 
 * 
 * 
 */ 

// FIX del fatto che IE<=8 non implementa la funzione standard degli array indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(obj, start) {
	     for (var i = (start || 0), j = this.length; i < j; i++) {
	         if (this[i] === obj) { return i; }
	     }
	     return -1;
	}
}

if(!String.format){
	String.format = function(format) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    return format.replace(/{(\d+)}/g, function(match, number) { 
	      return typeof args[number] != 'undefined'
	        ? args[number] 
	        : match
	      ;
	    });
	};
}