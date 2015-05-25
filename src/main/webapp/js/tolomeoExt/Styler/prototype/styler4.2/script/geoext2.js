(function() {
	var a = [],
		b = "",
		b = "v2.0.2";
	Ext.versions.extjs.version && a.push("ExtJS: " + Ext.versions.extjs.version);
	window.OpenLayers && a.push("OpenLayers: " + OpenLayers.VERSION_NUMBER);
	a.push("GeoExt: " + b);
	Ext.define("GeoExt.Version", {
		singleton: !0,
		version: b,
		environment: a.join(", ")
	}, function() {
		GeoExt.version = GeoExt.Version.version
	})
})();
Ext.define("GeoExt.Action", {
	extend: Ext.Action,
	alias: "widget.gx_action",
	control: null,
	activateOnEnable: !1,
	deactivateOnDisable: !1,
	map: null,
	uScope: null,
	uHandler: null,
	uToggleHandler: null,
	uCheckHandler: null,
	constructor: function(a) {
		this.uScope = a.scope;
		this.uHandler = a.handler;
		this.uToggleHandler = a.toggleHandler;
		this.uCheckHandler = a.checkHandler;
		a.scope = this;
		a.handler = this.pHandler;
		a.toggleHandler = this.pToggleHandler;
		a.checkHandler = this.pCheckHandler;
		var b = this.control = a.control;
		delete a.control;
		this.activateOnEnable = !!a.activateOnEnable;
		delete a.activateOnEnable;
		this.deactivateOnDisable = !!a.deactivateOnDisable;
		delete a.deactivateOnDisable;
		b && (a.map && (a.map.addControl(b), delete a.map), (a.pressed || a.checked) && b.map && b.activate(), b.active && (a.pressed = !0, a.checked = !0), b.events.on({
			activate: this.onCtrlActivate,
			deactivate: this.onCtrlDeactivate,
			scope: this
		}));
		this.callParent(arguments)
	},
	pHandler: function(a) {
		var b = this.control;
		b && b.type == OpenLayers.Control.TYPE_BUTTON && b.trigger();
		this.uHandler && this.uHandler.apply(this.uScope,
			arguments)
	},
	pToggleHandler: function(a, b) {
		this.changeControlState(b);
		this.uToggleHandler && this.uToggleHandler.apply(this.uScope, arguments)
	},
	pCheckHandler: function(a, b) {
		this.changeControlState(b);
		this.uCheckHandler && this.uCheckHandler.apply(this.uScope, arguments)
	},
	changeControlState: function(a) {
		a ? this._activating || (this._activating = !0, this.control.activate(), this.initialConfig.pressed = !0, this.initialConfig.checked = !0, this._activating = !1) : this._deactivating || (this._deactivating = !0, this.control.deactivate(),
			this.initialConfig.pressed = !1, this._deactivating = this.initialConfig.checked = !1)
	},
	onCtrlActivate: function() {
		this.control.type == OpenLayers.Control.TYPE_BUTTON ? this.enable() : (this.safeCallEach("toggle", [!0]), this.safeCallEach("setChecked", [!0]))
	},
	onCtrlDeactivate: function() {
		this.control.type == OpenLayers.Control.TYPE_BUTTON ? this.disable() : (this.safeCallEach("toggle", [!1]), this.safeCallEach("setChecked", [!1]))
	},
	safeCallEach: function(a, b) {
		for (var c = this.items, d = 0, e = c.length; d < e; d++) c[d][a] && (c[d].rendered ?
			c[d][a].apply(c[d], b) : c[d].on({
				render: Ext.Function.bind(c[d][a], c[d], b),
				single: !0
			}))
	},
	setDisabled: function(a) {
		!a && (this.activateOnEnable && this.control && !this.control.active) && this.control.activate();
		a && (this.deactivateOnDisable && this.control && this.control.active) && this.control.deactivate();
		return GeoExt.Action.superclass.setDisabled.apply(this, arguments)
	}
});
Ext.define("GeoExt.FeatureRenderer", {
	extend: Ext.Component,
	alias: "widget.gx_renderer",
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
(function() {
	var a = {
			eq: OpenLayers.Filter.Comparison.EQUAL_TO,
			ne: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
			lt: OpenLayers.Filter.Comparison.LESS_THAN,
			le: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
			gt: OpenLayers.Filter.Comparison.GREATER_THAN,
			ge: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
			like: OpenLayers.Filter.Comparison.LIKE
		},
		b = {
			text: /^(text|string)$/i,
			number: /^(number|float|decimal|double|int|long|integer|short)$/i,
			"boolean": /^(boolean)$/i,
			date: /^(date|dateTime)$/i
		};
	Ext.define("GeoExt.Form", {
		singleton: !0,
		ENDS_WITH: 1,
		STARTS_WITH: 2,
		CONTAINS: 3,
		toFilter: function(b, d, e) {
			b instanceof Ext.form.Panel && (b = b.getForm());
			var f = [];
			b = b.getValues(!1);
			for (var g in b) {
				var h = g.split("__"),
					j = b[g],
					k;
				1 < h.length && void 0 !== (k = a[h[1]]) ? g = h[0] : k = OpenLayers.Filter.Comparison.EQUAL_TO;
				if (k === OpenLayers.Filter.Comparison.LIKE) switch (e) {
					case GeoExt.Form.ENDS_WITH:
						j = ".*" + j;
						break;
					case GeoExt.Form.STARTS_WITH:
						j += ".*";
						break;
					case GeoExt.Form.CONTAINS:
						j = ".*" + j + ".*"
				}
				f.push(new OpenLayers.Filter.Comparison({
					type: k,
					value: j,
					property: g
				}))
			}
			return 1 == f.length && d != OpenLayers.Filter.Logical.NOT ? f[0] : new OpenLayers.Filter.Logical({
				type: d || OpenLayers.Filter.Logical.AND,
				filters: f
			})
		},
		recordToField: function(a, d) {
			d = d || {};
			var e = a.get("type");
			if ("object" === typeof e && e.xtype) return e;
			var e = e.split(":").pop(),
				f, g = a.get("name"),
				h = a.get("restriction") || {},
				j = a.get("nillable") || !1,
				k = a.get("label"),
				l = d.labelTpl;
			l ? k = (l instanceof Ext.Template ? l : new Ext.XTemplate(l)).apply(a.data) : null == k && (k = g);
			g = {
				name: g,
				labelStyle: j ? "" : null != d.mandatoryFieldLabelStyle ?
					d.mandatoryFieldLabelStyle : "font-weight:bold;"
			};
			h.enumeration ? f = Ext.apply({
				xtype: "combo",
				fieldLabel: k,
				mode: "local",
				forceSelection: !0,
				triggerAction: "all",
				editable: !1,
				store: h.enumeration
			}, g) : e.match(b.text) ? (e = void 0 !== h.maxLength ? parseFloat(h.maxLength) : void 0, h = void 0 !== h.minLength ? parseFloat(h.minLength) : void 0, f = Ext.apply({
				xtype: "textfield",
				fieldLabel: k,
				maxLength: e,
				minLength: h
			}, g)) : e.match(b.number) ? (e = void 0 !== h.maxInclusive ? parseFloat(h.maxInclusive) : void 0, h = void 0 !== h.minInclusive ? parseFloat(h.minInclusive) :
				void 0, f = Ext.apply({
					xtype: "numberfield",
					fieldLabel: k,
					maxValue: e,
					minValue: h
				}, g)) : e.match(b["boolean"]) ? (f = Ext.apply({
				xtype: "checkbox"
			}, g), f[d.checkboxLabelProperty || "boxLabel"] = k) : e.match(b.date) && (f = Ext.apply({
				xtype: "datefield",
				fieldLabel: k,
				format: "c"
			}, g));
			return f
		}
	})
})();
Ext.define("GeoExt.Lang", {
	extend: Ext.util.Observable,
	singleton: !0,
	locale: navigator.language || navigator.userLanguage,
	dict: null,
	constructor: function() {
		this.addEvents("localize");
		this.dict = {};
		this.callParent()
	},
	add: function(a, b) {
		var c = this.dict[a];
		if (c)
			for (var d in b) c[d] = Ext.apply(c[d] || {}, b[d]);
		else this.dict[a] = Ext.apply({}, b);
		!a || a === this.locale ? this.set(a) : 0 === this.locale.indexOf(a + "-") && this.set(this.locale)
	},
	set: function(a) {
		var b = a ? a.split("-") : [],
			c = "",
			d = {},
			e, f, g, h;
		g = 0;
		for (h = b.length; g < h; ++g)
			if (c +=
				(c && "-" || "") + b[g], c in this.dict)
				for (f in e = this.dict[c], e) f in d ? Ext.apply(d[f], e[f]) : d[f] = Ext.apply({}, e[f]);
		for (f in d) {
			b = window;
			c = f.split(".");
			e = !1;
			g = 0;
			for (h = c.length; g < h; ++g) {
				var j = c[g];
				if (j in b) b = b[j];
				else {
					e = !0;
					break
				}
			}
			e || Ext.apply(b, d[f])
		}
		this.locale = a;
		this.fireEvent("localize", a)
	}
});
Ext.define("GeoExt.LegendImage", {
	extend: Ext.Component,
	alias: "widget.gx_legendimage",
	url: null,
	defaultImgSrc: null,
	imgCls: null,
	noImgCls: "gx-legend-noimage",
	initComponent: function() {
		this.addEvents("legendimageloaded");
		this.callParent(arguments);
		null === this.defaultImgSrc && (this.defaultImgSrc = Ext.BLANK_IMAGE_URL);
		this.autoEl = {
			tag: "img",
			"class": this.imgCls ? this.imgCls + " " + this.noImgCls : this.noImgCls,
			src: this.defaultImgSrc
		}
	},
	setUrl: function(a) {
		this.url = a;
		var b = this.getEl();
		b && (b.un("load", this.onImageLoad,
			this), b.on("load", this.onImageLoad, this, {
			single: !0
		}), b.un("error", this.onImageLoadError, this), b.on("error", this.onImageLoadError, this, {
			single: !0
		}), b.dom.src = a)
	},
	onRender: function(a, b) {
		this.callParent(arguments);
		this.url && this.setUrl(this.url)
	},
	onDestroy: function() {
		var a = this.getEl();
		a && (a.un("load", this.onImageLoad, this), a.un("error", this.onImageLoadError, this));
		this.callParent()
	},
	onImageLoadError: function() {
		var a = this.getEl();
		a.addCls(this.noImgCls);
		a.dom.src = this.defaultImgSrc
	},
	onImageLoad: function() {
		var a =
			this.getEl();
		OpenLayers.Util.isEquivalentUrl(a.dom.src, this.defaultImgSrc) || a.removeCls(this.noImgCls);
		this.fireEvent("legendimageloaded", this)
	}
});
Ext.define("GeoExt.container.LayerLegend", {
	extend: Ext.container.Container,
	alias: "widget.gx_layerlegend",
	alternateClassName: "GeoExt.LayerLegend",
	statics: {
		getTypes: function(a, b) {
			var c = (b || []).concat(),
				d = [],
				e, f;
			for (f in this.types) e = this.types[f].supports(a), 0 < e ? -1 == Ext.Array.indexOf(c, f) && d.push({
				type: f,
				score: e
			}) : Ext.Array.remove(c, f);
			d.sort(function(a, b) {
				return a.score < b.score ? 1 : a.score == b.score ? 0 : -1
			});
			e = d.length;
			f = Array(e);
			for (var g = 0; g < e; ++g) f[g] = d[g].type;
			return c.concat(f)
		},
		supports: function() {},
		types: {}
	},
	layerRecord: null,
	showTitle: !0,
	legendTitle: null,
	labelCls: null,
	layerStore: null,
	initComponent: function() {
		this.callParent(arguments);
		this.autoEl = {};
		this.add({
			xtype: "label",
			html: this.getLayerTitle(this.layerRecord),
			cls: "x-form-item x-form-item-label" + (this.labelCls ? " " + this.labelCls : "")
		});
		this.layerRecord && this.layerRecord.store && (this.layerStore = this.layerRecord.store, this.layerStore.on("update", this.onStoreUpdate, this), this.layerStore.on("add", this.onStoreAdd, this), this.layerStore.on("remove",
			this.onStoreRemove, this))
	},
	getLabel: function() {
		var a = this.items.get(0);
		return a.rendered ? a.el.dom.innerHTML : a.html
	},
	onStoreRemove: function() {},
	onStoreAdd: function() {},
	onStoreUpdate: function(a, b) {
		if (b === this.layerRecord && 0 < this.items.getCount()) {
			var c = b.getLayer();
			this.setVisible(c.getVisibility() && c.calculateInRange() && c.displayInLayerSwitcher && !b.get("hideInLegend"));
			this.update()
		}
	},
	update: function() {
		var a = this.getLayerTitle(this.layerRecord),
			b = this.items.get(0);
		b instanceof Ext.form.Label && this.getLabel() !==
			a && b.setText(a, !1)
	},
	getLayerTitle: function(a) {
		var b = this.legendTitle || "";
		this.showTitle && !b && a && !a.get("hideTitle") && (b = a.get("title") || a.get("name") || a.getLayer().name || "");
		return b
	},
	beforeDestroy: function() {
		this.layerStore && (this.layerStore.un("update", this.onStoreUpdate, this), this.layerStore.un("remove", this.onStoreRemove, this), this.layerStore.un("add", this.onStoreAdd, this));
		this.callParent()
	},
	onDestroy: function() {
		this.layerStore = this.layerRecord = null;
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.container.UrlLegend", {
	extend: GeoExt.container.LayerLegend,
	alias: "widget.gx_urllegend",
	alternateClassName: "GeoExt.UrlLegend",
	statics: {
		supports: function(a) {
			return Ext.isEmpty(a.get("legendURL")) ? 0 : 10
		}
	},
	defaultStyleIsFirst: !0,
	useScaleParameter: !0,
	baseParams: null,
	initComponent: function() {
		this.addEvents("legendimageloaded");
		this.callParent(arguments);
		this.add(Ext.create("GeoExt.LegendImage", {
			url: this.layerRecord.get("legendURL"),
			listeners: {
				legendimageloaded: function() {
					this.fireEvent("legendimageloaded",
						this)
				},
				scope: this
			}
		}))
	},
	update: function() {
		this.callParent(arguments);
		this.items.get(1).setUrl(this.layerRecord.get("legendURL"))
	}
}, function() {
	GeoExt.container.LayerLegend.types.gx_urllegend = GeoExt.container.UrlLegend
});
Ext.define("GeoExt.container.VectorLegend", {
		extend: GeoExt.container.LayerLegend,
		alias: "widget.gx_vectorlegend",
		alternateClassName: "GeoExt.VectorLegend",
		statics: {
			supports: function(a) {
				return a.getLayer() instanceof OpenLayers.Layer.Vector ? 1 : 0
			}
		},
		layerRecord: null,
		layer: null,
		rules: null,
		symbolType: null,
		untitledPrefix: "Untitled ",
		clickableSymbol: !1,
		clickableTitle: !1,
		selectOnClick: !1,
		enableDD: !1,
		bodyBorder: !1,
		feature: null,
		selectedRule: null,
		currentScaleDenominator: null,
		initComponent: function() {
			this.callParent();
			this.layerRecord && (this.layer = this.layerRecord.getLayer(), this.layer.map && (this.map = this.layer.map, this.currentScaleDenominator = this.layer.map.getScale(), this.layer.map.events.on({
				zoomend: this.onMapZoom,
				scope: this
			})));
			if (!this.symbolType)
				if (this.feature) this.symbolType = this.symbolTypeFromFeature(this.feature);
				else if (this.layer)
				if (0 < this.layer.features.length) {
					var a = this.layer.features[0].clone();
					a.attributes = {};
					this.feature = a;
					this.symbolType = this.symbolTypeFromFeature(this.feature)
				} else this.layer.events.on({
					featuresadded: this.onFeaturesAdded,
					scope: this
				});
			this.layer && (this.feature && !this.rules) && this.setRules();
			this.rulesContainer = new Ext.container.Container({
				autoEl: {}
			});
			this.add(this.rulesContainer);
			this.addEvents("titleclick", "symbolclick", "ruleclick", "ruleselected", "ruleunselected", "rulemoved");
			this.update()
		},
		onMapZoom: function() {
			this.setCurrentScaleDenominator(this.layer.map.getScale())
		},
		symbolTypeFromFeature: function(a) {
			return (a = a.geometry.CLASS_NAME.match(/Point|Line|Polygon/)) && a[0] || "Point"
		},
		onFeaturesAdded: function() {
			this.layer.events.un({
				featuresadded: this.onFeaturesAdded,
				scope: this
			});
			var a = this.layer.features[0].clone();
			a.attributes = {};
			this.feature = a;
			this.symbolType = this.symbolTypeFromFeature(this.feature);
			this.rules || this.setRules();
			this.update()
		},
		setRules: function() {
			var a = this.layer.styleMap && this.layer.styleMap.styles["default"];
			a || (a = new OpenLayers.Style);
			this.rules = 0 === a.rules.length ? [new OpenLayers.Rule({
				title: a.title,
				symbolizer: a.createSymbolizer(this.feature)
			})] : a.rules
		},
		setCurrentScaleDenominator: function(a) {
			a !== this.currentScaleDenominator && (this.currentScaleDenominator =
				a, this.update())
		},
		getRuleEntry: function(a) {
			a = Ext.Array.indexOf(this.rules, a);
			return this.rulesContainer.items.get(a)
		},
		addRuleEntry: function(a, b) {
			this.rulesContainer.add(this.createRuleEntry(a));
			b || this.doLayout()
		},
		removeRuleEntry: function(a, b) {
			var c = this.getRuleEntry(a);
			c && (this.rulesContainer.remove(c), b || this.doLayout())
		},
		selectRuleEntry: function(a) {
			var b = a != this.selectedRule;
			this.selectedRule && this.unselect();
			b && (this.getRuleEntry(a).body.addCls("x-boundlist-selected"), this.selectedRule = a, this.fireEvent("ruleselected",
				this, a))
		},
		unselect: function() {
			this.rulesContainer.items.each(function(a, b) {
				this.rules[b] == this.selectedRule && (a.body.removeCls("x-boundlist-selected"), this.selectedRule = null, this.fireEvent("ruleunselected", this, this.rules[b]))
			}, this)
		},
		createRuleEntry: function(a) {
			var b = !0;
			null != this.currentScaleDenominator && (a.minScaleDenominator && (b = b && this.currentScaleDenominator >= a.minScaleDenominator), a.maxScaleDenominator && (b = b && this.currentScaleDenominator < a.maxScaleDenominator));
			return {
				xtype: "panel",
				layout: "column",
				border: !1,
				hidden: !b,
				bodyStyle: this.selectOnClick ? {
					cursor: "pointer"
				} : void 0,
				defaults: {
					border: !1
				},
				items: [this.createRuleRenderer(a), this.createRuleTitle(a)],
				listeners: {
					render: function(b) {
						this.selectOnClick && b.getEl().on({
							click: function() {
								this.selectRuleEntry(a)
							},
							scope: this
						});
						!0 == this.enableDD && this.addDD(b)
					},
					scope: this
				}
			}
		},
		createRuleRenderer: function(a) {
			var b = [this.symbolType, "Point", "Line", "Polygon"],
				c, d, e = a.symbolizers,
				f;
			if (e) {
				var g;
				f = 0;
				ii = b.length;
				a: for (; f < ii; ++f)
					if (c = b[f], g = OpenLayers.Symbolizer[c])
						for (var h =
								0, j = e.length; h < j; ++h)
							if (e[h] instanceof g) {
								d = !0;
								break a
							}
			} else {
				g = a.symbolizer;
				f = 0;
				for (e = b.length; f < e; ++f)
					if (c = b[f], g[c]) {
						g = g[c];
						d = !0;
						break
					}
				e = [g]
			}
			return {
				xtype: "gx_renderer",
				symbolType: d ? c : this.symbolType,
				symbolizers: e,
				style: this.clickableSymbol ? {
					cursor: "pointer"
				} : void 0,
				listeners: {
					click: function() {
						this.clickableSymbol && (this.fireEvent("symbolclick", this, a), this.fireEvent("ruleclick", this, a))
					},
					scope: this
				}
			}
		},
		createRuleTitle: function(a) {
			return {
				cls: "x-form-item",
				style: "padding: 0.2em 0.5em 0;",
				bodyStyle: Ext.applyIf({
						background: "transparent"
					},
					this.clickableTitle ? {
						cursor: "pointer"
					} : void 0),
				html: this.getRuleTitle(a),
				listeners: {
					render: function(b) {
						this.clickableTitle && b.getEl().on({
							click: function() {
								this.fireEvent("titleclick", this, a);
								this.fireEvent("ruleclick", this, a)
							},
							scope: this
						})
					},
					scope: this
				}
			}
		},
		addDD: function(a) {
			var b = a.ownerCt,
				c = this;
			new Ext.dd.DragSource(a.getEl(), {
				ddGroup: b.id,
				onDragOut: function(a, b) {
					var c = Ext.getCmp(b);
					c.removeCls("gx-ruledrag-insert-above");
					c.removeCls("gx-ruledrag-insert-below");
					return Ext.dd.DragZone.prototype.onDragOut.apply(this,
						arguments)
				},
				onDragEnter: function(c, e) {
					var f = Ext.getCmp(e),
						g, h = Ext.Array.indexOf(b.items, a),
						j = Ext.Array.indexOf(b.items, f);
					h > j ? g = "gx-ruledrag-insert-above" : h < j && (g = "gx-ruledrag-insert-below");
					g && f.addCls(g);
					return Ext.dd.DragZone.prototype.onDragEnter.apply(this, arguments)
				},
				onDragDrop: function(d, e) {
					var f = Ext.Array.indexOf,
						g = f(b.items, a),
						f = f(b.items, Ext.getCmp(e));
					c.moveRule(g, f);
					return Ext.dd.DragZone.prototype.onDragDrop.apply(this, arguments)
				},
				getDragData: function(a) {
					if (a = a.getTarget(".x-column-inner")) {
						var b =
							a.cloneNode(!0);
						b.id = Ext.id();
						return {
							sourceEl: a,
							repairXY: Ext.fly(a).getXY(),
							ddel: b
						}
					}
				}
			});
			new Ext.dd.DropTarget(a.getEl(), {
				ddGroup: b.id,
				notifyDrop: function() {
					return !0
				}
			})
		},
		update: function() {
			this.callParent(arguments);
			if (this.symbolType && this.rules) {
				this.rulesContainer.removeAll(!1);
				for (var a = 0, b = this.rules.length; a < b; ++a) this.addRuleEntry(this.rules[a], !0);
				this.doLayout();
				this.selectedRule && this.getRuleEntry(this.selectedRule).body.addCls("x-boundlist-selected")
			}
		},
		updateRuleEntry: function(a) {
			var b = this.getRuleEntry(a);
			b && (b.removeAll(), b.add(this.createRuleRenderer(a)), b.add(this.createRuleTitle(a)), b.doLayout())
		},
		moveRule: function(a, b) {
			var c = this.rules[a];
			this.rules.splice(a, 1);
			this.rules.splice(b, 0, c);
			this.update();
			this.fireEvent("rulemoved", this, c)
		},
		getRuleTitle: function(a) {
			var b = a.title || a.name || "";
			!b && this.untitledPrefix && (b = this.untitledPrefix + (Ext.Array.indexOf(this.rules, a) + 1));
			return b
		},
		beforeDestroy: function() {
			this.layer && (this.layer.events && this.layer.events.un({
					featuresadded: this.onFeaturesAdded,
					scope: this
				}),
				this.layer.map && this.layer.map.events && this.layer.map.events.un({
					zoomend: this.onMapZoom,
					scope: this
				}));
			delete this.layer;
			delete this.map;
			delete this.rules;
			this.callParent(arguments)
		},
		onStoreRemove: function(a, b) {
			b.getLayer() === this.layer && this.map && this.map.events && this.map.events.un({
				zoomend: this.onMapZoom,
				scope: this
			})
		},
		onStoreAdd: function(a, b) {
			for (var c = 0, d = b.length; c < d; c++)
				if (b[c].getLayer() === this.layer && this.layer.map && this.layer.map.events) this.layer.map.events.on({
					zoomend: this.onMapZoom,
					scope: this
				})
		}
	},
	function() {
		GeoExt.container.LayerLegend.types.gx_vectorlegend = GeoExt.container.VectorLegend
	});
Ext.define("GeoExt.container.WmsLegend", {
	extend: GeoExt.container.LayerLegend,
	alias: "widget.gx_wmslegend",
	alternateClassName: "GeoExt.WMSLegend",
	statics: {
		supports: function(a) {
			return a.getLayer() instanceof OpenLayers.Layer.WMS ? 1 : 0
		}
	},
	defaultStyleIsFirst: !0,
	useScaleParameter: !0,
	baseParams: null,
	initComponent: function() {
		this.addEvents("legendimageloaded");
		this.callParent();
		var a = this.layerRecord.getLayer();
		this._noMap = !a.map;
		a.events.register("moveend", this, this.onLayerMoveend);
		this.update()
	},
	onLayerMoveend: function(a) {
		if (!0 ===
			a.zoomChanged && !0 === this.useScaleParameter || this._noMap) delete this._noMap, this.update()
	},
	getLegendUrl: function(a, b) {
		var c = this.layerRecord,
			d, e = c && c.get("styles"),
			c = c.getLayer();
		b = b || ("" + c.params.LAYERS).split(",");
		var f = c.params.STYLES && ("" + c.params.STYLES).split(","),
			g = Ext.Array.indexOf(b, a),
			h = f && f[g];
		e && 0 < e.length && (h ? Ext.each(e, function(a) {
			d = a.name == h && a.legend && a.legend.href;
			return !d
		}) : !0 === this.defaultStyleIsFirst && (!f && !c.params.SLD && !c.params.SLD_BODY) && (d = e[0].legend && e[0].legend.href));
		d || (d = c.getFullRequestString({
			REQUEST: "GetLegendGraphic",
			WIDTH: null,
			HEIGHT: null,
			EXCEPTIONS: "application/vnd.ogc.se_xml",
			LAYER: a,
			LAYERS: null,
			STYLE: "" !== h ? h : null,
			STYLES: null,
			SRS: null,
			FORMAT: null,
			TIME: null
		}));
		e = Ext.apply({}, this.baseParams);
		c.params._OLSALT && (e._OLSALT = c.params._OLSALT);
		d = Ext.urlAppend(d, Ext.urlEncode(e)); - 1 != d.toLowerCase().indexOf("request\x3dgetlegendgraphic") && (-1 == d.toLowerCase().indexOf("format\x3d") && (d = Ext.urlAppend(d, "FORMAT\x3dimage%2Fgif")), !0 === this.useScaleParameter && (e =
			c.map.getScale(), d = Ext.urlAppend(d, "SCALE\x3d" + e)));
		return d
	},
	update: function() {
		var a = this.layerRecord.getLayer();
		if (a && a.map) {
			this.callParent();
			var b, c, d;
			b = ("" + a.params.LAYERS).split(",");
			var e = [],
				f = this.items.get(0);
			this.items.each(function(a) {
				d = Ext.Array.indexOf(b, a.itemId);
				if (0 > d && a != f) e.push(a);
				else if (a !== f) {
					c = b[d];
					var g = this.getLegendUrl(c, b);
					OpenLayers.Util.isEquivalentUrl(g, a.url) || a.setUrl(g)
				}
			}, this);
			d = 0;
			for (a = e.length; d < a; d++) {
				var g = e[d];
				this.remove(g);
				g.destroy()
			}
			d = 0;
			for (a = b.length; d <
				a; d++) c = b[d], (!this.items || !this.getComponent(c)) && this.add({
				xtype: "gx_legendimage",
				url: this.getLegendUrl(c, b),
				itemId: c,
				listeners: {
					legendimageloaded: function() {
						this.fireEvent("legendimageloaded", this)
					},
					scope: this
				}
			});
			this.doLayout()
		}
	},
	beforeDestroy: function() {
		if (!0 === this.useScaleParameter) {
			var a = this.layerRecord.getLayer();
			a && a.events && a.events.unregister("moveend", this, this.onLayerMoveend)
		}
		this.callParent()
	}
}, function() {
	GeoExt.container.LayerLegend.types.gx_wmslegend = GeoExt.container.WmsLegend
});
Ext.define("GeoExt.data.reader.Attribute", {
	extend: Ext.data.reader.Json,
	alternateClassName: "GeoExt.data.AttributeReader",
	alias: "reader.gx_attribute",
	keepRaw: !1,
	raw: null,
	config: {
		format: null,
		ignore: null,
		feature: null
	},
	constructor: function(a) {
		this.model || (this.model = "GeoExt.data.AttributeModel");
		this.callParent([a]);
		this.feature && this.setFeature(this.feature)
	},
	destroyReader: function() {
		delete this.raw;
		this.callParent()
	},
	applyFeature: function(a) {
		var b = Ext.create("Ext.data.Field", {
			name: "value",
			defaultValue: void 0
		});
		this.model.prototype.fields.add(b);
		return a
	},
	getResponseData: function(a) {
		var b = a.responseXML;
		if (!b || !b.documentElement) b = a.responseText;
		return this.readRecords(b)
	},
	readRecords: function(a) {
		this.getFormat() || this.setFormat(new OpenLayers.Format.WFSDescribeFeatureType);
		a instanceof Array || (a = this.getFormat().read(a), this.keepRaw && (this.raw = a), a = a.featureTypes[0].properties);
		for (var b = this.feature, c = this.model.prototype.fields, d = c.length, e, f, g, h, j, k = [], l = 0, m = a.length; l < m; ++l) {
			h = !1;
			e = a[l];
			f = {};
			for (var n =
					0; n < d; ++n) {
				g = c.items[n];
				g = g.name;
				j = e[g];
				if (this.ignoreAttribute(g, j)) {
					h = !0;
					break
				}
				f[g] = j
			}
			b && (j = b.attributes[f.name], void 0 !== j && (this.ignoreAttribute("value", j) ? h = !0 : f.value = j));
			h || (k[k.length] = f)
		}
		return this.callParent([k])
	},
	ignoreAttribute: function(a, b) {
		var c = !1;
		if (this.ignore && this.ignore[a]) {
			var d = this.ignore[a];
			"string" == typeof d ? c = d === b : d instanceof Array ? c = -1 < Ext.Array.indexOf(d, b) : d instanceof RegExp && (c = d.test(b))
		}
		return c
	}
});
Ext.define("GeoExt.data.AttributeModel", {
	alternateClassName: "GeoExt.data.AttributeRecord",
	extend: Ext.data.Model,
	alias: "model.gx_attribute",
	fields: [{
		name: "name",
		type: "string"
	}, {
		name: "type",
		defaultValue: null
	}, {
		name: "restriction",
		defaultValue: null
	}, {
		name: "nillable",
		type: "bool"
	}],
	proxy: {
		type: "ajax",
		reader: {
			type: "gx_attribute"
		}
	}
});
Ext.define("GeoExt.data.OwsStore", {
	extend: Ext.data.Store,
	alternateClassName: ["GeoExt.data.OWSStore"],
	config: {
		url: null,
		format: null,
		baseParams: null
	},
	constructor: function(a) {
		a.format && (this.format = a.format, delete a.format);
		this.callParent([a]);
		a.url && this.setUrl(a.url);
		this.format && this.setFormat(this.format);
		var b = this.getProxy();
		b && (b.startParam = !1, b.limitParam = !1, b.pageParam = !1);
		a.baseParams && this.setBaseParams(a.baseParams)
	},
	applyBaseParams: function(a) {
		if (a && Ext.isObject(a)) {
			var b = this.getProxy();
			b && (b.extraParams = a)
		}
	},
	applyUrl: function(a) {
		if (a && Ext.isString(a)) {
			var b = this.getProxy();
			b && (b.url = a)
		}
	},
	applyFormat: function(a) {
		var b = this.getProxy();
		if (b = b ? b.getReader() : null) b.format = a
	}
});
Ext.define("GeoExt.data.AttributeStore", {
	extend: GeoExt.data.OwsStore,
	model: "GeoExt.data.AttributeModel",
	config: {
		ignore: null,
		feature: null
	},
	constructor: function(a) {
		a = Ext.apply({}, a);
		var b;
		a.feature && (this.feature = a.feature, delete a.feature);
		this.feature && a.data && (b = a.data, delete a.data);
		this.callParent([a]);
		a.ignore && this.setIgnore(a.ignore);
		this.feature && this.setFeature(this.feature);
		b && this.loadRawData(b)
	},
	applyFeature: function(a) {
		var b = this.getProxy().getReader();
		b && b.setFeature(a)
	},
	applyIgnore: function(a) {
		var b =
			this.getProxy().getReader();
		b && b.setIgnore(a)
	}
});
Ext.define("GeoExt.data.reader.CswRecords", {
	alternateClassName: ["GeoExt.data.CSWRecordsReader"],
	extend: Ext.data.reader.Json,
	alias: "reader.gx_cswrecords",
	constructor: function(a) {
		this.model || (this.model = "GeoExt.data.CswRecordsModel");
		this.callParent([a]);
		this.format || (this.format = new OpenLayers.Format.CSWGetRecords)
	},
	read: function(a) {
		var b = a.data;
		if (!b && (b = a.responseXML, !b || !b.documentElement)) b = a.responseText;
		return this.readRecords(b)
	},
	readRecords: function(a) {
		if ("string" === typeof a || a.nodeType) a =
			this.format.read(a);
		var b = this.callParent([a.records]);
		Ext.each(b.records, function(a) {
			for (var b in a.data) {
				var e = a.data[b];
				if (e instanceof Array)
					for (var f = 0, g = e.length; f < g; ++f) e[f] instanceof Object && (e[f] = e[f].value)
			}
		});
		a.SearchResults && (delete b.totalRecords, b.total = a.SearchResults.numberOfRecordsMatched);
		return b
	}
});
Ext.define("GeoExt.data.CswRecordsModel", {
	extend: Ext.data.Model,
	alias: "model.gx_cswrecords",
	fields: [{
		name: "title"
	}, {
		name: "subject"
	}, {
		name: "URI"
	}, {
		name: "bounds"
	}, {
		name: "projection",
		type: "string"
	}],
	proxy: {
		type: "memory",
		reader: {
			type: "gx_cswrecords"
		}
	}
});
Ext.define("GeoExt.data.reader.Feature", {
	extend: Ext.data.reader.Json,
	alias: "reader.feature",
	buildExtractors: function() {
		this.callParent(arguments);
		this.convertRecordData = this.convertFeatureRecordData
	},
	convertFeatureRecordData: function(a, b, c) {
		if (b) {
			var d = c.fields;
			if (b.attributes)
				for (var e = 0, f = d.length; e < f; e++) {
					var g = d.items[e],
						h;
					if (/[\[\.]/.test(g.mapping)) try {
						h = (new Function("obj", "return obj." + g.mapping))(b.attributes)
					} catch (j) {
						h = g.defaultValue
					} else h = b.attributes[g.mapping || g.name] || g.defaultValue;
					g.convert && (h = g.convert(h, c));
					a[g.name] = h
				}
			c.state = b.state;
			(b.state == OpenLayers.State.INSERT || b.state == OpenLayers.State.UPDATE) && c.setDirty();
			a.id = b.state === OpenLayers.State.INSERT ? void 0 : b.id
		}
	}
});
Ext.define("GeoExt.data.FeatureStore", {
	extend: Ext.data.Store,
	statics: {
		LAYER_TO_STORE: 1,
		STORE_TO_LAYER: 2
	},
	isLayerBinded: !1,
	layer: null,
	featureFilter: null,
	constructor: function(a) {
		a = Ext.apply({
			proxy: {
				type: "memory",
				reader: {
					type: "feature",
					idProperty: "id"
				}
			}
		}, a);
		a.layer && (this.layer = a.layer, delete a.layer);
		a.features && (a.data = a.features);
		delete a.features;
		this.callParent([a]);
		var b = {
			initDir: a.initDir
		};
		delete a.initDir;
		this.layer && this.bind(this.layer, b)
	},
	destroy: function() {
		this.unbind();
		this.callParent()
	},
	bind: function(a, b) {
		b = b || {};
		if (!this.isLayerBinded) {
			this.layer = a;
			this.isLayerBinded = !0;
			var c = b.initDir;
			void 0 == b.initDir && (c = GeoExt.data.FeatureStore.LAYER_TO_STORE | GeoExt.data.FeatureStore.STORE_TO_LAYER);
			var d = a.features.slice(0);
			c & GeoExt.data.FeatureStore.STORE_TO_LAYER && this.each(function(b) {
				a.addFeatures([b.raw])
			}, this);
			c & GeoExt.data.FeatureStore.LAYER_TO_STORE && 0 < a.features.length && this.loadRawData(d, !0);
			this.layer.events.on({
				featuresadded: this.onFeaturesAdded,
				featuresremoved: this.onFeaturesRemoved,
				featuremodified: this.onFeatureModified,
				scope: this
			});
			this.on({
				load: this.onLoad,
				clear: this.onClear,
				add: this.onAdd,
				remove: this.onRemove,
				update: this.onStoreUpdate,
				scope: this
			});
			this.fireEvent("bind", this, this.layer)
		}
	},
	unbind: function() {
		this.isLayerBinded && (this.layer.events.un({
			featuresadded: this.onFeaturesAdded,
			featuresremoved: this.onFeaturesRemoved,
			featuremodified: this.onFeatureModified,
			scope: this
		}), this.un({
			load: this.onLoad,
			clear: this.onClear,
			add: this.onAdd,
			remove: this.onRemove,
			update: this.onStoreUpdate,
			scope: this
		}), this.layer = null, this.isLayerBinded = !1)
	},
	addFeatures: function(a) {
		return this.loadRawData(a, !0)
	},
	removeFeatures: function(a) {
		a = Ext.isArray(a) ? a.slice(0) : Array.prototype.slice.apply(arguments);
		Ext.Array.each(a, function(a) {
			this.remove(this.getByFeature(a))
		}, this)
	},
	getByFeature: function(a) {
		return this.getAt(this.findBy(function(b) {
			return b.raw == a
		}))
	},
	getById: function(a) {
		return (this.snapshot || this.data).findBy(function(b) {
			return b.raw.id === a
		})
	},
	addFeaturesToLayer: function(a) {
		for (var b = [], c =
				0, d = a.length; c < d; c++) b.push(a[c].raw);
		this._adding = !0;
		this.layer.addFeatures(b);
		delete this._adding
	},
	onFeaturesAdded: function(a) {
		if (!this._adding) {
			var b = a = a.features;
			if (this.featureFilter)
				for (var b = [], c = 0, d = a.length; c < d; c++) {
					var e = a[c];
					!1 !== this.featureFilter.evaluate(e) && b.push(e)
				}
			b = this.proxy.reader.read(b).records;
			this._adding = !0;
			this.add(b);
			delete this._adding
		}
	},
	onFeaturesRemoved: function(a) {
		if (!this._removing) {
			a = a.features;
			for (var b = a.length - 1; 0 <= b; b--) {
				var c = this.getByFeature(a[b]);
				c && (this._removing = !0, this.remove(c), delete this._removing)
			}
		}
	},
	onFeatureModified: function(a) {
		var b = this.getByFeature(a.feature);
		b && (a = this.proxy.reader.read(a.feature).records[0], Ext.Object.each(a.getData(), function(a, d) {
			b.set(a, d)
		}, this))
	},
	onLoad: function(a, b, c) {
		c && (this._removing = !0, this.layer.removeAllFeatures(), delete this._removing, this.addFeaturesToLayer(b))
	},
	onClear: function() {
		this._removing = !0;
		this.layer.removeFeatures(this.layer.features);
		delete this._removing
	},
	onAdd: function(a, b) {
		this._adding || this.addFeaturesToLayer(b)
	},
	onRemove: function(a, b) {
		if (!this._removing) {
			var c = b.raw;
			null != this.layer.getFeatureById(c.id) && (this._removing = !0, this.layer.removeFeatures([c]), delete this._removing)
		}
	},
	onStoreUpdate: function(a, b, c, d) {
		if (!this._updating) {
			var e = b.raw;
			e.state !== OpenLayers.State.INSERT && (e.state = OpenLayers.State.UPDATE);
			!1 !== this.layer.events.triggerEvent("beforefeaturemodified", {
				feature: e
			}) && (Ext.Array.each(d, function(a) {
					e.attributes[a] = b.get(a)
				}), this._updating = !0, this.layer.events.triggerEvent("featuremodified", {
					feature: e
				}),
				delete this._updating)
		}
	},
	loadRawData: function(a, b) {
		var c = this.proxy.reader.read(a),
			d = c.records;
		c.success && (this.totalCount = c.total, this.loadRecords(d, b ? this.addRecordsOptions : void 0), this.fireEvent("load", this, d, !0))
	}
});
Ext.define("GeoExt.data.LayerModel", {
	alternateClassName: "GeoExt.data.LayerRecord",
	extend: Ext.data.Model,
	alias: "model.gx_layer",
	inheritableStatics: {
		createFromLayer: function(a) {
			return this.getProxy().reader.readRecords([a]).records[0]
		}
	},
	fields: ["id", {
		name: "title",
		type: "string",
		mapping: "name"
	}, {
		name: "legendURL",
		type: "string",
		mapping: "metadata.legendURL"
	}, {
		name: "hideTitle",
		type: "bool",
		mapping: "metadata.hideTitle"
	}, {
		name: "hideInLegend",
		type: "bool",
		mapping: "metadata.hideInLegend"
	}],
	proxy: {
		type: "memory",
		reader: {
			type: "json"
		}
	},
	getLayer: function() {
		return this.raw
	}
});
Ext.define("GeoExt.data.LayerStore", {
	extend: Ext.data.Store,
	model: "GeoExt.data.LayerModel",
	statics: {
		MAP_TO_STORE: 1,
		STORE_TO_MAP: 2
	},
	map: null,
	constructor: function(a) {
		a = Ext.apply({}, a);
		var b = GeoExt.MapPanel && a.map instanceof GeoExt.MapPanel ? a.map.map : a.map;
		delete a.map;
		a.layers && (a.data = a.layers);
		delete a.layers;
		var c = {
			initDir: a.initDir
		};
		delete a.initDir;
		this.callParent([a]);
		b && this.bind(b, c)
	},
	bind: function(a, b) {
		var c = this;
		if (!c.map) {
			c.map = a;
			b = Ext.apply({}, b);
			var d = b.initDir;
			void 0 == b.initDir && (d = GeoExt.data.LayerStore.MAP_TO_STORE |
				GeoExt.data.LayerStore.STORE_TO_MAP);
			var e = a.layers.slice(0);
			d & GeoExt.data.LayerStore.STORE_TO_MAP && c.each(function(a) {
				c.map.addLayer(a.getLayer())
			}, c);
			d & GeoExt.data.LayerStore.MAP_TO_STORE && c.loadRawData(e, !0);
			a.events.on({
				changelayer: c.onChangeLayer,
				addlayer: c.onAddLayer,
				removelayer: c.onRemoveLayer,
				scope: c
			});
			c.on({
				load: c.onLoad,
				clear: c.onClear,
				add: c.onAdd,
				remove: c.onRemove,
				update: c.onStoreUpdate,
				scope: c
			});
			c.data.on({
				replace: c.onReplace,
				scope: c
			});
			c.fireEvent("bind", c, a)
		}
	},
	unbind: function() {
		this.map &&
			(this.map.events.un({
				changelayer: this.onChangeLayer,
				addlayer: this.onAddLayer,
				removelayer: this.onRemoveLayer,
				scope: this
			}), this.un("load", this.onLoad, this), this.un("clear", this.onClear, this), this.un("add", this.onAdd, this), this.un("remove", this.onRemove, this), this.un("update", this.onStoreUpdate, this), this.data.un("replace", this.onReplace, this), this.map = null)
	},
	onChangeLayer: function(a) {
		var b = a.layer,
			c = this.findBy(function(a) {
				return a.getLayer() === b
			});
		if (-1 < c) {
			var d = this.getAt(c);
			"order" === a.property ?
				!this._adding && !this._removing && (a = this.map.getLayerIndex(b), a !== c && (this._removing = !0, this.remove(d), delete this._removing, this._adding = !0, this.insert(a, [d]), delete this._adding)) : "name" === a.property ? d.set("title", b.name) : this.fireEvent("update", this, d, Ext.data.Record.EDIT)
		}
	},
	onAddLayer: function(a) {
		this._adding || (this._adding = !0, a = this.proxy.reader.read(a.layer), this.add(a.records), delete this._adding)
	},
	onRemoveLayer: function(a) {
		this.map.unloadDestroy ? this._removing || (a = a.layer, this.getByLayer(a) &&
			(this._removing = !0, this.remove(this.getByLayer(a)), delete this._removing)) : this.unbind()
	},
	onLoad: function(a, b, c) {
		if (c) {
			Ext.isArray(b) || (b = [b]);
			if (!this._addRecords) {
				this._removing = !0;
				for (a = this.map.layers.length - 1; 0 <= a; a--) this.map.removeLayer(this.map.layers[a]);
				delete this._removing
			}
			a = b.length;
			if (0 < a) {
				c = Array(a);
				for (var d = 0; d < a; d++) c[d] = b[d].getLayer();
				this._adding = !0;
				this.map.addLayers(c);
				delete this._adding
			}
		}
		delete this._addRecords
	},
	onClear: function() {
		this._removing = !0;
		for (var a = this.map.layers.length -
				1; 0 <= a; a--) this.map.removeLayer(this.map.layers[a]);
		delete this._removing
	},
	onAdd: function(a, b, c) {
		if (!this._adding) {
			this._adding = !0;
			for (var d = b.length - 1; 0 <= d; --d) a = b[d].getLayer(), this.map.addLayer(a), c !== this.map.layers.length - 1 && this.map.setLayerIndex(a, c);
			delete this._adding
		}
	},
	onRemove: function(a, b) {
		if (!this._removing) {
			var c = b.getLayer();
			null != this.map.getLayer(c.id) && (this._removing = !0, this.removeMapLayer(b), delete this._removing)
		}
	},
	onStoreUpdate: function(a, b, c) {
		c === Ext.data.Record.EDIT && (b.modified &&
			b.modified.title) && (a = b.getLayer(), b = b.get("title"), b !== a.name && a.setName(b))
	},
	removeMapLayer: function(a) {
		this.map.removeLayer(a.getLayer())
	},
	onReplace: function(a, b) {
		this.removeMapLayer(b)
	},
	getByLayer: function(a) {
		var b = this.findBy(function(b) {
			return b.getLayer() === a
		});
		if (-1 < b) return this.getAt(b)
	},
	destroy: function() {
		this.unbind();
		this.callParent()
	},
	loadRecords: function(a, b) {
		b && b.addRecords && (this._addRecords = !0);
		this.callParent(arguments)
	},
	loadRawData: function(a, b) {
		var c = this.proxy.reader.read(a),
			d = c.records;
		c.success && (this.totalCount = c.total, this.loadRecords(d, b ? this.addRecordsOptions : void 0), this.fireEvent("load", this, d, !0))
	}
});
Ext.define("GeoExt.data.LayerTreeModel", {
	alternateClassName: "GeoExt.data.LayerTreeRecord",
	extend: Ext.data.Model,
	alias: "model.gx_layertree",
	fields: [{
		name: "text",
		type: "string"
	}, {
		name: "plugins"
	}, {
		name: "layer"
	}, {
		name: "container"
	}, {
		name: "checkedGroup",
		type: "string"
	}, {
		name: "fixedText",
		type: "bool"
	}, {
		name: "component"
	}],
	proxy: {
		type: "memory"
	},
	constructor: function(a, b, c, d) {
		var e = this;
		e.callParent(arguments);
		window.setTimeout(function() {
			var a = e.get("plugins");
			if (a)
				for (var b, c = 0, d = a.length; c < d; ++c) b = a[c], b = Ext.PluginMgr.create(Ext.isString(b) ? {
					ptype: b
				} : b), b.init(e)
		})
	},
	afterEdit: function(a) {
		this.callParent(arguments);
		this.fireEvent("afteredit", this, a)
	}
});
Ext.define("GeoExt.data.MapfishPrintProvider", {
	extend: Ext.util.Observable,
	url: null,
	capabilities: null,
	method: "POST",
	encoding: document.charset || document.characterSet || "UTF-8",
	timeout: 3E4,
	customParams: null,
	scales: null,
	dpis: null,
	layouts: null,
	dpi: null,
	layout: null,
	constructor: function(a) {
		this.initialConfig = a;
		Ext.apply(this, a);
		this.customParams || (this.customParams = {});
		this.callParent(arguments);
		this.scales = Ext.create("Ext.data.JsonStore", {
			proxy: {
				type: "memory",
				reader: {
					type: "json",
					root: "scales"
				}
			},
			fields: ["name", {
				name: "value",
				type: "float"
			}],
			sortOnLoad: !0,
			sorters: {
				property: "value",
				direction: "DESC"
			}
		});
		this.dpis = Ext.create("Ext.data.JsonStore", {
			proxy: {
				type: "memory",
				reader: {
					type: "json",
					root: "dpis"
				}
			},
			fields: ["name", {
				name: "value",
				type: "float"
			}]
		});
		this.layouts = Ext.create("Ext.data.JsonStore", {
			proxy: {
				type: "memory",
				reader: {
					type: "json",
					root: "layouts"
				}
			},
			fields: ["name", {
				name: "size",
				mapping: "map"
			}, {
				name: "rotation",
				type: "boolean"
			}]
		});
		a.capabilities ? this.loadStores() : (this.url.split("/").pop() && (this.url += "/"), this.initialConfig.autoLoad &&
			this.loadCapabilities())
	},
	setLayout: function(a) {
		this.layout = a;
		this.fireEvent("layoutchange", this, a)
	},
	setDpi: function(a) {
		this.dpi = a;
		this.fireEvent("dpichange", this, a)
	},
	print: function(a, b, c) {
		a instanceof GeoExt.MapPanel && (a = a.map);
		b = b instanceof Array ? b : [b];
		c = c || {};
		if (!1 !== this.fireEvent("beforeprint", this, a, b, c)) {
			var d = Ext.apply({
					units: a.getUnits(),
					srs: a.baseLayer.projection.getCode(),
					layout: this.layout.get("name"),
					dpi: this.dpi.get("value")
				}, this.customParams),
				e = b[0].feature.layer,
				f = [],
				g = a.layers.concat();
			Ext.Array.remove(g, a.baseLayer);
			Ext.Array.insert(g, 0, [a.baseLayer]);
			Ext.each(g, function(a) {
				a !== e && !0 === a.getVisibility() && (a = this.encodeLayer(a)) && f.push(a)
			}, this);
			d.layers = f;
			var h = [];
			Ext.each(b, function(a) {
				h.push(Ext.apply({
					center: [a.center.lon, a.center.lat],
					scale: a.scale.get("value"),
					rotation: a.rotation
				}, a.customParams))
			}, this);
			d.pages = h;
			if (c.overview) {
				var j = [];
				Ext.each(c.overview.layers, function(a) {
					(a = this.encodeLayer(a)) && j.push(a)
				}, this);
				d.overviewLayers = j
			}
			if (c.legend && !1 !== this.fireEvent("beforeencodelegend",
					this, d, c.legend)) {
				a = c.legend;
				(b = a.rendered) || (a = a.cloneConfig({
					renderTo: document.body,
					hidden: !0
				}));
				var k = [];
				a.items && a.items.each(function(a) {
					if (!a.hidden) {
						var b = this.encoders.legends[a.getXType()];
						k = k.concat(b.call(this, a, d.pages[0].scale))
					}
				}, this);
				b || a.destroy();
				d.legends = k
			}
			"GET" === this.method ? (a = Ext.urlAppend(this.capabilities.printURL, "spec\x3d" + encodeURIComponent(Ext.encode(d))), this.download(a)) : Ext.Ajax.request({
				url: this.capabilities.createURL,
				timeout: this.timeout,
				jsonData: d,
				headers: {
					"Content-Type": "application/json; charset\x3d" +
						this.encoding
				},
				success: function(a) {
					a = Ext.decode(a.responseText).getURL;
					this.download(a)
				},
				failure: function(a) {
					this.fireEvent("printexception", this, a)
				},
				params: this.initialConfig.baseParams,
				scope: this
			})
		}
	},
	download: function(a) {
		!1 !== this.fireEvent("beforedownload", this, a) && (Ext.isOpera ? window.open(a) : window.location.href = a);
		this.fireEvent("print", this, a)
	},
	loadCapabilities: function() {
		this.url && Ext.Ajax.request({
			url: this.url + "info.json",
			method: "GET",
			disableCaching: !1,
			success: function(a) {
				this.capabilities =
					Ext.decode(a.responseText);
				this.loadStores()
			},
			params: this.initialConfig.baseParams,
			scope: this
		})
	},
	loadStores: function() {
		this.scales.loadRawData(this.capabilities);
		this.dpis.loadRawData(this.capabilities);
		this.layouts.loadRawData(this.capabilities);
		this.setLayout(this.layouts.getAt(0));
		this.setDpi(this.dpis.getAt(0));
		this.fireEvent("loadcapabilities", this, this.capabilities)
	},
	encodeLayer: function(a) {
		var b, c;
		for (c in this.encoders.layers)
			if (OpenLayers.Layer[c] && a instanceof OpenLayers.Layer[c]) {
				if (!1 ===
					this.fireEvent("beforeencodelayer", this, a)) return;
				b = this.encoders.layers[c].call(this, a);
				this.fireEvent("encodelayer", this, a, b);
				break
			}
		return b && b.type ? b : null
	},
	getAbsoluteUrl: function(a) {
		var b;
		Ext.isIE6 || Ext.isIE7 || Ext.isIE8 ? (b = document.createElement("\x3ca href\x3d'" + a + "'/\x3e"), b.style.display = "none", document.body.appendChild(b), b.href = b.href, document.body.removeChild(b)) : (b = document.createElement("a"), b.href = a);
		return b.href
	},
	encoders: {
		layers: {
			Layer: function(a) {
				var b = {};
				a.options && a.options.maxScale &&
					(b.minScaleDenominator = a.options.maxScale);
				a.options && a.options.minScale && (b.maxScaleDenominator = a.options.minScale);
				return b
			},
			WMS: function(a) {
				var b = this.encoders.layers.HTTPRequest.call(this, a);
				Ext.apply(b, {
					type: "WMS",
					layers: ("" + a.params.LAYERS).split(","),
					format: a.params.FORMAT,
					styles: ("" + a.params.STYLES).split(",")
				});
				var c, d;
				for (d in a.params) c = d.toLowerCase(), !a.DEFAULT_PARAMS[c] && -1 == "layers,styles,width,height,srs".indexOf(c) && (b.customParams || (b.customParams = {}), b.customParams[d] = a.params[d]);
				return b
			},
			OSM: function(a) {
				a = this.encoders.layers.TileCache.call(this, a);
				return Ext.apply(a, {
					type: "OSM",
					baseURL: a.baseURL.substr(0, a.baseURL.indexOf("$")),
					extension: "png"
				})
			},
			TMS: function(a) {
				var b = this.encoders.layers.TileCache.call(this, a);
				return Ext.apply(b, {
					type: "TMS",
					format: a.type
				})
			},
			TileCache: function(a) {
				var b = this.encoders.layers.HTTPRequest.call(this, a);
				return Ext.apply(b, {
					type: "TileCache",
					layer: a.layername,
					maxExtent: a.maxExtent.toArray(),
					tileSize: [a.tileSize.w, a.tileSize.h],
					extension: a.extension,
					resolutions: a.serverResolutions || a.resolutions
				})
			},
			WMTS: function(a) {
				var b = this.encoders.layers.HTTPRequest.call(this, a);
				return Ext.apply(b, {
					type: "WMTS",
					layer: a.layer,
					version: a.version,
					requestEncoding: a.requestEncoding,
					tileOrigin: [a.tileOrigin.lon, a.tileOrigin.lat],
					tileSize: [a.tileSize.w, a.tileSize.h],
					style: a.style,
					formatSuffix: a.formatSuffix,
					dimensions: a.dimensions,
					params: a.params,
					maxExtent: null != a.tileFullExtent ? a.tileFullExtent.toArray() : a.maxExtent.toArray(),
					matrixSet: a.matrixSet,
					zoomOffset: a.zoomOffset,
					resolutions: a.serverResolutions || a.resolutions
				})
			},
			KaMapCache: function(a) {
				var b = this.encoders.layers.KaMap.call(this, a);
				return Ext.apply(b, {
					type: "KaMapCache",
					group: a.params.g,
					metaTileWidth: a.params.metaTileSize.w,
					metaTileHeight: a.params.metaTileSize.h
				})
			},
			KaMap: function(a) {
				var b = this.encoders.layers.HTTPRequest.call(this, a);
				return Ext.apply(b, {
					type: "KaMap",
					map: a.params.map,
					extension: a.params.i,
					group: a.params.g || "",
					maxExtent: a.maxExtent.toArray(),
					tileSize: [a.tileSize.w, a.tileSize.h],
					resolutions: a.serverResolutions ||
						a.resolutions
				})
			},
			HTTPRequest: function(a) {
				var b = this.encoders.layers.Layer.call(this, a);
				return Ext.apply(b, {
					baseURL: this.getAbsoluteUrl(a.url instanceof Array ? a.url[0] : a.url),
					opacity: null != a.opacity ? a.opacity : 1,
					singleTile: a.singleTile
				})
			},
			Image: function(a) {
				var b = this.encoders.layers.Layer.call(this, a);
				return Ext.apply(b, {
					type: "Image",
					baseURL: this.getAbsoluteUrl(a.getURL(a.extent)),
					opacity: null != a.opacity ? a.opacity : 1,
					extent: a.extent.toArray(),
					pixelSize: [a.size.w, a.size.h],
					name: a.name
				})
			},
			Vector: function(a) {
				if (a.features.length) {
					for (var b = [], c = {}, d = a.features, e = new OpenLayers.Format.GeoJSON, f = new OpenLayers.Format.JSON, g = 1, h = {}, j, k, l, m, n = 0, p = d.length; n < p; ++n) j = d[n], k = j.style || a.style || a.styleMap.createSymbolizer(j, j.renderIntent), l = f.write(k), (m = h[l]) ? l = m : (h[l] = l = g++, c[l] = k.externalGraphic ? Ext.applyIf({
						externalGraphic: this.getAbsoluteUrl(k.externalGraphic)
					}, k) : k), j = e.extract.feature.call(e, j), j.properties = OpenLayers.Util.extend({
						_gx_style: l
					}, j.properties), b.push(j);
					d = this.encoders.layers.Layer.call(this, a);
					return Ext.apply(d, {
						type: "Vector",
						styles: c,
						styleProperty: "_gx_style",
						geoJson: {
							type: "FeatureCollection",
							features: b
						},
						name: a.name,
						opacity: null != a.opacity ? a.opacity : 1
					})
				}
			},
			Markers: function(a) {
				for (var b = [], c = 0, d = a.markers.length; c < d; c++) {
					var e = a.markers[c],
						f = new OpenLayers.Geometry.Point(e.lonlat.lon, e.lonlat.lat),
						e = new OpenLayers.Feature.Vector(f, {}, {
							externalGraphic: e.icon.url,
							graphicWidth: e.icon.size.w,
							graphicHeight: e.icon.size.h,
							graphicXOffset: e.icon.offset.x,
							graphicYOffset: e.icon.offset.y
						});
					b.push(e)
				}
				a = new OpenLayers.Layer.Vector(a.name);
				a.addFeatures(b);
				b = this.encoders.layers.Vector.call(this, a);
				a.destroy();
				return b
			}
		},
		legends: {
			gx_wmslegend: function(a, b) {
				for (var c = this.encoders.legends.base.call(this, a), d = [], e = 1, f = a.items.getCount(); e < f; ++e) {
					var g = a.items.get(e).url;
					if (!0 === a.useScaleParameter && -1 != g.toLowerCase().indexOf("request\x3dgetlegendgraphic")) {
						var g = g.split("?"),
							h = Ext.urlDecode(g[1]);
						h.SCALE = b;
						g = g[0] + "?" + Ext.urlEncode(h)
					}
					d.push(this.getAbsoluteUrl(g))
				}
				c[0].classes[0] = {
					name: "",
					icons: d
				};
				return c
			},
			gx_urllegend: function(a) {
				var b =
					this.encoders.legends.base.call(this, a);
				b[0].classes.push({
					name: "",
					icon: this.getAbsoluteUrl(a.items.get(1).url)
				});
				return b
			},
			base: function(a) {
				return [{
					name: a.getLabel(),
					classes: []
				}]
			}
		}
	}
});
Ext.define("GeoExt.panel.Map", {
	extend: Ext.panel.Panel,
	alias: "widget.gx_mappanel",
	alternateClassName: "GeoExt.MapPanel",
	statics: {
		guess: function() {
			var a = Ext.ComponentQuery.query("gx_mappanel");
			return a && 0 < a.length ? a[0] : null
		}
	},
	center: null,
	zoom: null,
	extent: null,
	prettyStateKeys: !1,
	map: null,
	layout: "fit",
	layers: null,
	stateEvents: "aftermapmove afterlayervisibilitychange afterlayeropacitychange afterlayerorderchange afterlayernamechange afterlayeradd afterlayerremove".split(" "),
	mapRendered: !1,
	initComponent: function() {
		this.map instanceof
		OpenLayers.Map || (this.map = new OpenLayers.Map(Ext.applyIf(this.map || {}, {
			allOverlays: !0,
			fallThrough: !0
		})));
		var a = this.layers;
		if (!a || a instanceof Array) this.layers = Ext.create("GeoExt.data.LayerStore", {
			layers: a,
			map: 0 < this.map.layers.length ? this.map : null
		});
		Ext.isString(this.center) ? this.center = OpenLayers.LonLat.fromString(this.center) : Ext.isArray(this.center) && (this.center = new OpenLayers.LonLat(this.center[0], this.center[1]));
		Ext.isString(this.extent) ? this.extent = OpenLayers.Bounds.fromString(this.extent) :
			Ext.isArray(this.extent) && (this.extent = OpenLayers.Bounds.fromArray(this.extent));
		this.callParent(arguments);
		this.on("resize", this.onResize, this);
		this.on("afterlayout", function() {
			"function" === typeof this.map.getViewport && this.items.each(function(a) {
				"function" === typeof a.addToMapPanel && a.getEl().appendTo(this.body)
			}, this)
		}, this);
		this.map.events.on({
			moveend: this.onMoveend,
			changelayer: this.onChangelayer,
			addlayer: this.onAddlayer,
			removelayer: this.onRemovelayer,
			scope: this
		})
	},
	onMoveend: function(a) {
		this.fireEvent("aftermapmove",
			this, this.map, a)
	},
	onChangelayer: function(a) {
		var b = this.map;
		a.property && ("visibility" === a.property ? this.fireEvent("afterlayervisibilitychange", this, b, a) : "order" === a.property ? this.fireEvent("afterlayerorderchange", this, b, a) : "nathis" === a.property ? this.fireEvent("afterlayernathischange", this, b, a) : "opacity" === a.property && this.fireEvent("afterlayeropacitychange", this, b, a))
	},
	onAddlayer: function() {
		this.fireEvent("afterlayeradd")
	},
	onRemovelayer: function() {
		this.fireEvent("afterlayerremove")
	},
	onResize: function() {
		var a =
			this.map;
		if (!this.mapRendered && this.body.dom !== a.div)
			if (a.render(this.body.dom), this.mapRendered = !0, this.layers.bind(a), 0 < a.layers.length) this.setInitialExtent();
			else this.layers.on("add", this.setInitialExtent, this, {
				single: !0
			});
		else a.updateSize()
	},
	setInitialExtent: function() {
		var a = this.map;
		a.getCenter() || (this.center || this.zoom ? a.setCenter(this.center, this.zoom) : this.extent instanceof OpenLayers.Bounds ? a.zoomToExtent(this.extent, !0) : a.zoomToMaxExtent())
	},
	getState: function() {
		var a = this,
			b = a.map,
			c =
			a.callParent(arguments) || {},
			d;
		if (b) {
			var e = b.getCenter();
			e && Ext.applyIf(c, {
				x: e.lon,
				y: e.lat,
				zoom: b.getZoom()
			});
			a.layers.each(function(b) {
				d = b.getLayer();
				layerId = this.prettyStateKeys ? b.get("title") : b.get("id");
				c = a.addPropertyToState(c, "visibility_" + layerId, d.getVisibility());
				c = a.addPropertyToState(c, "opacity_" + layerId, null === d.opacity ? 1 : d.opacity)
			}, a);
			return c
		}
	},
	applyState: function(a) {
		map = this.map;
		this.center = new OpenLayers.LonLat(a.x, a.y);
		this.zoom = a.zoom;
		var b, c, d, e, f, g = map.layers;
		b = 0;
		for (c = g.length; b <
			c; b++) d = g[b], e = this.prettyStateKeys ? d.name : d.id, f = a["visibility_" + e], void 0 !== f && (f = /^true$/i.test(f), d.isBaseLayer ? f && map.setBaseLayer(d) : d.setVisibility(f)), e = a["opacity_" + e], void 0 !== e && d.setOpacity(e)
	},
	onBeforeAdd: function(a) {
		Ext.isFunction(a.addToMapPanel) && a.addToMapPanel(this);
		this.callParent(arguments)
	},
	beforeDestroy: function() {
		this.map && this.map.events && this.map.events.un({
			moveend: this.onMoveend,
			changelayer: this.onChangelayer,
			scope: this
		});
		(!this.initialConfig.map || !(this.initialConfig.map instanceof OpenLayers.Map)) && this.map && this.map.destroy && this.map.destroy();
		delete this.map;
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.data.PrintPage", {
	extend: Ext.util.Observable,
	printProvider: null,
	feature: null,
	center: null,
	scale: null,
	rotation: 0,
	customParams: null,
	constructor: function(a) {
		this.initialConfig = a;
		Ext.apply(this, a);
		this.customParams || (this.customParams = {});
		this.callParent(arguments);
		this.feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([new OpenLayers.Geometry.Point(-1, -1), new OpenLayers.Geometry.Point(1, -1), new OpenLayers.Geometry.Point(1, 1), new OpenLayers.Geometry.Point(-1,
			1)])]));
		if (this.printProvider.capabilities) this.setScale(this.printProvider.scales.getAt(0));
		else this.printProvider.on({
			loadcapabilities: function() {
				this.setScale(this.printProvider.scales.getAt(0))
			},
			scope: this,
			single: !0
		});
		this.printProvider.on({
			layoutchange: this.onLayoutChange,
			scope: this
		})
	},
	getPrintExtent: function(a) {
		a = a instanceof GeoExt.MapPanel ? a.map : a;
		return this.calculatePageBounds(this.scale, a.getUnits())
	},
	setScale: function(a, b) {
		var c = this.calculatePageBounds(a, b).toGeometry(),
			d = this.rotation;
		Ext.isDefined(d) && 0 != d && c.rotate(-d, c.getCentroid());
		this.updateFeature(c, {
			scale: a
		})
	},
	setCenter: function(a) {
		var b = this.feature.geometry,
			c = b.getBounds().getCenterLonLat();
		b.move(a.lon - c.lon, a.lat - c.lat);
		this.updateFeature(b, {
			center: a
		})
	},
	setRotation: function(a, b) {
		if (b || !0 === this.printProvider.layout.get("rotation")) {
			var c = this.feature.geometry;
			c.rotate(this.rotation - a, c.getCentroid());
			this.updateFeature(c, {
				rotation: a
			})
		}
	},
	fit: function(a, b) {
		b = b || {};
		var c = a,
			d;
		a instanceof GeoExt.panel.Map ? c = a.map : a instanceof
		OpenLayers.Feature.Vector && (c = a.layer.map, d = a.geometry.getBounds());
		if (!d && (d = c.getExtent(), !d)) return;
		this._updating = !0;
		var e = d.getCenterLonLat();
		this.setCenter(e);
		var f = c.getUnits(),
			g = this.printProvider.scales.getAt(0),
			h = Number.POSITIVE_INFINITY,
			j = d.getWidth(),
			k = d.getHeight();
		this.printProvider.scales.each(function(a) {
			var c = this.calculatePageBounds(a, f);
			if ("closest" == b.mode) c = Math.abs(c.getWidth() - j) + Math.abs(c.getHeight() - k), c < h && (h = c, g = a);
			else {
				if ((c = "screen" == b.mode ? !d.containsBounds(c) : c.containsBounds(d)) ||
					"screen" == b.mode && !c) g = a;
				return c
			}
		}, this);
		this.setScale(g, f);
		delete this._updating;
		this.updateFeature(this.feature.geometry, {
			center: e,
			scale: g
		})
	},
	updateFeature: function(a, b) {
		var c = this.feature,
			d = c.geometry !== a;
		a.id = c.geometry.id;
		c.geometry = a;
		if (!this._updating) {
			for (var e in b) b[e] === this[e] ? delete b[e] : (this[e] = b[e], d = !0);
			Ext.apply(this, b);
			c.layer && c.layer.drawFeature(c);
			d && this.fireEvent("change", this, b)
		}
	},
	calculatePageBounds: function(a, b) {
		var c = a.get("value"),
			d = this.feature,
			e = this.feature.geometry.getBounds().getCenterLonLat(),
			f = this.printProvider.layout.get("size");
		b = b || d.layer && d.layer.map && d.layer.map.getUnits() || "dd";
		var g = OpenLayers.INCHES_PER_UNIT[b],
			d = f.width / 72 / g * c / 2,
			c = f.height / 72 / g * c / 2;
		return new OpenLayers.Bounds(e.lon - d, e.lat - c, e.lon + d, e.lat + c)
	},
	onLayoutChange: function() {
		!1 === this.printProvider.layout.get("rotation") && this.setRotation(0, !0);
		this.scale && this.setScale(this.scale)
	},
	destroy: function() {
		this.printProvider.un("layoutchange", this.onLayoutChange, this)
	}
});
Ext.define("GeoExt.data.RasterStyleModel", {
	extend: Ext.data.Model,
	idProperty: "filter",
	fields: [{
		name: "symbolizers",
		mapping: function(a) {
			return {
				fillColor: a.color,
				fillOpacity: a.opacity,
				stroke: !1
			}
		},
		defaultValue: null
	}, {
		name: "filter",
		mapping: "quantity",
		type: "float",
		sortType: "asFloat",
		sortDir: "ASC"
	}, {
		name: "label",
		mapping: function(a) {
			return a.label || a.quantity
		}
	}],
	proxy: {
		type: "memory",
		reader: {
			type: "json",
			root: "colorMap"
		}
	},
	listeners: {
		idchanged: function(a) {
			for (var b = 0; b < a.stores.length; b++) a.stores[b].sort()
		}
	}
});
Ext.define("GeoExt.data.ScaleModel", {
	extend: Ext.data.Model,
	alias: "model.gx_scale",
	fields: [{
		name: "level"
	}, {
		name: "resolution"
	}, {
		name: "scale"
	}],
	proxy: {
		type: "memory",
		reader: {
			type: "json"
		}
	}
});
Ext.define("GeoExt.data.ScaleStore", {
	extend: Ext.data.Store,
	model: "GeoExt.data.ScaleModel",
	map: null,
	constructor: function(a) {
		a = a || {};
		var b = a.map instanceof GeoExt.panel.Map ? a.map.map : a.map;
		delete a.map;
		this.callParent([a]);
		b && this.bind(b)
	},
	bind: function(a) {
		this.map = a instanceof GeoExt.panel.Map ? a.map : a;
		this.map.events.register("changebaselayer", this, this.populateFromMap);
		this.map.baseLayer ? this.populateFromMap() : this.map.events.register("addlayer", this, this.populateOnAdd)
	},
	unbind: function() {
		this.map &&
			(this.map.events && (this.map.events.unregister("addlayer", this, this.populateOnAdd), this.map.events.unregister("changebaselayer", this, this.populateFromMap)), delete this.map)
	},
	populateOnAdd: function(a) {
		a.layer.isBaseLayer && (this.populateFromMap(), this.map.events.unregister("addlayer", this, this.populateOnAdd))
	},
	populateFromMap: function() {
		for (var a = [], b = this.map.baseLayer.resolutions, c = this.map.baseLayer.units, d = b.length - 1; 0 <= d; d--) {
			var e = b[d];
			a.push({
				level: d,
				resolution: e,
				scale: OpenLayers.Util.getScaleFromResolution(e,
					c)
			})
		}
		this.loadData(a)
	},
	destroy: function() {
		this.unbind();
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.data.VectorStyleModel", {
	extend: Ext.data.Model,
	fields: [{
		name: "elseFilter",
		defaultValue: null
	}, {
		name: "label",
		mapping: "title",
		type: "string"
	}, "name", "description", "minScaleDenominator", "maxScaleDenominator", {
		name: "symbolizers",
		convert: function(a) {
			a = a instanceof Array ? a : [a];
			for (var b = 0; b < a.length; b++) {
				var c = a[b];
				!(c instanceof OpenLayers.Symbolizer) && (c.CLASS_NAME && c.clone) && (a[b] = c.clone())
			}
			return a
		},
		defaultValue: null
	}, {
		name: "filter",
		convert: function(a) {
			"string" === typeof a && (a = a ? OpenLayers.Format.CQL.prototype.read(a) :
				null);
			return a
		},
		defaultValue: null
	}],
	proxy: {
		type: "memory",
		reader: {
			type: "json",
			root: "rules"
		}
	}
});
Ext.define("GeoExt.data.StyleStore", {
	extend: Ext.data.Store,
	alias: "store.gx_style",
	constructor: function(a) {
		a = Ext.apply({}, a);
		a.data && !a.model && (a.data instanceof OpenLayers.Symbolizer.Raster ? (a.model = "GeoExt.data.RasterStyleModel", a.sorters = [{
			property: "filter",
			direction: "ASC",
			root: "data"
		}]) : a.model = "GeoExt.data.VectorStyleModel");
		this.callParent([a])
	}
});
Ext.define("GeoExt.data.reader.WfsCapabilities", {
	alternateClassName: ["GeoExt.data.reader.WFSCapabilities", "GeoExt.data.WFSCapabilitiesReader"],
	extend: Ext.data.reader.Json,
	alias: "reader.gx_wfscapabilities",
	constructor: function(a) {
		this.model || (this.model = "GeoExt.data.WfsCapabilitiesLayerModel");
		this.callParent([a]);
		this.format || (this.format = new OpenLayers.Format.WFSCapabilities)
	},
	getResponseData: function(a) {
		var b = a.responseXML;
		if (!b || !b.documentElement) b = a.responseText;
		return this.readRecords(b)
	},
	readRecords: function(a) {
		if ("string" ===
			typeof a || a.nodeType) a = this.format.read(a);
		var b = a.featureTypeList.featureTypes,
			c = this.getFields(),
			d, e, f, g;
		a = {
			url: a.capability.request.getfeature.href.post
		};
		for (var h = [], j = 0, k = b.length; j < k; j++)
			if (d = b[j], d.name) {
				e = {};
				for (var l = 0, m = c.length; l < m; l++) f = c[l], g = d[f.name], e[f.name] = g;
				e.name = d.name;
				e.featureNS = d.featureNS;
				f = {
					featureType: d.name,
					featureNS: d.featureNS
				};
				this.protocolOptions ? Ext.apply(f, this.protocolOptions, a) : Ext.apply(f, {}, a);
				e = {
					metadata: e,
					protocol: new OpenLayers.Protocol.WFS(f),
					strategies: [new OpenLayers.Strategy.Fixed]
				};
				(f = this.layerOptions) && Ext.apply(e, Ext.isFunction(f) ? f() : f);
				d = new OpenLayers.Layer.Vector(d.title || d.name, e);
				h.push(d)
			}
		return this.callParent([h])
	}
});
Ext.define("GeoExt.data.WfsCapabilitiesLayerModel", {
	extend: GeoExt.data.LayerModel,
	alternateClassName: ["GeoExt.data.WFSCapabilitiesModel", "GeoExt.data.WfsCapabilitiesModel"],
	alias: "model.gx_wfscapabilities",
	fields: [{
		name: "name",
		type: "string",
		mapping: "metadata.name"
	}, {
		name: "namespace",
		type: "string",
		mapping: "metadata.featureNS"
	}, {
		name: "abstract",
		type: "string",
		mapping: "metadata.abstract"
	}],
	proxy: {
		type: "ajax",
		reader: {
			type: "gx_wfscapabilities"
		}
	}
});
Ext.define("GeoExt.data.WfsCapabilitiesLayerStore", {
	extend: GeoExt.data.OwsStore,
	model: "GeoExt.data.WfsCapabilitiesLayerModel",
	alternateClassName: ["GeoExt.data.WFSCapabilitiesStore", "GeoExt.data.WfsCapabilitiesStore"]
});
Ext.define("GeoExt.data.reader.Wmc", {
	alternateClassName: ["GeoExt.data.WMCReader"],
	extend: Ext.data.reader.Json,
	alias: "reader.gx_wmc",
	constructor: function(a) {
		this.model || (this.model = "GeoExt.data.WmcLayerModel");
		this.callParent([a]);
		this.format || (this.format = new OpenLayers.Format.WMC)
	},
	getResponseData: function(a) {
		var b = a.responseXML;
		if (!b || !b.documentElement) b = a.responseText;
		return this.readRecords(b)
	},
	readRecords: function(a) {
		if ("string" === typeof a || a.nodeType) a = this.format.read(a);
		a = a ? a.layersContext :
			void 0;
		var b = [];
		if (a) {
			var c = this.getFields(),
				d, e, f, g, h, j;
			d = 0;
			for (e = a.length; d < e; d++) {
				h = a[d];
				h.metadata = h.metadata || {};
				f = 0;
				for (g = c.length; f < g; f++) j = c[f], h.metadata[j.name] = h[j.name];
				h.metadata.name = h.name;
				f = this.format.getLayerFromContext(h);
				b.push(f)
			}
		}
		return this.callParent([b])
	}
});
Ext.define("GeoExt.data.WmcLayerModel", {
	extend: GeoExt.data.LayerModel,
	alternateClassName: ["GeoExt.data.WMCLayerModel"],
	alias: "model.gx_wmc",
	fields: [{
		name: "name",
		type: "string",
		mapping: "metadata.name"
	}, {
		name: "abstract",
		type: "string",
		mapping: "metadata.abstract"
	}, {
		name: "metadataURL",
		type: "string",
		mapping: "metadata.metadataURL"
	}, {
		name: "queryable",
		type: "boolean",
		mapping: "metadata.queryable"
	}, {
		name: "formats",
		mapping: "metadata.formats"
	}, {
		name: "styles",
		mapping: "metadata.styles"
	}],
	proxy: {
		type: "ajax",
		reader: {
			type: "gx_wmc"
		}
	}
});
Ext.define("GeoExt.data.reader.WmsCapabilities", {
	alternateClassName: ["GeoExt.data.reader.WMSCapabilities", "GeoExt.data.WMSCapabilitiesReader"],
	extend: Ext.data.reader.Json,
	alias: "reader.gx_wmscapabilities",
	constructor: function(a) {
		this.model || (this.model = "GeoExt.data.WmsCapabilitiesLayerModel");
		this.callParent([a]);
		this.format || (this.format = new OpenLayers.Format.WMSCapabilities)
	},
	keepRaw: !1,
	raw: null,
	attributionCls: "gx-attribution",
	getResponseData: function(a) {
		var b = a.responseXML;
		if (!b || !b.documentElement) b =
			a.responseText;
		return this.readRecords(b)
	},
	serviceExceptionFormat: function(a) {
		return -1 < OpenLayers.Util.indexOf(a, "application/vnd.ogc.se_inimage") ? "application/vnd.ogc.se_inimage" : -1 < OpenLayers.Util.indexOf(a, "application/vnd.ogc.se_xml") ? "application/vnd.ogc.se_xml" : a[0]
	},
	imageFormat: function(a) {
		var b = a.formats;
		return a.opaque && -1 < OpenLayers.Util.indexOf(b, "image/jpeg") ? "image/jpeg" : -1 < OpenLayers.Util.indexOf(b, "image/png") ? "image/png" : -1 < OpenLayers.Util.indexOf(b, "image/png; mode\x3d24bit") ? "image/png; mode\x3d24bit" :
			-1 < OpenLayers.Util.indexOf(b, "image/gif") ? "image/gif" : b[0]
	},
	imageTransparent: function(a) {
		return void 0 == a.opaque || !a.opaque
	},
	destroyReader: function() {
		delete this.raw;
		this.callParent()
	},
	readRecords: function(a) {
		if (Ext.isArray(a)) return this.callParent(a);
		if ("string" === typeof a || a.nodeType) a = this.format.read(a);
		a.error && Ext.Error.raise({
			msg: "Error parsing WMS GetCapabilities",
			arg: a.error
		});
		this.keepRaw && (this.raw = a);
		var b = a.version,
			c = a.capability || {};
		a = c.request && c.request.getmap && c.request.getmap.href;
		var d = c.layers,
			c = this.serviceExceptionFormat(c.exception ? c.exception.formats : []),
			e = [];
		if (a && d)
			for (var f = this.getFields(), g, h, j, k = 0, l = d.length; k < l; k++)
				if (g = d[k], g.name) {
					h = {};
					for (var m = 0, n = f.length; m < n; m++) j = f[m], h[j.name] = g[j.name];
					h.name = g.name;
					h = {
						attribution: g.attribution ? this.attributionMarkup(g.attribution) : void 0,
						minScale: g.minScale,
						maxScale: g.maxScale,
						metadata: h
					};
					this.layerOptions && Ext.apply(h, this.layerOptions);
					j = {
						layers: g.name,
						exceptions: c,
						format: this.imageFormat(g),
						transparent: this.imageTransparent(g),
						version: b
					};
					this.layerParams && Ext.apply(j, this.layerParams);
					g = new OpenLayers.Layer.WMS(g.title || g.name, a, j, h);
					e.push(g)
				}
		return this.callParent([e])
	},
	attributionMarkup: function(a) {
		var b = [];
		a.logo && b.push("\x3cimg class\x3d'" + this.attributionCls + "-image' src\x3d'" + a.logo.href + "' /\x3e");
		a.title && b.push("\x3cspan class\x3d'" + this.attributionCls + "-title'\x3e" + a.title + "\x3c/span\x3e");
		if (a.href)
			for (var c = 0; c < b.length; c++) b[c] = "\x3ca class\x3d'" + this.attributionCls + "-link' href\x3d" + a.href + "\x3e" + b[c] + "\x3c/a\x3e";
		return b.join(" ")
	}
});
Ext.define("GeoExt.data.WmsCapabilitiesLayerModel", {
	extend: GeoExt.data.LayerModel,
	alternateClassName: ["GeoExt.data.WMSCapabilitiesModel", "GeoExt.data.WmsCapabilitiesModel"],
	alias: "model.gx_wmscapabilities",
	fields: [{
		name: "name",
		type: "string",
		mapping: "metadata.name"
	}, {
		name: "abstract",
		type: "string",
		mapping: "metadata.abstract"
	}, {
		name: "queryable",
		type: "boolean",
		mapping: "metadata.queryable"
	}, {
		name: "opaque",
		type: "boolean",
		mapping: "metadata.opaque"
	}, {
		name: "noSubsets",
		type: "boolean",
		mapping: "metadata.noSubsets"
	}, {
		name: "cascaded",
		type: "int",
		mapping: "metadata.cascaded"
	}, {
		name: "fixedWidth",
		type: "int",
		mapping: "metadata.fixedWidth"
	}, {
		name: "fixedHeight",
		type: "int",
		mapping: "metadata.fixedHeight"
	}, {
		name: "minScale",
		type: "float",
		mapping: "metadata.minScale"
	}, {
		name: "maxScale",
		type: "float",
		mapping: "metadata.maxScale"
	}, {
		name: "prefix",
		type: "string",
		mapping: "metadata.prefix"
	}, {
		name: "attribution",
		type: "string"
	}, {
		name: "formats",
		mapping: "metadata.formats"
	}, {
		name: "infoFormats",
		mapping: "metadata.infoFormats"
	}, {
		name: "styles",
		mapping: "metadata.styles"
	}, {
		name: "srs",
		mapping: "metadata.srs"
	}, {
		name: "dimensions",
		mapping: "metadata.dimensions"
	}, {
		name: "bbox",
		mapping: "metadata.bbox"
	}, {
		name: "llbbox",
		mapping: "metadata.llbbox"
	}, {
		name: "keywords",
		mapping: "metadata.keywords"
	}, {
		name: "identifiers",
		mapping: "metadata.identifiers"
	}, {
		name: "authorityURLs",
		mapping: "metadata.authorityURLs"
	}, {
		name: "metadataURLs",
		mapping: "metadata.metadataURLs"
	}],
	proxy: {
		type: "ajax",
		reader: {
			type: "gx_wmscapabilities"
		}
	}
});
Ext.define("GeoExt.data.WmsCapabilitiesLayerStore", {
	extend: GeoExt.data.OwsStore,
	model: "GeoExt.data.WmsCapabilitiesLayerModel",
	alternateClassName: ["GeoExt.data.WMSCapabilitiesStore", "GeoExt.data.WmsCapabilitiesStore"]
});
Ext.define("GeoExt.data.reader.WmsDescribeLayer", {
	alternateClassName: ["GeoExt.data.reader.WMSDescribeLayer", "GeoExt.data.WMSCapabilitiesReader"],
	extend: Ext.data.reader.Json,
	alias: "reader.gx_wmsdescribelayer",
	keepRaw: !1,
	raw: null,
	constructor: function(a) {
		this.model || (this.model = "GeoExt.data.WmsDescribeLayerModel");
		this.callParent([a]);
		this.format || (this.format = new OpenLayers.Format.WMSDescribeLayer)
	},
	getResponseData: function(a) {
		var b = a.responseXML;
		if (!b || !b.documentElement) b = a.responseText;
		return this.readRecords(b)
	},
	readRecords: function(a) {
		if ("string" === typeof a || a.nodeType) a = this.format.read(a);
		a.error && Ext.Error.raise({
			msg: "Error parsing WMS DescribeLayer",
			arg: a.error
		});
		this.keepRaw && (this.raw = a);
		return this.callParent([a])
	},
	destroyReader: function() {
		delete this.raw;
		this.callParent()
	}
});
Ext.define("GeoExt.data.WmsDescribeLayerModel", {
	extend: Ext.data.Model,
	alias: "model.gx_wmsdescribelayer",
	fields: [{
		name: "layerName",
		type: "string"
	}, {
		name: "owsType",
		type: "string"
	}, {
		name: "owsURL",
		type: "string"
	}, {
		name: "typeName",
		type: "string"
	}],
	proxy: {
		type: "ajax",
		reader: {
			type: "gx_wmsdescribelayer"
		}
	}
});
Ext.define("GeoExt.data.WmsDescribeLayerStore", {
	extend: GeoExt.data.OwsStore,
	model: "GeoExt.data.WmsDescribeLayerModel",
	alternateClassName: ["GeoExt.data.WMSDescribeLayerStore"]
});
Ext.define("GeoExt.data.proxy.Protocol", {
	extend: Ext.data.proxy.Server,
	alias: "proxy.gx_protocol",
	protocol: null,
	abortPrevious: !0,
	setParamsAsOptions: !1,
	response: null,
	doRequest: function(a, b, c) {
		var d = Ext.applyIf(a.params || {}, this.extraParams || {}),
			d = Ext.applyIf(d, this.getParams(a));
		b = {
			params: d || {},
			operation: a,
			request: {
				callback: b,
				scope: c,
				arg: a.arg
			},
			reader: this.getReader()
		};
		b = OpenLayers.Function.bind(this.loadResponse, this, b);
		this.abortPrevious && this.abortRequest();
		d = {
			params: d,
			callback: b,
			scope: this
		};
		Ext.applyIf(d,
			a.arg);
		!0 === this.setParamsAsOptions && (Ext.applyIf(d, d.params), delete d.params);
		this.response = this.protocol.read(d)
	},
	abortRequest: function() {
		this.response && (this.protocol.abort(this.response), this.response = null)
	},
	loadResponse: function(a, b) {
		var c = a.operation,
			d = a.request.scope,
			e = a.request.callback;
		if (b.success()) {
			var f = a.reader.read(b.features || b);
			Ext.apply(c, {
				response: b,
				resultSet: f
			});
			c.commitRecords(f.records);
			c.setCompleted();
			c.setSuccessful()
		} else this.setException(c, b), this.fireEvent("exception",
			this, b, c);
		"function" == typeof e && e.call(d || this, c)
	}
});
Ext.define("GeoExt.form.action.Search", {
	extend: Ext.form.Action,
	alternateClassName: "GeoExt.form.SearchAction",
	alias: "formaction.search",
	type: "search",
	run: function() {
		var a = this.form,
			b = GeoExt.Form.toFilter(a, this.logicalOp, this.wildcard);
		!1 === this.clientValidation || a.isValid() ? (this.abortPrevious && a.prevResponse && this.protocol.abort(a.prevResponse), this.form.prevResponse = this.protocol.read(Ext.applyIf({
				filter: b,
				callback: this.handleResponse,
				scope: this
			}, this.readOptions))) : !1 !== this.clientValidation &&
			(this.failureType = Ext.form.action.Action.CLIENT_INVALID, a.afterAction(this, !1))
	},
	handleResponse: function(a) {
		var b = this.form;
		b.prevResponse = null;
		this.response = a;
		a.success() ? b.afterAction(this, !0) : b.afterAction(this, !1);
		this.callback && this.callback.call(this.scope, a)
	}
});
Ext.define("GeoExt.form.Basic", {
	extend: Ext.form.Basic,
	autoAbort: !0,
	doAction: function(a, b) {
		"search" == a && (b = Ext.applyIf(b || {}, {
			form: this,
			protocol: this.protocol,
			abortPrevious: this.autoAbort
		}), a = Ext.create("GeoExt.form.action.Search", b));
		return this.callParent([a, b])
	},
	search: function(a) {
		return this.doAction("search", a)
	}
});
Ext.define("GeoExt.form.Panel", {
	extend: Ext.form.Panel,
	alias: "widget.gx_form",
	protocol: null,
	createForm: function() {
		return new GeoExt.form.Basic(this, Ext.applyIf({
			listeners: {}
		}, this.initialConfig))
	},
	search: function(a) {
		this.getForm().search(a)
	}
});
Ext.define("GeoExt.form.field.GeocoderComboBox", {
	extend: Ext.form.field.ComboBox,
	alias: "widget.gx_geocodercombo",
	alternateClassName: "GeoExt.form.GeocoderComboBox",
	emptyText: "Search",
	srs: "EPSG:4326",
	zoom: 10,
	queryDelay: 100,
	valueField: "bounds",
	displayField: "name",
	locationField: "lonlat",
	url: "http://nominatim.openstreetmap.org/search?format\x3djson",
	queryParam: "q",
	minChars: 3,
	store: null,
	center: null,
	locationFeature: null,
	initComponent: function() {
		this.map && this.setMap(this.map);
		Ext.isString(this.srs) && (this.srs =
			new OpenLayers.Projection(this.srs));
		this.store || (this.store = Ext.create("Ext.data.JsonStore", {
			root: null,
			fields: [{
				name: "name",
				mapping: "display_name"
			}, {
				name: "bounds",
				convert: function(a, b) {
					var c = b.raw.boundingbox;
					return [c[2], c[0], c[3], c[1]]
				}
			}, {
				name: "lonlat",
				convert: function(a, b) {
					return [b.raw.lon, b.raw.lat]
				}
			}],
			proxy: Ext.create("Ext.data.proxy.JsonP", {
				url: this.url,
				callbackKey: "json_callback"
			})
		}));
		this.on({
			added: this.findMapPanel,
			select: this.handleSelect,
			focus: function() {
				this.clearValue();
				this.removeLocationFeature()
			},
			scope: this
		});
		return this.callParent(arguments)
	},
	findMapPanel: function() {
		var a = this.up("gx_mappanel");
		a && this.setMap(a)
	},
	handleSelect: function(a, b) {
		this.map || this.findMapPanel();
		var c = this.getValue();
		if (Ext.isArray(c)) {
			var d = this.map.getProjectionObject();
			delete this.center;
			delete this.locationFeature;
			4 === c.length ? this.map.zoomToExtent(OpenLayers.Bounds.fromArray(c).transform(this.srs, d)) : this.map.setCenter(OpenLayers.LonLat.fromArray(c).transform(this.srs, d), Math.max(this.map.getZoom(), this.zoom));
			b = b[0];
			this.center = this.map.getCenter();
			c = b.get(this.locationField);
			this.layer && c && (d = (new OpenLayers.Geometry.Point(c[0], c[1])).transform(this.srs, d), this.locationFeature = new OpenLayers.Feature.Vector(d, b.data), this.layer.addFeatures([this.locationFeature]))
		}
	},
	removeLocationFeature: function() {
		this.locationFeature && this.layer.destroyFeatures([this.locationFeature])
	},
	clearResult: function() {
		this.center && !this.map.getCenter().equals(this.center) && this.clearValue()
	},
	setMap: function(a) {
		a instanceof GeoExt.panel.Map &&
			(a = a.map);
		this.map = a;
		a.events.on({
			moveend: this.clearResult,
			click: this.removeLocationFeature,
			scope: this
		})
	},
	addToMapPanel: Ext.emptyFn,
	beforeDestroy: function() {
		this.map && this.map.events && this.map.events.un({
			moveend: this.clearResult,
			click: this.removeLocationFeature,
			scope: this
		});
		this.removeLocationFeature();
		delete this.map;
		delete this.layer;
		delete this.center;
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.grid.column.Symbolizer", {
	extend: Ext.grid.column.Column,
	alternateClassName: "GeoExt.grid.SymbolizerColumn",
	alias: ["widget.gx_symbolizercolumn"],
	defaultRenderer: function(a, b, c) {
		if (a) {
			var d = Ext.id(),
				e = "Polygon";
			if (c)
				if (e = "Line", c = c.raw.geometry ? c.raw.geometry.CLASS_NAME : null, "OpenLayers.Geometry.Point" == c || "OpenLayers.Geometry.MultiPoint" == c) e = "Point";
				else if ("OpenLayers.Geometry.Polygon" == c || "OpenLayers.Geometry.MultiPolygon" == c) e = "Polygon";
			window.setTimeout(function() {
				var b = Ext.get(d);
				b && Ext.create("GeoExt.FeatureRenderer", {
					renderTo: b,
					symbolizers: a instanceof Array ? a : [a],
					symbolType: e
				})
			}, 0);
			b.css = "gx-grid-symbolizercol";
			return Ext.String.format('\x3cdiv id\x3d"{0}"\x3e\x3c/div\x3e', d)
		}
	}
});
Ext.define("GeoExt.panel.Legend", {
	extend: Ext.panel.Panel,
	alias: "widget.gx_legendpanel",
	alternateClassName: "GeoExt.LegendPanel",
	dynamic: !0,
	layerStore: null,
	preferredTypes: null,
	filter: function() {
		return !0
	},
	onRender: function() {
		this.callParent(arguments);
		this.layerStore || (this.layerStore = GeoExt.panel.Map.guess().layers);
		this.layerStore.each(function(a) {
			this.addLegend(a)
		}, this);
		if (this.dynamic) this.layerStore.on({
			add: this.onStoreAdd,
			remove: this.onStoreRemove,
			clear: this.onStoreClear,
			scope: this
		})
	},
	recordIndexToPanelIndex: function(a) {
		for (var b =
				this.layerStore, c = b.getCount(), d = -1, e = this.items ? this.items.length : 0, f, g = c - 1; 0 <= g && !(f = b.getAt(g), c = f.getLayer(), f = GeoExt.container.LayerLegend.getTypes(f), c.displayInLayerSwitcher && (0 < f.length && !0 !== b.getAt(g).get("hideInLegend")) && (++d, a === g || d > e - 1)); --g);
		return d
	},
	getIdForLayer: function(a) {
		return this.id + "-" + a.id
	},
	onStoreAdd: function(a, b, c) {
		a = this.recordIndexToPanelIndex(c + b.length - 1);
		c = 0;
		for (var d = b.length; c < d; c++) this.addLegend(b[c], a);
		this.doLayout()
	},
	onStoreRemove: function(a, b) {
		this.removeLegend(b)
	},
	removeLegend: function(a) {
		if (this.items && (a = this.getComponent(this.getIdForLayer(a.getLayer())))) this.remove(a, !0), this.doLayout()
	},
	onStoreClear: function() {
		this.removeAllLegends()
	},
	removeAllLegends: function() {
		this.removeAll(!0);
		this.doLayout()
	},
	addLegend: function(a, b) {
		if (!0 === this.filter(a)) {
			var c = a.getLayer();
			b = b || 0;
			var d = GeoExt.container.LayerLegend.getTypes(a, this.preferredTypes);
			c.displayInLayerSwitcher && (!a.get("hideInLegend") && 0 < d.length) && this.insert(b, {
				xtype: d[0],
				id: this.getIdForLayer(c),
				layerRecord: a,
				hidden: !(!c.map && c.visibility || c.getVisibility() && c.calculateInRange())
			})
		}
	},
	onDestroy: function() {
		this.layerStore && (this.layerStore.un("add", this.onStoreAdd, this), this.layerStore.un("remove", this.onStoreRemove, this), this.layerStore.un("clear", this.onStoreClear, this));
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.panel.PrintMap", {
	extend: GeoExt.panel.Map,
	alias: "widget.gx_printmappanel",
	alternateClassName: "GeoExt.PrintMapPanel",
	sourceMap: null,
	printProvider: null,
	printPage: null,
	previewScales: null,
	center: null,
	zoom: null,
	extent: null,
	currentZoom: null,
	initComponent: function() {
		this.sourceMap instanceof GeoExt.MapPanel && (this.sourceMap = this.sourceMap.map);
		this.map || (this.map = {});
		Ext.applyIf(this.map, {
			projection: this.sourceMap.getProjection(),
			maxExtent: this.sourceMap.getMaxExtent(),
			maxResolution: this.sourceMap.getMaxResolution(),
			units: this.sourceMap.getUnits(),
			tileManager: null,
			allOverlays: !0,
			fallThrough: !0
		});
		this.printProvider instanceof GeoExt.data.MapfishPrintProvider || (this.printProvider = Ext.create("GeoExt.data.MapfishPrintProvider", this.printProvider));
		this.printPage = Ext.create("GeoExt.data.PrintPage", {
			printProvider: this.printProvider
		});
		this.previewScales = Ext.create("Ext.data.Store", {
			fields: [{
				name: "name",
				type: "string"
			}, {
				name: "value",
				type: "int"
			}],
			data: this.printProvider.scales.getRange()
		});
		this.layers = [];
		Ext.each(this.sourceMap.layers,
			function(a) {
				!0 === a.getVisibility() && this.layers.push(a.clone())
			}, this);
		this.extent = this.sourceMap.getExtent();
		this.callParent(arguments)
	},
	syncSize: function() {
		var a = this.adjustSize(this.map.size.w, this.map.size.h);
		this.setSize(a.width, a.height)
	},
	bind: function() {
		this.syncSize();
		this.printPage.on("change", this.fitZoom, this);
		this.printProvider.on("layoutchange", this.syncSize, this);
		this.map.events.register("moveend", this, this.updatePage);
		this.on("resize", function() {
				this.doComponentLayout();
				this.map.updateSize()
			},
			this);
		this.printPage.fit(this.sourceMap);
		!0 === this.initialConfig.limitScales && (this.on("resize", this.calculatePreviewScales, this), this.calculatePreviewScales())
	},
	afterRender: function() {
		var a = {
			afterlayout: {
				fn: this.bind,
				scope: this,
				single: !0
			}
		};
		this.callParent(arguments);
		this.doComponentLayout();
		if (this.ownerCt) this.ownerCt.on(a);
		else this.on(a)
	},
	adjustSize: function(a, b) {
		var c = this.printProvider.layout.get("size"),
			c = c.width / c.height,
			d = this.ownerCt,
			e = d && d.autoWidth ? 0 : a || this.initialConfig.width,
			d = d && d.autoHeight ?
			0 : b || this.initialConfig.height;
		e ? (b = e / c, d && b > d ? (b = d, a = b * c) : a = e) : d && (a = d * c, b = d);
		return {
			width: a,
			height: b
		}
	},
	fitZoom: function() {
		if (!this._updating && this.printPage.scale) {
			this._updating = !0;
			var a = this.printPage.getPrintExtent(this.map);
			this.currentZoom = this.map.getZoomForExtent(a);
			this.map.zoomToExtent(a, !1);
			delete this._updating
		}
	},
	updatePage: function() {
		if (!this._updating) {
			var a = this.map.getZoom();
			this._updating = !0;
			a === this.currentZoom ? this.printPage.setCenter(this.map.getCenter()) : this.printPage.fit(this.map);
			delete this._updating;
			this.currentZoom = a
		}
	},
	calculatePreviewScales: function() {
		this.previewScales.removeAll();
		this.printPage.suspendEvents();
		var a = this.printPage.scale,
			b = this.map.getSize(),
			c = {},
			d = [];
		this.printProvider.scales.each(function(a) {
			this.printPage.setScale(a);
			var e = this.printPage.getPrintExtent(this.map),
				f = this.map.getZoomForExtent(e),
				e = Math.max(e.getWidth() / b.w, e.getHeight() / b.h),
				k = this.map.getResolutionForZoom(f),
				e = Math.abs(e - k);
			if (!(f in c) || c[f].diff > e) c[f] = {
				rec: a,
				diff: e
			}, -1 === Ext.Array.indexOf(d,
				f) && d.push(f)
		}, this);
		for (var e = 0, f = d.length; e < f; ++e) this.previewScales.add(c[d[e]].rec);
		a && this.printPage.setScale(a);
		this.printPage.resumeEvents();
		a && 0 < this.previewScales.getCount() && (e = this.previewScales.getAt(0), f = this.previewScales.getAt(this.previewScales.getCount() - 1), a.get("value") < f.get("value") ? this.printPage.setScale(f) : a.get("value") > e.get("value") && this.printPage.setScale(e));
		this.fitZoom()
	},
	print: function(a) {
		this.printProvider.print(this.map, [this.printPage], a)
	},
	beforeDestroy: function() {
		this.map.events.unregister("moveend",
			this, this.updatePage);
		this.printPage.un("change", this.fitZoom, this);
		this.printProvider.un("layoutchange", this.syncSize, this);
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.plugins.PrintExtent", {
	mixins: {
		observable: Ext.util.Observable
	},
	alias: "widget.gx_printextent",
	alternateClassName: "GeoExt.PrintExtent",
	initialConfig: null,
	printProvider: null,
	map: null,
	layer: null,
	transformFeatureOptions: null,
	control: null,
	pages: null,
	page: null,
	constructor: function(a) {
		a = a || {};
		Ext.apply(this, a);
		this.initialConfig = a;
		this.printProvider || (this.printProvider = this.pages[0].printProvider);
		this.pages || (this.pages = []);
		this.callParent(arguments)
	},
	print: function(a) {
		this.printProvider.print(this.map,
			this.pages, a)
	},
	init: function(a) {
		this.map = a.map;
		a.on("destroy", this.onMapPanelDestroy, this);
		this.layer || (this.layer = new OpenLayers.Layer.Vector(null, {
			displayInLayerSwitcher: !1
		}));
		this.createControl();
		a = 0;
		for (var b = this.pages.length; a < b; ++a) this.addPage(this.pages[a]);
		this.show()
	},
	addPage: function(a) {
		a = a || Ext.create("GeoExt.data.PrintPage", {
			printProvider: this.printProvider
		}); - 1 === Ext.Array.indexOf(this.pages, a) && this.pages.push(a);
		this.layer.addFeatures([a.feature]);
		a.on("change", this.onPageChange,
			this);
		this.page = a;
		var b = this.map;
		b.getCenter() ? this.fitPage() : b.events.register("moveend", this, function() {
			b.events.unregister("moveend", this, arguments.callee);
			this.fitPage()
		});
		return a
	},
	removePage: function(a) {
		Ext.Array.remove(this.pages, a);
		a.feature.layer && this.layer.removeFeatures([a.feature]);
		a.un("change", this.onPageChange, this)
	},
	selectPage: function(a) {
		this.control.active && this.control.setFeature(a.feature)
	},
	show: function() {
		this.map.addLayer(this.layer);
		this.map.addControl(this.control);
		this.control.activate();
		this.page && this.map.getCenter() && this.updateBox()
	},
	hide: function() {
		var a = this.map,
			b = this.layer,
			c = this.control;
		c && c.events && (c.deactivate(), a && (a.events && c.map) && a.removeControl(c));
		a && (a.events && b && b.map) && a.removeLayer(b)
	},
	onMapPanelDestroy: function() {
		for (var a = this.map, b = this.pages.length - 1; 0 <= b; b--) this.removePage(this.pages[b]);
		this.hide();
		b = this.control;
		a && (a.events && b && b.events) && b.destroy();
		b = this.layer;
		!this.initialConfig.layer && (a && a.events && b && b.events) && b.destroy();
		delete this.layer;
		delete this.control;
		delete this.page;
		this.map = null
	},
	createControl: function() {
		this.control = new OpenLayers.Control.TransformFeature(this.layer, Ext.applyIf({
			preserveAspectRatio: !0,
			eventListeners: {
				beforesetfeature: function(a) {
					for (var b = 0, c = this.pages.length; b < c; ++b)
						if (this.pages[b].feature === a.feature) {
							this.page = this.pages[b];
							a.object.rotation = -this.pages[b].rotation;
							break
						}
				},
				setfeature: function(a) {
					for (var b = 0, c = this.pages.length; b < c; ++b)
						if (this.pages[b].feature === a.feature) {
							this.fireEvent("selectpage", this.pages[b]);
							break
						}
				},
				beforetransform: function(a) {
					this._updating = !0;
					var b = this.page;
					if (a.rotation) this.printProvider.layout.get("rotation") ? b.setRotation(-a.object.rotation) : a.object.setFeature(b.feature);
					else if (a.center) b.setCenter(OpenLayers.LonLat.fromString(a.center.toShortString()));
					else {
						b.fit(a.object.box, {
							mode: "closest"
						});
						var c = this.printProvider.scales.getAt(0),
							d = this.printProvider.scales.getAt(this.printProvider.scales.getCount() - 1);
						a = a.object.box.geometry.getBounds();
						var e = b.feature.geometry.getBounds(),
							c = b.scale ===
							c && a.containsBounds(e),
							b = b.scale === d && e.containsBounds(a);
						(!0 === c || !0 === b) && this.updateBox()
					}
					delete this._updating;
					return !1
				},
				transformcomplete: this.updateBox,
				scope: this
			}
		}, this.transformFeatureOptions))
	},
	fitPage: function() {
		this.page && this.page.fit(this.map, {
			mode: "screen"
		})
	},
	updateBox: function() {
		var a = this.page;
		this.control.active && this.control.setFeature(a.feature, {
			rotation: -a.rotation
		})
	},
	onPageChange: function(a) {
		this._updating || this.control.active && this.control.setFeature(a.feature, {
			rotation: -a.rotation
		})
	}
});
Ext.define("GeoExt.plugins.PrintPageField", {
	mixins: {
		observable: Ext.util.Observable
	},
	alias: "widget.gx_printpagefield",
	alternateClassName: "GeoExt.PrintPageField",
	printPage: null,
	target: null,
	constructor: function(a) {
		this.initialConfig = a;
		Ext.apply(this, a);
		this.callParent(arguments)
	},
	init: function(a) {
		this.target = a;
		var b = {
				beforedestroy: this.onBeforeDestroy,
				scope: this
			},
			c = "change";
		a instanceof Ext.form.ComboBox && (c = "select");
		b[c] = this.onFieldChange;
		a.on(b);
		this.printPage.on({
			change: this.onPageChange,
			scope: this
		});
		this.printPage.printProvider.on({
			layoutchange: this.onLayoutChange,
			scope: this
		});
		this.setValue(this.printPage)
	},
	onFieldChange: function(a, b) {
		var c;
		c = Ext.isArray(b) ? b[0] : b;
		var d = this.printPage.printProvider,
			e = a.getValue();
		this._updating = !0;
		a.store === d.scales || "scale" === a.name ? this.printPage.setScale(c) : "rotation" == a.name ? !isNaN(e) && this.printPage.setRotation(e) : this.printPage.customParams[a.name] = e;
		delete this._updating
	},
	onPageChange: function(a) {
		this._updating || this.setValue(a)
	},
	onLayoutChange: function(a,
		b) {
		var c = this.target;
		"rotation" == c.name && c.setDisabled(!b.get("rotation"))
	},
	setValue: function(a) {
		var b = this.target;
		b.suspendEvents();
		b.store === a.printProvider.scales || "scale" === b.name ? a.scale && b.setValue(a.scale.get(b.displayField)) : "rotation" == b.name && b.setValue(a.rotation);
		b.resumeEvents()
	},
	onBeforeDestroy: function() {
		this.target.un("beforedestroy", this.onBeforeDestroy, this);
		this.target.un("select", this.onFieldChange, this);
		this.target.un("valid", this.onFieldChange, this);
		this.printPage.un("change",
			this.onPageChange, this);
		this.printPage.printProvider.un("layoutchange", this.onLayoutChange, this)
	}
});
Ext.define("GeoExt.plugins.PrintProviderField", {
	mixins: {
		observable: Ext.util.Observable
	},
	alias: "widget.gx_printproviderfield",
	alternateClassName: "GeoExt.PrintProviderField",
	target: null,
	constructor: function(a) {
		this.initialConfig = a;
		Ext.apply(this, a);
		this.callParent(arguments)
	},
	init: function(a) {
		this.target = a;
		var b = {
			scope: this,
			render: this.onRender,
			beforedestroy: this.onBeforeDestroy
		};
		b[a instanceof Ext.form.ComboBox ? "select" : "change"] = this.onFieldChange;
		a.on(b)
	},
	onRender: function(a) {
		var b = this.printProvider ||
			a.ownerCt.printProvider;
		a.store === b.layouts ? (a.setValue(b.layout.get(a.displayField)), b.on({
			layoutchange: this.onProviderChange,
			scope: this
		})) : a.store === b.dpis ? (a.setValue(b.dpi.get(a.displayField)), b.on({
			dpichange: this.onProviderChange,
			scope: this
		})) : void 0 === a.initialConfig.value && a.setValue(b.customParams[a.name])
	},
	onFieldChange: function(a, b) {
		var c;
		c = Ext.isArray(b) ? b[0] : b;
		var d = this.printProvider || a.ownerCt.printProvider,
			e = a.getValue();
		this._updating = !0;
		if (c) switch (a.store) {
			case d.layouts:
				d.setLayout(c);
				break;
			case d.dpis:
				d.setDpi(c)
		} else d.customParams[a.name] = e;
		delete this._updating
	},
	onProviderChange: function(a, b) {
		this._updating || this.target.setValue(b.get(this.target.displayField))
	},
	onBeforeDestroy: function() {
		var a = this.target;
		a.un("beforedestroy", this.onBeforeDestroy, this);
		a.un("render", this.onRender, this);
		a.un("select", this.onFieldChange, this);
		a.un("valid", this.onFieldChange, this);
		a = this.printProvider || a.ownerCt.printProvider;
		a.un("layoutchange", this.onProviderChange, this);
		a.un("dpichange", this.onProviderChange,
			this)
	}
});
Ext.define("GeoExt.selection.FeatureModel", {
	extend: Ext.selection.RowModel,
	alias: "selection.featuremodel",
	autoActivateControl: !0,
	layerFromStore: !0,
	selectControl: null,
	bound: !1,
	selectedFeatures: [],
	autoPanMapOnSelection: !1,
	constructor: function(a) {
		a = a || {};
		if (a.selectControl instanceof OpenLayers.Control.SelectFeature) {
			if (!a.singleSelect) {
				var b = a.selectControl;
				a.singleSelect = !(b.multiple || b.multipleKey)
			}
		} else a.layer instanceof OpenLayers.Layer.Vector && (this.selectControl = this.createSelectControl(a.layer, a.selectControl),
			delete a.layer, delete a.selectControl);
		a.autoPanMapOnSelection && (this.autoPanMapOnSelection = !0, delete a.autoPanMapOnSelection);
		this.callParent(arguments)
	},
	bindComponent: function() {
		this.callParent(arguments);
		if (this.layerFromStore) {
			var a = this.view.getStore() && this.view.getStore().layer;
			a && !(this.selectControl instanceof OpenLayers.Control.SelectFeature) && (this.selectControl = this.createSelectControl(a, this.selectControl))
		}
		this.selectControl && this.bind(this.selectControl)
	},
	createSelectControl: function(a,
		b) {
		b = b || {};
		b = OpenLayers.Util.extend({
			toggle: !0,
			multipleKey: (void 0 !== b.singleSelect ? b.singleSelect : this.singleSelect) ? null : Ext.isMac ? "metaKey" : "ctrlKey"
		}, b);
		var c = new OpenLayers.Control.SelectFeature(a, b);
		a.map.addControl(c);
		return c
	},
	bind: function(a, b) {
		if (!this.bound) {
			b = b || {};
			this.selectControl = a;
			a instanceof OpenLayers.Layer.Vector && (this.selectControl = this.createSelectControl(a, b.controlConfig));
			this.autoActivateControl && this.selectControl.activate();
			for (var c = this.getLayers(), d = 0, e = c.length; d <
				e; d++) c[d].events.on({
				featureselected: this.featureSelected,
				featureunselected: this.featureUnselected,
				scope: this
			});
			this.bound = !0
		}
		return this.selectControl
	},
	unbind: function() {
		var a = this.selectControl;
		if (this.bound) {
			for (var b = this.getLayers(), c = 0, d = b.length; c < d; c++) b[c].events.un({
				featureselected: this.featureSelected,
				featureunselected: this.featureUnselected,
				scope: this
			});
			this.autoActivateControl && a.deactivate();
			this.selectControl = null;
			this.bound = !1
		}
		return a
	},
	featureSelected: function(a) {
		if (!this._selecting) {
			var b =
				this.view.store.findBy(function(b) {
					return b.raw == a.feature
				}); - 1 != b && !this.isSelected(b) && (this._selecting = !0, this.select(b, !this.singleSelect), this._selecting = !1, this.view.focusRow(b))
		}
	},
	featureUnselected: function(a) {
		if (!this._selecting) {
			var b = this.view.store.findBy(function(b) {
				return b.raw == a.feature
			}); - 1 != b && this.isSelected(b) && (this._selecting = !0, this.deselect(b), this._selecting = !1, this.view.focusRow(b))
		}
	},
	onSelectChange: function(a, b) {
		this.callParent(arguments);
		var c = a.raw;
		if (this.selectControl &&
			!this._selecting && c) {
			var d = this.getLayers();
			if (b) {
				for (var e = 0, f = d.length; e < f; e++)
					if (-1 == Ext.Array.indexOf(d[e].selectedFeatures, c)) {
						this._selecting = !0;
						this.selectControl.select(c);
						this._selecting = !1;
						this.selectedFeatures.push(c);
						break
					}
				this.autoPanMapOnSelection && this.recenterToSelectionExtent()
			} else {
				e = 0;
				for (f = d.length; e < f; e++)
					if (-1 != Ext.Array.indexOf(d[e].selectedFeatures, c)) {
						this._selecting = !0;
						this.selectControl.unselect(c);
						this._selecting = !1;
						OpenLayers.Util.removeItem(this.selectedFeatures, c);
						break
					}
				this.autoPanMapOnSelection &&
					0 < this.selectedFeatures.length && this.recenterToSelectionExtent()
			}
		}
	},
	getLayers: function() {
		return this.selectControl.layers || [this.selectControl.layer]
	},
	recenterToSelectionExtent: function() {
		var a = this.selectControl.map,
			b = this.getSelectionExtent();
		a.getZoomForExtent(b, !1) > a.getZoom() ? a.setCenter(b.getCenterLonLat()) : a.zoomToExtent(b)
	},
	getSelectionExtent: function() {
		var a = null,
			b = this.selectedFeatures;
		if (b && 0 < b.length)
			for (var c = null, d = 0, e = b.length; d < e; d++)
				if (c = b[d].geometry) null === a && (a = new OpenLayers.Bounds),
					a.extend(c.getBounds());
		return a
	}
});
Ext.define("GeoExt.slider.MapPanelItem", {
	extend: Ext.slider.Single,
	resizingDelayMS: 200,
	thumbHeight: 14,
	thumbWidth: 15,
	addToMapPanel: function(a) {
		this.on({
			afterrender: function() {
				var b = this,
					c = b.getEl(),
					d = b.vertical ? b.thumbWidth : c.getWidth(),
					e = !b.vertical ? b.thumbHeight : c.getHeight(),
					f = b.y || 0,
					g = b.x || 0;
				c.on({
					mousedown: b.stopMouseEvents,
					click: b.stopMouseEvents
				});
				(new Ext.util.DelayedTask(function() {
					c.setStyle({
						top: f,
						left: g,
						width: "" + d + "px",
						position: "absolute",
						height: "" + e + "px",
						zIndex: a.map.Z_INDEX_BASE.Control
					});
					b.vertical ? c.down(".x-slider-inner").el.setStyle({
						height: "" + (e - b.thumbWidth) + "px"
					}) : c.down(".x-form-item-body").el.setStyle({
						height: "" + b.thumbHeight + "px"
					})
				})).delay(b.resizingDelayMS)
			},
			scope: this
		})
	},
	removeFromMapPanel: function() {
		this.getEl().un({
			mousedown: this.stopMouseEvents,
			click: this.stopMouseEvents,
			scope: this
		});
		this.unbind()
	},
	unbind: Ext.emptyFn,
	stopMouseEvents: function(a) {
		a.stopEvent()
	}
});
Ext.define("GeoExt.slider.LayerOpacity", {
	alternateClassName: "GeoExt.LayerOpacitySlider",
	extend: GeoExt.slider.MapPanelItem,
	alias: "widget.gx_opacityslider",
	layer: null,
	complementaryLayer: null,
	delay: 5,
	changeVisibilityDelay: 5,
	aggressive: !1,
	changeVisibility: !1,
	value: null,
	inverse: !1,
	constructor: function(a) {
		a.layer && (this.layer = this.getLayer(a.layer), this.bind(), this.complementaryLayer = this.getLayer(a.complementaryLayer), void 0 !== a.inverse && (this.inverse = a.inverse), a.value = void 0 !== a.value ? a.value : this.getOpacityValue(this.layer),
			delete a.layer, delete a.complementaryLayer);
		this.callParent([a])
	},
	bind: function() {
		if (this.layer && this.layer.map) this.layer.map.events.on({
			changelayer: this.update,
			scope: this
		})
	},
	unbind: function() {
		this.layer && (this.layer.map && this.layer.map.events) && this.layer.map.events.un({
			changelayer: this.update,
			scope: this
		})
	},
	update: function(a) {
		"opacity" === a.property && (a.layer == this.layer && !this._settingOpacity) && this.setValue(this.getOpacityValue(this.layer))
	},
	setLayer: function(a) {
		this.unbind();
		this.layer = this.getLayer(a);
		this.setValue(this.getOpacityValue(a));
		this.bind()
	},
	getOpacityValue: function(a) {
		a = a && null !== a.opacity ? parseInt(a.opacity * (this.maxValue - this.minValue)) : this.maxValue;
		!0 === this.inverse && (a = this.maxValue - this.minValue - a);
		return a
	},
	getLayer: function(a) {
		if (a instanceof OpenLayers.Layer) return a;
		if (a instanceof GeoExt.data.LayerModel) return a.getLayer()
	},
	initComponent: function() {
		this.callParent();
		this.changeVisibility && (this.layer && (0 == this.layer.opacity || !1 === this.inverse && this.value == this.minValue ||
			!0 === this.inverse && this.value == this.maxValue)) && this.layer.setVisibility(!1);
		this.complementaryLayer && (this.layer && 1 == this.layer.opacity || !1 === this.inverse && this.value == this.maxValue || !0 === this.inverse && this.value == this.minValue) && this.complementaryLayer.setVisibility(!1);
		if (!0 === this.aggressive) this.on("change", this.changeLayerOpacity, this, {
			buffer: this.delay
		});
		else this.on("changecomplete", this.changeLayerOpacity, this);
		if (!0 === this.changeVisibility) this.on("change", this.changeLayerVisibility, this, {
			buffer: this.changeVisibilityDelay
		});
		if (this.complementaryLayer) this.on("change", this.changeComplementaryLayerVisibility, this, {
			buffer: this.changeVisibilityDelay
		});
		this.on("beforedestroy", this.unbind, this)
	},
	changeLayerOpacity: function(a, b) {
		this.layer && (b /= this.maxValue - this.minValue, !0 === this.inverse && (b = 1 - b), this._settingOpacity = !0, this.layer.setOpacity(b), delete this._settingOpacity)
	},
	changeLayerVisibility: function(a, b) {
		var c = this.layer.getVisibility();
		!1 === this.inverse && b == this.minValue || !0 === this.inverse &&
			b == this.maxValue && !0 === c ? this.layer.setVisibility(!1) : (!1 === this.inverse && b > this.minValue || !0 === this.inverse && b < this.maxValue && !1 == c) && this.layer.setVisibility(!0)
	},
	changeComplementaryLayerVisibility: function(a, b) {
		var c = this.complementaryLayer.getVisibility();
		!1 === this.inverse && b == this.maxValue || !0 === this.inverse && b == this.minValue && !0 === c ? this.complementaryLayer.setVisibility(!1) : (!1 === this.inverse && b < this.maxValue || !0 === this.inverse && b > this.minValue && !1 == c) && this.complementaryLayer.setVisibility(!0)
	}
});
Ext.define("GeoExt.slider.Tip", {
	extend: Ext.slider.Tip,
	alternateClassName: "GeoExt.SliderTip",
	hover: !0,
	minWidth: 10,
	offsets: [0, -10],
	dragging: !1,
	init: function(a) {
		this.callParent(arguments);
		if (this.hover) a.on("render", this.registerThumbListeners, this);
		this.slider = a
	},
	registerThumbListeners: function() {
		for (var a, b, c = 0, d = this.slider.thumbs.length; c < d; ++c) a = this.slider.thumbs[c], b = a.tracker.el,
			function(a, b) {
				b.on({
					mouseover: function(b) {
						this.onSlide(this.slider, b, a);
						this.dragging = !1
					},
					mouseout: function() {
						this.dragging ||
							this.hide.apply(this, arguments)
					},
					scope: this
				})
			}.apply(this, [a, b])
	},
	onSlide: function(a, b, c) {
		this.dragging = !0;
		return this.callParent(arguments)
	}
});
Ext.define("GeoExt.slider.Zoom", {
	extend: GeoExt.slider.MapPanelItem,
	alias: "widget.gx_zoomslider",
	alternateClassName: "GeoExt.ZoomSlider",
	map: null,
	baseCls: "gx-zoomslider",
	aggressive: !1,
	updating: !1,
	zooming: !1,
	initComponent: function() {
		this.callParent(arguments);
		this.map && (this.map instanceof GeoExt.MapPanel && (this.map = this.map.map), this.bind(this.map));
		if (!0 === this.aggressive) this.on("change", this.changeHandler, this);
		else this.on("changecomplete", this.changeHandler, this);
		this.on("beforedestroy", this.unbind,
			this)
	},
	onRender: function() {
		this.callParent(arguments);
		this.el.addCls(this.baseCls)
	},
	afterRender: function() {
		this.callParent(arguments);
		this.update()
	},
	addToMapPanel: function(a) {
		var b = this;
		b.callParent(arguments);
		b.on({
			afterrender: function() {
				b.bind(a.map)
			}
		})
	},
	bind: function(a) {
		this.map = a;
		this.map.events.on({
			zoomend: this.update,
			changebaselayer: this.initZoomValues,
			scope: this
		});
		this.map.baseLayer && (this.initZoomValues(), this.update())
	},
	unbind: function() {
		this.map && this.map.events && this.map.events.un({
			zoomend: this.update,
			changebaselayer: this.initZoomValues,
			scope: this
		})
	},
	initZoomValues: function() {
		var a = this.map.baseLayer;
		void 0 === this.initialConfig.minValue && (this.minValue = a.minZoomLevel || 0);
		void 0 === this.initialConfig.maxValue && (this.maxValue = null == a.minZoomLevel ? a.numZoomLevels - 1 : a.maxZoomLevel)
	},
	getZoom: function() {
		return this.getValue()
	},
	getScale: function() {
		return OpenLayers.Util.getScaleFromResolution(this.map.getResolutionForZoom(this.getValue()), this.map.getUnits())
	},
	getResolution: function() {
		return this.map.getResolutionForZoom(this.getValue())
	},
	changeHandler: function() {
		this.map && !this.updating && (this.zooming = !0, this.map.zoomTo(this.getValue()))
	},
	update: function() {
		this.rendered && (this.map && !this.zooming) && (this.updating = !0, this.setValue(this.map.getZoom()), this.updating = !1);
		this.zooming = !1
	}
});
Ext.define("GeoExt.state.PermalinkProvider", {
	extend: Ext.state.Provider,
	alias: "widget.gx_permalinkprovider",
	constructor: function(a) {
		this.callParent(arguments);
		a = a || {};
		var b = a.url;
		delete a.url;
		Ext.apply(this, a);
		this.state = this.readURL(b)
	},
	encodeType: !0,
	readURL: function(a) {
		var b = {};
		a = OpenLayers.Util.getParameters(a);
		var c, d, e;
		for (c in a) a.hasOwnProperty(c) && (d = c.split("_"), 1 < d.length && (e = d[0], b[e] = b[e] || {}, b[e][d.slice(1).join("_")] = this.encodeType ? this.decodeValue(a[c]) : a[c]));
		return b
	},
	getLink: function(a) {
		a =
			a || document.location.href;
		var b = {},
			c, d, e = this.state;
		for (c in e)
			if (e.hasOwnProperty(c))
				for (d in e[c]) b[c + "_" + d] = this.encodeType ? unescape(this.encodeValue(e[c][d])) : e[c][d];
		OpenLayers.Util.applyDefaults(b, OpenLayers.Util.getParameters(a));
		b = OpenLayers.Util.getParameterString(b);
		c = a.indexOf("?");
		0 < c && (a = a.substring(0, c));
		return Ext.urlAppend(a, b)
	}
});
Ext.define("GeoExt.tree.LayerNode", {
	extend: Ext.AbstractPlugin,
	alias: "plugin.gx_layer",
	init: function(a) {
		this.target = a;
		var b = a.get("layer");
		a.set("checked", b.getVisibility());
		!a.get("checkedGroup") && b.isBaseLayer && a.set("checkedGroup", "gx_baselayer");
		a.set("fixedText", !!a.text);
		a.set("leaf", !0);
		a.get("iconCls") || a.set("iconCls", "gx-tree-layer-icon");
		a.on("afteredit", this.onAfterEdit, this);
		b.events.on({
			visibilitychanged: this.onLayerVisibilityChanged,
			scope: this
		});
		this.enforceOneVisible()
	},
	onAfterEdit: function(a,
		b) {
		if (~Ext.Array.indexOf(b, "checked")) this.onCheckChange()
	},
	onLayerVisibilityChanged: function() {
		this._visibilityChanging || this.target.set("checked", this.target.get("layer").getVisibility())
	},
	onCheckChange: function() {
		var a = this.target,
			b = this.target.get("checked");
		if (b != a.get("layer").getVisibility()) {
			a._visibilityChanging = !0;
			var c = a.get("layer");
			b && c.isBaseLayer && c.map ? c.map.setBaseLayer(c) : !b && c.isBaseLayer && c.map && c.map.baseLayer && c.id == c.map.baseLayer.id ? a.set("checked", c.getVisibility()) : c.setVisibility(b);
			delete a._visibilityChanging
		}
		this.enforceOneVisible()
	},
	enforceOneVisible: function() {
		var a = this.target.data,
			b = a.checkedGroup;
		if (b && "gx_baselayer" !== b) {
			var c = this.target.get("layer"),
				d = this.target.getOwnerTree().getChecked(),
				e = 0;
			Ext.each(d, function(d) {
				var g = d.data.layer;
				!d.data.hidden && d.data.checkedGroup === b && (e++, g != c && a.checked && g.setVisibility(!1))
			});
			0 === e && !1 == a.checked && c.setVisibility(!0)
		}
	}
});
Ext.define("GeoExt.tree.LayerLoader", {
	extend: Ext.util.Observable,
	store: null,
	filter: function(a) {
		return !0 === a.getLayer().displayInLayerSwitcher
	},
	baseAttrs: null,
	load: function(a) {
		if (this.fireEvent("beforeload", this, a)) {
			for (this.removeStoreHandlers(); a.firstChild;) a.removeChild(a.firstChild);
			this.store || (this.store = GeoExt.MapPanel.guess().layers);
			this.store.each(function(b) {
				this.addLayerNode(a, b)
			}, this);
			this.addStoreHandlers(a);
			this.fireEvent("load", this, a)
		}
	},
	onStoreAdd: function(a, b, c, d) {
		if (!this._reordering) {
			a =
				d.get("container").recordIndexToNodeIndex(c + b.length - 1, d);
			c = 0;
			for (var e = b.length; c < e; ++c) this.addLayerNode(d, b[c], a)
		}
	},
	onStoreRemove: function(a, b) {
		this._reordering || this.removeLayerNode(b, a)
	},
	addLayerNode: function(a, b, c) {
		c = c || 0;
		!0 === this.filter(b) && (b = b.getLayer(), b = this.createNode({
			plugins: [{
				ptype: "gx_layer"
			}],
			layer: b,
			text: b.name,
			listeners: {
				move: this.onChildMove,
				scope: this
			}
		}), void 0 !== c ? a.insertChild(c, b) : a.appendChild(b), a.getChildAt(c).on("move", this.onChildMove, this))
	},
	removeLayerNode: function(a,
		b) {
		if (!0 === this.filter(b)) {
			var c = a.findChildBy(function(a) {
				return a.get("layer") == b.getLayer()
			});
			c && (c.un("move", this.onChildMove, this), c.remove())
		}
	},
	onChildMove: function(a, b, c, d) {
		a = this.store.getByLayer(a.get("layer"));
		var e = c.get("container"),
			f = e.loader;
		this._reordering = !0;
		if (f instanceof this.self && this.store === f.store) {
			f._reordering = !0;
			this.store.remove(a);
			var g;
			if (1 < c.childNodes.length) {
				var h = 0 === d ? d + 1 : d - 1;
				g = this.store.findBy(function(a) {
					return c.childNodes[h].get("layer") === a.getLayer()
				});
				0 ===
					d && g++
			} else if (b.parentNode === c.parentNode) {
				var j = c;
				do j = j.previousSibling; while (j && !(j.get("container") instanceof e.self && j.lastChild));
				if (j) g = this.store.findBy(function(a) {
					return j.lastChild.get("layer") === a.getLayer()
				});
				else {
					var k = c;
					do k = k.nextSibling; while (k && !(k.get("container") instanceof e.self && k.firstChild));
					k && (g = this.store.findBy(function(a) {
						return k.firstChild.get("layer") === a.getLayer()
					}));
					g++
				}
			}
			void 0 !== g ? this.store.insert(g, [a]) : this.store.insert(oldRecordIndex, [a]);
			delete f._reordering
		}
		delete this._reordering
	},
	addStoreHandlers: function(a) {
		if (!this._storeHandlers) {
			this._storeHandlers = {
				add: function(b, d, e) {
					this.onStoreAdd(b, d, e, a)
				},
				remove: function(b, d) {
					this.onStoreRemove(d, a)
				}
			};
			for (var b in this._storeHandlers) this.store.on(b, this._storeHandlers[b], this)
		}
	},
	removeStoreHandlers: function() {
		if (this._storeHandlers) {
			for (var a in this._storeHandlers) this.store.un(a, this._storeHandlers[a], this);
			delete this._storeHandlers
		}
	},
	createNode: function(a) {
		this.baseAttrs && Ext.apply(a, this.baseAttrs);
		return a
	},
	destroy: function() {
		this.removeStoreHandlers()
	}
});
Ext.define("GeoExt.tree.LayerContainer", {
	extend: Ext.AbstractPlugin,
	alias: "plugin.gx_layercontainer",
	defaultText: "Layers",
	init: function(a) {
		var b = this.loader;
		this.loader = b && b instanceof GeoExt.tree.LayerLoader ? b : new GeoExt.tree.LayerLoader(b);
		a.set("container", this);
		a.get("text") || (a.set("text", this.defaultText), a.commit());
		this.loader.load(a)
	},
	recordIndexToNodeIndex: function(a, b) {
		for (var c = this.loader.store, d = c.getCount(), e = b.childNodes.length, f = -1, d = d - 1; 0 <= d && !(!0 === this.loader.filter(c.getAt(d)) &&
				(++f, a === d || f > e - 1)); --d);
		return f
	}
});
Ext.define("GeoExt.tree.BaseLayerContainer", {
	extend: GeoExt.tree.LayerContainer,
	alias: "plugin.gx_baselayercontainer",
	defaultText: "Base Layers",
	init: function(a) {
		var b = this.loader;
		this.loader = Ext.applyIf(b || {}, {
			baseAttrs: Ext.applyIf(b && b.baseAttrs || {}, {
				iconCls: "gx-tree-baselayer-icon",
				checkedGroup: "baselayer"
			}),
			filter: function(a) {
				a = a.getLayer();
				return !0 === a.displayInLayerSwitcher && !0 === a.isBaseLayer
			}
		});
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.tree.Column", {
	extend: Ext.tree.Column,
	alias: "widget.gx_treecolumn",
	initComponent: function() {
		this.callParent();
		var a = this.renderer;
		this.renderer = function(b, c, d, e, f, g, h) {
			b = [a.call(this, b, c, d, e, f, g, h)];
			d.get("checkedGroup") && (b[0] = b[0].replace(/class="([^-]+)-tree-checkbox([^"]+)?"/, 'class\x3d"$1-tree-checkbox$2 gx-tree-radio"'));
			b.push('\x3cdiv class\x3d"gx-tree-component gx-tree-component-off" id\x3d"tree-record-' + d.id + '"\x3e\x3c/div\x3e');
			return b.join("")
		}
	},
	defaultRenderer: function(a) {
		return a
	}
});
Ext.define("GeoExt.tree.OverlayLayerContainer", {
	extend: GeoExt.tree.LayerContainer,
	alias: "plugin.gx_overlaylayercontainer",
	defaultText: "Overlays",
	init: function(a) {
		this.loader = Ext.applyIf(this.loader || {}, {
			filter: function(a) {
				a = a.getLayer();
				return a.displayInLayerSwitcher && !a.isBaseLayer
			}
		});
		this.callParent(arguments)
	}
});
Ext.define("GeoExt.tree.View", {
	extend: Ext.tree.View,
	alias: "widget.gx_treeview",
	initComponent: function() {
		this.on("itemupdate", this.onItem, this);
		this.on("itemadd", this.onItem, this);
		this.on("createchild", this.createChild, this);
		return this.callParent(arguments)
	},
	onItem: function(a) {
		a instanceof Array || (a = [a]);
		for (var b = 0; b < a.length; b++) this.onNodeRendered(a[b])
	},
	onNodeRendered: function(a) {
		var b = this,
			c = Ext.get("tree-record-" + a.id);
		c && (a.get("layer") && b.fireEvent("createchild", c, a), a.hasChildNodes() && a.eachChild(function(a) {
				b.onNodeRendered(a)
			},
			b))
	},
	createChild: function(a, b) {
		var c = b.get("component"),
			d = b.get("checked");
		c && (c = Ext.ComponentManager.create(c), c.xtype && (b.gx_treecomponents && b.gx_treecomponents[c.xtype]) && (b.gx_treecomponents[c.xtype].destroy(), delete b.gx_treecomponents[c.xtype]), b.gx_treecomponents || (b.gx_treecomponents = {}), b.gx_treecomponents[c.xtype] = c, !1 !== d && c.render(a), a.removeCls("gx-tree-component-off"))
	}
});
Ext.define("GeoExt.tree.Panel", {
	extend: Ext.tree.Panel,
	alias: "widget.gx_treepanel",
	viewType: "gx_treeview",
	initComponent: function() {
		this.columns || (void 0 === this.initialConfig.hideHeaders && (this.hideHeaders = !0), this.addCls(Ext.baseCSSPrefix + "autowidth-table"), this.columns = [{
			xtype: "gx_treecolumn",
			text: "Name",
			width: Ext.isIE6 ? null : 1E4,
			dataIndex: this.displayField
		}]);
		this.callParent()
	}
});
Ext.define("GeoExt.window.Popup", {
	extend: Ext.window.Window,
	alias: "widget.gx_popup",
	alternateClassName: "GeoExt.Popup",
	insideViewport: null,
	animCollapse: !1,
	draggable: !1,
	shadow: !1,
	unpinnable: !0,
	map: null,
	anchored: !0,
	panIn: !0,
	location: null,
	popupCls: "gx-popup",
	ancCls: null,
	anchorPosition: "auto",
	initComponent: function() {
		this.map instanceof GeoExt.panel.Map && (this.map = this.map.map);
		!this.map && (this.location instanceof OpenLayers.Feature.Vector && this.location.layer) && (this.map = this.location.layer.map);
		this.location instanceof
		OpenLayers.Feature.Vector && (this.location = this.location.geometry);
		this.location instanceof OpenLayers.Geometry ? ("function" == typeof this.location.getCentroid && (this.location = this.location.getCentroid()), this.location = this.location.getBounds().getCenterLonLat()) : this.location instanceof OpenLayers.Pixel ? this.location = this.map.getLonLatFromViewPortPx(this.location) : this.anchored = !1;
		var a = this.map.getExtent();
		a && this.location && (this.insideViewport = a.containsLonLat(this.location));
		this.anchored && this.addAnchorEvents();
		this.elements += ",anc";
		this.callParent(arguments)
	},
	onRender: function(a, b) {
		this.callParent(arguments);
		this.addCls(this.popupCls);
		this.ancCls = this.popupCls + "-anc";
		var c = Ext.core.DomHelper.append(this.el.dom, {
			tag: "div",
			cls: this.ancCls
		});
		this.anc = Ext.get(c)
	},
	initTools: function() {
		this.unpinnable && (this.tools || (this.tools = []), this.tools.push({
			type: "unpin",
			handler: Ext.bind(this.unanchorPopup, this, [])
		}));
		this.callParent(arguments)
	},
	show: function() {
		this.callParent(arguments);
		this.anchored && (this.position(),
			this.panIn && !this._mapMove && this.panIntoView())
	},
	maximize: function() {
		!this.maximized && this.anc && this.unanchorPopup();
		this.callParent(arguments)
	},
	setSize: function(a, b) {
		if (this.anc) {
			var c = this.anc.getSize();
			"object" == typeof a ? (b = a.height - c.height, a = a.width) : isNaN(b) || (b -= c.height)
		}
		this.callParent([a, b])
	},
	position: function() {
		!0 === this._mapMove && (this.insideViewport = this.map.getExtent().containsLonLat(this.location), this.insideViewport !== this.isVisible() && this.setVisible(this.insideViewport));
		if (this.isVisible()) {
			var a =
				this.map.getPixelFromLonLat(this.location),
				b = Ext.fly(this.map.div).getBox(!0),
				c = a.y + b.y,
				d = a.x + b.x,
				e = this.el.getSize(),
				f = this.anc.getSize(),
				g = this.anchorPosition;
			if (-1 < g.indexOf("right") || a.x > b.width / 2) {
				this.anc.addCls("right");
				var h = this.el.getX(!0) + e.width - this.anc.getX(!0) - f.width,
					d = d - (e.width - h - f.width / 2)
			} else this.anc.removeCls("right"), h = this.anc.getLeft(!0), d -= h + f.width / 2; - 1 < g.indexOf("bottom") || a.y > b.height / 2 ? (this.anc.removeCls("top"), a = this.getHeight(), !1 === isNaN(a) && this.anc.setTop(a - 1 +
				"px"), c -= e.height + f.height) : (this.anc.addCls("top"), this.anc.setTop(""), c += f.height);
			this.setPosition(d, c)
		}
	},
	unanchorPopup: function() {
		this.removeAnchorEvents();
		this.draggable = !0;
		this.header.addCls("x-window-header-draggable");
		var a = "#" + Ext.escapeId(this.header.id),
			a = Ext.applyIf({
				el: this.el,
				delegate: a,
				constrain: this.constrain,
				constrainDelegate: this.constrainHeader ? a : !1,
				constrainTo: this.constrainTo
			}, this.draggable);
		this.dd = new Ext.util.ComponentDragger(this, a);
		this.anc.remove();
		this.anc = null;
		this.tools.unpin.hide()
	},
	panIntoView: function() {
		var a = Ext.fly(this.map.div).getBox(!0),
			b = this.getPosition(!0);
		b[0] -= a.x;
		b[1] -= a.y;
		var a = [a.width, a.height],
			c = this.getSize(),
			d = [b[0], b[1]],
			e = this.map.paddingForPopups;
		b[0] < e.left ? d[0] = e.left : b[0] + c.width > a[0] - e.right && (d[0] = a[0] - e.right - c.width);
		b[1] < e.top ? d[1] = e.top : b[1] + c.height > a[1] - e.bottom && (d[1] = a[1] - e.bottom - c.height);
		this.map.pan(b[0] - d[0], b[1] - d[1])
	},
	onMapMove: function() {
		if (!this.hidden || !this.insideViewport) this._mapMove = !0, this.position(), delete this._mapMove
	},
	addAnchorEvents: function() {
		this.map.events.on({
			move: this.onMapMove,
			scope: this
		});
		this.on({
			resize: this.position,
			scope: this
		})
	},
	removeAnchorEvents: function() {
		this.map.events.un({
			move: this.onMapMove,
			scope: this
		});
		this.un("resize", this.position, this)
	},
	beforeDestroy: function() {
		this.anchored && this.removeAnchorEvents();
		this.callParent(arguments)
	}
});