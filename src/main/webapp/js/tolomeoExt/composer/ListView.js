/**
* Contenitore di tipo "Lista".
* @xtype tolomeo_list_view
*/
Tolomeo.ListView = Ext.extend(Ext.list.ListView, {
});
Ext.applyIf(Tolomeo.ListView.prototype, Tolomeo.Container.prototype);
/**
* @member Tolomeo.ListView
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.ListView.
* @static
*/
Tolomeo.ListView.id_count = 0;
Ext.reg('tolomeo_list_view', Tolomeo.ListView);
