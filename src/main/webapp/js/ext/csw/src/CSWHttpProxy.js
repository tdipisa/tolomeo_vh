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
		
		// INIZIO PATCH sporca per gestire il fatto che su IE formatString viene generata con NS1 in più e vuoto poi va in errore per NS1:xmlns
		// Non è chiaro perchè bisognerebbe indagare
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

