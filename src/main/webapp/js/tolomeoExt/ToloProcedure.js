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

Ext.define('TolomeoExt.ToloProcedure', {

	extend: 'Ext.util.Observable',

	commands: null,
	
	config: {
		cmdUrl: null, 
		commands: null
	},

	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		
		this.commands=this.commands||[];
		
		if (config.cmdUrlComp) {
			var decomp = LZString.decompressFromBase64(config.cmdUrlComp);
			this._parseUrl(decomp);
		}
		
		if (config.cmdUrl) {
			this._parseUrl(config.cmdUrl);		
		}
		
		
	},
	
	/**
	 * @private
	 * @param {String} cmdUrl Formato
	 * 		{ c: [	// Array di comandi
	 * 				{ c: 0    			// command code
	 * 				  a: [ { }, { } ]	// args
	 * 				},
	 * 				{ c: ...} 
	 * 				]
	 * 		}
	 */
	_parseUrl: function(cmdUrl) {
		var arg = Ext.JSON.decode(cmdUrl, true);
		
		if (arg) {
			var cmdConfigArr = arg.c;	// Array di comandi
			
			for (var i = 0; i < cmdConfigArr.length; i++) {
				var cConfig = cmdConfigArr[i];
		
				var c = TolomeoExt.ToloCommand.createCommand(cConfig.c, cConfig.a);
				/*
				var c = Ext.create('TolomeoExt.ToloCommand', {
							commandCode: cConfig.c,
							args: cConfig.a
					});
					*/
				this.commands.push(c);
				
			}
		} else {
			//TODO Errore nella stringa
			
		}
	},
	
	addCommand: function(cmd) {
		this.commands.push(cmd);
	},
	
	getCommandCount: function(){
		return this.commands.length;
	},

	getCommand: function(nLine) {
		return this.commands[nLine];
	},

	run: function(api) {
		var bOnOpenDrawMap=false;
		var buff;
		
		for (var i = 0; i < this.getCommandCount(); i++) {
			buff = this.getCommand(i).run(api);
			bOnOpenDrawMap = bOnOpenDrawMap || buff;
			//this.runLine(api, i);
		}
		return bOnOpenDrawMap;
	},

	/*
	runLine: function(api, nLine) {
		var cmd = this.getCommand(nLine);
		var args = cmd.getArgs();

		switch (cmd.getCommandCode()) {
		case TolomeoExt.ToloCommand.CMDZOOMTO:
					//api.viewer.pluginToolSelectZoomAll();
					//api.viewer.bOnOpenDrawMap=true;
		
					api.viewer.pluginGotoPosition(args[0].x, args[0].y, args[0].s);
					
					//api.zoomToScale(1000);
					//api.TOCPanel.on('tocGuiCreate',
					//	function() {
					//		api.zoomToScale(1000); 
					//	});	
					break;
		case TolomeoExt.ToloCommand.CMDTOCUNCHECKALL: 
					api.viewer.bOnOpenDrawMap=true;
					api.TOCPanel.on('tocGuiCreate',
						function() {
							api.TOCPanel.setCategoryStateChange(0,false);
							//api.TOCPanel.setLayerStateChange(0, 0, true); 
						});	
					break;
		case TolomeoExt.ToloCommand.CMDTOCCHECK:
					api.viewer.bOnOpenDrawMap=true;
					api.TOCPanel.on('tocGuiCreate',
						function() {
							var serverID = args[0].s; //"RTCASTORE";
							var name = args[0].l; //"r_toscan_cst_fogli";
							var state = args[0].a;
							var lay = api.TOCPanel.tocInfo.searchLayerInfo(serverID, name);
							if (lay!=null) {
								api.TOCPanel.setLayerStateChange(lay.catTreeIdx, lay.layTreeIdx, state );
							}
							//api.viewer.pluginToolSelectZoomAll();
							//api.viewer.pluginRefreshMap();
						});				
					break;
			default:
		
				break;
		}
		
	},*/ 
	
	toJSON: function() {
		return "{\"c\":" + Ext.JSON.encode(this.commands) + "}";
	}
		
});
	