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
 * Class: TolomeoExt.ToloButtonPanelExt
 * 
 * Inherits from:
 *  - <Ext.Toolbar>
 *
 */

Ext.define('TolomeoExt.ToloButtonPanelExt', { 
//TolomeoExt.ToloButtonPanelExt = Ext.extend(Ext.Toolbar,{

	extend: 'Ext.Toolbar',
	//requires: [],
	
	/**
	 * Settato automaticamente da bindToApi. 
	 * @type {TolomeoExt.ToloMapAPIExt}
	 */
	api: null,
	
	/** 
	 * Property: paramsJS
	 * {JSONObject} 
	 */
	paramsJS:null,

	/** 
	 * Property: TOLOMEOServer
	 * {String} 
	 * 
	 */
	TOLOMEOServer: null,

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 * 
	 */
	TOLOMEOContext: null,

	/** 
	 * Property: withPan
	 * {Boolean} Indica se il pulsante "Pan" deve essere presente.
	 */
	withPan: true,

	/** 
	 * Property: withPanArrows
	 * {Boolean} Indica se i pulsanti "PanNord", "PanEst", "PanSud" e "PanOvest" deve essere presente
	 */
	withPanArrows: false,

	/** 
	 * Property: withZoomIn
	 * {Boolean} Indica se il pulsante "ZoomIn" deve essere presente.
	 */
	withZoomIn: true,

	/** 
	 * Property: withZoomOut
	 * {Boolean} Indica se il pulsante "ZoomOut" deve essere presente.
	 */
	withZoomOut: true,
	
	/** 
	 * Property: withZoomBoox
	 * {Boolean} Indica se il pulsante "withZoomBoox" deve essere presente.
	 */
	withZoomBox: true,

	/** 
	 * Property: withZoomAll
	 * {Boolean} Indica se il pulsante "ZoomAll" deve essere presente.
	 */
	withZoomAll: true,

	/** 
	 * Property: withMeasure
	 * {Boolean} Indica se il pulsante "Measure" deve essere presente.
	 */
	withMeasure: true,

	/** 
	 * Property: withPrint
	 * {Boolean} Indica se il pulsante "Print" deve essere presente.
	 */
	withPrint: true,

	/** 
	 * Property: withLegenda
	 * {Boolean} Indica se il pulsante "Legenda" deve essere presente.
	 */
	withLegenda: true,

	/** 
	 * Property: withQuery
	 * {Boolean} Indica se il pulsante "Query" deve essere presente.
	 */
	withQuery: true,

	/** 
	 * Property: withSeleziona
	 * {Boolean} Indica se il pulsante "Seleziona" deve essere presente.
	 */
	withSeleziona: true,
	
	/** 
	 * Property: withInfoSeleziona
	 * {Boolean} Indica se il pulsante "Seleziona" deve aver le info sui tasti funzione.
	 */
	withInfoSelezione: false,

	/** 
	 * Property: withAnnullaSeleziona
	 * {Boolean} Indica se il pulsante "AnnullaSeleziona" deve essere presente.
	 */
	withAnnullaSeleziona: true,

	/** 
	 * Property: withLayerList
	 * {Boolean} Indica se il pulsante "LayerList" deve essere presente.
	 */
	withLayerList: true,

	/** 
	 * Property: withIdentify
	 * {Boolean} Indica se il pulsante "Identify" deve essere presente.
	 */
	withIdentify: true,

	/** 
	 * Property: withNuovo
	 * {Boolean} Indica se il pulsante "Nuovo" deve essere presente.
	 */
	withNuovo: true,

	/** 
	 * Property: withUpdateAlfa
	 * {Boolean} Indica se il pulsante "UpdateAlfa" deve essere presente.
	 */
	withUpdateAlfa: true,

	/** 
	 * Property: withAdd
	 * {Boolean} Indica se il pulsante "Add" deve essere presente.
	 */
	withAdd: true,

	/** 
	 * Property: withSubtract
	 * {Boolean} Indica se il pulsante "Subtract" deve essere presente.
	 */
	withSubtract: true,

	/** 
	 * Property: withAddSub
	 * {Boolean} Indica se il pulsante "AddSub" deve essere presente.
	 */
	withAddSub: true,

	/** 
	 * Property: withVertexEdit
	 * {Boolean} Indica se il pulsante "VertexEdit" deve essere presente.
	 */
	withVertexEdit: true,

	/** 
	 * Property: withDragDrop
	 * {Boolean} Indica se il pulsante "DragDrop" deve essere presente.
	 */
	withDragDrop: true,

	/** 
	 * Property: withDelete
	 * {Boolean} Indica se il pulsante "Delete" deve essere presente.
	 */
	withDelete: true,

	/** 
	 * Property: withAutoIdentify
	 * {Boolean} Indica se il pulsante "AutoIdentify" deve essere presente.
	 */
	withAutoIdentify: true,
	
	/** 
	 * Property: withFilter
	 * {Boolean} Indica se il pulsante "filter" deve essere presente.
	 */
	withTemporalFilter: true,
	
	/** 
	 * Property: withTimeMachine
	 * {Boolean} Indica se il pulsante della macchina temporale deve essere presente.
	 */
	withTimeMachine: true,
	
	/** 
	 * Property: withSnap
	 * {Boolean} Indica se il pulsante "snap" deve essere presente.
	 */
	withSnap: true,
	
	/** 
	 * Property: withCsw
	 * {Boolean} Indica se il pulsante "csw" deve essere presente.
	 */
	withCsw: true,
	
	/** 
	 * Property: withWMSExporer
	 * {Boolean} Indica se il pulsante "WMSExplorer" deve essere presente.
	 */
	withWMSExporer: true,
	
	/** 
	 * Property: with3D
	 * {Boolean} Indica se il pulsante "3D" deve essere presente.
	 */
	with3D: true,
	
	/** 
	 * Property: withShowCoordinate
	 * {Boolean} Indica se il pulsante "Mostra Cooordinate" deve essere presente.
	 */
	//withShowCoordinate: true,
	
	/** 
	 * Property: temporalFilterWindow
	 */
	temporalFilterWindow: null,

	/** 
	 * Property: buttons
	 * {Array} Array contenente i controllo (button od altro) presenti nella pulsantiera.
	 */
	buttons: null,

	/** 
	 * Property: btnMeasure
	 * 
	 */
	btnMeasure: null,

	/** 
	 * Property: iconBasePath
	 * 
	 */
	iconBasePath:null,  

	/** 
	 * Property: cmbLayerSel
	 * 
	 */
	cmbLayerSel: null, 

	/** 
	 * Property: groupPrefix
	 * 
	 */
	groupPrefix: null, 

	/**
	 * Method: withSearchLayerFilter
	 * 
	 * Parameters:
	 * record - il record.
	 * id - l'identificativo.
	 */
	withSearchLayerFilter: function(record,id){
		return record.data.eventiLayer.raw.interactable;
	},

	/**
	 * Constructor: TolomeoExt.ToloButtonPanelExt
	 * Create a new button toolbar
	 *
	 * Returns:
	 * {<TolomeoExt.ToloButtonPanelExt>} A new button toolbar
	 */
	initComponent: function() {

		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		this.groupPrefix = this.getId();

		this.buttons = new Array();
		
		this.callParent();

		Ext.QuickTips.init();

		// add custom events
		this.addEvents('onPanPressFn');
		this.addEvents('onPanReleaseFn');
		this.addEvents('onCustomButtonPressFn');
		this.addEvents('onCustomButtonDefaultReleaseFn');

		this.addEvents('onNuovoPressFn');
		this.addEvents('onNuovoReleaseFn');

		this.addEvents('onPanNordPressFn');
		this.addEvents('onPanEstPressFn');
		this.addEvents('onPanSudPressFn');
		this.addEvents('onPanOvestPressFn');

		this.addEvents('onZoomInPressFn');
		this.addEvents('onZoomOutPressFn');
		this.addEvents('onZoomBoxPressFn');
		this.addEvents('onZoomAllPressFn');

		this.addEvents('onMeasureActivate');
		this.addEvents('onMeasureDeactivate');
		this.addEvents('onMeasureTypeChange');

		this.addEvents('onPrintPressFn');
		this.addEvents('onLegendPressFn');
		this.addEvents('onLegendReleaseFn');
		this.addEvents('onQueryPressFn');
		this.addEvents('onQueryReleaseFn');
		this.addEvents('onSelectPressFn');
		this.addEvents('onSelectReleaseFn');
		this.addEvents('onIdentifyPressFn');

		this.addEvents('onDeletePressFn');
		this.addEvents('onUpdateAlfaPressFn');
		this.addEvents('onAddPressFn');

		this.addEvents('onAddReleaseFn');
		this.addEvents('onSubtractPressFn');
		this.addEvents('onSubtractReleaseFn');
		this.addEvents('onAddSubPressFn');
		this.addEvents('onAddSubReleaseFn');
		this.addEvents('onVertexEditPressFn');
		this.addEvents('onVertexEditReleaseFn');
		this.addEvents('onDragDropPressFn');

		this.addEvents('onDragDropReleaseFn');
		this.addEvents('onAnnullaSelezioniPressFn');
		this.addEvents('onAutoIdentifyPressFn');
		this.addEvents('onAutoIdentifyReleaseFn');
		
		this.addEvents('onTemporalFilterPressFn');
		this.addEvents('onTemporalFilterReleaseFn');
		this.addEvents('onTemporalFilterApply');
		
		this.addEvents('onTimeMachinePressFn');
		this.addEvents('onTimeMachineReleaseFn');
		
		this.addEvents('onCswPressFn');
		this.addEvents('onCswReleaseFn');
		
		this.addEvents('onWMSPressFn');
		this.addEvents('onWMSReleaseFn');
		
		this.addEvents('showPermalinkClicked');
		this.addEvents('exportForQgisClicked');
		this.addEvents('showInfoClicked');
		this.addEvents('regeneratePageClicked');
		this.addEvents('mailToAdministratorClicked');
		this.addEvents('showGuideClicked');
		this.addEvents('showFaqClicked');
		
		this.addEvents('showWithOSMClicked');
		this.addEvents('showWithGoogleSatelliteClassicClicked');
		this.addEvents('showWithGoogleMapClassicClicked');
		this.addEvents('showWithGoogleSatelliteClicked');
		this.addEvents('showWithGoogleMapClicked');
		this.addEvents('showWithBingObClicked');
		this.addEvents('showWithBingSatelliteClicked');
		this.addEvents('showWithBingMapClicked');
		this.addEvents('showWithHereSatelliteClicked');
		this.addEvents('showWithHereMapClicked');
		
		//this.addEvents('onCoordinatePressFn');
		//this.addEvents('onCoordinateReleaseFn');	
		
		this.addEvents({
			onSnapPressFn  : true,
			onSnapReleaseFn: true
		});

		var thisToolbar = this;
		var layout = this.paramsJS.layOut;

		/*
	    var btnModel = Ext.extend(Ext.Button, {
	    	enableToggle:true,
	    	listeners: { toggle: { fn: this.btnToggleHandler, scope: thisToolbar}}
	    });
		 */

		var listenersToggle = {toggle: {fn: this.btnToggleHandler, scope: thisToolbar}};
		var listenersClick  = {click:  {fn: this.btnClickHandler,  scope: thisToolbar}};
		//var listenersCheck  = { check: { fn: this.btnClickHandler, scope: thisToolbar}};

		var btnSplitModel = Ext.extend(Ext.SplitButton, {
			enableToggle:false,
			scale: (this.defaults && this.defaults.scale) ? this.defaults.scale : undefined,
			defaults: (this.defaults) ? this.defaults : undefined,
			listeners: {toggle: {fn: this.btnToggleHandler, scope: thisToolbar}}
		});

		if (this.iconBasePath==null) this.iconBasePath =  TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'img/icone/16-default/'; // this.TOLOMEOServer + '/img/icone/16-default/';
		
		var keymap = new Ext.KeyMap(document, null);

		// Pan
		if (this.withPan) { 
			this.btnPan = this.addButton({
				//scale: 'medium',
				icon: this.iconBasePath + 'hand.gif',
				enableToggle: true,
				overflowText: "Pan",
				pressed:true,
				allowDepress: false,
				toggleGroup: this.encodeToggleGroup(2),
				becomeDefault: true,
				groupDefault: true,				
				tooltip: {text: 'Sposta l\'area di visualizzazione della mappa', title: 'Panoramica [Ctrl+Alt+A]'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Pan',
				opCode: TolomeoExt.ToloAPIOpCodes.btnPan
			});
			keymap.addBinding({
				    key: Ext.EventObject.A,
				    fn: function(key){
				    	if(!this.btnPan.pressed){
							this.btnPan.toggle(true);
				    	}
					},
					alt: true,
					ctrl: true,
				    scope: this,
				    stopEvent: true
				});
		}
		
		// Pan con freccie
		if (this.withPanArrows) { 
			// Pan Nord
			this.addButton({
				icon: this.iconBasePath + 'su.gif',
				enableToggle: false,
				overflowText: "Alto",
				tooltip: {text: 'Sposta la mappa verso l\'alto', title: 'Alto'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'PanNord',
				opCode: TolomeoExt.ToloAPIOpCodes.btnPanNord
			});

			// Pan Sud
			this.addButton({
				icon: this.iconBasePath + 'giu.gif',
				enableToggle: false,
				overflowText: "Basso",
				tooltip: {text: 'Sposta la mappa verso il basso', title: 'Basso'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'PanSud',
				opCode: TolomeoExt.ToloAPIOpCodes.btnPanSud
			});

			// Pan Ovest
			this.addButton({
				icon: this.iconBasePath + 'sinistra.gif',
				enableToggle: false,
				overflowText: "Sinistra",
				tooltip: {text: 'Sposta la mappa verso il sinistra', title: 'Sinistra'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'PanOvest',
				opCode: TolomeoExt.ToloAPIOpCodes.btnPanOvest
			});

			// Pan Est
			this.addButton({
				icon: this.iconBasePath + 'destra.gif',
				enableToggle: false,
				overflowText: "Destra",
				tooltip: {text: 'Sposta la mappa verso destra', title: 'Destra'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'PanEst',
				opCode: TolomeoExt.ToloAPIOpCodes.btnPanEst
			});
		}
		
		this.add('-');
		
		// ZoomIn
		if (this.withZoomIn) {
			this.addButton({
				icon: this.iconBasePath + 'zoomin.gif',
				enableToggle: false,
				overflowText: "Zoom in",
				tooltip: {text: 'Aumenta la scala della mappa', title:'Zoom in'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'ZoomIn',
				opCode: TolomeoExt.ToloAPIOpCodes.btnZoomIn
			});
		}

		// ZoomOut
		if (this.withZoomOut) {
			this.addButton({
				icon: this.iconBasePath + 'zoomout.gif',
				enableToggle:false,
				overflowText: "Zoom out",
				tooltip: {text: 'Diminuisce la scala della mappa', title:'Zoom out'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'ZoomOut',
				opCode: TolomeoExt.ToloAPIOpCodes.btnZoomOut
			});
		}
		
		// ZoomBoox
		if (this.withZoomBox) {
			this.addButton({
				icon: this.iconBasePath + 'zoombox.gif',
				enableToggle: true,
				overflowText: "Zoom box",
				allowDepress: false,
				toggleGroup: this.encodeToggleGroup(2),
				tooltip: {text: 'Aumenta la scala nell\'area disegnata', title:'Zoom box'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'ZoomBox',
				opCode: TolomeoExt.ToloAPIOpCodes.btnZoomBox
			});
		}

		// ZoomAll
		if (this.withZoomAll) {
			this.addButton({
				icon: this.iconBasePath + 'nozoom.gif',
				enableToggle:false,
				overflowText: "Ripristino zoom",
				tooltip: {text: 'Reimposta al valore iniziale la scala della mappa', title:'Ripristino zoom'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'ZoomAll',
				opCode: TolomeoExt.ToloAPIOpCodes.btnZoomAll
			});
		}
		
		if (this.withZoomIn || this.withZoomOut || this.withZoomAll) this.add('-');
		
		/*
		Ext.define('btnSplitModel', {
			extend: 'Ext.SplitButton',
			scale: (this.defaults && this.defaults.scale) ? this.defaults.scale : undefined,
			defaults: (this.defaults) ? this.defaults : undefined,
			listeners: {toggle: {fn: this.btnToggleHandler, scope: thisToolbar}}
		});
		*/
		
		// Measure
		if (this.withMeasure) {
			this.btnMeasure = this.addButton(
					new btnSplitModel({
						icon: this.iconBasePath + 'misura.gif',
						enableToggle: true,
						overflowText: "Misura",
						allowDepress: false,
						toggleGroup: this.encodeToggleGroup(2),
						tooltip: {text: 'Esegui delle misurazioni sulla mappa', title:'Misura'},
						scale: (this.defaults && this.defaults.scale) ? this.defaults.scale : "small",
						// Proprietà aggiuntive per Tolomeo
						listeners: { toggle: {fn: this.btnMeasureMng , scope: thisToolbar} },
						handlerBaseName: 'Measure',
						menu: {
							cls: 'clearCSS',
							
						
							items: [{
								text: 'Poligono',
								checked: false,
								iconCls : 'iconPolygonalMeasure',
								cls : "clearCss",
								overflowText: "Misura poligono",
								group: 2,
								tooltip: {text: 'Misura un\'area poligonale', title:'Misura poligono'},
								listeners: { checkchange: {fn: this.btnMeasureItemMng, scope: thisToolbar} },
								// Proprietà aggiuntive per Tolomeo
								handlerBaseName: 'MeasurePolygon',
								measureType: 0,
								opCode: TolomeoExt.ToloAPIOpCodes.btnMeasure
							},{
								text: 'Cerchio',
								checked: false,
								overflowText: "Misura cerchio",
								iconCls : 'iconCircularMeasure',
								cls : "clearCss",
								group: 2,
								tooltip: {text: 'Misura una circonferenza', title:'Misura cerchio'},
								listeners: { checkchange: {fn: this.btnMeasureItemMng , scope: thisToolbar} },
								// Proprietà aggiuntive per Tolomeo
								handlerBaseName: 'MeasureCircle',
								measureType: 1,
								opCode: TolomeoExt.ToloAPIOpCodes.btnMeasure
							},{
								text: 'Linea',
								checked: true,
								overflowText: "Misura linea",
								iconCls : 'iconLinearMeasure',
								cls : "clearCss",
								group: 2,
								tooltip: {text: 'Misura una distanza lineare', title:'Misura linea'},
								listeners: { checkchange: {fn: this.btnMeasureItemMng , scope: thisToolbar} },
								// Proprietà aggiuntive per Tolomeo
								handlerBaseName: 'MeasureLine',
								measureType: 2,
								opCode: TolomeoExt.ToloAPIOpCodes.btnMeasure
							}]
						}
					})
			);
			this.add('-');
		}
		
		// TimeMachine
		// TODO  generalizzare adesso considera solo mappa[0] gestisce solo prima mappa
		if (this.withTimeMachine && (this.paramsJS.mappe.mappaList[0].timeMachineList!=null && this.paramsJS.mappe.mappaList[0].timeMachineList.length>0)) {
			this.addButton({
				icon: this.iconBasePath + 'macchinaTempo.png',
				enableToggle: true,
				overflowText: "Macchina temporale",
				tooltip: {text: 'Apre una finestra che mostra una sequenza di foto aeree storiche', title:'Macchina temporale'},
				listeners: listenersToggle,
				toggleGroup: this.encodeToggleGroup(0),
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'TimeMachine',
				opCode: TolomeoExt.ToloAPIOpCodes.btnTimeMachine
			});
			this.add('-');
		}

		// Print
		if (this.withPrint) {
			this.addButton({
				icon: this.iconBasePath + 'print.gif',
				enableToggle:false,
				overflowText: "Stampa",
				tooltip: {text: 'Apre una finestra per impostare la stampa dell\'attuale area di visualizzazione della mappa', title:'Stampa mappa'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Print',
				opCode: TolomeoExt.ToloAPIOpCodes.btnPrint
			});
		}

		// Legenda
		if (this.withLegenda) {
			if (this.paramsJS.mappe.mappaList[0].legenda!=null) {
				this.addButton({
					icon: this.iconBasePath + 'legenda.gif',
					enableToggle: true,
					overflowText: "Legenda",
					toggleGroup: this.encodeToggleGroup(1),
					tooltip: {text: 'Consultazione e gestione dei tematismi della mappa', title:'Legenda'},
					listeners: listenersToggle,
					// Proprietà aggiuntive per Tolomeo
					handlerBaseName: 'Legend',
					opCode: TolomeoExt.ToloAPIOpCodes.btnLegenda
				});
			}
		}

		// verifica la necessità di pannello query
		if (this.withQuery) {
			var bQuery = false;
			for (var i=0; i<this.paramsJS.azioniEventi.eventiLayerList.length; i++) {
				if (this.paramsJS.azioniEventi.eventiLayerList[i].azioniEventiRicercaList.ricercaList.length != 0){
					bQuery = true; 
					break;
				}
			}
			if (bQuery) {
				this.addButton({
					icon: this.iconBasePath + 'ricerca.gif',
					enableToggle: true,
					overflowText: "Ricerca",
					toggleGroup: this.encodeToggleGroup(1),
					tooltip: {text: 'Imposta i criteri di ricerca per trovare un oggetto cartografico nella mappa', title:'Ricerche'},
					listeners: listenersToggle,
					// Proprietà aggiuntive per Tolomeo
					handlerBaseName: 'Query',
					opCode: TolomeoExt.ToloAPIOpCodes.btnRicerca
				});
			}
		}

		if (this.withPrint || this.withLegenda || this.withQuery) this.add('-');
		
		// Seleziona
		if (this.withSeleziona) {
			
			var helpMsg = 'Seleziona un oggetto cartografico nella mappa.<br /><br />Tenere premuto :<br />- <b>[SPACE]</b> per spostarsi senza selezionare.';
			if (this.withInfoSelezione) {
				helpMsg += '<br />- <b>[SHIFT]</b> per ';
				if (this.paramsJS.selectDefaultMode=='FIRSTONTOP') {
					helpMsg += 'selezionare su strati in profondit&agrave;.'; 
				} else {
					helpMsg += 'selezionare lo strato pi&ugrave; in alto.'  
				}
				helpMsg += '<br />- <b>[CTRL]</b> per aggiungere alla selezione corrente.<br />- <b>[ALT]</b> per consultare direttamente le informazioni.';
			}
				
			
			
			this.btnSelect = this.addButton({
				icon: this.iconBasePath + 'sector.gif',
				enableToggle:true,
				overflowText: "Seleziona",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text: helpMsg, title:'Seleziona [Ctrl+Alt+S]'},
				listeners: listenersToggle,
				becomeDefault: true,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Select',
				opCode: TolomeoExt.ToloAPIOpCodes.btnSeleziona
			});
			
			if(this.paramsJS.getSelectableCodTPN().length>0){
				keymap.addBinding({
					    key: Ext.EventObject.S,
					    fn: function(key){
					    	if(!this.btnSelect.disabled && !this.btnSelect.pressed){
								this.btnSelect.toggle(true);
					    	}
						},
						alt: true,
						ctrl: true,
					    scope: this,
					    stopEvent: true
					});
			}
		}
		
		// Annulla selezioni
		if (this.withAnnullaSeleziona) {
			this.addButton({
				icon: this.iconBasePath + 'unsector.gif',
				enableToggle:false,
				overflowText: "Annulla selezioni",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text:'Annulla le selezioni', title:'Deseleziona'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'AnnullaSelezioni',
				opCode: TolomeoExt.ToloAPIOpCodes.btnAnnullaSelezioni
			});
			
		}
		
		if ( this.withSeleziona || this.withAnnullaSeleziona ) this.add('-');
		//if (this.withLayerList || this.withNuovo || this.withUpdateAlfa || this.withAdd || this.withSubtract || this.withAddSub || this.withVertexEdit || this.withDragDrop || this.withDelete ) this.add('Editing :  ');

		// Layer list
		if (this.withLayerList) {
			
			
			var layerStore = new Ext.data.JsonStore({
				proxy: {
		    		type: 'memory'//,
		    		// reader configs
		    		//reader: {
		    		//	type: 'json',
		    		//	root: 'valori',
		    		//	idProperty: suggestProvider[i].valueFieldName // 'COD',
		    			//fields: fields //['COD', 'DESC', 'REG']
					//}
				},
				
				mode: "local",
				data: this.paramsJS.azioniEventi.eventiLayerList,
				autoLoad: false,
				remoteSort: false,
				fields: [{
						name: 'descrizioneLayer',
						mapping: 'descrizioneLayer'
					},{
						name: 'codTPN',
						mapping: 'codTPN'
					},{
						name: 'eventiLayer',
					    convert: function (v, rec) { return rec; }
					}]
			});
			
			/*
			var layerStore = new Ext.data.JsonStore({
				fields: [{
					name: 'descrizioneLayer',
					mapping: 'descrizioneLayer'
				},{
					name: 'codTPN',
					mapping: 'codTPN'
				},{
					name: 'eventiLayer',
				    convert: function (v, rec) { return rec; }
				}],
				proxy: {
					
				}
				data : this.paramsJS.azioniEventi.eventiLayerList
			});*/

			layerStore.filterBy(this.withSearchLayerFilter);

			this.cmbLayerSel = new Ext.form.ComboBox({
				typeAhead: true,
				queryMode: 'local',
				triggerAction: 'all',
				forceSelection: true,
				editable: false,
				allowBlank: false,
				emptyText:'Seleziona un layer...',
				selectOnFocus:true,
				hiddenName: 'codTPN',
				valueField: 'codTPN',
				displayField: 'descrizioneLayer',
				name: 'codTPN1',
				lastQuery: '',
				listeners: {select: {fn: this.cmbSelectLayerHandler, scope: thisToolbar},
				beforerender: function(){this.store.filterBy(function(record,id){
					return record.data.eventiLayer.raw.interactable;
				},this);}},
				store: layerStore,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: null
				//TODO opCode: TolomeoExt.ToloAPIOpCodes.btnPan
			});				

			// Se esiste seleziono prima scelta
			if (layerStore.getCount()>1) {
				this.cmbLayerSel.setValue(layerStore.getRange(0,0)[0].data.codTPN);
			} else if (layerStore.getCount()==1) {
				this.cmbLayerSel.setVisible(false);
				this.cmbLayerSel.setValue(layerStore.getRange(0,0)[0].data.codTPN);
			} else if (layerStore.getCount()<1) {
				this.cmbLayerSel.setVisible(false);
			}

			this.addCombo(this.cmbLayerSel);
		}    		

		// Visualizza informazioni su oggetto		
		if (this.withIdentify) {
			// Identify
			this.addButton({
				icon: this.iconBasePath + 'info.gif',
				enableToggle: false,
				overflowText: "Info",
				tooltip: {text: 'Ottieni informazioni su un oggetto selezionato', title:'Info'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Identify',
				opCode: TolomeoExt.ToloAPIOpCodes.btnIdentify
			});
		}						

		// Nuovo
		if (this.withNuovo) {
			/*
			this.addButton({
				icon: this.iconBasePath +  'nuovo.gif',
				enableToggle: true,
				overflowText: "Nuovo oggetto",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text: 'Crea un nuovo oggetto cartografico nella mappa (punto, linea, poligono, ecc...)', title:'Nuovo oggetto'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Nuovo',
				opCode: TolomeoExt.ToloAPIOpCodes.btnNuovo
			});
			*/
			
			this.btnNew = this.addButton(
					new btnSplitModel({
						enableToggle: true,
						icon: this.iconBasePath + 'nuovo.gif',
						overflowText: "Nuovo oggetto",
						allowDepress: false,
						toggleGroup: this.encodeToggleGroup(2),
						tooltip: {text: 'Crea un nuovo oggetto cartografico nella mappa (punto, linea, poligono, ecc...)', title:'Nuovo oggetto'},
						//listeners: listenersToggle,
						listeners: { toggle: {fn: this.btnNewToggleHandler , scope: thisToolbar} },
						scale: (this.defaults && this.defaults.scale) ? this.defaults.scale : "small",
						// Proprietà aggiuntive per Tolomeo
						//listeners: { toggle: {fn: this.btnMeasureMng , scope: thisToolbar} },
						handlerBaseName: 'Nuovo',
						opCode: TolomeoExt.ToloAPIOpCodes.btnNuovo,
						newType: 0,
						menu: {
							cls: 'clearCSS',
							items: [{
								text: 'Nuovo',
								checked: true,
								icon: this.iconBasePath + 'nuovo.gif',
								overflowText: "Nuovo Oggetto",
								group: 2,
								tooltip: {text: 'Crea un nuovo oggetto cartografico nella mappa (punto, linea, poligono, ecc...)', title:'Nuovo oggetto'},
								listeners: { checkchange: {fn: this.btnNewItemMng, scope: thisToolbar} },
								toggleGroup: this.encodeToggleGroup(2),
								// Proprietà aggiuntive per Tolomeo
								//handlerBaseName: 'Nuovo',
								newType: 0
								//opCode: TolomeoExt.ToloAPIOpCodes.btnNuovo
							},{
								text: 'Nuovo con CAD',
								checked: false,
								overflowText: "Nuovo oggetto da riferimento",
								icon: this.iconBasePath + 'nuovoByCAD.gif',
								group: 2,
								tooltip: {text: 'Crea un nuovo oggetto cartografico nella mappa utilizzando un CAD', title:'Nuovo oggetto CAD'},
								listeners: { checkchange: {fn: this.btnNewItemMng , scope: thisToolbar} },
								toggleGroup: this.encodeToggleGroup(2),
								// Proprietà aggiuntive per Tolomeo
								//handlerBaseName: 'Nuovo',
								newType: 1
								//opCode: TolomeoExt.ToloAPIOpCodes.btnNuovo
							}]
						}
					})
			);
			
		}

		// UpdateAlfa
		if (this.withUpdateAlfa) {
			this.addButton({
				icon: this.iconBasePath + 'modifica.gif',
				enableToggle: false,
				overflowText: "Modifica dati di un oggetto",
				tooltip: {text: 'Modifica i dati testuali associati ad un oggetto cartografico all\'interno della mappa', title:'Modifica dati di un oggetto'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'UpdateAlfa',
				opCode: TolomeoExt.ToloAPIOpCodes.btnUpdateAlfa
			});
		}

		// Add
		if (this.withAdd) {
			this.addButton({
				icon: this.iconBasePath + 'poligono.gif',
				enableToggle: true,
				overflowText: "Aggiungi poligono",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text: 'Disegna un poligono da aggiungere ad uno poligono all\'interno della mappa', title:'Aggiungi poligono'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Add',
				opCode: TolomeoExt.ToloAPIOpCodes.btnAdd
			});
		}

		// Subtract
		if (this.withSubtract) {
			this.addButton({
				icon: this.iconBasePath + 'poligonodelete.gif',
				enableToggle: true,
				overflowText: "Sottrai poligono",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text: 'Disegna un poligono da sottrarre ad uno poligono all\'interno della mappa', title:'Sottrai poligono'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Subtract',
				opCode: TolomeoExt.ToloAPIOpCodes.btnSubtract
			});	
		}

		// AddSub
		if (this.withAddSub) {
			this.addButton({
				icon: this.iconBasePath + 'poligonopiumeno.gif',
				enableToggle: true,
				overflowText: "Modifica copertura",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text: 'Modifica poligono con copertura', title:'Modifica copertura'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'AddSub',
				opCode: TolomeoExt.ToloAPIOpCodes.btnAddSub
			});	
		}

		// VertexEdit
		if (this.withVertexEdit) {
			this.addButton({
				icon: this.iconBasePath + 'poligonovertici.gif',
				enableToggle: true,
				overflowText: "Modifica vertici",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text: 'Modifica i vertici di una linea o di un poligono nella mappa', title:'Modifica vertici'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'VertexEdit',
				opCode: TolomeoExt.ToloAPIOpCodes.btnVertexEdit
			});	
		}

		// DragDrop
		if (this.withDragDrop) {
			this.addButton({
				icon: this.iconBasePath + 'hand.gif',
				enableToggle: true,
				overflowText: "Sposta oggetto",
				toggleGroup: this.encodeToggleGroup(2),
				allowDepress: false,
				tooltip: {text: 'Sposta un oggetto cartografio (punto, linea, poligono, ecc..) all\'interno della mappa', title:'Sposta oggetto'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'DragDrop',
				opCode: TolomeoExt.ToloAPIOpCodes.btnDragDrop
			});	
		}

		// Delete
		if (this.withDelete) {
			this.addButton({
				icon: this.iconBasePath + 'elimina.gif',
				enableToggle: false,
				overflowText: "Elimina oggetto",
				tooltip: {text:'Cancella un oggetto cartografico (punto, linea, poligono, ecc..) all\'interno della mappa', title:'Elimina oggetto'},
				listeners: listenersClick,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Delete',
				opCode: TolomeoExt.ToloAPIOpCodes.btnDelete
			});	
		}
		
		var isSnappingRequired = false; 
		// Controllo se c'è qualche snapping impostato per l'applicazione
		for(var evtLi = 0; evtLi < this.paramsJS.azioniEventi.eventiLayerList.length; evtLi++){			
			var evtL = this.paramsJS.azioniEventi.eventiLayerList[evtLi];			
			if(evtL.snapping && evtL.snapping.snappingLayerList && evtL.snapping.snappingLayerList.length > 0){
				isSnappingRequired = true;
				break;
			}
		}
		
		// Snap
		if(isSnappingRequired && this.withSnap) {
			this.addButton({
				icon: this.iconBasePath + 'grid-snap-dot.png',
				enableToggle: true,
				overflowText: "Snap a layer",
				tooltip: {text:'Attiva lo snap per i layer sui quali &egrave; stato impostato', title:'Snap a layer'},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'Snap',
				opCode: TolomeoExt.ToloAPIOpCodes.btnSnap
			});		
		}
		
		// Csw
		if(layout.csw && this.withCsw) {
			this.addButton({
				icon: this.iconBasePath + 'csw.png',
				enableToggle: true,
				overflowText: "Catalog Service",
				tooltip: {text:'Attiva la finestra di accesso al servizio di cataloghi', title:'Csw'},
				listeners: listenersToggle,
				handlerBaseName: 'Csw',
				opCode: TolomeoExt.ToloAPIOpCodes.btnCsw
			});		
		}
		
		// WMS
		if(layout.WMSExplorer && this.withWMSExporer) {
			this.addButton({
				icon: this.iconBasePath + 'wms.png',
				enableToggle: true,
				overflowText: "Aggiunta WMS",
				tooltip: {text:'Attiva la finestra di gestione aggiunta WMS', title:'WMS'},
				listeners: listenersToggle,
				handlerBaseName: 'WMS',
				opCode: TolomeoExt.ToloAPIOpCodes.btnWMSExplorer
			});		
		}

		// WMS
		if(layout.visualizzazione3D && this.with3D) {
			this.addButton({
				icon: this.iconBasePath + '3d_glasses.png',
				enableToggle: true,
				overflowText: "Visualizzazione 3D",
				tooltip: {text:'Attiva la finestra di visualizzazione 3D', title:'3D'},
				listeners: listenersToggle,
				handlerBaseName: '3D',
				opCode: TolomeoExt.ToloAPIOpCodes.btn3D
			});		
		}

		// Filtro temporale
		if (layout.conFiltroTemporale && this.withTemporalFilter) {
			this.addButton({
		    	icon: this.iconBasePath + 'filtro.gif',
		    	//enableToggle: true,
		    	//toggleGroup: this.encodeToggleGroup(2),
				allowDepress: true,
		    	overflowText: "Filtro temporale",
		    	tooltip: {text: 'Applica un filtro temporale al layer corrente', title:'Filtro temporale'},
		    	listeners: listenersClick,
		    	// Proprietà aggiuntive per Tolomeo
		    	handlerBaseName: 'TemporalFilter',
		    	opCode: TolomeoExt.ToloAPIOpCodes.btnTemporalFilter
		    });
		}
		
		// AutoIdentify
		if (this.withAutoIdentify && this.autoIdentifyLayersPresent()) {
			this.addButton({
				icon: this.iconBasePath +  'identifica.gif',
				enableToggle: true,
				overflowText: "Identifica",
				allowDepress: true,
				tooltip: {text: "Identifica un oggetto sulla mappa posizionando il cursore sull'oggetto stesso", title:"Identifica"},
				listeners: listenersToggle,
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'AutoIdentify',
				opCode: TolomeoExt.ToloAPIOpCodes.btnAutoIdentify
			});
		}

		// Custom buttons
		for (var i=0; i<layout.customButtonList.length; i++) {
			var cb = layout.customButtonList[i];
			var btNo = TolomeoExt.ToloAPIOpCodes.btnCustomBase+i;

			this.addButton({
				icon: this.iconBasePath + cb.iconFileName,
				enableToggle: (cb.gruppo!=null && cb.gruppo!=-1 ) ? true : false,
				listeners:    (cb.gruppo!=null && cb.gruppo!=-1 ) ? listenersToggle : listenersClick,
				toggleGroup:  (cb.gruppo!=null && cb.gruppo!=-1 ) ? this.encodeToggleGroup(cb.gruppo) : null,
				overflowText: cb.iconTitleMessage,
				//allowDepress: true,
				tooltip: { text: cb.tooltipMessage, title:cb.iconTitleMessage},
				// Proprietà aggiuntive per Tolomeo
				handlerBaseName: 'CustomButton',
				opCode: btNo,
				idCustomButton: cb.idCustomButton,
				pressFunction: cb.pressFunction,
				releaseFunction: cb.releaseFunction
			});

			//bottoni.add(btNo, 'customButton' + btNo, cb.iconFileName, cb.gruppo, pf, rf, cb.disabledMessage, cb.iconTitleMessage, cb.iconAltMessage, cb.idCustomButton);		
		}

		/*// Custom buttons
		for (var i=0; i<paramsJS.layOut.customButtonList.length; i++) {
			var cb = paramsJS.layOut.customButtonList[i];
			var btNo = btnCustomBase+i;
			var pf = ((cb.pressFunction == null)||(cb.pressFunction == ''))  ? btnCustomButtonDefaultPressFn : cb.pressFunction;
			var rf = ((cb.releaseFunction == null)||(cb.releaseFunction == ''))  ? btnCustomButtonDefaultReleaseFn : cb.releaseFunction;

			 //<li><a href="JavaScript:bottoni.press(btnIdentify);" title="Ottieni informazioni su un oggetto selezionato"><img src="${applx.urlCss}/img/icone_on/info.gif" alt="Informazioni" id="identify" /></a></li>		

			bottoni.add(btNo, 'customButton' + btNo, cb.iconFileName, cb.gruppo, pf, rf, cb.disabledMessage, cb.iconTitleMessage, cb.iconAltMessage, cb.idCustomButton);		
		}*/
								
		this.filler = new Ext.toolbar.Fill();		
		this.add(this.filler);
		this.fillerAdded = true; 		
        
		this.add('-');		
		
		this.add({
			icon: this.iconBasePath + 'permalink.png',
			id: this.getId() + 'permalinkBtn',
			disabled : true,
			tooltip: {text: "Permette la generazione del link utile ad aprire il visualizzatore nello stato corrente.", title:"Permalink"},

			listeners: { 								
				click: {
					fn: function() {     	    								
						this.fireEvent('showPermalinkClicked');																												
					},
					scope: this
	    		}
	    		
			}			
		});		
		
		this.add('-');	
		
		if (layout.conExportQGIS || layout.withVisWith) {
			
			var mnuStrumenti = Ext.create('Ext.button.Button',{
				//text: 'Strumenti',
				icon: this.iconBasePath + 'options.png',
				hidden : true,
				id: this.getId() + 'toolsMenu',
				tooltip : 'Strumenti',
				menu : {
					cls: 'clearCSS',
					items: []
				}
			});
			this.add(mnuStrumenti);
			
			if (layout.withVisWith &&
				(layout.withVisWith.withOSM ||
				 layout.withVisWith.withGoogle ||
				 layout.withVisWith.withBing ||
				 layout.withVisWith.withHere)) { 
				
				var mnuVisualizzaCon = Ext.create('Ext.menu.Item', {
	    			iconCls : 'iconVisCon',
	    			text: 'Visualizza con...',
					menu : {
						cls: 'clearCSS',
						items : []
					}
				});
				mnuStrumenti.menu.add(mnuVisualizzaCon);
				
				if (layout.withVisWith.withOSM) {
					var mnuOSM = Ext.create('Ext.menu.Item', {
						text : 'OpenStreetMap',
						iconCls : 'iconVisConOSM',
						listeners: { 								
							click: {
								fn: function() {     	    								
									this.fireEvent('showWithOSMClicked',null,null);																												
								},
								scope: this
				    		}}
					});
					mnuVisualizzaCon.menu.add(mnuOSM);
				}
				
				if (layout.withVisWith.withGoogle) {
					var mnuGoogle = Ext.create('Ext.menu.Item', {
						text : 'Google',
		    			iconCls : 'iconVisConGoogle',
						menu : {
							cls: 'clearCSS',
							items: [{
								text: 'Satellite',
								cls : "clearCss",
								listeners: { 								
									click: {
										fn: function() {     	    								
											this.fireEvent('showWithGoogleSatelliteClicked',null,null);																												
										},
										scope: this
						    		}
								}},{
									text: 'Mappa',
									cls : "clearCss",
									listeners: { 								
										click: {
											fn: function() {     	    								
												this.fireEvent('showWithGoogleMapClicked',null,null);																												
											},
											scope: this
							    		}
									}},{
									text: 'Satellite classica',
									cls : "clearCss",
									listeners: { 								
										click: {
											fn: function() {     	    								
												this.fireEvent('showWithGoogleSatelliteClassicClicked',null,null);																												
											},
											scope: this
							    		}
									}},{
									text: 'Mappa classica',
									cls : "clearCss",
									listeners: { 								
										click: {
											fn: function() {     	    								
												this.fireEvent('showWithGoogleMapClassicClicked',null,null);																												
											},
											scope: this
							    		}
									}}]
						}
					});
					mnuVisualizzaCon.menu.add(mnuGoogle);
				}
				
				if (layout.withVisWith.withHere) {
					var mnuHere = Ext.create('Ext.menu.Item', {
						text : 'Here',
		    			iconCls : 'iconVisConHere',
						menu : {
							cls: 'clearCSS',
							items: [{
								text: 'Satellite',
								cls : "clearCss",
								listeners: { 								
									click: {
										fn: function() {     	    								
											this.fireEvent('showWithHereSatelliteClicked',null,null);																												
										},
										scope: this
						    		}
								}},{
								text: 'Mappa',
								cls : "clearCss",
								listeners: { 								
									click: {
										fn: function() {     	    								
											this.fireEvent('showWithHereMapClicked',null,null);																												
										},
										scope: this
						    		}
								}}]
						}
					});
					mnuVisualizzaCon.menu.add(mnuHere);
				}
				
				if (layout.withVisWith.withBing) {
					var mnuBing = Ext.create('Ext.menu.Item', {
						text : 'Bing',
		    			iconCls : 'iconVisConBing',
						menu : {
							cls: 'clearCSS',
							items: [{
								text: 'Satellite oblique',
								cls : "clearCss",
								listeners: { 								
									click: {
										fn: function() {     	    								
											this.fireEvent('showWithBingObClicked',null,null);																												
										},
										scope: this
						    		}
								}},{
								text: 'Satellite',
								cls : "clearCss",
								listeners: { 								
									click: {
										fn: function() {     	    								
											this.fireEvent('showWithBingSatelliteClicked',null,null);																												
										},
										scope: this
						    		}
								}},{
								text: 'Mappa',
								cls : "clearCss",
								listeners: { 								
									click: {
										fn: function() {     	    								
											this.fireEvent('showWithBingMapClicked',null,null);																												
										},
										scope: this
						    		}
								}}]
						}
					});
					mnuVisualizzaCon.menu.add(mnuBing);
				}
				
			}
			
			if (layout.conExportQGIS) {
				var mnuEsporta = Ext.create('Ext.menu.Item', {
					text : 'Esporta',
					menu : {
						cls: 'clearCSS',
						items : [{
							text: 'Qgis',
							id: this.getId() + 'exportQgisBtn',
							disabled : true,
	    	    			iconCls : 'iconExportForQGis',
							cls : "clearCss",
							listeners: { 								
								click: {
									fn: function() {     	    								
										this.fireEvent('exportForQgisClicked',null,null);																												
									},
									scope: this
					    		}
					    		
							}	
						}]
					}
				});
				mnuStrumenti.menu.add(mnuEsporta);
			}
		}
		
		var troubleItems = [];
		troubleItems.push ({
        	text: 'Prova a rigenerare la pagina',
        	iconCls : 'iconRegenerateWithoutCache',
			cls : "clearCss",
        	tooltip: 'Rigenera la pagina invalidando escludendo la cache',
        	listeners : {
        		click : {
        			fn : function(){
        				this.fireEvent('regeneratePageClicked');
        			},
        			scope: this
        		}
        	}     
        });
        
        
        
        if(layout.helpMailTo){        	
        	troubleItems.push ({
            	text: 'Scrivi all\'amministratore del sistema',
            	iconCls : 'iconMailToAdmin',
				cls : "clearCss",
            	tooltip: 'Invia una e-mail a ' + layout.helpMailTo,
            	listeners : {
            		click : {
            			fn : function(){
            				this.fireEvent('mailToAdministratorClicked',layout.helpMailTo,layout.helpMailSubject);
            			},
            			scope: this
            		}
            	}    
            });
        }
        
        var helpItems = [];
        if(layout.helpUrl){
        	
        	helpItems.push({
                	text : 'Guida',              
                	listeners : {
                		click : {
                			fn : function(){
                				this.fireEvent('showGuideClicked',layout.helpUrl);
                			},
                			scope: this
                		}
                	}    
                });
                
            helpItems.push('-');
                            
        }
        
        if(layout.faqUrl){
        	helpItems.push({
                	text : 'FAQ',
                	listeners : {
                		click : {
                			fn : function(){
                				this.fireEvent('showFaqClicked',layout.faqUrl);
                			},
                			scope: this
                		}
                	}    
                });
                
            helpItems.push('-');
        }
        
        helpItems.push({
                	text: 'Problemi ?',
                	menu: {		   
                		cls: 'clearCSS',
		                items: troubleItems
               		}
                });
                
        helpItems.push('-');
        helpItems.push({
                	text: 'Informazioni su Tolomeo',
                	listeners : {
                		click : {
                			fn : function(){
                				this.fireEvent('showTolomeoInfoClicked');	
                			},
                			scope: this
                		}
                	}                	
                });
                
        if(layout.helpInfo){
        	helpItems.push({
                	text: layout.helpInfo.mainTitle,
                	listeners : {
                		click : {
                			fn : function(){
                				this.fireEvent('showCustomInfoClicked',layout.helpInfo);	
                			},
                			scope: this
                		}
                	}                	
                });
        }
                
		
		this.add({
			tooltip : 'Aiuto ed informazioni',
			icon: this.iconBasePath + 'help.png',           
            menu: {
            	cls: 'clearCSS',
                xtype: 'menu',
                plain: true,
                items: helpItems
            }
        });
        
		this.doLayout();													

		
		/**
		 * Finestra filtro temporale
		 */
		this.temporalFilterWindow = Ext.create('Ext.Window', {
				title: 'Filtro temporale',
				closeAction: 'hide',
				constrain: true,
				width: 300,
				autoHeight: true,
				items: new Ext.FormPanel({
					frame: true,
					border: false,
					autoHeight: true,
					bodyStyle: 'padding-top:5px;',
					defaults: {
						labelWidth: 50,
						anchor: '98%'
					},
					items: [{
						id: this.getId() + 'dtInizio',
						xtype: 'datefield',
						fieldLabel: 'Data inizio',
						format: 'd/m/Y'
					},{
						id: this.getId() + 'dtFine',
						xtype: 'datefield',
						fieldLabel: 'Data fine',
						format: 'd/m/Y'
					}],
					buttons: [{
						text: 'Reset',
						handler: function(b,e){
							var dtInizio = Ext.getCmp(this.getId() + 'dtInizio').setValue();
							var dtFine = Ext.getCmp(this.getId() + 'dtFine').setValue();
							this.fireEvent("onTemporalFilterApply", null, null);
						}, scope: this
					},{
						text: 'Applica',
						handler: function(b,e){
							var dtInizio = Ext.getCmp(this.getId() + 'dtInizio').getValue();
							var dtFine = Ext.getCmp(this.getId() + 'dtFine').getValue();
							this.fireEvent("onTemporalFilterApply", dtInizio, dtFine);
						}, scope: this
					},{
						text: 'Chiudi',
						handler: function(){
							this.temporalFilterWindow.hide();
						}, scope: this
					}]
				})
			});
	},
	
	checkFiller : function(item){
		// Non more filler are allowed
		 if(item == null)  return false;
		 
		 if ( 	(typeof item == 'string' && item == '->') || 
		 		(item.xtype && item.xtype == 'tbfill') ||
		 		(item.getXType && item.getXType() == 'tbfill')
		 	) 
		 {
		 	return true;
		 }
	},
		
	add : function(item){		
		 if(this.fillerAdded && this.checkFiller(item)) return;			 		 
		 this.callParent(arguments);
	},
	
	/**
	 * Method: addLeft
	 * Aggiunge l'item nell'ultima posizione del gruppo allineato a sinistra
	 * 
	 * Parameters:
	 * item - item da aggiungere alla toolar. 
	 */
	addLeft : function(item){
		if(this.checkFiller(item)) return;
		var fillerIndex = this.items.indexOf(this.filler);					
		this.insert(fillerIndex,item);
	},
		
	/**
	 * Method: addRight
	 * Aggiunge l'item nella prima posizione del gruppo allineato a destra
	 * 
	 * Parameters:
	 * item - item da aggiungere alla toolar. 
	 */
	addRight : function(item){			
		if(this.checkFiller(item)) return;
		var fillerIndex = this.items.indexOf(this.filler);					
		this.insert(fillerIndex+1,item);
	},
	
	/**
	 * Method: addFirst
	 * Aggiunge l'item in prima posizione
	 * 
	 * Parameters:
	 * item - item da aggiungere alla toolar. 
	 */
	addFirst : function(item){
		if(this.checkFiller(item)) return;
		this.insert(0,item);
	},
	
	/**
	 * Method: addLast
	 * Aggiunge l'item in ultima posizione
	 * 
	 * Parameters:
	 * item - item da aggiungere alla toolar. 
	 */
	addLast : function(item){
		this.add(item);
	},

	/**
	 * Method: encodeToggleGroup
	 * 
	 * Parameters:
	 * group - il gruppo da codificare. 
	 * 
	 * Returns:
	 * Il gruppo codificato.
	 */
	encodeToggleGroup: function(group) {
		return this.groupPrefix + group;
	},

	/**
	 * Method: decodeToggleGroup
	 * 
	 * Parameters:
	 * encodedGroup - il gruppo da decodificare.
	 * 
	 * Returns:
	 * Il gruppo codificato. 
	 */
	decodeToggleGroup: function(encodedGroup) {
		return encodedGroup.substr(this.groupPrefix.length);
	},		

	/**
	 * Method: addButton
	 * Add a single button. 
	 * 
	 * Parameters:
	 * btn - il pulsante da aggiungere.
	 * 
	 * Returns:
	 * Il componente aggiunto.
	 */
	addButton: function(btn) {
		//var cmp = Ext.ComponentMgr.create(btn, 'button');
		if (this.defaults && this.defaults.scale) Ext.applyIf(btn, {scale: this.defaults.scale} );
		var cmp = Ext.create('Ext.button.Button',btn);
		
		this.buttons.push(cmp);
		this.add(cmp);

		return cmp;
	},

	/**
	 * Method: addCombo
	 * 
	 * Parameters:
	 * btn - combo da aggiungere.
	 * 
	 * Returns:
	 * Il componente aggiunto.
	 */
	addCombo: function(cmb) {
		//var cmp = Ext.ComponentMgr.create(btn, 'button');
		//if (this.defaults && this.defaults.scale) Ext.applyIf(btn, {scale: this.defaults.scale} );		
		this.buttons.push(cmb);
		this.add(cmb);

		return cmb;
	},	
	
	/**
	 * Method: cmbSelectLayerHandler
	 * 
	 * Parameters:
	 * combo - la combo box.
	 * record - il record selezionato.
	 * index - l'indice del record.
	 * 
	 * Returns:
	 * {Boolean}
	 */
	cmbSelectLayerHandler: function (combo, record, index) {
		var eventName = 'onSelectLayer';
		this.fireEvent(eventName, record[0].data['codTPN']);
		return true
	},

	/**
	 * Method: btnToggleHandler
	 * 
	 * Parameters:
	 * button - il pulsante.
	 * state - lo stato del pulsante.
	 * 
	 * Returns:
	 * {Boolean}
	 */
	btnToggleHandler: function (button, state) {
		var retVal=true;
		if (button.handlerBaseName !=null) {
			var eventName = 'on' + button.handlerBaseName + ((state == true) ? 'PressFn' : 'ReleaseFn');
			
			if(state && button.becomeDefault){
				for (var i=0; i<this.buttons.length; i++) {
					if (this.buttons[i].toggleGroup==button.toggleGroup) {
						this.buttons[i].groupDefault = false;
					}
				}
				button.groupDefault = true;
			}
			
			this.fireEvent(eventName, button);			

			/*
			// Necessario per fare in modo che annullaselezioni non rimanga premuto, pur essendo parte di un gruppo di toggle 
			if (button.opCode ==  TolomeoExt.ToloAPIOpCodes.btnAnnullaSelezioni)  {
					this.pressDefault(this.decodeToggleGroup(button.toggleGroup));
					state=false;
					retVal=false;
			}
			 */
		}
		return retVal;
	},

	/**
	 * Method: btnClickHandler
	 * 
	 * Parameters:
	 * button - il pulsante.
	 * e - l'evento.
	 * 
	 * Returns:
	 * {Boolean}
	 */
	btnClickHandler: function (button, e) {
		if (button.handlerBaseName !=null) {
			var eventName = 'on' + button.handlerBaseName + 'PressFn';
			this.fireEvent(eventName, button);
		}

		// Necessario per premere bottone default quando premuto annulla selezioni 
		if (button.opCode ==  TolomeoExt.ToloAPIOpCodes.btnAnnullaSelezioni)  {
			this.pressDefault(this.decodeToggleGroup(button.toggleGroup));
		}

		// Necessario per premere bottone default quando premuto annulla selezioni 
		if (button.opCode ==  TolomeoExt.ToloAPIOpCodes.btnTemporalFilter)  {
			this.temporalFilterWindow.show();
		}
		
		return true;
	},

	/**
	 * Method: btnMeasureMng
	 * 
	 * Parameters:
	 * button - il pulsante.
	 * state - l'evento.
	 */
	btnMeasureMng: function(button, state) {

		var itm = null;

		// Determina quale voce di menù è selezionata
		for (var i= 0; i<button.menu.items.items.length; i++) {
			if (button.menu.items.items[i].checked) itm=button.menu.items.items[i]; 
		}

		if (itm!=null) {
			var eventName = 'onMeasure' + ((state == true) ? 'Activate' : 'Deactivate');
			this.fireEvent(eventName, itm.measureType);
		}

		// tolto perchè va in conflitto con altre funzionalità
		//if (!state) this.pressDefault(this.decodeToggleGroup(button.toggleGroup));

	},

	/**
	 * Method: btnMeasureItemMng
	 * 
	 * Parameters:
	 * button - il pulsante.
	 * checked - indica se il pulsante è premuto o meno.
	 */
	btnMeasureItemMng: function(button, checked) {

		if (checked) {
			switch (button.measureType) {
			case 0:
				this.btnMeasure.setIcon(this.iconBasePath + 'misurapoligono.gif');
				break;
			case 1:
				this.btnMeasure.setIcon(this.iconBasePath + 'misuracerchio.gif');
				break;
			case 2:
				this.btnMeasure.setIcon(this.iconBasePath + 'misuralinea.gif');
				break;
			}	
		}

		if ((checked) && (this.btnMeasure.pressed)) {	
			var eventName = 'onMeasureTypeChange';
			this.fireEvent(eventName, button.measureType);
		}

		if (checked) this.btnMeasure.toggle(true);

	},
	
	
	btnNewToggleHandler: function(button, state) {
		this.btnToggleHandler(button,state);
		if (!state) this.pressDefault(this.decodeToggleGroup(button.toggleGroup));
	},
	
	/**
	 * Method: btnNewItemMng
	 * 
	 * Parameters:
	 * button - il pulsante.
	 * checked - indica se il pulsante è premuto o meno.
	 */
	btnNewItemMng: function(button, checked) {

		if (checked) {											
			if(this.btnNew.pressed) {
				/*
				var eventName = 'onNewTypeChange';
				this.fireEvent(eventName, button);				
				this.btnNew.toggle();
				this.pressDefault(this.decodeToggleGroup(button.toggleGroup));
				*/
				this.fireEvent('onNuovoReleaseFn', this.btnNew);
				this.fireEvent('onNuovoPressFn', button);
				
			}
			this.btnNew.setIcon(button.icon);							
			this.btnNew.newType = button.newType;				
			//this.btnNew.toggle(true);
		}
	},

	/**
	 * Method: pressDefault
	 * 
	 * Parameters:
	 * group - il gruppo.
	 */
	pressDefault: function(group) {
		for (var i=0; i<this.buttons.length; i++) {
			if ((this.buttons[i].toggleGroup) && (this.buttons[i].toggleGroup==this.encodeToggleGroup(group)) && (this.buttons[i].groupDefault) && (this.buttons[i].groupDefault==true) ) {
				this.buttons[i].toggle(true);
			}
		}

		// bottoni.press(bottoni.getDefaultName(group));
		//alert("PressDefault del gruppo "+ group);
	},

	/**
	 * Method: operationEnable
	 * 
	 * Parameters:
	 * opCode - codice operazione.
	 * enabled - indica se l'operazione è abilitata.
	 */
	operationEnable: function(opCode, enabled) {
		var thisPanel = this;
		this.items.each(
				function (item, index, length) {
					if (item.opCode == opCode){
						(thisPanel.paramsJS.layOut.nascondiBottoniInattivi) ? item.setVisible(enabled) : item.setDisabled(!enabled);
						if(opCode == TolomeoExt.ToloAPIOpCodes.btnSnap){							
							if(!enabled && item.pressed){
								item.toggle();
							} else if (enabled && item.pressed){
								item.toggle();
								item.toggle();
							}
						}
					}
				}	
		);
	},

	/**
	 * Method: bindToAPI
	 * 
	 * Parameters:
	 * api - API.
	 */
	bindToAPI: function(api) {
		this.api=api;
		// Eventi API ai quali viene registrato buttonsPanel
		api.on('onOperationEnable', function (opCode) {this.operationEnable(opCode, true);}, this );
		api.on('onOperationDisable', function (opCode) {this.operationEnable(opCode, false);}, this );
		api.on('onOperationPressDefault', function (group) {this.pressDefault(group);}, this );
		api.on('selectedObjectsRemoved', 
			function (removedGeoms,geoms) {
				var geom = geoms.geometries?geoms.geometries[0]:geoms;
				if (this.withLayerList && this.cmbLayerSel.getValue() != geom.codTPN && this.paramsJS.isSelectable(geom.codTPN)){					
					this.cmbLayerSel.setValue(geom.codTPN);
					//this.fireEvent('onSelectLayer', geom.codTPN);
				}
			}, 
			this );
		
		if (this.withLayerList) api.setCurrentSelectLayer(this.cmbLayerSel.getValue());
	},

	//TODO è anche in API, riunificare in quelche modo
	/**
	 * Method: autoIdentifyLayersPresent
	 * 
	 * Returns:
	 * {Boolean}
	 */
	autoIdentifyLayersPresent: function (){

		for(var index=0; index<this.paramsJS.azioniEventi.eventiLayerList.length; index++) {
			var paramJSLayer = this.paramsJS.azioniEventi.eventiLayerList[index];
			if (paramJSLayer.autoIdentifyAllowed==true)  {
				return true;
			}
		}
		return false;
	}, 
	
	/**
	 * Imposta un stato o cambia lo stato di un bottone identificato tramite il suo opCode
	 * 
	 * @param opCode: codice del bottone (vedi toloAPIOpCodes.js)
	 * @param state: lo stato da impostare (opzionale). Se	non impostato o null cambia lo stato corrente
	 * @param supress: stoppa il fire degli eventi innescati dal cambio di stato
	 */
	buttonToggle: function(opCode, state, supress) {
		
		for (var i=0; i<this.buttons.length; i++) {
			if (this.buttons[i].opCode==opCode) {
				this.buttons[i].toggle(state, supress);
			}
		}
		
	},
	
	a: function(data) {
	//	this.cmbLayerSel.lastQuery=null;
		if (this.cmbLayerSel) {
			this.cmbLayerSel.getStore().loadData(data, false);
			this.cmbLayerSel.getStore().filterBy(this.withSearchLayerFilter);
		}
		
	},
	
	/**
	 * Enable/Disable the button having that specific id 
	 * 
	 * @param id: id of the button
	 * @param on: boolean. True to enable button, false to disable
	 */
	enableButton : function(id,on){
		var comp = Ext.getCmp(id);
		if(comp) comp.setDisabled(!on);
	},
			
	/**
	 * Enable(Show)/Disable(Hide) buttons relate to toc 
	 * 
	 * @param tocExist: flag true/false 
	 * @param on: boolean. True to enable button, false to disable
	 */
	switchTocRelatedButtons : function(tocExist,on){
		this.enableButton(this.getId() + 'permalinkBtn',on);
		var comp = Ext.getCmp(this.getId() + 'toolsMenu');
		if(comp && tocExist){
			//var comp = Ext.getCmp(this.getId() + 'toolsMenu');
			if(comp) comp.setVisible(on);			
			this.enableButton(this.getId() + 'exportQgisBtn',on);
		}
	}
		
});
