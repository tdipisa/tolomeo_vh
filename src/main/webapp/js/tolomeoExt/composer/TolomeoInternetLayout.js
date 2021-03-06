/**
* Contenitore con integrato un layout di tipo "Internet".
* @xtype tolomeo_internet_layout
*/
Tolomeo.TolomeoInternetLayout = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoInternetLayout
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoInternetLayout.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'tolomeo_internet_layout_' + Tolomeo.TolomeoInternetLayout.id_count;
		Tolomeo.TolomeoInternetLayout.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		*/
		this.withDataPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		*/
		this.withToolsPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		*/
		this.collapsedToolsPanel = false;
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		*/
		this.collapsedDataPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		*/
		this.withLegendaPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		*/
		this.withQueryPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoInternetLayout
		*/
		this.urlPannello = '';
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'blue'
			};
			this.html = 'Tolomeo.TolomeoInternetLayout';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoInternetLayout
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Container.prototype.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withDataPanel',
				'value': this.withDataPanel
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withToolsPanel',
				'value': this.withToolsPanel
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'collapsedToolsPanel',
				'value': this.collapsedToolsPanel
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'collapsedDataPanel',
				'value': this.collapsedDataPanel
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withLegendaPanel',
				'value': this.withLegendaPanel
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withQueryPanel',
				'value': this.withQueryPanel
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'urlPannello',
				'value': this.urlPannello
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.TolomeoInternetLayout
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
		JSON += '\t\t\t"xtype": "tx_ToloPanelInter",\n';
		JSON += '\t\t\t"withDataPanel": ' + this.withDataPanel + ',\n';
		JSON += '\t\t\t"withToolsPanel": ' + this.withToolsPanel + ',\n';
		JSON += '\t\t\t"collapsedToolsPanel": ' + this.collapsedToolsPanel + ',\n';
		JSON += '\t\t\t"collapsedDataPanel": ' + this.collapsedDataPanel + ',\n';
		JSON += '\t\t\t"withLegendaPanel": ' + this.withLegendaPanel + ',\n';
		JSON += '\t\t\t"withQueryPanel": ' + this.withQueryPanel + ',\n';
		JSON += '\t\t\t"urlPannello": "' + this.urlPannello + '",\n';
		JSON += '\t\t\t"legendaPanelOpt": {"presetXML": TolomeoExt.Composer.presetXML,"sendPreset": true}\n';
		JSON += '\t\t}\n';
		JSON += '\t],\n';
		JSON += '\t"leaf": true,\n';
		JSON += '\t"droppable": false\n';
		JSON += '}';
		return JSON;
	}
});
/**
* @member Tolomeo.TolomeoInternetLayout
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoInternetLayout.
* @static
*/
Tolomeo.TolomeoInternetLayout.id_count = 0;
Ext.reg('tolomeo_internet_layout', Tolomeo.TolomeoInternetLayout);