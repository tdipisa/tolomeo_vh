/**
* Contenitore di tipo "Compositore".
* Questo contenitore consente la comosizione di un layout per un'applicazione Tolomeo.
* Ciascun layout pu&ograve; essere creato tramite la definizione di un progetto.
* Un progetto &egrave; definito tramite la scelta del tipo di layout.
* Se il tipo di layout &egrave; "Personalizzato", &egrave; possibile comporre un layout in maniera totalmente libera.
* @xtype tolomeo_composer
*/
Tolomeo.Composer = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.Composer
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Composer.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'composer_' + Tolomeo.Composer.id_count;
		Tolomeo.Composer.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Titolo del pannello associato all'oggetto.
		*/
		this.title = 'Composer';
		this.iconCls = 'composer';
		this.layout = 'border';
		this.add(new Tolomeo.Toolbar(
			{
				itemId: 'tools-bar',
				region: 'north',
				height: 42,
				margins: '5 5 5 5',
				items: [
					{
	        			xtype: 'button',
	        			button_id: 'new-project',
	        			scale: 'large',
	        			iconAlign: 'top',
	        			iconCls: 'new-project',
	        			tooltip: 'Nuovo Progetto'
	        		},
	        		new Ext.Toolbar.Spacer(),
					{
	        			xtype: 'button',
	        			button_id: 'load-project',
	        			scale: 'large',
	        			iconAlign: 'top',
	        			iconCls: 'load-project',
	        			tooltip: 'Carica Progetto'
					},
	        		new Ext.Toolbar.Spacer(),
					{
	        			xtype: 'button',
	        			button_id: 'save-project',
	        			scale: 'large',
	        			iconAlign: 'top',
	        			iconCls: 'save-project',
	        			tooltip: 'Salva Progetto'
					},
	        		new Ext.Toolbar.Spacer(),
					{
	        			xtype: 'button',
	        			button_id: 'remove-container',
	        			scale: 'large',
	        			iconAlign: 'top',
	        			iconCls: 'remove-container',
	        			tooltip: 'Rimuovi Contenitore'
	        		}
	        	]
			}
		));
		this.add(new Tolomeo.HBox(
			{
				itemId: 'status-bar',
				region: 'south',
				margins: '5 5 5 5',
				height: 20,
				border: false,
				bodyCssClass: 'status-bar',
				items: [
					new Tolomeo.Panel(
						{
							itemId: 'information-panel',
							margins: {
								top: 0,
								right: 10,
								bottom: 0,
								left: 260
							},
							html: 'Aggiungere un nuovo progetto',
							bodyCssClass: 'information-panel'
						}
					),
					new Ext.ProgressBar(
						{
							itemId: 'progress-bar',
							width: 200,
							value: 0,
							text: 'Inizializzazione ...'
						}
					)
				]
			}
		));
		this.add(new Tolomeo.TabPanel(
			{
				itemId: 'tools-tab-panel',
				region: 'west',
				width: 250,
				margins: '0 5 0 5',
				split: true,
				minSize: 250,
				maxSize: 350,
				collapsible: true,
				activeTab: 0,
				items: [
					new Tolomeo.Accordion(
						{
							itemId: 'containers-accordion'
						}
					),
					new Ext.tree.TreePanel(
						{
							itemId: 'navigation-tree-panel',
							title: 'Navigazione',
							loader: new Ext.tree.TreeLoader(),
							rootVisible: false,
							autoScroll: true,
							useArrows: true,
							animate: false,
							root: new Ext.tree.AsyncTreeNode(
								{
									expanded: true
								}
							)
						}
					)
				]
			}
		));
		this.add(new Tolomeo.TabPanel(
			{
				region: 'east',
				width: 200,
				margins: '0 5 0 5',
				split: true,
				minSize: 200,
				maxSize: 300,
				collapsible: true,
				activeTab: 0,
				items: [
					new Tolomeo.PropertyGrid(
						{
							itemId: 'container-property-grid',
							title: 'Propriet&agrave;'
						}
					)
				]
			}
		));
		this.add(new Tolomeo.TabPanel(
			{
				itemId: 'projects-tab-panel',
				region: 'center',
				margins: '0 0 0 0'
			}
		));
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Pannello della barra degli strumenti.
		*/
		this.tools_bar = this.getComponent('tools-bar');
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Pannello dei progetti.
		*/
		this.projects_tab_panel = this.getComponent('projects-tab-panel');
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Pannello degli strumenti.
		*/
		this.tools_tab_panel = this.getComponent('tools-tab-panel');
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Pannello delle proprit&agrave; di un contenitore.
		*/
		this.container_property_grid = this.getComponent(3).getComponent('container-property-grid');
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Pannello della barra dello stato.
		*/
		this.status_bar = this.getComponent('status-bar');
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Identificativo numerico di un progetto.
		*/
		this.project_id = 0;
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Progetto corrente.
		*/
		this.project = null;
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Identificativi numerici dei progetti usati.
		*/
		this.PROJECTS_IDS = new Array();
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Contenitore corrente.
		*/
		this.container = null;
		this.tools_bar.getButton('new-project').on('click', this.addProject, this);
		this.tools_bar.getButton('save-project').on('click', this.saveProject, this);
		this.tools_bar.getButton('load-project').on('click', this.loadProject, this);
		this.tools_bar.getButton('remove-container').on('click', this.removeContainer, this);
		this.projects_tab_panel.on('tabchange', this.changeProject, this);
		this.projects_tab_panel.on('add', this.addContainer, this);
		this.projects_tab_panel.on('remove', function(container, component) {
			if (this.project) {
				this.updateNavigation(this.project.getJSON());
			} else {
				this.updateNavigation('');
			}
		}, this);
