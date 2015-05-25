/**
* Classe base per la gestione dei contenitori ExtJs usati nelle
*	Tolomeo Application 
*/
Tolomeo.Container = Ext.extend(Ext.Container, {
	/**
	* @constructor
	* @member Tolomeo.Container
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Container.superclass.constructor.apply(this, arguments);
	},
	/**
	* @method
	* @member Tolomeo.Container
	* @param {Object} component
	* @return {Object}
	*/
	checkComponent: function(component) {
		return this.ownerCt.checkComponent(component);
	},
	/**
	* @method
	* @member Tolomeo.Container
	* Imposta il valore di una propriet&agrave; del pannello.
	* @param {String} name Nome della propriet&agrave; impostata.
	* @param {Object} value Valore della propriet&agrave; impostata.
	*/
	setProperty: function(name, value) {
		switch (name) {
			case 'id': {
				this.id = value;
				break;
			}
			case 'width': {
				this.width = parseInt(value);
				this.setWidth(parseInt(value));
				break;
			}
			case 'height': {
				this.height = parseInt(value);
				this.setHeight(parseInt(value));
				break;
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.Container
	* Restituisce le propriet&agrave; del contenitore.
	* @return {Object} Propriet&agrave; del contenitore.
	*/
	getProperties: function() {
		var PROPERTIES = new Array();
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'id',
				'value': this.id
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'width',
				'value': this.width
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'height',
				'value': this.height
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.Container
	* Restituisce la rappresentazione JSON del contenitore.
	* @return {String} Rappresentazione JSON del contenitore.
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
		if ((this.items) && (this.items.getCount() > 0)) {
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
Ext.reg('tolomeo_container', Tolomeo.Container);
