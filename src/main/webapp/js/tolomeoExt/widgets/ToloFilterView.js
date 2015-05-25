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

Ext.ns('TolomeoExt.widgets');

/**
 * Widget per la visualizzazione del filtro impostato dall'utente nella form.
 * Le modifiche apportate dall'untente al filtro sono formattate in formato stringa.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.ToloFilterView', {

	extend: 'Ext.Panel',
	
	padding: '0 5 0 5',

	/**
     * Inizializza un componente di tipo TolomeoExt.widgets.ToloFilterView.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
	initComponent: function(config){	
		this.border = 0;
			
		this.filterTypeStore = Ext.create('Ext.data.Store', {
		    fields: [{
		    	name: 'type', 
		    	mapping: 'type'
		    },{
		    	name: 'name', 
		    	mapping: 'name'
		    }],
		    data: [
	           {type: 1, name: "OGC"},
	           {type: 2, name: "CQL"}
		    ]
		});

		this.filterTypeCombo = Ext.create('Ext.form.ComboBox', {
			typeAhead: true,
			forceSelection: true, 
			width: 200,
			queryMode: 'local',
			triggerAction: 'all',
			selectOnFocus: true,
			editable: false,
			fieldLabel: 'Tipo filtro',
			name: 'name',
			value: 1,
			valueField: 'type',
			displayField: 'name',
			store: this.filterTypeStore,
		    listeners:{
		         scope: this,
		         select: function(combo, records, eOpts){
		        	 this.fireEvent("typeselected", records);
		         }
		    }
		});	
		
		this.filterView = Ext.create('Ext.form.TextArea', {
			flex: 1,
	        xtype: 'textareafield',
	        grow: true,
	        name: 'filterView',
	        fieldLabel: 'Filtro',
	        anchor: '100%',
	        labelAlign: "top",
	        height: 100
	    });
		
		var viewContainer = Ext.create('Ext.Panel', {
			border: false,
			height: 120,
		    layout: {
		        type: 'hbox',
		        align: 'middle'
		    },
		    items: [
	            this.filterView,
	            {
			        xtype: 'button',
			        iconCls: "filterviewupdate",
//			        style: "padding-top: 20px;",
			        tooltip: "Aggiorna Filtro",
			        handler: function(button){
			        	var selectedRecord = this.filterTypeCombo.findRecordByValue(this.filterTypeCombo.getValue());
			        	this.fireEvent("typeselected", selectedRecord);
			        },
			        scope: this
			    }
	        ]
		});
				
		this.filterViewFieldSet = Ext.create('Ext.form.FieldSet',{
			title: 'Vista filtro',
			anchor: "-1",
			autoWidth: true,
			autoHeight: true,
			collapsed : true,
			checkboxToggle: true,
			items:[this.filterTypeCombo, viewContainer]
		});
		
		this.callParent();
		
		this.add(this.filterViewFieldSet);
    },
    
	/**
     * Imposta all'interno della TextArea definita la stringa corispondente il filtro selezionato.
     * @param {String} filterString Il filtro in formato stringa.
     */
    setFilter: function(filterString){
    	this.filterView.setRawValue(filterString);
    },
    
	/**
     * Reimposta la TextArea contenente il filro in formato stringa.
     *
     */
    resetView: function(){
    	this.filterView.setRawValue("");
    	this.filterTypeCombo.reset();
    }
    
});