//		this.projects_tab_panel.body.on('click', this.clickContainer, this);
		/**
		* @cfg
		* @member Tolomeo.Composer
		* Men&ugrave; contestuale per il pannello dei progetti.
		*/
		this.context_menu = new Ext.menu.Menu(
			{
				items: [
					{
						id: 'remove-container',
						text: 'Rimuovi'
					}
				],
				listeners: {
					scope: this,
					itemclick: function(item, event) {
						switch (item.id) {
							case 'remove-container': {
								this.removeContainer();
								break;
							}
						}
					}
				}
			}
		);
//		this.projects_tab_panel.body.on('contextmenu', this.contextMenu, this);
		this.projects_tab_panel.on('beforeremove', this.removeProject, this);
		this.tools_tab_panel.getComponent('containers-accordion').setTitle('Contenitori');
		var containers_tree_panel = new Ext.tree.TreePanel(
			{
				title: 'Contenitori',
				enableDD: true,
				ddGroup: 'containers_dd_group',
				dropConfig: {
					allowContainerDrop: false
				},
				root: {
					nodeType: 'async'
				},
				rootVisible: false
			}
		);
		var root_node = new Ext.tree.AsyncTreeNode(
			{
				expanded: true,
				children: [
					{
						"xtype": "tolomeo_border",
						"text": "Border",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_hbox",
						"text": "HBox",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_vbox",
						"text": "VBox",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_accordion",
						"text": "Accordion",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_tab_panel",
						"text": "TabPanel",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_button",
						"text": "Button",
						"leaf": "true"
					}
				]
			}
		);
		containers_tree_panel.setRootNode(root_node);
		root_node.expandChildNodes(true);
		this.tools_tab_panel.getComponent('containers-accordion').add(containers_tree_panel);
		var tolomeo_containers_tree_panel = new Ext.tree.TreePanel(
			{
				title: 'Contenitori Tolomeo',
				enableDD: true,
				ddGroup: 'containers_dd_group',
				dropConfig: {
					allowContainerDrop: false
				},
				root: {
					nodeType: 'async'
				},
				rootVisible: false
			}
		);
		var root_node = new Ext.tree.AsyncTreeNode(
			{
				expanded: true,
				children: [
					{
						"xtype": "tolomeo_map",
						"text": "TolomeoMap",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_toolbar",
						"text": "TolomeoToolbar",
						"leaf": "true"
					},					
					{
						"xtype": "tolomeo_button_TOC_panel",
						"text": "TolomeoButtonTOCPanel",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_tree_TOC_panel",
						"text": "TolomeoTreeTOCPanel",
						"leaf": "true"
					},
					{
						"xtype": "tolomeo_search_panel",
						"text": "TolomeoSearchPanel",
						"leaf": "true"
					}
				]
			}
		);
		tolomeo_containers_tree_panel.setRootNode(root_node);
		root_node.expandChildNodes(true);
		this.tools_tab_panel.getComponent('containers-accordion').add(tolomeo_containers_tree_panel);
		this.tools_tab_panel.getComponent('navigation-tree-panel').on('click', function(node, event) {
			if (this.project) {
				if (this.container) {
					try {
						this.container.body.removeClass('selected-panel');
					} catch(exception) {
					}
				}
				this.container = this.findContainerById(this.projects_tab_panel, node.id);
				if (this.container) {
					try {
						this.container.body.addClass('selected-panel');
					} catch (exception) {
					}
					this.container_property_grid.setSource(this.container);
					this.container_property_grid.loadContainerProperties(this.container.getProperties());
				}
			}
		}, this);
		this.tools_tab_panel.getComponent('navigation-tree-panel').on('contextmenu', function(node, event) {
			if (this.project) {
				if (this.container) {
					try {
						this.container.body.removeClass('selected-panel');
					} catch(exception) {
					}
				}
				this.container = this.findContainerById(this.projects_tab_panel, node.id);
				if (this.container) {
					try {
						this.container.body.addClass('selected-panel');
					} catch (exception) {
					}
					this.container_property_grid.setSource(this.container);
					this.container_property_grid.loadContainerProperties(this.container.getProperties());
					this.context_menu.showAt(event.xy);
				}
			}
		}, this);
