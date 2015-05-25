/**
* Contenitore di tipo "Barra degli Strumenti".
* Questo contenitore consente di visualizzare una barra degli strumenti ed &egrave; indispensabile per la creazione di un'applicazione Tolomeo.
* @xtype tolomeo_toolbar
*/
Tolomeo.TolomeoToolbar = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.TolomeoToolbar
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.TolomeoToolbar.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'tolomeo_toolbar_' + Tolomeo.TolomeoToolbar.id_count;
		Tolomeo.TolomeoToolbar.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withPan = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withPanArrows = false;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withZoomIn = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withZoomOut = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withZoomBox = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withZoomAll = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withMeasure = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withPrint = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withLegenda = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withQuery = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withSeleziona = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withInfoSelezione = false;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withAnnullaSeleziona = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withLayerList = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withIdentify = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withNuovo = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withUpdateAlfa = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withAdd = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withSubtract = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withAddSub = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withVertexEdit = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withDragDrop = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withDelete = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withAutoIdentify = true;
		/**
		* @cfg
		* @member Tolomeo.TolomeoToolbar
		*/
		this.withTemporalFilter = true;
		if (!configuration) {
			this.style = {
				borderWidth: '5px',
				borderColor: 'green'
			};
			this.html = 'Tolomeo.TolomeoToolbar';
		}
	},
	/**
	* @method
	* @member Tolomeo.TolomeoToolbar
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Container.prototype.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withPan',
				'value': this.withPan
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withPanArrows',
				'value': this.withPanArrows
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withZoomIn',
				'value': this.withZoomIn
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withZoomOut',
				'value': this.withZoomOut
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withZoomBox',
				'value': this.withZoomBox
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withZoomAll',
				'value': this.withZoomAll
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withMeasure',
				'value': this.withMeasure
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withPrint',
				'value': this.withPrint
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withLegenda',
				'value': this.withLegenda
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withQuery',
				'value': this.withQuery
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withSeleziona',
				'value': this.withSeleziona
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withInfoSelezione',
				'value': this.withInfoSelezione
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withAnnullaSeleziona',
				'value': this.withAnnullaSeleziona
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withLayerList',
				'value': this.withLayerList
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withIdentify',
				'value': this.withIdentify
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withNuovo',
				'value': this.withNuovo
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withUpdateAlfa',
				'value': this.withUpdateAlfa
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withAdd',
				'value': this.withAdd
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withSubtract',
				'value': this.withSubtract
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withAddSub',
				'value': this.withAddSub
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withVertexEdit',
				'value': this.withVertexEdit
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withDragDrop',
				'value': this.withDragDrop
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withDelete',
				'value': this.withDelete
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withAutoIdentify',
				'value': this.withAutoIdentify
			}
		));
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'withTemporalFilter',
				'value': this.withTemporalFilter
			}
		));
		return PROPERTIES;
	},
	/**
	* @method
	* @member Tolomeo.TolomeoToolbar
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
		JSON += '\t\t\t"xtype": "tx_toloButtonPanel",\n';
		JSON += '\t\t\t"paramsJS": TolomeoExt.Vars.paramsJS,\n';
		JSON += '\t\t\t"withPan": ' + this.withPan + ',\n';
		JSON += '\t\t\t"withPanArrows": ' + this.withPanArrows + ',\n';
		JSON += '\t\t\t"withZoomIn": ' + this.withZoomIn + ',\n';
		JSON += '\t\t\t"withZoomOut": ' + this.withZoomOut + ',\n';
		JSON += '\t\t\t"withZoomBox": ' + this.withZoomBox + ',\n';
		JSON += '\t\t\t"withZoomAll": ' + this.withZoomAll + ',\n';
		JSON += '\t\t\t"withMeasure": ' + this.withMeasure + ',\n';
		JSON += '\t\t\t"withPrint": ' + this.withPrint + ',\n';
		JSON += '\t\t\t"withLegenda": ' + this.withLegenda + ',\n';
		JSON += '\t\t\t"withQuery": ' + this.withQuery + ',\n';
		JSON += '\t\t\t"withSeleziona": ' + this.withSeleziona + ',\n';
		JSON += '\t\t\t"withInfoSelezione": ' + this.withInfoSelezione + ',\n';
		JSON += '\t\t\t"withAnnullaSeleziona": ' + this.withAnnullaSeleziona + ',\n';
		JSON += '\t\t\t"withLayerList": ' + this.withLayerList + ',\n';
		JSON += '\t\t\t"withIdentify": ' + this.withIdentify + ',\n';
		JSON += '\t\t\t"withNuovo": ' + this.withNuovo + ',\n';
		JSON += '\t\t\t"withUpdateAlfa": ' + this.withUpdateAlfa + ',\n';
		JSON += '\t\t\t"withAdd": ' + this.withAdd + ',\n';
		JSON += '\t\t\t"withSubtract": ' + this.withSubtract + ',\n';
		JSON += '\t\t\t"withAddSub": ' + this.withAddSub + ',\n';
		JSON += '\t\t\t"withVertexEdit": ' + this.withVertexEdit + ',\n';
		JSON += '\t\t\t"withDragDrop": ' + this.withDragDrop + ',\n';
		JSON += '\t\t\t"withDelete": ' + this.withDelete + ',\n';
		JSON += '\t\t\t"withAutoIdentify": ' + this.withAutoIdentify + ',\n';
		JSON += '\t\t\t"withTemporalFilter": ' + this.withTemporalFilter + '\n';
		JSON += '\t\t}\n';
		JSON += '\t],\n';
		JSON += '\t"leaf": true,\n';
		JSON += '\t"droppable": false\n';
		JSON += '}';
		return JSON;
	}
});
/**
* @member Tolomeo.TolomeoToolbar
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.TolomeoToolbar.
* @static
*/
Tolomeo.TolomeoToolbar.id_count = 0;
Ext.reg('tolomeo_toolbar', Tolomeo.TolomeoToolbar);