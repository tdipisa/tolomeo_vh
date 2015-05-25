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
 * @class TolomeoExt.ToloPanelBase
 * @extends Ext.Panel
 * 
 * 
 */
Ext.define('TolomeoExt.ToloPanelBase', {

	extend: 'Ext.Panel',
	
	alias: 'tx_ToloPanelBase',
	
	/** 
	 * @property {Object} paramsJS
	 * 
	 * 
	 */
	paramsJS: null,

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
	 * @property {String} TOLOMEOStaticRoot
	 * 
	 * 
	 */
	TOLOMEOStaticRoot: null,

	/** 
	 * @property {Object} toolbarOpt
	 * Parametri di configurazione per la toolbar 
	 * 
	 */
	toolbarOpt: null,

	/** 
	 * @property {TolomeoExt.ToloButtonPanelExt} toolbar
	 * 
	 * 
	 */
	toolbar: null,
	
	/** 
	 * @property {Object} statusbar
	 * 
	 * 
	 */
	statusbar: null,

	/** 
	 * @property {Object} mapPanel
	 * 
	 * 
	 */
	mapPanel: null,

	/** 
	 * @property {Object} ricercaPanel
	 * 
	 * 
	 */
	ricercaPanel: null,

	/** 
	 * Property: queryBuilderPanel
	 * {} 
	 */
	queryBuilderPanel: null,
	
	/**
	* Property: olsPanel
	* {} 
	*/
	olsPanel: null,
	
	/** 
	 * Property: codeLessPanel
	 * {} 
	 */
	codeLessPanel: null,
	
	/** 
	 * Property: legendaPanel
	 * {} 
	 */
	legendaPanel: null,

	/**
	 * @property {TolomeoExt.ToloStylePanel} stylePanel
	 * Pannello di gestione degli stili 
	 * 
	 */
	stylePanel: null,
	
	/** 
	 * @property {Object} viewerConfig
	 * configurazione che sarà utilizzata per il viewer
	 * 
	 */
	viewerConfig: null,

	/** 
	 * @property {Object} APIConfig
	 * configurazione che sarà utilizzata per il viewer
	 * 
	 */
	APIConfig: null,

	/** 
	 * @property {Object} api
	 * 
	 * 
	 */
	api: null,

	/** 
	 * @property {Object} ricercaPanelOpt
	 * 
	 * 
	 */
	ricercaPanelOpt: null,
	
	/** 
	 * Property: queryBuilderPanelOpt
	 * {}
	 */
	queryBuilderPanelOpt: null,
	
	/** 
	 * Property: featureGridPanelOpt
	 * {}
	 */
	featureGridPanelOpt: null,

	/** 
	 * Property: formCodelessPanelOpt
	 * {}
	 */
	formCodelessPanelOpt: null,

	/** 
	 * @property {Object} legendaPanelOpt
	 * 
	 * 
	 */
	legendaPanelOpt: null,
	
	/** 
	 * Property: olsPanelOpt
	 * {}
	 */
	olsPanelOpt: null,

	/**
	 * @property {Object} stylePanelOpt
	 * Opzioni di configurazione dell'eventuale pannello di gestione degli stili. Se non definito non viene attivata la funzionalità di gestione stili
	 * 
	 */
	stylePanelOpt: null,
	
	
	/** 
	 * @property {Object} mapPanelOpt
	 * 
	 * 
	 */
	mapPanelOpt: null,
	
	/** 
	 * @property {Object} toolsPanelOpt
	 * 
	 * 
	 */
	toolsPanelOpt: null,
	
	/** 
	 * @property {Object} timeMachinePanelOpt
	 * 
	 * 
	 */
	timeMachinePanelOpt: null,
	
	/** 
	 * @property {String} [titoloMappa='Mappa di Prato']
	 * 
	 * 
	 */
	titoloMappa: 'Mappa di Prato',
	
	/** 
	 * @property {String} descrizioneMappa
	 * 
	 * 
	 */
	descrizioneMappa: null,
	
	/** 
	 * @property {Boolean} [stampaReferer=true]
	 * 
	 * 
	 */
	stampaReferer: true,
	
	/** 
	 * @property {String} [urlLogo=""]
	 * 
	 * 
	 */
	urlLogo: "",
	
	/** 
	 * @property {String} [urlLogoSecondario=""]
	 * 
	 * 
	 */
	urlLogoSecondario: "",
	
	/** 
	 * @property {Boolean} withDefaultToolbar
	 * Impostare a false se non si desidera che il pannello base imposti la propria tbar
	 * 
	 */
	withDefaultToolbar: true,
	
	/** 
	 * @property {Boolean} withDefaultStatusbar
	 * Impostare a false se non si desidera avere la statusBar
	 * 
	 */
	withDefaultStatusbar: true,

	/**
	 * @method initComponent
	 * Create a new TolomeoExt.ToloPanelBase
	 *
	 * Returns:
	 * {<TolomeoExt.ToloPanelBase>} un nuovo TolomeoExt.ToloPanelBase.
	 */
	initComponent: function() {
		
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		//this.monitorResize=true;
		
		if (this.toolbarOpt) {
			TolomeoExt.applyIfEmpty(this.toolbarOpt, {
				paramsJS: this.paramsJS, 
				items   : []
			});
			this.toolbar = new TolomeoExt.ToloButtonPanelExt(this.toolbarOpt);
			
			if(this.withDefaultToolbar) {
				this.tbar = this.toolbar;
			}
		}
		
		if(!this.statusbar){
			this.statusbar = new Ext.ux.StatusBar({
	            defaultText: '',
	            statusAlign: 'left',
	            items: []
	        });
	        
	        if(this.withDefaultStatusbar){			
				this.bbar = this.statusbar;
			}
		}		
		
		this.callParent(arguments);
		
		if (this.ricercaPanelOpt) {
    		TolomeoExt.applyIfEmpty(this.ricercaPanelOpt, {
    			title     : 'Trova',
			    autoScroll: 'true',
			    iconCls   : 'iconQuery',
			    paramsJS  : this.paramsJS, 
			    items     : new Array()
    		});
			this.ricercaPanel = new TolomeoExt.ToloQueryPanelExt( this.ricercaPanelOpt );
		}
		
		if (this.paramsJS.isQueryBuilder() && this.queryBuilderPanelOpt) {
			
			var qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
			
			var qbFeatureManager = Ext.create('TolomeoExt.ToloFeatureManager', {
				TOLOMEOServer: this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext
			});
			
    		TolomeoExt.applyIfEmpty(this.queryBuilderPanelOpt, {
    			title     : 'Ricerca avanzata',
			    autoScroll: 'true',
			    iconCls   : 'iconQuery',
			    paramsJS  : this.paramsJS, 
				TOLOMEOServer : this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,
				caseInsensitiveMatch: false,
				qbFeatureManager: qbFeatureManager,
				qbEventManager: qbEventManager,
				
				autoCompleteCfg: {
					url: this.TOLOMEOServer + this.TOLOMEOContext + '/UniqueValueServlet',
					pageSize: 10
				},				
				autoComplete: true,
			    items     : new Array()
				//,ogcFilterVersion : '1.0.0'
    		});
			this.queryBuilderPanel = Ext.create('TolomeoExt.ToloQueryBuilderExt',  this.queryBuilderPanelOpt);
			
    		TolomeoExt.applyIfEmpty(this.featureGridPanelOpt, {
    			title     : 'Griglia dei Risultati',
			    autoScroll: 'true',
				border: false,
			    paramsJS  : this.paramsJS, 
			    qbFeatureManager: qbFeatureManager,
			    qbEventManager: qbEventManager,
			    items     : new Array()
    		});
			this.featureGridPanel = Ext.create('TolomeoExt.ToloFeatureGridPanel',  this.featureGridPanelOpt);
		}
		
		if (this.paramsJS.layOut.ols && this.olsPanelOpt) {
		 		TolomeoExt.applyIfEmpty(this.olsPanelOpt, {
		   			title     : 'Navigazione',
				    autoScroll: 'true',
				    iconCls   : 'iconQuery',
				    paramsJS  : this.paramsJS
		   		});
				this.olsPanel = new TolomeoExt.OLS.ToloOLSPanelExt( this.olsPanelOpt );
		}
		
		// /////////////////////
		// Codeless Panel
		// /////////////////////
		if(this.formCodelessPanelOpt){
    		TolomeoExt.applyIfEmpty(this.formCodelessPanelOpt, {
    			title     : 'Codeless Form',
			    autoScroll: 'true',
			    iconCls   : 'iconCodelss',
			    paramsJS  : this.paramsJS, 
				TOLOMEOServer : this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,
//				cmdToolbar: this.toolbar,
			    items     : new Array()
    		});
			this.codeLessPanel = Ext.create('TolomeoExt.ToloCodeLessPanel',  this.formCodelessPanelOpt);
		}
		
		if (this.legendaPanelOpt) {
			TolomeoExt.applyIfEmpty(this.legendaPanelOpt, {
				title         : 'Legenda interattiva',
				autoScroll    : 'true',
				cls           : 'clearCSS',
				iconCls       : 'iconToc',
				paramsJS      : this.paramsJS,
				TOLOMEOServer : this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,
				TOLOMEOStaticRoot: this.TOLOMEOStaticRoot,
				xtype         : 'tx_toloTreeTOCPanelExt'
				
			});

			this.legendaPanel =  Ext.widget(this.legendaPanelOpt);
		}

		if (this.stylePanelOpt) {
			TolomeoExt.applyIfEmpty(this.stylePanelOpt, {
				closeAction: 'hide',
				width: 450,
				height: 250
			});
			this.stylePanelOpt.closeAction = 'hide';
			
			this.stylePanel = new TolomeoExt.ToloStylePanel(this.stylePanelOpt); 
		}
		
		
		if (this.timeMachinePanelOpt) {
			
			if (this.timeMachinePanelOpt.carouselConfig) {
				
				TolomeoExt.applyIfEmpty(this.timeMachinePanelOpt.carouselConfig, {
					interval: 3,
				    autoPlay: true,
				    showPlayButton: true,
				    pauseOnNavigate: true,
				    freezeOnHover: true,
				    transitionType: 'fade',
				    transitionEasing: 'fadeIn',    
				    navigationOnHover: false    
					
					});
			} else {
				this.timeMachinePanelOpt.carouselConfig = {
						interval: 3,
					    autoPlay: true,
					    showPlayButton: true,
					    pauseOnNavigate: true,
					    freezeOnHover: true,
					    transitionType: 'fade',
					    transitionEasing: 'fadeIn',    
					    navigationOnHover: false    
						
						};
			}
			
    		TolomeoExt.applyIfEmpty(this.timeMachinePanelOpt, {
    			title     : 'Time Machine',
    			paramsJS      : this.paramsJS
    		});
			this.timeMachinePanel = new TolomeoExt.ToloTimeMachinePanel( this.timeMachinePanelOpt );
		}
		
	    var cfg = Ext.apply({}, this.viewerConfig);		
	    cfg.bOnOpenDrawMap = ((this.APIConfig!=null) && (this.APIConfig.openActionsJS!=null)) ? false : (this.viewerConfig!=null) ? this.viewerConfig.bOnOpenDrawMap : true;
		TolomeoExt.applyIfEmpty (cfg, {
	    	region    : 'center',
	        xtype     : "tx_toloviewerOLPanel",
		    "paramsJS": this.paramsJS
	    });
		
		this.mapPanel = new TolomeoExt.ToloViewerOLPanel(cfg);	 		
		
    },
    
    /**
     * @method afterRender
     * @private
     * Metodo privato invocato dopo che il pannello è stato renderizzato.
     * 
     */
    afterRender: function() {	
    	this.callParent(arguments);
    	if (this.api==null) {
	    	var cfg = Ext.apply({}, this.APIConfig);
	    	this.api = Ext.create('TolomeoExt.ToloMapAPIExt', Ext.apply(cfg,{
				"paramsJS"        : this.paramsJS,
				TOLOMEOServer	  : this.TOLOMEOServer,
				TOLOMEOContext	  : this.TOLOMEOContext,
				TOLOMEOStaticRoot : this.TOLOMEOStaticRoot,
				viewer            : this.mapPanel,
				buttonsPanel      : this.toolbar,
				TOCPanel          : this.legendaPanel,
				stylePanel		  : this.stylePanel,
				queryPanel        : this.ricercaPanel,
				olsPanel          : this.olsPanel,
				queryBuilderPanel : this.queryBuilderPanel,
				featureGridPanel  : this.featureGridPanel,
				codeLessPanel     : this.codeLessPanel,
				titoloMappa       : this.titoloMappa,
				descrizioneMappa  : this.descrizioneMappa,
				urlLogo           : this.urlLogo,
				urlLogoSecondario : this.urlLogoSecondario,
				stampaReferer     : this.stampaReferer,
				statusPanel       : this.statusbar
			}));		    	
		}
    }		
});

