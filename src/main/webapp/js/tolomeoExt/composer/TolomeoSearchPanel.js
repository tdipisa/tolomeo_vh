/**
* Contenitore di tipo "Pannello di Ricerca".
* Questo contenitore consente di visualizzare una maschera per la ricerca ed &egrave; indispensabile per la creazione di un'applicazione Tolomeo.
* @xtype tolomeo_search_panel
*/
Tolomeo.TolomeoSearchPanel = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoSearchPanel
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoSearchPanel.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TolomeoSearchPanel
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'tolomeo_search_panel_' + Tolomeo.TolomeoSearchPanel.id_count;
		Tolomeo.TolomeoSearchPanel.id_count ++;
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'green'
			};
			this.html = 'Tolomeo.TolomeoSearchPanel';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoSearchPanel
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
		JSON += '\t\t\t"xtype": "tx_toloQueryPanel",\n';
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
* @member Tolomeo.TolomeoSearchPanel
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoSearchPanel.
* @static
*/
Tolomeo.TolomeoSearchPanel.id_count = 0;
Ext.reg('tolomeo_search_panel', Tolomeo.TolomeoSearchPanel);