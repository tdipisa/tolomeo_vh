/**
* Contenitore con integrato un layout di tipo "Street Guide" ("Stradario").
* @xtype tolomeo_street_guide_layout
*/
Tolomeo.TolomeoStreetGuideLayout = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoStreetGuideLayout
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoStreetGuideLayout.superclass.constructor.apply(this, arguments);
		/**
		* @member Tolomeo.TolomeoStreetGuideLayout
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'tolomeo_street_guide_layout_' + Tolomeo.TolomeoStreetGuideLayout.id_count;
		Tolomeo.TolomeoStreetGuideLayout.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.TolomeoStreetGuideLayout
		*/
		this.suggestWithGeom = false;
		/**
		* @cfg
		* @member Tolomeo.TolomeoStreetGuideLayout
		*/
		this.codTPNStrade = -510;
		/**
		* @cfg
		* @member Tolomeo.TolomeoStreetGuideLayout
		*/
		this.idRicercaStrade = 1;
		/**
		* @cfg
		* @member Tolomeo.TolomeoStreetGuideLayout
		*/
		this.codTPNCivici = -610;
		/**
		* @cfg
		* @member Tolomeo.TolomeoStreetGuideLayout
		*/
		this.idRicercaCivici = 1;
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'blue'
			};
			this.html = 'Tolomeo.TolomeoStreetGuideLayout';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoStreetGuideLayout
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Container.prototype.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'suggestWithGeom',
				'value': this.suggestWithGeom
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'codTPNStrade',
				'value': this.codTPNStrade
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'idRicercaStrade',
				'value': this.idRicercaStrade
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'codTPNCivici',
				'value': this.codTPNCivici
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'idRicercaCivici',
				'value': this.idRicercaCivici
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.TolomeoStreetGuideLayout
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
		JSON += '\t\t\t"xtype": "tx_ToloPanelStradario",\n';
		JSON += '\t\t\t"suggestWithGeom": ' + this.suggestWithGeom + ',\n';
		JSON += '\t\t\t"codTPNStrade": ' + this.codTPNStrade + ',\n';
		JSON += '\t\t\t"idRicercaStrade": ' + this.idRicercaStrade + ',\n';
		JSON += '\t\t\t"codTPNCivici": ' + this.codTPNCivici + ',\n';
		JSON += '\t\t\t"idRicercaCivici": "' + this.idRicercaCivici + '",\n';
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
* @member Tolomeo.TolomeoStreetGuideLayout
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoStreetGuideLayout.
* @static
*/
Tolomeo.TolomeoStreetGuideLayout.id_count = 0;
Ext.reg('tolomeo_street_guide_layout', Tolomeo.TolomeoStreetGuideLayout);