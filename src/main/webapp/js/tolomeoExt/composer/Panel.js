/**
* Contenitore di tipo "Pannello".
* Questo contenitore consente l'inserimento all'interno di esso di qualsiasi altro tipo di contenitore (anche tramite l'azione di "clicca, trascina e rilascia") e la modifica di alcune sue propriet&agrave;.
* @xtype tolomeo_panel
*/
Tolomeo.Panel = Ext.extend(Ext.Panel, {
	/**
	* @constructor
	* @member Tolomeo.Panel
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		/**
		* @cfg
		* @member Tolomeo.Panel
		* Indica sel il pannello &egrave; collassabile.
		*/
		this.collapsible = false;
		/**
		* @cfg
		* @member Tolomeo.Panel
		* Indica sel il pannello &egrave; ridimensionabile.
		*/
		this.split = false;
		Tolomeo.Container.prototype.constructor.apply(this, arguments);
		Tolomeo.Panel.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.Panel
		* Identificativo alfanumerico del pannello.
		*/
		this.id = 'panel_' + Tolomeo.Panel.id_count;
		Tolomeo.Panel.id_count ++;
		if (configuration) {
			if (configuration.title == null) {
				/**
				* @cfg
				* @member Tolomeo.Panel
				* Titolo del pannello associato all'oggetto.
				*/
				this.title = this.id;
			}
		}
		this.flex = 1;
		this.layout = 'fit';
		/**
		* @cfg
		* @member Tolomeo.Panel
		* Indica se il pannello pu&ograve; ancora contenere un altro pannello. 
		*/
		this.droppable = false;
		/**
		* @cfg
		* @member Tolomeo.Panel
		* Indica se il pannello &egrave; selezionabile.
		*/
		this.clickable = true;
		/**
		* @cfg
		* @member Tolomeo.Panel
		* Indica se il pannelo &egrave; ausiliario.
		*/
		this.extra = false;
		if (configuration) {
			if (configuration.droppable == true) {
				this.droppable = true;
			}
			if (configuration.clickable == false) {
				this.clickable = false;
			}
			if (configuration.extra == true) {
				this.extra = true;
			}
		}
		/**
		* @event componentadd
		* Evento scatenato quando viene aggiunto un componente al pannello.
		* @param {Object} component Componente aggiunto.
		*/
		this.addEvents('componentadd');
		/**
		* @event propertychange
		* Evento scatenato quando viene modificato una propriet&agrave; del pannello.
		* @param {String} name Nome della propriet&agrave; modificata.
		* @param {Object} value Valore della propriet&agrave; modificata.
		*/
		this.addEvents('propertychange');
		this.on('propertychange', this.setProperty, this);
	},
	/**
	* @method
	* @member Tolomeo.Panel
	* Esegue tutte le operazioni che devono essere eseguite dopo la renderizzazione del contenitore.
	*/
	afterRender: function() {
		Tolomeo.Container.prototype.afterRender.apply(this);
		Tolomeo.Panel.superclass.afterRender.apply(this);
		new Ext.dd.DropTarget(this.body.dom,
			{
				container: this,
				ddGroup: 'containers_dd_group',
				notifyEnter: function(source, event, data) {
					if (this.container.droppable == true) {
						this.container.body.stopFx();
						this.container.body.highlight();
					}
				},
				notifyDrop: function(source, event, data) {
					if (this.container.droppable == true) {
						var position = this.container.getPosition();
						var size = this.container.getSize();
						if ((event.xy[0] >= (position[0] + 1)) && (event.xy[0] <= (position[0] + size.width - 1)) && (event.xy[1] >= (position[1] + 1)) && (event.xy[1] <= (position[1] + size.height - 1))) {
							var component;
							switch (data.node.attributes.xtype) {
								case 'tolomeo_border': {
									component = new Tolomeo.Border();
									break;
								}
								case 'tolomeo_hbox': {
									component = new Tolomeo.HBox();
									break;
								}
								case 'tolomeo_vbox': {
									component = new Tolomeo.VBox();
									break;
								}
								case 'tolomeo_accordion': {
									component = new Tolomeo.Accordion();
									break;
								}
								case 'tolomeo_tab_panel': {
									component = new Tolomeo.TabPanel();
									break;
								}
								case 'tolomeo_button': {
									component = new Tolomeo.Button();
									break;
								}
								case 'tolomeo_map': {
									component = new Tolomeo.TolomeoMap();
									break;
								}
								case 'tolomeo_toolbar': {
									component = new Tolomeo.TolomeoToolbar();
									break;
								}
								case 'tolomeo_TOC_panel': {
									component = new Tolomeo.TolomeoTOCPanel();
									break;
								}
								case 'tolomeo_button_TOC_panel': {
									component = new Tolomeo.TolomeoButtonTOCPanel();
									break;
								}
								case 'tolomeo_tree_TOC_panel': {
									component = new Tolomeo.TolomeoTreeTOCPanel();
									break;
								}
								case 'tolomeo_search_panel': {
									component = new Tolomeo.TolomeoSearchPanel();
									break;
								}
							}
							if (this.container.checkComponent(component)) {
								this.container.droppable = false;
								this.container.add(component);
								this.container.fireEvent('componentadd', component);
							}
						}
					}
				}
			}
		)
	},
	/**
	* @method
	* @member Tolomeo.Panel
	* Imposta il valore di una propriet&agrave; del pannello.
	* @param {String} name Nome della propriet&agrave; modificata.
	* @param {Object} value Valore della propriet&agrave; modificata.
	*/
	setProperty: function(name, value) {
		Tolomeo.Container.prototype.setProperty.apply(this, [name, value]);
		switch (name) {
			case 'title': {
				this.setTitle(value);
				break;
			}
			case 'collapsible': {
				this.collapsible = value;
				break;
			}
			case 'split': {
				this.split = value;
				break;
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.Panel
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Container.prototype.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'title',
				'value': this.title
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'collapsible',
				'value': this.collapsible
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'split',
				'value': this.split
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.Panel
	* Restituisce la rappresentazione JSON del pannello.
	* @return {String} Rappresentazione JSON del pannello.
	*/
	getJSON: function() {
		var JSON = '';
		JSON += '{\n';
		JSON += '\t"xtype": "' + this.getXType() + '",\n';
		JSON += '\t"id": "' + this.id + '",\n';
		if (this.width) {
			JSON += '\t"width": ' + this.width + ',\n';
		}
		if (this.height) {
			JSON += '\t"height": ' + this.height + ',\n';
		}
		JSON += '\t"title": "' + this.title + '",\n';
		JSON += '\t"header": false,\n';
		JSON += '\t"flex": 1,\n';
		JSON += '\t"layout": "fit",\n';
		if (this.region) {
			JSON += '\t"region": "' + this.region + '",\n';
			if (this.split) {
				switch (this.region) {
					case 'north': {
						JSON += '\t"minSize": ' + (this.height / 2) + ',\n';
						JSON += '\t"maxSize": ' + (this.height * 2) + ',\n';
						break;
					}
					case 'south': {
						JSON += '\t"minSize": ' + (this.height / 2) + ',\n';
						JSON += '\t"maxSize": ' + (this.height * 2) + ',\n';
						break;
					}
					case 'west': {
						JSON += '\t"minSize": ' + (this.width / 2) + ',\n';
						JSON += '\t"maxSize": ' + (this.width * 2) + ',\n';
						break;
					}
					case 'east': {
						JSON += '\t"minSize": ' + (this.width / 2) + ',\n';
						JSON += '\t"maxSize": ' + (this.width * 2) + ',\n';
						break;
					}
				}
			}
		}
		JSON += '\t"collapsible": ' + this.collapsible + ',\n';
		if (this.collapsible) {
			JSON += '\t"header": true,\n';
		}
		JSON += '\t"split": ' + this.split + ',\n';
		JSON += '\t"text": "' + this.id + '",\n';
		if ((this.items) && (this.items.getCount() > 0)) {
			JSON += '\t"items": [\n';
			for (var component_index = 0 ; component_index < this.items.getCount() ; component_index ++) {
				JSON += this.getComponent(component_index).getJSON() + ',\n';
			}
			JSON = JSON.substring(0, JSON.length - 2);
			JSON += '\n';
			JSON += '\t],\n';
		} else {
			JSON += '\t"leaf": true,\n';
		}
		JSON += '\t"droppable": false,\n';
		JSON += '\t"clickable": true,\n';
		JSON += '\t"extra": false\n';
		JSON += '}';
		return JSON;
	}
});
Ext.applyIf(Tolomeo.Panel.prototype, Tolomeo.Container.prototype);
/**
* @member Tolomeo.Panel
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Panel.
* @static
*/  
Tolomeo.Panel.id_count = 0;
Ext.reg('tolomeo_panel', Tolomeo.Panel);
