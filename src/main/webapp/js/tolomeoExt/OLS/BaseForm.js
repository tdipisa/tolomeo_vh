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
 * Class: TolomeoExt.OLS.BaseForm
 * Form base
 * @author Ugo Paternostro <br/>phoops s.r.l.
 */
Ext.define('TolomeoExt.OLS.BaseForm', {
	extend: 'Ext.form.FormPanel',
	
	/** 
	 * Property: srid
	 * {} sistema di riferimento in cui sono espresse le coordinate
	 */
	srid: null,
	
	/** 
	 * Property: url
	 * {} URL dove è esposto il server OpenLS
	 */
    url: 'http://localhost/geoserver/ols',
	
	/** 
	 * Property: username
	 * {} utente per l'autenticazione OpenLS
	 */
	username: null,
	
	/** 
	 * Property: password
	 * {} password per l'autenticazione OpenLS
	 */
	password: null,
	
	/** 
	 * Property: useProxyServlet
	 * {} forza l'utilizzo della TolomeoProxyServlet
	 */
	useProxyServlet: false,
	
	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,
	
    initComponent:function() {
    	var config = 
    	{
		    xlsNamespace:	'http://www.opengis.net/xls',
		    gmlNamespace:	'http://www.opengis.net/gml',
		    xlsVersion:		'1.2',
		    
		    submitRequest: function(method, requestId, xmlBuilderCallback, successCallback) {
		    	var	me = this;
		    	
	        	document.body.style.cursor = "wait";
	        	
		   		var xmlhttp = null;
				
		   		if (window.XMLHttpRequest) {
		    		// code for IE7+, Firefox, Chrome, Opera, Safari
		   			xmlhttp = new XMLHttpRequest();
		   		} else {
		    		// code for IE6, IE5
		   			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		   		}
		   		
		   		var url = this.url;
		   		
		   		if (this.useProxyServlet) {
		   			url = this.TOLOMEOContext + "/TolomeoProxyServlet?" + this.url;
		   		}
		   		
		   		// Handle POST request
		   		xmlhttp.open("POST", url);
		   		
		   		xmlhttp.onreadystatechange = function() {
		   			if (xmlhttp.readyState == 4)
		   			{
		   			    switch (xmlhttp.status)
		   			    {
			   			    case 200:
			   			    	if (xmlhttp.responseXML != null) {
				   			    	// Check the workspace error;
				   			    	var errorMess = xmlhttp.responseXML.toString();
				   			    	
				   			    	if (errorMess != "noWorkspace") {
							        	// lvl 0
							        	var xls = xmlhttp.responseXML.firstChild;

							        	if (xls != null && xls.localName == 'XLS' && xls.namespaceURI == me.xlsNamespace) {
								        	// lvl 1
								        	var responseList = xls.getElementsByTagNameNS(me.xlsNamespace, "Response");
								        	
								        	if (responseList != null && responseList.length == 1) {
							   			    	successCallback.call(me, responseList.item(0));
								        	} else {
									    		Ext.MessageBox.alert('Errore', 'No Response found in response!');
								        	}
							        	} else {
								    		Ext.MessageBox.alert('Errore', 'No XLS found in response!');
							        	}
				   			    	} else {
				   			    		Ext.MessageBox.alert('Errore', 'No Workspace Found! Insert a correct Workspace Name');
				   			    	}
			   			    	} else {
			   			    		Ext.MessageBox.alert('Errore', 'No Workspace Found! Insert a correct Workspace Name');
			   			    	}
			   			        break;
						    case 401:
						    	Ext.MessageBox.alert('Errore', "Errore 401 Unauthorized!");
						        break;
						    case 404:
						    	Ext.MessageBox.alert('Errore', "Errore 404 Service Not Found!");
						        break;
						    case 500:
						    	var dlg = new Ext.window.MessageBox({autoScroll: true}).show({
						    		title: 'Errore', 
						    		msg: "Error 500 calling method " + method + "<br><br>Do you want to see detailed error message?",
						    		buttons: Ext.Msg.YESNO,
						    	    icon: Ext.Msg.ERROR,
						    	    fn: function(btn) {
						    	        if (btn === 'yes') {
									    	new Ext.window.MessageBox({autoScroll: true}).alert('Errore', xmlhttp.responseText);
						    	        } 
						    	    }
						    	});
						    	dlg.defaultButton = 2;
						    	break;
						    default:
						    	Ext.MessageBox.alert('Errore', "Errore " + xmlhttp.status + " " + xmlhttp.responseText);
						    	break;
		   			    }
		   			    
				    	document.body.style.cursor = "default";
		   			}    
		   	    };
		   	    
		   	    var dom = this.createEmptyXMLDoc('XLS xmlns="' + this.xlsNamespace + '"');
				var root = dom.documentElement;
				root.setAttribute("version",	this.xlsVersion);
				var header = dom.createElementNS(this.xlsNamespace, 'RequestHeader');
				header.setAttribute("srsName",	this.srid);
				if (this.username != null && this.username != "") {
					header.setAttribute("clientName", this.username);
				}
				if (this.password != null && this.password != "") {
					header.setAttribute("clientPassword", this.password);
				}
				root.appendChild(header);
				var request = dom.createElementNS(this.xlsNamespace, 'Request');
				request.setAttribute("methodName",	method);
				request.setAttribute("version",		this.xlsVersion);
				request.setAttribute("requestID",	requestId);
				root.appendChild(request);
				
				xmlBuilderCallback.call(me, dom, request);
				
		   	    xmlhttp.send(dom);
		   	},
		   	createEmptyXMLDoc: function(root)
		   	{
		   		var xmlDoc;
		   		
		   		if (window.DOMParser) {
			   		parser=new DOMParser();
			   		xmlDoc=parser.parseFromString("<" + root + "/>", "text/xml");
		   		} else {
		   			// Internet Explorer
			   		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			   		xmlDoc.async="false";
			   		xmlDoc.loadXML("<" + root + "/>");
		   		}
		   		
		   		return xmlDoc;
		   	},
	        buildPosition: function(dom, pointObj, srsName)
	        {
	        	var	position = dom.createElementNS(this.xlsNamespace, 'Position');
	        	var	point = dom.createElementNS(this.gmlNamespace, 'Point');
	        	var	pos = dom.createElementNS(this.gmlNamespace, 'pos');
	        	pos.setAttribute("srsName", srsName)
	        	var	posValue = dom.createTextNode(pointObj.x + " " + pointObj.y);
	        	pos.appendChild(posValue);
	        	point.appendChild(pos);
	        	position.appendChild(point);
	        	
	        	return position;
	        },
	        parseGeocodedAddresses: function(geocodedAddressList, isMatchCodeMandatory)
	        {
	        	var geocodedAddresses = [];
	        	
	        	for (var i = 0; i < geocodedAddressList.length; i++) {
	        		var item = geocodedAddressList.item(i);
	        		
		        	// lvl 5
		        	var pointList = item.getElementsByTagNameNS(this.gmlNamespace, "Point");
		        	
		        	if (pointList == null || pointList.length != 1) {
			    		Ext.MessageBox.alert('Error', 'No Point found in geocoding response!');
		        		return;
		        	}
	        		
		        	var postalCodeList = item.getElementsByTagNameNS(this.xlsNamespace, "PostalCode");
		        	
//		        	if (postalCodeList == null || postalCodeList.length != 1) {
//			    		Ext.MessageBox.alert('Error', 'No PostalCode found in geocoding response!');
//		        		return;
//		        	}
		        	
		        	var addressList = item.getElementsByTagNameNS(this.xlsNamespace, "Address");
		        	
		        	if (addressList == null || addressList.length != 1) {
			    		Ext.MessageBox.alert('Error', 'No Address found in geocoding response!');
		        		return;
		        	}
		        	
		        	var address = addressList.item(0);
	        		
		        	var gmcList = item.getElementsByTagNameNS(this.xlsNamespace, "GeocodeMatchCode");
		        	
		        	if (gmcList == null || (isMatchCodeMandatory && gmcList.length != 1)) {
			    		Ext.MessageBox.alert('Error', 'No GeocodeMatchCode found in geocoding response!');
		        		return;
		        	}
	        		
		        	var gmc = gmcList.item(0);
	        		
		        	// lvl 6
		        	var posList = pointList.item(0).getElementsByTagNameNS(this.gmlNamespace, "pos");
		        	
		        	if (posList == null || posList.length != 1) {
			    		Ext.MessageBox.alert('Error', 'No pos found in geocoding response!');
		        		return;
		        	}
		        	
		        	var pos = posList.item(0);
	        		
		        	var streetAddressList = address.getElementsByTagNameNS(this.xlsNamespace, "StreetAddress");
		        	
		        	if (streetAddressList == null || streetAddressList.length != 1) {
			    		Ext.MessageBox.alert('Error', 'No StreetAddress found in geocoding response!');
		        		return;
		        	}
	        		
		        	var placeList = address.getElementsByTagNameNS(this.xlsNamespace, "Place");
		        	
		        	if (placeList == null || placeList.length < 1) {
			    		Ext.MessageBox.alert('Error', 'No Place found in geocoding response!');
		        		return;
		        	}
	        		
		        	// lvl 7
		        	var streetList = streetAddressList.item(0).getElementsByTagNameNS(this.xlsNamespace, "Street");
		        	
		        	if (streetList == null || streetList.length != 1) {
			    		Ext.MessageBox.alert('Error', 'No Street found in geocoding response!');
		        		return;
		        	}
	        		
		        	// let's rock
	        		var position = pos.firstChild.nodeValue.split(" ");
	        		var postalCode = "";
	        		var places = {};
	        		
	        		if (postalCodeList != null && postalCodeList.length == 1) {
	        			postalCode = postalCodeList.item(0).firstChild.nodeValue;
	        		}
	        		
	        		for (var j = 0; j < placeList.length; j++) {
	        			var place = placeList.item(j);
	        			
	        			places[place.getAttribute("type")] = place.firstChild.nodeValue;
	        		}
	        		
	        		geocodedAddresses.push(
		        		new GeocodedAddress(
			        			new Point(
			        				position[0],
			        				position[1]
			        			),
			        			pos.getAttribute("srsName"),
			        			postalCode,
			        			new Address(
			        					address.getAttribute("countryCode"),
			        				new StreetAddress(
			        					streetList.item(0).firstChild.nodeValue
			        				),
			        				places
			        			),
			        			gmc == null ? null : new GeocodeMatch(
			        				gmc.getAttribute("accuracy"),
			        				gmc.getAttribute("type")
			        			)
			        		)
	        		);
	        	}
	        	
	        	return geocodedAddresses;
	        }
    	};
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
    }
});