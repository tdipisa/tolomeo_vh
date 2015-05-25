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
 * @class TolomeoExt.ToloTOCPanelExt
 * @extends Ext.Panel
 * Pannello per contenere una mappa. 
 * 
 */
Ext.define('TolomeoExt.ToloTOCPanelExt', {

	extend: 'Ext.Panel',
	
	
	/** 
	 * @property {Object} lastUsedLocalCodTPN
	 * 
	 * 
	 */
	lastUsedLocalCodTPN: null,
	
	/** 
	 * @property {Object} dataProvidcerOpt
	 * 
	 * 
	 */
	dataProvidcerOpt: null,
	
	/** 
	 * @property {Boolean} showHideContainer
	 * Contenitore che deve essere
	 * mostrato/nascosto per visualizzare o nascondere la legenda Se null
	 * viene visualizzato e nascosto questo stesso pannelleo
	 * 
	 */
	showHideContainer : null,

	/** 
	 * @property {Function} showHandler
	 * Funzione da chiamare per visualizzare la legenda. Se null non viene chiamata
	 * 
	 */
	showHandler : null,

	/** 
	 * @property {Function} hideHandler
	 * Funzione da chiamare per nascondere la legenda. Se null non viene chiamata
	 * 
	 */
	hideHandler : null,

	/** 
	 * @property {Boolean} isTOCVisible
	 * 
	 * 
	 */
	isTOCVisible : null,

	/** 
	 * @property {Object} paramsJS
	 * 
	 * 
	 */
	paramsJS : null,

	/** 
	 * @property {Object} dataProvider
	 * 
	 * 
	 */
	dataProvider : null,

	/** 
	 * @property {Object} tocInfo
	 * 
	 * 
	 */
	tocInfo : null,

	/** 
	 * @property {String} TOLOMEOServer
	 * 
	 * 
	 */
	TOLOMEOServer : null,

	/** 
	 * @property {String} TOLOMEOContext
	 * 
	 * 
	 */
	TOLOMEOContext : null,

	/** 
	 * @property {Object} scale
	 * scala attuale aggiornata ad ogni chiamata di creazione o aggiornamento TOC da parte di metodi invocati da API
	 * si è reso necessario per gestione cambio stile
	 * 
	 */
	scale: null,
	
	/** 
	 * @property {String} iconBasePath
	 * 
	 * 
	 */
	iconBasePath:null, 

	/**
	 * @method initComponent
	 * Metodo relativo alla gestione Ext.
	 * 
	 */
	initComponent : function() {

		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		this.isTOCCreated = false;
		this.isFullDataRequested = false;
		this.isTOCGUICreated = false;
		
		if (this.dataProviderOpt==null) this.dataProviderOpt={}; 
	
		// decide il tipo di dataprovider da utilizzare se non definito
		// modificato per utilizzare il multiserver
		var dpxtype = "widget.tx_ToloTOCMultiServerProvider";
		// ...anche nel caso che venissero forzati i dataprovider attualmente esistenti   
		if ((this.dataProviderOpt.xtype=='tx_toloTOCMapServerDataProvider') || (this.dataProviderOpt.xtype=='tx_toloTOCGeoserverDataProvider')) {
			this.dataProviderOpt.xtype = dpxtype;
		}
		
		/*
		switch (this.getParametriMappaCurr().typeCode) {
			case 0: 	// Mapserver
				dpxtype = 'tx_toloTOCMapServerDataProvider';
				break;
			case 11:	// WMS
				dpxtype = 'tx_toloTOCGeoserverDataProvider';	
				break;
			default:
				// data provider non definito
				
		}*/
		
		TolomeoExt.applyIfEmpty(this.dataProviderOpt, {
				TOLOMEOServer: this.TOLOMEOServer,
				TOLOMEOContext: this.TOLOMEOContext,				
				paramsJS : this.paramsJS,
				xclass: dpxtype 		//'tx_toloTOCMapServerDataProvider'
			});
		
		// se definito tipo di dataprovider lo creo
		if (dpxtype!='') this.dataProvider = Ext.create(this.dataProviderOpt);
		
		
		// TODO Events
		// TODO ? this.addEvents('layerSelectionChange');
		// TODO ? this.addEvents('categorySelectionChange');
		// TODO ? this.addEvents('categoryEnableChange');
		this.addEvents('layerCheckedChange');
		this.addEvents('categoryCheckedChange');
		this.addEvents('layerOpacityChange');
		this.addEvents('layerOrderChange');
		this.addEvents('layerStyleChanged');
		
		/**
		 * @event stylePanelRequest
		 * Lanciato quando viene richiesta la visualizzazione del pannello di gestione degli stili
		 * @param {String} nome nome layer
		 * @param {Number} cat numero categoria del layer 
		 * @param {Number} lay numero del layer
		 * @param {String[][]} 	Elenco degli stili definiti per il layer nella forma [[stile1],[stile2]] 
		 * 
		 */
		this.addEvents('stylePanelRequest');
		this.addEvents('ajaxError');
		this.addEvents('tocCreate');
		this.addEvents('tocGuiCreate');

		this.addEvents('contextMenuZoomToExtent');
		this.addEvents('contextMenuShowInfo');
		this.addEvents('contextMenuZoomMaxScaleMax');
		this.addEvents('contextMenuZoomMinScaleMin');
		
		this.addEvents('contextMenuAddWMSFromCatalogClick');
		
		/**
		 * @event contextMenuMetadataClick
		 * Lanciato quando viene scelta la voce del menu di contesto relativa al metadato del layer
		 * @param {Object}  Oggetto javascript contenente i campi format, type e url
		 */
		this.addEvents('contextMenuMetadataClick');
		
		this.addEvents('exportForQgisClicked');
		
		
		//this.addEvents('contextMenuAddCategory');
		//this.addEvents('contextMenuAddLayer');
		
		/**
		 * @event layerLinkClick
		 * Lanciato quando viene clickato una voce di legenda corrispondente ad un layer
		 * @param  {Number} cat indice della categoria
		 * @param  {Number} lay indice del layer
		 */
	//	this.addEvents('layerLinkClick');
	//	this.addEvents('categoryLinkClick');
		
		
		this.addEvents('categoryAdded');
		this.addEvents('layerAdded');
		
		this.addEvents('itemSelected');
		this.addEvents('itemClicked');
		this.addEvents('addLayerToQgisClicked');
		
		this.dataProvider.on('onFullDataRequestEnd', this.onFullDataRequestEnd, this);
		this.dataProvider.on('onVisibleDataRequestEnd', this.onVisibleDataRequestEnd , this);
		this.dataProvider.on('onRequestLayerInfoDataEnd', this.addLayerCallback , this);
		
		
		this.tocInfoField = new Ext.form.TextField({
	    	name: 'tocInfo'
	    });
	    							
	    this.paramsJSField = new Ext.form.TextField({
	    	name: 'paramsJS'
	    });
		
		this.nMappaField = new Ext.form.TextField({
			name: 'nMappa'
		});
		
		this.idxCategoriaBase = new Ext.form.TextField({
			name: 'idxCategoriaBase'
		});
		
		this.idxLayerBase = new Ext.form.TextField({
			name: 'idxLayerBase'
		});

	    this.submitForm = new Ext.form.FormPanel({
			hidden: true,
			renderTo: Ext.getBody(),
			bodyStyle: 'position:absolute; top: 0px; left 0px;',
			standardSubmit: true,
			method: 'POST',
			items: [this.tocInfoField, this.paramsJSField, this.layerOrderField, this.nMappaField, this.idxCategoriaBase, this.idxLayerBase]
	    });		
	    
		
	    if (this.iconBasePath==null) this.iconBasePath =  TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'img/icone/16-default/';

		this.callParent();
		//TolomeoExt.ToloTOCPanelExt.superclass.initComponent.call(this);
	},

	/**
	 * @method onFullDataRequestEnd
	 * 
	 * 
	 * @param {Object} obj
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	onFullDataRequestEnd: function(obj, scale) {
		
		var legenda = this.getParametriMappaCurr().legenda;
		var objBuff = {};
		Ext.apply(objBuff, obj);
		Ext.apply(objBuff, { presetLegenda: legenda});
		var a = [];
		
		this.tocInfo = new TolomeoExt.ToloTOCInfo(objBuff);
		
		this.tocInfo.on("catTreeIdxUpdate", this.onTOCInfoCatTreeIdxUpdate, this);
		this.tocInfo.on("layTreeIdxUpdate", this.onTOCInfoLayIdxUpdate, this);
		
		if (legenda) {
			this.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) { 
					lay.checked = lay.defaultGroup;
					if (lay.temporaryNotAvailable) a.push({catIdx: catIdx, layIdx: layIdx});
					lay.parentcategorychecked = cat.checked;
					lay.layId = cat.catId + "-" + lay.descr;
					var tocInfo = this.tocInfo;
					lay.isEnabled = function(){
						
						if (/* tocInfo.areAllParentCatChecked(catIdx) */ tocInfo.areAllParentCatChecked(cat.catTreeIdx) && cat.checked){
							//return this.parentcategorychecked && this.checked; 
							//return this.checked;
							return this.checked;
						}else{
							//return this.checked;
							return false;
						}
					}
					
					var layer = this.tocInfo.getCategoryPresetInfo(catIdx).layerList[layIdx];
					
					var smin = (layer) ? layer.scalaMinima : -1;
    				var smax = (layer) ? layer.scalaMassima : -1;
					
					lay.visible=this.layerIsVisibleAtScale(scale, smin, smax, lay.minScaleMin, lay.maxScaleMax );

				},
				this
			);
			
		}
		
		this.createTOC(scale);
		for (var i=0; i<a.length; i++) {
			this.setLayerStateChange(a[i].catIdx, a[i].layIdx, false, true);	
		}
		
	},
	
	/**
	 * @method onVisibleDataRequestEnd
	 * 
	 * 
	 * @param {Object} obj
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	onVisibleDataRequestEnd: function(obj, scale) {
		this.updateTocInfoFromVisibleRequest(obj, scale);
		this.updateTOC(scale);
	},
	
	/**
	 * @method showTOC
	 * Visualizza la legenda. La legenda deve essere stata precedentemente creata ed aggornata ai cambi scala con createOrUpdate
	 * 
	 */
	showTOC : function() {

		if (this.isTOCCreated) {
			// solo visualizzare ed aggiornare
			this.isTOCVisible = true;
	
			if (this.showHandler != null) {
				this.showHandler.call(this);
			} else if (this.showHideContainer != null) {
				this.showHideContainer.setVisible(this.isTOCVisible);
			} else
				this.setVisible(this.isTOCVisible);
	
			// setta anche eventuali container
			/*
			 * ct=this.ownerCt; while (ct) { ct.setVisible(this.isTOCVisible);
			 * ct=ct.ownerCt; }
			 */
		}
		
	},

	/**
	 * @method hideTOC
	 * 
	 * 
	 */
	hideTOC : function() {
		if (this.isTOCVisible != null) {
			this.isTOCVisible = false;
			if (this.hideHandler != null) {
				this.hideHandler.call(this);
			} else if (this.showHideContainer != null) {
				this.showHideContainer.setVisible(this.isTOCVisible);
			} else
				this.setVisible(this.isTOCVisible);
		}
	},

	/**
	 * @method createTOC
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	createTOC : function(scale) {
		this.scale=scale;
		this.isTOCCreated = true;
		this.fireEvent('tocCreate');
	},

	/**
	 * @method updateTOC
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	updateTOC : function(scale, posObj) {
		if (scale != undefined) this.scale=scale;
		if (posObj != undefined) this.posObj = posObj;
		this.updateTocInfoVisibleAtScale(scale);
	},
	
	/**
	 * @method createOrUpdate
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 * @param {Boolean} forceRequest
	 * se true forza la richiesta al server dei layer visibili alla scala indicata, altrimenti la legenda viene aggiornata con i dati disponibili
	 * 
	 */
	createOrUpdate: function(scale, forceRequest, posObj) {		
		if (scale != undefined) this.scale  = scale;
		if (posObj != undefined) this.posObj = posObj;
		if (this.isFullDataRequested) {
			//this.requestVisibleData(scale);
			// TODO scelta per casi nei quali va richiesto l'aggiornamento al server come in caso di cambi di stile
			var thisPanel = this;
			if (!this.isTOCCreated) {
				setTimeout(function() {	thisPanel._requestOrUpdate(scale, forceRequest); },4500);
			} else {
				this._requestOrUpdate(scale, forceRequest);
			}
		} else {
			this.requestFullData(scale);
		}		
	},

	/**
	 * @method _requestOrUpdate
	 * @private
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 * @param {Boolean} forceRequest
	 * 
	 * 
	 */
	_requestOrUpdate: function(scale, forceRequest) {
		if (forceRequest) {
			this.requestVisibleData(scale); 
		} else {
			this.updateTOC(scale);
		}
	},
	
	/**
	 * @method requestFullData
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	requestFullData : function(scale) {
		this.scale=scale;
		this.isFullDataRequested = true; 
		var parametriMappaCurr = this.getParametriMappaCurr();
		if (parametriMappaCurr.legenda) {
			var options = {
				presetName: this.paramsJS.nomePreset, 
				currentMap: parametriMappaCurr, 
				scale: scale,
				presetXML: this.presetXML,
				sendPreset: this.sendPreset
			};
						
			this.dataProvider.requestFullData(options);
		}
	},

	/**
	 * @method requestVisibleData
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	requestVisibleData : function(scale) {
		this.scale=scale;
		var parametriMappaCurr = this.getParametriMappaCurr();
		if (parametriMappaCurr.legenda) {
			var options = {
				presetName: this.paramsJS.nomePreset, 
				currentMap: parametriMappaCurr, 
				scale: scale,
				tocInfo: this.tocInfo,
				presetXML: this.presetXML,
				sendPreset: this.sendPreset
			};	
					
			this.dataProvider.requestVisibleData(options);
		}
	},

	/**
	 * @method getScaleMinMaxFromIdxs
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 */
	getScaleMinMaxFromIdxs: function(catIdx, layIdx) {
	
		var lay = this.tocInfo.getCategoryInfo(catIdx).layers[layIdx]
		var layerPresetInfo = this.tocInfo.getCategoryPresetInfo(catIdx).layerList[layIdx];
		
		var smin = (layerPresetInfo) ? layerPresetInfo.scalaMinima : -1;
    	var smax = (layerPresetInfo) ? layerPresetInfo.scalaMassima : -1;
		
		return this.getScaleMinMax( smin, smax, lay.minScaleMin, lay.maxScaleMax);
		
	},
	
	/**
	 * @method getScaleMinMax
	 * 
	 * 
	 * @param {Object} legendaScalaMinima
	 * 
	 * 
	 * @param {Object} legendaScalaMassima
	 * 
	 * 
	 * @param {Object} styleMinScaleMin
	 * 
	 * 
	 * @param {Object} styleMaxScaleMax
	 * 
	 * 
	 */
	getScaleMinMax: function(legendaScalaMinima, legendaScalaMassima, styleMinScaleMin, styleMaxScaleMax) {
		
		var scalaMinima  = legendaScalaMinima;
		var scalaMassima = legendaScalaMassima;
		
		if ((scalaMinima ==undefined)||(scalaMinima ==null)||(scalaMinima ==-1)) {
			// Se non definito su preset conta quello da stile
			scalaMinima = styleMinScaleMin;
		} 
		
		if ((scalaMassima ==undefined)||(scalaMassima ==null)||(scalaMassima ==-1)) {
			// Se non definito su preset conta quello da stile
			scalaMassima = styleMaxScaleMax;
		} 
		
		return {scalaMinima: scalaMinima, scalaMassima: scalaMassima};
		
	},
	
	/**
	 * @method layerIsVisibleAtScale
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 * @param {Object} legendaScalaMinima
	 * 
	 * 
	 * @param {Object} legendaScalaMassima
	 * 
	 * 
	 * @param {Object} styleMinScaleMin
	 * 
	 * 
	 * @param {Object} styleMaxScaleMax
	 * 
	 * 
	 */
	layerIsVisibleAtScale: function(scale,legendaScalaMinima, legendaScalaMassima, styleMinScaleMin, styleMaxScaleMax) {
    	
		var scala = this.getScaleMinMax(legendaScalaMinima, legendaScalaMassima, styleMinScaleMin, styleMaxScaleMax);
		
		var scalaMinima  = scala.scalaMinima;
		var scalaMassima = scala.scalaMassima;
		
		if (((scalaMinima ==undefined)||(scalaMinima ==null)||(scalaMinima ==-1)||(scalaMinima <= scale)) &&
		    ((scalaMassima==undefined)||(scalaMassima==null)||(scalaMassima==-1)||(scale <= scalaMassima))) {
			visible = true;
		} else {
			visible = false;
		}
		
		return visible;
	     
    },	

	/**
	 * @method updateTocInfo
	 * Aggiorna la struttura TocInfo con il risultato di una richiesta di update
	 * 
	 * @param {Object} visibleStateInfo
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	updateTocInfoFromVisibleRequest : function(visibleStateInfo, scale) {
		var legenda = this.getParametriMappaCurr().legenda;
		if (this.tocInfo && this.tocInfo.presetLegenda) {	
			for (var i = 0; i < visibleStateInfo.layers.length; i++) {
				var lay = visibleStateInfo.layers[i].lay;
				var cat = visibleStateInfo.layers[i].cat;
				this.tocInfo.setLayerNeedRequestVisibleData(cat, lay, false);
				var categoria = this.tocInfo.getCategoryPresetInfo(cat);
				var layer = categoria.layerList[lay]; // info sul layer da preset
				this.tocInfo.getCategoryInfo(cat).layers[lay].minScaleMin = visibleStateInfo.layers[i].minScaleMin;
				this.tocInfo.getCategoryInfo(cat).layers[lay].maxScaleMax = visibleStateInfo.layers[i].maxScaleMax;
				if (visibleStateInfo.layers[i].urlLegendaClasseUnica != undefined && 
						visibleStateInfo.layers[i].urlLegendaClasseUnica!=null && 
						visibleStateInfo.layers[i].urlLegendaClasseUnica!="") {
					this.tocInfo.getCategoryInfo(cat).layers[lay].classi[0].nome = visibleStateInfo.layers[i].urlLegendaClasseUnica;
				}
			}
		}
	},
	
	/**
	 * @method updateTocInfoVisibleAtScale
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 */
	updateTocInfoVisibleAtScale: function(scale) {
	
		if (this.tocInfo && this.tocInfo.presetLegenda)
		this.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) { 
					
					var categ = this.tocInfo.getCategoryPresetInfo(catIdx);
					if (categ!=undefined && categ!=null) { 
						var layer = categ.layerList[layIdx];
						lay.visible = this.layerIsVisibleAtScale(scale, layer.scalaMinima, layer.scalaMassima, lay.minScaleMin, lay.maxScaleMax );
					}
					else  lay.visible = this.layerIsVisibleAtScale(scale, -1, -1, lay.minScaleMin, lay.maxScaleMax );
				},
				this
		);
		
	},
	
	/**
	 * @method setLayerStateChange
	 * 
	 * 
	 * @param {Object} cat
	 * cat.
	 * 
	 * @param {Object} lay
	 * lay.
	 * 
	 * @param {Object} checked
	 * checked.
	 * 
	 * @param {Object} force
	 * se true forza l'operazione anche se lo stato da impostare è uguale a quello attuale
	 * 
	 */
	setLayerStateChange : function(cat, lay, checked, force) {
		
		 
		if (this.tocInfo != null) {
			if (lay != null) {
				// Aggiorna la struttura in memoria
				this.tocInfo.getCategoryInfo(cat)
				var layer = this.tocInfo.getCategoryInfo(cat).layers[lay];
				if(!force && layer.checked == checked) return;
				layer.checked = checked;
				
				// Nel caso di catagoria mutuamente esclusiva, se ho acceso questo layer spengo tutti gli altri
				if (checked==true) {
					var legenda = this.getParametriMappaCurr().legenda;
					if (legenda && this.tocInfo.getCategoryPresetInfo(cat).mutualExclusive && this.tocInfo.getCategoryPresetInfo(cat).mutualExclusive==true) {
						for (var i=0; i < this.tocInfo.getCategoryInfo(cat).layers.length; i++) {
							if (i!=lay) this.setLayerStateChange(cat, i, false);
						}
					}
				}				

				this.fireEvent('layerCheckedChange',layer, this.tocInfo);
				
			} else {
				this.setCategoryStateChange(cat,checked);				
			}
		}		
	},
	
	/**
	 * @method setCategoryStateChange
	 * 
	 * 
	 * @param {Object} cat
	 * cat.
	 * 
	 * @param {Object} checked
	 * checked.
	 * 
	 */
	setCategoryStateChange : function(cat, checked) {
		if (this.tocInfo != null) {
			var category = this.tocInfo.getCategoryInfo(cat);
			
			category.checked = checked;

			if (checked == true) {
				var legenda = this.getParametriMappaCurr().legenda;
				var parentCategory = this.tocInfo
						.getCategoryInfo(this.tocInfo
								.getParentCategoryIdx(cat));

				if (parentCategory) {
					if (legenda
							&& this.tocInfo
									.getCategoryPresetInfo(this.tocInfo
											.getParentCategoryIdx(cat)).mutualExclusiveCategories
							&& this.tocInfo
									.getCategoryPresetInfo(this.tocInfo
											.getParentCategoryIdx(cat)).mutualExclusiveCategories == true) {
						for (var i = 0; i < parentCategory.categories.length; i++) {
							if (parentCategory.categories[i].catTreeIdx != cat) {
								this
										.setCategoryStateChange(
												parentCategory.categories[i].catTreeIdx,
												false);
							}
						}
					}
				} else {
					if (legenda
							&& this.tocInfo.presetLegenda.mutualExclusiveCategories
							&& this.tocInfo.presetLegenda.mutualExclusiveCategories == true) {
						for (var i = 0; i < this.tocInfo.categories.length; i++) {
							if (this.tocInfo.categories[i].catTreeIdx != cat) {
								this
										.setCategoryStateChange(
												this.tocInfo.categories[i].catTreeIdx,
												false);
							}
						}
					}
				}
			}

			this.fireEvent('categoryCheckedChange', category,
					this.tocInfo);
		}		
	},

	/**
	 * @method setAllLayersState
	 * Imposta allo stato passato tutti i layer in maniera non ricorsiva e senza modificare lo stato dei layer hidden.
	 * 
	 * @param {Object} cat
	 * cat.
	 * 
	 * @param {Object} checked
	 * checked.
	 * 
	 */
	setAllLayersState: function(cat, checked) {
		if (this.tocInfo != null) {
			this.tocInfo.onEachLayer(
					function(cat, lay, catIdx, layIdx) {
						//userSwitchable
						var layInfo = this.tocInfo.getCategoryPresetInfo(catIdx).layerList[layIdx];
						if (layInfo.hidden!=true && layInfo.userSwitchable!=false) {
							this.setLayerStateChange(catIdx, layIdx, checked);	
						}
					},					
					this, cat, false); 
		}
	},
	
	/**
	 * @method layerOrderChange
	 * 
	 * 
	 */
	layerOrderChange: function() {
		this.fireEvent('layerOrderChanged', this.tocInfo);
	},

	/**
	 * @method showAjaxError
	 * TODO gestire errori
	 * 
	 * @param {Object} transport
	 * 
	 * 
	 */
	showAjaxError : function(transport) {
		Ext.MessageBox.show({
			title: 'Errore Ajax',
			msg: 'Problemi nell\'aggiornamento della legenda',
			buttons: {
				yes: 'Mostra',
				cancel: 'Continua'
			},
			icon: Ext.MessageBox.ERROR,
			fn: function(btn) {
				switch (btn) {
					case 'yes':
						Ext.MessageBox.alert('Errore Ajax', transport.responseText);
						break;
				}
			}
		});
		
		this.fireEvent('ajaxError', transport);
	},

	/**
	 * @method getCurrTOCSettings
	 * 
	 * 
	 * @returns {Object}
	 * legenda
	 * 
	 */
	getCurrTOCSettings : function() {
		return this.getParametriMappaCurr().legenda;
	},

	/**
	 * @method getParametriMappaCurr
	 * 
	 * 
	 * @returns {Object}
	 * Restituisce i parametri correnti della mappa.
	 * 
	 */
	getParametriMappaCurr : function() {
		//TODO gestisce solo prima mappa
		return this.paramsJS.mappe.mappaList[0];
	},

	/**
	 * @method layerIsVisible
	 * Se il layer non è in legenda si suppone che sia visibile sempre.
	 * 
	 * @returns {Boolean}
	 * true if layer is visible
	 * 
	 */
	layerIsVisible : function(codTPN) {
		var bPresente = false;

		if (this.tocInfo) {
			
			var returnObj = { bPresente:false, bVisible: false };
			
			this.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) {
					if (lay.codTPN == codTPN) {
						if ((lay.isEnabled()) && lay.visible ) { //this.layerIsScaleVisible(codTPN) 
							this.bPresente= true;
							this.bVisible = true;
						} else {
							this.bPresente = true;
							this.bVisible = false;
						}
					}
				},
				returnObj
			
			);
		
			return (!returnObj.bPresente || returnObj.bVisible )
		}
	},
	
	/**
	 * @method getVisibleLayers
	 * Restituisce la lista ordinata dei codici dei layers visibili.
	 * 
	 * @returns {Array}
	 * lista dei layers visibili
	 * 
	 */
	getVisibleLayers : function() {
		
		var visibleLayers = [];		

		var returnObj = { visibleLayers: visibleLayers, tocInfo: this.tocInfo };
		
		if (this.tocInfo.layerOrder && this.tocInfo.layerOrder.length>0) {
			
			for (var i = 0; i < this.tocInfo.layerOrder.length; i++) {
				var laypos = this.tocInfo.layerOrder[i];
				var cat = this.tocInfo.getCategoryInfo(laypos.cat);
				var lay = cat.layers[laypos.lay];
				
				if ( this.tocInfo.areAllParentCatChecked(laypos.cat) && cat.checked && lay.checked && lay.visible ){ 
					visibleLayers.push(lay);
				}
			}
			
		} else {
		
			this.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) {
					if ( this.tocInfo.areAllParentCatChecked(catIdx) && cat.checked && lay.checked && lay.visible ){ 
						this.visibleLayers.push(lay);
					}
				},
				returnObj
			);

		}
		return returnObj.visibleLayers;
	},
	
	/**
	 * @method setLayerVisibility
	 * 
	 * 
	 * @param {Object} codTPN
	 * 
	 * 
	 */
	setLayerVisibility : function(codTPN) {
		
		if (!this.layerIsVisible(codTPN)) {
			if (this.tocInfo) {
				this.tocInfo.onEachLayer(
						function(cat, lay, catIdx, layIdx) {
							if (lay.codTPN == codTPN) {
								
								this.checkAllParentCat(catIdx, true);
								if (!lay.checked){
									this.setLayerStateChange(catIdx, layIdx, true);
								}
							}
						},
						this
					);
			}
		}
		
	}, 
	
	/**
	 * @method checkAllParentCat
	 * Accende tutte le categorie antenato della categoria indicata, più eventualmente la categoria stessa
	 * 
	 * @param {String} catIdx
	 * Indice della categoria della quale devono essere accesi tutti i parent
	 * 
	 * @param {Boolean} withCurrent
	 * indica se deve essere accesa anche la categoria corrente (catIdx). Default=false
	 * 
	 */
	checkAllParentCat: function(catIdx, withCurrent) {
		
		var bAllChecked = this.tocInfo.areAllParentCatChecked(catIdx);				
		if (!bAllChecked) {
			this.tocInfo.onEachParentCategory(
					function(cat1,catIdx1) {
						this.setCategoryStateChange(catIdx1, true);
					}, 
					this,
					catIdx); 
		}
		if (withCurrent) {
			var cat = this.tocInfo.getCategoryInfo(catIdx);
			if (!cat.checked ){
				this.setCategoryStateChange(catIdx, true);
			}
		}
	
		
	},
	
	/**
	 * @method setLayerStyle
	 * 
	 * 
	 * @param {Object} cat
	 * 
	 * 
	 * @param {Object} lay
	 * 
	 * 
	 * @param {Object} style
	 * 
	 * 
	 */
	setLayerStyle: function (cat, lay, style) {
		
		var layer = this.tocInfo.getCategoryInfo(cat).layers[lay];
		layer.style = style;
		this.tocInfo.setLayerNeedRequestVisibleData(cat, lay, true);
		this.createOrUpdate(this.scale, true, this.posObj);
		this.fireEvent('layerStyleChanged', layer, style);
	},
	
	/**
	 * @method setPresetXML
	 * 
	 * 
	 * @param {Object} presetXML
	 * 
	 * 
	 */
	setPresetXML: function(presetXML){
		this.presetXML = presetXML;
	},
	
	/**
	 * @method getContextMenu
	 * 
	 * 
	 * @param {Object} cat
	 * 
	 * 
	 * @param {Object} lay
	 * 
	 * 
	 */
	getContextMenu: function(cat, lay) {
		
		// TODO Gestisce solo mappa 0
		var nMappa = 0;
		
		var me = this;
		
		var layInfo = null;
		var catInfo = this.tocInfo.getCategoryInfo(cat)
		if (lay) layInfo = catInfo.layers[lay];
		var isLayer = layInfo && layInfo.itemType=='layer';
		var isCategory = (lay==undefined || lay==null) && catInfo && catInfo.itemType=='category';
		
		var menu = Ext.create('Ext.menu.Menu',{
		    cls: "clearCSS"
		});
		
		if (isLayer) {
			menu.add({
		    			text: 'Informazioni',
		    			//disabled: (this.tocInfo.getBoundingBox(cat, lay)==null),
		    			listeners: { click: {
    							fn: function() { this.fireEvent('contextMenuShowInfo', cat,lay, this.tocInfo); },
    							scope: this
    							}
    						}
		    		});
			
			//if (this.tocInfo.getCategoryPresetInfo(cat).layerList[lay].attribution) {
			if (layInfo.attribution) {
				menu.add({
	    			text: 'Attribuzioni',
	    			//disabled: (this.tocInfo.getBoundingBox(cat, lay)==null),
	    			listeners: { click: {
							//fn: function() { Ext.MessageBox.alert('Attribuzioni', this.tocInfo.getCategoryPresetInfo(cat).layerList[lay].attribution ); },
	    					fn: function() { Ext.MessageBox.alert('Attribuzioni', layInfo.attribution.title ); },
							scope: this
							}
						}
	    		});
			}
			
			var mdList = layInfo.metadataUrlList;
			if (mdList && mdList.length>0) {
				var mdItems = [];
				for (var i = 0; i < mdList.length; i++) {
					var md = mdList[i];
					mdItems.push({
							toloMetadata: md,
	    	    			text: md.type,
	    	    			listeners: { click: {
	    	    							fn: function() { 
	    	    									me.fireEvent('contextMenuMetadataClick', this.toloMetadata);
	    	    								}
	    	    							}
	    	    						}	    	    		
						});
				}
				var menuMetadata = Ext.create('Ext.menu.Item',
						{
							text: 'Metadati',
							menu: {
								items: mdItems,
				    	    	 cls: "clearCSS"
								}
							});
				menu.add(menuMetadata);
			}
			
		}
		
		if (isCategory) {
			var menuAccendiSpegni = Ext.create('Ext.menu.Item',
					{
						text: 'Accendi/Spegni',
						menu: {
							items: [{
			    	    			text: 'Accendi tutto',
			    	    			disabled: this.tocInfo.getCategoryPresetInfo(cat).mutualExclusive,
			    	    			listeners: { click: {
			    	    							fn: function() { this.setAllLayersState(cat, true); },
			    	    							scope: this
			    	    							}
			    	    						}
			    	    			},{
				    	    			text: 'Spegni tutto',
				    	    			listeners: { click: {
				    	    							fn: function() { this.setAllLayersState(cat, false); },
				    	    							scope: this
				    	    							}
				    	    						}
				    	    			}],
			    	    	 cls: "clearCSS"
							}
						});
			
			menu.add(menuAccendiSpegni);
			
			if ((this.paramsJS.layOut.csw || this.paramsJS.layOut.WMSExplorer)) {
				
				var menuAggiungi = Ext.create('Ext.menu.Item',
									{
										text: 'Aggiungi',
										menu: {
											items: [/*{
														text: "Aggiungi WMS da catalogo",
														listeners: { click: {
																		fn: function() {
																			this.fireEvent("contextMenuAddWMSFromCatalogClick", cat, lay, false);
																		}, 
																		scope: this
																		}
														}
													},{
														text: "Aggiungi WMS da server",
														listeners: { click: {
																		fn: function() {
																			this.fireEvent("contextMenuAddWMSFromWMSWidgetClick", cat, lay, false);
																		}, 
																		scope: this
																		}
														}
													},*/
													{
										    			text: 'Aggiungi Categoria',
										    			//disabled: (this.tocInfo.getBoundingBox(cat, lay)==null),
										    			listeners: { click: {
								    							fn: function() {
									    								if (lay==null) {
									    									var msgbox = Ext.Msg.prompt('Nuova categoria', 'Inserisci il nome della nuova categoria',
								    										function(btn, catName) {
								    											if (btn!='cancel') {
										    										var catInfo = {
												    									paramsJSParams: {
												    										catDescr: catName,
												    										layerList: [],
												    										categoryList: [],
																							nome: catName,
																							userSwitchable: true
												    									},
												    									tocInfoParams: {
												    										catDescr: catName,
																							catId: catName +Math.random(),
																							//catTreeIdx: "0",
																							categories: [],
																							checked: false,	
																							clickTarget: "",
																							clickUrl: "",	
																							expanded: false,
																							forceClickable: false,
																							hidden: false,
																							layers: [],
																							nome: catName,	
																							toolTip: "",
																							userSwitchable: true
												    									}
																					};
												    								this.addCategory(catInfo, cat, false);
								    											}
								    										}, this);
									    								}
									    							},
								    							scope: this
								    							}
								    						}
										    		}],
							    	    	 cls: "clearCSS"
											}
										});
		
				if (this.paramsJS.layOut.csw) {
					menuAggiungi.menu.add({
								text: "Aggiungi WMS da catalogo",
								listeners: { click: {
												fn: function() {
															this.fireEvent("contextMenuAddWMSFromCatalogClick", cat, lay, false);
														}, 
												scope: this
											}
								}
							});
				}
			
			}
		
			if (this.paramsJS.layOut.WMSExplorer) {
				menuAggiungi.menu.add({
						text: "Aggiungi WMS da server",
						listeners: { click: {
										fn: function() {
											this.fireEvent("contextMenuAddWMSFromWMSWidgetClick", cat, lay, false);
										}, 
										scope: this
										}
						}
					});
			}
			
			menu.add(menuAggiungi);			
		}
		
		if (isCategory || isLayer) {
			
			if (lay!=null) {
				
				var menuZoom = Ext.create('Ext.menu.Item',
						{
							text: 'Zoom',
							menu: {
								items: [{
				    	    			text: 'Estensione',
				    	    			disabled: (this.tocInfo.getBoundingBox(cat, lay)==null),
				    	    			listeners: { click: {
				    	    							fn: function() { this.fireEvent('contextMenuZoomToExtent', cat,lay, this.tocInfo); },
				    	    							scope: this
				    	    							}
				    	    						}
				    	    			}],
				    	    	 cls: "clearCSS"
								}
							});

				menuZoom.menu.add({
				    			text: 'Minima scala di visibilit&agrave;',
				    			disabled: !(layInfo.minScaleMin != undefined && layInfo.minScaleMin!=null && layInfo.minScaleMin > 0),
				    			listeners: { click: {
				    							fn: function() { this.fireEvent('contextMenuZoomMinScaleMin', cat,lay, this.tocInfo, this.getScaleMinMaxFromIdxs(cat, lay)); },
				    							scope: this
				    							}
				    						}
				    		});
				menuZoom.menu.add({
								text: 'Massima scala di visibilit&agrave;',
								disabled: !(layInfo.maxScaleMax != undefined && layInfo.maxScaleMax!=null && layInfo.maxScaleMax > 0 ),
								//disabled: (this.tocInfo.getBoundingBox(cat, lay)==null),
								listeners: { click: {
												fn: function() { this.fireEvent('contextMenuZoomMaxScaleMax', cat,lay, this.tocInfo, this.getScaleMinMaxFromIdxs(cat, lay)); },
												scope: this
												}
											}
							});
		
				menu.add(menuZoom);
				
				if (this._chkIfStyleManagerAvailable(layInfo)) {
					
					var menuStili = Ext.create('Ext.menu.Item',
							{
								text: 'Stile',
								menu: {
									//items: [vociStili],
					    	    	 cls: "clearCSS"
									}
								});
				
					for (var i=0; i < layInfo.definedStyles.length ; i++) {
						
						var infoStile = layInfo.definedStyles[i];
						var s = Ext.create('Ext.menu.CheckItem',
							{
								text: (infoStile.title && infoStile.title!="") ? infoStile.title : infoStile.name,
								checked: infoStile.name==layInfo.style, 
								group: 'a',
								stile: infoStile.name,
								listeners: { click: { fn: function() { me.setLayerStyle(cat, lay, this.stile); }} }
								});
						menuStili.menu.add(s);
						
					}
					
					menuStili.menu.add('-');
					
					var manager = Ext.create('Ext.menu.Item',
							{
								text: 'Gestione',
								listeners: { click: { fn: function() { this.openStyleManager(cat, lay); }, scope: this} }
								});
					menuStili.menu.add(manager);
							
					menu.add(menuStili);
				}
	
				//if (layInfo.withOpacitySettings ) {					
				var sl = new Ext.slider.Single({
	    	     	 		    vertical: false,
	    	     	 		    value: (layInfo.opacity!=undefined && layInfo.opacity!=null )?  layInfo.opacity*100 : 100,
	    	     	 		    //increment: 10,
	    	     	 		    minValue: 0,
	    	     	 		    maxValue: 100	     	 	
	    	     	 		});	
				sl.on('change', function(slider, newValue, thumb, eOpts) { this.layerOpacityChange(cat, lay, newValue ); } , this);
	    	     	 		
				var menuTrasparenza = Ext.create('Ext.menu.Item',
												{
													text: 'Trasparenza',
													menu: {
														items: [sl],
										    	    	 cls: "clearCSS"
														}
													});		
				menu.add(menuTrasparenza);
				//}
			}
			
			if ((lay==null || this.paramsJS.isQGISExportable(nMappa, cat, lay))) {				
				if(this.paramsJS.layOut.conExportQGIS){
					menu.add(this.getExportMenuItem(cat, lay));
				}
				
				if(this.j2qConnected){
					menu.add({
		    			text: 'Add to Qgis',
		    			iconCls : 'iconAddLayerToQGis',
						cls : "clearCss",					
		    			listeners: { click: {
		    							fn: function() { 
		    									this.fireEvent('addLayerToQgisClicked',cat,lay);																
		    							},
		    							scope: this
		    						}
		    					}
		    			});
				 }
			}
				    
		}
						
        return (menu.items.getCount()>0) ? menu : null;
		
	}, 
	
	
	
	/*
	 * @method getExportMenuItem
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 */
	getExportMenuItem: function(catIdx, layIdx) {
		
		return Ext.create('Ext.menu.Item',
							{
								text: 'Export',
								menu: {
									items: [{
				    	    			text: 'Qgis',
				    	    			iconCls : 'iconExportForQGis',
										cls : "clearCss",
				    	    			listeners: { click: {
				    	    							fn: function() { 
				    	    									this.fireEvent('exportForQgisClicked',catIdx, layIdx);
				    	    									/*
																this.tocInfoField.setValue(this.tocInfo.JSONEncodeInfo(catIdx, layIdx)); 
																this.paramsJSField.setValue(Ext.JSON.encode(this.paramsJS));
																//this.serverPoolJSField(Ext.JSON.encode(this.paramsJS.serverPool));
																// TODO gestita solo mappa 0
																this.nMappaField.setValue(0);
																this.idxCategoriaBase.setValue(catIdx);
																this.idxLayerBase.setValue(layIdx);
															
																this.submitForm.submit({
																			url: this.TOLOMEOServer + this.TOLOMEOContext + '/ExportToQgisServlet',
																			method: 'POST',
																			target: '_blank'
																		});
																		*/
																
				    	    							},
				    	    							scope: this
				    	    						}
				    	    					}
				    	    			}],
					    	    	 cls: "clearCSS"
									}
								});    	

	},
	
	/*
	 * @method layerOpacityChange
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 * @param {Object} newValue
	 * 
	 * 
	 */
	layerOpacityChange: function(catIdx, layIdx, newValue ) {
		//var nomeLayer = this.tocInfo.getCategoryInfo(cat).layers[lay].name;
		var oldValue = this.tocInfo.getCategoryInfo(catIdx).layers[layIdx].opacity;
		this.tocInfo.getCategoryInfo(catIdx).layers[layIdx].opacity=newValue/100;
    	this.fireEvent('layerOpacityChange', catIdx, layIdx, newValue/100, oldValue, this.tocInfo);

	},
	
	/*
	 * @method calcolaIconCls
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 * @param {Object} visible
	 * 
	 * 
	 */
    calcolaIconCls: function(catIdx, layIdx, visible ) {
    	var bConIcone = false;
    	
    	if (layIdx==null) {
    		// Categorie
    		//var cat = this.tocInfo.getCategoryInfo(catIdx);
	    	var iconCls="iconLegendaCategoria";
    	} else {
    		// Layer
			var lay = this.tocInfo.getCategoryInfo(catIdx).layers[layIdx];
	    	
	    	var iconCls="";
	    	if (lay.temporaryNotAvailable) {
	    		// se necessario warning accende icona su questo layer anche se non sarebbero normalemente visibili
	    		bConIcone = true;
	    		iconCls = "iconLegendaWarning";
	    	} else {
	    		if (visible) {
	    			iconCls = (lay.raster) ? "iconLegendaLayerRaster" : "iconLegendaLayerVector" ;	
	    		} else {
	    			iconCls = "iconLegendaLayerNotVisibleAtScale";
	    		}
	    		
	    	}
    	}
	
    	return { iconCls: iconCls, forzaConIcone: bConIcone };
    }, 
    
	/*
	 * @method calcolaLayerClickUrl
	 * 
	 * 
	 * @param {Object} lay
	 * 
	 * 
    calcolaLayerClickUrl: function (lay) {
    	
    	    	
    	if (lay.clickUrl) {
    		var params = "";
        	params += (lay.codTPN) ? "codTPN=" + lay.codTPN : "";
        	params += ((params!="") ? "&" : "") + "catIdx=" +lay.catTreeIdx;  
        	params += ((params!="") ? "&" : "") + "layIdx=" +lay.layTreeIdx;
        	
        	
        	
        	
        	var retVal = lay.clickUrl;
        	if (params!="") {
        		retVal += ((retVal.indexOf("?")==-1) ? "?" : "&")  + params ;	
        	} 
        	
        	return retVal;
    	} else {
    		return undefined;
    	}
    },
	 */
    
	/*
	 * @method calcolaCatToolTip
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 */
    calcolaCatToolTip: function (catIdx) {
    	
    	var cat = this.tocInfo.getCategoryInfo(catIdx)
    	var retVal = "";
    	
    	if (cat.toolTip && cat.toolTip!="") {
    		retVal = cat.toolTip;
    	} else {
    		retVal += '<ul class="legendaCatTooltip">';
    		for (var i=0; i<cat.categories.length; i++) {
    			if (cat.hidden!=undefined && cat.hidden!=null && cat.hidden==false) retVal += '<li class="legendaCatTooltipCat">' + cat.categories[i].catDescr + "</li>";
			}
    		for (var i=0; i<cat.layers.length; i++) {
    			var classCss = (cat.layers[i].raster && cat.layers[i].raster==true) ? "legendaCatTooltipLayVect" : "legendaCatTooltipLayRast";
    			if (cat.layers[i].hidden!=undefined && cat.layers[i].hidden!=null && cat.layers[i].hidden==false) retVal += '<li class="' + classCss + '">' + cat.layers[i].descr + "</li>";
			}
    	}
    	    		
        return retVal;
    },
    
	/*
	 * @method calcolaLayToolTip
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 */
    calcolaLayToolTip: function (catIdx, layIdx) {
    	
    	var lay = this.tocInfo.getCategoryInfo(catIdx).layers[layIdx]
    	var layerPresetInfo = this.tocInfo.getCategoryPresetInfo(catIdx).layerList[layIdx];
    	
    	var smin = (layerPresetInfo) ? layerPresetInfo.scalaMinima : -1;
    	var smax = (layerPresetInfo) ? layerPresetInfo.scalaMassima : -1;
    	
    	var scala = this.getScaleMinMax( smin, smax, lay.minScaleMin, lay.maxScaleMax);
		
		var scalaMinima  = scala.scalaMinima;
		var scalaMassima = scala.scalaMassima;
		
    	
    	var retVal = undefined;
    	    	
    	if (lay.toolTip && lay.toolTip!="") {
    		retVal = lay.toolTip;
    	} else {
    		retVal = lay.descr;
    	}
    	
    	if (scalaMassima!=undefined && scalaMassima!=null && scalaMassima!=-1) {
    		retVal += "<br />Scala massima 1:" + Math.round(scalaMassima);  
    	}
    	
    	if (scalaMinima!=undefined && scalaMinima!=null && scalaMinima!=-1 && scalaMinima!=0) {
    		retVal += "<br />Scala minima 1:" + Math.round(scalaMinima);  
    	}
    	
        return retVal;
    },
    
	/*
	 * @method onItemSelected
	 * 
	 * 
	 * @param {Object} catTreeIdx
	 * 
	 * 
	 * @param {Object} layTreeIdx
	 * 
	 * 
	 * @param {Object} classi
	 * 
	 * 
	 */
    onItemSelected: function(catTreeIdx, layTreeIdx, classi) {
    	this.fireEvent('itemSelected', catTreeIdx, layTreeIdx, classi);
    },
    
	/*
	 * @method onItemClicked
	 * 
	 * 
	 * @param {Object} catTreeIdx
	 * 
	 * 
	 * @param {Object} layTreeIdx
	 * 
	 * 
	 * @param {Object} classi
	 * 
	 * 
	 * @param {Object} e
	 * 
	 * 
	 */
    onItemClicked: function(catTreeIdx, layTreeIdx, classi, e) {
    	if (classi!=null) {
    		this.openStyleManager(catTreeIdx, layTreeIdx);
    	}
    	this.fireEvent('itemClicked', catTreeIdx, layTreeIdx, classi, e);
    },
    
    /**
     * @method openStyleManager
     * Richiede l'apertura della finestra di scelta di uno stile alternativo
     * 
  	 * @param {Object} catIdx
  	 * 
  	 * 
  	 * @param {Object} layIdx
  	 * 
  	 * 
     */
    openStyleManager: function(catIdx, layIdx) {
    	var cat = this.tocInfo.getCategoryInfo(catIdx);
    	var lay = cat.layers[layIdx];
    	
		if (this._chkIfStyleManagerAvailable(lay)) {
			this.fireEvent('stylePanelRequest', 
							lay.descr,
							catIdx,
							layIdx,
							lay.definedStyles
							)
		}
	},
	
    /**
     * @method _chkIfStyleManagerAvailable
     * @private
     * 
     * 
  	 * @param {Object} layInfo
  	 * 
  	 * 
     */
	_chkIfStyleManagerAvailable: function(layInfo) {
		return layInfo.styleCapable && layInfo.definedStyles.length>0;
	},
	
	/**
	 * @method addCategory
	 * Aggiunge una categoria nella posizione indicata dai parametri.
	 * 
	 * @param {Object} catInfo
	 * Categoria da aggiungere
	 * 
	 * @param {Object} addPointCatIdx
	 * categoria prima o dopo della quale va aggiunta la roba
	 * 
	 * @param {Object} bBefore
	 * indica se aggiungere prima o dopo 
	 * 
	 */
	addCategory: function(catInfo, addPointCatIdx, bBefore) {
		
		var addPointCat = this.tocInfo.getCategoryInfo(addPointCatIdx);
		var addPointCatId = addPointCat.catId;
		
		// TODO Gestisce solo mappa 0
		var nMappa = 0;
		
		// Setto flag che indica che è una categoria utente
		catInfo.paramsJSParams.isUserCategory = true;
		catInfo.tocInfoParams.isUserCategory  = true;

		
		this.paramsJS.addCategory(nMappa, catInfo.paramsJSParams, addPointCatIdx, bBefore);
		this.tocInfo.addCategory(catInfo.tocInfoParams, addPointCatIdx, bBefore);
		
		this.addCategoryExtend(catInfo, addPointCat, bBefore);
		
		// Se c'è un ordine diverso da quello iniziale lo ricrea da zero (la nuova categoria provoca rinumerazione 
		if (this.tocInfo.layerOrder && this.tocInfo.layerOrder.length>0) this.tocInfo.layerOrder = this.createOrRefreshLayerOrder();
		
		this.fireEvent('categoryAdded', this.tocInfo, catInfo);
		
	},
	
	/**
	 * @method addCategoryExtend
	 * Metodo astratto da estendere per gestire a livello di singola tipologia di legenda l'aggiunta della categoria per esempio nella GUI.
	 * 
 	 * @param {Object} catInfo
 	 * Categoria da aggiungere
 	 * 
	 * @param {Object} bBefore
	 * indica se aggiungere prima o dopo
 	 * 
	 * @param {Object} addPointCat
	 * categoria prima o dopo della quale va aggiunta la roba
 	 * 
	 */
	addCategoryExtend: function(catInfo, addPointCat, bBefore ) {
		
	},
	
	/**
	 * @method addLayer
	 * Aggiunge un layer nella posizione indicata dai parametri.
	 * 
	 * @param {Object} options
	 * oggetto contenente le opzioni nei seguenti attributi <br />
	 * <ul>
	 * 	<li>serverurl: url del server WMS</li>
	 * 	<li>layername: nome del layer WMS</li>
	 * 	<li>addPointCatIdx: Indice della categoria nella quale viene aggiunto il layer </li>
	 * 	<li>addPointLayIdx: Indice layer prima o dopo del quale aggiungere il nuovo layer</li>
	 *  <li>where: indica se aggiungere prima (0), dopo (1), dentro (2)</li>
	 * </ul>
	 * 
	 */
	addLayer: function(options) {
		
		this.dataProvider.requestLayerInfoData({ 
				serverurl: options.serverurl, //"http://dvpgeoserver.comune.prato.it/geoserver/ows?service=wms&version=1.1.1&request=GetCapabilities",
				layername: options.layername,  //"comunepo:generica_circoscrizioni"
				extra: {
						serverurl: options.serverurl,
						layername: options.layername,
						addPointCatIdx: options.addPointCatIdx,
	 					addPointLayIdx: options.addPointLayIdx, 
	 					bBefore: options.where
					}
		});
		
	},
	
	/**
	 * @method addLayerCallback
	 * Funzione di callback per la richiesta di informazioni di un layer da inserire
	 * 
	 * @param {Object} layTocInfo
	 * Informazioni sul layer (struttura TOCLayerBean) ricevuta dal server
	 * 
	 * @param {Object} extra
	 * parametri extra
	 * 
	 */
	addLayerCallback: function(layTocInfo, extra) {
	
		var paramsInfo= {
			serverID: null,
			name: extra.layername,
		    hidden: false,
		    userSwitchable: true,
		    codTPN: 0,
		    defaultLayer: true,
		    withOpacitySettings: false,
		    iconaLegenda: null,
		    descrizione: layTocInfo.descr,
		    defaultStyle: "",
		    scalaMinima: -1,  // Influenza solo lo stato della visualizzazione nella legenda (nero o grigio), non l'effettiva visualizzazione.
		    								    // Utilizzato solo nel caso di WMS generico o di GEOSERVER senza REST, cioè nei casi nei quali non è possibile ottenere lo stato di visibilità in funzione della scala. Ignorato negli altri casi 
			scalaMassima: -1,  // Influenza solo lo stato della visualizzazione nella legenda (nero o grigio), non l'effettiva visualizzazione.
		     									// Utilizzato solo nel caso di WMS generico o di GEOSERVER senza REST, cioè nei casi nei quali non è possibile ottenere lo stato di visibilità in funzione della scala. Ignorato negli altri casi
			extraLegendGraphPar: null, 	
			catTreeIdx: null,
			layTreeIdx: null,
			raster: false,
			clickUrl: null,
			clickTarget: null,
			stiliIndipDaScala: true,
			toolTip: null,
			expanded: false,
			opacity: null,
			itemType: 'layer',
			queryable: layTocInfo.queryable,
			getFeatureInfoFormats: layTocInfo.getFeatureInfoFormats
		};
		
		var serverInfo = {		
			id						: null,
			nome 					: null,
			typeDescription       	: "WMS",
			typeCode             	: 11,
			nomeCredenziale   		: null,
			allowServerConnection 	: true,
			url          		  	: extra.serverurl,
			usaProxyPer3D			: true,
			serverOpts				: null,
			tilesMultiple 			: false,
			tileStampaAltezza		: null,
			tileStampaLarghezza		: null,
			noTolomeoParams			: false,
			opacity					: 1.0
		}
	
		this.addLayerByLayerInfo(paramsInfo, layTocInfo, serverInfo, extra.addPointCatIdx, extra.addPointLayIdx, extra.bBefore);
		
	},
	
	/**
	 * @method addLayerByLayerInfo
	 * Aggiunge un layer nella posizione indicata dai parametri. Se addPointLayIdx non è definito il punto di inserimento è una categoria
	 * 
	 * @param {Object} paramsInfo
	 * Info relative al layer da inserire in paramsJS
	 * 
	 * @param {Object} layTocInfo
	 * Tocinfo del layer da aggiungere
	 * 
	 * @param {Object} serverInfo
	 * Info sul server del layer da inserire
	 * 
	 * @param {Object} addPointCatIdx
	 * Indice della categoria nella quale viene aggiunto il layer 
	 * 
	 * @param {Object} addPointLayIdx
	 * Indice layer prima o dopo del quale aggiungere il nuovo layer
	 * 
	 * @param {Object} bBefore
	 * indica se aggiungere prima o dopo
	 */
	addLayerByLayerInfo: function(paramsInfo, layTocInfo, serverInfo, addPointCatIdx, addPointLayIdx, bBefore) {

		// Recupera categoria e layer di inserimento
		var addPointCat = this.tocInfo.getCategoryInfo(addPointCatIdx);
		var addPointLay = addPointCat.layers[addPointLayIdx];
		
		// Completa informazioni 
		layTocInfo.parentcategorychecked = addPointCat.checked;
		layTocInfo.layId = Math.random();
		layTocInfo.isEnabled = function(){
			if (this.parentcategorychecked){
				return this.parentcategorychecked && this.checked; 
			}else{
				return this.checked;
			}
		}
					
		//var layer = this.tocInfo.getCategoryPresetInfo(catIdx).layerList[layIdx];
					
		//var smin = (layer) ? layer.scalaMinima : -1;
    	//var smax = (layer) ? layer.scalaMassima : -1;
				
		//lay.visible=this.layerIsVisibleAtScale(scale, smin, smax, lay.minScaleMin, lay.maxScaleMax );

		// Assegna un codTPN
		var newLocalCodTPN = this.getNewLocalCodTPN();
		paramsInfo.codTPN = newLocalCodTPN;
		layTocInfo.codTPN = newLocalCodTPN;
		
		// Setto flag che indica che è un layer utente
		paramsInfo.isUserLayer = true;
		layTocInfo.isUserLayer = true;

		// TODO Gestisce solo mappa 0
		var nMappa = 0;
		
		// Verifica se il server è già definito, e se non è definito lo definisce
		var serverID = this.paramsJS.addServer(nMappa, serverInfo);
		
		// Associa il layer con il serverID corretto
		layTocInfo.serverID = serverID;
		paramsInfo.serverID = serverID;
		
		this.paramsJS.addLayer(nMappa, paramsInfo, addPointCatIdx, addPointLayIdx, bBefore);
		// Aggiorna la struttura tocInfo associata a questa legenda
		this.tocInfo.addLayer(layTocInfo, addPointCatIdx, addPointLayIdx, bBefore);
		// Invoca il metodo che consente ad una legenda che estende questa di aggiornarsi con il nuovo layer 
		this.addLayerExtend(paramsInfo, layTocInfo, serverInfo, addPointCat, addPointLay, bBefore);
		
		// Se c'è un ordine diverso da quello iniziale lo ricrea da zero
		if (this.tocInfo.layerOrder && this.tocInfo.layerOrder.length>0) this.tocInfo.layerOrder = this.createOrRefreshLayerOrder();

		this.fireEvent('layerAdded', this.tocInfo, paramsInfo, layTocInfo, serverInfo);

		// Se il server non è disponibile. Deve essere fatto dopo aver lanciato l'evento per fare in modo che tutto sia aggiornato 
		if (layTocInfo.temporaryNotAvailable) {
			this.setLayerStateChange(layTocInfo.catIdx, layTocInfo.layIdx, false, true);	
		}
		
	},
	
	/**
	 * @method addLayerExtend
	 * Metodo astratto da estendere per gestire a livello di singola tipologia di legenda l'aggiunta della categoria per esempio nella GUI.
	 * 	 
	 * @param {Object} paramsInfo
	 * Info relative al layer da inserire in paramsJS
	 * 
	 * @param {Object} layTocInfo
	 * Tocinfo del layer da aggiungere
	 * 
	 * @param {Object} serverInfo
	 * Info sul server del layer da inserire	 * @param {Object} addPointCat Punto di inserimento (Categoria) 
	 * 
	 * @param {Object} addPointLay
	 * Punto di inserimento (Layer)
	 * 
	 * @param {Object} bBefore
	 * indica se aggiungere prima o dopo
	 * 
	 */
	addLayerExtend: function(paramsInfo, layTocInfo, serverInfo, addPointCat, addPointLay, bBefore) {
	
	},
	
	/**
	 * @method onTOCInfoCatTreeIdxUpdate
	 * Metodo invocato al cambio dell'indice di categoria su tocInfo. I diversi tipi di legenda devono implementarlo per gestire l'aggiornamento sulla GUI della legenda
	 * 
	 * @param {Object} catId
	 * Id della categoria
	 * 
	 * @param {Object} oldCatTreeIdx
	 * indice che è stato cambiato
	 * 
	 * @param {Object} newCatTreeIdx
	 * nuovo valore dell'indice
	 * 
	 */
	onTOCInfoCatTreeIdxUpdate: function(catId, oldCatTreeIdx, newCatTreeIdx) {
		
	},
	
	/**
	 * @method
	 * Metodo invocato al cambio dell'indice di layer su tocInfo. I diversi tipi di legenda devono implementarlo per gestire l'aggiornamento sulla GUI della legenda
	 * 
	 * @param {Object} oldCatTreeIdx
	 * vecchio indice categoria
	 * 
	 * @param {Object} oldLayTreeIdx
	 * indice layer che è stato cambiato
	 * 
	 * @param {Object} newCatTreeIdx
	 * nuovo indice categoria
	 * 
	 * @param {Object} newLayTreeIdx
	 * nuovo valore dell'indice di layer
	 * 
	 */
	onTOCInfoLayIdxUpdate: function(layId, catTreeIdx, oldLayTreeIdx, newCatTreeIdx, newLayTreeIdx) {
		
	},
		
	/** 
	 * @method getNewLocalCodTPN
	 * Genera un nuovo codTPN local
	 * 
	 * @return {Object}
	 * il nuovo codTPN locale
	 * 
	 */
	getNewLocalCodTPN: function() {
		
		this.lastUsedLocalCodTPN = (this.lastUsedLocalCodTPN) ? this.lastUsedLocalCodTPN + 1 : this.paramsJS.codTPNClientLayerBase + 1; //this.LOCALCODTPNBASE;
		
		return this.lastUsedLocalCodTPN; 
	
	},
	
	/**
	 * @method createOrRefreshLayerOrder
	 * Crea o ricrea la struttura layerOrder
	 * 
	 * @return {Object}
	 * restituisce la struttura layerOrder
	 * 
	 */
	createOrRefreshLayerOrder: function() {
		return this.createOrRefreshLayerOrderExtend();	
	},
	
	/**
	 * @method createOrRefreshLayerOrderExtend
	 * Metodo invocato per ricreare la struttura layerOrder,  I diversi tipi di legenda devono implementarlo per gestire la possibilità di scambiare l'ordine dei layer.
	 * 
	 * @returns {Object}
	 * deve ritornare 
	 * 
	 */
	createOrRefreshLayerOrderExtend: function() {
		
	},
	
	/**
	 * @method getUserWMSList
	 * restituisce un array di oggetti  che identificano i layer inseriti dall'utente (non presenti nel preset originale)
	 * 
	 * @return {Array}
	 * array di oggetti di questo tipo { catTreeIdx: '0/1', layTreeIdx: '0'}
	 * 
	 */
	getUserWMSList: function() {
	
		var userWMSList = [];		

		if (this.tocInfo.layerOrder && this.tocInfo.layerOrder.length>0) {
			
			for (var i = 0; i < this.tocInfo.layerOrder.length; i++) {
				var laypos = this.tocInfo.layerOrder[i];
				var cat = this.tocInfo.getCategoryInfo(laypos.cat);
				var lay = cat.layers[laypos.lay];
				if (lay.isUserLayer) {
					userWMSList.push({catTreeIdx: lay.cat, layTreeIdx: lay.lay});
				}
			}
		} else {
		
			this.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) {
					if (lay.isUserLayer) {
						userWMSList.push({catTreeIdx: catIdx, layTreeIdx: layIdx});
					}
				}, this
			);

		}
		return userWMSList;
	},
	
	/**
	 * @method getVisibleUserWMSList
	 * Restituisce un array di oggetti  che identificano i layer inseriti dall'utente (non presenti nel preset originale) e che sono visibili (checked e visible)
	 * 
	 * @return {Array}
	 * array di oggetti di questo tipo { catTreeIdx: '0/1', layTreeIdx: '0'}
	 * 
	 */
	getVisibleUserWMSList: function() {
	
		var userWMSList = this.getUserWMSList();
		var retVal = [];
		for (var i = 0; i < userWMSList.length; i++) {
			var idxObj = userWMSList[i]; 
			var currCat = this.tocInfo.getCategoryInfo(idxObj.catTreeIdx);
			var currLayer =  currCat.layers[idxObj.layTreeIdx];	
			
			if ( this.tocInfo.areAllParentCatChecked(currLayer.catTreeIdx) && currCat.checked && currLayer.checked && currLayer.visible ){
				retVal.push({catTreeIdx: idxObj.catTreeIdx, layTreeIdx: idxObj.layTreeIdx});
			}
		}	
		return retVal;
	},
	
	
	/**
	 * @method saveToCommand
	 * Serializza lo stato della legenda in un comando toloCommand.tocCheck
	 * 
	 */
	saveToCommand: function() {
		
		var cmd = Ext.create('TolomeoExt.ToloCommand.tocCheck', {
								mode: 'uncheckOthers',
								ver: 3
				});
		
		this.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) { 
					
					if (this.tocInfo.areAllParentCatChecked(catIdx)) {
						if (lay.itemType=='layer' && cat.checked && lay.checked && lay.hidden==false ) {
							var s = (lay.serverID=="") ?  "INLINESERVERID" : lay.serverID;
							cmd.addTocEntry(s, lay.name, true, lay.opacity, (lay.styleCapable?lay.style:false));
						} else {
							if (lay.itemType=='text') {
								cmd.addTocTextEntry(lay.descr);
							}
						} 
					}
					/*
					if (this.tocInfo.areAllParentCatChecked(catIdx) && cat.checked && lay.checked && lay.hidden==false && lay.itemType=='layer') {
						var s = (lay.serverID=="") ?  "INLINESERVERID" : lay.serverID;
						cmd.addTocEntry(s, lay.name, true, lay.opacity);	
					} */
					
				},
				this
			);
		
		return cmd;
	},
	
	enableJ2QFeatures: function(){
		this.j2qConnected = true;
	}
	
	/*,
	
	getLegendaInfo: function(posObj, scale) {
		var retVal = {};
		retVal.layers = [];
		
		var vl = this.getVisibleLayers();
		
		for (var i=0; i < vl.length; i++) {
			var li = {};
			var l = vl[i];
			li.nome = l.descr;
			// Aggiunge le classi
			li.classi = [];
			for (j=0; j < l.classi; j++) {
				var voceLegenda = this.createVoceLegenda(
									l.classi[j], 
									l);
				li.classi.push();
			}
			// Aggiunge le info per il layer corrente
			retVal.layers.push(li);
		}
		return retVal;
	}
	
	createVoceLegenda: function(classe, layer, posObj, scale) {
		var retVal = {};
		
		var src = classe.nome;
		var paramScala = "";
		var paramPos = "";
		var stile = (layer.style && layer.style!="") ? layer.style : "default";
		
		if (classe.tipoNome==1) {
			// Se legenda dipendente da scala
			if ( scale && layer.stiliIndipDaScala!=undefined && layer.stiliIndipDaScala==false && (classe.nomeParamScala) && (classe.nomeParamScala!="")) {
				paramScala = classe.nomeParamScala + "=" + scale;
				src += ((src.indexOf("?")!=-1) ? "&" : "?") + paramScala;
			}
			if (posObj && layer.stiliIndipDaPosizione!=undefined && layer.stiliIndipDaPosizione==false) {
				paramPos += "SRS=" + posObj.srid;
				paramPos += "&BBOX=" + posObj.bbox.left  
									+ ',' + posObj.bbox.bottom
									+ ',' + posObj.bbox.right
									+ ',' + posObj.bbox.top;
				paramPos += "&WIDTH="  + posObj.width;
				paramPos += "&HEIGHT=" + posObj.height;
				src += ((src.indexOf("?")!=-1) ? "&" : "?") + paramPos;
			}
			retVal.nomevoce = "";
			retVal.url = src;
		} else {
			retVal.nomevoce = classe.nome;
			retVal.url = classe.icoUrl;
		}
		
		return retVal;
	}
	*/
	
});

