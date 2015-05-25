Ext.require([
	"Ext.container.Viewport",
	"Ext.layout.container.Border",
	"GeoExt.tree.Panel",
	"Ext.tree.plugin.TreeViewDragDrop",
	"GeoExt.panel.Map",
	"GeoExt.tree.OverlayLayerContainer",
	"GeoExt.tree.BaseLayerContainer",
	"GeoExt.data.LayerTreeModel",
	"GeoExt.tree.View",
	"GeoExt.tree.Column",
	"GeoExt.container.WmsLegend",
	"GeoExt.container.UrlLegend",
	"GeoExt.container.VectorLegend",
	"GeoExt.panel.Legend"
]);

Ext.define("User", {
	extend: "Ext.data.Model",
	fields: [{
		name: "name",
		type: "string"
	}]
});
 
Ext.define("Styler", {
	mixins: {
		observable: "Ext.util.Observable"
	},
	proxy: null,
	mapPanel: null,
	treePanel: null,
	legendPanel: null,
	currentLayer: null,
	sldManager: null,
	currentLegend: null,
	styleDialog: null,
	ruleDialog: null,
	windowPositions: {
		featureDialog: {},
		ruleDialog: {}
	},
	saving: null,
	constructor: function(configuration) {
		this.mixins.observable.constructor.call(this);
		this.proxy = configuration.proxy;
		this.sldManager = Ext.create("SldManager", {
			proxy: this.proxy
		});
		this.addEvents("layerchanged", "ruleadded", "ruleremoved", "ruleupdated");
		this.on({
			"layerchanged": function(layer) {
			},
			"ruleadded": function(rule) {
			},
			"ruleremoved": function(rule) {
			},
			"ruleupdated": function(rule) {
			},
			scope: this
		});
	},
	createLayout: function() {
		this.mapPanel = Ext.create("GeoExt.panel.Map", {
			border: true,
			region: "center",
			map: {
				allOverlays: false
			},
			center: [14, 37.5],
			zoom: 7,
			layers: [
//				new OpenLayers.Layer.Vector("Polygons", {
//					styleMap: new OpenLayers.StyleMap({
//						"default": new OpenLayers.Style({
//							pointRadius: 8,
//							fillColor: "#ffffff",
//							strokeColor: "#000000",
//							strokeWidth: 2
//						}, {
//							title: "Polygon"
//						}),
//						"select": new OpenLayers.Style({
//							pointRadius: 8,
//							fillColor: "#ffffff",
//							strokeColor: "#ff0000",
//							strokeWidth: 2
//						}, {
//							title: "Polygon"
//						})
//					}),
//					visibility: false
//				}),
//				new OpenLayers.Layer.Vector("Lines", {
//					styleMap: new OpenLayers.StyleMap({
//						"default": new OpenLayers.Style({
//							pointRadius: 8,
//							strokeColor: "#000000",
//							strokeWidth: 2
//						}, {
//							title: "Line"
//						}),
//						"select": new OpenLayers.Style({
//							pointRadius: 8,
//							strokeColor: "#ff0000",
//							strokeWidth: 2
//						}, {
//							title: "Line"
//						})
//					}),
//					visibility: false
//				}),
//				new OpenLayers.Layer.Vector("Points", {
//					styleMap: new OpenLayers.StyleMap({
//						"default": new OpenLayers.Style({
//							pointRadius: 8,
//							strokeColor: "#000000",
//							strokeWidth: 2
//						}, {
//							title: "Point"
//						}),
//						"select": new OpenLayers.Style({
//							pointRadius: 8,
//							strokeColor: "#ff0000",
//							strokeWidth: 2
//						}, {
//							title: "Point"
//						})
//					}),
//					visibility: false
//				}),
//				new OpenLayers.Layer.WMS("Country Borders", "http://ows.terrestris.de/geoserver/osm/wms", {
//					layers: "osm:osm-country-borders",
//					transparent: true,
//					format: "image/png"
//				},
//				{
//					isBaseLayer: false,
//					buffer: 0,
//					visibility: false
//				}),
//				new OpenLayers.Layer.WMS("Gas Stations", "http://ows.terrestris.de/geoserver/osm/wms", {
//					layers: "osm:osm-fuel",
//					transparent: true,
//					format: "image/png"
//				},
//				{
//					isBaseLayer: false,
//					buffer: 0,
//					visibility: false
//				}),
//				new OpenLayers.Layer.WMS("Bus Stops", "http://ows.terrestris.de/osm-haltestellen?", {
//					layers: "OSM-Bushaltestellen",
//					transparent: true,
//					format: "image/png"
//				},
//				{
//					singleTile: true,
//					visibility: false
//				}),
//				new OpenLayers.Layer.WMS("Tasmania (Group Layer)", "http://demo.opengeo.org/geoserver/wms", {
//					layers: [
//						"topp:tasmania_state_boundaries",
//						"topp:tasmania_water_bodies",
//						"topp:tasmania_cities",
//						"topp:tasmania_roads"
//					],
//					transparent: true,
//					format: "image/gif"
//				},
//				{
//					isBaseLayer: false,
//					buffer: 0,
//					displayInLayerSwitcher: false,
//					visibility: false
//				}),
				new OpenLayers.Layer.WMS("USA Population", "http://localhost:8080/geoserver/wms", {
					layers: "topp:states",
					styles: "population",
					transparent: true,
					format: "image/png"
				},
				{
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}),
				new OpenLayers.Layer.WMS("Tasmania roads", "http://localhost:8080/geoserver/wms", {
					layers: "topp:tasmania_roads",
					styles: "simple_roads",
					transparent: true,
					format: "image/png"
				},
				{
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}),
				new OpenLayers.Layer.WMS("Spearfish archeologic sites", "http://localhost:8080/geoserver/wms", {
					layers: "sf:archsites",
					styles: "point",
					transparent: true,
					format: "image/png"
				},
				{
					isBaseLayer: false,
					buffer: 0,
					visibility: false
				}),
//				new OpenLayers.Layer.WMS("Global Imagery", "http://maps.opengeo.org/geowebcache/service/wms", {
//					layers: "bluemarble",
//					format: "image/png8"
//				},
//				{
//					buffer: 0
//				}),
				new OpenLayers.Layer.WMS("OpenStreetMap WMS", "http://ows.terrestris.de/osm/service?", {
					layers: "OSM-WMS"
				}, {
					attribution: "&copy; terrestris GmbH & Co. KG <br>" + "Data &copy; OpenStreetMap " + "<a href=\"http://www.openstreetmap.org/copyright/en\"" + "target=\"_blank\">contributors<a>",
					visibility: false
				})
			]
		});
		var store = Ext.create("Ext.data.TreeStore", {
			model: "GeoExt.data.LayerTreeModel",
			root: {
				expanded: true,
				children: [{
					plugins: [{
						ptype: "gx_layercontainer",
						store: this.mapPanel.layers
					}],
					expanded: true
				}, {
					plugins: ["gx_baselayercontainer"],
					expanded: true,
					text: "Base Maps"
				}, {
					plugins: ["gx_overlaylayercontainer"],
					expanded: true
				}]
			}
		});
		var layer;
		this.treePanel = Ext.create("GeoExt.tree.Panel", {
			title: "Livelli",
			border: true,
			width: 250,
			split: true,
			collapsible: true,
			collapseMode: "mini",
			autoScroll: true,
			store: store,
			rootVisible: false,
			lines: false,
			tbar: [{
				text: "Rimuovi livello",
				handler: function() {
					layer = this.mapPanel.map.layers[2];
					this.mapPanel.map.removeLayer(layer);
				}
			}, {
				text: "Aggiungi livello",
				handler: function() {
					this.mapPanel.map.addLayer(layer);
				}
			}]
		});
		this.legendPanel = Ext.create("GeoExt.panel.Legend", {
			title: "Legenda",
			defaults: {
				style: "padding:5px"
			},
			bodyStyle: "padding:5px",
			width: 350,
			autoScroll: true,
			bbar: [{
				text: "Aggiungi stile",
				iconCls: "add",
				disabled: true,
				handler: function() {
					if (this.currentLegend != null) {
						var Type = OpenLayers.Symbolizer[this.currentLegend.symbolType];
						var rule = new OpenLayers.Rule({
							symbolizers: [
								new Type()
							]
						});
						this.currentLegend.rules.push(rule);
						this.fireEvent("ruleadded", rule);
						this.showRule(rule, function() {
							if (!this.saving) {
								var rule = this.currentLegend.rules.pop();
								this.fireEvent("ruleremoved", rule);
							}
						});
					}
				},
				scope: this
			}, {
				text: "Rimuovi stile",
				iconCls: "delete",
				disabled: true,
				handler: function() {
					if (this.currentLegend != null) {
						var rule = this.currentLegend.selectedRule;
						var message = "Sei sicuro di voler cancellare la regola " + this.currentLegend.getRuleTitle(rule) + "?";
						Ext.Msg.confirm("Cancella regola", message, function(yesno) {
							if (yesno == "yes") {
								this.currentLegend.selectedRule = null;
								var rule = this.currentLegend.rules.pop();
								this.fireEvent("ruleremoved", rule);
								sldMgr = this.sldManager;
								sldMgr.saveSld(this.currentLayer, function() {
									this.ruleDialog.close();
									this.repaint();
								}, this);
							}
						}, this);
					}
				},
				scope: this
			}]
		});
		var westPanel = Ext.create("Ext.Panel", {
			header: false,
			border: true,
			layout: "anchor",
			region: "west",
			width: 250,
			collapsible: true,
			hideCollapseTool: true,
			collapseMode: "mini",
			items: [
				this.treePanel,
				this.legendPanel
			]
		});
		Ext.create("Ext.Viewport", {
			layout: "fit",
			hideBorders: true,
			items: {
				layout: "border",
				deferredRender: false,
				items: [this.mapPanel, westPanel, {
					contentEl: "desc",
					region: "east",
					bodyStyle: {
						"padding": "5px"
					},
					collapsible: true,
					collapseMode: "mini",
					split: true,
					width: 200,
					title: "Description"
				}]
			}
		});
	},
	setup: function() {
//		this.mapPanel.map.layers[0].addFeatures([
//			new OpenLayers.Feature.Vector(
//				OpenLayers.Geometry.fromWKT(
//					"POLYGON(15.8467 37.938, 14.8531 38.9433, 14.858 37.9395, 15.8467 37.938)"
//				)
//			)
//		]);
//		this.mapPanel.map.layers[1].addFeatures([
//			new OpenLayers.Feature.Vector(
//				OpenLayers.Geometry.fromWKT(
//					"LINESTRING(13.8467 37.938, 12.8531 38.9433, 12.858 37.9395)"
//				)
//			)
//		]);
//		this.mapPanel.map.layers[2].addFeatures([
//			new OpenLayers.Feature.Vector(
//				OpenLayers.Geometry.fromWKT(
//					"POINT(11.8467 37.938)"
//				)
//			)
//		]);
		this.currentLayer = this.mapPanel.map.layers[0];
		this.treePanel.on({
			"checkchange": function(node, checked) {
			},
			"select": function(tree, record, index) {
				this.currentLayer = record.data.layer;
				this.getLayerRules(this.currentLayer);
			},
			"selectionchange": function(tree, selected) {
			},
			scope: this
		});
		if (this.legendPanel.items.length > 0) {
			for (var legendIndex = 0; legendIndex < this.legendPanel.items.length; legendIndex++) {
				var legend = this.legendPanel.getComponent(legendIndex);
				if (Ext.getClassName(legend) === "GeoExt.container.VectorLegend") {
					legend.setCurrentScaleDenominator(this.mapPanel.map.getScale());
					legend.selectOnClick = true;
					legend.on({
						"ruleclick": function(legend, rule) {
						},
						"rulemoved": function(legend, rule) {
						},
						"ruleselected": function(legend, rule) {
							if (this.currentLegend != null) {
								this.currentLegend.unselect();
							}
							this.currentLegend = legend;
							this.getAddButton().enable();
							this.getDeleteButton().enable();
							this.showRule(rule, function() {
								if (!this.saving) {
									var rule = this.currentLegend.rules.pop();
									this.fireEvent("ruleremoved", rule);
								}
							});
						},
						"ruleunselected": function(legend, rule) {
							this.currentLegend = null;
							this.getAddButton().disable();
							this.getDeleteButton().disable();
						},
						"symbolclick": function(legend, rule) {
						},
						"titleclick": function(legend, rule) {
						},
						scope: this
					});
				}
			}
		}
	},
	getLayerRules: function(layer) {
		this.sldManager.loadSld(layer, layer.params["STYLES"], Ext.Function.pass(function(result) {
			this.showStyle(result.style);
//			this.showRule(result.style.rules[0], function() {
//				if (!this.saving) {
//					var rule = this.currentLegend.rules.pop();
//					this.fireEvent("ruleremoved", rule);
//				}
//			});
		}, [], this));
	},
	showStyle: function(style) {
		if (this.ruleDialog) {
			this.ruleDialog.destroy();
		}
		this.styleDialog = Ext.create("Ext.Window", {
			title: "Stile \"" + (style.title || style.name || "Untitled") + "\"",
			layout: "fit",
			width: 500,
			constrainHeader: true,
			items: [{
				xtype: "styler_stylepanel",
				style: style,
				mapPanel: this.mapPanel,
				listeners: {
					"stylecanceled": function() {
						this.styleDialog.close();
					},
					"stylesaved": function(style) {
						var sld = {
							namedLayers: {
								"Default Styler": {
									userStyles: [
										style
									],
									name: "Default Styler"
								}
							},
							version: "1.0.0"
						}
						var format = new OpenLayers.Format.SLD({
							multipleSymbolizers: true
						});
						console.log(format.write(sld));
					},
					"ruleselected": function(rule) {
					},
					"ruleadded": function() {
					},
					"ruleremoved": function(rule) {
					},
					scope: this
				}
			}]
		});
		this.styleDialog.show();
	},
	showRule: function(rule, closeCallback) {
		var newRule = rule.clone();
		if (this.ruleDialog) {
			this.ruleDialog.destroy();
		}
		this.ruleDialog = Ext.create("Ext.Window", {
			title: "Stile \"" + (rule.title || rule.name || "Untitled") + "\"",
			layout: "fit",
			width: 315,
			x: this.windowPositions.ruleDialog.x,
			y: this.windowPositions.ruleDialog.y,
			constrainHeader: true,
			items: [{
				xtype: "styler_rulepanel",
				autoHeight: false,
				autoScroll: true,
				rule: newRule,
//				symbolType: symbolType,
//				fonts: this.fonts,
				nestedFilters: false,
				scaleLevels: this.mapPanel.map.baseLayer.numZoomLevels,
				minScaleDenominatorLimit: OpenLayers.Util.getScaleFromResolution(this.mapPanel.map.baseLayer.resolutions[this.mapPanel.map.baseLayer.numZoomLevels - 1], this.mapPanel.map.units),
				maxScaleDenominatorLimit: OpenLayers.Util.getScaleFromResolution(this.mapPanel.map.baseLayer.resolutions[0], this.mapPanel.map.units),
				scaleSliderTemplate: "<div>{scaleType} Zoom Level: {zoom}</div>" + "<div>Current Map Zoom: {mapZoom}</div>",
				modifyScaleTipContext: Ext.Function.pass(function(panel, data) {
					data.mapZoom = this.mapPanel.map.getZoom();
				}, [], this),
//				attributes: new GeoExt.data.AttributeStore({
//					url: "../../../geoserver/wfs?",
//					baseParams: {
//						version: "1.1.1",
//						request: "DescribeFeatureType",
//						typename: layer.params["LAYERS"]
//					},
//					ignore: {
//						name: this.schemaManager.getGeometryName(layer)
//					}
//				}),
				attributes: Ext.create("Ext.data.Store", {
					model: "User",
					data : [
						{
							name: "pippo"
						},
						{
							name: "pluto"
						},
						{
							name: "paperino"
						},
						{
							name: "cat"
						},
						{
							name: "str1"
						}
					]
				}),
				pointGraphics: [{
					display: "circle",
					value: "circle",
					mark: true,
					preview: "theme/img/circle.gif"
				}, {
					display: "square",
					value: "square",
					mark: true,
					preview: "theme/img/square.gif"
				}, {
					display: "triangle",
					value: "triangle",
					mark: true,
					preview: "theme/img/triangle.gif"
				}, {
					display: "star",
					value: "star",
					mark: true,
					preview: "theme/img/star.gif"
				}, {
					display: "cross",
					value: "cross",
					mark: true,
					preview: "theme/img/cross.gif"
				}, {
					display: "x",
					value: "x",
					mark: true,
					preview: "theme/img/x.gif"
				}, {
					display: "custom..."
				}]
			}],
			bbar: ["->", {
				text: "Annulla",
				iconCls: "cancel",
				handler: function() {
					this.ruleDialog.close();
				},
				scope: this
			}, {
				text: "Salva",
				iconCls: "save",
				handler: function() {
					this.saving = true;
					this.ruleDialog.disable();
					this.updateRule(rule, newRule);
					this.sldManager.saveSld(this.currentLayer, function() {
						this.ruleDialog.close();
						this.repaint();
						this.saving = false;
					}, this);
				},
				scope: this
			}],
			listeners: {
				close: function() {
					if (closeCallback) {
						closeCallback.call(this);
					}
				},
				move: function(cp, x, y) {
					this.windowPositions["ruleDialog"] = {
						x: x,
						y: y
					};
				},
				scope: this
			}
		});
		this.ruleDialog.show();
	},
	updateRule: function(rule, newRule) {
		rule.title = newRule.title;
		rule.symbolizers = newRule.symbolizers;
		rule.filter = newRule.filter;
		rule.minScaleDenominator = newRule.minScaleDenominator;
		rule.maxScaleDenominator = newRule.maxScaleDenominator;
		this.fireEvent("ruleupdated", rule);
	},
	getAddButton: function() {
		return this.legendPanel.getDockedItems()[1].getComponent(0);
	},
	getDeleteButton: function() {
		return this.legendPanel.getDockedItems()[1].getComponent(1);
	}
});
