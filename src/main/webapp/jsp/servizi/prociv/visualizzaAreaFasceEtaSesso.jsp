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
<%@ page import="it.prato.comune.tolomeo.servizi.shared.beans.*" %>
<% 
	StatisticaCompletaFasceEta statisticaCompletaFasceEta = (StatisticaCompletaFasceEta) request.getAttribute("statisticaCompletaFasceEta");
	String key = (String) request.getAttribute("key"); 
	int codTPN = (Integer)request.getAttribute("codTPN"); 
%>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="VisualizzaIntersectAnagrafeServlet" method="post">
		<fieldset>
			<legend>Statistica popolazione</legend>
			<div>
				<span class="tmpl_form_etichetta">Numero totale di residenti:</span>
				<span class="tmpl_form_fixtext">${statisticaCompletaFasceEta.statisticaArea.residenti}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Densità di popolazione per ettaro:</span>
				<span class="tmpl_form_fixtext">${statisticaCompletaFasceEta.statisticaArea.densita}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Nuclei familiari:</span>
				<span class="tmpl_form_fixtext">${statisticaCompletaFasceEta.statisticaArea.famiglie}</span>
			</div>
		
			<div class="tmpl_form_hidden">	
				<input type="hidden" name="key" value="<%= key %>" />
				<input type="hidden" name="codTPN" value="<%= codTPN %>" />
				<input type="hidden" name="forward" value="/jsp/servizi/prociv/visualizzaAbitanti.jsp" />
				<input type="hidden" name="command" value="famiglie" />
			</div>	
		</fieldset>
		
		<div class="tmpl_bottoni">
			<c:choose>
				<c:when test="${statisticaCompletaFasceEta.statisticaArea.residenti > 0}">
					<input class="generico" name="G" value="interroga anagrafe" title="visualizza le anagrafi delle famiglie residenti nell'area" type="submit"/>
				</c:when>
				<c:otherwise>
					<input class="generico" disabled="disabled" name="G" value="interroga anagrafe" title="visualizza le anagrafi delle famiglie residenti nell'area" type="submit"/>
				</c:otherwise>
			</c:choose>
		</div>
	</form>
	
	<%@ include file="../include/tabellaFasceEtaSesso.jsp" %>
	
<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>