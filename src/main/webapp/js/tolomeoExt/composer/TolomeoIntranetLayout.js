/**
* Contenitore con integrato un layout di tipo "Intranet".
* @xtype tolomeo_intranet_layout
*/
Tolomeo.TolomeoIntranetLayout = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoIntranetLayout
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoIntranetLayout.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'tolomeo_intranet_layout_' + Tolomeo.TolomeoIntranetLayout.id_count;
		Tolomeo.TolomeoIntranetLayout.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		*/
		this.withDataPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		*/
		this.withToolsPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		*/
		this.collapsedToolsPanel = false;
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		*/
		this.collapsedDataPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		*/
		this.withLegendaPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		*/
		this.withQueryPanel = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoIntranetLayout
		*/
		this.urlPannello = '';
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'blue'
			};
			this.html = 'Tolomeo.TolomeoIntranetLayout';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoIntranetLayout
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
	* @member Tolomeo.TolomeoIntranetLayout
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
		JSON += '\t\t\t"xtype": "tx_ToloPanelIntra",\n';
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
* @member Tolomeo.TolomeoIntranetLayout
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoIntranetLayout.
* @static
*/
Tolomeo.TolomeoIntranetLayout.id_count = 0;
Ext.reg('tolomeo_intranet_layout', Tolomeo.TolomeoIntranetLayout);