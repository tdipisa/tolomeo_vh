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
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo è un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo è un software libero; è possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo è distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo è sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
*/

/**
 * Rappresentazione di vertice per il routing
 * Può essere utilizzato come vertice iniziale, finale o intermedio.
 * 
 * @param street {string} nome della strada
 * @param point {JSGeometry} geometria
 * 
 * @property street {string} nome della strada
 * @property point {JSGeometry} geometria
 * 
 * @constructor
 */
function ToloOLSVertex(street, point, id)
{
	this.street = street;
	this.point = point;
	this.id = id;
}

/**
 * Modello dei dati generale per l'estensione OpenLS
 * 
 * @property geocodedAddresses {GeocodedAddress[]} array di indirizzi georiferiti
 * @property geometry {Point} geometria del punto di cui è richiesto il reverse geocoding
 * @property srsName {string} sistema di riferimento del punto di cui è richiesto il reverse geocoding
 * @property startPoint {ToloOLSVertex} vertice iniziale del routing
 * @property endPoint {ToloOLSVertex} vertice finale del routing
 * @property viaPoints {ToloOLSVertex[]} array di vertici intermedi del routing
 * @property method {string} metodo di routing
 * @property routeResponse {RouteResponse} risposta di routing
 * 
 * @constructor
 */
function ToloOLSModel()
{
	this.geocodedAddresses = null;
	this.geometry = null;
	this.srsname = null;
	this.startPoint = null;
	this.endPoint = null;
	this.viaPoints = [];
	this.viaPointId = 0;
	this.method = 'Fastest';
	this.routeResponse = null;
}

/**
 * Rappresentazione di una indirizzo georiferito
 * 
 * @param geometry {JSGeometry} geometria
 * @param postalCode {string} codice postale
 * @param address {Address} indirizzo
 * @param match {GeocodeMatch} tipo di match
 * 
 * @property geometry {JSGeometry} geometria
 * @property postalCode {string} codice postale
 * @property summary {Address} indirizzo
 * @property match {GeocodeMatch} tipo di match
 * 
 * @constructor
 */
function GeocodedAddress(geometry, srsName, postalCode, address, match)
{
 	this.geometry = geometry;
 	this.srsName = srsName;
 	this.postalCode = postalCode;
 	this.address = address;
 	this.match = match;
}

/**
 * Rappresentazione di un indirizzo
 * 
 * @param countryCode {string} codice nazione
 * @param streetAddress {StreetAddress} Indirizzo della strada
 * @param places {string[string]} luoghi
 * 
 * @property countryCode {string} codice nazione
 * @property streetAddress {StreetAddress} Indirizzo della strada
 * @property places {string[string]} luoghi
 * 
 * @constructor
 */
function Address(countryCode, streetAddress, places)
{
 	this.countryCode = countryCode;
 	this.streetAddress = streetAddress;
 	this.places = places;
}

/**
 * Rappresentazione di un indirizzo di una strada
 * 
 * @param street {string} Indirizzo della strada
 * 
 * @property street {string} Indirizzo della strada
 * 
 * @constructor
 */
function StreetAddress(street)
{
 	this.street = street;
}

/**
 * Rappresentazione di un match
 * 
 * @param accuracy {string} indice di accuratezza
 * @param type {string} tipo di match
 * 
 * @property accuracy {string} indice di accuratezza
 * @property type {string} tipo di match
 * 
 * @constructor
 */
function GeocodeMatch(accuracy, type)
{
 	this.accuracy = accuracy;
 	this.type = type;
}

/**
 * Rappresentazione di una risposta di routing
 * 
 * @param summary {RouteSummary} sommario del routing
 * @param geometry {JSGeometry} geometria
 * @param instructions {RouteInstruction[]} array di istruzioni di routing
 * 
 * @property summary {RouteSummary} sommario del routing
 * @property geometry {JSGeometry} geometria
 * @property instructions {RouteInstruction[]} array di istruzioni di routing
 * 
 * @constructor
 */
function RouteResponse(summary, geometry, instructions)
{
 	this.summary = summary;
 	this.geometry = geometry;
 	this.instructions = instructions;
}

/**
 * Rappresentazione delle informazioni di sintesi di una risposta di routing
 * 
 * @param totalTime {string} durata
 * @param totalDistance {TotalDistance} distanza totale
 * @param boundingBox {BBox} bounding box del routing
 * 
 * @property totalTime {string} durata
 * @property totalDistance {TotalDistance} distanza totale
 * @property boundingBox {BBox} bounding box del routing
 * 
 * @constructor
 */
function RouteSummary(totalTime, totalDistance, boundingBox)
{
 	this.totalTime = totalTime;
 	this.totalDistance = totalDistance;
 	this.boundingBox = boundingBox;
}

/**
 * Rappresentazione della distanza percorsa da un routing
 * 
 * @param value {number} distanza
 * @param uom {string} unità di misura
 * @param accuracy {number} accuratezza percentuale
 * 
 * @property value {number} distanza
 * @property uom {string} unità di misura
 * @property accuracy {number} accuratezza percentuale
 * 
 * @constructor
 */
function TotalDistance(value, uom, accuracy)
{
 	this.value = value;
 	this.uom = uom;
 	this.accuracy = accuracy;
}

/**
 * Rappresentazione di una istruzione di routing
 * 
 * @param instruction {string} istruzioni di routing
 * @param distance {number} distanza del singolo lag
 * @param geometry {JSGeometry} geoemtria del lag
 * 
 * @property instruction {string} istruzioni di routing
 * @property distance {number} distanza del singolo lag
 * @property geometry {JSGeometry} geoemtria del lag
 * 
 * @constructor
 */
function RouteInstruction(instruction, textInstruction, distance, geometry)
{
 	this.instruction = instruction;
 	this.textInstruction = textInstruction;
 	this.distance = distance;
 	this.geometry = geometry;
 	this.instructionId = Math.random(); 
}
