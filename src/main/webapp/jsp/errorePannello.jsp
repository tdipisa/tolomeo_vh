<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
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
<%-- @ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="ISO-8859-1" %>	<%-- errorPage="/jsp/errore.jsp" --%>
<%@ page isErrorPage="true" %>
<%@ page import="it.prato.comune.tolomeo.web.TolomeoWebException" %>
<%@ page import="it.prato.comune.menu.core.*,it.prato.comune.menu.startup.*" %>
<%@ page import="it.prato.comune.tolomeo.utility.TolomeoApplicationContext"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>

<%@ page isELIgnored="false" %>

<% 

	GestioneSessione gs = new GestioneSessione(request);

	String messaggio = request.getParameter("messaggio");
	if(messaggio == null) messaggio = (String)request.getAttribute("messaggio");

	String errore = null;
	String codErrore = null;
	 	
	if(exception != null){	   
	  
	   TolomeoWebException tException;
	   if(!(exception instanceof TolomeoWebException)){
	       tException = new TolomeoWebException(new Exception(exception));
	   }else{
	       tException = (TolomeoWebException)exception;
	       if(messaggio == null && exception != null){
	   	    	messaggio = tException.getMessage();	    
	   	   }
	   }
	   
	   errore = tException.getMessage();
	   codErrore = "( " + tException.getCode() + " )";
	   
	   //... Istanziazione Logger 
	   TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();       
	   String loggerName = context.getLogName();
	   LogInterface logger = new PratoLogger(loggerName,request.getRemoteUser(),request.getRemoteAddr());
		
	   logger.error(errore,tException.getException());	   	   
	}			
	
%>
<c:set property="gs" var="gs" scope="page" value="<%= gs %>"></c:set>
<c:set property="menu" var="menu" scope="page" value="${gs.menu}"></c:set>
<c:set property="applx" var="applx" scope="page" value="${gs.applicazione}"></c:set>
<c:set property="utente" var="utente" scope="page" value="${gs.utente}"></c:set>
<c:set var="messaggiList" value="${requestScope.messaggi}" />


<%@page import="it.prato.comune.utilita.logging.interfaces.LogInterface"%>
<%@page import="it.prato.comune.utilita.logging.PratoLogger"%>
<html xmlns="http://www.w3.org/1999/xhtml" 
	xml:lang="it" 
	lang="it">
	
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
	<link rel="shortcut icon" type="image/x-icon" href="${applx.urlCss}/img/favicon.ico" />
	<title><c:out value="${applx.dsProc}" /> - <c:out value="${menu.currentFunz.dsMenu}" /> - <c:out value="${gs.dsEnte}" /> - ERRORE</title>
	<script type="text/javascript" src="${applx.urlCss}/js/cookie.js"></script>	
    <script type="text/javascript" src="${applx.urlCss}/js/menu.js"></script>
    <link rel="stylesheet" href="${applx.urlCss}/css/main.css" type="text/css" media="all" />
	<link rel="stylesheet" href="${applx.urlCss}/css/menu.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="${applx.urlCss}/css/form.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="${applx.urlCss}/css/tabelle.css" type="text/css" media="all" />
	<link rel="stylesheet" href="${applx.urlCss}/css/print.css" type="text/css" media="print"/>
</head>

<body id="tmpl_popup">

<!-- Menu/Content -->	
<div id="tmpl_main">
	<!-- Content -->
	<div id="tmpl_mainwrap">

	<c:choose>
		<c:when test="${!empty messaggiList}">
		
			<div id="tmpl_content">
				
				<%@ include file="include/tmplPulsantiera.jsp" %>
	
				<%@ include file="include/tmplTitolo.jsp" %>
				
				<%@ include file="include/tmplMessaggio.jsp" %>
			
			</div>
			
		</c:when>
		<c:otherwise>
			
			<div id="tmpl_content">
			
				<h1 id="contenuto">Errore</h1>
				
				<div id="tmpl_messaggio">
				
					<div class="tmpl_messaggio_err">
					
						<%-- if (exception != null && exception.getMessage() != null ) {  %>
							<%= exception.getMessage()%> 
							
						<% } else { --%>
							<% 
							
							 if (messaggio != null && messaggio.trim().length() > 0 ) { %>
							 
								<%= messaggio %>
								
							<% } else { %>
								
								Si è verificata un'eccezione
								
							<% } %>
						<%-- } --%>	
					</div>
				</div>
				
			</div>
			
		</c:otherwise>
	</c:choose>	
		
	</div>
	<!-- Fine Content -->

	<!-- Menù -->
	<%--jsp:include page="include/tmplMenu.jsp"></jsp:include--%>
	<!-- Fine Menù -->
	
</div>
<!-- Fine Menu/Content -->

<%@ include file="include/tmplBaseDOWN.jsp" %>
