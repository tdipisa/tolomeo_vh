/** 
* Estensione del layout di tipo VBox Extjs per le Tolomeo Applications. 
* @xtype tolomeo_vbox
*/
Tolomeo.VBox = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.VBox
	* Costruttore.
	* Se non viene specificata una configurazione iniziale, vengono creati un pannello e un pannello extra.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.VBox.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.VBox
		*/	
		this.id = 'vbox_' + Tolomeo.VBox.id_count;
		Tolomeo.VBox.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.VBox
		*/
		this.panel_count = 1;
		/**
		* @cfg
		* @member Tolomeo.VBox
		*/
		this.layout = {
			type: 'vbox',
			align: 'stretch'
		};
		if (!configuration) {
			/**
			* @cfg
			* @member Tolomeo.VBox
			*/
			this.style = {
				borderWidth: '3px',
				borderColor: 'red'
			};
			this.add(new Tolomeo.Panel(
				{
					droppable: true
				}
			));
			this.add(new Tolomeo.Panel(
					{
						height: 10,
						droppable: true,
						clickable: false,
						extra: true,
						bodyCssClass: 'extra-panel'
					}
				)
			);
			/**
			* @event propertychange
			* Scatenato quando viene impostato il valore di una propriet&agrave; del pannello.
			* @param {String} name Nome della propriet&agrave; impostata.
			* @param {Object} value Valore della propriet&agrave; impostata.
			*/
			this.addEvents('propertychange');
			this.getComponent(this.items.getCount() - 1).on('add', this.addPanel, this);
			this.on('propertychange', this.setProperty, this);
		}
	},
	/**
	* @method
	* @member Tolomeo.VBox
	* Aggiunge un contenitore al pannello.
	* @param {Object} container Contenitore al quale viene aggiunto il nuovo componente.
	* @param {Object} component Componente che viene aggiunto.
	* @param {Number} index Indice al quale viene aggiunto il nuovo componente.
	*/
	addPanel: function(container, component, index) {
		this.getComponent(this.items.getCount() - 1).un('add', this.addPanel, this);
		this.getComponent(this.items.getCount() - 1).height = undefined;
		this.getComponent(this.items.getCount() - 1).setHeight();
		this.getComponent(this.items.getCount() - 1).clickable = true;
		this.getComponent(this.items.getCount() - 1).extra = false;
		this.getComponent(this.items.getCount() - 1).body.removeClass('extra-panel');
		this.add(new Tolomeo.Panel(
				{
					height: 10,
					droppable: true,
					clickable: false,
					extra: true,
					bodyCssClass: 'extra-panel'
				}
			)
		);
		this.getComponent(this.items.getCount() - 1).on('add', this.addPanel, this);
	},
	/**
	* @method
	* @member Tolomeo.VBox
	* Imposta il valore di una propriet&agrave; del pannello.
	* @param {String} name Nome della propriet&agrave; impostata.
	* @param {Object} value Valore della propriet&agrave; impostata.
	*/
	setProperty: function(name, value) {
		Tolomeo.VBox.superclass.setProperty.apply(this, [name, value]);
		switch (name) {
			case 'panel_count': {
				if (value > this.items.getCount() - 1) {
					this.getComponent(this.items.getCount() - 1).un('add', this.addPanel, this);
					this.getComponent(this.items.getCount() - 1).height = undefined;
					this.getComponent(this.items.getCount() - 1).setHeight();
					this.getComponent(this.items.getCount() - 1).clickable = true;
					this.getComponent(this.items.getCount() - 1).extra = false;
					if (this.getComponent(this.items.getCount() - 1).body) {
						this.getComponent(this.items.getCount() - 1).body.removeClass('extra-panel');
					}
					for (var panel_index = this.items.getCount() - 1 ; panel_index < value - 1 ; panel_index ++) {
						this.add(new Tolomeo.Panel(
								{
									droppable: true
								}
							)
						);
					}
					this.add(new Tolomeo.Panel(
							{
								height: 10,
								droppable: true,
								clickable: false,
								extra: true,
								bodyCssClass: 'extra-panel'
							}
						)
					);
					this.getComponent(this.items.getCount() - 1).on('add', this.addPanel, this);
				} else if (value < this.items.getCount() - 1) {
					Ext.MessageBox.alert('Informazione', 'Per rimuovere un contenitore &egrave; necessario utilizzare la funzione "Rimuovi Contenitore" presente nella barra degli strumenti.');
				}
				break;
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.VBox
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.VBox.superclass.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'panel_count',
				'value': this.items.getCount() - 1
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.VBox
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
		JSON += '\t"layout": {\n';
		JSON += '\t\t"type": "vbox",\n';
		JSON += '\t\t"align": "stretch"\n';
		JSON += '\t},\n';
		JSON += '\t"text": "' + this.id + '"';
		if (this.items.getCount() > 0) {
			JSON += ',\n';
			JSON += '\t"items": [\n';
			for (var component_index = 0 ; component_index < this.items.getCount() ; component_index ++) {
				if (this.getComponent(component_index).extra == false) {
					JSON += this.getComponent(component_index).getJSON() + ',\n';
				}
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
/**
* @member Tolomeo.VBox
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.VBox.
* @static
*/
Tolomeo.VBox.id_count = 0;
Ext.reg('tolomeo_vbox', Tolomeo.VBox);
