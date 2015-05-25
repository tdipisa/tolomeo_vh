<%@ page language="java" contentType="text/html; charset=UTF-8" %>	<%-- errorPage="/jsp/errore.jsp" --%>
<%@ page import="it.prato.comune.tolomeo.utility.TolomeoApplicationContext" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ page isELIgnored="false" %>
<%
	String tolomeoStaticRoot = request.getAttribute("TOLOMEOStaticRoot").toString();
%>
<html>
	<head>
		<title>Tolomeo</title>
		<link rel="stylesheet" type="text/css" href="<%=tolomeoStaticRoot %>js/ext/extJS/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" title="blue" href="<%=tolomeoStaticRoot %>js/ext/extJS/resources/css/xtheme-blue.css" /> 
		<link rel="stylesheet" type="text/css" title="gray" href="<%=tolomeoStaticRoot %>js/ext/extJS/resources/css/xtheme-gray.css" />
		<link rel="stylesheet" type="text/css" title="accessible" href="<%=tolomeoStaticRoot %>js/ext/extJS/resources/css/xtheme-access.css" />
		<link rel="stylesheet" type="text/css" href="<%=tolomeoStaticRoot %>css/toloExt-intra.css" />
		<link rel="stylesheet" type="text/css" href="<%=tolomeoStaticRoot %>css/composer/Tolomeo.css" />
		<link rel="stylesheet" type="text/css" href="<%=tolomeoStaticRoot %>css/composer/Editor/xmleditor.css"/>
		<link rel="stylesheet" type="text/css" href="<%=tolomeoStaticRoot %>js/tolomeoExt/composer/Editor/3p_lib/codemirror/lib/codemirror.css"/>
		<link rel="stylesheet" type="text/css" href="<%=tolomeoStaticRoot %>js/tolomeoExt/composer/Editor/3p_lib/codemirror/theme/rubyblue.css"/>
		<link rel="stylesheet" type="text/css" href="<%=tolomeoStaticRoot %>js/tolomeoExt/composer/Editor/3p_lib/codemirror/css/codemirror_base.css"/>
		<!--
		<link rel="stylesheet" type="text/css" href="./js/Tolomeo/Editor/3p_lib/codemirror/css/docs.css"/>
		-->
		<!--
		<script type="text/javascript" charset="utf-8" src="./js/ext/extJS/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" charset="utf-8" src="./js/ext/extJS/ext-all.js"></script>
		-->
		<c:choose>
			<c:when test="${jsDebug}">
