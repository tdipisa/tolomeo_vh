Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.TextSymbolizer", {
	extend: "Ext.Panel",
	alias: "widget.styler_textsymbolizer",
	fonts: undefined,
	symbolizer: null,
	defaultSymbolizer: null,
	attributes: null,
	colorManager: null,
	haloCache: null,
	border: false,
	layout: "form",
	initComponent: function() {
		if (!this.symbolizer) {
			this.symbolizer = {};
		}
		Ext.applyIf(this.symbolizer, this.defaultSymbolizer);
		this.haloCache = {};
		var defAttributesComboConfig = {
			xtype: "combo",
			fieldLabel: "Valori Etichetta",
			store: this.attributes,
			editable: false,
			triggerAction: "all",
			allowBlank: false,
			displayField: "name",
			valueField: "name",
			queryMode: "local",
			value: this.symbolizer.label && this.symbolizer.label.replace(/^\${(.*)}$/, "$1"),
			listeners: {
				select: function(combo, record) {
					this.symbolizer.label = "${" + record[0].get("name") + "}";
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			},
			width: 120
		};
		this.attributesComboConfig = this.attributesComboConfig || {};
		Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);
		this.labelWidth = 80;
		this.items = [this.attributesComboConfig, {
			cls: "x-html-editor-tb",
			style: "background: transparent; border: none; padding: 0 0em 0.5em;",
			xtype: "toolbar",
			items: [{
				xtype: "styler_fontcombo",
				fonts: this.fonts || undefined,
				width: 110,
				value: this.symbolizer.fontFamily,
				listeners: {
					select: function(combo, record) {
						this.symbolizer.fontFamily = record.get("field1");
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				xtype: "numberfield",
				fieldLabel: "Dimensione",
				labelWidth: 30,
				minValue: 0,
				emptyText: TolomeoExt.Styler.Renderer.DefaultSymbolizer.fontSize,
				value: this.symbolizer.fontSize || TolomeoExt.Styler.Renderer.DefaultSymbolizer.fontSize,
				width: 80,
				listeners: {
					change: function(field, value) {
						value = parseFloat(value);
						if (isNaN(value)) {
							delete this.symbolizer.fontSize;
						} else {
							this.symbolizer.fontSize = value;
						}
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				enableToggle: true,
				cls: "x-btn-icon",
				iconCls: "x-edit-bold",
				pressed: this.symbolizer.fontWeight === "bold",
				listeners: {
					toggle: function(button, pressed) {
						this.symbolizer.fontWeight = pressed ? "bold" : "normal";
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				enableToggle: true,
				cls: "x-btn-icon",
				iconCls: "x-edit-italic",
				pressed: this.symbolizer.fontStyle === "italic",
				listeners: {
					toggle: function(button, pressed) {
						this.symbolizer.fontStyle = pressed ? "italic" : "normal";
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}]
		}, {
			xtype: "styler_fillsymbolizer",
			symbolizer: this.symbolizer,
			defaultColor: TolomeoExt.Styler.Renderer.DefaultSymbolizer.fontColor,
			checkboxToggle: false,
			autoHeight: true,
			labelWidth: 70,
			plugins: this.colorManager && [new this.colorManager()],
			listeners: {
				change: function(symbolizer) {
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			}
		}, {
			xtype: "fieldset",
			title: "Alone",
			checkboxToggle: true,
			collapsed: !(this.symbolizer.haloRadius || this.symbolizer.haloColor || this.symbolizer.haloOpacity),
			autoHeight: true,
			labelWidth: 50,
			items: [{
				xtype: "numberfield",
				fieldLabel: "Size",
				anchor: "89%",
				minValue: 0,
				emptyText: TolomeoExt.Styler.Renderer.DefaultSymbolizer.haloRadius,
				value: this.symbolizer.haloRadius || TolomeoExt.Styler.Renderer.DefaultSymbolizer.haloRadius,
				listeners: {
					change: function(field, value) {
						value = parseFloat(value);
						if (isNaN(value)) {
							delete this.symbolizer.haloRadius;
						} else {
							this.symbolizer.haloRadius = value;
						}
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				xtype: "styler_fillsymbolizer",
				symbolizer: {
					fillColor: ("haloColor" in this.symbolizer) ? this.symbolizer.haloColor : TolomeoExt.Styler.Renderer.DefaultSymbolizer.haloColor,
					fillOpacity: ("haloOpacity" in this.symbolizer) ? this.symbolizer.haloOpacity : TolomeoExt.Styler.Renderer.DefaultSymbolizer.haloOpacity
				},
				defaultColor: TolomeoExt.Styler.Renderer.DefaultSymbolizer.haloColor,
				checkboxToggle: false,
				labelWidth: 60,
				plugins: this.colorManager && [new this.colorManager()],
				listeners: {
					change: function(symbolizer) {
						this.symbolizer.haloColor = symbolizer.fillColor;
						this.symbolizer.haloOpacity = symbolizer.fillOpacity;
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}],
			listeners: {
				collapse: function() {
					this.haloCache = {
						haloRadius: this.symbolizer.haloRadius,
						haloColor: this.symbolizer.haloColor,
						haloOpacity: this.symbolizer.haloOpacity
					};
					delete this.symbolizer.haloRadius;
					delete this.symbolizer.haloColor;
					delete this.symbolizer.haloOpacity;
					this.fireEvent("change", this.symbolizer)
				},
				expand: function() {
					Ext.apply(this.symbolizer, this.haloCache);
					this.doLayout();
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			}
		}];
		this.addEvents("change");
		TolomeoExt.Styler.TextSymbolizer.superclass.initComponent.call(this);
	}
});
