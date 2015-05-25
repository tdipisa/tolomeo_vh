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
 * @class TolomeoExt.ToloTimeMachinePanel
 * @extends Ext.Panel
 * Pannello ExtJs che implementa la funzionalità TimeMachine
 * 
 * @param {Object} config
 * 
 * 
 * @param {Object} config.paramsJS
 * Oggetto i parametri contenuti nel file di preset.  
 * 
 * @author Ing. Alessandro Radaelli
 */
Ext.define('TolomeoExt.ToloTimeMachinePanel', {
	
		extend: 'Ext.ux.CarouselPanel',
		
		/** 
		 * @property {Object} paramsJS
		 * 
		 * 
		 */
		paramsJS : null,
		
		
		/** 
		 * @property {TolomeoExt.ToloViewerOLPanel} viewer 
		 * 
		 * 
		 */
		viewer: null,
		
		/**
		 * @property {Object} timeMachineToShow
		 * In caso di multiTimeMachine (this.paramsJS.mappe.mappaList[0].timeMachineList.length>1) indica quale deve essere visualizzata da questo pannello. Se non valorizzato per retrocampatibilità mostra this.paramsJS.mappe.mappaList[0].timeMachine 
		 * 
		 */
		timeMachineToShow: null,
		
		/**
		 * @property {Number} mapViewerRatio
		 * @private
		 * 
		 * 
		 */
		mapViewerRatio: null,
		
		/**
		 * @property {Number} [mapviewerWidth=0]
		 * @private
		 * 
		 * 
		 */
		mapviewerWidth: 0, 
		
		/**
		 * @property {Number} [mapviewerHeight=0]
		 * @private
		 * 
		 * 
		 */
		mapviewerHeight: 0,
		
		/**
		 * @property {Number} [mapviewerWidthWithRatio=0]
		 * @private
		 * 
		 * 
		 */
		mapviewerWidthWithRatio: 0,
		
		/**
		 * @property {Number} [mapviewerHeightWithRatio=0]
		 * @private
		 * 
		 * 
		 */
		mapviewerHeightWithRatio: 0,
		
		/** 
		 * @property {Array} [itemsList=[]]
		 * <pre>
		 * <br/>
		 * Esempio:<br/>
		 * 
		 * { tipo: '', url: '', styles: '', mappa: '', layer: '', formato: '', srid: '', testo: '' }
		 * 
		 * var itemList = [ { tipo: 'mapserver', url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto1954.map", layer: "FOTO1954", formato:"",	testo: "1954" },
	                 { url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto1978.map", layer: "FOTO1978", formato:"",	testo: "1978" },
	                 { tipo: 'mapserver', styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto1996.map", layer: "FOTO1996", formato:"",	testo: "1996" },
	                 { tipo: 'mapserver', url: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto2002.map", layer: "FOTO2002", formato:"",	testo: "2002" },
	                 { tipo: 'mapserver', url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto2003.map", layer: "FOTO2003", testo: "2003" },
	                 { tipo: 'mapserver', url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto2009.map", layer: "FOTO2009", formato:"",	testo: "2009" },
	                 { tipo: 'WMS', url: "http://geoserver.comune.prato.it/geoserver/wms", styles: "", mappa: "", layer: "comunepo:ortofoto2009", formato:"image/jpeg", srid:"EPSG:3003",	testo: "2009 geoserver" },
	                 { tipo: 'WMS', url: "http://web.rete.toscana.it/sgrwms/com.rt.wms.RTmap", styles: "", mappa: "", layer: "idsfondodtm50kcol", formato:"image/jpeg", srid:"EPSG:3003",	testo: "Hillshade Geoscopio" }  ];
	 		 * </pre>
		 * 
		 * {Object}[]
		 */
		itemsList: [],
		
		/**
		 * @method initComponent
		 * 
		 * 
		 */
		initComponent: function(){
			
			if (this.carouselConfig==null) this.carouselConfig = {};
			TolomeoExt.applyIfEmpty(this.carouselConfig, 
											{   interval: 3,
											    autoPlay: true,
											    showPlayButton: true,
											    pauseOnNavigate: true,
											    freezeOnHover: true,
											    transitionType: 'fade',
											    transitionEasing: 'fadeIn',    
											    navigationOnHover: false    
											});


			
			if (this.viewer) this.bindToViewer();
			if (this.paramsJS && this.itemsList.length==0) {
				// TODO gestire il caso nel quale la mappa selezionata non sia la 0 (del preset)
				this.itemsList = [];
				if (this.timeMachineToShow==null) {
					if (this.paramsJS.mappe.mappaList[0].timeMachine && this.paramsJS.mappe.mappaList[0].timeMachine.length>0) {
						this.itemsList = this.paramsJS.mappe.mappaList[0].timeMachine.layerList;
					}
				} else {
					this.itemsList = this.paramsJS.mappe.mappaList[0].timeMachineList[this.timeMachineToShow].layerList;
				}
			}
			this.callParent(arguments);
			
		},
		
		/**
		 * @method setMapViewerValues
		 * 
		 * 
		 * @param {Number} mapViewerRatio
		 * 
		 * 
		 * @param {Number} mapviewerWidth
		 * 
		 * 
		 * @param {Number} mapviewerHeight
		 * 
		 * 
		 */
		setMapViewerValues: function(mapViewerRatio, mapviewerWidth, mapviewerHeight) {
			
			if (mapViewerRatio)  this.mapViewerRatio  = mapViewerRatio;
			if (mapviewerWidth)  this.mapviewerWidth  = mapviewerWidth;
			if (mapviewerHeight) this.mapviewerHeight = mapviewerHeight;
			this.mapviewerWidthWithRatio  = Math.round(this.mapviewerWidth * ((this.mapViewerRatio) ? this.mapViewerRatio : 1));
			this.mapviewerHeightWithRatio = Math.round(this.mapviewerHeight * ((this.mapViewerRatio) ? this.mapViewerRatio : 1));
			this.calculateAutoOffset();
			this.autoOffset();
		}, 
		
		/**
		 * @method calculateAutoOffset
		 * 
		 * 
		 */
		calculateAutoOffset: function() {
			
			this.autoOffsetXAdjust= (this.mapViewerRatio) ? - this.mapviewerWidth/2 * (this.mapViewerRatio-1) : 0  ;
			this.autoOffsetYAdjust= (this.mapViewerRatio) ? - this.mapviewerHeight/2 * (this.mapViewerRatio-1) : 0  ;  
		}, 
		
		/**
		 * @method mapPanelSizeUpdate
		 * 
		 * 
		 */
		mapPanelSizeUpdate: function() {
			this.setMapViewerValues(null, this.viewer.getWidth(), this.viewer.getHeight());
		},
		
		/**
		 * @method getMapViewerValuesFromViewer
		 * 
		 * 
		 */
		getMapViewerValuesFromViewer: function() {
			
			this.mapViewerRatio =  this.viewer.pluginGetMapRatio();   // 1.5
			this.mapviewerWidth  = Math.round(this.viewer.pluginGetMapViewerWidth());
			this.mapviewerHeight = Math.round(this.viewer.pluginGetMapViewerHeight());
			this.mapviewerWidthWithRatio  =  Math.round(this.mapviewerWidth * ((this.mapViewerRatio) ? this.mapViewerRatio : 1));
			this.mapviewerHeightWithRatio = Math.round(this.mapviewerHeight * ((this.mapViewerRatio) ? this.mapViewerRatio : 1));
			
		},
		
		/**
		 * @method bindToViewer
		 * 
		 * 
		 * @param {Object} viewer
		 * 
		 * 
		 */
		bindToViewer: function(viewer) {
			var thisPanel=this;
			
			if (viewer) this.viewer = viewer;
			
			if (this.viewer) {
				// collegare ad un evento alla fine del quale siano disponibili i dati (postinit? afterrender?)
				var pos = this.viewer.getPosition();
				this.carouselFixedLeft = pos[0];
				this.carouselFixedTop  = pos[1];   
				
				this.getMapViewerValuesFromViewer();
				
				
				
				// registra evento nel caso cambi il layer selezionato nel layer switcher
				this.mon(this.viewer,'changebaselayer', 
									function() {
											this.getMapViewerValuesFromViewer();
											this.setMapViewerValues();
											}, this);
				
				// registrarsi per ricevere le modifiche di dimensioni del viewer
				this.mon(this.viewer, 'resize', this.mapPanelSizeUpdate, this);
				
				
				
				// TODO vedere funzione e contesto 
				this.mon(this.viewer, 'onMapMoveEnd', this.reloadItems, this);
			 	
			 	//this.on ('afterrender', function() {
			 	//this.viewer.on('move',  function() { alert('pippo'); /*this.setCarouselFixed*/}, this);
			 	

			 	this.on('draggableObjInitialized', 
			 				function(draggableObj) {
			 							
						 			draggableObj.dd.startDrag = draggableObj.dd.startDrag.createSequence(
																		function(){
																	
																			var pos = this.viewer.getPosition();
																			if ((this.carouselFixedLeft != pos[0]) || (this.carouselFixedTop  != pos[1])) {
																				var newCarouselFixedLeft = pos[0];
																				var newCarouselFixedTop  = pos[1];
																				thisPanel.setCarouselFixed(newCarouselFixedLeft, newCarouselFixedTop);	    
																			}
																		}, thisPanel);
									}, thisPanel);

			 
			 	
			 	
			}	
			
		},		
		
		/**
		 * @method loadItem
		 * <pre>
		 * Aggiunge un item alla lista. E' comunque possibile caricarla direttamente all'inizializzazione passando il parametro itemList.
		 * Esempio di utilizzo:
		 * 
		 * var itemList = [ { tipo: 'mapserver', url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto1954.map", layer: "FOTO1954", formato:"",	testo: "1954" },
	                 { url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto1978.map", layer: "FOTO1978", formato:"",	testo: "1978" },
	                 { tipo: 'mapserver', styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto1996.map", layer: "FOTO1996", formato:"",	testo: "1996" },
	                 { tipo: 'mapserver', url: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto2002.map", layer: "FOTO2002", formato:"",	testo: "2002" },
	                 { tipo: 'mapserver', url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto2003.map", layer: "FOTO2003", testo: "2003" },
	                 { tipo: 'mapserver', url: "", styles: "", mappa: "/usr1/test/vh/tolomeo/mapfiles/ortofoto2009.map", layer: "FOTO2009", formato:"",	testo: "2009" },
	                 { tipo: 'WMS', url: "http://geoserver.comune.prato.it/geoserver/wms", styles: "", mappa: "", layer: "comunepo:ortofoto2009", formato:"image/jpeg", srid:"EPSG:3003",	testo: "2009 geoserver" },
	                 { tipo: 'WMS', url: "http://web.rete.toscana.it/sgrwms/com.rt.wms.RTmap", styles: "", mappa: "", layer: "idsfondodtm50kcol", formato:"image/jpeg", srid:"EPSG:3003",	testo: "Hillshade Geoscopio" }
	                  ];
	
			timeMachinePnl =	new TolomeoExt.ToloTimeMachinePanel({
										viewer: tolomeoPnl.api.viewer,
										//itemsList: itemList,
										//carouselItems: ['1','2','3','4','5'],
										carouselConfig: {
											    interval: 3,
											    autoPlay: true,
											    showPlayButton: true,
											    pauseOnNavigate: true,
											    freezeOnHover: true,
											    transitionType: 'fade',
											    transitionEasing: 'fadeIn',    
											    navigationOnHover: false    
											}
										});
			
			for (var i=0; i<itemList.length; i++) {
				timeMachinePnl.loadItem(	itemList[i],
									(i==itemList.length-1)
								);
				}
				 	
			 var timeMachineWin = new Ext.Window({ title: "pp",  
						layout: 'fit',
						maximizable:true,
						collapsible:true,
						left:0, right:0,
						height: 200, width:200,
						autoScroll: true,
						renderTo: tolomeoPnl.api.viewer.body,
						items: [ timeMachinePnl
							] });
		 *</pre>
		 * map, layername, text,
		 * 
		 * @param {Object} item
		 * 
		 * 
		 * @param {Object} refresh
		 * 
		 * 
		 */
		loadItem: function(item, refresh) {
			//item
			this.itemsList.push(item);
			this.addImgItem ("" + Math.random(), 
							// map, layername
							this.viewer.pluginServerUrl(item, this.mapviewerWidthWithRatio, this.mapviewerHeightWithRatio), 
							item.testo, 
							refresh);
			
		},
		
		/**
		 * @method reloadItems
		 * svuota la lista degli item e la ricarica con gli stessi item, allo scopo di farli richiedere al server
		 * 
		 */
		reloadItems: function () {
		
			this.activeSlide =null;
			if (this.carousel) this.activeSlide = this.carousel.activeSlide;
			this.clearItems();
			var items = this.itemsList; 
			this.itemsList=[];
			
			var bDaSettareSlide = (this.carousel!=null && this.activeSlide!=null && this.activeSlide!=0);
			
			for (var i=0; i<items.length; i++) {
				this.loadItem( items[i], false); 	
			}
			this.refresh(this.activeSlide);
			/*if (bDaSettareSlide) {
				this.carousel.setSlide();
			}*/
			
		}
		
		
	});
