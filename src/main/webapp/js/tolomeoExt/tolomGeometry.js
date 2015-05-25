/*
 Tolomeo is a developing framework for visualization, editing,  
 geoprocessing and decisional support application based on cartography.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 This file is part of Tolomeo.
 
 Tolomeo is free software; you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License 
 as published by the Free Software Foundation; either version 3 of the License, 
 or (at your option) any later version.
 
 Tolomeo is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 
 You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo � un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo � un software libero; � possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo � distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo � sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/
/**
 * overview Definizione costanti e tipi geometrici utilizzati dal progetto Tolomeo <br/>
 * <br/>
 * name Tolomeo - Geometrie
 * @author Ing. Alessandro Radaelli <br/>Comune di Prato
 * 
* Costante che rappresenta il tipo di geometria: Punto 
* @type number
*/
var geomTypePoint   = 1;
/**
* Costante che rappresenta il tipo di geometria: Linea 
* @type number
*/
var geomTypeLine    = 2;
/**
* Costante che rappresenta il tipo di geometria: Poligono 
* @type number
*/
var geomTypePolygon = 3;
/**
* Costante che rappresenta il tipo di geometria: Cerchio 
* @type number
*/
var geomTypeCircle  = 4;


/**
 * @class TolomeoExt.Point
 * Rappresentazione di un punto
 * 
 * @constructor
 * 
 * 
 * @param {Number} x
 * coordinata x
 * 
 * @param {Number} y
 * coordinata y
 * 
 */
 function Point(x, y) {
 	/**
 	 * @property {Number} x
 	 * coordinata x
 	 * 
 	 */
 	this.x = x;
 	/**
 	 * @property {Number} y
 	 * coordinata y
 	 * 
 	 */
 	this.y = y; 	
 }
 
/**
 * @method clone
 * Restituisce un nuovo punto con le medesime coordinate del punto stesso 
 * 
 * @return {TolomeoExt.Point}
 * 
 * 
 */
 Point.prototype.clone = function() {
        return new Point(this.x ,this.y);
 }
 
/**
 * @method transform
 * Trasforma il punto dal sistema di riferimento iniziale a quello di destinazione
 * 
 * @param {String} source
 * codice EPSG del sistema di riferimento di partenza (Es. EPSG:26591) 
 * 
 * @param {String} dest
 * codice EPSG del sistema di riferimento di destinazione (Es. EPSG:4326)
 * 
 */
 Point.prototype.transform = function(source, dest) {
    var newPoint = TolomeoExt.Projection.transform(this, source, dest);
    this.x = newPoint.x;
    this.y = newPoint.y;
 }
 
/**
 * @method round
 * Arrotonda le coordinate con un certo numero di decimali
 * 
 * @param {Number} precision
 * numero di decimali 
 * 
 */
 Point.prototype.round = function(precision){
 	var factor = Math.pow(10,Math.round(precision) || 0);
 	this.x = Math.round(this.x * factor)/factor;
 	this.y = Math.round(this.y * factor)/factor;
 }   
    
/**
 * @method toString
 * 
 * 
 * @return {String}
 * 
 * 
 */
 Point.prototype.toString = function() {
    return (this.x + "," + this.y);
 }
 
/**
 * @class TolomeoExt.BBox
 * Rappresentazione di un bounding box
 * 
 * @constructor
 * 
 * 
 * @param {Number} left
 * coordinata x minima
 * 
 * @param {Number} bottom
 * coordinata y minima
 * 
 * @param {Number} right
 * coordinata x massima
 * 
 * @param {Number} top
 * coordinata y massima
 * 
 */
 function BBox(left,bottom,right,top){
 	/**
   * @property {Number} left
   * coordinata x minima
   * 
 	 */
 	this.left   = left;
 	/**
   * @property {Number} bottom
   * coordinata y minima
   * 
 	 */
 	this.bottom = bottom;
 	/**
   * @property {Number} right
   * coordinata x massima
   * 
 	 */
 	this.right  = right;
 	/**
   * @property {Number} top
   * coordinata y massima
   * 
 	 */
 	this.top    = top
 }
 
