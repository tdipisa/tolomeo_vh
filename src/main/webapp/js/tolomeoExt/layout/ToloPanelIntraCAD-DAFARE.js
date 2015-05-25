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

Ext.namespace("TolomeoExt");

/**
 * Class: TolomeoExt.ToloPanelIntraCAD
 * Layout per applicazioni intranet: toolbar nord, mappa center, pannello est (accordion ricerche e legenda) e pannello gestionale ovest.
 * 
 * Inherits from:
 *  - <TolomeoExt.ToloPanelBase>
 * 
 * Author: 
 * Mattia Gennari
 *
 */
TolomeoExt.ToloPanelIntraCAD = Ext.extend(TolomeoExt.ToloPanelBase,{

	/** 
	 * Property: withDataPanel
	 * {Boolean} Indica se è presente o meno il data panel (iframe pannello).
	 * 
	 */
	withDataPanel: true,

	/** 
	 * Property: withToolsPanel
	 * {Boolean} Indica se è presente o meno il tools panel (pannello strumenti).
	 * 
	 */
	withToolsPanel: true,
	
	/** 
	 * Property: collapsedToolsPanel
	 * {Boolean} 
	 * 
	 */
	collapsedToolsPanel: false,
	
	/** 
	 * Property: collapsedDataPanel
	 * {Boolean} 
	 * 
	 */
	collapsedDataPanel: true,
	
	/** 
	 * Property: withLegendaPanel
	 * {Boolean} Indica se è presente o meno la legenda.
	 * 
	 */
	withLegendaPanel: true,
	
	/** 
	 * Property: withQueryPanel
	 * {Boolean} 
	 * 
	 */
	withQueryPanel : true,
	
	/** 
	 * Method: initComponent
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
			if (this.withLegendaPanel) this.legendaPanelOpt = {};
			if (this.withQueryPanel)   this.ricercaPanelOpt = {};
		}
		
		TolomeoExt.ToloPanelIntraCAD.superclass.initComponent.call(this);
		
		// Pannello strumenti in cui inserisco Ricerche e Legenda
		if (this.withToolsPanel) {
			
			var items = (this.withLegendaPanel) ? [this.ricercaPanel, this.legendaPanel] : [this.ricercaPanel];
			
			this.toolsPanel = new Ext.Panel( {
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
			this.add(this.toolsPanel);
		}
		
		var iframeExt = Ext.extend(Ext.BoxComponent, {
		     onRender : function(ct, position){
		          this.el = ct.createChild({tag: 'iframe', id: 'iframe-' + this.id, name: this.name, frameBorder: 0, src: this.url});
		     }
		});
			
		// Pannello applicazione
		if (this.withDataPanel==true) {
			this.dataPanel = new Ext.Panel( {
				id: 'dataPanel', //id necessario per fare l'expnad del pannello laterale
				title: 'Gestione',
				region: 'west',
				layout: 'fit',
				split: true,
				collapsible: true,
				collapsed: this.collapsedDataPanel,
				width: 350,
				minWidth: 350,
				iconCls: 'iconPannello',
				tbar: ['->',{
					text: 'Stampa',
					iconCls: 'iconPrint',
					tooltip: {text: 'Stampa il solo contenuto del pannello', title: 'Stampa'},
		            handler: function(){
						top.iframe-pannello.print();
					}, scope: this
				}/*,{
					text: 'Espandi',
					icon: '/commonintra2-0/img/ic-open.gif',
					tooltip: {text: 'Espande il pannello a tutta larghezza', title: 'Espandi pannello'},
		            handler: function(){
		            	this.fireEvent('resize', this, 500, this.dataPanel.getHeight());

						//this.dataPanel.setWidth(500);
						this.dataPanel.syncSize();
						this.dataPanel.doLayout();
						
					}, scope: this
				}*/],
				items: [new iframeExt({id: 'pannello', name: 'pannello', url: ''})]
			});
			this.add(this.dataPanel);
		}
		this.add(this.mapPanel);
	},

    /**
     * Method: afterRender
     * Metodo privato invocato dopo che il pannello è stato renderizzato.
     * 
     */
	afterRender: function() {
	
		TolomeoExt.ToloPanelIntraCAD.superclass.afterRender.apply(this, arguments);
	
		var thisToolsPanel = this.toolsPanel;
		if (this.legendaPanel) {
			this.legendaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.legendaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}
		if (this.ricercaPanel) {
			this.ricercaPanel.showHandler = function() { thisToolsPanel.expand(true);  };
			this.ricercaPanel.hideHandler = function() { thisToolsPanel.collapse(true);};
		}
	}
});

///** api: xtype = gx_mappanel */
Ext.reg('tx_ToloPanelIntraCAD',TolomeoExt.ToloPanelIntraCAD); 