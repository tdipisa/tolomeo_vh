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
 * Class: TolomeoExt.OLS.NavigationListPanel
 * Pannello per le istruzioni di navigazione
 * @author Ugo Paternostro <br/>phoops s.r.l.
 */
Ext.define('TolomeoExt.OLS.NavigationListPanel', {
	extend: 'Ext.grid.GridPanel',
	
    itemId:	"navigationList",
    
	/** 
	 * Property: model
	 * 
	 */
	model: null,
    
    initComponent:function() {
    	this.addEvents('navigationSelected');
    	this.addEvents('navigationFocus');
    	this.addEvents('navigationBlur');
    	
        var config = {
        		//frame:true,
//            	stripeRows: true,
//                autoExpandColumn: 'street',
//            	width: '78%',
//            	width: '22%',
                height: 185,
               // title: 'Navigation Information',
                // config options for stateful behavior
                stateful: true,
//                bodyStyle:'padding:5px 5px 0',
//                cls: 'floating-form_left',
                store: new Ext.data.ArrayStore({
                    fields: [
                             {name: 'navigation', convert: function(value, record) {
                                 return record.raw.instruction;
                             }},
                             {name: 'instructionId', convert: function(value, record) {
                                 return record.raw.instructionId;
                             }}]
                      }),
                singleSelect : true,
                header: false,
//                reserveScrollOffset: true,
                refreshData: function()
                {
                	this.store.loadData(this.model.routeResponse.instructions);
                },
	    		listeners: {
        			'itemmouseenter':	{
        									fn: function(thisgrid, record, item, index, e) { 
						        				this.fireEvent('navigationFocus', index); 
						        			},
						        			scope: this,
						    			},
        			'itemmouseleave':	{
        									fn: function(thisgrid, record, item, index, e) { 
						        				this.fireEvent('navigationBlur', index); 
						        			},
						        			scope: this,
						    			},
        			'itemclick':		{
        									fn: function(thisgrid, record, item, index, e) { 
						        				this.fireEvent('navigationSelected', index); 
						        			},
						        			scope: this,
					        			},
	    		},
                columns: [
                         {
                              itemId   :'navigation',
                      //        header   : 'Navigation Info',
                              width    : '100%',
                              sortable : false,
                              dataIndex: 'navigation'
                          }
                      ]
        };
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
    },
    
    routingInformationSelect: function(instructionId) {
    	var idx = this.store.find('instructionId', instructionId);
    	this.getSelectionModel().select(idx);
	}, 
	
	routingInformationDeSelect: function(instructionId) {
		var idx = this.store.find('instructionId', instructionId);
		this.getSelectionModel().deselect(idx);
	}
    
});
