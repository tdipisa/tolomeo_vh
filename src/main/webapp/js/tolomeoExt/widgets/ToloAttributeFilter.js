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

Ext.ns('TolomeoExt.widgets');

/**
 * Crea il pannello contenitore per il filtro degli attributi.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloAttributeFilter', {

	extend: 'Ext.Panel',
	
	padding: '0 5 0 5',
	
	/**
     * @cfg {Boolean} caseInsensitiveMatch [caseInsensitiveMatch="false"]
	 * Il filtro di comparazione per i campi di tipo stringa deve essere case insensitive ?
     */
	caseInsensitiveMatch: false,
    
	/**
     * @cfg {Object} autoCompleteCfg [autoCompleteCfg="{}"]
	 * Stabilisce la configurazione da usare per la funzionalità di autocompletamento.
	 *
	 * @example
	 * autoCompleteCfg: {
	 *  	url: 'http://localhost:8080/tolomeobinj/UniqueValueServlet',
	 *		pageSize: 10
	 * }
     */
	autoCompleteCfg: {},
	
	/**
     * @cfg {Boolean} autoComplete [autoComplete="false"]
	 * Abilita la funzionalità di autocompletamento per i campi stringa.
     */
	autoComplete: false,
	
	filterBuilderStore: null,

	/**
     * Inizializza un nuovo TolomeoExt.widgets.ToloAttributeFilter.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){				
		this.border = 0;
		
		this.attributeFieldSet = Ext.create('Ext.form.FieldSet', {
			title: 'Filtro per attributo',
			//anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			collapsed : true,
			checkboxToggle: true
		});
		
		this.items = [this.attributeFieldSet];
        
		this.callParent();
    },
    
    getGeomFieldName: function() {
    	var fields = this.filterBuilderStore.model.getFields();
    	for (var i=0; i<fields.length; i++){
    		var field = fields[i];
    		if (field.name=="geomFieldName"){
    			geomFieldName = field.mapping;
    			break;
    		}
    	}
    	return this.filterBuilderStore.getAt(0).get("geomFieldName");
    },
    
	/**
     * Aggiunge alla form un nuovo nuovo costruttore per il filtro.
     * @param {Array} records corrispondenti allo schema della FeatureType da gestire.
     */
    addFilterBuilder: function(results){
    	
    	var schema = results;
    	this.filterBuilderStore = Ext.create('Ext.data.Store', {
   		    fields: [{
   		    	name: 'name',
   		    	mapping: 'name'
   		    },{
   		    	name: 'type', 
   		    	mapping: 'type'
   		    },{
   		    	name: 'restriction', 
   		    	mapping: 'restriction'
   		    },{
   		    	name: 'regex', 
   		    	mapping: 'regex'
   		    },{
   		    	name: 'dbname', 
   		    	mapping: 'dbname'
   		    },{
   		    	name: 'codTPN', 
   		    	mapping: 'codTPN'
   		    },{
   		    	name: 'geomFieldName', 
   		    	mapping: 'geomFieldName'
   		    }],
   		    data: schema
   		});
    	
		this.filterBuilder = new TolomeoExt.widgets.ToloFilterBuilder({
			 caseInsensitiveMatch: this.caseInsensitiveMatch,
			 autoCompleteCfg: this.autoCompleteCfg,
			 autoComplete: this.autoComplete,
			 TOLOMEOServer: this.TOLOMEOServer,
			 TOLOMEOContext: this.TOLOMEOContext,
			 attributes: this.filterBuilderStore,
            allowBlank: true,
            allowGroups: false
        });
		
		this.attributeFieldSet.add(this.filterBuilder);
		
		this.enable();
    }
    
});
