Ext.namespace("TolomeoExt.Styler.form");

Ext.define("TolomeoExt.Styler.form.ComparisonComboBox", {
	extend: "Ext.form.ComboBox",
	alias: "widget.styler_comparisoncombo",
	allowedTypes: [
		{value: OpenLayers.Filter.Comparison.EQUAL_TO, name: "="},
		{value: OpenLayers.Filter.Comparison.NOT_EQUAL_TO, name: "<>"},
		{value: OpenLayers.Filter.Comparison.LESS_THAN, name: "<"},
		{value: OpenLayers.Filter.Comparison.GREATER_THAN, name: ">"},
		{value: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO, name: "<="},
		{value: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO, name: ">="},
		{value: OpenLayers.Filter.Comparison.LIKE, name: "like"}
	],
	allowBlank: false,
	queryMode: "local",
	triggerAction: "all",
	width: 50,
	editable: false,
	initComponent: function() {
		var defConfig = {
			displayField: "name",
			valueField: "value",
			store: Ext.create("Ext.data.JsonStore", {
				data: this.allowedTypes,
				fields: ["value", "name"]
			}),
			value: (this.value === undefined) ? this.allowedTypes[0]["value"] : this.value
		};
		Ext.apply(this, defConfig);
		TolomeoExt.Styler.form.ComparisonComboBox.superclass.initComponent.call(this);
	}
});
