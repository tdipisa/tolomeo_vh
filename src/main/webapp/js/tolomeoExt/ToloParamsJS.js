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
 * @class TolomeoExt.ToloParamsJS
 * Classe wrapper dei parametri di configurazione di Tolomeo
 *
 * @constructor
 * 
 * 
 * @param {Object} config
 * 
 * 
 */
function ToloParamsJS(config){
	if(config && typeof config == 'object'){
        for(var p in config){
            this[p] = config[p];
        }
        this.createMapDefinition();
    }
	
}

/**
 * @method getSelectableCodTPN
 * Restituisce la lista dei codiciTPN dei layer che risultano selezionabili.
 * 
 * @param {Boolean} forceRefresh
 * 
 * 
 * @return {Array}
 * Lista dei codiciTPN dei layer che risultano selezionabili
 * 
 */
ToloParamsJS.prototype.getSelectableCodTPN = function (forceRefresh) {
	if(forceRefresh || !this.selectableCodTPN){		
		this.selectableCodTPN = [];
		if (!!this.azioniApertura.modoEditingSingolo)  {
			this.selectableCodTPN.push(this.azioniApertura.modoEditingSingolo.layerCODTPN);	
		} else {
			for(var index=0; index<this.azioniEventi.eventiLayerList.length; index++) {
				var evl = this.azioniEventi.eventiLayerList[index];
				if (evl.interactable) {
					this.selectableCodTPN.push(evl.codTPN);
				}
			}
		}
	}
	return this.selectableCodTPN;
}

/**
 * @method isSelectable
 * Restituisce true sel il codTPN passato è quello di uno dei layer
 * 
 * @param {Number} codTPN
 * 
 * 
 * @return {Boolean}
 * 
 * 
 */
ToloParamsJS.prototype.isSelectable = function (codTPN) {	
	var selectableCodTPN = this.getSelectableCodTPN();
	for(var i=0; i < selectableCodTPN.length; i++){
		if(selectableCodTPN[i]==codTPN) return true;
	}
	return false;
}

/**
 * @method getParamJSLayer
 * 
 * 
 * @param {Number} codTPN
 * 
 * 
 * @return {Object}
 * I parametri JS del layer.
 * 
 */
ToloParamsJS.prototype.getParamJSLayer = function (codTPN) {
	var evl = null;	
	for(var index=0; index<this.azioniEventi.eventiLayerList.length; index++) {
		evl = this.azioniEventi.eventiLayerList[index];
		if (evl.codTPN==codTPN) {
			return evl;
		}
	}
	return null;
}

/**
 * @method getLayerSfondoString
 * Ritorna una stringa contenente l'elenco dei nomi dei layer di sfondo separati da saparator
 * 
 * @param {Object} mappaCurr
 * oggetto mappa corrente
 * 
 * @param {String} separator
 * separatore
 * 
 * @return {String}
 * Ritorna una stringa contenente l'elenco dei nomi dei layer di sfondo separati da separator oppure null nel caso non ci sia nessun layer 
 * 
 */
ToloParamsJS.prototype.getLayerSfondoString = function(mappaCurr, separator) {
	var laystr = null;
	
	// Inserimento livelli predefiniti di sfondo
	if(mappaCurr.sfondo != null) {
		for (var j = 0; j < mappaCurr.sfondo.layerSfondoList.length; j++) {	
			var layerSfondo = mappaCurr.sfondo.layerSfondoList[j];
			if (laystr==null) laystr = '';
			laystr += (j!=0) ? separator : '';
			// Prendo il layer di sfondo corrente
			laystr += layerSfondo.name ;
		}
	}
	
	return laystr;
}

/**
 * @method getLayerSfondoStyleString
 * Ritorna una stringa contenente l'elenco degli stili dei layer di sfondo separati da saparator. Se uno stile non è definito comunque viene inserita una stringa vuota per indicare la necessità di utilizzare lo stile di default
 * Se non presenti layer di cui definire gli stili ritorna null
 * 
 * @param {Object} mappaCurr
 * oggetto mappa corrente
 * 
 * @param {String} separator
 * separatore
 *
 * @return {String}
 * Ritorna una stringa contenente l'elenco dei nomi dei layer di sfondo separati da saparator 
 * 
 */
ToloParamsJS.prototype.getLayerSfondoStyleString = function(mappaCurr, separator) {
	var laystr = null;
	
	// Inserimento livelli predefiniti di sfondo
	if(mappaCurr.sfondo != null) {
		for (var j = 0; j < mappaCurr.sfondo.layerSfondoList.length; j++) {	
			var layerSfondo = mappaCurr.sfondo.layerSfondoList[j];
			if (laystr==null) laystr = '';
			laystr += (j!=0) ? separator : '';
			// Prendo il layer di sfondo corrente
			laystr += (layerSfondo.stile ? layerSfondo.stile : '') ;
		}
	}
	
	return laystr;
}

