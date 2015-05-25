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
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoLivello3FaseD"%>
<%@page import="it.prato.comune.sit.OggettoTerritorio"%>
<%@page import="org.apache.commons.lang.StringEscapeUtils"%>
<%@page import="it.prato.comune.tolomeo.servizi.procivPianoNeve.anno2013.bean.Squadra"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@ include file="../../../include/tmplBaseUPPannello.jsp" %>

<%
	List<PuntoLivello3FaseD> listaSquadre = (ArrayList<PuntoLivello3FaseD>) request.getAttribute("listaSquadre");
%>

<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../../include/tmplMessaggio.jsp" %>
	
	<script type="text/JavaScript">
		api = window.parent.tolomeo.api;
		function mapOperation() {		
			pulisci();
			api.viewer.pluginToolSelectZoomAll();			
		}
		function zoom() {
			this.onmouseover = null;
			this.onmouseout = null;
			api.clearHighLigthed(false);
			//api.addSelected(this.geom);
			//api.zoomToSelected();
			location.href = '/tolomeobinj/procivPianoNeve2013/ElencoOggettiFaseServlet?idLivello=3&idFase=D&idSquadra=' + this.id_squadra;
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
		a.squadra {
			whidth: 100px !important;
			
			font-weight: bold;
			color: #fff;
			text-shadow: #000 0.1em 0.1em 0.2em;
			white-space: nowrap;
			padding:2px;
			}
	</style>
	
	
	<h2>Livello 3 Fase D</h2> 
	
	<h3>Elenco delle squadre</h3>
	
	<ul style="padding-left:10px"><!-- style="text-decoration:underline;font-weight:bold;" -->
	<% int i=0;
		for (PuntoLivello3FaseD squadra: listaSquadre) {
		i++;
	%>
		<li style="padding-bottom:15px;">
			<a id="a-<%= squadra.getIdSquadra() %>" href="#" class="squadra" style="background-color:<%= squadra.getHex() %>">Squadra <%= squadra.getIdSquadra() %></a>
				<script>
					var a = document.getElementById("a-<%= squadra.getIdSquadra() %>");
					a.geom        = new parent.JSGeometry('<%= StringEscapeUtils.escapeJavaScript(squadra.getJSGeometry()) %>');
					a.onmouseover = evidenzia;
					a.onmouseout  = pulisci;
					a.onclick     = zoom;
					a.id_squadra  = <%= squadra.getIdSquadra() %>;
				</script>
		</li>
	<% } %>
	</ul>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
