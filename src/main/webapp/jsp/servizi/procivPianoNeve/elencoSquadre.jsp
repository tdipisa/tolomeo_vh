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
<%@ include file="../../include/tmplBaseUPPannello.jsp" %>

<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.*"%>
<%@page import="it.prato.comune.sit.OggettoTerritorio"%>
<%@page import="org.apache.commons.lang.StringEscapeUtils"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.*"%>
<%
	LayerPuntiSensibili layerPuntiSensibili = (LayerPuntiSensibili) request.getAttribute("layerPuntiSensibili");
	HashMap<Integer, OggettoTerritorio> mapPuntiSensibili = (HashMap<Integer, OggettoTerritorio>) request.getAttribute("mapPuntiSensibili");
	
	Set<Integer> keySet = mapPuntiSensibili.keySet();
%>

<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<h2>Fase D</h2>
	
	<script type="text/JavaScript">
		api = window.parent.tolomeo.api;
		function mapOperation() {		
			pulisci();
			api.viewer.pluginToolSelectZoomAll();			
		}
		function zoom() {
			pulisci();
			//api.viewer.pluginZoomToExtent(this.geom.geometry,300);
			location.href = '/tolomeobinj/procivPianoNeve/VisualizzaItinerarioServlet?idFase=D&squadra='+this.squadra;
		}
		function evidenzia() {
			pulisci();
			api.addHighlighted(this.geom);
		}
		function pulisci() {
			api.clearHighLigthed(false);
		}
	</script>
	<style>
		.squadra {
			font-weight: bold;
			color: #fff;
			text-shadow: #000 0.1em 0.1em 0.2em;
			white-space: nowrap;
		}
	</style>
	
	<ul>
		<% for(Integer key: keySet) {
			OggettoTerritorio oggetto = mapPuntiSensibili.get(key);
		%>
			<li>
				<a id="a-<%= key %>" href="#">Squadra <%= key %></a>
				<script>
					var a = document.getElementById("a-<%= key %>");
					a.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(oggetto.getJSGeometry()) %>');
					a.onmouseover = evidenzia;
					a.onmouseout  = pulisci;
					a.onclick     = zoom;
					a.squadra     = <%= key %>;
				</script>
			</li>
		<% } %>
	</ul>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
