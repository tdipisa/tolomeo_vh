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
<%@page import="org.apache.commons.lang.StringEscapeUtils"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.List"%>
<%
	String idFase = (String) request.getAttribute("idFase");	

	List<LineaItinerari> listaItinerari = null;
	List<PoligonoZone> listaZone        = null;
	LayerItinerari layerItinerari       = null;
	LayerZone layerZone                 = null;

	int codTpn = 0;
	
	if (!StringUtils.equalsIgnoreCase(idFase,"C")) {
		listaItinerari = (List) request.getAttribute("listaItinerari");
		layerItinerari = (LayerItinerari) request.getAttribute("layerItinerari");
		codTpn         = layerItinerari.getCodTPN();
	} else {
		listaZone = (List) request.getAttribute("listaZone");
		layerZone = (LayerZone) request.getAttribute("layerItinerari");
		codTpn    = layerZone.getCodTPN();
	}
%>

<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<h2>Fase <%= idFase %></h2>
	
	<script type="text/JavaScript">
		api = window.parent.tolomeo.api;
		/*
		function mapOperation() {		
			pulisci();
			api.viewer.pluginToolSelectZoomAll();			
		}
		*/
		function zoom() {
			this.onmouseover = null;
			this.onmouseout = null;
			api.clearHighLigthed(false);
			location.href = '/tolomeobinj/procivPianoNeve/VisualizzaItinerarioServlet?idFase=<%= idFase %>&codTPN=' + <%= codTpn %> + '&IDTPN=' + this.fid;
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
		td { height: 35px }
		.operatore {
			font-weight: bold;
			color: #fff;
			text-shadow: #000 0.1em 0.1em 0.2em;
			white-space: nowrap;
		}
	</style>
	
	<table summary="Elenco itinerari">
		<% if (!StringUtils.equalsIgnoreCase(idFase,"C")) { %>
			<caption>Itinerari</caption>
			<thead>
				<tr>
					<th id="col2"><abbr title="Operatore">Operatore</abbr></th>
					<th id="col3"><abbr title="Partenza">Partenza</abbr></th>
					<th id="col4"><abbr title="Termine">Termine</abbr></th>
				</tr>
			</thead>
			<tbody>
			<% for (LineaItinerari itinerario : listaItinerari) { %>
				<tr id="tr-<%= itinerario.getIDTPN() %>" style="cursor: pointer;">
					<td headers="col2" class="operatore" style="background-color: rgb(<%= itinerario.getColore().replaceAll(" ",",") %>);">
						<%= itinerario.getOperatore() %>
					</td>
					<td headers="col3"><%= itinerario.getPartenza() %></td>
					<td headers="col4"><%= itinerario.getTermine() %></td>
				</tr>
				<script type="text/javascript">
						var tr         = document.getElementById("tr-<%= itinerario.getIDTPN() %>");
						tr.fid         = <%= itinerario.getIDTPN() %>;
						tr.scala       = null;
						tr.buffer      = 500;
						tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(itinerario.getJSGeometry()) %>');
						tr.onmouseover = evidenzia;
						tr.onmouseout  = pulisci;
						tr.onclick     = zoom;
					</script>
			<% } %>
		<% } else { %>
			<caption>Zone</caption>
			<thead>
				<tr>
					<th id="col1"><abbr title="Operatore">Operatore</abbr></th>
					<th id="col2"><abbr title="Partenza">Zona</abbr></th>
				</tr>
			</thead>
			<tbody>
			<% for (PoligonoZone zona : listaZone) { %>
				<tr id="tr-<%= zona.getIDTPN() %>" style="cursor: pointer;">
					<td headers="col1" class="operatore" style="background-color: rgb(<%= zona.getColore().replaceAll(" ",",") %>);">
						<%= zona.getOperatore() %>
					</td>
					<td headers="col2"><%= zona.getDescZona() %></td>
				</tr>
				<script type="text/javascript">
					var tr         = document.getElementById("tr-<%= zona.getIDTPN() %>");
					tr.fid         = <%= zona.getIDTPN() %>;
					tr.scala       = null;
					tr.buffer      = 500;
					tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(zona.getJSGeometry()) %>');
					tr.onmouseover = evidenzia;
					tr.onmouseout  = pulisci;
					tr.onclick     = zoom;
				</script>
			<% } %>
		<% } %>
		</tbody>
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>