/**
 * @method onEachLegendaCategory
 * Metodo per il lancio della funzione fn all'interno del contesto scope per ogni categoria  
 * Il metodo agisce in maniera ricorsiva se bRecurce non è definito o è true 
 * 
 * @param {Object} categ
 * 
 * 
 * @param {Function} fn
 * 
 * 
 * @param {Object} scope
 * 
 * 
 * @param {Boolean} bRecurse
 * 
 * 
 */
ToloParamsJS.prototype.onEachLegendaCategory= function(categ, fn, scope, bRecurse ) {
	var scopebuff = (scope) ? scope : this;
	var bRecurse = (bRecurse!=undefined && bRecurse !=null) ?  bRecurse : true;
	
	// Prima nelle categorie annidate perchè a meno di cambio ordine sono mostrate prima
	if (bRecurse && categ.categoryList) {
		for (var i=0; i<categ.categoryList.length; i++) {
			this.onEachLegendaCategory(categ.categoryList[i], fn, scope, bRecurse);
		}
	}
	
	// poi eseguo su questa categoria
	fn.call(scope, categ);
}

/**
 * @method getServer
 * 
 * 
 * @param {String} id
 * 
 * 
 * @param {Object} mappa
 * 
 * 
 * @return {Object}
 * 
 * 
 */
ToloParamsJS.prototype.getServer= function(id, mappa) {
	
	if (!id || id=="INLINESERVERID") {
	
		id = "INLINESERVERID";
		var server0 = new toloServerMappe();
		server0.nome 					= mappa.nome;
		server0.typeDescription       	= mappa.typeDescription;
		server0.typeCode             	= mappa.typeCode;
		server0.nomeCredenziale   		= mappa.nomeCredenziale;
		server0.allowServerConnection 	= mappa.allowServerConnection;
		server0.url          		  	= mappa.url;
		server0.serverOpts				= mappa.mapOptions;
		server0.tilesMultiple			= mappa.tilesMultiple;		
		server0.noTolomeoParams			= false;
		
		server0.tileStampaLarghezza		= (server0.tileStampaLarghezza ? inlineServerInfo.tileStampaLarghezza : 0);
		server0.tileStampaAltezza		= (server0.tileStampaAltezza ? inlineServerInfo.tileStampaAltezza : 0);									
		
		return server0;
	} else {
	
	
		if (this.serverPool!=undefined && this.serverPool!=null) {
			var listaServer = this.serverPool.serverList;
			
			for (var i=0; i<listaServer.length; i++ ) {
				if (listaServer[i].id==id) return new toloServerMappe(listaServer[i]);
			}
		}
	}
	return null;
	
}

/**
 * @method getLegendaCategory
 * Metodo privato per lo scorrimento ricorsivo delle categorie
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {String} idxs
 * 
 * 
 * @param {Object} baseCat
 * 
 * 
 * @return {Object}
 * 
 * 
 */
ToloParamsJS.prototype.getLegendaCategory=function(nMappa, idxs, baseCat) {
	
	var base = (baseCat==undefined || baseCat==null) ? this.mappe.mappaList[nMappa].legenda : baseCat;
	var idxArray;
	if (typeof idxs === "string") {
		idxArray=idxs.split("/");
	} else {
		// Copio per non modificare il valore passato
		idxArray=idxs.concat([]);
	}
	if (idxArray.length==1) return base.categoryList[idxArray[0]];
	else {
		var idx = idxArray.shift();
		return this.getLegendaCategory(nMappa, idxArray, base.categoryList[idx]);		
	}
}

/**
 * @method getLegendaParentCategoryIdx
 * Metodo per ottenere l'indice della categoria padre 
 * 
 * @param {String} catIdx
 * 
 * 
 * @return {Object}
 * 
 * 
 */
ToloParamsJS.prototype.getLegendaParentCategoryIdx=function(catIdx) {
	
	if (typeof catIdx === "string") {
		var idxs = catIdx.split("/");
		if (idxs.length<=1) return "";
		return idxs.slice(0,idxs.length-1);	
	} else {
		if (catIdx.length<=1) return "";
		return catIdx.slice(0,catIdx.length-1);
	}
	
}

/**
 * @method onEachLegendaParentCategory
 * 
 * 
 * @param {Function} fn
 * 
 * 
 * @param {Object} scope
 * 
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {String} startCatIdx
 * 
 * 
 */
ToloParamsJS.prototype.onEachLegendaParentCategory=function(fn, scope, nMappa, startCatIdx) {
	
	var parentIdx = this.getLegendaParentCategoryIdx(startCatIdx);
	while (parentIdx!="") {
		var cat = this.getLegendaCategory(nMappa, parentIdx);
		fn.call(scope, cat, parentIdx);
		parentIdx = this.getLegendaParentCategoryIdx(parentIdx);
	}
	
}

