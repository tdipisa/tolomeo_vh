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

// /////////////////////////////////////
// requires OpenLayers/Control.js
// requires OpenLayers/Handler/Box.js
// /////////////////////////////////////

/**
 * Controllo OpenLayers per la selezione del Box.
 * 
 * @extends {OpenLayers.Control}
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
OpenLayers.Control.SetBox = OpenLayers.Class(OpenLayers.Control, {

    /**
     * @cfg {OpenLayers.Control.TYPE} type [displayProjection="OpenLayers.Control.TYPE_TOOL"]
     * 
     */ 
    type: OpenLayers.Control.TYPE_TOOL,

    /**
     * @cfg {Boolean} out [out="false"]
     * 
     */ 
    out: false,
    
    /**
     * @cfg {Object} aoi [aoi="null"]
     * 
     */ 
    aoi: null,
    
    /**
     * @cfg {OpenLayers.Bounds} boxes [boxes="null"]
     * 
     */ 
    boxes: null,
    
    /**
     * @cfg {String} currentAOI
     * 
     */ 
    currentAOI: "",
    
    /**
     * @cfg {Function} onChangeAOI [onChangeAOI="null"]
     * 
     */ 
    onChangeAOI: null,
    
    /**
     * @cfg {String} layerName [layerName="AOI"]
     * 
     */ 
    layerName: "AOI",
    
    /**
     * @cfg {Object} aoiStyle [aoiStyle="null"]
     * 
     */ 
    aoiStyle: null,
    
    /**
     * @cfg {OpenLayers.Map} map
     * 
     */ 
    map: null,
    
    /**
     * @cfg {Boolean} displayInLayerSwitcher [displayInLayerSwitcher="false"]
     * 
     */ 
    displayInLayerSwitcher: false,

	/**
     * Disegna il BOX.
     * 
     */ 
    draw: function() {
       
        this.handler = new OpenLayers.Handler.Box(this,
        {
            done: this.setAOI
        }, 
        {
            boxDivClassName: this.boxDivClassName   
        },
        {
            keyMask: this.keyMask
        });
    },
    
    /**
     * Aggiorna il disegno del bbox
     * @param {Number} ascissa minima.
     * @param {Number} ordinata minima.
     * @param {Number} ascissa massima.
     * @param {Number} ordinata massima.
     * 
     */
    updateBoxDimension: function(xmin, ymin, xmax, ymax){
    	
    	if(this.aoi!=null){       
            this.boxes.removeFeatures(this.aoi);
        }
    	
    	var bounds;
    	
    	this.currentAOI = xmin + ',' + ymin + ',' + xmax + ',' + ymax;   
    	bounds = new OpenLayers.Bounds(xmin, ymin, xmax, ymax);
    	
    	if(this.layerName){
            var x=this.map.getLayersByName(this.layerName);
            var index=null;
            if(x.length>0){
                index=this.map.getLayerIndex(x[0]);
                this.map.removeLayer(x[0]);
            }
            var me=this;
            this.boxes  = new OpenLayers.Layer.Vector( this.layerName,{
                displayInLayerSwitcher: me.displayInLayerSwitcher,
                styleMap: me.aoiStyle
            });
            this.aoi = new OpenLayers.Feature.Vector(bounds.toGeometry());
            this.boxes.addFeatures(this.aoi);
            this.map.addLayer(this.boxes);

            if(index){
                this.map.setLayerIndex(this.boxes,index);
            }
        }	
    },

	/**
     * Imposta la regione di interesse risultante dal disegno dell'utente sulla mappa.
     * @param {Object} la posizione del Box nella mappa.
     * 
     */
    setAOI: function (position) {
        var control;
      
        if(this.map.enebaleMapEvent)
            control = this.map.enebaleMapEvent;
        else
            control = false;
           
        if(control){                    
            
            var xmin, ymin, xmax, ymax;
            
            if (position instanceof OpenLayers.Bounds) {
                if (!this.out) {
                	
                    var minXY = this.map.getLonLatFromPixel(
                        new OpenLayers.Pixel(position.left, position.bottom));
                    var maxXY = this.map.getLonLatFromPixel(
                        new OpenLayers.Pixel(position.right, position.top));

                    xmin = minXY.lon;
                    ymin = minXY.lat;
                    xmax = maxXY.lon;
                    ymax = maxXY.lat;
                    
                } else {
                	
                    var pixWidth = Math.abs(position.right-position.left);
                    var pixHeight = Math.abs(position.top-position.bottom);
                    var zoomFactor = Math.min((this.map.size.h / pixHeight),
                        (this.map.size.w / pixWidth));
                    var extent = this.map.getExtent();
                    var center = this.map.getLonLatFromPixel(
                        position.getCenterPixel());
                    var xmin = center.lon - (extent.getWidth()/2)*zoomFactor;
                    var xmax = center.lon + (extent.getWidth()/2)*zoomFactor;
                    var ymin = center.lat - (extent.getHeight()/2)*zoomFactor;
                    var ymax = center.lat + (extent.getHeight()/2)*zoomFactor;
                    
                }

                this.updateBoxDimension(xmin, ymin, xmax, ymax);

                if(this.onChangeAOI)
                    this.onChangeAOI();
                   
            } else { 
                //
                // it's a pixel
                //
                if (!this.out) {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() + 1);
                } else {
                    this.map.setCenter(this.map.getLonLatFromPixel(position),
                        this.map.getZoom() - 1);
                }
            }
        }      
    },

    CLASS_NAME: "OpenLayers.Control.SetBox"
    	
});
