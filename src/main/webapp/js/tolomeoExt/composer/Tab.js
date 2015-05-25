/** 
* Classe che gestisce i pannelli all'interno delle
*	singole pagine di un tab panel
* @xtype tolomeo_tab
*/
Tolomeo.Tab = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.Tab
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Tab.superclass.constructor.apply(this, arguments);
		/**
		* @cfg {String}
		* @member Tolomeo.Tab
		* Identificativo alfanumerico del pannello.
		*/	
		this.id = 'tab_' + Tolomeo.Tab.id_count;
		Tolomeo.Tab.id_count ++;
		if (configuration) {
			if (configuration.title == null) {
				/**
				* @cfg {String}
				* @member Tolomeo.Tab
				* Titolo del pannello. 
				*/	
				this.title = this.id;
			}
		}
		/**
		* @cfg {Boolean}
		* @member Tolomeo.Tab
		*/
		this.closable = true;
		if (configuration) {
			if (configuration.closable == false) {
				this.closable = false;
			}
		}
		this.on('propertychange', this.setProperty, this);
	},
	/**
	* @method
	* @member Tolomeo.Tab
	* Imposta il valore di una propriet&agrave; del pannello.
	* @param {String} name Nome della propriet&agrave; impostata.
	* @param {Object} value Valore della propriet&agrave; impostata.
	*/
	setProperty: function(name, value) {
		Tolomeo.Tab.superclass.setProperty.apply(this, [name, value]);
		switch (name) {
			case 'closable': {
				this.closable = value;
				break;
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.Tab
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Tab.superclass.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'closable',
				'value': this.closable
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.Tab
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
		JSON += '\t"collapsible": ' + this.collapsible + ',\n';
		if (this.collapsible) {
			JSON += '\t"header": true,\n';
		}
		JSON += '\t"split": ' + this.split + ',\n';
		JSON += '\t"closable": ' + this.closable + ',\n';
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
		JSON += '\t"droppable": false\n';
		JSON += '}';
		return JSON;
	}
});
/**
* @member Tolomeo.Tab
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Tab.
* @static
*/
Tolomeo.Tab.id_count = 0;
Ext.reg('tolomeo_tab', Tolomeo.Tab);
