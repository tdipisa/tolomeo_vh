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
 * Class: TolomeoExt.OLS.ReverseGeocodingForm
 * Form di reverse geocoding
 * @author Ugo Paternostro <br/>phoops s.r.l.
 */
Ext.define('TolomeoExt.OLS.GeocodingListPanel', {
	extend: 'Ext.grid.GridPanel',
	
    itemId:	"streetsList",
    
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
	
    initComponent:function() {
    	this.addEvents('addressSelected');
    	this.addEvents('addressFocus');
    	this.addEvents('addressBlur');
    	this.addEvents('startAddressSelected');
    	this.addEvents('endAddressSelected');
    	this.addEvents('viaAddressSelected');
    	
        var config = {
        		frame:true,
            	stripeRows: true,
//                autoExpandColumn: 'street',
                height: 240,
               // title: 'Open LS Results',
                // config options for stateful behavior
                stateful: true,
                bodyStyle:'padding:5px',
                cls: 'floating-form_right',

                singleSelect : true,
                reserveScrollOffset: true,

                store: new Ext.data.ArrayStore({
                    fields: [
                       {name: 'street', convert: function(value, record) {
                           return record.raw.address.streetAddress.street;
                       }},
                       {name: 'postalcode', convert: function(value, record) {
                           return record.raw.postalCode;
                       }},
                       {name: 'place', convert: function(value, record) {
                           return record.raw.address.places['Municipality'];
                       }},
                       {name: 'secondarysubdivision', convert: function(value, record) {
                           return record.raw.address.places['CountrySecondarySubdivision'];
                       }},
                       {name: 'subdivision', convert: function(value, record) {
                           return record.raw.address.places['CountrySubdivision'];
                       }},
                       {name: 'country', convert: function(value, record) {
                           return record.raw.address.countryCode;
                       }},
                    ]
                }),
                refreshData: function(){
                    this.store.loadData(this.model.geocodedAddresses);
                },
        		viewConfig: {
	    			//firstCls: null,
	    			trackOver: true
	    		},
	    		listeners: {
        			'itemmouseenter':	{
        									fn: function(record, item, index, e) { 
						        				this.fireEvent('addressFocus', item); 
						        			},
						        			scope: this,
						    			},
        			'itemmouseleave':	{
        									fn: function(record, item, index, e) { 
						        				this.fireEvent('addressBlur', item); 
						        			},
						        			scope: this,
						    			},
        			'itemclick':		{
        									fn: function(obj, record, item, index, e) {
        										// Evitiamo di far partire due eventi nel caso di click su un'icona di un action column
        										if (e.getTarget().className.indexOf("action-col") == -1) {
        											this.fireEvent('addressSelected', record);
        										}
						        			},
						        			scope: this,
					        			},
	    		},
                        columns: [
                                {
                              	  	menuDisabled: true,
                                    xtype: 'actioncolumn',
                                    width: 25,
                                    items: [{
                                        icon   : this.iconBasePath + 'ols/MapMarker.png',
                                        tooltip: 'Zoom into map',
                                        scope: this,
                                        handler: function(view, rowIndex, colIndex, item, e, record, row) {
                           			        this.fireEvent('addressSelected', record);
                                        }
                                    }],
                                },
                                  {
                                      id       :'street',
                                      header   : 'Nome strada',
                                      width    : 220,
                                      sortable : true,
                                      dataIndex: 'street'
                                  },
                                  {
                                      header   : 'CAP',
                                      width    : 40,
                                      sortable : true,
                                      dataIndex: 'postalcode'
                                  },
                                  {
                                      header   : 'Luogo',
                                      width    : 150,
                                      sortable : true,
                                      dataIndex: 'place'
                                  },
                                  {
                                      header   : 'Provincia',
                                      width    : 80,
                                      sortable : true,
                                      dataIndex: 'secondarysubdivision'
                                  },
                                  {
                                      header   : 'Regione',
                                      width    : 80,
                                      sortable : true,
                                      dataIndex: 'subdivision'
                                  },
                                  {
                                      header   : 'Nazione',
                                      width    : 50,
                                      sortable : true,
                                      dataIndex: 'country'
                                  },
                                  {
                               	  	  menuDisabled: true,
                                      xtype: 'actioncolumn',
                                      width: 30,
                                      sortable : false,
                                      items: [{
                                          icon   : this.iconBasePath + 'ols/start.png',
                                          tooltip: 'Partenza',
                                          scope: this,
                                          handler: function(view, rowIndex, colIndex, item, e, record, row) {
                             			      this.fireEvent('startAddressSelected', record);
                                          }
                                      }]
                                  },
                                  {
                               	  	  menuDisabled: true,
                                      xtype: 'actioncolumn',
                                      width: 30,
                                      sortable : false,
                                      items: [{
                                          icon   : this.iconBasePath + 'ols/via.png',
                                          tooltip: 'Destinazione intermedia',
                                          scope: this,
                                          handler: function(view, rowIndex, colIndex, item, e, record, row) {
                             			      this.fireEvent('viaAddressSelected', record);
                                          }
                                      }]
                                  },
                                  {
                               	  	  menuDisabled: true,
                                      xtype: 'actioncolumn',
                                      width: 30,
                                      sortable : false,
                                      items: [{
                                          icon   : this.iconBasePath + 'ols/stop.png',
                                          tooltip: 'Arrivo',
                                          scope: this,
                                          handler: function(view, rowIndex, colIndex, item, e, record, row) {
                             			      this.fireEvent('endAddressSelected', record);
                                          }
                                      }]
                                  }
                                  
                              ]
        };
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
    }
});