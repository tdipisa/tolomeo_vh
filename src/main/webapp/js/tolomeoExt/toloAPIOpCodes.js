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

Ext.namespace("TolomeoExt");

/**
 * Method: TolomeoExt.ToloAPIOpCodes
 *  
 */	
TolomeoExt.ToloAPIOpCodes = new function() {
	var contaBottoni = 0;
	
 	this.btnNuovo          = contaBottoni++;
 	this.btnDelete         = contaBottoni++;
 	this.btnAdd            = contaBottoni++;
 	this.btnSubtract       = contaBottoni++;
 	this.btnAddSub         = contaBottoni++;
 	this.btnUpdateAlfa     = contaBottoni++;
 	this.btnIdentify       = contaBottoni++;
 	this.btnVertexEdit     = contaBottoni++;
 	this.btnDragDrop       = contaBottoni++;
 	this.btnTemporalFilter = contaBottoni++;
 	this.btnAutoIdentify   = contaBottoni++;

 	this.btnActionPanel2Max = contaBottoni-1;

 	this.btnLegenda	  = contaBottoni++;
 	this.btnRicerca   = contaBottoni++;
 	this.btnPan 	  = contaBottoni++;
 	this.btnPanNord   = contaBottoni++;
 	this.btnPanEst 	  = contaBottoni++;
 	this.btnPanSud 	  = contaBottoni++;
 	this.btnPanOvest  = contaBottoni++;
 	this.btnMeasure   = contaBottoni++;
 	this.btnSeleziona = contaBottoni++;
 	this.btnAnnullaSelezioni = contaBottoni++;

 	this.btnZoomIn  = contaBottoni++;
 	this.btnZoomOut = contaBottoni++;
 	this.btnZoomBox = contaBottoni++;
 	this.btnZoomAll = contaBottoni++;
 	
 	this.btnPrint            = contaBottoni++;
 	this.btnTimeMachine      = contaBottoni++;
 	this.btnSnap             = contaBottoni++;
 	this.btnCsw              = contaBottoni++;
 	this.btnWMSExplorer      = contaBottoni++;
 	this.btn3D      		 = contaBottoni++;
 	//this.btnMostraCoordinate = contaBottoni++;

	// lasciare per ultimo (il codice assume che siano customButton quelli >= btnCustomBase
 	this.btnCustomBase = contaBottoni++;
}();