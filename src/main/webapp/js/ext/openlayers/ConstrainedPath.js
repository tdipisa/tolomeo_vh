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
 * Class: OpenLayers.Handler.Path
 * Handler to draw a path on the map.  Path is displayed on mouse down,
 * moves on mouse move, and is finished on mouse up.
 *
 * Inherits from:
 *  - <OpenLayers.Handler.Point>
 */
OpenLayers.Handler.ConstrainedPath = OpenLayers.Class(OpenLayers.Handler.Point, {
    
    /**
     * Property: line
     * {<OpenLayers.Feature.Vector>}
     */
    line: null,
    
    /**
     * Property: ring
     * {Boolean} Set the line as closed ring. Default false
     */
    ring: false,
       
    /**
     * Property: infoOnMouse
     * {Boolean} Set the line information as length and angle on a mouse popup. 
     * Default true.
     */
    infoOnMouse: false,
    
    /**
     * Property: relativeAngle
     * {Boolean} Set angles as relative to previous side and not to Horizontal.
     * Default true.
     */
    relativeAngle: true,
        
    /*
     * Costante da non cambiare.
     */
    N_COINCIDING_FIRST_POINT: 2,    
    
    /**
     * Method: activate
     * Activate event observation for the keyboard
     * Returns:
     * {Boolean} true if ok.
     */
    activate: function(){
    	if(OpenLayers.Handler.Point.prototype.activate.apply(this, arguments)) {
    		OpenLayers.Event.observe(document, "keydown", this.eventListener);
            return true;
        }else{
        	return false;
        }
    },
    
    /**
     * Method: deactivate
     * Remove event observation for the keyboard
     * Returns:
     * {Boolean} true if ok.
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
     * Method: setRelativeAngle
     * Set the angle as relative to the previous side. If the
     * parameter is false the angle is relative to horizontal
     * 
     * Parameters:
     * isRelative - {Boolean} 
     */
    setRelativeAngle: function(isRelative){
    	if(isRelative){
    		this.relativeAngle = true;
    	}else{
    		this.relativeAngle = false;
    	}
    },
    
    /**
     * Method: runCommand
     * Check if the command is relative to the previous point
     * and set the next point.
     * 
     * Parameters:
     * command - {String} CAD command
     */
    runCommand: function (command){    	
    	var isRelative = command.charAt(0) == '@'; 
    	if(isRelative){
    		command = command.substring(1);
    	}
    	//if((!command || command=="CH") && this.ring && this.line.geometry.components.length >= (this.N_COINCIDING_FIRST_POINT + 2)){    		
    	if((!command || command=="END")){
    		this.dblclick();
    	}else{
    		this.setNextPoint(command, isRelative);
    	}
    },
    
    setNextPoint: function (command, isRelative){
    	    	    	
    	// modulo ed angolo
    	if(command.indexOf('<') != -1){
    		
    		var modulo_angolo = command.split("<");    		    	
    		this.setNextMA(modulo_angolo[0],modulo_angolo[1]);    		
    		
    	// x e y
    	}else if (command.indexOf(',') != -1){
    		
    		var x_y = command.split(",");
    		this.setNextXY(x_y[0],x_y[1]);    		    		
    		    		
		// solo modulo    		
    	}else{
    		if(!isNaN(command)){
    			this.setNextMA(command,null); 
    		}
    	}
    	/*
    	if(this.drawing){
    		this.modifyFeature(); 
    		this.drawFeature();
    	}
    	this.callback("distance", [this.distance]);
    	*/
    },
    
    setNextMA: function (modulo,angolo){
    	
    	var m = null;
    	var a = null;
    			
		if(modulo){
			if(!isNaN(modulo)){
				m = modulo;
			}    				
		}
		if(angolo){
			if(!isNaN(angolo)){
				a = angolo;
			}    				
		}
		
		this.setConstraint(true,m,a);
    },
    
    setNextXY: function (dx,dy){
    	var x = null;
    	var y = null;
    			
		if(dx){
			if(!isNaN(dx)){
				x = dx;
			}    				
		}
		if(dy){
			if(!isNaN(dy)){
				y = dy;
			}    				
		}
		
		this.setConstraint(false,x,y);
    	
    },
    
    clearConstraint : function(){
    	this.constraint = null;
    },
    
    setConstraint : function(isPolar,firstCoord,secondCoord){
    	this.constraint = {x:null,y:null,modulo:null,angolo:null};
    	this.constraint.isPolar = isPolar;
    	if(isPolar){
    		this.constraint.modulo = firstCoord;
    		this.constraint.angolo = secondCoord;    		    	
    	}else{
    		this.constraint.x = firstCoord;
    		this.constraint.y = secondCoord;    		
    	}
    	
    	// se entrambe i vincoli sono impostati il punto ï¿½ definito e quindi lo si inserisce
    	if( (this.constraint.modulo && this.constraint.angolo) || (this.constraint.x && this.constraint.y) ){
    			this.updatePoint();
    			//var g = this.point.geometry.clone();
    			var p = new OpenLayers.Pixel(this.point.geometry.x,this.point.geometry.y);
    			var evt = {xy:p};
    			this.mousedown(evt);
    			this.mouseup(evt);
    			/*
    			this.addPoint(p);
    			*/
    			this.clearConstraint();
    	} 
    },
    
	createInfoPopup: function(lonlat){
		if(this.popup){
			this.destroyInfoPopup();
		}
		this.popup = new OpenLayers.Popup.Anchored("infoOnMouse",lonlat,new OpenLayers.Size(100,30),"",{size : new OpenLayers.Size(0,0), offset : new OpenLayers.Pixel(0,0)});
        this.popup.setOpacity(0.6);
        this.popup.setBorder("solid black 1px");        
        this.control.map.addPopup(this.popup);
        this.popup.hide(); 
	},
	
	destroyInfoPopup: function(){
		this.control.map.removePopup(this.popup);
		this.popup.destroy();
		this.popup = null;
	},
	
	updateInfoPopup: function(pixel,distance,angoloRAD){
		
		this.popup.hide();      
		var gradiS = angoloRAD*180/Math.PI;
		var gradi = Math.floor(gradiS);
		var primi = Math.round((gradiS - gradi)*60);
		
		var html  = "<div>Distanza = " + Math.round(distance*100)/100;
		    html += "<br />";
		    html += "Angolo = " + gradi + "<sup>o</sup>" + primi + "<sup>'</sup></div>";
        this.popup.setContentHTML(html);                
        this.popup.updateSize();
        
        var popupPos = pixel.clone();

        var relPos = this.popup.relativePosition;
         
        var relPosX = relPos.charAt(1);
        var relPosY = relPos.charAt(0);

        var offsetX = 0;
        var offsetY = 0;
        
        if (relPosX == 'l') {
            offsetX -= 10;
        } else 
        if (relPosX == 'r') {
            offsetX += 10;
        }        
        if (relPosY == 't') {
            offsetY -= 10;
        } else 
        if (relPosY == 'b') {
            offsetY += 10;
        }
        
        this.popup.anchor.offset = new OpenLayers.Pixel(offsetX,offsetY);
        this.popup.lonlat = this.control.map.getLonLatFromPixel(popupPos);                
        this.popup.show();        
        
	},
	
	updatePoint: function(){
		
		var nPoints = this.line.geometry.components.length;
        var lastPoint = this.line.geometry.components[this.line.geometry.components.length-this.N_COINCIDING_FIRST_POINT];
        
		if(this.constraint != null){
        	if(this.constraint.isPolar){
        		        		
        		if(this.constraint.angolo){
        			
        			var rad = this.constraint.angolo * Math.PI / 180;
        			
        			var d = (this.constraint.modulo)?this.constraint.modulo:this.point.geometry.distanceTo(lastPoint);
        			        			
        			// angolo rispetto all'orizzontale
	        		if(nPoints == this.N_COINCIDING_FIRST_POINT){	        			
	        			this.point.geometry.x = lastPoint.x + ( d * Math.cos(rad));
	        			this.point.geometry.y = lastPoint.y + ( d * Math.sin(rad));
	        		// angolo rispetto a quello del lato precedente	
	        		}else if (nPoints > this.N_COINCIDING_FIRST_POINT){
	        			if(this.relativeAngle){
		        			var dx = lastPoint.x - this.line.geometry.components[this.line.geometry.components.length-(this.N_COINCIDING_FIRST_POINT+1)].x; 
		        			var dy = lastPoint.y - this.line.geometry.components[this.line.geometry.components.length-(this.N_COINCIDING_FIRST_POINT+1)].y;
		        			var a = Math.atan2(dy,dx);
		        			rad += a;
	        			}
	        			this.point.geometry.x = lastPoint.x + ( d * Math.cos(rad));
	        			this.point.geometry.y = lastPoint.y + ( d * Math.sin(rad));
	        		}
	        	// Il modulo ï¿½ stato messo in else per evitare problemi nel caso in cui il punto sia nella stessa posizione del precedente.
        		}else if(this.constraint.modulo){
        			var scale = this.constraint.modulo/this.point.geometry.distanceTo(lastPoint);        			
    				this.point.geometry.resize(scale,this.line.geometry.components[this.line.geometry.components.length-this.N_COINCIDING_FIRST_POINT]);
        		}
        		
        		        		
        	}else{
        		if (nPoints >= this.N_COINCIDING_FIRST_POINT){
	        		if(this.constraint.x){	  		
	        			this.point.geometry.x = lastPoint.x + Number(this.constraint.x);
	        		}
	        		if(this.constraint.y){
	        			this.point.geometry.y = lastPoint.y + Number(this.constraint.y);
	        		}
        		}
        	}
        }
	},
	
	fromAbsoluteToRelativeAngle: function(rad){
		var nPoints = this.line.geometry.components.length;
        var lastPoint = this.line.geometry.components[this.line.geometry.components.length-this.N_COINCIDING_FIRST_POINT];	
		if (nPoints > this.N_COINCIDING_FIRST_POINT){
			var dx = lastPoint.x - this.line.geometry.components[this.line.geometry.components.length-(this.N_COINCIDING_FIRST_POINT+1)].x; 
			var dy = lastPoint.y - this.line.geometry.components[this.line.geometry.components.length-(this.N_COINCIDING_FIRST_POINT+1)].y;
			var a = Math.atan2(dy,dx);
			rad -= a;
		}
		return rad;
	},
	
	/**
	 * Method: clearFirstPoint
     * Remove first point of the path.
     * Is usefull if first poi is used as reference point
	 */
	clearFirstPoint: function(){
		this.clearFirstOrLastPoint(true);
	},
	
	/**
	 * Method: clearFirstPoint
     * Remove first point of the path.
     * Is usefull if first poi is used as reference point
	 */
	clearLastPoint: function(){
		this.clearFirstOrLastPoint(false);
	},
	
	clearFirstOrLastPoint: function(first){
		if(this.line){
			if(this.line.geometry.components.length > this.N_COINCIDING_FIRST_POINT){
				this.line.geometry.removeComponent(this.line.geometry.getVertices()[first?0:this.line.geometry.getVertices().length-2]);
				this.drawFeature();
			}
		}
	},
	
    /**
     * Constructor: OpenLayers.Handler.Path
     * Create a new path hander
     *
     * Parameters:
     * control - {<OpenLayers.Control>} The control that owns this handler
     * callbacks - {Object} An object with a properties whose values are
     *     functions.  Various callbacks described below.
     * options - {Object} An optional object with properties to be set on the
     *           handler
     *
     * Named callbacks:
     * create - Called when a sketch is first created.  Callback called with
     *     the creation point geometry and sketch feature.
     * modify - Called with each move of a vertex with the vertex (point)
     *     geometry and the sketch feature.
     * point - Called as each point is added.  Receives the new point geometry.
     * done - Called when the point drawing is finished.  The callback will
     *     recieve a single argument, the linestring geometry.
     * cancel - Called when the handler is deactivated while drawing.  The
     *     cancel callback will receive a geometry.
     */
    initialize: function(control, callbacks, options) {    	
        OpenLayers.Handler.Point.prototype.initialize.apply(this, arguments);
        // cache the bound event listener method so it can be unobserved later
        this.eventListener = OpenLayers.Function.bindAsEventListener(
            this.keydown, this
        );
    },
        
    /**
     * Method: createFeature
     * Add temporary geometries
     *
     * Parameters:
     * pixel - {<OpenLayers.Pixel>} The initial pixel location for the new
     *     feature.
     */
    createFeature: function(pixel) {
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString([this.point.geometry])
        );
        
        if(this.infoOnMouse){
        	this.createInfoPopup(lonlat);
        }        
        this.callback("create", [this.point.geometry, this.getSketch()]);
        this.point.geometry.clearBounds();
        this.layer.addFeatures([this.line, this.point], {silent: true});
//        this.setConstraint(true,null,-90);
    },
        
    /**
     * Method: destroyFeature
     * Destroy temporary geometries
     */
    destroyFeature: function() {
        OpenLayers.Handler.Point.prototype.destroyFeature.apply(this);
        this.line = null;
        this.drawing = false;
        if(this.popup){
        	this.destroyInfoPopup();
        }          
    },

    /**
     * Method: removePoint
     * Destroy the temporary point.
     */
    removePoint: function() {
        if(this.point) {
            this.layer.removeFeatures([this.point]);
        }
    },
    
    /**
     * Method: addPoint
     * Add point to geometry.  Send the point index to override
     * the behavior of LinearRing that disregards adding duplicate points.
     *
     * Parameters:
     * pixel - {<OpenLayers.Pixel>} The pixel location for the new point.
     */
    addPoint: function(pixel) {
        this.layer.removeFeatures([this.point]);
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat)
        );
        this.line.geometry.addComponent(
            this.point.geometry, this.line.geometry.components.length
        );
        
        if(this.line.geometry.components.length == this.N_COINCIDING_FIRST_POINT){
        	this.callback("firstPoint", [this.point.geometry, this.getGeometry()]);        	        	
        }
        this.callback("point", [this.point.geometry, this.getGeometry()]);
        this.callback("modify", [this.point.geometry, this.getSketch()]);
        this.clearConstraint();
        this.drawFeature();
        this.callback("aftermodify", [this.point.geometry, this.getSketch()]);
    },
    
    /**
     * Method: freehandMode
     * Determine whether to behave in freehand mode or not.
     *
     * Returns:
     * {Boolean}
     */
     /*
    freehandMode: function(evt) {
        return (this.freehandToggle && evt[this.freehandToggle]) ?
                    !this.freehand : this.freehand;
    },
    * */

    /**
     * Method: modifyFeature
     * Modify the existing geometry given the new point
     *
     * Parameters:
     * pixel - {<OpenLayers.Pixel>} The updated pixel location for the latest
     *     point.
     */
    modifyFeature: function(pixel) {
    	if(!this.point){
    		this.createFeature(pixel);
    	}
    	
        var lonlat = this.control.map.getLonLatFromPixel(pixel);
        this.point.geometry.x = lonlat.lon;
        this.point.geometry.y = lonlat.lat;
        
        var nPoints = this.line.geometry.components.length;
        
        var lastPoint = this.line.geometry.components[this.line.geometry.components.length-this.N_COINCIDING_FIRST_POINT];
        this.updatePoint();
        
        this.callback("modify", [this.point.geometry, this.getSketch()]);
        
        if(this.point.geometry && lastPoint){
	        var distance = this.point.geometry.distanceTo(lastPoint);
	        if(this.infoOnMouse){        	
	        	var angolo = 0;
	        	if(this.constraint && this.constraint.angolo){
	        		angolo = this.constraint.angolo*Math.PI/180;
	        	}else{
	        		var dx = this.point.geometry.x - lastPoint.x; 
		        	var dy = this.point.geometry.y - lastPoint.y;
		        	var a = Math.atan2(dy,dx);
		        	angolo = a;
	        	}
	        	this.updateInfoPopup(pixel,this.point.geometry.distanceTo(lastPoint),this.relativeAngle?this.fromAbsoluteToRelativeAngle(angolo):angolo);
	        }
	        this.callback("distance", [distance]);
        }        
        
        this.point.geometry.clearBounds();
        this.drawFeature();
        this.callback("aftermodify", [this.point.geometry, this.getSketch()]);
    },

    /**
     * Method: drawFeature
     * Render geometries on the temporary layer.
     */
    drawFeature: function() {
        this.layer.drawFeature(this.line, this.style);
        this.layer.drawFeature(this.point, this.style);        
        //this.layer.drawFeature(new OpenLayers.Feature.Vector(this.line.geometry.components[this.line.geometry.components.length-this.N_COINCIDING_FIRST_POINT]), this.style);
    },

    /**
     * Method: getSketch
     * Return the sketch feature.
     *
     * Returns:
     * {<OpenLayers.Feature.Vector>}
     */
    getSketch: function() {
        return this.line;
    },
    
    /*
    geometryClone: function() {
        //return this.line.geometry.components[this.line.geometry.components.length-this.N_COINCIDING_FIRST_POINT].clone();
        return this.point.geometry.clone();
    },
    */

    /**
     * Method: getGeometry
     * Return the sketch geometry.  If <multi> is true, this will return
     *     a multi-part geometry.
     *
     * Returns:
     * {<OpenLayers.Geometry.LineString>}
     */
    getGeometry: function() {
        var geometry = this.line && this.line.geometry;
        if(geometry && this.multi) {
            geometry = new OpenLayers.Geometry.MultiLineString([geometry]);
        }
        return geometry;
    },
    
    drawFirstPoint: function(lon,lat){
    	if(this.lastDown)
    		return;
    	var pixel = this.control.map.getPixelFromLonLat(new OpenLayers.LonLat(lon,lat));
    	var evt = {xy:pixel};
    	this.mousedown(evt);
    	this.mouseup(evt);
    	this.mousemove(evt);
    },
    
    undo: function(){
    	if(this.drawing){
    		if(this.constraint){
    			this.clearConstraint();
    		}else if(this.line.geometry.components.length > this.N_COINCIDING_FIRST_POINT){
    			this.clearLastPoint();
    		}else if(this.line.geometry.components.length <= this.N_COINCIDING_FIRST_POINT){
    			this.removePoint();
    			this.cancel();
    		}
    	}    	
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
    	
        if (this.lastDown && this.lastDown.equals(evt.xy)) {
            return false;
        }
        if(this.lastDown == null) {
            if(this.persist) {
                this.destroyFeature();
            }
            //this.createFeature(evt.xy);
        } else if((this.lastUp == null) || !this.lastUp.equals(evt.xy)) {
            this.addPoint(evt.xy);
        }
        this.mouseDown = true;
        this.lastDown = evt.xy;
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
       // if(this.drawing) { 
            //if(this.mouseDown && this.freehandMode(evt)) {
            //    this.addPoint(evt.xy);
            //} else {
                this.modifyFeature(evt.xy);
            //}
       // }
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
            //if(this.freehandMode(evt)) {
             //   this.removePoint();
            //    this.finalize();
           // } else {
                if(this.lastUp == null) {
                   this.addPoint(evt.xy);
                }
                this.lastUp = evt.xy;
            //}
            return false;
        }
        return true;
    },
  
    /**
     * Method: dblclick 
     * Handle double-clicks.  Finish the geometry and send it back
     * to the control.
     * 
     * Parameters:
     * evt - {Event} The browser event
     *
     * Returns: 
     * {Boolean} Allow event propagation
     */
    dblclick: function(evt) {

        var index = this.line.geometry.components.length - 1;
        this.line.geometry.removeComponent(this.line.geometry.components[index]);
        if(this.ring){
        	this.line = new OpenLayers.Feature.Vector(
	          new OpenLayers.Geometry.LinearRing(this.line.geometry.getVertices())
	        );
	        this.layer.addFeatures([this.line], {silent: true});
	        this.drawFeature();
        }
        this.removePoint();
        this.finalize();

        return false;
    },
    
    keydown: function(evt){
    	if(evt.keyCode == 46 /* Canc */ || (evt.ctrlKey && evt.keyCode == 90) /* Ctrl + z */){
    		this.undo();
    		return false;	
    	} else if (evt.ctrlKey && evt.keyCode == 13) {
    		this.dblclick();
    		return false;
    	}    	
    	return true;
    },

    CLASS_NAME: "OpenLayers.Handler.ConstrainedPath"
});
