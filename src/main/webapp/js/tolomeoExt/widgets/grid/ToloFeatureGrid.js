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

Ext.ns('TolomeoExt.widgets.grid');

/**
 * Griglia Ext dinamica per gestire la visualizzazione dei risultati 
 * di una ricerca sulla base del filtro composto.
 *
 * @author Tobia Di Pisa at tobia.dipisa@geo-solutions.it
 */
Ext.define('TolomeoExt.widgets.grid.ToloFeatureGrid', {
	
	extend: 'Ext.grid.GridPanel',
	
    alias: "widget.tolomeo_featuregrid",

	/**
     * @property {Object} schema
	 * Lo schema per la griglia.
     */
	 
	/**
     * @property {Ext.form.DateField.prototype.format} dateFormat
	 * Lo schema per la griglia.
     */
	 
	/**
     * @property {Ext.form.TimeField.prototype.format} timeFormat
	 * Lo schema per la griglia.
     */

	/**
     * @cfg {String} actionTooltip
     *
     */
	actionTooltip: "Zoom alla Feature",
    
	/**
     * Inizializza un nuovo TolomeoExt.widgets.grid.ToloFeatureGrid.
     * @param {Object} [config] Un opzionale oggetto di configurazione per il componente ExtJs.
     */
    initComponent: function(config){
        if (!this.dateFormat) {
            this.dateFormat = Ext.form.DateField.prototype.format;
        }
        if (!this.timeFormat) {
            this.timeFormat = Ext.form.TimeField.prototype.format;
        }
        
        if(this.store) {
            this.cm = this.createColumnModel(this.store);
        }
        
        this.callParent();
    },

	/**
     * Cancella ogni cosa creata prima di chiamare il distruttore della classe padre.
     * 
     */
    onDestroy: function() {
        TolomeoExt.widgets.grid.FeatureGrid.superclass.onDestroy.apply(this, arguments);
    },
    
	/**
     * Imposta lo store per questa griglia, riconfigurando il modello delle colonne.
     * @param {Ext.Data.Store} store Lo store da impostare.
	 * @param {Array} schema Schema opzionale per determinare i campi appropriati da mostrare per la griglia.
     */
    setStore: function(store, schema) {
        if (schema) {
            this.schema = schema;
        }
        
        if (store) {
            this.reconfigure(store, this.createColumnModel(store));
        }
    },

	/**
     * Restituisce la configurazione per il modello delle colonne.
     * @param {Ext.Data.Store} store Lo store corrente da usare.
	 * @return {Array} Il modello delle colonne
     */
    getColumns: function(store) {
//        function getRenderer(format) {
//            return function(value) {
//                //TODO When http://trac.osgeo.org/openlayers/ticket/3131
//                // is resolved, change the 5 lines below to
//                // return value.format(format);
//                var date = value;
//                if (typeof value == "string") {
//                	date = Date.parseDate(value.replace(/Z$/, ""), "c");
//                }
//                return date = date ? date.format(format) : value;
//            };
//        }
		
        var columns = [{
			xtype: 'actioncolumn',
			header: "", 
			width: 30,
			hidden: false,
			scope: this,
			items: [{
				iconCls: 'zoomaction',
				tooltip: this.actionTooltip,
				scope: this,
				handler: function(grid, rowIndex, colIndex){
					var store = grid.getStore();
					var row = store.getAt(rowIndex);
					var feature = row.data;
					if(feature){
						
						var geometry = OpenLayers.Geometry.fromWKT(feature.geometry);
						var bounds = geometry.getBounds();
						if(bounds){
							
							this.fireEvent("zoomtofeatureextent", {dataExtent: bounds});
// RESTORE THIS
//							grid.getSelectionModel().selectRow(rowIndex);					
						}
					}
				}
			}]
		}];
				
		var name, dbname, type, xtype, format, renderer;	
		
		if(this.schema){			
			var fields = this.store.model.prototype.fields;
			
			for(var i=0; i<this.schema.length; i++){
				var item = this.schema[i];
				
	            if (item) {
	                name = item.get("name");
	                dbname = item.get("dbname");
	                type = item.get("type");
	                format = null;
	                switch (type) {
	                    case "java.util.Date":
	                        format = this.dateFormat;
	                    case "java.util.Calendar":
	                        format = format ? format : this.dateFormat + " " + this.timeFormat;
	                        xtype = undefined;
	                        renderer = Ext.util.Format.dateRenderer(format) //getRenderer(format);
	                        break;
	                    case "java.lang.Boolean":
	                        xtype = "booleancolumn";
	                        break;
	                    case "java.lang.String":
	                        xtype = "gridcolumn";
	                        break;
	                    default:
	                        xtype = "numbercolumn";
	                }
	            } 
	            
                columns.push({
                    dataIndex: dbname,
                    header: name,
                    sortable: true,
                    xtype: xtype,
                    format: format,
                    renderer: xtype ? undefined : renderer
                });
			}
		}
        
        return columns;
    },

	/**
     * Invocare questo metodo per creare il modello delle colonne per la griglia.
     * @param {Ext.Data.Store} store Lo store corrente su cui creare il modello.
	 * 
     */
    createColumnModel: function(store) {
    	 this.columns = this.getColumns(store);
    	 return this.columns;
    }
    
});
