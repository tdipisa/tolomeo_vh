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
<%@page import="it.prato.comune.utilita.core.type.DateType"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>	<%-- errorPage="/jsp/errore.jsp" --%>
<%@ page import="it.prato.comune.tolomeo.web.beans.*,it.prato.comune.tolomeo.web.parametri.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false" %>

<%
	Parametri params = (Parametri) request.getAttribute("params");
	Boolean jsDebug  = (Boolean) request.getAttribute("jsDebug")  == null ? false : (Boolean) request.getAttribute("jsDebug");
	Boolean cssDebug = (Boolean) request.getAttribute("cssDebug") == null ? false : (Boolean) request.getAttribute("cssDebug");
	
	String tolomeoStaticRoot = request.getAttribute("TOLOMEOStaticRoot").toString();
	
	String tolomeoLayout = request.getAttribute("tolomeoLayout").toString();
%>

<c:set property="jsDebug" var="jsDebug" scope="page" value="<%= jsDebug %>"></c:set>
<c:set property="cssDebug" var="cssDebug" scope="page" value="<%= cssDebug %>"></c:set>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
	<link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico" />
	<title>Tolomeo - Comune di Prato</title>
	
	<!-- css e js tolomeoExt -->
	<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>js/ext/extJS/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>css/toloExt-intra.css" />
	<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>css/toloExt-default.css" />
	<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>js/ext/csw/css/csw.css" />
	<!-- Styler -->
	<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>css/styler.css" />
	
	<%
		// Inclusione API di Google se necessaria
		if ( params.getMappe().hasMapWithTypeCode(ParametriMappa.typeGoogleHybrid) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeGooglePhysical) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeGoogleSatellite) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeGoogleStreets)) {
			if (params.getMappe().getGoogleAPIVersion().equals("2")) {
				%> <script type="text/javascript" src='http://maps.google.com/maps?file=api&amp;key=<%=params.getMappe().getGoogleAPIKey() %>'></script> 
				<%
			} else if (params.getMappe().getGoogleAPIVersion().equals("3")) {
				%> <script src="http://maps.google.com/maps/api/js?v=3.2&amp;sensor=false"></script> 
				<%
			}
		}
		// Inclusione API di Yahoo se necessaria
		if ( params.getMappe().hasMapWithTypeCode(ParametriMappa.typeYahooHyb) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeYahooReg) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeYahooSat)) {
			
			%> <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&amp;appid=euzuro-openlayers"></script> 
			<%
			
		}
	
		// Inclusione API di Bing se necessaria
		if ( params.getMappe().hasMapWithTypeCode(ParametriMappa.typeBingAerial) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeBingHybrid) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeBingShaded)) {
			
			%> <script src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2&amp;mkt=en-us"></script> 
			<%
		}		
	%>
	
	<c:choose>
		<c:when test="${jsDebug}">
		
			<script type="text/JavaScript" src="<%= tolomeoStaticRoot %>js/ext/extJS/ext-all-debug-w-comments.js" charset="utf-8"></script> 
			<script type="text/JavaScript" src="<%= tolomeoStaticRoot %>js/ext/extJS/locale/ext-lang-it.js" charset="utf-8"></script>
		<script type="text/JavaScript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/lz-string/libs/lz-string-1.3.3.js"></script>
			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/OpenLayers-all.js"></script>  
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/MapPatch.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/PointFromRef.js"></script>	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/ConstrainedPath.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/ConstrainedPoint.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/ConstrainedPolygon.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/AttributionMulti.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/tolomGeometry.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ExtFix.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloParamsJS.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloVars.js"></script>
			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloCrossAjax.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloMeasurePanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloPanelBase.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloScaleComboExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloScalePanelExt.js"></script>		
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloViewerOLExt.js"></script>		
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloAPIOpCodes.js"></script>
			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTOCAbstractDataProvider.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTOCMultiServerDataProvider.js"></script>  
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTOCPanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTreeTOCPanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTOCNodeColumnExt.js"></script> 	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloMenuTOCPanelExt.js"></script> 
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloStylePanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloQueryPanelExt.js"></script> 	
			<script type="text/JavaScript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloButtonPanelExt.js"></script>   
		 	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloLazyLoad.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloProjection.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloMapAPIExt.js"></script>
			
			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloPointFromRefPanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloCADPanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloGotoLocationWindowExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloContextMenu.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/statusbar/StatusBar.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/Carousel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/CarouselPanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTimeMachinePanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTimeMachineMultiPanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloIFrame.js"></script>  
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloTOCInfo.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloLayerViewerAggregation.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloServerMappe.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloMapDefinition.js"></script>		
						
		    <!-- CSW --> 
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/i18n/reader/Property.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/i18n/reader/Json.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/i18n/Bundle.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWRecord.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWRecordsReader.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWHttpProxy.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWGrid.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWCatalogChooser.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWSearchTool.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWPanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWPagingToolbar.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloWMSExplorerPanel.js"></script>  
			  
			<!-- Cesium 3D -->
		 	<script type="text/JavaScript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloCesiumPanelExt.js"></script>  
		 	
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloCommand.js"></script>		
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloProcedure.js"></script>
		 	
		 	<!-- Query Builder -->
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloFeatureGridPanel.js"></script>		
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloFeatureManager.js"></script>		
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloQueryBuilderExt.js"></script>		 	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/ToloAttributeFilter.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/ToloFilterBuilder.js"></script>
		
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/ToloFilterView.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/ToloLayerSelector.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/ToloSpatialSelector.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/grid/ToloFeatureGrid.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/ToloBBOXFieldset.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/ToloBufferFieldset.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/ToloComparisonComboBox.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/ToloCoordinatePicker.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/ToloFilterField.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/ToloUniqueValuesCombo.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/spatialselector/ToloSpatialSelectorMethod.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/spatialselector/ToloPolygonSpatialSelectorMethod.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/spatialselector/ToloBBOXSpatialSelectorMethod.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/spatialselector/ToloBufferSpatialSelectorMethod.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/form/spatialselector/ToloCircleSpatialSelectorMethod.js"></script>
																															
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/widgets/grid/ToloFeatureGrid.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/events/ToloQueryBuilderEvtManager.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/data/ToloUniqueValuesStore.js"></script>
			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/SetBox.js"></script>
		 	<!-- Fine Query Builder -->
		 	
		 	<!-- Inizio OpenLS -->
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/tolomOLS.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/BaseForm.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/GeocodingForm.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/GeocodingListPanel.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/NavigationSummaryPanel.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/NavigationListPanel.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/ReverseGeocodingForm.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/RoutingNavigationForm.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/ViaListPanel.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/ToloOLSPanelExt.js"></script>
		 	<!-- Fine OpenLS -->
		 		
		 	<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/ext/extJS/Skirtle/CTemplate.js"></script>	
		 	<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/ext/extJS/Skirtle/grid/column/Component/Component.js"></script>
		 	
		 	<!-- Inizio Styler  -->
		 	<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/Renderer/DefaultSymbolizer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/slider/Tip.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/form/ColorField.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/form/FontComboBox.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/form/ComparisonComboBox.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/form/FilterField.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/FeatureRenderer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/StylePanel.js"></script>	
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/StrokeSymbolizer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/FillSymbolizer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/TextSymbolizer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/ScaleLimitPanel.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/PointSymbolizer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/LineSymbolizer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/PolygonSymbolizer.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/FilterBuilder.js"></script>
			<script type="text/javascript" src="<%= tolomeoStaticRoot %>js/tolomeoExt/Styler/RulePanel.js"></script>
			<!-- Fine Styler  -->
				
		</c:when> 
		<c:otherwise>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/build/toloExt-all.js"></script>
			
		</c:otherwise>
	</c:choose>
	
	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/proj4js/proj4js-compressed.js"></script>
	
	<!-- js e css per streetview se necessario -->
	<c:if test="${params.layOut.conStreetView}">
		<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloStreetviewViewer.js"></script>
		<c:choose>
			<c:when test="${googleAPIStato}">
				<% if (! request.getScheme().equalsIgnoreCase("https")) { %>
					<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.0&sensor=false&client=<c:out value="${googleAPIClientID}"/>&channel=<c:out value="${fn:replace(menu.currentFunz.dsMenu, ' ', '_')}" />"></script>
					<link href="http://code.google.com/apis/maps/documentation/javascript/examples/standard.css" rel="stylesheet" type="text/css" />
				<% } else { %>
					<script type="text/javascript" src="https://maps.google.com/maps/api/js?v=3.0&sensor=false&client=<c:out value="${googleAPIClientID}"/>&channel=<c:out value="${fn:replace(menu.currentFunz.dsMenu, ' ', '_')}" />"></script>
					<link href="https://code.google.com/apis/maps/documentation/javascript/examples/standard.css" rel="stylesheet" type="text/css" />
				<% } %>
			</c:when>
			<c:otherwise>
				<% if (! request.getScheme().equalsIgnoreCase("https")) { %>
					<script type="text/javascript" src="http://maps.google.com/maps/api/js?v=3.0&sensor=false"></script>
					<link href="http://code.google.com/apis/maps/documentation/javascript/examples/standard.css" rel="stylesheet" type="text/css" />
				<% } else { %>
					<script type="text/javascript" src="https://maps.google.com/maps/api/js?v=3.0&sensor=false"></script>
					<link href="https://code.google.com/apis/maps/documentation/javascript/examples/standard.css" rel="stylesheet" type="text/css" />
				<% } %>	
			</c:otherwise>
		</c:choose>
	</c:if>
	
	<!-- js preset e layout -->
	<script type="text/javascript" charset="utf-8"><jsp:include page="toloParamsJSCore.jsp"></jsp:include></script>
	<script type="text/JavaScript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/layout/ToloPanelIntra.js"></script>
	<!--<script type="text/JavaScript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/layout/ToloPanelIntraTab.js"></script>  -->
	
	<!--  <script type="text/JavaScript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/layout/ToloLayoutFactory.js"></script>  -->
	
	<script type="text/JavaScript">	
		Ext.application({
		    name: 'TolomeoExt',
		    appFolder: TolomeoExt.Vars.TOLOMEOContext + '/js/tolomeoExt',
		            
            bundle: {
                bundle: 'CSWViewer',
                lang: 'it-IT',
                path: TolomeoExt.Vars.TOLOMEOServer+TolomeoExt.Vars.TOLOMEOContext+ "/jsp/i18n.jsp",
                noCache: true,
                format: "json"
            },

            launch: function() {		    	
		    	Ext.BLANK_IMAGE_URL= "<%= tolomeoStaticRoot %>img/pixel.gif";
		    	Ext.Ajax.timeout = 180000;
		    	Ext.data.JsonP.timeout = 180000;
		    	
		    	
		    	
		    	tolomeo = new TolomeoExt.ToloPanelIntra({
					toolbarOpt: {
						withLegenda: false,
						withQuery: false,
						withInfoSelezione: true
					},
					/*
					viewerConfig : {

			               styleMeasure : {
			                      strokeColor  : "#FF0000",
			                      strokeOpacity: 1,
			                      strokeWidth  : 2,
			                      pointRadius  : 6,
			                      fillColor    : "red",
			                      fillOpacity  : 0.4
			               },
			               measurePointSymbolizer : {
			                      strokeColor  : "#000000",
			                      graphicName: "x",
			                      pointRadius  : 6,
			                      fillColor    : "white",
			                      fillOpacity  : 0.4
			               }

			        },
			        */
					cls: 'clearCSS',
					region: 'center',
					border: true,
					titoloMappa: '<c:out value="${menu.currentFunz.dsMenu}" />'
				});
		    	
		    	
		    	//Prova con multilayout		
		    	//tolomeo = TolomeoExt.layout.ToloLayoutFactory.getLayout({
		    	//						queryString: '<%= request.getQueryString() %>',		
		    	//						layoutOptions: {
				//							    		withQueryBuilderPanel: true,
				//										toolbarOpt: {
				//											withLegenda: false,
				//											withQuery: false,
				//											withInfoSelezione: true
				//										},
				//										region: 'center',
				//										border: true
				//									}
		    	//					});
		    	
		    	
				//aggiungo header e footer se richiesto		

				new Ext.Viewport({
					layout: 'border',
					monitorResize: true,
					items: [
						new Ext.Panel({
							region: 'north',
						    contentEl: 'header',
						    height: 90,
						    border: false
						}),
						tolomeo,
						new Ext.Panel({
							region: 'south',
						    contentEl: 'footer',
						    border: false
						})
					]
			    });

            }
		});
		</script>
</head>

<body>
	<div id="header">
		<div id="main-mappa">
			<div id="intesta-mappa">
				<div id="logo-mappa"><img src="img/logo_tolomeo.png" alt="Comune di Prato" style="padding:5px 0 5px 15px;" /></div>
				<div id="head-mappa">
					<a title="vai alla home del Comune di Prato" href="http://www.comune.prato.it/"><img src="http://www.comune.prato.it/common/gif/logo/hcomune_big.gif" width="203" height="73" class="imgdx" alt=" " /></a>
					<div id="pretitolo-mappa">Tolomeo &egrave; sviluppato dal Comune di Prato</div>
					<h1 id="salta">Tolomeo &egrave; un framework per lo sviluppo di applicazioni per visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia</h1>
				</div>
				<br class="nofloat" />
			</div>
			<br class="nofloat" />
		</div>
	</div>
	
	<div id="footer">
		Tolomeo Copyright <%= new DateType().getYear() %> Comune di Prato
	</div>
</body>
</html>
