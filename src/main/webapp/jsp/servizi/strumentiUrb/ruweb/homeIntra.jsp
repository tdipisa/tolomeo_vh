<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
Tolomeo is a developing framework for visualization, editing,  
geoprocessing and decisional support application based on cartography.

Tolomeo Copyright 2011 Comune di Prato;

This file is part of Tolomeo.

Tolomeo is free software; you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as 
published by the Free Software Foundation; either version 3 of the License, 
or (at your option) any later version.

Tolomeo is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with Tolomeo; if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA

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
modificarlo sotto i termini della GNU Lesser General Public License come pubblicato  dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 
Tolomeo è distribuito nella speranza che possa essere utile,
ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.

Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
  

Informazioni Sviluppatori:

Tolomeo è sviluppato dal Comune di Prato

Alessandro Radaelli
Federico Nieri
Mattia Gennari

sit@comune.prato.it
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" %>	<%-- errorPage="/jsp/errore.jsp" --%>
<%@ page import="it.prato.comune.menu.core.*,it.prato.comune.menu.startup.*,it.prato.comune.tolomeo.web.beans.*,it.prato.comune.tolomeo.web.parametri.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false" %>

<%
	GestioneSessione gs = new GestioneSessione(request);
	Parametri params = (Parametri) request.getAttribute("params");
	Boolean jsDebug  = (Boolean) request.getAttribute("jsDebug")  == null ? false : (Boolean) request.getAttribute("jsDebug");
	Boolean cssDebug = (Boolean) request.getAttribute("cssDebug") == null ? false : (Boolean) request.getAttribute("cssDebug");
	
	String lid = request.getParameter("lid");
	String fid = request.getParameter("fid");
	String s   = request.getParameter("s");
	String b   = request.getParameter("b");
	String x   = request.getParameter("x");
	String y   = request.getParameter("y");
