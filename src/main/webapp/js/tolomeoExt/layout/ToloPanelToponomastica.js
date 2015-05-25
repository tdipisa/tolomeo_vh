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
 * @class TolomeoExt.ToloPanelToponomastica
 * @extends Ext.Panel
 *
 */
Ext.define('TolomeoExt.ToloPanelToponomastica', {

	extend: 'Ext.Panel',
	alias:  'tx_ToloPanelToponomastica',
	alternateClassName: ['TolomeoExt.layout.ToloPanelToponomastica'],

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
	 * @property {Object} toolbar1
	 * 
	 * 
	 */
    toolbar1: null,
    
	/** 
	 * @property {Object} returnFields
	 * 
	 * 
	 */
    returnFields: null,
    
	/** 
	 * @property {Boolean} [suggestWithGeom=false]
	 * 
	 * 
	 */
    suggestWithGeom: false,
    
	/** 
	 * @property {TolomeoExt.ToloViewerOLPanel} mapPanel
	 * 
	 * 
	 */
    mapPanel: null, 
    
	/** 
	 * @property {Object} formPanelSearch
	 * 
	 * 
	 */
    formPanelSearch: null,
    
	/** 
	 * @property {TolomeoExt.ToloMapAPIExt} api1
	 * 
	 * 
	 */
    api1: null,
    
	/** 
	 * @property {Ext.form.ComboBox} fldVia
	 * 
	 * 
	 */
    fldVia:null,
    
	/** 
	 * @property {Ext.form.ComboBox} fldCivico
	 * 
	 * 
	 */
    fldCivico: null,
    
	/** 
	 * @property {Object} btnCerca
	 * 
	 * 
	 */
    btnCerca: null,
    
	/** 
	 * @property {Object} viewerConfig
	 * Configurazione che sarà utilizzata per il viewer.
	 * 
	 */
	viewerConfig: null,
	
	/** 
	 * @property {Number} [ente=1]
	 * 
	 * 
	 */
	ente: 1,
	
	/** 
	 * @property {String} [tipoRicerca='civico']
	 * 
	 * 
	 */
	tipoRicerca: 'civico',
    
	/**
	 * @method initComponent
	 * Metodo relativo alla gestione Ext.
	 * 
	 */
    initComponent: function(){
        
    	// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		// Applico i default
		var defaultReturnFields = {idTopo: "idTopo", descTopo: "descTopo"};
		if(this.tipoRicerca == "civico"){
			defaultReturnFields.idStrada = "idStrada";
			defaultReturnFields.codVia6 = "codVia6";
			defaultReturnFields.viaDL = "viaDL";
			defaultReturnFields.numCompleto = "numCompleto";			
		}
		
        TolomeoExt.applyIfEmpty(this, {
        	returnFields: defaultReturnFields,
            modal: true,
            bodyPadding: 5
		});
        
        this.addEvents('searchCancelled');
        this.addEvents('searchDoneOK');
        
        this.layout = {
        	type: 'anchor',
            padding: '5'
        }
        
        
        this.monitorResize=true;

        this.callParent(arguments);
        
        this.codTPNVie       = -510;
    	this.codTPNCivici    = -610;
        this.idRicercaVie    = 2;
    	this.idRicercaCivici = 1;

		//ricerca via
        var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/TopoSuggestServlet');
        if (this.tipoRicerca == 'via') {
        	proxy.extraParams = {campoRicerca1: this.ente, format: "ext", idCampo: 0, codTPN: this.codTPNVie, idRicerca: this.idRicercaVie, withGeom: this.suggestWithGeom};
	        var ds = new Ext.data.JsonStore({
	            proxy: proxy
	        });
        }
        if (this.tipoRicerca == 'civico') {
        	proxy.extraParams = {format: "ext", idCampo: 0, codTPN: this.codTPNCivici, idRicerca: this.idRicercaCivici, withGeom: this.suggestWithGeom};
	        var ds = new Ext.data.JsonStore({
	            proxy: proxy
	        });
        }
        
        var campoRicercaChiave0 = Ext.create('Ext.form.field.Hidden', {name: 'campoRicercaChiave0'});
		var campoRicercaChiave1 = Ext.create('Ext.form.field.Hidden', {name: 'campoRicercaChiave1'});
        
        this.fldVia = new Ext.form.ComboBox({
            fieldLabel: 'Via',
            name: 'campoRicerca0',
            forceSelection: true, 
            allowBlank: false,
            store: ds,
            displayField: 'descriptionSuggest0',

            triggerAction: 'all',
			selectOnFocus: true,
			
            queryParam: 'q',
            valueField: 'key',
            typeAhead: false,
            loadingText: 'Ricerca...',
            anchor: '-5',
            minChars: 3,
            hideTrigger:true,
            listeners: { 
            		//change: { fn: function() { 
            		//					me.suggestUpdate(suggestProvider, this);} },
		    			 select: { scope: this,
				        		   fn: function( combo, records, eOpts ) {
						       						campoRicercaChiave0.setValue(records[0].get('key'));	
						       						this.onChangeVia(combo, records[0],0);
						      					}
				        				}
		    			}
            // Per non validare esclusivamente la valorizzazione o meno del campo, ma il fatto che sia stato selezionato dalla lista
            /*
            validator: function(value){
				if(this.view && this.view.getSelectedRecords().length==1 && this.view.getSelectedRecords()[0].data.description == value) return true;
            	return true;
            }
	        */
        });
        
        var formItems = new Array();
        formItems.push(this.fldVia);
        
        formItems.push(campoRicercaChiave0);
        formItems.push(campoRicercaChiave1);
        
        //
       // this.fldVia.on('select', this.onChangeVia , this);
    
        /** @type TolomeoExt.ToloCrossAjaxUtil */
        var proxy1 = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/TopoSuggestServlet');
        proxy1.extraParams = {format: "ext", idCampo: 1, codTPN: this.codTPNCivici, idRicerca: this.idRicercaCivici, withGeom: this.suggestWithGeom};
        var ds1 = new Ext.data.JsonStore({
            proxy: proxy1
        });
        ds1.on('beforeLoad', function(/* Ext.data.Store */ st, options) {
        	
        	ds1.getProxy().extraParams = ds1.getProxy().extraParams || {};
			Ext.apply(ds1.getProxy().extraParams,{
				campoRicerca0: this.fldVia.getValue(),
				campoRicercaChiave0: campoRicercaChiave0.getValue()
			});
        	
        	//st.getProxy().extraParams = setBaseParam('campoRicerca0', this.fldVia.getValue());
        	options.params.campoRicerca0 = this.fldVia.getValue();
        	options.params.campoRicercaChiave0 = campoRicercaChiave0.getValue();
        }, this);
        
        if(this.tipoRicerca == 'civico'){
	        this.fldCivico = new Ext.form.ComboBox({
	            fieldLabel: 'Civico',
	            name: 'campoRicerca1',
	            store: ds1,
	            displayField:'descriptionSuggest1',
	            forceSelection: true, 
	            allowBlank: false,
	            queryParam: 'q',
	            valueField: 'key',
	            typeAhead: false,
	            minChars: 1,
	            loadingText: 'Ricerca...',
	            anchor: '-5',
	            name: 'campoRicerca1',
	            maskRe:/\d/,
	            hideTrigger: true,
	            // Per svuotare la cache dei numeri
	            listeners: {
			        beforequery: function(qe){
			            delete qe.combo.lastQuery;
			        }
			    }/*,	            
			    // Per non validare esclusivamente la valorizzazione o meno del campo, ma il fatto che sia stato selezionato dalla lista
	            validator: function(value){
	            	
					if(this.view && this.view.getSelectedRecords().length==1 && this.view.getSelectedRecords()[0].data["additionalFieldsnumCompleto"] == value) return true;
	            	return false;

	            }*/
			    ,validator: function(value){
	            	
					if(this.findRecordByDisplay(value)) return true;
	            	return true;

	            }
	        });
	        
	        this.fldCivico.on('select', 
	        	function( combo, records, eOpts ) {
					this.onChangeCivico(combo, records[0],0);
				}, this
			);	        
	        formItems.push(this.fldCivico);
        }
        
        this.btnCerca = new Ext.Button ({
            text: 'OK',
            formBind: true,
            type:'submit',
            handler: this.cerca,
            scope: this
        });
        
        this.btnCancel = new Ext.Button ({
            text: 'Annulla',
            formBind: false,
            type:'reset',
            handler: this.searchCancel,
            scope: this
        });
        
        this.btnMappa = new Ext.Button ({
            text: 'Mappa',
            formBind: false,
            type:'button',
            icon: '/commonintra2-0/img/cartografia.png',
            handler: this.apriMappa,
            scope: this,
            disabled: true
        });
        
        // FieldSet
        var fs= new Ext.form.FieldSet ( {
            checkboxToggle: false,
            monitorResize: true,            
            layout:'form',
            border: false,            
            defaultType: 'textfield',
            collapsed: false,
            items: formItems
        });
        
        var buttonsPanel = new Array();
        if (this.suggestWithGeom) buttonsPanel.push(this.btnMappa);
        buttonsPanel.push(this.btnCerca, this.btnCancel);
        
        // FormPanel
        this.formPanelSearch = new Ext.FormPanel({
        	anchor: '0',
        	height: 125,
            monitorValid: true, 
            monitorResize: true,
            labelWidth: 35,
            border: false,
            standardSubmit: false,
            defaultType: 'textfield',
            items: [fs],
            keys: {
                key: Ext.EventObject.ENTER,
                fn: this.cerca,
                scope: this
            },
            buttonAlign : 'right',
            buttons: buttonsPanel
        });
        
        this.add(this.formPanelSearch);  
        this.doLayout();
    },
    
    /**
     * @method apriMappa
     * Apre una mappa.
     * 
     */
	apriMappa: function() {
    	
    	var geoms = this.getCurrentAddressJSGeomArray();
    	var geom = null;
    	if ((geoms!=null) && (geoms.geometries.length==1)) {
            geom = geoms.geometries[0];
    	}    	
    	if(!this.isGeomExist(geom,true)){
    		return;
    	}
    	
		if (this.mapPanel==null) {
			
			if (this.ownerCt) { 
            	this.ownerCt.setSize(this.ownerCt.getWidth(), this.ownerCt.getHeight()+200);
            	this.ownerCt.doLayout();
            }
			
			this.toolbar1 = new TolomeoExt.ToloButtonPanelExt ({
                withLegenda: false,
                withQuery: false,
                withSeleziona: false,
                withLayerList: false,
                withIdentify: false,
                withNuovo: false,
                withUpdateAlfa: false,
                withAdd: false,
                withSubtract: false,
                withAddSub: false,
                withVertexEdit: false,
                withDragDrop: false,
                withDelete: false,
                paramsJS: this.paramsJS, 
                items: []
            });
			
			var cfg = Ext.apply({}, this.viewerConfig);
	    	
			this.mapPanel = new TolomeoExt.ToloViewerOLPanel(Ext.apply({},{
				anchor:'0 -125',
                xtype: "tx_toloviewerOLPanel",
                title: "Mappa",
                collapsible: false,
                collapsed: false,
                tbar: this.toolbar1,
                paramsJS: this.paramsJS
            }));               

            this.add(this.mapPanel);
            
            this.mapPanel.on('afterlayout', function() {
	            if (this.api1==null) {
	                this.api1 = new TolomeoExt.ToloMapAPIExt({
	                    paramsJS: this.paramsJS,
	                    viewer: this.mapPanel,
	                    buttonsPanel: this.toolbar1
	                });                 
	            }
	            	            
	            this.zoomToTopoObj(geom);	                           	
            }, this);

            this.doLayout();
		}
	},
	
    /**
     * @method zoomToTopoObj
     * 
     * 
     * @param {TolomeoExt.JSGeometryArray} jsGeomArr
     * jsGeomArr.
     * 
     */
	zoomToTopoObj: function(jsGeomArr){
		
		if(this.api1==null) return;		
		this.api1.addHighlighted(jsGeomArr);
    	this.api1.zoomToHighlighted();		
	},
	
	
    /**
     * @method isGeomExist
     * 
     * 
     * @param {TolomeoExt.JSGeometryArray} jsGeomArr
     * jsGeomArr.
     * 
     * @param {Boolean} alertMe
     * alertMe.
     * 
     */
	isGeomExist : function(jsGeomArr,alertMe){
		if (jsGeomArr.geometry==null || jsGeomArr.geometry=="") {
			if(alertMe){
				alert('Oggetto non posizionato sulla cartografia!');
			}
			return false;
        }
		return true;
	},
    
    /**
     * @method onChangeVia
     * 
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
    onChangeVia: function( combo,record,index){
        var jsGeoArr = new JSGeometryArray();
        jsGeoArr.FromStoreSingleRecord(record.data);
		var geom = jsGeoArr.geometries[0];
        if (this.api1!=null && jsGeoArr != null) {
        	if(this.isGeomExist(geom,true)){
        		this.zoomToTopoObj(geom);
        	}            
        }else{
        	if(this.isGeomExist(geom,false)){
        		this.btnMappa.enable();
        	}else{
        		this.btnMappa.disable();
        	}
        }
        
        if(this.tipoRicerca=='civico'){
        	this.fldCivico.reset();
        }
    },
    
    /**
     * @method onChangeCivico
     * 
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
    onChangeCivico:  function(combo, record, index){    	
        var jsGeoArr = new JSGeometryArray();
        jsGeoArr.FromStoreSingleRecord(record.data);
		var geom = jsGeoArr.geometries[0];
        if (this.api1!=null && jsGeoArr != null) {
        	if(this.isGeomExist(geom,true)){
        		this.zoomToTopoObj(geom);
        	}            
        }else{
        	if(this.isGeomExist(geom,false)){
        		this.btnMappa.enable();
        	}else{
        		this.btnMappa.disable();
        	}
        }
    },
    
    /**
     * @method searchCancel
     * 
     * 
     */
    searchCancel: function () {
        this.fireEvent('searchCancelled');
    },
    
    /**
     * @method getCurrentAddress
     * 
     * 
     * @return {String}
     * Restituisce l'indirizzo corrente.
     * 
     */
    getCurrentAddress: function() {
    	var retVal=null;
    	var v = null;
    	
    	//if (this.tipoRicerca == 'civico' && this.fldCivico && (this.fldCivico.view) && (this.fldCivico.view.getSelectedRecords().length==1)) {
    	if (this.tipoRicerca == 'civico' && this.fldCivico && (this.fldCivico.getValue())) {
    		v = this.fldCivico.getValue(); //this.fldCivico.view.getSelectedRecords()[0];
    		retVal = this.fldCivico.findRecord(this.fldCivico.valueField || this.fldCivico.displayField, v);
    	//} else if(/* this.tipoRicerca == 'via' && */ this.fldVia.view && this.fldVia.view.getSelectedRecords().length==1){
    	} else if(/* this.tipoRicerca == 'via' && */ this.fldVia.getValue()){
    		v = this.fldVia.getValue(); //this.fldVia.view.getSelectedRecords()[0];
    		retVal = this.fldVia.findRecord(this.fldVia.valueField || this.fldVia.displayField, v);
    	}
    	
    	return retVal;
    },
    
    /**
     * @method getCurrentAddressJSGeomArray
     * 
     * 
     * @return {TolomeoExt.JSGeometryArray}
     * 
     *  
     */
    getCurrentAddressJSGeomArray: function() {
    	var jsGeoArr = null;
    	
    	var rec = this.getCurrentAddress();
    	if (rec!=null) {
            jsGeoArr = new JSGeometryArray();
            jsGeoArr.FromStoreSingleRecord(rec.data);
    	}
    	
    	return jsGeoArr;
    },
        
    /**
     * @method cerca
     * 
     * 
     */
    cerca: function (){
    	var rec = this.getCurrentAddress();
    	if (rec!=null) {
            var jsGeoArr = this.getCurrentAddressJSGeomArray();
            jsGeoArr.FromStoreSingleRecord(rec.data);
            this.fireEvent('searchDoneOK',jsGeoArr, rec.data);
        
            rec.data.additionalFieldsidTopo   = rec.data.key;
            rec.data.additionalFieldsdescTopo = rec.data.description;
            
            if (this.returnFields) {
            	for(var fieldName in this.returnFields){
            		if(this.returnFields[fieldName]){
            			var domField = Ext.fly(this.returnFields[fieldName]);
            			if(domField) domField.dom.value =  rec.data["additionalFields"+fieldName];
            		}
            	}
            }
    	}        
    }
});

