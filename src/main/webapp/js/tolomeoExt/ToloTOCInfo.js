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
 * @class TolomeoExt.ToloTOCInfo
 * @extends Ext.util.Observable
 * Inizialmente alimentato con la deserializzazione di TOCBean contiene lo stato della legenga ed i metodi per interagire con tale stato 
 * 
 */

Ext.define('TolomeoExt.ToloTOCInfo', {

	extend: 'Ext.util.Observable',
	
	/**
	 * @property {Object} presetLegenda
	 * 
	 * 
	 */
	presetLegenda: null,
	
	/**
	 * @property {Object} [CATEGORIESARRAYNAME="categories"]
	 * 
	 * 
	 */
	CATEGORIESARRAYNAME: "categories",

	/**
	 * @constructor TolomeoExt.ToloTOCInfo
	 * Create a new TolomeoExt.ToloTOCInfo
	 * 
	 * @param {Object} config
	 * La configurazione
	 *  
	 * @returns {TolomeoExt.ToloTOCInfo}
	 * A new TolomeoExt.ToloTOCInfo
	 * 
	 */
	constructor: function(config) {

		Ext.apply(this, config);
		this.callParent(arguments);
		
		
		this.addEvents("catTreeIdxUpdate");
		this.addEvents("layTreeIdxUpdate");
		
	},

	/**
	 * @method _getCategoryInfoPriv
	 * @private
	 * Metodo privato per lo scorrimento ricorsivo delle categorie
	 * 
	 * @param {Object} catInfo
	 * 
	 * 
	 * @param {Array} idxs
	 * 
	 * 
	 * @param {Object} catArrayName
	 * 
	 * 
	 */
	_getCategoryInfoPriv: function(catInfo, idxs, catArrayName) {
		
		if (idxs.length==1) return catInfo[catArrayName][idxs[0]];
		else {
			var idx = idxs.shift();
			return this._getCategoryInfoPriv(catInfo[catArrayName][idx], idxs, catArrayName);
		}
	},
	
	/**
	 * @method getCategoryInfo
	 * Metodo per recuperare le info della categoria a partire dall'indice (che è complesso nella forma 0/1/...)
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 */
	getCategoryInfo: function(catIdx) {
		
		var idxs = catIdx.split(this.TOCCATSEPARATOR);
		return 	this._getCategoryInfoPriv(this, idxs, this.CATEGORIESARRAYNAME);
	
	},
	
	/**
	 * @method getCategoryPresetInfo
	 * Metodo per recuperare le info della categoria contenute nel preset a partire dall'indice (che è complesso nella forma 0/1/...)M
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 */
	getCategoryPresetInfo: function(catIdx) {
		
		if (this.presetLegenda==null) return null;
		
		var idxs = catIdx.split(this.TOCCATSEPARATOR);
		return 	this._getCategoryInfoPriv(this.presetLegenda, idxs, "categoryList");
	},
	
	/**
	 * @method onEachCategory
	 * Metodo per il lancio della funzione fn all'interno del contesto scope per ogni categoria a partire da quella con indice startCatIdx. 
	 * Il metodo agisce in maniera ricorsiva se bRecurce non è definito o è true 
	 * La funzione fn viene chiamata passando gli argomenti cat ecatIdx  
	 * 
	 * @param {Object} fn
	 * 
	 * 
	 * @param {Object} scope
	 * 
	 * 
	 * @param {Object} startCatIdx
	 * 
	 * 
	 * @param {Object} bRecurse
	 * 
	 * 
	 */
	onEachCategory: function(fn, scope, startCatIdx, bRecurse) {
		var scopebuff = (scope) ? scope : this;
		var bRecurse = (bRecurse!=undefined && bRecurse !=null) ?  bRecurse : true;
		
		if (!startCatIdx) {
			if (this[this.CATEGORIESARRAYNAME].length!=0) {
				for (var i=0; i<this[this.CATEGORIESARRAYNAME].length; i++) {
					this.onEachCategory(fn, scope,""+i, bRecurse);
				}
				return;
			} else {
				return;
			}
		} 
		
		var scIdx = startCatIdx;
		
		var sc = this.getCategoryInfo(startCatIdx);

		fn.call(scope, sc, scIdx);
		 
		// categorie annidate
		if (bRecurse && sc.categories) {
			for (var i=0; i<sc.categories.length; i++) {
				var scIdxBuff = scIdx + this.TOCCATSEPARATOR + i;
				this.onEachCategory(fn, scope, scIdxBuff);
			}
		}
	},
	
	/**
	 * @method onEachLayer
	 * Metodo per il lancio della funzione fn all'interno del contesto scope per ognilayer contenuto in ogni categoria a partire da quella con indice startCatIdx. 
	 * Il metodo agisce in maniera ricorsiva se bRecurce non è definito o è true.
	 * La funzione fn viene chiamata passando gli argomenti cat, lay, catIdx e layIdx 
	 * 
	 * @param {Object} fn
	 * 
	 * 
	 * @param {Object} scope
	 * 
	 * 
	 * @param {Object} startCatIdx
	 * 
	 * 
	 * @param {Object} bRecurse
	 * 
	 * 
	 */
	onEachLayer: function(fn, scope, startCatIdx, bRecurse) {
		
		this.onEachCategory(
			function(cat, catIdx) {
				if (cat.layers) {
					for (var i=0; i<cat.layers.length; i++) {
						fn.call(scope, cat, cat.layers[i], catIdx, i);
					}
				}
			},
			this,
			startCatIdx,
			bRecurse
		);
		
	},
	
	/**
	 * @method getParentCategoryIdx
	 * Metodo per ottenere l'indice della categoria padre 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 */
	getParentCategoryIdx: function(catIdx) {
		
		if (!catIdx) return "";
		
		var idx = catIdx.lastIndexOf(this.TOCCATSEPARATOR);
		
		if (idx==-1) return "";
		else {
			return catIdx.substring(0, idx);
		}
		
	},
	
	/**
	 * @method onEachParentCategory
	 * Metodo per il lancio della funzione fn all'interno del contesto scope per ogni categoria padre a partire da quella con indice startCatIdx. 
	 * Il metodo agisce in maniera ricorsiva se bRecurce non è definito o è true.
	 * La funzione fn viene chiamata passando gli argomenti cat, catIdx  
	 * 
	 * @param {Object} fn
	 * 
	 * 
	 * @param {Object} scope
	 * 
	 * 
	 * @param {Object} startCatIdx
	 * 
	 * 
	 */	
	onEachParentCategory: function(fn, scope, startCatIdx) {
		
		var parentIdx = this.getParentCategoryIdx(startCatIdx);
		while (parentIdx!="") {
			var cat = this.getCategoryInfo(parentIdx);
			fn.call(scope, cat, parentIdx);
			parentIdx = this.getParentCategoryIdx(parentIdx);
		}
		
	},
	
	/**
	 * @method areAllParentCatChecked
	 * Metodo che verifica se tutte le categorie padre hanno il flag checked==true
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 */
	areAllParentCatChecked: function(catIdx) {
		var retObj1 = { bAllChecked: true };
		this.onEachParentCategory(
				function(parentCat, parentCatIdx) {
					if (!parentCat.checked) this.bAllChecked = false;
				}, 
				retObj1,
				catIdx
		);
		return retObj1.bAllChecked;
	},
	
	/**
	 * @method setLayerNeedRequestVisibleData
	 * Metodo per settare a value il flag needRequestVisibleData del layer individuato dalla coppia catIdx, layIdx 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 * @param {Object} value
	 * 
	 * 
	 */
	setLayerNeedRequestVisibleData: function(catIdx, layIdx, value) {
		this.getCategoryInfo(catIdx).layers[layIdx]._needRequestVisibleData = value;
	},
	
	/**
	 * @method getLayerNeedRequestVisibleData
	 * Metodo recuperare il valore del needRequestVisibleData del layer individuato dalla coppia catIdx, layIdx 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 */
	getLayerNeedRequestVisibleData: function(catIdx, layIdx) {
		var val = this.getCategoryInfo(catIdx).layers[layIdx]._needRequestVisibleData;
		
		return (val!=undefined && val!=null) ? val : false;
	},
	
	/**
	 * @method getLayerBoundingBox
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 */
	getLayerBoundingBox: function(catIdx, layIdx) {
		var layer = this.getCategoryInfo(catIdx).layers[layIdx];		
		
		if (layer.bboxMinX!=0 && layer.bboxMinY!=0 && layer.bboxMaxX!=0 && layer.bboxMaxY != 0) {
			var bbox = new BBox(layer.bboxMinX, layer.bboxMinY, layer.bboxMaxX, layer.bboxMaxY);
			return bbox
			
		} else {
			return null;
		}
	}, 
	
	
	/**
	 * @method getCategoryBoundingBox
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 */
	getCategoryBoundingBox: function(catIdx) {
		
		var bboxTot = null;
		
		this.onEachLayer( 
				function(cat, lay, catIdx, layIdx) {
					var bbox = this.getLayerBoundingBox(catIdx, layIdx);
					if (bbox!=null) {
						if (bboxTot==null) {
							bboxTot = new BBox(bbox.left,bbox.bottom,bbox.right,bbox.top);
						} else { 
							bboxTot.bottom = Math.min(bboxTot.bottom, bbox.bottom);
							bboxTot.left = Math.min(bboxTot.left, bbox.left);
							bboxTot.top = Math.max(bboxTot.top, bbox.top);
							bboxTot.right = Math.min(bboxTot.right, bbox.right);
						}
					}
				},
				this, 
				catIdx, true);
		
		return bboxTot;
		
	}, 
	
	/**
	 * @method getBoundingBox
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 */
	getBoundingBox: function(catIdx, layIdx) {
		if (layIdx==null) return this.getCategoryBoundingBox(catIdx);
		else return this.getLayerBoundingBox(catIdx, layIdx);
	}, 
	
	/**
	 * @method getServer
	 * 
	 * 
	 * @param {Object} serverId
	 * 
	 * 
	 */
	getServer: function (serverId) {
		return this.server[serverId]; 
	},
	
	/**
	 * @method searchLayerInfo
	 * 
	 * 
	 * @param {Object} serverID
	 * 
	 * 
	 * @param {Object} name
	 * 
	 * 
	 */
	searchLayerInfo: function(serverID, name) {
		var retVal = null;
		
		this.onEachLayer( 
				function(cat, lay, catIdx, layIdx) {
					if(retVal) return;
					// TODO SERVER IMPLICITO
					var serverIdToCompare = (serverID == "INLINESERVERID") ? "" : serverID;  
										
					if (lay.name==name && (!serverID || lay.serverID==serverIdToCompare)) {
						retVal = lay;
					}						
					
				},
				this);
				
		return retVal;
	}, 
	
	/**
	 * @method searchLayerInfoByDesc
	 * 
	 * 
	 * @param {Object} desc
	 * 
	 * 
	 * @param {Object} itemType
	 * 
	 * 
	 */
	searchLayerInfoByDesc: function(desc, itemType) {
		var retVal = null;
		
		this.onEachLayer( 
				function(cat, lay, catIdx, layIdx) {
					if (lay.descr == desc && lay.itemType == itemType) {
						retVal = lay;
					}
				},
				this);
				
		return retVal;
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
		
		// Cerca addPoint
		var addPoint = this.getCategoryInfo(addPointCatIdx);
		
		// Cerca il parent
		var addPointParentIdx = this.getParentCategoryIdx(addPointCatIdx);
		var addPointParent = null;
		
		// Se parent == null sono sul primo livello
		if (addPointParentIdx == "") {
			addPointParent = this;
		} else {
			addPointParent = this.getCategoryInfo(addPointParentIdx);
		}

		var c = (addPointParent.catTreeIdx) ? addPointParent.catTreeIdx : ""; 
				
		// Calcolo la posizione di inserimento
		var idxs = addPointCatIdx.split(this.TOCCATSEPARATOR);
		var pos = parseInt(idxs[idxs.length-1]) + ((bBefore) ? 0 : 1);
		
		// Aggiorno indice cat
		catInfo.catTreeIdx = c + ((c!="") ?  this.TOCCATSEPARATOR : "") + pos; 
		
		//Inserisco nella giusta posizione
		if (pos > 0) {
			addPointParent.categories.splice(pos, 0, catInfo);
		} else {
			addPointParent.categories.unshift(catInfo);
		}
		
		// rinumero indici
		this.updateIdxs(addPointParent, c);
		
	},
	
	/**
	 * @method updateIdxs
	 * Aggiorna tutti gli indici catTreeIdx e layTreeIdx.
	 * 
	 * @param {Object} cat
	 * categoria dalla quale iniziare ad aggiornare gli indici
	 * 
	 * @param {Object} newCatTreeIdx
	 * nuovo valore di treeIdx
	 * 
	 */
	updateIdxs: function(cat, newCatTreeIdx) {
		
		if (newCatTreeIdx!="") {
			// Aggiorna questa categoria
			var oldCatTreeIdx = cat.catTreeIdx;
			cat.catTreeIdx = newCatTreeIdx;
			if (oldCatTreeIdx != newCatTreeIdx) {
				this.fireEvent("catTreeIdxUpdate", cat.catId, oldCatTreeIdx, newCatTreeIdx);
			}
		
			// Aggiorna tutti i layer
			var layArray = cat.layers;
			if (layArray) {
				for (var i=0; i<layArray.length; i++) {
					layArray[i].catTreeIdx = newCatTreeIdx;
					if (oldCatTreeIdx != newCatTreeIdx) {
						// Utilizza i il nuovo catTreeIdx perchè ha già rinumerato la categoria con l'evento precedente
						this.fireEvent("layTreeIdxUpdate", layArray[i].layId, oldCatTreeIdx, layArray[i].layTreeIdx, newCatTreeIdx, layArray[i].layTreeIdx);
					}
				}
			}
		} 
		
		// Cicla sulle categorie figlie
		var catArray = cat.categories;
		if (catArray) {
			for (var i=0; i<catArray.length; i++) {
				var newPrefix = newCatTreeIdx + ((newCatTreeIdx != "") ? this.TOCCATSEPARATOR : "") + i ;				
				this.updateIdxs(catArray[i],newPrefix);		
			}
		}
		
	},
	
	/**
	 * @method addLayer
	 * Aggiunge un layer nella posizione indicata dai parametri.
	 * 
	 * @param {Object} layInfo
	 * Layer da aggiungere
	 * 
	 * @param {Object} addPointCatIdx
	 * Indice della categoria nella quale viene aggiunto il layer 
	 * 
	 * @param {Object} addPointLayIdx
	 * Indice layer prima o dopo del quale aggiungere il nuovo layer
	 * 
	 * @param {Object} bBefore
	 * indica se aggiungere prima o dopo
	 * 
	 */
	addLayer: function(layInfo, addPointCatIdx, addPointLayIdx, bBefore) {
		// Cerca addPoint
		var addPoint = this.getCategoryInfo(addPointCatIdx);
		
		// Calcolo la posizione di inserimento
		var pos;
		if (addPointLayIdx) {
			pos = parseInt(addPointLayIdx) + ((bBefore) ? 0 : 1);
		} else { // se non è definito addPointLayIdx inserire come primo elemento della categoria
			pos = addPoint.layers.length-1;
		}
		
		// Aggiorno indice cat
		layInfo.catTreeIdx = addPointCatIdx; 
		layInfo.layTreeIdx = "" + pos;
		
		//Inserisco nella giusta posizione
		if (pos > 0) {
			addPoint.layers.splice(pos, 0, layInfo);
		} else {
			addPoint.layers.unshift(layInfo);
		}
		
		// rinumero indici
		
		for (var i=0; i<addPoint.layers.length; i++) {
			var l = addPoint.layers[i];
			var oldLayTreeIdx = l.layTreeIdx
			l.layTreeIdx = i;
			if (oldLayTreeIdx!=i) { 
				this.fireEvent("layTreeIdxUpdate", l.layId, addPointCatIdx, oldLayTreeIdx, addPointCatIdx, l.layTreeIdx);
			}
		}
	},
	
	/**
	 * @method JSONEncodeInfo
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} layIdx
	 * 
	 * 
	 */
	JSONEncodeInfo: function(catIdx, layIdx) {
		
		var info = {
			TOCCATSEPARATOR: this.TOCCATSEPARATOR,
			categories: this.categories,
			server: this.server
		}
		
		return Ext.JSON.encode(info);
	}
	
	
});
