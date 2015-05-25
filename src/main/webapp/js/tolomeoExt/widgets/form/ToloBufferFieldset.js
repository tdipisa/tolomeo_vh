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

Ext.ns('TolomeoExt.widgets.form');

/**
 * Widget per la gestione delle funzionalità relative alla modalità di selezione
 * per Buffer 
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloBufferFieldset', {
	
	extend: 'Ext.form.FieldSet',
	
    alias: "widget.tolomeo_bufferfieldset",
    
    id: "bufferFieldSet",   
    
 	/**
     * @property {String} buttonIconCls.
     * Classe di stile che rappresenta l'iconaper il pulsante di selezione.
     */
    buttonIconCls:'gx-buffer',
    
    /**
     * @cfg {Number} labelWidth.
     * Larghezza delle label
     */
    labelWidth: 70,
    
    /**
     * @cfg {Number} fieldWidth.
     * Larghezza dei campi
     */
    fieldWidth : 100,

    /**
     * @cfg {String} bufferFieldLabel.
     * Testo per la label del campo numerico del buffer.
     */
	bufferFieldLabel: "Buffer",
	
    /**
     * @cfg {String} bufferFieldSetTitle.
     * Testo per il titolo del field set del buffer.
     */
	bufferFieldSetTitle: "Buffer",

    /**
     * @cfg {String} coordinatePickerLabel.
     * Testo per l'etichetta del coordinate picker.
     */
	coordinatePickerLabel: "Coordinate",
	
    /**
     * @cfg {String} draweBufferTooltip.
     * Testo del il tooltip per il bottone di disegno del buffer.
     */
	draweBufferTooltip: "Disegna il buffer",
	
 	/**
     * @property {String} outputSRS.
     * Codice EPSG per la trasformazione delle coordinate in 
     * visualizzazione all'interno della form.
     */
	outputSRS: "EPSG:4326",
	
    /**
     * @cfg {String} selectLayerName.
     * Nome del layer vettoriale che rappresenta il buffer su mappa.
     */
	selectLayerName: "buffer-layer",
	
    /**
     * @cfg {Boolean} displayInLayerSwitcher.
     * Usato per determinare se il layer vettoriale deve apparire all'interno del LayerSwitcher OpenLayers.
     */
	displayInLayerSwitcher: false,
	
    /**
     * @property {Object} selectStyle.
     * Configurazione del OpenLayer.Style usato come stile del punto su mappa.
     */
	selectStyle: {
		strokeColor: "#FF0000",
		handlerFillColor: "#FFFFFF",
		fillColor: "#FFFFFF",
		fillOpacity: 0,
		strokeWidth: 2
	},
	
    /**
     * @cfg {Integer} minValue.
     * valore minimo per il raggio del buffer.
     */
	minValue: 1,

    /**
     * @cfg {Integer} maxValue.
     * valore massimo per il raggio del buffer.
     */
	maxValue: 5000,
	
    /**
     * @cfg {Integer} decimalPrecision.
     * Massimo numero possibile di cifre decimali per i campi di coordinate.
     */
	decimalPrecision: 0,
	
    /**
     * @cfg {Boolean} geodesic.
     * 
     */
	geodesic: false,
	
    /**
     * @cfg {Object} config.
     * 
     */
	config: {
	    /**
	     * @cfg {OpenLayer.Layer.Vector} bufferLayer.
	     * 
	     */
        bufferLayer: null
	},
	
	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.ToloBufferFieldset.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {
    	
    	// per adesso lo impongo a prescindere, poi vediamo.
    	this.distanceUnit = 'm';
    	this.bufferFieldLabel += " [" + this.distanceUnit + "]"; 
    	
		this.coordinatePicker = Ext.create('TolomeoExt.widgets.form.ToloCoordinatePicker', {
			labelWidth: this.labelWidth,
			fieldWidth: this.fieldWidth,
			fieldLabel: this.coordinatePickerLabel,
			//fieldBodyCls : 'prova',
			latitudeEmptyText: this.latitudeEmptyText,
			longitudeEmptyText: this.longitudeEmptyText,
			outputSRS: this.outputSRS,
			toggleGroup: this.toggleGroup,
			listeners: {
				scope: this,

                afterrender: function(me) {
                    me.labelCell.applyStyles('vertical-align: middle');
                },

				updatebuffer: function(lonlat, scope){
				    var cv = this.coordinatePicker.isValid();
				    var bv = this.bufferField.isValid();
					if(cv && bv ){                                 
                        var coords = this.coordinatePicker.getCoordinate();
                        var lonlat = new OpenLayers.LonLat(coords[0], coords[1]);
                        var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
                        
        				if(this.qbEventManager){
        					this.qbEventManager.fireEvent("drawbuffer", 
        							point, 
        							this.geodesic, 
        							this.bufferField.getValue(), 
        							this.selectStyle,
        							this.selectLayerName,
        							this.displayInLayerSwitcher,
        							this.setBufferLayer, 
        							this);
        				}
                    }
				},
				reset: function(selectLayerName){
					if(this.qbEventManager){
						this.qbEventManager.fireEvent("removelayer", selectLayerName);
					}
				},
				update: function(lonlat, scope){
					if(this.qbEventManager){
						this.qbEventManager.fireEvent("updatemappoint", lonlat, scope);
					}
				}
			}			
		});
		
		this.bufferField = Ext.create('Ext.form.NumberField', {
			name: 'buffer',
			ref: 'bufferField',
			padding: '10 0 10 0',
			fieldLabel: this.bufferFieldLabel,
			labelWidth: this.labelWidth,
			allowBlank: false,
			disabled: false,
			width: (this.labelWidth + this.fieldWidth + 5), // 5 is default labelPad
			minValue: this.minValue,
            maxValue: this.maxValue,
			enableKeyEvents: true,
		    decimalPrecision: this.decimalPrecision,
			allowDecimals: true,
			hideLabel : false,
			validationDelay: 1500
		});
		
		this.bufferField.addListener("change", function(){   
			if(this.coordinatePicker.isValid() && this.bufferField.isValid()){						
				var coords = this.coordinatePicker.getCoordinate();
				var lonlat = new OpenLayers.LonLat(coords[0], coords[1]);
				var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);								
				
				if(this.qbEventManager){
					this.qbEventManager.fireEvent("drawbuffer", 
							point, 
							this.geodesic, 
							this.bufferField.getValue(), 
							this.selectStyle,
							this.selectLayerName,
							this.displayInLayerSwitcher,
							this.setBufferLayer,
							this);
				}
			}else{
				this.resetBuffer();
			}
		}, this, {delay: 500});
		
		this.items = [
			this.coordinatePicker,
			{
			    xtype: 'menuseparator'
			  },
			this.bufferField
		];
        
		this.title = this.bufferFieldSetTitle;		
		this.callParent();			
    },
	
	/**
     * Reimposta il buffer tramite un evento gestito dal Manager.
     * 
     */
	resetBuffer: function(){
		if(this.qbEventManager){
			this.qbEventManager.fireEvent("removelayer", this.selectLayerName);
		}
	},
	
	/**
     * Controlla la validità del valore inserito.
     * 
     * @return {Boolean} Restituisce true se valido e false se non lo è.
     */
	isValid: function(){
		return(this.coordinatePicker.isValid() &&
			this.bufferField.isValid());
	},
	
	/**
     * Avvia la procedura di reimpostazione del buffer.
     * 
     */	
	resetPointSelection: function(){
		this.coordinatePicker.resetPoint();
        this.bufferField.reset();
		this.resetBuffer();
	},
	
	/**
     * Imposta il layer OpenLayers per il buffer.
     * @param {OpenLayers.Layer.Vector} bufferLayer Il layer vettoriale OpenLayers che rappresenta il buffer.
     * @param {OpenLayers.Feature.Vector} bufferFeature La feature vettoriale da disegnare du mappa.
     */
	setBufferLayer: function(bufferLayer, bufferFeature){
		this.bufferLayer = bufferLayer;
		this.fireEvent('bufferadded', this, bufferFeature);
	},
	
	setDecimalPrecision: function(decimalPrecision){
		this.coordinatePicker.setDecimalPrecision(decimalPrecision);
	}
	
});
