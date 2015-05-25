/**
* Contenitore di tipo "Tabella dei Contenuti".
* Questo contenitore consente di visualizzare i contenuti di una mappa ed &egrave; indispensabile per la creazione di un'applicazione Tolomeo.
* @xtype tolomeo_button_TOC_panel
*/
Tolomeo.TolomeoButtonTOCPanel = Ext.extend(Tolomeo.TolomeoTOCPanel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoButtonTOCPanel
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoButtonTOCPanel.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TolomeoButtonTOCPanel
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'tolomeo_button_TOC_panel_' + Tolomeo.TolomeoButtonTOCPanel.id_count;
		Tolomeo.TolomeoButtonTOCPanel.id_count ++;
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'green'
			};
			this.html = 'Tolomeo.TolomeoButtonTOCPanel';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoButtonTOCPanel
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
		JSON += '\t\t\t"xtype": "tx_toloButtonTOCPanelExt",\n';
		JSON += '\t\t\t"paramsJS": TolomeoExt.Vars.paramsJS,\n';
		JSON += '\t\t\t"presetXML": TolomeoExt.Composer.presetXML,\n';
		JSON += '\t\t\t"sendPreset": true\n';
		JSON += '\t\t}\n';
		JSON += '\t],\n';
		JSON += '\t"leaf": true,\n';
		JSON += '\t"droppable": false\n';
		JSON += '}';
		return JSON;
	}
});
/**
* @member Tolomeo.TolomeoButtonTOCPanel
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoButtonTOCPanel.
* @static
*/
Tolomeo.TolomeoButtonTOCPanel.id_count = 0;
Ext.reg('tolomeo_button_TOC_panel', Tolomeo.TolomeoButtonTOCPanel);