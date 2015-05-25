Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.LineSymbolizer", {
	extend: "Ext.Panel",
	alias: "widget.styler_linesymbolizer",
	symbolizer: null,
	initComponent: function() {
		this.items = [{
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
		TolomeoExt.Styler.LineSymbolizer.superclass.initComponent.call(this);
	}
});
