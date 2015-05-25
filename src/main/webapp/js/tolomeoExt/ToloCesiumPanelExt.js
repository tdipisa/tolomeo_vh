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
 * Pannello contenente visualizzatore WebGL Cesium
 * 
 */
Ext.define('TolomeoExt.ToloCesiumPanelExt', {
	extend: 'Ext.panel.Panel',

	cesiumWidget: null,
	
	/**
	 * @cfg {JSONObject}
	 * Parametri principali tolomeo (contenuti in paramPreset ed arricchiti)
	 */
	paramsJS: null,
	
	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,
	
	/** 
	 * Property: TOLOMEOStaticRoot
	 * {String}
	 */
	TOLOMEOStaticRoot: null,
	
	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,

	
	/**
	 * @cfg {Number}
	 * Longitudine Ovest iniziale
	 */
	startExtentWest: null,
	
	/**
	 * @cfg {Number}
	 * Longitudine Est iniziale
	 */
	startExtentEast: null,
	
	/**
	 * @cfg {Number}
	 * Latitudine nord iniziale
	 */
	startExtentNorth: null,
	
	/**
	 * @cfg {Number}
	 * Latitudine sud iniziale
	 */
	startExtentSouth: null,
	
	/**
	 * @cfg {String}
	 * Url da utilizzare per il terrain provider
	 */
	terrainUrl: null,
	
	/**
	 * @cfg {String}
	 * Credits da utilizzare per il terrain provider
	 */
	terrainCredits: null,
		

    initComponent: function(){
		
		//TODO FILTRARE OVUNQUE LAYERAGGREG MAPSERVER CGI
		
		TolomeoExt.Vars.ApplyIfDefaults(this);	
		
		this.terrainUrl = this.terrainUrl || this.paramsJS.layOut.visualizzazione3D.terrainUrl ; //'http://cesium.agi.com:80/smallterrain';
		this.terrainCredits = this.terrainCredits || this.paramsJS.layOut.visualizzazione3D.terrainCredits; //'Terrain data courtesy Analytical Graphics, Inc.';
		
		this.layout='fit';
		
		this.addEvents(
			/**
			 * @event onBeforePreInit
			 * Lanciato in fase di inizializzazione prima che al viewer cesium siano aggiunti i layer 
			 */
			'onBeforePreInit',
			
			/**
			 * @event onBeforePreInit
			 * Lanciato in fase di inizializzazione dopo che al viewer cesium sono stati aggiunti tutti i layer 
			 */
			'onAfterPreInit'
		);
		
        this.callParent(arguments);
	
        //this._creaCesiumWidget
        this.on('afterrender', function () { 
        							this.show3D( this.startExtentWest, this.startExtentNorth, this.startExtentEast, this.startExtentSouth ); 
        					}, 
        		this, {single:true});
     	//this.on('afterrender', this.pluginPreInit, this, {single:true});
        this.on('resize', this._resizeCesiumWidget);
                
	},
	
	/** 
	 * Esegue l'inizializzazione.
	 */
	pluginPreInit: function() {
		this.fireEvent("onBeforePreInit");				
	    this.addAllLayers();
		this.fireEvent("onAfterPreInit");
	},
	
	/**
	 * Rimuove tutti i layer.
	 */
	removeAllLayers: function() {
		 this.cesiumWidget.scene.imageryLayers.removeAll();
	},
	
	/** 
	 * Aggiunge tutti i layer
	 */
	addAllLayers: function() {
		var nMappa = 0;
		
		for (var i=0; i< this.paramsJS.mapDefinitions[nMappa].getLayerAggregationCount() ; i++) {
			this.refreshMap(i);
		}		
	},
	
	show3D: function(west, north, east, south) {
		if (this.cesiumWidget == null) {
			this._creaCesiumWidget();
		} else {
			this.removeAllLayers();		
		}
		this.gotoExtent(west, north, east, south);
		this.addAllLayers();
	}, 
	
	/**
	 * Aggiunge o modifica un layer WMS
	 * @param {Cesium.ImageryLayer} newCesiumLayer
	 * @param {Cesium.ImageryLayer} actualLayer
	 * @param {Number} position posizione in cui inserire il layer
	 */
	addOrChangeWMS: function(newCesiumLayer, actualLayer, position) {
		var layers = this.cesiumWidget.scene.imageryLayers;
		  if (actualLayer!=null) layers.remove(actualLayer);
		  if (position!==undefined && position!=null) {
			  layers.add(newCesiumLayer, position);
		  } else {
			  layers.add(newCesiumLayer);
		  }
	},
	
	/**
	 * Ricarica un layer
	 * @param {Number} numero identificativo dell'aggregazione layer da aggiornare
	 */
	refreshMap: function (nLayerAggreg) {
		
		var actualLayer = this.getLayerFromNAggreg(nLayerAggreg);
		var cl = this._creaCesiumLayer(nLayerAggreg);
		var position = this.getCesiumRequestedPosition(nLayerAggreg);
		
		if (cl!=null) {
			
			this.addOrChangeWMS(cl, actualLayer, position);
			
		} else {
			if (actualLayer) {
				if (position==1) {
					// se si sta per cancellare il baseLayer prima si porta un altro layer come base
					var layers = this.cesiumWidget.scene.imageryLayers;
					if (layers.length>1) {
						layers.lowerToBottom(layers.get(1));
					}
				}
				this.cesiumWidget.scene.imageryLayers.remove(actualLayer);
			}
		}
		
	},
	
	/**
	 * Restituisce il layer cesium che corrisponde ad una certa aggregazione
	 * @param {Number} nLayerAggreg numero di aggregazione del layer da recuperare
	 * @return {Cesium.ImageryLayer} il layer
	 */
	getLayerFromNAggreg: function(nLayerAggreg) {
		if (this.cesiumWidget==null) return null;
		var layers = this.cesiumWidget.scene.imageryLayers;
		for (var i=0; i<layers.length; i++) {
			var l = layers.get(i);
			if (l.nLayerAggreg==nLayerAggreg) return l;
		}
		return null;
	},
	
	/**
	 * Restituisce la posizione del layer cesium che corrisponde ad una certa aggregazione
	 * @param {Number} nLayerAggreg numero di aggregazione del layer da recuperare
	 * @return {Number} Posizione del layer
	*/
	getCesiumRequestedPosition: function(nLayerAggreg) {
		if (this.cesiumWidget==null) return null;
		var retVal=0;
		var layers = this.cesiumWidget.scene.imageryLayers;
		
		for (var i=0; i<layers.length; i++) {
			var l = layers.get(i);
			if (l.nLayerAggreg>nLayerAggreg) return i;
		}
		return null;
	},
	
	/**
	 * @private
	 */
	_resizeCesiumWidget: function() {
		if (this.cesiumWidget!=null) {
			this.cesiumWidget.resize(); 
		}
	},
	
	/**
	 * @private
	 */
	_creaCesiumWidget: function() {
		if (this.cesiumWidget==null){
			this.cesiumWidget = new Cesium.Viewer(this.body.id, {
													baseLayerPicker: false,
													geocoder: false,
													animation: false,
													homeButton: true,
													fullscreenButton: false,
													//fullscreenElement: this.body.id,
													sceneModePicker: false,
													timeline: false,
													imageryProvider: false } ); //new Cesium.CesiumWidget(this.body.id, { imageryProvider: false } );
			var cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
		    	url : this.terrainUrl,
		//    	proxy : new Cesium.DefaultProxy('http://localhost:8080/tolomeobinj/TolomeoProxyServlet'),
		    	credit : this.terrainCredits
			});
			
			this.cesiumWidget.scene.terrainProvider = cesiumTerrainProvider;
			this.gotoExtent(this.startExtentWest, this.startExtentNorth, this.startExtentEast, this.startExtentSouth);
			
			//this.cesiumWidget.fullscreenElement = this.body.id;
			
			var me = this;
			
			this.cesiumWidget.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo){
				me.gotoExtent(me.startExtentWest, me.startExtentNorth, me.startExtentEast, me.startExtentSouth);
				//Tell the home button not to do anything.
				commandInfo.cancel = true;
			});
			
		}
	},

	/**
	 * @private
	 */
	_creaCesiumLayer: function(nLayerAggreg){
		var nMappa=0;
		var sep = ',';
		var layerAggr = this.paramsJS.mapDefinitions[nMappa].getLayerAggregation(nLayerAggreg);
		var server = layerAggr.server;
		var layAndStyle = this.paramsJS.getLayerAggregLayersAndStylesStrings(nMappa, nLayerAggreg, sep, null); 
		
		if (layAndStyle.layers=="") {
			return null;
		}
		
		var laysep = layAndStyle.layers;
		if (sep!=',') {
			// sostituisce il separatore con quello giusto per WMS
			var pattern = new RegExp(sep,'g');
			laysep = laysep.replace(pattern, ',');
		} 
		
		var stilisep = layAndStyle.stili;
		if (sep!=',') {
			// sostituisce il separatore con quello giusto per WMS
			var pattern = new RegExp(sep,'g');
			stilisep = stilisep.replace(pattern, ',');
		}

		var currProxy = undefined;
		if (this.paramsJS.layOut.visualizzazione3D && server.usaProxyPer3D) {
			var pr = (server.proxyPer3dUrl && server.proxyPer3dUrl!="") ? server.proxyPer3dUrl : this.TOLOMEOServer + this.TOLOMEOContext + "/TolomeoProxyServlet"
			currProxy = new Cesium.DefaultProxy(pr)
		} 
		
		var attr = "";
		if (layAndStyle.attribution) {
			if (layAndStyle.attribution.constructor === Array) {
				if (layAndStyle.attribution.length>0) {
					var sep = "";
					for (var i = 0; i<layAndStyle.attribution.length>0; i++) {
						if (typeof layAndStyle.attribution[i] === 'string') {
							attr += sep + layAndStyle.attribution[i];
						} else {
							attr += sep + layAndStyle.attribution[i].title;
						}
						sep = ","
					}
				} else {
					attr = "";
				}
				
			} else {
				if (typeof layAndStyle.attribution === 'string') {
					attr += layAndStyle.attribution;
				} else {
					attr += layAndStyle.attribution.title;
				}
			}		
		}
		
		var wms = {
				url: server.url,
				layers : laysep,
				credit: attr,
				parameters: { 	styles: stilisep, 
						transparent : 'true',
        				format : 'image/png'
        		},
				//credit: server.id,
				proxy : currProxy
		};
		
		var layers = this.cesiumWidget.scene.imageryLayers;
		var provider = new Cesium.WebMapServiceImageryProvider(wms);
		var lay = new Cesium.ImageryLayer(provider, {
									alpha: layerAggr.opacity
								});
		lay.nLayerAggreg = nLayerAggreg;
		
		return lay;
	}, 
	
	gotoExtent: function(west, north, east, south) {
	
		if (west!=null && east!=null && north!=null && south!=null) {
			var westRad = Cesium.Math.toRadians(west);
		  	var southRad = Cesium.Math.toRadians(south);
		  	var eastRad = Cesium.Math.toRadians(east);
		  	var northRad = Cesium.Math.toRadians(north);

		  	var extent = new Cesium.Rectangle(westRad, southRad, eastRad, northRad);  
			
		    var scene = this.cesiumWidget.scene;
		    var ellipsoid = Cesium.Ellipsoid.WGS84;

		    scene.camera.viewRectangle(extent, ellipsoid);	
		}
	}

});

