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
<%@ page language="java" %>
<%@ taglib uri="/WEB-INF/tld/c.tld" prefix="c" %>
<%@page import="it.prato.comune.tolomeo.web.parametri.Parametri" %>
<%@page import="it.prato.comune.sit.asm.PuntoUbicazioni" %>


<jsp:include page="../../include/gss/tmplBaseUPPannello.jsp" />

<%

	String title = "";
	String submitValue = "";
	String title1 = "";
	
    String rifStrad = "";
    String rifCiv= "";
    String descrizione= "";
	
	PuntoUbicazioni ubi = (PuntoUbicazioni) request.getAttribute("ubi");
	if (ubi!=null) {
        rifStrad = ubi.getRiferimentoStradale()==null ? "" : ubi.getRiferimentoStradale().toString();
        rifCiv= ubi.getRiferimentoCivico()==null ? "" : ubi.getRiferimentoCivico().toString();
        descrizione= ubi.getDescrizione();
	}
	
	String idTPN = (request.getParameter("idTPN") == null ? (String) request.getAttribute("idTPN") : request.getParameter("idTPN"));
	if (idTPN==null) idTPN="";
	String codTPN = (request.getParameter("codTPN") == null ? (String) request.getAttribute("codTPN") : request.getParameter("codTPN"));
	if (codTPN==null) codTPN="";
	String geoCoord = (request.getParameter("geoCoord") == null ? (String) request.getAttribute("geoCoord") : request.getParameter("geoCoord"));
	if (geoCoord==null) geoCoord="";
	String geoOp = (request.getParameter("geoOp") == null ? (String) request.getAttribute("geoOp") : request.getParameter("geoOp"));
	if (geoOp==null) geoOp="";
	
	if (geoOp.equals(Parametri.digitizeOperationInsert)){
	    title = "Inserimento ubicazione";
	    title1 = "Inserisci Ubicazione";
	    submitValue = "Inserisci"; 
	} else if (geoOp.equals(Parametri.operationUpdateAlfa)){
	    title = "Modifica dati ubicazione";
	    submitValue = "Modifica"; 
	    title1 = "Modifica Ubicazione";
	}


%>

<html xmlns="http://www.w3.org/1999/xhtml" lang="it" xml:lang="it">

	<head>
	
		<title><%= title %></title>
		
		<meta http-equiv="content-type" content="text/html; charset=iso-8859-1"/>
		<meta http-equiv="pragma" content="no-cache" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta content="Mappa interattiva del Comune di Prato" name="description"/>
		<meta content="comune di prato, prato, cartografia" name="keywords"/>
		<link href="/tolomeohtdocs/css/tolomeo.css" type="text/css" rel="stylesheet"/>
		<link href="/tolomeohtdocs/css/formatta.css" type="text/css" rel="stylesheet"/>
		
		<style type="text/css">
		
			.f-fieldset {
				background-color: #fff;
			}
			
			.f-legend { 
				margin-bottom: 0;
				background-color: #fff;
				font-size: 0.9em;
			}
			
			.f-etichetta { font-size: 0.9em; }
			
			.f-dato { font-size: 0.9em; }
			
			.pressed {border-style: double solid}
			
			a {border-style: none; background-color: white;}
			a:link {border-style: none; background-color: white;}
			a:hover{border-style: none; background-color: white;}
			a:visited{border-style: none; background-color: white;}
						
		</style>
		
		<script type="text/JavaScript">
			function init(){
				if (document.getElementById("rifStrad"))
					document.getElementById("rifStrad").focus();
			}
		</script>
	
	</head>
	
	<body onload="init();">		
	
		<div class="pannello">
			<h1 class="titolomappa"><%= title1 %></h1>
			<br />
			
			<form name="insUbicazione" id="form0" action="/tolomeobinj/gss/InserisciUbicazioniServlet" method="post">
				<fieldset class="f-fieldset">
					<legend class="f-legend">Ubicazione</legend>
					
					<div class="f-elemento">
						<label for="rifStrad" class="f-etichetta">Riferimento stradale:</label>
						<% if (geoOp.equals(Parametri.operationIdentify)) { %>
							<span class="f-dato"><%= rifStrad %></span>
						<% } else { %>
							<input id="rifStrad" class="f-dato" name="rifStrad" type="text" tabindex="1" value="<%= rifStrad %>" />
						<% } %>
					</div>
					
					<div class="f-elemento">
						<label for="rifCiv" class="f-etichetta">Riferimento civico:</label>
						<% if (geoOp.equals(Parametri.operationIdentify)) { %>
							<span class="f-dato"><%= rifCiv %></span>
						<% } else { %>
							<input id="rifCiv" class="f-dato" name="rifCiv" type="text" tabindex="1" value="<%= rifCiv %>" />
						<% } %>
					</div>
					
					<div class="f-elemento">
						<label for="descrizione" class="f-etichetta">Descrizione:</label>
						
						<% if (geoOp.equals(Parametri.operationIdentify)) { %>
							<span class="f-dato"><%= descrizione %></span>
						<% } else { %>
							<input id="descrizione" class="f-dato" name="descrizione" type="text" tabindex="1" value="<%= descrizione%>" />
						<% } %>
					</div>
					
					<div class="f-elemento" style="padding: 1em 0 0.5em 0; text-align: center;">
						<input type="hidden" name="idTPN" value="<%= idTPN %>" />
						<input type="hidden" name="codTPN" value="<%= codTPN %>" />
						<input type="hidden" name="geoCoord" value='<%= geoCoord %>' />
						<input type="hidden" name="geoOp" value='<%= geoOp %>' />
						<% if (!geoOp.equals(Parametri.operationIdentify)) { %>
							<input type="submit" name="sub0" id="sub0" value="<%= submitValue %>" class="bottone" />
						<% } %>
					</div>
					
					<%-- %><a href="#" onclick="this.className='pressed'"><img class="bottoni" src="/tolomeohtdocs/img/error.png" /></a>--%>
					
				</fieldset>
			</form>
			<%-- 
			<div class="noStampa centro">
				<input type="button" onclick="window.print();" id="stampa" name="stampa" value="Stampa" class="bottone" />
				<input type="button" onclick="history.go(-2);" name="indietro" id="indietro" value="Indietro" class="bottone" />
			</div>
			--%>		

		</div>
		
<%@ include file="../../include/gss/tmplBaseDOWNPannello.jsp" %>