/**
 * @method create
 * 
 * 
 * @param {TolomeoExt.BBox} bbox
 * 
 * 
 * @return {TolomeoExt.BBox}
 * 
 * 
 */
 BBox.create = function(bbox){
 	return new BBox(bbox.left,bbox.bottom,bbox.right,bbox.top);
 }
 
/**
 * @method transform
 * Trasforma il bounding box dal sistema di riferimento iniziale a quello di destinazione
 * 
 * @param {String} source
 * codice EPSG del sistema di riferimento di partenza (Es. EPSG:26591) 
 * 
 * @param {String} dest
 * codice EPSG del sistema di riferimento di destinazione (Es. EPSG:4326)
 * 
 */
 BBox.prototype.transform = function(source, dest) {
 	
 	var leftBottomPoint = new Point(this.left , this.bottom);
	var rightTopPoint   = new Point(this.right, this.top);
										
	leftBottomPoint = TolomeoExt.Projection.transform(leftBottomPoint,source,dest);
	rightTopPoint   = TolomeoExt.Projection.transform(rightTopPoint,  source,dest);
		    
    this.left   = leftBottomPoint.x;
    this.bottom = leftBottomPoint.y;
    this.right  = rightTopPoint.x;
    this.top    = rightTopPoint.y;
 }
 
/**
 * @method format
 * 
 * 
 * @param {String} separator
 * 
 * 
 * @return {String}
 * 
 * 
 */
 BBox.prototype.format = function(separator) {
 	separator = separator || " ";
    return (this.left + separator + this.bottom + separator + this.right + separator + this.top);
 }
 
/**
 * @method toString
 * 
 * 
 * @return {String}
 * 
 * 
 */
 BBox.prototype.toString = function() {
    return this.format(" ");
 }
 
/**
 * @class TolomeoExt.JSGeometryArray
 * Array di geometrie. E' composto da <br>
 * <ul>
 *  	<li>geometries - array contenente elementi di tipo JSGeometry </li>
 * 		<li>boundingbox - la stringa WKT che rappresenta il rettangolo minimo che contiene l'insieme delle geometrie</li>
 * </ul>
 * Questo costruttore crea un JSGeometryArray a partire dalla stringa JSON 
 * see JSGeometry
 * 
 * @constructor
 * 
 * 
 * @param {String} JSONString
 * String JSON dalla quale costruire l'oggetto
 * 
 */
function JSGeometryArray(JSONString) {
	var ret = new Array();
	if (arguments.length!=0) {	
		var buff1 = eval('(' + JSONString + ')');
		/**
		 * @type TolomeoExt.JSGeometry
		 */
		var buff = buff1.geometries;
		this.boundingbox = buff1.boundingbox;
		for (var i=0;i<buff.length;i++) {
			ret[i] = new JSGeometry(buff[i].codTPN, buff[i].key, buff[i].description, buff[i].geometry, buff[i].boundingbox, buff[i].SRID, buff[i].getFeatureInfoLink);
		}
	}
	this.geometries = ret;
	
}

/**
 * @method FromUntypedArray
 * Inizializza a partire da un JSGeometryArray non tipizzato (hanno le giuste propriet� ma non i prototype)
 * tipicamente perche' l'array stesso proviene da JSON
 * 
 * @param {Array} JSGeometryArray
 * non tipizzato da trasformare
 * 
 */
