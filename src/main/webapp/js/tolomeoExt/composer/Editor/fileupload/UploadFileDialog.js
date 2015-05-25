
Ext.QuickTips.init();

/** 
* La finestra per il caricamento di un file in locale
*/
tolomeo.editor.UploadFileDialog = Ext.extend(Ext.Window, {
	/**
	* @cfg
	* Dove deve essere renderizzata la finestra
	*/
	renderTo     : Ext.getBody(),
	/**
	* @cfg
	* Larghezza
	*/
	width        : 400,
	/**
	* @cfg
	* Altezza
	*/
	height       : 110,
	/**
	* @cfg
	* Titolo
	*/
	title        : 'Select Xml file',

	/**
	* @cfg
	* Se la finestra e' un frame
	*/
	frame		 : true,
	/**
	* @cfg
	* Nome di deafult della servlet per il caricamento del file
	*/
	url_import_xml: 'ImportFileServlet',
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
	* Chiave UID utilizzata per la comunicazione con la servlet
	*/
	key: '',
	/**
	* @cfg
	* Padre
	*/
	parent: null,
	/**
	* @method
	* Funzione chiamata alla risposta della servlet
	* @param o - risposta della servlet
	*/
	onResponse: function(o) {
		if (o.readyState == 4) {
			if (o.status == 200) {
				var res=o.responseText;
				this.parent.textEditor.setValue(res);
				this.close();
			} else {
				//FAILURE
			}
		}			
	},
	/**
	* @method
	* inzializzazione componente
	*/
	initComponent: function() {
		Ext.applyIf(this, {
			items: [
				{
					xtype: 'form',
					bodyStyle    : 'padding: 5px',
					frame        : true,
					fileUpload: true,
					//headers: {'Content-type':'multipart/form-data'},
					headers: {'Content-type':'application/x-www-form-urlencoded'},						
					bodyStyle    : 'padding: 5px',
					monitorValid : true,
					monitorPoll  : 50, 
					labelWidth   : 50,   
					defaultType  : 'textfield',
					defaults     : {
						msgTarget : 'side',
						anchor    : '0'
					},
					items        : [
						{
							fieldLabel : 'File',
							allowBlank : false,
							style:'width: 200px',
							inputType  : 'file'
						},{
							xtype: 'button',
							iconCls: 'icon-button-load',
							tooltip: 'load',
							height: 30,
							listeners: {
								scope: this,
								click: function(){
									var myform = this.items.itemAt(0).getForm();
									myform.sendRequest= function(form, action) {
										var req=new CrossDomainRequest(form.xparent.parent.url_import_xml , "POST");
										req.addParameter("key", form.xparent.parent.key);
										req.addParameter("upload", "false");
										req.form=this;
										req.onSuccess=function(response){													
											response.parent.form.xparent.parent.onResponse(response);
										}
										req.onFailure=function(response){
										}
										req.send();	
									};
									myform.xparent=this.items.itemAt(0);
									if(myform.isValid()){
										myform.on("actioncomplete", function(form, action){
											form.sendRequest(form,action);											
										});
										myform.on("actionfailed", function(form, action){
											form.sendRequest(form,action);
										});	
										myform.submit({
											url: this.url_import_xml + "?key="+this.key+"&upload=true",
											waitMsg: 'Saving xml file...',
											scope: this
										});
									}
								}
							}
						}
					]
				}
			]
		});
		tolomeo.editor.UploadFileDialog.superclass.initComponent.call(this);
		this.items.itemAt(0).parent=this;
	}
	
});

