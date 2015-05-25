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
 * @class TolomeoExt.ToloPanelIntra
 * @extends TolomeoExt.ToloPanelBase
 * Layout per applicazioni intranet: toolbar nord, mappa center, pannello est (accordion ricerche e legenda) e pannello gestionale ovest.
 * 
 * @author Mattia Gennari
 */
Ext.define('TolomeoExt.ToloPanelIntra', {
	extend: 'TolomeoExt.ToloPanelBase',
	alias:  'tx_ToloPanelIntra',
	alternateClassName: ['TolomeoExt.layout.ToloPanelIntra'],
	
	/** 
	 * @property {Boolean} [withDataPanel=true]
	 * Indica se è presente o meno il data panel (iframe pannello).
	 * 
	 */
	withDataPanel: true,

	/** 
	 * @property {Boolean} [withToolsPanel=true]
	 * Indica se è presente o meno il tools panel (pannello strumenti).
	 * 
	 */
	withToolsPanel: true,
	
	/** 
	 * @property {Boolean} [collapsedToolsPanel=false]
	 * 
	 * 
	 */
	collapsedToolsPanel: false,
	
	/** 
	 * @property {Boolean} [collapsedDataPanel=true]
	 * 
	 * 
	 */
	collapsedDataPanel: true,
	
	/** 
	 * @property {Boolean} [withLegendaPanel=true]
	 * Indica se è presente o meno la legenda.
	 * 
	 */
	withLegendaPanel: true,
	
 	/** 
	* Property: withOLSPanel
	* {Boolean} Indica se è presente o meno il pannello OLS.
	* 
	*/
	withOLSPanel: true,
	
	/** 
	 * @property {Boolean} [withStylePanel=true]
	 * Indica se è presente o meno la finestra di gestione stili
	 * 
	 */
	withStylePanel: true,
	
	/** 
	 * @property {Boolean} withQueryPanel
	 * 
	 * 
	 */
	withQueryPanel : true,
	
	/** 
	 * Property: withQueryBuilderPanel
	 * {Boolean}
	 * 
	 */
	withQueryBuilderPanel: true,

	/** 
	 * Property: withCodelessPanel
	 * {Boolean} 
	 * 
	 */
	withCodelessPanel : false,

	/**
	 * @property {String} toolsPanelType
	 * Tipo di tools panel. Supportati accordion (default) e tabpanel 
	 * 
	 */
	toolsPanelType: null,
	
	/**
	 * @property {String} toolsPanelPosition
	 * Posizione del toolspanel. consentiti 'west', 'east' (default), 'north', 'south'
	 * 
	 */
	toolsPanelPosition: null,
	
	/**
	 * @property {String} dataPanelType
	 * Tipo di tools panel. Supportati panel (default), window, intoolspanel
	 * 
	 */
	dataPanelType: null,
	
	/**
	 * @property {Object} activePanel
	 * 
	 * 
	 */
	activePanel: null,
	
	/**
	 * @property {Object} extraPanels
	 * Permette di impostare pannelli aggiuntivi. Esempio di utilizzo <br/>
	extraPanels: { position: 'first',   	// valori consentiti first, last  
				   panels: [{				// In questo array può essere inserito qualsiasi oggetto grafico extjs (pannelli, tabpanel etc)
								text: "Pannello di prova",
								title: "titolo1",
								iconCls: 'iconToc',
								html: "<b>contenuto</b>"
							},{
								text: "Pannello di prova",
								title: "titolo2",
								iconCls: 'iconToc',
								html: "<b>contenuto</b>"
							}]},
	 *
	 */
	extraPanels: null,
	
	/**
	 * 
	 */
	iframe: null,
	
	
	/** 
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function(){

		this.mapPanelOpt = {};
		this.layout = 'border';
		
		if (this.toolbarOpt==null) {
			this.toolbarOpt = {};
		}
		
		if (this.withToolsPanel) {
			if (this.withLegendaPanel && this.legendaPanelOpt==null) this.legendaPanelOpt = {};
			if (this.withQueryPanel   && this.ricercaPanelOpt==null) this.ricercaPanelOpt = {};
			if (this.withOLSPanel     && this.olsPanelOpt==null)     this.olsPanelOpt     = {};
			if (this.withQueryBuilderPanel){
				this.queryBuilderPanelOpt = this.queryBuilderPanelOpt || {};
				this.featureGridPanelOpt = this.featureGridPanelOpt || {};
			}
			
		}
		
		
		if(this.withCodelessPanel){
			this.formCodelessPanelOpt = this.formCodelessPanelOpt || {};
		}
		
		if (this.withStylePanel) {
			if (this.stylePanelOpt==null) this.stylePanelOpt={};
		}
		
		this.callParent(arguments);
		
		this.collapsedDataPanel = (this.collapsedDataPanel && this.paramsJS.azioniApertura.pannelloChiuso);
		
		// Pannello strumenti in cui inserisco Ricerche e Legenda
		if (this.withToolsPanel) {
			//var items = (this.withLegendaPanel) ? [this.ricercaPanel, this.legendaPanel] : [this.ricercaPanel];
			
			var items = [this.ricercaPanel]
			if (this.withQueryBuilderPanel) items.push(this.queryBuilderPanel);
			if (this.withOLSPanel && this.olsPanel) {
				items.push(this.olsPanel);
			}
			if (this.withLegendaPanel)      items.push(this.legendaPanel);
			
			if (this.extraPanels) {
				var p = this.extraPanels.position ? this.extraPanels.position.toLowerCase() : null;
				if (p==null || p=='first') this.extraPanels.panels.reverse();	
				for (var i=0; i<this.extraPanels.panels.length; i++) {
					if (this.extraPanels.position) {
						
						if (p=="first") {
							items.unshift(this.extraPanels.panels[i]);	
						} else {
							if (p=="last") {
								items.push(this.extraPanels.panels[i]);	
							} else {
								items.unshift(this.extraPanels.panels[i]);		
							}	
						}
					} else {
						items.unshift(this.extraPanels.panels[i]);
					}
				}
			}
			
			var reg = this.toolsPanelPosition ? this.toolsPanelPosition : 'east';
			if (this.toolsPanelType=='tabpanel') {
				
				this.toolsPanelOpt = this.toolsPanelOpt || {}; 
				
				TolomeoExt.applyIfEmpty(this.toolsPanelOpt, {
					title: 'Strumenti',
					width: 300,
					minWidth: 300,
					maxWidth: 700,
					split: true,
					collapsible: true
				});
				
				Ext.apply(this.toolsPanelOpt, {
					region: reg,
					activeTab: this.activePanel ? this.activePanel : undefined,
					collapsed: this.collapsedToolsPanel,
					layoutConfig:{
			            animate: true
			        },
					items: items
				});
				
				this.toolsPanel = Ext.create('Ext.tab.Panel', this.toolsPanelOpt);
			} else {
				
				if (this.activePanel) {
					for (var i=0; i<items.length; i++) {
						items[i].collapsed = (i==this.activePanel) ? false : true;	
					}
				}
				
				this.toolsPanelOpt = this.toolsPanelOpt || {}; 
				
				TolomeoExt.applyIfEmpty(this.toolsPanelOpt, {
					title: 'Strumenti',
					width: 300,
					minWidth: 300,
					maxWidth: 700,
					split: true,
					collapsible: true
				});
				
				Ext.apply(this.toolsPanelOpt, {
					region:reg,
					layout:'accordion',
					animCollapse: false,    // NB. Deve essere false per evitare ricaricamento iframe
					collapsed: this.collapsedToolsPanel,
					layoutConfig:{
			            animate: true
			        },
					items: items
				});
				
				this.toolsPanel = Ext.create('Ext.Panel', this.toolsPanelOpt);
			}
			this.add(this.toolsPanel);
			
			if (this.withQueryBuilderPanel){
				// /////////////////////////
				// Feature Grid Panel
				// /////////////////////////
			    var fgItems = [this.featureGridPanel];
				
				var fgConfig = {
					region: 'south',
					layout: 'fit',
					height: 300,
					minHeight: 200,
					maxHeight: 400,
					collapsible: true,
					collapsed: true,
					resizable: true,
					items: fgItems
				}
				
				this.featureGridContainer = Ext.create('Ext.Panel', fgConfig);
				this.add(this.featureGridContainer);
			}
		}
			
		// Pannello applicazione
		if (this.withDataPanel==true) {			 
			var mapPanel = this.mapPanel;
			var frameName = 'pannello';
			
			this.iframe = Ext.create('TolomeoExt.ToloIFrame', {
				frameName: frameName,
				url: ''
			});
			
			if (this.dataPanelType=="window") {
				// FINESTRA FLOTTANTE
				this.dataPanel = Ext.create('Ext.Window', {
											title: "Informazioni",
											layout: 'fit',
											height: 400,
											width: 500,
										//	style : 'background: rgba(0, 0, 0, 0.5);',
										//	bodyStyle : 'opacity: 0.2',
										//	resizeHandles: 'e w ',
										/*	tools:[{
											    type:'refresh',
											    tooltip: 'Refresh form Data',
											    // hidden:true,
											    handler: function(event, toolEl, panelHeader) {
											        // refresh logic
											    }
											},
											{
											    type:'help',
											    tooltip: 'Get Help',
											    callback: function(panel, tool, event) {
											        // show help here
											    }
											}],*/
											maximizable: true,
											minimizable: true,
											closeAction: 'hide',
											cls: 'clearCSS', 
											tbar: ['->',{
												text: 'Stampa',
												iconCls: 'iconPrint',
												tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
									            handler: function(){
									            	top.frames[frameName].focus();
													top.frames[frameName].print();
												}, scope: this
											}],
											items: [this.iframe]});
				
				if (this.withCodelessPanel && this.codeLessPanel) {
					this.dataPanel.add(this.codeLessPanel);
				}
				
			} else {
				if (this.dataPanelType=="intoolspanel") {
					this.dataPanel = Ext.create('Ext.Panel', {
											title: "Informazioni",
											layout: 'fit',
											//height: 400,
											//width: 500,
											//maximizable: true,
											//minimizable: true,
											//closeAction: 'hide',
											tbar: ['->',{
												text: 'Stampa',
												iconCls: 'iconPrint',
												tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
									            handler: function(){
									            	top.frames[frameName].focus();
													top.frames[frameName].print();
												}, scope: this
											}],
											items: [this.iframe]});
					if (this.withCodelessPanel && this.codeLessPanel) {
						this.dataPanel.add(this.codeLessPanel);
					}
					this.toolsPanel.add(this.dataPanel);
				} else {
					// dataPanelType non definito default a westPanel	
					this.dataPanel = Ext.create('Ext.Panel', {
						//id: 'dataPanel', //id necessario per fare l'expnad del pannello laterale
						title: 'Gestione',
						region: 'west',
						layout: 'fit',
						split: true,
						collapsible: true,
						animCollapse: false,    // NB. Deve essere false per evitare ricaricamento iframe
						collapsed: this.collapsedDataPanel,
						width: 350,
						minWidth: 350,
						iconCls: 'iconPannello',
						floatable : false,	// NB. Deve essere false per evitare ricaricamento iframe
						maximize : function(){
							//var region = this.ownerCt.layout[this.region];
							if(!this.maximized){
				            	this.oldSize = this.getSize();
							}
				            var newWidth = this.getSize().width + mapPanel.getSize().width;
				            this.setWidth(newWidth);
				            this.tools['maximize'].setVisible(false);
				            this.tools['restore'].setVisible(true);
				            this.maximized = true;
						},
						
						restore : function(){
							this.setWidth(this.oldSize.width);
				            this.tools['maximize'].setVisible(true);
				            this.tools['restore'].setVisible(false);
				            this.maximized = false;
						},
						
						tools: [{
							id: 'restore',
							qtip: 'Riduci pannello',
							hidden:true,
							visible: false,
							callback: function(panel, tool, event) {
								panel.restore();
							}
						},{
							id: 'maximize',
							qtip: 'Espandi pannello',			
						
							callback: function(panel, tool, event) {
								panel.maximize();				
							}									
						}],
			
						tbar: ['->',{
							text: 'Stampa',
							iconCls: 'iconPrint',
							tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
				            handler: function(){
				            	top.frames[frameName].focus();
								top.frames[frameName].print();
							}, scope: this
						}],
						items: [this.iframe]
					});
					
					if (this.withCodelessPanel && this.codeLessPanel) {
						this.dataPanel.add(this.codeLessPanel);
					}
				
					if(this.withToolsPanel){
						this.toolsPanel.on('beforeexpand',
							function(){
								if(this.dataPanel.maximized){
									this.dataPanel.restore();
									this.mapPanel.syncSize();
									this.toolsPanel.on('expand',function(){this.dataPanel.maximize();this.mapPanel.syncSize();},this,{single:true});
								}
							},this);
		
						this.toolsPanel.on('collapse',function(){if(this.maximized)this.maximize();},this.dataPanel);
					}
					
					this.on('resize',
								function(){if(this.dataPanel.maximized){this.restoreDataPanel();this.maximizeDataPanel();}else{this.restoreDataPanel();}},
								this);
					
					this.add(this.dataPanel);
				}
			}
			
		}
		
		this.add(this.mapPanel);
	},

    /**
     * @method beforeOpenUrl
     * 
     * 
     * @param {String} url
     * 
     * 
     * @param {String} target
     * 
     * 
     */
	beforeOpenUrl: function(url, target) {
		
		if (target=='pannello' && url!='about:blank') {
			if (this.withCodelessPanel && this.codeLessPanel) this.codeLessPanel.hide();
			this.iframe.show();
			this.showDataPanel();
		}
		
	},
	
	showDataPanel: function() {
		
		if (this.dataPanelType=="window") {
			// FINESTRA FLOTTANTE
			this.dataPanel.show();
		} else if (this.dataPanelType=="intoolspanel") {
			if (this.toolsPanelType=='tabpanel') {
				this.toolsPanel.setActiveTab(this.dataPanel);		
			} else {
				this.dataPanel.expand(false);					
			}
		} else if (this.dataPanel.getCollapsed()!=false) {
			this.dataPanel.expand(false);
		}
		
	},
	
	beforeCodelessPanelShow: function(store) {
		this.codeLessPanel.show();
		this.iframe.hide();
		this.showDataPanel();
	},

    /**
     * @method afterRender
     * @private
     * Metodo privato invocato dopo che il pannello è stato renderizzato.
     * 
     */
	afterRender: function() {
	
		this.callParent(arguments);
		
		if (this.withDataPanel==true) {
			this.api.on("beforeOpenUrl", this.beforeOpenUrl, this);
			if(this.codeLessPanel) {
				this.codeLessPanel.codelessManager.on("beforeloaddata", this.beforeCodelessPanelShow, this);
			}
		}
		
		var thisToolsPanel = this.toolsPanel;
		if (this.legendaPanel) {
			this.legendaPanel.showHandler = function() { thisToolsPanel.expand(true);   };
			this.legendaPanel.hideHandler = function() { thisToolsPanel.collapse(true); };
		}
		if (this.ricercaPanel) {
			this.ricercaPanel.showHandler = function() { thisToolsPanel.expand(true);   };
			this.ricercaPanel.hideHandler = function() { thisToolsPanel.collapse(true); };
		}
		if (this.olsPanel) {
			this.olsPanel.showHandler = function() { thisToolsPanel.expand(true);   };
			this.olsPanel.hideHandler = function() { thisToolsPanel.collapse(true); };
		}

	},
	
	  /**
     * @method maximizeDataPanel
     * Massimizza in larghezza il pannello dei dati.
     * 
     */
	maximizeDataPanel : function(){
		if(!this.withDataPanel) return;		
		if(this.dataPanel.collapsed) {
			this.dataPanel.on('expand',this.dataPanel.maximize,this.dataPanel,{single:true});
			this.expandDataPanel(false);
		} else {
			this.dataPanel.maximize();
		}		dataPanel
	},
	
	  /**
     * @method restoreDataPanel
     * Riporta il pannello alla dimensione che aveva prima di essere massimizzato.
     * 
     */
	restoreDataPanel : function(){
		if(!this.withDataPanel) return;		
		if(this.dataPanel.maximized) {
			this.dataPanel.restore();
		}		
	},
	
	  /**
     * @method collapseDataPanel
     * Collassa il pannello dei dati.
     * 
     * @param {Boolean} animate
     * 
     *  
     */
	collapseDataPanel : function(animate){
		if(!this.withDataPanel) return;
		this.dataPanel.collapse(animate);
	},
	
	  /**
     * @method expandDataPanel
     * Espande il pannello dei dati.
     * 
     * @param {Boolean} animate
     * 
     *  
     */
	expandDataPanel : function(animate){
		if(!this.withDataPanel) return;
		this.dataPanel.expand(animate);
	}
	
	
	
});
 