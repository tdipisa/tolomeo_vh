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
// @include "../tolomeoExt/include.js"

Ext.namespace("TolomeoExt");


/**
 * @class TolomeoExt.ToloIIPPanel
 * @extends Ext.Panel
 * Pannello per contenere un viewer per IIPImage. In funzione del valore della variabile di configurazione tipo sono utilizzati: <br/>
 * tipo='iipzoom'
 * tipo='iipmooviewer'
 * in caso di utilizzo di iipmooviewer includere i seguenti css
 * <pre>
 * <link rel="stylesheet" type="text/css" media="all" href="<%=tolomeoServer %>/js/ext/iipmooviewer-2.0/css/iip.compressed.css">
 * <!--[if lt IE 10]>
 * <link rel="stylesheet" type="text/css" media="all" href="<%=tolomeoServer %>/js/ext/iipmooviewer-2.0/css/ie.compressed.css" />
 * <![endif]-->
 * </pre>
 * <br />
 * Esempio di utilizzo
 * 
 *  <pre>
   new TolomeoExt.ToloIIPPanel({ ///TolomeoProxyServlet?
	    	title: 'Anteprima',
			proxy: '/tolomeobinj/TolomeoProxyServlet?',
			// TODO generalizzare
			iipserver:  "http://localhost:80/fcgi-bin/iipsrv.fcgi",
			iipimage:  "/opt/grandeformato/vips.tif",
			copyright: "copyright or information message",
			tipo: 'iipzoom', //'iipzoom' 'iipmooviewer'
			api: this.api,
			
			region: 'east',
			width: 250,
			split:true,
			collapsible:true,
			renderTo: 'mydiv'
	    });
	    
	</pre>
 *
 */
