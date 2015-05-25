/** 
* Estensione del layout di tipo Border Extjs per le Tolomeo Applications. 
* @xtype tolomeo_border
*/
Tolomeo.Border = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.Border
	* Costruttore.
	* Se non viene specificata una configurazione, vengono creati il pannello "center" e i pannelli "north", "south", "west" e "east" extra.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Border.superclass.constructor.apply(this, arguments);
		/**
		* @cfg 
		* @member Tolomeo.Border
		*/	
		this.id = 'border_' + Tolomeo.Border.id_count;
		Tolomeo.Border.id_count ++;
		/**
		* @cfg 
		* @member Tolomeo.Border
		*/
		this.layout = 'border';
		if (!configuration) {
			/**
			* @cfg 
			* @member Tolomeo.Border
			*/
			this.style = {
				borderWidth: '3px',
				borderColor: 'red'
			};
			this.add(new Tolomeo.Panel(
				{
					region: 'center',
					droppable: true
				}
			));
			this.add(new Tolomeo.Panel(
				{
					height: 10,
					region: 'north',
					droppable: true,
					clickable: false,
					extra: true,
					bodyCssClass: 'extra-panel'
				}
			));
			this.add(new Tolomeo.Panel(
				{
					height: 10,
					region: 'south',
					droppable: true,
					clickable: false,
					extra: true,
					bodyCssClass: 'extra-panel'
				}
			));
			this.add(new Tolomeo.Panel(
				{
					width: 10,
					region: 'west', 
					droppable: true,
					clickable: false,
					extra: true,
					bodyCssClass: 'extra-panel'
				}
			));
			this.add(new Tolomeo.Panel(
				{
					width: 10,
					region: 'east',
					droppable: true,
					clickable: false,
					extra: true,
					bodyCssClass: 'extra-panel'
				}
			));
			this.getComponent(1).on('add', this.addPanel, this);
			this.getComponent(2).on('add', this.addPanel, this);
			this.getComponent(3).on('add', this.addPanel, this);
			this.getComponent(4).on('add', this.addPanel, this);
		}
	},
	/**
	* @method
	* @member Tolomeo.Border
	* Aggiunge un contenitore al pannello.
	* @param {Object} container Contenitore al quale viene aggiunto il nuovo componente.
	* @param {Object} component Componente che viene aggiunto.
	* @param {Number} index Indice al quale viene aggiunto il nuovo componente.
	*/
	addPanel: function(container, component, index) {
		container.un('add', this.addPanel, this);
		switch (container.region) {
			case 'north': {
				container.height = 50;
				container.setHeight(50);
				container.clickable = true;
				container.extra = false;
				if (container.body) {
					container.body.removeClass('extra-panel');
				}
				break;
			}
			case 'south': {
				container.height = 50;
				container.setHeight(50);
				container.clickable = true;
				container.extra = false;
				if (container.body) {
					container.body.removeClass('extra-panel');
				}
				break;
			}
			case 'west': {
				container.width = 100;
				container.setWidth(100);
				container.clickable = true;
				container.extra = false;
				if (container.body) {
					container.body.removeClass('extra-panel');
				}
				break;
			}
			case 'east': {
				container.width = 100;
				container.setWidth(100);
				container.clickable = true;
				container.extra = false;
				if (container.body) {
					container.body.removeClass('extra-panel');
				}
				break;
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.Border
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
		JSON += '\t"layout": "border",\n';
		JSON += '\t"text": "' + this.id + '"';
		if (this.items.getCount() > 0) {
			JSON += ',\n';
			JSON += '\t"items": [\n';
			for (var component_index = 0 ; component_index < this.items.getCount() ; component_index ++) {
				if (this.getComponent(component_index).extra == false) {
					JSON += this.getComponent(component_index).getJSON() + ',\n';
				}
			}
			JSON = JSON.substring(0, JSON.length - 2);
			JSON += '\n';
			JSON += '\t]\n';
		} else {
			JSON += '\n';
		}
		JSON += '}';
		return JSON;
	}
});
/**
* @member Tolomeo.Border
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Border.
* @static
*/
Tolomeo.Border.id_count = 0;
Ext.reg('tolomeo_border', Tolomeo.Border);
