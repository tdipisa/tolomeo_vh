/**
* Finestra per la gestione delle richieste cross domain di download di un file 
* All'interno delle diverse form che compongono l'oggetto viene gestista 
* la politica di passaggio di parametri e recupero del file dalla risposta per le
* cross domain request  
*/

Tolomeo.SaveDialog = Ext.extend(Ext.Window, {
	/**
	* @constructor
	* @member Tolomeo.SaveDialog
	* @param {String} url percorso per la richiesta
	* @param {String} file_content contenuto del file
	* @param {String} file_name nome del file
	* @param {String} file_type tipo del file
	* @param {Function} handler procedura di chiusura della finestra 
	* @param scope oggetto che gestisce la risposta
	*/
		constructor: function(URL, file_content, file_name, file_type, handler, scope) {
			this.URL = URL;
			this.file_content = file_content;
			this.file_name_def = file_name;
			this.file_type = file_type;
			this.handler = handler;
			this.scope = scope;
			this.resizable = false;
			this.border = false;
			this.modal = true;
			this.maximizable = false;
			this.closable = false;
			this.closeAction = 'close';
			this.width = 350;
			Tolomeo.SaveDialog.superclass.constructor.apply(this);
		},
		initComponent: function() {
			Ext.applyIf(this, {
				items:[
					{
						xtype: 'form',
			        	id: 'form_save',
			        	frame: true,
			        	title: 'Salvataggio',
			        	bodyStyle:'padding:5px 5px 0',
			        	width: 350,
						items: [
			        		{
								xtype: 'textfield',
								id: 'Fielname',	
							    fieldLabel: 'Nome del file',
							    name: 'nomefile',
							    value : this.file_name_def,
							    allowBlank: false
			            	}
			        	],
						buttons: [
			        		{
			            		text: 'Salva',
			            		tooltip : "Salva il file",
			            		scope : this,
				            	handler: function(button) {
				            		var myform = this.items.itemAt(0).getForm();
									if (myform.isValid()) {
										this.el.insertHtml(
										'beforeBegin',
										'<form action="' + this.URL + '" target="_BLANK" method="POST" style="display:none"><textarea NAME="fileContent">' + this.file_content + '</textarea><textarea NAME="fileName">' + myform.getValues().nomefile + '</textarea><textarea NAME="fileExt">' + this.file_type + '</textarea></form>'
										).submit({
											waitMsg: 'Saving Composer file...',
											success: function(fp, o) {
												Ext.MessageBox.alert('Attenzione', 'Processed file "' + o.result.file + '" on the server');
												this.close();
											},
											failure: function(fp, o) {
												Ext.MessageBox.alert('Attenzione', 'Errore nel Salvataggio del file:');
												this.close();
											}
										});
				            			this.close();
									} else {
										Ext.MessageBox.alert('Attenzione', 'Assegnare nome al file.');
									}
									if (this.handler) {
										this.scope.handler = this.handler;
										this.scope.handler();
										this.scope.handler = null;
									}
			        			}
			        		},
			        		{
				            	tooltip: 'Annulla il salvataggio del file',
								text: 'Annulla',
								scope : this,
				            	handler: function(button) {
				            		this.close();
				            	}
			        		}
			        	]
					}
				]
			});
			Tolomeo.SaveDialog.superclass.initComponent.call(this);
		}
});



