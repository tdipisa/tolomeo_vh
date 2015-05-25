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
 * @class TolomeoExt.ToloStylePanel
 * @extends Ext.Window
 *
 */
Ext.define('TolomeoExt.ToloStylePanel', {

	extend: 'Ext.Window',
 
	/** 
	 * @property {Object} layer
	 * 
	 * 
	 */
	layer: null,
	
	/**
	 * @property {Object} definedStyles
	 * @private 
	 * 
	 * 
	 */
	definedStyles: null,
	
	/**
	 * @property {Object} cat
	 * @private 
	 * 
	 * 
	 */
	cat:null,
	
	/**
	 * @property {Object} lay
	 * @private 
	 * 
	 * 
	 */
	lay: null,
	
	/**
	 * @property {Object} sldGrid
	 * @private 
	 * 
	 * 
	 */
	sldGrid: null,
	
	/**
	 * @property {Object} store 
	 * @private
	 * 
	 * 
	 */
	store: null,
	
	/**
	 * @property {Object} stylePreview
	 * @private 
	 * 
	 * 
	 */
	stylePreview: null,
	
	/**
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function(){
	    
		//bottoni
		// Messo fisso false per non abilitare la funziona fino a che non è pronta
		if (false) { 
			this.btnNuovo = Ext.create('Ext.Button', {
	            text: 'Nuovo',
		        disabled: false,
		        iconCls: 'iconConferma',
		        width: 75,
		        tooltip : {text: 'Crea nuovo stile', title: 'Crea nuovo'},
		        listeners: { click: { fn: this.onCreaStile, scope: this}}
		    });
			
			this.btnImporta = Ext.create('Ext.Button', {
	            text: 'Importa',
		        disabled: false,
		        iconCls: 'iconConferma',
		        width: 75,
		        tooltip : {text: 'Importa stile'}, //, title: ''
		        listeners: { click: { fn: this.onImportaStile, scope: this}}
		    });
			
			this.btnEsporta = Ext.create('Ext.Button', {
	            text: 'Esporta',
		        disabled: true,
		        iconCls: 'iconConferma',
		        width: 75,
		        tooltip : {text: 'Esporta stile'}, //, title: ''
		        listeners: { click: { fn: this.onEsportaStile, scope: this}}
		    });
			
			this.btnModifica = Ext.create('Ext.Button', {
	            text: 'Modifica',
		        disabled: true,
		        iconCls: 'iconConferma',
		        width: 75,
		        tooltip : {text: 'Modifica stile'}, //, title: ''
		        listeners: { click: { fn: this.onModificaStile, scope: this}}
		    });
		}	
		
		this.btnApplica = Ext.create('Ext.Button', {
					            text: 'Applica',
						        disabled: true,
						        iconCls: 'iconConferma',
						        width: 75,
						        tooltip : {text: 'Applica lo stile selezionato al livello', title: 'Applica stile'},
						        listeners: { click: { fn: this.onApplica, scope: this}}
						    });
		
		this.btnAnnulla = Ext.create('Ext.Button',{
				            text: 'Annulla',
				            width: 75,
							listeners: { click: { fn: this.nascondi, scope: this}}
				        });
		
		
		this.buttons = [this.btnNuovo, this.btnImporta, this.btnEsporta, this.btnModifica, this.btnApplica, this.btnAnnulla];
		
		
		this.formImporta = Ext.create('Ext.form.Panel', {
		    hidden: true,
		    renderTo: Ext.getBody(),
		    items: [{
		        xtype: 'filefield',
		        name: 'photo'
		        /*listeners:{
		            change:function( thiss, value, eOpts ){
		                  alert(value);
		                  //here place your ajax request
		            }
		         },*/
		        //fieldLabel: 'Photo',
		        //labelWidth: 50,
		        //msgTarget: 'side',
		        //allowBlank: false,
		        //anchor: '100%',
		        //buttonText: 'Select Photo...'
		    }
			]
		    });
		
		/*
		 * new Ext.create('Ext.form.field.File', {

            buttonOnly: true,
            hideLabel: true,
            buttonText: 'Carregar Playlist.',
            listeners: {
                'change': function(fb, v) {
                    form.getForm().submit({
                        method: 'POST',
                        url: 'carregaLista.php',
                    });
                }
            }
		 * 
		 */
		
		this.callParent(arguments);
		
		this.layout = 'border';
		this.addEvents('styleApply'); // selezionato stile e richiesta la sua applicazione
		
		this.store = Ext.create('Ext.data.JsonStore',{
		    autoDestroy: true,
		  //  storeId: 'myStore',
		    fields: [
	            'name',
	            'title',	
	            'styleAbstract',
	            'legendGraphic',
	            'sldtext'
		    ]
		});
		
		var columns =  [{
			header: "Nome",
		    sortable: true, 
		    dataIndex: 'name'
		},{
	    	header: "Titolo",
			sortable: true, 
			dataIndex: 'title'
		},{
			header: "Descrizione",
		    sortable: true, 
		    dataIndex: 'styleAbstract',
		    renderer: function (val){
		    	return '<div style="white-space:normal !important;">'+ val +'</div>';
		    }
	    }];
		
		//griglia sld per layer selezionato
	    this.sldGrid = Ext.create('Ext.grid.GridPanel',{
		    	region: 'center',
		        frame: false,
		        height: 'auto',
		        store: this.store,
		        columns: columns,
		        viewConfig: {
		    			forceFit: true,
		    			emptyText: 'Nessuno stile associato per questo layer'
					},
				listeners: { selectionchange: { 
										fn: function(selmodel, selected, eOpts) {
												var bNessunaSelezione = (selected.length==0);
												var bCustomSld = !bNessunaSelezione && (selected[0].data.sldtext) && (selected[0].data.sldtext!="");
												this.btnApplica.setDisabled(bNessunaSelezione);
												this.btnEsporta.setDisabled(!bCustomSld);
												this.btnModifica.setDisabled(!bCustomSld);
												
												if (bNessunaSelezione) {
													this.stylePreview.clearSrc();	
												} else {
													var rec = selected[0];
													if (rec.data.legendGraphic && !rec.data.legendGraphic=="") {
														this.stylePreview.setSrc(rec.data.legendGraphic);	
													} else {
														this.stylePreview.clearSrc();
													}
												}
											},
										scope: this
								}
							}
	       		        
	    	});
	    /*
	    this.sldGrid.getSelectionModel().on('selectionchange', function(selmodel, selected, eOpts) {
			var bNessunaSelezione = (selected.length==0);
			this.btnApplica.setDisabled(bNessunaSelezione);
	
			if (bNessunaSelezione) {
				this.stylePreview.clearSrc();	
			} else {
				var rec = selected;
				if (rec.data.legendGraphic && !rec.data.legendGraphic=="") {
					this.stylePreview.setSrc(rec.data.legendGraphic);	
				} else {
					this.stylePreview.clearSrc();
				}
			}
		}, this);
	    */
	    this.stylePreview = Ext.create('Ext.Panel', {
	    	title: 'Legenda',
	    	autoScroll: true,
	    	split: true,
	    	collapsible: true,
	    	region: 'east',
    		width: '25%',
    		setSrc: function(src) {
				this.update('<img src="' + src +'" />');
    	    },
    	    clearSrc: function() {
    	    	this.update('Anteprima non disponibile');
    	    }
    	});
	    
	    this.add(this.sldGrid);
		this.add(this.stylePreview);
		
	},
	
	
	/**
	 * @method mostra
	 * 
	 * 
	 * @param {String} nome
	 * 
	 * 
	 * @param {Object} cat
	 * 
	 * 
	 * @param {Object} lay
	 * 
	 * 
	 * @param {Object} definedStyles
	 * 
	 * 
	 */
	mostra: function(nome, cat, lay, definedStyles) {
	
		this.lay = lay;
		this.cat = cat;
		this.definedStyles = definedStyles;
		
		// Aggiorno store con gli stili disponibili
		this.store.loadData(definedStyles);
		
		// Setto il titolo della finestra
		var title = 'Gestione stili del layer ' + nome;
		this.setTitle(title);
		
		// mostro la finestra
		this.show();
		
	},
			
	/**
	 * @method nascondi
	 * 
	 * 
	 */
	nascondi: function() {
		this.hide();
	},
	
	/**
	 * @method onImportaStile
	 * 
	 */
	onImportaStile: function(form) {
		var me = this;
		
		var formpanel = Ext.create('Ext.form.Panel', {
			url: '/tolomeobinj/MirrorServlet',
			bodyPadding: 10,
		    frame: true,
		    items: [{
		        xtype: 'filefield',
		        name: 'uploadfield',
		        allowBlank: false,
		        blankText: "Seleziona file da importare",
		        fieldLabel: "File",
		        labelWidth: 50,
		        buttonText: 'Importa',
		        anchor: '100%',
				buttonConfig: {
					text: 'Importa',
			        disabled: false,
			        iconCls: 'iconConferma',
			        //width: 75,
			        tooltip : {text: 'Importa stile'}, //, title: ''
				},
				buttonOnly: false}],
			buttons: [{
			        text: 'Reset',
			        handler: function() {
			            this.up('form').getForm().reset();
			        }
			    }, {
			        text: 'Submit',
			        formBind: true, //only enabled once the form is valid
			        disabled: true,
			        handler: function() {
			            var form = formpanel.getForm();
			            if (form.isValid()) {
			                form.submit({
			                    success: function(form, action) {
			                    	
			                    	me.store.add({
			                    		'name': 'nome',
				        	            'title': 'titolo',
				        	            'styleAbstract': 'abstract',
				        	            'legendGraphic': undefined,
				        	            'sldtext': action.result.contenuto
			                    	});
			        	       
			                       Ext.Msg.alert('Success', action.result.msg);
			                       formpanel.up('window').close();
			                    },
			                    failure: function(form, action) {
			                        Ext.Msg.alert('Failed', action.result.msg);
			                        formpanel.up('window').close();
			                    }
			                });
			            }
			        }
			    }]});
		        
		        
		    /*,
		        listeners:{
		            change:function( thiss, value, eOpts ){
		                  //alert(value);
		                  var form = formpanel.getForm();
		                  if(form.isValid()){
		                      form.submit({
		                          url: '/tolomeobinj/MirrorServlet',
		                          waitMsg: 'Importazione in corso',
		                          success: function(fp, o) {
		                        	  //  o.result.file 
		                              Ext.Msg.alert('Success', 'Importazione avvenuta con successo');
		                          },
		                          failure: function(form, action) {
		                              Ext.Msg.alert('Failed', action.result.msg);
		                          }
		                      });
		                  }
		            }
		         }*/
		        //fieldLabel: 'Photo',
		        //labelWidth: 50,
		        //msgTarget: 'side',
		        //allowBlank: false,
		        //anchor: '100%',
		        //buttonText: 'Select Photo...'
		    //}]});
		
		Ext.create('Ext.window.Window',{
			width: 400,
			resizable: false,
			height: 120,
			layout: 'fit',
			title: 'Importazione stile',
			items: [formpanel]
		}).show();
		 
		
		//var form = this.formImporta.getForm();
        
		
	},
	
	/**
	 * @method onEsporta
	 */
	onEsportaStile: function() {
		
	    var rec = this.sldGrid.getSelectionModel().getSelection()[0];
		
	    var formattedXml = this.formatXml(rec.data.sldtext);
	    
		var formpanel = Ext.create('Ext.form.Panel', {
			
			url: '/tolomeobinj/MirrorServlet',
			standardSubmit: true,
			render: Ext.getBody(),
			hidden: true,
			items: [{
					    xtype: 'hiddenfield',
					    name: 'mode',
					    value: 'download'
					},{
					    xtype: 'hiddenfield',
					    name: 'contenuto',
					    value: formattedXml
					},{
					    xtype: 'hiddenfield',
					    name: 'filename',
					    value: rec.data.name + '.xml'
					}],
					
			buttons: [{
			        text: 'Reset',
			        handler: function() {
			            this.up('form').getForm().reset();
			        }
			    }, {
			        text: 'Submit',
			        formBind: true, //only enabled once the form is valid
			        disabled: true,
			        handler: function() {
			            var form = this.up('form').getForm();
			            if (form.isValid()) {
			                form.submit({
			                    success: function(form, action) {
			                       Ext.Msg.alert('Success', action.result.msg);
			                       formpanel.close();
			                    },
			                    failure: function(form, action) {
			                        Ext.Msg.alert('Failed', action.result.msg);
			                        formpanel.close();
			                    }
			                });
			            }
			        }
			    }]
		});
		
		formpanel.getForm().submit();
		
		
		
		/*
		Ext.create('Ext.window.Window',{
			width: 100,
			height: 60,
			layout: 'fit',
			title: 'ssss',
			items: [formpanel]
			
		}).show();
		*/
	},
	
	onModificaStile: function() {
		var rec = this.sldGrid.getSelectionModel().getSelection()[0];
		var sld = rec.data.sldtext;
		
		var style = this.sldToStyle(sld);
		this.showStyle(style);
	},
		
	/**
	 * @method onApplica
	 * 
	 * 
	 */
	onApplica: function() {
        var rec = this.sldGrid.getSelectionModel().getSelection()[0];
        if (rec!=null) this.fireEvent('styleApply', this.cat, this.lay, rec.data.name);
    
    },
    
    onCreaStile: function() {
    	//this.currentLegend.symbolType
    	
		//ALE Per ora commentato
		//this.currentLegend.rules.push(rule);
		//this.fireEvent("ruleadded", rule);
		this.showStyle(null);
    },
    
    styleToSld: function(style) {
    	var sld = {
				namedLayers: {
					"Default Styler": {
						userStyles: [
							style
						],
						name: "Default Styler"
					}
				},
				version: "1.0.0"
			}
			
		var format = new OpenLayers.Format.SLD({
			multipleSymbolizers: true
		});
    	
    	return format.write(sld);
    },
    
    sldToStyle: function(sld) {
    		
		var format = new OpenLayers.Format.SLD({
			multipleSymbolizers: true
		});
		
		var style = format.read(sld).namedLayers["Default Styler"].userStyles[0];
    	
    	return style; 
    },
    
    showStyle: function(style, closeCallback) {
		//console.log("prima delle modifiche ...");
		//logProperties(rule);
		//for (var symbolizerIndex = 0 ; symbolizerIndex < rule.symbolizers.length ; symbolizerIndex ++) {
		//	logProperties(rule.symbolizers[symbolizerIndex]);
		//}
    	var me = this;

		this.styleDialog = Ext.create("Ext.Window", {
			//title: "Stile \"" + (style.title || style.name || "Untitled") + "\"",
			layout: "fit",
			width: 500,
			height: 500,
			constrainHeader: true,
			frame: false,
			items: [{
				xtype: "styler_stylepanel",
				style: style,
				mapPanel: this.mapPanel,
				listeners: {
					"stylecanceled": function() {
						this.styleDialog.close();
					},
					"stylesaved": function(style) {
						
						var sld = this.styleToSld(style);
						
                    	me.store.add({
                    		'name': 'nome',
	        	            'title': 'titolo',
	        	            'styleAbstract': 'abstract',
	        	            'legendGraphic': undefined,
	        	            'sldtext': sld
                    	});
        	       
						//console.log(format.write(sld));
					},
					"ruleselected": function(rule) {
					},
					"ruleadded": function() {
					},
					"ruleremoved": function(rule) {
					},
					scope: this
				}
			}]
		});
		
		/*
		this.ruleDialog = Ext.create("Ext.Window", {
			title: "Stile \"" + (rule.title || rule.name || "Untitled") + "\"",
			layout: "fit",
			width: 315,
			//x: this.windowPositions.ruleDialog.x,
			//y: this.windowPositions.ruleDialog.y,
			constrainHeader: true,
			items: [{
				xtype: "styler_rulepanel",
				//autoHeight: false,
				autoScroll: true,
				rule: newRule,
//				symbolType: symbolType,
//				fonts: this.fonts,
				nestedFilters: false,
				//ALE Default 20 da capire meglio scaleLevels: this.mapPanel.map.baseLayer.numZoomLevels,
				//ALE PER ORA COMMENTATI minScaleDenominatorLimit: OpenLayers.Util.getScaleFromResolution(this.mapPanel.map.baseLayer.resolutions[this.mapPanel.map.baseLayer.numZoomLevels - 1], this.mapPanel.map.units),
				//ALE PER ORA COMMENTATI maxScaleDenominatorLimit: OpenLayers.Util.getScaleFromResolution(this.Panel..baseLayer.resolutions[0], this.mapPanel.map.units),
				scaleSliderTemplate: "<div>{scaleType} Zoom Level: {zoom}</div>" + "<div>Current Map Zoom: {mapZoom}</div>",
				modifyScaleTipContext: Ext.Function.pass(function(panel, data) {
					data.mapZoom = this.mapPanel.map.getZoom();
				}, [], this),
				// ALE Reperisce nomi attributi per condizioni
				// ALE da fare 
//				attributes: new GeoExt.data.AttributeStore({
//					url: "../../../geoserver/wfs?",
//					baseParams: {
//						version: "1.1.1",
//						request: "DescribeFeatureType",
//						typename: layer.params["LAYERS"]
//					},
//					ignore: {
//						name: this.schemaManager.getGeometryName(layer)
//					}
//				}),
				attributes: Ext.create("Ext.data.Store", {
					model: "User",
					data : [{
							name: "pippo"
						}, {
							name: "pluto"
						}, {
							name: "paperino"
						}]
				}),
				pointGraphics: [{
							display: "circle",
							value: "circle",
							mark: true,
							preview: "img/styler/circle.gif"
						}, {
							display: "square",
							value: "square",
							mark: true,
							preview: "img/styler/square.gif"
						}, {
							display: "triangle",
							value: "triangle",
							mark: true,
							preview: "img/styler/triangle.gif"
						}, {
							display: "star",
							value: "star",
							mark: true,
							preview: "img/styler/star.gif"
						}, {
							display: "cross",
							value: "cross",
							mark: true,
							preview: "img/styler/cross.gif"
						}, {
							display: "x",
							value: "x",
							mark: true,
							preview: "img/styler/x.gif"
						}, {
							display: "custom..."
						}],
				listeners: {
					'save': { fn: function(rule) {
									var sldFormat = new OpenLayers.Format.SLD();
									
									var sldxml = sldFormat.write({
											namedLayers: {
												"mylayer": {
													name: "mylayer",
													userStyles: [{
														name: "mystyle",
														rules: [rule]
													}]
												}
											}
										 });
								
									alert (sldxml);
								},
								scope: this
							}
					}
			
		}]}); */
		this.styleDialog.show();
	},
	
	formatXml: function (xml) {
	    var formatted = '';
	    var reg = /(>)(<)(\/*)/g;
	    xml = xml.replace(reg, '$1\r\n$2$3');
	    var pad = 0;
	    Ext.Array.each(xml.split('\r\n'), function(node, index) {
	        var indent = 0;
	        if (node.match( /.+<\/\w[^>]*>$/ )) {
	            indent = 0;
	        } else if (node.match( /^<\/\w/ )) {
	            if (pad != 0) {
	                pad -= 1;
	            }
	        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
	            indent = 1;
	        } else {
	            indent = 0;
	        }
	 
	        var padding = '';
	        for (var i = 0; i < pad; i++) {
	            padding += '  ';
	        }
	 
	        formatted += padding + node + '\r\n';
	        pad += indent;
	    });
	 
	    return formatted;
	}

});

