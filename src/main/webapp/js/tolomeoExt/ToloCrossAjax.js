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
 * @class TolomeoExt.ToloCrossAjaxUtil
 * 
 * 
 */
TolomeoExt.ToloCrossAjaxUtil = {
	
		/**
		 * @property {Object} DEFAULT_PORTS
		 * 
		 * 
		 */
		DEFAULT_PORTS : {
			'http:' : 80,
			'https:': 443
		},

		/**
		 * @method urlIsCrossDomain
		 * 
		 * 
		 * @param {String} u
		 * 
		 * 
		 */
		urlIsCrossDomain: function(u) {
			var match = /(?:(\w*:)\/\/)?([\w\.]*)(?::(\d*))?/.exec(u);
			var protocol = match[1], hostname = match[2], port = match[3];
			
			if (!protocol) return false; // No protocol, not cross-domain
			if(protocol!=location.protocol) return true;
			
			if(!port) port = this.DEFAULT_PORTS[protocol];
			var locationPort = location.port? location.port : this.DEFAULT_PORTS[location.protocol];
			
			if(port != locationPort) return true;			
			return hostname != location.hostname;
			//return (match[1] != location.protocol) || (match[2] != location.host);
		}, 

		/**
		 * @method getProxy
		 * 
		 * 
		 * @param {String} scriptTag
		 * 
		 * 
		 * @param {String} url
		 * 
		 * 
		 * @param {String} method
		 * 
		 * 
		 */
		getProxy: function(scriptTag, url, method) {
			var proxy=null;
			var reqMethod = (method || 'POST').toUpperCase();
			
			if ((scriptTag != undefined) && (scriptTag != null)) { 
				proxy = (scriptTag) ?  Ext.create('Ext.data.proxy.JsonP',{url: url}) : Ext.create('Ext.data.proxy.Ajax',{ 
					api: {
						'read': url, // {'url': url,'method': reqMethod}
						actionsMethods: {read: reqMethod }
					}, 
					reader: {
						readRecordsOnFailure: false
					}
				}); 
			} else {
				proxy = (TolomeoExt.ToloCrossAjaxUtil.urlIsCrossDomain(url)) ? Ext.create('Ext.data.proxy.JsonP',{url: url}) : Ext.create('Ext.data.proxy.Ajax',{
					timeout: Ext.Ajax.timeout,
					api: {
						'read': url,
						actionsMethods: {read: reqMethod }
					}, 
					reader: {
						readRecordsOnFailure: false
					}
				});
			}
			return proxy;
		}

}

/**
 * @class TolomeoExt.ToloCrossAjax
 * @extends Ext.util.Observable
 * 
 * 
 */
