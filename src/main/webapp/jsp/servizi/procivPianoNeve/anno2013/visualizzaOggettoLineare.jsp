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
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LineaLivello4"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerLivello4"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiLineari"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LineaFasiLineari"%>
<%@ include file="../../../include/tmplBaseUPPannello.jsp" %>

<%@page import="org.apache.commons.lang.StringEscapeUtils"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.List"%>
<%

	Integer idLivelloObj = (Integer) request.getAttribute("idLivello");
	int idLivello = idLivelloObj.intValue();
	String idFase = (String) request.getAttribute("idFase");

	LayerFasiLineari layerFaseXX        = null;
	LayerLivello4    layerLivello4      = null;
	LineaFasiLineari linea         = null;
	LineaLivello4    lineaLivello4 = null;
	int codTpn = 0;

	linea = (LineaFasiLineari) request.getAttribute("linea");
	
	if (idLivello==1) {
		if (StringUtils.equalsIgnoreCase(idFase, "A0")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseA0");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "A1")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseA1");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseBLinee");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "C")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv1FaseC");
			
		}
		
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==3) {
		if (StringUtils.equalsIgnoreCase(idFase, "A")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv3FaseA");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "B")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv3FaseB");
			
		} else if (StringUtils.equalsIgnoreCase(idFase, "AB")) {
			
			layerFaseXX = (LayerFasiLineari) request.getAttribute("liv3FaseAB");
			
		}
		
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==4) {
		
		layerLivello4 = (LayerLivello4) request.getAttribute("liv4");
		codTpn        = layerLivello4.getCodTPN();
		lineaLivello4 = (LineaLivello4) request.getAttribute("lineaLivello4");
		
	}
	
%>

<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../../include/tmplMessaggio.jsp" %>
	
	<h2>Livello <%= idLivello %><%-- if (idFase!=null && StringUtils.equalsIgnoreCase(idFase, "0")) { --%> - Fase <%= idFase %><%-- } --%></h2>
	
	<style>
		td { height: 35px }
		.operatore {
			font-weight: bold !important;
			color: #fff;
			text-shadow: #000 0.1em 0.1em 0.2em;
			white-space: nowrap;
		}
		span.operatore {
			color: #fff !important;
			font-weight: bold !important;
			background-color: transparent;
		}
		.squadra {
			font-weight: bold !important;
			color: #fff !important;
			text-shadow: #000 0.1em 0.1em 0.2em !important;
			white-space: nowrap !important;
			padding:2px;
		}
		span.squadra {
			color: #fff !important;
			background-color: transparent;
		}
		.alta {
			color: #f00 !important;
			font-weight: bold !important;
			text-shadow: #444 0.1em 0.1em 0.2em !important;
		}
		.media {
			color: #ff0 !important;
			font-weight: bold !important;
			text-shadow: #444 0.1em 0.1em 0.2em !important;
		}
		
		.bassa {
			color: #0f0 !important;
			font-weight: bold !important;
			text-shadow: #444 0.1em 0.1em 0.2em !important;
		}
	</style>
	
	<fieldset>
		<legend>Itinerario</legend>
		<div>
			<span class="tmpl_form_etichetta">Livello:</span>
			<span class="tmpl_form_fixtext"><%= linea.getIdLivello() %></span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Fase:</span>
			<span class="tmpl_form_fixtext"><%= linea.getIdFase() %></span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">ID:</span>
			<span class="tmpl_form_fixtext"><%= linea.getIdOggetto() %></span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Operatore:</span>
			<span class="tmpl_form_fixtext operatore" style="background-color:<%= linea.getHex() %>;"><%= linea.getOperatore() %></span>
		</div>
		<% if (StringUtils.isNotEmpty(linea.getPartenza())) { %>
		<div>
			<span class="tmpl_form_etichetta">Partenza:</span>
			<span class="tmpl_form_fixtext"><%= linea.getPartenza() %></span>
		</div>
		<% } %>
		<div>
			<span class="tmpl_form_etichetta">Descrizione:</span>
			<span class="tmpl_form_fixtext"><%= linea.getDescrizione() %></span>
		</div>
		<% if (StringUtils.isNotEmpty(linea.getTermine())) { %>
		<div>
			<span class="tmpl_form_etichetta">Termine:</span>
			<span class="tmpl_form_fixtext"><%= linea.getTermine() %></span>
		</div>
		<% } %>
		<div>
			<span class="tmpl_form_etichetta">Note:</span>
			<span class="tmpl_form_fixtext"><%= linea.getNote() %></span>
		</div>
	</fieldset>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>