%>
<c:set property="gs" var="gs" scope="page" value="<%= gs %>"></c:set>
<c:set property="menu" var="menu" scope="page" value="${gs.menu}"></c:set>
<c:set property="applx" var="applx" scope="page" value="${gs.applicazione}"></c:set>
<c:set property="utente" var="utente" scope="page" value="${gs.utente}"></c:set>
<c:set property="jsDebug" var="jsDebug" scope="page" value="<%= jsDebug %>"></c:set>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<link rel="shortcut icon" type="image/x-icon" href="/tolomeohtdocs/img/favicon.ico" />
	<title><c:out value="${applx.dsProc}" /> - <c:out value="${menu.currentFunz.dsMenu}" /> - <c:out value="${gs.dsEnte}" /></title>
	<script type="text/javascript" src="${applx.urlCss}/js/cookie.js"></script>
	
	<!-- css e js tolomeoExt -->
	<link rel="stylesheet" type="text/css" href="/js/ext/extJS/resources/css/ext-all-olive.css" />
	<link rel="stylesheet" type="text/css" href="/css/toloExt-intra.css" />
	<%-- <link rel="stylesheet" type="text/css" href="/css/servizi/strumentiUrb/articoli.css" /> --%>
	<%-- <link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/aree.css" type="text/css" /> --%>
	
	<script type="text/JavaScript" charset="utf-8" src="/js/tolomeoExt/build/toloExt-all.js"></script>
	<script type="text/javascript" charset="utf-8" src="/tolomeobinj/ToloExtParamsJSServlet?paramPreset=CatastoUrb"></script>
	<script type="text/JavaScript" charset="utf-8" src="/js/tolomeoExt/layout/ToloPanelIntra.js"></script>
	
	<script type="text/javascript" charset="utf-8" src="/js/tolomeoExt/toloStreetviewViewer.js"></script>
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.0&amp;sensor=false"></script>
	<link type="text/css" rel="stylesheet" href="http://code.google.com/apis/maps/documentation/javascript/examples/standard.css" />

	<script type="text/javascript" charset="utf-8" src="/js/ext/proj4js/proj4js-compressed.js"></script>
	
	<script type="text/JavaScript" charset="utf-8">
		//<![CDATA[
		//document.domain = "comune.prato.it";
		var selezioni = new OpenLayers.Layer.Vector("Evidenziazione");
		
		Ext.onReady(function(){
			tolomeo = new TolomeoExt.ToloPanelIntra({
				toolbarOpt: {
					withLegenda: false,
					withQuery: false
				},
				region: 'center',
				border: false,
				titoloMappa: '<c:out value="${menu.currentFunz.dsMenu}" />'
			});
			new Ext.Viewport({
				layout: 'border',
				monitorResize: true,
				items: [
					new Ext.Panel({
						region: 'north',
					    contentEl: 'tmpl_header_top'
					}),
					tolomeo,
					new Ext.Panel({
						region: 'south',
					    contentEl: 'tmpl_footer'
					})
				]
		    });
			
			<% if (lid!=null && fid!=null) { %>
			//eseguo lo zoom all'oggetto...
			tolomeo.api.zoomToObj(
				<%= lid %>,
				<%= fid %>,
				false,
				<% if (s!=null) { %>
					<%= s %>
				<% } else { %>
					null
				<% } %>
				<% if (b!=null) { %>
					,<%= b %>
				<% } %>
			);
			//Ext.getCmp("ext-comp-1074").setValue("Via dell'Agio");
			//Ext.getCmp("ext-comp-1075").setValue("2");
		<% } %>
		<% if (x!=null && y!=null && s!=null) { %>
			//eseguo lo zoom alla posizione...
			tolomeo.api.gotoPosition(
				<%= x %>,
				<%= y %>,
				<%= s %>,
				false
			);
		<% } %>

			//var frameName = 'artFrame';
			var iframe = Ext.create('TolomeoExt.ToloIFrame', {
				iFrameName: 'artFrame',
				id : 'artFrame',
				url: ''
			});

			artWin = new Ext.Window({
		    	title:'Riepilogo normativo area',
		    	id:'artWin',
		    	bodyStyle: 'background-color:white;',
		        layout:'fit',
		        width: 720,
		        height: 550,
		        cls: 'clearCSS norme',
		        autoScroll: false,
		        forceLayout: true,
		        maximizable: true,
		        closeAction: 'hide',
		        buttons: ['->', {
					text: 'Stampa',
					iconCls: 'iconPrint',
					tooltip: {text: 'Stampa il riepilogo normativo', title: 'Stampa'},
					handler: function(){
		            	top.frames['artFrame'].focus();
						top.frames['artFrame'].print();
					}, scope: this
		        },{
		        	text: 'Chiudi',
		       		handler: function() { artWin.hide(); }
		        }],
		        items: [iframe]
		    });

			var map = tolomeo.mapPanel.map;
			    map.addLayers([selezioni]);
			
		    tolomeo.mapPanel.on('onMappaSelect', function () {unSelectFeatures();}, this);
		    tolomeo.toolbar.on('onAnnullaSelezioniPressFn', function () {unSelectFeatures();}, this);

		    <%@include file="../include/vistaSu.jsp" %>
		});

		/**
		 * Deseleziona le features dell'intera macroarea quando si selezione una nuova feature o si annullano le selazioni.
		 */
		function unSelectFeatures(){
			if(selezioni.features.length > 0)	
		    	selezioni.destroyFeatures();
		}
		
		/**
		 * Funzione per visualizzazione articoli norme in finestra extJS separata. 
		 */
		function openArticleWindow(url, nomeCampo, valore, validita, idtpn, codtpn){		
			
			// /////////////////////////////
			// Getting Article Window
			// /////////////////////////////
			
			var window = Ext.getCmp('artWin');			
			if(window.isVisible())
				window.disable();
			
			// ///////////////////
			// Loading mask:
			// //////////////////	
					
			var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Attendere prego..."});
			mask.show();
		
			// ///////////////////
			// Chiamata ajax
			// ///////////////////
			
			var ajaxOptions = {
				method: 'post',
				timeout: 120000,
				url: url,
				params: {
					validita: validita,
					nomeCampo: nomeCampo,
					valore: valore,
					codTPN: codtpn,
					IDTPN: idtpn,
				  	format: 'ext'
				},
				scope: this,
				success: function(result){
					mask.hide();
		
			    	if(!window.isVisible())
		        		window.show();
		        	else
		            	window.enable();
		    
					//window.update(result.responseText);
					htmlTemplate =  "<html><head>";
					htmlTemplate += '<link rel="stylesheet" type="text/css" href="http://tolomeo.comune.prato.it/js/ext/extJS/resources/css/ext-all-olive.css" />';
					htmlTemplate += '<link rel="stylesheet" type="text/css" href="http://tolomeo.comune.prato.it/css/toloExt-intra.css" />';
					htmlTemplate += '<link rel="stylesheet" type="text/css" href="http://tolomeo.comune.prato.it/css/servizi/strumentiUrb/articoli.css" />';
					htmlTemplate += '<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/aree.css" type="text/css" />';
					htmlTemplate += '<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/formatta.css" type="text/css" />';
					htmlTemplate += '<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/liste.css" type="text/css" />';
					htmlTemplate += '<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/tabelle.css" type="text/css" />';
					htmlTemplate += "</head><body>{0}</body></html>";
					    
					var loadingConfig = {
						'htmlTemplate' : htmlTemplate,
						'message' : result.responseText
					};
					
					var ifr = Ext.getCmp('artFrame');
					ifr.loading(loadingConfig);
					/*
					var ifrDocument = top.frames['frameArt'].document; 
					ifrDocument.open();
					ifrDocument.write(result.responseText);
					ifrDocument.close();
					*/
				},
				failure: function(result){
					mask.hide();
					Ext.Msg.alert('Riepilogo normativo area', 'Errore nel caricamento degli articoli normativi.');
				}
			}
						
			Ext.Ajax.request(ajaxOptions);
		}
		
		/**
		 * Funzione di Zoom alla scala del piano 
		 */
		function zoomToScalePlan(scale){
			tolomeo.api.viewer.pluginZoomToScale(scale);
		}
		
		/**
		 * Funzione per Evidenzia intera macroarea
		 */
		function evidenzia(geometries) {
			features = [];
		
			for(var i=0; i<geometries.length; i++){
				var wkt = new OpenLayers.Format.WKT();
				var feature = wkt.read(geometries[i]);
			    features.push(feature);	
			}    
		
			if(selezioni.features.length > 0)	
		    	selezioni.destroyFeatures();
			selezioni.addFeatures(features);	
		}
		//]]>
	</script>
