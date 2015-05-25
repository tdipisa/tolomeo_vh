/**
* Contenitore di tipo "Barra degli Strumenti".
* @xtype tolomeo_list_view
*/
Tolomeo.Toolbar = Ext.extend(Ext.Toolbar, {
	/**
	* @constructor
	* @member Tolomeo.Toolbar
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Container.prototype.constructor.apply(this, arguments);
		Tolomeo.Toolbar.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.Toolbar
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'toolbar_' + Tolomeo.Toolbar.id_count;
		Tolomeo.Toolbar.id_count ++;
	},
	/**
	* @method
	* @member Tolomeo.Toolbar
	* Restituisce un bottone della barra degli strumenti tramite l'identificativo del bottone.
	* @param {String} button_id Identificativo del bottone.
	*/
	getButton: function(button_id) {
		for (var component_index = 0 ; component_index < this.items.getCount() ; component_index++) {
			if (this.getComponent(component_index).button_id == button_id) {
				return this.getComponent(component_index);	
			} 
		}	
	}
});
Ext.applyIf(Tolomeo.Toolbar.prototype, Tolomeo.Container.prototype);
/**
* @member Tolomeo.Toolbar
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Toolbar.
* @static
*/
Tolomeo.Toolbar.id_count = 0;
Ext.reg('tolomeo_toolbar', Tolomeo.Toolbar);
