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
 * Iframe in cui vengono caricate le risorse informative esterne.<br/>
 * ATTENZIONE: se questo pannello viene inserito in contenitori che sono collapsible ed hanno animCollapse=true ad ogni apertura e 
 * 	chiusura del pannello il contenuto dell'iframe viene ricaricato, o più precisamente viene ricaricata url se definita alla creazione, altrimenti resta vuoto.
 *  Questo comportamento è molto pericoloso in caso di compilazione di form ed editing, per evitarlo accertarsi che i contenitori "padri" collapsible abbiano <br/>
 *  
 * - animCollapse: false<br/>
 * - floatable : false <br/>	
				
 * @class TolomeoExt.ToloIFrame
 * @extends Ext.BoxComponent
 */
Ext.define('TolomeoExt.ToloIFrame', {

	extend: 'Ext.Component',
	alias: 'widget.tx_toloIFrame',

	/** 
	 * @property {String} [url='']
	 * url da caricare nell'iframe
	 * 
	 */
	url: '',
	
	/** 
	 * @property {String} [iFrameName='pannello']
	 * Nome dell'iframe da utilizzare poi come target
	 * 
	 */
	iFrameName: 'pannello',
	
	/** 
	 * @property {String} iFrameId
	 * Id dell'iframe da utilizzare per recuperare l'elemento
	 * 
	 */
	iFrameId: null,
	
	/** 
	 * @property {String} iFrameTagId
	 * 
	 * 
	 */
	iFrameTagId: null, 	 	 
	
	/** 
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function() {		

	/* TODO PLUGIN????
		var initializeVisModePlugin = true;
		this.plugins = this.plugins || []; 
		
		// Se è stato passato uno specifico plugin lo aggiungo nell'array dei plugins prima 
		// di aggiungere quello per il VisibilityMode
		if(!(this.plugins instanceof Array)){
			var obj = this.plugins;
			this.plugins = [];
			this.plugins.push(obj);			
		}		
		
		// Controllo se il plugin è già stato passato da fuori
		for(var i=0; i < this.plugins.length; i++){
			if(this.plugins[i] instanceof Ext.ux.plugin.VisibilityMode){
				initializeVisModePlugin = false;
				break;
			}
		}
		
		if(initializeVisModePlugin && !Ext.isIE){
			this.plugins.push(new Ext.ux.plugin.VisibilityMode({ bubble : true }));
		}		
		*/

		this.iFrameTagId = this.iFrameId ? this.iFrameId : 'iframe-' + this.iFrameName;
		
		this.autoEl = {tag: 'iframe', id: this.iFrameTagId, name: this.iFrameName, frameBorder: 0, src: this.url};
		
		// Applico i default
		//TODO RIATTIVARE TolomeoExt.Vars.ApplyIfDefaults(this);		
		this.callParent(arguments);
		
		//this.on('beforecollapse', this.copyIFrame);
		//this.on('hide', this.copyIFrame);
		
		//this.on('expand', this.restoreIFrame);
		//this.on('show', this.restoreIFrame);
		
	},
	
	/** 
	 * @method loading
	 * 
	 * 
	 * @param {Object} config
	 * 
	 * 
	 */
	loading: function(config){
		var frame = top.frames[this.iFrameName];
		var message = null;
		var htmlTemplate = config.htmlTemplate || "<html><head></head><body><p style='{1}'>{0}</p></body></html>";
		
		if(config.url){
			frame.location.replace(config.url);
			if(config.message){
				message = config.message;
			}
		}else{
			message = config.message || "Loading...";
		}
		if(message){
			frame.document.open();
			frame.document.write(String.format(htmlTemplate,message,config.style));
	    	frame.document.close();
		}
	},
	
	/** 
	 * @method replaceUrl
	 * 
	 * 
	 * @param {String} url
	 * 
	 * 
	 * @param {Object} loadingConfig
	 * 
	 * 
	 */
	replaceUrl: function(url,loadingConfig){
		if(!url) return;
		if(loadingConfig){
			this.loading(loadingConfig);
		}
		top.frames[this.iFrameName].location.replace(url);
	},
	
	/** 
	 * @method changeUrl
	 * 
	 * 
	 * @param {Object} loadingConfig
	 * 
	 * 
	 */
	changeUrl: function(loadingConfig){
		if(!url) return;
		if(loadingConfig){
			this.loading(loadingConfig);
		}
		top.frames[this.iFrameName].location.href = url;
	}
	
	/*
	copyIFrame: function() {
		//this.elCopy = Ext.get(this.iFrameTagId).dom;
		if (this.getEl().dom) this.elCopy = Ext.clone(this.getEl().dom);
		//this.saveState();
	},
	
	
	restoreIFrame: function() {
		//Ext.get(this.iFrameTagId).dom = this.elCopy;
		if (this.elCopy) this.getEl().dom = this.elCopy;
	}
	*/
	
});
