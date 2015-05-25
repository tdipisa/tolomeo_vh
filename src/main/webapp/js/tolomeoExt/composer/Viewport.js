/**
* Contenitore di tipo "Viewport".
* Questo contenitore rappresenta l'area visibile di un'applicazione Tolomeo
* @xtype tolomeo_viewport
*/
Tolomeo.Viewport = Ext.extend(Ext.Viewport, {
});
Ext.applyIf(Tolomeo.Viewport.prototype, Tolomeo.Container.prototype);
/**
* @member Tolomeo.Viewport
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Viewport.
* @static
*/  
Tolomeo.Viewport.id_count = 0;
Ext.reg('tolomeo_viewport', Tolomeo.Viewport);
