Ext.define("SldManager", {
	proxy: null,
	format: null,
	layerData: null,
	constructor: function(configuration) {
		this.proxy = configuration.proxy;
		this.format = new OpenLayers.Format.SLD({
			multipleSymbolizers: true
		});
		this.layerData = {};
	},
	getUrl: function(layer, styleName) {
		var url;
		if (layer instanceof OpenLayers.Layer.WMS) {
			url = layer.url.split("?")[0].replace("/wms", "/rest/styles/" + styleName);
		}
		return url;
	},
	loadSld: function(layer, styleName, callback) {
		Ext.Ajax.request({
			url: this.proxy,
			method: "POST",
			disableCaching: false,
			success: function(request) {
				var sld = this.format.read(request.responseXML.documentElement ? request.responseXML : request.responseText);
				for (var namedLayer in sld.namedLayers) {
					break;
				}
				this.layerData[layer.id] = {
					style: sld.namedLayers[namedLayer].userStyles[0],
					sld: sld,
					styleName: styleName
				};
				callback(this.layerData[layer.id]);
			},
			params: {
				url: this.getUrl(layer, styleName) + ".sld",
				authentication: "{\"host\":\"localhost\";\"port\":8080;\"user\":\"admin\";\"password\":\"geoserver\"}"
			},
			scope: this
		});
	},
	saveSld: function(layer, callback, scope) {
		alert(this.format.write(this.layerData[layer.id].sld));
		logProperties(layer);
		Ext.Ajax.request({
			url: this.getUrl(layer, this.layerData[layer.id].styleName),
			method: "PUT",
			headers: {
				"Content-Type": "application/vnd.ogc.sld+xml; charset=UTF-8"
			},
			xmlData: this.format.write(this.layerData[layer.id].sld),
			success: function(request) {
				callback.call(scope || this, request);
			}
		});
	}
});
