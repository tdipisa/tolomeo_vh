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
 * Class: TolomeoExt.ToloOLSPanelExt
 * Funzioni pubbliche di geocoding/reversegeocoding/routing & navigation
 * @author Ugo Paternostro <br/>phoops s.r.l.
 */
Ext.define('TolomeoExt.OLS.ToloOLSPanelExt', {

	extend: 'Ext.Panel',
	//requires: [],


	/** 
	 * Property: paramsJS
	 * {JSONObject}
	 */
	paramsJS: null,

	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,
	
	/** 
	 * Property: iconBasePath
	 * 
	 */
	iconBasePath: null,
	
	/** 
	 * Property: model
	 * 
	 */
	model: null,
	
	/** 
	 * Property: pnlGeocoding
	 * {}
	 */
	pnlGeocoding: null,

	/** 
	 * Property: pnlGeocodingList
	 * {}
	 */
	pnlGeocodingList: null,
	
	/** 
	 * Property: wndGeocodingList
	 * {}
	 */
	wndGeocodingList: null,
	
	/** 
	 * Property: pnlReverseGeocoding
	 * {}
	 */
	pnlReverseGeocoding: null,

	/** 
	 * Property: pnlReverseGeocoding
	 * {}
	 */
	pnlRoutingNavigation: null,

	/** 
	 * Property: pnlNavigationSummary
	 * {}
	 */
	pnlNavigationSummary: null,
	
	/** 
	 * Property: pnlNavigationList
	 * {}
	 */
	pnlNavigationList: null,

	/** 
	 * Property: wndNavigationList
	 * {}
	 */
	wndNavigationList: null,

	/** 
	 * Property: pnlViaList
	 * {}
	 */
	pnlViaList: null,

	/**
	 * Constructor: TolomeoExt.ToloOLSPanelExt
	 * Crea un nuovo TolomeoExt.ToloOLSPanelExt
	 *
	 * Returns:
	 * {<TolomeoExt.ToloOLSPanelExt>} Un nuovo TolomeoExt.ToloOLSPanelExt
	 */
	initComponent: function() {
    	this.addEvents('geocodingDataReceived');
    	this.addEvents('reverseGeocodingDataReceived');
    	this.addEvents('addressFocus');
    	this.addEvents('addressBlur');
    	this.addEvents('addressSelected');
    	this.addEvents('startAddressSelected');
    	this.addEvents('endAddressSelected');
    	this.addEvents('viaAddressAdded');
    	this.addEvents('reset');
    	this.addEvents('methodChanged');
    	this.addEvents('routeReceived');
    	this.addEvents('navigationFocus');
    	this.addEvents('navigationBlur');
    	this.addEvents('navigationSelected');
    	this.addEvents('viaPointFocus');
    	this.addEvents('viaPointBlur');
    	this.addEvents('viaPointSelected');
    	this.addEvents('viaPointsChanged');
    	
    	// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		this.layout = {
						type: 'vbox',
						align: 'stretch'
		};
		
		this.on('activate', this.focusFirstField);
		
		if (this.iconBasePath==null) this.iconBasePath =  TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'img/icone/16-default/';
		
		this.model = new ToloOLSModel();
		
		if (this.paramsJS.layOut.ols.conGeocoding) {
			this.pnlGeocoding = Ext.create('TolomeoExt.OLS.GeocodingForm', {
				srid: this.paramsJS.mappe.SRID,
			    url: this.paramsJS.layOut.ols.url,
				username: this.paramsJS.layOut.ols.username,
				password: this.paramsJS.layOut.ols.password,
			    useProxyServlet: this.paramsJS.layOut.ols.useProxyServlet,
			    TOLOMEOContext: this.TOLOMEOContext,
			});			
		}
		
		this.pnlGeocodingList = Ext.create('TolomeoExt.OLS.GeocodingListPanel', {
			iconBasePath: this.iconBasePath,
			model: this.model
		});
		
		this.wndGeocodingList = Ext.create('Ext.window.Window', {
			title: "Dati geocoding",
			layout: 'fit',
			height: 400,
			width: 800,
			maximizable: true,
			closeAction: 'hide',
			items: [this.pnlGeocodingList]}); 
	
		
		this.pnlReverseGeocoding = Ext.create('TolomeoExt.OLS.ReverseGeocodingForm', {
		    url: this.paramsJS.layOut.ols.url,
			username: this.paramsJS.layOut.ols.username,
			password: this.paramsJS.layOut.ols.password,
		    useProxyServlet: this.paramsJS.layOut.ols.useProxyServlet,
		    TOLOMEOContext: this.TOLOMEOContext
		});
		
		this.pnlRoutingNavigation = Ext.create('TolomeoExt.OLS.RoutingNavigationForm', {
			srid: this.paramsJS.mappe.SRID,
		    url: this.paramsJS.layOut.ols.url,
			username: this.paramsJS.layOut.ols.username,
			password: this.paramsJS.layOut.ols.password,
		    useProxyServlet: this.paramsJS.layOut.ols.useProxyServlet,
		    TOLOMEOContext: this.TOLOMEOContext,
			model: this.model
		});
		
		this.pnlNavigationList = Ext.create('TolomeoExt.OLS.NavigationListPanel', {
			model: this.model, 
			flex: 1
		});
		
		this.pnlNavigationSummary = Ext.create('TolomeoExt.OLS.NavigationSummaryPanel', {
			model: this.model
		}); 
		
		this.wndNavigationList = Ext.create('Ext.window.Window', {
			title: "Dati navigazione",
			//layout: 'fit',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			height: 400,
			width: 500,
			maximizable: true,
			closeAction: 'hide',
			items: [this.pnlNavigationSummary, this.pnlNavigationList]}); 
		
		
		this.pnlViaList = Ext.create('TolomeoExt.OLS.ViaListPanel', {
			iconBasePath: this.iconBasePath,
			model: this.model,
			flex: 1
		});
		
		this.callParent();
		
		if (this.pnlGeocoding) {
			this.add(this.pnlGeocoding);
			
			this.pnlGeocoding.on('dataReceived', this.olsGeocodingDataReceivedHandler, this);
			   
	    	this.pnlGeocodingList.on('addressFocus', this.addressFocusHandler, this);
	    	this.pnlGeocodingList.on('addressBlur', this.addressBlurHandler, this);
	    	this.pnlGeocodingList.on('addressSelected', this.addressSelectedHandler, this);
	    	this.pnlGeocodingList.on('startAddressSelected', this.startAddressSelectedHandler, this);
	    	this.pnlGeocodingList.on('endAddressSelected', this.endAddressSelectedHandler, this);
	    	this.pnlGeocodingList.on('viaAddressSelected', this.viaAddressSelectedHandler, this);

		}
    	
		this.add(this.pnlViaList);
		
    	this.pnlReverseGeocoding.on('dataReceived', this.olsReverseGeocodingDataReceivedHandler, this);

    	this.pnlRoutingNavigation.on('methodChanged', this.methodChangedHandler, this);
    	this.pnlRoutingNavigation.on('reset', this.resetHandler, this);
    	this.pnlRoutingNavigation.on('routeReceived', this.routeReceivedHandler, this);

    	this.pnlNavigationList.on('navigationFocus', this.navigationFocusHandler, this);
    	this.pnlNavigationList.on('navigationBlur', this.navigationBlurHandler, this);
    	this.pnlNavigationList.on('navigationSelected', this.navigationSelectedHandler, this);
    	
    	this.pnlViaList.on('viaPointFocus', this.viaPointFocusHandler, this);
    	this.pnlViaList.on('viaPointBlur', this.viaPointBlurHandler, this);
    	this.pnlViaList.on('viaPointSelected', this.viaPointSelectedHandler, this);
    	this.pnlViaList.on('deleteViaPoint', this.deleteViaPointHandler, this);
    	this.pnlViaList.on('moveViaPoint', this.moveViaPointHandler, this);
    },
    
    // metodi privati
	
	// handler
	focusFirstField:function() {
		if ( this.pnlGeocoding && this.pnlGeocoding.items && this.pnlGeocoding.items.items.size>0) this.pnlGeocoding.items.items[0].focus(false, 30); 	
	},	
	olsGeocodingDataReceivedHandler: function(requestId, geocodedAddresses) {
		this.model.geocodedAddresses = geocodedAddresses;
		
		// Da spostare nella vista quando si fara' la separazione View-Controller
	    this.pnlGeocodingList.refreshData();
	    this.wndGeocodingList.show();
	    
    	this.fireEvent('geocodingDataReceived', geocodedAddresses);
	},
	olsReverseGeocodingDataReceivedHandler: function(requestId, geocodedAddresses) {
		if (requestId == "RGRid:USERPOINT") {
			if (geocodedAddresses.length>0) {
				this.model.geocodedAddresses = geocodedAddresses;
				
				// Da spostare nella vista quando si fara' la separazione View-Controller
			    this.pnlGeocodingList.refreshData();
			    this.wndGeocodingList.show();
			} else {
				Ext.MessageBox.alert('Informazione', 'Nessun indirizzo trovato vicino a questa posizione');
        		return;
			}
			
	    	this.fireEvent('reverseGeocodingDataReceived', geocodedAddresses);
		} else if (requestId == "RGRid:STARTPOINT") {
			if (geocodedAddresses.length>0) {
				this.model.startPoint.street = geocodedAddresses[0].address.streetAddress.street;
				this.pnlRoutingNavigation.changeStartAddress();
			}
		} else if (requestId == "RGRid:ENDPOINT") {
			if (geocodedAddresses.length>0) {
				this.model.endPoint.street = geocodedAddresses[0].address.streetAddress.street;
				this.pnlRoutingNavigation.changeEndAddress();
			}
		} else {
			// richiesta relativa ad un VIA point: id della forma RGRid:VIAPOINT:number
			var idArray = requestId.split(":");
			
			for (var i = 0; i < this.model.viaPoints.length; i++) {
				if (this.model.viaPoints[i].id == idArray[2]) {
					if (geocodedAddresses.length>0) {
						this.model.viaPoints[i].street = geocodedAddresses[0].address.streetAddress.street;
					} else {
						this.model.viaPoints[i].street = "Coordinate " + this.model.viaPoints[i].point.x.toFixed(4) + " " + this.model.viaPoints[i].point.y.toFixed(4) ;
					}	
					this.pnlViaList.changeViaAddresses();
					break;
				}
			}
		}
	},
	addressFocusHandler: function(record) {
        var street = record.raw.address.streetAddress.street;
        var geometry = record.raw.geometry;
		
    	this.fireEvent('addressFocus', street, geometry.x, geometry.y, record.raw.srsName);
	},
	addressBlurHandler: function(record) {
        var street = record.raw.address.streetAddress.street;
        var geometry = record.raw.geometry;
		
    	this.fireEvent('addressBlur', street, geometry.x, geometry.y, record.raw.srsName);
	},
	addressSelectedHandler: function(record) {
        var street = record.raw.address.streetAddress.street;
        var geometry = record.raw.geometry;
		
    	this.fireEvent('addressSelected', street, geometry.x, geometry.y, record.raw.srsName, this.paramsJS.layOut.ols.zoomLevel);
	},
	startAddressSelectedHandler: function(record) {
        var street = record.raw.address.streetAddress.street;
        var geometry = record.raw.geometry;
        var srsName = record.raw.srsName;

        this.setStartAddress(geometry, srsName, street);
    	this.fireEvent('startAddressSelected', street, geometry.x, geometry.y, srsName, this.paramsJS.layOut.ols.zoomLevel);
	},
	endAddressSelectedHandler: function(record) {
        var street = record.raw.address.streetAddress.street;
        var geometry = record.raw.geometry;
        var srsName = record.raw.srsName;
		
        this.setEndAddress(geometry, srsName, street);
    	this.fireEvent('endAddressSelected', street, geometry.x, geometry.y, srsName, this.paramsJS.layOut.ols.zoomLevel);
	},
	viaAddressSelectedHandler: function(record) {
        var street = record.raw.address.streetAddress.street;
        var geometry = record.raw.geometry;
        var srsName = record.raw.srsName;
        var viaId = this.addViaAddress(geometry, srsName, street);
        
    	this.fireEvent('viaAddressAdded', viaId, street, geometry.x, geometry.y, srsName, this.paramsJS.layOut.ols.zoomLevel);
	},
	methodChangedHandler: function(method) {
		this.model.method = method;
		this.pnlRoutingNavigation.submit();
		
    	this.fireEvent('methodChanged', method);
	},
	resetHandler: function() {
		this.reset();
		
    	this.fireEvent('reset');
	},
	routeReceivedHandler: function(requestId, routeResponse) {
		this.model.routeResponse = routeResponse;
		
		// Da spostare nella vista quando si fara' la separazione View-Controller
	    this.wndGeocodingList.close();
	    this.pnlNavigationList.refreshData();
	    this.pnlNavigationSummary.refreshData();
	    this.wndNavigationList.show();
	    
    	this.fireEvent('routeReceived', routeResponse);
	},
	navigationFocusHandler: function(index) {
		var instruction = this.model.routeResponse.instructions[index]
		
    	this.fireEvent('navigationFocus', instruction, this.paramsJS.mappe.SRID);
	},
	navigationBlurHandler: function(index) {
		var instruction = this.model.routeResponse.instructions[index]
		
    	this.fireEvent('navigationBlur', instruction, this.paramsJS.mappe.SRID);
	},
	navigationSelectedHandler: function(index) {
		var instruction = this.model.routeResponse.instructions[index]
		
    	this.fireEvent('navigationSelected', instruction, this.paramsJS.mappe.SRID, this.paramsJS.layOut.ols.zoomLevel);
	},
	viaPointFocusHandler: function(record) {
        var geometry = record.raw.point;
		
    	this.fireEvent('viaPointFocus', record.raw.id, record.raw.street, geometry.x, geometry.y, this.paramsJS.mappe.SRID);
	},
	viaPointBlurHandler: function(record) {
        var geometry = record.raw.point;
		
    	this.fireEvent('viaPointBlur', record.raw.id, record.raw.street, geometry.x, geometry.y, this.paramsJS.mappe.SRID);
	},
	viaPointSelectedHandler: function(record) {
        var geometry = record.raw.point;
		
    	this.fireEvent('viaPointSelected', record.raw.id, record.raw.street, geometry.x, geometry.y, this.paramsJS.mappe.SRID, this.paramsJS.layOut.ols.zoomLevel);
	},
	deleteViaPointHandler: function(index) {
		this.model.viaPoints.splice(index, 1);
		
		// Da spostare nella vista quando si fara' la separazione View-Controller
    	this.pnlRoutingNavigation.changeViaAddresses();
        this.pnlViaList.changeViaAddresses();
		
		this.pnlRoutingNavigation.submit();
		
    	this.fireEvent('viaPointsChanged', this.model.viaPoints);
	},
	moveViaPointHandler: function(index, delta) {
		var via = this.model.viaPoints[index];
		this.model.viaPoints[index] = this.model.viaPoints[index+delta];
		this.model.viaPoints[index+delta] = via;
		
		// Da spostare nella vista quando si fara' la separazione View-Controller
    	this.pnlRoutingNavigation.changeViaAddresses();
        this.pnlViaList.changeViaAddresses();
		
		this.pnlRoutingNavigation.submit();
		
    	this.fireEvent('viaPointsChanged', this.model.viaPoints);
	},
	
	// metodi pubblici
	reverseGeocode: function(geometry, srsName) {
    	this.pnlReverseGeocoding.reverseGeocode("RGRid:USERPOINT", geometry, srsName);
    },
    setStartAddress: function(geometry, srsName, street) {
    	this.model.startPoint = new ToloOLSVertex(
    		street || 'PARTENZA',
    		geometry.clone()
    	);
    	
    	if (this.paramsJS.mappe.SRID != srsName) {
	    	this.model.startPoint.point.transform(srsName, this.paramsJS.mappe.SRID);
    	}
		
		// Da spostare nella vista quando si fara' la separazione View-Controller
		this.pnlRoutingNavigation.changeStartAddress();
		
		this.pnlRoutingNavigation.submit();
		
		if (typeof street == "undefined") {
    		this.model.geometry = geometry;
    		this.model.srsName = srsName;
        	this.pnlReverseGeocoding.reverseGeocode("RGRid:STARTPOINT", geometry, srsName);
    	}
    },
    setEndAddress: function(geometry, srsName, street) {
    	this.model.endPoint = new ToloOLSVertex(
    		street || 'ARRIVO',
    		geometry.clone()
    	);
    	
    	if (this.paramsJS.mappe.SRID != srsName) {
	    	this.model.endPoint.point.transform(srsName, this.paramsJS.mappe.SRID);
    	}
    	
		// Da spostare nella vista quando si fara' la separazione View-Controller
		this.pnlRoutingNavigation.changeEndAddress();
		
		this.pnlRoutingNavigation.submit();
		
		if (typeof street == "undefined") {
    		this.model.geometry = geometry;
    		this.model.srsName = srsName;
        	this.pnlReverseGeocoding.reverseGeocode("RGRid:ENDPOINT", geometry, srsName);
    	}
    },
    addViaAddress: function(geometry, srsName, street) {
//        this._addViaAddress(geometry, srsName, street);
    	var viaId = this.model.viaPointId++;
    	
        var viaPoint = new ToloOLSVertex(
    		street || 'DESTINAZIONE INTERMEDIA',
    		geometry.clone(),
    		viaId
	    );
        
    	if (this.paramsJS.mappe.SRID != srsName) {
    		viaPoint.point.transform(srsName, this.paramsJS.mappe.SRID);
    	}
        
        this.model.viaPoints.push(viaPoint);

		// Da spostare nella vista quando si fara' la separazione View-Controller
    	this.pnlRoutingNavigation.changeViaAddresses();
        this.pnlViaList.changeViaAddresses();
		
		this.pnlRoutingNavigation.submit();
		
		if (typeof street == "undefined") {
    		this.model.geometry = geometry;
    		this.model.srsName = srsName;
        	this.pnlReverseGeocoding.reverseGeocode("RGRid:VIAPOINT:" + viaId, geometry, srsName);
    	}
		
		return viaId;
    },
    setMethod: function(method) {
    	this.model.method = method;
    	
		// Da spostare nella vista quando si fara' la separazione View-Controller
    	this.pnlRoutingNavigation.changeMethod();
    	
		this.pnlRoutingNavigation.submit();
    },
    moveViaAddress: function(viaId, geometry, srsName) {
		for (var i = 0; i < this.model.viaPoints.length; i++) {
			if (this.model.viaPoints[i].id == viaId) {
				this.model.viaPoints[i].point = geometry.clone();
				
		    	if (this.paramsJS.mappe.SRID != srsName) {
		    		this.model.viaPoints[i].point.transform(srsName, this.paramsJS.mappe.SRID);
		    	}
		    	
				this.pnlRoutingNavigation.submit();
		    	
	    		this.model.geometry = geometry;
	    		this.model.srsName = srsName;
	        	this.pnlReverseGeocoding.reverseGeocode("RGRid:VIAPOINT:" + viaId, geometry, srsName);
				break;
			}
		}
    },
    reset: function() {
		this.model.startPoint = null;
		this.model.endPoint = null;
    	this.model.viaPoints = [];
    	this.model.viaPointId = 0;
    	this.model.method = 'Fastest';
    	this.model.routeResponse = null;
    	
		this.pnlRoutingNavigation.changeStartAddress();
		this.pnlRoutingNavigation.changeEndAddress();
    	this.pnlRoutingNavigation.changeViaAddresses();
        this.pnlViaList.changeViaAddresses();
    	this.pnlRoutingNavigation.changeMethod();
    	this.wndNavigationList.close();
    },
    
    routingInformationSelect: function(instructionId) {
    	this.pnlNavigationList.routingInformationSelect(instructionId);
	}, 
	
	routingInformationDeSelect: function(instructionId) {
		this.pnlNavigationList.routingInformationDeSelect(instructionId);
	}
    
});
