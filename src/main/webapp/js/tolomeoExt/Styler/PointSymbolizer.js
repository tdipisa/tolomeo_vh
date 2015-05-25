Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.PointSymbolizer", {
	extend: "Ext.Panel",
	alias: "widget.styler_pointsymbolizer",
	symbolizer: null,
	pointGraphics: [{
		value: "circle",
		display: "circle",
		preview: "theme/img/circle.gif",
		mark: true
	}, {
		value: "square",
		display: "square",
		preview: "theme/img/square.gif",
		mark: true
	}, {
		value: "triangle",
		display: "triangle",
		preview: "theme/img/triangle.gif",
		mark: true
	}, {
		value: "star",
		display: "star",
		preview: "theme/img/star.gif",
		mark: true
	}, {
		value: "cross",
		display: "cross",
		preview: "theme/img/cross.gif",
		mark: true
	}, {
		value: "x",
		display: "x",
		preview: "theme/img/x.gif",
		mark: true
	}, {
		display: "external"
	}],
	colorManager: null,
	external: null,
	layout: "form",
	initComponent: function() {
		if (!this.symbolizer) {
			this.symbolizer = {};
		}
		this.external = !!this.symbolizer["externalGraphic"];
		this.markPanel = Ext.create("Ext.Panel", {
			border: false,
			collapsed: this.external,
			layout: "form",
			items: [{
				xtype: "styler_fillsymbolizer",
				symbolizer: this.symbolizer,
				labelWidth: this.labelWidth,
				labelAlign: this.labelAlign,
				colorManager: this.colorManager,
				listeners: {
					change: function(symbolizer) {
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}, {
				xtype: "styler_strokesymbolizer",
				symbolizer: this.symbolizer,
				labelWidth: this.labelWidth,
				labelAlign: this.labelAlign,
				colorManager: this.colorManager,
				listeners: {
					change: function(symbolizer) {
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				}
			}]
		});
		this.urlField = Ext.create("Ext.form.TextField", {
			name: "url",
			fieldLabel: "URL",
			value: this.symbolizer["externalGraphic"],
			hidden: true,
			listeners: {
				change: function(field, value) {
					this.symbolizer["externalGraphic"] = value;
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			},
			width: 100
		});
		this.graphicPanel = Ext.create("Ext.Panel", {
			border: false,
			collapsed: !this.external,
			layout: "form",
			items: [this.urlField, {
				xtype: "slider",
				name: "opacity",
				fieldLabel: "Opacit&agrave;",
				values: [
					(this.symbolizer["graphicOpacity"] == null) ? 100 : this.symbolizer["graphicOpacity"] * 100
				],
				isFormField: true,
				listeners: {
					changecomplete: function(slider, value) {
						this.symbolizer["graphicOpacity"] = value / 100;
						this.fireEvent("change", this.symbolizer);
					},
					scope: this
				},
				tipText: function(thumb) {
					return thumb.value + "%";
				},
				width: 100
			}]
		});
		this.items = [{
			xtype: "combo",
			name: "mark",
			fieldLabel: "Simbolo",
			store: Ext.create("Ext.data.JsonStore", {
				data: this.pointGraphics,
				fields: ["value", "display", "preview", {
					name: "mark",
					type: "boolean"
				}]
			}),
			value: this.external ? 0 : this.symbolizer["graphicName"],
			displayField: "display",
			valueField: "value",
			tpl: new Ext.XTemplate(
				'<tpl for=".">',
					'<div class="x-boundlist-item x-combo-list-item gx-pointsymbolizer-mark-item">',
						'<tpl if="preview">',
							'<img src="{preview}" alt="{display}"/>',
						'</tpl>',
						'<span>{display}</span>',
					'</div>',
				'</tpl>'
			),
			queryMode: "local",
			allowBlank: false,
			triggerAction: "all",
			editable: false,
			listeners: {
				select: function(combo, records) {
					var mark = records[0].get("mark");
					var value = records[0].get("value");
					if (!mark) {
						if (value) {
							this.urlField.hide();
							this.urlField.getEl().up('.x-form-item').setDisplayed(false);
							this.symbolizer["externalGraphic"] = value;
						} else {
							this.urlField.show();
							this.urlField.getEl().up('.x-form-item').setDisplayed(true);
						}
						if (!this.external) {
							this.external = true;
							this.updateGraphicDisplay();
						}
					} else {
						if (this.external) {
							this.external = false;
							delete this.symbolizer["externalGraphic"];
							this.updateGraphicDisplay();
						}
						this.symbolizer["graphicName"] = value;
					}
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			},
			width: 100
		}, {
			xtype: "textfield",
			name: "size",
			fieldLabel: "Size",
			value: this.symbolizer["pointRadius"] && this.symbolizer["pointRadius"] * 2,
			listeners: {
				change: function(field, value) {
					this.symbolizer["pointRadius"] = value / 2;
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			},
			width: 100
		}, {
			xtype: "textfield",
			name: "rotation",
			fieldLabel: "Rotazione",
			value: this.symbolizer["rotation"] || TolomeoExt.Styler.Renderer.DefaultSymbolizer.pointRotation,
			listeners: {
				change: function(field, value) {
					this.symbolizer["rotation"] = value;
					this.fireEvent("change", this.symbolizer);
				},
				scope: this
			},
			width: 100
		}, this.markPanel, this.graphicPanel];
		this.addEvents("change");
		TolomeoExt.Styler.PointSymbolizer.superclass.initComponent.call(this);
	},
	updateGraphicDisplay: function() {
		if (this.external) {
			this.markPanel.collapse();
			this.graphicPanel.expand();
		} else {
			this.graphicPanel.collapse();
			this.markPanel.expand();
		}
	}
});