/**
 * @method areAllLegendaParentCatDefaultCategory
 * Metodo che verifica se tutte le categorie padre hanno il flag defaultCategory==true
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {String} catIdx
 * 
 * 
 * @return {Boolean}
 * 
 * 
 */
ToloParamsJS.prototype.areAllLegendaParentCatDefaultCategory=function(nMappa, catIdx) {
	var retObj1 = { bAllChecked: true };
	this.onEachLegendaParentCategory(
			function(parentCat, parentCatIdx) {
				if (!parentCat.defaultCategory) this.bAllChecked = false;
			}, 
			retObj1,
			nMappa,
			catIdx
	);
	return retObj1.bAllChecked;
}

/**
 * @method onEachCategoryOrLayerOrder
 * Scorre tutto il tag legenda della mappa nMappa a partire da:
 * - categ se tocInfo non è definito o nullo o ha layerOrder.length=0
 * - se tocInfo è definito e non nullo tutto tocInfo.layerOrder ignorando categ
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {Object} categ
 * 
 * 
 * @param {Function} fn
 * 
 * 
 * @param {Object} scope
 * 
 * 
 * @param {Boolean} bRecurse
 * 
 * 
 * @param {Object} tocInfo
 * 
 * 
 * @param {Array} filterItemType
 * 
 * 
 */
ToloParamsJS.prototype.onEachCategoryOrLayerOrder=function(nMappa, categ, fn, scope, bRecurse, tocInfo, filterItemType ) {
	
	var withFilter = (filterItemType &&  filterItemType.length>0); 
	
	if (tocInfo!=undefined && tocInfo!=null && tocInfo.layerOrder && tocInfo.layerOrder.length>0) {
		for (var i = 0; i < tocInfo.layerOrder.length; i++) {
			var laypos = tocInfo.layerOrder[i];
			var catInfo = tocInfo.getCategoryInfo(laypos.cat);
			var layInfo = catInfo.layers[laypos.lay];
			var cat = this.getLegendaCategory(nMappa, layInfo.catTreeIdx);
			var lay = cat.layerList[layInfo.layTreeIdx];
			if (!withFilter || Ext.Array.contains(filterItemType, lay.itemType)) {
				fn.call(scope, cat, lay, catInfo, layInfo);
			}
		}
	} else {
		this.onEachLegendaCategory(categ, 
				function(categ) {
					if (categ.layerList!=undefined) {
						var catInfo = null;
						if (tocInfo) {
							catInfo = tocInfo.getCategoryInfo(categ.catTreeIdx);
						}
						
						for (var i=0; i<categ.layerList.length; i++) {
							var layInfo = null;
							var layer = categ.layerList[i];
							if (catInfo) layInfo = catInfo.layers[layer.layTreeIdx];
							if (!withFilter || Ext.Array.contains(filterItemType, layer.itemType)) {
								fn.call(scope, categ, layer, catInfo, layInfo);
							}
							
						}
					}
				},
				scope, bRecurse);	
	}
	
}

/**
 * @method createMapDefinition
 * 
 * 
 * @param {Object} tocInfo
 * 
 * 
 */