</head>

<body>
	<div id="tmpl_header_top">
		<!-- Intestazione/header -->
		<div id="tmpl_header">
			<div id="tmpl_headerwrap">
				<div id="tmpl_procedura">
					<span id="tmpl_procedura_jmpmn"><a href="#tmpl_menu" title="salta al menù della procedura" accesskey="8">Salta al menù</a></span>
					<span id="tmpl_procedura_jmpcntnt"><a href="#content" title="salta al contenuto della procedura" accesskey="0">Salta al contenuto</a></span>
					<span id="tmpl_procedura_titolo"><c:out value="${applx.dsProc}" /></span>
					<span id="tmpl_procedura_sottotitolo"><c:out value="${menu.currentFunz.dsTitolo}" /></span>
				</div>
			</div>
			
			<div id="tmpl_utenza">
				<span id="tmpl_utenza_nome"><c:out value="${utente.nominativo}" /> (<c:out value="${utente.idUser}" />)</span>
				<span id="tmpl_utenza_data">
					<fmt:formatDate value="<%= new java.util.Date() %>" type="date" dateStyle="full" pattern="EEE dd MMMM yyyy HH:mm:ss" var="dataOra" /><c:out value="${dataOra}" />
				</span>
			</div>
		</div>
		<!-- Fine Intestazione/header -->
	
		<!-- Logout/Percorso -->
		<div id="tmpl_barra">
			<div id="tmpl_barrawrap"> 
				<div id="tmpl_percorso">
					<ol title="Percorso di navigazione dalla home page">
						<li><a href="<c:out value="${applx.urlHome}" />">home</a></li>
						<li><c:out value="${menu.currentBarraNav}" /></li> 
					</ol>
				</div>
			</div>
			<div id="tmpl_logout"><a href="javascript:window.close();">logout</a></div>
		</div>
		<!-- Fine Logout/Percorso -->
	</div>
	
	<!-- Copyright -->
	<div id="tmpl_footer">
		<div class="minibutton validator" title="CSS valido">W3C <span>CSS 3</span></div>
		<div class="minibutton validator" title="XHTML valido">W3C <span>XHTML 1.0</span></div>
		<div class="minibutton comune" title="Copyright Comune di Prato, tutti i diritti riservati">copyright <span>Comune di Prato</span></div>
	</div>
	<!-- Fine Copyright -->
</body>
</html>