<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/adapter/ext/ext-base-debug.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ext-all-debug.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ext-lang-it.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/OpenLayers-all.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/PointFromRef.js"></script>	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/ConstrainedPath.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/ConstrainedPoint.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/openlayers/ConstrainedPolygon.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/tolomGeometry.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ExtFix.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloParamsJS.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloVars.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloCrossAjax.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloMeasurePanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/ToloPanelBase.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloScalePanelExt.js"></script>	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloViewerOLExt.js"></script>	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloAPIOpCodes.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTOCAbstractDataProvider.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTOCMapServerDataProvider.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTOCGeoserverDataProvider.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTOCMultiServerDataProvider.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTOCNodeUI.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTOCPanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTreeTOCPanelExt.js"></script> 
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloStylePanel.js"></script> 
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloQueryPanelExt.js"></script>	
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloButtonPanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloLazyLoad.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloProjection.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloMapAPIExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloPointFromRefPanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloCADPanelExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloGotoLocationWindowExt.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloContextMenu.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/GroupingListView.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/StatusBar.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/carousel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/CarouselPanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTimeMachinePanel.js"></script>			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/RowExpander.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/extJS/ux/uxvismode.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloIFrame.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloTOCInfo.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloLayerViewerAggregation.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloServerMappe.js"></script>				
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloMapDefinition.js"></script>		
						
			<!-- 
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/tolomeoExt/toloCswWidget.js"></script>
			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/resourceBundle/PropertyReader.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/resourceBundle/Bundle.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/build/cswExplorer-debug.js"></script>
			
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWRecord.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWRecordsReader.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWHttpProxy.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWGrid.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWCatalogChooser.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWSearchTool.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWPanel.js"></script>
			<script type="text/javascript" charset="utf-8" src="<%= tolomeoStaticRoot %>js/ext/csw/src/CSWPagingToolbar.js"></script>
			 -->
			</c:when> 
			<c:otherwise>
				<script type="text/javascript" charset="utf-8" src="<%=tolomeoStaticRoot %>js/tolomeoExt/build/toloExt-all.js"></script>	
			</c:otherwise>
		</c:choose>
		<script type="text/javascript" charset="utf-8"><jsp:include page="../toloParamsJSCore.jsp"></jsp:include></script>
		<script type="text/javascript" charset="utf-8" src="<%=tolomeoStaticRoot %>js/tolomeoExt/composer/Tolomeo.js"></script>
		<script type="text/javascript" charset="utf-8" src="<%=tolomeoStaticRoot %>js/tolomeoExt/composer/utility.js"></script>
		
		<script type="text/javascript" charset="utf-8">            
			Ext.onReady(function() {
				var load_mask = new Ext.LoadMask(Ext.getBody(),
					{
						msg: "Caricamento..."
					}
				);
				load_mask.show();
				Tolomeo.onReady(function() {
					var tab_panel;
					var editor;
					var composer;
					var preview;
					var active_tab;
					new Tolomeo.Viewport(
						{
							layout: 'border',
							items: [
								new Tolomeo.Toolbar(
									{
										region: 'north',
										height: 25,
										items: [
							        		new Ext.Toolbar.Fill(),
							        		new Ext.Toolbar.TextItem(
							        			{
							        				text: 'Tema'
							        			}
							        		),
							        		new Ext.Toolbar.Spacer(),
											new Ext.form.ComboBox(
												{
													triggerAction: 'all',
													mode: 'local',
													store: new Ext.data.ArrayStore(
														{
															fields: [
																'value',
																'text'
															],
															data: [
																[
																	'blue',
																	'Blu'
																],
																[
																	'gray',
																	'Grigio'
																],
																[
																	'accessible',
																	'Accessibile'
																]
															]
														}
													),
													valueField: 'value',
													displayField: 'text',
													value: 'blue',
													listeners: {
														select: function(combo_box, record, index) {
															setStyleSheet(record.data.value);
														}
													}
												}
											)
							        	]
									}
								),
								tab_panel = new Tolomeo.TabPanel(
									{
										region: 'center',
										margins: '0 0 0 0',
										activeTab: 0,
										items: [
											editor = new tolomeo.XmlEditorPanel(
												{
													url_xsd_validation: Tolomeo.XsdValidation,
													url_save_xml: Tolomeo.ExportFileServlet,
													url_load_xml: Tolomeo.ImportFileServlet,
													url_xsd: Tolomeo.XsdServlet,
													renderTxt: 'contentx',
													renderNodeDetail: 'divDetail',
													tolomeo_schema: Tolomeo.ParametersXSD,
													codiciServlet: '[{"codice": "codTPN", "servlet": Tolomeo.TolomeoTPNServlet}]'
												}
											),
											composer = new Tolomeo.Composer(),
											preview = new Tolomeo.Preview()
										]
									}
								)
							]
						}
					);
					tab_panel.on('tabchange', function(tab_panel, tab) {
						if (tab == editor) {
							active_tab = tab;
						} else if (tab == composer) {
							active_tab = tab;
						} else if (tab == preview) {
							load_mask.show();
							editor.validate(function(response) {
								if (response.status == 1) {
									if (composer.project) {
										preview.requestPreset(tolomeo.editor.globalConfig.textEditor, tolomeo.editor.globalConfig.xmlFileName, function(preset) {
											if (preset) {
												try {
													preview.setPreset(preset);
													TolomeoExt.Vars.paramsJS = new ToloParamsJS(preset);
													TolomeoExt.Composer.presetXML = tolomeo.editor.globalConfig.textEditor;
													var project_JSON = composer.project.getJSON();
													project_JSON = project_JSON.replace(/\t\"id\":\s.*\n/g, '');
													var project_configuration = Ext.util.JSON.decode(project_JSON);
													var project = new Tolomeo.Project(project_configuration);
													project.buildTolomeoAPI(tolomeo.editor.globalConfig.textEditor);
													preview.setProject(project);
													preview.doLayout();
													active_tab = tab;
												} catch (exception) {
													Ext.MessageBox.alert('Informazione', 'Non &egrave; possibile visualizzare l\'anteprima.');
													tab_panel.setActiveTab(active_tab);
												}
											} else {
												Ext.MessageBox.alert('Informazione', 'Non &egrave; possibile reperire il preset.');
											}
											load_mask.hide();
										});
									} else {
										load_mask.hide();
										Ext.MessageBox.alert('Informazione', 'Non ci sono progetti da visualizzare.');
										tab_panel.setActiveTab(active_tab);
									}
								} else {
									load_mask.hide();
									Ext.MessageBox.alert('Informazione', response.message);
									tab_panel.setActiveTab(active_tab);
								}
							});
						}
					});
					setStyleSheet('blue');
					load_mask.hide();
				});
			});
		</script>
	</head>
	<body oncontextmenu="return false;">
	</body>
</html>