JSGeometryArray.prototype.FromUntypedArray = function (untypedJSGeometryArray) {
	
	var untypedArray = untypedJSGeometryArray.geometries;
	for (var i=0;i<untypedArray.length; i++) {
		var geom = new JSGeometry(untypedArray[i].codTPN, 
									  untypedArray[i].key,
									  untypedArray[i].description.replace(/\"/g,'\\"'),
									  untypedArray[i].geometry,
									  untypedArray[i].boundingbox, 
									  untypedArray[i].SRID,
									  untypedArray[i].getFeatureInfoLink);
	    this.geometries[i]= geom;
	}
	this.boundingbox = untypedJSGeometryArray.boundingbox;
		
}

/**
 * @method FromStore
 * 
 * 
 * @param {Array} results
 * 
 * 
 * @param {Object} store
 * 
 * 
 * @return {Object}
 * 
 * 
 */
JSGeometryArray.prototype.FromStore = function (results, store) {
	
	var untypedArray = new Object();
	untypedArray.geometries = new Array(); 
	for (var i=0; i<results.length; i++) {
		var geom = results[i].data;
		untypedArray.geometries.push(geom);
	}
	if (store.reader) {
		//EtJS 3
		untypedArray.boundingbox = store.reader.meta.boundingbox;
	} else {
		//EtJS 4
		untypedArray.boundingbox = store.getProxy().getReader().metaData.boundingbox;
	}
	
	return this.FromUntypedArray(untypedArray);
}

/**
 * @method FromStoreSingleRecord
 * 
 * 
 * @param {Object} result
 * 
 * 
 * @return {Object}
 * 
 * 
 */
JSGeometryArray.prototype.FromStoreSingleRecord = function (result) {
	
	var untypedArray = new Object();
	untypedArray.geometries = new Array();
	untypedArray.geometries.push(result);
	untypedArray.boundingbox = result.boundingbox;
	untypedArray.getFeatureInfoLink = result.getFeatureInfoLink;
	
	return this.FromUntypedArray(untypedArray);
	
}

/**
 * @method add
 * Aggiunge un oggetto JSGeometry alle geometrie di JSGeometryArray<br/>
 * Accetta in ingresso sia stringhe JSON contententi l'oggetto JSGeometry sia oggetti JSGeometry
 * 
 * @param {TolomeoExt.JSGeometry} jsGeometry
 * 
 * 
 */
JSGeometryArray.prototype.add = function(jsGeometry){
	var newGeom;
	
	if (jsGeometry instanceof String) {
		newGeom = new JSGeometry(jsGeometry);
		this.geometries.push(newGeom);
	} else {
		if (jsGeometry instanceof JSGeometry) {
			this.geometries.push(jsGeometry);
		} else {
			if (jsGeometry instanceof JSGeometryArray) {
				for (var i=0; i<jsGeometry.geometries.length; i++){
					this.geometries.push(jsGeometry.geometries[i]);
				}
			}	
		}
	}
	
}

/**
 * @method toString
 * 
 * 
 * @return {String}
 * La stringa JSOn che rappresenta l'oggetto
 * 
 */
JSGeometryArray.prototype.toString = function () {
	var ret = "{ boundingbox:" + this.boundingbox + ",";
	
	ret = "[";
	for (var i=0;i<this.geometries.length;i++) {
		if (i!=0) ret += ",";
		ret  += this.geometries[i].toString();
	}
	ret += "]}";
	return ret;
}

/**
 * @method size
 * 
 * 
 * @return {Number}
 * Il numero di elementi dell'array
 * 
 */
JSGeometryArray.prototype.size = function(){
	if(!this.geometries){
		return 0;
	}
	return this.geometries.length;
}

/**
 * @method clear
 * 
 * 
 * @param {Number} codTPN
 * 
 * 
 */
JSGeometryArray.prototype.clear = function(codTPN){
	var removedGeoms = [];
	if(this.geometries){		
		if (codTPN) {			
			var buff=new Array();
			for (var i=0;i<this.geometries.length;i++) {
				if (this.geometries[i].codTPN==codTPN) {
					buff.push(i);
				}	
			}		
			for (var i=0; i<buff.length;i++) {
				removedGeoms.push(this.geometries.splice(buff.pop(),1));
			}
		} else {
			for (var i=0; i<this.geometries.length;i++){
				removedGeoms[i] = this.geometries[i]; 
			}
			this.geometries.length=0;
			//this.geometries.clear();
		}
		return removedGeoms;
	}
}

/**
 * @method getByIndex
 * 
 * 
 * @param {Number} index
 * 
 * 
 * @return {TolomeoExt.JSGeometry}
 * 
 * 
 */
JSGeometryArray.prototype.getByIndex = function(index){
	if (index<0 || index>=this.size()) return null;	
	return this.geometries[index];
}

/**
 * @method getByCodTPN
 * Ritorna la/le geometrie contenute ed appartenenti al layer identificato dal codTN passato.
 * Ritorna null se non presenti
 * 
 * @param {Number} codTPN
 * 
 * 
 * @return {TolomeoExt.JSGeometry}
 * 
 * 
 */
JSGeometryArray.prototype.getByCodTPN = function(codTPN){
	var ret = null;
	for (var i=0;i<this.geometries.length;i++) {
		if (this.geometries[i].codTPN==codTPN) {
			if (ret==null) ret = new JSGeometryArray();
			ret.add(this.geometries[i]);
		}	
	}
	return ret;
}

/**
 * @method ContainsCodTPN
 * Ritorna true se contiene una o pi� geometrie appartenenti al layer identificato dal codTN passato.
 * altrimenti ritorna false
 * 
 * @param {Number} codTPN
 * 
 * 
 * @return {Boolean}
 * 
 * 
 */
JSGeometryArray.prototype.ContainsCodTPN = function(codTPN){
	
	for (var i=0;i<this.geometries.length;i++) {
		if (this.geometries[i].codTPN==codTPN) return true;
	}
	
	return false;
}
	
/**
 * @class TolomeoExt.JSGeometry
 * Rappresenta una geometria complessa. 
 * 
 * @constructor
 * Il costruttore se viene passato un solo parametro costruisce l'oggetto interpretando quanto passato come una stringa JSON, altrimenti utilizzando i valori passati
 * 
 * @param {Number} codTPN
 * Se � l'unico valore passato deve essere la stringa JSON che rappresenta l'oggetto da creare, altrimenti e' il valore da assegnare alla property omonima
 * 
 * @param {String} key
 * e' il valore da assegnare alla property omonima
 * 
 * @param {String} description
 * e' il valore da assegnare alla property omonima
 * 
 * @param {String} geometry
 * e' il valore da assegnare alla property omonima
 * 
 * @param {String} boundingbox
 * e' il valore da assegnare alla property omonima
 * 
 * @param {String} SRID
 * � l'ID del sistema di riferimento utilizzato per la geometria (es. EPSG:26591)
 * 
 * @param {String} getFeatureInfoLink
 * � il link per ottenere la getfeatureinfo in un WMS
 * 
 */
function JSGeometry(codTPN, key, description, geometry, boundingbox, SRID, getFeatureInfoLink) {
	if (arguments.length == 1) {
		var JSONString = codTPN;
		var buff = eval('(' + JSONString + ')');
		/**
     * @property {Number} codTPN
     * Codice del layer di appartenenza dell'oggetto 
     * 
     */
		this.codTPN = buff.codTPN;
		/**
     * @property {String} key
     * Chiave unica identificativa dell'oggetto all'interno del layer
     * 
     */
		this.key = buff.key;
		/**
     * @property {String} description
     * Descrizione dell'oggetto da utilizzarsi quando e' necessario per l'utente distiguere un oggetto dall'altro
     * 
     */
		this.description = buff.description;
		/**
     * @property {String} geometry
     * Rappresentazione WKT della geometria
     * 
     */
		this.geometry = buff.geometry;	
		/**
     * @property {String} boundingbox
     * Rappresentazione WKT del minimo rettangolo che contiene la geometria
     * 
     */
		this.boundingbox = buff.boundingbox;
		this.SRID = buff.SRID;
		this.getFeatureInfoLink = buff.getFeatureInfoLink;
	} else {
		this.codTPN = codTPN;
		this.key = key;
		this.description = description;
		this.geometry = geometry;
		this.boundingbox = boundingbox;
		this.SRID = SRID;
		this.getFeatureInfoLink = getFeatureInfoLink;
	}
	
} 

/**
 * @method isPoint
 * 
 * 
 * @return {Boolean}
 * 
 * 
 */
JSGeometry.prototype.isPoint= function () {
	if (this.geometry.indexOf("POINT")!=-1) return true
	else return false;
}

/**
 * @method toString
 * 
 * 
 * @return {String}
 * La stringa JSOn che rappresenta l'oggetto
 * 
 */
JSGeometry.prototype.toString= function () {
		var retVal = "{codTPN: " + this.codTPN;
		retVal += ", key: \"" + this.key + "\"";
		retVal += ", description: \"" + this.description + "\"";
		retVal += ", geometry: \"" + this.geometry + "\"";
		retVal += ", SRID: \"" + this.SRID + "\"";//}";
		retVal += ", boundingbox: \"" + this.boundingbox + "\""; 
		retVal += ", getFeatureInfoLink: \"" + this.getFeatureInfoLink + "\"}"; 
		return retVal;
	}