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
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.*"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.apache.commons.lang.StringEscapeUtils"%>
<%@page import="java.util.List"%>

<%
	List<PuntoPuntiSensibili> listaPuntiPerSquadra = (List<PuntoPuntiSensibili>) request.getAttribute("listaPuntiPerSquadra");
%>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>
<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>

	<script type="text/JavaScript">
		api = window.parent.tolomeo.api;
		function zoom() {
			api.clearHighLigthed(false);
			location.href = '/tolomeobinj/procivPianoNeve/VisualizzaItinerarioServlet?idFase=D&codTPN=1604&IDTPN=' + this.fid;
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
	</style>
	
	<table summary="Elenco punti per la squadra">
		<caption>Squadra <%= listaPuntiPerSquadra.get(0).getSquadra() %> Circ. <%= listaPuntiPerSquadra.get(0).getCircoscrizione() %></caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Nome">Nome</abbr></th>
				<th id="col2"><abbr title="Tipo">Tipo</abbr></th>
				<th id="col3"><abbr title="Indirizzo">Indirizzo</abbr></th>
				<th id="col4"><abbr title="Priorità">Prior.</abbr></th>
				<%--
				<th id="col5"><abbr title="Note">Note</abbr></th>
				--%>
			</tr>
		</thead>
		<tbody>
			<% for (PuntoPuntiSensibili puntoSensibile : listaPuntiPerSquadra) { %>
				<tr id="tr-<%= puntoSensibile.getIDTPN() %>" style="cursor: pointer;">
					<td headers="col1"><%= puntoSensibile.getNome() %></td>
					<td headers="col2" class="tmpl_col_cx"><%= puntoSensibile.getTipo() %></td>
					<td headers="col3"><%= puntoSensibile.getIndirizzo() %></td>
					<td headers="col3" class="tmpl_col_cx <%= puntoSensibile.getPrioritaFmt().toLowerCase() %>"><%= puntoSensibile.getPrioritaFmt() %></td>
					<%-- 
					<td headers="col5"><%= puntoSensibile.getNote() %></td>
					--%>
				</tr>
				<script type="text/javascript">
					var tr         = document.getElementById("tr-<%= puntoSensibile.getIDTPN() %>");
					tr.fid         = <%= puntoSensibile.getIDTPN() %>;
					tr.scala       = 2000;
					tr.buffer      = null;
					tr.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(puntoSensibile.getJSGeometry()) %>');
					tr.onmouseover = evidenzia;
					tr.onmouseout  = pulisci;
					tr.onclick     = zoom;
				</script>
			<% } %>
		</tbody>
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
