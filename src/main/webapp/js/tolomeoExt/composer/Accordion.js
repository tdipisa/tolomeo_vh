/** 
* Estensione dell'Accordion Extjs per le Tolomeo Applications. 
* @xtype tolomeo_accordion
*/
Tolomeo.Accordion = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.Accordion
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Accordion.superclass.constructor.apply(this, arguments);
		/**
		* @cfg 
		* @member Tolomeo.Accordion
		*/	
		this.id = 'accordion_' + Tolomeo.Accordion.id_count;
		Tolomeo.Accordion.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.Accordion
		* Numero di pannelli contenuti nel pannello.
		*/
		this.panel_count = 1;
		/**
		* @cfg 
		* @member Tolomeo.Accordion
		*/
		this.layout = {
			type: 'accordion',
			animate: true
		};
		if (!configuration) {
			/**
			* @cfg 
			* @member Tolomeo.Accordion
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
	* @member Tolomeo.Accordion
	* Imposta il valore di una propriet&agrave; del pannello.
	* @param {String} name Nome della propriet&agrave; impostata.
	* @param {Object} value Valore della propriet&agrave; impostata.
	*/
	setProperty: function(name, value) {
		Tolomeo.Accordion.superclass.setProperty.apply(this, [name, value]);
		switch (name) {
			case 'panel_count': {
				if (value > this.items.getCount()) {
					for (var panel_index = this.items.getCount() ; panel_index < value ; panel_index ++) {
						this.add(new Tolomeo.Panel(
								{
									droppable: true
								}
							)
						);
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
	* @member Tolomeo.Accordion
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Accordion.superclass.getProperties.apply(this);
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
	* @member Tolomeo.Accordion
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
		JSON += '\t\t"type": "accordion",\n';
		JSON += '\t\t"animate": true\n';
		JSON += '\t},\n';
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
/**
* @member Tolomeo.Accordion
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Accordion.
* @static
*/
Tolomeo.Accordion.id_count = 0;
Ext.reg('tolomeo_accordion', Tolomeo.Accordion);