ToloParamsJS.prototype.createMapDefinition = function(tocInfo) {

	var aggregationAttributes = ['serverID','opacity'];
	
	var prevAttributeValue = {};
	var prevAttributeValueInTocInfo = {};
	this.mapDefinitions = [];	
	
	for (var nMappa=0; nMappa<this.mappe.mappaList.length; nMappa++) {
		
		var mappa = this.mappe.mappaList[nMappa];
		var mapDefinition = new TolomeoExt.ToloMapDefinition();
	
		/*
		var server0 = new toloServerMappe();
		server0.nome 					= mappa.nome;
		server0.typeDescription       	= mappa.typeDescription;
		server0.typeCode             	= mappa.typeCode;
		server0.nomeCredenziale   		= mappa.nomeCredenziale;
		server0.allowServerConnection 	= mappa.allowServerConnection;
		server0.url          		  	= mappa.url;
		server0.serverOpts				= mappa.mapOptions;
		server0.tilesMultiple			= mappa.tilesMultiple;		
		server0.noTolomeoParams			= false;
		*/
		
		//inlineServerInfo = this.getServer("INLINESERVERID");
		server0 = this.getServer("INLINESERVERID", mappa);
		
		/*
		if (inlineServerInfo) {
			server0.tileStampaLarghezza		= inlineServerInfo.tileStampaLarghezza;
			server0.tileStampaAltezza		= inlineServerInfo.tileStampaAltezza;									
		
		} else {
			server0.tileStampaLarghezza		= 0;
			server0.tileStampaAltezza		= 0;			
		}*/								
		
		var idServerPrev = "";
		var layViewAggCurr = null;
		var bPrecCompleto = false;
	
		this.onEachCategoryOrLayerOrder(nMappa, mappa.legenda, 
		
				function(categ, layer, catInfo, layInfo) {
					
							var breakingTime = false;
							// Verifico il breaking time ovvero se è il momento di passare ad una nuova aggregatio perchè è 
							// cambiato un qualche attributo che la identifica.
							for(var i in aggregationAttributes){
								var attrName = aggregationAttributes[i];
								if(layer[attrName] != prevAttributeValue[attrName] ){									
									breakingTime = true;
								}
								prevAttributeValue[attrName] = layer[attrName]; 
							}
							
							// Rottura anche se il gruppo precedente è stato stabilito di essere "completo"
							if (bPrecCompleto) {
								breakingTime = true;
								bPrecCompleto = false;
							}
							
							//ALE DA RIPETERE IN SFONDO?
							//Rottura anche quando opacity settata da utente su legenda != 1
							if (tocInfo &&
								layInfo['opacity']!=undefined && layInfo['opacity']!=null && layInfo['opacity']!=1) {
									breakingTime = true;
									bPrecCompleto = true;
							}
							
							if (layViewAggCurr==null || breakingTime) {
								
									if (layViewAggCurr!=null) mapDefinition.addLayerAggregation(layViewAggCurr);

									var defaultServer = !layer.serverID;
									var serverCurr = defaultServer ? server0 : this.getServer(layer.serverID);		
									
									var aggregationOption = {
										'tilesMultiple': serverCurr.tilesMultiple,
										'overlay': true, //mappa.overlay;
										'SRID': mappa.SRID,
										'units': mappa.units,
										'mostraInLegenda': mappa.mostraInLegenda,
										'layerOptions': mappa.viewerOptions,
										'imagetype': mappa.imagetype,
										'server': serverCurr
									};
									
									// Aggiungo alle proprietà di aggregazione quelle eventualmente definite sul layer o sul server, dando precedenza a quelle del layer 
									// Sulla Layer Aggregation mi trovero gli attributi ch ne hanno dato origine
									for(var i in aggregationAttributes){
										var attrName = aggregationAttributes[i];
										aggregationOption[attrName] = layer[attrName] || (defaultServer ? mappa[attrName] : serverCurr[attrName]);
									}	
									
									if (tocInfo && layInfo.opacity!=undefined && layInfo.opacity!=null) aggregationOption.opacity = layInfo.opacity; 
																	
									// TODO verificare attributi e se ha senso che siano qua
									// TODO forzare trasparenza o no?
									layViewAggCurr = Ext.create('TolomeoExt.ToloLayerViewerAggregation',aggregationOption);
								}
								if (layInfo) {
									var bAttivo = tocInfo.areAllParentCatChecked(categ.catTreeIdx) && catInfo.checked && layInfo.checked;
									layer.checked = bAttivo;
								} else {
									var bAttivo = this.areAllLegendaParentCatDefaultCategory(nMappa, categ.catTreeIdx) && categ.defaultCategory && layer.defaultLayer;
									layer.checked = bAttivo;
									layer.style   = layer.defaultStyle; 
								}
								layViewAggCurr.layers.push(layer);
				}, 
				this, true, tocInfo, ['layer'] );
		
		if (layViewAggCurr!=null) mapDefinition.addLayerAggregation(layViewAggCurr); // layViews.push(layViewAggCurr);
		
		// Aggiunta sfondo
		if (mappa.sfondo) {
			idServerPrev = "";
			layViewAggCurr = null;
			
			prevAttributeValue = {};					
			
			for (var nSfondo=0; nSfondo<mappa.sfondo.layerSfondoList.length; nSfondo++) {
				
				var layer = mappa.sfondo.layerSfondoList[nSfondo];
				
				var breakingTime = false;
			
				for(var i in aggregationAttributes){
					var attrName = aggregationAttributes[i];
					if(layer[attrName] != prevAttributeValue[attrName] ){									
						breakingTime = true;
					}
					prevAttributeValue[attrName] = layer[attrName]; 
				}
				
				if (bPrecCompleto) {
					breakingTime = true;
					bPrecCompleto = false;
				}
				
				if (layViewAggCurr==null || breakingTime) {
					
					if (layViewAggCurr!=null) mapDefinition.addLayerAggregation(layViewAggCurr);
					
					var serverCurr = layer.serverID ? this.getServer(layer.serverID) : server0;		
					
					var aggregationOption = {
						'tilesMultiple': serverCurr.tilesMultiple,
						'overlay': true, //mappa.overlay;
						'SRID': mappa.SRID,
						'units': mappa.units,
						'mostraInLegenda': mappa.mostraInLegenda,
						'layerOptions': mappa.viewerOptions,
						'imagetype': mappa.imagetype,
						'server': serverCurr//,
					};
					
					// Aggiungo alle proprietà di aggregazione quelle eventualmente definite sul layer o sul server, dando precedenza a quelle del layer 
					// Sulla Layer Aggregation mi trovero gli attributi ch ne hanno dato origine
					for(var i in aggregationAttributes){
						var attrName = aggregationAttributes[i];
						aggregationOption[attrName] = layer[attrName] || serverCurr[attrName];
					}										
									
					// TODO verificare attributi e se ha senso che siano qua
					// TODO forzare trasparenza o no?
					layViewAggCurr = Ext.create( 'TolomeoExt.ToloLayerViewerAggregation', aggregationOption);
				}

				layer.checked = true;
				layViewAggCurr.layers.push(layer);
			}
			if (layViewAggCurr!=null) mapDefinition.addLayerAggregation(layViewAggCurr);
		}
		
		mapDefinition.reverseLayerAggregationsOrder();
		// metto il primo come baselayer
		//mapDefinition.getLayerAggregation(0).overlay=false;
		this.mapDefinitions.push(mapDefinition);

	}
	
}

