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
 * @class TolomeoExt.ToloTimeMachineMultiPanel
 * @extends Ext.Panel
 * Pannello ExtJs che implementa la funzionalità TimeMachine multipla
 * 
 * @param {Object} config
 * 
 * 
 * @param {Object} config.paramsJS
 * Oggetto i parametri contenuti nel file di preset.
 * 
 * @author Ing. Alessandro Radaelli
 */
Ext.define('TolomeoExt.ToloTimeMachineMultiPanel', {
	
		extend: 'Ext.Panel',

		/** 
		 * @property {Object} paramsJS
		 * 
		 * 
		 */
		paramsJS : null,
		
		
		/** 
		 * @property {TolomeoExt.ToloViewerOLPanel} viewer 
		 * 
		 * 
		 */
		viewer: null,
			
		/** 
		 * @property {Object} voices
		 * 
		 * 
		 */
		voices: null,
			
		/** 
		 * @property {Object} timeMachinePanels
		 * 
		 * 
		 */
		timeMachinePanels: null,
		
		/** 
		 * @property {Object} draggableParent
		 * 
		 * 
		 */
		draggableParent: null,
		
		/** 
		 * @method initComponent
		 * 
		 * 
		 */
		initComponent: function(){
			
			this.frame= false;
			
			this.timeMachinePanels = [];
			for (var i = 0; i<this.paramsJS.mappe.mappaList[0].timeMachineList.length; i++) {
				this.timeMachinePanels.push(null);
			}
			
			//this.tbar = { items: this.createMenuVoices() };
			//this.contextMenu = this.createContextMenus();
			
			this.layout='fit';
			this.callParent(arguments);
			
			//this.setDraggableObj(ownerCt);
			this.on('added',  function(thisComponent, ownerCt, index) { 
												if (ownerCt.draggable) this.draggableParent= ownerCt;
												this._layoutTmPanels(1);
												/*for (var i=0; i < this.timeMachinePanels.length; i++) {
													this.timeMachinePanels[i].setDraggableObj(this.draggableParent);
												}*/
										},  
										this, 
										{single: true});
			

		}, 
		
		/** 
		 * @method _layoutTmPanels
		 * 
		 * 
		 * @param {Object} tipoLayout
		 * 
		 * 
		 */
		_layoutTmPanels: function(tipoLayout) {
			
			switch (tipoLayout) {
			case 1: 
				var tabsContents = [];
				for (var i = 0; i<this.paramsJS.mappe.mappaList[0].timeMachineList.length; i++) {
					this.timeMachinePanels[i] = this.createNewTimeMachinePanel(i); 
					tabsContents.push({ title: this.paramsJS.mappe.mappaList[0].timeMachineList[i].nome,
										layout: 'fit',
										items: [this.timeMachinePanels[i]]});
				}
				
				//activeItem: 0,
				//
				//{ items: [{ text: 'aaa'}, ], { text: 'aaa'} }
				var tabs = new Ext.TabPanel({ activeItem: 0, items: tabsContents });
				this.add(tabs);
				this.doLayout();
				
				this.on('afterlayout', function() {
					for (var i=0; i < tabsContents.length; i++) {
						this.timeMachinePanels[i].calculateAutoOffset();
						this.timeMachinePanels[i].reloadItems();
					}
				}, this);
				
				//afterrender
				tabs.on('tabchange', function(tabpanel, tab) {
					var tm = tab.items.items[0];
					//for (var i=0; i < tabsContents.length; i++) {
					tm.setDraggableObj(this.draggableParent);
					tm.calculateAutoOffset();
					tm.reloadItems();
					
					//this.timeMachinePanels[i].setDraggableObj(this.draggableParent);
					//this.timeMachinePanels[i].calculateAutoOffset();
					//this.timeMachinePanels[i].reloadItems();
					//}
				}, this); //, {single:true}
				
				break;
			case 2: 
				break;
			
			}
		},
		
		/** 
		 * @method cambiaTimeMachine
		 * 
		 * 
		 * @param {Number} index
		 * 
		 * 
		 */
		cambiaTimeMachine: function(index){

			this.timeMachinePanels[index]=this.createNewTimeMachinePanel(index);
			
			this.removeAll(true);
			this.add(this.timeMachinePanels[index]);
			this.doLayout();
			this.timeMachinePanels[index].calculateAutoOffset();
			this.timeMachinePanels[index].reloadItems();
		},
		
		/** 
		 * @method createNewTimeMachinePanel
		 * 
		 * 
		 * @param {Object} timeMachineToShow
		 * 
		 * 
		 */
		createNewTimeMachinePanel: function(timeMachineToShow) {

			var pnl = new TolomeoExt.ToloTimeMachinePanel({
							aaaa: timeMachineToShow,
							viewer: this.viewer,
							paramsJS: this.paramsJS,
							cls: 'clsTimeMachinePanel',
							timeMachineToShow: timeMachineToShow,
							autoDraggableDetect: false
					});

			pnl.on('afterrender', 
					function() {
						var el = pnl.getEl();
						//pnl.getEl().on('contextmenu', function( e, t, o) { e.stopEvent(); this.contextMenu.showAt(e.getXY());}, this);

						if (this.draggableParent!=undefined && this.draggableParent!=null) {
							pnl.setDraggableObj(this.draggableParent);
						}
						
					}, this, {single: true});
			
			//this.on('added',  function(thisComponent, ownerCt, index) { this.setDraggableObj(ownerCt); },  this.pnl, {single: true});
			//pnl.calculateAutoOffset();
        	//pnl.reloadItems();
        	
			return pnl;
		}, 
		
		/** 
		 * @method createContextMenus
		 * 
		 * 
		 */
		createContextMenus: function() {
			var voices = this.createMenuVoices();
			var ctxMenu = new Ext.menu.Menu({
								items: voices
								//menu: {
								//		items: voices
								//	}
								});
			return ctxMenu;
		},
		
		/** 
		 * @method createMenuVoices
		 * 
		 * 
		 */
		createMenuVoices: function() {
			//if (this.voices!=null) return this.voices;
			
			this.voices = [];
			
			// Scelta timemachine
			var store = new Ext.data.JsonStore({
	        	//id: 0,
	        	fields: [
	        	         'nome', 'layerList'],
	        	 data: this.paramsJS.mappe.mappaList[0].timeMachineList
	        	 //[[1, 'item1'], [2, 'item2']]
	    	});
			this.cmbScelta = new Ext.form.ComboBox({
							store: store,
							//valueField: 'myId',
						    displayField: 'nome',
						    forceSelection: true,
						    editable: false,
						    autoSelect: true,
						    typeAhead: true,
						    triggerAction: 'all',
						    fieldLabel: 'Nome',
						    //lazyRender:false,
						    mode: 'local',
						    listeners: {
						    	select: { fn: function( combo, record, index) { this.cambiaTimeMachine(index)}, scope: this}
						    }
		
			});
			this.voices.push(this.cmbScelta);
			
			this.voices.push({
					//xtype: 'menuitem',
					text: 'Layout',
					menu: {
						items: [
								{
								 	checked: true, 	
									text: 'Toolbar',
									listeners: {
										click: { fn: function(thisBtn, e) { if (thisBtn.checked) {
																		this.getTopToolbar().hide();
																		//thisBtn.setChecked(false);
																	} else {
																		this.getTopToolbar().show();
																		//thisBtn.setChecked(true);
																	}},
												  scope: this
												}
									}
								}, '-', {
						        	text: 'Singolo'
						        },{
						        	text: 'Tab'
						        }]	
					}
					
			});
			
			return this.voices;
			
		}
				
	});
