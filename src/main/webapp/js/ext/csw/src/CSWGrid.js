/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWGrid
 * Widget che contiene i record CSW ricercati.
 * Utilizza il Plugin RowExpander. 
 *
 * Inherits from:
 * - <Ext.grid.GridPanel>
 */
  Ext.define('CSWGrid', {

	extend: 'Ext.grid.GridPanel',
	
	/**
	 * Property: config
	 * {object} Oggetto per la configurazione  componente. Vedere <config.js>
	 */
	config:null, 
	
	/**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
	/**
	 * Property: enableHDMenu
     * {boolean} se true viene aggiunto a ogni colonna un menu che permette l'ordinamento delle colonne.
	 */ 
	enableHdMenu : false,
	/**
	 * Property: height
     * {int} altezza del componente
	 */ 
	height:290, 
	/**
	 * Property: autoScroll
     * {boolean} se true permette la comparsa della barra di scorrimento se il contenuto eccede le dimensioni del componente
	 */ 
	autoScroll:true,
	
	/**
	 * Property: title
     * {string} titolo da associare al pannello griglia
	 */
	title : null,
	/**
	 * Property: iconCls
     * {string} classe CSS associata all'icona del componente 
	 */
	iconCls : 'icon-grid',
    /**
	 * Property: autoExpandColumn
     * {string} designa la colonna che si espande automaticamente al resize
	 */
    autoExpandColumn: "title",    
    
    /**
	 * Property: i18n
	 * {Ext.i18n.Bundle} bundle for i18n messages
	 * @type 
	 */
	i18n: null,

	constructor: function(options) {
		
		var grid = this;
		
		var p = {
			ptype: 'rowexpander',
			
			rowBodyTpl : new Ext.XTemplate(
				//--thumbnail--
				'<tpl if="thumbnail">'+
					'<img src="{absolutePath}/{thumbnail.value}" class="csw-viewer-thumb" '+
						'style="" '+
						'alt="{thumbnail.description}" '+	
					'	type="{thumbnail.protocol}" '+
					'>'+
				'</tpl>'+
				
				//--showed fields--
				'<p><b>' + options.i18n.getMsg("abstract") + ': </b>{abstract}</p>'+
				'<p><b>' + options.i18n.getMsg("subject")  + ': </b>{subject}</p>'
			)};

		options.plugins = [p];

		this.callParent(arguments);
	
	},

	
	/**
	 * Constructor: initComponent 
	 * Inizializza i componenti della GUItrue
	 */
	initComponent : function() {
		this.title = this.i18n.getMsg("titleCatalogRecords");
		var grid = this;
		
		this.columns = {
				defaults : {
							//width : 20,
							sortable : false
						},
				items: [
					   {
			            xtype:'actioncolumn',
			            width:75,
			            items: [{ // ViewMD
				                iconCls: 'icon-info',
				                tooltip: this.i18n.getMsg("viewMetadata"),
				                handler: function(grid, rowIndex, colIndex) {
				                    var rec = grid.getStore().getAt(rowIndex);
				                    var dc = rec.get('dc');
				                    var identifier = rec.get('identifier');
				                    var absolutePath = rec.get('absolutePath');
				                    
				                    //open GN inteface related to this resource
				                    if(identifier){
				                    	window.open(absolutePath.substring(0,absolutePath.length-3)+"metadata.show?uuid="+ identifier);
				                    	//Shows all DC values
				                    }else{
				                    	//TODO create dc visual
				                    	var text="<ul>";
				                    	//var dc=dc;
				                    	//eg. URI
				                    	for (var el in dc){
				                    		 
				                    		if (dc[el] instanceof Array){
				                    			//cicle URI array
				                    			for(var index=0;index<dc[el].length;index++){
								
				                    				//cicle attributes of dc
				                    				if(dc[el][index].value){
				                    					text+="<li><strong>"+el+":</strong> ";
				                    					for(name in dc[el][index]){
				                    						text+="<strong>"+name+"</strong>="+dc[el][index][name]+" ";
				                    						
				                    					}
				                    					text+="</li>";
				                    				}else if(el=="abstract") {
				                    					text+="<li><strong>abstract:</strong> "+dc[el][index]+"</li> ";
				                    				}else{true
				                    					//DO NOTHING
				                    				}
				                    			}
				                    		}
				                    	}
				                    	dc+="</ul>";
				                    	var dcPan=new Ext.Panel({
				                    		html:text,
				                    		preventBodyReset:true,
				                    		autoScroll:true,
				                    		autoHeight: false,
				                    		width: 600,
				                    		height: 400
				                    		
				                    	});						
				                    	var dcWin = new Ext.Window({
				                    		title: "MetaData",
				                    		closable: true,
				                    		width:614,
				                    		resizable: false,
				                    		
				                    		draggable: true,
				                    		items: [
				                    		        dcPan	
				                    		        ]
				                    	});
				                    	dcWin.show();
				                    }

				                }
				                
				            },{ // ViewMap
				            	iconCls: 'icon-layers',
				                tooltip:  this.i18n.getMsg("viewMap"),
				                handler: function(grid, rowIndex, colIndex) {
				                    var rec = grid.getStore().getAt(rowIndex);
				                    var map = rec.get('map');

				                    //var map=rec.map;//array
				                    var bb=rec.get('bounds');
				                    var mapInfo=new Array();
				                    for(var index =0;index< map.length;index++){
				                    	mapInfo.push({wms: map[index].value, layer: map[index].name, description: map[index].description})
				                    }
				                    var LayerInfo={
				                    		title: rec.get('title'),
				                    		crs: rec.get('projection'),
				                    		layers: mapInfo,
				                    		bbox: rec.get('bounds'),
				                    		uuid: rec.get('identifier'),
				                    		gnURL: rec.get('absolutePath').substring(0,rec.get('absolutePath').length-3)
				                    };
						
				                    //TODO do elements
				                    grid.findParentByType("csw").fireEvent('ViewMap', LayerInfo ) ;

				                },
				                isDisabled: function(view, rowIndex, colIndex, item, record ) {
				                	var m = record.get('map');
				                	return !(m && m.length>0);
				                }
				            },{ // BBOX
				            	iconCls: 'icon-mapgo',
				            	tooltip: this.i18n.getMsg("viewBbox"),
				            	handler: function(grid, rowIndex, colIndex) {
				            		var rec = grid.getStore().getAt(rowIndex);
				            		
				            		var ret={
				            			bbox:rec.get('bounds'),
				            			crs:rec.get('projection')
				            		};
				            		grid.findParentByType("csw").fireEvent('zoomToExtent', ret );				            	
			                	}
				            },{
				            	
				            	iconCls: 'icon-mapgo',
				            	tooltip: this.i18n.getMsg("download"),
				            	handler: function(grid, rowIndex, colIndex, item, e, record) {
							            		var rec = grid.getStore().getAt(rowIndex);
							            		var downloads=rec.get('downloads');
							                    var links='';
							                    var mnuItems = [];
							                    
							                    //links='<b>downloads:</b>';
							                    //if( !(downloads instanceof Array) ) return '';
							                    for(var i =0;i<downloads.length;i++){
							                        
							                    	mnuItems.push({
							                    			text: downloads[i].name,
							                    			//iconCls: XXXX,
							                    			urlToOpen: downloads[i].value,
									                    	listeners: { click: {
																			fn: function() {
																				window.open(this.urlToOpen);
																				} 
																			}
										                    			}
							                    			});
							                    
							                    }
							                    var mnu = Ext.create('Ext.menu.Menu',{
							                    		items: mnuItems
							                    	});
							                    
							                    mnu.showAt(e.getXY()); 
							                    //grid.findParentByType("csw").fireEvent('zoomToExtent', ret );
				            			},
				            	isDisabled: function(view, rowIndex, colIndex, item, record ) {
						                	var m = record.get('downloads');
						                	return  !(m instanceof Array)  ;
						                }
				                    	            	
			                	}]
				},        
				{
					//id : 'title',
					text : this.i18n.getMsg("title"),
					dataIndex : "title",
					sortable : false,
					flex: 1
				}, {
					//id : 'subject',
					text : this.i18n.getMsg("subject"),
					dataIndex : "subject",
					sortable : false
				}/*,{
					//id : 'creator',
					text : this.i18n.getMsg("creator"),
					dataIndex : 'creator',
					sortable : false
				}*/,{
					//id : 'modified',
					text : this.i18n.getMsg("modified"),
					dataIndex : 'date',
					sortable : false
				
				}]
				};
				
		

		this.viewConfig = {
			forceFit : true
		};

		this.store = new Ext.data.Store({
			model: CSWRecord,
			pageSize: this.config.limit, // items per page
			autoLoad : false
		});

		this.dockedItems= [{
			xtype: 'pagingtoolbar',
			store: this.store,   // same store GridPanel is using
			dock: 'bottom',
			displayInfo: true
		}];

		/*
		this.bbar = Ext.create('CSWPagingToolbar', {
			pageSize : this.config.limit, 
			store : this.store,
			grid:this,
			displayInfo : true,
			displayMsg : this.i18n.getMsg("bbar.display"),
			emptyMsg : this.i18n.getMsg("bbar.empty"),
			beforePageText : this.i18n.getMsg("bbar.page"),
			firstText : this.i18n.getMsg("bbar.firstPage"),
			lastText : this.i18n.getMsg("bbar.lastPage"),
			prevText : this.i18n.getMsg("bbar.prevPage"),
			nextText : this.i18n.getMsg("bbar.nextPage"),
			refreshText: this.i18n.getMsg("bbar.refresh"),
			afterPageText : this.i18n.getMsg("bbar.afterPageText"),
			i18n: this.i18n
		});
		 */	
		this.callParent(arguments);
		this.reconfigure();
	},
	
	/**
	 * Method: initParameters 
	 * Inizializza i parametri della griglia. 
	 *
	 * options - {Object} opzioni di inizializzazione per il <CSWHttpProxy>
	 */
	initParameters : function (options) {
		options.XDProxy = this.config.XDProxy;
		options.cswVersion = this.config.cswVersion;
		options.limit = this.config.limit;
		options.timeout = this.config.timeout;
		options.reader = Ext.create('CSWRecordsReader', {});
		options.model = CSWRecord;
		this.store.proxy = new CSWHttpProxy(options);
		
		//setting 
		this.store.proxy.on("exception", function( DataProxy, type,  action,  options, response,args){
				//this.loadMask.hide();
        
				if(type=="remote"){
                        Ext.Msg.show({
                            title: this.i18n.getMsg("serverError.title"),
                            msg: this.i18n.getMsg("serverError.serverError.invalid"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    
                
                }else if(type=="response"){//timeout
                    if(!args && response.isTimeout && response.isTimeout==true){//TimeOut
                        Ext.Msg.show({
                            title: this.i18n.getMsg("timeout.title"),
                            msg: this.i18n.getMsg("timeout.description"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }else if (!args){//server Error
                       Ext.Msg.show({
                         title: this.i18n.getMsg("serverError.title"),
                         msg: this.i18n.getMsg("serverError.invalid")+ ":"+response.status+ " "+response.statusText,
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                       });
                    }else{//parsing error
                        Ext.Msg.show({
                         title: this.i18n.getMsg("serverError.title"),
                         msg: this.i18n.getMsg("serverError.catalogException"),
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                       });
                    
                    
                    }
                }
				this.store.fireEvent("loadexception"); 
                
		}, this);
		
		
		//event Handling
		this.store.on("beforeload", function (store, operation, eOpts) {
			//store.proxy.updateRequest(operation.params);
			store.proxy.updateRequest(operation);
		},this);
		
		//used for get the base url for thumnails and geonetwork resource, NEEDED if using x-domain proxy
		this.store.on("load",function (store,records,options){
			
			if (records) {
				var url=store.proxy.currentCatalog;
				
				for(var i=0;i<records.length;i++){
					var thumb;
					records[i].set('absolutePath',url);
					//set thumbnail to absolute path
					if( thumb = records[i].get('thumbnail') ){
						var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
						if(!regexp.test(thumb.value)){
							thumb.value = url +"/"+ thumb.value ;
						}
						records[i].set(	'thumbnail',thumb);
						
					}
				}
			}
			
		},this);
		
		this.enable();
		this.store.load(options.params);
	}

});
