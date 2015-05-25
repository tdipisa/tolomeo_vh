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
 * @class TolomeoExt.ToloPointFromRefPanelExt
 * @extends Ext.Window
 * 
 * 
 */
Ext.define('TolomeoExt.ToloPointFromRefPanelExt', {
	
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
	 * 
	 */
	resizable: false,
	
	/**
	 * @property {Boolean} [constraint=true]
	 * 
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
	 * @property {Number} [width=280]
	 * 
	 * 
	 */
	width: 280,
	
	/**
	 * @property {Boolean} [collapsible=true]
	 * 
	 * 
	 */
	collapsible: true,
	
	/*
	 * @property {String} [bodyStyle='background-color:white;']
	 * 
	 * 
	 */
	//bodyStyle: 'background-color:white;',
		
	/**
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function() {
		
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		
		this.callParent(arguments);
		this.title = 'Punto da riferimento';
		this.addEvents('pressSetDistance');
		this.notifyDistanceSetting = function(){		
			var distance = this.getCmp(this.getId()+"-distanceFromRef").getValue(); //this.pfr.find("name","distanceFromRef")[0].getValue();
		    distance = (""+distance).replace(",",".");			
		    if (!distance || isNaN(distance)) {
				Ext.Msg.alert("Alert","E'necessario impostare una distanza valida!");
				return;
			}				    
			this.fireEvent('pressSetDistance', distance);
		}
		
		this.selectAndFocus = function(){			
			this.getCmp(this.getId()+"-distanceFromRef").focus().selectText();    //this.pfr.find("name","distanceFromRef")[0].focus().selectText();
		}
		this.helpWin;
		this.pfr = new Ext.FormPanel({
	        labelWidth: 110, // label settings here cascade unless overridden
	        url:'#',
	        frame:true,
	        title: '',
	      //  bodyStyle:'padding:5px 5px 0',
	        
	      	bodyStyle: 'padding:2px;',
	       // width: 350,
	      	
	        items: [{
	            xtype: 'numberfield',	            	
                fieldLabel: 'Distanza dal punto',
                id: this.getId()+'-distanceFromRef',
	            name: 'distanceFromRef',
	            allowBlank: true,
	            allowDecimals: true,
	            allowNegative: false
		            
	        }
	        /*
	        ,{
	        	xtype: 'displayfield', 
	        	fieldLabel: 'Distanza attuale', 
	        	value: 'prova',
	        	name: 'currenteDistanceFromRef',
	        	id: 'currentDistanceFromRef'
	        }
	        */],
	        buttons: [{
	            text: 'Imposta',
	            type: 'submit',
	            handler: this.notifyDistanceSetting,
				scope: this
	        },{
	        	minWidth: 20,
	            text: ' ? ',
	            type: 'submit',
	            handler:  function(){
		        // create the window on the first click and reuse on subsequent clicks
		        if(!this.helpWin){
		            this.helpWin = new Ext.Window({
		                layout:'fit',
		                width:500,
		                autoHeight: true,
		                title: 'Punto da riferimento - Help',
		                //plain: true,
		                		
		                items: new Ext.Panel({
		                    deferredRender:false,
		                    border:false,
		                    html:'<h1><u>"Punto da Riferimento"</u></h1><br>'+
		                          '<h2><i>Descrizione</i></h2><br>'+
		                    	  '<p>Con questa utilit&agrave; &egrave; possibile inserire un punto che sia ad una determinata distanza da un altro punto preso come riferimento.' +
		                    	  ' Cliccando con il mouse si imposta il punto di riferimento e tramite la maschera o lo stesso mouse si fissa la distanza. '+
		                    	  ' Il consecutivo click del mouse fisser&agrave; il punto da inserire.</p><br><br>'+
		                    	  '<h2><i>Comandi</i></h2><br>'+
		                    	  '<h3>Canc</h3>'+
		                    	  '<p>Annulla l\'ulitma operazione fatta:</p>'+
		                    	  '<ul><li>- Elimina il vincolo della distanza se questa &egrave; impostata.</li><li>- Cancella il punto di riferimento se fissato.</li></ul>'		                    	 	                    	
		                }),		
		                buttons: [{
		                    text: 'Close',
		                    handler: function(){
		                        this.helpWin.hide();
		                    },
		                    scope: this
		                }]
		            });
		        }
		        this.helpWin.show(this);
		    },
				scope: this
	        }],
	        
	        keys: [{
	        	key: [Ext.EventObject.ENTER], 
             	handler: this.notifyDistanceSetting,
                scope: this
             }]  	        
	    });
			    	    
		this.add(this.pfr);
		this.doLayout();
	},
	   
	/**
	 * @method show
	 * Mostra il pannello CAD e lo rimette nella posizione 0,0
	 * 
	 */ 
    show: function () {
		this.setPosition(0,0);
		this.callParent(arguments);
		this.selectAndFocus.defer(200,this);
		//this.displayDistance(0);
	},

	/**
	 * @method hide
	 * Nasconde il pannello CAD e e resetta il comando
	 * 
	 */ 
	hide: function () {
		this.getCmp(this.getId()+"-distanceFromRef").setValue(""); 
		//this.pfr.find("name","distanceFromRef")[0].setValue("");
		this.callParent(arguments);
		//this.displayDistance(0);
	},
	
/*
	displayDistance: function (distance) {
		Ext.getCmp('currentDistanceFromRef').setValue(Math.round(distance*100)/100);
		this.setVisible(true);
	},	
*/	

	/**
	 * @method bindToViewerPanel
	 * 
	 * 
	 * @param {Object} viewer
	 * 
	 * 
	 */ 
	bindToViewerPanel: function(viewer) {
		if (viewer!=null) {
			// Registrazione in viewerPanel
			viewer.on('onDrawFirstPointFromRef', this.show, this );
			viewer.on('onDigitizePointFromRefEnd', this.hide, this);
			//viewer.on('onDigitizePointFromRefCallback', function(){this.clear();this.hide();}, this);
			//viewer.on('onDrawDistanceFromRefChange', this.displayDistance, this);
		}
	}
			
});
