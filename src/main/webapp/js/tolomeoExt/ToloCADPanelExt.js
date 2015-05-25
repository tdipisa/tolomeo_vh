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
 * 
 * @class TolomeoExt.ToloCADPanelExt
 * @extends Ext.Window
 * 
 * 
 */
Ext.define('TolomeoExt.ToloCADPanelExt', {
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
	 * @property {Number} [width=380]
	 * 
	 * 
	 */
	width: 390,
	
	/**
	 * @property {Boolean} [collapsible=true]
	 * 
	 */
	collapsible: true,	
		
	/**
	 * @method initComponent
	 * Create a new TolomeoExt.ToloCADPanelExt
	 * 
	 */	
	initComponent: function() {
		
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		this.callParent(arguments);
			
		this.title = 'CAD - console';
		var me = this;
		// 
		this.addEvents('pressSetCommand');
		this.addEvents('changeAngleSetting');	
		this.addEvents('pressDeleteFirstLine');
		
		/*
		 * @method notifyCommandSetting
		 * Notifica l'impostazione di un comando CAD
		 * 
		 */ 
		this.notifyCommandSetting = function(){		
			var commandCmp = Ext.getCmp(this.getId()+'-command');
			//var commandCmp = this.cad.find("name","command")[0];
			this.fireEvent('pressSetCommand', "@" + commandCmp.getValue());
			commandCmp.setValue("");
			this.selectAndFocus();
		}
		
		/*
		 * @method notifyAngleSetting
		 * Notifica l'impostazione dell'angolo
		 *
		 * @param {Object} radioGrp
		 * il gruppo di radio button.
		 * 
		 * @param {Object} radio
		 * il radio button.
		 * 
		 */ 
		this.notifyAngleSetting = function(radioGrp,radio){						
			this.fireEvent('changeAngleSetting', radio.getRawValue());	
			this.selectAndFocus();					
		}
		
		/*
		 * @method notifyDeleteFirstLine
		 * Notifica la richiesta di cancellazione della prima linea		
		 * 
		 */ 
		this.notifyDeleteFirstLine = function(){						
			this.fireEvent('pressDeleteFirstLine');
			this.selectAndFocus();						
		}
		
		/*
		 * @method selectAndFocus
		 * Imopsta il focus e seleziona il testo sul input text del comando.	
		 * 
		 */ 
		this.selectAndFocus = function(){
			Ext.getCmp(this.getId()+'-command').focus();
			//this.cad.find("name","command")[0].focus();//.selectText();
		}
		
		this.helpWin;		
		this.cad = Ext.create('Ext.FormPanel',{	        
	        url:'#',
	        frame:true,
	        title: '',
	        //  bodyStyle:'padding:5px 5px 0',	        
	      	//  bodyStyle: 'padding:2px;',
	        //  width: 350,
	      	defaults: {
	      		labelWidth: 120
	      	},	      	
		    items: [{		    	
            	anchor: '98%',
	            xtype: 'textfield',	
	            labelSeparator : ' ',            	
                fieldLabel: 'prossimo punto : @',
                id: this.getId()+'-command',
	            name: 'command',
	            maskRe:/\d|<|,|\.|\-/,	
	            regex: /^((<(\-)?\d+(\.\d+)?)|(,(\-)?\d+(\.\d+)?)|((\-)?\d+(\.\d+)?((,|<)((\-)?\d+(\.\d+)?)?)?))$/,
	            allowBlank: true,
	            allowDecimals: true,
	            allowNegative: false,
	            listeners: {
	                specialkey: function(field, e){
	                    if (e.getKey() == e.ENTER) {
	                    	this.notifyCommandSetting();
	                    }
	                },
	                scope: this
	            },
		    },{
		    	xtype: 'radiogroup',
	            fieldLabel: 'relativo a',	            
	            listeners: {change:{fn:this.notifyAngleSetting,scope:this}},
	            items: [{
	                checked: true,
	                boxLabel: 'lato precedente',
	                name: 'relativeAngle',
	                inputValue: '1'
	            },{		                
	                boxLabel: 'orizzontale',
	                name: 'relativeAngle',
	                inputValue: '0'
	            }]		           
		    }],
	        buttons: [{
	            text: 'Imposta',
	            type: 'submit',
	            handler: this.notifyCommandSetting,
				scope: this
	        },{
	            text: 'Cancella prima linea',
	            type: 'submit',
	            handler: this.notifyDeleteFirstLine,
				scope: this
	        }],
	        
	        keys: [{
	        	key: [Ext.EventObject.ENTER], 
             	handler: this.notifyCommandSetting,
                scope: this
             }]  	        
	    });
			    	    
		this.add(this.cad);
		this.tools = [{
			id : 'help', // 6
			handler : function() {
			// create the window on the first click and reuse on subsequent clicks
		        if(!this.helpWin){
		            this.helpWin = Ext.create('Ext.Window',{
		                layout:'fit',
		                width:500,
		                height: 500,		                
		                title: 'CAD - Help',	
		                closeAction: 'hide',
		                		
		                items: Ext.create('Ext.Panel',{
		                    deferredRender:false,
		                    autoScroll: true,		                    		                    
		                    bodyStyle: 'padding:10px;font-size:12px;line-height:150%',
		    				frame: false,
		    				border: false,
		    				plain: true,
		                    html: '<h1><u>Comandi CAD</u></h1><br>'+
		                    	  '<h2>Solo modulo</h2>'+
		                    	  '<p>Inserire solamente un numero che rappresenti il modulo. In questo caso sar&agrave; bloccata la distanza dal punto precedente.'+
		                    	  '<br><b>Esempio :</b> <code>@10.5</code></p><br>'+
		                    	  '<h2>Modulo + Angolo</h2>'+
		                    	  '<p>Inserire un numero che rappresenti il modulo, il carattere "&lt;" e l\'angolo in gradi. In questo caso il punto verr&agrave; inserito automaticamente.'+
		                    	  '<br><b>Esempio :</b> <code>@10.5&lt;45</code></p><br>'+
		                    	  '<h2>Solo X</h2>'+
		                    	  '<p>Inserire un numero che rappresenti l\'ascissa seguita da una virgola (","). In questo caso la X del prossimo punto &egrave; vincolata.'+
		                    	  '<br><b>Esempio :</b> <code>@8,</code></p><br>'+
		                    	  '<h2>Solo Y</h2>'+
		                    	  '<p>Inserire un numero che rappresenti l\'ordinata preceduta da una virgola (","). In questo caso la Y del prossimo punto &egrave; vincolata.'+
		                    	  '<br><b>Esempio :</b> <code>@,8</code></p><br>'+
		                    	  '<h2>X + Y</h2>'+
		                    	  '<p>Inserire due numeri che rappresentino l\'ascissa e l\'ordinata del prossimo punto. In questo caso il punto verr&agrave; inserito automaticamente.'+
		                    	  '<br><b>Esempio :</b> <code>@6.5,8</code></p><br>'+
		                    	  '<h2>Fine inserimento</h2>'+
		                    	  '<p>L\'invio di un comando vuoto o l\'utilizzo di [ctrl + invio] terminano l\'inserimento, non aggiungendo alcun punto nuovo.<br>' +
		                    	  'Anche il doppio click del mouse termina l\'inserimento, ma aggiungendo un nuovo punto dove si &egrave; eseguito il doppio click.</p><br>'+
		                    	  '<h2>Annulla</h2>'+
		                    	  '<p>Il tasto [canc] annulla l\'inserimento dell\'ultimo punto o dell\'ultimo vincolo inseriti.</p><br>'
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
}
}];
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
	},

	/**
	 * @method hide
	 * Nasconde il pannello CAD e e resetta il comando
	 * 
	 */ 
	hide: function () {	
		Ext.getCmp(this.getId()+'-command').setValue("");
		//this.cad.find("name","command")[0].setValue("");
		this.callParent(arguments);
	},

	
	/**
	 * @method bindToViewerPanel
	 * Imposta i gestori degli eventi di interesse lanciati dal viewer
	 *
	 * @param {Object} viewer
	 * visualizzatore della mappa
	 * 
	 */ 
	bindToViewerPanel: function(viewer) {
		if (viewer!=null) {
			// Registrazione in viewerPanel
			viewer.on('onDrawFirstPointByCAD', this.show, this );
			viewer.on('onDigitizePolygonByCADEnd',this.hide, this);
			viewer.on('onDigitizeLineByCADEnd',this.hide, this);
			viewer.on('onDigitizePointByCADEnd',this.hide, this);
		}
	}
			
});
 