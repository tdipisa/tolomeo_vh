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
<%@page language="java" %>
<%@page import="java.lang.Integer" %>
<%@page import="it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.*" %>
<%@page import="it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoInfanzia"%>
<%
	PoligonoPlessoInfanzia plessoInfanzia = (PoligonoPlessoInfanzia)request.getAttribute("plessoInfanzia");
	StatisticaPlessoInfanzia statisticaInfanzia = (StatisticaPlessoInfanzia)request.getAttribute("statisticaInfanzia");
	
	Integer [] leve = statisticaInfanzia.getAnniNascita();
	int range = 3;
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>
	
</head>

<body onload="mapOperation();" id="tmpl_popup">
			
	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<h2>${statisticaInfanzia.nomeLayer}</h2>
	<h3>Plesso selezionato: ${plessoInfanzia.nome} (${plessoInfanzia.codice})</h3>
	
	<table summary="Suddivisione per nazionalità">
	<caption>Suddivisione per nazionalità</caption>
		<thead>
			<tr class="tmpl_riga1">
				<th id="col1" rowspan="2"><abbr title="Leva">Leva</abbr></th>
				<th id="col2" colspan="4"><abbr title="Nati nell'anno">Nati nell'anno</abbr></th>
				<th id="col3" colspan="3"><abbr title="Anticipatari">Anticipatari</abbr></th>
				<th id="col4" rowspan="2"><abbr title="Totale globale">Totale globale</abbr></th>
			</tr>
			<tr>
				<th id="col21"><abbr title="Italiani">Italiani</abbr></th>
				<th id="col22"><abbr title="Stranieri">Stranieri</abbr></th>			
				<th id="col23"><abbr title="Totale nati nell'anno">Totale nati nell'anno</abbr></th>
				<th id="col24"><abbr title="Classi">Classi</abbr></th>
				<th id="col31"><abbr title="Italiani">Italiani</abbr></th>
				<th id="col32"><abbr title="Stranieri">Stranieri</abbr></th>
				<th id="col33"><abbr title="Totale anticipatari">Totale anticipatari</abbr></th>									
			</tr>
		</thead>
		<tbody>
		<% for (int i=0; i<leve.length; i++) { %>
			<tr>
				<td headers="col1" class="tmpl_col_sx" colspan="1">
					<%= leve[i] %>
				</td>
				
				<td headers="col21" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getInfanzia(leve[i]).getItaliani() %>
				</td>
				
				<td headers="col22" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getInfanzia(leve[i]).getStranieri() %>
				</td>
				<td headers="col23" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getTotale(leve[i]) %>
				</td>
				<td headers="col24" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getInfanzia(leve[i]).getClassi() %>
				</td>
				
				<td headers="col31" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getInfanzia(leve[i]).getAnticipatariItaliani() %>
				</td>
				<td headers="col32" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getInfanzia(leve[i]).getAnticipatariStranieri() %>
				</td>
				<td headers="col33" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getTotaleAnticipatari(leve[i]) %>
				</td>
				
				<td headers="col4" class="tmpl_coltot" colspan="1">
					<%= statisticaInfanzia.getTotaleGlobale(leve[i]) %>
				</td>
			</tr>
		<% } %>
		</tbody>
	</table>
	
	<table summary="Suddivisione per nazionalità trienni">
	<caption>Suddivisione per nazionalità trienni</caption>
		<thead>
			<tr class="tmpl_riga1">
				<th id="col1"><abbr title="Anno scolastico">Anno scolastico</abbr></th>
				<th id="col2"><abbr title="Leva">Leva</abbr></th>			
				<th id="col3"><abbr title="Italiani">Italiani</abbr></th>
				<th id="col4"><abbr title="Stranieri">Stranieri</abbr></th>
				<th id="col5"><abbr title="Totale">Totale</abbr></th>									
			</tr>
		</thead>
		<tbody>
		<% for (int j=0; j + (range - 1) < leve.length+1; j++) { %>
			<tr>
				<td headers="col1" class="tmpl_col_sx" colspan="1">
					<%= leve[j]+5 %>/<%= leve[j]+5+1 %>
				</td>
				<td headers="col2" class="tmpl_col_sx" colspan="1">
					<%= leve[j] %> - <%= leve[j]+2 %>
				</td>
				<td headers="col3" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getTotaleItalianiRange(statisticaInfanzia.getInfanziaRange(leve[j],leve[j]+2)) %>
				</td>
				<td headers="col4" class="tmpl_col_sx" colspan="1">
					<%= statisticaInfanzia.getTotaleStranieriRange(statisticaInfanzia.getInfanziaRange(leve[j],leve[j]+2)) %>
				</td>
				
				<td headers="col5" class="tmpl_coltot" colspan="1">
					<%= statisticaInfanzia.getTotaleRange(statisticaInfanzia.getInfanziaRange(leve[j],leve[j]+2)) %>
				</td>
			</tr>
		<% } %>
		</tbody>
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
