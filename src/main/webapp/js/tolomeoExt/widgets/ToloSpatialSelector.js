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
 * Widget per la selezione della regione di interesse. Collega 
 * le specifiche funzionalità di di selezione spaziale e le 
 * relative caratteristiche in un'unica form dinamica.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloSpatialSelector', {

	extend: 'Ext.Panel',
	
	padding: '0 5 0 5',
	
	/**
	 * @cfg {Object} spatialSelectorsConfig
     * Configurazione dei metodi di selezione che si vuole rendere disponibili.
     */
    spatialSelectorsConfig:{
	    /**
		 * @cfg {Object} bbox
		 * Metodo di selezione per bounding box.
		 */
        bbox:{
            xtype : 'widget.tolomeo_spatial_bbox_selector'
        },
	    /**
		 * @cfg {Object} buffer
		 * Metodo di selezione pre buffer.
		 */
        buffer:{
            xtype : 'widget.tolomeo_spatial_buffer_selector'
        },
	    /**
		 * @cfg {Object} circle
		 * Metodo di selezione per cerchio.
		 */
        circle:{
            xtype : 'widget.tolomeo_spatial_circle_selector',
            zoomToCurrentExtent : true
        },
	    /**
		 * @cfg {Object} polygon
		 * Metodo di selezione per poligono.
		 */
        polygon:{
            xtype : 'widget.tolomeo_spatial_polygon_selector'
        }
    },

	/**
	 * @cfg {String} defaultSelectionMethod
	 * (xtype) Metodo di selezione da usare come predefinito.
	 */
	defaultSelectionMethod: null,

	/**
	 * @cfg {String} filterGeometryName
	 * None del campo geometrico usato per la preparazione del filtro.
	 */
	filterGeometryName: "the_geom",

	/**
	 * @cfg {String} titleText
	 * Titolo usato per il fielset di contenimento.
	 */
	titleText: "Filtro geometrico",

	/**
	 * @cfg {String} comboEmptyText
	 * Testo predefinito per la combo box del metodo di selezione spaziale.
	 */
	comboEmptyText : "Seleziona un metodo...",

	/**
	 * @cfg {String} comboSelectionMethodLabel
	 * Testo per l'etichetta della combo box di selezione del metodo.
	 */
	comboSelectionMethodLabel : "Metodo di selezione",
	
	/**
	 * @property {TolomeoExt.events.ToloQueryBuilderEvtManager} qbEventManager
	 * Gestore di eventi per il query builder.
	 */
	qbEventManager: null,
    
	/**
     * Crea un nuovo TolomeoExt.widgets.ToloSpatialSelector.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor : function(config) {
		this.layoutConfig = {
            xtype: 'container',
            defaults:{
                layout: "form"
            }
        };

		// Apply config
		Ext.apply(this, config);

		// initialize spatial selectors
		this.spatialSelectors = {};
		this.spatialSelectorsItems = [];
		if(this.spatialSelectorsConfig){
			for (var key in this.spatialSelectorsConfig){
				var spConfig = this.spatialSelectorsConfig[key];
				var plugin = Ext.create(spConfig.xtype, {
					qbEventManager: this.qbEventManager
				});
				this.spatialSelectors[key] = plugin;
				var selectorItem = plugin.getSelectionMethodItem();
				selectorItem.value = key;
				this.spatialSelectorsItems.push(selectorItem);
			}	
		}
		
		this.callParent(arguments);
	},

	/**
     * Inizializza un oggetto di tipo TolomeoExt.widgets.ToloSpatialSelector.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){	
		this.border = 0;
		
    	// prepare layout
    	var layout = {};
		Ext.apply(layout, this.layoutConfig);
		if(!layout.title){
			layout.title = this.titleText;
		}

		var selectionMethodCombo = {
			xtype : 'combo',
			// anchor : '100%',
			id : this.id + '_selectionMethod_id',
			fieldLabel : this.comboSelectionMethodLabel,
			typeAhead : true,
			triggerAction : 'all',
			lazyRender : false,
			queryMode : 'local',
			name : 'roiSelectionMethod',
			forceSelection : true,
			emptyText : this.comboEmptyText,
			allowBlank : false,
			//autoLoad : true,
			displayField : 'label',
			valueField : 'value',
			editable : false,
			readOnly : false,
			store : Ext.create('Ext.data.JsonStore', {
				autoLoad : true,
				fields : [{
					name : 'name',
					dataIndex : 'name'
				}, {
					name : 'label',
					dataIndex : 'label'
				}, {
					name : 'value',
					dataIndex : 'value'
				}],
				data : this.spatialSelectorsItems
			}),
			listeners : {
				select : function(c, record, index) {
					this._updating = true;
					this.reset();
					this._updating = false;
					var method = this.spatialSelectors[c.getValue()];//record.json.method;
					method.activate();
					this.activeMethod = method;
                    setTimeout(function(){
                        //TODO: ??? c.refOwner.doLayout();
                    }, 500);
				},
				scope : this
			}
		};

		var selItems = [];
		selItems.push(selectionMethodCombo);
		
		if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		var output = this.spatialSelectors[key];
	    		if(output){
					selItems.push(output);
	    		}
	    	}
	    }

		this.spatialFieldSet = Ext.create('Ext.form.FieldSet', {
			collapsed : true,
			checkboxToggle: true,
			title: this.titleText,
			items: selItems
		});
		
	    // initialize layout
		layout.items = [];		
		layout.items.push(this.spatialFieldSet);

    	this.items = [layout];
    	
    	this.callParent();    	
    	
    	//
    	// Update the current map extent
    	//
    	this.qbEventManager.on("mapmoved", function(extent){
    		this.currentMapExtent = extent;
    	}, this);
    },
 
	/**
     * Reimposta lo stato del selettore spaziale.
	 *
     */
    reset: function(){
    	if(this.spatialSelectors){
	    	for (var key in this.spatialSelectors){
	    		this.spatialSelectors[key].deactivate();
	    		this.activeMethod = null;
	    	}
	    	if(!this._updating 
	    		&& this.defaultSelectionMethod
	    		&& this.spatialSelectors[this.defaultSelectionMethod]){
	    		this.spatialSelectors[this.defaultSelectionMethod].activate();
				this.activeMethod = this.spatialSelectors[this.defaultSelectionMethod];
	    	}   	
    	}
    },

    setGeomFieldName: function(geomFieldName) {
    	this.filterGeometryName = geomFieldName;
    },
    
	/**
     * Genera un filtro per il metodo di selezione scelto.
     * @param {Boolean} currentExtent Stabilisce se ritornare un filtro semplice basato sull'estensione corente della mappa.
     */
	getQueryFilter: function(currentExtent){
		var currentExtentFilter = new OpenLayers.Filter.Spatial({
			type: OpenLayers.Filter.Spatial.BBOX,
			property: this.filterGeometryName,
			value: this.currentMapExtent 
		});
		
		if(currentExtent === true){
			return currentExtentFilter;
		}
		
		if(this.activeMethod && this.activeMethod.currentGeometry){
			this.activeMethod.filterGeometryName = this.filterGeometryName;
			return this.activeMethod.getQueryFilter();
		}else{
			// tornare questo se si vuole almeno il filtro sulla finestra corrente
			// return currentExtentFilter;
			return null;
		}
	},

	/**
     * Restituisce la geometria selezionata.
     * 
     */
	getGeometry: function(){
		if(this.activeMethod){
			return this.activeMethod.currentGeometry;
		}else{
			return null;
		}
	},
	
	/**
     * Restituisce l'elemento ext relativo alla combo box del metodo di selezione spaziale.
     * 
     */
	getSelectionMethodCombo: function(){		
    	var selectionMethodCombo = this.queryById(this.id + '_selectionMethod_id');
    	return  selectionMethodCombo;
	},
	
	setDecimalPrecision: function(decimalPrecision){
		for (var key in this.spatialSelectors){			
			this.spatialSelectors[key].setDecimalPrecision(decimalPrecision);			
		}	
	}
	
});
