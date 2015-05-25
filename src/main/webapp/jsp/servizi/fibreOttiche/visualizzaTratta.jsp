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
<%@page import="java.util.List"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.Collections"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.fibreOttiche.LineaTratta"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.fibreOttiche.LineaTrattaDiss"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.beans.fibreOttiche.NodoBean"%>

<% LineaTrattaDiss trattaDiss = (LineaTrattaDiss)request.getAttribute("trattaDiss"); %>
<% NodoBean nodo1 = (NodoBean)request.getAttribute("nodo1"); %>
<% NodoBean nodo2 = (NodoBean)request.getAttribute("nodo2"); %>
<% 
	List<LineaTratta> listaTratte = (ArrayList<LineaTratta>)request.getAttribute("listaTratte");
	Collections.sort(listaTratte);
%>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>
	
	
<script type="text/javascript">
		api = window.parent.tolomeo.api;
		function zoomTratta() {
			api.zoomToExtent(this.geomWKT);
		}
		function evidenziaTratta() {
			api.clearSelected(undefined, undefined, false);
			api.addHighlighted(this.geom);
		}
		function pulisci() {
			api.clearHighLigthed(false);
		}
		function zoomInteraTratta() {
			api.addSelected(this.geom);
			api.zoomToSelected();
		}
	</script>
	<style type="text/css">
		a:hover.clear { background: none; }
	</style>
	
	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="">
	
		<fieldset>
			<legend>Tratta</legend>
			<div>
				<span class="tmpl_form_etichetta">Numero:</span>
				<span class="tmpl_form_fixtext">${trattaDiss.NTratta}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Nodo 1:</span>
				<span class="tmpl_form_fixtext">${nodo1.codice} ${nodo1.nome}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Nodo 2:</span>
				<span class="tmpl_form_fixtext">${nodo2.codice} ${nodo2.nome}</span>
			</div>
			<div>
				<img style="vertical-align: bottom;" src="/img/mappa.gif" alt=" "/> <a href="#" id="a-trattaDiss">Seleziona l'intera tratta.</a>
				<script type="text/javascript">
					var a         = document.getElementById("a-trattaDiss");
					a.geom        = new parent.JSGeometry('${trattaDiss.JSGeometry}');
					a.onmouseover = evidenziaTratta;
					a.onmouseout  = pulisci;
					a.onclick     = zoomInteraTratta;
				</script>
			</div>
			
			<br/>
			
			<table summary="Elenco tipologie">
			<caption>Dettaglio tratta ${nodo1.codice}-${nodo2.codice}</caption>
			<thead>
				<tr>
					<th id="col1"><abbr title="Zoom al singolo tratto">Zoom</abbr></th>
					<th id="col2"><abbr title="Pozizione">Posizione</abbr></th>
					<th id="col3"><abbr title="Percorso">Percorso</abbr></th>
					<th id="col4"><abbr title="Lunghezza">Lunghezza</abbr></th>
					<th id="col5"><abbr title="Fibre">Fibre</abbr></th>
					<th id="col6"><abbr title="Tipologia">Tipologia</abbr></th>
					<!-- <th id="col7"><abbr title="Specifica">Specifica</abbr></th> -->
				</tr>
			</thead>
			<tbody>
			<c:forEach items="${listaTratte}" var="tratta" varStatus="trattaStatus">
				<tr>
					<td headers="col1" style="text-align: center;">
						<a id="a-${tratta.IDTPN}" href="#" class="clear"><img style="vertical-align: bottom;" src="/img/mappa.gif" alt=" "/></a>
					</td>
					<td headers="col2">${tratta.posizione}</td>
					<td headers="col3">${tratta.percorso}</td>
					<td headers="col4">${tratta.lunghezzaTratta}</td>
					<td headers="col5">${tratta.fibre}</td>
					<td headers="col6">${tratta.tipologia}</td>
					<!-- <td headers="col7">${tratta.specifica}</td> -->
				</tr>
				<script type="text/javascript">
					var a         = document.getElementById("a-${tratta.IDTPN}");
					a.geom        = new parent.JSGeometry('${tratta.JSGeometry}');
					a.geomWKT     = '${tratta.geometryAttributeWKT}';
					a.onmouseover = evidenziaTratta;
					a.onmouseout  = pulisci;
					a.onclick     = zoomTratta;
				</script>
			</c:forEach>
			</tbody>
			</table>

		</fieldset>
	
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
