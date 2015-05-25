Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.FeatureRenderer", {
	extend: Ext.form.FieldContainer,
	alias: "widget.styler_featurerenderer",
	feature: void 0,
	symbolizers: [OpenLayers.Feature.Vector.style["default"]],
	symbolType: "Polygon",
	resolution: 1,
	minWidth: 20,
	minHeight: 20,
	renderers: ["SVG", "VML", "Canvas"],
	rendererOptions: null,
	pointFeature: void 0,
	lineFeature: void 0,
	polygonFeature: void 0,
	textFeature: void 0,
	renderer: null,
	initComponent: function() {
		this.autoEl = {
			tag: "div",
			"class": this.imgCls ? this.imgCls : "",
			id: this.getId()
		};
		this.callParent(arguments);
		Ext.applyIf(this, {
			pointFeature: new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0, 0)),
			lineFeature: new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(-8, -3), new OpenLayers.Geometry.Point(-3, 3), new OpenLayers.Geometry.Point(3, -3), new OpenLayers.Geometry.Point(8, 3)])),
			polygonFeature: new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(-8, -4), new OpenLayers.Geometry.Point(-6, -6), new OpenLayers.Geometry.Point(6, -6), new OpenLayers.Geometry.Point(8, -4), new OpenLayers.Geometry.Point(8, 4), new OpenLayers.Geometry.Point(6, 6), new OpenLayers.Geometry.Point(-6, 6), new OpenLayers.Geometry.Point(-8, 4)])])),
			textFeature: new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(0, 0))
		});
		this.feature || this.setFeature(null, {
			draw: !1
		});
		this.addEvents("click")
	},
	initCustomEvents: function() {
		this.clearCustomEvents();
		this.el.on("click", this.onClick, this)
	},
	clearCustomEvents: function() {
		this.el && this.el.removeAllListeners && this.el.removeAllListeners()
	},
	onClick: function() {
		this.fireEvent("click", this)
	},
	onRender: function(a, b) {
		this.el || (this.el = document.createElement("div"), this.el.id = this.getId());
		(!this.renderer || !this.renderer.supported()) && this.assignRenderer();
		this.renderer.map = {
			getResolution: Ext.Function.bind(function() {
				return this.resolution
			}, this)
		};
		this.callParent(arguments);
		this.drawFeature()
	},
	afterRender: function() {
		this.callParent(arguments);
		this.initCustomEvents()
	},
	onResize: function(a, b) {
		this.setRendererDimensions();
		this.callParent(arguments)
	},
	setRendererDimensions: function() {
		var a = this.feature.geometry.getBounds(),
			b = a.getWidth(),
			c = a.getHeight(),
			d = this.initialConfig.resolution;
		d || (d = Math.max(b / this.width || 0, c / this.height || 0) || 1);
		this.resolution = d;
		var b = Math.max(this.width || this.minWidth, b / d),
			c = Math.max(this.height || this.minHeight, c / d),
			a = a.getCenterPixel(),
			e = b * d / 2,
			d = c * d / 2,
			d = new OpenLayers.Bounds(a.x - e, a.y - d, a.x + e, a.y + d);
		this.renderer.setSize(new OpenLayers.Size(Math.round(b), Math.round(c)));
		this.renderer.setExtent(d, !0)
	},
	assignRenderer: function() {
		for (var a =
				0, b = this.renderers.length; a < b; ++a) {
			var c = OpenLayers.Renderer[this.renderers[a]];
			if (c && c.prototype.supported()) {
				this.renderer = new c(this.el, this.rendererOptions);
				break
			}
		}
	},
	setSymbolizers: function(a, b) {
		this.symbolizers = a;
		(!b || b.draw) && this.drawFeature()
	},
	setSymbolType: function(a, b) {
		this.symbolType = a;
		this.setFeature(null, b)
	},
	setFeature: function(a, b) {
		this.feature = a || this[this.symbolType.toLowerCase() + "Feature"];
		(!b || b.draw) && this.drawFeature()
	},
	drawFeature: function() {
		this.renderer.clear();
		this.setRendererDimensions();
		for (var a, b, c = 0, d = this.symbolizers.length; c < d; ++c) a = this.symbolizers[c], b = this.feature, a instanceof OpenLayers.Symbolizer ? (a = a.clone(), OpenLayers.Symbolizer.Text && (a instanceof OpenLayers.Symbolizer.Text && !1 === a.graphic) && (a.fill = a.stroke = !1), this.initialConfig.feature || (b = a.CLASS_NAME.split(".").pop().toLowerCase(), b = this[b + "Feature"])) : a = Ext.apply({}, a), this.renderer.drawFeature(b.clone(), a)
	},
	update: function(a) {
		a = a || {};
		a.feature ? this.setFeature(a.feature, {
			draw: !1
		}) : a.symbolType && this.setSymbolType(a.symbolType, {
			draw: !1
		});
		a.symbolizers && this.setSymbolizers(a.symbolizers, {
			draw: !1
		});
		this.drawFeature()
	},
	beforeDestroy: function() {
		this.clearCustomEvents();
		this.renderer && this.renderer.destroy()
	}
});
