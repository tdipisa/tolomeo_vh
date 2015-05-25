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
 * @class TolomeoExt.ToloTOCMultiServerProvider
 * 
 * 
 */
Ext.define('TolomeoExt.ToloTOCMultiServerProvider', {

	extend: 'TolomeoExt.ToloTOCAbstractDataProvider',
	
	alias: ['widget.tx_ToloTOCMultiServerProvider'],
	
	//requires: [],
	
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
	 * @property {Object} paramsJS
	 * 
	 * 
	 */
	paramsJS : null,

	/**
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function(){
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

    	this.requestFullData1(options); 
    	this.callParent(arguments);

    },
    
  /**
   * @method requestFullData1
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
    requestFullData1: function(options) {
    	//TOC mai attivata. Occorre costruirla
    	if (options.currentMap.legenda) {   
    		
    		var params = {
    			//scale:   scale ,
    			update: 'false', 
				tipoServer: 'wms',
				numMappaCorrente: '0'
			};
			
    		if(options.sendPreset &&  options.presetXML){
    			params.paramPresetString = options.presetXML;
    			params.presetName = options.presetName;
    		} else {
    			params.paramPreset = options.presetName;
    		}
    		
    		Ext.apply(params, this.paramsJS.urlAdditionalParams);
    		
    		var ajaxOptions = { 
					url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxTOCServletExt',
					method: 'post',
					params: params, //TODO per adesso gestita solo la prima mappa}
					success: function (records, opts) { 
									this.fullDataRequestEnd(records, opts, options.scale); 
								},
					failure: function (store, opts, records) {
							//TODO vedere se fare qualcosa in aggiunta al messaggio a video di defautl
					},
					scope: this
					//text: "Loading...",
					//TODO
					//failure: this.showAjaxError, 
				  }    		
    		
    		new TolomeoExt.ToloCrossAjax().request(ajaxOptions);  		
    	}
    },
    
    /**
     * @method fullDataRequestEnd
     * 
     * 
     * @param {Array} records
     * recordseset.
     * 
     * @param {Object} opts
     * opts.
     * 
     */
    fullDataRequestEnd: function(records, opts, scale) {
    	var obj = records[0].data;
    	this.callParent([obj, scale]);

    },
        
    /**
     * @method requestVisibleData
     * 
     * 
     * @param {Object} options
     * oggetto contenenti i parametri della richiesta.
  	 * options.presetName - {string} nome del preset.
  	 * options.currentMap - {string} mappa.
  	 * options.scale - {number} valore di scala 
	   * options.tocInfo - {object} struttura della TOC
  	 * options.presetXML - {String} xml del file di preset.
	   * options.sendPreset - {boolean} abilitazione all'invio del preset
     * 
     */
    requestVisibleData: function(options) {
		var sep=",";
		
		if (options.currentMap.legenda) {  
		
			var retObj = { layers: "", stili: "", layIdx: "", catIdx: "" };
			
			options.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) {
					
					if (options.tocInfo.getLayerNeedRequestVisibleData(catIdx, layIdx)) {
						this.stili  += (this.layers!="" ? sep : "") + (lay.style=="" ? "null" : lay.style);
						this.layIdx += (this.layers!="" ? sep : "") + layIdx;
						this.catIdx += (this.layers!="" ? sep : "") + catIdx;
						this.layers += (this.layers!="" ? sep : "") + lay.name;	
					}
				},
				retObj
			);
	    	
			var thisDataProvider = this;
			
			var params = {
    			update: true,
				tipoServer: 'wms',
				layers: retObj.layers,
				stili: 	retObj.stili,
				catIdx:	retObj.catIdx,
				layIdx:	retObj.layIdx,
				random: Math.random(),
				numMappaCorrente: '0'
			};
			
    		if(options.sendPreset && options.presetXML){
    			params.paramPresetString = options.presetXML;
    			params.presetName = options.presetName;
    		} else {
    			params.paramPreset = options.presetName;
    		}
    		
    		Ext.apply(params, this.paramsJS.urlAdditionalParams);
	
			var ajaxOptions = { 
				url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxTOCServletExt',
				method: 'post',
				params: params, //TODO per adesso gestita solo la prima mappa} 
				success: function(records, opts) { 
					thisDataProvider.visibleDataRequestEnd(options.currentMap.legenda, options.scale, records, opts) 
				},
				//TODO
				//failure: this.showAjaxError,
				scope: this 
			}

    		new TolomeoExt.ToloCrossAjax().request(ajaxOptions);
		}
		this.callParent([options.scale]);
    },
    
    /**
     * @method visibleDataRequestEnd
     *
     * 
     * @param {Object} legenda
     * 
     * 
     * @param {Object} scale
     * 
     * 
     * @param {Object} records
     * 
     * 
     * @param {Object} opts
     * 
     * 
     * TODO dipendenza dalla scala per adesso staticamente definita in preset
     */
    visibleDataRequestEnd: function(legenda, scale, records, opts) {
    	
    	var obj = records[0].data;
    	this.callParent([obj, scale]);
    	
    },	
	
    /**
     * @method requestLayerInfoData
     * 
     * 
     * @param {Object} options
     * oggetto contenenti i parametri della richiesta.
  	 * options.presetName - {string} nome del preset.
  	 * options.currentMap - {string} mappa.
  	 * options.scale - {number} valore di scala 
	   * options.tocInfo - {object} struttura della TOC
  	 * options.presetXML - {String} xml del file di preset.
	   * options.sendPreset - {boolean} abilitazione all'invio del preset
     * 
     */
	requestLayerInfoData: function(options) {
    		
		var params = {
			//scale:   scale ,
			serverurl: options.serverurl, 
			layername: options.layername
		};
		
		Ext.apply(params, this.paramsJS.urlAdditionalParams);
		
		var ajaxOptions = { 
				url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxTOCLayerInfoServlet',
				method: 'post',
				params: params, 
				success: function (records, opts, extra) { 
								this.requestLayerInfoDataEnd(records, opts, options.extra);				
							},
				failure: function (store, opts, records) {
						//TODO vedere se fare qualcosa in aggiunta al messaggio a video di defautl
				},
				scope: this

			  }    		
		
		new TolomeoExt.ToloCrossAjax().request(ajaxOptions);  		   		
    }, 
    
    /**
     * @method requestLayerInfoDataEnd
     * Funzione di callback che riceve la struttura layerinfo realtiva ad un WMS
     * 
     * @param {Object} records
     * Record dello store. Contiene un solo oggetto
     * 
     * @param {Object} opts
     * Opzioni
     * 
     * @param {Object} extra
     * parametri extra
     * 
     */
    requestLayerInfoDataEnd: function(records, opts, extra) {
    	var obj = records[0].data;
    	this.callParent([obj, extra]);
    }
    
});