Ext.define('TolomeoExt.ToloCrossAjax', {
	
	extend: 'Ext.util.Observable',
	
	/** 
	 * @property {Object} store
	 * 
	 * 
	 */
	store: null,
	
	/*
	urlIsCrossDomain: function(u) {
		var match = /(?:(\w*:)\/\/)?([\w\.]*(?::\d*)?)/.exec(u);
		if (!match[1]) return false; // No protocol, not cross-domain
		return (match[1] != location.protocol) || (match[2] != location.host);
	},
	*/
	
	/**
	 * @method request
	 * 
	 * 
	 * @param {Object} options
	 * opzioni della richiesta.
	 * 
	 */
	request: function(options) {
		var me= this;
		var proxy = TolomeoExt.ToloCrossAjaxUtil.getProxy(options.scriptTag, options.url, options.method);
				
		// Creazione Store 
		 this.store = new Ext.data.JsonStore({
									    // store configs
									    autoDestroy: false,
									    proxy: proxy
									});
		
		 //this.store.on('exception', this.storeException);
		 proxy.on('exception', this.storeException);
		 
		// Lettura Dati
		this.store.load({
			params: options.params,
			callback: function(records, loadOptions, success) {
									me.loadCallback(records, loadOptions, success, options);
									},
			scope: me
		});		
	},
	
	/**
	 * @method loadCallback
	 * 
	 * 
	 * @param {Object} records
	 * record caricati.
	 * 
	 * @param {Object} loadOptions
	 * opzioni di caricamento.
	 * 
	 * @param {Object} success
	 * indica se l'operazione ha avuto successo.
	 * 
	 * @param {Object} originalOptions
	 * opzioni di caricamento originali. 
	 * 
	 */
	loadCallback: function(records, loadOptions, success, originalOptions) {

		if (success) {
			originalOptions.success.call(originalOptions.scope, records, this.store, originalOptions);
		} else {
			if (originalOptions.failure) originalOptions.failure.call(originalOptions.scope, this.store, originalOptions); 
		}

	},
	
	/**
	 * @method storeException
	 * 
	 * 
	 * @param {Object} dataProxy
	 * il proxy.
	 * 
	 * @param {Object} type
	 * il tipo dell'eccezione.
	 * 
	 * @param {Object} action
	 * l'azione associata.
	 * 
	 * @param {Object} options
	 * le opzioni . 
	 * 
	 * @param {Object} response
	 * la risposta ricevuta.
	 * 
	 * @param {Object} arg
	 * gli argomenti.
	 * 
	 */
	//  Ext.data.proxy.Proxy this, Object response, Ext.data.Operation operation, Object eOpts
	//storeException: function(dataProxy, type, action, options, response, arg) {
	storeException: function(dataProxy, response, operation, eopts) {
		
		var msg = "";
		
		/*
		if (type=='remote')  {
			msg = response.responseText;
	
		} else {
			//server ok
			if (response && response.status == 200) {
				var decodedResponse = (response.responseText == undefined) ? response : Ext.decode(response.responseText);
				msg = decodedResponse.msgErrore;
				stack = decodedResponse.msgStackTrace;
			//server ko
			} else {
				msg = 'Risorsa chiamata: ' + options.url + '<br/><br/>Risposta: ' + response.status + ' ' + response.statusText;
				stack = null;
			}
		}
		*/
		//server ok
		if (response && response.status == 200) {
			var decodedResponse = (response.responseText == undefined) ? response : Ext.decode(response.responseText);
			msg = decodedResponse.msgErrore;
			stack = decodedResponse.msgStackTrace;
		//server ko
		} else {
			msg = 'Risorsa chiamata: ' + operation.request.url + '<br/><br/>Risposta: ' + response.status + ' ' + response.statusText;
			stack = null;
		}
		
		this.stackDisabled = (stack == '' || stack == undefined) ? true : false; 
		
		this.errorWin = new Ext.Window({
			title: 'Errore Tolomeo',
			layout: 'anchor',
			defaultAnchor : '0',
			//bodyStyle:'background-color:white',
			plain: true,
			border: false,
			modal: true,
			padding: 5,
			width: 500,
			autoHeight: true,
			autoScroll: true,
			buttonAlign: 'center',
			buttons: [{
				text: 'OK',
					listeners: {click: {fn: function() {
	       			this.errorWin.hide();
	       		},scope: this}}	
			}],
			items: [{
				xtype: 'box',
				html: '<div class="finestraIcona finestraIconaErrore"></div><div class="finestraIconaTesto">' + msg + '</div>',
				//bodyStyle: 'padding:5px',
				style: {
		            paddingBottom: '25px'
		        }
			},{
				xtype: 'panel',
				layout: 'fit',
				title: 'Stacktrace',
				collapsible: true,
				collapsed: true,
				titleCollapse: true,
				border: true,
				disabled: this.stackDisabled,
				items: [{
					xtype: 'textarea',
					//anchor : '0',
					hideLabel: true,
					readOnly: true,
					height: 300,
					autoScroll: true,
					style: {
						font: '11px courier new'
					},
		            value: stack
				}],
				listeners: {
					'expand' : {
						fn: function() {
							this.errorWin.setWidth(800);
							this.errorWin.center();
						},
						scope: this
					},
					'collapse' : {
						fn: function() {
							if (this.errorWin) {
								this.errorWin.setWidth(500);
								this.errorWin.center();
							}
						},
						scope: this
					}
				}
			}]
		}).show();
	},
	
	/**
	 * @method onDestroy
	 * 
	 * 
	 */
	onDestroy: function() {
		if (store) store.destroy();
		this.callParent();
	}
	
});


