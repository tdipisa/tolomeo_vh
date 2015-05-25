
Ext.QuickTips.init();

/** 
* La finestra di salvataggio, permette all'utente di effettuare il salvataggio in locale di un file.
*/
tolomeo.editor.SaveFileDialog = Ext.extend(Ext.Window, {
	/**
	* @cfg
	* Nome del file
	*/
	textFileName : "",
	/**
	* @cfg
	* Dove deve essere renderizzata la finestra
	*/
	renderTo     : Ext.getBody(),
	/**
	* @cfg
	* larghezza
	*/
	width        : 400,
	/**
	* @cfg
	* Altezza
	* 
	*/
	height       : 110,	
	/**
	* @cfg
	* Titolo finestra
	*/
	title        : 'Save Xml file',
	/**
	* @cfg
	* Ridimensionabile
	*/
	resizable: false,
	/**
	* @cfg
	* Bordo
	*/
	border: false,
	/**
	* @cfg
	* Modale
	*/
	modal: true,
	/**
	* @cfg
	* Ridimensionabile a tutto schermo
	*/
	maximizable: false,
	/**
	* @cfg
	* Padre
	*/
	parent: null,
	/**
	* @method
	* inizializzazione del compponente
	*/
	initComponent: function() {
		Ext.applyIf(this, {
			items: [{
					xtype: 'form',
					frame        : true,
					bodyStyle    : 'padding: 5px',
					monitorPoll  : 50, 
					labelWidth   : 80,
					defaults     : {
						msgTarget : 'side'
					},
					items        : [{
						id: 'SaveFileDialog_fileName',
						xtype: 'textfield',
						width: 280,
						fieldLabel: 'File name',
						allowBlank: false,
						regex: /[^\\\"|:/?*<>]/,
						regexText: 'Invalid filename', 
						maskRe: /[^\\\"|:/?*<>]/,
						maxLength: 50,
						text: this.textFileName
					},{
						xtype: 'button',
						iconCls: 'icon-button-save',
						tooltip: 'save',
						height: 30,
						anchor: '0',
                        listeners: {
                        	scope: this,
                        	click: function(){
                        		this.saveFile(this);
                        	}
                        }
					}]
				}]
		});
		tolomeo.editor.SaveFileDialog.superclass.initComponent.call(this);
		Ext.getCmp('SaveFileDialog_fileName').setValue(this.textFileName);
	},
	/**
	* @method
	* Salvataggio del file
	* @param button - bottone che effettua la richiesta
	*/
	saveFile: function(button) {
		var fileName =  Ext.getCmp('SaveFileDialog_fileName').getValue();
		
		var re = /(?:\.([^.]+))?$/;
		var ext = re.exec(fileName)[1];
		if (ext=="xml"){
			fileName = fileName.substring(0,fileName.length - 4);
		}else{
			ext="xml";
		}
		if (this.validateFileName(fileName + "." + ext)){
		
			button.el.insertHtml(
				'beforeBegin', 
				'<form action="'+tolomeo.editor.editorConfig.url_save_xml+'" target="_BLANK" method="POST" style="display:none"><textarea NAME="fileContent">'+tolomeo.editor.globalConfig.textEditor+'</textarea><textarea NAME="fileName">'+fileName+'</textarea><textarea NAME="fileExt">'+ext+'</textarea></form>'
			).submit({
				waitMsg: 'Saving xml file...',
				success: function(fp, o) {
					alert('Processed file "' + o.result.file + '" on the server');
				}
			});
			this.close();
		}
	},
	/**
	* @method
	* Validazione del nome del file immesso
	* @param str - nome del file
	*/
	validateFileName: function(str) {
		   if (/^[^\\\/\:\*\?\"\<\>\|\.]+(\.[^\\\/\:\*\?\"\<\>\|\.]+)+$/.test(str)) {
		      return true;
		   }
		   else {
       			Ext.Msg.show({
     			   title:'Save Xml file',
     			   msg: 'Invalid file name',
     			   buttons: Ext.Msg.OK,
     			   icon: Ext.MessageBox.WARNING
     			});
		      return false;
		   }
		}
});