/**
 * @method updateMapDefinitionLayerCheckState
 * 
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {Object} layerInfo
 * 
 * 
 * @param {Boolean} forcedState
 * 
 * 
 * @return {Object}
 * 
 * 
 */
ToloParamsJS.prototype.updateMapDefinitionLayerCheckState = function(nMappa, layerInfo, forcedState) {
	
	var layerAggreg = this.mapDefinitions[nMappa].whichLayerAggregationContains(layerInfo.catTreeIdx, layerInfo.layTreeIdx);
	
	if (layerAggreg) {
		for (var i=0; i<layerAggreg.layers.length; i++) {
			var layer = layerAggreg.layers[i];
			if ((layer.catTreeIdx==layerInfo.catTreeIdx) && (layer.layTreeIdx==layerInfo.layTreeIdx)) {
				layer.checked = (forcedState!=undefined && forcedState!=null) ? forcedState : layerInfo.checked;
			}	
		}
	}
	return layerAggreg;
}

/**
 * @method updateMapDefinitionLayerStyle
 * 
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {Object} layerInfo
 * 
 * 
 * @param {Object} style
 * 
 * 
 */
ToloParamsJS.prototype.updateMapDefinitionLayerStyle= function(nMappa, layerInfo, style) {
	
	var layerAggreg = this.mapDefinitions[nMappa].whichLayerAggregationContains(layerInfo.catTreeIdx, layerInfo.layTreeIdx);
	
	if (layerAggreg) {
		for (var i=0; i<layerAggreg.layers.length; i++) {
			var layer = layerAggreg.layers[i];
			if ((layer.catTreeIdx==layerInfo.catTreeIdx) && (layer.layTreeIdx==layerInfo.layTreeIdx)) {
				layer.style = style;
			}	
		}
	}
	return layerAggreg;
}

/**
 * @method updateMapDefinitionLayerAttribution Aggiorna l'attribuzione di un layer  
 * 
 * @param {Number} nMappa Numero della mappa, attualmente gestita solo mappa 0
 * @param {Object} layerInfo Informazioni del layer, contenenti la nuova attribuzione
 */
ToloParamsJS.prototype.updateMapDefinitionLayerAttribution= function(nMappa, layerInfo) {
	
	var layerAggreg = this.mapDefinitions[nMappa].whichLayerAggregationContains(layerInfo.catTreeIdx, layerInfo.layTreeIdx);
	
	if (layerAggreg) {
		for (var i=0; i<layerAggreg.layers.length; i++) {
			var layer = layerAggreg.layers[i];
			if ((layer.catTreeIdx==layerInfo.catTreeIdx) && (layer.layTreeIdx==layerInfo.layTreeIdx)) {
				layer.attribution = layerInfo.attribution;
			}	
		}
	}
	return layerAggreg;
}

/**
 * @method updateMapDefinitionAttributions Aggiorna le attribuzioni.  
 * 
 * @param {Number} nMappa Numero della mappa, attualmente gestita solo mappa 0
 * @param {Object} tocInfo Informazioni legenda, contenenti le nuove attribuzione
 */
