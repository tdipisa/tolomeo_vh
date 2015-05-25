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
 * @class TolomeoExt.ToloPanelIntraTab
 * @extends TolomeoExt.ToloPanelBase
 * Layout per applicazioni intranet: toolbar nord, mappa center, pannello est (accordion ricerche e legenda) e pannello gestionale ovest.
 * 
 * @author Nieri Federico
 */
Ext.define('TolomeoExt.ToloPanelIntraTab', {

	extend: 'TolomeoExt.ToloPanelBase',
	
	alias:  'tx_ToloPanelIntraTab',
	alternateClassName: ['TolomeoExt.layout.ToloPanelIntraTab'],
	
	/** 
	 * @property {Boolean} withDataPanel
	 * Indica se è presente o meno il data panel (iframe pannello).
	 * 
	 */
	withDataPanel: true,

	/** 
	 * @property {Boolean} withToolsPanel
	 * Indica se è presente o meno il tools panel (pannello strumenti).
	 * 
	 */
	withToolsPanel: true,
	
	/** 
	 * @property {Boolean} collapsedToolsPanel
	 * 
	 * 
	 */
	collapsedToolsPanel: false,
	
	/** 
	 * @property {Boolean} collapsedDataPanel
	 * 
	 * 
	 */
	collapsedDataPanel: true,
	
	/** 
	 * @property {Boolean} withLegendaPanel
	 * Indica se è presente o meno la legenda.
	 * 
	 */
	withLegendaPanel: true,
	
	/** 
	 * @property {Boolean} withQueryPanel
	 * 
	 * 
	 */
	withQueryPanel : true,
	
	/** 
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function(){

		this.mapPanelOpt = {};
		this.layout = 'border';
		this.monitorResize = true;
		
		if (this.toolbarOpt==null) {
			this.toolbarOpt = {};
		}
		
		if (this.withToolsPanel) {
			if (this.withLegendaPanel && this.legendaPanelOpt==null) this.legendaPanelOpt = {};
			if (this.withQueryPanel   && this.ricercaPanelOpt==null) this.ricercaPanelOpt = {};
		}
		
		this.withDefaultToolbar = false;
		this.withDefaultStatusbar = false;
		
		this.callParent(arguments);
		
		var geoPanelCfg = {
			layout: 'border',
			title: 'Cartografia',
			iconCls: 'iconMappa'
		}
		
		if (this.toolbar) {		
			geoPanelCfg.tbar = this.toolbar;
		}
		
		if (this.statusbar) {		
			geoPanelCfg.bbar = this.statusbar;
		}
		
		this.tabPanel = Ext.create('Ext.TabPanel', {
			region:'center',
			activeTab: 0,
			deferredRender : false,
			layoutOnTabChange : true
		});
		
		this.geoPanel = Ext.create('Ext.Panel',geoPanelCfg);
		this.geoPanel.add(this.mapPanel);
		
		// Pannello strumenti in cui inserisco Ricerche e Legenda
		if (this.withToolsPanel) {
			
			var items = (this.withLegendaPanel) ? [this.ricercaPanel, this.legendaPanel] : [this.ricercaPanel];
			
			this.toolsPanel = Ext.create('Ext.Panel', {
				title: 'Strumenti',
				monitorResize: true,
				region:'east',
				layout:'accordion',
				width: 270,
				minSize: 270,
				maxSize: 400,
				split: true,
				collapsible: true,
				collapsed: this.collapsedToolsPanel,
				layoutConfig:{
		            animate: true
		        },
				items: items
			});
			this.geoPanel.add(this.toolsPanel);
		}
		
		this.tabPanel.add(this.geoPanel);		
			
		// Pannello applicazione
		if (this.withDataPanel==true) {
			this.dataPanel = Ext.create('Ext.Panel', {
				id: 'dataPanel', //id necessario per fare l'expnad del pannello laterale
				title: 'Gestionale',
				layout: 'fit',
				iconCls: 'iconPannello',
				floatable : false,		
					
				tbar: ['->',{
					text: 'Stampa',
					iconCls: 'iconPrint',
					tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
		            handler: function(){
		            	top.iframe-pannello.focus();
						top.iframe-pannello.print();
					}, scope: this
				}],
				items: [{
					xtype: 'tx_toloIFrame',
					iFrameName: 'pannello', 
					url: ''
				}]

			});
						
			this.tabPanel.add(this.dataPanel);			
		}
			
		this.add(this.tabPanel);
	},

    /**
     * @method beforeOpenUrl
     * 
     * 
     * @param {String} url
     * 
     * 
     * @param {Object} target
     * 
     * 
     */
	beforeOpenUrl: function(url, target) {
		if (url!='about:blank')	this.tabPanel.setActiveTab(this.dataPanel);		
	},
	
    /**
     * @method afterRender
     * Metodo privato invocato dopo che il pannello è stato renderizzato.
     * 
     */
	afterRender: function() {				
				
		this.callParent(arguments);
		
		if (this.withDataPanel==true) {
			this.api.on("beforeOpenUrl", this.beforeOpenUrl, this);
		}
		
		var thisToolsPanel = this.toolsPanel;
		if (this.legendaPanel) {
			this.legendaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.legendaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}
		if (this.ricercaPanel) {
			this.ricercaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.ricercaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}
				
	},
	
	/**
     * @method switchToDataPanel
     * Rende attivo il pannello dei dati.
     * 
     * @param {Boolean} animate
     * 
     * 
     */
	switchToDataPanel : function(animate){
		this.tabPanel.setActiveTab(this.dataPanel);
	},
	
	  /**
     * @method switchToGeoPanel
     * Rende attivo il pannello della cartografia.
     * 
     * @param {Boolean} animate
     * 
     * 
     */
	switchToGeoPanel : function(animate){
		this.tabPanel.setActiveTab(this.geoPanel);
	}	
	
});
