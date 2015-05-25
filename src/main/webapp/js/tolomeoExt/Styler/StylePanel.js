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
	
	layout: 'border',
  	style: null,
  	rulesPanel: null,
  	selectedRule: null,
  	selectedRuleIndex: null,
  	selectedRulePanel: null,
  	mapPanel: null,
  	
  	
  	/** 
	 * Property: TOLOMEOServer
	 * {String}
	 */
	TOLOMEOServer: null,
	
	/** 
	 * Property: TOLOMEOStaticRoot
	 * {String}
	 */
	TOLOMEOStaticRoot: null,

	/** 
	 * Property: TOLOMEOContext
	 * {String}
	 */
	TOLOMEOContext: null,
  
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

		// Applico i default
		TolomeoExt.Vars.ApplyIfDefaults(this);
		var me = this;
		
  		this.addEvents("stylecanceled", "stylesaved", "ruleselected", "ruleadded", "ruleremoved");
  		
  		var headPanel = Ext.create('Ext.Panel', {
  			region: 'north',
  			layout: 'form',
  			defaults: {
		  				style: {
							"padding": "0.3em 0 0 1em",
							"padding-left": "10px" 
						},
						labelWidth: 70
  					},
  			items: [{
				xtype: "textfield",
				fieldLabel: "Nome",
				//value: this.symbolizer.fontSize || TolomeoExt.Styler.Renderer.DefaultSymbolizer.fontSize,
				width: 100
			},{	
				xtype: "textfield",
				fieldLabel: "Titolo",
				//value: this.symbolizer.fontSize || TolomeoExt.Styler.Renderer.DefaultSymbolizer.fontSize,
				width: 100
			},{	
				xtype: "textfield",
				fieldLabel: "Descrizione",
				//value: this.symbolizer.fontSize || TolomeoExt.Styler.Renderer.DefaultSymbolizer.fontSize,
				width: 100
			}]
  		});
  		
		var rulesStoreData = {
			items: []
		};
		if (this.style != null) {
			for (var ruleIndex = 0 ; ruleIndex < this.style.rules.length ; ruleIndex ++) {
				var rule = this.style.rules[ruleIndex];
				rulesStoreData.items[ruleIndex] = {
					name: rule.title,
					//symbol: 'Available',
						/*
						Ext.create("TolomeoExt.Styler.FeatureRenderer", {
						symbolType: this.getSymbolTypeFromRule(rule),
						symbolizers: rule.symbolizers
					})*/
					rule: rule
				};
			}
		}
		var rulesStore = Ext.create("Ext.data.Store", {
			storeId: "rulesStore",
			fields: ["name", "symbol", "rule"],
			data: rulesStoreData,
			autoSync: true,
			proxy: {
				type: "memory",
				reader: {
				  type: "json",
				  root: "items"
				}
			}
		});
		rulesStore.on('add', 
				function(store, records, index, eOpts ) {
					this.rulesPanel.getSelectionModel().select(index);
				}, this);
		
		this.rulesPanel = Ext.create("Ext.grid.Panel", {
			title: "Regole",
			region: 'west',
			split: true,
			store: Ext.data.StoreManager.lookup("rulesStore"),
			columns: [
				{
					text: "Nome",
					dataIndex: "name",
					width: 99
				}
				// Commentato in attesa di risolvere problema
				// FeatureRenderer estende Ext.form.FieldContainer che ha elemento bodyEl 
				// che viene valorizzato solo dopo il rendering, ma questo sembra andare in conflitto con 
				// l'uso in questo contesto
				/*,
				{
					text: "Simbolo",
					dataIndex: "rule",
					xtype: 'componentcolumn', 
		            renderer: function(rule, meta, record) {
		            	return  {
		            		xtype: 'styler_featurerenderer',
		            		symbolType: me.getSymbolTypeFromRule(rule),
							symbolizers: rule.symbolizers//,
							//width: 10,
							//height: 10
		            	};
		            },
					width: 50
				}*/
			],
			height: 200,
			width: 200,
			bbar: [
				{
					text: "Aggiungi",
					iconCls: "add",
					handler: function() {
						//var Type = OpenLayers.Symbolizer[this.getSymbolTypeFromRule(this.selectedRule)];
						//var Type = OpenLayers.Symbolizer["Point"];
						
						//TODO Parametrizzare in funzione del tipo di layer
						var s = new OpenLayers.Symbolizer.Point({
							pointRadius: 3,
							fillColor: '#FF0000',
							graphicName: 'circle'
						});
						
						var rule = new OpenLayers.Rule({
							title: "Nuova regola",
							symbolizers: [s]
						});
						if (this.style == null) {
							this.style = new OpenLayers.Style();
						}
						this.style.rules.push(rule);
						Ext.data.StoreManager.lookup("rulesStore").add({
							name: rule.title/*,
							symbol: Ext.create("TolomeoExt.Styler.FeatureRenderer", {
								symbolType: this.getSymbolTypeFromRule(rule),
								symbolizers: rule.symbolizers
							})*/,
							rule: rule
						});
						
						//this.showRule(rule);
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
				this.selectedRuleRecord = record;
				this.getDeleteRuleButton().enable();
				this.showRule(this.selectedRule);
				this.fireEvent("ruleselected", this.selectedRule);
			},
			scope: this
		});
		this.selectedRulePanel = Ext.create("Ext.Panel", {
			title: "Regola",
			region: 'center',
			width: 300
		});
		this.items = [
		    headPanel,
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
		this.callParent();
	},
	
	showRule: function(rule) {
		this.selectedRulePanel.removeAll();
		this.selectedRulePanel.setTitle("Regola \"" + rule.title + "\"");
		var rulePanel = Ext.create("TolomeoExt.Styler.RulePanel", {
			autoHeight: false,
			autoScroll: true,
			rule: rule,
			nestedFilters: false,
			scaleLevels: (this.mapPanel) ? this.mapPanel.map.baseLayer.numZoomLevels : undefined,
			minScaleDenominatorLimit: (this.mapPanel) ? OpenLayers.Util.getScaleFromResolution(this.mapPanel.map.baseLayer.resolutions[this.mapPanel.map.baseLayer.numZoomLevels - 1], this.mapPanel.map.units) : undefined,
			maxScaleDenominatorLimit: (this.mapPanel) ? OpenLayers.Util.getScaleFromResolution(this.mapPanel.map.baseLayer.resolutions[0], this.mapPanel.map.units) : undefined,
			scaleSliderTemplate: "<div>{scaleType} Zoom Level: {zoom}</div>" + "<div>Current Map Zoom: {mapZoom}</div>",
			modifyScaleTipContext: Ext.Function.pass(function(panel, data) {
				if (this.mapPanel) {
					data.mapZoom = this.mapPanel.map.getZoom();
				}
			}, [], this),
			attributes: Ext.create("Ext.data.Store", {
				model: "Field",
				data : [{
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
			pointGraphics: [{
					display: "circle",
					value: "circle",
					mark: true,
					preview: this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/styler/circle.gif'
				},{
					display: "square",
					value: "square",
					mark: true,
					preview: this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/styler/square.gif'
				},{
					display: "triangle",
					value: "triangle",
					mark: true,
					preview: this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/styler/triangle.gif'
				},{
					display: "star",
					value: "star",
					mark: true,
					preview: this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/styler/star.gif'
				},{
					display: "cross",
					value: "cross",
					mark: true,
					preview: this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/styler/cross.gif'
				},{
					display: "x",
					value: "x",
					mark: true,
					preview: this.TOLOMEOServer + this.TOLOMEOStaticRoot + '/img/styler/x.gif'
				},{
					display: "custom..."
				}
			]
		});
		rulePanel.on('change', 
				function(rulePanel, rule) {
								if (this.selectedRuleRecord) {
									this.selectedRuleRecord.set('name', rule.title)
								}
							}, this);
		this.selectedRulePanel.add(rulePanel);
	},
	
	getAddRuleButton: function() {
		return this.rulesPanel.getDockedItems()[2].getComponent(0);
	},
	
	getDeleteRuleButton: function() {
		return this.rulesPanel.getDockedItems()[2].getComponent(1);
	}
});