ToloParamsJS.prototype.updateMapDefinitionAttributions= function(nMappa, tocInfo) {
	
	for (var i=0; i<this.mapDefinitions[nMappa].getLayerAggregationCount(); i++) {
		var layerAggreg = this.mapDefinitions[nMappa].getLayerAggregation(i);
		for (var j=0; j < layerAggreg.layers.length; j++) {
			var layer = layerAggreg.layers[j];
			// Controllo se definita posizione in legenda per evitare errori con in layer di sfondo
			if (layer.catTreeIdx!=undefined && layer.layTreeIdx ) {
				var layerInfo = tocInfo.getCategoryInfo(layer.catTreeIdx).layers[layer.layTreeIdx];
				layer.attribution = layerInfo.attribution;	
			}
		}
	}
	
}

/**
 * @method updateMapDefinitionCategoryCheckState
 * 
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {Object} tocInfo
 * 
 * 
 * @param {Object} catInfo
 * 
 * 
 */
ToloParamsJS.prototype.updateMapDefinitionCategoryCheckState= function(nMappa, tocInfo, catInfo) {
	var retVal = [];
	
	if (tocInfo.layerOrder && tocInfo.layerOrder.length>0) {
		for (var i = 0; i < tocInfo.layerOrder.length; i++) {
			var laypos = tocInfo.layerOrder[i];
			var cat = tocInfo.getCategoryInfo(laypos.cat);
			var lay = cat.layers[laypos.lay];
			if (lay.itemType=='layer') {
				var bAttivo = tocInfo.areAllParentCatChecked(laypos.cat) && 
							cat.checked && lay.checked;
			
				var layAggr = this.updateMapDefinitionLayerCheckState(nMappa, lay, bAttivo);
				if (retVal.indexOf(layAggr)==-1) retVal.push(layAggr);
			}
			
		}
	} else {
		tocInfo.onEachLayer(
				function (cat,lay,catIdx,layIdx) {
					if (lay.itemType=='layer') {
						var bAttivo = tocInfo.areAllParentCatChecked(catIdx) && cat.checked && lay.checked;
						var layAggr = this.updateMapDefinitionLayerCheckState(nMappa, lay, bAttivo);
						if (retVal.indexOf(layAggr)==-1) retVal.push(layAggr);
					}
				},
				this,
				catInfo.catTreeIdx,
				true
			);
	}
	return retVal;
}

/**
 * @method getLayerAggregLayersAndStylesStrings
 * 
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {Number} layerAggregIndex
 * 
 * 
 * @param {String} sep
 * 
 * 
 * @param {Number} actualZoom
 * 
 * 
 */
ToloParamsJS.prototype.getLayerAggregLayersAndStylesStrings=function(nMappa, layerAggregIndex, sep, actualZoom) {
	
	var layers = "";
	var stili = "";
	var attribution = [];
	var layerAggreg = this.mapDefinitions[nMappa].getLayerAggregation(layerAggregIndex);
	var count = layerAggreg.layers.length-1;
	for (var j=0; j<layerAggreg.layers.length; j++) {
		var i = count-j;
		if ((layerAggreg.layers[i].checked)) {
			
			// Verifica se il layer è presente a questo livello di zoom
			var visActual = (actualZoom==undefined) || (actualZoom==null) || this.checkZoomVisibility(layerAggreg.layers[i], actualZoom);
			
			if (visActual) {
				stili  += ((layers!="") ? sep : "" ) + ((layerAggreg.layers[i].style!=undefined && layerAggreg.layers[i].style!=null) ? layerAggreg.layers[i].style : "");
				if (layerAggreg.layers[i].attribution) {
					// Verifica se c'e' già
					var bFlag = true;
					for (var k = 0; k<attribution.length; k++) {
						if (attribution[k]==layerAggreg.layers[i].attribution) {
							bFlag = false;
							break;
						}
					}
					if (bFlag) attribution.push(layerAggreg.layers[i].attribution);
				}
				layers += ((layers!="") ? sep : "" ) + layerAggreg.layers[i].name;
			}
		}
	}
	
	return { layers: layers, stili: stili, attribution: attribution};
}, 

/**
 * @method checkZoomVisibility
 * 
 * 
 * @param {Object} layer
 * 
 * 
 * @param {Number} zoom
 * 
 * 
 * @return {Boolean}
 */
ToloParamsJS.prototype.checkZoomVisibility=function(layer, zoom) {
	var scalaMinima  = layer.scalaMinima;
	var scalaMassima = layer.scalaMassima;
	
	if (((scalaMinima ==undefined)||(scalaMinima ==null)||(scalaMinima ==-1)||(scalaMinima <= zoom)) &&
	    ((scalaMassima==undefined)||(scalaMassima==null)||(scalaMassima==-1)||(zoom <= scalaMassima))) {
		visible = true;
	} else {
		visible = false;
	}
	
	return visible; 
	
}

