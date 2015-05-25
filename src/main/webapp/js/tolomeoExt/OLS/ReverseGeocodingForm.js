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
 * Class: TolomeoExt.OLS.ReverseGeocodingForm
 * Form di reverse geocoding
 * @author Ugo Paternostro <br/>phoops s.r.l.
 */
Ext.define('TolomeoExt.OLS.ReverseGeocodingForm', {
	extend: 'TolomeoExt.OLS.BaseForm',
	
	itemId: 'olsReverseGeocodingID',
	collapsible: true,
	
	pointObj: null,
	srsName: null,
	
	initComponent:function() {
		// Eventi
    	this.addEvents('dataReceived');
		
		var config = {
				itemId: 'formReverseId',
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        collapsed:true,
		        title: 'Reverse Geocoding Information',
		        bodyStyle:'padding:5px 5px 0',
//		        width: '22%',
		        cls: 'floating-form_left',
		        height: 100,
		        defaults: {width: 230},
		        defaultType: 'textfield',	
		        
		        items: [
				          {
				        	  fieldLabel: 'Latitudine',
				        	  itemId: 'lat',
				        	  disabled: true
				          },
				          {
				        	  fieldLabel: 'Longitudine	',	    	   
				        	  itemId: 'lon',
				        	  disabled : true
				          }
				        ],
				        
		        submit: function(requestId) {
	        		this.submitRequest("ReverseGeocodeRequest", requestId, this.buildXMLRequest, this.onSuccess);
		        },
		        buildXMLRequest: function(dom, request)
		        {
		        	var	reverseGeocodeRequest = dom.createElementNS(this.xlsNamespace, 'ReverseGeocodeRequest');
		        	var	position = this.buildPosition(dom, this.pointObj, this.srsName);
		        	reverseGeocodeRequest.appendChild(position);
		        	request.appendChild(reverseGeocodeRequest);
		        },
		        onSuccess: function(response)
		        {
		        	// lvl 2
		        	var rgrList = response.getElementsByTagNameNS(this.xlsNamespace, "ReverseGeocodeResponse");
		        	
		        	if (rgrList == null || rgrList.length != 1) {
		        		//Ext.MessageBox.alert('Informazione', 'Nessun indirizzo trovato vicino a questa posizione');
		        		this.fireEvent('dataReceived', response.getAttribute("requestID"), []);
		        		return;
		        	}
		        	
		        	// lvl 3
		        	var rglList = rgrList.item(0).getElementsByTagNameNS(this.xlsNamespace, "ReverseGeocodedLocation");
		        	
		        	if (rglList == null || rglList.length < 1) {
		        		//Ext.MessageBox.alert('Informazione', 'Nessun indirizzo trovato vicino a questa posizione');
		        		this.fireEvent('dataReceived', response.getAttribute("requestID"), []);
		        		return;
		        	}
		        	
   			    	this.fireEvent('dataReceived', response.getAttribute("requestID"), this.parseGeocodedAddresses(rglList, false));
		        },
		        reverseGeocode: function(requestId, geometry, srsName)
		        {
		        	this.pointObj = geometry;
		        	this.srsName = srsName;
		        	this.submit(requestId);
		        }
    	};
    	
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
	}
});
