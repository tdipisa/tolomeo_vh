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
 * Class: TolomeoExt.OLS.ViaListPanel
 * Pannello per le tappe intermedie
 * @author Ugo Paternostro <br/>phoops s.r.l.
 * 
 */
Ext.define('TolomeoExt.OLS.ViaListPanel', {
	extend: 'Ext.grid.GridPanel',
	
	itemId: "viaPointList",
	
	/** 
	 * Property: iconBasePath
	 * 
	 */
	iconBasePath: null,
	
	/** 
	 * Property: model
	 * 
	 */
	model: null,
	
	initComponent: function() {
		// Eventi
    	this.addEvents('viaPointFocus');
    	this.addEvents('viaPointBlur');
    	this.addEvents('viaPointSelected');
    	this.addEvents('deleteViaPoint');
    	this.addEvents('moveViaPoint');
    	
		var config = {
				collapsible: true,
			    requires: [
			               'Ext.grid.RowNumberer'
			           ],
			  // frame: true,
				stripeRows: true,
//				width: '30%',
				height: 240,
				title: 'Destinazioni intermedie',
				// config options for stateful behavior
                stateful: true,
                bodyStyle:'padding:5px',
              //  cls: 'floating-form_right',
                store: new Ext.data.ArrayStore({
                    fields: [
                             {name: 'stopAt', convert: function(value, record) {
                                 return record.raw.street;
                             }}
                          ],
                    data: this.model.viaPoints,
                      }),
                singleSelect : true,
            //    autoScroll: true,
                //reserveScrollOffset: true,
	    		listeners: {
        			'itemmouseenter':	{
        									fn: function(record, item, index, e) { 
						        				this.fireEvent('viaPointFocus', item); 
						        			},
						        			scope: this,
						    			},
        			'itemmouseleave':	{
        									fn: function(record, item, index, e) { 
						        				this.fireEvent('viaPointBlur', item); 
						        			},
						        			scope: this,
						    			},
        			'itemclick':		{
        									fn: function(record, item, index, e) { 
						        				this.fireEvent('viaPointSelected', item); 
						        			},
						        			scope: this,
					        			},
	    		},
        		columns: [
                          {
                        	  xtype: 'rownumberer'
                          }, 
                           {
                        	  menuDisabled: true,
                               itemId       :'stopAt',
                              // header   : 'Stop At',
                               width    : 160,
                               sortable : false,
                               dataIndex: 'stopAt'
                           },
                           {
                        	   menuDisabled: true,
                               xtype: 'actioncolumn',
                               width: 30,
                               sortable : false,
                               items: [{
                                   icon   : this.iconBasePath + 'elimina.gif',
                                   tooltip: 'Elimina',
                                   scope: this,
                                   handler: function(view, recordIndex, cellIndex, item, e, record, row)
                                   {
                                	   this.fireEvent('deleteViaPoint', recordIndex);
                                   }
                               }]
                           },
                           {
                        	   menuDisabled: true,
                        	   xtype: 'actioncolumn',
                               width: 30,
                               sortable : false,
                               items: [{
                                   icon   : this.iconBasePath + 'ols/top.png',
                                   tooltip: 'Sposta in alto',
                                   isDisabled: function(view, rowIndex, colIndex, item, record)
                                   {
                                	   return rowIndex == 0;
                                   },
                                   scope: this,
                                   handler: function(view, recordIndex, cellIndex, item, e, record, row)
                                   {
                                	   this.fireEvent('moveViaPoint', recordIndex, -1);
                                   }
                               }]
                           },
                           {
                        	   menuDisabled: true,
                        	   xtype: 'actioncolumn',
                               width: 30,
                               sortable : false,
                               items: [{
                                   icon   : this.iconBasePath + 'ols/down.png',
                                   tooltip: 'Sposta in basso',
                                   isDisabled: function(view, rowIndex, colIndex, item, record)
                                   {
                                	   return rowIndex == record.store.data.length - 1;
                                   },
                                   scope: this,
                                   handler: function(view, recordIndex, cellIndex, item, e, record, row)
                                   {
                                	   this.fireEvent('moveViaPoint', recordIndex, +1);
                                   }
                               }]
                           }
                          ],
            changeViaAddresses: function()
            {
            	this.store.loadData(this.model.viaPoints);
            },
		};
		
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
	}
});
