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
<%@page import="java.util.ArrayList"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoLivello3FaseD"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoFasiPuntuali"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerLivello3FaseD"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiPuntuali"%>
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

	LayerFasiPuntuali        layerFaseXX             = null;
	LayerLivello3FaseD       layerLivello3FaseD      = null;
	List<PuntoFasiPuntuali>  listaPunti              = null;
	List<PuntoLivello3FaseD> listaPuntiLivello3FaseD = null;
	int codTpn = 0;

	listaPunti = (List<PuntoFasiPuntuali>) request.getAttribute("listaPunti");
	
	if (idLivello==1) {
		
		if (StringUtils.equalsIgnoreCase(idFase, "B")) {
			layerFaseXX = (LayerFasiPuntuali) request.getAttribute("liv1FaseBPunti");
		}
		
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==2) {
		
		layerFaseXX = (LayerFasiPuntuali) request.getAttribute("liv2");
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==3) {
		
		if (StringUtils.equalsIgnoreCase(idFase, "D")) {
			layerLivello3FaseD      = (LayerLivello3FaseD) request.getAttribute("liv3FaseD");
			codTpn                  = layerLivello3FaseD.getCodTPN();
			listaPuntiLivello3FaseD = (List<PuntoLivello3FaseD>) request.getAttribute("listaPuntiLivello3FaseD");
		}
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
		function zoom_punto() {
			this.onmouseover = null;
			this.onmouseout = null;
			api.clearHighLigthed(false);
			//api.addSelected(this.geom);
			//api.zoomToSelected();
			location.href = '/tolomeobinj/procivPianoNeve2013/VisualizzaOggettoServlet?idLivello=<%= idLivello %>&idFase=<%= idFase %>&codTPN=' + <%= codTpn %> + '&IDTPN=' + this.fid + '&tipoGeom=1';
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
		td.alta {
			background-color: #f00 !important;
			text-shadow: #fff 0.1em 0.1em 0.2em !important;
		}
		td.media {
			background-color: #ff0 !important;
			text-shadow: #fff 0.1em 0.1em 0.2em !important;
		}
		
		td.bassa {
			background-color: #0f0 !important;
			text-shadow: #fff 0.1em 0.1em 0.2em !important;
		}
		.squadra {
			font-weight: bold;
			color: #fff;
			text-shadow: #000 0.1em 0.1em 0.2em;
			white-space: nowrap;
			padding:2px;
			}
	</style>
	
	
	<%-- La visualizzazione delle tabelle differisce dal livello che si sta visualizzando --%>
	<% if (idLivello==1 && StringUtils.equalsIgnoreCase(idFase, "B")) {
		
			List<PuntoFasiPuntuali> sottopassi = new ArrayList<PuntoFasiPuntuali>();
			List<PuntoFasiPuntuali> ponti      = new ArrayList<PuntoFasiPuntuali>();
			
			for (PuntoFasiPuntuali punto : listaPunti) {
				if (StringUtils.equalsIgnoreCase(punto.getTipo(), "sottopasso")) {
					sottopassi.add(punto);
				}
				if (StringUtils.equalsIgnoreCase(punto.getTipo(), "ponte")) {
					ponti.add(punto);
				}
			}
	%>
			<table summary="Elenco sottopassi">
				<caption>Sottopassi</caption>
				<thead>
					<tr>
						<th id="col1">Operatore</th>
						<th id="col2">Nome</th>
						<th id="col3">Descrizione</th>
						<th id="col4">Priorità</th>
					</tr>
				</thead>
				<tbody>
				<% for (PuntoFasiPuntuali punto : sottopassi) { %>
					<tr id="tr-punto-<%= punto.getIDTPN() %>" style="cursor: pointer;">
						<td headers="col1" class="operatore" style="background-color: <%= punto.getHex() %>;">
							<%= punto.getOperatore() %>
						</td>
						<td headers="col2"><%= punto.getNome() %></td>
						<td headers="col3"><%= punto.getDescrizione() %></td>
						<td headers="col4" class="<%= punto.getPrioritaFmt().toLowerCase() %>"><%= punto.getPrioritaFmt() %></td>
					</tr>
					<script type="text/javascript">
						var tr         = document.getElementById("tr-punto-<%= punto.getIDTPN() %>");
						tr.fid         = <%= punto.getIDTPN() %>;
						tr.scala       = null;
						tr.buffer      = 500;
						tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(punto.getJSGeometry()) %>');
						tr.onmouseover = evidenzia;
						tr.onmouseout  = pulisci;
						tr.onclick     = zoom_punto;
					</script>
				<% } %>
				</tbody>
			</table>
			
			<table summary="Elenco ponti">
				<caption>Ponti</caption>
				<thead>
					<tr>
						<th id="col1">Operatore</th>
						<th id="col2">Nome</th>
						<th id="col3">Descrizione</th>
						<th id="col4">Priorità</th>
					</tr>
				</thead>
				<tbody>
				<% for (PuntoFasiPuntuali punto : ponti) { %>
					<tr id="tr-punto-<%= punto.getIDTPN() %>" style="cursor: pointer;">
						<td headers="col1" class="operatore" style="background-color: <%= punto.getHex() %>;">
							<%= punto.getOperatore() %>
						</td>
						<td headers="col2"><%= punto.getNome() %></td>
						<td headers="col3"><%= punto.getDescrizione() %></td>
						<td headers="col4" class="<%= punto.getPrioritaFmt().toLowerCase() %>"><%= punto.getPrioritaFmt() %></td>
					</tr>
					<script type="text/javascript">
						var tr         = document.getElementById("tr-punto-<%= punto.getIDTPN() %>");
						tr.fid         = <%= punto.getIDTPN() %>;
						tr.scala       = null;
						tr.buffer      = 500;
						tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(punto.getJSGeometry()) %>');
						tr.onmouseover = evidenzia;
						tr.onmouseout  = pulisci;
						tr.onclick     = zoom_punto;
					</script>
				<% } %>
				</tbody>
			</table>
		
	<% } else if (idLivello==2) { %>
	
		<table summary="Elenco punti">
			<caption>Punti</caption>
			<thead>
				<tr>
					<th id="col1">Operatore</th>
					<th id="col2">Nome</th>
					<th id="col3">Descrizione</th>
				</tr>
			</thead>
			<tbody>
			<% for (PuntoFasiPuntuali punto : listaPunti) { %>
				<tr id="tr-punto-<%= punto.getIDTPN() %>" style="cursor: pointer;">
					<td headers="col1" class="operatore" style="background-color: <%= punto.getHex() %>;">
						<%= punto.getOperatore() %>
					</td>
					<td headers="col2"><%= punto.getNome() %></td>
					<td headers="col3"><%= punto.getDescrizione() %></td>
				</tr>
				<script type="text/javascript">
					var tr         = document.getElementById("tr-punto-<%= punto.getIDTPN() %>");
					tr.fid         = <%= punto.getIDTPN() %>;
					tr.scala       = null;
					tr.buffer      = 500;
					tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(punto.getJSGeometry()) %>');
					tr.onmouseover = evidenzia;
					tr.onmouseout  = pulisci;
					tr.onclick     = zoom_punto;
				</script>
			<% } %>
			</tbody>
		</table>
		
	<% } else if (idLivello==3  && StringUtils.equalsIgnoreCase(idFase, "D")) { %>
	
		<a href="/tolomeobinj/procivPianoNeve2013/ElencoOggettiFaseServlet?idLivello=3&idFase=D">Ritorna all'elenco delle squadre</a>
		<br/><br/>
		 
		<table summary="Elenco punti per squadra">
			<caption class="squadra" style="background-color: <%= listaPuntiLivello3FaseD.get(0).getHex() %>;">Squadra <%= listaPuntiLivello3FaseD.get(0).getIdSquadra() %> - Circoscrizione <%= listaPuntiLivello3FaseD.get(0).getCircoscrizione() %></caption>
			<thead>
				<tr>
					<th id="col1">Nome</th>
					<th id="col2">Tipo</th>
					<th id="col3">Indirizzo</th>
					<th id="col4">Priorità</th>
				</tr>
			</thead>
			<tbody>
			<% for (PuntoLivello3FaseD punto : listaPuntiLivello3FaseD) { %>
				<tr id="tr-punto-<%= punto.getIDTPN() %>" style="cursor: pointer;">
					<td headers="col1"><%= punto.getNome() %></td>
					<td headers="col2" class="tmpl_col_cx"><%= punto.getTipo() %></td>
					<td headers="col3"><%= punto.getIndirizzo() %></td>
					<td headers="col4" class="tmpl_col_cx <%= punto.getPrioritaFmt().toLowerCase() %>"><%= punto.getPrioritaFmt() %></td>
				</tr>
				<script type="text/javascript">
					var tr         = document.getElementById("tr-punto-<%= punto.getIDTPN() %>");
					tr.fid         = <%= punto.getIDTPN() %>;
					tr.scala       = 2000;
					tr.buffer      = null;
					tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(punto.getJSGeometry()) %>');
					tr.onmouseover = evidenzia;
					tr.onmouseout  = pulisci;
					tr.onclick     = zoom_punto;
				</script>
			<% } %>
			</tbody>
		</table>
	<% } %>
<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>