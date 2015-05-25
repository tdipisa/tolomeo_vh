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
 * @class TolomeoExt.ToloScalePanelExt
 * @extends Ext.FormPanel
 * 
 * 
 */ 
Ext.define('TolomeoExt.ToloScalePanelExt', {

	extend: 'Ext.FormPanel',
 
 	/** 
	   * @property {Boolean} [autoHeight=true]
	   * 
	   * 
		 */
        autoHeight: true,
        
    	/** 
         * @property {String} [bodyCssClass='scaleFormCss']
         * 
         * 
      	 */
        bodyCls : 'scaleFormCss',  
        
    	/** 
         * @property {Number} [width=190]
         * 
         * 
      	 */
        width: 190,
        
    	/** 
         * @property {Boolean} [bodyBorder=true]
         * 
         * 
      	 */
        bodyBorder: true,
        
    	/** 
         * @property {Array} [defaultZoomLevels=[]]
         * 
         * 
      	 */
        defaultZoomLevels: [],
        
    	/** 
         * @property {Object} scaleCombo
         * 
         * 
      	 */
        selectorConfig : null,    
        
        /** 
         * @property {Boolean} [settableZoom=true]
         * 
      	 */
        settableZoom : true,
        
    	/**
         * @method initComponent
         * Crea un nuovo TolomeoExt.ToloScalePanelExt.
         * 
         */			
        initComponent: function() {
          
          this.addEvents('scalechange');
          
          this.callParent(arguments);
		 // Ext.util.CSS.createStyleSheet('.scaleFormCss{padding: 5px 0px 2px 0px; background-color: transparent;   }','scaleFormCss');
		  this.defaultZoomLevels.sort(function(a,b){return b - a});
		      
          var myData = new Array();		      
		      
		  for(var i = 0; i < this.defaultZoomLevels.length; i++){            
          	myData.push([this.defaultZoomLevels[i],'1 : ' + Ext.util.Format.number(this.defaultZoomLevels[i],'0,000',false)]);            
          }
		  
          var myStore = new Ext.data.ArrayStore({
              fields: [
                {name: 'scaleValue', type: 'number'},
	            {name: 'scaleDescr', type: 'string'},
	            {name: 'custom', type: 'boolean'}                 
              ],
              data : myData,
              sorters: [{
		         sorterFn: function(o1, o2){
		                
			         var v1 = o1.get('scaleValue');
			         var v2 = o2.get('scaleValue');
			    
			         if (v1 == v2) {
			         	return 0;
			         }		    
			         
			         return v1 < v2 ? 1 : -1;
		         }
		      }]
          });
          
          var selectorConfig = Ext.applyIf({
          	store:myStore,
          	editable: this.settableZoom          
          }, this.selectorConfig);
          
                    
          this.zoomSelector = new TolomeoExt.ToloScaleComboExt(selectorConfig);    
          this.zoomSelector.on('scalechange', function(val) {this.fireEvent('scalechange', val)} , this );      
          this.add(this.zoomSelector);                   
        
        },
        
        /**
         * @method bindToViewerPanel
         * 
         * 
         * @param {Object} viewer
         * viewer
         * 
         */
        bindToViewerPanel: function(viewer) { 
      		if (viewer!=null) {
      			// mi registro sulla variazione di scala del viewer
      			viewer.on('scalechange', this.setScale, this );      			
      			viewer.on('onAfterPostInit', 
      				function(){ this.on('afterlayout', function(){ 
									this.setScale(viewer.pluginGetCurrentZoom()); 
								}, 
					this, {single: true});}, this );       			
      			// se la combo non perde il focus firefox dopo il cambio di dimensione non sente il click
      			viewer.on('resize', function(){if(this.zoomSelector.getEl())this.zoomSelector.getEl().dom.blur()}, this );		      			
      		}
      	},
      	
      	/**
      	 * @method setScale
      	 * 
      	 * 
      	 * @param {Number} val
      	 * val
      	 * 
      	 */
      	setScale : function(val){      	      		
        	this.zoomSelector.forceValue(Math.round(val));          
        }                               
});    
