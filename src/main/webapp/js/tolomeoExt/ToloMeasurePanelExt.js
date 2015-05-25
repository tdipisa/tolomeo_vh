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
 * @class TolomeoExt.ToloMeasurePanelExt
 * @extends Ext.Window
 *
 */
Ext.define('TolomeoExt.ToloMeasurePanelExt', {
	extend: 'Ext.Window',	
 
	/** 
	 * @property {Boolean} [closable=false]
	 * 
	 * 
	 */
	closable: false,

	/** 
	 * @property {Boolean} [bodyBorder=false]
	 * 
	 * 
	 */
	bodyBorder: false,

	/** 
	 * @property {Boolean} [border=false]
	 * 
	 * 
	 */
	border: false,

	/** 
	 * @property {Boolean} [frame=true]
	 * 
	 * 
	 */
	frame: true,
	
	/** 
	 * @property {Boolean} [header=false]
	 * 
	 * 
	 */
	header: false,

	/** 
	 * @property {Boolean} [resizable=false]
	 * 
	 * 
	 */
	resizable: false,

	/** 
	 * @property {Boolean} [constraint=true]
	 * 
	 * 
	 */
	constrain: true,

	/*
	 * @property {Boolean} [monitorResize=true]
	 * 
	 * 
	 */
//	monitorResize: true,

	/*
	 * @property {Number} [width=180]
	 * 
	 */
	//width: 180,

	/** 
	 * @property {String} [bodyStyle='background-color:white;padding: 2px 5px 2px 5px;']
	 * 
	 */
	bodyStyle: 'background-color:white;padding: 2px 5px 2px 5px;',

	/**
	 * @method initComponent
	 * Create a new TolomeoExt.ToloMeasurePanelExt
	 * 
	 */	
	initComponent: function() {
		
		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);

		this.callParent(arguments);
		this.doLayout();
	},
   
	/**
	 * @method showMeasure
	 * 
	 * 
	 * @param {Object} tipo
	 * tipo.
	 * 
	 */ 
	showMeasure: function (tipo) {
		this.update('inizia a disegnare sulla mappa...');
		this.setVisible(true);
		this.setPosition(0,0);
		//this.toFront();		
	},

	/**
	 * @method hideMeasure
	 * 
	 * 
	 */ 
	hideMeasure: function () {
		this.setVisible(false);
	},
	
	/**
	 * @method displayMeasure
	 * 
	 * 
	 * @param {Object} measureObj
	 * Object with following properties 
	 * dimension: 1 = line, 2 = polygon
	 * length: object with "measure" and "units" properties
	 * area: object with "measure" and "units" properties
 	 */ 
	displayMeasure: function (measureObj) {
		if(measureObj.dimension == 1){
			this.update("<b>Lunghezza</b>: " + Ext.util.Format.number(measureObj.length.measure,"0,000.000") + " " + measureObj.length.units);
		} else {
			this.update("<b>Lunghezza</b>: " + Ext.util.Format.number(measureObj.length.measure,"0,000.000") + " " + measureObj.length.units + "</br><b>Area</b>: " + Ext.util.Format.number(measureObj.area.measure,"0,000.000") + " " + measureObj.area.units + "&sup2;");
		}
		this.setVisible(true);		
	},

	/**
	 * @method onMeasureEnd
	 * Chiamata quando il poligono di misura è finito
	 *
	 * @param {Object} geom
	 * geom.
	 * 
	 */ 
	onMeasureEnd: function(geom) {},

	/**
	 * @method bindToViewerPanel
	 * 
	 * 
	 * @param {Object} viewer
	 * viewer.
	 * 
	 */ 
	bindToViewerPanel: function(viewer) {
		if (viewer!=null) {
			// Registrazione in viewerPanel
			viewer.on('onMeasureStart', this.showMeasure, this );
			viewer.on('onMeasureStop', this.hideMeasure, this);
			viewer.on('onMeasureChanging', this.displayMeasure, this);
			viewer.on('onMeasureChanged', this.displayMeasure, this);
		}
	}


});
 