/** 
* Classe per la gestione dei Tabpanel delle Tolomeo Application.
* Genera un tab panel di un singolo pannello
* @xtype tolomeo_tabpanel
*/
Tolomeo.TabPanel = Ext.extend(Ext.TabPanel, {
	/**
	* @constructor
	* @member Tolomeo.TabPanel
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TabPanel.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TabPanel
		* id dell'oggetto
		*/
		this.id = 'tab_panel_' + Tolomeo.TabPanel.id_count;
		Tolomeo.TabPanel.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.TabPanel
		* numero dei pannelli dell'oggetto 
		*/
		this.panel_count = 1;
		/**
		* @cfg
		* @member Tolomeo.TabPanel
		*/
		this.enableTabScroll = true;
		/**
		* @cfg
		* @member Tolomeo.TabPanel
		*/
		this.clickable = true;
		if (!configuration) {
			this.add(new Tolomeo.Tab(
					{
						droppable: true
					}
				)
			);
			/**
			* @property {Number} activeTab
			* indice del tab attivo
			*/
			this.activeTab = 0;
			/**
			* @event propertychange
			* Scatenato quando viene impostato il valore di una propriet&agrave; del pannello.
			* @param {String} name Nome della propriet&agrave; impostata.
			* @param {Object} value Valore della propriet&agrave; impostata.
			*/
			this.addEvents('propertychange');
			this.on('propertychange', this.setProperty, this);
		}
	},
	/**
	* @method
	* @member Tolomeo.TabPanel
	* Imposta il valore di una propriet&agrave; del pannello.
	* @param {String} name Nome della propriet&agrave; impostata.
	* @param {Object} value Valore della propriet&agrave; impostata.
	*/
	setProperty: function(name, value) {
		Tolomeo.Container.prototype.setProperty.apply(this, [name, value]);
		switch (name) {
			case 'panel_count': {
				if (value > this.items.getCount()) {
					for (var panel_index = this.items.getCount() ; panel_index < value ; panel_index ++) {
						this.add(new Tolomeo.Tab(
								{
									droppable: true
								}
							)
						);
						this.setActiveTab(panel_index);
					}
				} else if (value < this.items.getCount()) {
					Ext.MessageBox.alert('Informazione', 'Per rimuovere un contenitore &egrave; necessario utilizzare la funzione "Rimuovi Contenitore" presente nella barra degli strumenti.');
				}
				break;
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.TabPanel
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Container.prototype.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'panel_count',
				'value': this.items.getCount()
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.TabPanel
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
		JSON += '\t"border": false,\n';
		JSON += '\t"enableTabScroll": true,\n';
		JSON += '\t"activeTab": 0,\n';
		JSON += '\t"text": "' + this.id + '"';
		if (this.items.getCount() > 0) {
			JSON += ',\n';
			JSON += '\t"items": [\n';
			for (var component_index = 0 ; component_index < this.items.getCount() ; component_index ++) {
				JSON += this.getComponent(component_index).getJSON() + ',\n';
			}
			JSON = JSON.substring(0, JSON.length - 2);
			JSON += '\n';
			JSON += '\t]\n';
		} else {
			JSON += '\n';
		}
		JSON += '}';
		return JSON;
	}
});
Ext.applyIf(Tolomeo.TabPanel.prototype, Tolomeo.Container.prototype);
/**
* @member Tolomeo.TabPanel
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TabPanel.
* @static
*/
Tolomeo.TabPanel.id_count = 0;
Ext.reg('tolomeo_tab_panel', Tolomeo.TabPanel);
