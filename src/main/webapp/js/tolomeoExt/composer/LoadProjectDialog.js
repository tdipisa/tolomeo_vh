/**
* Finestra per la gestione delle richieste cross domain dell'upload.
* All'interno delle diverse form che compongono l'oggetto viene gestista 
* la politica di passaggio di parametri e recupero del file dalla risposta per le
* cross domain request  
*/
Tolomeo.LoadProjectDialog = Ext.extend(Ext.Window, {
	/**
	* @constructor
	* @member Tolomeo.LoadProjectDialog
	* @param {String} _url URL della richiesta.
	*/
	constructor: function(_url){
		this.url= _url;
		this.resizable = false;
		this.border =  false;
		this.modal = true;
		this.maximizable = false;
		this.closable = true;
		this.closeAction = 'close';
		this.width = 350;
		this.frame = true;
		this.onResponse = function(o) {
			if (o.readyState == 4) {
				if (o.status == 200) {
					var res=o.responseText;
					this.response=res;
					this.close();
				} else {
					//FAILURE
				}
			}			
		};
		Tolomeo.LoadProjectDialog.superclass.constructor.apply(this);
	},
	/**
	* @method
	* @member Tolomeo.LoadProjectDialog
	* genera un valore alfanumerico casuale di 32 caratteri
	* @return {String} id alfanumerico
	*/
	generateGuid: function(){
		var result, i, j;
		result = '';
		for(j=0; j<32; j++){
			if( j == 8 || j == 12|| j == 16|| j == 20) result = result + '-';
			i = Math.floor(Math.random()*16).toString(16).toUpperCase();
			result = result + i;
		}
		return result
	},
	initComponent: function() {
		Ext.applyIf(this, {
			guid : generateGuid(),
			items: [
				{
					xtype: 'form',
					parent:this,
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
							inputType  : 'file'
						},{
							xtype: 'button',
							iconCls: 'icon-button-load',
							tooltip: 'load',
							width: 30,
							height: 30,
							listeners: {
								scope: this,
								click: function() {
									var myform = this.items.itemAt(0).getForm();
									myform.sendRequest = function(form, action) {
										var req = new CrossDomainRequest(this.parent.url, 'POST');
										req.addParameter('key', this.parent.guid);
										req.addParameter('upload', 'false');
										req.form = this;
										req.onSuccess = function(response) {
											this.form.parent.onResponse(response);
											this.form.parent.close();
										}
										req.onFailure = function(response) {
											Ext.MessageBox.alert('Attenzione', 'Impossibile caricare il progetto richiesto' );	
										}
										req.send();
									};
									myform.xparent = this.items.itemAt(0);
									if (myform.isValid()) {
										myform.on('actioncomplete', function(form, action) {
											form.sendRequest(form,action);
										});
										myform.on('actionfailed', function(form, action) {
											form.sendRequest(form,action);
										});
										myform.submit(
											{
												url: this.url + '?key=' + this.guid + '&upload=true',
												waitMsg: 'Caricamento progetto...',
												scope: this
											}
										);
									}
								}
							}
						}
					]
				}
			]
		});
		Tolomeo.LoadProjectDialog.superclass.initComponent.call(this);
	}
});

