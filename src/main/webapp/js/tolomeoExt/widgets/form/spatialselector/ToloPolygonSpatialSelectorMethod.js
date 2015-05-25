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
 * Plugin per la selezione poligonale
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod', {
	
	extend: 'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod',
	
	alias: 'widget.tolomeo_spatial_polygon_selector',
	
	requires: [
       'TolomeoExt.widgets.form.spatialselector.ToloSpatialSelectorMethod'
	],

    /**
     * @cfg {String} name.
     * Nome da mostrare nella combo box di selezione spaziale.
     */
	name  : 'Poligono',
	
	buttonCls : 'draw-polygon-button',

    /**
     * @cfg {String} label.
     * Etichetta da mostrare nella combo box di selezione spaziale.
     */
	label : 'Poligono',
	
	initComponent: function(config) {   
				
    	
		var displayProjection = this.displayProjection;
		var me = this;
		
    	this.output = Ext.create('Ext.Button', {    		
            text: "Disegna",
            tooltip: "Disegna Poligono",
            enableToggle: true,            
            iconCls: this.buttonCls,            
            height: 40,
            width: 100,
            scale: 'large',
            listeners: {
                scope: this, 
                toggle: function(button, pressed) {
                    if(pressed){      
                        me.unfreeze();
                    }else{
                        me.freeze();
                    }
                }
            }
        }); 

    	this.items = [{
    		type: 'fieldcontainer',       		
    		margin: 10,
    		border: false,
    		layout: {
    		        type: 'hbox',
    		        pack: 'center'
    		        
    		},
	    	items: [this.output]
    	}];
    	
    	this.active = false;

    	this.callParent(arguments);
    },


	/**
     * Attiva il controllo.
     * 
     */
	activate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.activate.call(this);
		this.output.enable();		
	},

	/**
     * Restituisce il controllo di disegno di questo componente.
     * 
     */
	getDrawControl: function(){
		return new OpenLayers.Control.DrawFeature(
            this.drawings,
            OpenLayers.Handler.Polygon
        );
	},

	/**
     * Disattiva il controllo.
     * 
     */
	deactivate: function(){
		TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.deactivate.call(this);
		if(this.draw){
			this.draw.deactivate();	
		}
		
		if(this.qbEventManager){
			this.qbEventManager.fireEvent("polygonSpatialSelectorDeactive", this);
		}
		
		this.output.disable();
		
		this.active = false;
		
		/*
		if (this.drawings) {
			if(this.qbEventManager){
				this.qbEventManager.fireEvent("removelayer", this.drawings);
			}
			
			this.drawings = null;
		}
		*/
	},

	/**
     * Reimposta il controllo di sidegno poligonale.
     * 
     */
    reset: function(){    	
    	TolomeoExt.widgets.form.spatialselector.ToloPolygonSpatialSelectorMethod.superclass.reset.call(this);
    	
		if(this.drawings){
			this.drawings.removeAllFeatures();
		}
		
		if(this.persistance){
			this.persistance.removeAllFeatures();
		}
    },
	
	freeze: function(){
		if(this.draw){
			this.draw.deactivate();	
		}		
		
		if(this.output.pressed){
			this.output.toggle();
		}
	},
	
	unfreeze: function(){
		
		if(!this.active) {
			
			if(this.qbEventManager){
				this.qbEventManager.fireEvent("polygonSpatialSelectorActive", this);
			}			
			this.active = true;
			
		} else {
			
			if(this.persistance){
				this.persistance.removeAllFeatures();
			}
			
			if(this.draw){
				this.draw.activate();	
			}
			
		}
						
	}
	
});
