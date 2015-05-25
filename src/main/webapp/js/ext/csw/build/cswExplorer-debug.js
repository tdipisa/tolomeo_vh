/*!
 * Tolomeo is a developing framework for visualization, editing,
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify 
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License,
 *  or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *  FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo;
 *  if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 *  
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo � un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo � un software libero; � possibile redistribuirlo e / o
 *  modificarlo sotto i termini della GNU Lesser General Public License,
 *  come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 * 
 * Tolomeo � distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 * IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario,
 *  si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
 * 
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo � sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 */

/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Function: isDCValidName
 *	Verifica che il parametro passato sia uno dei nomi Dublin Core ammessi dallo standard
 *	secondo la speicifica: OpenGis Catalog Services Specifications Version 2.0.2.
 *  Necessario per catturare solo i campi dc compresi nello standard e non tutti quanti.
 *	
 *	Parameters:
 *		
 *		name - {string} il parametro da controllare
 *	
 *	Returns:
 *		{boolean} _true_ se il parametro � uno dei nomi DC nello standard, _false_ altrimenti.
 */
var isDCValidName= function (name){
	
	if(name=='abstract') return true;
	if(name=='creator') return true;
	if(name=='contributor') return true;
	if(name=='subject') return true;
	if(name=='description') return true;
	if(name=='publisher') return true;
	if(name=='date') return true;
	if(name=='type') return true;
	if(name=='format') return true;
	if(name=='identifier') return true;
	if(name=='source') return true;
	if(name=='language') return true;
	if(name=='relation') return true;
	if(name=='coverage') return true;
	if(name=='rights') return true;
	//if(name=='URI') return true; //not in standard
	return false;

}
/**
 *	Function: CSW2ExtConvert
 *	
 *	Converte i record CSW ritornati dal formatter di OpenLayers in un formato Extjs comprensibile da Extjs
 *	 utile alle funzionalit� dell'applicazione.
 *	
 *	Parameters:
 *	      v - Il valore del dato cos� come viene ritornato dal Reader, se non definito verr� utilizzato il valore di default..
 *	   record - L'oggetto contenente i dati della riga come ritornati dal reader. a seconda del tipo di reader,
 *			   questo pu� essere un Array (ArrayReader), un oggetto (JsonReader), o un documento XML (XMLReader).
 *	
 *	Returns:
 *	
 *	   {object} - L'oggetto JavaScript da assegnare allo specifico campo
 *	
*/
var  CSW2ExtConvert = function (v,record){
		//thumbnail
		if( this.name=='thumbnail'){
			var founded;
			var rec=record.raw['URI'];
			if(!rec) return;
			for(var i=0;i<rec.length;i++){
				if( rec[i].name == 'thumbnail' ){
					founded=rec[i];
				}
			}
			return founded;
		//map resource
		}else if(this.name=='map'){
			var founded=new Array();
			var rec=record.raw['URI'];
			if(!rec) return founded;
			for(var i=0;i<rec.length;i++){
				if( rec[i].protocol == 'OGC:WMS-1.1.1-http-get-map' || rec[i].protocol == 'OGC:WMS-1.3.0-http-get-map' ){
					founded.push(rec[i]);
				}
			}
			return founded;
		//Download
		}else if(this.name=='downloads'){
			var founded=new Array();
			var rec=record.raw['URI'];
			if(!rec) return founded;
			for(var i=0;i<rec.length;i++){
				if( rec[i].protocol == 'WWW:DOWNLOAD-1.0-http--download' ){
					founded.push(rec[i]);
				}
			}
			return founded;
		
		//DC
		}else if(this.name=="dc"){
			var dc = new Array()
			for( el in record.raw ){
				if ( isDCValidName(el) ){ //TODO Select only DC
					dc[el]=record.raw[el]; 
				}
			}
			return dc;
		//Other fields, give the right array or single value
		}else if(record.raw[this.name]){
				if(record.raw[this.name] instanceof Array){
					
					if(record.raw[this.name].length ==1){
						return record.raw[this.name][0].value ? record.raw[this.name][0].value : record.raw[this.name][0] ;
					}else{
						var ret=new Array()
						for(var i=0; i<record.raw[this.name].length;i++){
							ret.push( record.raw[this.name][i].value );
						}
						return ret;
					}
				//if record is not an instance of Array
				}else{
					return record.raw[this.name];
				}
			}else{
				return undefined;
			}
		
	
}
	

/** Class: CSWRecord
 * 
 * Tutti i campi CSW disponibili all' applicazione. Comprende
 * i campi nel namespace dc, dct, ows previsti dallo standard
 * delle risposte CSW getRecords.
 * Crea una sottoClasse di Ext.data.Record.
 * 
 *
 * Inherits from: 
 * - <Ext.data.Record>
 *
 */
var CSWRecord = Ext.define('CSWRecord',{
	extend: 'Ext.data.Model',
	
	fields:	[
	    {name: 'dc',			convert:  CSW2ExtConvert },
	    {name: 'title', 		convert:  CSW2ExtConvert },
	    {name: 'creator', 		convert:  CSW2ExtConvert },
		{name: 'subject', 		convert:  CSW2ExtConvert },
		{name: 'description', 	convert:  CSW2ExtConvert },
		{name: 'abstract', 		convert:  CSW2ExtConvert },
		{name: 'publisher', 	convert:  CSW2ExtConvert },
		{name: 'contributor',	convert:  CSW2ExtConvert },
	    {name: 'date', 			convert:  CSW2ExtConvert },
	    {name: 'type',			convert:  CSW2ExtConvert },
	    {name: 'format', 		convert:  CSW2ExtConvert },
	    {name: 'identifier', 	convert:  CSW2ExtConvert },
		{name: 'source', 		convert:  CSW2ExtConvert },
		{name: 'language', 		convert:  CSW2ExtConvert },
		{name: 'relation', 		convert:  CSW2ExtConvert },
		{name: 'coverage', 		convert:  CSW2ExtConvert },
		{name: 'bounds'									 },
		{name: 'rights', 		convert:  CSW2ExtConvert },
		{name: 'projection'								 },
		{name: 'thumbnail'	,	convert:  CSW2ExtConvert },
		{name: 'map',			convert:  CSW2ExtConvert },
		{name: 'absolutePath'							 },
		{name: 'downloads'	,	convert:  CSW2ExtConvert }
		]});
/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 /**
 * Class: CSWRecordsReader 
 * Classe utilizzata dallo store per leggere i record ritornati dal server CSW
 * e costruire un oggetto Javascript adatto.
 * 
 * Inherits from: 
 * - <Ext.data.JsonReader>
 *  
 */
