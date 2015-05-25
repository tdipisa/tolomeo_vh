/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWPanel
 * Form che contiene il widget di ricerca.
 * 
 * Inherits from:
 *  - <Ext.Panel>
 *
 */
Ext.define('CSWPanel', {
 
	extend: 'Ext.Panel',

	alias: 'widget.csw',
	
    /**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
	/**
	 * Property: title
     * {string}aggiunge un titolo al pannello.
	 */ 
	title : "CSW Explorer",
    /**
	 * Property: defaults
     * {object} opzioni di default dei componenti contenuti nel pannello
	 */ 
	/*defaults: {
		collapsible: false,
		//split: true,
		bodyStyle: "padding: 2px",
		
	},*/
    /**
	 * Property: iconCls
     * {string} classe associata all'icona
	 */ 
    iconCls: "icon-table",
	
	
	/**
	 * Property: map
     * {object} opzionale. Mappa da associare al pannello.
	 */ 
	map : null,
	/**
	 * Property: config
	 * Oggetto per la configurazione  componente. Vedere <config.js>
	 *
	 */
	config : null,
	
	events : [
	
	"zoomToExtent",
    /**
	 * Event: zoomToExtent 
	 * Evento scatenato dalla pressione del tasto "Vis. Estensione" all'interno dei singoli record della griglia.
	 * 
	 * Parameters:
	 * el {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
	 * el.bbox - {Object} bounding Box del record
	 * el.crs  -  {Object}crs della boundingbox
	 */
	 "viewMap",
	 /**
	 * Event: viewMap
	 * Evento scatenato dalla pressione del tasto "Visualizza Mappa" all'interno dei singoli record della griglia.
	 *
	 * Parameters:
	 * layerInfo {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
	 * layerInfo.bbox - {object} bounding Box del record
	 * layerInfo.crs -  {string}crs del record
	 * layerInfo.Layers - {Array}. Array contenenti tutti i layer associati al record
	 * 
	 */
	 
	 "beforesearch"
	/**
	 * Event: beforesearch
	 * Evento scatenato prima dell'esecuzione di una ricerca per permettere la modifica di parametri al momento,
	 * come ad esempio il settaggio del bounding box attuale.
	 *
	 * Parameters:
	 * params {object} - oggetto contenente i parametri di ricerca. Contiene i seguenti campi:
	 * params.freeText {String} - testo cercato,
	 * params.lastModifiedBegin {String} - limite inferiore data ultima modifica,
	 * params.lastModifiedEnd {String} - limite superiore data ultima modifica,
	 * params.useBbox {boolean} - utilizzo del bounding box,
	 * params.dcValue {String} - campo ricerca,
	 * params.useAdvancedSearch {boolean} - utilizzo della ricerca avanzata
	 * 
	 */
	],
    
	autoWidth:true,
	autoHeight:true,
	border: false,
    
    
	//PRIVATE
	searchTool : null,

	cswGrid : null,
	
	/**
	 * Property: i18n
	 * {Ext.i18n.Bundle} bundle for i18n messages
	 * @type 
	 */
	i18n: null,
	
	
	initComponent : function() {
		
		//init GUI Components
		this.cswGrid = new CSWGrid({
			 loadMask: {msg: this.i18n.getMsg("loadWait")},
			 config: this.config,
             i18n: this.i18n,
			 map: new Ext.KeyMap(document, [{
				key: Ext.EventObject.ESC,
				fn: function(){
				
						if(this.cswGrid.store.proxy){
							this.cswGrid.store.proxy.getConnection().abort();
							this.cswGrid.loadMask.hide();
							//extenalize if possible
							this.searchTool.resetButton.enable();
							this.searchTool.searchButton.enable();
							this.searchTool.catalogChooser.enable();
						}
					
					},
					scope: this
				}])
		});
		
		this.searchTool = new CSWSearchTool({
		    grid: this.cswGrid,
			dcProperty : this.config.dcProperty,
			panel: this,
            autoHeight:true,
            style:"margin-left:5px;margin-right:5px;"  ,         
			bbox: new OpenLayers.Bounds(
					this.config.initialBBox.minx, 
					this.config.initialBBox.miny, 
					this.config.initialBBox.maxx, 
					this.config.initialBBox.maxy
			),
			filterVersion: this.config.filterVersion,
			i18n: this.i18n
		});				
		
		this.items = [ 
			{
			 xtype:'container',
			 layout:'fit',
			 autoHeight:true,
			 border: false,
			 items:[this.searchTool]
			 
			 },
			{
			 xtype:'container',
			 layout:'fit',
			 autoWidth: true,
			 //autoHeight:true,
			 border: false,
			 items:[this.cswGrid]  
			}
            
		];
		

		//event Handler associaton
		this.addEvents(this.events);
		
		this.initParameters(this.config.catalogs);
		this.callParent(arguments);
		
		this.relayEvents(this.searchTool,['beforesearch']);
		
	},

	/**
	 * Method: initParameter	
	 * Inizializza Il Pannello. Deve essere chiamato dopo
	 * che gli widget sono stati inizializzati con initComponent.
	 */
	initParameters : function (catalogs) {
		
		// Setup catalog chooser widget with catalogs stored in this instance
		this.searchTool.initParameters(catalogs);
		
		// Adds an event to clear up the resuls grid when a new
		// catalog is called and check the new catalog server is working
		var storeClosure = this.cswGrid.store; 

		
		this.searchTool.catalogChooser.addListener("select", 
			  function() {
					storeClosure.removeAll(); 
					storeClosure.catalogUrl = this.getValue();
                    
			  }
		);	
		
		this.searchTool.panel = this;
	},
	
	/**
	 * Method: setBBox	
	 * Imposta il bounding box di una ricerca.
	 * 
	 * Parameters:
	 * bbox - {Object} bounding box con i seguenti parametri:
	 * minx - x minima
	 * miny - y minima
	 * maxx - x massima
	 * maxy - y massima
	 */
	setBBox: function(bbox){
		if(bbox == null) return;
		this.searchTool.bbox = new OpenLayers.Bounds(
			bbox.minx, 
			bbox.miny, 
			bbox.maxx, 
			bbox.maxy
		)
	}
});
