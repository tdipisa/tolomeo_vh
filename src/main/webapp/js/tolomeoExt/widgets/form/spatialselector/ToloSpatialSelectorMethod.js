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

// //////////////////////////////////////////////////////////////////////////
//  include widgets/form/spatialselector/BBOXToloSpatialSelectorMethod.js
//  include widgets/form/spatialselector/BufferToloSpatialSelectorMethod.js
//  include widgets/form/spatialselector/CircleToloSpatialSelectorMethod.js
//  include widgets/form/spatialselector/PolygonToloSpatialSelectorMethod.js
/////////////////////////////////////////////////////////////////////////////

Ext.ns('TolomeoExt.widgets.form.spatialselector');

/**
 * Plugin comune per la selezione spaziale.
 * Widgets conosciute: 
 *    <ul>
 *       <li>BBOXToloSpatialSelectorMethod: `widget.tolomeo_spatial_bbox_selector` ptype</li>
 *       <li>BufferToloSpatialSelectorMethod: `widget.tolomeo_spatial_buffer_selectorr` ptype</li>
 *       <li>CircleToloSpatialSelectorMethod: `widget.tolomeo_spatial_circle_selector` ptype</li>
 *       <li>PolygonToloSpatialSelectorMethod: `widget.tolomeo_spatial_polygon_selector` ptype</li>
 * 	  </ul>
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod', {
	
	extend: 'Ext.Container',

    /**
     * @cfg {String} name.
     * Nome da mostrare nella combo box di selezione spaziale.
     */

    /**
     * @cfg {String} label.
     * Etichetta da mostrare nella combo box di selezione spaziale.
     */

    /**
     * @cfg {Object} output.
     * Configurazione di output per questo plugin.
     */

    /**
     * @cfg {OpenLayers.Geometry} currentGeometry.
     * Rappresenta la geometria selezionata.
     */

    /**
     * @cfg {OpenLayers.Geometry} filterGeometryName.
     * Rappresenta il nome del campo geometrico da usare nel filtro.
     */
   
 	/**
     * @property {Boolean} zoomToCurrentExtent [zoomToCurrentExtent="false"]
     * Flag per stabilire lo zoom all'extent della geometria selezionata.
     */
	zoomToCurrentExtent: false,

    /**
     * @property {Object} defaultStyle.
     * Configurazione del OpenLayer.Style predefinito usato come stile del BBOX su mappa.
     */
	defaultStyle : {
        "fillColor"   : "#FFFFFF",
        "strokeColor" : "#FF0000",
        "fillOpacity" : 0.5,
        "strokeWidth" : 1
	},

    /**
     * @property {Object} selectStyle.
     * Configurazione del OpenLayer.Style di selezione usato come stile del BBOX su mappa.
     */
	selectStyle : {
        "fillColor"   : "#FFFFFF",
        "strokeColor" : "#FF0000",
        "fillOpacity" : 0.5,
        "strokeWidth" : 1
	},

    /**
     * @property {Object} temporaryStyle.
     * Configurazione del OpenLayer.Style temporaneo usato come stile del BBOX su mappa.
     */
	temporaryStyle : {
		"strokeColor": "#ee9900",
		"fillColor": "#ee9900",
		"fillOpacity": 0.4,
		"strokeWidth": 1
	},
	
 	/**
     * @property {Boolean} addGeometryOperation [addGeometryOperation="true"]
     * Flag per stabilire se aggiungere o meno il tool di selezione dell'operazione geometrica per la selezione spaziale scelta.
     */
	addGeometryOperation: true,

 	/**
     * @cfg {Object} geometryOperations.
     * Lista delle operazioni geometriche consentite.
     * 
     * @example
	 *	geometryOperations:[{
	 *		name: "INTERSECTS",
	 *		label: "INTERSECTS",
	 *		value: OpenLayers.Filter.Spatial.INTERSECTS
	 *	},{
	 *		name: "BBOX",
	 *		label: "BBOX",
	 *		value: OpenLayers.Filter.Spatial.BBOX
	 *	},{
 	 *		name: "CONTAINS",
	 *		label: "CONTAINS",
	 *		value: OpenLayers.Filter.Spatial.CONTAINS
	 *	},{
	 *		name: "DWITHIN",
	 *		label: "DWITHIN",
	 *		value: OpenLayers.Filter.Spatial.DWITHIN
	 *	},{
	 *		name: "WITHIN",
	 *		label: "WITHIN",
	 *		value: OpenLayers.Filter.Spatial.WITHIN
	 *	}]
     */
	geometryOperations:[{
		name: "INTERSECTS",
		label: "Intersezione",
		value: OpenLayers.Filter.Spatial.INTERSECTS
	}/*
	,{
		name: "BBOX",
		label: "Bounding Box",
		value: OpenLayers.Filter.Spatial.BBOX
	}
	*/
	,{
		name: "DWITHIN",
		label: "Dista entro...",
		value: OpenLayers.Filter.Spatial.DWITHIN
	},{
		name: "WITHIN",
		label: "Contiene",
		value: OpenLayers.Filter.Spatial.WITHIN
	}],

    /**
     * @property {OpenLayers.Filter.Spatial} defaultGeometryOperation.
     * Operazione geometrica selezionata di default.
     */
	defaultGeometryOperation: OpenLayers.Filter.Spatial.INTERSECTS,

    /**
     * @property {String} geometryOperationText.
     * Testo da mostrare per l'etichetta della operazione geometrica.
     */
	geometryOperationText: "Operazione geometrica",

    /**
     * @property {String} geometryOperationEmptyText.
     * Testo da mostrare per la combo box della operazione geometrica se non valorizzata.
     */
	geometryOperationEmptyText: "Selezione operazione",

    /**
     * @property {String} distanceTitleText.
     * Testo da mostrare per il fieldset della distanza.
     */
	distanceTitleText: "Distanza",
	
	/**
     * @property {String} distanceLabelText.
     * Etichetta da mostrare per il valore della distanza.
     */
	distanceLabelText: "Valore [m]",

    /**
     * @property {String} distanceUnitsTitleText.
     * Testo da mostrare per il campo delle unità relative al campo distanza.
     */
	distanceUnitsTitleText: "Unit&agrave; distanza",

    /**
     * @property {String} noOperationTitleText.
     * Messaggio di operazione non valida.
     */
	noOperationTitleText: "Operazione non valida",

    /**
     * @property {String} noOperationMsgText.
     * Messaggio per operazione non selezionata.
     */
	noOperationMsgText: "Seleziona una operazione prima della richiesta",

    /**
     * @property {String} noCompleteMsgText.
     * Messaggio per form non completa.
     */
	noCompleteMsgText: "Completare la form prima della richiesta",
	
	/**
	 * @cfg {TolomeoExt.events.ToloQueryBuilderEvtManager} qbEventManager (required)
	 * Gestore di eventi per il query builder.
	 */
	qbEventManager: null,

	/**
     * Crea un nuovo TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	constructor : function(config) {
		Ext.apply(this, config);		
		this.callParent(arguments);
	},

	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {   
		Ext.apply(this, config);

		if(!this.output){
			this.output = this;
		}

		if(this.addGeometryOperation){
			if (!this.items){
				this.items = [];
			}

			this.items.push({
				xtype: 'fieldset',
				ref: "geometryOperationFieldset",
				title: this.geometryOperationText,
                checkboxToggle: true,
                collapsed : true,
				items: [this.getGeometryOperationCombo()]
			});
			
			this.items.push(this.getDistanceFieldset());
		}

		this.output.addEvents(
				"geometrySelect"
		);	
		
		this.callParent();
		
        this.on("added", function(scope){
        	scope.geometryOperationFieldset = scope.query('fieldset[ref=geometryOperationFieldset]')[0];
        	scope.geometryOperation = scope.query('combo[ref=geometryOperation]')[0];
        	scope.distanceFieldset = scope.query('fieldset[ref=distanceFieldset]')[0];
        	scope.distance = scope.query('numberfield[ref="distance"]')[0];
        	//scope.dunits = scope.query('textfield[ref=dunits]')[0];
        });
    },

	/**
     * Genera un oggetto per la combo di selezione.
     * @return {Object} l'oggetto selezionato dalla combo.
     */
	getSelectionMethodItem: function(){
        return {
        	label: this.label, 
        	name: this.name
        };
	},

	/**
     * Genera un filtro per il metodo si selezione.
     * @return {OpenLayers.Filter} Il filtro impostato dall'utente.
     */
	getQueryFilter: function(){
		var operation = null;
		
		if(this.addGeometryOperation && !this.geometryOperationFieldset.collapsed){
			if(this.geometryOperation.isValid() ){
				operation = this.geometryOperation.getValue();
			}else{
                Ext.Msg.show({
                    title: this.noOperationTitleText,
                    msg: this.noOperationMsgText,
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
				return null;
			}
		}else{
			operation = OpenLayers.Filter.Spatial.INTERSECTS;
		}
		
		if(this.currentGeometry){
			switch (operation){
				case OpenLayers.Filter.Spatial.CONTAINS:
				case OpenLayers.Filter.Spatial.INTERSECTS:
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: operation,
						property:  this.filterGeometryName,
						value: this.currentGeometry,
						bounds: this.currentGeometry.getBounds()
					});
					break;
				case OpenLayers.Filter.Spatial.WITHIN:
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: operation,
						property:  this.filterGeometryName,
						value: this.currentGeometry
					});
					break;
				case OpenLayers.Filter.Spatial.DWITHIN:
					if(this.distance.isValid()
						/*&& this.dunits.isValid()*/){
						this.currentFilter = new OpenLayers.Filter.Spatial({
							type: operation,
							property:  this.filterGeometryName,
					        distanceUnits: "m", //this.dunits.getValue(),
					        distance: this.distance.getValue(),
							value: this.currentGeometry
						});
					}else{
		                Ext.Msg.show({
		                    title: this.noOperationTitleText,
		                    msg: this.noCompleteMsgText,
		                    buttons: Ext.Msg.OK,
		                    icon: Ext.MessageBox.ERROR
		                });
		                return null;
					}
					break;
				case OpenLayers.Filter.Spatial.BBOX:
				default: 
					this.currentFilter = new OpenLayers.Filter.Spatial({
						type: OpenLayers.Filter.Spatial.BBOX,
						property:  this.filterGeometryName,
						value: this.currentGeometry.getBounds()
					});
			}
			
		}else{
	        this.currentFilter = null;
		}
		
		return this.currentFilter;
	},

	/**
     * Attiva il plugin.
     * 
     */
	activate: function(){
		this.reset();
		this.doLayout();
		this.show();
	},

	/**
     * Disattiva il plugin.
     * 
     */
	deactivate: function(){
		this.reset();
		this.hide();
	},

	/**
     * Reimposta il componente (filtro e geometria).
     * 
     */
    reset: function(){
    	this.currentGeometry = null;
    	this.currentFilter = null;
    },

	/** api: method[setCurrentGeometry]
     *  :arg geometry: ``Object`` The geometry to be setted as current geometry.
     *  Set current geometry
	 */
    setCurrentGeometry: function(geometry){
		this.currentGeometry = geometry;
		
    	if (geometry) {
			if (this.zoomToCurrentExtent && geometry && geometry.getBounds) {
				var dataExtent = geometry.getBounds();
				
				// create an event to manage the zoom to extent
				this.qbEventManager.fireEvents("zoomtomapextent", {dataExtent: dataExtent});
			}

			this.output.fireEvent("geometrySelect", geometry);
		} 
    },

	/**
     * Genera la combo box Ext per la selezione dell'operazione geometrica.
     * @return {Ext.form.ComboBox} La combo box di selezione dell'operazione geometrica.
     */
	getGeometryOperationCombo: function() {
		var geometryOperationMethodCombo = Ext.create('Ext.form.ComboBox', {
			ref : 'geometryOperation',
			width: 220,
			labelStyle: 'width: 70px;',
			typeAhead : true,
			forceSelection: true, 
			queryMode: 'local',
			triggerAction: 'all',
			emptyText : this.geometryOperationEmptyText,
			selectOnFocus: true,
			editable:false,
			fieldLabel : this.geometryOperationText,
			name : 'geometryOperation',
			displayField : 'label',
			valueField : 'value',
			readOnly : false,
			lazyRender : false,
			value: this.defaultGeometryOperation,
			allowBlank : false,
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
				data : this.geometryOperations
			}),
			listeners : {
				// Show/Hide distance units for DWITHIN
				select : function(c, record, index) {
					if(c.getValue() == OpenLayers.Filter.Spatial.DWITHIN){
						this.distanceFieldset.show();
					}else if(this.distanceFieldset.isVisible()){
						this.distanceFieldset.hide();
					}
				},
				scope : this
			}
		});
		 
		return geometryOperationMethodCombo;
	},

	/**
     * Genera la combo box Ext per la selezione della distanza (specifica selezione geometrica vedi "DWITHIN").
     * @return {Ext.form.FieldSet} il FieldSet per l'impostazione della distanza.
     */
	getDistanceFieldset: function(){
		return {
			xtype: 'fieldset',
			title: this.distanceTitleText,
			ref: "distanceFieldset",
			hidden: true,
			items: [/*{
				xtype: "textfield",
				fieldLabel: this.distanceUnitsTitleText,
				name: "dunits",
				ref: "dunits",
				labelStyle: 'width: 90px;',
				width: 200,
				allowBlank: false
			},*/{
				xtype: "numberfield",
				fieldLabel: this.distanceLabelText,
				name: "distance",
				ref: "distance",
				labelStyle: 'width: 90px;',
				width: 200,
				allowBlank: false
			}]/*,
			listeners:{
				scope: this,
			    afterlayout: function(fieldset, options){
					var dunits = this.query('textfield[ref=dunits]')[0];
					if(this.qbEventManager){
						this.qbEventManager.fireEvent("setmapunitsvaluefield", this.dunits);
					}
				}
			}*/
		}
	},
	
	setDecimalPrecision: function(decimalPrecision){
		return;
	}
	
});
