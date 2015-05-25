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
<%@ page import="java.util.List" %>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>

	<style type="text/css">
		.pointer { cursor:pointer; }
	</style>
	
	<script type="text/JavaScript">
		var disableAll = true;
		
		function highlightGeom(){
			if(disableAll) return;
			api.addHighlighted(this.geom); 
			this.className="relToHighlightGeom";
		}
		
		function deHighlightGeom(){
			if(disableAll) return;
			api.clearHighLigthed(false); 
			this.className="";
		}
		
		function selectGeom(){
			if(disableAll) return;
			deHighlightGeom.apply(this);
			disableAll = true;				
			api.addSelected(this.geom); 
			api.onIdentify();
		}
		
		function init(){	
			// Prendo la geometria del poligono selezionato						
			var selezionata = {};
			selezionata.geom = new parent.JSGeometry('${sezioni.selezionata.jsonGeometry}');
			api = window.parent.tolomeo.api;
			// mi assicuro che la selezionata sia quella per cui è stata eseguita la ricerca	
			api.clearHighLigthed(false); 																								
			//ATTENZIONE! Commentato per non far inizalizzare il pannello
			//api.addSelected(selezionata.geom);
			
			// estendo la zona alla selezione				
			api.zoomToExtent(${sezioni.jsonGeometryIngombro}.geometry);
			disableAll = false;
			
			//window.parent.addHighlighted(new parent.JSGeometry('${sezioni.jsonGeometryIngombro}'));								
		}
	</script>

</head>
	
<body onload="init();" onunload="void(0);" id="tmpl_popup">
			
	<%@ include file="../../include/tmplMessaggio.jsp" %>

	<h2>Statistiche sezioni</h2>
	
	<table summary="Statistiche sezioni">
	<caption>Statistiche iscritti<br />data elezioni <c:out value="${sezioni.dtVoto.formatted}" /></caption>
		<thead>
			<tr>
				<th id="col1" colspan="7"><abbr title="Iscritti">Iscritti</abbr></th>
			<tr>
			<tr>
				<th id="col2" rowspan="2"><abbr title="Sezione">Sezione</abbr></th>
				<th id="col3" colspan="3"><abbr title="Camera">Camera</abbr></th>
				<th id="col4" colspan="3"><abbr title="Senato">Senato</abbr></th>
			</tr>
			<tr>
				<th id="col5"><abbr title="Numero maschi">M</abbr></th>
				<th id="col6"><abbr title="Numero femmine">F</abbr></th>
				<th id="col7"><abbr title="Numero totale di votanti alla Camera">Tot</abbr></th>
				<th id="col8"><abbr title="Numero maschi">M</abbr></th>
				<th id="col9"><abbr title="Numero femmine">F</abbr></th>
				<th id="col10"><abbr title="Numero totale di votanti al Senato">Tot</abbr></th>
			</tr>
		</thead>
		
		<tbody>
			<tr class="tmpl_riga2">
				<td colspan="7" headers="col1" class="tmpl_col_cx">Sezione selezionata</td>
			</tr>
			<tr id="tr${sezioni.selezionata.numeroSezione}">
				<td headers="col2"><c:out value="${sezioni.selezionata.numeroSezione}" /></td>
				<td headers="col5"><c:out value="${sezioni.selezionata.votantiMaschiCamera}" /></td>
				<td headers="col6"><c:out value="${sezioni.selezionata.votantiFemmineCamera}" /></td>
				<td headers="col7" class="tmpl_coltot tmpl_col_cx"><c:out value="${sezioni.selezionata.totaleVotantiCamera}" /></td>
				<td headers="col8"><c:out value="${sezioni.selezionata.votantiMaschiSenato}" /></td>
				<td headers="col9"><c:out value="${sezioni.selezionata.votantiFemmineSenato}" /></td>
				<td headers="col10" class="tmpl_coltot tmpl_col_cx"><c:out value="${sezioni.selezionata.totaleVotantiSenato}" /></td>
			</tr>			
						
			<tr class="tmpl_riga2">
				<td colspan="7" headers="col1" class="tmpl_col_cx">Sezioni confinanti</td>
			</tr>
			<c:forEach items="${sezioni.confinanti}" begin="0" var="sezione" varStatus="status">
		
				<tr id="tr${sezione.numeroSezione}">
					<td headers="col2" class="pointer"><c:out value="${sezione.numeroSezione}" /></td>
					<td headers="col5" class="pointer"><c:out value="${sezione.votantiMaschiCamera}" /></td>
					<td headers="col6" class="pointer"><c:out value="${sezione.votantiFemmineCamera}" /></td>
					<td headers="col7" class="tmpl_coltot tmpl_col_cx pointer"><c:out value="${sezione.totaleVotantiCamera}" /></td>
					<td headers="col8" class="pointer"><c:out value="${sezione.votantiMaschiSenato}" /></td>
					<td headers="col9" class="pointer"><c:out value="${sezione.votantiFemmineSenato}" /></td>
					<td headers="col10" class="tmpl_coltot tmpl_col_cx pointer"><c:out value="${sezione.totaleVotantiSenato}" /></td>
				</tr>
				
				<script>						
					var tr = document.getElementById("tr${sezione.numeroSezione}");
					tr.geom = new parent.JSGeometry('${sezione.jsonGeometry}');						
					tr.onmouseover = highlightGeom;
					tr.onmouseout  = deHighlightGeom;
					tr.onclick     = selectGeom;						
				</script>					
						       			     	
			</c:forEach>
		
		</tbody>
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
