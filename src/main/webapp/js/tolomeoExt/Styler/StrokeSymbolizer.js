Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.StrokeSymbolizer", {
	extend: "Ext.FormPanel",
	alias: "widget.styler_strokesymbolizer",
	symbolizer: null,
	colorManager: null,
	checkboxToggle: true,
	defaultColor: null,
	dashStyles: [{
		value: "solid",
		display: "solid"
	}, {
		value: "4 4",
		display: "dash"
	},{
		value: "2 4",
		display: "dot"
	}],
	border: false,
	initComponent: function() {
		if (!this.symbolizer) {
			this.symbolizer = {};
		}
		var colorFieldPlugins;
		if (this.colorManager) {
			colorFieldPlugins = [new this.colorManager];
		}
		this.items = [{
			xtype: "fieldset",
			title: "Tratto",
			autoHeight: true,
			checkboxToggle: this.checkboxToggle,
			collapsed: this.checkboxToggle === true && this.symbolizer.stroke === false,
			hideMode: "offsets",
			defaults: {
				width: 200
			},
			items: [{
				xtype: "combo",
				name: "style",
				fieldLabel: "Stile",
				store: Ext.create("Ext.data.JsonStore", {
					data: this.dashStyles,
					fields: ["value", "display"]
				}),
				displayField: "display",
				valueField: "value",
				value: this.getDashArray(this.symbolizer.strokeDashstyle) || TolomeoExt.Styler.Renderer.DefaultSymbolizer.strokeDashstyle,
				queryMode: "local",
				allowBlank: true,
				triggerAction: "all",
				editable: false,
				listeners: {
					select: function(combo, record) {
						this.symbolizer.strokeDashstyle = record[0].get("value");
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				xtype: "styler_colorfield",
				name: "color",
				fieldLabel: "Colore",
				emptyText: TolomeoExt.Styler.Renderer.DefaultSymbolizer.strokeColor,
				value: this.symbolizer.strokeColor || this.defaultColor || TolomeoExt.Styler.Renderer.DefaultSymbolizer.strokeColor,
				defaultBackground: this.defaultColor || TolomeoExt.Styler.Renderer.DefaultSymbolizer.strokeColor,
				plugins: colorFieldPlugins,
				listeners: {
					change: function(field, newValue, oldValue) {
						this.symbolizer.strokeColor = newValue;
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				xtype: "numberfield",
				name: "width",
				fieldLabel: "Spessore",
				minValue: 0,
				emptyText: TolomeoExt.Styler.Renderer.DefaultSymbolizer.strokeWidth,
				value: this.symbolizer.strokeWidth || TolomeoExt.Styler.Renderer.DefaultSymbolizer.strokeWidth,
				listeners: {
					change: function(field, value) {
						value = parseFloat(value);
						if (isNaN(value)) {
							delete this.symbolizer.strokeWidth;
						} else {
							this.symbolizer.strokeWidth = value;
						}
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				xtype: "slider",
				name: "opacity",
				fieldLabel: "Opacit&agrave;",
				values: [
					(("strokeOpacity" in this.symbolizer) ? this.symbolizer.strokeOpacity : TolomeoExt.Styler.Renderer.DefaultSymbolizer.strokeOpacity) * 100
				],
				isFormField: true,
				listeners: {
					changecomplete: function(slider, value) {
						this.symbolizer.strokeOpacity = value / 100;
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				},
				tipText: function(thumb) {
					return thumb.value + "%";
				}
			}],
			listeners: {
				"collapse": function() {
					if (this.symbolizer.stroke !== false) {
						this.symbolizer.stroke = false;
						this.fireEvent("change", this.symbolizer);
					}
				},
				"expand": function() {
					this.symbolizer.stroke = true;
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			}
		}];
		this.addEvents("change");
		TolomeoExt.Styler.StrokeSymbolizer.superclass.initComponent.call(this);
	},
	getDashArray: function(style) {
		var array;
		if (style) {
			var parts = style.split(/\s+/);
			var ratio = parts[0] / parts[1];
			var array;
			if (!isNaN(ratio)) {
				array = ratio >= 1 ? "4 4" : "2 4"
			}
		}
		return array;
	}
});