Ext.define('CSWRecordsReader', {
 
	extend: 'Ext.data.JsonReader',

	
	/**
	 * APIProperty: store {Ext.data.Store} Store to which this reader is attached
	 */
	store: null,

	/**
	 * Constructor: CSWRecordsReader(meta, recordType)
	 * 
	 * Parameters:
	 *  meta - {Object} Configurazione del reader. 
	 *  recordType - {Array | * Ext.data.Record}  Un array di oggetti Ext.Data.Fields oppure
	 *  			 oggetti Record. di defauld e' la classe :Ext.data.Record
	 *
	 */
	constructor: function(config) {
		 //meta, recordType
		/*
		config.metaData = config.metaData || {};
		if (!config.metaData.format) {
			config.metaData.format = new OpenLayers.Format.CSWGetRecords();
		}
		if (!config.metaData.root) {
			config.metaData.root = 'records';
		}
		
		config.metaData.totalProperty= "SearchResults.numberOfRecordsMatched";
		*/
		
		if (!config.format) {
			config.format = new OpenLayers.Format.CSWGetRecords();
		}
		if (!config.root) {
			config.root = 'records';
		}
		
		config.totalProperty= "SearchResults.numberOfRecordsMatched";

		//config.model = CSWRecord;
		//this.model = CSWRecord;
		
		// There may be information of interest in the getRecords response
		// namely SearchResults.numberOfRecordsReturned and
		// SearchResults.numberOfRecordsMatched
  	
		//CSWRecordsReader.superclass.constructor.call(this, meta, recordType);
		this.callParent(arguments);
	},


	/**
	 * Private: read 
	 * request - {Object} l'oggetto XHR che contiene il documento XML parsed. 
	 * 
	 * Returns:
	 * {Object} un blocco di dati utilizzato dal Ext.data.Store come cache degli oggetti Ext.data.Record. 
	 * 
	 */
	read : function(request) {
		var data = request.responseXML;
		
		if (!data || !data.documentElement) {
			data = request.responseText;
		}
		return this.readRecords(data);
	},

	/**
	 * Private: readRecords 
	 * data - {DOMElement | String | Object} A document element or XHR response string. 
	 * 
	 * Returns:
	 * {Object} A data block which is used by an Ext.data.Store as a cache of 
	 *  Ext.data.Record objects.
	 */
	readRecords : function(data) {
		if (typeof data === "string" || data.nodeType) {
			//data = this.metaData.format.read(data);
			data = this.format.read(data);
		}
		
		data.total= data.SearchResults.numberOfRecordsMatched;
		
		//return CSWRecordsReader.superclass.readRecords.call(this, data);
		return this.callParent(arguments);
	}
});/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWHttpProxy 
 * DataProxy che gestisce le richieste e le risposte al server CSW
 * 
 * Inherits from: 
 * - <Ext.data.HttpProxy>
 *  
 */
 Ext.define('CSWHttpProxy', {

	extend: 'Ext.data.proxy.Ajax',

	resultType: null,
	
	filterVersion: null,
	
	cswVersion: null,
	
	filter: null,
	
	XDProxy:null,
	
	sortProperty:null,
	
	sortOrder:null,
	
	/**
	  * Constructor: CSWHttpProxy
	  * 
	  * Parameters:
	  * options -				{object} oggetto contenenti i parametri della ricerca.
	  * options.url -			{string} Url verso il quale effettuare la ricerca.
	  * options.filterVersion - {string} Versione del Filtro OGC.
	  * options.resultType -	{string} 
	  * options.filter -		{OpenLayers.Filter} filtro OpenLayers per La ricerca.
	  * options.emptySearch -	{boolean} discrimina se la ricerca e' vuota.
	  * options.start -  		{number} Equivalente a StartPosition in CSW GetRecords.
	  * options.limit -  		{number} Equivalente a MaxResults in CSW GetRecords.
	  * options.XDProxy -	 	{object} Opzionale. Proxy cross domain. vedi <config>
	  * options.timeout -	 	{number} millisecondi di timeout prima che il server 
	  * options.sortProperty -	 	{string} campo da usare per l'ordinamento dei risultati (default "title") 
	  * options.sortOrder -	 	(ASC|DESC) tipo di ordinamento dei risultati (default "ASC") 
	  * options.cswVersion -	 {string} versione del CSW (se diversa da 2.0.2) 
	  *							sia considerato irraggiungibile
	  *
	  */
	constructor: function(options) {
		this.cswVersion = (options.cswVersion) ? options.cswVersion : "2.0.2";
		this.sortProperty = (options.sortProperty) ? options.sortProperty: "Title";
		this.sortOrder = (options.sortOrder) ? options.sortOrder: "ASC";
		this.limit = options.limit;
		//var conn = {
		options.currentCatalog= options.url;
		
		if (options.XDProxy) {
			if (options.XDProxy.callback) {
				options.url= options.XDProxy.url + "?" + options.XDProxy.callback + "=" + encodeURIComponent(options.url);
			} else {
				options.url= options.XDProxy.url + "?" + options.url;
			}
		}
		
		options.method= "POST";
		options.extraParams= {
		                      Request: "GetRecords", 
		                      Service: "CSW" //,
							 // constraintLanguage: "CQL_TEXT",
							 // constraint_language_version: "1.1.0",
							 // typeNames: "csw%3ARecord"
						 }
							  
;
		//options.timeout: options.timeout,
				// NOTE: this should be called "xmlData" to force 
				// ExtJS to send "text/xml" ad content type
		//options.xmlData: this.buildCSWRequestData(options)
		options.xmlData= this.buildCSWRequestData(options);
		//};            
  
		//CSWHttpProxy.superclass.constructor.call(this, conn);
		//[this, conn]
		this.callParent(arguments);
	},

	/**
	 * Method: updateRequest  
	 * Aggiorna la richiesta da inviare al Server CSW
	 * 
	 * Parameters:
	 * options - {Object} aggiorna i parametri.
	 */
	updateRequest : function(options, operation) {
		//this.conn.xmlData = this.buildCSWRequestData(options);
		 this.xmlData = this.buildCSWRequestData(options, operation);
	},
	
	/**
	* Method: buildCSWRequestData 
	* Costruisce la richiesta da inviare al server CSW
	* 
	* Returns:
	* {Object} - 	Oggetto con tutti i parametri della richiesta da inviare al server CSW.
	*   			Quando filter, filterVesrion o resultType sono null, vengono utilizzati i parametri precedenti
	*/
	buildCSWRequestData : function(options, operation) {
		//var options=this;
		this.resultType = (options.resultType) ? options.resultType : this.resultType;
		this.filterVersion = (options.filterVersion) ? options.filterVersion : this.filterVersion;
		this.filter = (options.filter) ? options.filter : this.filter;
		this.currentCatalog = (options.url) ? options.url : this.currentCatalog;
		this.sortProperty = (options.sortProperty) ? options.sortProperty : this.sortProperty;
		this.sortOrder = (options.sortOrder) ? options.sortOrder : this.sortOrder;
		var startPosition;
		if (operation) {
			startPosition = operation.start ? operation.start : 1;
		} else {
			startPosition = options.start ? options.start : 1;
		}

		var optionsCsw = {
				//if XDProxy is defined use it
				url : ( options.XDProxy ? options.XDProxy.url + "?" + options.XDProxy.callback + "=" + options.url : options.url), 
				resultType : "results",
				//startPosition : (options.start ? options.start : 1),
				startPosition : startPosition,  
				maxRecords : (this.limit ? this.limit : 10),
				outputFormat : "application/xml",
				outputSchema : "http://www.opengis.net/cat/csw/" + this.cswVersion
		};

		// If a filter has been specified, and the search is not to be empty 
		if (this.filter != null && ! options.emptySearch) {
				optionsCsw.Query = {
					ElementSetName : {
						value : this.resultType  
					},
					Constraint : {
						version : this.filterVersion,
						Filter : this.filter
					}
				};
		} else {
			optionsCsw.Query = {
					ElementSetName : {
						value : this.resultType  
					}
			};
		}

		// Sort results by a given property 
		optionsCsw.Query.SortBy = {
			SortProperty: {
				PropertyName: {value: this.sortProperty},
				SortOrder: {value: this.sortOrder}
			}	
		}; 

		var format = new OpenLayers.Format.CSWGetRecords();
		
		// INIZIO PATCH sporca per gestire il fatto che su IE formatString viene generata con NS1 in pi� e vuoto poi va in errore per NS1:xmlns
		// Non � chiaro perch� bisognerebbe indagare
		/*
		 * <csw:GetRecords xmlns:csw="http://www.opengis.net/cat/csw/2.0.2"
		  service="CSW" 
		  version="2.0.2" 
		  resultType="results"
		  outputFormat="application/xml" 
		  outputSchema="http://www.opengis.net/cat/csw/2.0.2" 
		  startPosition="1" 
		  maxRecords="12"
		 
		  xmlns:NS1="" 
		  NS1:xmlns:gmd="http://www.isotc211.org/2005/gmd" 
		 
		 >
		 <csw:Query typeNames="csw:Record">
		 <csw:ElementSetName>full</csw:ElementSetName>
		 <ogc:SortBy xmlns:ogc="http://www.opengis.net/ogc" />
		 </csw:Query>
		</csw:GetRecords>
		 */
		var formatString = format.write(optionsCsw);
		formatString = formatString.replace('xmlns:NS1=""', '');
		formatString = formatString.replace('NS1:', '');
		// FINE PATCH
		
		return formatString ;
	},
	
	doRequest: function(operation, callback, scope) {
        var writer  = this.getWriter(),
            request = this.buildRequest(operation, callback, scope);
            
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
         
        // Se definito un proxy prendo tutti i parametri e li aggiungo a url per evitare che lo faccia lui senza fare 
        
        Ext.apply(request, {
            xmlData    : this.xmlData,
            headers       : this.headers,
            timeout       : this.timeout,
            scope         : this,
            callback      : this.createRequestCallback(request, operation, callback, scope),
            //method        : this.getMethod(request),
            method        : "POST",
            disableCaching: false // explicitly set it to false, ServerProxy handles caching
        });
        
        Ext.Ajax.request(request);
        
        return request;
	}	

});

