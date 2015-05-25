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

Ext.define('TolomeoExt.ToloCommand', {

	//extend: 'Ext.util.Observable',

	statics: {
		//CMDZOOMTO: function() { return	1; },
		//CMDTOCUNCHECKALL: function() { return	2; },
		//CMDTOCCHECK: function() { return	3; },
		//cmdMapping: [
		//				'',
		//				'zoomTo',
		//				'tocCheck'
		//			],
		createCommand: function(commandCode, args) {
			return Ext.createByAlias(
				//cmdMapping['tolocommand.' + commandCode],
				'tolocommand.' + commandCode,
				args
			);
		}
	},
	
/*	config: {
		//commandCode: null,	
		args: null
	},
*/
	constructor: function(config) {

		this.initConfig(config);
		this.callParent(arguments);
	},
	
	run: function(api) {
		
	},
	
	encodeArgs: function() { },
	
	toJSON: function() {
		return "{\"c\":\"" + this.commandCode + "\",\"a\":" + this.encodeArgs() + "}";
	}

});

Ext.define('TolomeoExt.ToloCommand.tocCheck', {

	extend: 'TolomeoExt.ToloCommand',
	alias: ['tolocommand.tocCheck'],
	
	commandCode: 'tocCheck',
	
	config: {
		
		/**
		 * 
		 * @cfg {String[]} 
		 */
		pool: null,
		
		entry: null,
		
		/**
		 * @cfg {String[]} contiene elenco delle descrizioni delle voci di tipo text da attivare
		 */
		tentry: null,
		
		/**
		 * 
		 * @cfg {String} mode Valori possibili <br/>
		 * - listedOnly: modifica solo le voci di legenda listate
		 * - uncheckOthers: deseleziona le voci di legenda non listate
		 * - checkOthers: seleziona le voci di legenda non listate
		 */
		mode: 'listedOnly',
		
		/**
		 * @cfg {Number} ver versione tracciato. 
		 * - Non presente: versione originaria
		 * - 2: aggiunta trasparenza layer
		 */
		ver: null
	},
	
	constructor: function(config) {

		this.initConfig(config);
		this.callParent(arguments);
	},
	
	run: function(api) {
		
		
		api.TOCPanel.on('tocGuiCreate',
			function() {
				if (this.mode=='listedOnly') {
					// loop sulle voci listate
					for (var i=0; i<this.getTocEntryCount(); i++) {
						var tocEntry = this.getTocEntry(i);
						var serverID = this.pool[tocEntry.s]; //"RTCASTORE";
						var name = tocEntry.l; //"r_toscan_cst_fogli";
						var state = (this.mode=='listedOnly') ? tocEntry.a : (this.mode=='uncheckOthers');
						var lay = api.TOCPanel.tocInfo.searchLayerInfo(serverID, name);
						if (lay!=null  && lay.hidden==false && lay.itemType=='layer') {
							if (lay.state) {
								api.TOCPanel.checkAllParentCat(lay.catTreeIdx, true);
								// Se la legenda lo consente apre tutte le categorie fino al layer acceso 
								if (api.TOCPanel.expandCategories) {
									api.TOCPanel.expandCategories(lay.catTreeIdx);
								}
							}
							if (lay.checked!=state) api.TOCPanel.setLayerStateChange(lay.catTreeIdx, lay.layTreeIdx, state );
						}
					}
				} else {
					// Inizializzo stateBuff con il valore di default in funzione di mode
					// Solo per i layer non hidden
					api.TOCPanel.tocInfo.onEachLayer(
						function(cat, lay, catIdx, layIdx) {
								if (lay.hidden==false) lay.stateBuff = (this.mode=='checkOthers');
						},
						this
					);
					// modifico stateBuff e opacityBuff con il valore imposto da tocEntryList (solo per layer non hidden)
					for (var i=0; i<this.getTocEntryCount(); i++) {
						var tocEntry = this.getTocEntry(i);
						var serverID = this.pool[tocEntry.s]; //"RTCASTORE";
						var name = tocEntry.l; //"r_toscan_cst_fogli";
						var state = (this.mode=='listedOnly') ? tocEntry.a : (this.mode=='uncheckOthers');
						var opacityBuff = (this.ver && this.ver>=2) ? tocEntry.o : undefined;
						var styleBuff = (this.ver && this.ver>=3) ? tocEntry.style : undefined;
						var lay = api.TOCPanel.tocInfo.searchLayerInfo(serverID, name);
						if (lay!=null && lay.hidden==false) {
							lay.stateBuff=state;
							lay.opacityBuff = opacityBuff;
							lay.styleBuff = styleBuff; 
						}
					}
					
					// modifico statebuff con il valore imposto solo per le voci di tipo text
					if (this.tentry!=null) {
						for (var i=0; i<this.tentry.length; i++) {
							var tocTextEntry = this.tentry[i];
							var lay = api.TOCPanel.tocInfo.searchLayerInfoByDesc(tocTextEntry, 'text');
							if (lay!=null && lay.hidden==false) {
								lay.stateBuff=true;
							}
						}	
					}
					
					// modifico tutti gli stati che devono cambiare
					api.TOCPanel.tocInfo.onEachLayer(
						function(cat, lay, catIdx, layIdx) {
							if (lay.hidden==false && lay.itemType=='layer' ) {
								// Questo deve farlo comunque, perchè potrebbe avere gli antenati spenti pur essendo già acceso
								if (lay.stateBuff) { 
									api.TOCPanel.checkAllParentCat(lay.catTreeIdx, true);
									// Se la legenda lo consente apre tutte le categorie fino al layer acceso 
									if (api.TOCPanel.expandCategories) {
										api.TOCPanel.expandCategories(lay.catTreeIdx);
									}
								}
								// Questo lo deve fare solo se lo stato è diverso da quello voluto (altrimenti è inutile)
								if (lay.checked!=lay.stateBuff) {
									api.TOCPanel.setLayerStateChange(catIdx, layIdx, lay.stateBuff );
								}
								if (lay.opacityBuff!==undefined && lay.opacity!=lay.opacityBuff) {
									api.TOCPanel.layerOpacityChange(catIdx, layIdx, lay.opacityBuff*100 );
								}
								if (lay.styleBuff!==undefined){
									if(lay.styleCapable && lay.style!=lay.styleBuff && lay.definedStyles) {
										for(var i in lay.definedStyles){
											if(lay.definedStyles[i].name == lay.styleBuff){
												api.TOCPanel.setLayerStyle(catIdx, layIdx, lay.styleBuff );
												break;
											}
										}
										
									}
								}
								
							} else {
								if (lay.hidden==false && lay.itemType == 'text') {
									if (lay.stateBuff) { 
										api.TOCPanel.checkAllParentCat(lay.catTreeIdx, true);
										// Se la legenda lo consente apre tutte le categorie fino al layer acceso 
										if (api.TOCPanel.expandCategories) {
											api.TOCPanel.expandCategories(lay.catTreeIdx);
										}
									}	
								}
							}
						},
						this
					);
				}
			},
			this);			
			return true;
	},
	
	getTocEntry: function(index) {
		var basePos = index * this.getRecordLength();
		var retVal = { s: this.entry[basePos], l: this.entry[basePos+1], a: (this.mode=='listedOnly') ? this.entry[basePos+2] : undefined };
		if (this.ver && this.ver>=2) {
			if (this.mode=='listedOnly') retVal.o = this.entry[basePos+3];
			else retVal.o = this.entry[basePos+2];
		}
		
		if (this.ver && this.ver>=3) {
			if (this.mode=='listedOnly') retVal.style = this.entry[basePos+4];
			else retVal.style = this.entry[basePos+3];
		}
		
		return retVal; 
	},
	
	getTocEntryCount: function() {
		return Math.floor(this.entry.length / this.getRecordLength());
	},
	
	getRecordLength: function() {
		var extraFields = (this.ver && this.ver==2) ? 1 : 0;
		return (this.mode=='listedOnly') ? 3 + extraFields  : 2 + extraFields;
	},
	
	addTocEntry: function(serverID, layerName, state, opacity, style) {
		this.entry = this.entry || [];
		this.pool = this.pool || [];
		
		var serverIndex = this.pool.indexOf(serverID);
		
		if (serverIndex==-1) {
			serverIndex = this.pool.push(serverID) - 1;
		}
		
		this.entry.push(serverIndex, layerName);
		if (this.mode=='listedOnly') {
			this.entry.push(state);	
		}
		
		if ((this.ver && this.ver>=2)) {
			this.entry.push(opacity);
		}
		
		if (this.ver && this.ver>=3) {			
			this.entry.push(style ? style : "");			
		}
		
	},
	
	addTocTextEntry: function(descrizione) {
		this.tentry = this.tentry || [];
		this.tentry.push(descrizione);
	},
	
	encodeArgs: function() {
		
		var obj = { mode: this.mode, entry: this.entry, tentry: this.tentry, pool: this.pool, ver: this.ver };
		
		return Ext.JSON.encode(obj);
	}

});

