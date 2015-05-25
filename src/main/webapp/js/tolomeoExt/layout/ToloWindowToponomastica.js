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
 * @class TolomeoExt.ToloWindowToponomastica
 * @extends Ext.Window
 * 
 */
Ext.define('TolomeoExt.ToloWindowToponomastica', {
	extend: 'Ext.Window',
	alias:  'tx_ToloWindowCercaCivico',
	alternateClassName: ['TolomeoExt.layout.ToloWindowToponomastica'],
	
	/** 
	 * @property {String} [cls='clearCSS']
	 * 
	 * 
	 */
	cls: 'clearCSS',
	
	/** 
	 * @property {Object} paramsJS
	 * 
	 * 
	 */
	paramsJS: null,
	
	/** 
	 * @property {Boolean} [suggestWithGeom=false]
	 * 
	 * 
	 */
	suggestWithGeom: false,
	
	/** 
	 * @property {String} TOLOMEOServer
	 * 
	 * 
	 */
	TOLOMEOServer: null,
	
	/** 
	 * @property {String} TOLOMEOContext
	 * 
	 * 
	 */
	TOLOMEOContext: null,
	
	/** 
	 * @property {Object} returnFields
	 * 
	 * 
	 */
	returnFields: null,
	
	/** 
	 * @property {Object} panelSearch
	 * 
	 * 
	 */
	panelSearch: null,
	
	/** 
	 * @property {TolomeoExt.ToloViewerOLPanel} mapPanel
	 * 
	 * 
	 */
	mapPanel: null, 
	
	/** 
	 * @property {Object} viewerConfig
	 * Configurazione che sarà utilizzata per il viewer.
	 * 
	 */
	viewerConfig: null,
	
	/** 
	 * @property {Number} [ente=1]
	 * Parametro di ricerca.
	 * 
	 */
	ente: 1,
	
	/** 
	 * @property {String} [tipoRicerca='civico']
	 * Parametro di ricerca.
	 * 
	 */
	tipoRicerca: 'civico',
	
	/**
	 * @method initComponent
	 * Metodo relativo alla gestione Ext.
	 * 
	 */
	initComponent: function(){
		
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);       
		
		var defaultReturnFields = {idTopo: "idTopo", descTopo: "descTopo"};
		if(this.tipoRicerca == "civico"){
			defaultReturnFields.idStrada = "idStrada";
			defaultReturnFields.codVia6 = "codVia6";
			defaultReturnFields.viaDL = "viaDL";
			defaultReturnFields.numCompleto = "numCompleto";			
		}
		
		// Applico i default
        TolomeoExt.applyIfEmpty(this, {
        	title: 'Cerca indirizzo',
        	layout: 'fit',
			height: 170,
			width: 350,
			returnFields: defaultReturnFields,
            modal: true
		});
        
		this.monitorResize = true;
        				
		this.callParent(arguments);
	
		var cfg = Ext.apply({}, this.viewerConfig);
		
		this.panelSearch = new TolomeoExt.ToloPanelToponomastica(Ext.apply(cfg,{
			title:"",
			paramsJS: this.paramsJS,
			suggestWithGeom: this.suggestWithGeom,
			tipoRicerca: this.tipoRicerca,
			ente: this.ente,
			returnFields: this.returnFields,
			TOLOMEOServer: this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext
		}));
		
		this.relayEvents(this.panelSearch, ['searchCancelled', 'searchDoneOK']);
		
		this.add(this.panelSearch);

		this.panelSearch.on('searchDoneOK', this.close, this);
		this.panelSearch.on('searchCancelled', this.close, this);
		
		this.doLayout();
		this.on('show', function() {this.panelSearch.fldVia.focus();});
		//this.panelSearch.on('resize', this.onPanelResize, this );
    }
    
	/*
	 * @method onPanelResize
	 * 
	 * 
	onPanelResize: function () {
		this.setSize(this.panelSearch.getWidth(), this.panelSearch.getHeight()+20);
    }
   */
});

/**
 * @class TolomeoExt.ToloWindowCercaCivico
 * @extends TolomeoExt.ToloWindowToponomastica
 * 
 */
TolomeoExt.ToloWindowCercaCivico = Ext.extend(TolomeoExt.ToloWindowToponomastica,{
	
	/** 
	 * @property {String} [tipoRicerca='civico']
	 * Parametro di ricerca.
	 * 
	 */
	tipoRicerca : 'civico'
	
});

/**
 * @class TolomeoExt.ToloWindowCercaVia
 * @extends TolomeoExt.ToloWindowToponomastica
 * 
 */
TolomeoExt.ToloWindowCercaVia = Ext.extend(TolomeoExt.ToloWindowToponomastica,{
	
	/** 
	 * @property {String} [tipoRicerca='via']
	 * Parametro di ricerca.
	 * 
	 */
	tipoRicerca : 'via'
	
});