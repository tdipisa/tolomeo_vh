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
 * @author Alessandro Radaelli
 */
Ext.define('TolomeoExt.OLS.NavigationSummaryPanel', {
	extend: 'Ext.Panel',
	
	/** 
	 * Property: model
	 * 
	 */
	model: null,
    
    initComponent:function() {
    	    	
        var config = {
                height: 70,
                title: 'Sommario', 
                collapsible: true,
                collapsed: false,
                bodyStyle:'padding:5px 5px 0',
//                cls: 'floating-form_left',
        };
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
		
    },
    
    refreshData: function() {
    	
    	var totalTime 		= "";
    	var totalDistance 	= "";
    	
    	if (this.model && this.model.routeResponse && this.model.routeResponse.summary) {
    		totalTime = this.model.routeResponse.summary.totalTime;
        	totalDistance = this.model.routeResponse.summary.totalDistance;
    	}
    	
    	var regExp =  /PT(\d*H)?(\d*M)?(\d*\.)(\d*S)/;
    	var time = regExp.exec(totalTime);
    	
    	var ore = time[1] ? time[1].substring(0,time[1].length-1) + "h " : ""; 
    	var minuti = time[2] ? time[2].substring(0,time[2].length-1) + "m " : "";
    	var secondi = time[3] ? time[3].substring(0,time[3].length-1) + "s " : "";
    	
    	this.update("Tempo percorrenza: " + ore + minuti + secondi + "<br />Distanza: " + Ext.util.Format.number(totalDistance.value, '0.00') + " " + totalDistance.uom);
    }

});
