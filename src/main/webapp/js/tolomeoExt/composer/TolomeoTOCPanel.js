/**
* Contenitore di tipo "Tabella dei Contenuti".
* Questo contenitore consente di visualizzare i contenuti di una mappa ed &egrave; indispensabile per la creazione di un'applicazione Tolomeo.
* @xtype tolomeo_TOC_panel
*/
Tolomeo.TolomeoTOCPanel = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoTOCPanel
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoTOCPanel.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TolomeoTOCPanel
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'tolomeo_TOC_panel_' + Tolomeo.TolomeoTOCPanel.id_count;
		Tolomeo.TolomeoTOCPanel.id_count ++;
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'green'
			};
			this.html = 'Tolomeo.TolomeoTOCPanel';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoTOCPanel
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
		JSON += '\t\t\t"xtype": "tx_toloTOCPanel",\n';
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
* @member Tolomeo.TolomeoTOCPanel
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoTOCPanel.
* @static
*/
Tolomeo.TolomeoTOCPanel.id_count = 0;
Ext.reg('tolomeo_TOC_panel', Tolomeo.TolomeoTOCPanel);