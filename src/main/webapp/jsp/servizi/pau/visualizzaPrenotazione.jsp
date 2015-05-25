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
<%@page import="it.prato.comune.utilita.core.type.TsType"%>
<%@page import="it.prato.comune.sit.PoligonoPAU"%>
<%@page import="it.prato.comune.sit.beans.pau.TipologiaBean"%>
<%@page import="it.prato.comune.sit.beans.pau.CategoriaBean"%>
<%@page import="it.prato.comune.sit.beans.pau.ServizioBean"%>
<%@page import="it.prato.comune.sit.toponomastica.PoligonoViaToponomastica"%>

<% PoligonoPAU poligonoPau = (PoligonoPAU)request.getAttribute("poligonoPau"); %>
<% TipologiaBean tipologia = (TipologiaBean)request.getAttribute("tipologia"); %>
<% CategoriaBean categoria = (CategoriaBean)request.getAttribute("categoria"); %>
<% ServizioBean servizio = (ServizioBean)request.getAttribute("servizio"); %>
<% List<PoligonoViaToponomastica> vieOccupate = (List<PoligonoViaToponomastica>)request.getAttribute("vieOccupate"); %>


<%@ include file="../../include/tmplBaseUPPannello.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="" method="post">
	
		<fieldset>
			<legend>Prenotazione Area Urbana</legend>
			<div>
				<span class="tmpl_form_etichetta">Id. prenotazione:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.IDTPN}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Tipologia:</span>
				<span class="tmpl_form_fixtext">${tipologia.descrizione}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Sotto categoria:</span>
				<span class="tmpl_form_fixtext">${categoria.descrizione}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Servizio:</span>
				<span class="tmpl_form_fixtext">${servizio.codice} ${servizio.descrizione}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Referente:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.referente}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Organizzazione:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.organizzazione}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Tel. organizzazione:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.telOrganizzazione}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Vie occupate:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty vieOccupate}" >
							<c:forEach items="${vieOccupate}" var="via" varStatus="viaStatus"> 
								<c:out value="${via.nomeRidotto}" />
								<c:if test="${!viaStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Nessuna</c:otherwise>
					</c:choose>
				</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Localizzazione:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.localizzazione}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Data ora inizio:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.dataOraInizio.formatted}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Data ora fine:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.dataOraFine.formatted}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Descrizione breve:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.descBreve}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Descrizione estesa:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.descEstesa}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Note:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.note}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Liv. priorità:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.prioritaFmt}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Stato:</span>
				<span class="tmpl_form_fixtext">${poligonoPau.statoFmt}</span>
			</div>
		</fieldset>
				
		<div class="tmpl_form_hidden">
			<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
			<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
		</div>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