//		this.tools_tab_panel.setActiveTab(1);
//		this.tools_tab_panel.setActiveTab(0);
		this.tools_tab_panel.on('tabchange', function(tab_panel, tab) {
			this.updateInformationPanel();
		}, this);
		this.container_property_grid.colModel.setColumnHeader(0, 'Nome');
		this.container_property_grid.colModel.setColumnHeader(1, 'Valore');
		this.container_property_grid.on('validateedit', this.validateContainerProperty, this);
		this.container_property_grid.on('beforepropertychange', this.changeContainerProperty, this);
		this.status_bar.getComponent('progress-bar').updateProgress(1);
		this.status_bar.getComponent('progress-bar').updateText('Fatto');
	},
//	afterRender: function() {
//		Tolomeo.Composer.superclass.afterRender.apply(this);
//		this.projects_tab_panel.body.on('click', this.clickContainer, this);
//		this.projects_tab_panel.body.on('contextmenu', this.contextMenu, this);
//		this.tools_tab_panel.setActiveTab(1);
//		this.tools_tab_panel.setActiveTab(0);
//	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Cerca un contenitore dato il suo identificativo a partire da un dato contenitore.
	* @param {Object} container Contenitore dal quale parte la ricerca.
	* @param {String} id Identificativo del contenitore da cercare.
	*/
	findContainerById: function(container, id) {
		var component = null;
		if (container.id == id) {
			component = container;
		} else {
			if (container.items) {
				if (container.items.getCount) {
					var component_index = 0;
					while ((component == null) && (component_index < container.items.getCount())) {
						component = this.findContainerById(container.getComponent(component_index), id);
						component_index ++;
					}
				}
			}
		}
		return component;
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Aggiorna il pannello "Navigazione" data una configurazione JSON.
	* @param {String} JSON Configurazione JSON.
	*/
	updateNavigation: function(JSON) {
		var root_tree_node;
		if (JSON) {
			JSON = JSON.replace(/"items":/g, '"children":');
			var configuration = [Ext.util.JSON.decode(JSON)];
			root_tree_node = new Ext.tree.AsyncTreeNode(
				{
					expanded: true,
					children: configuration
				}
			);
		} else {
			root_tree_node = new Ext.tree.AsyncTreeNode(
				{
					expanded: true
				}
			);
		}
		this.tools_tab_panel.getComponent('navigation-tree-panel').setRootNode(root_tree_node);
		root_tree_node.expandChildNodes(true);
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Aggiorna il pannello "Informazioni".
	*/
	updateInformationPanel: function() {
		if (this.project) {
			if (this.project.type == 'custom') {
				if (this.tools_tab_panel.getActiveTab() == this.tools_tab_panel.getComponent('containers-accordion')) {
					this.status_bar.getComponent('information-panel').body.dom.innerHTML = 'Trascinare un contenitore a scelta all\'interno di un contenitore del progetto attivo';
				} else if (this.tools_tab_panel.getActiveTab() == this.tools_tab_panel.getComponent('navigation-tree-panel')) {
					this.status_bar.getComponent('information-panel').body.dom.innerHTML = 'Selezionare un contenitore del progetto';
				}
			} else {
				if (this.tools_tab_panel.getActiveTab() == this.tools_tab_panel.getComponent('containers-accordion')) {
					this.status_bar.getComponent('information-panel').body.dom.innerHTML = 'Aggiungere un nuovo progetto';
				} else if (this.tools_tab_panel.getActiveTab() == this.tools_tab_panel.getComponent('navigation-tree-panel')) {
					this.status_bar.getComponent('information-panel').body.dom.innerHTML = 'Selezionare un contenitore del progetto';
				}
			}
		} else {
			this.status_bar.getComponent('information-panel').body.dom.innerHTML = 'Aggiungere un nuovo progetto';
		}
	}, 
	/**
	* @method
	* @member Tolomeo.Composer
	* Aggiunge un progetto nuovo.
	*/
	addProject: function() {
		this.projects_tab_panel.body.on('click', this.clickContainer, this);
		this.projects_tab_panel.body.on('contextmenu', this.contextMenu, this);
		this.tools_tab_panel.setActiveTab(1);
		this.tools_tab_panel.setActiveTab(0);
		this.project_creation_window = new Ext.Window(
			{
				title: 'Creazione progetto',
				layout: 'form',
				width: 250,
				resizable: false,
				bodyStyle: 'padding: 4px 4px 0px 4px',
				labelWidth: 50,
				modal: true,
				items: [
					new Ext.form.TextField(
						{
							itemId: 'project-name-text-field',
							width: 173,
							fieldLabel: 'Nome'
						}
					),
					new Ext.form.ComboBox(
						{
							itemId: 'project-type-combo-box',
							width: 173,
							fieldLabel: 'Tipo',
							triggerAction: 'all',
							mode: 'local',
							store: new Ext.data.ArrayStore(
								{
									fields: [
										'value',
										'text'
									],
									data: [
										[
											0,
											'Personalizzato'
										],
										[
											1,
											'Internet'
										],
										[
											2,
											'Intranet'
										],
										[
											3,
											'Intranet Tab'
										],
										[
											4,
											'Stradario'
										]
									]
								}
							),
							valueField: 'value',
							displayField: 'text',
							value: 0,
							editable: false
						}
					)
				],
				buttons: [
					new Ext.Button(
						{
							text: 'OK',
		        			tooltip: 'Conferma la creazione del progetto',
		        			listeners: {
		        				scope: this,
		        				click: function(button, event) {
									switch (this.project_creation_window.getComponent('project-type-combo-box').value) {
										case 0: {
											this.project = new Tolomeo.Project(
												{
													droppable: true,
													type: 'custom'
												}
											);
											break;
										}
										case 1: {
											this.project = new Tolomeo.Project(
												{
													type: 'internet',
													items: [
														new Tolomeo.TolomeoInternetLayout()
													]
												}
											);
											break;
										}
										case 2: {
											this.project = new Tolomeo.Project(
												{
													type: 'intranet',
													items: [
														new Tolomeo.TolomeoIntranetLayout()
													]
												}
											);
											break;
										}
										case 3: {
											this.project = new Tolomeo.Project(
												{
													type: 'intranet-tab',
													items: [
														new Tolomeo.TolomeoIntranetTabLayout()
													]
												}
											);
											break;
										}
										case 4: {
											this.project = new Tolomeo.Project(
												{
													type: 'street-guide',
													items: [
														new Tolomeo.TolomeoStreetGuideLayout()
													]
												}
											);
											break;
										}
									}
									this.project.on('close', function(panel) {
										this.PROJECTS_IDS.remove(panel.id);
									}, this);
									this.PROJECTS_IDS.push(this.project.id);
		        					if (this.project_creation_window.getComponent('project-name-text-field').getValue() != '') {
										this.project.setTitle(this.project_creation_window.getComponent('project-name-text-field').getValue());
		        					} else {
										this.project.setTitle('Progetto ' + this.project_id);
									}
									this.project_id ++;
									this.projects_tab_panel.add(this.project);
									this.project.width = undefined;
									this.project.setWidth();
									this.project.height = undefined;
									this.project.setHeight();
									this.projects_tab_panel.setActiveTab(this.project);
									this.updateNavigation(this.project.getJSON());
									this.container = this.project;
									try {
										this.container.body.addClass('selected-panel');
									} catch (exception) {
									}
									this.container_property_grid.setSource(this.container);
									this.container_property_grid.loadContainerProperties(this.container.getProperties());
									this.updateInformationPanel();
									this.project_creation_window.close();
		        				}
		        			}
		        		}
	        		),
					new Ext.Button(
						{
							text: 'Annulla',
		        			tooltip: 'Annulla la creazione del progetto',
		        			listeners: {
		        				scope: this,
		        				click: function(button, event) {
									this.project_creation_window.close();
		        				}
		        			}
		        		}
	        		)
				]
			}
		);
		this.project_creation_window.show();
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Cambia un progetto aggiornando il pannello "Navigazione" e il pannello "Propriet&agrave;" con le informazioni el progetto corrente.
	* @param {Object} tab_panel Pannello dei progetti.
	* @param {Object} tab Pannello del progetto corrente.
	*/
	changeProject: function(tab_panel, tab) {
		if (tab != null) {
			this.project = tab;
			this.updateNavigation(this.project.getJSON());
			this.container = this.project;
			try {
				this.container.body.addClass('selected-panel');
			} catch (exception) {
			}
			this.container_property_grid.setSource(this.container);
			this.container_property_grid.loadContainerProperties(this.container.getProperties());
		} else {
			this.project = null;
			this.updateNavigation();
			this.container = null;
			this.container_property_grid.setSource();
		}
		this.updateInformationPanel();
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Aggiunge un contenitore al progetto corrente aggiornando il pannello "Navigazione" e il pannello "Propriet&agrave;" con le informazioni del contenitore.
	* @param {Object} container Contenitore al quale viene aggiunto il nuovo componente.
	* @param {Object} component Componente che viene aggiunto.
	* @param {Number} index Indice al quale viene aggiunto il nuovo componente.
	*/
	addContainer: function(container, component, index) {
		container.on('componentadd', function(component) {
			try {
				component.body.addClass('selected-panel');
			} catch (exception) {
			}
			this.updateNavigation(this.project.getJSON());
			this.container_property_grid.setSource(component);
			this.container_property_grid.loadContainerProperties(component.getProperties());
		}, this);
		if (this.container) {
			try {
				this.container.body.removeClass('selected-panel');
			} catch(exception) {
			}
		}
		this.container = component;
		this.projects_tab_panel.doLayout();
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Cerca un contenitore date le coordinate schermo a partire da un dato contenitore.
	* @param {Object} container Contenitore dal quale parte la ricerca.
	* @param {String} xy Coordinate schermo.
	*/
	findContainerByXY: function(container, xy) {
		var component = container;
		if (container.items) {
			for (var component_index = 0 ; component_index < container.items.getCount() ; component_index ++) {
				var position = container.getComponent(component_index).getPosition();
				var size = container.getComponent(component_index).getSize();
				if ((container.getComponent(component_index).clickable == true) && (xy[0] >= position[0]) && (xy[0] <= position[0] + size.width) && (xy[1] >= position[1]) && (xy[1] <= position[1] + size.height)) {
					return this.findContainerByXY(container.getComponent(component_index), xy);
				}
			}
		}
		return component;
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Seleziona un contenitore aggiornando il pannello "Propriet&agrave;".
	* @param {Object} event
	* @param {Object} target
	* @param {Object} options
	*/
	clickContainer: function(event, target, options) {
		if (this.project) {
			if (this.container) {
				try {
					this.container.body.removeClass('selected-panel');
				} catch(exception) {
				}
			}
			this.container = this.findContainerByXY(this.project, event.xy);
			if (this.container) {
				try {
					this.container.body.addClass('selected-panel');
				} catch (exception) {
				}
				this.container_property_grid.setSource(this.container);
				this.container_property_grid.loadContainerProperties(this.container.getProperties());
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Seleziona un contenitore aggiornando il pannello "Propriet&agrave;" e apre un menu contestuale con le azioni possibili su tale contenitore.
	* @param {Object} event
	* @param {Object} target
	* @param {Object} options
	*/
	contextMenu: function(event, target, options) {
		if (this.project) {
			if (this.container) {
				try {
					this.container.body.removeClass('selected-panel');
				} catch(exception) {
				}
			}
			this.container = this.findContainerByXY(this.project, event.xy);
			if (this.container) {
				try {
					this.container.body.addClass('selected-panel');
				} catch (exception) {
				}
				this.container_property_grid.setSource(this.container);
				this.container_property_grid.loadContainerProperties(this.container.getProperties());
				this.context_menu.showAt(event.xy);
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Rimuove un progetto chiedendo se salvarlo, non salvarlo o annullare la rimozione.
	* @param {Object} tab_panel Pannello dei progetti
	* @param {Object} tab Pannello del progetto corrente
	*/
	removeProject: function(tab_panel, tab) {
		Ext.MessageBox.show(
			{
				title: 'Conferma',
				msg: 'Desideri salvare il progetto "' + tab.title + '"?',
				buttons: Ext.MessageBox.YESNOCANCEL,
				fn: function(button) {
					if (button == 'yes') {
						var save_dialog = new Tolomeo.SaveDialog(Tolomeo.ExportFileServlet, tab.getJSON(), tab.title, 'json', function() {
							tab_panel.un('beforeremove', this.removeProject, this);
							tab_panel.remove(tab);
							tab_panel.on('beforeremove', this.removeProject, this);
						}, this);
						save_dialog.show();
					} else if (button == 'no') {
						tab_panel.un('beforeremove', this.removeProject, this);
						tab_panel.remove(tab);
						tab_panel.on('beforeremove', this.removeProject, this);
					} else if (button == 'cancel') {
					}
				},
				scope: this
			}
		);
		return false;
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Valida il valore di una proprieet&agrave; di un contenitore.
	* @param {Object} event
	*/
	validateContainerProperty: function(event) {
		if ((event.record.id == 'id') && (event.grid.getSource() == this.project)) {
			if (this.PROJECTS_IDS.indexOf(event.value) == -1) {
				this.PROJECTS_IDS.remove(event.originalValue);
				this.PROJECTS_IDS.push(event.value);
			} else {
				Ext.MessageBox.alert('Informazione', 'L\'identificativo "' + event.value + '" &egrave; gi&agrave; in uso per un altro progetto.');
				return false;
			}
		}
		return true;
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Cambia il valore di una proprieet&agrave; di un contenitore.
	* @param {Object} source
	* @param {Object} recordId
	* @param {Object} value
	* @param {Object} oldValue
	*/
	changeContainerProperty: function(source, recordId, value, oldValue) {
		if ((recordId == 'id') && (source == this.project)) {
			var PROJECTS = this.projects_tab_panel.removeAll(false);
			source.fireEvent('propertychange', recordId, value);
			this.projects_tab_panel.add(PROJECTS);
			this.project = source;
			this.projects_tab_panel.setActiveTab(this.project);
			this.updateInformationPanel();
		} else {
			source.fireEvent('propertychange', recordId, value);
		}
		this.projects_tab_panel.doLayout();
		this.updateNavigation(this.project.getJSON());
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Carica un progetto aggiornando il pannello "Navigazione" e il pannello "Propriet&agrave;".
	*/
	loadProject: function() {
		this.projects_tab_panel.body.on('click', this.clickContainer, this);
		this.projects_tab_panel.body.on('contextmenu', this.contextMenu, this);
		this.tools_tab_panel.setActiveTab(1);
		this.tools_tab_panel.setActiveTab(0);
		var load_project_dialog = new Tolomeo.LoadProjectDialog(Tolomeo.ImportFileServlet);
		load_project_dialog.on('close', function(panel) {
			if (panel.response) {
				try {
					var project_configuration = Ext.util.JSON.decode(panel.response);
					this.project = new Tolomeo.Project(
						{
							droppable: true
						}
					);
					this.project.setTitle(project_configuration.title);
					this.project.build(this.project, project_configuration);
					this.projects_tab_panel.add(this.project);
					this.projects_tab_panel.setActiveTab(this.project);
					this.updateNavigation(this.project.getJSON());
					this.container = this.project;
					this.container_property_grid.setSource(this.project);
					this.container_property_grid.loadContainerProperties(this.project.getProperties());
					this.projects_tab_panel.doLayout();
					this.updateInformationPanel();
				} catch (exception) {
					Ext.MessageBox.alert('Informazione', "Il progetto caricato non pu&ograve; essere visualizzato.");
				}
			}
		}, this);
		load_project_dialog.parent=this;
		load_project_dialog.key='';
		load_project_dialog.show();
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Salva un progetto.
	*/
	saveProject: function() {
		if (this.project) {
			var save_dialog = new Tolomeo.SaveDialog(Tolomeo.ExportFileServlet, this.project.getJSON(), this.project.title, 'json');
			save_dialog.show();
		} else {
			Ext.MessageBox.alert('Informazione', 'Non ci sono progetti da salvare.');
		}
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Rimuove un contenitore chiedendo conferma e aggiornando il pannello "Propriet&agrave;".
	*/
	removeContainer: function() {
		if (this.container) {
			if ((this.container instanceof Tolomeo.Border) || (this.container instanceof Tolomeo.HBox) || (this.container instanceof Tolomeo.VBox) || (this.container instanceof Tolomeo.Accordion) || (this.container instanceof Tolomeo.TabPanel) || (this.container instanceof Tolomeo.Button) || (this.container instanceof Tolomeo.TolomeoMap) || (this.container instanceof Tolomeo.TolomeoToolbar) || (this.container instanceof Tolomeo.TolomeoTOCPanel) || (this.container instanceof Tolomeo.TolomeoButtonTOCPanel) || (this.container instanceof Tolomeo.TolomeoTreeTOCPanel) || (this.container instanceof Tolomeo.TolomeoSearchPanel)) {
				Ext.MessageBox.confirm('Conferma', 'Desideri rimuovere il contenitore selezionato?', function(button) {
					if (button == 'yes') {
						var container = this.container.ownerCt;
						this.container.ownerCt.remove(this.container);
						if (container != this.projects_tab_panel) {
							this.container = container;
							this.container.droppable = true;
							this.container_property_grid.setSource(this.container);
							this.container_property_grid.loadContainerProperties(this.container.getProperties());
						} else if (this.projects_tab_panel.items.getCount() > 0) {
							this.project = this.projects_tab_panel.getActiveTab();
							this.container = this.project;
							this.container_property_grid.setSource(this.container);
							this.container_property_grid.loadContainerProperties(this.container.getProperties());
						} else {
							this.project = null;
							this.container = null;
							this.container_property_grid.setSource();
						}
						this.projects_tab_panel.doLayout();
					}
				}, this);
			} else {
				Ext.MessageBox.alert('Informazione', 'Questo contenitore non pu&ograve; essere rimosso.');
			}
		}
	},
	/**
	* @method
	* @member Tolomeo.Composer
	* Mostra l'anteprima del progetto corrente.
	*/
	showPreview: function() {
		this.status_bar.getComponent('progress-bar').updateProgress(0);
		this.status_bar.getComponent('progress-bar').updateText('Elaborazione ...');
		if (this.project) {
			try {
				var project_JSON = this.project.getJSON();
				project_JSON = project_JSON.replace(/\t\"id\":\s.*\n/g, '');
				var project_configuration = Ext.util.JSON.decode(project_JSON);
				var project = new Tolomeo.Project(project_configuration);
				project.buildTolomeoAPI();
				var preview_window = new Ext.Window(
					{
						title: '"' + this.project.title + '" Preview',
						width: this.projects_tab_panel.getWidth(),
						height: this.projects_tab_panel.getHeight(),
						layout: 'fit',
						border: false,
						modal: true,
						maximizable: true,
						closeAction: 'hide',
						items: [
							project
						],
						listeners: {
							scope: this,
							hide: function(panel) {
								this.projects_tab_panel.doLayout();
							}
						}
					}
				);
				preview_window.show();
			} catch(exception) {
				Ext.MessageBox.alert('Informazione', exception);
			}
		} else {
			Ext.MessageBox.alert('Informazione', 'Non ci sono progetti da visualizzare.');
		}
		this.status_bar.getComponent('progress-bar').updateProgress(1);
		this.status_bar.getComponent('progress-bar').updateText('Fatto');
	}
});
/**
* @member Tolomeo.Composer
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Composer.
* @static
*/
Tolomeo.Composer.id_count = 0;
Ext.reg('tolomeo_composer', Tolomeo.Composer);
