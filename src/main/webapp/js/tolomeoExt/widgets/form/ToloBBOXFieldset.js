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

Ext.ns("TolomeoExt.widgets.form");

/**
 * Widget per la gestione delle funzionalità relative alla modalità di selezione
 * per BBOX 
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.ToloBBOXFieldset', {
	
	extend: 'Ext.form.FieldSet',
	
    alias: "widget.tolomeo_bboxfieldset",
 
    id: "bboxFieldSet",
  
 	/**
     * @property {String} layerName.
     * Nome da usare per il layer vettoriale che rappresenta il BBOX disegnato.
     */
    layerName: "BBOX",

    /**
     * @cfg {Integer} decimalPrecision.
     * Massimo numero possibile di cifre decimali per i campi di coordinate.
     */
    decimalPrecision: 5,
    
 	/**
     * @property {String} outputSRS.
     * Codice EPSG per la trasformazione delle coordinate in 
     * visualizzazione all'interno della form.
     */
    outputSRS: 'EPSG:4326',

 	/**
     * @cfg {Object} spatialFilterOptions.
     * Opzioni di configurazione per i campi di coordinata (valori massimi e minini consentiti per i campi).
     * 
     * @example
	 *    spatialFilterOptions: {
	 *	        lonMax: 180,   
	 *	        lonMin: -180,
	 *	        latMax: 90,   
	 *	        latMin: -90  
	 *	  }
     */
    spatialFilterOptions: {
        lonMax: null,   
        lonMin: null,
        latMax: null,   
        latMin: null  
    },

    /**
     * @cfg {Boolean} displayBBOXInLayerSwitcher.
     * Usato per determinare se il layer vettoriale deve apparire all'interno del LayerSwitcher OpenLayers.
     */
    displayBBOXInLayerSwitcher: false,

    /**
     * @property {Object} defaultStyle.
     * Configurazione del OpenLayer.Style predefinito usato come stile del BBOX su mappa.
     */
	defaultStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

    /**
     * @property {Object} selectStyle.
     * Configurazione del OpenLayer.Style di selezione usato come stile del BBOX su mappa.
     */
	selectStyle : {
		"strokeColor" : "#ee9900",
		"fillColor" : "#ee9900",
		"fillOpacity" : 0.4,
		"strokeWidth" : 1
	},

    /**
     * @property {Object} temporaryStyle.
     * Configurazione del OpenLayer.Style temporaneo usato come stile del BBOX su mappa.
     */
	temporaryStyle : {
		"pointRadius" : 6,
		"fillColor" : "#FF00FF",
		"strokeColor" : "#FF00FF",
		"label" : "Select",
		"graphicZIndex" : 2
	},

 	/**
     * @property {String} northLabel.
     * Testo dell'etichetta per la coordinata Nord.
     */
    northLabel: "Nord",
    
 	/**
     * @property {String} westLabel.
     * Testo dell'etichetta per la coordinata Ovest.
     */
    westLabel: "Ovest",
    
 	/**
     * @property {String} eastLabel.
     * Testo dell'etichetta per la coordinata Est.
     */
    eastLabel: "Est",
    
 	/**
     * @property {String} southLabel.
     * Testo dell'etichetta per la coordinata Sud.
     */
    southLabel: "Sud",
    
 	/**
     * @property {String} setAoiText.
     * Testo di etichetta per il pulsante di attivazione del controllo di disegno del BOX.
     */
    setAoiText: "ROI",
    
 	/**
     * @property {String} setAoiTooltip.
     * Testo per il tooltip del pulsante di attivazione del controllo di disegno del BOX.
     */
    setAoiTooltip: "Abilita il controllo Box per il disegno della ROI (BBOX) sulla mappa",
    
    /**
     * @property {String} currentExtentLabel.
     * Labe del checkbox per la selezione dell'estenzione corrente della mappa
     */
    currentExtentLabel: "Inquadramento",
    
 	/**
     * @property {String} title.
     * Titolo del field set di contenimento.
     */
    title: "Regione di interesse",

	/**
     * Inizializza un nuovo TolomeoExt.widgets.form.ToloBBOXFieldset.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config) {       
    	this.addEvents(
		        /**
				 * @event
				 * Lanciato quando è stata attivata la modalità per prendere le estensioni della mappa
				 */
				"mapExtentActive",
				/**
				 * @event
				 * Lanciato quando è stata disattivata la modalità per prendere le estensioni della mappa
				 */
				"mapExtentDeactive"
		);	
    	
        this.autoHeight = true;
        this.layout = {
            type: 'table',
            // The total column count must be specified here
            columns: 3
        },
		
        this.defaults = {
            // applied to each contained panel
            bodyStyle:'padding:3px'
        };
		
        this.bodyCssClass = 'aoi-fields';
        
        // Define handlar box style
        Ext.util.CSS.createStyleSheet(".olHandlerBoxZoomBox_"+this.id+" {\n"
            +" border-width:" + 5 + "px; \n"
            +" border-style:solid; \n"
            +" border-color: " + "#66cccc" + ";"
            +" position: absolute; \n"
            +" background-color: " + "#66cccc" + "; \n"
            +" opacity: "+0.5+"; \n"
            +" font-size: 1px; \n"
            +" filter: alpha(opacity="+0.5 * 100+"); \n"
            +"}",
            "olHandlerBoxZoomBox_"+this.id);   
        
        var me = this;

        this.northField = Ext.create('Ext.form.NumberField', {
            fieldLabel: me.northLabel,
            labelAlign: "top",
            id: me.id+"_NorthBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: me.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        this.westField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.westLabel,
            labelAlign: "top",
            id: me.id+"_WestBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        this.eastField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.eastLabel,
            labelAlign: "top",
            id: me.id+"_EastBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
              
        this.southField = Ext.create('Ext.form.NumberField', {
            fieldLabel: this.southLabel,
            labelAlign: "top",
            id: me.id+"_SouthBBOX",
            width: 100,
            allowBlank: false,
            decimalPrecision: this.decimalPrecision,
            allowDecimals: true,
            hideLabel : false                    
        });
        
        if(this.spatialFilterOptions.lonMin && this.spatialFilterOptions.lonMax){
            this.southField.minValue=this.spatialFilterOptions.lonMin;
            this.southField.maxValue=this.spatialFilterOptions.lonMax;
            this.northField.minValue=this.spatialFilterOptions.lonMin;
            this.northField.maxValue=this.spatialFilterOptions.lonMax;
        }
        
        if(this.spatialFilterOptions.latMin && this.spatialFilterOptions.latMax){
            this.eastField.minValue=this.spatialFilterOptions.latMin;
            this.eastField.maxValue=this.spatialFilterOptions.latMax;
            this.westField.minValue=this.spatialFilterOptions.latMin;
            this.westField.maxValue=this.spatialFilterOptions.latMax;
        }
        
        this.bboxButton = Ext.create('Ext.Button', {
            text: this.setAoiText,
            tooltip: this.setAoiTooltip,
            enableToggle: true,
            toggleGroup: this.toggleGroup,
            iconCls: 'aoi-button',
            height: 50,
            width: 50,
            listeners: {
                scope: this, 
                toggle: function(button, pressed) {
                    if(pressed){      
                        //
                        // Activating the new control
                        //   
                        this.selectBBOX.activate();
                    }else{
                        this.selectBBOX.deactivate();
                    }
                }
            }
        }); 
        
        this.mapExtentChkBox = Ext.create('Ext.form.Checkbox', {
        	fieldLabel: this.currentExtentLabel,
        	handler : function(cmp,checked){
        		if(checked){
        			me.fireEvent('mapExtentActive',me);
        		} else {            			
        			me.fireEvent('mapExtentDeactive',me);            			
        		}
        	}
        });
                     
        this.items = [{
        	layout: "form",
            cellCls: 'spatial-cell',            
            border: false,
            colspan: 3,
            items: [this.mapExtentChkBox,{
            	xtype: 'menuseparator'
            }]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            colspan: 3,
            items: [this.northField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            items: [this.westField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            border: false,
            items: [this.bboxButton]                
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            items: [this.eastField]
        },{
            layout: "form",
            cellCls: 'spatial-cell',
            cls: 'center-align',
            width: 100,
            border: false,
            colspan: 3,
            items: [this.southField]
        }];
            
        this.listeners = {
           "afterlayout": function(){
				if(this.ownerCt.qbEventManager){
					this.ownerCt.qbEventManager.fireEvent("afterboxlayout", {scope: me});
				}
            },
            beforecollapse : function(p) {
				if(this.ownerCt.qbEventManager){
					this.ownerCt.qbEventManager.fireEvent("removelayer", this.layerName);
				}
            }
          
        };

        this.callParent();
    },
    
	/**
     * Reimposta il pannello.
     * 
     */
    reset: function(){
		if(this.ownerCt.qbEventManager){
			this.ownerCt.qbEventManager.fireEvent("removebboxlayer", {scope: this});
		}
        this.northField.reset();
        this.southField.reset();
        this.eastField.reset();
        this.westField.reset(); 
        this.mapExtentChkBox.reset();
		this.fireEvent('unselect', this);
    },

	/**
     * Controlla la validità dei valori inserito.
     * 
     * @return {Boolean} Restituisce true se valido e false se non lo è.
     */
    isValid: function(){
        return(this.westField.isValid() &&
            this.southField.isValid() && 
            this.eastField.isValid() && 
            this.northField.isValid());
    },
    
	/**
     * Controlla se i campi della form sono sttai modificati.
     * 
     * @return {Boolean} Restituisce true se modificati e false altrimenti.
     */
    isDirty: function(){
        return(this.westField.isDirty() &&
            this.southField.isDirty() && 
            this.eastField.isDirty() && 
            this.northField.isDirty());
    },

	/**
     * Restituisce i BBOX selezionato nella proiezione configurata.
     * 
     * @return {OpenLayers.Bounds} Il Bounding Box selezionato.
     */
    getBBOXBounds: function(){
        return new OpenLayers.Bounds(
            this.westField.getValue(), 
            this.southField.getValue(), 
            this.eastField.getValue(), 
            this.northField.getValue()
        );
    },

	setDecimalPrecision: function(decimalPrecision){
		this.northField.decimalPrecision = decimalPrecision;
        this.southField.decimalPrecision = decimalPrecision;
        this.eastField.decimalPrecision = decimalPrecision;
        this.westField.decimalPrecision = decimalPrecision; 
	}
    
});
