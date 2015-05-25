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
	Boolean googleAPIStato   = (Boolean) request.getAttribute("googleAPIStato") == null ? false : (Boolean) request.getAttribute("googleAPIStato");
	String googleAPIClientID = (String) request.getAttribute("googleAPIClientID");
	String tolomeoStaticRoot = request.getAttribute("TOLOMEOStaticRoot").toString();
%>
<c:set property="gs" var="gs" scope="page" value="<%= gs %>"></c:set>
<c:set property="menu" var="menu" scope="page" value="${gs.menu}"></c:set>
<c:set property="applx" var="applx" scope="page" value="${gs.applicazione}"></c:set>
<c:set property="utente" var="utente" scope="page" value="${gs.utente}"></c:set>
<c:set property="params" var="params" scope="page" value="<%= params %>"></c:set>
<c:set property="jsDebug" var="jsDebug" scope="page" value="<%= jsDebug %>"></c:set>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">

<head> 
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
	<link rel="shortcut icon" type="image/x-icon" href="<%= tolomeoStaticRoot %>img/favicon.ico" />
	<title><c:out value="${applx.dsProc}" /> - <c:out value="${menu.currentFunz.dsMenu}" /> - <c:out value="${gs.dsEnte}" /></title>
	<!-- js common -->
	<script type="text/javascript" src="${applx.urlCss}/js/cookie.js"></script>
	
	<!-- css tolomeo -->
	<%--<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>js/ext/extJS/resources/css/ext-all.css" />--%>
	<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>js/ext/extJS/resources/css/ext-all-olive.css" />
	<link rel="stylesheet" type="text/css" href="<%= tolomeoStaticRoot %>css/toloExt-intra.css" />
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
				%> <script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script> 
				<%
			}
		}
	
		// Inclusione API di Yahoo se necessaria
		if ( params.getMappe().hasMapWithTypeCode(ParametriMappa.typeYahooHyb) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeYahooReg) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeYahooSat)) {
			
			%> <script src="http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=euzuro-openlayers"></script> 
			<%
		}
	
		// Inclusione API di Bing se necessaria
		if ( params.getMappe().hasMapWithTypeCode(ParametriMappa.typeBingAerial) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeBingHybrid) ||
				params.getMappe().hasMapWithTypeCode(ParametriMappa.typeBingShaded)) {
			
			%> <script src="http://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2&mkt=en-us"></script> 
			<%
		}
	%>
	
	<!-- js core tolomeo -->
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
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/NavigationListPanel.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/ReverseGeocodingForm.js"></script>
		 	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/OLS/NavigationSummaryPanel.js"></script>
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
	<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/layout/ToloPanelIntra.js"></script>
	<script type="text/javascript" charset="utf-8">			
		
		Ext.application({
		    name: 'TolomeoExt',
		    appFolder: '/tolomeobinj/js/tolomeoExt',
		            
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
				//aggiungo header e footer se richiesto		
				<c:choose>
					<c:when test="${params.layOut.testata && params.layOut.piepagina}">
						new Ext.Viewport({
							layout: 'border',
							monitorResize: true,
							items: [
								new Ext.Panel({
									region: 'north',
								    contentEl: 'tmpl_header_top',
								    id: 'tmpl_header_top_panel',
								    border: false
								}),
								tolomeo,
								new Ext.Panel({
									region: 'south',
								    contentEl: 'tmpl_footer',
								    id: 'tmpl_footer_panel',
								    border: false
								})
							]
					    });
						
						//Pulsante fullscreen
						var toolbar = tolomeo.toolbar;
						var fsButton = new Ext.Button({
							
							tooltipFull : 'Fullscreen',
							tooltipRestore : 'Ripristina dimensioni',
							iconPath : TolomeoExt.Vars.TOLOMEOServer + "<%= tolomeoStaticRoot %>" + 'img/icone/16-default/',
							iconFull : 'view-fullscreen.png',
							iconRestore : 'view-restore.png',
							titleFull: "<a href=\"<c:out value="${applx.urlHome}" />\">home</a> &gt; <c:out value="${menu.currentBarraNav}" />",
							
							handler: function(btn,e){
								var header = Ext.getCmp('tmpl_header_top_panel');
			              		var footer = Ext.getCmp('tmpl_footer_panel');
			              		
			              		if(!btn.fullscreen){
			              			btn.setIcon(btn.iconPath + btn.iconRestore);
			              			btn.setTooltip(btn.tooltipRestore);
			              			btn.headerHeight = header.getHeight();
			              			btn.footerHeight = footer.getHeight();
			              			header.setHeight(0);
			              			footer.setHeight(0);
			              			tolomeo.setTitle(btn.titleFull);
			              			tolomeo.header.show();
			              			btn.fullscreen = true;
			              		} else {
			              			btn.setIcon(btn.iconPath + btn.iconFull);
			              			btn.setTooltip(btn.tooltipFull);
			              			header.setHeight(btn.headerHeight);
			              			footer.setHeight(btn.footerHeight);			              			
			              			tolomeo.setTitle(null);
			              			tolomeo.header.hide();
			              			btn.fullscreen = false;
			              		}
			              	}

						});
						
						fsButton.setIcon(fsButton.iconPath + fsButton.iconFull);
						fsButton.setTooltip(fsButton.tooltipFull);						
						toolbar.addRight(fsButton);
						
					</c:when>
					<c:otherwise>
						new Ext.Viewport({
							layout: 'border',
							monitorResize: true,
							items: [tolomeo]
					    });
					</c:otherwise>
				</c:choose>

				/**** Finestra di avviso modifiche importanti ****
				if (Ext.util.Cookies.get("avviso2.3-1")!="ok") {
					htmlAlert = //"20.02.2012 - Ultime novità<br/><br/>" +
						"<b>Google StreetView</b><br/>"+
						"Cliccando col tasto destro del mouse su un punto qualunque della mappa si apre un menu contestuale dal quale sarà possibile visualizzare Google Street View nel punto cliccato"+
						"<br/><br/>" +
						"<b>Ortofoto</b><br/>" +
						"Sulla legenda interattiva nel pannello a destra è possibile scegliere di visualizzare le ortofoto del Comune di Prato dal 1954 ad oggi."+
						"<br/>Per tornare alla visualizzazione della mappa è sufficiente deselezionare le ortofoto."+
						"<br/><br/>" +
						"<b>\"Macchina del tempo\"</b><br/>" +
						"Attivando la funzionalità \"Sovrapposizione mappa\" <img src=\"/commonintra2-0/img/icone/eye-arrow.png\" alt=\" \" /> "+
						"dalla barra degli strumenti si aprirà una finestra che mostra le ortofoto dal 1954 al 2011 sovrapposte alla mappa di base."+
						"<br/><br/>" +
						"<b>Altre funzioni utili</b><br/>"+
						"Cliccando col tasto destro del mouse su un punto qualunque della mappa si apre un menu contestuale dal quale sarà possibile:"+
						"<ul style=\"list-style: disc inside none;\">"+
							"<li>posizionare la mappa in determinate coordinate (Gauss Boaga o GPS)</li>"+
							"<li>visualizzare le coordinate del punto cliccato (Gauss Boaga o GPS)</li>"+
						"</ul>";
						
					data = new Date();
					giorni = 30;
					data.setTime(data.getTime()+(giorni*24*60*60*1000));
					alertWin = new Ext.Window({
						title: '21.02.2012 - Ultime novità',
						bodyStyle: 'background-color:white; padding:10px;',
						layout:'fit',
				        width: 450,
				        height: 350,
				        cls: 'clearCSS',
						html: htmlAlert,
				        forceLayout: true,
				        maximizable: false,
				        bbar: [{
			       			xtype: 'checkbox',
			       			id: 'activateMsg',
		                    height: 25,
		                    boxLabel: 'Non visualizzare più il messaggio'
		            	},{
		                    xtype: 'tbfill'
		                },{
				        	text: 'OK',
				        	width: 100,
				       		handler: function() {
				       			if(Ext.getCmp("activateMsg").getValue()) {
						       		Ext.util.Cookies.set("avviso2.3-1","ok",data);
				       			}
				            	alertWin.close();
				       		}
				        }]
					}).show();
					//alertWin.setPosition(tolomeo.mapPanel.getPosition());
				}
				*/
		    }
            
		});
		
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