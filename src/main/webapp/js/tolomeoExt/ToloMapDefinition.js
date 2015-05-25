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
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo � un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo � un software libero; � possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo � distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo � sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

Ext.define('TolomeoExt.ToloMapDefinition', {

	extend: 'Ext.util.Observable',
	
	/**
	 * {Array} array contenete oggetti toloLayerViewerAggregation 
	 */
	layerAggregations: null,
	
	constructor: function(config) {
		
		if (config==undefined) config={};
		Ext.applyIf(config, { layerAggregations: [] });
		Ext.apply(this, config);
		this.callParent(arguments);
		//TolomeoExt.ToloMapDefinition.superclass.constructor.call(this, config);
		
	},
	
	addLayerAggregation: function(layerAggregation, index) {
		
		if (index==undefined || index==null) {
			layerAggregation.nPluginLayer=this.layerAggregations.length;
			this.layerAggregations.push(layerAggregation);
		} else {
			layerAggregation.nPluginLayer=index;
			this.layerAggregations[index] = layerAggregation;
		}
	
	},
	
	getLayerAggregation: function(index) {
		return this.layerAggregations[index];
	},
	
	getLayerAggregationCount: function() {
		return this.layerAggregations.length;
	},
	
	reverseLayerAggregationsOrder: function() {
		var buff = [];
		
		for (var i=0; i<this.getLayerAggregationCount(); i++) {
			buff[i] = this.getLayerAggregation(i).nPluginLayer;
		}
		this.layerAggregations.reverse();
		
		for (var i=0; i<this.getLayerAggregationCount(); i++) {
			this.getLayerAggregation(i).nPluginLayer = buff[i];
		}
	},
	
	/**
	 * Cerca quale layer aggregation contiene il layer individuato dagli indici catIdx, layIdx
	 */
	whichLayerAggregationContains: function (catTreeIdx, layTreeIdx) {
		
		for (var i=0; i<this.getLayerAggregationCount(); i++) {
			var lag = this.getLayerAggregation(i);
			for (var j=0; j < lag.layers.length; j++ ) {
				var layer = lag.layers[j];
				if (layer.catTreeIdx==catTreeIdx && layer.layTreeIdx==layTreeIdx) return lag;
			}
		}
		
		return null;
	},
	
    whichLayerAggregationContainsNPluginLayer: function (nPluginLayer) {
		
		for (var i=0; i<this.getLayerAggregationCount(); i++) {
			var lag = this.getLayerAggregation(i);
			if (lag.nPluginLayer==nPluginLayer) return lag;
		}
		
		return null;
	}

});

