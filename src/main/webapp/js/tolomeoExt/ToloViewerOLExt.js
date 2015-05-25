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
 *   
 * @class Pannello ExtJs contenente una mappa visualizzata utilizzando openlayers. 
 * @param config {Object} Oggetto contenente i parametri di configurazione. Sono ammessi tutti i parametri previsti per ExtJS.Panel ed i seguenti parametri aggiuntivi
 * @param config.paramsJS {Object} Oggetto i parametri contenuti nel file di preset.
 * @param config.customQuery {String} [] Filtro di visualizzazione 
 * 
 */

/**
 * Class: TolomeoExt.ToloViewerOLPanel
 *
 * Inherits from:
 *  - <Ext.Panel>
 *
 */
Ext.define('TolomeoExt.ToloViewerOLPanel', {

	extend: 'Ext.Panel',	
	alias: 'tx_toloviewerOLPanel',
	
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
	 * Property: TOLOMEOStaticRoot
	 * {String}
	 */	
	TOLOMEOStaticRoot: null, 

	/** 
	 * Property: digitizeOperationInsert
	 * {OpenLayers.Map} Mappa openlayers viasualizzata in questo pannello
	 */
	map: null,

	/** 
	 * Property: mapControls
	 * {Openlayer.Controls} Vettore contenente i controlli openlayers attivi su map
	 */
	mapControls: null,
	
	/** 
	
	/** 
	 * Property: drawLayer
	 * {} 
	 */
	drawLayer: null,

	/** 
	 * Property: selezioniLayer
	 * {} 
	 */
	selezioniLayer: null,

	/** 
	 * Property: evidenziazioniLayer
	 * {}
	 */
	evidenziazioniLayer: null,
	
	 /**
	 * Property: routingLayer
	 * {}
	 */
	 routingLayer: null,
	 
	 /** 
	 * Property: routingMarkersLayer
	 * {}
	 */
	 routingMarkersLayer: null,
	 	
	 /** 
	  * Property: startMarker
	  * {}
	  */
	 startMarker: null,
	 
	 /** 
	 * Property: endMarker
	 * {}
	 */
	 endMarker: null,
	 
	 /** 
	  * Property: viaMarkers
	  * {}
	  */
	 viaMarkers: [],

	 /** 
	/** 
	 * Property: paramsJS
	 * {JSONObject} Oggetto i parametri contenuti nel file di preset.
	 */
	paramsJS: null, 

	/** 
	 * Property: customQuery
	 * {Object} Oggetto i parametri contenuti nel file di preset.
	 */
	customQuery: null,

	/** 
	 * Property: mapBusy
	 * {Integer}
	 */
	mapBusy: 0,

	/** 
	 * Property: myMask
	 * {}
	 */
	myMask: null,

	/** 
	 * Property: isAlreadyDrawn
	 * {} Variabile che indica se e' gia stata disegnata (utilizzato in preinit e postinit
	 */
	isAlreadyDrawn: null, 

	/** 
	 * Property: olViewerToolSelectSelectEventHandler
	 * {}
	 */
	olViewerToolSelectSelectEventHandler:  null, 

	/** 
	 * Property: mapPanel
	 * {} 
	 */
	mapPanel: null,

	/** 
	 * Property: measurePanel
	 * {}
	 */
	measurePanel: null, 

	/** 
	 * Property: timeMachinePanel
	 * {}
	 */
	timeMachinePanel: null, 
	
	/** 
	 * Property: scalePanel
	 * {}
	 */
	scalePanel: null, 
	
	/** 
	 * Property: withScaleLine
	 * {}
	 */
	withScaleLine: true,

	/** 
	 * Property: monitoito
	 * {Boolean}
	 */
	//monitorResize: true,

	/** 
	 * Property: bOnOpenDrawMap
	 * {Boolean} Indica se disegnare la mappa in apertura 
	 */
	bOnOpenDrawMap: null,
	
	styleSelected: null,
	
	styleHighlighted: null,
	
	styleAutoidentify: null,
	
	styleSnap: null,
	
	styleMeasure: null,
	measurePointSymbolizer: null,
	measureLineSymbolizer: null,
	measurePolygonSymbolizer: null,
	
	layerTypePrereq: [	[""],  // 0 - Mapserver
					   	["http://maps.google.com/maps?file=api&amp;key=ABQIAAAAjpkAC9ePGem0lIq5XcMiuhR_wWLPFku8Ix9i2SXYRVK3e45q1BQUd_beF8dtzKET_EteAjPdGDwqpQ",
					   	 "http://maps.google.com/maps/api/js?v=3.2&sensor=false"],  // case 1:	// Google Streets	
						["http://maps.google.com/maps?file=api&amp;key=ABQIAAAAjpkAC9ePGem0lIq5XcMiuhR_wWLPFku8Ix9i2SXYRVK3e45q1BQUd_beF8dtzKET_EteAjPdGDwqpQ",
						 "http://maps.google.com/maps/api/js?v=3.2&sensor=false"],  // case 2:	// Google Physical
						["http://maps.google.com/maps?file=api&amp;key=ABQIAAAAjpkAC9ePGem0lIq5XcMiuhR_wWLPFku8Ix9i2SXYRVK3e45q1BQUd_beF8dtzKET_EteAjPdGDwqpQ",
						 "http://maps.google.com/maps/api/js?v=3.2&sensor=false"],  // case 3:	// Google Satellite
						["http://maps.google.com/maps?file=api&amp;key=ABQIAAAAjpkAC9ePGem0lIq5XcMiuhR_wWLPFku8Ix9i2SXYRVK3e45q1BQUd_beF8dtzKET_EteAjPdGDwqpQ",
						 "http://maps.google.com/maps/api/js?v=3.2&sensor=false"],  // case 4:	// Google Hybrid
						["http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"],  // case 5:	// Yahoo Sat 
						["http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"],  // case 6:	// Yahoo Reg
						["http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"],  // case 7:	// Yahoo Hybrid
						["http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2&mkt=en-us"],  // case 8:	// Bing Aerial
						["http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2&mkt=en-us"],  // case 9:	// Bing Shaded
						["http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2&mkt=en-us"],  // case 10:	// Bing Hybrid
						[""],  // case 11:	// WMS 	    		
						[""]  // case 12:	// OpenStreetMap
					], 
	  
	streetViewMarkerLayer: null,
	streetViewDragControl: null,
	streetViewNavigationLinkLayer: null,
	streetviewSelectControl: null,
	streetviewHighlightCtrl: null,
					
	// Array contentente i layer di mappa (non quelli di servizio come i layer di evidenziazione, selezione etc.)
	layersMappa: null,
	
	/**
	 * Method: initComponent
	 * Metodo ExtJS initComponent 
	 */
	initComponent: function(){
		TolomeoExt.applyIfEmpty(this, {bOnOpenDrawMap: true});
		//Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);	
		// se non definiti definisco altezza e larghezza (altrimenti problemi con IE)
		TolomeoExt.applyIfEmpty(this, { width: 50, height: 50});
		
		this.layersMappa = [];
		this.layout = 'absolute';
		//this.pluginPreInit();
				
		// add custom events
        this.addEvents('scalechange');
    
        this.addEvents('loadstart');
        this.addEvents('loadend');
        this.addEvents('loadcancel');
        
        this.addEvents('onAutoIdentify');
        this.addEvents('onAutoIdentifyCancel');

        this.addEvents('onDigitizeEndPoint');
        this.addEvents('onDigitizeEndLine');
        this.addEvents('onDigitizeEndPolygon');
        this.addEvents('onDigitizeEndVertexEditing');
        this.addEvents('onDigitizeEndDragDrop');
        this.addEvents('onMappaSelect');
        this.addEvents('onMeasureStart');
        this.addEvents('onMeasureStop');
        this.addEvents('onMeasureChanging');
        this.addEvents('onMeasureChanged');
        this.addEvents('onMeasureClear');
        
        this.addEvents('onBeforePreInit');
        this.addEvents('onBeforePostInit');
        this.addEvents('onAfterPreInit');
        this.addEvents('onAfterPostInit');
         				
        this.addEvents('onDigitizedFeatureDragDropEnd');
        this.addEvents('onDigitizedFeatureVertexEditingEnd');
        				
        this.addEvents('onMapMoveEnd');
        
        // L'evento trasmette l'url dell'immagine come primo parametro
        this.addEvents('onPrintMap');
        
        this.addEvents('onDrawDistanceFromRefChange');
        this.addEvents('onDrawFirstPointFromRef');
        this.addEvents('onDigitizePointFromRefEnd');
        this.addEvents('onDrawFirstPointByCAD');
        this.addEvents('onDrawDistanceByCADChange');
        this.addEvents('onDrawAreaByCADChange');
        this.addEvents('onDigitizePointByCADEnd');
        this.addEvents('onDigitizeLineByCADEnd');
        this.addEvents('onDigitizePolygonByCADEnd');
        
        //this.addEvents('onCoordinateChange');
        
        this.addEvents('onStreetviewDropComplete');
        this.addEvents('onStreetviewNavLinkClick');
        
        this.addEvents('onTimeMachineShow');
        this.addEvents('onTimeMachineHide');
        
        this.addEvents('onMouseCoordChange');
        this.addEvents('popupClicked');
        
        // Eventi realtivi a routing
        this.addEvents('startPointMoved');
        this.addEvents('endPointMoved');
        this.addEvents('viaPointMoved');
        this.addEvents('routingInformationSelect');
        this.addEvents('routingInformationUnSelect');
        
        this.callParent(arguments);
        
        var thisPanel = this;
        
        
        /* Eventuale possibilita di pannello dei widget da valutare
        this.widgetPanel = Ext.create('Ext.panel.Panel',{
        	layout : 'auto',
			anchor : '100% 100%',
			html : 'eccomi',			 
			dockedItems: [{
		        xtype: 'toolbar',
		        dock: 'top',
		        style: 'background-image: none !important; background: transparent !important;',
		        items: [{
		            text: 'Docked to the top'
		            
		            //style: 'position: absolute; z-index: 100;'
		        }]
		    }]
		});
		*/
		
		this.add(this.widgetPanel);
        
        this.mapPanel = new Ext.Panel({	
        	style: 'z-index:0;',
			layout: 'fit',	
			bodyBorder: false,
			border: false,
			anchor: '100% 100%',			
		//	monitorResize: true,
			listeners: { 
        				resize: {
								fn: function() {
									this.updateMapSize();
								}
							},
						afterrender: { 
							fn: function(){
									if(!this.ownerCt) {
							            this.renderMap();
							        } else {
							            this.ownerCt.on("move", this.updateMapSize, this);
							            this.ownerCt.on({
							                "afterlayout": this.afterLayout,
							                scope: this
							            });
							        }
								} 
						} 
				
					},
			afterLayout: function() {
								var width = this.body.getWidth() - this.body.getBorderWidth("lr");
								var height = this.body.getWidth() - this.body.getBorderWidth("tb");
								if (width > 0 && height > 0) {
									// Non funziona quindi aggiunto if this.ownerCt.un("afterlayout", this.afterLayout, this);
									if (!this.bMapRendered) this.renderMap();
									this.bMapRendered=true;
								}
						
						},
		    renderMap: function() {
		    	thisPanel.pluginPreInit();
		    	var map = thisPanel.map;
		        map.render(this.body.dom);
		       // thisPanel.updateLayout();
		        thisPanel.pluginPostInit();
		    },
		    updateMapSize: function() {
		    	if ((thisPanel.map) ) {
		    		thisPanel.map.updateSize();
		    	} 
		    }
			
		});

		this.add(this.mapPanel);										
        
		if (!this.measurePanel) { 
	        this.measurePanel = new TolomeoExt.ToloMeasurePanelExt({style: 'z-index:1;', x: 10, y: 40});
	        this.measurePanel.bindToViewerPanel(this);
	        this.add(this.measurePanel);
	    }		

        if (!this.scalePanel) {
        	
        	var defaultZoomLevels = this.getDefaultZoomLevels(); 
        	
        	var scalePanelConfig = {
        		defaultZoomLevels: defaultZoomLevels,
	        	settableZoom : this.paramsJS.mappe.settableZoom
        	}
        	
        	// If without scale line just few params are necessary otherwise we need other params
        	if(!this.withScaleLine){
        		scalePanelConfig = Ext.applyIf({
		          	style: 'z-index: 2; top:auto; left:auto; right: 0px; bottom: 0px'         
		        }, scalePanelConfig);
        	} else {
        		scalePanelConfig = Ext.applyIf({
		          	width: 130,
		        	bodyCls: '',
		        	border: 0,
		        	bodyBorder: false,
		        	selectorConfig : {
		        		labelWidth:0,
						fieldLabel:'',
						labelSeparator : '',
						width: 130
		        	}        
		        }, scalePanelConfig);        		
        	}
        	
        	this.scalePanel = new TolomeoExt.ToloScalePanelExt(scalePanelConfig);	 
	        this.scalePanel.on('scalechange',function(val){this.pluginZoomToScale(val);},this);    	 
	        
	        this.scalePanel.bindToViewerPanel(this);
	        
	        // If without scale line add just the scale panel otherwise create the right widget with Component the will contain the scaleline control of Openlayers
	        if(!this.withScaleLine) {
	        	
	        	this.add(this.scalePanel);
	        	
	        } else {
	        
		        this.scaleLineBox = Ext.create('Ext.Component',{										
				    autoEl:{
				        tag:"div",			       
				        style: 'font-family: tahoma,arial,helvetica,sans-serif; font-size: xx-small;'
				    },					    
				    flex: 1			    
				});
				
				var scaleWidget = Ext.create('Ext.Panel', {		        		        
		         	width:230,
	                height: 32,
	                bodyCls : 'scaleFormCss',
	                bodyStyle : 'padding: 4px;',
	                layout: {
	                    type: 'hbox',
	                    pack: 'end'
	                },
	                
	                defaults: {
	                    border: false
	                },
	                style: 'position: absolute; right: 0px; bottom: 0px; z-index: 2;',                
	                items: [this.scaleLineBox,this.scalePanel]
			     });
			     
			     this.add(scaleWidget);
	        }			
        }
        
        this.pointFromRefPanel = new TolomeoExt.ToloPointFromRefPanelExt({style: 'z-index:1;', x: 10, y: 40});
        this.pointFromRefPanel.on('pressSetDistance', function(distance){this.mapControlsDrawLayer['pointFromRef'].handler.setDistance(distance);}, this);
        this.pointFromRefPanel.bindToViewerPanel(this);
		this.add(this.pointFromRefPanel);
	
        this.cadPanel = new TolomeoExt.ToloCADPanelExt({style: 'z-index:1;', x: 10, y: 40});
        this.cadPanel.bindToViewerPanel(this);
        this.add(this.cadPanel);
        
        /*
		 * Method: runCommandOnPointByCAD
		 * Metodo privato che esegue un comando CAD sul layer di disegno del punto
		 *
		 * Parameters:
		 * command - {String} comando CAD
		 */
        this.runCommandOnPointByCAD = function(command){
			this.mapControlsDrawLayer['pointByCAD'].handler.runCommand(command);
		};
		
		/*
		 * Method: setRelativeAngleOnPointByCAD
		 * Metodo privato che imposta se il valore di un angolo è relativo al lato precedente 
		 * o all'orizzontale per mezzo dell'handler di disegno CAD con punti
		 *
		 * Parameters:
		 * value - {Number} 1 = true (relativo), 0 = false (assoluto)
		 */
		this.setRelativeAngleOnPointByCAD = function(value){
			this.mapControlsDrawLayer['pointByCAD'].handler.setRelativeAngle(Number(value))
		};
		
		/*
		 * Method: delFirstLineOnPointByCAD
		 * Metodo privato che esegue la cancellazione del primo punto per mezzo dell'handler di disegno CAD con punti
		 */
		this.delFirstLineOnPointByCAD = function(){
			this.mapControlsDrawLayer['pointByCAD'].handler.clearFirstPoint();
		};
        
        /*
		 * Method: runCommandOnLineByCAD
		 * Metodo privato che esegue un comando CAD sul layer di disegno della linea
		 *
		 * Parameters:
		 * command - {String} comando CAD
		 */
        this.runCommandOnLineByCAD = function(command){
			this.mapControlsDrawLayer['lineByCAD'].handler.runCommand(command);
		};
		
		/*
		 * Method: setRelativeAngleOnLineByCAD
		 * Metodo privato che imposta se il valore di un angolo è relativo al lato precedente 
		 * o all'orizzontale per mezzo dell'handler di disegno CAD con linee
		 *
		 * Parameters:
		 * value - {Number} 1 = true (relativo), 0 = false (assoluto)
		 */
		this.setRelativeAngleOnLineByCAD = function(value){
			this.mapControlsDrawLayer['lineByCAD'].handler.setRelativeAngle(Number(value))
		};
		
		/*
		 * Method: delFirstLineOnLineByCAD
		 * Metodo privato che esegue la cancellazione del primo punto per mezzo dell'handler di disegno CAD con linee
		 */
		this.delFirstLineOnLineByCAD = function(){
			this.mapControlsDrawLayer['lineByCAD'].handler.clearFirstPoint();
		};
        
		/*
		 * Method: runCommandOnLineByCAD
		 * Metodo privato che esegue un comando CAD sul layer di disegno del poligono
		 *
		 * Parameters:
		 * command - {String} comando CAD
		 */
		this.runCommandOnPolygonByCAD = function(command){
			this.mapControlsDrawLayer['polygonByCAD'].handler.runCommand(command);
		};
		
		/*
		 * Method: setRelativeAngleOnLineByCAD
		 * Metodo privato che imposta se il valore di un angolo è relativo al lato precedente 
		 * o all'orizzontale per mezzo dell'handler di disegno CAD con poligoni
		 *
		 * Parameters:
		 * value - {Number} 1 = true (relativo), 0 = false (assoluto)
		 */
		this.setRelativeAngleOnPolygonByCAD = function(value){
			this.mapControlsDrawLayer['polygonByCAD'].handler.setRelativeAngle(Number(value))
		};
		
		/*
		 * Method: delFirstLineOnLineByCAD
		 * Metodo privato che esegue la cancellazione del primo punto per mezzo dell'handler di disegno CAD con poligoni
		 */
		this.delFirstLineOnPolygonByCAD = function(){
			this.mapControlsDrawLayer['polygonByCAD'].handler.clearFirstPoint();
		};
		
    },
    
    /**
     * Method: updateMapSize
     * Comunica alla mappa che è necessario ricalcolare dimensioni e posizione.
     * 
     */
    //ALE
    /*
    updateMapSize: function() {
    	if ((this.map) && (this.isAlreadyDrawn==true)) {
    		this.map.updateSize();
    	} else {
    		var thisObj = this;
    		//setTimeout(function() { thisObj.updateMapSize();}, 500);
    	}
    },*/

    
    /**
     * Method: afterRender
     * Metodo privato invocato dopo che il pannello è stato renderizzato.
     * 
     */
    afterRender: function() {    	
    	this.callParent(arguments);
		
    	this.myMask=new Ext.LoadMask(this.id, {msg:"Attendere prego..."});
    	this.refreshBusy();
    	
    },    

    /**
     * Method: onDestroy
     * Metodo privato invocato durantela sequenza di distruzione. 
     */
    onDestroy: function() {
        if(this.ownerCt) {
            this.ownerCt.un("move", this.updateMapSize, this);
        }
        this.callParent(arguments);
    },
    
	
	// Funzioni che devono essere implementate in un plugin dedicato ad un certo viewer
	// Tutte le funzioni sono prefissate con "plugin"
	
    /**
     * Method: pluginPostInit
     * Funzione chiamata da Tolomeo dopo inizializzazione 
     * (come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer).
     * 
     */
	pluginPostInit: function() {
		
		this.fireEvent("onBeforePostInit");
		// se non è già stato disegnato (per esempio da uno zoomTo) allora disegna tutto
		if ((!this.isAlreadyDrawn) && (this.bOnOpenDrawMap==true)) {
			this.map.zoomToMaxExtent();
			this.isAlreadyDrawn=true;
		}
		
		this.fireEvent("onAfterPostInit");
	},
	
	/**
	 * Method: pluginPreInit
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginPreInit: function() {
		var me = this;
		
		this.fireEvent("onBeforePreInit");
	
		// Valorizzazione giusta directory per icone openlayer
		
		OpenLayers.ImgPath = this.TOLOMEOServer + this.TOLOMEOStaticRoot + "js/ext/openlayers/img/";
		
		var layerOptions = new Object();
		
		layerOptions.projection = this.paramsJS.mappe.SRID;
		layerOptions.units = this.paramsJS.mappe.units;
		
		//layerOptions.maxExtent = new OpenLayers.Bounds(1657419, 4852076, 1676400, 4869227);
		
		layerOptions.maxExtent = new OpenLayers.Bounds(this.paramsJS.mappe.maxExtentLeft, this.paramsJS.mappe.maxExtentBottom, this.paramsJS.mappe.maxExtentRight, this.paramsJS.mappe.maxExtentTop);
		layerOptions.minScale = this.paramsJS.mappe.minScale;   //"105000";
		layerOptions.maxScale = this.paramsJS.mappe.maxScale; //="200";

		// Il parametro fallThrough: true è necessario perchè gli eventi di mousemove vengano passati al resto degli oggetti del DOM
		// Se non viene impostato le finestre ExtJS sovrapposte alla mappa si ridimensionano con difficoltà
		var mapOptions = OpenLayers.Util.extend({fallThrough: true}, layerOptions);
		
		mapOptions.controls = [
			//new OpenLayers.Control.Navigation(),
	        //new OpenLayers.Control.PanZoom(), //PanZoom OpenLayers
	        new OpenLayers.Control.ArgParser()
	    //    new OpenLayers.Control.AttributionMulti() // Controllo esteso parte della distribuzione tolomeo
	        //new OpenLayers.Control.OverviewMap(), //Mappa di riferimento
	        //new OpenLayers.Control.ScaleLine()
	        //new OpenLayers.Control.Scale()                            
		];
		
		if(this.withScaleLine){
			var scaleLineOptions = {};
			if(this.scaleLineBox){
				scaleLineOptions.div = this.scaleLineBox.getEl().dom;
			}
			mapOptions.controls.push(new OpenLayers.Control.ScaleLine(scaleLineOptions));
		}
		
	    //commentato perchè se presente con ie6 errore in apertura
	    //, new OpenLayers.Control.MousePosition()
	    
		//mapOptions.controls[2].mapOptions = layerOptions;
		if(this.paramsJS.mappe.settableZoom!=null){
			mapOptions.fractionalZoom = this.paramsJS.mappe.settableZoom;
		}
		
		OpenLayers.ProxyHost = this.TOLOMEOContext + "/TolomeoProxyServlet?url=";
		mapOptions.allOverlays = true;
		
		// Aggiunto perchè il tile manager dalla 2.13 deve essere specificato anche nel caso si voglia il default, cioè null.		
		mapOptions.tileManager = null;
		
		var zs = this.getDefaultZoomLevels();
		if (zs!=null) {
			mapOptions.resolutions = [];
			for(var i = 0; i < zs.length; i++) {
				mapOptions.resolutions.push(OpenLayers.Util.getResolutionFromScale(zs[i], layerOptions.units));
			}
		} 

		//ALE this.mapPanel.body.id,
		this.map = new OpenLayers.Map( mapOptions);
	
		//TODO Funziona solo con mappa 0
		var nmappa = 0;
		if (this.paramsJS.mappe.mappaList[nmappa].overview) {
		
			var server = this.paramsJS.getServer(this.paramsJS.mappe.mappaList[nmappa].overview.serverID, nmappa);
			
			var ovlayers = new OpenLayers.Layer.WMS( "overview",
	                server.url, 
	                {layers: this.paramsJS.mappe.mappaList[nmappa].overview.layer});
		
			// maximized non è stato parametrizzato perchè se aperto all'avvio la mappa di overview viene bianca fino al primo spostamento
			// anche se metto in postinit dopo zoomToMaxExtent
	        var overview1 = new OpenLayers.Control.OverviewMap({
	            //maximized: this.paramsJS.mappe.mappaList[nmappa].overview.maximized,
	        	maximized: false,
	            maximizeTitle: 'Mostra localizzatore',
	            minimizeTitle: 'Nascondi localizzatore',
	            layers: [ovlayers]
	        });
	        this.map.addControl(overview1);
		}
	
		this.map.events.register('mousemove', this, function(e, xy) {
																var lonlat = this.map.getLonLatFromViewPortPx(e.xy);
																this.fireEvent('onMouseCoordChange', new Point(lonlat.lon, lonlat.lat), this.map.units, this.map.getProjection());
																
																});
		
		// registro sull'evento movestart dell'oggetto mappa perchè se lo registrassi sul layer non riceverei l'evento quando il layer è spento
		// (come accade per esempio se non ci sono layer WMS accesi)
		this.map.events.register('movestart', this,  function(obj, element)   { this.olLayerScaleFilter(obj , element);});
		this.map.events.register('preaddlayer', this,  function(obj, element) { this.olLayerScaleFilter(obj , element);});
		
		var elencoLayer = new Array();
		
		this.pluginAddAllMaps();
		
		// Cerca nelle mappe in this.paramsJS.azioniEventi.eventiLayerList
		for (var i = 0; i<this.paramsJS.azioniEventi.eventiLayerList.length; i++) {
			var evLayer = this.paramsJS.azioniEventi.eventiLayerList[i];
			
			if (evLayer.caricaLayerSeparato) {
				var layer = this.olViewerNewLayer (evLayer.mappaLayerSeparato, i+100);
				elencoLayer.push(layer);	
				this.olRegisterBusyEvents(layer);
			}
		}

		this.drawLayer = new OpenLayers.Layer.Vector("DrawLayer");

		
		var styleSelected = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
	    styleSelected.strokeColor = "blue"; 
	    styleSelected.fillColor   = "blue";
	    styleSelected.strokeWidth = 2;
	    styleSelected.fillOpacity = 0.4;
	    styleSelected = OpenLayers.Util.extend(styleSelected,this.styleSelected || {});
	  
		var styleHighlighted = {
			strokeColor  : "#FFCC00",
	        strokeOpacity: 1,
	        strokeWidth  : 2,
	        pointRadius  : 6,
	        pointerEvents: "visiblePainted",
	        fillColor    : "yellow",
	        fillOpacity  : 0.4
		};
		styleHighlighted = OpenLayers.Util.extend(styleHighlighted,this.styleHighlighted || {});
	            
	    var styleAutoidentify = {
			strokeColor  : "#00AA00",
	        strokeOpacity: 1,
	        strokeWidth  : 2,
	        pointRadius  : 6,
	        pointerEvents: "visiblePainted",
	        fillColor    : "#00FF00",
	        fillOpacity  : 0.4
		};
		styleAutoidentify = OpenLayers.Util.extend(styleAutoidentify,this.styleAutoidentify || {});
		
		var styleSnap = {
			strokeColor  : "#00AA00",
			strokeOpacity: 1,
			strokeWidth  : 2,
			pointRadius  : 6,
			pointerEvents: "visiblePainted",
			//fillColor : "#00FF00",
			fillOpacity  : 0
		};
		styleSnap = OpenLayers.Util.extend(styleSnap,this.styleSnap || {});
		
		 var styleRouting = {
				 	strokeColor  : "#00FF00",
				    strokeOpacity: 1,
				    strokeWidth  : 2,
				    pointRadius  : 6,
				    pointerEvents: "visiblePainted",
				    fillColor    : "#00FF00",
				    fillOpacity  : 0.4
		};
		styleRouting = OpenLayers.Util.extend(styleRouting, this.styleRouting || {});
		
	    var styleMeasure = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
	    styleMeasure.strokeColor = "red"; 
	    styleMeasure.fillColor = "green"; 
	    styleMeasure = OpenLayers.Util.extend(styleMeasure,this.styleMeasure || {});
		
		layerOptions.style = styleSelected;
		//coorrezione bug OL2.10
		var a = layerOptions;
		a.maxScale -= 20;
		this.selezioniLayer = new OpenLayers.Layer.Vector("Selezione", a );
	    
	    layerOptions.style = styleHighlighted;	    
	    this.evidenziazioniLayer = new OpenLayers.Layer.Vector("Evidenziazioni", layerOptions );
	    
	    layerOptions.style = styleAutoidentify;	    
	    autoIdentifiedLayer = new OpenLayers.Layer.Vector("AutoIdentify", layerOptions );	    
	    
	    layerOptions.style = undefined;  
	    layerOptions.styleMap= new OpenLayers.StyleMap({
		            "default": styleRouting,
		            "select": {
					 	strokeColor  : "red",
					    strokeOpacity: 1,
					    strokeWidth  : 2,
					    pointRadius  : 6,
					    pointerEvents: "visiblePainted",
					    fillColor    : "red",
					    fillOpacity  : 0.4
		            	}
		        });
	    
	    
	    this.routingLayer = new OpenLayers.Layer.Vector("Routing",  {
            styleMap:new OpenLayers.StyleMap({
                "default":new OpenLayers.Style(OpenLayers.Util.applyDefaults({                    
                    strokeColor:"#00FF00",                    
                    strokeWidth  : 2                    
                }, OpenLayers.Feature.Vector.style["default"])),
                "select":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                	strokeColor:"green",                    
                    strokeWidth  : 2
                }, OpenLayers.Feature.Vector.style["default"])),
                "temporary":new OpenLayers.Style(OpenLayers.Util.applyDefaults({
                	strokeColor:"red",                    
                    strokeWidth  : 2
                }, OpenLayers.Feature.Vector.style["highlight"]))

            })
        } );
	    
	    this.routingMarkersLayer = new OpenLayers.Layer.Vector("Routing markers", layerOptions);		        
	    
	    markersLayer = new OpenLayers.Layer.Markers( "Markers" );
	    
		elencoLayer.push(this.drawLayer);	  
		elencoLayer.push(this.routingLayer);
	    elencoLayer.push(this.routingMarkersLayer);	    
		elencoLayer.push(this.selezioniLayer); 
		elencoLayer.push(this.evidenziazioniLayer);
		elencoLayer.push(autoIdentifiedLayer);		
		
	    elencoLayer.push(markersLayer);
	    
		this.map.addLayers(elencoLayer);

		
	    var options = {handlerOptions: {freehand: false}};
	    
	    var optionsMeasure = {	    
	    	handlerOptions: {
	    		
	    		freehand: false, 
	    		sides: 40
	    	} 
	    };
		    
	    var autoIdentifyOptions = {
            'delay': 500,
            'pixelTolerance': 3,
            'stopMove': false
        };
        
        // Opzioni pointFromRef                                			    
	    var pointFromRefOptions = {callbacks : {
	    	'refPoint' : function(point){	    		
							me.fireEvent('onDrawFirstPointFromRef', point);																																	
					   },
		    'distance' : function(distance){													
							me.fireEvent('onDrawDistanceFromRefChange', distance);
					   }				   
	    }};
	    
	    // Opzioni constrained line 
	    var pointByCADOptions = {callbacks : {
	    	'firstPoint' : function(point){
							me.fireEvent('onDrawFirstPointByCAD', point);																												
					   },
		    'distance' : function(distance){													
							me.fireEvent('onDrawDistanceByCADChange', distance);
					   }				   
	    }, handlerOptions:{infoOnMouse: true}};
	    
	    // Opzioni constrained line 
	    var lineByCADOptions = {callbacks : {
	    	'firstPoint' : function(point){
							me.fireEvent('onDrawFirstPointByCAD', point);																												
					   },
		    'distance' : function(distance){													
							me.fireEvent('onDrawDistanceByCADChange', distance);
					   }				   
	    }, handlerOptions:{ring:false, infoOnMouse: true}};
	    
	    // Opzioni constrained polygon
	    var polygonByCADOptions = {callbacks : {
			'firstPoint' : function(point){
						       me.fireEvent('onDrawFirstPointByCAD', point);																														
						   },
		    'distance'   : function(distance){													
						       me.fireEvent('onDrawDistanceByCADChange', distance);
					       }
					       ,
			'aftermodify'     : function(point,sketch){	
						       var area = sketch.geometry.getArea();
						
							  //Arrotondamento a 2 decimali
							  area = Math.round(area*100)/100;										
							  me .fireEvent('onDrawAreaByCADChange', area);
							  return true;
					       }		   				   
	    }, handlerOptions:{infoOnMouse: true}};
	    
		var autoIdentify = new OpenLayers.Control();
		
		autoIdentify.handler = new OpenLayers.Handler.Hover(
			autoIdentify,
	        {
	        	'pause': function(e) { me.olAutoIdentifyOnPause(e); },
	        	'move' : function(e) { me.olAutoIdentifyOnMove(e); }
	        },
	        autoIdentifyOptions
	    )
	    
	    // OpenLayers.Renderer.symbol.crossNarrow = [8,0, 9,0, 9,8, 17,8, 17,9, 9,9, 9,17, 8,17, 8,9, 0,9, 0,8, 8,8, 8,0];
	    
	    var measurePointSymbolizer = {
            pointRadius: 6,
            graphicName: "cross",
            fillColor: "white",
            fillOpacity: 1,
            strokeWidth: .5,
            strokeOpacity: 1,
            strokeColor: "#333333"
        }
        
        var measureLineSymbolizer = {
            strokeWidth: 1.5,
            strokeOpacity: 1,
            strokeColor: "#666666",
            strokeDashstyle: "solid" //"longdashdot"
        }
        
        var measurePolygonSymbolizer =  {
            strokeWidth: 1.5,
            strokeOpacity: 1,
            strokeColor: "#666666",
            fillColor: "white",
            fillOpacity: 0.3
        }
        
        // Override by generic styleMeasure and by single symbolyzer
        measurePointSymbolizer   = OpenLayers.Util.extend(measurePointSymbolizer,this.styleMeasure || {});
	    measurePointSymbolizer   = OpenLayers.Util.extend(measurePointSymbolizer,this.measurePointSymbolizer || {});
	    measureLineSymbolizer    = OpenLayers.Util.extend(measureLineSymbolizer,this.styleMeasure || {});
	    measureLineSymbolizer    = OpenLayers.Util.extend(measureLineSymbolizer,this.measureLineSymbolizer || {});
	    measurePolygonSymbolizer = OpenLayers.Util.extend(measurePolygonSymbolizer,this.styleMeasure || {});
	    measurePolygonSymbolizer = OpenLayers.Util.extend(measurePolygonSymbolizer,this.measurePolygonSymbolizer || {});
	    
	    // style the sketch fancy
        var measureSymbolizers = {
            "Point"  : measurePointSymbolizer,
            "Line"   : measureLineSymbolizer,
            "Polygon": measurePolygonSymbolizer
        };
        
        var  style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({symbolizer: measureSymbolizers})
        ]);
        var styleMap = new OpenLayers.StyleMap({"default": style});
        
        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
        
        var measureControls = {
            line: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Path, {
                    persist: true,
                    immediate: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: renderer,
                            styleMap: styleMap
                        }
                    },
                    geodesic: true
                }
            ),
            polygon: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, {
                    persist: true,
                    immediate: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: renderer,
                            styleMap: styleMap
                        }
                    },
                    geodesic: true
                }
            ),
            circle: new OpenLayers.Control.Measure(
                OpenLayers.Handler.RegularPolygon, {
                    persist: true,
                    immediate: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: renderer,
                            styleMap: styleMap
                        },
                        sides: 40
                    },
                    geodesic: true
                }
            )
        };
        
        for(var key in measureControls) {                
            measureControls[key].events.on({
                "measure": function(e){e.control = this; me.olHandleMeasurements(e,false)},
                "measurepartial": function(e){e.control = this; me.olHandleMeasurements(e,true)}
            });                
        }
	    
	    //{zoomBoxEnabled: true}
	    this.mapControls = {
	        navigation   : new OpenLayers.Control.Navigation(),
	        // N.B. Se alwaysZoom:true si verifica un bug che porta allo zoom non corretto (spostato e troppo ravvicinato) 
	        // solo quando si attiva lo strumento zoombox e non quando si fa shift-tasto muose
	        zoombox       : new OpenLayers.Control.ZoomBox({alwaysZoom:false, zoomOnClick: false}), 
	        vertexediting : new OpenLayers.Control.ModifyFeature(this.selezioniLayer, {standalone:true}),
	        dragdrop	  : new OpenLayers.Control.DragFeature(this.selezioniLayer),	        
	        measureLine   : measureControls['line'],
	        measurePolygon: measureControls['polygon'],                
	        measureCircle : measureControls['circle'],               	        
	        autoIdentify  : autoIdentify,
	        attribution   : new OpenLayers.Control.AttributionMulti()
		};
				 	    
	    // Se presenti più di una mappa inserisco anche il layerswitcher
	    if (this.paramsJS.mappe.mappaList.length>1) {
	    	this.mapControls.legend = new OpenLayers.Control.LayerSwitcher({activeColor: "#004000"});
	    }
	        
	    this.mapControls['dragdrop'].onComplete  = function (geom) { me.olViewerOnDragDropEnd(geom); }
	    
	    this.mapControlsDrawLayer = {
	    	point       : new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.Point),
	        pointFromRef: new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.PointFromRef,pointFromRefOptions),
	        pointByCAD  : new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.ConstrainedPoint,pointByCADOptions),
	        line        : new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.Path, options),
	        lineByCAD   : new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.ConstrainedPath,lineByCADOptions),
	        polygon     : new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.Polygon, options),
	        polygonByCAD: new OpenLayers.Control.DrawFeature(this.drawLayer, OpenLayers.Handler.ConstrainedPolygon,polygonByCADOptions),
	        modify      : new OpenLayers.Control.ModifyFeature(this.drawLayer),
	        dragdrop    : new OpenLayers.Control.DragFeature(this.drawLayer)   // , {mode: OpenLayers.Control.ModifyFeature.RESIZE | OpenLayers.Control.ModifyFeature.RESHAPE | OpenLayers.Control.ModifyFeature.DRAG }
	    };
	    
	    this.mapControlsDrawLayer['point'].events.register('featureadded', this, this.olViewerOnDigitizedPoint);
	    this.mapControlsDrawLayer['line'].events.register('featureadded', this, this.olViewerOnDigitizedLine);
	    this.mapControlsDrawLayer['polygon'].events.register('featureadded', this, this.olViewerOnDigitizedPolygon);
	    this.mapControlsDrawLayer['pointFromRef'].events.register('featureadded', this, this.olViewerOnDigitizedPointFromRef);
	    this.mapControlsDrawLayer['pointByCAD'].events.register('featureadded', this, this.olViewerOnDigitizedPointByCAD);
    	this.mapControlsDrawLayer['lineByCAD'].events.register('featureadded', this, this.olViewerOnDigitizedLineByCAD);
    	this.mapControlsDrawLayer['polygonByCAD'].events.register('featureadded', this, this.olViewerOnDigitizedPolygonByCAD);
	    
	    this.drawLayer.events.register('afterfeaturemodified', this, this.olViewerOnDigitizedFeatureVertexEditingEnd);
	    this.mapControlsDrawLayer['dragdrop'].onComplete  = function (geom) { me.olViewerOnDigitizedFeatureDragDropEnd(geom); }
	    
	    this.routingControlManager = Ext.create('TolomeoExt.ToloViewerOLPanel.SelectFeatureControlManager',
			{
				map: this.map,
				viewer: this	
									
			});	    
	    
	    var routingDragdropCtrl = new OpenLayers.Control.DragFeature(this.routingMarkersLayer);		   
	    routingDragdropCtrl.onComplete  = function (feature, pixel) { me.olViewerOnDragDropEndRouting(feature); };
	     	   	   
	    var routingDelegatorWidget = Ext.create('TolomeoExt.ToloViewerOLPanel.SelectFeatureControlManager.DelegatorWidget',{
	    	id : 'routing',
	    	layers : [this.routingLayer,this.routingMarkersLayer],
	    	callbacks : {
	    		onBeforeSelect : function(layerName, feature, viewer){return false;}, // per impedire la visualizazione della selezione		    		
		    	onHighlight : function(layerName,feature,viewer){viewer.fireEvent('routingInformationSelect', feature.attributes.instructionId);},
		    	onUnhighlight : function(layerName,feature,viewer){viewer.fireEvent('routingInformationUnSelect', feature.attributes.instructionId);}
	    	},
	    	moreControls : [routingDragdropCtrl]	    	
	    });
	    	    
	    this.routingControlManager.addDelegator(routingDelegatorWidget);	    

	    for(var key in this.mapControls) {
	        this.map.addControl(this.mapControls[key]);
	    }
	    
	    // @PATCH per evitare che tenendo premuto SHIFT faccia lo zoom 
	    // Sarebbe utile che Openlayers mettesse a disposizione un property zoomBoxOptions per il Navigation control, così come c'è la property
	    // pinchZoomOptions, invece di mettere a disposizione solo la proprietà zoomBoxKeyMask per impostare il codice del tasto con cui fare lo zoombox.
	    this.mapControls['navigation'].zoomBox.zoomOnClick = false;
	    
	    for(var key in this.mapControlsDrawLayer) {
	        this.map.addControl(this.mapControlsDrawLayer[key]);
	    }
	    	    
		var thisVar = this;
		
		this.map.events.register("zoomend", this, function(){ 
			this.fireEvent('scalechange', thisVar.pluginGetCurrentZoom());
		});
		
		this.map.events.register("preaddlayer", this, function(e){
			if(this.map.getLayer(e.layer.id)) return false;			
		});	
			
		
		this.olViewerToolSelectSelectEventHandler = function(e,visualize){				
			var lonlat = this.map.getLonLatFromViewPortPx(e.xy);
			var selMode = null;
			if (e.shiftKey) {
				selMode = (this.paramsJS.selectDefaultMode=='FIRSTONTOP') ?  'allStacked':'firstOnTop';
			} else {
				selMode = (this.paramsJS.selectDefaultMode=='FIRSTONTOP') ?  'firstOnTop' : 'allStacked';
			}
			
			this.fireEvent('onMappaSelect', new Point(lonlat.lon, lonlat.lat),selMode,e.ctrlKey,e.altKey, e.xy.x, e.xy.y);
						//OpenLayers.Event.stop(e);				
		}
		////////////////////////////////////////
		// Impostazione dei layer di snapping //
		////////////////////////////////////////
		this.snapControls = [];
		var snappedMapLayers = [this.selezioniLayer,this.drawLayer];
		
		for(var evtLi = 0; evtLi < this.paramsJS.azioniEventi.eventiLayerList.length; evtLi++){
			
			var evtL = this.paramsJS.azioniEventi.eventiLayerList[evtLi];
			
			if(evtL.snapping && evtL.snapping.snappingLayerList && evtL.snapping.snappingLayerList.length > 0){
								
				var targetList = [];
				var wfsLayerList = [];
				
				for(var sLi = 0; sLi < evtL.snapping.snappingLayerList.length; sLi++){
					
					var snappingLayer = evtL.snapping.snappingLayerList[sLi];
					
					var wfsLayer = new OpenLayers.Layer.Vector(snappingLayer.name,
					{
						style: styleSnap,
						minScale : snappingLayer.minScale,
						maxScale : snappingLayer.maxScale,
						strategies: [new OpenLayers.Strategy.BBOX()],
						projection: new OpenLayers.Projection(snappingLayer.srsName),
						protocol: new OpenLayers.Protocol.WFS({
							url: snappingLayer.url  + (snappingLayer.role ? ((snappingLayer.url.indexOf("?")==-1 ? "?" : "&" ) + "role="+snappingLayer.role) :""),		
							featureType: snappingLayer.featureType.split(","),		
							srsName: snappingLayer.srsName,
							version: "1.1.0",		
							featureNS: snappingLayer.featureNS ? snappingLayer.featureNS : null,
							featurePrefix: snappingLayer.featurePrefix ? snappingLayer.featurePrefix : null,
							propertyNames: snappingLayer.propertyNames ? snappingLayer.propertyNames.split(",") : null,
							geometryName: snappingLayer.geometryName,
							outputFormat: "JSON"
						}),
						visibility : false,
						isBaseLayer : false,
						eventListeners : {
							'loadend': function(e){
								if(e.object.features.length == 0){
									Ext.Msg.alert('Attenzione','Problemi durante il caricamento delle features per lo snapping');
								}
							},
							scope: this
						}
					});
					
					/*
					if(snappingLayer.role){
						var newParam = {role: snappingLayer.role};
						wfsLayer.mergeNewParams(newParam);
					}
					*/
					
					wfsLayerList.push(wfsLayer);
					
					targetList.push({
						layer: wfsLayer,
						tolerance: snappingLayer.tolerance,
						edge: snappingLayer.edge
						//filter: new OpenLayers.Filter.Comparison({
				        //    type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
				        //    property: "surface",
				        //    value: "dirt"
				        //})
					});
					
				}
				
				this.map.addLayers(wfsLayerList);
				var layerMapSnapControls = [];
				
				for (var sml=0; sml < snappedMapLayers.length; sml++){
					var snapControl = new OpenLayers.Control.Snapping({					
						layer: snappedMapLayers[sml],					
						targets: targetList,
						greedy: false,
						eventListeners: {
							// fa in modo di non snappare se il layer non è visibile o si è fuori dal range di scale previsto
							"beforesnap" : function(evt){		
								return evt.layer.getVisibility() && evt.layer.calculateInRange();	
							},
							scope: this
						}
					});
					
					snapControl.layerList = wfsLayerList;
					layerMapSnapControls.push(snapControl);
					
					this.map.addControl(snapControl);
				}
				/*
				// fa in modo di non snappare se il layer non è visibile o si è fuori dal range di scale previsto
				snapControl.events.register("beforesnap", this, function(evt){		
					return evt.layer.getVisibility() && evt.layer.calculateInRange();	
				});
				*/
				
				this.snapControls[evtL.codTPN] = layerMapSnapControls;				
				
				// snapControl.activate();
			}	
		}	   
								
	   this.isAlreadyDrawn = false;
	   this.fireEvent("onAfterPreInit");
	},

	pluginShowTimeMachine: function(show) {
		if (show) {
			// TODO  generalizzare adesso considera solo mappa[0] gestisce solo prima mappa
			if (this.timeMachinePanel==null && (this.paramsJS.mappe.mappaList[0].timeMachineList!=null && this.paramsJS.mappe.mappaList[0].timeMachineList.length>0)) {
		        var pnl = null;
				if (this.paramsJS.mappe.mappaList[0].timeMachineList.length==1) {
					pnl = new TolomeoExt.ToloTimeMachinePanel({
						viewer: this,
						paramsJS: this.paramsJS,
						timeMachineToShow: 0,
						cls: 'clsTimeMachinePanel'
					});
					
				} else {
					pnl = new TolomeoExt.ToloTimeMachineMultiPanel({
						viewer: this,
						paramsJS: this.paramsJS,
						timeMachineToShow: 0,
						cls: 'clsTimeMachinePanel'
					});
				}
			
	        	this.timeMachinePanel = new Ext.Window({
	        		//title: "",  
					layout: 'fit',
					maximizable: true,
					constrain: true,
					collapsible: true,
					border: false,
					shadow: false,
					height: 270,
					width: 370,
					autoScroll: true,
					//constrainTo: this.body,
					//renderTo: this.body,
					liveDrag: true,
					items: [pnl],
					cls: 'clsTimeMachineWindow'
				}).show();
	    
	        		
	        	//this.add(this.timeMachinePanel);
	        	this.timeMachinePanel.show(this);
	        	this.timeMachinePanel.on('close', function() {this.timeMachinePanel = null;this.fireEvent("onTimeMachineHide");}, this);
	        	
	        	if (this.paramsJS.mappe.mappaList[0].timeMachineList.length==1) {
	        		pnl.calculateAutoOffset();
	        		pnl.reloadItems();
	        	}
	        	//pnl.a.calculateAutoOffset();
	        	//pnl.a.reloadItems();
	        	
	        	//pnl.calculateAutoOffset();
	        	//pnl.reloadItems();
	        	
	        	this.fireEvent("onTimeMachineShow");
		   	} 
		}  else {
		   if (this.timeMachinePanel)  {
			   
			   this.timeMachinePanel.close();
			   this.remove(this.timeMachinePanel);
			   this.fireEvent("onTimeMachineHide");
			   //this.timeMachinePanel = null;
			// this.timeMachinePanel.hide(this);
		   }
	    }
	},
	
	/**
	 * Method: pluginMeasureClear
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginMeasureClear: function() {
		this.fireEvent('onMeasureClear');
	},
	
	/**
	 * Method: pluginMeasureStop
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginMeasureStop: function() {
		this.pluginMeasureClear();
		this.deactivateControl('measurePolygon');
		this.deactivateControl('measureCircle');
		this.deactivateControl('measureLine');
		this.fireEvent('onMeasureStop');
	},

	/**
	 * Method: pluginSetLegendWidth
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginSetLegendWidth : function () {},

	pluginStartDigitizedFeatureModify: function(mode) {
		
		switch (mode) {
			case 0: // niente da fare
				break;
			case 1: this.activateControlDrawLayer('modify');
				break;
			case 2: this.activateControlDrawLayer('dragdrop');
				break;	
		}

	},
	
	pluginStopDigitizedFeatureModify: function(mode) {

		switch (mode) {
			case 0: // niente da fare
				break;
			case 1: this.deactivateControlDrawLayer('modify');
				break;
			case 2: this.deactivateControlDrawLayer('dragdrop');
				break;	
		}
		
	},
	
	/**
	 * Method: pluginStartDigitizePoint
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizePoint: function () {
		this.activateControlDrawLayer('point');
	},
	
	/**
	 * Method: pluginStopDigitizePoint
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizePoint: function () {
		this.deactivateControlDrawLayer('point');				
	},
	
	/**
	 * Method: pluginStartDigitizePointFromRef
	 * Funzione che inizia la digitalizzazione (disegno) di un punto con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizePointFromRef: function () {
		this.activateControlDrawLayer('pointFromRef');
	},
	
	/**
	 * Method: pluginStopDigitizePointFromRef
	 * Funzione che interrompe la digitalizzazione (disegno) di un punto con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizePointFromRef: function () {		
		this.deactivateControlDrawLayer('pointFromRef');
		this.fireEvent('onDigitizePointFromRefEnd');		
	},
	
	/**
	 * Method: pluginStartDigitizeLineByCAD
	 * Funzione che inizia la digitalizzazione (disegno) di una linea con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizePointByCAD: function () {
		this.cadPanel.on('pressSetCommand',this.runCommandOnPointByCAD, this)
		this.cadPanel.on('changeAngleSetting',this.setRelativeAngleOnPointByCAD, this);
		this.cadPanel.on('pressDeleteFirstLine',this.delFirstLineOnPointByCAD, this);
		this.activateControlDrawLayer('pointByCAD');
	},
			
	/**
	 * Method: pluginStartDigitizeLineByCAD
	 * Funzione che interrompe la digitalizzazione (disegno) di una linea con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizePointByCAD: function () {
		this.cadPanel.un('pressSetCommand',this.runCommandOnPointByCAD, this)
		this.cadPanel.un('changeAngleSetting',this.setRelativeAngleOnPointByCAD, this);
		this.cadPanel.un('pressDeleteFirstLine',this.delFirstLineOnPointByCAD, this);
		this.deactivateControlDrawLayer('pointByCAD');
		this.fireEvent('onDigitizePointByCADEnd');
		
	},		
	
	/**
	 * Method: pluginStartDigitizeLineByCAD
	 * Funzione che inizia la digitalizzazione (disegno) di una linea con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizeLineByCAD: function () {
		this.cadPanel.on('pressSetCommand',this.runCommandOnLineByCAD, this)
		this.cadPanel.on('changeAngleSetting',this.setRelativeAngleOnLineByCAD, this);
		this.cadPanel.on('pressDeleteFirstLine',this.delFirstLineOnLineByCAD, this);
		this.activateControlDrawLayer('lineByCAD');
	},
			
	/**
	 * Method: pluginStartDigitizeLineByCAD
	 * Funzione che interrompe la digitalizzazione (disegno) di una linea con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizeLineByCAD: function () {
		this.cadPanel.un('pressSetCommand',this.runCommandOnLineByCAD, this)
		this.cadPanel.un('changeAngleSetting',this.setRelativeAngleOnLineByCAD, this);
		this.cadPanel.un('pressDeleteFirstLine',this.delFirstLineOnLineByCAD, this);
		this.deactivateControlDrawLayer('lineByCAD');
		this.fireEvent('onDigitizeLineByCADEnd');
		
	},		
	
	/**
	 * Method: pluginStartDigitizePolygonByCAD
	 * Funzione che inizia la digitalizzazione (disegno) di un poligono con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizePolygonByCAD: function () {
		this.cadPanel.on('pressSetCommand',this.runCommandOnPolygonByCAD, this)
		this.cadPanel.on('changeAngleSetting',this.setRelativeAngleOnPolygonByCAD, this);
		this.cadPanel.on('pressDeleteFirstLine',this.delFirstLineOnPolygonByCAD, this);
		this.activateControlDrawLayer('polygonByCAD');
	},
	
	/**
	 * Method: pluginStartDigitizePolygonByCAD
	 * Funzione che interrompe la digitalizzazione (disegno) di un poligono con la modalità CAD
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizePolygonByCAD: function () {
		this.cadPanel.un('pressSetCommand',this.runCommandOnPolygonByCAD, this)
		this.cadPanel.un('changeAngleSetting',this.setRelativeAngleOnPolygonByCAD, this);
		this.cadPanel.un('pressDeleteFirstLine',this.delFirstLineOnPolygonByCAD, this);
		this.deactivateControlDrawLayer('polygonByCAD');
		this.fireEvent('onDigitizePolygonByCADEnd');		
	},		
		
	/**
	 * Method: pluginStartDigitizeLine
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizeLine: function () {
		this.activateControlDrawLayer('line');
	},
	
	/**
	 * Method: pluginStopDigitizeLine
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizeLine: function () {
		this.deactivateControlDrawLayer('line');
	},

	/**
	 * Method: pluginStartDigitizePolygon
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizePolygon: function () {				
		this.activateControlDrawLayer('polygon');
	},
	
	/**
	 * Method: pluginStopDigitizePolygon
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizePolygon: function () {
		this.deactivateControlDrawLayer('polygon');
	},

	/**
	 * Method: pluginStartDigitizeCircle
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDigitizeCircle: function () {},

	/**
	 * Method: pluginStopDigitizeCircle
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDigitizeCircle: function () {},
	
	/**
	 * Method: pluginStartVertexEditing
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartVertexEditing: function (geomType, codTPN) {			
		this.selezioniLayer.events.register('afterfeaturemodified', this, this.olViewerOnVertexEditingEnd);
				
		this.activateControl('vertexediting');

		//this.mapControls['vertexediting'].selectControl.select(this.selezioniLayer.features[0]);
		var currentCodTPN = codTPN;
		for(var i=0; i < this.selezioniLayer.features.length; i++){
			if(this.selezioniLayer.features[i].codTPN == currentCodTPN){				
				//this.mapControls['vertexediting'].selectControl.select(this.selezioniLayer.features[i]);
				this.mapControls['vertexediting'].selectFeature(this.selezioniLayer.features[i]);
				break;
			}
		}
	},

	/**
	 * Method: pluginStopVertexEditing
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopVertexEditing: function () {
		this.selezioniLayer.events.unregister('afterfeaturemodified', this, this.olViewerOnVertexEditingEnd);
		this.deactivateControl('vertexediting');
	},

	/**
	 * Method: pluginStartDragDrop
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStartDragDrop: function (geomType) {			
		this.firstSelectionPermitted = false;		
		this.activateControl('dragdrop');		
	},
	
	/*
	 * Method: pluginStopDragDrop
	 * Funzione che inizia la digitalizzazione (disegno)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginStopDragDrop: function (geomType) {
		this.deactivateControl('dragdrop');
	},

	/**
	 * Method: pluginDigitizeLayerClear
	 * Funzione che cancella gli oggetti presenti sul layer utilizzato per la digitalizzazione
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginDigitizeLayerClear: function (){
		this.drawLayer.destroyFeatures();
	},

	/**
	 * Method: pluginToolSelectZoomIn
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectZoomIn: function() {
		this.map.zoomIn();
		//if(this.map.getScale()<this.paramsJS.mappe.maxScale){this.map.zoomToScale(this.paramsJS.mappe.maxScale);}
	},

	pluginToolSelectZoomOut: function()  {this.map.zoomOut();},
	
	/**
	 * Method: pluginToolSelectZoomPrev
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le pluginToolSelectZoomOut: function() {this.map.zoomOut();}, plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectZoomPrev: function() {},
	
	/**
	 * Method: pluginToolSelectZoomAll
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectZoomAll: function() {this.map.zoomToMaxExtent();},
	
	/**
	 * Method: pluginToolSelectZoomBox
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectZoomBoxActivate: function (activate) {
											this.activateControl('zoombox');
											},
	pluginToolSelectZoomBoxDeactivate: function (activate) {this.deactivateControl('zoombox')},
	
	/**
	 * Method: pluginToolSelectPan
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectPan: function () {this.activateControl('navigation');},
	
	/**
	 * Method: pluginToolSelectPanStop
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectPanStop: function () {/*this.deactivateControl('navigation');*/},
	
	/**
	 * Method: pluginToolSelectPrint
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectPrint: function () 	{
		var urlArr = [];
		for (var i=0; i<this.map.layers.length; i++) {
			var currLayer = this.map.layers[i];
			if (currLayer.getVisibility() &&
					((currLayer.CLASS_NAME.indexOf("MapServer")!=-1) || (currLayer.CLASS_NAME.indexOf("WMS")!=-1))) {
					var typeCode = (currLayer.CLASS_NAME.indexOf("MapServer")!=-1) ? 0 : 11;
					urlArr.push({url: currLayer.getURL(currLayer.getExtent()), nPluginLayer: i, typeCode: typeCode });	
			}
			
		}
		//this.map.layers[0].getURL(this.map.layers[0].getExtent())
		this.fireEvent('onPrintMap', urlArr);
			
	},
		
	/**
	 * Method: pluginToolSelectClipboardCopy
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectClipboardCopy: function () 	{},
		
	/**
	 * Method: pluginToolSelectSelect
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectSelect: function () 	{
		//modificato da click a mouseup perch? click non funzionava correttamente in ie
		//da fare meglio e verificare su ie che ha comportamento diverso da firefox
				
		// this.map.events.register("click", this, this.olViewerToolSelectSelectEventHandler);						
		
		if(!this.selectHandler){
			var me = this;
			// usato per evitare l'evento click sul pan della geometria
			me.firstSelectionPermitted = true;
			this.selectHandler = new OpenLayers.Handler.Click(this.mapControls['navigation'], 
				{'click' : function(e){
						if(me.firstSelectionPermitted){
							me.olViewerToolSelectSelectEventHandler.call(me,e);
						} else {
							me.firstSelectionPermitted = true;
						}
					}
				}/*, {stopSingle : true}*/ );
		}
		
		this.selectHandler.activate();
		
		/*
	
		if(!this.selectKeymapIn){
			this.selectKeymapIn = new Ext.KeyMap(document, {
			    key: Ext.EventObject.SPACE,
			    fn: function(key){
					this.map.events.unregister("click", this, this.olViewerToolSelectSelectEventHandler);						
					this.activateControl('navigation');
				},
			    scope: this,
			    stopEvent: false
			});
		
			this.selectKeymapOut = new Ext.KeyMap(document, {
			    key: Ext.EventObject.SPACE,
			    fn: function(key){								
					this.deactivateControl('navigation');
					this.map.events.register("click", this, this.olViewerToolSelectSelectEventHandler);
				},
			    scope: this,
			    stopEvent: false
			},"keyup");
		}else{
			this.selectKeymapIn.enable();
			this.selectKeymapOut.enable();
		}			
		*/
			 
	},
	
	
	
	/**
	 * Method: pluginToolSelectSelectStop
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectSelectStop: function () 	{
		//modificato da click a mouseup perch? click non funzionava correttamente in ie
		//da fare meglio e verificare su ie che ha comportamento diverso da firefox
		/*
		this.map.events.unregister("click", this, this.olViewerToolSelectSelectEventHandler);		
		this.selectKeymapIn.disable();
		this.selectKeymapOut.disable();
		*/
		if(this.selectHandler){
			this.selectHandler.deactivate();
		}
	},
	
	/**
	 * Method: pluginMeasureToolSelect
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginMeasureToolSelect: function (tipo) 	{ 
		var controlName = "";
		switch (tipo) {
			case 0: controlName = 'measurePolygon'; 
				break;
			case 1: controlName = 'measureCircle'; 
				break;
			case 2: controlName = 'measureLine'; 
				break;	
		}
		
		this.activateControl(controlName);
		this.fireEvent('onMeasureStart', tipo);
	},
	
	/**
	 * Method: pluginToolSelectBuffer
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectBuffer: function () {},
	
	/**
	 * Method: pluginToolSelectInfoMappa
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectInfoMappa: function () {},
	
	/**
	 * Method: pluginToolSelectLegendaToggle
	 * Funzione per la gestione "tool" (zoom, pan etc)
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginToolSelectLegendaToggle: function (larghezza) {},

	/**
	 * Method: pluginGotoPosition
	 * Funzione di posizionamento della mappa
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 */
	pluginGotoPosition: function (coordX, coordY, zoomFactor, withMarker, iconPath) {  
		var res = OpenLayers.Util.getResolutionFromScale(zoomFactor, this.map.baseLayer.units);
		var lonlat = new OpenLayers.LonLat(coordX,coordY);
		this.map.setCenter(lonlat, this.map.getZoomForResolution(res), false, true);
		this.isAlreadyDrawn=true;
		if (withMarker) this.pluginAddMarker(coordX, coordY,iconPath,true);
	},

	/**
	 * Method: pluginGetSelectedKeys
	 * Funzione di selezione oggetti.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer
	 *
	 * Parameters:
	 * layerName - {String} layerName.
	 *
	 * Returns:
	 *    {Array} - ritorna un Array contenente le chiavi degli oggetti correntemente selezionati ed appartenenti a layerName.
	 *    N.B. Non è stata fatta una funzione che ritorna tutti gli oggetti 
	 *    perchè un oggetto potrebbe essere in un gruppo che ha il nome del layer ma che viene tematizzato più volte con nomi diversi
	 */
	pluginGetSelectedKeys: function  (layerName) {
			var retVal = new Array();
			//TODO
			return retVal;
	},

	/**
	 * Ritorna la url dalla quale è ricavata l'immagine relativa al layer attualmente visualizzato utilizzando il bound passato
	 * 
	 * @param bounds - bounds che identificano la zona da mostrare nella forma  {left: bounds.left, bottom: bounds.bottom, right: bounds.right, top: bounds.top} 
	 * 
	 */
	pluginGetMapUrl: function(bounds) {
		
		var bounds = new OpenLayers.Bounds(bounds.left, bounds.bottom, bounds.right, bounds.top);
		
		return this.map.baseLayer.getURL(bounds);
		
	},
	
	/**
	 * Method: pluginRefreshMap
	 * Funzione per ridisegnare la mappa.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *	
	 * Parameters:
	 * layers 		- nomi layer separati dal separatore
	 * stili  		- nomi stili separati dal separatore
	 * separatore  	- separatore (default ' ')
	 * nLayer	    - numero del layer sul quale fare il refresh
	 */
	pluginRefreshMap: function (layers, stili, separatore, nLayer) {
		
		var sep = separatore ? separatore : ' '; 
		
		for(var index=0; index<this.map.layers.length; index++) {
			if ((nLayer==undefined || nLayer==null) ||
				(nLayer!=undefined && nLayer!=null && nLayer==index)) {
				var currLayer = this.map.layers[index];
				
				if (currLayer.CLASS_NAME.indexOf("MapServer")!=-1) {
					// in caso di layer mapserver 
					// fatto così su consiglio di openlayers dopo avere aperto bug 
					// perchè la cache del browser non ricaricava e non sentiva la differenza.
					// Andrebbe fatto leggermente più intelligente per ricaricare solo i layer cambiati
					var opt = new Object();
					opt.random= Math.random();
					
					if (layers != undefined && layers!=null) {
						if (layers=="") {
							currLayer.setVisibility(false);
						} else {
							currLayer.setVisibility(true);
						
							var buff = layers;
							if (sep!=' ') {
								// sostituisce il separatore con quello giusto per Mapserver
								var pattern = new RegExp(sep,'g');
								buff = buff.replace(pattern, ' ');
							}
							opt.layers=buff;
						}
					}
					currLayer.mergeNewParams(opt);
					
				} else {
					if (currLayer.CLASS_NAME.indexOf("WMS")!=-1) {
						var opt = new Object();
						opt.random= Math.random();
						if (layers != undefined && layers!=null) {
							if (layers=="") {
								currLayer.setVisibility(false);
							} else {
								currLayer.setVisibility(true);
								var buff = layers;
								if (sep!=',') {
									// sostituisce il separatore con quello giusto per WMS
									var pattern = new RegExp(sep,'g');
									buff = buff.replace(pattern, ',');
								} 
								opt.layers=buff;
								opt.styles='';
								if (stili) {
									var buff = stili;
									if (sep!=',') {
										// sostituisce il separatore con quello giusto per WMS
										var pattern = new RegExp(sep,'g');
										buff = buff.replace(pattern, ',');
									}
									opt.styles = buff
								}
							}
						}
						currLayer.mergeNewParams(opt);
						
					} else {
					if (currLayer.redraw) currLayer.redraw();
					}
				}
			}	
		}
		this.pluginRefreshAttribution();
	},
	
	/**
	 * Method: pluginRefreshAttribution
	 * Funzione per aggiornare le attribuzioni di un layer.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *	
	 * Parameters:
	 * Attribution - {Object|Object[]}  Oggetto o array contenente le attribuzioni ognuna delle quali caratterizzata con in campi title, logoUrl, OnlineResource
	 */
	pluginRefreshAttribution: function(attribution, nPluginLayer) {
		if (attribution) {
			this.map.layers[nPluginLayer].attribution = attribution;
		}
		this.mapControls.attribution.updateAttribution();
		
	},
	
	//function pluginRefreshMapAndGoto(coordX, coordY, zoomFactor) {};
	
	/**
	 * Method: pluginRefreshLayer
	 * Funzione per ridisegnare il layer.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *	
	 * Parameters:
	 * layerName - {String} layerName
	 */
	pluginRefreshLayer: function (layerName) {
		// implementato con un refresh totale
	 	this.pluginRefreshMap() ;
	},

	/**
	 * Method: pluginGetMapExtent
	 * Ritorna l'extent del layer di base attualmente attivo
	 *
	 * Returns:
	 *    	Ritorna l'estensione totale della mappa  in un oggetto {left: bounds.left, bottom: bounds.bottom, right: bounds.right, top: bounds.top} 
	 */  
	pluginGetMapExtent: function () {
		bounds = this.map.baseLayer.getExtent();
		
		return {left: bounds.left, bottom: bounds.bottom, right: bounds.right, top: bounds.top};
		
	},
	
	/**
	 * Method: pluginGetMapFullExtent
	 * Ritorna l'extent del layer di base attualmente attivo compreso l'eventuale aggiunta ai bordi dovuta a ratio
	 *
	 * Returns:
	 *    	Ritorna l'estensione totale della mappa  in un oggetto {left: bounds.left, bottom: bounds.bottom, right: bounds.right, top: bounds.top}
	 */  
	pluginGetMapFullExtent: function(){
		
		var bounds = this.pluginGetMapExtent();
		var ratio = this.pluginGetMapRatio();
		
		  //determine new tile bounds
	    var center = { lon: bounds.left + (bounds.right - bounds.left) / 2,
	    			   lat: bounds.bottom + (bounds.top - bounds.bottom) / 2};
	    
	    var boundsWidth = (bounds.right - bounds.left) * ratio;
	    var boundsHeight = (bounds.top - bounds.bottom) * ratio;
	        
	    var fullBounds = 
	        new OpenLayers.Bounds(center.lon - (boundsWidth/2),
	                              center.lat - (boundsHeight/2),
	                              center.lon + (boundsWidth/2),
	                              center.lat + (boundsHeight/2));
	    
		return {left: fullBounds.left, bottom: fullBounds.bottom, right: fullBounds.right, top: fullBounds.top};
	},

	/**
	 * Method: pluginGetCurrentX
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Returns:
	 *    	Ritorna il valore corrente del centro della mappa visualizzata.
	 */ 
	pluginGetCurrentX: function () { return this.map.getCenter().lon; },
	
	/**
	 * Method: pluginGetCurrentY
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Returns:
	 *    	Ritorna il valore corrente del centro della mappa visualizzata.
	 */ 
	pluginGetCurrentY: function () { return this.map.getCenter().lat; },

	/**
	 * Method: pluginGetCurrentZoom
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Returns:
	 *    	Ritorna il valore corrente dello zoom della mappa visualizzata.
	 */ 
	pluginGetCurrentZoom: function () { return this.map.getScale(); },

	/**
	 * Method: pluginGetResolution
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer
	 *
	 * Returns:
	 *    	Ritorna la risoluzione attuale (map units per pixel) della mappa
	 */ 
	pluginGetResolution: function () { return this.map.getResolution(); },

	/**
	 * 
	 * @param {} scala
	 * @param {} unita
	 */
	pluginGetResolutionFromScale: function (scala, unita) { return OpenLayers.Util.getResolutionFromScale(scala, unita); },
	
	/**
	 * Method: pluginGetSRID
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer
	 *
	 * Returns:
	 *    	Ritorna il sistema di riferimento (map units per pixel) della mappa
	 */ 
	pluginGetSRID: function () { return this.paramsJS.mappe.SRID;},
	
	/**
	 * Method: pluginGetUnits
	 * come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer
	 * 
	 * Returns:
	 *    	Ritorna il sistema di unità della mappa
	 */
	pluginGetUnits: function () { return this.paramsJS.mappe.units;},
	
	/**
	 * 
	 * Returns:
	 *    	Ritorna true se l'unita usata dalla mappa è in gradi altrimenti false
	 */
	isDregreesUnits: function() {
		units = this.pluginGetUnits();
		if (units=="dd" || units=="degrees")
			return true;
		else
			return false;
	},
	
	/**
	 * 
	 * Returns:
	 *    	Ritorna true se l'unita usata dalla mappa è in metri o kilometri altrimenti false
	 */
	isMetresUnits: function() {
		units = this.pluginGetUnits();
		if (units=="m" || units=="km")
			return true;
		else
			return false;
	},

	/**
	 * Method: pluginGetDotsPerInch
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer
	 *
	 * Returns:
	 *    	Ritorna i dots per inch utilizzati dalla mappa
	 */ 
	pluginGetDotsPerInch: function() {
		return OpenLayers.DOTS_PER_INCH;
	},
	
	/**
	 * Method: pluginSetDotsPerInch
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer
	 * 
	 * @param {} dpi
	 */
	pluginSetDotPerInch: function(dpi) {
		OpenLayers.DOTS_PER_INCH = dpi;
	},
	
	/**
	 * Method: pluginAddSelected
	 * Funzione che viene chiamata per aggiungere un oggetto geometrico a quelli selezionati
	 * Per adesso solo un oggetto e' selezionabile, quindi cancella eventuali oggetto selezionati in precedenza.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 * 
	 * Parameters:
	 * jsGeometry - {} jsGeometry
	 * style - {} style
	 * 
	 */ 
	pluginAddSelected: function (jsGeometry, style) {
		var wkt = new OpenLayers.Format.WKT();
		var feature = wkt.read(jsGeometry.geometry);
		feature.codTPN = jsGeometry.codTPN;
		if (style) feature.style = style;
		this.selezioniLayer.addFeatures([feature]);
	},

	/**
	 * Method: pluginClearSelected
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 *	Returns:
	 *  {Boolean}
	 */ 
	pluginClearSelected: function (bRedraw, codTPN) {
		if (codTPN) {
			var buff=new Array();
			for (var i=0;i<this.selezioniLayer.features.length;i++) {
				if (this.selezioniLayer.features[i].codTPN == codTPN) buff.push(this.selezioniLayer.features[i]); 
			}
			for (var i=0;i<buff.length;i++) {
				 this.selezioniLayer.destroyFeatures(buff); 
			}
		} else {
			// non viene gestito bRedraw perche' in questo viewer la cancellazione non richiede il ridisegno
		    this.selezioniLayer.destroyFeatures();  
		}
		// ritorna sempre false perch? il redraw non e' mai necessario
		return false;
	},

	/**
	 * Method: pluginZoomToSelected
	 * Esegue lo zoom to selected.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * zoom - {Number} zoom, se valorizzato viene fatto lo zoom alla data scala
	 * buffer - {Number} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	pluginZoomToSelected: function (zoom, buffer) {
			//var bounds = this.selezioniLayer.features[0].geometry.getBounds();
		if(!(this.selezioniLayer.features && this.selezioniLayer.features.length>0)) return;
		var bounds = this.olGetExtents(this.selezioniLayer.features);
		if (!zoom) {
			if (buffer && this.isMetresUnits()) {
				var boundsBuffered = new OpenLayers.Bounds();
			    boundsBuffered.extend(new OpenLayers.LonLat(bounds.left-buffer/2,bounds.bottom-buffer/2));
			    boundsBuffered.extend(new OpenLayers.LonLat(bounds.right+buffer/2,bounds.top+buffer/2));
			    this.map.zoomToExtent(boundsBuffered);
			} else {
				if (bounds.top==bounds.bottom && bounds.right==bounds.left) {
					var lonLat = bounds.getCenterLonLat();
					this.pluginGotoPosition(lonLat.lon, lonLat.lat, this.paramsJS.mappe.maxScale, false);
				} else {
					this.map.zoomToExtent(bounds);
				}
			}
		} else {
			var lonLat = bounds.getCenterLonLat();
			this.pluginGotoPosition(lonLat.lon, lonLat.lat, zoom, false);	
		}
		this.isAlreadyDrawn=true;
	},
	
	/**
	 * @method pluginGetSelectedFeaturesBounds
	 * Restituisce il bounding box delle features selezionate compreso il buffer se passato in metri.
	 * Null se non ci sono features.
	 * 
	 * @param {String} buffer
 	 * Codice EPSG del sistema di riferimento di partenza (Es. EPSG:26591) 
 	 * 
	 * @return {TolomeoExt.BBox}
	 * Bounding box delle features selezione compreso il buffer se passato in metri
	 * 
	 */
	pluginGetSelectedFeaturesBounds: function(buffer){
		if(!(this.selezioniLayer.features && this.selezioniLayer.features.length>0)) return null;
		var bounds = this.olGetExtents(this.selezioniLayer.features);
		if(buffer && this.isMetresUnits()){
			var boundsBuffered = new OpenLayers.Bounds();
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.left-buffer/2,bounds.bottom-buffer/2));
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.right+buffer/2,bounds.top+buffer/2));
		    return BBox.create(boundsBuffered);
		}
		return new BBox.create(bounds);
	},	
	
	/**
	 * @method pluginGetHighlightedFeaturesBounds
	 * Restituisce il bounding box delle features evidenziate compreso il buffer se passato in metri.
	 * Null se non ci sono features.
	 * 
	 * @param {String} buffer
 	 * Codice EPSG del sistema di riferimento di partenza (Es. EPSG:26591) 
 	 * 
	 * @return {TolomeoExt.BBox}
	 * Bounding box delle features selezione compreso il buffer se passato in metri
	 * 
	 */
	pluginGetHighlightedFeaturesBounds: function(buffer){				
		if(!(this.evidenziazioniLayer.features && this.evidenziazioniLayer.features.length>0)) return null;
		var bounds = this.olGetExtents(this.evidenziazioniLayer.features);
		
		if(buffer && this.isMetresUnits()){
			var boundsBuffered = new OpenLayers.Bounds();
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.left-buffer/2,bounds.bottom-buffer/2));
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.right+buffer/2,bounds.top+buffer/2));
		    return BBox.create(boundsBuffered);
		}
		return new BBox.create(bounds);
	},
	
	/**
	 * Method: pluginAddHighlighted
	 * Funzione che viene chiamata per aggiungere un oggetto geometrico a quelli selezionati.
	 * Se bMulti non definito o false un solo oggetto e' evidenzxiabile, quindi cancella eventuali oggetto selezionati in precedenza
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer.
	 *
	 * Parameters:
	 * jsGeometry - {JSGeometryArray o JSGeometry} Oggetto da evidenziare, se passato un JSGeometryArray viene utilizzato il primo
	 * bMulti - {Boolean} bMulti Se non definito o false non è consentita la presenza di più di un oggetto, se True è consentita.
	 */
	pluginAddHighlighted: function (jsGeometry, bMulti, style) {
	    //Vecchia versione monoblocco 
		if (!bMulti) this.evidenziazioniLayer.destroyFeatures();
		var geoms = new JSGeometryArray();
		
		if(jsGeometry instanceof JSGeometryArray){
			geoms = jsGeometry;
		}else if(jsGeometry instanceof JSGeometry){
			geoms.add(jsGeometry);
		}else{
			alert("tipo sconosciuto " + jsGeometry);
			return;
		}
		
		/*var style_evidenziato = {
	                strokeColor: "#FFCC00",
	                strokeOpacity: 1,
	                strokeWidth: 2,
	                pointRadius: 6,
	                pointerEvents: "visiblePainted",
	                fillColor : "yellow",
	                fillOpacity: 0.7,
	                externalGraphic: "http://localhost:8080/commonintra2-0/img/icone/hand.gif",
	                graphicWidth: 20,
					graphicHeight: 20,
					graphicOpacity: 1,
					graphicXOffset: -10,
					graphicYOffset: -10
	            };*/
		
		var feats = new Array();
		
		for (var i=0; i<geoms.geometries.length; i++) {
			var wkt = new OpenLayers.Format.WKT();
			var feat = wkt.read(geoms.geometries[i].geometry);
			if (style) feat.style = style;
		    feats.push( feat);
		}
		
		this.evidenziazioniLayer.addFeatures(feats);
		//this.map.zoomToExtent(feature.geometry.getBounds());
	},
	
	/**
	 * Method: pluginClearHighlighted
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * bRedraw - {} bRedraw
	 * 
	 * Returns:
	 *     {Boolean}
	 */
	pluginClearHighlighted: function (bRedraw) {
		// non viene gestito bRedraw perche' in questo viewer la cancellazione non richiede il ridisegno
	    this.evidenziazioniLayer.destroyFeatures();
	    // ritorna sempre false perch? il redraw non e' mai necessario
	    return false;
	},

	/**
	 * Method: olGetExtents
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * features - {OpenLayers.Fetures} features
	 * 
	 * Returns:
	 *     {OpenLayers.Bounds}
	 */
	olGetExtents: function(features) {
		var bounds = features[0].geometry.getBounds().clone();
		for(var i=1;i<features.length;i++)
	    	bounds.extend(features[i].geometry.getBounds());
	   	return bounds;
	},

	/**
	 * Method: pluginZoomToHighlighted
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * zoom - {} zoom
	 * buffer - {Number} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	pluginZoomToHighlighted: function (zoom, buffer) {
		//var bounds = this.evidenziazioniLayer.features[0].geometry.getBounds();
		if(!(this.evidenziazioniLayer.features && this.evidenziazioniLayer.features.length>0)) return;
		var bounds = this.olGetExtents(this.evidenziazioniLayer.features);
		if (!zoom) {
			if (buffer && this.isMetresUnits()) {
				var boundsBuffered = new OpenLayers.Bounds();
			    boundsBuffered.extend(new OpenLayers.LonLat(bounds.left-buffer/2,bounds.bottom-buffer/2));
			    boundsBuffered.extend(new OpenLayers.LonLat(bounds.right+buffer/2,bounds.top+buffer/2));
			    this.map.zoomToExtent(boundsBuffered);
			} else {
				this.map.zoomToExtent(bounds);
			}
		} else {
			var lonLat = bounds.getCenterLonLat();
			this.pluginGotoPosition(lonLat.lon, lonLat.lat, zoom, false);	
		}
		
		this.isAlreadyDrawn=true;	
	},

	/**
	 * Method: pluginZoomToExtent
	 * Esegue lo zoom ad uno specifico extent.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * geometry - {Mixed} Stringa wkt della geometria o oggetto di tipo BBox
	 * buffer - {Number} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	 */
	pluginZoomToExtent: function (geometry, buffer) {
		
		var bounds;
		
		if (typeof(geometry) == 'string') {
			var wkt     = new OpenLayers.Format.WKT();
			var feature = wkt.read(geometry);
			bounds = feature.geometry.getBounds();
		} else {
			bounds = new OpenLayers.Bounds(geometry.left,geometry.bottom,geometry.right,geometry.top);
		} 
		
		/*
		if (!buffer) {
			this.map.zoomToExtent(bounds);
		} else {
			boundsBuffered = new OpenLayers.Bounds();
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.left-buffer/2,bounds.bottom-buffer/2));
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.right+buffer/2,bounds.top+buffer/2));
		    this.map.zoomToExtent(boundsBuffered);
		}
		*/
		
		if (buffer && this.isMetresUnits()) {
			var boundsBuffered = new OpenLayers.Bounds();
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.left-buffer/2,bounds.bottom-buffer/2));
		    boundsBuffered.extend(new OpenLayers.LonLat(bounds.right+buffer/2,bounds.top+buffer/2));
		    this.map.zoomToExtent(boundsBuffered);
		} else {
			this.map.zoomToExtent(bounds);
		}
	},

	/**
	 * Method: pluginZoomToScale
	 * Esegue lo zoom ad una specifica scala.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * scale - {Number} scale
	 */
	pluginZoomToScale: function (scale) {
		this.map.zoomToScale(scale,true);
	},

	/**
	 * Method: pluginUpdateCustomQuery
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * customQuery - {} customQuery
	 */
	pluginUpdateCustomQuery: function (customQuery ) {
		
		//TODO Funziona solo con mappa 0
		var nmappa = 0;
		var layAggregCount = this.paramsJS.mapDefinitions[0].getLayerAggregationCount();
		
		for(var index = 0; index < layAggregCount; index++) {
		
			var layViewAggreg = this.paramsJS.mapDefinitions[nmappa].getLayerAggregation(index);
			var bNoTolomeoParams = layViewAggreg.server.noTolomeoParams;
			
			if (!bNoTolomeoParams) {
				var currLayer = this.map.layers[layViewAggreg.nPluginLayer];
				
				if (currLayer.CLASS_NAME.indexOf("MapServer")!=-1) {
					// in caso di layer mapserver 
					customQuery[nmappa].random= Math.random();
					currLayer.mergeNewParams(customQuery[nmappa]);
				} else {
					if (currLayer.CLASS_NAME.indexOf("WMS")!=-1) {
						// in caso di WMS 
						var wmsParams = new Object();
						wmsParams.random= Math.random();
						var cquery = customQuery[nmappa];
						for (var i in cquery) {
							if (wmsParams.viewparams==undefined) wmsParams.viewparams = '';
							wmsParams.viewparams += ((wmsParams.viewparams!='') ? ';' : '') + i + ':' + cquery[i];
						}
						//viewparams=p1:v1;p2:v2;
						currLayer.mergeNewParams(wmsParams);
					} else {
						// altri cosa fare?	
					}
				}
			}
		}
	},

	/**
	 * Method: pluginSetLayerOpacity
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * nomeLayerQuery - {String} nomeLayer
	 * opacity - {float} opacity
	 */
	pluginSetLayerOpacity: function (nPluginLayer, opacity) {
		 this.map.layers[nPluginLayer].setOpacity(opacity);
		/*
		 var param = new Object();
		param["map.layer["+nomeLayer+"]"] = "opacity "+opacity;
		
		this.map.baseLayer.mergeNewParams(param);
		*/
	},

	/**
	 * Method: pluginAddMarker
	 * Permette di aggiungere un marker. Attualmente gestisce un solo marker, quindi quando ne viene aggiunto uno nuovo viene cancellato il precedente.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * x - {float} x
	 * y - {float} y
	 * isUnique - {boolean} Se impostato a true vengono rimossi gli altri markers prima di aggiungere questo
	 */
	pluginAddMarker: function (x, y, iconPath, isUnique) {
		if(isUnique){
			markersLayer.clearMarkers();
		}
		var size = new OpenLayers.Size(20,34);
	    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	    var icon = new OpenLayers.Icon(iconPath ? iconPath : this.TOLOMEOServer+ this.TOLOMEOStaticRoot+'img/markers/red_PMarker.png',size,offset);
	    markersLayer.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x,y),icon));
	},
	
	/**
	 * Method: pluginAddPopup
	 * Permette di aggiungere un popup con pulsante di chiusura.
	 *
	 * Parameters:
	 * x - {float} x
	 * y - {float} y
	 * htmlText - {String} testo del popup in formato html
	 * isUnique - {boolean} se true rimuove tutti gli altri popup presenti
	 * editable - {boolean} se true il popup è cliccabile/editabile
	 * 
	 */
	pluginAddPopup: function (x, y, htmlText, isUnique, editable) {		
		
		var me = this;
		var p = new OpenLayers.Popup.FramedCloud(
                        "popup" + Ext.id(), 
                        new OpenLayers.LonLat(x,y),
                        null,
                        htmlText,
                        null,
                        true,
                        this._onPopupClose
                    );
		p.editable = !!editable;	
        p.closed = false;        
        
        // if editable we have to mange click on contentDiv to edit
        if(p.editable){
        	p.contentDivEvents = new OpenLayers.Events(this, p.contentDiv, null, true);
			p.contentDiv.title = "Modifica nota";
	        function onClick(evt) {
	            me._onPopupUpdate(this);
	            OpenLayers.Event.stop(evt, true);
	        }
	        
	        p.contentDivEvents.on({
	            "click": onClick,
	            scope: p
	        });
	        
	        OpenLayers.Element.addClass(p.contentDiv,'editableNote');        
        }
        
		this.map.addPopup(p, isUnique);	    
		return p;
	},
	
	/**
	 * Method: pluginUpdatePopup
	 * Permatte di modifica il testo di un popup per mezzo del suo id e del nuovo testo
	 *
	 * Parameters:
	 * idPopup - {String} identificativo del popup
	 * htmlText - {String} testo del popup in formato html
	 */
	pluginUpdatePopup: function (idPopup, htmlText) {		
		for(var i in this.map.popups){
			var popup = this.map.popups[i];
			if(popup.id == idPopup){
				popup.setContentHTML(htmlText);
			}
		}   
	},
	
	_onPopupClose: function(e) {
		
		var popup = this;

		// If editable we have to clean event management
		if(popup.editable){
			popup.contentDivEvents.destroy();
        	popup.contentDivEvents = null;
		}
		
		popup.destroy();
		return true;
	},
	
	_onPopupUpdate: function(popup) {
		this.fireEvent("popupClicked",popup.id,popup.contentHTML,popup.lonlat.lon,popup.lonlat.lat);
	},
	
	pluginGetOpenedPopups: function() {
		return this.map.popups;
	},
	
	/**
	 * Method: pluginClearMarkers
	 * Permette di eliminare i marker.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 */
	pluginClearMarkers: function () {
		markersLayer.clearMarkers();
	},

	/**
	 * Method: pluginAutoIdentifyEnable
	 * Permette di aggiungere un marker. Attualmente gestisce un solo marker, quindi quando ne viene aggiunto uno nuovo viene cancellato il precedente.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * bEnable - {Boolean} bEnable
	 */
	pluginAutoIdentifyEnable: function (bEnable) {
		if (bEnable) {
			this.mapControls['autoIdentify'].activate();
		} else {
			this.mapControls['autoIdentify'].deactivate();
		}
	},
	
	/**
	 * Method: pluginAddAutoidentified
	 * Funzione che viene chiamata per aggiungere un oggetto geometrico a quelli selezionati.
	 * Per adesso solo un oggetto e' selezionabile, quindi cancella eventuali oggetto selezionati in precedenza.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer.
	 *
	 * Parameters:
	 * jsGeometry - {JSGeometryArray o JSGeometry} jsGeometry
	 */
	pluginAddAutoidentified: function (jsGeometry) {
		var wkt = new OpenLayers.Format.WKT();
		
		for (var i=0; i<jsGeometry.geometries.length; i++) {
			var feature = wkt.read(jsGeometry.geometries[i].geometry);
			autoIdentifiedLayer.addFeatures([feature]);
		}
	},

	/**
	 * Method: pluginClearAutoidentified
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * bRedraw - {Boolean} bRedraw
	 */
	pluginClearAutoidentified: function (bRedraw) {
		// non viene gestito bRedraw perche' in questo viewer la cancellazione non richiede il ridisegno
	    autoIdentifiedLayer.destroyFeatures();
	    // ritorna sempre false perch? il redraw non e' mai necessario
	    return false;
	},

	/**
	 * Method: pluginZoomToAutoidentified
	 * Esegue lo zoom to selected.
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * zoom - {Number} zoom
	 */
	pluginZoomToAutoidentified: function (zoom) {
		if (autoIdentifiedLayer.features.length==1) {
			var bounds = autoIdentifiedLayer.features[0].geometry.getBounds();
			if (!zoom) {
				this.map.zoomToExtent(bounds);
			} else {
				var lonLat = bounds.getCenterLonLat();
				this.pluginGotoPosition(lonLat.lon, lonLat.lat, zoom, false);	
			}
			
			this.isAlreadyDrawn=true;
		}
	},
		
	/**
	 * Method: pluginPan
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * direction - {} direction
	 * slideFactor - {} slideFactor
	 */
    pluginPan: function(direction, slideFactor){
		 slideFactor = slideFactor || 50;
		 switch (direction) {
            case "N": 
                this.map.pan(0, -slideFactor);
                break;
            case "S": 
                this.map.pan(0, slideFactor);
                break;
            case "O": 
                this.map.pan(-slideFactor, 0);
                break;
            case "E": 
                this.map.pan(slideFactor, 0);
                break;
        }
	},
	
	/**
	 * Method: pluginSnapClear
	 * Disattiva tutti i controlli di snap e rende invisibili i relativi layers
	 */
	pluginSnapClear: function(){
		for(var codTPN in this.snapControls){			
			this.pluginSnapDeactivate(codTPN);			
		}		
	},
	
	/**
	 * Method: pluginSnapActivate
	 * Attiva il controllo di snap per il layer relativo al codTPN passato e visualizza tutti i layer
	 * per i quali è possibile fare lo snap.
	 *
	 * Parameters:
	 * codTPN - {int} codice del layer su cui attivare lo snap 
	 */
	pluginSnapActivate: function(codTPN){
		if(this.snapControls[codTPN]){
			for(var l = 0; l < this.snapControls[codTPN][0].layerList.length; l++){
				this.snapControls[codTPN][0].layerList[l].setVisibility(true);
			}
			for(var sc = 0; sc < this.snapControls[codTPN].length; sc++){
				this.snapControls[codTPN][sc].activate();
			}
		}
	},
	
	/**
	 * Method: pluginSnapDeactivate
	 * Disattiva il controllo di snap per il layer relativo al codTPN passato e rende invisibili tutti i layer
	 * per i quali è possibile fare lo snap.
	 *
	 * Parameters:
	 * codTPN - {int} codice del layer su cui disattivare lo snap 
	 */
	pluginSnapDeactivate: function(codTPN){
		if(this.snapControls[codTPN]){
			//if(this.snapControls[codTPN].deactivate){
				for(var sc = 0; sc < this.snapControls[codTPN].length; sc++){
					if(this.snapControls[codTPN][sc] && this.snapControls[codTPN][sc].deactivate){
						this.snapControls[codTPN][sc].deactivate();
						for(var l = 0; l < this.snapControls[codTPN][sc].layerList.length; l++){
							this.snapControls[codTPN][sc].layerList[l].setVisibility(false);
						}
					}
				}
			//}
		}
	},
	
	pluginRemoveAllLayers: function() {
		 var num = this.layersMappa.length;
		 for (var j=0; j<num; j++) {
			 //this.layersMappa[j].events.remove("loadstart");
			 //this.layersMappa[j].events.remove("loadend");
			 //this.layersMappa[j].events.remove("loadcancel"); 
			 this.map.removeLayer( this.layersMappa[j], false );
			 //this.layersMappa[j].destroy();
			 //this.layersMappa[j]=null;
		  }  
		 this.layersMappa.length=0;
	},
	
	/**
	 * Method: isBusy
	 * Funzione di busy.
	 *
	 * Parameters:
	 * scale - {Number} scale
	 */
	isBusy: function (){ return this.mapBusy != 0;},
	
	/**
	 * Method: onBusy
	 * Funzione di busy.
	 *
	 * Parameters:
	 * areYouBusy - {Boolean} areYouBusy
	 */
	onBusy: function (areYouBusy){
			if(areYouBusy){
				this.mapBusy++;
				this.refreshBusy();
				//if (this.myMask) this.myMask.show();
			}else{
				if (this.mapBusy>0) this.mapBusy--;
				if(!this.isBusy()){
					this.refreshBusy();
					//if (this.myMask) this.myMask.hide();
				}
			}
		},
		
	/**
	 * Method: noneBusy
	 * Funzione di busy.
	 * 
	 */	
	noneBusy: function (){
		this.mapBusy = 0;
		if (this.myMask) this.myMask.hide();
	},

	/**
	 * Method: refreshBusy
	 * Funzione di busy
	 */
	refreshBusy: function() {
		if (this.myMask) 
			if (this.mapBusy) this.myMask.show();
			else this.myMask.hide();
	},

	
	/**
	 * Method: relayContainerMove
	 *
	 * Parameters:
	 * ctl - {} ctlBusy

		relayContainerMove: function (ctl) {
			var a= null;
			if(ctl.ownerCt) {
				a= this.relayContainerMove(ctl.ownerCt);
				if (!a) return ctl.ownerCt;
				else return a;
			}
		},*/
	
	getGoogleApiVersion: function() {
		
		return (typeof GMap2 === "function" ? "2" : "3");
		
	},
	
	/** TODO Per adesso non è supportato il meccanismo del caricamento on demand
	 * 
	 */
	loadLayerPrereq: function(tipoLayer, callbackFn) {
		/* TODO
		var urls = this.layerTypePrereq[tipoLayer];
		var url="";
		
		// ALE Da fare scelta per adesso carica la 3
		if (tipoLayer>0 && tipoLayer<5) { // Layer Google
		//	url = (getGoogleApiVersion==2) ? urls[0] : urls[1]; 
			url = urls[1];
		} else {
			url = urls[0];
		}
		if (url!="") loadScript(url, function() { 
										//alert('ciao'); 
										callbackFn(tipoLayer);
										} );
		else callbackFn(tipoLayer);
		*/
	},

	pluginAddAllMaps: function() {
		// Cerca tra le mappe in this.paramsJS.mappe
		for (var i = 0; i<this.paramsJS.mappe.mappaList.length; i++) {
			var mappa = this.paramsJS.mappe.mappaList[i];
			this.pluginAddLayer(mappa, i, this.customQuery, this.map.getNumLayers(), false);
		}
	},
	
	/**
	 * Aggiunge un layer in mappa. Non è supportato l'inserimento di una mappa di un tipo per il quale non sia già stata inclusa l'api se necessaria  
	 * (per esempio una mappa google se non è stato già incluso l'apposito javascript <br/>
	 * Esempio di utilizzo: <br/>
	   <pre>
	  		var mappa = new Object();
			mappa.mapOptions = "layers: 'WMS_PRATO'";
			mappa.overlay = false;
			mappa.SRID = "EPSG:3003";
			mappa.units = "m";
			mappa.mostraInLegenda=true;
			mappa.viewerOptions = "";
			mappa.typeCode = 11;		// WMS
			mappa.nome = "WMS Prato";
			mappa.url = "http://geoserver.comune.prato.it/geoserver/wms";
			tolomeoPnl.api.addLayer(mappa);
	   </pre>
	 * 
	 * @param {} mappa - Oggetto javascript corrispondente alla serializzazione di un tag mappa del file di preset
	 * @param {} nMappa - posizione nel layer switcher
	 * @param {} customQuery - come analogo parametro in olViewerNewLayer
	 */
	pluginAddLayer: function(mappa, nMappa, customQuery, showLayerSwitcher) {
		var me = this;
		//this.loadLayerPrereq(mappa.typeCode,
		//			function() { 
						me.loadLayerCallback(mappa, nMappa, customQuery, showLayerSwitcher) //}
		//			);
		
	},
	
	loadLayerCallback: function(mappa, nMappa, customQuery, showLayerSwitcher) {
		var layer = this.olViewerNewLayer(mappa, nMappa, customQuery);
		  
		if (layer instanceof Array) {
			for (var i=0; i<layer.length; i++) {
				var pos = (layer[i].toloViewerLayerIndex!=undefined && layer[i].toloViewerLayerIndex!=null) ? layer[i].toloViewerLayerIndex : null;
				this._addLayerInMap(layer[i], nMappa, pos, showLayerSwitcher);	
			}
		} else {
			var pos = (layer.toloViewerLayerIndex) ? layer.toloViewerLayerIndex : null;
			this._addLayerInMap(layer, nMappa, pos, showLayerSwitcher);
		}
	},
	
	_addLayerInMap: function(layer, nMappa, pos, showLayerSwitcher) {
		this.layersMappa.push(layer);
		this.map.addLayer(layer);
		if (pos!=undefined && pos!=null) {
			this.map.setLayerIndex(layer, pos);
		}
		var controlId = 'layerSwitcher';
		if ((showLayerSwitcher==undefined || showLayerSwitcher==null || showLayerSwitcher==true) && this.map.getNumLayers()>1 && !this.map.getControl(controlId)) {
			var control = new OpenLayers.Control.LayerSwitcher({activeColor: "#004000", ascending: false});
			control.id = controlId;
			this.map.addControl(control);
		}
		// Se layer.singleTile è definito ed è true
		this.olRegisterLoadEvents(layer);
		if (layer.toloViewerWithBusy) 	this.olRegisterBusyEvents(layer);		
	},
	
	olViewerNewLayer: function (mappa, nMappa, customQuery, positionBase) {
	
		if (positionBase==undefined || positionBase==null) positionBase=0;
		var retVal = [];
		for (var i=0; i<this.paramsJS.mapDefinitions[nMappa].getLayerAggregationCount(); i++) {
			this.paramsJS.mapDefinitions[nMappa].getLayerAggregation(i).nPluginLayer = positionBase+i;
			retVal.push(this.olViewerNewLayer1(nMappa,i, customQuery));
			//retVal.push(this.olViewerNewLayer1(this.paramsJS.mapDefinitions[nMappa].getLayerAggregation(i), customQuery));	
		}
		// inverto l'ordine per sequire la convenzione GIS (layer più in alto visibile sopra gli altri) che è contraria a quella di openlayers
		return retVal;
	},
	
	//  mappa, nMappa,
	// server, serverOpts, layers, layerOpts
	olViewerNewLayer1: function (nMappa, layerAggregIndex, customQuery) {
		
		// mpOpt mappa.mapOptions --> server opt, parametri che vengono trasmessi al server in query string -> serverOpts
		// viewerOptions --> opzioni del layer openlayers
		
		// layers deve contenere 
		//	nomi layer
		//  stili layer
		
		//TODO LayerSfondo non sono più gestiti qua. li deve gestire il chiamante
	
		var layViewAggreg = this.paramsJS.mapDefinitions[nMappa].getLayerAggregation(layerAggregIndex);
		var server = layViewAggreg.server;
		var layersAggreg = layViewAggreg.layers;
		var layerSep;
		
		var layer = null;
		var layerOptions = null;
		//transparent: true
		var mpOpt = { transparent: true };
		if (server.serverOpts!=null) {
			var buff =Ext.JSON.decode("{" +  server.serverOpts + "}"); // Ext.util.JSON.decode("{" + mappa.mapOptions + "}");
			OpenLayers.Util.extend(mpOpt, buff);
		}

		layerOptions = new Object();
		
		layerOptions.singleTile             = !layViewAggreg.tilesMultiple;
		layerOptions.isBaseLayer            = !layViewAggreg.overlay;
		layerOptions.projection             = layViewAggreg.SRID;
		layerOptions.units                  = layViewAggreg.units;
		layerOptions.displayInLayerSwitcher = layViewAggreg.mostraInLegenda;				
		layerOptions.opacity                = (layViewAggreg['opacity']!=undefined && layViewAggreg['opacity']!=null) ? layViewAggreg['opacity'] : 1;
		
		//layerOptions.transitionEffect       = 'resize';
		
		//ALE aggiunte per layer google che non sentiva quelli dell'oggetto mappa 
		layerOptions.maxExtent = new OpenLayers.Bounds(this.paramsJS.mappe.maxExtentLeft, this.paramsJS.mappe.maxExtentBottom, this.paramsJS.mappe.maxExtentRight, this.paramsJS.mappe.maxExtentTop);
		layerOptions.minScale = this.paramsJS.mappe.minScale;
		layerOptions.maxScale = this.paramsJS.mappe.maxScale;

		var zs = this.getDefaultZoomLevels();
		if (zs!=null) {
			layerOptions.resolutions = [];
			for(var i = 0; i < zs.length; i++) {
				layerOptions.resolutions.push(OpenLayers.Util.getResolutionFromScale(zs[i], layerOptions.units));
			}
		} 

		
		var layerOptionsDaParamsJS = Ext.JSON.decode("{" + layViewAggreg.layerOptions + "}"); // Ext.util.JSON.decode("{" + mappa.viewerOptions + "}");
		Ext.apply(layerOptions, layerOptionsDaParamsJS);
		
		switch (layViewAggreg.server.typeCode) {
			
			// Mapserver
			case 0:
				layerSep = " ";
								
				var layAndStyle = this.paramsJS.getLayerAggregLayersAndStylesStrings(nMappa, layViewAggreg.nPluginLayer, layerSep, this.pluginGetCurrentZoom());
				mpOpt.layers = layAndStyle.layers;
				
				/*
				var defGrp ='';
				for (var i=0;i<layersAggreg.length; i++) {
					var currLayer = layersAggreg[i];
					defGrp += (defGrp!="") ? " " : "";
					defGrp +=  currLayer.name;
				}
				mpOpt.layers = defGrp;
				*/
				
				/*
				var defGrp ='';
				
				if (this.paramsJS.getLayerSfondoString(mappa, ' ') != null) defGrp += this.paramsJS.getLayerSfondoString(mappa, ' ');
				
				// Se presente legenda carico solo layer previsti da defGroupList
				if (mappa.legenda) {
					var buff = mappa.legenda.defaultGroupList;
					for (var i=0;i<buff.length; i++) {
						defGrp += (defGrp!="") ? " " : "";
						defGrp +=  buff[i];
					}
					mpOpt.layers = defGrp;

				} else {
				
					mpOpt.layers = "all";
				}
				*/
				
				mpOpt.map_imagetype = (layViewAggreg.imageType!= undefined && layViewAggreg.imageType!=null && layViewAggreg.imageType!="") ? layViewAggreg.imageType : "agga";
				mpOpt.map_resolution = OpenLayers.DOTS_PER_INCH;
				
				layerOptions.attribution = layAndStyle.attribution ;
				
			 	layer = new OpenLayers.Layer.MapServer(server.nome, server.url, mpOpt, layerOptions);	
	            
	            layer.toloViewerWithBusy = layer.singleTile;

				break;

			// Google Streets
			case 1:	
				layer = new OpenLayers.Layer.Google(server.nome,   layerOptions );
				layer.toloViewerWithBusy = false;
				break;

			// Google Physical
			case 2:
				Ext.apply(layerOptions, {  type: (this.getGoogleApiVersion() == "2") ? G_NORMAL_MAP : google.maps.MapTypeId.TERRAIN });
				layer = new OpenLayers.Layer.Google(server.nome,   layerOptions );
				layer.toloViewerWithBusy = false;
				break;
			
			// Google Satellite
			case 3:
				Ext.apply(layerOptions, {  type: (this.getGoogleApiVersion() == "2") ? G_SATELLITE_MAP : google.maps.MapTypeId.SATELLITE });
				layer = new OpenLayers.Layer.Google(server.nome,   layerOptions );
				layer.toloViewerWithBusy = false;
				break;
			
			// Google Hybrid
			case 4:
				Ext.apply(layerOptions, {  type: (this.getGoogleApiVersion() == "2") ? G_HYBRID_MAP : google.maps.MapTypeId.HYBRID });
				layer = new OpenLayers.Layer.Google(server.nome,   layerOptions );
				layer.toloViewerWithBusy = false;
				break;
			
			// Yahoo Sat
			case 5: 
				Ext.apply(layerOptions, {  type: YAHOO_MAP_SAT });
				layer = new OpenLayers.Layer.Yahoo(server.nome, layerOptions);
				layer.toloViewerWithBusy = false;
				break;
			
			// Yahoo Reg
			case 6:
				Ext.apply(layerOptions, {  type: YAHOO_MAP_REG });
				layer = new OpenLayers.Layer.Yahoo(server.nome, layerOptions);
				layer.toloViewerWithBusy = false;
				break;
			
			// Yahoo Hybrid
			case 7:	
				Ext.apply(layerOptions, {  type: YAHOO_MAP_HYB });
				layer = new OpenLayers.Layer.Yahoo(server.nome, layerOptions);
				layer.toloViewerWithBusy = false;
				break;
			
			// Bing Aerial
			case 8:
				Ext.apply(layerOptions, {  type: VEMapStyle.Aerial });
				layer = new OpenLayers.Layer.VirtualEarth(server.nome,   layerOptions );
				layer.toloViewerWithBusy = false;
				break;

			// Bing Shaded
			case 9:
				Ext.apply(layerOptions, {  type: VEMapStyle.Shaded });
				layer = new OpenLayers.Layer.VirtualEarth(server.nome,   layerOptions );
				layer.toloViewerWithBusy = false;
				break;
			
			// Bing Hybrid
			case 10:
				Ext.apply(layerOptions, {  type: VEMapStyle.Hybrid });
				layer = new OpenLayers.Layer.VirtualEarth(server.nome,   layerOptions );
				layer.toloViewerWithBusy = false;
				break;	
			
			// WMS
			case 11: 	    		
				mpOpt.minZoomLevel = 0;
				layerSep = ",";
				var layAndStyle = this.paramsJS.getLayerAggregLayersAndStylesStrings(nMappa, layViewAggreg.nPluginLayer, layerSep, this.pluginGetCurrentZoom()); 
				mpOpt.layers = layAndStyle.layers;
				mpOpt.styles = layAndStyle.stili;
				// WMS 1.3.0 vuole CRS, versioni precedenti vogliono CRS. 
				// Aggiungo anche CRS per avere qualcosa che funzioni in entrambi i casi, per non dover prima fare la getcapabilities per stabilire la versione
				mpOpt.CRS = this.pluginGetProjectionCode();
				if (mpOpt.layers == undefined || mpOpt.layers==null || mpOpt.layers=="") {
					layerOptions.visibility=false;
				}				
				/*
				var defGrp ='';
				var styles ='';
				for (var i=0;i<layersAggreg.length; i++) {
					var currLayer = layersAggreg[i];
					if ((defGrp!="")) {
						defGrp += ",";
						styles +=',';
					} 
					defGrp +=  currLayer.name;
					styles +=  (currLayer.style!=undefined && currLayer.style!=null) ? currLayer.style : "";
				}
				mpOpt.layers = defGrp;
				mpOpt.styles = styles;
				*/
				
				/*
				// Layer e stili di sfondo
				if(!mpOpt.layers) mpOpt.layers = '';
				if(!mpOpt.styles) mpOpt.styles = '';
				var bAlmenoUnLayer = false;
				if (this.paramsJS.getLayerSfondoString(mappa, ',')!=null) {
					mpOpt.layers = this.paramsJS.getLayerSfondoString(mappa, ',');
					mpOpt.styles = this.paramsJS.getLayerSfondoStyleString(mappa, ',');
					bAlmenoUnLayer = true;
				}
				if (mappa.legenda) {
					// L'ordine delle voci in legenda sono invertite con reverse perchè WMS vuole prima i layer sotto e poi quelli sopra
					mpOpt.layers += ((mpOpt.layers!='') ? ',' : '') + mappa.legenda.defaultGroupList.reverse().toString();
					// il controllo viene fatto su bAlmenoUnLayer perchè il primo stile potrebbe essere quello di default (stringa vuota) ma in questo caso il separatore deve comunque essere inserito
					mpOpt.styles += ((bAlmenoUnLayer) ? ',' : '') + mappa.legenda.defaultGroupStyleList.reverse().toString();
				}
				*/
				
				if (layViewAggreg.tilesMultiple) {
					mpOpt.tilesorigin = [this.paramsJS.mappe.maxExtentLeft, this.paramsJS.mappe.maxExtentBottom];
					mpOpt.tiled = true;
				}
				
				layerOptions.attribution = layAndStyle.attribution ;
    		    layer = new OpenLayers.Layer.WMS(server.nome, server.url, mpOpt, layerOptions);
    		    layer.id = Math.random();
    		    //layer.id = "OpenLayers.Layer.WMS_" + server.url + mpOpt.layers+Math.random();
    		    layer.toloViewerWithBusy = layer.singleTile;


    		    break;
			
			// OpenStreetMap
			case 12:
				layer = new OpenLayers.Layer.OSM(server.nome);
				layer.toloViewerWithBusy = layer.singleTile;
				break;
				
			default:
				break;
		}
		layer.events.register('moveend', this, this.olLayerMove);
		layer.toloViewerLayerIndex=layViewAggreg.nPluginLayer;
		layer.toloNMappa = nMappa;
		layer.toloLayerSep = layerSep;
		
		//layer.events.register('loadstart', this, function(object, element) { return this.aaaa(object, element,layer, layerSep);});
		
		// TODO ??? layer.numeroMappa = nMappa;
		return layer;
	},

	olLayerScaleFilter: function(object, element) {
		
		for (var i=0; i<this.layersMappa.length; i++) {
			var layer=this.layersMappa[i];
					
			var layAndStyle = this.paramsJS.getLayerAggregLayersAndStylesStrings(layer.toloNMappa, layer.toloViewerLayerIndex, layer.toloLayerSep, ((object && object.zoomChanged && object.zoom && this.map.baseLayer) ? OpenLayers.Util.getScaleFromResolution(this.map.getResolutionForZoom(object.zoom), this.map.baseLayer.units) : this.pluginGetCurrentZoom()));
			
			if (layAndStyle.layers=="") {
				layer.setVisibility(false);
			} else {
				
				// modifica con i nuovi parametri
				//layer.mergeNewParams({layers: layAndStyle.layers, styles:  layAndStyle.stili });
				// Non utilizzo la mergeNewParams perchè innesca un redraw. Modifico layer.params direttamente (funzione non documentata, visto dai sorgenti il funzionamento della mergeNewParams)							
				if(layer.CLASS_NAME.indexOf("WMS")!=-1){
					// Aggiunto controllo su WMS, perchè altrimenti per Mapserver vengono inviati due parametri: "layer" e "LAYER" ed il secondo sovrascrive il primo non facendo 
					// correttamente i soli layers che devono essere accesi e/o spenti									
					layer.params = OpenLayers.Util.extend(layer.params, {LAYERS: layAndStyle.layers, STYLES:  layAndStyle.stili });					
				} else {
					layer.params = OpenLayers.Util.extend(layer.params, {layers: layAndStyle.layers, styles:  layAndStyle.stili });
				}
				
				layer.setVisibility(true);
			}
		}
		return true;
	},
	
	olLayerMove: function(obj) {
		//if (obj.zoomChanged)
		this.fireEvent("onMapMoveEnd", obj);
		
	},
	
	/**
	 * Method: olAutoIdentifyOnPause
	 *
	 * Parameters:
	 * e - {} evento.
	 */
	olAutoIdentifyOnPause: function (e){
		var lonlat = this.map.getLonLatFromViewPortPx(e.xy);
		this.fireEvent('onAutoIdentify', new Point(lonlat.lon, lonlat.lat), e.clientX, e.clientY, e.xy.x, e.xy.y);
		//onAutoIdentify(new Point(lonlat.lon, lonlat.lat), e.clientX, e.clientY);
	},
		
	/**
	 * Method: olAutoIdentifyOnMove
	 *
	 */
	olAutoIdentifyOnMove: function olAutoIdentifyOnMove() {
		this.fireEvent('onAutoIdentifyCancel', null);
		//onAutoIdentifyCancel();
	},
	
	/**
	 * Method: olHandleMeasurements
	 *
	 * Parameters:
	 * e - {} event
	 * partial - Boolean tha specify if measure is partial or final
	 *
	 * Returns:
	 *     {Booelan} 
	 */
	olHandleMeasurements : function (event,partial) {
		
		var control = event.control;
        var geometry = event.geometry;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;            
        var returnObj = {dimension: order};        
                    
        if(order == 1) {
        	
            returnObj.length = {
            	'units' : units,
            	'measure' : measure
            }            
            returnObj.area = {            
            	'units' : units,
            	'measure' : 0
            }
            
        } else {
        	
        	var length = control.getBestLength(geometry);
        	
        	returnObj.length = {
            	'units' : length[1],
            	'measure' : length[0]
            }            
            returnObj.area = {            
            	'units' : units,
            	'measure' : measure
            }                       
        }            
        
        if(partial){
        	this.fireEvent('onMeasureChanging', returnObj);
        } else {
        	this.fireEvent('onMeasureChanged', returnObj);
        }
    },

	/**
	 * Method: olRegisterBusyEvents
	 *
	 * Parameters:
	 * layer - {} layer.
	 *
	 * Returns:
	 *     {Booelan} 
	 */
	olRegisterBusyEvents: function (layer) {
			layer.events.register("loadstart",  this, function () { this.onBusy(true); } );
			layer.events.register("loadend",    this, function () { this.onBusy(false);} );
			layer.events.register("loadcancel", this, function () { this.onBusy(false);} );
			
			return true;
	},

	olRegisterLoadEvents: function (layer) {
		layer.events.register("loadstart",  this, function () { this.fireEvent('loadstart'); } );
		layer.events.register("loadend",    this, function () { this.fireEvent('loadend');  } );
		layer.events.register("loadcancel", this, function () { this.fireEvent('loadcancel'); } );
		
		return true;
	},
	
	
	/**
	 * Method: activateControl
	 * Attiva un controllo disattivando tutti gli altri. Agisce su tutti i controlli con esclusione di quelli relativi al drawlayer (vedi activateControlDrawLayer)
	 *
	 * Parameters:
	 * nome - {String} nome.
	 */
	activateControl: function (nome) {
	    for (var key in this.mapControls) {
	    	if ( (key!='legend') && (key!=nome)  && (key!='navigation')) { 
	    		// lancio timeout invece di fare direttamente perchè viene invocato all'interno di un evento e si verificava errore this.point has no properties
	        	//setTimeout( "this.mapControls['"+key+"'].deactivate()", 2500 );
	        	this.mapControls[key].deactivate();	        	
	    	}
	    }
	    
	    this.mapControls[nome].activate();	    
	},
	
	/**
	 * Method: activateControl
	 * Attiva un controllo disattivando tutti gli altri. Agisce esclusivamente sui controlli relativi al drawlayer (vedi anche activateControl)
	 *
	 * Parameters:
	 * nome - {String} nome.
	 */
	activateControlDrawLayer: function (nome) {
	    for (var key in this.mapControlsDrawLayer) {
	        	this.deactivateControlDrawLayer(key);
	    }
	    this.mapControlsDrawLayer[nome].activate();
	},

	
	/**
	 * Method: deactivateControl
	 * Disattiva un controllo.
	 *
	 * Parameters:
	 * nome - {String} nome
	 */
	deactivateControl: function (nome) {
		this.mapControls[nome].deactivate();
	},
	
	/**
	 * Method: deactivateControlDrawLayer
	 * Disattiva un controllo.
	 *
	 * Parameters:
	 * nome - {String} nome
	 */
	deactivateControlDrawLayer: function (nome) {
		this.mapControlsDrawLayer[nome].deactivate();
	},
	
	/**
	 * Method: olViewerGeometryToGeometry
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 *
	 * Returns:
	 *     {JSGeometryArray o JSGeometry} 
	 */
	olViewerGeometryToGeometry: function (geom) {
	    var jsGeometry = new JSGeometry();
	    
	    var wkt = new OpenLayers.Format.WKT();

	    if (geom.geometry == undefined) {
	    	jsGeometry.geometry = wkt.write(geom.feature);
	    } else { 
	    	jsGeometry.geometry = wkt.write(geom);
	    }
	    jsGeometry.SRID = this.paramsJS.mappe.SRID;
		
		return jsGeometry;
	},

	/**
	 * Method: olViewerOnDigitizedPoint
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 * 
	 */
	olViewerOnDigitizedPoint: function (geom) {
		// Chiama la funzione di TolomeoIF
		this.fireEvent('onDigitizeEndPoint', this.olViewerGeometryToGeometry(geom));
		//onDigitizeEndPoint(this.olViewerGeometryToGeometry(geom));
		this.activateControl('navigation');
	},
	
	/**
	 * Method: olViewerOnDigitizedPointFromRef
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 * 
	 */
	olViewerOnDigitizedPointFromRef: function (geom) {
		// Chiama la funzione di TolomeoIF
		this.fireEvent('onDigitizePointFromRefEnd', this.olViewerGeometryToGeometry(geom));
		this.olViewerOnDigitizedPoint(geom);
	},
	
	/**
	 * Method: olViewerOnDigitizedPointByCAD
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 */
	olViewerOnDigitizedPointByCAD: function (geom) {
		// Chiama la funzione di TolomeoIF
		this.fireEvent('onDigitizePointByCADEnd', this.olViewerGeometryToGeometry(geom));
		this.olViewerOnDigitizedPoint(geom);
		
	},
	
	/**
	 * Method: olViewerOnDigitizedLine
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 */
	olViewerOnDigitizedLine: function (geom) {
		this.fireEvent('onDigitizeEndLine', this.olViewerGeometryToGeometry(geom));
		this.activateControl('navigation');
	},
	
	/**
	 * Method: olViewerOnDigitizedLineByCAD
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 */
	olViewerOnDigitizedLineByCAD: function (geom) {
		// Chiama la funzione di TolomeoIF
		this.fireEvent('onDigitizeLineByCADEnd', this.olViewerGeometryToGeometry(geom));
		this.olViewerOnDigitizedLine(geom);
		
	},
	
	/**
	 * Method: olViewerOnDigitizedPolygon
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 * 
	 */
	olViewerOnDigitizedPolygon: function (geom) {
		// Chiama la funzione di TolomeoIF
		this.fireEvent('onDigitizeEndPolygon', this.olViewerGeometryToGeometry(geom));
		//onDigitizeEndPolygon(this.olViewerGeometryToGeometry(geom));
		this.activateControl('navigation');
	},
	
	/**
	 * Method: olViewerOnDigitizedPolygonByCAD
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 * 
	 */
	olViewerOnDigitizedPolygonByCAD: function (geom) {
		// Chiama la funzione di TolomeoIF
		this.fireEvent('onDigitizePolygonByCADEnd', this.olViewerGeometryToGeometry(geom));		
		this.olViewerOnDigitizedPolygon(geom);
	},

	/**
	 * Method: olViewerOnVertexEditingEnd
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 */
	olViewerOnVertexEditingEnd: function (geom) {
		this.fireEvent('onDigitizeEndVertexEditing', this.olViewerGeometryToGeometry(geom));
		this.activateControl('navigation');
	},
	
	
	/**
	 * Method: olViewerOnDigitizedFeatureVertexEditingEnd
	 * Funzione chiamata alla fine di una azione di vertex editing su una feature già digitalizzata in precedenza
	 * Parameters:
	 * geom - {} la geometria.
	 */
	olViewerOnDigitizedFeatureVertexEditingEnd: function (geom) {
		this.fireEvent('onDigitizedFeatureVertexEditingEnd', this.olViewerGeometryToGeometry(geom));
	},
		
	/**
	 * Method: olViewerOnDragDropEnd
	 *
	 * Parameters:
	 * geom - {} la geometria.
	 */
	olViewerOnDragDropEnd: function (geom) {
		this.fireEvent('onDigitizeEndDragDrop', this.olViewerGeometryToGeometry(geom));
		this.activateControl('navigation');
	},
	
	/**
	 * Method: olViewerOnDigitizedFeatureDragDropEnd
	 * Funzione chiamata alla fine di una azione di drag and drop su una feature già digitalizzata in precedenza
	 * Parameters:
	 * geom - {} la geometria.
	 */
	olViewerOnDigitizedFeatureDragDropEnd: function (geom) {
		this.fireEvent('onDigitizedFeatureDragDropEnd', this.olViewerGeometryToGeometry(geom));
	},
	
	/**
	 * Method: pluginSetDistanceFromRef
	 * Set the distance from the reference point
	 * 
	 * Prameters:
	 * distance - {} the distance
	 */
	pluginSetDistanceFromRef: function(distance){
		this.mapControlsDrawLayer['pointFromRef'].handler.setDistance(distance);
	},
	
	/**
	 * Method: getDefaultZoomLevels
	 *
	 * Returns:
	 *     Il valore di zoom di default.
	 */
	getDefaultZoomLevels : function(){			
		var defaultZoomLevels = this.paramsJS.mappe.zoomLevels.split(",");
		var zoomLevels = [];
		if(defaultZoomLevels){
			for(var i = 0; i<defaultZoomLevels.length; i++){
				var defaultZoomLevel = parseInt(defaultZoomLevels[i]); 
				if(defaultZoomLevel <= this.paramsJS.mappe.minScale && defaultZoomLevel >= this.paramsJS.mappe.maxScale)
					zoomLevels.push(defaultZoomLevel);
			}
		}			
		
		return zoomLevels;
	},
	
		
	/**
	 * Method: pluginGetCoordinateActivate
	 * Esegue il necessario per attivare la rilevazione delle coordinate
	 */
	/*
	pluginGetCoordinateActivate : function(){
		this.map.events.register("click", this, this.notifyCoordinate);
	},
	*/
	/**
	 * Method: notifyCoordinate
	 * Notifica il cambio/rilevazione di coordinate
	 */
	/*
	notifyCoordinate: function(evt){
		var mousexy = evt.xy;
		var lonlat = this.map.getLonLatFromPixel(mousexy);
		var coords = {x:lonlat.lon,y:lonlat.lat};
		this.fireEvent('onCoordinateChange', mousexy, coords, this.pluginGetProjectionCode());
	},
	*/
	/**
	 * Method: pluginGetCoordinateDeactivate
	 * Esegue il necessario per disattivare la rilevazione delle coordinate
	 */
	/*
	pluginGetCoordinateDeactivate : function(){		
		this.map.events.unregister("click", this, this.notifyCoordinate);
	},
	*/
	
	/**
	 * Method: pluginGetProjectionCode
	 * @return {String} restituisce il codice EPSG del sistema di riferimento
	 */
	pluginGetProjectionCode: function(){
		return this.map.getProjection() || this.map.projection;
	},

	// Gestione Google Streetview
	bindToStreetviewViewer: function(streetviewViewer) {
		if (streetviewViewer) {	
			streetviewViewer.on('onPositionChanged', this.pluginUpdateStreetviewPosition, this);
			streetviewViewer.on('onPovChanged'     , this.pluginUpdateStreetviewPosition, this);
			streetviewViewer.on('onLinksChanged'   , this.pluginStreetviewDrawNavLinks  , this);
		}
	},
	
	
	pluginAddStreetviewLayers: function() {
		
		var me = this;		
		
		// Layer del marker: contenete la posizione relativa alla scena streetview visualizzata e il simbolo utilizzato indica anche la direzione di visualizzazione
		this.streetViewMarkerLayer = new OpenLayers.Layer.Vector("Google Streetview Marker", {
        	styleMap: new OpenLayers.StyleMap({
            	"default": {
                    externalGraphic: this.TOLOMEOServer  + this.TOLOMEOStaticRoot + 'img/streetview/tool.png',
                    graphicHeight: 32,
                    graphicWidth: 32,
                    graphicOpacity: 0.8,
                    rotation: "${yaw}"
                },
                "select": {
                    cursor: "pointer"
                }
            })
		});		
		
        // Layer contenete le freccette che indicano in quale direzione è possibile navigare con streetview
		this.streetViewNavigationLinkLayer = new OpenLayers.Layer.Vector("Google Streetview Navigation Links", {
            styleMap: new OpenLayers.StyleMap({
                "default": {
                    externalGraphic: this.TOLOMEOServer +  this.TOLOMEOStaticRoot + 'img/streetview/link.png',
                    graphicHeight: 24,
                    graphicWidth: 16.5,
                    graphicYOffset: -44,
                    graphicOpacity: 0.8,
                    rotation: "${angle}"
                },
                "temporary": {
                    cursor: "pointer",
                    externalGraphic: this.TOLOMEOServer +  this.TOLOMEOStaticRoot + '/img/streetview/link_selected.png'
                }
            })
        });
		
		this.map.addLayer(this.streetViewMarkerLayer);
		this.map.addLayer(this.streetViewNavigationLinkLayer);

		// Controllo DragFeature per drag drop punto di panorama
        this.streetViewDragControl = new OpenLayers.Control.DragFeature(this.streetViewMarkerLayer, {
            onComplete: function(feature, pixel) {
		    	var position = me.map.getLonLatFromPixel(pixel);
		        var currPoint = new Point(position.lon,position.lat);	
		        // riproietto le coordinate
		        currPoint.transform(me.pluginGetProjectionCode(),"EPSG:4326");        
		        me.fireEvent('onStreetviewDropComplete', currPoint.x ,currPoint.y);
        	}
        });
                      
        
        var streetviewDelegatorWidget = Ext.create('TolomeoExt.ToloViewerOLPanel.SelectFeatureControlManager.DelegatorWidget',{
	    	id : 'streetview',
	    	layers : [this.streetViewNavigationLinkLayer,this.streetViewMarkerLayer],
	    	callbacks: {
		    	onSelect : function(layerName,feature,viewer){
		    		viewer.fireEvent('onStreetviewNavLinkClick', feature.attributes.panoId);
		    	},	    	
		    	onDeactivate : function(viewer) {
		    		viewer.streetViewNavigationLinkLayer.destroyFeatures();
		    		viewer.streetViewMarkerLayer.destroyFeatures();
		    	}
	    	},
	    	moreControls : [this.streetViewDragControl]
	    });
        	
        this.routingControlManager.addDelegator(streetviewDelegatorWidget);

	},
	
	
	/*
	_addSelectFeatureControl: function(layers, options) {
		var allLayers = layers.concat(this.selectFeatureCurrLayers);
		var ctrl =  new OpenLayers.Control.SelectFeature(allLayers, options);
		this.selectFeatureCurrLayers = allLayers;
		
		return ctrl;
	},*/
	/*
	pluginRemoveStreetviewLayers: function() {
		
		this.streetViewDragControl.deactivate();
		this.streetviewSelectControl.deactivate();
		this.streetviewHighlightCtrl.deactivate();
		
		this.map.removeLayer(this.streetViewMarkerLayer);
		this.map.removeControl(this.streetViewDragControl);
		this.map.removeLayer(this.streetViewNavigationLinkLayer);
		this.map.removeControl(this.streetviewSelectControl);
		this.map.removeControl(this.streetviewHighlightCtrl);
	},
	*/
	pluginUpdateStreetviewPosition: function(lon, lat, heading) {
		
			// Destroy the existing features
	        this.streetViewMarkerLayer.destroyFeatures();
	        
	        var currPoint = new Point(lon,lat);			
			// riproietto le coordinate
	        currPoint.transform("EPSG:4326",this.pluginGetProjectionCode());
	        // Compute the new position
	        var pos = new OpenLayers.Geometry.Point(currPoint.x, currPoint.y);
	        
	        // Add a vector feature in navigation layer
	        var panomarker = new OpenLayers.Feature.Vector(pos, {yaw: heading});
	        this.streetViewMarkerLayer.addFeatures([panomarker]);
	        
	        //TODO l'evento linkschanged scatta automaticamente quando cambia posizione? In questo caso questa chiamata è inutile 
	        //this.pluginStreetviewDrawNavLinks();
	   
			// DA FARE
			// controllre anche se pos cambiata per evitare inutili
			
	}, 
	
	pluginStreetviewDrawNavLinks: function(links, position) {
		
        //var links = this.panorama.getLinks();
		//var position = this.panorama.getPosition();
		
		// Destroy the existing features
        this.streetViewNavigationLinkLayer.destroyFeatures();
        // Add new link symbols
        this.navigationLinks = [];
        if (links) {
            for (var i = 0; i < links.length; i++) {
                var link = links[i];
                
                //////////////////////////////////////////////////////////////////
    	        var centerPoint = new Point(position.lng(),position.lat());    			
    			// riproietto le coordinate
    	        centerPoint.transform("EPSG:4326",this.pluginGetProjectionCode());
    	        // Compute the new position
    	        var centerPosition = new OpenLayers.Geometry.Point(centerPoint.x, centerPoint.y);
    	        
    			//////////////////////////////////////////////////////////////////
                
                //TODO chiamare proj4js con funzioni lazy di federico o meglio funzione su api
    	        /*
                var centerPosition = new OpenLayers.Geometry.Point(position.lng(), position.lat());
                centerPosition.transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
                */
                // Add a vector feature as navigation link
		        this.navigationLinks.push(new OpenLayers.Feature.Vector(centerPosition, {angle: link.heading, panoId: link.pano}));
            }
            if (this.navigationLinks.length > 0) {
      	        this.streetViewNavigationLinkLayer.addFeatures(this.navigationLinks);
            }
        }
    },
    
    pluginGetCoordinateFromPixel: function(pixelxy){
    	var lonlat = this.map.getLonLatFromPixel(pixelxy);
    	return {x:lonlat.lon, y:lonlat.lat};
    },
    
    pluginGetPixelFromCoordinate: function(lonlat){
    	return this.map.getPixelFromLonLat(lonlat);    	
    },
    
    /**
	* Method: pluginRoutingActivate
	* Activate routing controls.
	*/
    pluginRoutingActivate: function() {
    	this.routingControlManager.activateDelegator('routing');    	
    },
    
    /**
	* Method: pluginRoutingDeactivate
	* Deactivate routing controls.
	*/
    pluginRoutingDeactivate: function() {
    	this.routingControlManager.deactivateDelegator('routing');
    },
    
    /**
	* Method: pluginRoutingActivate
	* Deactivate streetview controls.
	*/
    pluginStreetViewActivate: function() {
		this.routingControlManager.activateDelegator('streetview');
	},
	
	/**
	* Method: pluginRoutingDeactivate
	* Deactivate streetview controls.
	*/
    pluginStreetViewDeactivate: function() {
    	this.routingControlManager.deactivateDelegator('streetview');	
	},
	
	
    
	/**
     * Restituisce la larghezza di questo viewer
     */
	pluginGetMapViewerWidth: function() {
    	return this.getWidth();
    	
    },
    
    /**
     * Restituisce l'altezza di questo viewer
     */
    pluginGetMapViewerHeight: function() {
    	return this.getHeight();
    	
    },
    
    /**
     * Restituisce la larghezza dell'oggetto mappa incluso in questo viewer
     */
    pluginGetMapWidth: function() {
    	return this.map.size.w;
    	
    },
    
    /**
     * Restituisce l'altezza dell'oggetto mappa incluso in questo viewer
     */
    pluginGetMapHeight: function() {
    	return this.map.size.h;
    	
    },
    
    pluginGetMapRatio: function() {
    	var ratio = this.map.baseLayer.ratio;
    	return (ratio) ? ratio : 1;
    	
    },

    //getItemUrlFromViewer
    /**
     * Restituisce l'url necessaria per richiedere l'immagine corrispondente alla posizione/zoom attuali ad un server/layer alternativo indicato in itemParams
     *
     * @param itemParams {Object} contiene url, layer, tipo di server ed altri parametri relativi al server per il quale deve essere predisposta l'url
     * @param mapWidth larghezza della mappa da richiedere
     * @param mapHeight altezza della mappa da richiedere
     * 
     *    
     */
    pluginServerUrl: function (itemParams, mapWidth, mapHeight ) {
		var retVal = '';
		
		// Recupero parametri necessari da viewer
	    var fullBounds = this.pluginGetMapFullExtent();
	    var viewerFullUrl = this.pluginGetMapUrl(fullBounds);
	    var mapDPI = this.pluginGetDotsPerInch();
	    
	    if ( itemParams.tipo==undefined || itemParams.tipo==null || itemParams.tipo=='') {
	    	itemParams.tipo = 'mapserver';
	    }
	    
	    switch (itemParams.tipo) {	    
		    case 'mapserver':
		    	// url     ----- http://dvptolomeo.comune.prato.it/cgi-bin/mapserv?   
		    	// mappa   ----- map=/usr1/test/vh/tolomeo/mapfiles/stradario.map
		    	// layer   ----- layers=undefined%20circoscrizioni%20fiumi_laghi%20parchi%20edifici%20poligoni_strade%20piste_ciclabili%20cartelli_stradali%20numeri_civici
		    	// formato -----   map_imagetype=agga
		    	// map_resolution=72
		    	// mode=map 
		    	// fullbounds ----- mapext=1668361.0250593+4860744.3379923+1668543.5334328+4860867.2330781
		    	// fullbounds ----- imgext=1668361.0250593+4860744.3379923+1668543.5334328+4860867.2330781
		    	// ???? map_size=1194+804  // calcolare da this.mapViewerRatio etc?
		    	// ?? punto centrale ?? imgx=597&imgy=402
		    	// ???? imgxy=1194+804
		    	
		    	// url
		    	retVal = (itemParams.url && itemParams.url != "") ? itemParams.url :   
		    															(viewerFullUrl.indexOf('?')!=-1) ? viewerFullUrl.substring(0, viewerFullUrl.indexOf('?')) : viewerFullUrl;
		    	retVal += (retVal.indexOf('?')==-1) ?  "?" : "&";
		    	// mappa
		    	retVal += "map=" + escape(itemParams.mappa) + "&";
		    	// layer
		    	retVal += "layers=" + escape(itemParams.layer) + "&";
		    	//formato
		    	retVal += "map_imagetype=" + ((itemParams.formato && itemParams.formato!="") ? escape(itemParams.formato) : "agga") + "&";
		    	// resolution
		    	retVal += "map_resolution=" + mapDPI + "&";
		    	// mode
		    	retVal += "mode=map&";
		    	// mapext
		    	retVal += "mapext=" + fullBounds.left + "+" + fullBounds.bottom + "+" + fullBounds.right + "+" + fullBounds.top + "&";
		    	// imgext
		    	retVal += "imgext=" + + fullBounds.left + "+" + fullBounds.bottom + "+" + fullBounds.right + "+" + fullBounds.top + "&";
		    	// map_size
		    	retVal += "map_size=" + mapWidth + "+" + mapHeight + "&";
		    	// imgx e imgy
		    	retVal += "imgx=" +  Math.round(mapWidth/2) + "&";
		    	retVal += "imgy=" +  Math.round(mapHeight/2)+ "&";
		    	// imgxy
		    	retVal += "imgxy=" + mapWidth + "+" + mapHeight ;
		    	
		    	break;
		    	
		    case 'WMS':
		    	// http://geoserver.comune.prato.it/geoserver/wms?
		    	// LAYERS=comunepo_generica
		    	// MINZOOMLEVEL=0
		    	// SERVICE=WMS
		    	// VERSION=1.1.1
		    	// REQUEST=GetMap
		    	// STYLES=
		    	// EXCEPTIONS=application%2Fvnd.ogc.se_inimage
		    	// FORMAT=image%2Fjpeg
		    	// SRS=EPSG%3A3003
		    	// BBOX=1630695.3952703,4847788.25,1703123.6047297,4873514.75
		    	// WIDTH=1875
		    	// HEIGHT=666
		    	
		    	// url
		    	retVal = (itemParams.url && itemParams.url != "") ? itemParams.url :   
		    															(viewerFullUrl.indexOf('?')!=-1) ? viewerFullUrl.substring(0, viewerFullUrl.indexOf('?')) : viewerFullUrl;
		    	retVal += (retVal.indexOf('?')==-1) ?  "?" : "&";
		    	// layer
		    	retVal += "LAYERS=" + escape(itemParams.layer) + "&";
		    	//MINZOOMLEVEL
		    	retVal += "MINZOOMLEVEL=0&";
		    	//SERVICE
		    	retVal += "SERVICE=WMS&";
		    	//VERSION
		    	retVal += "VERSION=1.1.1&";
		    	// REQUEST
		    	retVal += "REQUEST=GetMap&";
		    	// STYLES
		    	retVal += "STYLES=" + itemParams.styles + "&";
		    	// EXCEPTIONS
		    	retVal += "EXCEPTIONS=application%2Fvnd.ogc.se_inimage&";
		    	//formato
		    	retVal += "FORMAT=" + ((itemParams.formato && itemParams.formato!="") ? escape(itemParams.formato) : "image%2Fjpeg") + "&";
		    	// SRS
		    	retVal += "SRS=" + ((itemParams.srid && itemParams.srid!="") ? escape(itemParams.srid) : escape(this.pluginGetSRID()))  + "&";
		    	// bbox
		    	retVal += "BBOX=" + fullBounds.left + "," + Math.round(fullBounds.bottom) + "," + fullBounds.right + "," + fullBounds.top + "&";
		    	// WIDTH ed HEIGHT
		    	retVal += "WIDTH=" + mapWidth + "&HEIGHT=" + mapHeight ;
		    	break;	
	    
	    }
		return retVal;
	},
    
	pluginGetObjPos: function () {
    	
    	return {
    		srid:   this.pluginGetSRID(),
    		bbox:   this.pluginGetMapExtent(),
    		width:  this.pluginGetMapWidth(),
    		height: this.pluginGetMapHeight() 
    	}
    	
	}, 
	
	   
	/**
	 * Method: pluginAddRouting
	 * Funzione che viene chiamata per aggiungere un oggetto geometrico a quelli del routing.
	 * Se bMulti non definito o false un solo oggetto e' evidenzxiabile, quindi cancella eventuali oggetto selezionati in precedenza
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicatoad un certo viewer.
	 *
	 * Parameters:
	 * routing - {RouteResponse} reouting da aggiungere
	 * bMulti - {Boolean} bMulti Se non definito o false non è consentita la presenza di più di un oggetto, se True è consentita.
	 */
	pluginAddRouting: function (routing, bMulti, style) {
		
		var jsGeometry = routing.geometry;
		
		if (!bMulti) this.routingLayer.destroyFeatures();
		/* Modificato per non tracciare la feature completa ma i singoli pezzi per rednerli selezionabili
		 
		var geoms = new JSGeometryArray();
		
		if (jsGeometry instanceof JSGeometryArray) {
			geoms = jsGeometry;
		} else if (jsGeometry instanceof JSGeometry) {
			geoms.add(jsGeometry);
		} else {
			alert("tipo sconosciuto " + jsGeometry);
			return;
		}
		
		var feats = new Array();
		
		for (var i=0; i<geoms.geometries.length; i++) {
			var wkt = new OpenLayers.Format.WKT();
			var feat = wkt.read(geoms.geometries[i].geometry);
			if (style) feat.style = style;
		    feats.push( feat);
		}
		//ALE	this.routingLayer.addFeatures(feats);
		*/
		
		for (var i = 0; i < routing.instructions.length; i++) {
			this._routingInstructionAdd(routing.instructions[i].geometry, { tooltip: routing.instructions[i].textInstruction }, i!=0, routing.instructions[i].instructionId);
		}
		
	},
	
	pluginRoutingInstructionHighlight: function (instruction, bHighlight) {
		
		var feats = this.routingLayer.getFeaturesByAttribute("instructionId", instruction.instructionId);
		for (var i=0; i<feats.length; i++) {
			this.routingLayer.drawFeature(feats[i], (bHighlight) ? "highlight" : "default");	
		}

	},
		
	_routingInstructionAdd: function(jsGeometry, opts, withNode, instructionId) {
		var wkt = new OpenLayers.Format.WKT();
		var feat = wkt.read(jsGeometry.geometry);
		feat.attributes.instructionId = instructionId;
		
		// Aggiunta feature lineare
		this.routingLayer.addFeatures([feat]);
		
		if (withNode) {
			var startPoint = feat.geometry.getVertices(true)[0];
			
			var o = opts || {};
			
			TolomeoExt.applyIfEmpty(o, {
				icon	: this.TOLOMEOServer + this.TOLOMEOStaticRoot + 'img/ols/routeInfo.png',
				widht	: 11,
				height	: 11,
				xOffset	: -5,
				yOffset	: -5,
				tooltip	: "Informazioni percorso"
			});
			
			var infoFeature = new OpenLayers.Feature.Vector(startPoint, 
					{	instructionId   : instructionId }, 
					{
						externalGraphic	: o.icon,
						graphicWidth	: o.widht,
						graphicHeight	: o.height,
						graphicXOffset	: o.xOffset,
						graphicYOffset	: o.yOffset,
						title			: o.tooltip
					});
			
			// Aggiunta nodo
			this.routingLayer.addFeatures([infoFeature]);	
		}
		
	},
	
	pluginZoomToInstruction: function(jsGeometry, zoomFactor) {
		var wkt = new OpenLayers.Format.WKT();
		var feat = wkt.read(jsGeometry.geometry);
		var startPoint = feat.geometry.getVertices(true)[0];
		
		this.pluginGotoPosition(startPoint.x, startPoint.y, zoomFactor, false);  
	},
	
	/**
	 * Method: pluginClearRouting
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * bRedraw - {} bRedraw
	 * 
	 * Returns:
	 *     {Boolean}
	 */
	pluginClearRouting: function (bRedraw) {
		// non viene gestito bRedraw perche' in questo viewer la cancellazione non richiede il ridisegno
	    this.routingLayer.destroyFeatures();
	    // ritorna sempre false perch? il redraw non e' mai necessario
	    return false;
	},
	
	/**
	 * Method: pluginZoomToRouting
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * zoom - {} zoom
	 * buffer - {Number} buffer, se valorizzato viene fatto lo zoom aggiungendo il buffer passato
	*/
	pluginZoomToRouting: function (zoom, buffer) {
		//var bounds = this.routingLayer.features[0].geometry.getBounds();
		if(!(this.routingLayer.features && this.routingLayer.features.length>0)) return;
		var bounds = this.olGetExtents(this.routingLayer.features);
		if (!zoom) {
			if (buffer && this.isMetresUnits()) {
				boundsBuffered = new OpenLayers.Bounds();
			    boundsBuffered.extend(new OpenLayers.LonLat(bounds.left-buffer/2,bounds.bottom-buffer/2));
			    boundsBuffered.extend(new OpenLayers.LonLat(bounds.right+buffer/2,bounds.top+buffer/2));
			    // Estende il buffer fino a includere anche un buffer intorno ai marker
			    var b = this.routingMarkersLayer.getDataExtent();
			    boundsBuffered.extend(new OpenLayers.LonLat(b.left-buffer/2,b.bottom-buffer/2));
			    boundsBuffered.extend(new OpenLayers.LonLat(b.right+buffer/2,b.top+buffer/2));
			    
			    this.map.zoomToExtent(boundsBuffered);
			} else {
				this.map.zoomToExtent(bounds);
			}
		} else {
			var lonLat = bounds.getCenterLonLat();
			this.pluginGotoPosition(lonLat.lon, lonLat.lat, zoom, false);	
		}
		
		this.isAlreadyDrawn=true;	
	},
	     
	/**
	 * Method: pluginAddStartRoutingMarker
	 * Aggiunge il marker di inizio tracciato per il routing
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	 * Parameters:
	 * lon - {} longitudine
	 * lat - {} latitudine
	 * opts - {} opzioni
	 */
	pluginAddStartRoutingMarker: function(lon, lat, opts) {
		
		if (this.startMarker != null) {
			this.pluginClearStartRoutingMarker();
			//this.startMarker.geometry = new OpenLayers.Geometry.Point(lon, lat);
			//return;
		}
		
		var o = opts || {};
		
		TolomeoExt.applyIfEmpty(o, {
			icon	: this.TOLOMEOServer + this.TOLOMEOStaticRoot + 'img/ols/startPoint.png',
			widht	: 24,
			height	: 37,
			xOffset	: -12,
			yOffset	: -37,
			tooltip	: "Routing start point",
		});
				
		this.startMarker = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(lon, lat), {}, {
			externalGraphic	: o.icon,
			graphicWidth	: o.widht,
			graphicHeight	: o.height,
			graphicXOffset	: o.xOffset,
			graphicYOffset	: o.yOffset,
			title			: o.tooltip,
		});
		
		this.routingMarkersLayer.addFeatures( [this.startMarker] );
		this.pluginRoutingActivate();
	},
	
	/**
	 * Method: pluginClearViaRoutingMarkers
	 * Elimina tutti i marker di tappa intermedia tracciato per il routing
	 * Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	 *
	*/
	pluginClearStartRoutingMarker: function() {
		if (this.startMarker != null) {
			this.routingMarkersLayer.destroyFeatures(this.startMarker);
			this.startMarker = null;
		}
	},
		
	/**
	* Method: pluginAddEndRoutingMarker
	* Aggiunge il marker di fine tracciato per il routing
	* Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	*
	* Parameters:
	* lon - {} longitudine
	* lat - {} latitudine
	* opts - {} opzioni
	*/
	pluginAddEndRoutingMarker: function(lon, lat, opts) {
		if (this.endMarker != null) {
			this.pluginClearEndRoutingMarker();
			//this.endMarker.geometry = new OpenLayers.Geometry.Point(lon, lat);
			//return;
		}
		
		var o = opts || {};
		
		TolomeoExt.applyIfEmpty(o, {
			icon	: this.TOLOMEOServer + this.TOLOMEOStaticRoot + 'img/ols/endPoint.png',
			widht	: 24,
			height	: 37,
			xOffset	: -12,
			yOffset	: -37,
			tooltip	: "Routing end point",
		});
			
		this.endMarker = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(lon, lat), {}, {
			externalGraphic	: o.icon,
			graphicWidth	: o.widht,
			graphicHeight	: o.height,
			graphicXOffset	: o.xOffset,
			graphicYOffset	: o.yOffset,
			title			: o.tooltip,
		});
		
		this.routingMarkersLayer.addFeatures( [this.endMarker] );		
	},
	
   /**
	* Method: pluginClearViaRoutingMarkers
	* Elimina tutti i marker di tappa intermedia tracciato per il routing
	* Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	*
	*/
	pluginClearEndRoutingMarker: function() {
		if (this.endMarker != null) {
			this.routingMarkersLayer.destroyFeatures(this.endMarker);
			this.endMarker = null;
		}
	},
	
	/**
	* Method: pluginAddViaRoutingMarker
	* Aggiunge il marker di tappa intermedia tracciato per il routing
	* Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	*
	* Parameters:
	* lon - {} longitudine
	* lat - {} latitudine
	* opts - {} opzioni
	*/
	pluginAddViaRoutingMarker: function(id, lon, lat, opts) {
		var o = opts || {};
		
		TolomeoExt.applyIfEmpty(o, {
			icon	: this.TOLOMEOServer + this.TOLOMEOStaticRoot + 'img/ols/viaPoint.png',
			widht	: 24,
			height	: 37,
			xOffset	: -12,
			yOffset	: -37,
			tooltip	: "Routing via point",
		});
			
		var viaMarker = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(lon, lat), {
			id: id,
		}, {
			externalGraphic	: o.icon,
			graphicWidth	: o.widht,
			graphicHeight	: o.height,
			graphicXOffset	: o.xOffset,
			graphicYOffset	: o.yOffset,
			title			: o.tooltip,
		});
			
		this.routingMarkersLayer.addFeatures( [viaMarker] );		
		this.viaMarkers.push(viaMarker);
	},
		
	/**
	* Method: pluginClearViaRoutingMarkers
	* Elimina tutti i marker di tappa intermedia tracciato per il routing
	* Come tutte le funzioni con prefisso 'plugin' deve essere implementata in un plugin dedicato ad un certo viewer.
	*
	*/
	pluginClearViaRoutingMarkers: function() {
		this.routingMarkersLayer.destroyFeatures( this.viaMarkers );
		this.viaMarkers = [];
	},
		
	/**
	* Method: olViewerOnDragDropEndRouting
	* Metodo privato per la gestione dell'evento di drag delle geometrie di routing
	*
	* Parameters:
	* feature - {OpenLayers.Feature.Vector} feature soggetta a modifica
	*/
		olViewerOnDragDropEndRouting: function(feature)	{
			var	event;
			var startPoint = null;
			var endPoint = null;
			var viaPoint = null;
			var viaId = null;
			
			if (feature == this.startMarker) {
				event = 'startPointMoved';
				startPoint = this.startMarker ? new Point(this.startMarker.geometry.x, this.startMarker.geometry.y) : null;
			} else if (feature == this.endMarker) {
				event = 'endPointMoved';
				endPoint = this.endMarker ? new Point(this.endMarker.geometry.x, this.endMarker.geometry.y) : null;
			} else {
				event = 'viaPointMoved';
				viaPoint = new Point(feature.geometry.x, feature.geometry.y);
				viaId = feature.attributes.id;
			}
			
			this.fireEvent(event, startPoint, endPoint, viaPoint, viaId);
		},
    	
});

