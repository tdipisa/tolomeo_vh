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
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.LineaItinerari"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.PoligonoZone"%>
<%@page import="org.apache.commons.lang.StringUtils"%>

<%
	String idFase = (String) request.getAttribute("idFase");	
	
	LineaItinerari itinerario = null;
	PoligonoZone   zona       = null;
	
	if (!StringUtils.equalsIgnoreCase(idFase,"C")) {
		itinerario = (LineaItinerari) request.getAttribute("itinerario");
	} else {
		zona       = (PoligonoZone) request.getAttribute("zona");
	}
%>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>
<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<style>
		td { height: 35px }
		.operatore {
			font-weight: bold !important;
			color: #fff !important;
			text-shadow: #000 0.1em 0.1em 0.2em !important;
			padding: 0 1em;
			white-space: nowrap;
		}
	</style>
	
	<form action="">
	
		<% if (!StringUtils.equalsIgnoreCase(idFase,"C")) { %>
			<fieldset>
				<legend>Itinerario</legend>
				<div>
					<span class="tmpl_form_etichetta">ID:</span>
					<span class="tmpl_form_fixtext">${itinerario.IDTPN}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Fase:</span>
					<span class="tmpl_form_fixtext">${itinerario.idFase}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Operatore:</span>
					<span class="tmpl_form_fixtext operatore" style="background-color: rgb(<%= itinerario.getColore().replaceAll(" ",",") %>);">${itinerario.operatore}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Partenza:</span>
					<span class="tmpl_form_fixtext">${itinerario.partenza}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Descrizione:</span>
					<span class="tmpl_form_fixtext">${itinerario.descItinerario}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Termine:</span>
					<span class="tmpl_form_fixtext">${itinerario.termine}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Note:</span>
					<span class="tmpl_form_fixtext">${itinerario.note}</span>
				</div>
			</fieldset>
		<% } else { %>
			<fieldset>
				<legend>Itinerario</legend>
				<div>
					<span class="tmpl_form_etichetta">ID:</span>
					<span class="tmpl_form_fixtext">${zona.IDTPN}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Fase:</span>
					<span class="tmpl_form_fixtext">${zona.idFase}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Operatore:</span>
					<span class="tmpl_form_fixtext operatore" style="background-color: rgb(<%= zona.getColore().replaceAll(" ",",") %>);">${zona.operatore}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Partenza:</span>
					<span class="tmpl_form_fixtext">${zona.partenza}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Descrizione:</span>
					<span class="tmpl_form_fixtext">${zona.descZona}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Termine:</span>
					<span class="tmpl_form_fixtext">${zona.termine}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Note:</span>
					<span class="tmpl_form_fixtext">${zona.note}</span>
				</div>
			</fieldset>
		<% } %>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
