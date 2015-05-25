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
 * @class TolomeoExt.ToloTreeTOCPanelExt
 * 
 * 
 */
Ext.define('TolomeoExt.ToloTreeTOCPanelExt', {

	extend: 'TolomeoExt.ToloTOCPanelExt',
	
	alias: 'widget.tx_toloTreeTOCPanelExt',
	
	//requires: [],
 	
	/** 
	 * @property {Object} tree
	 * 
	 * 
	 */
	tree: null,

	/** 
	 * @property {Object} treeRootNode
	 * 
	 * 
	 */
	treeRootNode: null,
		 
	/** 
	 * @property {Object} treeColumn
	 * 
	 * 
	 */
	treeColumn: null,
	
	/** 
	 * @property {Object} filterVal
	 * 
	 * 
	 */
	filterVal: null,
	
	/** 
	 * @property {Object} waitMsgBox
	 * 
	 * 
	 */
	waitMsgBox: null,
	
	/**
	 * @method initComponent
	 * Metodo relativo alla gestione Ext.
	 * 
	 */
	initComponent: function(){
        
		var me = this;
		this.layout = 'fit';
		
		//Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);	
		var thisPanel = this;
		this.tbar =[{ xtype: 'button',
						  iconCls: 'legendaBtnExpand',
						  //text: 'Apri',
						  tooltip: "Apre tutto l'albero",
						  listeners: { 'click': { fn: this.expandNodes,
							  						
							  				   scope: this}
						  			}
					},
					{ xtype: 'button',
								  iconCls: 'legendaBtnCollapse',
					  //text: 'Chiudi',
					  tooltip: "Chiude tutto l'albero",
					  listeners: { 'click': { fn: function() { this.treeRootNode.collapseChildren(true); }, 
						  				   scope: this}
					  			}
					},
		            'Filtro:',
		            {
						xtype:'trigger',
						width: 100,
						triggerCls:'x-form-clear-trigger',
						onTriggerClick:function() {
										this.setValue('');
										thisPanel.filterClear();
										thisPanel.treeRootNode.collapseChildren(true);
								},
								enableKeyEvents:true,
								listeners:{
									keyup:{
										buffer:200,		
										fn:function(field, e) {
											if(Ext.EventObject.ESC == e.getKey()) {
												field.onTriggerClick();
											} else {
												var val = this.getRawValue();
												me.filterVal = val;
												thisPanel.filterClear();
												thisPanel.filterTree(val);
												
											}
										}
									}
								}
		            }];
		
		this.callParent();
		
		var mnuItems = [];
		if (this.paramsJS.layOut.conExportQGIS) {
			mnuItems.push(this.getExportMenuItem(null, null));
		}				
				
		var model =  Ext.define('User', {
		     extend: 'Ext.data.Model',
		     fields: [
		              {name: 'disabled', type: 'boolean', useNull: true, defaultValue: null },
		              {name: 'text', type: 'string', useNull: true, defaultValue: null},
		              {name: 'hidden', type: 'boolean', useNull: true, defaultValue: null},
		              {name: 'lay', type: 'string', useNull: true, defaultValue: null},
		              {name: 'cat', type: 'string', useNull: true, defaultValue: null},
		              {name: 'classi', type: 'string', useNull: true, defaultValue: null},
		              {name: 'catId', type: 'string', useNull: true, defaultValue: null},
		              {name: 'layId', type: 'string', useNull: true, defaultValue: null},
		              {name: 'temporaryNotAvailable', type: 'boolean', useNull: true, defaultValue: null},
		              {name: 'codTPN', type: 'string', useNull: true, defaultValue: null},
		              {name: 'withOpacitySettings', type: 'boolean', useNull: true, defaultValue: null},
		              {name: 'ownerTOC', type: 'auto', useNull: true, defaultValue: null},
		              {name: 'style', type: 'string', useNull: true, defaultValue: null},
		              {name: 'itemType', type: 'string', useNull: true, defaultValue: null},
		              //{name: 'icon', type: 'string', useNull: true, defaultValue: null},
		              // Campi utilizzati via codice js per modifica visualizzazione nodo
		              {name: 'nodeFiltered', type: 'boolean', useNull: true, defaultValue: false},				// True se il nodo è filtrato da funzione di ricerca (non risponde a criterio di ricerca 
		              {name: 'nodeVisibleAtScale', type: 'boolean', useNull: true, defaultValue: true},			// True se il nodo visibile alla scala attuale
		              {name: 'nodeWithUnfilteredChild', type: 'boolean', useNull: true, defaultValue: false}	// True se il nodo ha almeno un figlio non filtrato 
		     ]
		 });


		this.treestore = Ext.create('Ext.data.TreeStore', {
			proxy: {
				type: 'memory'
			},
		    root: {
		        expanded: true, 
		        text: 'root nascosta'//,
		    }, 
		    data: [],
		    autoSync: true,
		    autoLoad: false,
		    model: model
		});        
		
		this.treeRootNode = this.treestore.getRootNode();

		this.treeColumn = Ext.create('TolomeoExt.ToloTOCNodeColumnExt4', { 
									dataIndex:'text', 
									width    : Ext.isIE6 ? '100%' : 10000 // IE6 needs width:100%
							});

        this.tree = Ext.create('Ext.tree.TreePanel', {
        	store: this.treestore,
			useArrows: true,
		 	rootVisible: false,
		 	animate: true,
			border: false,
			autoScroll : true,
			hideHeaders: true,
			cls: Ext.baseCSSPrefix + 'autowidth-table',
			viewConfig: {
			    plugins: { ptype: 'treeviewdragdrop' }
			},
		    columns: [this.treeColumn]
		});
        var view = this.tree.getView();
        var me =  this;
        Ext.apply(view, {
            //if our function returns false, the original function is not called
            onCheckChange: Ext.Function.createInterceptor(view.onCheckChange,me.onCheckChangeInterceptor,me),
            getRowClass: Ext.Function.bind(me.getRowClass,me)
        });        

        this.tree.getView().on('checkchange', this.checkChange, this);
        this.tree.getView().on('beforedrop',this.nodedragover, this);
        this.tree.getView().on('drop', this.nodeDrop, this);
		this.tree.getView().on('itemclick', this.onItemClicked, this);
        this.tree.getView().on('rowfocus', this.onItemSelected, this);
        this.tree.on('cellcontextmenu', this.menuShow, this);
        
        //this.add({html: "Attendere prego"});
        
        this.add(this.tree);
        
        this.on('afterrender', function() {
        	if (!this.isTOCGUICreated) {
				this.waitMsgBox = new Ext.LoadMask(this, {msg:"Attendere prego..."});
				this.waitMsgBox.show();
        	}
        }, this, {single: true})
        
    },
    
	/**
	 * @method onItemSelected
	 * 
	 * 
	 * @param {Object} record
	 * 
	 * 
	 * @param {Object} item
	 * 
	 * 
	 * @param {Object} index
	 * 
	 * 
	 */
    onItemSelected: function(record, item, index) {
    	this.callParent([record.get('cat'), record.get('lay'), record.get('classi')]);
    	
    },
    
	/**
	 * @method onItemClicked
	 * 
	 * 
	 * @param {Object} view
	 * 
	 * 
	 * @param {Object} record
	 * 
	 * 
	 * @param {Object} item
	 * 
	 * 
	 * @param {Object} index
	 * 
	 * 
	 * @param {Object} e
	 * 
	 * 
	 * @param {Object} eOpts
	 * 
	 * 
	 */
    onItemClicked: function(view, record, item, index, e, eOpts) {
    	this.callParent([record.get('cat'), record.get('lay'), record.get('classi'), e]);
    },
    
	/**
	 * @method getRowClass
	 * 
	 * 
	 * @param {Object} record
	 * 
	 * 
	 * @param {Object} index
	 * 
	 * 
	 * @param {Object} rowParams
	 * 
	 * 
	 * @param {Object} ds
	 * 
	 * 
	 */
	getRowClass: function(record,index,rowParams,ds){
	
    	var cls = '';
    	
		if (record.get('hidden')) cls+=' tocitemhidden ';
		if (!record.get('nodeVisibleAtScale')) cls+=' tocitemnotvisible ';
		if (!record.get('nodeWithUnfilteredChild') && record.get('nodeFiltered')) cls+=' tocitemfiltered ';
		if (record.get('disabled')) cls+=' tree-node-disabled ';
		if (record.get("itemType")=='separator') {
			cls += " legendaSeparatorRow ";
		}
    	
	    return cls;
	},    

	/**
	 * @method onCheckChangeInterceptor
	 * Consente di impedire il cambio di check state nel caso sia disabilitato
	 * 
	 * @param {Object} record
	 * 
	 * 
	 */
    onCheckChangeInterceptor: function(record) {
    	if (record.get('disabled')){
            return false;
        } 
    },

	/**
	 * @method expandNodes
	 * 
	 * 
	 */
    expandNodes: function() {
    	Ext.suspendLayouts();
		this.treeRootNode.cascadeBy(function(nd) {
				if (nd.get('lay')==null) {
					nd.expand(false, false);
				}});
		Ext.resumeLayouts(true);
	},

	/**
	 * @method filterTree
	 * 
	 * 
	 * @param {Object} val
	 * 
	 * 
	 */
    filterTree: function(val) {
    	Ext.suspendLayouts();

    	var re = new RegExp('.*' + val + '.*', 'i');
		this.treeRootNode.cascadeBy(
    		function(n) {
    			if (n.get('classi')!=null) return false; // se stiamo esaminando il nodo finale (legenda) smettere per non farlo partecipare alla ricerca
    			if (!n.get('hidden')) {
	    			if (re.test(n.get('text')) ) {
	    				this.setNodeFiltered(n, false);
	    				return true;
	    			} else {
	    				if (n!== this.treeRootNode)	this.setNodeFiltered(n, true);
	    				return true;  // continuo ad attraversare l'albero perchè se qualche figlio è attivo va attivato anche questo nodo
	    			}
    			}
    		}, this
    	);
		
		Ext.resumeLayouts(true);
		
		this.expandNodes();
		    	
    },
    
	/**
	 * @method setNodeFiltered
	 * 
	 * 
	 * @param {Object} node
	 * 
	 * 
	 * @param {Object} dafiltrare
	 * 
	 * 
	 */
    setNodeFiltered: function(node, dafiltrare) {
        
        node.set('nodeFiltered', dafiltrare);
        	
        // Aggiorna flag nodeWithUnfilteredChild in tutta la gerarchia a salire
       	var p = node.parentNode;
       	var bContinua = true;
        while(p && bContinua) {
        	
        	// controllo tutti i figli p.get('nodeWithUnfilteredChild')
        	var withUnfiltered = false;
        	for (var i = 0; i< p.childNodes.length ; i++) {
        		if (p.childNodes[i].get('classi')==null && p.childNodes[i].get('hidden')==false && (!p.childNodes[i].get('nodeFiltered') || p.childNodes[i].get('nodeWithUnfilteredChild') )) { 
        			withUnfiltered=true;
        			break;
        		}
        	}
        	
        	if (p.get('nodeWithUnfilteredChild')!= withUnfiltered ) {
        		p.set('nodeWithUnfilteredChild', withUnfiltered);
        	} else {
        		bContinua=false;
        	}
        		
        	p = p.parentNode;
		}        	
        
    },    

	/**
	 * @method filterClear
	 * 
	 * 
	 */
    filterClear: function() {
    	Ext.suspendLayouts();
    	this.treeRootNode.cascadeBy(
        		function(n) {
        				if (!n.get('hidden')) {
        					n.set('nodeWithUnfilteredChild', false);
        					n.set('nodeFiltered', false);
   	                     }
        				
        		}, this
        	);
    	Ext.resumeLayouts(true);
    },
    
	/**
	 * @method menuShow
	 * 
	 * 
	 * @param {Object} view
	 * 
	 * 
	 * @param {Object} td
	 * 
	 * 
	 * @param {Object} cellIndex
	 * 
	 * 
	 * @param {Object} record
	 * 
	 * 
	 * @param {Object} tr
	 * 
	 * 
	 * @param {Object} rowIndex
	 * 
	 * 
	 * @param {Object} e
	 * 
	 * 
	 * @param {Object} eOpts
	 * 
	 * 
	 */
	menuShow : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ){
    	
		var menu = this.getContextMenu(record.get('cat'), record.get('lay'));
		if (menu) {
    		menu.showAt(e.getXY()); //node.ui.getAnchor()
    		
		}
		e.preventDefault();
   },
    
	/**
	 * @method nodedragover
	 * 
	 * 
	 * @param {Object} node
	 * 
	 * 
	 * @param {Object} data
	 * 
	 * 
	 * @param {Object} overModel
	 * 
	 * 
	 * @param {Object} dropPosition
	 * 
	 * 
	 * @param {Object} dropHandlers
	 * 
	 * 
	 * @param {Object} eOpts
	 * 
	 * 
	 */
    nodedragover: function(node, data, overModel, dropPosition, dropHandlers, eOpts ) { //dropEvent
    	if (dropPosition == 'append')  
    		return false;
    	
    	if(overModel.parentNode.id!=data.records[0].parentNode.id)
    		return false;
    	
    },
    
	/**
	 * @method nodeDrop
	 * 
	 * 
	 * @param {Object} node
	 * 
	 * 
	 * @param {Object} data
	 * 
	 * 
	 * @param {Object} overModel
	 * 
	 * 
	 * @param {Object} dropPosition
	 * 
	 * 
	 * @param {Object} eOpts
	 * 
	 * 
	 */
    nodeDrop: function( node, data, overModel, dropPosition, eOpts ) { 
    	// Andrebbe fatto in modo da garantirsi che l'albero venga percorso nell'ordine giusto
    	this.tocInfo.layerOrder = this.createOrRefreshLayerOrder();
    	this.layerOrderChange();
    	
    },
    
	/**
	 * @method createOrRefreshLayerOrderExtend
	 * 
	 * 
	 */
    createOrRefreshLayerOrderExtend: function() {
    	// Andrebbe fatto in modo da garantirsi che l'albero venga percorso nell'ordine giusto
    	var layerOrder = [];
    	this.treeRootNode.cascadeBy(
			function(nd) {
				if ( nd.get('classi')==null && nd.get('lay')!=null) {
					layerOrder.push({cat: nd.get('cat'), lay: nd.get('lay')});
				}
				return true;
			},
			this
		);
    	
		return layerOrder;
    },
    
    /**
     * @method checkChange
     * 
     * 
     * @param {Object} node
     * node.
     * 
     * @param {Object} checked
     * checked.
     * 
     */
    checkChange: function( node, checked ) {
    	
    	var cat = node.get('cat');
    	var lay = node.get('lay');
    	
    	// Se il click e' su una categoria vengono disabilitati o abilitati tutti i layer della categoria stessa
    	if (lay==null) {
    		this.setCategoryStateChange(cat, checked);
    		
    	} else {
    		this.setLayerStateChange(cat,lay, checked);
    	}    	
    	
    },
    
  /**
	 * @method setLayerStateChange
	 * Aggiorna lo stato di un layer a livello di treePanel quando viene notificata
	 * una modifica dalla classe padre.
	 * 
	 * @param {Object} cat
	 * 
	 * 
	 * @param {Number} lay
	 * layer della tocInfo
	 * 
	 * @param {Object} checked
	 * 
	 * 
	 */
	setLayerStateChange : function(cat, lay, checked) {
		 this.callParent(arguments);
		if (this.tocInfo != null && lay != null) {
			var layer = this.tocInfo.getCategoryInfo(cat).layers[lay];
			var layerNode = this.treeRootNode.findChild('layId',layer.layId,true);
			
			if( layer.userSwitchable &&   (layerNode.get('checked') != layer.checked)){
				layerNode.set('checked', layer.checked);
			}	
		}		
	},

  /**
	 * @method _createCategory
	 * @private
	 * Aggiorna lo stato di un layer a livello di treePanel quando viene notificata
	 * una modifica dalla classe padre.
	 * 
	 * @param {Object} cat
	 * 
	 * 
	 * @param {Object} catIdx
	 * 
	 * 
	 * @param {Object} addPointCatId
	 * 
	 * 
	 * @param {Object} before
	 * 
	 * 
	 */
    _createCategory: function(cat, catIdx, addPointCatId, before) {

    	var bConIcone = this.getParametriMappaCurr().legenda.conIcone;

    	var nodeCfg = {
    	   			text: cat.catDescr,
					hidden: cat.hidden,
					lay: null,
					cat: catIdx,
					classi: null,
					catId: cat.catId,
					allowDrag: this.tocInfo.orderChangeCapable,
					checked: (cat.userSwitchable) ? cat.checked : undefined,
					disabled: !this.tocInfo.areAllParentCatChecked(catIdx),
					href:  (cat.clickUrl) ? "#" : null, //this.calcolaCategoryClickUrl(cat),
					hrefTarget: (cat.clickTarget) ? cat.clickTarget : undefined,
					url: null,
					cls: 'bold' ,
					iconCls: bConIcone ? "iconLegendaCategoria" : 'treenode-no-icon',
					expanded: cat.expanded,
					qtip: this.calcolaCatToolTip(catIdx),
					itemType: cat.itemType
					
				}; 
				
		if (cat.itemType && cat.itemType=='text' && cat.itemIcon) {
			var serverIco = "";
			if (cat.itemIcon.indexOf("http://")==-1 && cat.itemIcon.indexOf("http://")==-1) {
    			serverIco = this.TOLOMEOServer + this.TOLOMEOContext + "/";
			}
    		nodeCfg.icon = serverIco+cat.itemIcon;
			nodeCfg.iconCls = 'iconClassToc';
			
    	}			
		
		var parentCatIdx = this.tocInfo.getParentCategoryIdx(catIdx);
		var parentNode = (parentCatIdx=="") ? this.treeRootNode : this.treeRootNode.findChild('cat', parentCatIdx, true)  ;    //this.findChildNodeByAttribute(this.treeRootNode, 'cat', parentCatIdx)
		var nodeI = null;
		
		if (addPointCatId) {
			var nodeAddPoint = this.treeRootNode.findChild('catId', addPointCatId, true);
			
			if (before) {
				nodeI = parentNode.insertBefore(nodeCfg, nodeAddPoint);	
			} else {
				var nodeAfter = null;
				// Cerca la posizione di nodeAddPoint
				for (var i=0; i < parentNode.childNodes.length; i++) {
						var n = parentNode.getChildAt(i);
						if (n==nodeAddPoint) {
							if (i < parentNode.childNodes.length -1) {
								nodeAfter = parentNode.getChildAt(i+1);
							}
							break;
						}
				}
				if (nodeAfter) {
					// non è l'ultimo
						nodeI = parentNode.insertBefore(nodeCfg, nodeAfter);	
				} else {
						nodeI = parentNode.appendChild(nodeCfg);	
			 
				}
			}
			
		} else {
			// Cerco il primo nodo layer all'interno di parentNode
			var idxFirstLay = null;
			for (var i =0; i<parentNode.childNodes.length; i++) {
				if (parentNode.childNodes[i].get('lay')!=null) {
					idxFirstLay = i;
					break;
				}
			}
			if (idxFirstLay!=null) {
				nodeI = parentNode.insertBefore(nodeCfg, parentNode.childNodes[idxFirstLay]);	
			} else {
				nodeI = parentNode.appendChild(nodeCfg);
			}
		}
		
		this.setNodeLayerVisibility(nodeI, true);
		
		/*nodeI.on("click", 
			function(nd) {
				this.fireEvent('categoryLinkClick', nd.get('cat')); 
			}, 
			this);
		*/
		
		// Aggiunta Layer
		this.tocInfo.onEachLayer(
				function(cat, lay, catIdx, layIdx) { this._createLayer(cat, lay, catIdx, layIdx, nodeI) },
				this,
				catIdx,
				false
		);
		
		if(cat.expanded){
			this.expandCategories(catIdx);
		/*	this.tocInfo.onEachParentCategory(
					function(parentCat, parentCatIdx) {
						if (!parentCat.expanded) {
							var parentNode = (parentCatIdx=="") ? this.treeRootNode : this.treeRootNode.findChild('cat', parentCatIdx, true); // this.findChildNodeByAttribute(this.treeRootNode, 'cat', parentCatIdx) 
								
							
							if(!parentNode.isExpanded()){
								parentNode.expand();
							}
						}
					}, 
					this,
					catIdx
			)*/
		}
		
    },
    
    /**
     * @method expandCategories
     * Espande tutte le categorie fino a quella rappresentata dacatIdx
     * 
     * @param {Number} catIdx
     * 
     * 
     */
    expandCategories: function(catIdx) {
    	Ext.suspendLayouts();
    	
    	var thisNode = this.treeRootNode.findChild('cat', catIdx, true);;
		if(!thisNode.isExpanded()){
			thisNode.expand();
		}
    	
		this.tocInfo.onEachParentCategory(
				function(parentCat, parentCatIdx) {
					if (!parentCat.expanded) {
						var parentNode = (parentCatIdx=="") ? this.treeRootNode : this.treeRootNode.findChild('cat', parentCatIdx, true); // this.findChildNodeByAttribute(this.treeRootNode, 'cat', parentCatIdx) 
						
						if(!parentNode.isExpanded()){
							parentNode.expand();
						}
					}
				}, 
				this,
				catIdx
		);
		Ext.resumeLayouts(true);
		
    },
    
    /**
     * @method _layToolTipCfg
     * @private
     * Espande tutte le categorie fino a quella rappresentata dacatIdx
     * 
     * @param {Object} lay
     * 
     * 
     */
    _layToolTipCfg: function(lay) {
    	
    	var layToolTipCfgTxt = this.calcolaLayToolTip(lay.catTreeIdx, lay.layTreeIdx);
    	layToolTipCfgTxt = (layToolTipCfgTxt) ? layToolTipCfgTxt : undefined;
    	
    	return lay.temporaryNotAvailable ? "Layer non disponibile per problemi sul server" : layToolTipCfgTxt;
    },
        
    /**
     * @method _createLayer
     * @private
     * 
     * 
     * @param {Object} cat
     * 
     * 
     * @param {Object} lay
     * 
     * 
     * @param {Object} catIdx
     * 
     * 
     * @param {Object} layIdx
     * 
     * 
     * @param {Object} nodeI
     * 
     * 
     * @param {Object} addPointCatId
     * 
     * 
     * @param {Object} addPointLayId
     * 
     * 
     * @param {Object} bBefore
     * 
     * 
     */
    _createLayer: function(cat, lay, catIdx, layIdx, nodeI, addPointCatId, addPointLayId, bBefore) {
    	
    	var bConIcone = this.getParametriMappaCurr().legenda.conIcone;

    	var iconClsObj=this.calcolaIconCls(catIdx, layIdx);
    	var iconCls = iconClsObj.iconCls;
    	bConIcone = bConIcone || iconCls.forzaConIcone;
    	var singleClass = this.getParametriMappaCurr().legenda.singleClass;
    	
    	
    	var me = this;
    	
    	var node1Cfg = {
    	    			text: lay.descr,
    	    			hidden: lay.hidden, 
						lay: layIdx,
						cat: catIdx,
						classi: null,
						layId: lay.layId,
						codTPN: lay.codTPN,
						withOpacitySettings: lay.withOpacitySettings,
						ownerTOC: this,				
						style: lay.style,
						allowDrag: this.tocInfo.orderChangeCapable,
						temporaryNotAvailable: lay.temporaryNotAvailable,
						checked: (lay.userSwitchable) ? lay.checked : undefined, 
						disabled: !(this.tocInfo.areAllParentCatChecked(catIdx) && cat.checked), //!cat.checked,
						
						iconCls: bConIcone ? iconCls : 'treenode-no-icon',
						qtip: this._layToolTipCfg(lay),   // utilizzo qtip e non qtipCfg altrimenti non riesco a cambiarlo in seguito con setTooltip
						href: (lay.clickUrl) ? "#" : null, // this.calcolaLayerClickUrl(lay),
						hrefTarget: (lay.clickTarget) ? lay.clickTarget : undefined,
						expanded: lay.expanded,
						itemType: lay.itemType
				};
		
		if (lay.itemType && lay.itemType=='text' && lay.itemIcon) {
			var serverIco = "";
			if (lay.itemIcon.indexOf("http://")==-1 && lay.itemIcon.indexOf("http://")==-1) {
    			serverIco = this.TOLOMEOServer + this.TOLOMEOContext + "/";
			}
    		node1Cfg.icon = serverIco+lay.itemIcon;
			node1Cfg.iconCls = 'iconClassToc';
			
    	}				
				
		var nodeJ = null;
  
		
		// se è richiesta la singola classe si mette l'icona a livello del layer
		if(singleClass){
			var paramScala = "";
			if ( this.scale && lay.stiliIndipDaScala==false && (lay.classi[0].nomeParamScala) && (lay.classi[0].nomeParamScala!="")) {
				paramScala = ((lay.classi[0].nome && lay.classi[0].nome.indexOf("?")!=-1) ? "&" : "?") +  lay.classi[0].nomeParamScala + "=" + this.scale;
			}
			
			var url = lay.classi[0].nome;
			var pat = /width\=\d+/;
			url = url.replace(pat, "");
			var pat = /height\=\d+/;
			url = url.replace(pat, "");
			var pat = /\&\&/;
			url = url.replace(pat, "&");
			
			node1Cfg.icon = url + paramScala;
		}
		
  
		if (addPointLayId) {
			
			var nodeAddPointCat = nodeI;
			//var nodeAddPointCat = this.treeRootNode.findChild('catId', addPointCatId, true);
			var addNodeLay = null;
			
			// Cerca la posizione di nodeAddPoint
			for (var i=0; i < nodeAddPointCat.childNodes.length; i++) {
				var n = nodeAddPointCat.getChildAt(i);
				if (n.get('layId')==addPointLayId) {
					if (bBefore) {
						addNodeLay = n;
					} else {
						if (i < nodeAddPointCat.childNodes.length -1) {
							addNodeLay = nodeAddPointCat.getChildAt(i+1);
						}
					}
					break;
				}
			}
			
			if (addNodeLay) {
				nodeJ = nodeI.insertBefore(node1Cfg, addNodeLay);	
			} else {
				nodeJ = nodeI.appendChild(node1Cfg, addNodeLay);
			}
		} else {
			nodeJ = nodeI.appendChild(node1Cfg);
		}
				
	/*	nodeJ.on("click", 
					function(nd) {
						this.fireEvent('layerLinkClick', nd.get('cat'), nd.get('lay')); 
					}, 
					this);
		*/		
		this.setNodeLayerVisibility(nodeJ, lay.visible); 
		
		if(lay.expanded){
			
			if(catIdx && nodeI){

				this.tocInfo.onEachParentCategory(
						function(parentCat, parentCatIdx) {
							if (!parentCat.expanded) {
								var parentNode = (parentCatIdx=="") ? this.treeRootNode : this.treeRootNode.findChild('cat', parentCatIdx, true);

								if(!parentNode.isExpanded()){
									parentNode.expand();
								}
							}
						}, 
						this,
						catIdx
				)
				
				if(!nodeI.isExpanded()){					
					nodeI.expand();
				}
				
							
			}						
		}
		
		// Aggiunta Classi
		// sse non è singola classe
		if( ! singleClass ){
		for (var k=0; k<lay.classi.length; k++) {
			var definedStyles = lay.definedStyles;
			var node2Opts = {	text: this._createTagVoceLegenda(lay.classi[k], lay), 
								lay: layIdx,
								cat: catIdx,
								classi: k,
								allowDrag: false,
								leaf:true
							} ;
			

			if (lay.classi[k].icoUrl!=null && lay.classi[k].icoUrl!="") {
				node2Opts.icon = this.TOLOMEOServer + lay.classi[k].icoUrl;
				node2Opts.iconCls = 'iconClassToc';
			} else {
				node2Opts.iconCls = 'treenode-no-icon';
			}; 
    		var nodeK = nodeJ.appendChild(node2Opts);
		}
		}
    },
    
    /**
     * @method createTOC
     * 
     * 
     * @param {Object} scale
     * 
     * 
     */
    createTOC: function (scale) {

    	this.callParent(arguments);
		this.tocInfo.onEachCategory(
				this._createCategory,
				this
		);
		
    	this.doLayout();
    	this.isTOCGUICreated = true;
    	if (this.waitMsgBox) this.waitMsgBox.hide();
    	// Riabilita toolbar
    	var toolbar = this.getDockedItems('toolbar[dock="top"]')[0];
    	toolbar.enable();
    	
    	this.fireEvent('tocGuiCreate');
	}, 
	
	/**
	 * @method updateTOC
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 * 
	 * @returns {Boolean}
	 * 
	 * 
	 */
	updateTOC: function(scale) {		
		this.callParent(arguments);
		
		this.treeRootNode.cascadeBy(
			function(nd) {
				if (nd.get('classi')==null && nd.get('lay')!=null) {
					this.setNodeLayerVisibility(nd, this.tocInfo.getCategoryInfo(nd.get('cat')).layers[nd.get('lay')].visible);
					
				} else if (nd.get('classi')!=null) {
					// ATTENZIONE: il testo in alcuni casi contiene anche la legendGraphic
					var layer = this.tocInfo.getCategoryInfo(nd.get('cat')).layers[nd.get('lay')];
					var classe = layer.classi[nd.get('classi')];
					var t = this._createTagVoceLegenda(classe, layer); 	
					if (t!=nd.get('text')) {
						nd.set('text', t);
						var lay = this.tocInfo.getCategoryInfo(nd.get('cat')).layers[nd.get('lay')];
						nd.parentNode.set('qtip',this._layToolTipCfg(lay));
					}
				}
				return true;
			},
			this
		)		
	},
	
	/**
	 * @method _createTagVoceLegenda
	 * @private
	 * 
	 * 
	 * @param {Object} classe
	 * 
	 * 
	 * @param {Object} layer
	 * 
	 * 
	 * @param {Object} scale
	 * 
	 *
	 */
	_createTagVoceLegenda: function(classe, layer) {
		
		var tag =  "";
		var src = classe.nome;
		var paramScala = "";
		var paramPos = "";
		var stile = (layer.style && layer.style!="") ? layer.style : "default";
		
		if (classe.tipoNome==1) {
			// Se legenda dipendente da scala
			if ( this.scale && layer.stiliIndipDaScala!=undefined && layer.stiliIndipDaScala==false && (classe.nomeParamScala) && (classe.nomeParamScala!="")) {
				paramScala = classe.nomeParamScala + "=" + this.scale;
				src += ((src.indexOf("?")!=-1) ? "&" : "?") + paramScala;
			}
			if (this.posObj && layer.stiliIndipDaPosizione!=undefined && layer.stiliIndipDaPosizione==false) {
				paramPos += "SRS=" + this.posObj.srid;
				paramPos += "&BBOX=" + this.posObj.bbox.left  
									+ ',' + this.posObj.bbox.bottom
									+ ',' + this.posObj.bbox.right
									+ ',' + this.posObj.bbox.top;
				paramPos += "&WIDTH="  + this.posObj.width;
				paramPos += "&HEIGHT=" + this.posObj.height;
				src += ((src.indexOf("?")!=-1) ? "&" : "?") + paramPos;
			}
			
			tag =  '<img src="' + src + '" alt="Stile applicato: ' + stile + '" title="Stile applicato: '  +stile + '" />';	
		} else {
			tag = classe.nome;
		}
		
		return tag;
	},
	
	/**
	 * @method setNodeLayerVisibility
	 * 
	 * 
	 * @param {Object} node
	 * 
	 * 
	 * @param {Object} visible
	 * 
	 * 
	 */
	setNodeLayerVisibility: function(node, visible) {
    	if (visible) {
    		node.set('nodeVisibleAtScale', true);
		} else {
			node.set('nodeVisibleAtScale', false);
		}

		var iconClsObj = this.calcolaIconCls(node.get('cat'), node.get('lay'), visible);
		if (iconClsObj != null) {
			node.set('iconCls',iconClsObj.iconCls);
		}
	},	
	
	
	/**
	 * @method setCategoryStateChange
	 * Aggiorna lo stato di una categoria a livello di treePanel quando viene notificata
	 * una modifica dalla classe padre.
	 * 
	 * @param {String} cat
	 * categoria della tocInfo
	 * 
	 * @param {Object} checked
	 * 
	 * 
	 */
	setCategoryStateChange : function(cat, checked) {
		this.callParent(arguments);
		
		if (this.tocInfo != null) {
			
			var category = this.tocInfo.getCategoryInfo(cat); 
			var categoryNode = this.treeRootNode.findChild('catId', category.catId, true);
			if(category.userSwitchable && (category.checked != categoryNode.get('checked'))) {
				categoryNode.set('checked', category.checked);
			}
	
			categoryNode.cascadeBy(
	    			function(nd) {
	    				if (nd!=categoryNode) {
	    					var currCatIdx = nd.get('cat');
	    					var currCat = this.tocInfo.getCategoryInfo(currCatIdx);
	    					if ( this.tocInfo.areAllParentCatChecked(currCatIdx) && 
	    						(nd.get('lay')==null || 
	    						(nd.get('lay')!=null && currCat.checked )) 
	    					   ) {
	    							nd.set('disabled', false);	
	    						}	    					
		    				else {
			    					nd.set('disabled', true); 
		    					}
	    				}
	    			}, this 	
	    		);
		}		
	},
	
	/**
	 * @method onTOCInfoCatTreeIdxUpdate
	 * Metodo invocato al cambio dell'indice di categoria su tocInfo. I diversi tipi di legenda devono implementarlo per gestire l'aggiornamento sulla GUI della legenda
	 * 
	 * @param {Number} catId
	 * 
	 * 
	 * @param {Number} oldCatTreeIdx
	 * indice che è stato cambiato
	 * 
	 * @param {Number} newCatTreeIdx 
	 * nuovo valore dell'indice
	 * 
	 */
	onTOCInfoCatTreeIdxUpdate: function(catId, oldCatTreeIdx, newCatTreeIdx) {
		var categoryNode = this.treeRootNode.findChild('catId', catId, true);
		if (categoryNode) {
			// Se non esiste è quella nuova
			categoryNode.set('cat', newCatTreeIdx);
		}
	},
	
	/**
	 * @method onTOCInfoLayIdxUpdate
	 * Metodo invocato al cambio dell'indice di layer su tocInfo. I diversi tipi di legenda devono implementarlo per gestire l'aggiornamento sulla GUI della legenda
	 * 
	 * @param {Number} layI
	 * id assoluto del nodo all'interno dell'albero
	 * 
	 * @param {Number} catTreeIdx
	 * vecchio indice categoria
	 * 
	 * @param {Number} oldLayTreeIdx
	 * indice layer che è stato cambiato
	 * 
	 * @param {Number} newCatTreeIdx
	 * nuovo indice categoria
	 * 
	 * @param {Number} newLayTreeIdx
	 * nuovo valore dell'indice di layer
	 * 
	 */
	onTOCInfoLayIdxUpdate: function(layId, catTreeIdx, oldLayTreeIdx, newCatTreeIdx, newLayTreeIdx) {
		/*var categoryNode = this.treeRootNode.findChild('catId', catTreeIdx, true);
		var node = this.treeRootNode.findChildBy(
			function(nd){
				return (nd.get('catId')== catTreeIdx && nd.get('layId')==oldLayTreeIdx);

			}, this, true);
		
		if (categoryNode) {
			var layerNode = categoryNode.findChild('layId', layId, true);
			layerNode.set('lay', newLayTreeIdx);
			layerNode.set('cat', newCatTreeIdx);
		}*/
		
		var node = this.treeRootNode.findChild('layId', layId, true);
		if (node) {
			node.set('lay', newLayTreeIdx);
			node.set('cat', newCatTreeIdx);
			// Aggiorna anche i nodi "classi"
			for (var i=0; i<node.childNodes.length; i++) {
				var n = node.childNodes[i];
				n.set('lay', newLayTreeIdx);
				n.set('cat', newCatTreeIdx);
				n.set('classi', i);
			}
		}
		
	},
	
	/**
	 * @method addCategoryExtend
	 * 
	 * 
	 * @param {Object} catInfo
	 * 
	 * 
	 * @param {Object} addPointCat
	 * 
	 * 
	 * @param {Object} bBefore
	 * 
	 * 
	 */
	addCategoryExtend: function(catInfo, addPointCat, bBefore) {
	
		this._createCategory(catInfo.tocInfoParams, catInfo.tocInfoParams.catTreeIdx, addPointCat.catId, bBefore);
		
	},
	
	/**
	 * @method
	 * Aggiunge un layer nella posizione indicata dai parametri.
	 * 
	 * @param {Object} paramsInfo
	 * Info relative al layer da inserire in paramsJS
	 * 
	 * @param {Object} layTocInfo
	 * Tocinfo del layer da aggiungere
	 * 
	 * @param {Object} serverInfo
	 * Info sul server del layer da inserire
	 * 
	 * @param {Object} addPointCat
	 * Indice della categoria nella quale viene aggiunto il layer 
	 * 
	 * @param {Object} addPointLay
	 * Indice layer prima o dopo del quale aggiungere il nuovo layer
	 * 
	 * @param {Boolean} bBefore
	 * indica se aggiungere prima o dopo
	 * 
	 */
	addLayerExtend: function(paramsInfo, layTocInfo, serverInfo, addPointCat, addPointLay, bBefore) {
	
		var nodeAddPointCat = this.treeRootNode.findChild('catId', addPointCat.catId, true);
		this._createLayer(addPointCat, layTocInfo, layTocInfo.catTreeIdx, layTocInfo.layTreeIdx, nodeAddPointCat, addPointCat.catId, (addPointLay) ? addPointLay.layId : null, bBefore);
	
			
	}
	
});