/**
 * @method addCategory
 * Aggiunge una categoria nella posizione indicata dai parametri.
 * 
 * @param {Number} nMappa
 * numero di mappa all'interno del preset
 * 
 * @param {Object} catInfo
 * Categoria da aggiungere
 * 
 * @param {String} addPointCatIdx
 * categoria prima o dopo della quale va aggiunta la roba
 * 
 * @param {Boolean} bBefore
 * indica se aggiungere prima o dopo
 * 
 */
ToloParamsJS.prototype.addCategory=function(nMappa, catInfo, addPointCatIdx, bBefore) {
		
	// Cerca addPoint
	var addPoint = this.getLegendaCategory(nMappa, addPointCatIdx);
	
	// Cerca il parent
	//TODO
	var addPointParentIdx = this.getLegendaParentCategoryIdx(addPointCatIdx);
	var addPointParent = null;
	
	// Se parent == null sono sul primo livello
	if (addPointParentIdx == "") {
		addPointParent = this.mappe.mappaList[nMappa].legenda;
	} else {
		addPointParent = this.getLegendaCategory(nMappa, addPointParentIdx);
	}
	
	var c = (addPointParent.catTreeIdx) ? addPointParent.catTreeIdx : ""; 
	
	// Calcolo la posizione di inserimento
	var idxs = addPointCatIdx.split("/");
	var pos  = parseInt(idxs[idxs.length-1]) + ((bBefore) ? 0 : 1);
	
	// Aggiorno indice cat
	catInfo.catTreeIdx = c + ((c!="") ?  "/" : "") + pos; 
	
	//Inserisco nella giusta posizione
	if (pos > 0) {
		addPointParent.categoryList.splice(pos, 0, catInfo);
	} else {
		addPointParent.categoryList.unshift(catInfo);
	}
	
	// rinumero indici
	this.updateIdxs(addPointParent, c);
	
}
	
/**
 * @method updateIdxs
 * Aggiorna tutti gli indici catTreeIdx e layTreeIdx.
 * 
 * @param {Object} cat
 * categoria dalla quale iniziare ad aggiornare gli indici
 * 
 * @param {String} newCatTreeIdx
 * nuovo valore di treeIdx
 * 
 */
ToloParamsJS.prototype.updateIdxs=function(cat, newCatTreeIdx) {
		
	if (newCatTreeIdx!="") {
		// Aggiorna questa categoria
		var oldCatTreeIdx = cat.catTreeIdx;
		cat.catTreeIdx = newCatTreeIdx;
		//this.fireEvent("catTreeIdxUpdate", cat.catId, oldCatTreeIdx, newCatTreeIdx);
	
		// Aggiorna tutti i layer
		var layArray = cat.layerList;
		if (layArray) {
			for (var i=0; i<layArray.length; i++) {
				layArray[i].catTreeIdx = newCatTreeIdx;
				// Utilizza i il nuovo catTreeIdx perchè ha già rinumerato la categoria con l'evento precedente
				//this.fireEvent("catLayIdxUpdate", layArray[i].layId, newCatTreeIdx, layArray[i].layTreeIdx, layArray[i].layTreeIdx);
			}
		}
	} 
	
	// Cicla sulle categorie figlie
	var catArray = cat.categoryList;
	if (catArray) {
		for (var i=0; i<catArray.length; i++) {
			var newPrefix = newCatTreeIdx + ((newCatTreeIdx != "") ? "/" : "") + i ;				
			this.updateIdxs(catArray[i],newPrefix);		
		}
	}
	
}
	
/**
 * @method addLayer
 * Aggiunge un layer nella posizione indicata dai parametri.
 * 
 * @param {Number} nMappa
 * numero di mappa all'interno del preset
 * 
 * @param {Object} layInfo
 * Layer da aggiungere
 * 
 * @param {String} addPointCatIdx
 * Indice della categoria nella quale viene aggiunto il layer
 * 
 * @param {String} addPointLayIdx
 * Indice layer prima o dopo del quale aggiungere il nuovo layer
 * 
 * @param {Boolean} bBefore
 * indica se aggiungere prima o dopo
 * 
 */
