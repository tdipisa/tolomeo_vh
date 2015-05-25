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

Ext.ns('TolomeoExt.data');

/**
 * Un data store da usare come tool di autocompletamento paginato.
 * Non sono richiesti parametri di configurazione per il costruttore, il proxy
 * si appoggia alle canoniche funzionalità di TolomeoExt
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.data.ToloUniqueValuesStore', {
	
	extend: 'Ext.data.Store',
	
	alias: 'widget.tolomeo_uniquestore',

	/**
     * Crea un nuovo TolomeoExt.data.ToloUniqueValuesStore.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor: function(config) {
        config.baseParams = Ext.apply(config.baseParams || {}, {});

        this.TOLOMEOServer =  config.TOLOMEOServer;
        this.TOLOMEOContext = config.TOLOMEOContext;
        
		var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/UniqueValueServlet');
		var reader = proxy.getReader();
		reader.root = "rows";
		reader.totalProperty = "total";
		
        TolomeoExt.data.ToloUniqueValuesStore.superclass.constructor.call(this,
            Ext.applyIf(config, {
//                sortInfo: {
//                    field: 'value',
//                    direction: 'ASC'
//                },
                proxy: proxy
            })
        );
    },
	 
	/**
     * Imposta i parametri da passare al proxy per il caricamento dei dati.
     * @param {Object} params Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    setParams: function(params) {
        this.baseParams = Ext.apply(this.baseParams, params);
    },
    
    /**
     * Carica i dati nello store.
     * @param {Object} options Oggetto contenente le opzioni di caricamento dei dati.
     */
    load: function(options) {
    	var params = options.params;
        if (!params.inputs) {
            return;
        }
        
        var filter;
        if(params.query) {
            var queryValue = params.query;
            if(queryValue.indexOf('*') === -1) {
                queryValue = '*' + queryValue + '*';
            }
            
            filter = new OpenLayers.Filter.Comparison({ 
                type: OpenLayers.Filter.Comparison.LIKE, 
                property: params.inputs.fieldName, 
                value: queryValue,
                matchCase: false                
            });
            
            var node = new OpenLayers.Format.Filter({version: "1.1.0"}).write(filter);
            filter = new OpenLayers.Format.XML().write(node);
        }
        
		var fparams = {
			filter: filter,
			codTPN: params.inputs.featureTypeName,
			format: "ext",
			ogcFilterVersion: "1.1.0",
			attributeName: params.inputs.fieldName
		};
		
		this.proxy.extraParams = this.proxy.extraParams || {};
		this.proxy.startParam = "startIndex";
		this.proxy.limitParam = "maxFeatures";
		this.proxy.actionMethods = "POST";
		
    	Ext.apply(this.proxy.extraParams, fparams); 
		
        if (options) {
            this.baseParams = Ext.apply(this.baseParams, options.params);
        }
        
        this.superclass.load.call(this, options);
    } 
    
});
