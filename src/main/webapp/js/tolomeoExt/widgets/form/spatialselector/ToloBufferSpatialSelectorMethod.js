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

Ext.ns('TolomeoExt.widgets.form.spatialselector');

/**
 * Plugin per la selezione di una area di interesse a buffer.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod',  {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',

	alias : 'widget.tolomeo_spatial_buffer_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],

    /**
     * @cfg {String} name.
     * Nome da mostrare nella combo box di selezione spaziale.
     */
	name  : 'Buffer',

    /**
     * @cfg {String} label.
     * Etichetta da mostrare nella combo box di selezione spaziale.
     */
	label : 'Buffer',

    /**
     * @cfg {String} latitudeEmptyText.
     * Testo da mostrare se ili campo Y (latitude) non è valorizzato.
     */
    latitudeEmptyText : 'Y',

    /**
     * @cfg {String} longitudeEmptyText.
     * Testo da mostrare se ili campo X (longitude) non è valorizzato.
     */
    longitudeEmptyText : 'X',

	/**
	 * @cfg {Object} bufferOptions 
	 * Opzioni di configurazione per la selezione del buffer.
	 *
	 * @example
	 *	bufferOptions : {
	 *		"minValue": 1,
	 *		"maxValue": 1000, 
	 *			"decimalPrecision": 2,
	 *		"distanceUnits": "m"
	 *	}
	 */
	bufferOptions : {
		"minValue": 1,
		"maxValue": 5000,
		"decimalPrecision": 2,
		"distanceUnits": "m",
		"outputSRS": "EPSG:3003"
	},
	
    /**
     * @cfg {Boolean} geodesic.
     * 
     */
	geodesic: true,

	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {
		// ///////////////////////////////////////////
		// Spatial Buffer Selector FieldSet
		// ///////////////////////////////////////////
		this.bufferFieldset = new TolomeoExt.widgets.form.ToloBufferFieldset({
			id: this.id + "bufferFieldset",
			map: null,
			minValue: this.bufferOptions.minValue,
            maxValue: this.bufferOptions.maxValue,
		    decimalPrecision: this.bufferOptions.decimalPrecision,
		    outputSRS : this.bufferOptions.outputSRS, 
			selectStyle: this.selectStyle,
			geodesic: this.geodesic != undefined ?  this.geodesic : false,
			latitudeEmptyText: this.latitudeEmptyText,
			longitudeEmptyText: this.longitudeEmptyText,
			qbEventManager: this.qbEventManager			
		});
		
		this.bufferFieldset.on("bufferadded", function(evt, feature){
			this.setCurrentGeometry(feature.geometry);
		}, this);

	    this.bufferFieldset.on("bufferremoved", function(evt, feature){
			this.setCurrentGeometry(null);
		}, this);
	    
	    this.bufferFieldset.on("afterlayout", function(evt){
	    	this.qbEventManager.fireEvent("addcoordinatepickercontrol", this.bufferFieldset.coordinatePicker);
		}, this);

    	this.output = this;

    	this.items = [this.bufferFieldset];

    	this.callParent();
    },

	/**
     * Attiva il controllo.
     * 
     */
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.activate.call(this);
		if(this.output){
			this.output.enable();
			if(Ext.isIE){
				this.output.doLayout();
			}
		}
	},

	/**
     * Disattiva il controllo.
     * 
     */
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
			this.output.hide();
			this.output.disable();
		}
	},

	/**
     * Reimposta il controllo di disegno del buffer.
     * 
     */
    reset: function(){
    	TolomeoExt.widgets.form.spatialselector.ToloBufferSpatialSelectorMethod.superclass.reset.call(this);
		if(this.output){
			this.bufferFieldset.resetPointSelection();
			this.bufferFieldset.coordinatePicker.toggleButton(false);
		}
    },

	setDecimalPrecision: function(decimalPrecision){
		this.bufferFieldset.setDecimalPrecision(decimalPrecision);
	}

});
