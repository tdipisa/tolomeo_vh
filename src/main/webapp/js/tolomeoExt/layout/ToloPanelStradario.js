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
 * @class TolomeoExt.ToloPanelStradario
 * @extends Ext.Panel
 * 
 */
Ext.define('TolomeoExt.ToloPanelStradario', {

	extend: 'Ext.Panel',
	alias:  'tx_ToloPanelStradario',
	alternateClassName: ['TolomeoExt.layout.ToloPanelStradario'],

	/**
	 * @property {Object} paramsJS
	 * 
	 * 
	 */
	paramsJS : null,

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
	 * @property {String} TOLOMEOStaticRoot
	 * 
	 * 
	 */
	TOLOMEOStaticRoot : null,

	/**
	 * @property {Boolean} suggestWithGeom
	 * 
	 * 
	 */
	suggestWithGeom : false,

	/**
	 * @property {Number} codTPNStrade
	 * 
	 * 
	 */
	codTPNStrade : -510,

	/**
	 * @property {Number} idRicercaStrade
	 * 
	 * 
	 */
	idRicercaStrade : 1,

	/**
	 * @property {Number} codTPNCivici
	 * 
	 * 
	 */
	codTPNCivici : -610,

	/**
	 * @property {Number} idRicercaCivici
	 * 
	 * 
	 */
	idRicercaCivici : 1,

	/**
	 * @property {TolomeoExt.ToloButtonPanelExt} toolbar
	 * 
	 * 
	 */
	toolbar : null,

	/**
	 * @property {Object} mapPanel
	 * 
	 * 
	 */
	mapPanel : null,

	/**
	 * @property {Object} toolsPanel
	 * 
	 * 
	 */
	toolsPanel : null,

	/**
	 * @property {Object} legendaPanelOpt
	 * 
	 * 
	 */
	legendaPanelOpt : null,

	/**
	 * @property {Object} legendaPanel
	 * 
	 * 
	 */
	legendaPanel : null,

	/**
	 * @property {Object} formPanelSearch
	 * 
	 * 
	 */
	formPanelSearch : null,

	/**
	 * @property {Object} gridView
	 * 
	 * 
	 */
	gridView : null,

	/**
	 * @property {Object} api
	 * 
	 * 
	 */
	api : null,

	/**
	 * @property {Object} fldVia
	 * 
	 * 
	 */
	fldVia : null,

	/**
	 * @property {Object} fldCivico
	 * 
	 * 
	 */
	fldCivico : null,

	/**
	 * @property {Object} listPanel
	 * 
	 * 
	 */
	listPanel : null,

	/**
	 * @property {Object} btnCerca
	 * 
	 * 
	 */
	btnCerca : null,

	/**
	 * @property {Object} viewerConfig
	 * Configurazione che sarà utilizzata per il viewer.
	 * 
	 */
	viewerConfig : null,
	
	/**
	 * @property {Object} ofcPanel
	 * 
	 * 
	 */
	ofcPanel: null,

	/**
	 * @method initComponent
	 * Metodo relativo alla gestione Ext.
	 * 
	 */
	initComponent : function() {

		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);

		this.layout = 'border';
		this.monitorResize = true;

		//Toolbar
		this.toolbar = new TolomeoExt.ToloButtonPanelExt({
			withPanArrows   : true,
			withLegenda     : false,
			withQuery       : false,
			withSeleziona   : false,
			withAutoIdentify: false,
			paramsJS        : this.paramsJS,
			defaults        : { scale: 'medium' },
			iconBasePath    : this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/icone/24-default/'
		});
		this.tbar = this.toolbar;
		
		this.callParent(arguments);
		
		var cfg = Ext.apply({}, this.viewerConfig);
		
		if(!this.legendaPanelOpt) this.legendaPanelOpt = {};
		
		// Legenda
		Ext.apply(this.legendaPanelOpt,{
			border        : false,
			layout        : 'anchor',
			paramsJS      : this.paramsJS,
			TOLOMEOServer : this.TOLOMEOServer,
			TOLOMEOContext: this.TOLOMEOContext,
			TOLOMEOStaticRoot: this.TOLOMEOStaticRoot, 
			xtype         : 'tx_toloMenuTOCPanelExt'
		});
		
		this.legendaPanel = new TolomeoExt.ToloMenuTOCPanelExt(this.legendaPanelOpt);
		
		this.ofcPanel = Ext.create('Ext.Panel', {
			layout    : 'anchor',
			border    : false,
			autoHeight: true,
			width     : 82,
			bodyStyle : 'background-color: white;',
			style     : 'background-color: white; z-index:1; top:auto; left:auto; right: 10px; top: 10px',
			layoutConfig: {
				align: 'stretch'
			},
			items     : [{
				xtype: 'box',
				id: 'icona',
				autoEl: {
					tag: 'img',
					src: this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/legenda/icona_mappa.png'
				},
				margins: {top:0, right:0, bottom:0, left:0}
			}, this.legendaPanel]
		});
		
		this.legendaPanel.on('layerCheckedChange', this.changeIcon, this);
		
		//Viewer
		this.mapPanel = new TolomeoExt.ToloViewerOLPanel(Ext.apply(cfg, {
			region   : 'center',
			xtype    : "tx_toloviewerOLPanel",
			//inizializzazione dimensioni, poi vengono ricalcolate dal viewer
			height   : 50,
			width    : 50,
			layout   : "fit",
			paramsJS : this.paramsJS
		}));

		this.mapPanel.add(this.ofcPanel);
		
		var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxSuggestServlet');
		proxy.extraParams = proxy.extraParams || {};
		Ext.apply(proxy.extraParams, {
				format   : "ext",
				idCampo  : 0,
				codTPN   : this.codTPNStrade,
				idRicerca: this.idRicercaStrade,
				withGeom : this.suggestWithGeom
			}); 
		var ds = Ext.create('Ext.data.JsonStore', {
			proxy      : proxy //,
			/*params : {
				format   : "ext",
				idCampo  : 0,
				codTPN   : this.codTPNStrade,
				idRicerca: this.idRicercaStrade,
				withGeom : this.suggestWithGeom
			}*/
		});

		//Pannello ricerca
		this.fldVia = Ext.create('Ext.form.ComboBox', {
			monitorResize : true,
			fieldLabel    : 'Via',
			anchor        : '90%',
			name          : 'campoRicerca0',
			forceSelection: false,
			allowBlank    : false,
			store         : ds,
			displayField  : 'description',
			valueField    : 'key',
			hiddenName    : 'key',
			queryParam    : 'q',
			typeAhead     : false,
			loadingText   : 'Ricerca...',
			minChars      : 3,
			hideTrigger   : true,
			listeners: {
				specialkey : {
					fn : function(cb, e){
						var me = this;
						if (e.getKey() == e.ENTER) {	
							this.cerca();
						}
					},
					scope: this
				}			
			}
		});

		this.fldCivico = Ext.create('Ext.form.TextField', {
			monitorResize: true,
			maxLength    : 12,
			fieldLabel   : 'Civico',
			anchor       : '90%',
			name         : 'campoRicerca1',
			allowBlank   : true,
			maskRe       : /\d/
		});

		this.btnCerca = Ext.create('Ext.Button', {
			monitorResize: true,
			text         : 'Cerca',
			formBind     : true,
			type         : 'submit',
			handler      : this.cerca,
			scope        : this
		});

		var fs = Ext.create('Ext.FormPanel', {
			monitorResize: true,
			anchor       : '-3',
			autoWidth    : true,
			autoHeight   : true,
			border       : false,
			defaultType  : 'textfield',
			items        : [this.fldVia, this.fldCivico],
			buttons      : [this.btnCerca, {
				text    : "Pulisci",
				handler : function() {
					Ext.getCmp('formPanelSearch').getForm().reset();
					Ext.getCmp('gridResults').hide();
				}
			}]
		});

		var store = Ext.create('Ext.data.ArrayStore', {
			autoDestroy : true,
			storeId     : 'store',
			idIndex     : 0,
			fields      : ['id', 'description']
		});

		this.gridResults = Ext.create('Ext.ListView', {
			id           : 'gridResults',
			monitorResize: true,
			autoWidth    : true,
			height       : 300,
			margin       : '10 0 0 0',
			autoScroll   : true,
			hidden       : true,
			store        : store,
			forceFit     : true,
			columns      : [{
				header   : 'Seleziona l\'oggetto desiderato',
				dataIndex: 'description',
				sortable : true,
				flex     :1,
				tpl      : '<a href="#" class="x-list-body" style="padding:0;margin:0;">{description}</a>'
			}]
		});

		/*
		this.listPanel = Ext.create('Ext.Panel', {
			id        : 'listPanel',
			title     : 'Lista risultati',
			frame     : false,
			hidden    : true,
			layout    : 'fit',
			autoWidth : true,
			autoScroll: true,
			height    : 300,
			items     : [this.gridResults]
		});
		*/

		this.gridResults.on('itemmouseenter', this.overIn, this);
		this.gridResults.on('itemmouseleave', this.overOut, this);
		this.gridResults.on('itemclick', this.click, this);

		this.formPanelSearch = Ext.create('Ext.FormPanel', {
			id           : 'formPanelSearch',
			title        : 'Cerca un indirizzo',
			region       : 'east',
			bodyStyle    : 'padding: 5px',
			width        : 300,
			minSize      : 250,
			maxSize      : 300,
			split        : true,
			collapsed    : false,
			collapsible  : true,
			border       : true,
			labelWidth   : 40,
			defaultType  : 'textfield',
			monitorValid : true,
			monitorResize: true,
			items : [fs, this.gridResults]
		});

		this.formPanelSearch.on('clientValidation', function(form, valid) {
			this.btnCerca.setDisabled(!valid);
		}, this);

		this.add(this.mapPanel);
		this.add(this.formPanelSearch);
		this.doLayout();
	},

	/**
	 * @method changeIcon
	 * 
	 * 
	 */
	changeIcon: function(layer, tocInfo) {		
		var isAtLeastOneChecked = layer.checked;
		if(!isAtLeastOneChecked){
			// Recupera le info sulla categoria
			var catInfo = tocInfo.getCategoryInfo(layer.catTreeIdx);
			
			for (var i=0; i<catInfo.layers.length; i++) {
				if(catInfo.layers[i].checked){
					isAtLeastOneChecked = true;
					break;
				}
			}
		}
		Ext.fly('icona').set({src:this.TOLOMEOServer + this.TOLOMEOStaticRoot + (isAtLeastOneChecked?'/img/legenda/icona_ortofoto.png':'/img/legenda/icona_mappa.png')});
	},
	
	/**
	 * @method afterRender
	 * Metodo privato invocato dopo che il pannello è stato renderizzato.
	 * 
	 */
	afterRender : function() {

		this.callParent(arguments);

		if (this.api == null) {
			this.api = new TolomeoExt.ToloMapAPIExt({
				paramsJS    : this.paramsJS,
				viewer      : this.mapPanel,
				buttonsPanel: this.toolbar,
				TOCPanel    : this.legendaPanel,
				titoloMappa : 'Stradario di Prato'
			});
		}

		this.loadMask = new Ext.LoadMask(this.id, {
					msg : "Attendere prego..."
				});
		this.loadMask.enable();
	},

	/**
	 * @method cerca
	 * 
	 */
	cerca: function() {

		this.loadMask.show();

		if (!this.btnCerca.disabled) {
			this.api.clearSelected(false);
			this.api.clearHighLigthed(false);

			var fparams = this.formPanelSearch.getForm().getValues();

			if ((this.fldCivico.getValue() != null) && (this.fldCivico.getValue() != "")) {
				// ricerca via e civico
				fparams.campoRicerca0 = this.fldVia.getValue();
				fparams.campoRicerca1 = this.fldCivico.getValue();
				fparams.format        = "ext";
				fparams.codTPN        = this.codTPNCivici;
				fparams.idCampo       = 0;
				if (this.fldVia.getValue() == this.fldVia.getRawValue())
					fparams.idRicerca = 20; //per descrizione
				else
					fparams.idRicerca = 30; //per id
			} else {
				// ricerca solo via
				fparams.campoRicerca0 = this.fldVia.getValue();
				fparams.format        = "ext";
				fparams.codTPN        = this.codTPNStrade;
				fparams.idCampo       = 0;
				if (this.fldVia.getValue() == this.fldVia.getRawValue()) {
					fparams.idRicerca = 4; //per descrizione
				} else {
					fparams.idRicerca = 3; //per id
				}
			}

			var submitOpt = {
				url    : this.TOLOMEOServer + this.TOLOMEOContext+ '/AjaxQueryServlet',
				method : 'POST',
				params : fparams,
				success: this.doOnQueryAjaxCallback,
				failure: this.doOnQueryAjaxFailure,
				scope  : this
			};

			new TolomeoExt.ToloCrossAjax().request(submitOpt);
		}
	},

	/**
	 * @method doOnQueryAjaxFailure
	 * 
	 * 
	 */
	doOnQueryAjaxFailure : function() {
		this.loadMask.hide();
		Ext.Msg.show({
			title  : 'Ricerca indirizzo',
			msg    : 'Errore durante la ricerca.',
			buttons: Ext.Msg.OK,
			icon   : Ext.MessageBox.ERROR
		});
	},

	/**
	 * @method doOnQueryAjaxCallback
	 * 
	 * 
	 * @param {Object} results
	 * 
	 * 
	 * @param {Object} store
	 * 
	 * 
	 */
	doOnQueryAjaxCallback : function(results, store) {

		this.loadMask.hide();

		if (store.getTotalCount() == 0) {
			Ext.MessageBox.alert('Ricerca indirizzo', 'Nessun risultato per la ricerca impostata.');
		} else if (store.getTotalCount() == 1) {
			this.gridResults.setVisible(false);

			var record = store.getAt(0).data;
			var geom = new JSGeometry(record.codTPN, record.key, record.description, record.geometry, record.boundingbox, record.SRID);
			this.found(geom);
		} else {
			var boundingBox = store.getProxy().reader.metaData.boundingBox;

			this.api.zoomToExtent(boundingBox);

			var titolo = 'Trovati ' + store.getTotalCount() + ' risultati per "' + this.fldVia.getRawValue();
			if (this.fldCivico.getValue() != "")
				titolo += ', ' + this.fldCivico.getValue() + '"';
			else
				titolo += '"';

			this.gridResults.setTitle(titolo);
			this.gridResults.setVisible(true);
			this.gridResults.bindStore(store);
		}
	},

	/**
	 * @method click
	 * 
	 * 
	 * @param {Object} dv
	 * dv
	 * 
	 * @param {Object} index
	 * index
	 * 
	 * @param {Object} node
	 * il nodo
	 * 
	 * @param {Object} e
	 * l'evento
	 * 
	 */
	click : function(dv, index, node, e) {
		var record = dv.getRecord(node).data;
		var geom = new JSGeometry(record.codTPN, record.key, record.description, record.geometry, record.boundingbox, record.SRID);
		this.found(geom);
	},

	/**
	 * @method found
	 * 
	 * 
	 * @param {Object} geom
	 * la geometria.
	 * 
	 */
	found : function(geom) {
		if (geom.geometry) {
			this.api.addSelected(geom);
			this.api.zoomToSelected(null,100);
			this.listPanel.hide();
		} else {
			Ext.Msg.alert('Ricerca indirizzo','L\'oggetto richiesto non &egrave; pozionato sulla cartografia.').getDialog().focus();
		}
	},

	/**
	 * @method overIn
	 * 
	 * 
	 * @param {Object} dv
	 * dv
	 * 
	 * @param {Object} index
	 * index
	 * 
	 * @param {Object} node
	 * il nodo
	 * 
	 * @param {Object} e
	 * l'evento
	 * 
	 */
	overIn : function(dv, index, node, e) {
		var record = dv.getRecord(node).data;
		/** 
		 * @type {Object} geom
		 * 
		 */
		var geom = new JSGeometry(record.codTPN, record.key,record.description, record.geometry, record.boundingbox, record.SRID);
		if (geom.geometry) this.api.addHighlighted(geom);
	},

	/**
	 * @method overOut
	 * 
	 * 
	 * @param {Object} dv
	 * dv
	 * 
	 * @param {Object} index
	 * index
	 * 
	 * @param {Object} node
	 * il nodo
	 * 
	 * @param {Object} e
	 * l'evento
	 * 
	 */
	overOut : function(dv, index, node, e) {
		this.api.clearHighLigthed();
	}
});
