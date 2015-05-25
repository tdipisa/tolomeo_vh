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
<%@page import="java.util.*" %>
<%@page import="it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.*" %>
<%@page import="it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoInfanzia"%>
<%@page import="it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoPrimaria"%>
<%@page import="it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoSecondariaPG"%>
<%
	//infanzia
	PoligonoPlessoInfanzia plessoInfanzia = (PoligonoPlessoInfanzia)request.getAttribute("plessoInfanzia");
	StatisticaPlessoInfanzia statisticaInfanzia = (StatisticaPlessoInfanzia)request.getAttribute("statisticaInfanzia");
	
	Integer [] leve = statisticaInfanzia.getAnniNascita();
	int range = 3;
	
	//primarie
	PoligonoPlessoPrimaria plessoPrimaria = (PoligonoPlessoPrimaria)request.getAttribute("plessoPrimaria");
	StatisticaPlessoPrimaria statisticaPrimaria = (StatisticaPlessoPrimaria)request.getAttribute("statisticaPrimaria");

	Set<Integer> asEle = statisticaPrimaria.getBambiniPerAnnoSolare().keySet(); //anni solari
	Integer[] asOrderedEle = new Integer[asEle.size()];
	asOrderedEle = asEle.toArray(asOrderedEle);
	Arrays.sort(asOrderedEle);
	pageContext.setAttribute("anniSolariEle", asOrderedEle);
	
	Integer [] anniScolasticiInfEle = statisticaPrimaria.getAnniScolasticiInf();
	
	//secondarie primo grado
	PoligonoPlessoSecondariaPG plessoSecondariaPG = (PoligonoPlessoSecondariaPG)request.getAttribute("plessoSecondariaPG");
	StatisticaPlessoSecondariaPG statisticaSecondariaPG = (StatisticaPlessoSecondariaPG)request.getAttribute("statisticaSecondariaPG");

	Set<Integer> asMedie = statisticaSecondariaPG.getBambiniPerAnnoSolare().keySet(); //anni solari
	Integer[] asOrderedMedie = new Integer[asMedie.size()];
	asOrderedMedie = asMedie.toArray(asOrderedMedie);
	Arrays.sort(asOrderedMedie);
	pageContext.setAttribute("anniSolariMedie", asOrderedMedie);
	
	Integer [] anniScolasticiInfMedie = statisticaSecondariaPG.getAnniScolasticiInf();
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>
	
</head>

<body onload="mapOperation();" id="tmpl_popup">
			
	<%@ include file="../../include/tmplMessaggio.jsp" %>

	<h2>Statistica simulazione plessi</h2>
	
	<!-- infanzia -->
	<h3>Plessi scuole dell'infanzia</h3>
	
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
	<!-- infanzia fine -->

	<!-- primarie -->
	<h3>Plessi scuole primarie</h3>
	
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
				<td headers="col1">${statisticaPrimaria.etaMin}-${statisticaPrimaria.etaMax}</td>
				<td headers="col2">${statisticaPrimaria.maschi}</td>
				<td headers="col3">${statisticaPrimaria.femmine}</td>
				<td headers="col4" class="tmpl_coltot">${statisticaPrimaria.totSesso}</td>
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
				<td headers="col1">${statisticaPrimaria.etaMin}-${statisticaPrimaria.etaMax}</td>
				<td headers="col2">${statisticaPrimaria.italiani}</td>
				<td headers="col3">${statisticaPrimaria.stranieri}</td>
				<td headers="col4" class="tmpl_coltot">${statisticaPrimaria.totNazionalita}</td>
			</tr>
		</tbody>
	</table>
	
	<table summary="Suddivisione per tipo iscrizione">
	<caption>Suddivisione per tipo iscrizione</caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Anno scolastico">Anno scolastico</abbr></th>
				<th id="col2"><abbr title="Iscrizioni obbligatorie (anni)">Iscrizioni obbligatorie (anni)</abbr></th>
				<th id="col3"><abbr title="Iscrizioni facoltative (anni)">Iscrizioni facoltative (anni)</abbr></th>
				<th id="col4"><abbr title="Totale">Totale</abbr></th>
				<th id="col5"><abbr title="Iscrizioni obbligatorie 1&ordf; classe">Iscrizioni obbligatorie 1&ordf; classe</abbr></th>
			</tr>
		</thead>
		<tbody>
			<% for (int i=0; i<anniScolasticiInfMedie.length; i++) { %>
			<tr>
				<td headers="col1"><%= anniScolasticiInfEle[i] %>/<%= anniScolasticiInfEle[i] + 1 %></td>
				<td headers="col2"><%= statisticaPrimaria.getPrimaria(anniScolasticiInfEle[i]).getIscrizioniObbligatorie() %> (<%= anniScolasticiInfEle[i] - 10 %>-<%= anniScolasticiInfEle[i] - 6 %>)</td>
				<td headers="col3"><%= statisticaPrimaria.getPrimaria(anniScolasticiInfEle[i]).getIscrizioniFacoltative() %> (1/1/<%= anniScolasticiInfEle[i] - 5 %>-30/4/<%= anniScolasticiInfEle[i] - 5 %>)</td>
				<td headers="col4" class="tmpl_coltot"><%= statisticaPrimaria.getPrimaria(anniScolasticiInfEle[i]).getTotIscrizioni() %></td>
				<td headers="col5"><%= statisticaPrimaria.getPrimaria(anniScolasticiInfEle[i]).getIscrizioniObbligatorieClassePrima() %></td>
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
			<c:forEach items="${anniSolariEle}" var="key" varStatus="keysStatus">
				<tr>
					<td headers="col1">${key}</td>
					<td headers="col2">${statisticaPrimaria.bambiniPerAnnoSolare[key]}</td>
				</tr>	
			</c:forEach>
		</tbody>
	</table>
	<!-- primarie fine -->
	
	<!-- secondarie primo grado -->
	<h3>Plessi scuole secondarie di primo grado</h3>
	
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
			</tr>
		</thead>
		<tbody>
			<% for (int i=0; i<anniScolasticiInfMedie.length; i++) { %>
			<tr>
				<td headers="col1"><%= anniScolasticiInfMedie[i] %>/<%= anniScolasticiInfMedie[i] + 1 %></td>
				<td headers="col2"><%= statisticaSecondariaPG.getSecondariaPG(anniScolasticiInfMedie[i]).getIscrizioniObbligatorie() %><br/>(<%= anniScolasticiInfMedie[i] - 13 %>-<%= anniScolasticiInfMedie[i] - 11 %>)</td>
				<td headers="col3"><%= statisticaSecondariaPG.getSecondariaPG(anniScolasticiInfMedie[i]).getIscrizioniObbligatorieClassePrima() %></td>
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
			<c:forEach items="${anniSolariMedie}" var="key" varStatus="keysStatus">
				<tr>
					<td headers="col1">${key}</td>
					<td headers="col2">${statisticaSecondariaPG.bambiniPerAnnoSolare[key]}</td>
				</tr>	
			</c:forEach>
		</tbody>
	</table>
	<!-- secondarie primo grado fine -->
<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
