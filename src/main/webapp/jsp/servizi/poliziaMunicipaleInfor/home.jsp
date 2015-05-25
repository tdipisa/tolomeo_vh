<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
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
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" %>	<%-- errorPage="/jsp/errore.jsp" --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false" %>

<%
	String callbackURL = (request.getParameter("CallbackURL"));
	int modalita       = Integer.parseInt(request.getParameter("Modalita"));
	String codVia      = (request.getParameter("CodiceToponimoA"));
	String codVia2     = (request.getParameter("CodiceToponimoB"));
	String numCiv      = request.getParameter("Ncivico");
	String szx         = request.getParameter("CoordinataE");
	String szy         = request.getParameter("CoordinataN");
	
	numCiv = (numCiv!=null && numCiv.contains("/")) ? numCiv.split("/")[0] : numCiv;
	
	double x = 0;
	double y = 0;
	if (szx!=null && szy!=null) {
		x = Double.parseDouble(szx);
		y = Double.parseDouble(szy);
	}
%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">

<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />    
	<link rel="shortcut icon" type="image/x-icon" href="http://tolomeo.comune.prato.it/img/favicon.ico" />
	<title>Mappa georeferenziazione</title>
	
	<!-- css tolomeo -->
	<link rel="stylesheet" type="text/css" href="/js/ext/extJS/resources/css/ext-all-olive.css" />
	<link rel="stylesheet" type="text/css" href="/css/toloExt-intra.css" />
	
	<!-- js core tolomeo -->
	<script type="text/javascript" charset="utf-8" src="/js/tolomeoExt/build/toloExt-all.js"></script>	
	
	<!-- js e css per google streetview -->
	<script type="text/javascript" charset="utf-8" src="/js/tolomeoExt/toloStreetviewViewer.js"></script>
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false&client=gme-comunediprato&channel=sinistri_infor"></script>
	<link href="http://code.google.com/apis/maps/documentation/javascript/examples/standard.css" rel="stylesheet" type="text/css" />
			
	<!-- js preset e layout -->
	<script type="text/javascript" charset="utf-8" src="/tolomeobinj/ToloExtParamsJSServlet?paramPreset=PMSinistriInfor"></script>
	<script type="text/javascript" charset="utf-8" src="/js/tolomeoExt/layout/ToloPanelIntra.js"></script>
	<script type="text/javascript" charset="utf-8">
		Ext.BLANK_IMAGE_URL= "/img/pixel.gif";
		
		/*
		 * Funzione chiamata nell'inserimento del sinistro. Intercetta le coordinate e le trasmette al chiamante...
		 */
		function nuovoSinistroHandler(values) {

			if(values.geoOp == tolomeo.api.digitizeOperationInsert && values.codTPN==-3814) {

				var urlToEscape = '<%= callbackURL %>';
				var url = unescape(urlToEscape.replace(/\+/g,  " "));
				
				var wkt = new OpenLayers.Format.WKT();

				jsgeometry = new JSGeometry(values.geoCoord);

				punto = wkt.read(jsgeometry.geometry).geometry;

				url += (url.indexOf("?") >= 0) ? "&" : "?";
				window.opener.location.href = url + "CoordinataN=" + punto.y + "&CoordinataE=" + punto.x;
				self.close();
				
			} else {
				Ext.Msg.show({
					title  : 'Mappa georeferenziazione',
					msg    : 'Parametri di inserimento non corretti!',
					buttons: Ext.Msg.OK,
					icon   : Ext.MessageBox.ERROR
				});
			}
		}

		//funzione di ricerca per via e civico
		function ricercaOK(results, store) {

			//nessun civico trovato...eseguo zoom alla via
			if (store.getTotalCount() == 0) {
				<% if (codVia!=null) { %> tolomeo.api.zoomToObj(-510, <%= "1000700000" + codVia %>, false, null, 100); <% } %>

			//un solo civico trovato...
			} else if (store.getTotalCount() == 1) {

				var record = store.getAt(0).data;

				//...eseguo zoom a quel civico se georiferito...
				if (record.geometry!=null && record.geometry!="") {
					tolomeo.api.zoomToObj(record.codTPN, record.key, false, null, 100);
				//...altrimenti faccio lo zoom all'intera via
				} else {
					//Ext.MessageBox.alert('Mappa georeferenziazione', 'Il civico ' + record.description + ' non è georiferito\nEseguo zoom alla via...').getDialog().focus();
					var record = store.getAt(0).data;
					tolomeo.api.zoomToObj(-510, record.additionalFields.idStrada, false, null, 100);
				}

			//più civici trovati...eseguo lo zoom alla zona ricoperta da tutti i civici trovati
			} else {
				
				var boundingBox = store.reader.meta.boundingBox;
				if (boundingBox!=null) {
					tolomeo.api.zoomToExtent(boundingBox, 100);
				} else {
					//Ext.MessageBox.alert('Mappa georeferenziazione', 'Ingombro civici non disponibile.\nEseguo zoom alla via...').getDialog().focus();
					var record = store.getAt(0).data;
					tolomeo.api.zoomToObj(-510, record.additionalFields.idStrada, false, null, 100);
				}
			}
		};

		/*
		 * Funzione chiamata in seguito ad errore durante la ricerca dei civici
		 */
		function ricercaKO() {
			Ext.Msg.show({
				title  : 'Mappa georeferenziazione',
				msg    : 'Errore durante la ricerca',
				buttons: Ext.Msg.OK,
				icon   : Ext.MessageBox.ERROR
			});
		};
		
		Ext.onReady(function(){
			tolomeo = new TolomeoExt.ToloPanelIntra({
				toolbarOpt: {
					withLegenda: false,
					withQuery: false,
					withInfoSelezione: true
				},
				region: 'center',
				border: false,
				titoloMappa: 'Mappa georeferenziazione',
				APIConfig: {
					listeners: {
						'actionsEnd':{fn:this.nuovoSinistroHandler,scope:this}
					}
				}
			});
			new Ext.Viewport({ 
	            layout: 'border', 
	            monitorResize: true, 
	            region: 'center', 
	            items: [tolomeo] 
			});
			
			<% if (modalita == 1 || modalita == 3) { %>
				//zoom alla via
				tolomeo.api.zoomToObj(-510, <%= "1000700000" + codVia %>, false, null, 100);
			
			<% } else if (modalita == 2) { %>

				//zoom al civico
				var submitOpt = {
					url    : TolomeoExt.Vars.TOLOMEOServer + TolomeoExt.Vars.TOLOMEOContext+ '/AjaxQueryServlet',
					method : 'POST',
					params : {
						campoRicerca0 : <%= "1000700000" + codVia %>,
						campoRicerca1 : <%= numCiv %>,
						format        : "ext",
						codTPN        : -610,
						idCampo       : 0,
						idRicerca     : 3
					},
					success: ricercaOK,
					failure: ricercaKO,
					scope  : this
				};

				new TolomeoExt.ToloCrossAjax().request(submitOpt);
			
			<% } else if (modalita == 4) { %>
				//zoom a 2 vie
				tolomeo.api.zoomToObj(-510, [<%= "1000700000" + codVia %>, <%= "1000700000" + codVia2 %>], false, null, 100);
			
			<% } else if (modalita == 5) { %>
				//zoom a coordinata
				tolomeo.api.gotoPosition(<%= x %>, <%= y %>, 2000, true, 'EPSG:3003');
				
			<% } else if (modalita == 6) { %>
				//senza zoom
				Ext.MessageBox.alert('Mappa georeferenziazione', 'Zoom non disponibile per questa modalità').getDialog().focus();

			<% } else { %>
				Ext.Msg.show({
					title  : 'Mappa georeferenziazione',
					msg    : 'La modalità passata non è prevista!',
					buttons: Ext.Msg.OK,
					icon   : Ext.MessageBox.ERROR
				});
			<% } %>
		});
	</script>
</head>

<body>
</body>

</html>