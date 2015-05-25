Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.PolygonSymbolizer", {
	extend: "Ext.Panel",
	alias: "widget.styler_polygonsymbolizer",
	symbolizer: null,
	initComponent: function() {
		this.items = [{
			xtype: "styler_fillsymbolizer",
			symbolizer: this.symbolizer,
			listeners: {
				change: function(symbolizer) {
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			}
		}, {
			xtype: "styler_strokesymbolizer",
			symbolizer: this.symbolizer,
			listeners: {
				change: function(symbolizer) {
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			}
		}];
		this.addEvents("change");
		TolomeoExt.Styler.PolygonSymbolizer.superclass.initComponent.call(this);
	}
});
