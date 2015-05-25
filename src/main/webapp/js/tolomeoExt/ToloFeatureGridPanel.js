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
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo � un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo � un software libero; � possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo � distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo � sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

/**
 * Plugin per il display di feature vettoriali 
 * in una griglia ExtJs.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloFeatureGridPanel', {

	extend: 'Ext.Panel',

	alias: "widget.tolomeo_featurecomponent",
	
	id: "tolomeo_featuregrid",

	/**
	 * @property {Object} paramsJS
	 * Configurazioni specifiche del file di preset.
	 */
	paramsJS: null,

	/**
	 * @cfg {String} TOLOMEOServer
	 * URL di base del contesto di Tolomeo.
	 */
	TOLOMEOServer: null,

	/**
	 * @cfg {String} TOLOMEOContext
	 * Contesto di Tolomeo.
	 */
	TOLOMEOContext: null,

	/**
	 * @property {Object} schema
	 * Schema nome e tipo degli attributi usati per la configurazione delle griglia
	 */
	schema: null,

	/**
	 * @cfg {TolomeoExt.ToloFeatureManager} qbFeatureManager (required)
	 * Gestore di richieste e operazioni che coinvolgono le features.
	 */
	qbFeatureManager: null,

	/**
	 * @property {TolomeoExt.events.ToloQueryBuilderEvtManager} qbEventManager
	 * Gestore di eventi per il query builder.
	 */
	qbEventManager: null,
		
    /**
	 * @property {OpenLayers.Layer.Vector} featureLayer 
	 * Layer vettoriale contenente le features corrispondenti alla ricerca.
	 */
	featureLayer: null,
	
	/**
     * Inizializza un oggeto di tipo TolomeoExt.ToloFeatureGridPanel.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config) {		
		
		if(!this.featureLayer){
			this.featureLayer = new OpenLayers.Layer.Vector("gridFeatureLayer", {
				displayInLayerSwitcher: false
			});
		}
		
		if(!this.qbEventManager){
			this.qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
		}
		
		this.qbFeatureManager.setProxy();
		this.qbFeatureManager.setFeatureStore(Ext.create('Ext.data.JsonStore', {
			fields: [],
			pageSize: this.qbFeatureManager.maxFeatures,
			proxy: this.qbFeatureManager.getProxy()
		}));
		
		var exportMenu = Ext.create('Ext.button.Split', {
            tooltip: 'Esporta Dati',
            iconCls: "pageexport",
            menu : {
                items: [{
                    text: 'Esporta SHP',
                    menu: {
                        showSeparator: false,
                        items: [{
							text: "Tutte le pagine",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "shp", items: "all"});
							}, 
							scope: this
						}, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "shp", items: "single"});
							}, 
							scope: this
						}]
                    }
                }, {
                    text: 'Esporta Spatialite',
                    name: "spatialiteExporter",
                    menu: {
                      showSeparator: false,
                      items: [{
							text: "Tutte le pagine",							
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "spatialite", items: "all"});
							}, 
							scope: this
					   }, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "spatialite", items: "single"});
							}, 
							scope: this
					   }]
                    }
                }, {
                    text: 'Esporta CSV',
                    menu: {
                      showSeparator: false,
                      items: [{
							text: "Tutte le pagine",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "csv", items: "all"});
							}, 
							scope: this
					   }, {
							text: "Pagina corrente",
							handler: function(){
								this.qbFeatureManager.fireEvent("export", {format: "csv", items: "single"});
							}, 
							scope: this
					   }]
                    }
                }]
            }
		});
        
		config = Ext.apply({
			xtype: "tolomeo_featuregrid",
			autoScroll: true,
			header: {
				hidden: true
			},
			height: 250,
			border: false,
			title: this.title,
			store: this.qbFeatureManager.featureStore,
			colums: [],
		    dockedItems: [{
		        xtype: 'pagingtoolbar',
		        store: this.qbFeatureManager.featureStore,   // same store GridPanel is using
		        dock: 'bottom',
		        displayInfo: true,
		        disabled: true,
		        items: [
					{
						tooltip: "Visualizza su Mappa",
						name: "viewOnMapButton",
						enableToggle: true,
						iconCls: "pageviewonmap",
						handler: function(button){
							this.updateLayerOnMap(this.qbFeatureManager.featureStore, button.pressed);
						},
						scope: this
					},
					{
						tooltip: "Zoom alla Pagina",
						name: "zoomOnPageButton",
					    iconCls: "pagezoomonmap",
						handler: function(){
							this.qbEventManager.fireEvent("zoomtomapextent", {dataExtent: this.pageBBOx});
						}, 
						scope: this
					}, "-", exportMenu
		        ]
		    }],
		    listeners:{
		    	scope: this,
		    	zoomtofeatureextent: function(evt){
		    		this.qbEventManager.fireEvent("zoomtomapextent", evt);
		    	}
		    }
		}, config || {});

		this.items = [config];
		this.callParent();
		
		this.on("afterrender", function(){
			this.waitMask = new Ext.LoadMask(this.id, {msg: "Ricerca in corso..."});
		}, this);

		// /////////////////////////////////////
		// FeatureManager events's listeners
		// /////////////////////////////////////
		this.qbFeatureManager.on({
			scope: this,
			layerchange: function(results){
				this.ownerCt.expand();
				
				var featureGrid = this.query("tolomeo_featuregrid")[0];
				featureGrid.setStore(featureGrid.store, results);
			},
			loadfeatures: function(results, store){
				this.waitMask.hide();
				this.ownerCt.expand();
			},
			loadfeaturesfailure: function(){
				this.waitMask.hide();
			},
			resetfeaturelayer: function(){
				this.updateLayerOnMap(null, false);
				
				//
        		// Disable the paging toolbar
        		//
        		this.query("pagingtoolbar")[0].disable();
        		
        		// Collapse the Grid
//        		this.ownerCt.collapse();
			}
		});
		
    	this.qbFeatureManager.featureStore.on("beforeload", function(store, operation, eOpts){
    		if(operation){
    			//this.qbFeatureManager.maxFeatures = operation.limit;
    			//this.qbFeatureManager.startIndex = operation.start;
    		}
    	}, this);
    	
    	
    	this.qbFeatureManager.on("beforeloadfeatures", function(codTPN){this.queriedCodTPN = codTPN;},this);
    	
    	this.qbFeatureManager.featureStore.on("load", function(store, records, successful, eOpts){
    		if(records && records.length > 0){
        		var proxy = store.getProxy();
        		var reader = proxy.getReader();
        		var metadata = reader.metaData;
        		
        		this.pageBBOx = OpenLayers.Geometry.fromWKT(metadata.pageBBOX).getBounds();
        		
        		//
        		// Enable the paging toolbar
        		//
        		this.query("pagingtoolbar")[0].enable();
        		
        		//
        		// Check if the vector layers on map should be updated
        		//
        		var button = this.query("[name=viewOnMapButton]")[0];
        		if(button.pressed){
        			this.updateLayerOnMap(store, button.pressed);
        		}
        		
        		this.query("[name=spatialiteExporter]")[0].setDisabled(!this.paramsJS.withSpatialiteExporter(this.queriedCodTPN));
        		
    		}else{
                Ext.Msg.show({
                    title: "Informazioni sul risultato",
                    msg: "La ricerca non ha prodotto risultati.",
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.INFO
                });
    		}
    	}, this);
	},
	
	/**
     * Aggiorna il layer vettoriale sulla mappa aggiornando le features in esso contenute.
     * @param {Ext.Data.Store} store Un oggetto che rappresenta lo store della griglia. 
	 * @param {Boolean} pressed Indica se il relativo pulsante nella paging toolbar � premuto.
     */
	updateLayerOnMap: function(store, pressed){
		if(pressed){
			var store = this.qbFeatureManager.featureStore;
			var count = store.getCount(); // the elements inside the current page
			var records = store.getRange(0, count-1);
			
			// Create the OL features vector
			var features = [];
			for(var i=0; i<records.length; i++){
				var record = records[i];
				
				var attributes = {};
				for(key in record.data){
					if(key != "geometry"){
						attributes[key] = record.data[key];
					}
				}
				
				var geometry = OpenLayers.Geometry.fromWKT(record.data.geometry);
				var feature = new OpenLayers.Feature.Vector(geometry, attributes, null);
				features.push(feature);						
			}
			
			this.featureLayer.removeAllFeatures();
			this.featureLayer.addFeatures(features);
			this.qbEventManager.fireEvent("addlayer", this.featureLayer);
		}else{
			this.qbEventManager.fireEvent("removelayer", this.featureLayer);
		}
	}

});

