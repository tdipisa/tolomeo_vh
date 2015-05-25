/** 
* Classe per la gestione dei progetti nel composer.
* Amministra i vari componenti di un progetto e ne controlla l'aderenza alle specifiche 
* richieste da Tolomeo
* @xtype tolomeo_project
*/
Tolomeo.Project = Ext.extend(Tolomeo.Tab, {
	/**
	* @constructor
	* @member Tolomeo.Project
	* Costruttore.
	* @param {Object} [configuration] Configuratione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Project.superclass.constructor.apply(this, arguments);
		/**
		* @cfg {String}
		* @member Tolomeo.Project
		* Identificativo alfanumerico del progetto.
		*/	
		this.id = 'project_' + Tolomeo.Project.id_count;
		Tolomeo.Project.id_count ++;
		if (configuration.title) {
			/**
			* @cfg {String}
			* @member Tolomeo.Project
			* Titolo del progetto.
			*/	
			this.title = configuration.title;
		}
		/**
		* @cfg {String}
		* @member Tolomeo.Project
		* Tipo del progetto.
		*/	
		this.type = configuration.type;
		/**
		* @property {Object} 
		*/
		this.tolomeo_layout = null;
		/**
		* @property {Object}
		* componente mappa di tolomeo
		*/
		this.tolomeo_map = null;
		/**
		* @property {Object}
		* componente toolbar di tolomeo
		*/
		this.tolomeo_toolbar = null;
		/**
		* @property {Object}
		* componente tabella dei contenuti di tolomeo
		*/
		this.tolomeo_TOC_panel = null;
		/**
		* @property {Object}
		* componente pannello di ricerca di tolomeo
		*/
		this.tolomeo_search_panel = null;
		this.on('add', this.addContainer, this);
	},
	
	/**
	* @method
	* @member Tolomeo.Project
	* cerca un componente di un particolare xtype all'interno del progetto 
	* @parama {Object} contenitore nel quale effettuare la ricerca
	* @param {String} xtype da cercare
	* @return {Object} primo componente di tipo xtype trovato
	*/
	findContainerByXType: function(container, xtype) {
		var component = null;
		if (container.getXType() == xtype) {
			component = container;
		} else {
			if (container.items) {
				if (container.items.getCount()) {
					var component_index = 0;
					while ((component == null) && (component_index < container.items.getCount())) {
						try {
							component = this.findContainerByXType(container.getComponent(component_index), xtype);
						} catch(exception) {
						}
						component_index ++;
					}
				}
			}
		}
		return component;
	},
	/**
	* @method
	* @member Tolomeo.Project
	* controlla se nel progetto e' gia presente un paricolare contenitore tolomeo
	* @param {Object} component componente da controllare
	* @return {Boolean} true se il componente non e' ancora presente false altrimenti
	*/
	checkComponent: function(component) {
		if ((component.getXType() == 'tolomeo_map') && this.tolomeo_map) {
			Ext.MessageBox.alert('Informazione', 'Non &egrave; possibile inserire pi&ugrave; di una Mappa Tolomeo in un progetto.');
			return false;
		} else if ((component.getXType() == 'tolomeo_toolbar') && this.tolomeo_toolbar) {
			Ext.MessageBox.alert('Informazione', 'Non &egrave; possibile inserire pi&ugrave; di una Barra degli Strumenti Tolomeo in un progetto.');
			return false;
		} else if (((component.getXType() == 'tolomeo_TOC_panel') || (component.getXType() == 'tolomeo_button_TOC_panel') || (component.getXType() == 'tolomeo_tree_TOC_panel')) && this.tolomeo_TOC_panel) {
			Ext.MessageBox.alert('Informazione', 'Non &egrave; possibile inserire pi&ugrave; di un Pannello dei Contenuti Tolomeo in un progetto.');
			return false;
		} else if ((component.getXType() == 'tolomeo_search_panel') && this.tolomeo_search_panel) {
			Ext.MessageBox.alert('Informazione', 'Non &egrave; possibile inserire pi&ugrave; di un Pannello di Ricerca Tolomeo in un progetto.');
			return false;
		}
		return true;
	},
	/**
	* @method
	* @member Tolomeo.Project
	* Aggiunge un contenitore al progetto.
	* @param {Object} container Contenitore al quale viene aggiunto il nuovo componente.
	* @param {Object} component Componente che viene aggiunto.
	* @param {Number} index Indice al quale viene aggiunto il nuovo componente.
	*/
	addContainer: function(container, component, index) {
		if (((component.getXType() == 'tolomeo_internet_layout') || (component.getXType() == 'tolomeo_intranet_layout') || (component.getXType() == 'tolomeo_intranet_tab_layout') || (component.getXType() == 'tolomeo_street_guide_layout')) && !this.tolomeo_layout) {
			this.tolomeo_layout = component;
		} else if ((component.getXType() == 'tolomeo_map') && !this.tolomeo_map) {
			this.tolomeo_map = component;
		} else if ((component.getXType() == 'tolomeo_toolbar') && !this.tolomeo_toolbar) {
			this.tolomeo_toolbar = component;
		} else if (((component.getXType() == 'tolomeo_TOC_panel') || (component.getXType() == 'tolomeo_button_TOC_panel') || (component.getXType() == 'tolomeo_tree_TOC_panel')) && !this.tolomeo_TOC_panel) {
			this.tolomeo_TOC_panel = component;
		} else if ((component.getXType() == 'tolomeo_search_panel') && !this.tolomeo_search_panel) {
			this.tolomeo_search_panel = component;
		}
	},
	/**
	* @method
	* @member Tolomeo.Project
	* ricostruisce il progetto ricorsivamente partendo da una configurazione json
	* @param {Object} panel oggetto sul quale inserire i componenti
	* @param {String} configuration configurazione del progetto
	*/
	build: function(panel, configuration) {
		if (configuration.items) {
			var component;
			switch (configuration.items[0].xtype) {
				case 'tolomeo_border': {
					component = new Tolomeo.Border();
					for (var item_index = 0 ; item_index < configuration.items[0].items.length ; item_index ++) {
						switch (configuration.items[0].items[item_index].region) {
							case 'center': {
								this.build(component.getComponent(0), configuration.items[0].items[item_index]);
								break;
							}
							case 'north': {
								this.build(component.getComponent(1), configuration.items[0].items[item_index]);
								break;
							}
							case 'south': {
								this.build(component.getComponent(2), configuration.items[0].items[item_index]);
								break;
							}
							case 'west': {
								this.build(component.getComponent(3), configuration.items[0].items[item_index]);
								break;
							}
							case 'east': {
								this.build(component.getComponent(4), configuration.items[0].items[item_index]);
								break;
							}
						}
					}
					break;
				}
				case 'tolomeo_hbox': {
					component = new Tolomeo.HBox();
					component.setProperty('panel_count', configuration.items[0].items.length);
					for (var item_index = 0 ; item_index < configuration.items[0].items.length ; item_index ++) {
						this.build(component.getComponent(item_index), configuration.items[0].items[item_index]);
					}
					break;
				}
				case 'tolomeo_vbox': {
					component = new Tolomeo.VBox();
					component.setProperty('panel_count', configuration.items[0].items.length);
					for (var item_index = 0 ; item_index < configuration.items[0].items.length ; item_index ++) {
						this.build(component.getComponent(item_index), configuration.items[0].items[item_index]);
					}
					break;
				}
				case 'tolomeo_accordion': {
					component = new Tolomeo.Accordion();
					component.setProperty('panel_count', configuration.items[0].items.length);
					for (var item_index = 0 ; item_index < configuration.items[0].items.length ; item_index ++) {
						this.build(component.getComponent(item_index), configuration.items[0].items[item_index]);
					}
					break;
				}
				case 'tolomeo_tab_panel': {
					component = new Tolomeo.TabPanel();
					component.setProperty('panel_count', configuration.items[0].items.length);
					for (var item_index = 0 ; item_index < configuration.items[0].items.length ; item_index ++) {
						this.build(component.getComponent(item_index), configuration.items[0].items[item_index]);
					}
					component.setActiveTab(0);
					break;
				}
				case 'tolomeo_button': {
					component = new Tolomeo.Button();
					break;
				}
				case 'tolomeo_internet_layout': {
					component = new Tolomeo.TolomeoInternetLayout();
					break;
				}
				case 'tolomeo_intranet_layout': {
					component = new Tolomeo.TolomeoIntranetLayout();
					break;
				}
				case 'tolomeo_intranet_tab_layout': {
					component = new Tolomeo.TolomeoIntranetTabLayout();
					break;
				}
				case 'tolomeo_street_guide_layout': {
					component = new Tolomeo.TolomeoStreetGuideLayout();
					break;
				}
				case 'tolomeo_map': {
					component = new Tolomeo.TolomeoMap();
					break;
				}
				case 'tolomeo_toolbar': {
					component = new Tolomeo.TolomeoToolbar();
					break;
				}
				case 'tolomeo_TOC_panel': {
					component = new Tolomeo.TolomeoTOCPanel();
					break;
				}
				case 'tolomeo_button_TOC_panel': {
					component = new Tolomeo.TolomeoButtonTOCPanel();
					break;
				}
				case 'tolomeo_tree_TOC_panel': {
					component = new Tolomeo.TolomeoTreeTOCPanel();
					break;
				}
				case 'tolomeo_search_panel': {
					component = new Tolomeo.TolomeoSearchPanel();
					break;
				}
			}
			panel.droppable = false;
			panel.add(component);
		}
		if (configuration.height) {
			panel.height = configuration.height;
			panel.setHeight(configuration.height);
		}
		if (configuration.width) {
			panel.width = configuration.width;
			panel.setWidth(configuration.width);
		}
		panel.setTitle(configuration.title);
		panel.collapsible = configuration.collapsible;
		panel.split = configuration.split;
		panel.closable = configuration.closable;
	},
	/**
	* @method
	* @member Tolomeo.Project
	* controlla se il progetto ha i componenti per generare un ToloMapAPIExt e lo istanzia
	*/
	buildTolomeoAPI: function() {
		
		var tolomeo_internet_layout = this.findContainerByXType(this, 'tolomeo_internet_layout');
		var tolomeo_intranet_layout = this.findContainerByXType(this, 'tolomeo_intranet_layout');
		var tolomeo_intranet_tab_layout = this.findContainerByXType(this, 'tolomeo_intranet_tab_layout');
		var tolomeo_street_guide_layout = this.findContainerByXType(this, 'tolomeo_street_guide_layout');
		
		if (!tolomeo_internet_layout && !tolomeo_intranet_layout && !tolomeo_intranet_tab_layout && !tolomeo_street_guide_layout) {
			var tolomeo_map = this.findContainerByXType(this, 'tolomeo_map');
			if (tolomeo_map) {
				tolomeo_map = tolomeo_map.getComponent(0);
			} else {
				throw 'Non &egrave; stata inserita la Mappa Tolomeo';
			}
			var tolomeo_toolbar = this.findContainerByXType(this, 'tolomeo_toolbar');
			if (tolomeo_toolbar) {
				tolomeo_toolbar = tolomeo_toolbar.getComponent(0);
			} else {
				throw 'Non &egrave; stata inserita la Barra degli Strumenti Tolomeo';
			}
			
			var tolomeo_TOC_panel = this.findContainerByXType(this, 'tolomeo_tree_TOC_panel') || this.findContainerByXType(this, 'tolomeo_button_TOC_panel');			
			
			if (tolomeo_TOC_panel) {
				tolomeo_TOC_panel = tolomeo_TOC_panel.getComponent(0);				
			} else {
				throw 'Non &egrave; stato inserito il Pannello dei Contenuti Tolomeo';
			}
			var tolomeo_search_panel = this.findContainerByXType(this, 'tolomeo_search_panel');
			if (tolomeo_search_panel) {
				tolomeo_search_panel = tolomeo_search_panel.getComponent(0);
			} else {
				throw 'Non &egrave; stato inserito il Pannello di Ricerca Tolomeo';
			}
			new TolomeoExt.ToloMapAPIExt(
				{
					paramsJS: TolomeoExt.Vars.paramsJS,
					viewer: tolomeo_map,
					buttonsPanel: tolomeo_toolbar,
					TOCPanel: tolomeo_TOC_panel,
					queryPanel: tolomeo_search_panel,
					titoloMappa: null,
					descrizioneMappa: null,
					urlLogo: null,
					urlLogoSecondario: null,
					stampaReferer: null,
					statusPanel: null
				}
			);
		}
	},
	/**
	* @method
	* @member Tolomeo.Project
	* Restituisce le propriet&agrave; del pannello.
	* @return {Object} Propriet&agrave; del pannello.
	*/
	getProperties: function() {
		var PROPERTIES = Tolomeo.Project.superclass.getProperties.apply(this);
		PROPERTIES.push(new Ext.data.Record(
			{
				'name': 'type',
				'value': this.type
			}
		));
		return PROPERTIES;
	}
});
/**
* @member Tolomeo.Project
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Project.
* @static
*/
Tolomeo.Project.id_count = 0;
Ext.reg('tolomeo_project', Tolomeo.Project);
