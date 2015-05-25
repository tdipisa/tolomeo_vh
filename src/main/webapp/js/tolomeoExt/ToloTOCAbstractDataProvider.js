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
 * @class TolomeoExt.ToloTOCAbstractDataProvider
 * @extends Ext.util.Observable
 * 
 * 
 */
Ext.define('TolomeoExt.ToloTOCAbstractDataProvider', {

	extend: 'Ext.util.Observable',
 
	/** 
	 * @property {String} TOLOMEOServer
	 * 
	 * 
	 */
	TOLOMEOServer: null,

	/** 
	 * @property {String} TOLOMEOContext
	 * 
	 * 
	 */
	TOLOMEOContext: null,

	/** 
	 * @property {Boolean} [isStyleCapable=false]
	 * Indica se il data provider prevede la gestione degli stili (es. mapserver no, WMS si )  
	 * 
	 */
	isStyleCapable: false,
	
	/**
	 * @constructor
	 * Crea un nuovo TolomeoExt.ToloTOCAbstractDataProvider.
	 *
	 * @param {Object} config
	 * The configuration
	 *
	 * @returns {TolomeoExt.ToloTOCAbstractDataProvider}
	 * Un nuovo TolomeoExt.ToloTOCAbstractDataProvider.
	 * 
	 */
	constructor: function(config) {		
		Ext.apply(this, config);
		//Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);	
		this.callParent();
	},
	
	/**
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function(){ 
        this.addEvents('onFullDataRequestEnd');
        this.addEvents('onVisibleDataRequestEnd');
        
        /**
         * @event onRequestLayerInfoDataEnd
         * Viene emesso quando viene ricevuto la risposta ad una richiesta di layerInfo per un nuovo layer WMS
         * 
    	   * @param {Object} layInfo
    	   * struttura layerinfo relativa al WMS
    	   * 
	       * @param {Object} extra
	       * parametri extra
	       * 
         */
        this.addEvents('onRequestLayerInfoDataEnd');
        
		this.callParent(); 
    },

    
  /**
   * @method requestFullData
   * 
   * 
   * @param {Object} options
   * oggetto contenenti i parametri della richiesta.
	 * options.presetName - {string} nome del preset.
	 * options.currentMap - {string} mappa.
	 * options.scale - {number} valore di scala 	
	 * options.presetXML - {String} xml del file di preset.
	 * options.sendPreset - {boolean} abilitazione all'invio del preset
	 * 
	 */
    requestFullData: function(options) {    	
    	 
    },
    
    /**
     * @method fullDataRequestEnd
     * 
     * 
     * @param {Object} records
     * recordset.
     * 
     * @param {Object} opts
     * opts.
     * 
     */
    fullDataRequestEnd: function(records, scale) {
    	this.fireEvent('onFullDataRequestEnd', records, scale);
    },
    
    /**
     * @method requestVisibleData
     * 
     * 
     * @param {Object} nomePreset
     * nomePreset.
     * 
     * @param {Object} mappa
     * mappa.
     * 
     * @param {Object} scale
     * valore di scala.
     * 
     * @param {Object} tocInfo
     * 
     * 
     */
    requestVisibleData: function(nomePreset, mappa, scale, tocInfo) {
	   	
    },
    
    /**
     * @method visibleDataRequestEnd
     * 
     * 
     * @param {Object} opts
     * opts.
     * 
     * @param {Object} scale
     * 
     * 
     */
    visibleDataRequestEnd: function(obj, scale) {
    	this.fireEvent('onVisibleDataRequestEnd', obj, scale);
    },
    
    /**
     * @method requestLayerInfoDataEnd
     * Funzione di callback che riceve la struttura layerinfo realtiva ad un WMS
     * 
     * @param {Object} layInfo
     * struttura layerinfo relativa al WMS
     * 
     * @param {Object} extra
     * parametri extra
     * 
     */
    requestLayerInfoDataEnd: function(layInfo, extra) {
    	this.fireEvent('onRequestLayerInfoDataEnd', layInfo, extra);
    }
    
});





