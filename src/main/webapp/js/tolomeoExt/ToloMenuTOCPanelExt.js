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
 * @class TolomeoExt.ToloMenuTOCPanelExt
 * @extends TolomeoExt.ToloTOCPanelExt
 * 
 * 
 */
	
Ext.define('TolomeoExt.ToloMenuTOCPanelExt', {

	extend: 'TolomeoExt.ToloTOCPanelExt',
	
	alias: 'tx_toloMenuTOCPanelExt',

	/**
	 * @property {Object} categoryButton
	 * @private
	 * 
	 * 
	 */
	categoryButton: null,	
		
	/**
	 * @method initComponent
	 * Metodo relativo alla gestione Ext.
	 *  
	 */
	initComponent: function(){
        
		//Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);	
	
		//this.layout='hbox';
		this.callParent(arguments);
        
    },
    
    /**
     * @method checkItemChange
     * 
     * 
     * @param {Object} item
     * item.
     * 
     * @param {Boolean} checked
     * checked.
     * 
     */
    checkItemChange: function(item, checked) {
    	
    	var cat = item.attributes.cat;
    	var lay = item.attributes.lay;
    	
    	this.setLayerStateChange(item.attributes.cat, item.attributes.lay, checked);
    },
    
  /**
	 * @method setLayerStateChange
	 * Aggiorna lo stato di un layer a livello di menu items quando viene notificata
	 * una modifica dalla classe padre.
	 * 
	 * @param {String} cat
	 * 
	 * 
	 * @param {Number} lay
	 * layer della tocInfo
	 * 
	 * @param {Boolean} checked
	 * 
	 * 
	 */
	setLayerStateChange : function(cat, lay, checked) {
		this.callParent(arguments);
		if (this.tocInfo != null && lay != null) {
			
			var layer = this.tocInfo.getCategoryInfo(cat).layers[lay];
			
			for (var i=0; i<this.categoryButton.menu.items.length; i++) {
				var ck = this.categoryButton.menu.items.items[i];
				if (ck.attributes.layId==layer.layId) {
					if (ck.checked!=layer.checked) ck.setChecked(layer.checked);
				}
			}
			
			
		}		
	},

    /**
     * @method createTOC
     * 
     * 
     * @param {Object} obj
     * obj.
     * 
     */
    createTOC: function (obj) {

    	this.callParent(arguments);
		
		this.tocInfo.onEachCategory( 
	    	function(cat, catIdx) {	
    		
				    		//aggiungo bottone categoria
			    		this.categoryButton = new Ext.Button({
			    			text       : cat.catDescr,
							anchor     : '0',
							arrowAlign : 'bottom',
							iconAlign: 'top',
							cls        : 'bold',
							menu: {
				            	xtype: 'menu',
				            	cls: 'clearCSS'
							}
						});
						
						this.categoryButton.attributes = {};
			    		this.categoryButton.attributes.cat = catIdx;
			    		this.categoryButton.attributes.catId = cat.catId;
			    		this.categoryButton.attributes.lay = null;
			    		this.categoryButton.attributes.classi = null;
			    		
			    		this.add(this.categoryButton);
			    		
			    		var listenersCheckChange = {checkchange: {fn: this.checkItemChange, scope: this}};
		    			
			    		//aggiungo menu i cui item sono i layer della stessa
			    		for (var j=0; j<cat.layers.length; j++) {
			        			
			    			var layerItemMenu = new Ext.menu.CheckItem({
			        			text: cat.layers[j].descr,
								checked: cat.layers[j].checked,
								listeners: listenersCheckChange
							});
			        			
							layerItemMenu.attributes = {};			
							layerItemMenu.attributes.cat = catIdx;
			        		layerItemMenu.attributes.lay = j;
			        		layerItemMenu.attributes.codTPN = cat.layers[j].codTPN;
			        		layerItemMenu.attributes.layId = cat.layers[j].layId;
			        		layerItemMenu.attributes.classi = null;
			        		layerItemMenu.attributes.withOpacitySettings= cat.layers[j].withOpacitySettings;
							layerItemMenu.attributes.ownerTOC = this;
			    		
			        		this.categoryButton.menu.add(layerItemMenu);
			        		this.doLayout(true,true);
			    		}
		    	},
		    	this);
		
	}

});

