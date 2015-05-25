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
 * Strumento di ricerca alfanumerica libera 
 * (Query Tool) general purpose (in grado cioè di 
 * lavorare su qualunque layer vettoriale configurato 
 * nel sistema) per Tolomeo.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.ToloQueryBuilderExt', {

	extend: 'Ext.Panel',

	/**
	 * @cfg {Object} paramsJS
	 * Configurazioni specifiche del file di preset.
	 */
	paramsJS: null,

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
	 * @cfg {String} filterFormat [filterFormat="OGC"]
	 * Formato dei filtro. Possibili valori: "OGC", "CQL".
	 */
	filterFormat: "OGC",
	
	/**
	 * @cfg {String} ogcFilterVersion [ogcFilterVersion="1.1.0"]
	 * Se filterFormat="OGC" indica il numero di versione del filtro.
	 */
	ogcFilterVersion: "1.1.0",

	/**
	 * @cfg {Boolean} caseInsensitiveMatch [caseInsensitiveMatch="false"]
	 * Indica se i valori degli attributi nel filtro devono essere case sensitive o meno.
	 */
	caseInsensitiveMatch: false,
	
	config: {
		/**
		 * @cfg {TolomeoExt.ToloFeatureManager} qbFeatureManager (required)
		 * Gestore di richieste e operazioni che coinvolgono le features.
		 */
		qbFeatureManager: null,
		
		/**
		 * @cfg {TolomeoExt.events.ToloQueryBuilderEvtManager} qbEventManager (required)
		 * Gestore di eventi per il query builder.
		 */
		qbEventManager: null,
		
		/**
		 * @cfg {TolomeoExt.widgets.ToloLayerSelector} layerSelector
		 * 
		 */
		layerSelector: null,
		
		/**
		 * @cfg {TolomeoExt.widgets.ToloSpatialSelector} spatialSelector
		 * 
		 */
		spatialSelector: null,
		
		/**
		 * @cfg {TolomeoExt.widgets.ToloAttributeFilter} queryfilter
		 * 
		 */
		queryfilter: null
	}, 
	
	/**
	 * @cfg {Object} autoCompleteCfg [autoCompleteCfg="{}"]
	 * Contiene la configurazione per il servizio di autocompletamento.
	 *
	 * @example
	 * autoCompleteCfg: {
	 *  	url: 'http://localhost:8080/tolomeobinj/UniqueValueServlet',
	 *		pageSize: 10
	 * }
	 */
	autoCompleteCfg: {},
	
	/**
	 * @cfg {Boolean} [autoComplete="fase"]
	 * Abilita la funzionalità di autocomplete .
	 */
	autoComplete: false,
	
	/**
	 * @cfg {String} noFilterSelectedMsgTitle
	 * 
	 */
    noFilterSelectedMsgTitle: "Nessun filtro selezionato",
    
	/**
	 * @cfg {String} noFilterSelectedMsgText
	 * 
	 */
    noFilterSelectedMsgText: "Si deve selezionare almento un filtro",
    
	/**
	 * @cfg {String} invalidRegexFieldMsgTitle
	 * 
	 */
    invalidRegexFieldMsgTitle: "Campi invalidi",
    
	/**
	 * @cfg {String} invalidRegexFieldMsgText
	 * 
	 */
    invalidRegexFieldMsgText: "Uno o pi&ugrave; campi della form non sono corretti!",
    
	/**
	 * @cfg {String} notEnabledFieldMsgTitle
	 * 
	 */
    notEnabledFieldMsgTitle: "Campi non abilitati",
    
    /**
	 * @cfg {Boolean} notEnabledFieldMsgText
	 * 
	 */
    notEnabledFieldMsgText: "Non &egrave; possibile inviare la richiesta finch&egrave; il layer non &egrave; stato selezionato",    

	/**
     * Inizializza un nuovo TolomeoExt.ToloQueryBuilderExt.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){	
		TolomeoExt.Vars.ApplyIfDefaults(this);

		this.autoScroll = true;
		this.collapsed = false;
    	
		if(!this.qbEventManager){
			this.qbEventManager = Ext.create('TolomeoExt.events.ToloQueryBuilderEvtManager');
		}
		
		if(!this.qbFeatureManager){
			this.qbFeatureManager = Ext.create('TolomeoExt.ToloFeatureManager', {
				TOLOMEOServer: this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext
			});
		}
		
		this.qbFeatureManager.on({
			scope: this,
			layerchange: function(results/*, store*/){
				this.waitMask.hide();
				this.queryfilter.addFilterBuilder(results/*, store*/);
				this.spatialSelector.setGeomFieldName(this.queryfilter.getGeomFieldName());
			},
			loadfeatures: function(results, store){
				this.waitMask.hide();
			},
			beforeloadfeatures: function(){
				this.waitMask.show();
			},
			beforelayerchange: function(){
				this.waitMask.show();
			},
			loadfeaturesfailure: function(){
				this.waitMask.hide();
			}
		});
		
		// /////////////////////
		// Layer Selector
		// /////////////////////
		var layers = [];
		var evetLayerList = this.paramsJS.azioniEventi.eventiLayerList;
		for(var i=0; i<evetLayerList.length; i++){
			var layerEventConfig = evetLayerList[i];
			if(layerEventConfig.queryBuilder){
				layers.push({
					name: layerEventConfig.nomeLayer, 
					description: layerEventConfig.descrizioneLayer, 
					codTPN: layerEventConfig.codTPN
				});
			}
		}
		
		this.layerSelector = Ext.create('TolomeoExt.widgets.ToloLayerSelector', {
			layers: layers,
			listeners:{
				scope: this,
				layerselected: function(records){
					this.reset();
					
					// /////////////////////////////////////////////////
					// Enable the sub components after layer selection
					// in order to allow filter composition.
					// /////////////////////////////////////////////////
					this.spatialSelector.enable();
					this.filterView.enable();
					this.enableAttributeFilter(records[0]);
				}				
			}
		});
		
		// /////////////////////
		// Spatial Selector
		// /////////////////////
		this.spatialSelector = Ext.create('TolomeoExt.widgets.ToloSpatialSelector', {
			qbEventManager: this.qbEventManager,
			filterGeometryName: "geom",
			disabled: true
		});
		
		// /////////////////////
		// Attribute Filter
		// /////////////////////
		this.queryfilter = Ext.create('TolomeoExt.widgets.ToloAttributeFilter', {
			scroll: true,
			disabled: true,
			caseInsensitiveMatch: this.caseInsensitiveMatch,
			autoCompleteCfg: this.autoCompleteCfg,
			autoComplete: this.autoComplete,
			TOLOMEOServer: this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext
		});
		
		this.filterView = Ext.create('TolomeoExt.widgets.ToloFilterView', {
			scroll: true,
			disabled: true,
			listeners:{
				scope: this,
				typeselected: function(records){
					var filter = this.getFilter();
					if(filter){
						var record = records;
						
						if(records instanceof Array){
							record = records[0];
						}
						
						var serialized_filter = this.getFilterString(filter, record.get("name"));
						this.filterView.setFilter(serialized_filter);
					}
				}
			}
		});
			
		this.bbar = ["->", {
            text: "Cancella",
            iconCls: "querybuilder-icon-cancel",
            scope: this,
            handler: function() {
            	this.reset();
            }
        }, {
            text: "Cerca",
            iconCls: "querybuilder-icon-find",
            handler: function() {
            	var filter = this.getFilter();
            	
            	if(filter){
            		var serialized_filter = this.getFilterString(filter, null);

                    var fparams = {
        				codTPN: this.codTPN,
        				SRID: this.paramsJS.mappe.SRID,
        				filter: serialized_filter,
        				ogcFilterVersion: this.ogcFilterVersion,
        				format: "ext"
        			}; 
            		
                    this.qbFeatureManager.loadFeatures(fparams);
            	}
            },
            scope: this
        }];
		
		this.callParent();
	
		this.add([this.layerSelector, this.spatialSelector, this.queryfilter, this.filterView]);
		
		this.spatialSelector.reset();
		
		// ////////////////////////////////////////////////////////
		// Disable the tool if any layer is configured to use it
		// ////////////////////////////////////////////////////////
		if(layers.length < 1){
			this.disabled = true;
		}
		
		this.on("afterrender", function(){
			this.waitMask = new Ext.LoadMask(this.id, {msg: "Ricerca in corso...."});
		}, this);
		
	},
	
	/**
     * Reimposta i componenti della form e il la griglia delle features
     *
     */
	reset: function(){
    	// Spatial Selector Reset
    	this.spatialSelector.reset();
    	var spatialMethodCombo = this.spatialSelector.getSelectionMethodCombo();
    	spatialMethodCombo.reset();
    	
    	// Attribute Form Reset
    	if(this.queryfilter.filterBuilder){
    		this.queryfilter.filterBuilder.removeAllConditions();
    	}
    	
    	// Attribute Filter Reset
    	this.filterView.resetView();
    	
    	// Feature Grid Reset
    	this.qbFeatureManager.fireEvent("resetquery");
	},
	
	/**
     * Abilita il filtro degli attributi.
     * @param {Ext.Data.Record} record corrispondente al layer selezionato. 
     *
     */
	enableAttributeFilter: function(record){
		// Adding a Filter Builder passing the feature type name
		this.codTPN = record.get('codTPN');
		
		var fparams = {
			codTPN: this.codTPN
		}; 
		
    	// Submit ajax della form
    	this.qbFeatureManager.getSchema(fparams);
	},
	
	/**
     * Recupera il filtro selezionato in formato stringa.
     * @param {OpenLayers.Filter} filter Il filtro selezionato. 
	 * @param {String} type Tipo del filtro.
     * @return {String} il filtro in formato stringa.
     */
	getFilterString: function(filter, type){
        var format = this.filterFormat;        
        if(type){
        	format = type;
        }
        
        var serialized_filter = "";
        if(format == "OGC" ){
            var node = new OpenLayers.Format.Filter({version: this.ogcFilterVersion}).write(filter);
            serialized_filter = new OpenLayers.Format.XML().write(node);
        }else{
        	serialized_filter = new OpenLayers.Format.CQL().write(filter);
        }
        
        return serialized_filter;
	},
	
    /**
     * Recupera il filtro selezionato.
     * @return {OpenLayers.Filter} il filtro selezionato.
     */
	getFilter: function(){
		var filter = null;
								
    	if(!this.queryfilter.disabled && !this.spatialSelector.disabled){
    		
    		if(this.queryfilter.attributeFieldSet.collapsed && this.spatialSelector.spatialFieldSet.collapsed){
    			
    			 Ext.Msg.show({
    				 title: this.noFilterSelectedMsgTitle,
                     msg: this.noFilterSelectedMsgText,
                     buttons: Ext.Msg.OK,
                     icon: Ext.MessageBox.ERROR
                 }); 
    			
    			return filter;
    		}
    		
    		// ////////////////////////////////////////////////
            // Check if there are some invalid field according 
    		// to validators regex config
            // ////////////////////////////////////////////////
    		var invalidItems = 0;
    		if(!this.queryfilter.attributeFieldSet.collapsed){
        		var filterFieldItem = this.query('tolomeo_tolofilterfield');            

                for(var x = 0; x<filterFieldItem.length; x++){
                	if(filterFieldItem[x].valueWidgets){
                    	var valueWidgets = filterFieldItem[x].valueWidgets.items.items;
                    	for(var y=0; y<valueWidgets.length; y++){
                    		var validateItem = valueWidgets[y];
                            if(!validateItem.isValid(true)){
                                invalidItems++;
                            }
                    	}
                	}
                }  
    		}
            
            if(invalidItems == 0){                    	
            	var filters = [];
            	
            	// ///////////////////////
            	// Compose the Filter
            	// ///////////////////////
            	if(!this.queryfilter.attributeFieldSet.collapsed){
                	var attributeFilter = this.queryfilter.filterBuilder.getFilter();
                	if(attributeFilter){
                		filters.push(attributeFilter);	
                	}
            	}

            	// /////////////////////////////////////////////
            	// If the spatial field set is collapdes then 
            	// use the current map extent. 
            	// /////////////////////////////////////////////
            	var currentMapExtent = this.spatialSelector.spatialFieldSet.collapsed;
            	if(!currentMapExtent){
	                var spatialFilter = this.spatialSelector.getQueryFilter(currentMapExtent);   
	                if (spatialFilter) {
	                	spatialFilter.projection = this.paramsJS.mappe.SRID;
	                	filters.push(spatialFilter);
	                }
            	}
            	
                if(filters.length > 0){
    				var filter = filters.length > 1 ?
                        new OpenLayers.Filter.Logical({
                            type: OpenLayers.Filter.Logical.AND,
                            filters: filters
                        }) :
                        filters[0];   
                        
                    return filter;
                    
                }else{
                    Ext.Msg.show({
                        title: this.noFilterSelectedMsgTitle,
                        msg: this.noFilterSelectedMsgText,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR
                    }); 
                }
            }else{
                Ext.Msg.show({
                    title: this.invalidRegexFieldMsgTitle,
                    msg: this.invalidRegexFieldMsgText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
            
    	}else {
            Ext.Msg.show({
                title: this.notEnabledFieldMsgTitle,
                msg: this.notEnabledFieldMsgText,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.ERROR
            });
    	}
    	
    	return filter;
	}
    
});