Ext.define('TolomeoExt.ToloCommand.zoomTo', {

	extend: 'TolomeoExt.ToloCommand',
	alias: ['tolocommand.zoomTo'],
	
	commandCode: 'zoomTo',
	
	config: {
		/**
		 * @cfg {Number} Longitudine
		 */
		x: null,	
	
		/**
		* @cfg {Number} Latitudine
		*/
		y: null,
		
		/**
	 	* @cfg {Number} Scala
		*/
		s: null
	},
	
	constructor: function(config) {

		this.initConfig(config);
		this.callParent(arguments);
	},
	
	run: function(api) {
		
		api.viewer.on('onAfterPostInit',
			function() {
				api.viewer.pluginGotoPosition(this.x, this.y, this.s);		
			}, this,
			{single:true}
		);
		
		//api.viewer.pluginGotoPosition(this.x, this.y, this.s);
		return true;
	},
	
	encodeArgs: function() {
		var obj = { x: this.x, y: this.y, s: this.s};
		
		return Ext.JSON.encode(obj);
	}
	

});

Ext.define('TolomeoExt.ToloCommand.zoomToExtent', {

	extend: 'TolomeoExt.ToloCommand',
	alias: ['tolocommand.zoomToExtent'],
	
	commandCode: 'zoomToExtent',
	
	config: {
		/**
		 * 
		 * @type {Number} 
		 */
		left: null,
		
		/**
		 * 
		 * @type {Number} 
		 */
		bottom: null,
		
		/**
		 * 
		 * @type {Number} 
		 */
		right: null,
		
		/**
		 * 
		 * @type {Number} 
		 */
		top: null
		
	},
	
	constructor: function(config) {

		this.initConfig(config);
		this.callParent(arguments);
	},
	
	run: function(api) {
		
		api.viewer.on('onAfterPostInit',
			function() {
				var bbox = new BBox(this.left, this.bottom, this.right, this.top);
				this.zoomToExtent(bbox, 0);
			}, this,
			{single:true}
		);
		return true;
	},
	
	encodeArgs: function() {
		var obj = { left: this.left, bottom: this.bottom, right: this.right, left: this.left};
		
		return Ext.JSON.encode(obj);
	}
	

});


