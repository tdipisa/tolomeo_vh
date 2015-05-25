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
 * Class: Ext.Minosse.KeepAlive
 * Singleton che è necessario inizializzare in una chiamata Ext.onReady 
 * per l'utilizzo di chiamate Ajax classiche in presenza di Minosse.
 * E' necessario includere questo file javascript dopo aver incluso ExtJS.
 * 
 * I parametri di configurazione sono :
 * 
 * - wakeupResource : risorsa nello stesso dominio da chiamare per mantenere sveglio Minosse. 
 * Può essere un'immagine, una pagina html etc. 
 * Il path può essere relativo o assoluto. 
 * Il valore di default è la Ext.BLANK_IMAGE_URL
 * 
 * - wsTimeout : timeout di Minosse in secondi. 
 * Conviene tenere questo valore più basso del timout reale.
 * Se il timeout di Minosse è impostato a 10 minuti conviene tenerlo a 8 minuti (8 * 60 = 480).
 * Il valore di default è di 270 (4 minuti e mezzo)
 * 
 * - forceNoCache : forza la chiamata alla wakeupResource aggiungendo un parametro 
 * ogni volta diverso in modo da evitare la cache.
 * Il valore di default è "true".
 * 
 * ESEMPIO : 
 * 
 * Ext.onReady(function(){
 * 
 *   ComunePo.minosse.KeepAlive.init({
 *		wakeupResource : "/img/stemma.jpg", 
 *		wsTimeout : 480,
 *		forceNoCache: true
 *	 });	
 *
 * });
 */ 
