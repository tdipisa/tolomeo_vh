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
<%@page import="java.util.*"%>
<%@page import="it.prato.comune.sit.beans.pau.TipologiaBean"%>

<% List<TipologiaBean> tipologie = (List<TipologiaBean>)request.getAttribute("tipologie"); %>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>
<%@ include file="include/pageHeaderPau.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="/tolomeobinj/pau/GestioneTipologiaServlet" method="post">
		<fieldset>
			<legend>Inserisci nuova tipologia</legend>
			<div class="tmpl_form_nofloat">
	            <label for="descTipologia">Descrizione: *</label>
	            <input type="text" id="descTipologia" name="descTipologia" value="" accesskey="" maxlength="100" />
	        </div>
	        <div class="">
	        	<input type="hidden" id="op" name="op" value="insTip" accesskey="" />
	        </div>
	        <div class="tmpl_bottoni">
				<label><input class="pulisci" name="P" value="pulisci" title="pulisci" type="reset"/></label>
				<label><input class="inserisci" name="I" value="inserisci" title="inserisci" type="submit"/></label>
			</div>
		</fieldset>
	</form>
	
	<table summary="Elenco tipologie">
		<caption>Elenco tipologie</caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Id">Id.</abbr></th>
				<th id="col2"><abbr title="Descrizione">Descrizione</abbr></th>
			</tr>
		</thead>
		<tbody>
		<c:forEach items="${tipologie}" var="tipologia" varStatus="tipologiaStatus">
			<tr>
				<td headers="col1"><a href="/tolomeobinj/pau/GestioneTipologiaServlet?op=visTip&idTipologia=${tipologia.idTipologia}">${tipologia.idTipologia}</a></td>
				<td headers="col2"><a href="/tolomeobinj/pau/GestioneTipologiaServlet?op=visTip&idTipologia=${tipologia.idTipologia}">${tipologia.descrizione}</a></td>
			</tr>
		</c:forEach>
		</tbody>
	</table>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