/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWGrid
 * Widget che contiene i record CSW ricercati.
 * Utilizza il Plugin RowExpander. 
 *
 * Inherits from:
 * - <Ext.grid.GridPanel>
 */
  Ext.define('CSWGrid', {

	extend: 'Ext.grid.GridPanel',
	
	/**
	 * Property: config
	 * {object} Oggetto per la configurazione  componente. Vedere <config.js>
	 */
	config:null, 
	
	/**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
	/**
	 * Property: enableHDMenu
     * {boolean} se true viene aggiunto a ogni colonna un menu che permette l'ordinamento delle colonne.
	 */ 
	enableHdMenu : false,
	/**
	 * Property: height
     * {int} altezza del componente
	 */ 
	height:290, 
	/**
	 * Property: autoScroll
     * {boolean} se true permette la comparsa della barra di scorrimento se il contenuto eccede le dimensioni del componente
	 */ 
	autoScroll:true,
	
	/**
	 * Property: title
     * {string} titolo da associare al pannello griglia
	 */
	title : null,
	/**
	 * Property: iconCls
     * {string} classe CSS associata all'icona del componente 
	 */
	iconCls : 'icon-grid',
    /**
	 * Property: autoExpandColumn
     * {string} designa la colonna che si espande automaticamente al resize
	 */
    autoExpandColumn: "title",    
    
    /**
	 * Property: i18n
	 * {Ext.i18n.Bundle} bundle for i18n messages
	 * @type 
	 */
	i18n: null,

	constructor: function(options) {
		
		var grid = this;
		
		var p = {
			ptype: 'rowexpander',
			
			rowBodyTpl : new Ext.XTemplate(
				//--thumbnail--
				'<tpl if="thumbnail">'+
					'<img src="{absolutePath}/{thumbnail.value}" class="csw-viewer-thumb" '+
						'style="" '+
						'alt="{thumbnail.description}" '+	
					'	type="{thumbnail.protocol}" '+
					'>'+
				'</tpl>'+
				
				//--showed fields--
				'<p><b>' + options.i18n.getMsg("abstract") + ': </b>{abstract}</p>'+
				'<p><b>' + options.i18n.getMsg("subject")  + ': </b>{subject}</p>'
			)};

		options.plugins = [p];

		this.callParent(arguments);
	
	},

	
	/**
	 * Constructor: initComponent 
	 * Inizializza i componenti della GUItrue
	 */
	initComponent : function() {
		this.title = this.i18n.getMsg("titleCatalogRecords");
		var grid = this;
		
		this.columns = {
				defaults : {
							//width : 20,
							sortable : false
						},
				items: [
					   {
			            xtype:'actioncolumn',
			            width:75,
			            items: [{ // ViewMD
				                iconCls: 'icon-info',
				                tooltip: this.i18n.getMsg("viewMetadata"),
				                handler: function(grid, rowIndex, colIndex) {
				                    var rec = grid.getStore().getAt(rowIndex);
				                    var dc = rec.get('dc');
				                    var identifier = rec.get('identifier');
				                    var absolutePath = rec.get('absolutePath');
				                    
				                    //open GN inteface related to this resource
				                    if(identifier){
				                    	window.open(absolutePath.substring(0,absolutePath.length-3)+"metadata.show?uuid="+ identifier);
				                    	//Shows all DC values
				                    }else{
				                    	//TODO create dc visual
				                    	var text="<ul>";
				                    	//var dc=dc;
				                    	//eg. URI
				                    	for (var el in dc){
				                    		 
				                    		if (dc[el] instanceof Array){
				                    			//cicle URI array
				                    			for(var index=0;index<dc[el].length;index++){
								
				                    				//cicle attributes of dc
				                    				if(dc[el][index].value){
				                    					text+="<li><strong>"+el+":</strong> ";
				                    					for(name in dc[el][index]){
				                    						text+="<strong>"+name+"</strong>="+dc[el][index][name]+" ";
				                    						
				                    					}
				                    					text+="</li>";
				                    				}else if(el=="abstract") {
				                    					text+="<li><strong>abstract:</strong> "+dc[el][index]+"</li> ";
				                    				}else{true
				                    					//DO NOTHING
				                    				}
				                    			}
				                    		}
				                    	}
				                    	dc+="</ul>";
				                    	var dcPan=new Ext.Panel({
				                    		html:text,
				                    		preventBodyReset:true,
				                    		autoScroll:true,
				                    		autoHeight: false,
				                    		width: 600,
				                    		height: 400
				                    		
				                    	});						
				                    	var dcWin = new Ext.Window({
				                    		title: "MetaData",
				                    		closable: true,
				                    		width:614,
				                    		resizable: false,
				                    		
				                    		draggable: true,
				                    		items: [
				                    		        dcPan	
				                    		        ]
				                    	});
				                    	dcWin.show();
				                    }

				                }
				                
				            },{ // ViewMap
				            	iconCls: 'icon-layers',
				                tooltip:  this.i18n.getMsg("viewMap"),
				                handler: function(grid, rowIndex, colIndex) {
				                    var rec = grid.getStore().getAt(rowIndex);
				                    var map = rec.get('map');

				                    //var map=rec.map;//array
				                    var bb=rec.get('bounds');
				                    var mapInfo=new Array();
				                    for(var index =0;index< map.length;index++){
				                    	mapInfo.push({wms: map[index].value, layer: map[index].name, description: map[index].description})
				                    }
				                    var LayerInfo={
				                    		title: rec.get('title'),
				                    		crs: rec.get('projection'),
				                    		layers: mapInfo,
				                    		bbox: rec.get('bounds'),
				                    		uuid: rec.get('identifier'),
				                    		gnURL: rec.get('absolutePath').substring(0,rec.get('absolutePath').length-3)
				                    };
						
				                    //TODO do elements
				                    grid.findParentByType("csw").fireEvent('ViewMap', LayerInfo ) ;

				                },
				                isDisabled: function(view, rowIndex, colIndex, item, record ) {
				                	var m = record.get('map');
				                	return !(m && m.length>0);
				                }
				            },{ // BBOX
				            	iconCls: 'icon-mapgo',
				            	tooltip: this.i18n.getMsg("viewBbox"),
				            	handler: function(grid, rowIndex, colIndex) {
				            		var rec = grid.getStore().getAt(rowIndex);
				            		
				            		var ret={
				            			bbox:rec.get('bounds'),
				            			crs:rec.get('projection')
				            		};
				            		grid.findParentByType("csw").fireEvent('zoomToExtent', ret );				            	
			                	}
				            },{
				            	
				            	iconCls: 'icon-mapgo',
				            	tooltip: this.i18n.getMsg("download"),
				            	handler: function(grid, rowIndex, colIndex, item, e, record) {
							            		var rec = grid.getStore().getAt(rowIndex);
							            		var downloads=rec.get('downloads');
							                    var links='';
							                    var mnuItems = [];
							                    
							                    //links='<b>downloads:</b>';
							                    //if( !(downloads instanceof Array) ) return '';
							                    for(var i =0;i<downloads.length;i++){
							                        
							                    	mnuItems.push({
							                    			text: downloads[i].name,
							                    			//iconCls: XXXX,
							                    			urlToOpen: downloads[i].value,
									                    	listeners: { click: {
																			fn: function() {
																				window.open(this.urlToOpen);
																				} 
																			}
										                    			}
							                    			});
							                    
							                    }
							                    var mnu = Ext.create('Ext.menu.Menu',{
							                    		items: mnuItems
							                    	});
							                    
							                    mnu.showAt(e.getXY()); 
							                    //grid.findParentByType("csw").fireEvent('zoomToExtent', ret );
				            			},
				            	isDisabled: function(view, rowIndex, colIndex, item, record ) {
						                	var m = record.get('downloads');
						                	return  !(m instanceof Array)  ;
						                }
				                    	            	
			                	}]
				},        
				{
					//id : 'title',
					text : this.i18n.getMsg("title"),
					dataIndex : "title",
					sortable : false,
					flex: 1
				}, {
					//id : 'subject',
					text : this.i18n.getMsg("subject"),
					dataIndex : "subject",
					sortable : false
				}/*,{
					//id : 'creator',
					text : this.i18n.getMsg("creator"),
					dataIndex : 'creator',
					sortable : false
				}*/,{
					//id : 'modified',
					text : this.i18n.getMsg("modified"),
					dataIndex : 'date',
					sortable : false
				
				}]
				};
				
		

		this.viewConfig = {
			forceFit : true
		};

		this.store = new Ext.data.Store({
			model: CSWRecord,
			pageSize: this.config.limit, // items per page
			autoLoad : false
		});

		this.dockedItems= [{
			xtype: 'pagingtoolbar',
			store: this.store,   // same store GridPanel is using
			dock: 'bottom',
			displayInfo: true
		}];

		/*
		this.bbar = Ext.create('CSWPagingToolbar', {
			pageSize : this.config.limit, 
			store : this.store,
			grid:this,
			displayInfo : true,
			displayMsg : this.i18n.getMsg("bbar.display"),
			emptyMsg : this.i18n.getMsg("bbar.empty"),
			beforePageText : this.i18n.getMsg("bbar.page"),
			firstText : this.i18n.getMsg("bbar.firstPage"),
			lastText : this.i18n.getMsg("bbar.lastPage"),
			prevText : this.i18n.getMsg("bbar.prevPage"),
			nextText : this.i18n.getMsg("bbar.nextPage"),
			refreshText: this.i18n.getMsg("bbar.refresh"),
			afterPageText : this.i18n.getMsg("bbar.afterPageText"),
			i18n: this.i18n
		});
		 */	
		this.callParent(arguments);
		this.reconfigure();
	},
	
	/**
	 * Method: initParameters 
	 * Inizializza i parametri della griglia. 
	 *
	 * options - {Object} opzioni di inizializzazione per il <CSWHttpProxy>
	 */
	initParameters : function (options) {
		options.XDProxy = this.config.XDProxy;
		options.cswVersion = this.config.cswVersion;
		options.limit = this.config.limit;
		options.timeout = this.config.timeout;
		options.reader = Ext.create('CSWRecordsReader', {});
		options.model = CSWRecord;
		this.store.proxy = new CSWHttpProxy(options);
		
		//setting 
		this.store.proxy.on("exception", function( DataProxy, type,  action,  options, response,args){
				//this.loadMask.hide();
        
				if(type=="remote"){
                        Ext.Msg.show({
                            title: this.i18n.getMsg("serverError.title"),
                            msg: this.i18n.getMsg("serverError.serverError.invalid"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    
                
                }else if(type=="response"){//timeout
                    if(!args && response.isTimeout && response.isTimeout==true){//TimeOut
                        Ext.Msg.show({
                            title: this.i18n.getMsg("timeout.title"),
                            msg: this.i18n.getMsg("timeout.description"),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }else if (!args){//server Error
                       Ext.Msg.show({
                         title: this.i18n.getMsg("serverError.title"),
                         msg: this.i18n.getMsg("serverError.invalid")+ ":"+response.status+ " "+response.statusText,
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                       });
                    }else{//parsing error
                        Ext.Msg.show({
                         title: this.i18n.getMsg("serverError.title"),
                         msg: this.i18n.getMsg("serverError.catalogException"),
                         buttons: Ext.Msg.OK,
                         icon: Ext.MessageBox.ERROR
                       });
                    
                    
                    }
                }
				this.store.fireEvent("loadexception"); 
                
		}, this);
		
		
		//event Handling
		this.store.on("beforeload", function (store, operation, eOpts) {
			//store.proxy.updateRequest(operation.params);
			store.proxy.updateRequest(operation);
		},this);
		
		//used for get the base url for thumnails and geonetwork resource, NEEDED if using x-domain proxy
		this.store.on("load",function (store,records,options){
			
			if (records) {
				var url=store.proxy.currentCatalog;
				
				for(var i=0;i<records.length;i++){
					var thumb;
					records[i].set('absolutePath',url);
					//set thumbnail to absolute path
					if( thumb = records[i].get('thumbnail') ){
						var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
						if(!regexp.test(thumb.value)){
							thumb.value = url +"/"+ thumb.value ;
						}
						records[i].set(	'thumbnail',thumb);
						
					}
				}
			}
			
		},this);
		
		this.enable();
		this.store.load(options.params);
	}

});
/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWCatalogChooser
 * Widget di tipo combobox per scegliere un catalogo dalla lista dei cataloghi disponibili.
 * 
 * Inherits from:
 *  - <Ext.form.ComboBox>
 *  
 */
 Ext.define('CSWCatalogChooser', {

	extend: 'Ext.form.ComboBox',

	/**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
    
	/**
	 * Property: labelWitdh
     * {number} dimensione della Label
	 */ 
	labelWitdh : 30,
	
	/**
	 * Property: name
     * {number} nome associato al componente Extjs
	 */ 
	name : "catalog",
	
	/**
	 * Property: allowBlank
     * {boolean} se true viene permesso che nella combobox ci sia
	 *			 un valore nullo
	 */
	allowBlank : true,
	/**
	 * Property: disabled
     * {boolean} se true il componente risulta disabilitato
	 *			 un valore nullo
	 */
	disabled : false,
	/**
	 * Property: fieldLabel
     * {string} Testo Label della combobox
	 */ 
	fieldLabel : null,
	/**
	 * Property: emptyText
     * {string} Testo da mostrare quando la combobox e' vuota
	 */ 
	emptyText : null,
	/**
	 * Property: mode
     * {string}  se *"local" i possibili valori vengono caricati dallo store all'avvio. Se *"remote"* vengono caricati al click.
	 *			 
	 */
	mode : "local",
	/**
	 * Property: triggerAction 
     * {string}  Azione da effettuare al trigger
	 *			 
	 */
	triggerAction : "all",
	
	/**
	 * Property: forceAction 
     * {boolean} se true il valore all'interno del componente deve essere uno di quelli predefiniti.
	 *			 se false il valore puo essere editato dall'utente		 
	 */
	forceSelection : true,
	/**
	 * Property: displayField
     * {string}  nome del campo dell'elemento all'interno dello store da mostrare 
	 */
	displayField : "name",
	/**
	 * Property: ValueField
     * {string}  nome del campo dell'elemento dello store da utilizzare come valore del componente 
	 */
	valueField : "url",

	/**
	 * Property: editable
     * {boolean}  editabilita' del campo
	 */
	editable : false,
	
	/**
	 * Property: resizable
     * {boolean}  ridimensionabilita' del menu
	 */
	resizable : false,
	
	/**
	 * Property: i18n
	 * {Ext.i18n.Bundle} bundle for i18n messages
	 * @type 
	 */
	i18n: null,

    initComponent: function(){

    	/**
         * Event: selectsupported 
         * Evento scatenato nel caso in cui la GetCapabilities abbia dato esito positivo 
         * In questo caso la ricerca viene permessa.
         */ 
    	this.addEvents("selectsupported");
    
        /**
         * Event: selectunsupported 
         * Evento scatenato nel caso in cui la GetCapabilities abbia dato esito negativo, nel caso
         * quindi di incompatibilita' tra versioni o assenza del servizio CSW. In questo caso la 
         * ricerca viene impedita, in quanto il server non risponderebbe correttamente.
         */
		this.addEvents("selectunsupported");
	    
        /**
         * Event: selectiunknownsupport 
         * Evento scatenato nel caso in cui la GetCapabilities sia stata possibile, e quindi non
         * e'possibile di verificare la compatibilita' con l'applicazione.
         * In questo caso la ricerca viene permessa ( e visualizzata una warning ).
        */ 
        this.addEvents("selectiunknownsupport");
    	
        this.listeners = { 
                         	select: { fn: this.selectListener }
        				 }; 
        this.callParent(arguments); 

    },

	/**
	 * Method: initParameters
	 * catalogs - {Array} cataloghi da cui scegliere. il formato degli elementi e' del tipo
	 * { *name:* "nome" , *url:* "url_catalogo_csw", *description:* "descrizione opzionale" } 
	 *  
	 */
	initParameters: function (catalogs) {
		
		this.store = new Ext.data.JsonStore({
			proxy: {
	    		type: 'memory'//,
	    		// reader configs
	    		//reader: {
	    		//	type: 'json',
	    		//	root: 'valori',
	    		//	idProperty: suggestProvider[i].valueFieldName // 'COD',
	    			//fields: fields //['COD', 'DESC', 'REG']
				//}
			},
			
			mode: "local",
			data: catalogs,
			autoLoad: true,
			remoteSort: false,
			fields: ["name", "url", "description"],
			sortInfo: {field: "name", direction: "ASC"}            	
		});
        this.addEvents(this.events);
	}, 
	
	
    /** 
     * Method: select
     * all'evento select viene effettuata una richiesta alla getCapabilities del server per 
     * per verificare la compatibilita' con la versione del protocollo csw. Questa 
     * funzione scatena gli eventi <selectsupported> e <selectunsupported> .
     *
     */
    selectListener: function(combo, records, eOpts ) {
       
       var catalogUrl=records[0].data.url;
       var url="";
       //build URL in "XDProxy present" case
       
       var argsString = catalogUrl 
                            + "?"
                            + "Request=GetCapabilities"
                            + "&SERVICE=CSW"
                            + "&Section=ServiceIdentification"
                            + "&outputformat=application/xml"
                            + "&AcceptVersions=" + this.cswVersion;
       
       if(this.XDProxy){
       	
       		if (this.XDProxy) {
				if (this.XDProxy.callback) {
					url= this.XDProxy.url + "?" + this.XDProxy.callback + "=" + encodeURIComponent(argsString);
				} else {
					url= this.XDProxy.url + "?" + argsString;
				}
			}
       }
       	/*
            url= this.XDProxy.url + "?" + this.XDProxy.callback + "=" 
                    + encodeURIComponent(
                            catalogUrl 
                            + "?"
                            + "Request=GetCapabilities"
                            + "&SERVICE=CSW"
                            + "&Section=ServiceIdentification"
                            + "&outputformat=application/xml"
                            + "&AcceptVersions=" + this.cswVersion
                    );
        //build url without XDProxy
        }else{
            url =   catalogUrl 
                    + "?Request=GetCapabilities"
                    +"&SERVICE=CSW"
                    +"&Section=ServiceIdentification"
                    +"&outputformat=application/xml"
                    +"&AcceptVersions=" +this.cswVersion;
        }*/
       
       Ext.Ajax.request({
            url: url ,
            scope: this,
            method: "GET",
            timeout: 10000,
            //CASE 200 OK
            success : function(response, request) {
			
                //case of OWS exception
                if( response.responseText.indexOf("ows:ExceptionReport") > 0 ){
                    //Version problem
                    if( response.responseText.indexOf("VersionNegotiationFailed") >0 ){
                        Ext.Msg.show({
                            title: this.i18n.getMsg("serverError.catalogCompatibilityProblem"),
                            msg: this.i18n.getMsg("serverError.unsupportedVersion")+ "("+ this.cswVersion + ")",
                            width: 300,
                            icon: Ext.MessageBox.ERROR
                        });
                        combo.fireEvent("selectunsupported",this.i18n.getMsg("serverError.unsupportedVersion")+ "("+ this.cswVersion + ")");
                    //Unsupported
                    }else if( response.responseText.indexOf("InvalidParameterValue") >0 && response.responseText.indexOf("locator=\"service\"")) {
                        Ext.Msg.show({
                            title: this.i18n.getMsg("serverError.catalogCompatibilityProblem"),
                            msg: this.i18n.getMsg("serverError.CSWNotAvaible"),
                            width: 300,
                            icon: Ext.MessageBox.ERROR
                        });
                        combo.fireEvent("selectunsupported",this.i18n.getMsg("serverError.CSWNotAvaible"));
                    //getCapabilities not avaible
                    }else if ( response.responseText.indexOf("exceptionCode=\"NoApplicableCode\"") ){
                       Ext.Msg.show({
                            title: this.i18n.getMsg("serverError.compatibilityInfo"),
                            msg: this.i18n.getMsg("serverError.unableToTestCapabilities"),
                            width: 300,
                            icon: Ext.MessageBox.WARNING
                        }); 
                        combo.fireEvent("selectiunknownsupport",this.i18n.getMsg("serverError.unableToTestCapabilities"));
                    }
                //CASE Capabilities tag NOT founded    
                }else if( !(response.responseText.indexOf("csw:Capabilities") > 0) ){
                     Ext.Msg.show({
                        title: this.i18n.getMsg("serverError.standardCompatibility"),
                        msg:  this.i18n.getMsg("serverError.unknownResponse"),
                        width: 300,
                        icon: Ext.MessageBox.ERROR
                     });
                     
                    combo.fireEvent("selectunsupported",this.i18n.getMsg("serverError.unknownResponse"));
                //Case Capabilities tag founded
                }else{
                    //var msg=combo.store.getAt(index).data.description;
                    var msg=records[0].data.description;
                    combo.fireEvent("selectsupported",msg);
                }
            },
            //CASE 401 402 timeout etc..
            failure : function(response, request) {
                //Timeout case
                if(response.isTimeout && response.isTimeout==true){//TimeOut
                    Ext.Msg.show({
                        title: this.i18n.getMsg("timeout.title"),
                        msg: this.i18n.getMsg("timeout.description"),
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.ERROR 
                    });
                    combo.fireEvent("selectunsupported");
                //other errors case
                }else{
                    Ext.Msg.alert(this.i18n.getMsg("serverError.title"), this.i18n.getMsg("serverError.invalid")+ "<br/> Status:"+response.status);
                    combo.fireEvent("selectunsupported",this.i18n.getMsg("serverError.invalid")+ "<br/> Status:"+response.status);
                }
            
            }         
       }); 
	}

});


/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWSearchTool
 * Pannello per l'inserimento dei criteri di ricerca.
 * 
 * Inherits from: 
 * - <Ext.form.FormPanel>
 * 
 */
Ext.define('CSWSearchTool', {
 
	extend: 'Ext.form.FormPanel',
 
	/**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
	/**
	 * Property: autoWidth
     * {boolean} se true, imposta la larghezza del componente automaticamente 
	 */ 
	autoWidth: true,

	/**
	 *Parameter: dateFormat 
	 * ISO-8601, necessario per i filtri OGC 
	 */
	dateFormat : "Y-m-d",
	/**
	 * Property: dcProperty
	 * {string} Proprieta' Dublin core da inserire come parametro all'interno della ricerca avanzata.
	 */
	dcProperty : null,
	/**
	 * Property: filterVersion
	 *  {string} Versione del Filtro OGC
	 */
	filterVersion:null,
	/**
	 * Property: buttonAlign
	 *  {string} allineamento dei pulsanti
	 */
	buttonAlign: 'center',
	
	/**
	 * Property: i18n
	 * {Ext.i18n.Bundle} bundle for i18n messages
	 * @type 
	 */
	i18n: null,
	
	//PRIVATE PROPERTIES

	advancedSearchSet : null,

	basicSearchSet : null,

	// Widget for choosing a different catalog
	catalogChooser : null,

	// Search button
	searchButton : null,

	// Widget for free-text search
	freeText : null,

	// Wiogets for choosing a last modified date
	lastModifiedBegin : null,

	lastModifiedEnd : null,

	// Widget for selecting/deselecting the use of BBOX in search
	useBox : null,

	// Widget for entering the value of a DC attribute
	dcValue : null,

	// Parent panel
	panel : null,
    
	// Loading mask showed when the application tests compatibility
    // with the remote catalog
    mask: null,

	autoHeight:true,
	/**
	 * Method: initParameters 
	 * Inizializza la comboBox che contiene i cataloghi tra cui scegliere
	 *
	 * Parameters:
	 * catalogs - {Array} cataloghi da cui scegliere. il formato degli elementi e' del tipo { *name:* "nome" , *url:* "url_catalogo_csw", *description:* "descrizione opzionale" } 
	 *
	 */
	initParameters : function(catalogs) {
		this.catalogChooser.initParameters(catalogs);
	},

	/**
	 * Method: search 
	 * effettua la ricerca  
	 *
	 * params - {Object} parametri di ricerca
	 */
	search : function(params) {				
		
		if (this.fireEvent('beforesearch',params) === false) {
			return;
		}
		
		// Builds individual filters
		var filters = new Array();

		// Free-text condition
		if (params.freeText != "") {
			var filter = new OpenLayers.Filter.Comparison({
				type : OpenLayers.Filter.Comparison.LIKE,
				property : "apiso:AnyText",
				value : params.freeText
			});
			filters.push(filter);
		}

		// If advanced search is to be used, adds the conditions
		if (params.useAdvancedSearch) {

			/*
			 * DC property condition. Since these properties are tokenized by
			 * GeoNetwork, the EQUAL_TO looks for individual words, not for portions
			 * of them. The use of LIKE may be less intuitive for the users, since it
			 * would imply the insertion of wildcard characters
			 */
			if (params.dcValue != "") {
				/*
				 * var filter= new OpenLayers.Filter.Comparison({ type:
				 * OpenLayers.Filter.Comparison.LIKE, property: this.panel.dcProperty,
				 * value: params.dcValue } );
				 */
				 
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.EQUAL_TO,
					property : this.dcProperty,
					matchCase : false,
					value : params.dcValue
				});
				filters.push(filter);
			}

			// BBOX condition
			if (params.useBbox == true) {
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Spatial.BBOX,
					property : "ows:BoundingBox",
					value : this.bbox
				});
				filters.push(filter);
			}
			
			// Last modified interval begin condition
			if (params.lastModifiedBegin  && params.lastModifiedBegin != "") {
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
					property : "tempExtentBegin",
					// ISO-8601, needed for OGC filters
					value : params.lastModifiedBegin.format(this.dateFormat) + "T00:00:00Z"
				});
				filters.push(filter);
			}

			// Last modified interval end condition
			if (params.lastModifiedEnd && params.lastModifiedEnd != "") {
				var filter = new OpenLayers.Filter.Comparison({
					type : OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
					property : "tempExtentEnd",
					// ISO-8601, needed for OGC filters
					value : params.lastModifiedEnd.format(this.dateFormat) + "T23:59:59Z"
				});
				filters.push(filter);
			}
		}

		// Builds the query options
		var options = {
			url: this.catalogChooser.getValue(),
			filterVersion : this.filterVersion,
			resultType : "full"
		};

		// If no filter has been set, builds the query as to select every record,
		// otherwise the conditions are applied as filters
		if (filters.length != 0) {
			options.filter = new OpenLayers.Filter.Logical({
				type : OpenLayers.Filter.Logical.AND,
				filters : filters
			});
			options.emptySearch = false;
		} else {
			options.emptySearch = true;
		}
		
		this.resetButton.disable();
		this.searchButton.disable();
		this.catalogChooser.disable();
			
		this.panel.cswGrid.store.on("load",function(){
			this.resetButton.enable();
			this.searchButton.enable();
			this.catalogChooser.enable();
		}, this);
		this.panel.cswGrid.store.on("loadexception",function(){
			this.resetButton.enable();
			this.searchButton.enable();
			this.catalogChooser.enable();
		}, this);
		
		this.panel.cswGrid.initParameters(options);
	},

	/**
	 * Method: initComponent 
	 * inizializza i componenti della GUI
	 */
	initComponent : function() {
		// 
		this.addEvents({
			/**
             * @event beforesearch
             * Lanciato prima di una ricerca. Far ritornare false al listener per impedire la ricerca.
             * @param {Object} parametri di ricerca.
             */
			beforesearch : true
		});
		
        //
		//CATALOG PANEL ELEMENTS
        //
		this.catalogChooser = Ext.create('CSWCatalogChooser', {
			//width : 200,
			XDProxy: this.panel.config.XDProxy,
			i18n: this.i18n,
            cswVersion: this.panel.config.cswVersion,
			fieldLabel : this.i18n.getMsg("catalogField"),
			emptyText : this.i18n.getMsg("catalogEmptyText"),
            labelStyle : 'width: 150px',
			width: 400
            
		});
        
        this.catalogDescriptionPanel = new Ext.Panel({
            xtype: 'panel',
            id: 'suggestintropan',
            header: false,
            //height: 70,
            width:350,
            autoHeight: true,
            border: false,
            collapsible: true,
            collapsed: true,
            collapseMode: 'mini',
            hideCollapseTool: true
			
        });
        
        //
        //BUTTONS
        //        
		this.searchButton = new Ext.Button({
			text : this.i18n.getMsg("search"),
			scope : this,
			iconCls: 'icon-search',
			tooltip: this.i18n.getMsg("searchTooltip"),
			handler : function() {
				this.search({
					freeText : this.freeText.getValue(),
					lastModifiedBegin : this.lastModifiedBegin.getValue(),
					lastModifiedEnd : this.lastModifiedEnd.getValue(),
					useBbox : this.useBbox.getValue(),
					dcValue : this.dcValue.getValue(),
					useAdvancedSearch : !this.advancedSearchSet.collapsed
				});
			}
		});

		this.resetButton = new Ext.Button({
			text : this.i18n.getMsg("reset"),
			iconCls: 'icon-reset',
			tooltip: this.i18n.getMsg("resetTooltip"),
			scope : this,
			handler : function() {
				this.getForm().reset();
				this.searchButton.disable();
				this.resetButton.disable();
				this.advancedSearchSet.collapse(true);
				this.lastModifiedEnd.setMinValue();
				this.lastModifiedBegin.setMaxValue();
				this.panel.cswGrid.getStore().removeAll(); 
                this.catalogDescriptionPanel.update("");
                this.catalogDescriptionPanel.collapse();
				
                
			}
		});
        //
        //CATALOG SELECTION FIELDSET
        //
        this.catalogSelectionPan= new Ext.form.FieldSet({
            title: this.i18n.getMsg("catalogSelection"),
            autoHeight : true,
			collapsed : false,
			collapsible : false,
			padding: 5,
			defaults:{
				labelStyle : 'width: 150px',
				width: 200
				
			},
            items: [this.catalogChooser, this.catalogDescriptionPanel]
        
        });
        /*
        //BASIC SEARCH FIELDSET
		this.basicSearchSet = new Ext.form.FieldSet({
			//title : i18n.getMsg("basicSearchSet"),
			border: false,
            autoHeight : true,
			collapsed : false,
			collapsible : false,
			defaults:{
				labelStyle : 'width: 150px',
				width: 200
				
			},
			listeners : {
				scope : this,
				expand : function(panel) {
					this.advancedSearchSet.collapse(true);
				}
			},
			items : [ this.freeText ]
		});
        */
        
        //
        //SEARCH ELEMENTS
        //
        this.freeText = new Ext.form.TextField({
			fieldLabel : this.i18n.getMsg("freeText"),
			labelStyle : 'width: 150px',
			width: 400,
			emptyText : this.i18n.getMsg("anyText"),
			enableKeyEvents : true,
			
			listeners : {
				scope : this,
				keydown : function(txt, evt) {
					if (evt.getKey() == 13 && this.catalogChooser.getValue()) {
						this.searchButton.handler.call(
								this.searchButton.scope,
								this.searchButton.searchButton
						);
					}
				}
			}
		});
		this.lastModifiedBegin = new Ext.form.DateField({
			fieldLabel : this.i18n.getMsg("modifiedbegin"),
			width : 100,
			format : this.dateFormat,
			editable: false,
			labelStyle : 'width: 140px',
			listeners:{
				scope: this,
				change: function(newValue,OldValue){
					this.lastModifiedEnd.setMinValue(OldValue);
				}
			}
		});
		

		this.lastModifiedEnd = new Ext.form.DateField({
			fieldLabel : this.i18n.getMsg("modifiedend"),
			width : 100,
			format : this.dateFormat,
			editable:false,
			labelStyle : 'width: 140px',
			listeners:{
				scope: this,
				change: function(newValue,OldValue){
					this.lastModifiedBegin.setMaxValue(OldValue);
				
				}
			}
		});

		this.useBbox = new Ext.form.Checkbox({
			fieldLabel : this.i18n.getMsg("mapExtent"),
			labelStyle : 'width: 140px'
		});

		this.dcValue = new Ext.form.TextField({
			labelStyle : 'width: 140px',
			width: 200,
			fieldLabel : this.i18n.getMsg("dcProperty" + this.dcProperty)
		});

		//ADVANCED SEARCH FIELDSET
		this.advancedSearchSet = new Ext.form.FieldSet({
			checkboxToggle : true,
			title : this.i18n.getMsg("advancedSearchSet"),
			autoHeight : true,
			collapsed : true,
			layout: {
		        type: 'table',
		        columns: 2
		    },
			
			items : [ 
				//first date row
				{
					layout: "form",
					border: false,
					colspan: 1,
					width: 320,
					items: [this.lastModifiedBegin]
                },
				{
					layout: "form",
					border: false,
					colspan: 1,
					style:"position:relative;top:-2px;",
					items: [
						new Ext.Button ({
							iconCls: 'icon-reset',
							tooltip: this.i18n.getMsg("clearDateBegin"),
							scope:this,
							handler:function(){
								this.lastModifiedBegin.reset();
								this.lastModifiedEnd.setMinValue();
							}
						})
					]
                },
				//second date row
				{
					layout: "form",
					border: false,
					colspan: 1,
					width:320,
					items: [this.lastModifiedEnd]
                },
				{
					layout: "form",
					border: false,
					colspan: 1,
					style:"position:relative;top:-2px;",
					
					items: [
						new Ext.Button ({
							iconCls: 'icon-reset',
							tooltip: this.i18n.getMsg("clearDateEnd"),
							scope:this,
							handler:function(){
								this.lastModifiedEnd.reset();
								this.lastModifiedBegin.setMaxValue();
							}
						})
					]
                },
                //other fields
				{
					layout: "form",
					border: false,
					colspan: 2,
					width:345,
					items: [
						this.useBbox
					]
                },{
					layout: "form",
					border: false,
					colspan: 2,
					width:345,
					items: [this.dcValue]
                }
            ]
		});
		//
        //SEARCH FIELDSET
        //
        this.SearchSet = new Ext.form.FieldSet({
			title : this.i18n.getMsg("basicSearchSet"),
            autoHeight : true,
            //autoWidth: true,
			collapsed : false,
			collapsible : false,
			items : [ this.freeText, this.advancedSearchSet ]
		});
        
		this.items = [ this.catalogSelectionPan, this.SearchSet ];

		this.buttons = [ this.searchButton, this.resetButton ];

		this.searchButton.disable();
		this.resetButton.disable();
        
        //event associations
		this.catalogChooser.on('select', function() {
			this.searchButton.disable();
			this.resetButton.disable();
            this.mask =new Ext.LoadMask(this.el, {msg:this.i18n.getMsg("getCapabilitiesWait")});
            this.mask.show();   
            
		}, this);
        
		this.catalogChooser.on('selectsupported', function(msg) {
            //enable buttons
			this.searchButton.enable();
			this.resetButton.enable();
            this.mask.hide();
            this.mask=null;
            //show description
            msg = '<div class="catalog-desc-ok">'+ msg + '</div>';
            this.catalogDescriptionPanel.update(msg);
            this.catalogDescriptionPanel.expand();
			this.panel.setSize(this.panel.width -31,this.panel.getHeight);
			
		}, this);
        
		this.catalogChooser.on('selectunsupported', function(msg) {
			this.searchButton.disable();
			this.resetButton.disable();
            this.mask.hide();
            this.mask=null;
            //Show Description
            var msg = '<div class="catalog-desc-error" /><div>'+ msg + '</div>';
            this.catalogDescriptionPanel.update(msg);
            this.catalogDescriptionPanel.expand();
			this.panel.setSize(this.panel.width -31,this.panel.getHeight);
		}, this);
        
        this.catalogChooser.on('selectiunknownsupport', function(msg) {
            //enable buttons
			this.searchButton.enable();
			this.resetButton.enable();
            this.mask.hide();
            this.mask=null;
            //show description
            var msg = '<div class="catalog-desc-warning">'+ msg + '</div>';
            this.catalogDescriptionPanel.update(msg);
            this.catalogDescriptionPanel.expand();
			this.panel.setSize(this.panel.width -31,this.panel.getHeight);
            //show description
          
            
		}, this);
        
        this.callParent(arguments);
		
	}
});
/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWPanel
 * Form che contiene il widget di ricerca.
 * 
 * Inherits from:
 *  - <Ext.Panel>
 *
 */
