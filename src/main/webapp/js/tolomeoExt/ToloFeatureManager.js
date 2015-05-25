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
 * Plugin per la gestione di richieste e operazioni 
 * che coinvolgono le features.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloFeatureManager', {
	
	extend: 'Ext.util.Observable',
	
	id: "qb_featuremanager",
	
	/**
	 * @cfg {String} TOLOMEOServer
	 * URL di base del contesto di Tolomeo.
	 */
	TOLOMEOServer: null,
	
	/**
	 * @cfg {String} TOLOMEOContext
	 * Contesto di Tolomeo.
	 */
	TOLOMEOContext: null,

	/**
	 * @property {Ext.Data.Store} featureStore
	 * Store delle features ritornate dal server a seguito di una richiesta.
	 */
	featureStore: null,
	
	/**
	 * @cfg {Number} maxFeatures [maxFeatures="10"]
	 * Massimo numero di elementi per pagina.
	 */
	maxFeatures: 10,
	
	/**
	 * @cfg {Number} startIndex [startIndex="0"]
	 * Indice di pagina per richieste paginate.
	 */
	startIndex: 0,
	
	/**
	 * @property {Ext.Data.Proxy} proxy
	 * Proxy Ext per le richieste Ajax cross-domain.
	 */
	proxy: null,
	
	/**
     * Crea un nuovo TolomeoExt.ToloFeatureManager.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor: function(config) {
		this.callParent(arguments);
		
		Ext.apply(this, config);
		
		this.addEvents(
	        /**
			 * @event
			 * Lanciato alla selezione di un nuovo layer dalla form.
			 */
			"layerchange",
			
	        /**
			 * @event
			 * Lanciato se il caricamento delle features fallisce.
			 */
			"loadfeaturesfailure",
			
	        /**
			 * @event
			 * Lanciato quando le features sono state caricate.
			 */
			"loadfeatures",
			
	        /**
			 * @event
			 * Lanciato prima di caricare le features da servizio remoto.
			 */
			"beforeloadfeatures",
			
	        /**
			 * @event
			 * Lanciato per reimpostare i parametri della richiesta.
			 */
			"resetquery",
			
	        /**
			 * @event
			 * Lanciato prima che avvenga la selezione di un nuovo layer dalla form del query builder.
			 */
			"beforelayerchange",
			
	        /**
			 * @event
			 * Lanciato al termine delle operazioni di export.
			 */
			"export",
			
	        /**
			 * @event
			 * Lanciato prima dell'avvio di una operazione di export.
			 */
			"beforedataexport"
		);	
		
		this.on("resetquery", this.resetQuery);
		this.on("export", this.exportPage);
	},
	
	/**
     * Esporta i dati in griglia secondo i formati supportati (SHP, CSV, Spatialite).
     * @param {Object} options Oggetto contenente le opzioni per lo scaricamento dei dati. 
     *
     */
	exportPage: function(options){
        this.fireEvent("beforedataexport");
		
		var params = {
			filter: this.proxy.extraParams.filter,
			codTPN: this.proxy.extraParams.codTPN,
			format: options.format,
			startIndex: options.items == "all" ? -1 :  this.startIndex,
			maxFeatures: options.items == "all" ? -1 :  this.maxFeatures,
			ogcFilterVersion: this.proxy.extraParams.ogcFilterVersion
		};
		
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet',
    		method: 'POST',
    		params: params,
    		waitMsg: 'Export in corso...',
    		success: function(results, store){
    			var result = results[0];
    			if(result){
    				location.href = this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet?filename=' + result.data.Descrizione;
    			}
    		},
    		failure: this.doAjaxFailure(),
    		scope: this
    	};
    	
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
	},
	
	/**
     * Imposta lo store delle features.
     * @param {Ext.Data.Store} store Oggetto rappresentante lo store dei dati. 
     *
     */
	setFeatureStore: function(store){
		this.featureStore = store
		
		this.featureStore.on("load", function(){
			this.fireEvent("loadfeatures");
		}, this);
	},
	
    /**
     * Recupera lo schema degli attributi.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
	getSchema: function(fparams){
        if (!this.schemaCache) {
            this.schemaCache = {};
        }
        
        this.fireEvent("beforelayerchange");
        
        var schema = this.schemaCache[fparams.codTPN];
        if(schema){
			this.fireEvent("layerchange", schema);
        }else{
        	var submitOpt = {
        		url: this.TOLOMEOServer + this.TOLOMEOContext + '/FilterBuilderMetadataServlet',
        		method: 'POST',
        		params: fparams,
        		waitMsg: 'Ricerca in corso...',
        		success: function(results, store){
        			var schema = results;
        			this.schemaCache[fparams.codTPN] = schema;
        			this.fireEvent("layerchange", results);
        		},
        		failure: this.doAjaxFailure,
        		scope: this
        	};
        	
    		new TolomeoExt.ToloCrossAjax().request(submitOpt);
        }        
	},
	
	/**
     * Handler invocato in caso di fallimento della richiesta Ajax.
     * @param {Ext.Data.Store} store Oggetto rappresentante lo store dei dati. 
     *
     */
	doAjaxFailure: function (store) {
		this.fireEvent("loadfeaturesfailure", store);
    },
    
    /**
     * Metodo di caricamento dello store delle features.
     * @param {Object} fparams Oggetto contenente i parametri che saranno usati nella richista. 
     *
     */
    loadFeatures: function(fparams){       	
    	//
    	// Prepare the proxy params
    	//
		this.proxy.extraParams = this.proxy.extraParams || {};
		this.proxy.startParam = "startIndex";
		this.proxy.limitParam = "maxFeatures";
		this.proxy.actionMethods = "POST";
		
    	Ext.apply(this.proxy.extraParams, fparams); 
    	
    	this.fireEvent("beforeloadfeatures",fparams.codTPN);
    	
    	this.featureStore.loadPage(1, {
    	    params:{
    	    	startIndex: this.startIndex,
    	    	maxFeatures: this.maxFeatures
    	    }
    	});
    },
    
	/**
     * Imposta il proxy per le richieste cross-domain. 
     *
     */
    setProxy: function(){
		this.proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/SearchExportServlet');
		var reader = this.proxy.getReader();
		reader.root = "rows";
		reader.totalProperty = "total";
    },
    
    /**
     * Recupera il proxy usato per le richiesta cross-domani. 
     *
     */
    getProxy: function(){
    	return this.proxy;
    },
    
	/**
     * Reimposta i parametri di richiesta per la raccolta delle features risultato della ricerca. 
     *
     */
    resetQuery: function(collapse){
    	if(this.featureStore){
    		this.featureStore.removeAll();
    	}
		
    	this.fireEvent("resetfeaturelayer");
    }
	
});