Ext.namespace("TolomeoExt.Styler");

Ext.define("TolomeoExt.Styler.RulePanel", {
	extend: "Ext.TabPanel",
	alias: "widget.styler_rulepanel",
	fonts: undefined,
	symbolType: "Point",
	rule: null,
	attributes: null,
	nestedFilters: true,
	minScaleDenominatorLimit: Math.pow(0.5, 19) * 40075016.68 * 39.3701 * OpenLayers.DOTS_PER_INCH / 256,
	maxScaleDenominatorLimit: 40075016.68 * 39.3701 * OpenLayers.DOTS_PER_INCH / 256,
	scaleLevels: 20,
	scaleSliderTemplate: "{scaleType} Scale 1:{scale}",
	modifyScaleTipContext: Ext.emptyFn,
	
	initComponent: function() {
		
		this.addEvents('change');
	/*
		this.addEvents('save');
		this.addEvents('cancel');
		
		this.buttons = ["->", {
						text: "Annulla",
						iconCls: "cancel",
						handler: function() {
							this.fireEvent('cancel');
						},
						scope: this
					}, {
						text: "Salva",
						iconCls: "save",
						handler: function() {
							this.fireEvent('save', this.rule);
							//this.close();
							//this.ruleDialog.disable();
							//this.updateRule(rule, newRule);
							//this.ruleDialog.close();
			//				this.sldManager.saveSld(layer, function() {
			//					this.ruleDialog.close();
			//					this.repaint();
			//					this.saving = false;
			//				}, this);
						},
						scope: this
					}];
		
		*/
		var defConfig = {
			plain: true,
			border: false
		};
		Ext.applyIf(this, defConfig);
		if (!this.rule) {
			this.rule = new OpenLayers.Rule({
				name: this.uniqueRuleName()
			});
		} else {
			if (!this.initialConfig.symbolType) {
				this.symbolType = this.getSymbolTypeFromRule(this.rule) || this.symbolType;
			}
		}
		this.activeTab = 0;
		this.textSymbolizer = Ext.create("TolomeoExt.Styler.TextSymbolizer", {
			symbolizer: this.getTextSymbolizer(),
			attributes: this.attributes,
			fonts: this.fonts,
			listeners: {
				change: function(symbolizer) {
					this.fireEvent("change", this, this.rule);
				},
				scope: this
			}
		});
		this.scaleLimitPanel = Ext.create("TolomeoExt.Styler.ScaleLimitPanel", {
			maxScaleDenominator: this.rule.maxScaleDenominator || undefined,
			limitMaxScaleDenominator: !!this.rule.maxScaleDenominator,
			maxScaleDenominatorLimit: this.maxScaleDenominatorLimit,
			minScaleDenominator: this.rule.minScaleDenominator || undefined,
			limitMinScaleDenominator: !!this.rule.minScaleDenominator,
			minScaleDenominatorLimit: this.minScaleDenominatorLimit,
			scaleLevels: this.scaleLevels,
			scaleSliderTemplate: this.scaleSliderTemplate,
			modifyScaleTipContext: this.modifyScaleTipContext,
			listeners: {
				change: function(comp, min, max) {
					this.rule.minScaleDenominator = min;
					this.rule.maxScaleDenominator = max;
					this.fireEvent("change", this, this.rule);
				},
				scope: this
			}
		});
		this.filterBuilder = Ext.create("TolomeoExt.Styler.FilterBuilder", {
			allowGroups: this.nestedFilters,
			filter: this.rule && this.rule.filter && this.rule.filter.clone(),
			attributes: this.attributes,
			listeners: {
				change: function(builder) {
					var filter = builder.getFilter();
					this.rule.filter = filter;
					this.fireEvent("change", this, this.rule)
				},
				scope: this
			}
		});
		this.items = [{
			title: "Etichette",
			autoScroll: true,
			bodyStyle: {
				"padding": "10px"
			},
			items: [{
				xtype: "fieldset",
				title: "Caratteristiche Etichetta",
				autoHeight: true,
				checkboxToggle: true,
				collapsed: !this.hasTextSymbolizer(),
				items: [this.textSymbolizer],
				listeners: {
					collapse: function() {
						OpenLayers.Util.removeItem(this.rule.symbolizers, this.getTextSymbolizer());
						this.fireEvent("change", this, this.rule);
					},
					expand: function() {
						this.setTextSymbolizer(this.textSymbolizer.symbolizer);
						this.fireEvent("change", this, this.rule);
					},
					scope: this
				}
			}]
		}];
		if (this.getSymbolTypeFromRule(this.rule) || this.symbolType) {
			this.items = [{
				title: "Base",
				autoScroll: true,
				items: [
					this.createHeaderPanel(),
					this.createSymbolizerPanel()
				]
			}, this.items[0], {
				title: "Avanzato",
				defaults: {
					style: {
						margin: "7px"
					}
				},
				autoScroll: true,
				items: [{
					xtype: "fieldset",
					title: "Limite per Scala",
					checkboxToggle: true,
					collapsed: !(this.rule && (this.rule.minScaleDenominator || this.rule.maxScaleDenominator)),
					autoHeight: true,
					items: [this.scaleLimitPanel],
					listeners: {
						collapse: function() {
							delete this.rule.minScaleDenominator;
							delete this.rule.maxScaleDenominator;
							this.fireEvent("change", this, this.rule)
						},
						expand: function() {
							var tab = this.getActiveTab();
							this.activeTab = null;
							this.setActiveTab(tab);
							var changed = false;
							if (this.scaleLimitPanel.limitMinScaleDenominator) {
								this.rule.minScaleDenominator = this.scaleLimitPanel.minScaleDenominator;
								changed = true;
							}
							if (this.scaleLimitPanel.limitMaxScaleDenominator) {
								this.rule.maxScaleDenominator = this.scaleLimitPanel.maxScaleDenominator;
								changed = true;
							}
							if (changed) {
								this.fireEvent("change", this, this.rule)
							}
						},
						scope: this
					}
				}, {
					xtype: "fieldset",
					title: "Limite per Condizione",
					checkboxToggle: true,
					collapsed: !(this.rule && this.rule.filter),
					autoHeight: true,
					items: [this.filterBuilder],
					listeners: {
						collapse: function() {
							delete this.rule.filter;
							this.fireEvent("change", this, this.rule)
						},
						expand: function() {
							var changed = false;
							this.rule.filter = this.filterBuilder.getFilter();
							this.fireEvent("change", this, this.rule)
						},
						scope: this
					}
				}]
			}]
		}
		this.items[0].autoHeight = true;
		this.addEvents("change");
		this.on({
			tabchange: function(panel, tab) {
				tab.doLayout();
			},
			scope: this
		});
		TolomeoExt.Styler.RulePanel.superclass.initComponent.call(this);
	},
	
	hasTextSymbolizer: function() {
		var candidate, symbolizer;
		for (var i = 0, ii = this.rule.symbolizers.length; i < ii; ++i) {
			candidate = this.rule.symbolizers[i];
			if (candidate instanceof OpenLayers.Symbolizer.Text) {
				symbolizer = candidate;
				break;
			}
		}
		return symbolizer;
	},
	
	getTextSymbolizer: function() {
		var symbolizer = this.hasTextSymbolizer();
		if (!symbolizer) {
			symbolizer = new OpenLayers.Symbolizer.Text();
		}
		return symbolizer;
	},
	
	setTextSymbolizer: function(symbolizer) {
		var found;
		for (var i = 0, ii = this.rule.symbolizers.length; i < ii; ++i) {
			candidate = this.rule.symbolizers[i];
			if (this.rule.symbolizers[i] instanceof OpenLayers.Symbolizer.Text) {
				this.rule.symbolizers[i] = symbolizer;
				found = true;
				break;
			}
		}
		if (!found) {
			this.rule.symbolizers.push(symbolizer);
		}
	},
	
	uniqueRuleName: function() {
		return OpenLayers.Util.createUniqueID("rule_");
	},
	
	createHeaderPanel: function() {
		this.symbolizerSwatch = Ext.create("TolomeoExt.Styler.FeatureRenderer", {
			symbolType: this.symbolType,
			symbolizers: this.rule.symbolizers,
			fieldLabel: "Simbolo",
			labelAlign: "top"
		});
		return {
			xtype: "form",
			border: false,
			labelAlign: "top",
			defaults: {
				border: false
			},
			style: {
				"padding": "0.3em 0 0 1em"
			},
			items: [{
				layout: "column",
				defaults: {
					border: false,
					style: {
						"padding-right": "1em"
					}
				},
				items: [{
					layout: "form",
					width: 150,
					items: [{
						xtype: "textfield",
						fieldLabel: "Nome",
						labelAlign: "top",
						anchor: "95%",
						value: this.rule && (this.rule.title || this.rule.name || ""),
						listeners: {
							change: function(el, value) {
								this.rule.title = value;
								this.fireEvent("change", this, this.rule);
							},
							scope: this
						}
					}]
				}, {
					layout: "form",
					width: 70,
					items: [
						this.symbolizerSwatch
					]
				}]
			}]
		};
	},
	
	createSymbolizerPanel: function() {
		var candidate, symbolizer;
		var Type = OpenLayers.Symbolizer[this.symbolType];
		var existing = false;
		if (Type) {
			for (var i = 0, ii = this.rule.symbolizers.length; i < ii; ++i) {
				candidate = this.rule.symbolizers[i];
				if (candidate instanceof Type) {
					existing = true;
					symbolizer = candidate;
					break;
				}
			}
			if (!symbolizer) {
				symbolizer = Ext.create("Type", {
					fill: false,
					stroke: false
				});
			}
		} else {
			throw new Error("Appropriate symbolizer type not included in build: " + this.symbolType);
		}
		var cfg = {
			xtype: "styler_" + this.symbolType.toLowerCase() + "symbolizer",
			symbolizer: symbolizer,
			bodyStyle: {
				padding: "10px"
			},
			border: false,
			labelWidth: 70,
			defaults: {
				labelWidth: 70
			},
			listeners: {
				change: function(symbolizer) {
					this.symbolizerSwatch.setSymbolizers([symbolizer], {
						draw: this.symbolizerSwatch.rendered
					});
					if (!existing) {
						this.rule.symbolizers.push(symbolizer);
						existing = true;
					}
					this.fireEvent("change", this, this.rule);
				},
				scope: this
			}
		};
		if (this.symbolType === "Point" && this.pointGraphics) {
			cfg.pointGraphics = this.pointGraphics;
		}
		return cfg;
	},
	
	getSymbolTypeFromRule: function(rule) {
		var candidate, type;
		for (var i = 0, ii = rule.symbolizers.length; i < ii; ++i) {
			candidate = rule.symbolizers[i];
			if (!(candidate instanceof OpenLayers.Symbolizer.Text)) {
				type = candidate.CLASS_NAME.split(".").pop();
				break;
			}
		}
		return type;
	}
	
});