Ext.define('TolomeoExt.ToloIIPPanel', {

	extend: 'Ext.Panel',
 

	/** 
	 * @cfg {String} TOLOMEOServer
	 * 
	 * 
	 */
	TOLOMEOServer: null,

	/** 
	 * @cfg {String} TOLOMEOContext
	 * 
	 * 
	 */
	TOLOMEOContext: null,
	
	/** 
	 * @cfg {String} TOLOMEOStaticRoot
	 * 
	 * 
	 */	
	TOLOMEOStaticRoot: null, 
	
	/**
	 * @cfg {Object} viewerPanel
	 * 
	 * 
	 */
	viewerPanel: 	null, 

	/**
	 * @cfg {String} iipserver
	 * Indirizzo del server IIPImage (per esempio "http://localhost/fcgi-bin/iipsrv.fcgi" )  
	 * 
	 */
	iipserver: 		null,
	
	/**
	 * @cfg {String} iipimage
	 * Immagine da caricare all'avvio. Per esempio "/opt/grandeformato/vips.tif"  
	 * 
	 */
	iipimage: 		null,
	
	/**
	 * @cfg {String} copyright
	 * testo del copyright da inserire nell'immagine  
	 * 
	 */
	copyright: 		"",
	
	/**
	 * @cfg {String} proxy
	 * Il server iipimage deve essere raggiunto dal javascript, per evitare problemi di Cross Domain Ajax Call 
	 * potrebbe essere necessario impostare un proxy. E' possibile utilizzare la servlet di proxy fornita con tolomeo impostando questo valore a
	 * '/tolomeobinj/TolomeoProxyServlet?' ed inserendo il server iipimage nel file tolomeo.properties in PROXY.HOSTNAME_WHITELIST   
	 * N:B: Questa impostazione è valida solo per visualizzatore iipmooviewer
	 * 
	 */
	proxy:			null,
	
	/**
	 * @cfg {String} api
	 * Oggetto API di tolomeo  
	 * 
	 */
	api: 			null, 
	
	/**
	 * @cfg {String} tipo
	 * tipo di viewer. Sono possibili i valori iipzoom (visualizzatore flash) e iipmooviewer (visualizzatore HTML5 e javascript)  
	 * 
	 */
	tipo: 			'iipzoom',
	
	/**
	 * @cfg {String} iipviewerId
	 * 
	 * 
	 */
	iipviewerId: null,
	
	/**
	 * @cfg {String} iipmooviewer
	 * 
	 * 
	 */
	iipmooviewer: null, 
	
	/**
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent: function(){
		
		var thisPanel=this;
		this.layout = 'fit';
		
		TolomeoExt.Vars.ApplyIfDefaults(this);	
		
		this.callParent(arguments);
		
		this.iipviewerId=this.id+'-iipviewer';
		
        this.viewerPanel = new Ext.Panel({	
        	style: 'z-index:0;',
			layout: 'fit',	
			bodyBorder: false,
			border: false,
			anchor: '100% 100%',
			html: '<div id="' + this.iipviewerId + '" style="width:99%;height:99%;margin-left:auto;margin-right:auto" />', 
			monitorResize: true
		});
        this.add(this.viewerPanel);
		
		this.on('afterlayout', function() { 
			this.showViewer();
		}, this, {single: true}); 

		this.doLayout();

    },
    
    /**
     * @method showViewer
     * @private
     * 
     * 
     */
    showViewer: function() {
		
    	var iipopt = {
			server: this.iipserver, // this.iipserver,
			image: this.iipimage,
			credit: this.copyright
    	};
    	
    	var flashOnlyOpts = {
    		navigation: true
    	}

    	var iipmoo1OnlyOpts = {
    	   zoom: 1,
    	   render: 'random',
           showNavButtons: true,
			//prefix: this.TOLOMEOServer + this.TOLOMEOStaticRoot + 'js/ext/iipmooviewer-2.0/images/',
           prefix: this.TOLOMEOServer + '/js/ext/iipmooviewer-2.0/images/',
			enableFullscreen: true
    	}
    	
		var params = {
			scale: "noscale",
			bgcolor: "#000000",
			allowfullscreen: "true",
			allowscriptaccess: "always"
		}
    	
		switch (this.tipo){
			case 'iipzoom':
				Ext.apply(iipopt, flashOnlyOpts);
				
				this.api.lazyLoadScript('swfobject',
						function() { this.embedIIPZoom(Ext.apply(iipopt, flashOnlyOpts) , params);}, 
						function(){Ext.Msg.alert('Attenzione', 'Problema nel caricamento delle librerie necessarie.');},
						this
					);
				break;
			case 'iipmooviewer':
				iipopt.server = ((this.proxy!=null && this.proxy!="") ? this.proxy : "") + iipopt.server;
				Ext.apply(iipopt, iipmoo1OnlyOpts);
				
				this.api.lazyLoadScript(['mootoolscore145', 'mootoolsmore1401', 'iipmooviewer20'],
						function() { this.embedIIPMooviewer(iipopt); }, 
						function(){Ext.Msg.alert('Attenzione', 'Problema nel caricamento delle librerie necessarie.');},
						this
					);
				break;
		}
    },
    
    /**
     * @method setAndShowNewImg
     * Imposta nuova immagine, server e copyright e visualizza
     * 
     * @param {String} iipimage
     * 
     * 
     * @param {String} iipserver
     * 
     * 
     * @param {String} copyright
     * 
     * 
     */
    setAndShowNewImg: function (iipimage, iipserver, copyright) {
    	
    	if (iipimage && iipimage!="") this.iipimage=iipimage;
    	if (iipserver && iipserver!="") this.iipserver=iipserver;
    	if (copyright && copyright!="") this.copyright=copyright;
    	
    	this.showViewer();
    	
    },
    
    /**
     * @method embedIIPMooviewer
     * @private
     * 
     * 
     * @param {Object} opt
     * 
     * 
     */
    embedIIPMooviewer: function(opt){
    	
        if (this.iipmooviewer!=null) {
        	// NB La versione iipmooviewer 2.0 beta utilizzata non ha metodo per cambiare immagine, quindi mi sono inventato questo metodo
        	this.viewerPanel.un('resize', this.iipmooviewer.reflow, this.iipmooviewer);
        	this.iipmooviewer.container.getChildren().each( function(el, i) { el.destroy(); } );
        } 
        this.iipmooviewer = new IIPMooViewer( this.iipviewerId, opt);
    	this.iipmooviewer.load();
    	this.viewerPanel.on('resize', this.iipmooviewer.reflow, this.iipmooviewer);

    },
    
    /**
     * @method embedIIPZoom
     * @private
     * 
     * 
     * @param {Object} opt
     * 
     * 
     * @param {Object} params
     * 
     * 
     */
    embedIIPZoom: function(opt, params){	
    	swfobject.embedSWF(this.TOLOMEOServer + this.TOLOMEOStaticRoot + "swf/iipzoom/IIPZoom.swf",this.iipviewerId, "100%", "100%", "9.0.0",this.TOLOMEOServer + this.TOLOMEOStaticRoot +"swf/iipzoom/expressInstall.swf", opt, params); 
    	//swfobject.embedSWF(this.TOLOMEOServer + "/swf/iipzoom/IIPZoom.swf",this.iipviewerId, "100%", "100%", "9.0.0",this.TOLOMEOServer +"/swf/iipzoom/expressInstall.swf", opt, params);
    }
	
});

