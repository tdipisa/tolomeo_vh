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
--%>
<%--@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>	<%-- ISO-8859-1 errorPage="/jsp/errore.jsp" --%>
<%@ page import="it.prato.comune.menu.core.*,it.prato.comune.menu.startup.*,it.prato.comune.tolomeo.web.beans.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false" %>

<%--
<% GestioneSessione gs = new GestioneSessione(request); %>
<c:set property="gs" var="gs" scope="page" value="<%= gs %>"></c:set>
<c:set property="menu" var="menu" scope="page" value="${gs.menu}"></c:set>
<c:set property="applx" var="applx" scope="page" value="${gs.applicazione}"></c:set>
<c:set property="utente" var="utente" scope="page" value="${gs.utente}"></c:set>
 --%>

<% 
	AfterForwardBean af = (AfterForwardBean)request.getAttribute("afterForward");
%>

<html xmlns="http://www.w3.org/1999/xhtml" 
	xml:lang="it" 
	lang="it">
	
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
	<link rel="shortcut icon" type="image/x-icon" href="/tolomeohtdocs/img/favicon.ico" />
	<%-- <title><c:out value="${applx.dsProc}" /> - <c:out value="${menu.currentFunz.dsMenu}" /> - <c:out value="${gs.dsEnte}" /></title>  --%>
	<link rel="stylesheet" href="/commonintra2-0/css/main.css" type="text/css" media="all" />
	<link rel="stylesheet" href="/commonintra2-0/css/menu.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="/commonintra2-0/css/form.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="/commonintra2-0/css/tabelle.css" type="text/css" media="all" />
	<link rel="stylesheet" href="/commonintra2-0/css/print.css" type="text/css" media="print"/>	
	<link href="/css/toloExt-intra.css" type="text/css" rel="stylesheet" media="all"/>
	
	<script type="text/JavaScript">
		function mapOperation() {	

			if (window.parent.tolomeo != null) {
				api = window.parent.tolomeo.api;
				<% if (af != null) { %>
					<% if (af.isRefreshMap() && af.isZoomToExtent()) { %>
						api.viewer.pluginRefreshMap();
						api.refreshSelected();
						api.viewer.pluginZoomToExtent(<%= af.getJsonGeometryToExtent() %>.geometry);
					<% } else if (af.isRefreshMap()) { %>
						api.viewer.pluginRefreshMap();
						api.refreshSelected();
					<% } else if (af.isZoomToExtent()) { %>
						api.viewer.pluginZoomToExtent(<%= af.getJsonGeometryToExtent() %>.geometry);
					<% } %>
				<% } %>

			} else {
				var called = (self.parent == null || self == parent) ? self.opener : self.parent;
				<% if (af != null) { %>
					<% if (af.isRefreshMap() && af.isZoomToExtent()) { %>
							called.pluginRefreshMap();
							called.refreshSelected();
							called.zoomToExtent(<%= af.getJsonGeometryToExtent() %>.geometry);
					<% } else if (af.isRefreshMap()) { %>
							called.pluginRefreshMap();
							called.refreshSelected();
					<% } else if (af.isZoomToExtent()) { %>
							called.zoomToExtent(<%= af.getJsonGeometryToExtent() %>.geometry);
					<% } %>
				<% } %>
			}
		}
	</script>