ToloParamsJS.prototype.addLayer=function(nMappa, layInfo, addPointCatIdx, addPointLayIdx, bBefore) {
	
	// Cerca addPoint
	var addPoint = this.getLegendaCategory(nMappa, addPointCatIdx);
	
	// Calcolo la posizione di inserimento
	if (addPointLayIdx) {
		pos = parseInt(addPointLayIdx) + ((bBefore) ? 0 : 1);
	} else { // se non è definito addPointLayIdx inserire come primo elemento della categoria
		pos = addPoint.layerList.length-1;
	}
	
	// Aggiorno indice cat
	layInfo.catTreeIdx = addPointCatIdx; 
	layInfo.layTreeIdx = "" + pos;
	
	//Inserisco nella giusta posizione
	if (pos > 0) {
		addPoint.layerList.splice(pos, 0, layInfo);
	} else {
		addPoint.layerList.unshift(layInfo);
	}
	
	// rinumero indici
	for (var i=0; i<addPoint.layerList.length; i++) {
		var l = addPoint.layerList[i];
		var oldLayTreeIdx = l.layTreeIdx
		l.layTreeIdx = i;
		//this.fireEvent("catLayIdxUpdate", l.layId, addPointCatIdx, oldLayTreeIdx, l.layTreeIdx);
	}
	
	if (layInfo.queryable) {
	
		// Aggiunta azione vis per identify
		var eventiLayer = {
			interactable: true,
			codTPN: layInfo.codTPN,
			copertura: false,
			descrizioneLayer: layInfo.descrizione, 
			interactable: true,
			nomeLayer: layInfo.descrizione,
			tipoGeometria: 3,   // ????
			azioniEventiVis: {
				autoVisOnSelect: true,
				azioneList: [{
						ajaxCall: false,
						useWMSGetFeatureInfo: true,
						target: 'pannello'
					}
				]
			},
			azioniEventiCanc: {
				azioneList: []
				},
			azioniEventiIns: {
				azioneList: []
				},
			azioniEventiUpdateGeom: {
				azioneList: []
			},
			azioniEventiUpdateAlpha: {
				azioneList: []
			}
			
		};
		
		this.azioniEventi.eventiLayerList.push(eventiLayer);
		// forza l'aggiornamento della tabella dei selezionabili
		this.getSelectableCodTPN(true);
		
	}
	
		
}

/**
 * @method addServer
 * Aggiunge un server alla lista di quelli disponibili
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {Object} serverInfo
 * 
 * 
 * @return {Object}
 * 
 * 
 */
ToloParamsJS.prototype.addServer=function(nMappa, serverInfo) {
	
	// Controlla se esiste serverPool
	if (this.serverPool!=undefined && this.serverPool!=null) {
		// Scorre la lista dei server gia' definiti per vedere se ce ne è già uno adatto
		var listaServer = this.serverPool.serverList;
		
		for (var i=0; i<listaServer.length; i++ ) {
			if (listaServer[i].url==serverInfo.url &&
				listaServer[i].typeDescription==serverInfo.typeDescription &&
				listaServer[i].typeCode==serverInfo.typeCode &&
				listaServer[i].allowServerConnection==serverInfo.allowServerConnection &&
				listaServer[i].tilesMultiple==serverInfo.tilesMultiple &&
				listaServer[i].tileStampaAltezza==serverInfo.tileStampaAltezza &&
				listaServer[i].tileStampaLarghezza==serverInfo.tileStampaLarghezza &&
				listaServer[i].opacity==serverInfo.opacity) {
					return listaServer[i].id;
			} 
		}
		// Se non c'e' genero un SERVERID
		serverInfo.id = "AUTOGENERATED" + Math.random();
		listaServer.push(serverInfo);
		return serverInfo.id;
		
	} else {
		this.serverPool = [];
		serverInfo.id = "AUTOGENERATED" + Math.random();
		listaServer.push(serverInfo);
		return serverInfo.id;
	}
	
}

/**
 * @method isQGISExportable
 * 
 * 
 * @param {Number} nMappa
 * 
 * 
 * @param {String} catTreeIdx
 * 
 * 
 * @param {String} layTreeIdx
 * 
 * 
 * @return {Boolean}
 * 
 * 
 */
ToloParamsJS.prototype.isQGISExportable=function(nMappa, catTreeIdx, layTreeIdx) {

	var mappa = this.mappe.mappaList[nMappa];
	var cat = this.getLegendaCategory(nMappa, catTreeIdx);
	var lay = cat.layerList[layTreeIdx];
	var serverID = lay.serverID;
	var server = this.getServer(serverID, mappa);
	
	return (server.typeCode=='11');
}

/**
 * @method isQueryBuilder
 *  
 * @return {Boolean}
 */
ToloParamsJS.prototype.isQueryBuilder=function() {
	var qb = 0;
	for(var i=0; i<this.azioniEventi.eventiLayerList.length; i++) {
		var eventiLayer = this.azioniEventi.eventiLayerList[i];
		if (eventiLayer.queryBuilder) {
			qb++;
			break;
		}
	}
	return (qb>0) ? true : false;
}


ToloParamsJS.prototype.withSpatialiteExporter=function(codTPN) {	
	for(var i=0; i<this.azioniEventi.eventiLayerList.length; i++) {
		var eventiLayer = this.azioniEventi.eventiLayerList[i];
		if (eventiLayer.codTPN == codTPN) {			
			if(eventiLayer.queryBuilder){
				return !!eventiLayer.queryBuilder.conEsportaSpatialite;
			} else {
				return false;
			}
		}
	}	
}