Ext.define('CSWPanel', {
 
	extend: 'Ext.Panel',

	alias: 'widget.csw',
	
    /**
	 * Property: border
     * {boolean} se true viene disegnato un bordo.
	 */ 
	border : false,
	/**
	 * Property: title
     * {string}aggiunge un titolo al pannello.
	 */ 
	title : "CSW Explorer",
    /**
	 * Property: defaults
     * {object} opzioni di default dei componenti contenuti nel pannello
	 */ 
	/*defaults: {
		collapsible: false,
		//split: true,
		bodyStyle: "padding: 2px",
		
	},*/
    /**
	 * Property: iconCls
     * {string} classe associata all'icona
	 */ 
    iconCls: "icon-table",
	
	
	/**
	 * Property: map
     * {object} opzionale. Mappa da associare al pannello.
	 */ 
	map : null,
	/**
	 * Property: config
	 * Oggetto per la configurazione  componente. Vedere <config.js>
	 *
	 */
	config : null,
	
	events : [
	
	"zoomToExtent",
    /**
	 * Event: zoomToExtent 
	 * Evento scatenato dalla pressione del tasto "Vis. Estensione" all'interno dei singoli record della griglia.
	 * 
	 * Parameters:
	 * el {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
	 * el.bbox - {Object} bounding Box del record
	 * el.crs  -  {Object}crs della boundingbox
	 */
	 "viewMap",
	 /**
	 * Event: viewMap
	 * Evento scatenato dalla pressione del tasto "Visualizza Mappa" all'interno dei singoli record della griglia.
	 *
	 * Parameters:
	 * layerInfo {object} - oggetto contenente i parametri necessari a uno zoomToExtent. Contiene i seguenti campi.
	 * layerInfo.bbox - {object} bounding Box del record
	 * layerInfo.crs -  {string}crs del record
	 * layerInfo.Layers - {Array}. Array contenenti tutti i layer associati al record
	 * 
	 */
	 
	 "beforesearch"
	/**
	 * Event: beforesearch
	 * Evento scatenato prima dell'esecuzione di una ricerca per permettere la modifica di parametri al momento,
	 * come ad esempio il settaggio del bounding box attuale.
	 *
	 * Parameters:
	 * params {object} - oggetto contenente i parametri di ricerca. Contiene i seguenti campi:
	 * params.freeText {String} - testo cercato,
	 * params.lastModifiedBegin {String} - limite inferiore data ultima modifica,
	 * params.lastModifiedEnd {String} - limite superiore data ultima modifica,
	 * params.useBbox {boolean} - utilizzo del bounding box,
	 * params.dcValue {String} - campo ricerca,
	 * params.useAdvancedSearch {boolean} - utilizzo della ricerca avanzata
	 * 
	 */
	],
    
	autoWidth:true,
	autoHeight:true,
	border: false,
    
    
	//PRIVATE
	searchTool : null,

	cswGrid : null,
	
	/**
	 * Property: i18n
	 * {Ext.i18n.Bundle} bundle for i18n messages
	 * @type 
	 */
	i18n: null,
	
	
	initComponent : function() {
		
		//init GUI Components
		this.cswGrid = new CSWGrid({
			 loadMask: {msg: this.i18n.getMsg("loadWait")},
			 config: this.config,
             i18n: this.i18n,
			 map: new Ext.KeyMap(document, [{
				key: Ext.EventObject.ESC,
				fn: function(){
				
						if(this.cswGrid.store.proxy){
							this.cswGrid.store.proxy.getConnection().abort();
							this.cswGrid.loadMask.hide();
							//extenalize if possible
							this.searchTool.resetButton.enable();
							this.searchTool.searchButton.enable();
							this.searchTool.catalogChooser.enable();
						}
					
					},
					scope: this
				}])
		});
		
		this.searchTool = new CSWSearchTool({
		    grid: this.cswGrid,
			dcProperty : this.config.dcProperty,
			panel: this,
            autoHeight:true,
            style:"margin-left:5px;margin-right:5px;"  ,         
			bbox: new OpenLayers.Bounds(
					this.config.initialBBox.minx, 
					this.config.initialBBox.miny, 
					this.config.initialBBox.maxx, 
					this.config.initialBBox.maxy
			),
			filterVersion: this.config.filterVersion,
			i18n: this.i18n
		});				
		
		this.items = [ 
			{
			 xtype:'container',
			 layout:'fit',
			 autoHeight:true,
			 border: false,
			 items:[this.searchTool]
			 
			 },
			{
			 xtype:'container',
			 layout:'fit',
			 autoWidth: true,
			 //autoHeight:true,
			 border: false,
			 items:[this.cswGrid]  
			}
            
		];
		

		//event Handler associaton
		this.addEvents(this.events);
		
		this.initParameters(this.config.catalogs);
		this.callParent(arguments);
		
		this.relayEvents(this.searchTool,['beforesearch']);
		
	},

	/**
	 * Method: initParameter	
	 * Inizializza Il Pannello. Deve essere chiamato dopo
	 * che gli widget sono stati inizializzati con initComponent.
	 */
	initParameters : function (catalogs) {
		
		// Setup catalog chooser widget with catalogs stored in this instance
		this.searchTool.initParameters(catalogs);
		
		// Adds an event to clear up the resuls grid when a new
		// catalog is called and check the new catalog server is working
		var storeClosure = this.cswGrid.store; 

		
		this.searchTool.catalogChooser.addListener("select", 
			  function() {
					storeClosure.removeAll(); 
					storeClosure.catalogUrl = this.getValue();
                    
			  }
		);	
		
		this.searchTool.panel = this;
	},
	
	/**
	 * Method: setBBox	
	 * Imposta il bounding box di una ricerca.
	 * 
	 * Parameters:
	 * bbox - {Object} bounding box con i seguenti parametri:
	 * minx - x minima
	 * miny - y minima
	 * maxx - x massima
	 * maxy - y massima
	 */
	setBBox: function(bbox){
		if(bbox == null) return;
		this.searchTool.bbox = new OpenLayers.Bounds(
			bbox.minx, 
			bbox.miny, 
			bbox.maxx, 
			bbox.maxy
		)
	}
});
/*
 *  Copyright (C) 2007 - 2012 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Class: CSWPagingToolbar 
 * Naviga le pagine dei risultati nella griglia
 * fornisce i parametri corretti per la paginazione rispetto al protocollo
 * CSW getRecords. Estende le funzionalita' della paging toolbar
 * aggiungendo i pulsanti *"Espandi Tutti"* e *"Chiudi Tutti"* per aprire o
 * chiudere tutti i Row Expander della griglia.
 * 
 * Inherits from: 
 * - <Ext.PagingToolbar>
 * 
 * See also:
 * - <CSWGrid>
 *
 */
