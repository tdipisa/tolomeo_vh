Ext.namespace("TolomeoExt.Styler.form");

Ext.define("TolomeoExt.Styler.form.FontComboBox", {
	extend: "Ext.form.ComboBox",
	alias: "widget.styler_fontcombo",
	fonts: ["Serif", "SansSerif", "Arial", "Courier New", "Tahoma", "Times New Roman", "Verdana"],
	defaultFont: "Serif",
	allowBlank: false,
	mode: "local",
	triggerAction: "all",
	editable: false,
	initComponent: function() {
		var fonts = this.fonts || TolomeoExt.Styler.form.FontComboBox.prototype.fonts;
		var defaultFont = this.defaultFont;
		if (fonts.indexOf(this.defaultFont) === -1) {
			defaultFont = fonts[0];
		}
		var defConfig = {
			displayField: "field1",
			valueField: "field1",
			store: fonts,
			value: defaultFont,
			tpl: new Ext.XTemplate('<tpl for=".">' + '<div class="x-combo-list-item">' + '<span style="font-family: {field1};">{field1}</span>' + '</div></tpl>')
		};
		Ext.applyIf(this, defConfig);
		TolomeoExt.Styler.form.FontComboBox.superclass.initComponent.call(this);
	}
});
