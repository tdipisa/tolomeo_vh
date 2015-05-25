/**
* Contenitore di tipo "Caricatore".
* Questo contenitore consente il caricamento di un file XML di preset su un server, la ricerca dei file XML di preset presenti su un server e il salvataggio di un file XML di preset da un server.
* Sia il caricamento sia la ricerca sia il salvataggio prevedono una chiamata ad una servlet che accetti determinati parametri.
* @xtype tolomeo_deployer
*/
Tolomeo.Deployer = Ext.extend(Tolomeo.Panel, {
	/**
	* @constructor
	* @member Tolomeo.Deployer
	* Costruttore.
	* @param {Object} [configuration] Configurazione iniziale.
	*/
	constructor: function(configuration) {
		Tolomeo.Deployer.superclass.constructor.apply(this, arguments);
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Identificativo alfanumerico dell'oggetto.
		*/
		this.id = 'deployer_' + Tolomeo.Deployer.id_count;
		Tolomeo.Deployer.id_count ++;
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Titolo del pannello associato all'oggetto.
		*/
		this.title = 'Deployer';
		this.layout = {
			type: 'hbox',
			align: 'stretch'
		};
		this.add(new Ext.FormPanel(
			{
				itemId: 'load-preset-panel',
				title: 'Carica Preset',
				flex: 1,
				frame: true,
				autoScroll: true,
				bodyStyle: 'padding: 4px 4px 4px 4px',
				defaults: {
					anchor: '0'
				},
				fileUpload: true,
				items: [
					new Ext.form.FieldSet(
						{
							title: 'Server',
							labelWidth: 100,
							items: [
								new Ext.form.ComboBox(
									{
										itemId: 'server-combo-box',
										width: 250,
										fieldLabel: 'Nome',
										editable: false,
										allowBlank: false,
										submitValue: false,
										triggerAction: 'all',
										mode: 'local',
										displayField: 'server',
										valueField: 'url',
										listeners: {
											scope: this,
					        		select: function(combo_box, record, index) {
					        			var isUp = record.get('isUp');
												this.load_preset_form_panel.getForm().findField('preset-name-text-field').setDisabled(!isUp);
												this.load_preset_form_panel.getForm().findField('preset-path-text-field').setDisabled(!isUp);
												this.load_preset_form_panel.getForm().findField('user-text-field').setDisabled(!isUp);
												this.load_preset_form_panel.getForm().findField('password-text-field').setDisabled(!isUp);
												this.load_preset_button.setDisabled(!isUp);
												if (!isUp) {
													Ext.MessageBox.alert('Informazione', 'Il server selezionato non &egrave; disponibile.');
												}
											}
										}
									}
								)
							]
						}
					),
					new Ext.form.FieldSet(
						{
							title: 'Credenziali',
							labelWidth: 100,
							items: [
								new Ext.form.TextField(
									{
										itemId: 'user-text-field',
										width: 250,
										fieldLabel: 'Utente',
										allowBlank: false,
										submitValue: false,
										disabled: true
									}
								),
								new Ext.form.TextField(
									{
										itemId: 'password-text-field',
										width: 250,
										inputType: 'password',
										fieldLabel: 'Password',
										allowBlank: false,
										submitValue: false,
										disabled: true
									}
								)
							]
						}
					),
					new Ext.form.FieldSet(
						{
							title: 'Preset',
							labelWidth: 100,
							items: [
								new Ext.form.TextField(
									{
										itemId: 'preset-name-text-field',
										width: 250,
										fieldLabel: 'Nome',
										allowBlank: false,
										submitValue: false,
										disabled: true,
										validator: function(value) {
											if ((value.length > 4) && (value.substr(value.length - 4) == '.xml')) {
												return true;
											}
											return false;
										}
									}
								),
								new Ext.form.TextField(
									{
										itemId: 'preset-path-text-field',
										width: 250,
										inputType: 'file',
										fieldLabel: 'Percorso',
										allowBlank: false,
										disabled: true
									}
								)
							]
						}
					),
					this.load_preset_button = new Ext.Button(
						{
							itemId: 'load-preset-button',
							width: 100,
							text: 'Carica',
		        			tooltip: 'Carica il preset sul server',
							disabled: true,
		        			listeners: {
		        				scope: this,
		        				click: function(button, event) {
									if (this.load_preset_form_panel.getForm().isValid()) {
			        					this.load_preset_load_mask.show();
										this.key = generateGuid();
										this.load_preset_form_panel.getForm().on('actioncomplete', this.loadPreset, this);
										this.load_preset_form_panel.getForm().on('actionfailed', this.loadPreset, this);
										this.load_preset_form_panel.getForm().submit(
											{
												url: Tolomeo.ProxyServlet + '?key=' + this.key + '&requestType=1'
											}
										);
									} else {
										Ext.MessageBox.alert('Informazione', 'Alcuni campi della maschera non sono corretti.');
									}
		        				}
		        			}
		        		}
	        		)
				]
			}
		));
		this.add(new Ext.FormPanel(
			{
				itemId: 'save-preset-panel',
				title: 'Salva Preset',
				flex: 1,
				frame: true,
				autoScroll: true,
				bodyStyle: 'padding: 4px 4px 4px 4px',
				defaults: {
					anchor: '0'
				},
				items: [
					new Ext.form.FieldSet(
						{
							title: 'Server',
							labelWidth: 100,
							items: [
								new Ext.form.ComboBox(
									{
										itemId: 'server-combo-box',
										width: 250,
										fieldLabel: 'Nome',
										editable: false,
										allowBlank: false,
										submitValue: false,
										triggerAction: 'all',
										mode: 'local',
										displayField: 'server',
										valueField: 'url',
										listeners: {
											scope: this,
					        				select: function(combo_box, record, index) {
					        					var isUp = record.get('isUp');
												this.save_preset_form_panel.getForm().findField('user-text-field').setDisabled(!isUp);
												this.save_preset_form_panel.getForm().findField('password-text-field').setDisabled(!isUp);
												this.search_preset_button.setDisabled(!isUp);
												if (!isUp) {
													Ext.MessageBox.alert('Informazione', 'Il server selezionato non &egrave; disponibile.');
												}
											}
										}
									}
								)
							]
						}
					),
					new Ext.form.FieldSet(
						{
							title: 'Credenziali',
							labelWidth: 100,
							items: [
								new Ext.form.TextField(
									{
										itemId: 'user-text-field',
										width: 250,
										fieldLabel: 'Utente',
										allowBlank: false,
										submitValue: false,
										disabled: true
									}
								),
								new Ext.form.TextField(
									{
										itemId: 'password-text-field',
										width: 250,
										inputType: 'password',
										fieldLabel: 'Password',
										allowBlank: false,
										submitValue: false,
										disabled: true
									}
								)
							]
						}
					),
					this.search_preset_button = new Ext.Button(
						{
							itemId: 'search-preset-button',
							width: 100,
							text: 'Ricerca',
		        			tooltip: 'Ricerca del preset sul server',
							disabled: true,
		        			listeners: {
		        				scope: this,
		        				click: function(button, event) {
									if (this.save_preset_form_panel.getForm().isValid()) {
			        					this.search_preset_load_mask.show();
										this.save_preset_form_panel.getForm().findField('preset-name-combo-box').setDisabled(true);
										this.save_preset_button.setDisabled(true);
										this.key = generateGuid();
										this.save_preset_form_panel.getForm().on('actioncomplete', this.searchPreset, this);
										this.save_preset_form_panel.getForm().on('actionfailed', this.searchPreset, this);
										this.save_preset_form_panel.getForm().submit(
											{
												url: Tolomeo.ProxyServlet + '?key=' + this.key + '&requestType=0'
											}
										);
									} else {
										Ext.MessageBox.alert('Informazione', 'Alcuni campi della maschera non sono corretti.');
									}
		        				}
		        			}
		        		}
	        		),
	        		new Ext.Spacer(
	        			{
	        				height: 3
	        			}
	        		),
					new Ext.form.FieldSet(
						{
							title: 'Preset',
							labelWidth: 100,
							items: [
								new Ext.form.ComboBox(
									{
										itemId: 'preset-name-combo-box',
										width: 250,
										fieldLabel: 'Nome',
										editable: false,
										allowBlank: false,
										submitValue: false,
										disabled: true,
										triggerAction: 'all',
										mode: 'local',
										store: new Ext.data.ArrayStore(
											{
												fields: [
													'nome'
												]
											}
										),
										valueField: 'nome',
										displayField: 'nome'
									}
								)
							]
						}
					),
					this.save_preset_button = new Ext.Button(
						{
							itemId: 'save-preset-button',
							width: 100,
							text: 'Salva',
		        			tooltip: 'Salva il preset dal server',
							disabled: true,
		        			listeners: {
		        				scope: this,
		        				click: function(button, event) {
									if (this.save_preset_form_panel.getForm().isValid()) {
//			        					this.save_preset_load_mask.show();
//										this.key = generateGuid();
//										this.save_preset_form_panel.getForm().on('actioncomplete', this.savePreset, this);
//										this.save_preset_form_panel.getForm().on('actionfailed', this.savePreset, this);
//										this.save_preset_form_panel.getForm().submit(
//											{
//												url: Tolomeo.ProxyServlet + '?key=' + this.key + '&requestType=2'
//											}
//										);
										var authorization = CrossDomainRequest.base64_encode(this.load_preset_form_panel.getForm().findField('user-text-field').getValue() + ':' + this.load_preset_form_panel.getForm().findField('password-text-field').getValue());
										this.el.insertHtml(
											'beforeBegin',
											'<form action="' + Tolomeo.ProxyServlet + '" target="_BLANK" method="POST" style="display: none;"><textarea name="requestType">2</textarea><textarea name="servletName">TolomeoLoadPresetServlet</textarea><textarea name="url">' + this.save_preset_form_panel.getForm().findField('server-combo-box').getValue() + '</textarea><textarea name="Authorization">' + authorization + '</textarea><textarea name="filename">' + this.save_preset_form_panel.getForm().findField('preset-name-combo-box').getValue() + '</textarea></form>'
										).submit();
									} else {
										Ext.MessageBox.alert('Informazione', 'Alcuni campi della maschera non sono corretti.');
									}
		        				}
		        			}
		        		}
	        		)
				]
			}
		));
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Pannello del caricamento.
		*/
		this.load_preset_form_panel = this.getComponent('load-preset-panel');
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Pannello della ricerca e del salvataggio.
		*/
		this.save_preset_form_panel = this.getComponent('save-preset-panel');
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Maschera del caricamento.
		*/
		this.load_mask = new Ext.LoadMask(Ext.getBody(),
			{
				msg: "Caricamento deployer..."
			}
		);
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Maschera del caricamento di un file XML di preset.
		*/
		this.load_preset_load_mask = new Ext.LoadMask(Ext.getBody(),
			{
				msg: "Caricamento preset..."
			}
		);
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Maschera della ricerca di un file XML di preset.
		*/
		this.search_preset_load_mask = new Ext.LoadMask(Ext.getBody(),
			{
				msg: "Ricerca preset..."
			}
		);
		/**
		* @cfg
		* @member Tolomeo.Deployer
		* Maschera del salvataggio di un file XML di preset.
		*/
		this.save_preset_load_mask = new Ext.LoadMask(Ext.getBody(),
			{
				msg: "Caricamento preset..."
			}
		);
	},
	/**
	* @method
	* @member Tolomeo.Deployer
	* Esegue tutte le operazioni che devono essere eseguite dopo la renderizzazione del contenitore.
	*/
	afterRender: function() {
		Tolomeo.Deployer.superclass.afterRender.apply(this);
		this.load_mask.show();
		var request = new CrossDomainRequest(Tolomeo.ServerListServlet, 'POST', this);
		this.onSuccess = function(response) {
			var SERVERS = Ext.util.JSON.decode(response.responseText);
			var store = new Ext.data.ArrayStore(
				{
					fields: [
						'server',
						'url',
						'isUp'
					]
				}
			);
			for (var server_index = 0 ; server_index < SERVERS.length ; server_index ++) {
				store.data.add(new Ext.data.Record(
					{
						'server': SERVERS[server_index].server,
						'url': SERVERS[server_index].url,
						'isUp': SERVERS[server_index].isUp
					}
				));
			}
			store.sort('server', 'ASC');
			this.load_preset_form_panel.getForm().findField('server-combo-box').store = store;
			this.save_preset_form_panel.getForm().findField('server-combo-box').store = store;
			this.load_mask.hide();
		};
		this.onFailure = function(response) {
		};
		request.send();
	},
	/**
	* @method
	* @member Tolomeo.Deployer
	* Esegue il caricamento del file XMl di preset server.
	* Il caricamento prevede una chiamata ad una servlet che accetti determinati parametri.
	* @param {Object} form
	* @param {Object} action
	*/
	loadPreset: function(form, action) {
		var request = new CrossDomainRequest(Tolomeo.ProxyServlet, 'POST', this);
		request.addParameter('key', this.key);
		request.addParameter('requestType', 1);
		request.addParameter('servletName', 'TolomeoSavePresetServlet');
		request.addParameter('url', this.load_preset_form_panel.getForm().findField('server-combo-box').getValue());
		request.setAuthorization(this.load_preset_form_panel.getForm().findField('user-text-field').getValue(), this.load_preset_form_panel.getForm().findField('password-text-field').getValue());
		request.addParameter('filename', this.load_preset_form_panel.getForm().findField('preset-name-text-field').getValue());
		request.addParameter('filecontent', this.load_preset_form_panel.getForm().findField('preset-path-text-field').getValue());
		this.onSuccess = function(response) {
			this.load_preset_load_mask.hide();
			Ext.MessageBox.alert('Informazione', Ext.util.JSON.decode(response.responseText).message);
		};
		this.onFailure = function(response) {
			this.load_preset_load_mask.hide();
			Ext.MessageBox.alert('Informazione', Ext.util.JSON.decode(response.responseText).message);
		};
		this.onAuthorizationFailure = function(response) {
			this.load_preset_load_mask.hide();
			Ext.MessageBox.alert('Informazione', 'Utente e/o Password non validi.');
		};
		request.send();
	},
	/**
	* @method
	* @member Tolomeo.Deployer
	* Esegue la ricerca dei file XML di preset su un server.
	* La ricerca prevede una chiamata ad una servlet che accetti determinati parametri.
	* @param {Object} form
	* @param {Object} action
	*/
	searchPreset: function(form, action) {
		var request = new CrossDomainRequest(Tolomeo.ProxyServlet, 'POST', this);
		request.addParameter('key', this.key);
		request.addParameter('requestType', 0);
		request.addParameter('servletName', 'TolomeoPresetFileListServlet');
		request.addParameter('url', this.save_preset_form_panel.getForm().findField('server-combo-box').getValue());
		request.setAuthorization(this.save_preset_form_panel.getForm().findField('user-text-field').getValue(), this.save_preset_form_panel.getForm().findField('password-text-field').getValue());
		this.onSuccess = function(response) {
			var PRESETS = Ext.util.JSON.decode(response.responseText);
			this.save_preset_form_panel.getForm().findField('preset-name-combo-box').store.removeAll();
			for (var preset_index = 0 ; preset_index < PRESETS.length ; preset_index ++) {
				this.save_preset_form_panel.getForm().findField('preset-name-combo-box').store.add(new Ext.data.Record(
					{
						'nome': PRESETS[preset_index].nome
					}
				));
			}
			this.save_preset_form_panel.getForm().findField('preset-name-combo-box').store.sort('nome', 'ASC');
			this.save_preset_form_panel.getForm().findField('preset-name-combo-box').setDisabled(false);
			this.save_preset_button.setDisabled(false);
			this.search_preset_load_mask.hide();
		};
		this.onFailure = function(response) {
			var PRESETS = Ext.util.JSON.decode(response.responseText);
			this.save_preset_form_panel.getForm().findField('preset-name-combo-box').store.removeAll();
			for (var preset_index = 0 ; preset_index < PRESETS.length ; preset_index ++) {
				this.save_preset_form_panel.getForm().findField('preset-name-combo-box').store.add(new Ext.data.Record(
					{
						'nome': PRESETS[preset_index].nome
					}
				));
			}
			this.save_preset_form_panel.getForm().findField('preset-name-combo-box').store.sort('nome', 'ASC');
			this.save_preset_form_panel.getForm().findField('preset-name-combo-box').setDisabled(false);
			this.save_preset_button.setDisabled(false);
			this.search_preset_load_mask.hide();
		};
		this.onAuthorizationFailure = function(response) {
			this.search_preset_load_mask.hide();
			Ext.MessageBox.alert('Informazione', 'Utente e/o Password non validi.');
		};
		request.send();
	},
	/**
	* @method
	* @member Tolomeo.Deployer
	* Esegue il salvataggio dei file XML di preset da un server.
	* Il salvataggio prevede una chiamata ad una servlet che accetti determinati parametri.
	* @param {Object} form
	* @param {Object} action
	*/
	savePreset: function(form, action) {
		var request = new CrossDomainRequest(Tolomeo.ProxyServlet, 'POST', this);
		request.addParameter('key', this.key);
		request.addParameter('requestType', 2);
		request.addParameter('servletName', 'TolomeoLoadPresetServlet');
		request.addParameter('url', this.save_preset_form_panel.getForm().findField('server-combo-box').getValue());
		request.setAuthorization(this.save_preset_form_panel.getForm().findField('user-text-field').getValue(), this.save_preset_form_panel.getForm().findField('password-text-field').getValue());
		request.addParameter('filename', this.save_preset_form_panel.getForm().findField('preset-name-combo-box').getValue());
		this.onSuccess = function(response) {
			this.save_preset_load_mask.hide();
		};
		this.onFailure = function(response) {
			this.save_preset_load_mask.hide();
		};
		this.onAuthorizationFailure = function(response) {
			this.save_preset_load_mask.hide();
			Ext.MessageBox.alert('Informazione', 'Utente e/o Password non validi.');
		};
		request.send();
	}
});
/**
* @member Tolomeo.Deployer
* @property {Number} id_count Contatore per l'identificativo di ciascun oggetto di tipo Tolomeo.Deployer.
* @static
*/  
Tolomeo.Deployer.id_count = 0;
Ext.reg('tolomeo_deployer', Tolomeo.Deployer);