Ext.define('CSWPagingToolbar', {

	extend: 'Ext.PagingToolbar',

    autoWidth:true,
    
    /**
	 * Property: i18n
	 * {Ext.i18n.Bundle} bundle for i18n messages
	 * @type 
	 */
	i18n: null,
	
	/**
	 * Method: initComponent
	 * inizializza il componente
	 */

	initComponent : function() {
		this.paramNames = {
			start : "start",
			limit : "limit"
		}
		
		this.callParent(arguments);
		//disable default refresh
		
		
		//add expandAll and collapseAll buttons
		//this.expandAll = this.addButton({
		this.expandAll = this.add({
            text: this.i18n.getMsg("expandAll"),
            scope: this,
            iconCls: 'icon-expand-all',
            disabled:true,
			tooltip: this.i18n.getMsg("expandTooltip"),
            handler: function(){                
                this.grid.plugins.expandAll();
            }
        });
		//this.collapseAll = this.addButton({
		this.collapseAll = this.add({
            text: this.i18n.getMsg("collapseAll"),
            scope: this,
            iconCls: 'icon-collapse-all',
            disabled:true,
			tooltip: this.i18n.getMsg("collapseTooltip"),
            handler: function(){                
                 this.grid.plugins.collapseAll();
            }
        });
        //store event association
	//ALE	this.store.on('clear',this.onClear,this);
		
		
	},
	
  /**
	* Method: doLoad
	*	Chiamato al cambio della pagina.
	*   Sovrascrive il corrispondente metodo della superClasse passando allo store
	*   i valori corretti per il CSW GetRecords
	*   
	* Parameters:
	* start - {int} Posizione iniziale del primo record da visualizzare. parte da 0
	*               lasciando immutata la rappresentazione interna della paging toolbar
	*				da cui eredita il metodo. Al momento di passare il valore allo store
	*				lo passa incrementato di 1 in accordo con la rappresentazione CSW
	*                  
    */
	doLoad : function(start) {
		var o = {}, pn = this.getParams();
		o[pn.start] = start + 1; // incremented as the standard CSW StartPosition value require (start from 1, not from 0)									
		o[pn.limit] = this.pageSize;
		o.jsonData= {}; // NOTE: needed to force store to do not pass start and limit parameters in query string 
		if (this.fireEvent('beforechange', this, o) !== false) {
			this.store.reload({
				params : o
			});
		}
	},
	
	
	/**
	*
	* Method: onLoad
	*	
	*   A load avvenuto viene chiamato questo metodo, che aggiorna lo stato dei
	*	pulsanti della toolbar.
	*   
	* Parameters:
	* store -	{Ext.data.Store} lo store a cui si fa riferimento
	* r - 		{Array} array di records risultato della ricerca
	* o - 		{object} options passate allo store per la load appena avvenuta
	*                  
    */
	onLoad : function(store, r, o) {
		if (!this.rendered) {
			this.dsLoaded = [ store, r, o ];
			return;
		}
		var p = this.getParams();

		// changed: needed to give the right parameter to cursor(first start was
		// aug. of 1 because of the CSW param StartPosition Starts from 1
		// so now it have to be dim. 1
		this.cursor = (o.params && o.params[p.start]) ? o.params[p.start] - 1 : 0;
		var d = this.getPageData(), ap = d.activePage, ps = d.pages;
		var count=this.store.getCount();
		this.afterTextItem.setText(String.format(this.afterPageText, d.pages));
		this.inputItem.setValue(ap);
		this.first.setDisabled(ap == 1);
		this.prev.setDisabled(ap == 1);
		this.next.setDisabled(ap == ps);
		this.last.setDisabled(ap == ps);
		this.expandAll.setDisabled(!count);
		this.collapseAll.setDisabled(!count);
		this.refresh.setDisabled(!count);
        this.inputItem.setDisabled(!count);
		this.updateInfo();
		this.fireEvent('change', this, d);
	},
    /**
	*
	* Method: onClear
	*	
	*   All'evento clear dello store viene associato questo metodo che resetta i
	*	pulsanti della toolbar.
	*   
	* Parameters:
	* store -	{Ext.data.Store} lo store a cui si fa riferimento
	* r - 		{Array} array di records risultato della ricerca
	*                  
    */
	onClear : function(store,r) {
		this.cursor = 0;
		var p = this.getParams();
		var ap = 0, ps = 1;
		this.afterTextItem.setText(String.format(this.afterPageText, ps));
		this.inputItem.setValue(ap);
		this.first.setDisabled(true);
		this.prev.setDisabled(true);
		this.next.setDisabled(true);
		this.last.setDisabled(true);
		this.expandAll.setDisabled(true);
		this.collapseAll.setDisabled(true);
		this.refresh.setDisabled(true);
        this.inputItem.setDisabled(true);
		this.updateInfo();
		
	   
    }  

});