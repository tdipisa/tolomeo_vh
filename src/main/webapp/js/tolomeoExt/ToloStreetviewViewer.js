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
 * @class TolomeoExt.ToloStreetviewViewerPanel
 * @extends Ext.Panel
 * Pannello ExtJs contenente un Google Panorama Street View
 * 
 */        
Ext.define('TolomeoExt.ToloStreetviewViewerPanel', {
		
	extend: 'Ext.Panel',
	
	/**
	 * @property {Number} posLon
	 * Longitudine posizione iniziale
	 * 
	 */
	posLon: null,
	
	/**
	 * @property {Number} posLat
	 * Latitudine posizione iniziale
	 * 
	 */
	posLat: null,
	
	/**
	 * @property {Object} heading
	 * Heading iniziale
	 * 
	 */
	heading: null,
	
	/**
	 * @property {Object} pitch
	 * Pitch iniziale
	 * 
	 */
	pitch: null,
	
	/**
	 * @property {Number} zoom
	 * Zoom iniziale
	 * 
	 */
	zoom: null,
	
	/**
	 * @property {Object} streetviewclient
	 * 
	 * 
	 */
	streetviewclient: null,
	
	/**
	 * @property {Object} panorama
	 * 
	 * 
	 */
	panorama: null,
	
	/**
	 * @method initComponent
	 * 
	 * 
	 */
	initComponent : function() {
		
		this.addEvents('onPositionChanged');
		this.addEvents('onPovChanged');
		this.addEvents('onLinksChanged');
		
		if (this.heading==null) this.heading=0;
		if (this.pitch==null) 	this.pitch=0;
		if (this.zoom==null) 	this.zoom=1;
        
        //	Create StreetViewClient for querying information about panorama
		this.streetviewclient = new google.maps.StreetViewService();
		
		this.bindToViewer(this.viewer);
		this.viewer.pluginAddStreetviewLayers();
		this.viewer.bindToStreetviewViewer(this);
		
		this.callParent(arguments);
		
	},
	
	/**
	 * @method bindToViewer
	 * 
	 * 
	 * @param {Object} viewer
	 * 
	 * 
	 */
	bindToViewer: function(viewer) {
		if (viewer) {
			viewer.on('onStreetviewDropComplete', this.setViewPosition, this);
			viewer.on('onStreetviewNavLinkClick', this.getPanoramabyId, this);
		}
	},
	
	/**
	 * @method getPanoramabyId
	 * 
	 * 
	 * @param {Object} panoId
	 * 
	 * 
	 */
	getPanoramabyId: function(panoId) {
		
		var delegateFn = Ext.Function.bind(this.getPanoramaByIdCallback, this);
		this.streetviewclient.getPanoramaById(panoId, delegateFn);
	   //this.streetviewclient.getPanoramaById(panoId, this.getPanoramaByIdCallback.createDelegate(this));
	},
	
	/**
	 * @method getPanoramaByIdCallback
	 * 
	 * 
	 * @param {Object} data
	 * 
	 * 
	 * @param {Object} streetviewstatus
	 * 
	 * 
	 */
	getPanoramaByIdCallback: function (data, streetviewstatus) {
		if (data) {
			if (streetviewstatus == "ZERO_RESULTS") {        //600 nessun panorama
                //this.deleteFeatures();
	    		//this.panorama.setVisible(false);
            } else if (streetviewstatus == "UNKNOWN_ERROR") { //500 errore
                //this.deleteFeatures();
	    		//this.panorama.setVisible(false);
            } else if (streetviewstatus == "OK") {            // 200 OK
            	var pov = {
            		heading: this.panorama.pov.heading,
            		pitch  : this.panorama.pov.pitch,
            		zoom   : this.panorama.pov.zoom
            	};
				this.setViewPosition(data.location.latLng.lng(), data.location.latLng.lat());
				this.panorama.setPov(pov);
            }
		} else {
            //this.deleteFeatures();
    		//this.panorama.setVisible(false);
        }
    },
	
	/**
	 * @method afterRender
	 * 
	 * 
	 */
	afterRender : function() {
		var pos = new google.maps.LatLng(this.posLat, this.posLon);
		var panoramaOptions = {
	    	position: pos,
	    	pov: {
	        	heading: this.heading,
	        	pitch  : this.pitch,
	        	zoom   : this.zoom
			}
	    }
		this.panorama = new google.maps.StreetViewPanorama(this.body.dom,panoramaOptions);
		this.on('bodyresize', function() {google.maps.event.trigger(this.panorama, 'resize');});
		var thiswin = this;
		google.maps.event.addListener(this.panorama, 'position_changed', 
			function() {
				//alert("position_changed");
				var pos = thiswin.panorama.getPosition();
				var heading = thiswin.panorama.getPov().heading;
				thiswin.fireEvent('onPositionChanged', pos.lng(), pos.lat(), heading);
			});

		//Add panorama event listeners
    	google.maps.event.addListener(this.panorama, "pov_changed", 
    		function() {
				var pos = thiswin.panorama.getPosition();
				var heading = thiswin.panorama.getPov().heading;
				thiswin.fireEvent('onPovChanged', pos.lng(), pos.lat(), heading);
			}
    	);
				        
		google.maps.event.addListener(this.panorama, "links_changed", 
			function() {
				var links = thiswin.panorama.getLinks();
				var pos = thiswin.panorama.getPosition()
				thiswin.fireEvent('onLinksChanged', links, pos);
			}
		);

		this.callParent(arguments);
		
	},
	
	/**
	 * @method beforeDestroy
	 * 
	 * 
	 */
    beforeDestroy: function() {
        delete this.panorama;
        this.callParent(arguments);
    },
	
	/**
	 * @method setViewPosition
	 * 
	 * 
	 * @param {Number} lon
	 * 
	 * 
	 * @param {Number} lat
	 * 
	 * 
	 */
	setViewPosition: function (lon, lat) {
		var pos = new google.maps.LatLng(lat, lon);	
		this.panorama.setPosition(pos);
	} 
});
	