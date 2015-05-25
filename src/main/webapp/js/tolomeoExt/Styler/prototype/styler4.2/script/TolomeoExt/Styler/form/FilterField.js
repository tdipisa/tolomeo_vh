Ext.namespace("TolomeoExt.Styler.form");

Ext.define("TolomeoExt.Styler.form.FilterField", {
	extend: "Ext.form.FieldContainer",
	alias: "widget.styler_filterfield",
	filter: null,
	attributes: null,
	attributesComboConfig: null,
	initComponent: function() {
		if (!this.filter) {
			this.filter = this.createDefaultFilter();
		}
		if (!this.attributes) {
			this.attributes = new GeoExt.data.AttributeStore();
		}
		var defAttributesComboConfig = {
			xtype: "combo",
			store: this.attributes,
			editable: false,
			triggerAction: "all",
			allowBlank: false,
			displayField: "name",
			valueField: "name",
			value: this.filter.property,
			queryMode: "local",
			listeners: {
				select: function(combo, record) {
					this.filter.property = record[0].get("name");
					this.fireEvent("change", this.filter);
				},
				scope: this
			},
			width: 120
		};
		this.attributesComboConfig = this.attributesComboConfig || {};
		Ext.applyIf(this.attributesComboConfig, defAttributesComboConfig);
		this.items = this.createFilterItems();
		this.addEvents("change");
		TolomeoExt.Styler.form.FilterField.superclass.initComponent.call(this);
	},
	createDefaultFilter: function() {
		return new OpenLayers.Filter.Comparison();
	},
	createFilterItems: function() {
		return [this.attributesComboConfig, {
			xtype: "styler_comparisoncombo",
			value: this.filter.type,
			listeners: {
				select: function(combo, record) {
					this.filter.type = record[0].get("value");
					this.fireEvent("change", this.filter);
				},
				scope: this
			}
		}, {
			xtype: "textfield",
			value: this.filter.value,
			width: 50,
			grow: true,
			growMin: 50,
			anchor: "100%",
			allowBlank: false,
			listeners: {
				change: function(el, value) {
					this.filter.value = value;
					this.fireEvent("change", this.filter);
				},
				scope: this
			}
		}];
	}
});
