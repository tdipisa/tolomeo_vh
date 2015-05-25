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
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Attribution
 * Controllo che aggiunge in mappa le attribuzioni gestendo la possibilità che un singolo layer openlayers 
 * visualizzi più di un layer con diversa attribuzione, caso possibile quando vengono raggruppate le richieste alla stesso wms
 * Utilizza la prorietà 'attribution' di ogni layer, che può essere anche un array.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.AttributionMulti = 
  OpenLayers.Class(OpenLayers.Control, {
    
	  
  /**
     * APIProperty: separator
     * {String} String used to separate layers.
     */
    separator: ", ",
    
    /**
     * APIProperty: template
     * {String} Template for the attribution. This has to include the substring
     *     "${layers}", which will be replaced by the layer specific
     *     attributions, separated by <separator>. The default is "${layers}".
     */
    template: "${layers}",
    
    /**
     * Constructor: OpenLayers.Control.Attribution 
     * 
     * Parameters:
     * options - {Object} Options for control.
     */
	  
    
    /**
     * Constructor: OpenLayers.Control.AttributionMulti 
     * 
     * Parameters:
     * options - {Object} Options for control.
     */
	  
    /** 
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {
        this.map.events.un({
            "removelayer": this.updateAttribution,
            "addlayer": this.updateAttribution,
            "changelayer": this.updateAttribution,
            "changebaselayer": this.updateAttribution,
            scope: this
        });
        
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },    
    
    /**
     * Method: draw
     * Initialize control.
     * 
     * Returns: 
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        
        this.map.events.on({
            'changebaselayer': this.updateAttribution,
            'changelayer': this.updateAttribution,
            'addlayer': this.updateAttribution,
            'removelayer': this.updateAttribution,
            scope: this
        });
        this.updateAttribution();
        
        return this.div;    
    },

	  /**
     * Method: updateAttribution
     * Aggiorna l'attribuzione
     */
    updateAttribution: function() {
    	 
        var attributions = [];
        if (this.map && this.map.layers) {
            for(var i=0, len=this.map.layers.length; i<len; i++) {
                var layer = this.map.layers[i];
                if (layer.attribution && layer.getVisibility()) {
                	// controlla se ci sono più attribuzioni per questo layer
                	if (layer.attribution.constructor === Array) {
                		for (var j=0; j<layer.attribution.length; j++) {
                			var buff = "";
                			if (typeof layer.attribution[j] === 'string') {
                				buff = layer.attribution[j];	
                        	} else {
                        		buff = layer.attribution[j].title;
                        	}
	                		// add attribution only if attribution text is unique
	                        if (OpenLayers.Util.indexOf(
	                                        attributions, buff) === -1) {
	                            attributions.push( buff );
	                        }
                		}
                	} else {
                		// add attribution only if attribution text is unique
                		var buff = "";
            			if (typeof layer.attribution === 'string') {
            				buff = layer.attribution;
                    	} else {
                    		buff = layer.attribution.title;
                    	}
                        if (OpenLayers.Util.indexOf(
                                        attributions, buff) === -1) {
                        	attributions.push(buff);
                        }	
                	}
                }
            } 
            this.div.innerHTML = OpenLayers.String.format(this.template, {
                layers: attributions.join(this.separator)
            });
        }
    },

    CLASS_NAME: "OpenLayers.Control.AttributionMulti"
});