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
 * @class TolomeoExt.ToloContextMenu
 * @extends Ext.Toolbar
 * 
 * 
 */
Ext.define('TolomeoExt.ToloContextMenu', {
	
	extend: 'Ext.menu.Menu',

	/**
	 * @type {TolomeoExt.ToloMapAPIExt}
	 * Settato automaticamente da bindToApi. 
	 * 
	 */
	api: null,
	
	/** 
	 * @property {Object} paramsJS
	 * 
	 * 
	 */
	paramsJS :null,

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
	 * @property {String} iconBasePath
	 * 
	 * 
	 */
	iconBasePath:null,
	
	/** 
	 * @property {String} [cls='clearCSS']
	 * 
	 * 
	 */
	cls: 'clearCSS',
	
	/** 
	 * @property {String} crsSelected
	 * 
	 * 
	 */
	crsSelected: null,
	
	/** 
	 * @property {String} projectionCrs
	 * 
	 * 
	 */
	projectionCrs: null,
	
	/**
	 * Metodo di calcolo routing con openls
	 */
	olsMethod: 'Fastest',
	
	/**
	 * @method initComponent
	 * Create a new button toolbar
	 * 
	 */
	initComponent: function() {

		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);

		this.callParent(arguments);
		var thisContextMenu = this;	
		
		if (this.iconBasePath==null) this.iconBasePath =  TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOStaticRoot + 'img/icone/16-default/';
		
		//var hide_context_menu = function () { thisContextMenu.hide() }; 
		
		//fixIE10
		//if (Ext.isIE10){this.setWidth(200);}
		
		// necessarie perchè altrimenti il menu non scompare dalla più dalla pagina
		//this.on('show', function () {Ext.getDoc().on('mouseup', hide_context_menu)},this);
		//this.on('hide', function () {Ext.getDoc().un('mouseup', hide_context_menu)},this);		

		this.xEvtPos = 0;
		this.yEvtPos = 0;
		
		// add custom events
		this.addEvents('onGotoLocClickFn');
		this.addEvents('onReleaseLocClickFn');
		this.addEvents('onReleaseStreetviewClickFn');
		this.addEvents('onNotaClickFn');
		
			
		var listenersClick  = {click:  {fn: this.btnClickHandler,  scope: thisContextMenu}};
			
		var notifyReleaseLoc = function(){
			thisContextMenu.fireEvent('onReleaseLocClickFn', thisContextMenu.getXEvtPos(), thisContextMenu.getYEvtPos(), thisContextMenu.crsSelected);
		}
		
		var notifyReleaseStreetview = function(){
			thisContextMenu.fireEvent('onReleaseStreetviewClickFn', thisContextMenu.getXEvtPos(), thisContextMenu.getYEvtPos());
		}

		var notifyNota = function(){
			thisContextMenu.fireEvent('onNotaClickFn', thisContextMenu.getXEvtPos(), thisContextMenu.getYEvtPos());
		}
		
		var onCrsCheck = function(item, checked){
        		thisContextMenu.crsSelected = item.crs;
        		notifyReleaseLoc(item,null);          	
    	}

    	this.add({
			text: 'Nota',
			icon: this.iconBasePath + 'note.gif',
			handlerBaseName : 'Nota',
			listeners: {click: {fn: notifyNota,  scope: thisContextMenu}}
		});
		
		this.add("-");
		
		this.add({
			text: 'Vai a posizione',
			icon: this.iconBasePath + 'target.gif',
			handlerBaseName : 'GotoLoc',
			listeners: listenersClick
		});
		
		if(this.projectionCrs){		
			
			var crsItem = [];
			for(var i in this.projectionCrs){
				crsItem.push({
                    text: this.projectionCrs[i].description,
                    id: 'chk_'+ i,
                    crs: i,
                    group: 'crs',                        
                    handlerBaseName : 'ReleaseLoc',
                    xtype: 'menucheckitem',
                    listeners: {click: {fn: onCrsCheck,  scope: thisContextMenu}}
                });
			}
			
			this.add({
				text: 'Rilascia indicatore xy',
				id: this.getId() + 'releaseLoc',
				menu: {
					cls: 'clearCSS',
	                items: crsItem
	            },
				icon: this.iconBasePath + 'rilasciaxy.gif',
				handlerBaseName : 'ReleaseLoc',
				listeners: {click: {fn: notifyReleaseLoc,  scope: thisContextMenu}}
			});
			
			//fixIE10
			//if (Ext.isIE10){Ext.getCmp('releaseLoc').menu.setWidth(200);}
			
		}

		if (this.paramsJS.layOut.ols){
			this.addEvents('onOlsMethod');
			this.addEvents('onOlsReverseGeocoding');
			this.addEvents('onOlsStartPoint');
			this.addEvents('onOlsViaPoint');
			this.addEvents('onOlsEndPoint');
			this.addEvents('onOlsReset');
			
			var onOlsMethod = function(item, checked) {
				if (item.method != this.olsMethod) {
					this.olsMethod = item.method;
					this.fireEvent('onOlsMethod', this.olsMethod);
				}
			}
			
			this.add("-");
			
			var olsMethodItems = [
				{
                    text: 'Pi&ugrave veloce',
                    method: 'Fastest',
                    group: 'olsMethods',                        
                    xtype: 'menucheckitem',
                    listeners: {click: {fn: onOlsMethod,  scope: this}},
                    checked: true,
                },{
                    text: 'Pi&ugrave corto',
                    method: 'Shortest',
                    group: 'olsMethods',                        
                    xtype: 'menucheckitem',
                    listeners: {click: {fn: onOlsMethod,  scope: this}},
                },{
                    text: 'A piedi',
                    method: 'Pedestrian',
                    group: 'olsMethods',                        
                    xtype: 'menucheckitem',
                    listeners: {click: {fn: onOlsMethod,  scope: this}},
                },
            ];
			
			var olsItems = [
				{
                    text: 'Indirizzo',
                    listeners: {click: {fn: function() {
            			this.fireEvent('onOlsReverseGeocoding', this.getXEvtPos(), this.getYEvtPos());
        			},  scope: this}},
                },{
                    text: '-',
                    xtype: 'menuseparator',
                },{
                    text: 'Partenza',
    				icon: this.iconBasePath + 'ols/start.png',
                    listeners: {click: {fn: function() {
            			this.fireEvent('onOlsStartPoint', this.getXEvtPos(), this.getYEvtPos());
        			},  scope: this}},
                },{
                    text: 'Destinazione intermedia',
    				icon: this.iconBasePath + 'ols/via.png',
                    listeners: {click: {fn: function() {
            			this.fireEvent('onOlsViaPoint', this.getXEvtPos(), this.getYEvtPos());
        			},  scope: this}},
                },{
                    text: 'Arrivo',
    				icon: this.iconBasePath + 'ols/stop.png',
                    listeners: {click: {fn: function() {
            			this.fireEvent('onOlsEndPoint', this.getXEvtPos(), this.getYEvtPos());
        			},  scope: this}},
                },{
                    text: '-',
                    xtype: 'menuseparator',
                },{
    				text: 'Modalit&agrave;',
    				menu: {
    					cls: 'clearCSS',
    	                items: olsMethodItems,
    	            },
    			},{
                    text: '-',
                    xtype: 'menuseparator',
                },{
                    text: 'Cancella percorso',
                    icon: this.iconBasePath + 'ols/erase.png',
                    listeners: {click: {fn: function() {
            			this.fireEvent('onOlsReset', this.getXEvtPos(), this.getYEvtPos());
        			},  scope: this}},
                },
            ];
			
			this.add({
				text: 'Navigazione',
				menu: {
					cls: 'clearCSS',
	                items: olsItems
	            },
				handlerBaseName : 'ReleaseOls',
			});
		}
		
		if (this.paramsJS.layOut.conStreetView){
			this.add("-");
			this.add({
				text: 'Google Street View',
				icon: this.iconBasePath + 'streetview16.png',
				//icon: this.iconBasePath + 'eye-arrow.png',
				handlerBaseName : 'ReleaseStreetview',
				listeners: {click: {fn: notifyReleaseStreetview,  scope: thisContextMenu}}
			});
		}
		
		
		this.doLayout();
	
	},

	/**
	 * @method menuItemHandler
	 * 
	 * 
	 * @param {Object} button
	 * il pulsante.
	 * 
	 * @param {Object} e
	 * l'evento.
	 * 
	 * @return {Boolean}
	 * 
	 * 
	 */
	btnClickHandler: function (button, e) {
		if (button.handlerBaseName !=null) {
			var eventName = 'on' + button.handlerBaseName + 'ClickFn';
			this.fireEvent(eventName, button);
		}		
		return true;
	},

	/**
	 * @method bindToAPI
	 * 
	 * 
	 * @param {Object} api
	 * API.
	 * 
	 */
	bindToAPI: function(api) {
		this.api=api;
		// Eventi API ai quali viene registrato buttonsPanel
		/*
		api.on('onOperationEnable', function (opCode) {this.operationEnable(opCode, true);}, this );
		api.on('onOperationDisable', function (opCode) {this.operationEnable(opCode, false);}, this );
		api.on('onOperationPressDefault', function (group) {this.pressDefault(group);}, this );
		*/
	},
	
	/**
	 * @method showAt
	 * Metodo sovrascritto per registrarsi la posizione x ed y
	 * 
	 * @param {Array} xyPosition
	 * 
	 * 
	 * @param {Object} parentMenu
	 * 
	 * 
	 */ 
	showAt: function(xyPosition,parentMenu) {
		this.xEvtPos = xyPosition[0];
		this.yEvtPos = xyPosition[1];
		//TolomeoExt.ToloContextMenu.superclass.showAt.apply(this, arguments);
		this.callParent(arguments);
	},
	
	/**
	 * @method getXEvtPos
	 * 
	 * 
	 * @return {Number}
	 * posizione x dell'evento originante
	 * 
	 */
	getXEvtPos: function(){
		return this.xEvtPos;
	},
	
	/**
	 * @method getYEvtPos
	 * 
	 * 
	 * @return {Number}
	 * posizione y dell'evento originante
	 * 
	 */
	getYEvtPos: function(){
		return this.yEvtPos;
	},
	
	/**
	 * @method setCrsSelected
	 * Imposta il Sistema di coordinate da mostrare
	 * 
	 * @param {String} projCode
	 * 
	 * 
	 */
	setCrsSelected: function(projCode){
		var relLoc = this.getComponent(this.getId() + 'releaseLoc');
		if(relLoc){
			var prjItem = relLoc.menu.items.get('chk_'+projCode);
			if(prjItem){
				prjItem.setChecked(true,true);
			}
		}
		this.crsSelected = projCode;
	}
			
});
