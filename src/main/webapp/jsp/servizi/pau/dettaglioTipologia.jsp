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
<%@page import="it.prato.comune.sit.beans.pau.CategoriaBean"%>

<% List<CategoriaBean> categorie = (List<CategoriaBean>)request.getAttribute("categorie"); %>
<% TipologiaBean tipologia = (TipologiaBean)request.getAttribute("tipologia"); %>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>
<%@ include file="include/pageHeaderPau.jsp" %>
	
	<script>
		function delTipologia() {
			if (!confirm("Vuoi davvero eliminare la tipologia?\r\nI dati non potranno essere recuperati..."))
				return;
			document.getElementById("op").value="delTip";
			document.forms.gestioneTipologia.submit();
		}
		function delCategoria(idCategoria, idTipologia) {
			if (!confirm("Vuoi davvero eliminare la categoria?\r\nI dati non potranno essere recuperati..."))
				return;
			location.href="/tolomeobinj/pau/GestioneTipologiaServlet?op=delCat&idCategoria="+idCategoria+"&idTipologia="+idTipologia;
		}
	</script>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="/tolomeobinj/pau/GestioneTipologiaServlet" method="post" id="gestioneTipologia" name="gestioneTipologia">
		<fieldset>
			<legend>Gestione tipologia</legend>
			<div class="tmpl_form_nofloat">
	            <label for="descrizione">Descrizione:</label>
	            <input type="text" id="descTipologia" name="descTipologia" value="${tipologia.descrizione}" accesskey="" maxlength="100" />
	        </div>
	        <div class="">
	        	<input type="hidden" id="idTipologia" name="idTipologia" value="${tipologia.idTipologia}" accesskey="" maxlength="" />
	        	<input type="hidden" id="op" name="op" value="modTip" accesskey="" maxlength="" />
	        </div>
	        <div class="tmpl_bottoni">
				<label><input class="pulisci" name="P" value="pulisci" title="pulisci" type="reset"/></label>
				<label><input class="modifica" name="M" value="modifica" title="modifica" type="submit"/></label>
				<label><input class="elimina" name="E" value="elimina" title="elimina" type="button" onclick="delTipologia();"/></label>
			</div>
		</fieldset>
	</form>
	
	<table summary="Elenco tipologie">
		<caption>Elenco categorie per "${tipologia.descrizione}"</caption>
		<thead>
			<tr>
				<th id="col1"><abbr title="Id">Id.</abbr></th>
				<th id="col2"><abbr title="Descrizione">Descrizione</abbr></th>
				<th id="col2"><abbr title="Elimina">Operazioni</abbr></th>
			</tr>
		</thead>
		<tbody>
		<c:forEach items="${categorie}" var="categoria" varStatus="categoriaStatus">
			<tr>
				<td headers="col1">${categoria.idCategoria}</td>
				<td headers="col2">
					<input type="text" id="descCategoria_${categoria.idCategoria}" name="descCategoria" value="${categoria.descrizione}" accesskey="" maxlength="100" />
				</td>
				<td headers="col2">
					<div class="tmpl_bottoni">
						<label><input class="modifica" name="M" value="modifica" title="modifica" type="button" onclick="javascript:d=document.getElementById('descCategoria_${categoria.idCategoria}').value;location.href='/tolomeobinj/pau/GestioneTipologiaServlet?op=modCat&idCategoria=${categoria.idCategoria}&descCategoria=' + d + '&idTipologia=${categoria.idTipologia}'"/></label>
						<label><input class="elimina" name="E" value="elimina" title="elimina" type="button" onclick="delCategoria(${categoria.idCategoria},${categoria.idTipologia});"/></label>
					</div>
				</td>
			</tr>
		</c:forEach>
		</tbody>
	</table>
	
	<form action="/tolomeobinj/pau/GestioneTipologiaServlet" method="post" id="gestioneTipologia" name="gestioneTipologia">
		<fieldset>
			<legend>Inserisci nuova categoria per "${tipologia.descrizione}"</legend>
			<div class="tmpl_form_nofloat">
	            <label for="descCategoria">Descrizione:</label>
	            <input type="text" id="descCategoria" name="descCategoria" value="" accesskey="" maxlength="100" />
	        </div>
	        <div class="">
	        	<input type="hidden" id="op" name="op" value="insCat" accesskey="" maxlength="" />
	        	<input type="hidden" id="idTipologia" name="idTipologia" value="${tipologia.idTipologia}" accesskey="" maxlength="" />
	        </div>
	        <div class="tmpl_bottoni">
				<label><input class="pulisci" name="P" value="pulisci" title="pulisci" type="reset"/></label>
				<label><input class="inserisci" name="I" value="inserisci" title="inserisci" type="submit"/></label>
			</div>
		</fieldset>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
