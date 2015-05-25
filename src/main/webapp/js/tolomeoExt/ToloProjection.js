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

/**
 * @class TolomeoExt.Projection
 * 
 * 
 */
Ext.define('TolomeoExt.Projection', {

	extend: 'Object',

	statics: {
	
		/**
		 * @property {Object} [transforms={}]
		 * Transforms is an object, with from properties, each of which may
		 * have a to property. This allows you to define projections without 
		 * requiring support for proj4js to be included.
		 *
		 * This object has keys which correspond to a 'source' projection object.  The
		 * keys should be strings, corresponding to the projection.getCode() value.
		 * Each source projection object should have a set of destination projection
		 * keys included in the object. 
		 * 
		 * Each value in the destination object should be a transformation function,
		 * where the function is expected to be passed an object with a .x and a .y
		 * property.  The function should return the object, with the .x and .y
		 * transformed according to the transformation function.
		 *
		 * Note - Properties on this object should not be set directly.  To add a
		 *     transform method to this object, use the "addTransform" method.  For an
		 *     example of usage, see the OpenLayers.Layer.SphericalMercator file.
		 */
		transforms: {},

		/**
		 * @method addTransform
		 * Set a custom transform method between two projections.  Use this method in
		 * cases where the proj4js lib is not available or where custom projections
		 * need to be handled.
		 * 
		 * @param {String} from
		 * The code for the source projection
		 * 
		 * @param {String} to
		 * the code for the destination projection
		 * 
		 * @param {Function} method
		 * A function that takes a point as an argument and
		 * transforms that point from the source to the destination projection
		 * in place.  The original point should be modified.
		 * 
		 */
		addTransform: function(from, to, method) {
		    if(!TolomeoExt.Projection.transforms[from]) {
		        TolomeoExt.Projection.transforms[from] = {};
		    }
		    TolomeoExt.Projection.transforms[from][to] = method;
		},

		/**
		 * @method transform
		 * Transform a point coordinate from one projection to another.  Note that
		 * the input point is transformed in place.
		 * 
		 * @param {TolomeoExt.Point/Object} point
		 * An object with x and y
		 * properties representing coordinates in those dimensions.
		 *
		 * @param {TolomeoExt.Projection/String} source
		 * Source map coordinate system
		 * 
		 * @param {TolomeoExt.Projection/String} dest
		 * Destination map coordinate system
		 *
		 * @return {TolomeoExt.Point/Object}
		 * A transformed coordinate.  The original point is modified.
		 * 
		 */
		transform: function(point, source, dest) {
			if(Ext.isString(source)){
				source = new TolomeoExt.Projection(source);
			}
			if(Ext.isString(dest)){
				dest = new TolomeoExt.Projection(dest);
			}
		    if (source.proj && dest.proj) {
		        var proj4Point = Proj4js.transform(source.proj, dest.proj, point);
		    } else if (source && dest && 
		        TolomeoExt.Projection.transforms[source.getCode()] && 
		        TolomeoExt.Projection.transforms[source.getCode()][dest.getCode()]) {
		        TolomeoExt.Projection.transforms[source.getCode()][dest.getCode()](point); 
		    }
		    return new Point(proj4Point.x,proj4Point.y);
		},

		/**
		 * @method addDefinition
		 * Add at runtime a custom definition of a source projection
		 * 
		 * @param {String} projCode
		 * The code for the source projection
		 * 
		 * @param {String} def
		 * source projection definition
		 * 
		 */
		addDefinition: function(projCode,def){
			TolomeoExt.Projection.defs[projCode] = def;
		},


		/**
		 * @method loadDefinition
		 * Load the definition of a source projection if it doesn't already exist
		 * 
		 * @param {String} projCode
		 * The code for the source projection
		 * 
		 */
		loadDefinition: function(projCode){
			if (window.Proj4js) {
				if(!window.Proj4js.defs[projCode] && TolomeoExt.Projection.defs[projCode]){
					window.Proj4js.defs[projCode] = TolomeoExt.Projection.defs[projCode];
				} else {
					new Proj4js.Proj(projCode);
				}
		    }
		},
		
    /**
     * @property {Object} defs
     * 
     */
		defs: { "EPSG:3003": "+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=1500000 +y_0=0 +ellps=intl +towgs84=-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68 +units=m +no_defs",
				"EPSG:25832": "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs"}
	},

	
    /**
     * @property {Object} proj
     * Proj4js.Proj instance.
     * 
     */
    proj: null,
    
    /**
     * @property {String} projCode
     * 
     */
    projCode: null,
	
	/**
	 * @constructor
	 * 
	 * 
	 * @param {Object} config
	 * 
	 * 
	 */
	constructor : function(config){
		if(Ext.isString(config)){            
			config = {projCode: config};
		}        
		Ext.apply(this, config);  
		if (window.Proj4js) {
			if(!window.Proj4js.defs[this.projCode] && TolomeoExt.Projection.defs[this.projCode]){
				window.Proj4js.defs[this.projCode] = TolomeoExt.Projection.defs[this.projCode];
			}
	        this.proj = new Proj4js.Proj(this.projCode);                        
	    }
	},
	 
	
    /**
     * @method getCode
     * Get the string SRS code.
     *
     * @return {String}
     * The SRS code.
     */
    getCode: function() {
        return this.proj ? this.proj.srsCode : this.projCode;
    },
   
    /**
     * @method getUnits
     * Get the units string for the projection -- returns null if 
     * proj4js is not available.
     *
     * @return {String}
     * The units abbreviation.
     * 
     */
    getUnits: function() {
        return this.proj ? this.proj.units : null;
    },
    
    /**
     * @method getTitle
     * 
     *
     * @return {String}
     * 
     * 
     */
    getTitle: function() {
        return this.proj ? (this.proj.title ? this.proj.title : this.proj.srsCode) : null;
    },

    /**
     * @method toString
     * Convert projection to string (getCode wrapper).
     * 
     * @return {String}
     * The projection code.
     * 
     */
    toString: function() {
        return this.getCode();
    },

    /**
     * @method equals
     * Test equality of two projection instances.  Determines equality based
     * soley on the projection code.
     *
		 * @param {TolomeoExt.Projection} projection
		 * 
		 * 
		 * @return {Boolean}
     * The two projections are equivalent.
     * 
     */
    equals: function(projection) {
        if (projection && projection.getCode) {
            return this.getCode() == projection.getCode();
        } else {
            return false;
        }    
    },
		
		/**
     * @method destroy
     * Destroy projection object.
     * 
     */
    destroy: function() {
        delete this.proj;
        delete this.projCode;
    }
});     

