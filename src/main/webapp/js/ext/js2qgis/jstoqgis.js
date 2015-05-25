/***************************************************************************
 JsToQgis
                                 A QGIS plugin
 Porting qgis function to javascript and vice versa
                              -------------------
        begin                : 2014-06-27
        copyright            : (C) 2014 by Walter Lorenzetti - Gis3W
        email                : lorenzetti@gis3w.it
 ***************************************************************************/

/***************************************************************************
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 ***************************************************************************/

var JQ = {};
var QJ = {};


JQ = _.extend({
	_NAME_:'JQ',
	GetErrorMessages: function(method){
		return JSTOQGIS_INTERFACE.getErrorMessages(method);
	},
	
	ZoomToExtent: function(minx,miny,maxx,maxy,epsg) {
			JSTOQGIS_INTERFACE.zoomToExtent(minx,miny,maxx,maxy,epsg);			
	},
	
	ZoomToPoint: function(x,y,scale,epsg) {
		JSTOQGIS_INTERFACE.zoomToPoint(x,y,scale,epsg);			
	},	
	
	ZoomScale: function(scale) {
		JSTOQGIS_INTERFACE.zoomScale(scale);			
	},	
	
	ZoomIn: function() {
		JSTOQGIS_INTERFACE.zoomIn();			
	},
	
	ZoomOut: function() {
		JSTOQGIS_INTERFACE.zoomOut();			
	},
	
	GetCurrentScale: function(){
		return JSTOQGIS_INTERFACE.getCurrentScale();
	},
	
	SetScale: function(scale){
		return JSTOQGIS_INTERFACE.setScale(scale);
	},
	
	GetQgisVersion: function(){
		return JSTOQGIS_INTERFACE.getQgisVersion();
	},
	
	GetCRS: function(){
		return JSTOQGIS_INTERFACE.getCRS();
	},
	
	SetCRS: function(epsg){
		JSTOQGIS_INTERFACE.setCRS(epsg);
	},	
	GetLayersData: function(){
		return JSTOQGIS_INTERFACE.getLayersData();
	},
	
	AddWMSLayer: function(legendName,url,layers,format,crs){
		JSTOQGIS_INTERFACE.addWMSLayer(legendName,url,layers,format,crs);
	},
	
	IdentifyLayer: function(lon,lat,epsg,layerId){
		return JSTOQGIS_INTERFACE.identifyLayer(lon,lat,epsg,layerId);
	},
	
	AddWKTLayer: function(WKT,legendName,crs,fields){
		console.log(fields);
		return JSTOQGIS_INTERFACE.addWKTLayer(WKT,legendName,crs,JSON.stringify(fields));
	},
	
	
},JQ);


QJ = _.extend({
	_NAME_:'QJ',
	ZoomToExtent: function(minx,miny,maxx,maxy) {
			map.fitBounds([
			              [miny,minx],
			              [maxy,maxx]
			          ]);
	},
	GetLayersData: function() {
		JSTOQGIS_INTERFACE.setInterChange('getlayersdata','json','{"nome":"walter"}');
	},
	
	GetExtent: function() {
		bound = map.getBounds();
		extent = {
				'minx':bound.getWest(),
				'miny':bound.getSouth(),
				'maxx':bound.getEast(),
				'maxy':bound.getNorth(),
		};
		JSTOQGIS_INTERFACE.setInterChange('getextent','json',JSON.stringify(extent));
	},
	
	GetLayersData: function() {
		var layersData = {};
		map.eachLayer(function(layer){
			console.log(layer);
			layersData[layer._leaflet_id] = layer.options;
			layersData[layer._leaflet_id]['url'] = layer._url;
		});
		JSTOQGIS_INTERFACE.setInterChange('getlayersdata','json',JSON.stringify(layersData));
	},
	
	ZoomIn: function() {
		map.zoomIn();
	},
	
	ZoomOut: function() {
		map.zoomOut();
	}
	
},QJ);



//Apply control of JSTOQGIS_INTERFASE
var JSTOQGIS_INTERFACE_FUNC_RES_JSON = ['GetLayersData','IdentifyLayer','GetErrorMessages']
var JSTOQGIS_INTERFACE_FUNC_SYNC = ['ZoomToExtent']
var ORDER = [];

_.each([JQ,QJ], function(valueObj,k,o){
	var ENV = o[k]._NAME_;
	_.each(valueObj,function(value,key,obj){
		if(key != '_NAME_'){
			obj[key] = _.wrap(obj[key],function(func){
				if (_.isUndefined(window.JSTOQGIS_INTERFACE))
					return;
				var k = key;
				var env = ENV;
				// check to avoid ping pong effect
				if(_.indexOf(JSTOQGIS_INTERFACE_FUNC_SYNC,k) != -1){
					if (!_.has(ORDER,k))
						ORDER[k] = [];
					ORDER[k].push(env);
					if(ORDER[k][0] != env)
					{
						return;
					}
						
				}
				var toRes;
				args = Array.prototype.slice.call(arguments,1);
				if(_.indexOf(JSTOQGIS_INTERFACE_FUNC_RES_JSON,k) == -1){
					var toRes = func.apply(this, args);
				}else{
					var json = func.apply(this, args);
					var toRes = eval("(" + json + ")");
				}
				
				if(_.indexOf(JSTOQGIS_INTERFACE_FUNC_SYNC,k) != -1){
					ORDER[k] = [];
				}
				return toRes;
			});
		}
	});
});


