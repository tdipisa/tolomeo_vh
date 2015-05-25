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
		.pointer {
			cursor:pointer;
		}
		.attuale, tr.tmpl_riga1 td {
			border-bottom: 0.1em #228b22 solid !important;	
			background-color: #f8ffdd;
			color: #114141;
		}
		.simulazione, tr.tmpl_riga2 td {
			border-bottom: 0.1em #FCBD0D solid !important;	
			background-color: #fff;
			color: #000;
		}
		.selezionata, tr.tmpl_rigatot td {
			border-bottom: 0.1em #336633 solid !important;	
			background-color: #336633;
			color: #fff;
			font-weight: normal;
		}
	</style>
	
	<script type="text/JavaScript">
		var disableAll = true;
		
		function Statistiche(){
			this.statisticheSezioni = new Object();
			this.statistichePoligonoPerSezioni = new Object();
		}
		
		Statistiche.prototype.addStatisticaSezione = function(statistica){
			this.statisticheSezioni[statistica.numSez] = statistica;				
		}
		
		Statistiche.prototype.addStatisticaPoligonoPerSezioni = function(statistica){
			this.statistichePoligonoPerSezioni[statistica.numSez] = statistica;
		}
		
		Statistiche.prototype.getFirstStatisticaSezione = function(){
			for(var i in this.statisticheSezioni){
				return this.statisticheSezioni[i];
			}
		}
		
		// restituisce un oggetto che accorpa le statistiche calcolate
		Statistiche.prototype.getSimulazione = function(numSez){
			var statistiche = new Object();
			
			for(var i in this.statisticheSezioni){
				var statistica = new Statistica();
				
				statistica.numSez = i;
				statistica.votantiMaschiCamera  = this.statisticheSezioni[i].votantiMaschiCamera;
				statistica.votantiFemmineCamera = this.statisticheSezioni[i].votantiFemmineCamera;
				statistica.totaleVotantiCamera  = this.statisticheSezioni[i].totaleVotantiCamera;
				statistica.votantiMaschiSenato  = this.statisticheSezioni[i].votantiMaschiSenato;
				statistica.votantiFemmineSenato = this.statisticheSezioni[i].votantiFemmineSenato;
				statistica.totaleVotantiSenato  = this.statisticheSezioni[i].totaleVotantiSenato;
				
				if(i != numSez){
					
					statistica.votantiMaschiCamera  -= this.statistichePoligonoPerSezioni[i].votantiMaschiCamera;
					statistica.votantiFemmineCamera -= this.statistichePoligonoPerSezioni[i].votantiFemmineCamera;
					statistica.totaleVotantiCamera  -= this.statistichePoligonoPerSezioni[i].totaleVotantiCamera;
					statistica.votantiMaschiSenato  -= this.statistichePoligonoPerSezioni[i].votantiMaschiSenato;
					statistica.votantiFemmineSenato -= this.statistichePoligonoPerSezioni[i].votantiFemmineSenato;
					statistica.totaleVotantiSenato  -= this.statistichePoligonoPerSezioni[i].totaleVotantiSenato;  
					
				}else{
											
					for(var j in this.statistichePoligonoPerSezioni){
						if(j != numSez){
							 statistica.votantiMaschiCamera  += this.statistichePoligonoPerSezioni[j].votantiMaschiCamera;
							 statistica.votantiFemmineCamera += this.statistichePoligonoPerSezioni[j].votantiFemmineCamera;
							 statistica.totaleVotantiCamera  += this.statistichePoligonoPerSezioni[j].totaleVotantiCamera;
					         statistica.votantiMaschiSenato  += this.statistichePoligonoPerSezioni[j].votantiMaschiSenato;
					         statistica.votantiFemmineSenato += this.statistichePoligonoPerSezioni[j].votantiFemmineSenato;
					         statistica.totaleVotantiSenato  += this.statistichePoligonoPerSezioni[j].totaleVotantiSenato;
						}
					}
				}
				
				statistiche[i] = statistica;
			}
							
			return statistiche;
		}
		
		function Statistica(numSez,votantiMaschiCamera,votantiFemmineCamera,totaleVotantiCamera,votantiMaschiSenato,votantiFemmineSenato,totaleVotantiSenato){
			this.numSez = numSez;
			this.votantiMaschiCamera  = votantiMaschiCamera;
			this.votantiFemmineCamera = votantiFemmineCamera;
			this.totaleVotantiCamera  = totaleVotantiCamera;
			this.votantiMaschiSenato  = votantiMaschiSenato;
			this.votantiFemmineSenato = votantiFemmineSenato;
			this.totaleVotantiSenato  = totaleVotantiSenato;
		}
		
		var stats = new Statistiche();
		
		<c:forEach items="${statisticheSezioni}" begin="0" var="sezione" varStatus="status">
			var stat = new Statistica(${sezione.numeroSezione},${sezione.votantiMaschiCamera},${sezione.votantiFemmineCamera},${sezione.totaleVotantiCamera},${sezione.votantiMaschiSenato},${sezione.votantiFemmineSenato},${sezione.totaleVotantiSenato});
			stats.addStatisticaSezione(stat);
		</c:forEach>
		
		<c:forEach items="${statistichePoligonoPerSezione}" begin="0" var="sezione" varStatus="status">
			var stat = new Statistica(${sezione.numeroSezione},${sezione.votantiMaschiCamera},${sezione.votantiFemmineCamera},${sezione.totaleVotantiCamera},${sezione.votantiMaschiSenato},${sezione.votantiFemmineSenato},${sezione.totaleVotantiSenato});
			stats.addStatisticaPoligonoPerSezioni(stat);
		</c:forEach>
		
		function highlightGeom(){
			if(disableAll) return;
			api.addHighlighted(this.geom); 
			this.baseClassName = this.className; 
			this.className="relToHighlightGeom";
		}
		
		function deHighlightGeom(){
			if(disableAll) return;
			api.clearHighLigthed(false); 
			this.className = this.baseClassName;
		}
		
		function selectGeom(numSez){
			var statistiche = stats.getSimulazione(numSez);
			for(var i in statistiche){
				for(var j in statistiche[i]){
					var idElem = "td_sim_" + i + "." + j;						
					var htmlElem = document.getElementById(idElem);
					if(htmlElem){
						htmlElem.innerHTML = statistiche[i][j];
					}
				}
				var tr = document.getElementById("tr" + i);
				if(i == numSez){
					tr.className = "tmpl_rigatot";
					tr.baseClassName = "tmpl_rigatot";
				}else{
					tr.className = "";
				}
			}
			
			document.getElementById("sezioneSelezionata").innerHTML = numSez;
	
		}
		
		function init(){	
			// Prendo la geometria del poligono selezionato						
			var selezionata = {};
			selezionata.geom = new parent.JSGeometry('${statisticaPoligono.jsonGeometry}');
			api = window.parent.tolomeo.api;
			// mi assicuro che la selezionata sia quella per cui è stata eseguita la ricerca	
			api.clearHighLigthed(false); 		
			//window.parent.clearSelected(true);																						
			//ATTENZIONE! Commentato per non far inizalizzare il pannello
			//api.addSelected(selezionata.geom);
							
			var stat = stats.getFirstStatisticaSezione()
			if(stat){
				selectGeom(stats.getFirstStatisticaSezione().numSez);
			}
			
			// estendo la zona alla selezione				
			api.zoomToExtent(${statisticaPoligono.jsonGeometry}.geometry);
			disableAll = false;															
		}
	</script>

