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
<%@ page import="java.util.ArrayList" %>
<%@page import="it.prato.comune.sit.PuntoAnagrafe"%>
<%@page import="it.prato.comune.tolomeo.servizi.TolomeoServicesContext"%>
<%@page import="it.prato.comune.tolomeo.servizi.shared.beans.StatisticaCompleta"%>
<%@page import="it.prato.comune.tolomeo.servizi.shared.SharedApplicationProperties"%>
<% 
	StatisticaCompleta statisticaCompleta = (StatisticaCompleta) request.getAttribute("statisticaCompleta");
	TolomeoServicesContext context = TolomeoServicesContext.getInstance();
	pageContext.setAttribute("urlAnagrafe", context.getServizioSharedProperties().getUrlAnagrafeNew());
	pageContext.setAttribute("urlCatasto", context.getServizioSharedProperties().getUrlCatasto()); 
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>

	<style type="text/css">
		.pointer { cursor: pointer; }
	</style>
	
</head>

<body onload="mapOperation();" id="tmpl_popup">

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="">
		<fieldset>
			<legend>Statistica popolazione</legend>
			<div>
				<span class="tmpl_form_etichetta">Numero totale di residenti:</span>
				<span class="tmpl_form_fixtext">${statisticaCompleta.statistica.residenti}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Nuclei familiari:</span>
				<span class="tmpl_form_fixtext">${statisticaCompleta.statistica.famiglie}</span>
			</div>
		</fieldset>
	</form>
	
	<table summary="Elenco famiglie residenti">
	<caption>Famiglie residenti</caption>
		<thead>
			<tr class="tmpl_riga1">
				<th id="col1"><abbr title="Cognome">Cognome</abbr></th>
				<th id="col2"><abbr title="Nome">Nome</abbr></th>
				<th id="col3"><abbr title="Codice fiscale">Codice fiscale</abbr></th>
				<th id="col4"><abbr title="Sesso">Sesso</abbr></th>
				<th id="col5"><abbr title="Data di nascita">Data nascita</abbr></th>
				<th id="col6"><abbr title="Indirizzo">Indirizzo</abbr></th>
				<th id="col7"><abbr title="Visura catastale">Visura catastale</abbr></th>
			</tr>
		</thead>
		
		<tbody>
			<c:forEach items="${statisticaCompleta.abitanti}" var="row" varStatus="rowStatus">
				<c:choose>
					<c:when test="${rowStatus.index %2 == '0'}">
						<tr class="tmpl_riga2">
					</c:when>
					<c:otherwise> 
						<tr class="tmpl_riga1">
					</c:otherwise>
				</c:choose>
				<td headers="col1" class="pointer" onclick="window.open('${urlAnagrafe}&amp;textra=10&amp;idpers=${row.codicePersonale}')">
					${row.cognome}
				</td>
				<td headers="col2" class="pointer" onclick="window.open('${urlAnagrafe}&amp;textra=10&amp;idpers=${row.codicePersonale}')">
					${row.nome}
				</td>
				<td headers="col3" class="pointer" onclick="window.open('${urlAnagrafe}&amp;textra=10&amp;idpers=${row.codicePersonale}')">
					${row.codiceFiscale}
				</td>
				<td headers="col4" class="pointer" onclick="window.open('${urlAnagrafe}&amp;textra=10&amp;idpers=${row.codicePersonale}')">
					${row.sesso}
				</td>
				<td headers="col5" class="pointer" onclick="window.open('${urlAnagrafe}&amp;textra=10&amp;idpers=${row.codicePersonale}')">
					${row.dataNascitaDT.formatted}
				</td>
				<td headers="col6" class="pointer" onclick="window.open('${urlAnagrafe}&amp;textra=10&amp;idpers=${row.codicePersonale}')">
					${row.indirizzo}
				</td>
				<td headers="col7" class="tmpl_col_cx">
					<input name="catasto" value="catasto" title="visualizza il catasto" type="button" onclick="window.open('${urlCatasto}?CF=${row.codiceFiscale}')"/>
				</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