Ext.define('TolomeoExt.ToloCommand.addPopups', {

	extend: 'TolomeoExt.ToloCommand',
	alias: ['tolocommand.addPopup'],
	
	commandCode: 'addPopup',
	
	config: {
		
		/**
		 * 
		 * @type {Object[]} 
		 */
		conf: null
		
	},
	
	constructor: function(config) {

		this.initConfig(config);
		this.callParent(arguments);
	},
	
	run: function(api) {
		
		api.viewer.on('onAfterPostInit',
			function() {
				for (var i=0; i<this.conf.length; i++) {
					api.viewer.pluginAddPopup(this.conf[i].x, this.conf[i].y, this.conf[i].t, false, this.conf[i].e);	
				}		
			}, this,
			{single:true}
		);
		return true;
	},
	
	encodeArgs: function() {
		var obj = { conf: this.conf };
		
		return Ext.JSON.encode(obj);
	}

});


Ext.define('TolomeoExt.ToloCommand.identify', {

	extend: 'TolomeoExt.ToloCommand',
	alias: ['tolocommand.identify'],
	
	commandCode: 'identify',
	
	config: {
		/**
		 * 
		 * @type {Number} 
		 */
		x: null,
		
		/**
		 * 
		 * @type {Number} 
		 */
		y: null,
		
		/**
		 * 
		 * @type {String} 
		 */
		srid: null,
		
		/**
		 * 
		 * @type {String} 
		 */
		layerName: null,
		
	},
	
	constructor: function(config) {

		this.initConfig(config);
		this.callParent(arguments);
	},
	
	run: function(api) {
		
		api.TOCPanel.on('tocGuiCreate',
			function() {			
				var point = api.reprojectToCurrentCrs(new Point(this.x,this.y),this.srid);
				var lonlat = {lon:point.x,lat:point.y};
				var pixel = api.viewer.pluginGetPixelFromCoordinate(lonlat);
				var lay = null;
				
				if(this.layerName){
					var lay = api.TOCPanel.tocInfo.searchLayerInfo(null,this.layerName);
				}
				
				api.onMappaSelect(new Point(lonlat.lon, lonlat.lat),'firstOnTop',false,true, pixel.x,pixel.y,(lay?lay.codTPN:lay));								
			}, this,
			{single:true}
		);
		
		return true;
	},
	
	encodeArgs: function() {
		var obj = { left: this.left, bottom: this.bottom, right: this.right, left: this.left};
		
		return Ext.JSON.encode(obj);
	}
	

});