/**
 * Class: TolomeoExt.ToloViewerOLPanel.SelectFeatureControlManager
 * 
 * Clas to manage select feature for more layers
 *
 * Inherits from:
 *  - <Ext.Base>
 *
 */
Ext.define('TolomeoExt.ToloViewerOLPanel.SelectFeatureControlManager', {

    /**
     * @cfg {Object} map
     * The map is the Openlayers Map object with which to work
     */
	
    /**
     * @cfg {Object} viewer
     * The viewer is the TolomeoExt.ToloViewerOLPanel
     */

    /**
     * Creates new SelectFeatureManager.
     * @param {Object} config Config object.
     */
    constructor : function(config){
        this.initialConfig = config;
        this.map = config.map;
        this.viewer = config.viewer;        
        this.init();
    },
    
    layersMap : {},
	delegatorMap : {},
	selectControl: null, 	    		
	highlightControl: null,
	
	init: function(){

		var me = this;
		var viewer = this.viewer;
		
		this.selectControl = new OpenLayers.Control.SelectFeature(
                [],
                {
                	renderIntent: 'select',
                	
                	onBeforeSelect: function(feature){		 
                    	var callback = me.layersMap[feature.layer.name].callbacks.onBeforeSelect;
                		return callback ? callback(feature.layer.name,feature,viewer) : true;
                	},
                
                    onSelect: function(feature){
                    	var callback = me.layersMap[feature.layer.name].callbacks.onSelect;
                    	if(callback){
                    		callback(feature.layer.name,feature,viewer);
                    	}
                    },
                    
                    onUnselect: function(feature){
                    	var callback = me.layersMap[feature.layer.name].callbacks.onUnselect;
                    	if(callback){
                    		callback(feature.layer.name,feature,viewer);
                    	}
                    }                                                           
                }
        );
		
		this.highlightControl = new OpenLayers.Control.SelectFeature(
                [],
                {	                         
                    multiple:false, 
                    hover:true, 
                    highlightOnly:true,
                    renderIntent: 'temporary',
                    
                    eventListeners:{
                    	
                    	beforefeaturehighlighted : function(event){
                    		var callback = me.layersMap[event.feature.layer.name].callbacks.onBeforeHighlight;
                    		return callback ? callback(event.feature.layer.name,event.feature,viewer) : true;
                    	},                  
                    	
                        featurehighlighted: function (event) {
                        	var callback = me.layersMap[event.feature.layer.name].callbacks.onHighlight;
                        	if(callback){
                        		callback(event.feature.layer.name,event.feature,viewer);
                        	}
                        },
                        
                        featureunhighlighted: function (event) {
                        	var callback = me.layersMap[event.feature.layer.name].callbacks.onUnhighlight;
                        	if(callback){
                        		callback(event.feature.layer.name,event.feature,viewer);
                        	}
                        }
                    }	                           
                }
        );
		
		this.map.addControl(this.selectControl);
        this.map.addControl(this.highlightControl);
        
	},
	
	addDelegator : function(d){	  
		
		d.active = false;
		this.delegatorMap[d.id] = d;
		
		for(var i=0; i < d.layers.length ; i++){
			this.layersMap[d.layers[i].name] = d;			
		}
		
		if(d.moreControls){
			for(var i=0; i<d.moreControls.length; i++){								
				this.map.addControl(d.moreControls[i]);
			}
		}
	},
	
	activateDelegator : function(idP){		
		
		var delegator = this.delegatorMap[idP];
		if(!delegator.active){	    				
			this.deactivate();
			delegator.active = true;
			var layers = [];
			
			for(var i in this.delegatorMap){
				if(!this.delegatorMap.hasOwnProperty(i)) continue;
				var d = this.delegatorMap[i];
				if(d.active){
					layers = layers.concat(d.layers);
				}
			}
			
			this.selectControl.setLayer(layers);
			this.highlightControl.setLayer(layers);
			this.activate();
			
			if(delegator.callbacks.onActivate){
				delegator.callbacks.onActivate(this.viewer);
			}
		}
	},
	
	deactivateDelegator : function(idP){
		
		var delegator = this.delegatorMap[idP];
		
		if(delegator.active){	    	
			
			this.deactivate();
			delegator.active = false;
			var layers = [];
			
			for(var i in this.delegatorMap){
				if(!this.delegatorMap.hasOwnProperty(i)) continue;
				
				var d = this.delegatorMap[i]; 
				if(d.active){
					layers = layers.concat(d.layers);
				}	    					
			}
			
			if(layers.length > 0) {
				this.selectControl.setLayer(layers);
				this.highlightControl.setLayer(layers);				
				this.activate();
			} 
			
			if(delegator.callbacks.onDeactivate){
				delegator.callbacks.onDeactivate(this.viewer);
			}
		}
	},
	
	activate : function(){	    	
		
		this.highlightControl.activate();
		this.selectControl.activate();
		
		// Activate further controls of all active delegator
		for(var i in this.delegatorMap){
			if(!this.delegatorMap.hasOwnProperty(i)) continue;
			
			var d = this.delegatorMap[i];
			if(d.active && d.moreControls){
				for(var c=0; c<d.moreControls.length; c++){
					d.moreControls[c].activate();
				}
			}	    					
		}
		
	},
	
	deactivate : function(){
	
		// Deactivate further controls of all active delegator
		for(var i in this.delegatorMap){			
			if(!this.delegatorMap.hasOwnProperty(i)) continue;
			
			var d = this.delegatorMap[i];
			
			if(d.active && d.moreControls){
				for(var c=0; c<d.moreControls.length; c++){					
					d.moreControls[c].deactivate();				    				    				   
				}
			}	    					
		}
		
		this.selectControl.deactivate();
		this.highlightControl.deactivate();
	}
});


