Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.FillSymbolizer", {
	extend: "Ext.FormPanel",
	alias: "widget.styler_fillsymbolizer",
	symbolizer: null,
	colorManager: null,
	checkboxToggle: true,
	defaultColor: null,
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
			title: "Riempimento",
			autoHeight: true,
			checkboxToggle: this.checkboxToggle,
			collapsed: this.checkboxToggle === true && this.symbolizer.fill === false,
			hideMode: "offsets",
			defaults: {
				width: 200
			},
			items: [{
				xtype: "styler_colorfield",
				fieldLabel: "Colore",
				name: "color",
				emptyText: TolomeoExt.Styler.Renderer.DefaultSymbolizer.fillColor,
				value: this.symbolizer.fillColor || this.defaultColor || TolomeoExt.Styler.Renderer.DefaultSymbolizer.fillColor,
				defaultBackground: this.defaultColor || TolomeoExt.Styler.Renderer.DefaultSymbolizer.fillColor,
				plugins: colorFieldPlugins,
				listeners: {
					change: function(field, newValue, oldValue) {
						this.symbolizer.fillColor = newValue;
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				xtype: "slider",
				fieldLabel: "Opacit&agrave;",
				name: "opacity",
				values: [
					(("fillOpacity" in this.symbolizer) ? this.symbolizer.fillOpacity : TolomeoExt.Styler.Renderer.DefaultSymbolizer.fillOpacity) * 100
				],
				isFormField: true,
				listeners: {
					changecomplete: function(slider, value) {
						this.symbolizer.fillOpacity = value / 100;
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
					if (this.symbolizer.fill !== false) {
						this.symbolizer.fill = false;
						this.fireEvent("change", this.symbolizer);
					}
				},
				"expand": function() {
					this.symbolizer.fill = true;
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			}
		}];
		this.addEvents("change");
		TolomeoExt.Styler.FillSymbolizer.superclass.initComponent.call(this);
	}
});
