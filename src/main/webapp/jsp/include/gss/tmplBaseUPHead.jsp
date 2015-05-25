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
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="ISO-8859-1" %>	<%-- errorPage="/jsp/errore.jsp" --%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page import="it.prato.comune.tolomeo.web.beans.*" %>
<%@ page isELIgnored="false" %>

<% AfterForwardBean af = (AfterForwardBean)request.getAttribute("afterForward"); 

%>


<html xmlns="http://www.w3.org/1999/xhtml" 
	xml:lang="it" 
	lang="it">
	
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
	<link rel="shortcut icon" type="image/x-icon" href="/commonintra/img/favicon.ico" />
	<title>Infoway</title>
    
	<link rel="stylesheet" href="/commonintra2-0/css/main.css" type="text/css" media="all" />
	<link rel="stylesheet" href="/commonintra2-0/css/menu.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="/commonintra2-0/css/form.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="/commonintra2-0/css/tabelle.css" type="text/css" media="all" />
	<link rel="stylesheet" href="/commonintra2-0/css/print.css" type="text/css" media="print"/>
	<link rel="stylesheet" href="/commonintra2-0/css/sit.css" type="text/css" media="all"/>
	
	<script type="text/JavaScript">
		function mapOperation() {	
			var called = (self.parent == null || self == parent) ? self.opener : self.parent;
			
			<% if (af != null) { %>
			
				<% if (af.isRefreshMap() && af.isZoomToExtent()) { %>
						called.pluginRefreshMap();
						called.zoomToExtent(<%= af.getJsonGeometryToExtent() %>.geometry);
				<% } else if (af.isRefreshMap()) { %>
						called.pluginRefreshMap();
				<% } else if (af.isZoomToExtent()) { %>
						called.zoomToExtent(<%= af.getJsonGeometryToExtent() %>.geometry);
				<% } %>
				
			<% } %>
		}
	</script>
