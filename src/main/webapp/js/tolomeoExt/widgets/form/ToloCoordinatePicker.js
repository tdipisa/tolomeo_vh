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
 * Widget relativa al Form Container per la gestione del campo di selezione 
 * delle coordinate puntuali su mappa. 
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloCoordinatePicker', {
	
	extend: 'Ext.form.FieldContainer',

    alias: 'tolomeo_coordinate_picker',
	
	/**
     * @property {String} fieldLabel.
     *
     */
    fieldLabel: 'Coordinate',
	
    /**
     * @cfg {Number} fieldWidth.
     * Larghezza dei campi
     */
    fieldWidth : 100,
    
	/**
     * @property {String} pointSelectionButtionTip.
     *
     */
    pointSelectionButtionTip: 'Click per abilitare la selezione del punto',
	
	/**
     * @property {String} latitudeEmptyText.
     * Stringa da mostrare per componente non valorizzato (latitudine)
     */
    latitudeEmptyText: 'Latitudine',
	 
 	/**
      * @property {String} longitudeEmptyText.
      * Stringa da mostrare per componente non valorizzato (longitudine)
      */
    longitudeEmptyText: 'Longitudine',
	 
 	/**
     * @property {String} outputSRS.
     * Codice EPSG per la trasformazione delle coordinate in 
     * visualizzazione all'interno della form.
     */
    outputSRS: 'EPSG:4326',
    
 	/**
     * @property {String} buttonIconCls.
     * Classe di stile usata per l'icona del pulsante di selezione.
     */
    buttonIconCls:'gx-cursor',

    /**
     * @property {Object} selectStyle.
     * Configurazione del OpenLayer.Style usato come stile del punto su mappa.
     */
    selectStyle:{
        pointRadius: 4,
        graphicName: "cross",
        fillColor: "#FFFFFF",
        strokeColor: "#FF0000",
        fillOpacity:0.5,
        strokeWidth:2
    },

    /**
     * @property {Object} defaultSelectStyle.
     * Configurazione del OpenLayer.Style usato per riempire i campi mancati di "selectStyle".
     */
    defaultSelectStyle:{
        pointRadius: 4, // sized according to type attribute
        graphicName: "cross",
        fillColor: "#0000FF",
        strokeColor: "#0000FF",
        fillOpacity:0.5,
        strokeWidth:2        
    },
	
    /**
     * @cfg {Integer} decimalPrecision.
     * Massimo numero possibile di cifre decimali per i campi di coordinate.
     */
    decimalPrecision: 10,
    
    /**
     * @cfg {String} selectLayerName.
     * Nome del layer vettoriale che rappresenta il punto su mappa.
     */
    selectLayerName: "select_marker_position_layer",
    
    /**
     * @cfg {Boolean} displayInLayerSwitcher.
     * Usato per determinare se il layer vettoriale deve apparire all'interno del LayerSwitcher OpenLayers.
     */
    displayInLayerSwitcher: false,
    
	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.ToloCoordinatePicker.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent:function(config){
    	/*
        this.layout = {
            type: 'hbox'
        };
        */
        this.layout = {
                type: 'table',
                // The total column count must be specified here
                columns: 2
            };
        
        this.defaults = {
            // applied to each contained panel
            bodyStyle:'padding:0px;'
        };
		
        var compositeField = this;
		
		Ext.applyIf(this.selectStyle, this.defaultSelectStyle);
	
		this.items= [{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: this.fieldWidth,
            border: false,            
            items: [{
                xtype     : 'numberfield',
                emptyText : this.longitudeEmptyText,	
                ref:'longitudeField',
                decimalPrecision:this.decimalPrecision,
                allowBlank: false,
                name: 'lon',
				listeners: {
					scope:this,
					change: this.updatePoint
				}
            }]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',            
            rowspan: 2,
            border: false,
            bodyStyle:'padding:10px;',
            items: [{
                layout: "form",
                cellCls: 'spatial-cell',
                cls: 'center-align',
                border: false,
                items: [{
                    xtype: 'button',
    				ref:'clickToggle',
                    tooltip: this.pointSelectionButtionTip,
                    iconCls: this.buttonIconCls,
                    enableToggle: true,
                    toggleGroup: this.toggleGroup,
                    scale: 'large',
                    width: 40,
                    height: 40,
                    listeners: {
                      scope: this, 
                      toggle: function(button, pressed) {  
                         if(pressed){
                              this.selectLonLat.activate();
                          }else{
                              this.selectLonLat.deactivate();
                          }
                      }
                    }
                }]                
            }]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: this.fieldWidth,
            border: false,
            items: [ {
                xtype     : 'numberfield',
                emptyText : this.latitudeEmptyText,
                ref: 'latitudeField',
                decimalPrecision: this.decimalPrecision,
                allowBlank:false,
                name: 'lat',
				listeners: {
					scope:this,
					change: this.updatePoint
				}
            }]
        }];
        this.callParent(arguments);
        
        this.on("added", function(scope){
        	scope.latitudeField = scope.query('numberfield[ref=latitudeField]')[0];
        	scope.longitudeField = scope.query('numberfield[ref=longitudeField]')[0];
        	scope.clickToggle = scope.query('button[ref=clickToggle]')[0];
        	scope.updateStep();
        });                
    },
    
	/**
     * Controlla la validità dei valori inseriti.
     * 
     * @return {Boolean} Restituisce true se valido e false se non lo è.
     */
    isValid: function(){
    	if(this.latitudeField.isValid() &&
    	    	this.longitudeField.isValid()){
    		return true;
    	}else{
    		return false;
    	}
    },
	
	/**
     * Prende i valori dai campi e avvia la procedura di disegno sulla mappa.
     * 
     */
    updatePoint: function(){
        var lat = this.latitudeField.getValue();
		var lon = this.longitudeField.getValue();
		if( lon && lat ){
			//add point
			var lonlat = new OpenLayers.LonLat(lon,lat);
			
			 /*  DECOMMENTARE SE SI VUOLE visualizzare le coordinate nel sistema di riferimento impostato per il buffer selector
            
	            var tPoint = new Point(lonlat.lon, lonlat.lat);
	            tPoint.transform(this.outputSRS,this.projectionObject.getCode());
	            
	            lonlat.lon = tPoint.x;
	            lonlat.lat = tPoint.y;
	        */						
			
			this.updateMapPoint(lonlat);
		}
    },
	
	/**
     * Lancia l'evento per la rimozione del layer vettoriale 
     * che rappresente la selezione del punto sulla mappa.
     * 
     */
    resetMapPoint:function(){
    	this.fireEvent("reset", this.selectLayerName);
    },

	/**
     * Reimposta i campi della form e rimuove il layer dalla mappa.
     *
     */
    resetPoint:function(){
		this.latitudeField.reset();
        this.longitudeField.reset();
		
        this.resetMapPoint();
	},

	/**
     * Usato per impostare la pressione del pulsante di attivazione 
     * del controllo di disegno.
     * @param {Boolean} toggle valore del toggle da impostare per il componente Ext.
     */
	toggleButton: function(toggle){
		this.clickToggle.toggle(toggle);
	},
	
	/**
     * Aggiorna il punto sulla mappa tramite eventi gestiti dal Manager a livello superiore.
     * del controllo di disegno.
     * @param {OpenLayers.LonLat} lonlat valore delle coordinate da usare per il punto su mappa.
     */
    updateMapPoint:function(lonlat){
        if(this.selectStyle){
        	this.resetMapPoint();
        	this.fireEvent("update", lonlat, this);
        	this.fireEvent("updatebuffer", lonlat, this);
        }    
    },
	 
	/**
     * Recupera le coordinate dai campi della form.
     * del controllo di disegno.
     * @return {Array} Array delle coordinate.
     */
	getCoordinate: function(){
		return [this.longitudeField.getValue(), this.latitudeField.getValue()];
	},
	
	setDecimalPrecision: function(decimalPrecision){
		this.decimalPrecision = decimalPrecision;
		this.latitudeField.decimalPrecision = decimalPrecision;
    	this.longitudeField.decimalPrecision = decimalPrecision;
    	this.updateStep();
	},
	
	updateStep: function(){
		var step = 1/Math.pow(10,this.decimalPrecision-2);
		this.latitudeField.step  = step;
    	this.longitudeField.step = step;
	}
    
});
