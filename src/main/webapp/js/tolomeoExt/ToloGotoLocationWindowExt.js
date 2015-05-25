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
 * @class TolomeoExt.ToloGotoLocationWindowExt
 * @extends Ext.Window
 * 
 * 
 */
Ext.define('TolomeoExt.ToloGotoLocationWindowExt', {
		
	extend: 'Ext.Window',
	/** 
	 * @property {Boolean} [closable=false]
	 * 
	 * 
	 */
	closable: false,
	
	/** 
	 * @property {Boolean} [bodyBorder=false]
	 * 
	 * 
	 */
	bodyBorder: false,
	
	/** 
	 * @property {Boolean} [border=false]
	 * 
	 * 
	 */
	border: false,
	
	/** 
	 * @property {Boolean} [frame=true]
	 * 
	 * 
	 */
	frame: true,
	
	/** 
	 * @property {Boolean} [resizable=false]
	 * 
	 */
	resizable: false,
	
	/** 
	 * @property {Boolean} [constraint=true]
	 * 
	 */
	constraint: true,
	
	/*
	 * @property {Boolean} [monitorResize=true]
	 * 
	 * 
	 */
	//monitorResize: true,
	
	/** 
	 * @property {Number} [width=370]
	 * 
	 */
	width: 370,
	
	/**
	 * @property {Boolean} [collapsible=false]
	 * 
	 */
	collapsible: false,	
	
	/**
	 * @property {Object} [projectionCrs={}]
	 * 
	 */
	projectionCrs : {},
	
	/**
	 * @property {String} projectionCode
	 * 
	 */
	projectionCode: null,
	
	/*
	 * @property {String} [cls=clearCSS]
	 * 
	 */
	//cls: 'clearCSS',
		
	/**
	 * @method initComponent
	 * Create a new TolomeoExt.ToloGotoLocationWindowExt
	 * 
	 */	
	initComponent: function() {
		
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		this.callParent(arguments);
		this.title = 'Vai alla posizione';
		this.addEvents('gotoLocation');	
		
		var thisGotoLoc = this;
		
		/**
		 * @method splitValue
		 * Divide i valori su x ed y se entrambi sono stati messi divisi da virgola in x.
		 * 
		 */
		var splitValue = function(){	
		
			var coordXCmp = Ext.getCmp(thisGotoLoc.getId()+"-coordX");  	//this.find("name","coordX")[0];		
			if(coordXCmp.isValid()){
				var xValue = coordXCmp.getValue();			
				if(xValue.indexOf(",") != -1){
					var xy = xValue.split(",");
					var coordYCmp =Ext.getCmp(thisGotoLoc.getId()+"-coordY"); // this.find("name","coordY")[0];
					coordXCmp.setValue(xy[0]);
					coordYCmp.setValue(xy[1]);
				}
			}					
		}
		
		var notifyGotoLocation = function(){
			
			splitValue.call(thisGotoLoc);
			
			var coordXCmp = Ext.getCmp(thisGotoLoc.getId()+"-coordX"); // this.goToLoc.find("name","coordX")[0];
			var coordYCmp = Ext.getCmp(thisGotoLoc.getId()+"-coordY"); //this.goToLoc.find("name","coordY")[0];		
			
			if(!coordXCmp.isValid()){
				Ext.Msg.alert('Attenzione', 'Il valore inserito per il campo X non &egrave; valido');
				return;
			}
			
			if(Ext.isEmpty(coordYCmp.getValue())){
				Ext.Msg.alert('Attenzione', 'Il campo Y deve essere valorizzato');
				return;
			}
			
			if(!coordYCmp.isValid()){
				Ext.Msg.alert('Attenzione', 'Il valore inserito per il campo Y non &egrave; valido');
				return;
			}
			
			var xValue = coordXCmp.getValue();
			var yValue = coordYCmp.getValue();			
			var crs = Ext.getCmp(thisGotoLoc.getId()+"-crs").getValue(); //this.goToLoc.find("name","crs")[0].getValue();
			
			this.fireEvent('gotoLocation', xValue, yValue, crs);
			coordXCmp.setValue("");
			coordYCmp.setValue("");
			this.hide();				
		}
						
		var myData = new Array();		      
		      
		for(var i in this.projectionCrs){         
			if(this.projectionCode && this.projectionCode == i) {
				myData.unshift([i,this.projectionCrs[i].description,'(Attuale)']); 
			} else {
				myData.push([i,this.projectionCrs[i].description,'']);            
			}
	    }
	    
	    if(!this.projectionCode) this.projectionCode = myData[0][0];
		  
	    var myStore = new Ext.data.ArrayStore({
	         fields: [
	           'code',
	           'description',
	           'extraInfo'
	         ],
	         data : myData
	    });
    
		this.goToLoc = Ext.create('Ext.form.Panel',{
	        labelWidth: 30, // label settings here cascade unless overridden
	     	labelAlign: 'left',	     	
	        url:'#',
	        frame:true,
	        title: '',
	        //defaultType: 'textfield',
		    items: [{            	
	            xtype: 'label',	
	            html: 'Immettere le coordinate nei relativi campi o nel solo campo X separate da virgola<hr>' 
		    },{
		    	xtype: 'container',
		    	layout: 'hbox',
            	frame: false,	
            	//xtype: 'fieldset',
	            items:[{
	                flex: 1,
                    xtype: 'textfield',
		            padding: '5 5 5 0',
		            labelStyle: 'font-weight: bold;',
		            labelWidth: 30,
		            labelSeparator : ' ',            	
	                fieldLabel: 'X : ',
	                id: this.getId()+'-coordX',
		            name: 'coordX',
		            maskRe:/\d|,|\.|\-|\+/,	
		            regex: /^(\-|\+)?\d+(\.\d+)?(,(\-|\+)?\d+(\.\d+)?)?$/,
		            allowBlank: false,
		            allowDecimals: true,
		            allowNegative: true,
		            listeners: {blur:  {fn: splitValue, scope: thisGotoLoc}}
	            },{
	                flex: 1,
	                anchor:'95%',
                    xtype: 'textfield',
                    padding: '5 5 5 5',
                    labelStyle: 'font-weight: bold;',
                    labelWidth: 20,
		            labelSeparator : ' ',            	
	                fieldLabel: 'Y : ',
	                id: this.getId()+'-coordY',
		            name: 'coordY',
		            maskRe:/\d|\.|\-|\+/,	
		            regex: /^(\-|\+)?\d+(\.\d+)?$/,
		            allowBlank: true,
		            allowDecimals: true,
		            allowNegative: true,
		            anchor: '-5'
	           
	            }]
        	},
        	new Ext.form.ComboBox({
		    	labelStyle: 'font-weight: bold;',
		    	labelWidth: 30,
		    	id: this.getId()+'-crs',
		    	name: 'crs',
		        store: myStore,
		        //width: 270,
		        displayField:'code',
		        valueField: 'code',
		        fieldLabel:'CRS',        
		        hideTrigger:false,
				lazyInit: false,
				//typeAhead: true,
			    triggerAction: 'all',
			    lazyRender:true,
			    mode: 'local',
				forceSelection: true,
				autoSelect: true,
				listConfig: {
				    itemTpl: "<b><u>{code}</u></b> {extraInfo}<br>{description}"
				
				},
		        anchor: '-5',
		        value: this.projectionCode
		    })],
	        buttons: [{
	            text: 'Vai',
	            type: 'submit',
	            handler: notifyGotoLocation,
				scope: this
	        }],
	        
	        keys: [{
	        	key: [Ext.EventObject.ENTER], 
             	handler: notifyGotoLocation,
                scope: this
             }]  	        
	    });
		    	    
		this.add(this.goToLoc);
		this.doLayout();
	},
	
	/**
	 * @method centerTo
	 * Centra rispetto all'elemnto passto (viewer ad esempio)
	 * o rispetto al container se non viene passato l'elemento.
	 * 
	 * @param {Object} el
	 * 
	 * 
	 */	
	centerTo: function(el){
		el = Ext.get(el);                
		if(!el || !el.dom){            
			el = this.container;        
		}				
		var xy = this.getEl().getAlignToXY(el, 'c-c');        
  		this.setPagePosition(xy[0], xy[1]);
	}
					
});
