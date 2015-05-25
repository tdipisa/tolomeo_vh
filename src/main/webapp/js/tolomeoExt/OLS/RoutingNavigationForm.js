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
 * Class: TolomeoExt.OLS.RoutingNavigationForm
 * Form di geocoding
 * @author Ugo Paternostro <br/>phoops s.r.l.
 */
Ext.define('TolomeoExt.OLS.RoutingNavigationForm', {
	extend: 'TolomeoExt.OLS.BaseForm',
	
	itemId: 'olsRoutingNavigationID',
	collapsible: true,
	
	/** 
	 * Property: model
	 * 
	 */
	model: null,
	
    initComponent:function() {
    	this.addEvents('methodChanged');
    	this.addEvents('reset');
    	this.addEvents('routeReceived');
    	
    	var config = 
    	{
		        labelWidth: 75, // label settings here cascade unless 	
		        frame:true,
		        //title: 'Routing Navigation',
		        bodyStyle:'padding:5px 5px 0',
//		        width: '22%',
		        cls: 'floating-form_left',
		        height: 200,
		        defaults: {
		        	width: 230
		        },
//		        defaultType: 'textfield',
		    	instructionFormat: "text/html",
		    	
		        items: [
		          {
		        	  xtype: 'textfield',
		        	  fieldLabel: 'Start Point',
		        	  itemId: 'startPoint',
		        	  disabled: true,
		        	  handler: function(storeData){
		        		  	var store = storeData.toString();
		        		  	var values=store.split(",");
				        	this.setValue(values[0]);
		        	  },
		        	  validator: function(v) {
		        		  if (v == null || v === "" || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
                      },
		          },
		          {
		        	  xtype: 'textfield',
		        	  fieldLabel: 'End Point',	    	   
		        	  itemId: 'endPoint',
		        	  disabled: true,
		        	  handler: function(storeData){
		        		  	var store = storeData.toString();
		        		  	var values=store.split(",");
				        	this.setValue(values[0]);
		        	  },
		        	  validator: function(v) {
		        		  if (v == null || v === "" || v.lenght == 0) {
		        		        return "Value is incorrect";
		        		    }
		        		    return true;
                      }
		          },
		          {
		        	  xtype: 'combo',
		        	  store: new Ext.data.ArrayStore({
		        	        id: 0,
		        	        fields: [
		        	            'method',
		        	        ],
		        	        data: [ ['Fastest'],
		        	                ['Shortest'],
		        	                ['Pedestrian']
		        	        	 ]
		        	    }),
			          displayField: 'method',
			          typeAhead: true,
			          mode: 'local',
			          forceSelection: true,
			          triggerAction: 'all',
			          value: 'Fastest',
//			          emptyText:'Seleziona un Metodo...',
			          selectOnFocus:true,
		        	  fieldLabel: 'Method',
		        	  itemId: 'method',
		        	  listeners: {
		        		  scope: this,
			        	  select: function(combo, records, eOpts) {
			        		  this.fireEvent('methodChanged', records[0].raw);
			        	  },
		        	  },
		          },
		          {
		        	  	xtype:'label',
	                    text: "Pulsante destro del mouse sulla mappa o selezione dalla lista per definire l'inizio e la fine del viaggio.",
	                    name: 'infoLabel',
	                    labelStyle: 'font-weight:bold;',
	                    anchor:'93%'	    	   
		          }
		        ],
		        buttons: [
		            {
		            	text: 'Submit',
		            	scope: this,
		            	handler: function(toponimo){
	                    	this.submit();
		            	}
		            },
		            {	
		            	text: 'Reset',
		            	scope: this,
		            	handler: function(){
			        		this.fireEvent('reset', 'dummy');
			            }	
		            },
		        ],
		        submit: function() {
		        	if (this.model.startPoint != null
		        			&& this.model.endPoint != null
		        			&& this.items.get('method').isValid()) {
		        		this.submitRequest("DetermineRouteRequest", "RRid", this.buildXMLRequest, this.onSuccess);
		        	}
		        },
		        buildXMLRequest: function(dom, request)
		        {
		        	var	determineRouteRequest = dom.createElementNS(this.xlsNamespace, 'DetermineRouteRequest');
		        	var	routePlan = dom.createElementNS(this.xlsNamespace, 'RoutePlan');
		        	var	routePreference = dom.createElementNS(this.xlsNamespace, 'RoutePreference');
		        	var	routePreferenceValue = dom.createTextNode(this.model.method);
		        	routePreference.appendChild(routePreferenceValue);
		        	routePlan.appendChild(routePreference);
		        	var	wayPointList = dom.createElementNS(this.xlsNamespace, 'WayPointList');
		        	
		        	// start point
		        	var	startPoint = dom.createElementNS(this.xlsNamespace, 'StartPoint');
		        	var	startPosition = this.buildPosition(dom, this.model.startPoint.point, this.srid);
		        	startPoint.appendChild(startPosition);
		        	wayPointList.appendChild(startPoint);
		        	
		        	// VIAs
            		for(var i = 0; i < this.model.viaPoints.length; i++) {
    		        	var	viaPoint = dom.createElementNS(this.xlsNamespace, 'ViaPoint');
    		        	var	viaPosition = this.buildPosition(dom, this.model.viaPoints[i].point, this.srid);
    		        	viaPoint.appendChild(viaPosition);
    		        	wayPointList.appendChild(viaPoint);
            		}
            		
            		// end point
		        	var	endPoint = dom.createElementNS(this.xlsNamespace, 'EndPoint');
		        	var	endPosition = this.buildPosition(dom, this.model.endPoint.point, this.srid);
		        	endPoint.appendChild(endPosition);
		        	wayPointList.appendChild(endPoint);
		        	routePlan.appendChild(wayPointList);
		        	determineRouteRequest.appendChild(routePlan);
		        	
		        	var	routeInstructionsRequest = dom.createElementNS(this.xlsNamespace, 'RouteInstructionsRequest');
		        	routeInstructionsRequest.setAttribute("format", this.instructionFormat);
		        	routeInstructionsRequest.setAttribute("provideGeometry", "false");
		        	determineRouteRequest.appendChild(routeInstructionsRequest);
		        	
		        	request.appendChild(determineRouteRequest);
		        },
		        onSuccess: function(response)
		        {
		        	// lvl 2
		        	var drrList = response.getElementsByTagNameNS(this.xlsNamespace, "DetermineRouteResponse");
		        	
		        	if (drrList == null || drrList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessuna DetermineRouteResponse trovata nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var drr = drrList.item(0);
		        	
		        	// lvl 3
		        	var summaryList = drr.getElementsByTagNameNS(this.xlsNamespace, "RouteSummary");
		        	
		        	if (summaryList == null || summaryList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessun RouteSummary trovato nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var geometryList = drr.getElementsByTagNameNS(this.xlsNamespace, "RouteGeometry");
		        	
		        	if (geometryList == null || geometryList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessuna RouteGeometry trovata nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var instructionsListList = drr.getElementsByTagNameNS(this.xlsNamespace, "RouteInstructionsList");
		        	
		        	if (instructionsListList == null || instructionsListList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessuna RouteInstructionsList trovata nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var summary = summaryList.item(0);
		        	
		        	// lvl 4
		        	var totalTimeList = summary.getElementsByTagNameNS(this.xlsNamespace, "TotalTime");
		        	
		        	if (totalTimeList == null || totalTimeList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessun TotalTime trovato nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var totalDistanceList = summary.getElementsByTagNameNS(this.xlsNamespace, "TotalDistance");
		        	
		        	if (totalDistanceList == null || totalDistanceList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessuna TotalDistance trovata nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var boundingBoxList = summary.getElementsByTagNameNS(this.xlsNamespace, "BoundingBox");
		        	
		        	if (boundingBoxList == null || boundingBoxList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessun BoundingBox trovato nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var lineStringList = geometryList.item(0).getElementsByTagNameNS(this.gmlNamespace, "LineString");
		        	
		        	if (lineStringList == null || lineStringList.length != 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessuna LineString trovata nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	var instructionsList = instructionsListList.item(0).getElementsByTagNameNS(this.xlsNamespace, "RouteInstruction");
		        	
		        	if (instructionsList == null || instructionsList.length < 1) {
			    		Ext.MessageBox.alert('Errore', 'Nessuna RouteInstruction trovata nella risposta alla richiesta navigation!');
		        		return;
		        	}
		        	
		        	// let's rock ;)
		        	var distanceAttributes = totalDistanceList.item(0).attributes;
		        	var routeGeometry = this.createLineString(lineStringList.item(0));
		        	var instructions = [];
		        	
		        	for (var i = 0; i < instructionsList.length; i++) {
		        		instructions.push(this.createRoutingInstruction(instructionsList.item(i)));
		        	}
		        	
		        	var routeResponse = new RouteResponse(
	        			new RouteSummary(
    	        			totalTimeList.item(0).firstChild.nodeValue,
    	        			new TotalDistance(
        		        		distanceAttributes.getNamedItem("value").nodeValue,
        		        		distanceAttributes.getNamedItem("uom").nodeValue,
        		        		distanceAttributes.getNamedItem("accuracy").nodeValue
        		        	),
    	        			this.createBoundingBox(boundingBoxList.item(0))
    	        		),
    	        		routeGeometry,
    	        		instructions
		        	);
		        	
   			    	this.fireEvent('routeReceived', response.getAttribute("requestID"), routeResponse);
		        },
		        createBoundingBox: function(xml)
		        {
	        		var posList = xml.getElementsByTagNameNS(this.gmlNamespace, "pos");
	        		var bottomLeftCoords = posList.item(0).firstChild.nodeValue.split(" ");
	        		var topRightCoords = posList.item(1).firstChild.nodeValue.split(" ");
	        		
	        		return new BBox(bottomLeftCoords[1], bottomLeftCoords[0], topRightCoords[1], topRightCoords[0]);
		        },
		        createLineString: function(xml)
		        {
		        	var routeWKT = "LINESTRING(";
        			var posList = xml.getElementsByTagNameNS(this.gmlNamespace, "pos");
        			
        			for (var i = 0; i < posList.length; i++) {
    	        		var itemPos = posList.item(i);
        				
        				if (i == posList.length - 1) {
        					routeWKT += itemPos.firstChild.nodeValue;
        				} else {
        					routeWKT += itemPos.firstChild.nodeValue + ",";
        				}
        			}
        			
        			routeWKT += ")";
        			
					return new JSGeometry(null, null, "OLS route", routeWKT, null, xml.attributes.getNamedItem("srsName").nodeValue, null);
		        },
		        createRoutingInstruction: function(xml)
		        {
		        	// lvl 1
        			var instructionList = xml.getElementsByTagNameNS(this.xlsNamespace, "Instruction");
        			var distanceList = xml.getElementsByTagNameNS(this.xlsNamespace, "distance");
        			var geometryList = xml.getElementsByTagNameNS(this.xlsNamespace, "RouteInstructionGeometry");
        			
        			// lvl 2
        			var lineStringList = geometryList.item(0).getElementsByTagNameNS(this.gmlNamespace, "LineString");
        			
        			var instruction = instructionList.item(0).firstChild.nodeValue;
        			var textInstruction;
        			
        			switch (this.instructionFormat) {
        				case "text/plain":
        					textInstruction = instruction;
        					break;
        				case "text/html":
        					textInstruction = instruction.replace(/<[^>]*>/g, ' ').trim();
        					break;
        			}
        			
        			return new RouteInstruction(
        				instruction,
        				textInstruction,
            			distanceList.item(0).attributes.getNamedItem('value').nodeValue,
            			this.createLineString(lineStringList.item(0))
        			);
		        },
		        changeStartAddress: function() {
		        	this.items.get('startPoint').setValue(this.model.startPoint == null ? "" : this.model.startPoint.street);
		        },
		        changeEndAddress: function() {
		        	this.items.get('endPoint').setValue(this.model.endPoint == null ? "" : this.model.endPoint.street);
		        },
		        changeViaAddresses: function() {
		        	// do nothing at the moment
		        },
		        changeMethod: function() {
		        	this.items.get('method').setValue(this.model.method);
		        }
    	};
    	
    	Ext.apply(this, Ext.apply(this.initialConfig, config));
		this.callParent();
    }
});
