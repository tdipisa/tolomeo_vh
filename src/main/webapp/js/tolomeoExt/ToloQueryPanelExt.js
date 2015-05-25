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

// @include "include.js"

/**
 * @class TolomeoExt.ToloQueryPanelExt
 * Pannello per contenere una mappa. Funzioni pubbliche di query e posizionamento (es. ricerca via e civico etc.).
 * Quando viene attivata la ricerca viene mostrato un pannello che contiene l'elenco delle ricerche possibili, 
 * che permette di inserire i criteri di ricerca all'interno di quelli previsti, di lanciare la ricerca. Nel caso che il risultato sia univoco
 * viene evidenziato l'oggetto risultato della ricerca e viene fatto uno zoomToHighlighted. Nel caso il risultato non sia univoco viene visualizzato 
 * l'elenco per poter scegliere quale oggetto evidenziare e zoomare.
 * Le ricerche possibili sono controllate da contenuto del file di configurazione xml, che permette di selezionare quali tra le ricerche
 * disponibili nel package sit debbano essere attivate.
 *
 * @author Ing. Alessandro Radaelli
 */
Ext.define('TolomeoExt.ToloQueryPanelExt', {

	extend: 'Ext.Panel',
	
	//requires: [],


	/** 
	 * @property {Object} showHideContainer
	 * contenitore che deve essere mostrato/nascosto per visualizzare o nascondere la legenda
	 * Se null viene visualizzato e nascosto questo stesso pannelleo
	 * 
	 */
	showHideContainer: null,

	/** 
	 * @property {Function} showHandler
	 * Funzione da chiamare per visualizzare la legenda. Se null non viene chiamata
	 * 
	 */
	showHandler: null,

	/** 
	 * @property {Function} hideHandler
	 * Funzione da chiamare per nascondere la legenda. Se null non viene chiamata
	 * 
	 */
	hideHandler: null,

	/** 
	 * @property {Object} paramsJS
	 * 
	 * 
	 */
	paramsJS: null,

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
	 * @property {Object} panelCampi
	 * 
	 * 
	 */
	panelCampi: null,

	/** 
	 * @property {Object} panelResults
	 * 
	 * 
	 */
	panelResults: null, 

	/** 
	 * @property {Object} formPanelSearch
	 * 
	 * 
	 */
	formPanelSearch: null,

	/** 
	 * @property {Object} layerStore
	 * 
	 * 
	 */
	layerStore: null,

	/** 
	 * @property {Object} cmbLayerSel
	 * 
	 * 
	 */
	cmbLayerSel: null,

	/** 
	 * @property {Object} cmbTipo
	 * 
	 * 
	 */
	cmbTipo:null,

	/** 
	 * @property {Object} pnlCampi
	 * 
	 * 
	 */
	pnlCampi: null, 

	/** 
	 * @property {Object} pnlResults
	 * 
	 * 
	 */
	pnlResults: null,

	/** 
	 * @property {Object} suggestWithGeom
	 * 
	 * 
	 */	
	suggestWithGeom: null,
	
	/** 
	 * @property {Object} queryFields
	 * 
	 * 
	 */	
	queryFields: null,

	/** 
	 * @property {Object} waitMask
	 * 
	 * 
	 */	
	waitMask: null,
	
	/** 
	 * @property {Object} geomFilterField
	 * Campo nascosto che ospiter� geomFilter
	 * 
	 */
	geomFilterField: null,
	
	/**
	 * @method initComponent
	 * Crea un nuovo TolomeoExt.ToloQueryPanelExt
	 * 
	 */
	initComponent: function(){
	
    	// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		TolomeoExt.applyIfEmpty(this, {suggestWithGeom: true});
		
		this.on('activate', this.focusFirstField);
		
		// Eventi
		// Item selected
    	this.addEvents('querySelected');
    	// No results
    	this.addEvents('queryNoResults');
    	// Hover on item of a selection with multiple results
    	this.addEvents('queryMultipleResultHover');
    	this.addEvents('queryMultipleResultOut');
    	
    	// Evento che scatta quando un nuovo campo filtro geometria � creato
    	// Tipicamente � utilizzato per consentire alla API di inizializzarlo con il box 
    	// utilizzando il metodo setGeomFilterField
    	this.addEvents('geomFilterFieldCreated');
    	
		this.layerStore = Ext.create('Ext.data.Store',{
		    fields: [{
		    	name: 'descrizioneLayer',
		    	mapping: 'descrizioneLayer'
		    },{
		    	name: 'codTPN', mapping: 'codTPN'
		    },{
		    	name: 'eventiLayer',
		        convert: function (v, rec) { 
		        	return rec.raw; 
		        } 
		    }],
		    data: this.paramsJS.azioniEventi.eventiLayerList
		});
		
		this.layerStore.filterBy(this.withSearchLayerFilter);

		this.cmbLayerSel = Ext.create('Ext.form.ComboBox',{
			typeAhead: true,
			forceSelection: true, 
			anchor: "-1",
			lastQuery: '',
			queryMode: 'local',
			triggerAction: 'all',
			emptyText: 'Seleziona il layer...',
			selectOnFocus: true,
			editable:false,
			fieldLabel: 'Trova in',
			//hiddenName: 'codTPN',
			name: 'codTPN',
			valueField: 'codTPN',
			displayField: 'descrizioneLayer',
			listeners: {
				select: {
					fn: this.onQueryChangeLayer,
					scope: this
				}
			},
			store: this.layerStore
		});
		
		this.SearchTypeStore = Ext.create('Ext.data.Store',{
			fields: [{
		    	name: 'metadatoRicerca',
		    	mapping: 'metadatoRicerca'
		    },{
		    	name: 'id',
		    	convert: function (v, rec) { 
		    		return rec.raw.metadatoRicerca.id; 
		    	}
		    },{
		    	name: 'desc',
		    	convert: function (v, rec) { 
		    		return rec.raw.metadatoRicerca.descrizione; 
		    	}
		    },{
		    	name: 'azioniEventiRicercaList',
		    	convert: function (v, rec) { 				        
		    		return rec.raw; 
		    	}
		    }]
		});
				
		this.cmbTipo = Ext.create('Ext.form.ComboBox',{
			typeAhead: false,
			anchor: "-1",
			editable: true,
			triggerAction: 'all',
			queryMode: 'local',
			fieldLabel: 'Tipo',
			editable:false,
			//hiddenName: 'idRicerca',
			name: 'idRicerca',
			valueField: 'id',
			displayField: 'desc',
			listeners: {
				select: {fn: this.onQueryChangeRicerca, scope: this}
			},
			store: this.SearchTypeStore
		});
		
		this.pnlCampi = Ext.create('Ext.Panel',{
			anchor: "-1",
			border: false,
		//	monitorResize: true,
			layout: "form",
			hidden: false,
			reset: function(){
				this.items.each(function(item){
					if (item.name != 'geomFilter') {
						item.reset();
					}
				});
			}
		}); 
			
		// FieldSet
		this.fs= Ext.create('Ext.form.FieldSet',{
		//	monitorResize: true,
			title: 'Trova sulla mappa',
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			defaultType: 'textfield',
			items:[this.cmbLayerSel, this.cmbTipo, this.pnlCampi]
		});

		this.pnlResults = Ext.create('Ext.Panel',{
			title: 'Lista risultati',
			frame: false,
			hidden: true,
	        layout: 'fit',
	        autoWidth: true,
	        autoScroll: true,
	        height: 300
		});
		
		// FormPanel
		this.formPanelSearch = Ext.create('Ext.FormPanel',{
			monitorValid: true,
		//	monitorResize: true,
			labelWidth: 60,
			standardSubmit: false,
			bodyStyle: 'padding: 5px',
			border: false,
			items: [this.fs, this.pnlResults, {
				xtype: 'hidden', 
				name: 'SRID',
				value : this.paramsJS.mappe.SRID
			}],
			buttons: [{
				text: 'Trova',
				formBind: true,
				type: 'button',
				listeners: {'click': {fn: this.onQuery, scope: this}}
			},{
				text: 'Pulisci',
				resultPanel: this.pnlResults,
				fieldsPanel: this.pnlCampi,
				handler: function() {
					this.fieldsPanel.reset();
					this.resultPanel.hide();
				}
			}]/*,
			keys: [{
	        	key: [Ext.EventObject.ENTER], 
             	handler: this.onQuery,
                scope: this
             }] */ 
		});
		
		var map = Ext.create('Ext.util.KeyMap',{
		    target: this,
		    binding: {
		        key: Ext.EventObject.ENTER,
		        fn: this.onQuery,
		        scope: this
		    }
		});		

		
		this.callParent();
		
		// Se esiste seleziono il primo layer
    	if (this.layerStore.getCount()>0) {
    		this.cmbLayerSel.setValue(this.layerStore.getRange(0,0)[0].data.codTPN);
    		this.onQueryChangeLayer (this.cmbLayerSel, this.layerStore.getRange(0,0)[0], 0 );
    	}
    	else //altrimenti nascondo la lista
    		this.cmbLayerSel.setVisible(false);
		
    	this.add(this.formPanelSearch);
    	
    		
	   // this.addButton(this.cmbLayerSel);
    },
    
    /**
     * @method formSubmit
     * Metodo relativo alla gestione Ext.
     * 
     */
    formSubmit: function() {
    	
    	var fparams = this.formPanelSearch.getForm().getValues();
    	fparams.format = "ext";
    	
    	var submitOpt = {
    		url: this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxQueryServlet',
    		method: 'POST',
    		params: fparams,
    		waitMsg: 'Ricerca in corso...',
    		success: this.doOnQueryAjaxCallback,
    		failure: this.doOnQueryAjaxFailure,
    		scope: this
    	};
    	
    	// Submit ajax della form

    	this.waitMask=new Ext.LoadMask(this.id, {msg:"Ricerca in corso...."});
    	this.waitMask.show();
		new TolomeoExt.ToloCrossAjax().request(submitOpt);
		//this.formPanelSearch.getForm().submit(submitOpt);
    },
    
    /**
     * @method withSearchLayerFilter
     * Metodo relativo alla gestione Ext.
     *
     * @param {Object} record
     * record.
     * 
     */
    withSearchLayerFilter: function(record) {
    	return (record.data.eventiLayer.azioniEventiRicercaList.ricercaList.length!=0);
    },

    /**
     * @method showQuery
     * Metodo relativo alla gestione Ext.
     * 
     */
    showQuery: function () {
    	if (this.showHandler!=null) {
			this.showHandler.call(this);
		} else if (this.showHideContainer!=null) {
			this.showHideContainer.setVisible(true);
		} else this.setVisible(true); 	
    },

    /**
     * @method hideQuery
     * Metodo relativo alla gestione Ext.
     * 
     */
    hideQuery: function () {
    	//this.onQueryChangeLayer();
    	if (this.hideHandler!=null) {
			this.hideHandler.call(this);
		} else if (this.showHideContainer!=null) {
			this.showHideContainer.setVisible(false);
		} else this.setVisible(false); 
    },
    
    /**
     * @method showAjaxError
     * Metodo relativo alla gestione Ext.
     * 
     * @param {Object} transport
     * transport.
     */
    showAjaxError: function(transport){			
		Ext.Msg.show({
		    title: 'Errore Ajax',
		    msg: 'Problemi nella query di ricerca',
		    buttons: {		    	
			    yes: 'Mostra',
			    cancel: 'Continua'						    
		    },
		    icon: Ext.MessageBox.ERROR,
		    fn: function(btn) {
		    	switch(btn) {
		       		case 'yes':
		       			Ext.Msg.alert('Errore Ajax',transport.responseText);
		       			break;
		    	}
		    }
		});
		this.fireEvent('ajaxError', transport);						
	},

	/**
	 * @method onQueryChangeLayer
	 * Funzione chiamata quando nel pannello di query viene cambiato il layer selezionato.
	 * Provvede ad aggiornare l'elenco delle ricerche disponibili.
	 *
	 * @param {Ext.form.ComboBox} combo
	 * combo.
	 * 
	 * @param {Ext.data.Record} record
	 * record.
	 * 
	 * @param {Number} index
	 * index.
	 * 
	 */
	onQueryChangeLayer: function (combo, record, index ) {

		 var recbuff;
		 if (record instanceof Array) {
			 recbuff=record[0];
		 } else {
			 recbuff = record;
		 }
		 
		var queryList = recbuff.data.eventiLayer.azioniEventiRicercaList.ricercaList;
		var store = this.cmbTipo.store;
		
		//store.removeAll();
		store.loadData( queryList, false);

		// Se esiste seleziono prima scelta
		if (store.getCount()>0) {
			if(store.getCount() == 1){
    			this.cmbTipo.hide();
    		}else{
    			this.cmbTipo.show();
    		}
			this.cmbTipo.select(store.data.items[0]);
    		
			//this.cmbTipo.setValue(store.getRange(0,0)[0].data.id);
        	this.onQueryChangeRicerca (this.cmbTipo, store.getRange(0,0)[0], 0 );
		}
	}, 

	/**
	 * @method onQueryChangeRicerca
	 * Funzione chiamata quando nel pannello di query viene cambiata la ricerca selezionata.
	 * Provvede ad aggiornare l'elenco dei campi di ricerca e ad inizializzare, se disponibile, il meccanismo di suggest.
	 *
	 * @param {Ext.form.ComboBox} combo
	 * combo.
	 * 
	 * @param {Ext.data.Record} record
	 * record.
	 * 
	 * @param {Number} index
	 * index.
	 * 
	 */
	onQueryChangeRicerca: function (combo, record, index) {
		var me = this;
		
		var recbuff;
		if (record instanceof Array) {
			recbuff=record[0];
		} else {
			recbuff = record;
		}
		
		var nomiCampi = recbuff.data.metadatoRicerca.nomiCampi;
		var suggestDisponibile = recbuff.data.metadatoRicerca.suggestDisponibile;
		var suggestMinLength = recbuff.data.metadatoRicerca.suggestMinLength;
		var suggestProvider = recbuff.data.metadatoRicerca.suggestProvider;
		//var tipiCampi = query.metadatoRicerca.tipiCampi;
		
		this.pnlResults.hide();
		this.pnlCampi.removeAll();
		this.queryFields = [];

		// Inserimento campi e labels
		for (var i=0; i<nomiCampi.length; i++) {
			
			var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxSuggestServlet');
			proxy.extraParams= {
	        	format:"ext",
	        	idCampo: i,
	        	SRID: this.paramsJS.mappe.SRID,
	        	withGeom: this.suggestWithGeom
	        };
			
			var ds = Ext.create('Ext.data.JsonStore',{
		        proxy: proxy,
		        idCampo: i,
				listeners: {
					beforeload: {
						fn: function(store, options) {
							return me.setAutoCompleteBaseParams(store, options);  
						}
					},
					load: {
						fn: function(store, records, options) {
							store.sort('descriptionSuggest'+store.idCampo,'ASC');
						}
					}
				}
		    });
			var a = new TolomeoExt.ToloCrossAjax();
			
			ds.on('exception', a.storeException);
			
			
		    var field1 = null;
		    var fldopts = {
				fieldLabel: nomiCampi[i],
				name: 'campoRicerca' + i,
				allowBlank: false
			};
			
			var fldoptskey = {
				name: 'campoRicercaChiave' + i
			};
		    
		    // Se autosuggest
		    if ( (suggestDisponibile!=undefined) && (suggestDisponibile!=null) && (suggestDisponibile.size!=0) && suggestDisponibile[i]) {
		    
		    	if ( (suggestProvider!=undefined) && (suggestProvider!=null) && (suggestProvider.size!=0) && suggestProvider[i]!=null) {
		    	// suggest provider definito
		    		
		    		var filterBind 	= suggestProvider[i].filterBind;
		    		var fields 		= [];
		    		if (suggestProvider[i].valori.length>0) {
		    			for(var propertyName in suggestProvider[i].valori[0]) {
			    			fields.push(propertyName);
			    		}	
		    		} else {
		    			fields 		= ['COD', 'DESC'];
		    		}
		    		
		    		var store = Ext.create('Ext.data.JsonStore',{
		    		    // store configs
		    		    autoDestroy: true,
		    		    data: suggestProvider[i],
		    		    fields: fields, 
		    		    proxy: {
		    		    	type: 'memory',
		    		    	// reader configs
		    				reader: {
		    		    			type: 'json',
		    		    			root: 'valori',
		    		    			idProperty: suggestProvider[i].valueFieldName // 'COD',
		    		    			//fields: fields //['COD', 'DESC', 'REG']
		    				}
		    			}
		    		});
		    		var field1key = Ext.create('Ext.form.field.Hidden',fldoptskey);
		    		this.pnlCampi.add(field1key);
		    		Ext.apply(fldopts, {
						forceSelection: true,
						lastQuery: '',
						store: store,
						displayField: suggestProvider[i].displayFieldName, //'DESC',
				        valueField: suggestProvider[i].valueFieldName, //'COD',
				        queryMode: 'local',
						selectOnFocus: true,
						editable:true,
						triggerAction: 'all',
						//queryParam: 'q',
				        typeAhead: true,
				        loadingText: 'Ricerca...',
				        field1key: field1key,
				        anchor: "-3",
				        minChars: suggestMinLength[i],
		    			//hiddenName: 'campoRicerca' + i,		// invia con la form il valueField invece del contenuto del campo
		    			filterBind: filterBind,
		    			fieldIdx: i,
		    		    //listeners: { beforeQuery: { fn: function() { 
		    		    //									me.storeFilterApply(this.store, this.filterBind);} } }
		    			listeners: { change: { fn: function() { me.suggestUpdate(suggestProvider, this);} },
		    						 select: { scope: this,
				        					   fn: function( combo, records, eOpts ) {
						        						combo.field1key.setValue(records[0].get('key'));	
						        					}
				        					}
		    			}
			    	});
			    	
			    	
		    		field1 = Ext.create('Ext.form.ComboBox',fldopts);
		    	} else {
		    		// senza suggest provider (meccanismo classico con AjaxSuggestServlet)
			    	var field1key = Ext.create('Ext.form.field.Hidden',fldoptskey);
		    		this.pnlCampi.add(field1key);
		    		Ext.apply(fldopts, {
						forceSelection: true, 
						store: ds,
				        displayField: 'descriptionSuggest' + i,
				        //valueField: 'key',
				        queryParam: 'q',
				        typeAhead: false,
				        loadingText: 'Ricerca...',
				        anchor: "-3",
				        minChars: suggestMinLength[i],
				        hideTrigger:true,
				        field1key: field1key,
				        listeners: { select: {  scope: this,
				        						fn: function( combo, records, eOpts ) {
						        						combo.field1key.setValue(records[0].get('key'));	
						        					}
				        					}
				        			}
			    		});
		    		field1 = Ext.create('Ext.form.ComboBox',fldopts);		
		    		
		    	}
		    }else {
			    field1 = Ext.create('Ext.form.TextField',fldopts);
		    }
		   
			this.pnlCampi.add(field1);
			this.queryFields.push(field1);
			if (i==0) field1.focus(false, 20);
		}
		
		// Inserimento checkbox per filtro geografico
		if (recbuff.data.metadatoRicerca.geomFilterAvailable) {
			this.pnlCampi.add({
		                        boxLabel  : 'Cerca su mappa visibile',
		                        name      : 'geomFilterActive',
		                        xtype	  : 'checkboxfield'
		                    });
			
			this.geomFilterField = Ext.create('Ext.form.field.Hidden', {
                name      : 'geomFilter'
            });
			
			this.pnlCampi.add(this.geomFilterField);
			
			this.fireEvent('geomFilterFieldCreated', this.geomFilterField);
		}
		
		
		this.pnlCampi.setVisible(true);
		this.pnlCampi.doLayout();
	},

	/**
	 * @method arrayContains
	 * 
	 *
	 * @param {Object} arr
	 * 
	 * 
	 * @param {Object} obj
	 * 
	 * 
	 */
	arrayContains: function(arr, obj) {
		var retVal=false;
		for (var i=0; i<arr.length; i++) if (arr[i]==obj) retVal=true;
		
		return retVal;
	},

	/**
	 * @method suggestUpdate
	 * 
	 *
	 * @param {Object} suggestProvider
	 * 
	 * 
	 * @param {Object} changedField
	 * 
	 * 
	 */
	suggestUpdate: function(suggestProvider, changedField) {
		var dipendonoDa = [];
		var changedIdx = changedField.fieldIdx;
		
		for (var i=0; i<suggestProvider.length; i++) {
			
			if (changedIdx!=i) {
				//suggest del campo escluso changedIdx stesso
				var s = suggestProvider[i].filterBind;
				// Numerocampo#nomecampo 
				var s1 = s.split(",");
				for (var j=0; j<s1.length; j++) {		
					var s2 = s1[j].split("#");
					var numeroCampo = s2[0];
					if (numeroCampo==changedIdx) {
						// Il campo numeroCampo dipende da changedIdx
						// Controllo se c'� gi� altrimenti aggiungo nella lista 
						if (!this.arrayContains(dipendonoDa, numeroCampo)) dipendonoDa.push(i);
					}					
				}
			}
			
		}
		
		// Aggiorna lo storeFilter per ogni campo che dipende dal campo che � cambiato		
		for (var i =  0; i<dipendonoDa.length; i++) {
			var numCampo = dipendonoDa[i];
			this.storeFilterApply(this.queryFields[numCampo]);
		}
	},

	/**
	 * @method storeFilterApply
	 * 
	 *
	 * @param {Object} field
	 * 
	 * 
	 */
	storeFilterApply: function(field ) {
		var store		= field.store;
		var filterBind 	= field.filterBind;
					
		if (filterBind==undefined || filterBind==null || filterBind=="") return;
		
		field.setValue("");
		var filters = filterBind.split(",");
		var filtriExt = [];
		for (var i = 0; i<filters.length; i++) {
			var f = filters[i].split("#");
			if (this.queryFields[f[0]].getValue()!="") {
				var filtroExt = {
								root: 'data',
								property     : f[1],
				                value        : this.queryFields[f[0]].getValue(),
				                anyMatch     : true, //optional, defaults to true
				                caseSensitive: true  //optional, defaults to true
							};
				filtriExt.push(Ext.create('Ext.util.Filter',filtroExt));
			}
		}
		if (filtriExt!=[]) {
			store.clearFilter(true);
			store.filter(filtriExt);
		} else {
			store.ClearFilter(filtriExt);
		}
		
		
	},
	
	/**
	 * @method setAutoCompleteBaseParams
	 * 
	 * 
	 * @param {Object} ds
	 * ds.
	 * 
	 * @param {Object} options
	 * options.
	 * 
	 */
	setAutoCompleteBaseParams: function(ds, options) {
		
		ds.getProxy().extraParams = ds.getProxy().extraParams || {};
		Ext.apply(ds.getProxy().extraParams,{
			codTPN: this.cmbLayerSel.getValue(),
			idRicerca: this.cmbTipo.getValue()
		});
		//ds.setBaseParam('codTPN', this.cmbLayerSel.getValue());
		//ds.setBaseParam('idRicerca', this.cmbTipo.getValue());

		// necessario dalla versione 3.1 di extJS
		options.params.codTPN = this.cmbLayerSel.getValue();
		options.params.idRicerca = this.cmbTipo.getValue();
		
		for (var i=0; i<this.pnlCampi.items.items.length; i++) {
			var cmp = this.pnlCampi.items.items[i];
			ds.getProxy().extraParams[cmp.name] = cmp.getValue(); 
			options.params[cmp.name] = cmp.getValue();
		}
		
		return true;
	},
	
	/**
	 * @method focusFirstField
	 * 
	 * 
	 */
	focusFirstField:function() {
		if ( this.pnlCampi && this.pnlCampi.items && this.pnlCampi.items.items.size>0) this.pnlCampi.items.items[0].focus(false, 30); 	
	},	

	/**
	 * @method onQuery
	 * Esegue la ricerca tramite ajax sulla base dei valori contenuti nel pannello di query.
	 * Questa funzione si occupa solo di eseguire la chiamata ajax, che viene poi gestita da doOnQueryAjaxCallback.
	 * 
	 */
    onQuery: function () {
    	// Svuoto lista risultati precedenti
    	if (this.pnlResults) this.pnlResults.removeAll();

    	this.formSubmit();
    },

    /**
     * @method doOnQueryAjaxCallback
     * Funzione di callback della chiamata Ajax che effettua la ricerca onQuery.
     *
     * @param {Object} results
     * risposta della chiamata ajax.
     * 
     * @param {Object} store
     * store.
     * 
     */
    doOnQueryAjaxCallback: function (results, store) {

    	this.waitMask.hide();
    	if(results.length == 0){
    		this.onQueryNoResults();
    	} else if (results.length == 1) {
    		var geoms = new JSGeometryArray();
    		geoms.FromStore(results, store);
    		if (geoms.geometries[0].geometry=="") {
    			Ext.Msg.alert('Ricerca indirizzo','L\'oggetto richiesto non &egrave; posizionato sulla cartografia.').getDialog().focus();
    		}else{
    			this.onQuerySingleResult(geoms);
    		}
    	} else {
    		this.onQueryMultipleResults(results, store);
    	}
    },

    /**
     * @method doOnQueryAjaxFailure
     * Funzione di gestione errore avvenuto nella chiamata Ajax che effettua la ricerca onQuery.
     * 
     * @param {Object} store
     * store.
     * 
     */
    doOnQueryAjaxFailure: function (store) {
    	this.waitMask.hide();
    	//showAjaxError(transport);
    },

    /**
     * @method onQuerySingleResult
     * Gestisce la risposta della query; se si tratta di risposta univoca esegue le azioni previste chiamando la funzione doEventActions, 
     * nel caso di risposta multipla chiama onQueryMultipleResults.
     * 
     * @param {TolomeoExt.JSGeometryArray} geoms
     * Oggetti risultato della ricerca.
     * 
     */
    onQuerySingleResult: function (geoms) {		
    	this.fireEvent('querySelected', geoms);
    },

    /**
     * @method onQueryNoResults
     * Gestisce il caso in cui la ricerca non abbia dato dei risultati.
     * 
     */
    onQueryNoResults: function () {
 		this.fireEvent('queryNoResults');
 		//.getDialog()
 		Ext.MessageBox.alert('Ricerche', 'Nessun risultato per la ricerca impostata.').focus();
    },

    /**
     * @method onQueryMultipleResults
     * Gestisce il caso di ricerca con pi� di un risultato visualizzando la lista e fornendo le funzionalit� per fare zoom all'intero 
     * insieme dei risultati, o al singolo.
     *
     * @param {Object} results
     * results
     * 
     * @param {Object} store
     * store
     * 
     */
    onQueryMultipleResults: function(results, store) {

    	this.pnlResults.setVisible(true);
    	
    	var listView = Ext.create('Ext.grid.Panel',{
    		store: store,
    		autoWidth: true,
    		emptyText: 'Descrizione non recuperata',
    		viewConfig: {
    			//firstCls: null,
    			trackOver: true
    		},
    		
    		//reserveScrollOffset: true,
    		//multiSelect: false,
    		listeners: {
    			'itemmouseenter': { fn: this.onQueryAddHighlighted, scope: this},
    			'itemmouseleave': { fn: this.onQueryClearHighlighted, scope: this},
    			'itemclick':      { fn: this.onQuerySingleResultByIndex, scope: this}
    		},
    		columns: [{
    			header: 'Descrizione',
    			//width: 1,
    			flex: 1,
    			dataIndex: 'description'
    		}]
    	});

    	store.sort('description', 'ASC');
    	this.pnlResults.add(listView);
    	this.pnlResults.doLayout();
    }, 

    /**
     * @method onQuerySingleResultByIndex
     * Funzione che permette di estrerre il singolo oggetto nella lista dei risultati della query.
     * 
     * @param {Object} listView
     * listView
     * 
     * @param {Object} record
     * 
     * 
     * @param {Object} item
     * 
     * 
     * @param {Object} index
     * index
     * 
     * @param {Object} e
     * l'evento
     * 
     * @param {Object} eOpts
     * 
     * 
     */
    onQuerySingleResultByIndex: function (listView, record, item, index, e, eOpts) {
    	var geom = record.data; 
    		//listView.store.data.items[index].data;     	
    	var jsGeoArr = new JSGeometryArray();
    	jsGeoArr.FromStoreSingleRecord(geom);

    	this.onQuerySingleResult(jsGeoArr);
    },

    /**
     * @method onQueryAddHighlighted
     * Evidenzia il singolo oggetto identificato da index all'interno del risultato della query. Viene invocato sull'evento onmouseover sulla lista dei risultati.
     *
     * @param {Object} listView
     * listView
     * 
     * @param {Object} record
     * 
     * 
     * @param {Object} item
     * 
     * 
     * @param {Object} index
     * index
     * 
     * @param {Object} e
     * l'evento
     * 
     */
    onQueryAddHighlighted: function (listView,  record, item, index, e, eOpts) {

    	//store.data.items[index].data;
    	var geom = record.data;
    	var jsGeoArr = new JSGeometryArray();
    	jsGeoArr.FromStoreSingleRecord(geom);

    	this.fireEvent('queryMultipleResultHoverStart', jsGeoArr.geometries[0]); 
    	/*
    	TODO su chi ascolta evento
    	var geoms   = document.getElementById("divQueryListaRisultati").geoms;		

    	addHighlighted(geoms.geometries[index]);
    	 */

    },

    /**
     * @method onQueryClearHighlighted
     * Viene invocato sull'evento onmouseout sulla lista dei risultati per eseguire eventualmente operazione di deselezione. Attualmente non esegue alcuna operazione.
     *
     * @param {Object} listView
     * listView
     * 
     * @param {Object} record
     * 
     * 
     * @param {Object} item
     * 
     * 
     * @param {Object} index
     * index
     * 
     * @param {Object} e
     * l'evento
     * 
     * @param {Object} eOpts
     * 
     * 
     */
    onQueryClearHighlighted: function (listView, record, item, index, e, eOpts) {
    	var geom = record.data; 
    	var jsGeoArr = new JSGeometryArray();
    	jsGeoArr.FromStoreSingleRecord(geom);
    	
    	this.fireEvent('queryMultipleResultOut', jsGeoArr.geometries[0] ); 
    },


    /**
     * @method setGeomFilterField
     * 
     *
     * @param {Object} geom
     * 
     * 
     */
    setGeomFilterField: function(geom) {
    	if (this.geomFilterField) {
    		this.geomFilterField.setValue(geom);
    	}
    	
    }
    
    /*
     * @method onQueryZoomOggetto
     * Esegue lo zoom all'elemento individuato da index all'interno del risultato della query.
     * TODO su ci ascolta il relativo evento
     *
     * @param {Number} index
     * index
     * 
     onQueryZoomOggetto: function (index){
     	var geoms   = document.getElementById("divQueryListaRisultati").geoms;
     	if (index || index == 0) {
     		zoomToExtent(geoms.geometries[index].boundingbox);
     	} else {
     		zoomToExtent(geoms.boundingbox);
     	}	
     }*/
});