</head>
	
<body onload="init();" onunload="void(0);" id="tmpl_popup">
			
	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<h2>Statistiche poligono</h2>
	<p>data riferimento <c:out value="${statisticaPoligono.dtVoto.formatted}" /></p>

	<table summary="Statistiche poligono">
	<caption>Poligono: <c:out value="${statisticaPoligono.numeroSezione}" /></caption>
	
		<thead>
			<tr>
				<th id="col1" colspan="7"><abbr title="Iscritti">Iscritti</abbr></th>
			</tr>
			<tr>
				<th id="col2" rowspan="2"><abbr title="Sezione">Poligono / Sezione</abbr></th>
				<th id="col3" colspan="3"><abbr title="Camera">Camera</abbr></th>
				<th id="col4" colspan="3"><abbr title="Senato">Senato</abbr></th>
			</tr>
			<tr>
				<th id="col5"><abbr title="Numero maschi">M</abbr></th>
				<th id="col6"><abbr title="Numero femmine">F</abbr></th>
				<th id="col7"><abbr title="Numero totale di votanti alla Camera">Tot</abbr></th>
				<th id="col8"><abbr title="Maschi">M</abbr></th>
				<th id="col9"><abbr title="Femmina">F</abbr></th>
				<th id="col10"><abbr title="Numero totale di votanti al Senato">Tot</abbr></th>
			</tr>
		</thead>
		
		<tbody>
			<tr id="tr${sezioni.selezionata.numeroSezione}">
				<td headers="col2">poligono</td>
				<td headers="col5"><c:out value="${statisticaPoligono.votantiMaschiCamera}" /></td>
				<td headers="col6"><c:out value="${statisticaPoligono.votantiFemmineCamera}" /></td>
				<td headers="col7" class="tmpl_coltot tmpl_col_cx"><c:out value="${statisticaPoligono.totaleVotantiCamera}" /></td>
				<td headers="col8"><c:out value="${statisticaPoligono.votantiMaschiSenato}" /></td>
				<td headers="col9"><c:out value="${statisticaPoligono.votantiFemmineSenato}" /></td>
				<td headers="col10" class="tmpl_coltot tmpl_col_cx"><c:out value="${statisticaPoligono.totaleVotantiSenato}" /></td>
			</tr>

			<tr class="tmpl_riga2">
				<td colspan="7" headers="col1" class="tmpl_col_cx">Ripartizione su sezioni sottese</td>
			</tr>
			<c:forEach items="${statistichePoligonoPerSezione}" begin="0" var="sezione" varStatus="status">

				<tr>
					<td class="tmpl_col_cx"><c:out value="${sezione.numeroSezione}" /></td>
					<td class="tmpl_col_dx"><c:out value="${sezione.votantiMaschiCamera}" /></td>
					<td class="tmpl_col_dx"><c:out value="${sezione.votantiFemmineCamera}" /></td>
					<td class="tmpl_coltot tmpl_col_cx"><c:out value="${sezione.totaleVotantiCamera}" /></td>
					<td class="tmpl_col_dx"><c:out value="${sezione.votantiMaschiSenato}" /></td>
					<td class="tmpl_col_dx"><c:out value="${sezione.votantiFemmineSenato}" /></td>
					<td class="tmpl_coltot tmpl_col_cx"><c:out value="${sezione.totaleVotantiSenato}" /></td>
				</tr>

			</c:forEach>					
												
		</tbody>							
	</table>
	
	<h2>Simulazione</h2>
	
	<p>Per una simulazione di quali saranno le nuove statistiche elettori delle sezioni sottese, selezionare la sezione a cui si intende aggiungere il poligono.</p>
	
	<p>Per ogni <strong>sezione</strong>, i valori sulla prima riga (<span class="attuale">A - sfondo verde chiaro</span>) sono quelli attuali, mentre quelli sulla seconda (<span class="simulazione"> S - sfondo bianco</span>), sono quelli che si otterrebbero se il poligono venisse aggiunto alla sezione selezionata (<span class="selezionata"> sfondo verde </span>)</p>
	
	<table summary="Simulazione">
		<caption>										
			Sezione selezionata tra le sottese: <span id="sezioneSelezionata"></span>
			<br />
			A: valore Attuale
			<br />
			S: valore Simulazione
		</caption>
		<thead>
			<tr>
				<th id="col1" colspan="8"><abbr title="Iscritti">Iscritti</abbr></th>
			</tr>
			<tr>
				<th id="col2" rowspan="2" colspan="2"><abbr title="Sezione">Sezione</abbr></th>
				<th id="col3" colspan="3"><abbr title="Camera">Camera</abbr></th>
				<th id="col4" colspan="3"><abbr title="Senato">Senato</abbr></th>
			</tr>
			<tr>
				<th id="col5"><abbr title="Numero maschi">M</abbr></th>
				<th id="col6"><abbr title="Numero femmine">F</abbr></th>
				<th id="col7"><abbr title="Numero totale di votanti alla Camera">Tot</abbr></th>
				<th id="col8"><abbr title="Maschi">M</abbr></th>
				<th id="col9"><abbr title="Femmina">F</abbr></th>
				<th id="col10"><abbr title="Numero totale di votanti al Senato">Tot</abbr></th>
			</tr>
		</thead>
		
		<tbody>						
		<c:forEach items="${statisticheSezioni}" begin="0" var="sezione" varStatus="status">
			
			<tr id="tr${sezione.numeroSezione}" class="tmpl_riga1">
				<td class="tmpl_col_cx pointer" rowspan="2"><c:out value="${sezione.numeroSezione}" /></td>
				<td class="tmpl_col_cx pointer"><b>A</b></td>						
				<td class="tmpl_col_dx pointer"><c:out value="${sezione.votantiMaschiCamera}" /></td>
				<td class="tmpl_col_dx pointer"><c:out value="${sezione.votantiFemmineCamera}" /></td>
				<td class="tmpl_col_cx pointer"><c:out value="${sezione.totaleVotantiCamera}" /></td>
				<td class="tmpl_col_dx pointer"><c:out value="${sezione.votantiMaschiSenato}" /></td>
				<td class="tmpl_col_dx pointer"><c:out value="${sezione.votantiFemmineSenato}" /></td>
				<td class="tmpl_col_cx pointer"><c:out value="${sezione.totaleVotantiSenato}" /></td>
			</tr>
			<tr id="tr_sim_${sezione.numeroSezione}" class="tmpl_riga2">							
				<td class="tmpl_col_cx pointer"><b>S</b></td>										
				<td id="td_sim_${sezione.numeroSezione}.votantiMaschiCamera"  class="tmpl_col_dx pointer">&nbsp;</td>
				<td id="td_sim_${sezione.numeroSezione}.votantiFemmineCamera" class="tmpl_col_dx pointer">&nbsp;</td>
				<td id="td_sim_${sezione.numeroSezione}.totaleVotantiCamera"  class="tmpl_col_cx pointer">&nbsp;</td>
				<td id="td_sim_${sezione.numeroSezione}.votantiMaschiSenato"  class="tmpl_col_dx pointer">&nbsp;</td>
				<td id="td_sim_${sezione.numeroSezione}.votantiFemmineSenato" class="tmpl_col_dx pointer">&nbsp;</td>
				<td id="td_sim_${sezione.numeroSezione}.totaleVotantiSenato"  class="tmpl_col_cx pointer">&nbsp;</td>
			</tr>					
			<script>						
				var tr = document.getElementById("tr${sezione.numeroSezione}");
				tr.numSez = ${sezione.numeroSezione};
				tr.geom = new parent.JSGeometry('${sezione.jsonGeometry}');						
				tr.onmouseover = highlightGeom;
				tr.onmouseout  = deHighlightGeom;
				tr.onclick     = function(){selectGeom(this.numSez)};						
			</script>					
					       			     	
		</c:forEach>
		</tbody>
								
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
