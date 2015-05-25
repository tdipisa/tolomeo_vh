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
 * @class TolomeoExt.ToloScaleComboExt
 * @extends Ext.form.ComboBox
 * Una combo box che consente di scegliere la scala della mappa
 *
 */ 
Ext.define('TolomeoExt.ToloScaleComboExt', {

	extend: 'Ext.form.ComboBox',
 
	/** 
	 * @property {Number} [width=180]
	 * 
	 * 
	 */
	width:180,
	
	/** 
	 * @property {Number} [labelWidth=60]
	 * 
	 * 
	 */
	labelWidth:60,

	/** 
	 * @property {String} [listClass='scaleListCss']
	 * 
	 * 
	 */
	formItemCls:'scaleListCss' , 
	
	/*
	 * @property {String} [listClass='scaleListCss']
	 * 
	 * 
	 */
	// listClass: 'scaleListCss' , 

	/** 
	 * @property {Boolean} [forceSelection=false]
	 * false, per non forzare la scelta dalla lista
	 * 
	 */
	forceSelection: false, 

	/** 
	 * @property {String} [fieldLabel='Scala ']
	 * 
	 * 
	 */
	fieldLabel:'Scala ',

	/** 
	 * @property {String} [labelSeparator='=']
	 * 
	 * 
	 */
	labelSeparator : '=',

	/** 
	 * @property {String} [labelStyle='font-weight:bold;text-align:right;width:60px;']
	 * 
	 * 
	 */
	labelStyle: 'font-weight:bold;text-align:right;width:60px;',

	/** 
	 * @property {String} [listAlign='bl-tl']
	 * 
	 * 
	 */
	listAlign: 'bl-tl',

	/** 
	 * @property {RegExp} [maskRe=/\d/]
	 * 
	 * 
	 */
	maskRe:/\d/,     

	/** 
	 * @property {String} [triggerAction='all']
	 * 
	 * 
	 */
	triggerAction: 'all',

	/** 
	 * @property {String} [emptyText='']
	 * 
	 * 
	 */
	emptyText: '',

	/** 
	 * @property {Boolean} [selectOnFocus=true]
	 * 
	 * 
	 */
	selectOnFocus: true,
	
	/** 
	 * @property {String} [displayTpl='<tpl for=".">1 : {[Ext.util.Format.number(parseInt(values.scaleValue),"0,000")]}</tpl>']
	 * 
	 * 
	 */
	displayTpl:'<tpl for=".">1 : {[Ext.util.Format.number(parseInt(values.scaleValue),"0,000")]}</tpl>',
        
	/** 
	 * @property {Object} listConfig
	 * 
	 * 
	 */
    listConfig: {
        // Custom rendering template for each item
        getInnerTpl: function() {    
            //return '1 : {[Ext.util.Format.number(parseInt(values.scaleValue),"0,000")]}';
        	
        	 return '{[values.custom ? "<span style=\\"color:red;\\">1 : " + Ext.util.Format.number(parseInt(values.scaleValue),"0,000") + "</span>": "1 : " + Ext.util.Format.number(parseInt(values.scaleValue),"0,000")]}';
        }
    },

	/*
	 * @property {Boolean} [editable=false]
	 * 
	 * 
	 */
    //editable : false,
    
	/*
	 * @property {Boolean} [forceSelection=true]
	 * 
	 * 
	 */
    //forceSelection : true,
    
	/*
	 * @property {Boolean} [hideTrigger=false]
	 * 
	 * 
	 */
    //hideTrigger:false,
    	
	/** 
	 * @property {String} [valueField='scaleValue']
	 * 
	 * 
	 */
	valueField: 'scaleValue',

	/** 
	 * @property {String} [displayField='scaleDescr']
	 * 
	 * 
	 */
	displayField: 'scaleDescr',

	/** 
	 * @property {Boolean} [enableKeyEvents=true]
	 * 
	 * 
	 */
	enableKeyEvents: true,
	
	/** 
	 * @property {String} [queryMode='local']
	 * 
	 * 
	 */
	queryMode: 'local',
	
	/** 
	 * @property {Object} listeners
	 * 
	 * 
	 */
	listeners : {
		
	    select: {
	        fn: function(){
	            this.notifyChange(this.getValue());
	            return false;
	        }
	    },	   	   
	    
	    specialkey: {	    	
	       fn: function(cb, e){
	       		var me = this;
	          	if (e.getKey() == e.ENTER) {	              	              
	              // if record is not present in the store we add it temporary to store to make manage the value at the combobox  	          	 
	          		var v = cb.getValue();	 	          		
			        cb.forceValue(v);
	             	cb.notifyChange(v);
	             	return false;
	          	}
	       }
	     },
	    
	     afterRender: {
	        fn: function() {
	            var me = this;                    
	            // Also if editable allows opening the picker by clicking the field
	            if (this.editable) {
	                 me.mon(me.inputEl, 'click', me.onTriggerClick, me);
	            }
	        }
	     },
	     
	     click: {
	     	fn: function(e){
	     		e.stopEvent();
	     	}
	     }
	},

	/**
	 * @method initComponent
	 * Crea un nuovo TolomeoExt.ToloScaleComboExt.
	 * 
	 */		
	initComponent: function() {
		
    	// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
	
	    this.addEvents('scalechange');	    
		       
/*
	    this.plugins = [ new Ext.DomObserver({
          click: function(evt, comp) {
              comp.onLoad.defer(10,this);  
              comp.setRawValue(comp.getValue());    
              comp.selectByValue(comp.getValue());              
              comp.selectText();
          }
        })];	    
*/
        this.callParent(arguments);	
    
		Ext.util.CSS.createStyleSheet('.scaleListCss{text-align: right;}','scaleListCss');

	},
			
	/**
	 * @method cleanValue
	 * Clean the value of the scale from bad character
	 * 
	 * @param {String} val
	 * val.
	 * 
	 */
	cleanValue : function(val){
	    return (""+val).replace(/^(\s*1\s*:)?|[^0-9]/g,'');
	},
	  
	/**
	 * @method notifyChange
	 * Private method to notify a scale change
	 * 
	 * @param {String} val
	 * value
	 * 
	 */
	notifyChange : function(val){		
	    this.fireEvent('scalechange', this.cleanValue(val));	
	},
	
	/*
	 * @method forceValue
	 * Call this method to set the scale value desired
	 * 
	 * @param {Object} val
	 * 
	 * 
	forceValue : function(val){
        var v = parseInt(this.cleanValue(val)); 
        
        this.resetFilter();
        
        if(this.findRecordByValue(v)){
            this.select(v);
        } else {            
            var scaleStore = this.getStore();
            scaleStore.add({scaleValue : v, scaleDescr : '' + v});
            var r = this.findRecordByValue(v);
            this.setValue(v);
            scaleStore.rejectChanges();
            
        }
    },
    */
	
	/**
	 * @method forceValue
	 * Call this method to set the scale value desired
	 * 
	 * @param {Object} val
	 * 
	 * 
	 */
	forceValue : function(val){
		
            var v = parseInt(this.cleanValue(val)); 
            var scaleStore = this.getStore();
            
            this.resetFilter();
            var f = this.findRecordByValue(v);            
             
            if(f){                
                this.select(v);
                /*
                if(!f.get('custom')){
                    scaleStore.rejectChanges();
                }
                */
            } else {   
                scaleStore.rejectChanges();
                scaleStore.add({scaleValue : v, scaleDescr : '' + v, custom : true});
                var r = this.findRecordByValue(v);
                this.setValue(v);
                //scaleStore.rejectChanges();                
            }
        },
    
    /**
	   * @method resetFilter
	   * Clean the query filter to have the complete list of items
	   * 
  	 */
    resetFilter : function(){
    	var st = this.getStore();	          		
  		var filter = this.queryFilter;
  		
        // If filtered on typed value, unfilter.
        if (filter && !filter.disabled) {
            filter.disabled = true;
            st.filter();
        }	    
    }
});
 
