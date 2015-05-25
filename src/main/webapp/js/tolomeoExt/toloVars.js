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

Ext.namespace("TolomeoExt.Vars");
	
/**
 * Function: TolomeoExt.Vars.ApplyIfDefaults
 *
 * Parameters:
 * obj - {} obj
 */
TolomeoExt.Vars.ApplyIfDefaults = function(obj) {
	
	// passando alla versione 3.1 di ext la applyIf agisce se le proprieta' non sono definite, mentre prima lo faceva anche se erano null
	// per questo ho combiato con il codice esplicito sotto riportato 
	TolomeoExt.applyIfEmpty(obj,
					{ TOLOMEOServer: 		TolomeoExt.Vars.TOLOMEOServer,
					  TOLOMEOContext: 		TolomeoExt.Vars.TOLOMEOContext,
					  TOLOMEOStaticRoot: 	TolomeoExt.Vars.TOLOMEOStaticRoot,
					  paramsJS: TolomeoExt.Vars.paramsJS
					});
	/*var o = obj;
	var c = { TOLOMEOServer: TolomeoExt.Vars.TOLOMEOServer,
			  TOLOMEOContext: TolomeoExt.Vars.TOLOMEOContext,
			  paramsJS: TolomeoExt.Vars.paramsJS
			};
					
    if(o){
        for(var p in c){
        	//o["aaa"] = 'ale';
        	//o["TOLOMEOServer"] = c["TOLOMEOServer"];
        	
        	if (Ext.isEmpty(o[p])) {
                o[p] = c[p];
            //    alert(c[p]);
            }
        }
    }*/					
}

