/**
* Contenitore di tipo "Mappa".
* Questo contenitore consente di visualizzare una mappa ed &egrave; indispensabile per la creazione di un'applicazione Tolomeo.
* @xtype tolomeo_map
*/
Tolomeo.TolomeoMap = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoMap
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoMap.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TolomeoMap
		* Identificativo dell'oggetto.
		*/
		this.id = 'tolomeo_map_' + Tolomeo.TolomeoMap.id_count;
		Tolomeo.TolomeoMap.id_count ++;
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'green'
			};
			this.html = 'Tolomeo.TolomeoMap';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoMap
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
		JSON += '\t"text": "' + this.id + '",\n';
		JSON += '\t"items": [\n';
		JSON += '\t\t{\n';
		JSON += '\t\t\t"xtype": "tx_toloviewerOLPanel",\n';
		JSON += '\t\t\t"paramsJS": TolomeoExt.Vars.paramsJS\n';
		JSON += '\t\t}\n';
		JSON += '\t],\n';
		JSON += '\t"leaf": true,\n';
		JSON += '\t"droppable": false\n';
		JSON += '}';
		return JSON;
	}
});
/**
* @member Tolomeo.TolomeoMap
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoMap.
* @static
*/
Tolomeo.TolomeoMap.id_count = 0;
Ext.reg('tolomeo_map', Tolomeo.TolomeoMap);