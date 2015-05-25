

function toloServerMappe(server) {
	
	/* 
	this.id						= null;
	this.nome 					= null;
	this.typeDescription       	= "Mapserver";
	this.typeCode             	= 0;
	this.nomeCredenziale   		= null;
	this.allowServerConnection 	= false;
	this.url          		  	= null;
	this.serverOpts				= null;
	*/
	if (server!=null) {
		Ext.apply(this, server);
	}
	
}