Ext.define('TolomeoExt.ToloViewerOLPanel.SelectFeatureControlManager.DelegatorWidget', {
	
	/**
     * @cfg {String} id
     * The unique id of this widget
     */
	
	/**
     * @cfg {Array} layers
     * The list of layers of the widget. 
     * To see the correct things whene feature of a layer are selected or highlighted, you need to define a styleMap for the layer
     * with the following keys
     * 	- default	(for normal style)
     * 	- select	(for selected style)
     *  - highlight	(forn highlighted style)
     */
	
    /**
     * @cfg {Object} callbacks
     * The viewer is the TolomeoExt.ToloViewerOLPanel
     */

	/**
     * @cfg {Object} moreControls
     * Further controls of the widget that Select Feature Control Manager have to activate or deactivate 
     * when SelectFeature ia activated or deactivated.
     * If there are further controls, but you don't pass them to the Select Feature Control Manager
     * you have to handle them by yourself
     */
	
	/**
     * @cfg {Object} callbacks
     * Object with all callbacks for the SelectFeatureControlManager
     * - onActivate 		: called when widget is activated
     * - onBeforeSelect 	: called before select a feature (return false to avoid selection)
     * - onSelect 			: called after feature selection
     * - onUnselect 		: called after deselection
     * - onBeforeHighlight	: called before highlight a feature (return false to avoid highlighting)
     * - onHighlight 		: called after highlighted
     * - onUnhighlight 		: called after unhighlight
     * - onDeactivate 		: called after widget is deactivated to finalize it
     */
	
    /**
     * Creates new SelectFeatureManager.
     * @param {Object} config Config object.
     */
    constructor : function(config){
        this.initialConfig = config;
        this.id = config.id;
        this.layers = config.layers;
        this.moreControls = config.moreControls;
        this.callbacks = config.callbacks;        
    }
});