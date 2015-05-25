/** 
* Estensione della Classe button Extjs per le Tolomeo Applications. 
* @xtype tolomeo_button
*/
Tolomeo.Button = Ext.extend(Ext.Button, {
	/**
	* @constructor
	* @member Tolomeo.Button
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Button.superclass.constructor.apply(this, arguments);
		this.id = 'button_' + Tolomeo.Button.id_count;
		Tolomeo.Button.id_count ++;
		if (!configuration) {
			/**
			* @cfg
			* @member Tolomeo.Button
			*/
			this.text = 'Button';
		}
		/**
		* @cfg
		* @member Tolomeo.Button
		*/
		this.clickable = true;
	},
	/**
	* @method
	* @member Tolomeo.Button
	* Restituisce la rappresentazione JSON del bottone.
	* @return {String} Rappresentazione JSON del bottone.
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
		JSON += '\t"text": "' + this.id + '",\n';
		JSON += '\t"leaf": true\n';
		JSON += '}';
		return JSON;
	}
});
Ext.applyIf(Tolomeo.Button.prototype, Tolomeo.Container.prototype);
/**
* @member Tolomeo.Button
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Button.
* @static
*/
Tolomeo.Button.id_count = 0;
Ext.reg('tolomeo_button', Tolomeo.Button);
