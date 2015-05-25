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
 * Class: TolomeoExt.OLS.GeocodingForm
 * Form di geocoding
 * @author Ugo Paternostro <br/>phoops s.r.l.
 */
Ext.define('TolomeoExt.OLS.GeocodingForm', {
	extend: 'TolomeoExt.OLS.BaseForm',
	
	itemId: 'olsGeocodingID',
	collapsible: true,
	
    initComponent:function() {
		// Eventi
    	this.addEvents('dataReceived');
		
    	var config = 
    	{
		        labelWidth:		75, // label settings here cascade unless 	
		        frame:			true,
		        title:			'Ricerca indirizzo',
		        bodyStyle:		'padding:5px 5px 0',
		        cls:			'floating-form_left',
		        height:			150,
		        defaults: {
		        	width:		230
		        },
		        defaultType:	'textfield',
		        
		        items: [
		          {
		        	  xtype: 'combo',
		        	  store: new Ext.data.ArrayStore({
		        	        fields: [
		        	            'abbr',
		        	            'prov'
		        	        ],
		        	        data: [ ['AR', 'Arezzo - AR'], // @@@ FIXME!
		        	                ['FI', 'Firenze - FI'],
		        	                ['GR', 'Grosseto - GR'],
		        	                ['LI', 'Livorno - LI'],
		        	                ['LU', 'Lucca - LU'],
		        	                ['MS', 'Massa-Carrara - MS'],
		        	                ['PI', 'Pisa - PI'],
		        	                ['PT', 'Pistoia - PT'],
		        	                ['PO', 'Prato - PO'],
		        	                ['SI', 'Siena - SI']
		        	        	 ]
		        	    }),
		        	  valueField: 'abbr',
			          displayField: 'prov',
			          typeAhead: true,
			          mode: 'local',
			          forceSelection: true,
			          triggerAction: 'all',
			          emptyText:'Seleziona una Provincia...',
			          selectOnFocus:true,
		        	  fieldLabel: 'Provincia',
		        	  itemId: 'provincia',
		          },
		          {
		        	  fieldLabel: 'Comune	',	    	   
		        	  itemId: 'comune',
		        	  listeners: {
			              scope: this,
		                  specialkey: function(f, e) {
		                    if (e.getKey() == e.ENTER) {
		                    	this.submit();
		                    }
		                  },
		              },
		          },
		          {
		        	  fieldLabel: 'Toponimo',
		        	  itemId: 'via',
		        	  listeners: {
			              scope: this,
		                  specialkey: function(f, e) {
		                    if (e.getKey() == e.ENTER) {
		                    	this.submit();
		                    }
		                  },
		              },
		        	  validator: function(v) {
		        		  if (v === "" || v == null || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		  }
		        		  
		        		  return true;
		        	  },
		          },
		        ],
		        buttons: [
		            {
		            	text: 'Trova',
		            	scope: this,
		            	handler: function(toponimo) {
			        	  this.submit();
		            	},
		            },
		            {
		            	text: 'Pulisci',
		            	scope: this,
		            	handler: function(){
		            		this.items.get('provincia').setValue(null);
		            		this.items.get('comune').setValue(null);
		            		this.items.get('via').setValue(null);
			            }	
		            },
		        ],
		        submit: function() {
		        	if (this.items.get('provincia').isValid()
		        			&& this.items.get('comune').isValid()
		        			&& this.items.get('via').isValid()) {
		        		this.submitRequest("GeocodeRequest", "GRid", this.buildXMLRequest, this.onSuccess);
		        	}
		        },
		        buildXMLRequest: function(dom, request)
		        {
		        	var	geocodeRequest = dom.createElementNS(this.xlsNamespace, 'GeocodeRequest');
		        	var	address = dom.createElementNS(this.xlsNamespace, 'Address');
		        	address.setAttribute("countryCode", "IT");
		        	var	streetAddress = dom.createElementNS(this.xlsNamespace, 'StreetAddress');
		        	var	street = dom.createElementNS(this.xlsNamespace, 'Street');
		        	var	streetName = dom.createTextNode(this.items.get('via').getValue());
		        	street.appendChild(streetName);
		        	streetAddress.appendChild(street);
		        	address.appendChild(streetAddress);
		        	var	municipality = dom.createElementNS(this.xlsNamespace, 'Place');
		        	municipality.setAttribute("type", "Municipality");
		        	var	municipalityName = dom.createTextNode(this.items.get('comune').getValue());
		        	municipality.appendChild(municipalityName);
		        	address.appendChild(municipality);
		        	var	countrySecondarySubdivision = dom.createElementNS(this.xlsNamespace, 'Place');
		        	countrySecondarySubdivision.setAttribute("type", "CountrySecondarySubdivision");
		        	var	countrySecondarySubdivisionName = dom.createTextNode(this.items.get('provincia').getValue());
		        	countrySecondarySubdivision.appendChild(countrySecondarySubdivisionName);
		        	address.appendChild(countrySecondarySubdivision);
		        	var	postalCode = dom.createElementNS(this.xlsNamespace, 'PostalCode');
		        	address.appendChild(postalCode);
		        	geocodeRequest.appendChild(address);
		        	request.appendChild(geocodeRequest);
		        },
		        onSuccess: function(response)
		        {
		        	// lvl 2
		        	var grList = response.getElementsByTagNameNS(this.xlsNamespace, "GeocodeResponse");
		        	
		        	if (grList == null || grList.length != 1) {
			    		Ext.MessageBox.alert('Informazione', 'Indirizzo non trovato.');
		        		return;
		        	}
		        	
		        	// lvl 3
		        	var grlList = grList.item(0).getElementsByTagNameNS(this.xlsNamespace, "GeocodeResponseList");
		        	
		        	if (grlList == null || grlList.length != 1) {
		        		Ext.MessageBox.alert('Informazione', 'Indirizzo non trovato.');
		        		return;
		        	}
		        	
		        	// lvl 4
		        	var geocodedAddressList = grlList.item(0).getElementsByTagNameNS(this.xlsNamespace, "GeocodedAddress");
		        	
		        	if (geocodedAddressList == null || geocodedAddressList.length < 1) {
		        		Ext.MessageBox.alert('Informazione', 'Indirizzo non trovato.');
		        		return;
		        	}
		        	
   			    	this.fireEvent('dataReceived', response.getAttribute("requestID"), this.parseGeocodedAddresses(geocodedAddressList, true));
		        }
    	};
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
    }
});
