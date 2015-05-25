/**
* Property Grid per la gestione degli elementi delle tolomeo application.
* Nella modifica degli attributi vengono considerate le caratteristiche dell'oggetto sul quale devono essere applicate
* @xtype tolomeo_property_grid
*/
Tolomeo.PropertyGrid = Ext.extend(Ext.grid.PropertyGrid, {
	/**
	* @constructor
	* @member Tolomeo.PropertyGrid
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.PropertyGrid.superclass.constructor.apply(this, arguments);
		/**
		* @cfg {String}
		* @member Tolomeo.PropertyGrid
		*/
		this.id = 'property_grid_' + Tolomeo.PropertyGrid.id_count;
		Tolomeo.PropertyGrid.id_count ++;
	},
	/**
	* @method
	* @member Tolomeo.PropertyGrid
	* carica le proprieta' di un oggetto considerando alcuni valori di default
	* @param {Object} Properties proprieta' da caricare
	*/
	loadContainerProperties: function(PROPERTIES) {
		this.store.removeAll();
		for (var property_index = 0 ; property_index < PROPERTIES.length ; property_index ++) {
			switch (PROPERTIES[property_index].data.name) {
				case 'width': {
					if (this.getSource().width == undefined) {
						this.setProperty(PROPERTIES[property_index].data.name, PROPERTIES[property_index].data.value, true);
						this.getSource().width = undefined;
					} else {
						this.setProperty(PROPERTIES[property_index].data.name, PROPERTIES[property_index].data.value, true);
					}
					break;
				}
				case 'height': {
					if (this.getSource().height == undefined) {
						this.setProperty(PROPERTIES[property_index].data.name, PROPERTIES[property_index].data.value, true);
						this.getSource().height = undefined;
					} else {
						this.setProperty(PROPERTIES[property_index].data.name, PROPERTIES[property_index].data.value, true);
					}
					break;
				}
				default: {
					this.setProperty(PROPERTIES[property_index].data.name, PROPERTIES[property_index].data.value, true);
					break;
				}
			}
		}
	}
});

Ext.applyIf(Tolomeo.PropertyGrid.prototype, Tolomeo.Container.prototype);
/**
* @member Tolomeo.PropertyGrid
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.PropertyGrid.
* @static
*/
Tolomeo.PropertyGrid.id_count = 0;
Ext.reg('tolomeo_property_grid', Tolomeo.PropertyGrid);
