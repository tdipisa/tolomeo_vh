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
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Handler/Point.js
 * @requires OpenLayers/Geometry/Point.js
 * @requires OpenLayers/Geometry/LineString.js
 */

/**
 * Class: OpenLayers.Handler.PointFromRef
 * Handler to draw a point that have a defined distance from another.  
 * Point of reference is set by mousedown. You can fix the distance by
 * the property defaultDistance, or set it by another mousedown.
 * After this step you can choose only the direction.
 *
 * Inherits from:
 *  - <OpenLayers.Handler.Point>
 */
OpenLayers.Handler.PointFromRef = OpenLayers.Class(OpenLayers.Handler.Point, {
    
    /**
     * Property: defaultDistance
     * {Number} This property fix the distance from th reference point.
     */
    defaultDistance: null,
        
    /**
     * Property: drawDistance
     * {Boolean} If true the Handler allows to set the distance from
     * reference point by a click of the mouse.
     */
    drawDistance: true,
    
    /**
     * Property: line
     * {<OpenLayers.Feature.Vector>}
     */
    line: null,
    
    /**
     * Method: setDistance
     * Set the distance from the point of reference.
     * This has no effect on defaultDistance
     *
     * Returns:
     * {Boolean}
     */
    setDistance: function (d){
    	this.distance = d;
    	if(this.drawing){
    		this.modifyFeature(); 
    		this.drawFeature();
    	}
    	this.callback("distance", [this.distance]);
    },

    /**
     * Constructor: OpenLayers.Handler.Path
     * Create a new path hander
     *
     * Parameters:
     * control - {<OpenLayers.Control>} 
     * callbacks - {Object} An object with a 'done' property whose value is a
     *     function to be called when the point drawing is finished. he callback should expect to recieve a single argument,
     *     the point geometry. 
     *     If the callbacks object contains a 'refPoint' property, 
     *     this function will be sent when the reference point is set.
     *     If the callbacks object contains a 'distance' property, 
     *     this function will be sent when the distance is set or when the distance
     *     is not set and the mousemove.
     *     If the callbacks object contains a
     *     'cancel' property, this function will be called when the
     *     handler is deactivated while drawing.   
     *     If the callbacks object contains a 'cancel' property, this function 
     *     will be called when the handler is deactivated while drawing. The 
     *     cancel should expect to receive a geometry.
     * options - {Object} An optional object with properties to be set on the
     *           handler
     */
    initialize: function(control, callbacks, options) {
    	    	
        OpenLayers.Handler.Point.prototype.initialize.apply(this, arguments);
        this.distance = null;    
        this.toFinalize = false;    
         // cache the bound event listener method so it can be unobserved later
        this.eventListener = OpenLayers.Function.bindAsEventListener(
            this.keydown, this
        );
        
    },
    
    /**
     * APIMethod: activate
     * turn on the handler
     */
    activate: function() {
        if(OpenLayers.Handler.Point.prototype.activate.apply(this, arguments)) {
    		OpenLayers.Event.observe(
                    document, "keydown", this.eventListener);
                    /*
            if(this.defaultDistance){
            	this.distance = this.defaultDistance;
            }
            */
            return true;
        }else{
        	return false;
        }
    },
    
    /**
     * APIMethod: deactivate
     * turn off the handler
     */
    deactivate: function() {
    	var deactivated = false;
        if (OpenLayers.Handler.Point.prototype.deactivate.apply(this, arguments)) {
            OpenLayers.Event.stopObserving(document, "keydown", this.eventListener);                       
            deactivated = true;
        }
        return deactivated;        
    },
    
        
    /**
     * Method: createFeature
     * Add temporary geometries
     */
    createFeature: function() {
        
		this.refPoint = new OpenLayers.Feature.Vector(
                                        new OpenLayers.Geometry.Point());                                        
		this.finalPoint = new OpenLayers.Feature.Vector(
                                        new OpenLayers.Geometry.Point());       
        this.line = new OpenLayers.Feature.Vector(
                                        new OpenLayers.Geometry.LineString());
        this.point = new OpenLayers.Feature.Vector(
                                        new OpenLayers.Geometry.Point());                                 
    },
        
    /**
     * Method: destroyFeature
     * Destroy temporary geometries and reset distance
     */
    destroyFeature: function() {
        OpenLayers.Handler.Point.prototype.destroyFeature.apply(this);
        if(this.line) {
            this.line.destroy();
        }
         
        if(this.refPoint) {
            this.refPoint.destroy();
        }       
         
        if(this.finalPoint) {
            this.finalPoint.destroy();
        }
               
        this.line = null;
        this.refPoint = null;
        this.finalPoint = null;     
        this.toFinalize = false;
        if(!this.defaultDistance){
        	this.distance = null;
        }else{
        	this.distance = this.defaultDistance;
        }
    },
    
    /**
     * Method: addPoint
     * Add point to geometry.  Send the point index to override
     * the behavior of LinearRing that disregards adding duplicate points.
     */
    addPoint: function() {
        this.line.geometry.addComponent(this.point.geometry.clone(),
                                        this.line.geometry.components.length);
    },

    /**
     * Method: modifyFeature
     * Modify the existing geometry given the new point
     */
    modifyFeature: function() {
        var index = this.line.geometry.components.length - 1;
      
        // Creo sempre e comunque un clone, perchï¿½ Internet Explorer altrimenti fa cose strane
        // a basse scale
    	var tmpPoint = this.point.geometry.clone();
    	     
    	if(this.distance){   	
    		var scale = this.distance/this.point.geometry.distanceTo(this.refPoint.geometry);
    		tmpPoint.resize(scale,this.refPoint.geometry);
    	}    
    	
    	this.finalPoint.geometry.x = tmpPoint.x;
    	this.finalPoint.geometry.y = tmpPoint.y;
    	this.line.geometry.components[index].x = tmpPoint.x;
    	this.line.geometry.components[index].y = tmpPoint.y;   	
      
        this.line.geometry.components[index].clearBounds();
    },
    
    /**
     * Method: drawFeature
     * Render geometries on the temporary layer.
     */
    drawFeature: function() {
        
        // se ï¿½ stato impostato il punto di riferimento e la distanza
        // non mostro piï¿½ il punto sotto il mouse       
        if(this.refPoint && this.distance){
        	this.layer.drawFeature(this.point, {
                strokeOpacity: 0,
                fillOpacity: 0
            });        	       
        }else{
        	this.layer.drawFeature(this.point, this.style);
        }
        this.layer.drawFeature(this.line, this.style);
        
        this.layer.drawFeature(this.refPoint, this.style);
        
        this.layer.drawFeature(this.finalPoint, this.style);
    },

    /**
     * Method: geometryClone
     * Return a clone of the relevant geometry.
     *
     * Returns:
     * {<OpenLayers.Geometry.LineString>}
     */    
    geometryClone: function() {
        return this.finalPoint.geometry.clone();
    },

    /**
     * Method: mousedown
     * Handle mouse down.  Add a new point to the geometry and
     * render it. Return determines whether to propagate the event on the map.
     * 
     * Parameters:
     * evt - {Event} The browser event
     *
     * Returns: 
     * {Boolean} Allow event propagation
     */
    mousedown: function(evt) {
        // ignore double-clicks
        if(!this.drawing) {
            this.createFeature();
        }
        this.mouseDown = true;
        this.lastDown = evt.xy;
        var lonlat = this.control.map.getLonLatFromPixel(evt.xy);

        if(!this.drawing){
        	this.point.geometry.x = lonlat.lon;
        	this.point.geometry.y = lonlat.lat;
        	this.addPoint();
        	this.addPoint();
        	this.refPoint.geometry.x = lonlat.lon;
        	this.refPoint.geometry.y = lonlat.lat;
          	this.callback("refPoint", [this.point.geometry]);
          	// quando aggiungo il primo punto se c'ï¿½ una distanza di default la setto
          	if(this.defaultDistance){
            	this.setDistance(this.defaultDistance);
            }
          	this.drawFeature();
        }else if(this.lastUp != null /*&& !this.lastUp.equals(evt.xy)*/){
        	// se la distanza ï¿½ stata impostata
        	if(this.distance){
        		var scale = this.distance/this.point.geometry.distanceTo(this.refPoint.geometry);
        		this.finalPoint.geometry.x = lonlat.lon;
        		this.finalPoint.geometry.y = lonlat.lat;
        		this.finalPoint.geometry.resize(scale,this.refPoint.geometry);
        		this.toFinalize = true;
            	//this.finalize();
            	return false;            	
        	}
        	// se la distanza non ï¿½ stata impostata ma ï¿½ attivo il flag che mi permette di settarla con il click
        	else if(this.drawDistance){
        		//this.distance = this.point.geometry.distanceTo(this.refPoint.geometry);
        		this.setDistance(this.point.geometry.distanceTo(this.refPoint.geometry));        		
        	}
        }                
        this.drawing = true;
        return false;
    },

    /**
     * Method: mousemove
     * Handle mouse move.  Adjust the geometry and redraw.
     * Return determines whether to propagate the event on the map.
     * 
     * Parameters:
     * evt - {Event} The browser event
     *
     * Returns: 
     * {Boolean} Allow event propagation
     */
    mousemove: function (evt) {
        if(this.drawing && !this.mouseDown) { 
            var lonlat = this.map.getLonLatFromPixel(evt.xy);
            this.point.geometry.x = lonlat.lon;
            this.point.geometry.y = lonlat.lat;
            
            if(this.distance){            	
            	//this.callback("distance", [this.distance]);
            }else{
            	this.callback("distance", [this.point.geometry.distanceTo(this.refPoint.geometry)]);
            }            
            this.modifyFeature();            
            this.drawFeature();
        }
        return true;
    },
    
    /**
     * Method: mouseup
     * Handle mouse up.  Send the latest point in the geometry to
     * the control. Return determines whether to propagate the event on the map.
     * 
     * Parameters:
     * evt - {Event} The browser event
     *
     * Returns: 
     * {Boolean} Allow event propagation
     */
    mouseup: function (evt) {
        this.mouseDown = false;
        if(this.drawing) {
        	if(this.toFinalize){   
        		// finalizzo sul mouse up e poi comincio a ritrasmettere gli eventi     		
	        	this.finalize();        		
        	}else{
	            this.lastUp = evt.xy;            
        	}
        	return false;
        }
        return true;
    },
    
    keydown: function(evt){
    	if(evt.keyCode == 46){
    		if(this.drawing){
    			if(!this.drawDistance || !this.distance){
    				this.cancel();
    			}else{
    				this.setDistance(null);
    				this.callback("distance", [this.point.geometry.distanceTo(this.refPoint.geometry)]);    				
    			}
    		}
    		return false;	
    	}
    	return true;
    },

    CLASS_NAME: "OpenLayers.Handler.PointFromRef"
});

