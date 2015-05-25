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


Ext.define('TolomeoExt.ToloWMSExplorerPanel', {

	extend: 'Ext.Panel',
	
	paramsJS: null,
	
/*	constructor: function(config) {
		
		config.layout = 'fit';


		Ext.create('Ext.data.Store', {
		    storeId:'simpsonsStore',
		    fields:['name', 'email', 'phone'],
		    data:{'items':[
		        { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
		        { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
		        { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
		        { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
		    ]},
		    proxy: {
		        type: 'memory',
		        reader: {
		            type: 'json',
		            root: 'items'
		        }
		    }
		});

		this.grid = Ext.create('Ext.grid.Panel', {
							title: 'Simpsons',
							store: Ext.data.StoreManager.lookup('simpsonsStore'),
							columns: [
							    { text: 'Name',  dataIndex: 'name' },
							    { text: 'Email', dataIndex: 'email', flex: 1 },
							    { text: 'Phone', dataIndex: 'phone' }
							    ]
							    //height: 200,
							    //width: 400
							});
		
		this.config.items = [this.grid];

		this.callParent(arguments);
		
	},
	*/
	initComponent: function(){
		//Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);	
		/*
		this.layout= {
	        type: 'vbox',
	        align: 'center'
	    };
		*/
		
		var me = this;
		this.frame = false;
		this.border = false;
		
		this.layout = 'border';
		/*
		this.bbar = [
			  { xtype: 'button', text: 'Button 1' }
			];
		*/
		
		/**
		 * @event addLayer
		 * Lanciato quando viene premuto il tasto "Aggiungi layer"
		 * Viene passato array  così composto
		 * [{ url: url del wms, name: nome del layer }.... ]
		 */
		this.addEvents('addLayer');
		
		/**
		 * @event closePressed
		 * Lanciato quando viene premuto il tasto "Chiudi"
		 */
		this.addEvents('closePressed');
		
		this.buttonAlign = 'center';
		
		this.btnAddLayer = Ext.create('Ext.Button',{
								text: 'Aggiungi',
								handler: function() {
									var selected = me.grid.getView().getSelectionModel().getSelection();
									var retVal = [];
									var url = me.cmbServerList.getValue(); 
									for (var i=0; i< selected.length; i++) {
										var l = { url: url,
												  name: selected[i].get('name') };
										retVal.push(l);
									}
									me.fireEvent('addLayer', retVal );
								}
		});
		
		this.buttons = [
			  this.btnAddLayer, //, margin: '0 10 5 0' 
			  { text: 'Chiudi',
			    handler: function() {
			    		me.fireEvent('closePressed');
			    	}
			    }
			];
		/*
		this.dockedItems = [{
			    xtype: 'panel',
			    dock: 'bottom',
			    items: [
			        { xtype: 'button', text: 'Button 1' }
			    ]
			}]
		*/

		this.callParent(arguments);
		
		var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(null, this.TOLOMEOServer + this.TOLOMEOContext + '/AjaxWMSExplorerServlet');
		
		/*proxy.extraParams= {
	       		format:"ext",
	        	idCampo: i,
	        	SRID: this.paramsJS.mappe.SRID,
	        	withGeom: this.suggestWithGeom
	        };*/
			
		var ds = Ext.create('Ext.data.JsonStore',{
		        proxy: proxy
				//autoLoad: true
		        /*idCampo: i,
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
				}*/
			});
		var a = new TolomeoExt.ToloCrossAjax();
		proxy.on('exception', a.storeException);
		
		var data = (this.paramsJS.layOut.WMSExplorer.serverWMSList) ? this.paramsJS.layOut.WMSExplorer.serverWMSList : [] ;
		
		if (this.paramsJS.layOut.WMSExplorer.includeMapServers) {
			// Aggiunge i server della mappa
			var s = this.paramsJS.serverPool.serverList;
			
			for (var i=0; i<s.length; i++) {
				var serv = s[i];
				if (serv.showInWMSExplorer) {
					data.push ({nome: serv.nome, url: serv.url});
				}
			}
		}
		
		var serverStore = Ext.create('Ext.data.Store', {
		    fields: ['nome', 'url'],
		    data : data
		});

		this.cmbServerList = Ext.create('Ext.form.ComboBox', {
		    fieldLabel: 'Scelta server',
		    emptyText: 'Scegli o inserisci server....',
		    //forceSelection: true,
		    labelWidth: 75,
		    store: serverStore,
		    queryMode: 'local',
		    displayField: 'nome',
		    valueField: 'url',
		    //name: 'serverUrl',
			listConfig: {
				    itemTpl: "<b><u>{nome}</u></b><br />{url}"
				},
			prevValue: null,
			changeServer: function() {
				if (this.prevValue==null || this.prevValue!=this.getValue()) {
					ds.load({params: { serverUrl: this.getValue() }});
					this.prevValue = this.getValue();
     			}
			},
    		listeners:{
         		'select': function() {
		         			this.changeServer();
         				  },
         		'blur': function() {
         					this.changeServer();
         				},
         		specialkey: function(field, e){
	                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
	                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
	                    if (e.getKey() == e.ENTER) {
	                        //var form = field.up('form').getForm();
	                        //form.submit();
	                    	this.changeServer();
	                    }
                	}
    			}
			});
			
		this.filterPanel = Ext.create('Ext.form.Panel', {
											//title: 'Filtro',
											bodyPadding: 10,
											layout: 'anchor',
										    defaults: {
										        anchor: '100%'
										    },
											collapsible: false,
											collapsed: false,
											frame: false,
											region: 'north',
											height: 70,
											items: [this.cmbServerList,
													{
														xtype: 'trigger',
														triggerCls : Ext.baseCSSPrefix + 'form-search-trigger',
														fieldLabel: 'Filtro',
														labelWidth: 40,
													    onTriggerClick: function() {
													        //Ext.Msg.alert('Status', 'You clicked my trigger!'+this.getValue());
													        me.applicaFiltro(this.getValue());
													    }
													}]
											
											});
		
											
		this.add(this.filterPanel);											
											
		/*
		Ext.create('Ext.data.Store', {
		    storeId:'simpsonsStore',
		    fields:['name', 'email', 'phone'],
		    data:{'items':[
		        { 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
		        { 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
		        { 'name': 'Homer', "email":"home@simpsons.com",  "phone":"555-222-1244"  },
		        { 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
		    ]},
		    proxy: {
		        type: 'memory',
		        reader: {
		            type: 'json',
		            root: 'items'
		        }
		    }
		});
*/
		this.grid = Ext.create('Ext.grid.Panel', {
							region: 'center',
							frame: false,
							store: ds,
							enableTextSelection: true,
							columns: [
							    { 	text: 'Titolo', 
							    	dataIndex: 'title',
							    	renderer: function(value, metadata) {
											        metadata.style = 'white-space: normal;';
											         return value;
											 }
							    },
							    { 	text: 'Descrizione', 
							    	dataIndex: 'abstract', 
							    	flex: 4,
							    	renderer: function(value, metadata) {
											        metadata.style = 'white-space: normal;';
											         return value;
											 }
 								},
							    { text: 'Scala max',  dataIndex: 'maxscaledenom', flex:1, renderer: function(value, metadata) { if (value && value!="") return Math.round(value); else return "";} },
							    { text: 'Scala min',  dataIndex: 'minscaledenom', flex:1, renderer: function(value, metadata) { if (value && value!="") return Math.round(value); else return "";} }
							    ]	/*,
							    
							dockedItems: [{
							    xtype: 'pagingtoolbar',
						        store: ds,   // same store GridPanel is using
						        dock: 'bottom',
						        displayInfo: true
						    	}]*/
							});

		this.grid.getView().getSelectionModel().on('selectionchange', 
					function( selModel, selected, eOpts) {
											me.btnAddLayer.setDisabled(selected.length==0);
		});
							    										
							
		this.add(this.grid);
		
			
	}, 
	
	applicaFiltro: function(valore) {
		valore=valore.toUpperCase();
		var filter = new Ext.util.Filter({
			    filterFn: function(item) {
			        return (item.get('name').toUpperCase().indexOf(valore)!=-1) ||
			        	   (item.get('abstract').toUpperCase().indexOf(valore)!=-1) || 
			        	   (item.get('title').toUpperCase().indexOf(valore)!=-1);
			    }
			});
		
		this.grid.store.clearFilter();
		this.grid.store.addFilter(filter);
		
	}
	
});