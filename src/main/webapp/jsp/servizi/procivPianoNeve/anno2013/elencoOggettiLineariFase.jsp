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
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LineaLivello4"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerLivello4"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiLineari"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LineaFasiLineari"%>
<%@ include file="../../../include/tmplBaseUPPannello.jsp" %>

<%@page import="org.apache.commons.lang.StringEscapeUtils"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.List"%>
<%

	Integer idLivelloObj = (Integer) request.getAttribute("idLivello");
	int idLivello = idLivelloObj.intValue();
	String idFase = (String) request.getAttribute("idFase");

	LayerFasiLineari       layerFaseXX        = null;
	LayerLivello4          layerLivello4      = null;
	List<LineaFasiLineari> listaLinee         = null;
	List<LineaLivello4>    listaLineeLivello4 = null;
	int codTpn = 0;

	listaLinee = (List<LineaFasiLineari>) request.getAttribute("listaLinee");
	
	if (idLivello==1) {
		if (StringUtils.equalsIgnoreCase(idFase, "A0")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseA0");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "A1")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseA1");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseBLinee");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "C")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseC");
			
		}
		
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==3) {
		if (StringUtils.equalsIgnoreCase(idFase, "A")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv3FaseA");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv3FaseB");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "AB")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv3FaseAB");
			
		}
		
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==4) {
		
		layerLivello4      = (LayerLivello4) request.getAttribute("liv4");
		codTpn             = layerLivello4.getCodTPN();
		listaLineeLivello4 = (List<LineaLivello4>) request.getAttribute("listaLineeLivello4");
		
	}
	
%>

<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../../include/tmplMessaggio.jsp" %>
	
	<h2>Livello <%= idLivello %><%-- if (idFase!=null && StringUtils.equalsIgnoreCase(idFase, "0")) { --%> - Fase <%= idFase %><%-- } --%></h2>
	
	<script type="text/JavaScript">
		api = window.parent.tolomeo.api;
		/*
		function mapOperation() {		
			pulisci();
			api.viewer.pluginToolSelectZoomAll();			
		}
		*/
		function zoom_linea() {
			this.onmouseover = null;
			this.onmouseout = null;
			api.clearHighLigthed(false);
			//api.addSelected(this.geom);
			//api.zoomToSelected();
			location.href = '/tolomeobinj/procivPianoNeve2013/VisualizzaOggettoServlet?idLivello=<%= idLivello %>&idFase=<%= idFase %>&codTPN=' + <%= codTpn %> + '&IDTPN=' + this.fid + '&tipoGeom=2';
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
		.operatore a {
			color: #fff;
			background-color: transparent;
		}
	</style>
	
	
	<%-- La visualizzazione delle tabelle differisce dal livello che si sta visualizzando --%>
	<% if (idLivello==1) { %>
		<table summary="Elenco itinerari">
			<caption>Itinerari</caption>
			<thead>
				<tr>
					<th id="col1">Operatore</th>
					<th id="col2">Descrizione</th>
				</tr>
			</thead>
			<tbody>
			<% for (LineaFasiLineari linea : listaLinee) { %>
				<tr id="tr-linea-<%= linea.getIDTPN() %>" style="cursor: pointer;">
					<% if (linea.getIdOperatore()!=14) { %>
						<td headers="col1" class="operatore" style="background-color: <%= linea.getHex() %>;">
							<%= linea.getOperatore() %>
						</td>
					<% } else { %>
						<td headers="col1" class="operatore" style="background: linear-gradient(to left, #CCFFCC 50%, #00CCFF 50%);">
							<%= linea.getOperatore() %>
						</td>
					<% } %>	
					<td headers="col2"><%= linea.getDescrizione() %></td>
				</tr>
				<script type="text/javascript">
					var tr         = document.getElementById("tr-linea-<%= linea.getIDTPN() %>");
					tr.fid         = <%= linea.getIDTPN() %>;
					tr.scala       = null;
					tr.buffer      = 500;
					tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(linea.getJSGeometry()) %>');
					tr.onmouseover = evidenzia;
					tr.onmouseout  = pulisci;
					tr.onclick     = zoom_linea;
				</script>
			<% } %>
			</tbody>
		</table>
	<% } else if (idLivello==3) { %>
		<table summary="Elenco itinerari">
			<caption>Itinerari</caption>
			<thead>
				<tr>
					<th id="col1">Operatore</th>
					<th id="col2">Partenza</th>
					<th id="col3">Termine</th>
				</tr>
			</thead>
			<tbody>
			<% for (LineaFasiLineari linea : listaLinee) { %>
				<tr id="tr-linea-<%= linea.getIDTPN() %>" style="cursor: pointer;">
					<td headers="col1" class="operatore" style="background-color: <%= linea.getHex() %>;">
						<%= linea.getOperatore() %>
					</td>
					<td headers="col2"><%= linea.getPartenza() %></td>
					<td headers="col3"><%= linea.getTermine() %></td>
				</tr>
				<script type="text/javascript">
				var tr         = document.getElementById("tr-linea-<%= linea.getIDTPN() %>");
					tr.fid         = <%= linea.getIDTPN() %>;
					tr.scala       = null;
					tr.buffer      = 500;
					tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(linea.getJSGeometry()) %>');
					tr.onmouseover = evidenzia;
					tr.onmouseout  = pulisci;
					tr.onclick     = zoom_linea;
				</script>
			<% } %>
			</tbody>
		</table>
	<% } else if (idLivello==4) { %>
		<ul>
			<% for (LineaLivello4 linea : listaLineeLivello4) { %>
				<li>
					<a href="#" id="a-linea-<%= linea.getIDTPN() %>" class="operatore" style="background-color:<%= linea.getHex() %>;"><%= linea.getPercorso() %></a>
				</li>
				<script type="text/javascript">
				var a         = document.getElementById("a-linea-<%= linea.getIDTPN() %>");
					a.fid         = <%= linea.getIDTPN() %>;
					a.scala       = null;
					a.buffer      = 500;
					a.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(linea.getJSGeometry()) %>');
					a.onmouseover = evidenzia;
					a.onmouseout  = pulisci;
					a.onclick     = zoom_linea;
				</script>
			<% } %>
		</ul>
	<% } %>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>