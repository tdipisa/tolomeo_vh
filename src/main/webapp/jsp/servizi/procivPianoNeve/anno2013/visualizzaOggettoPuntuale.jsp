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
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoLivello3FaseD"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.PuntoFasiPuntuali"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerLivello3FaseD"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoNeve.anno2013.LayerFasiPuntuali"%>
<%@ include file="../../../include/tmplBaseUPPannello.jsp" %>

<%@page import="org.apache.commons.lang.StringEscapeUtils"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.List"%>
<%

	Integer idLivelloObj = (Integer) request.getAttribute("idLivello");
	int idLivello = idLivelloObj.intValue();
	String idFase = (String) request.getAttribute("idFase");

	LayerFasiPuntuali  layerFaseXX        = null;
	LayerLivello3FaseD layerLivello3FaseD = null;
	PuntoFasiPuntuali  punto              = null;
	PuntoLivello3FaseD puntoLivello3FaseD = null;
	int codTpn = 0;

	punto = (PuntoFasiPuntuali) request.getAttribute("punto");
	
	if (idLivello==1) {
		
		if (StringUtils.equalsIgnoreCase(idFase, "B")) {
			layerFaseXX = (LayerFasiPuntuali) request.getAttribute("liv1FaseBPunti");
		}
		
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==2) {
		
		layerFaseXX = (LayerFasiPuntuali) request.getAttribute("liv2");
		codTpn = layerFaseXX.getCodTPN();
		
	} else if (idLivello==3) {
		
		if (StringUtils.equalsIgnoreCase(idFase, "D")) {
			
			layerLivello3FaseD = (LayerLivello3FaseD) request.getAttribute("liv3FaseD");
			codTpn             = layerLivello3FaseD.getCodTPN();
			puntoLivello3FaseD = (PuntoLivello3FaseD) request.getAttribute("puntoLivello3FaseD");
		}
	}
	
%>

<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../../include/tmplMessaggio.jsp" %>
	
	<h2>Livello <%= idLivello %><%-- if (idFase!=null && StringUtils.equalsIgnoreCase(idFase, "0")) { --%> - Fase <%= idFase %><%-- } --%></h2>
	
	<style>
		td { height: 35px }
		.operatore {
			font-weight: bold;
			color: #fff;
			text-shadow: #000 0.1em 0.1em 0.2em;
			white-space: nowrap;
		}
		span.operatore {
			color: #fff !important;
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
	
	<% if (idLivello==1 || idLivello==2) { %>
	
		<fieldset>
			<legend>Punto</legend>
			<div>
				<span class="tmpl_form_etichetta">Livello:</span>
				<span class="tmpl_form_fixtext"><%= punto.getIdLivello() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Fase:</span>
				<span class="tmpl_form_fixtext"><%= punto.getIdFase() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">ID:</span>
				<span class="tmpl_form_fixtext"><%= punto.getIdOggetto() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Operatore:</span>
				<span class="tmpl_form_fixtext operatore" style="background-color:<%= punto.getHex() %>;"><%= punto.getOperatore() %></span>
			</div>
			<% if (StringUtils.isNotEmpty(punto.getNome())) { %>
			<div>
				<span class="tmpl_form_etichetta">Nome:</span>
				<span class="tmpl_form_fixtext"><%= punto.getNome() %></span>
			</div>
			<% } %>
			<% if (StringUtils.isNotEmpty(punto.getDescrizione())) { %>
			<div>
				<span class="tmpl_form_etichetta">Descrizione:</span>
				<span class="tmpl_form_fixtext"><%= punto.getDescrizione() %></span>
			</div>
			<% } %>
			<% if (StringUtils.isNotEmpty(punto.getTipo())) { %>
			<div>
				<span class="tmpl_form_etichetta">Tipo:</span>  
				<span class="tmpl_form_fixtext"><%= punto.getTipo() %></span>
			</div>
			<% } %>
			<% if (punto.getPriorita()!=null) { %>
			<div> 
				<span class="tmpl_form_etichetta">Priorità:</span>
				<span class="tmpl_form_fixtext <%= punto.getPrioritaFmt().toLowerCase() %>"><%= punto.getPrioritaFmt() %></span>
			</div>
			<% } %>
			<div>
				<span class="tmpl_form_etichetta">Note:</span>
				<span class="tmpl_form_fixtext"><%= punto.getNote() %></span>
			</div>
		</fieldset>
		
	<% } else if (idLivello==3 ) { %>
		
		<fieldset>
			<legend>Punto</legend>
			<div>
				<span class="tmpl_form_etichetta">Livello:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getIdLivello() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Fase:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getIdFase() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">ID:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getIdOggetto() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Squadra:</span>
				<span class="tmpl_form_fixtext squadra" style="background-color:<%= puntoLivello3FaseD.getHex() %>;"><%= puntoLivello3FaseD.getSquadra() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Nome:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getNome() %></span>
			</div>
			<% if (StringUtils.isNotEmpty(puntoLivello3FaseD.getTipo())) { %>
			<div>
				<span class="tmpl_form_etichetta">Tipo:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getTipo() %></span>
			</div>
			<% } %>
			<div>
				<span class="tmpl_form_etichetta">Circoscrizione:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getCircoscrizione()%></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Indirizzo:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getIndirizzo() %></span>
			</div>
			<% if (puntoLivello3FaseD.getPriorita()!=null) { %>
			<div>
				<span class="tmpl_form_etichetta">Priorità:</span>
				<span class="tmpl_form_fixtext <%= puntoLivello3FaseD.getPrioritaFmt().toLowerCase() %>"><%= puntoLivello3FaseD.getPrioritaFmt() %></span>
			</div>
			<% } %>
			<div>
				<span class="tmpl_form_etichetta">Note:</span>
				<span class="tmpl_form_fixtext"><%= puntoLivello3FaseD.getNote() %></span>
			</div>
		</fieldset>
	
	<% } %>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>