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
<%@page import="java.lang.Integer" %>
<%@page import="java.util.*"%>
<%@page import="it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.*" %>
<%@page import="it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoSecondariaPG"%>
<%
	PoligonoPlessoSecondariaPG plessoSecondariaPG = (PoligonoPlessoSecondariaPG)request.getAttribute("plessoSecondariaPG");
	StatisticaPlessoSecondariaPG statisticaSecondariaPG = (StatisticaPlessoSecondariaPG)request.getAttribute("statisticaSecondariaPG");

	Set<Integer> as = statisticaSecondariaPG.getBambiniPerAnnoSolare().keySet(); //anni solari
	Integer[] asOrdered = new Integer[as.size()];
	asOrdered = as.toArray(asOrdered);
	Arrays.sort(asOrdered);
	pageContext.setAttribute("anniSolari", asOrdered);
	
	Integer [] anniScolasticiInf = statisticaSecondariaPG.getAnniScolasticiInf();
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>



</head>

<body onload="mapOperation();" id="tmpl_popup">
			
	<%@ include file="../../include/tmplMessaggio.jsp" %>

	<h2>${statisticaSecondariaPG.nomeLayer}</h2>
	<h3>Plesso selezionato: ${plessoSecondariaPG.nome} (${plessoSecondariaPG.codice})</h3>
	
	<table summary="Suddivisione per sesso">
	<caption>Suddivisione per sesso</caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Fascia di età">Età</abbr></th>
				<th id="col2"><abbr title="Maschi">Maschi</abbr></th>
				<th id="col3"><abbr title="Femmine">Femmine</abbr></th>
				<th id="col4"><abbr title="Totale">Totale</abbr></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td headers="col1">${statisticaSecondariaPG.etaMin}-${statisticaSecondariaPG.etaMax}</td>
				<td headers="col2">${statisticaSecondariaPG.maschi}</td>
				<td headers="col3">${statisticaSecondariaPG.femmine}</td>
				<td headers="col4" class="tmpl_coltot">${statisticaSecondariaPG.totSesso}</td>
			</tr>
		</tbody>
	</table>
	
	<table summary="Suddivisione per nazionalità">
	<caption>Suddivisione per nazionalità</caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Fascia di età">Età</abbr></th>
				<th id="col2"><abbr title="Italiani">Italiani</abbr></th>
				<th id="col3"><abbr title="Stranieri">Stranieri</abbr></th>
				<th id="col4"><abbr title="Totale">Totale</abbr></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td headers="col1">${statisticaSecondariaPG.etaMin}-${statisticaSecondariaPG.etaMax}</td>
				<td headers="col2">${statisticaSecondariaPG.italiani}</td>
				<td headers="col3">${statisticaSecondariaPG.stranieri}</td>
				<td headers="col4" class="tmpl_coltot">${statisticaSecondariaPG.totNazionalita}</td>
			</tr>
		</tbody>
	</table>
	
	<table summary="Suddivisione per tipo iscrizione">
	<caption>Suddivisione per tipo iscrizione</caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Anno scolastico">Anno scolastico</abbr></th>
				<th id="col2"><abbr title="Iscrizioni obbligatorie (anni)">Iscrizioni obbligatorie (anni)</abbr></th>
				<th id="col3"><abbr title="Iscrizioni obbligatorie 1&ordf; classe">Iscrizioni obbligatorie 1&ordf; classe</abbr></th>
				<th id="col4"><abbr title="Capienza 1&ordf; classe">Capienza prime classi</abbr></th>
				<th id="col5"><abbr title="Capienza 1&ordf; classe">Differenza</abbr></th>
			</tr>
		</thead>
		<tbody>
			<% for (int i=0; i<anniScolasticiInf.length; i++) { %>
			<tr>
				<td headers="col1"><%= anniScolasticiInf[i] %>/<%= anniScolasticiInf[i] + 1 %></td>
				<td headers="col2"><%= statisticaSecondariaPG.getSecondariaPG(anniScolasticiInf[i]).getIscrizioniObbligatorie() %><br/>(<%= anniScolasticiInf[i] - 13 %>-<%= anniScolasticiInf[i] - 11 %>)</td>
				<td headers="col3"><%= statisticaSecondariaPG.getSecondariaPG(anniScolasticiInf[i]).getIscrizioniObbligatorieClassePrima() %></td>
				<td headers="col4"><%= statisticaSecondariaPG.getSecondariaPG(anniScolasticiInf[i]).getCapienzaClassiPrime() %></td>
				<td headers="col5" class="tmpl_col_dx"><%= statisticaSecondariaPG.getSecondariaPG(anniScolasticiInf[i]).getDifferenza() %></td>
			<tr>
			<% } %>
		</tbody>
	</table>
	
	<table summary="Suddivisione per anno solare di nascita">
	<caption>Suddivisione per anno solare di nascita</caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Anno solare di nascita">Anno solare</abbr></th>
				<th id="col2"><abbr title="Numero bambini">Numero bambini</abbr></th>
			</tr>
		</thead>
		<tbody>
			<c:forEach items="${anniSolari}" var="key" varStatus="keysStatus">
				<tr>
					<td headers="col1">${key}</td>
					<td headers="col2">${statisticaSecondariaPG.bambiniPerAnnoSolare[key]}</td>
				</tr>	
			</c:forEach>
		</tbody>
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
