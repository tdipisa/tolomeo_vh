Ext.namespace("TolomeoExt.Styler");

Ext.define("Field", {
	extend: "Ext.data.Model",
	fields: [{
		name: "name",
		type: "string"
	}]
});

Ext.define("TolomeoExt.Styler.StylePanel", {
	extend: "Ext.Panel",
	alias: "widget.styler_stylepanel",
	layout: {
      type: "hbox",
      align: "stretch"
  },
  style: null,
  rulesPanel: null,
  selectedRule: null,
  selectedRuleIndex: null,
  selectedRulePanel: null,
  mapPanel: null,
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
	},
  initComponent: function() {
  	this.addEvents("stylecanceled", "stylesaved", "ruleselected", "ruleadded", "ruleremoved");
		var rulesStoreData = {
			items: []
		};
		if (this.style != null) {
			for (var ruleIndex = 0 ; ruleIndex < this.style.rules.length ; ruleIndex ++) {
				var rule = this.style.rules[ruleIndex];
				rulesStoreData.items[ruleIndex] = {
					name: rule.title,
					symbol: Ext.create("TolomeoExt.Styler.FeatureRenderer", {
						symbolType: this.getSymbolTypeFromRule(rule),
						symbolizers: rule.symbolizers
					}),
					rule: rule
				};
			}
		}
		var rulesStore = Ext.create("Ext.data.Store", {
			storeId: "rulesStore",
			fields: ["name", "symbol", "rule"],
			data: rulesStoreData,
			proxy: {
				type: "memory",
				reader: {
				  type: "json",
				  root: "items"
				}
			}
		});
		this.rulesPanel = Ext.create("Ext.grid.Panel", {
			title: "Regole",
			store: Ext.data.StoreManager.lookup("rulesStore"),
			columns: [
				{
					text: "Nome",
					dataIndex: "name",
					width: 99
				},
				{
					text: "Simbolo",
					dataIndex: "symbol",
					width: 99
				}
			],
			height: 200,
			width: 200,
			bbar: [
				{
					text: "Aggiungi",
					iconCls: "add",
					handler: function() {
						//var Type = OpenLayers.Symbolizer[this.getSymbolTypeFromRule(this.selectedRule)];
						var Type = OpenLayers.Symbolizer["Point"];
						var rule = new OpenLayers.Rule({
							title: "Untitled",
							symbolizers: [
								new Type()
							]
						});
						if (this.style == null) {
							this.style = new OpenLayers.Style();
						}
						this.style.rules.push(rule);
						Ext.data.StoreManager.lookup("rulesStore").add({
							name: rule.title,
							symbol: Ext.create("TolomeoExt.Styler.FeatureRenderer", {
								symbolType: this.getSymbolTypeFromRule(rule),
								symbolizers: rule.symbolizers
							}),
							rule: rule
						});
						this.showRule(rule);
						this.fireEvent("ruleadded");
					},
					scope: this
				},
				{
					text: "Rimuovi",
					iconCls: "delete",
					disabled: true,
					handler: function() {
						Ext.Msg.show({
							title: "Rimuovi Regola",
							msg: "Sei sicuro di voler rimuovere la regola \"" + this.selectedRule.title + "\"?",
							width: 300,
							buttons: Ext.Msg.YESNO,
							fn: function(buttonId, text) {
								if (buttonId == "yes") {
									Ext.data.StoreManager.lookup("rulesStore").removeAt(this.selectedRuleIndex);
									this.getDeleteRuleButton().disable();
									this.selectedRulePanel.removeAll();
									this.selectedRulePanel.setTitle("Regola");
									var rules = this.style.rules.splice(this.selectedRuleIndex, 1);
									this.fireEvent("ruleremoved", rules[0]);
								}
							},
							icon: Ext.Msg.QUESTION,
							scope: this
						});
					},
					scope: this
				}
			]
		});
		this.rulesPanel.on({
			select: function(rulesPanel, record, index) {
				this.selectedRule = record.get("rule");
				this.selectedRuleIndex = index;
				this.getDeleteRuleButton().enable();
				this.showRule(this.selectedRule);
				this.fireEvent("ruleselected", this.selectedRule);
			},
			scope: this
		});
		this.selectedRulePanel = Ext.create("Ext.Panel", {
			title: "Regola",
			width: 300
		});
		this.items = [
			this.rulesPanel,
			this.selectedRulePanel
		];
		this.bbar = [
			"->",
			{
				text: "Annulla",
				iconCls: "cancel",
				handler: function() {
					this.fireEvent("stylecanceled");
				},
				scope: this
			},
			{
				text: "Salva",
				iconCls: "save",
				handler: function() {
					this.fireEvent("stylesaved", this.style);
				},
				scope: this
			}
		];
		TolomeoExt.Styler.StylePanel.superclass.initComponent.call(this);
	},
	showRule: function(rule) {
		this.selectedRulePanel.removeAll();
		this.selectedRulePanel.setTitle("Regola \"" + rule.title + "\"");
		var rulePanel = Ext.create("TolomeoExt.Styler.RulePanel", {
			autoHeight: false,
			autoScroll: true,
			rule: rule,
			nestedFilters: false,
			scaleLevels: this.mapPanel.map.baseLayer.numZoomLevels,
			minScaleDenominatorLimit: OpenLayers.Util.getScaleFromResolution(this.mapPanel.map.baseLayer.resolutions[this.mapPanel.map.baseLayer.numZoomLevels - 1], this.mapPanel.map.units),
			maxScaleDenominatorLimit: OpenLayers.Util.getScaleFromResolution(this.mapPanel.map.baseLayer.resolutions[0], this.mapPanel.map.units),
			scaleSliderTemplate: "<div>{scaleType} Zoom Level: {zoom}</div>" + "<div>Current Map Zoom: {mapZoom}</div>",
			modifyScaleTipContext: Ext.Function.pass(function(panel, data) {
				data.mapZoom = this.mapPanel.map.getZoom();
			}, [], this),
			attributes: Ext.create("Ext.data.Store", {
				model: "Field",
				data : [
					{
						name: "pippo"
					},
					{
						name: "pluto"
					},
					{
						name: "paperino"
					},
					{
						name: "cat"
					},
					{
						name: "str1"
					}
				]
			}),
			pointGraphics: [
				{
					display: "circle",
					value: "circle",
					mark: true,
					preview: "theme/img/circle.gif"
				},
				{
					display: "square",
					value: "square",
					mark: true,
					preview: "theme/img/square.gif"
				},
				{
					display: "triangle",
					value: "triangle",
					mark: true,
					preview: "theme/img/triangle.gif"
				},
				{
					display: "star",
					value: "star",
					mark: true,
					preview: "theme/img/star.gif"
				},
				{
					display: "cross",
					value: "cross",
					mark: true,
					preview: "theme/img/cross.gif"
				},
				{
					display: "x",
					value: "x",
					mark: true,
					preview: "theme/img/x.gif"
				},
				{
					display: "custom..."
				}
			]
		});
		this.selectedRulePanel.add(rulePanel);
	},
	getAddRuleButton: function() {
		return this.rulesPanel.getDockedItems()[2].getComponent(0);
	},
	getDeleteRuleButton: function() {
		return this.rulesPanel.getDockedItems()[2].getComponent(1);
	}
});
