<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
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

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>	<%-- ISO-8859-1 errorPage="/jsp/errore.jsp" --%>
<%@ page import="it.prato.comune.tolomeo.web.beans.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false" %>
<% AfterForwardBean af = (AfterForwardBean)request.getAttribute("afterForward"); %>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="description" content="Descrizione diversa dal titolo" />
<meta name="keywords" content="elenco parole chiave separate da virgola" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/gener100.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/aree.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/formatta.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/immagini.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/liste.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/recapiti.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/tabelle.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/form.css" type="text/css" />
<link rel="stylesheet" href="http://www.comune.prato.it/common/css/comune/print.css" media="print" type="text/css" />

<title> Titolo della pagina </title>

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
		}
	}
</script>
</head>
<body style="background: none #fff" onload="mapOperation();">

<div id="main">