Ext.define('ComunePo.minosse.KeepAlive', function() {
	
	var lastRequestTime = null;
	var requestQueue = new Array();
	
	// Finestra in cui aggiungo l'iFrame	
	var minosseWindow = null;	
	
	// Invalida il cookie di Minosse	
	var expireCookie = function(name, path){
		if(Ext.util.Cookies.get(name)){
			document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT; path=" + (path?path:"/");
		}
	};	
	
	// Esegue chiamate Ajax	
	var callAjax = function(scope,requestConfig) {
		checkMinosseTimeout.busy = false; 				
		Ext.Ajax.request.apply(scope, [requestConfig]);
	};
	
	
	// Aggiunge le richieste Ajax in una coda, attendendo che l'autenticazione sia avvenuta 	
	var addToRequestQueue = function(scope, requestConfig, delay){
		var newRequestConfig = Ext.applyIf({},requestConfig);
		requestConfig.callback = null;
		requestConfig.success = null;
		requestConfig.failure = null;			
		requestQueue.push({'requestConfig': newRequestConfig, 'scope' : scope, 'delay' : delay});
	}
	
	
	// Esegue le richieste che erano rimaste in coda	 
	var requestDelivery = function(){
		for(var i = 0; i < requestQueue.length; i++){
			var req = requestQueue[i];
			callAjax.defer(req.delay,this,[req.scope,req.requestConfig]);
		}
		requestQueue.length = 0;
	}
	
	// Controlla che la risorsa caricata non sia la pagina di redirect di Minosse
	var checkWakeupResource = function(resourceDocument){
		// controllo tramite contenuto
		try {
			return resourceDocument.body.innerHTML.indexOf('location.href="/Auth/accesscontroller";')==-1;
		}catch(err){
			// il sorgente src dell'iframe non è nello stesso dominio
			return false;
		}
		
		/*
		// controllo tramite title
		return resourceDocument.title != 'Minosse AccessController Redirection';
		
		// controllo tramite metatag
		// Ad Es. <meta name="minosseIdentier" content="XXMINOSSEXX" />
		var metaTags = Ext.query('meta[name=minosseIdentier]',resourceDocument); 
		return	!!(metaTags && metaTags[0].content && metaTags[0].content == 'XXMINOSSEXX');
		*/
	}
	
	/*
	 * Controlla se è in atto una rivalidazione di Minosse o se deve essere fatta, perchè è passato un tempo
	 * superiore al wsTimeout dall'ultima chiamata Ajax.
	 * Se è così, rivalida il cookie di Minosse e mette in coda tutte le richiesta Ajax effettuate 
	 * prima che la rivalidazione abbia effetto
	 */
	var checkMinosseTimeout = function(scope,requestConfig,minosseConfig){
		
		// recupero l'istante attuale
		var now = new Date().getTime();
		
		// Controllo se si è già in attesa del caricamento della risorsa di controllo
		// In tal caso si rifiutano altre richieste Ajax
		if(checkMinosseTimeout.busy){	
			var delay = now - lastRequestTime;
			addToRequestQueue(scope,requestConfig,delay);						
			return false;
		}
			
		// se non risultano mai avvenute richieste Ajax o se l'ultima è stata evasa più di "wsTimeout" secondi fa
		// allora mi assicuro di invalidare il cookie di Minosse e carico la risorsa necessaria per destarlo
		// Sull'onload di questa risorsa eseguo la richiesta orginale
		if((now - lastRequestTime) > (minosseConfig.wsTimeout * 1000)) {
			
			// imposto lo stato di occupato
			checkMinosseTimeout.busy = true;	
			// reimposto l'ultima chiamata ajax ad adesso
			lastRequestTime = now;
			
			// invalido il cookie di Minosse
			expireCookie('wscookie');					
			
			// copio la configurazione della chiamata ajax per poter sovrascrivere sull'originale le chiamate di callbak
			var newRequestConfig = Ext.applyIf({},requestConfig);
			requestConfig.callback = null;
			requestConfig.success = null;
			requestConfig.failure = null;
			
			if(Ext.isIE){
				Ext.fly('minosse').dom.onreadystatechange = function(){
					if(this.readyState == 'complete'){												
						var resourceDocument = this.contentWindow.document;
						
						if(checkWakeupResource(resourceDocument)){									
							callAjax(scope,newRequestConfig);
						}				
					}
				};		
			}else{
				Ext.fly('minosse').dom.onload = function(){										
					
					var resourceDocument = this.contentDocument; //per la window this.contentDocument.parentWindow					
					if(checkWakeupResource(resourceDocument)){									
						callAjax(scope,newRequestConfig);
					}
				};
			}
			
			// carico la risorsa di controllo
			var wakeupResource = minosseConfig.wakeupResource;
			
			if(minosseConfig.forceNoCache){
				wakeupResource += ((minosseConfig.wakeupResource.indexOf("?") != -1) ? "&" : "?") + "nocache=" + (now + Math.random());
			}
			
			Ext.fly('minosse').dom.src = wakeupResource;
			
			return false;		
			
		} else {				
			lastRequestTime = now;
			if(requestQueue.length > 0){
				requestDelivery();
			}
			return true;
		}
	}
	
	return {
		requires: ['Ext.Ajax','Ext.Window','Ext.Component','Ext.util.Cookies'],
        singleton: true,  
        
		init : function(config){
			if(minosseWindow == null){
				minosseWindow = Ext.create(
					'Ext.Window',
					{
						id: 'minosseWindow', //id necessario per fare l'expnad del pannello laterale
						title: 'Autenticazione',								
						width: 350,
						minWidth: 350,
						closeAction: 'hide',
						// iFrame in cui carico la risorsa necessaria a destare Minosse	
						items : [{
					        xtype : 'component',
					        id : 'minosse',
					        autoEl : {
					            tag : 'iframe',
					            src : '',	            
					            name : 'minosse',
					            id : 'minosse'
					        }
					    }]					
					}
				);
			}
			
			if(!lastRequestTime){	
				// se la init è chiamata quando Ext non è ancora pronto non faccio nulla e la registro sull'onReady
				if(!Ext.isReady){
					Ext.onReady(function(){
						ComunePo.minosse.KeepAlive.init(config);
					});
					return;
				}
				
				// se non viene passato lo creo
				config = config || {};
				
				// Applico ai parametri di configurazione quelli di default
				Ext.applyIf(config,{
					wakeupResource : Ext.BLANK_IMAGE_URL,
					wsTimeout : 270,
					forceNoCache : true
				});
				
				// Si avvia il conteggio
				lastRequestTime = new Date().getTime();
				minosseWindow.render(Ext.getBody());				
				Ext.Ajax.on('beforerequest', function(scope,requestConfig){return checkMinosseTimeout(scope,requestConfig,config);}, this);
			}
		}
	}
	
}());