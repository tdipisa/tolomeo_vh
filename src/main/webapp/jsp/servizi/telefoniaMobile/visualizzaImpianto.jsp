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
<%@page import="it.prato.comune.utilita.core.type.DateType"%>
<%@page import="it.prato.comune.sit.PuntoTelefoniaMobile"%>
<%@page import="it.prato.comune.sit.beans.telefoniaMobile.GestoreBean"%>
<%@page import="it.prato.comune.tolomeo.servizi.telefoniaMobile.beans.StatisticaImpianto"%>
<%@page import="it.prato.comune.sit.toponomastica.PoligonoViaToponomastica"%>

<% PuntoTelefoniaMobile impianto = (PuntoTelefoniaMobile)request.getAttribute("impianto"); %>
<% List<GestoreBean> gestori = (ArrayList<GestoreBean>)request.getAttribute("gestori"); %>
<% StatisticaImpianto statistica = (StatisticaImpianto)request.getAttribute("statistica"); %>
<% PoligonoViaToponomastica via = (PoligonoViaToponomastica)request.getAttribute("via"); %>
<%
	Set<Integer> raggi = statistica.getStatisticheRaggio().keySet();
	Integer[] orderedKeys = new Integer[raggi.size()];
	orderedKeys = raggi.toArray(orderedKeys);	
	Arrays.sort(orderedKeys);
	pageContext.setAttribute("keys", orderedKeys);
%>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="/tolomeobinj/telefoniaMobile/GestioneReportServlet" method="post">
	
		<fieldset>
			<legend>Stazione radio base</legend>
			<div>
				<span class="tmpl_form_etichetta">Codice Impianto:</span>
				<span class="tmpl_form_fixtext">${impianto.codImpianto}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Data installazione:</span>
				<span class="tmpl_form_fixtext"><%= (impianto.getDataInstallazione()!=null) ? impianto.getDataInstallazione().getFormatted() : "Non inserita" %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Rilevatore:</span>
				<span class="tmpl_form_fixtext">${impianto.rilevatore}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Indirizzo:</span>
				<span class="tmpl_form_fixtext">${via.nome}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Numero autorizzazione:</span>
				<span class="tmpl_form_fixtext"><%= (impianto.getNumAutorizzazione()!=null) ? impianto.getNumAutorizzazione() : "Non inserito" %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Tipo autorizzazione:</span>
				<span class="tmpl_form_fixtext"><%= (impianto.getTipoAutorizzazione()!=null) ? impianto.getTipoAutorizzazione() : "Non inserita" %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Descrizione localizzazione:</span>
				<span class="tmpl_form_fixtext"><%= (impianto.getDescLocalizzazione()!=null) ? impianto.getDescLocalizzazione() : "Non inserita" %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Suolo:</span>
				<span class="tmpl_form_fixtext"><%= (impianto.getSuolo()!=null) ? impianto.getSuolo() : "Non inserito" %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Note:</span>
				<span class="tmpl_form_fixtext"><%= (impianto.getNote()!=null) ? impianto.getNote() : "Nessuna" %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Gestori:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty gestori}" >
							<c:forEach items="${gestori}" var="gestore" varStatus="gestoreStatus"> 
								<c:out value="${gestore.descrizione}" />
								<c:if test="${!gestoreStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Non inseriti</c:otherwise>
					</c:choose>
				</span>
			</div>
		</fieldset>
		
		<fieldset>
			<legend>Inquadramento territoriale</legend>
			<div>
				<span class="tmpl_form_etichetta">Coordinate:</span>
				<span class="tmpl_form_fixtext"><%= (int)impianto.getCentroide().getX() %> ; <%= (int)impianto.getCentroide().getY() %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Circoscrizione:</span>
				<span class="tmpl_form_fixtext">${statistica.circoscrizione}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Foglio:</span>
				<span class="tmpl_form_fixtext">${statistica.foglio}</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Particella:</span>
				<span class="tmpl_form_fixtext"><%= (statistica.getParticella()!=null) ? statistica.getParticella() : "Non ci sono particelle nel punto" %></span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Pericolosità idraulica:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty statistica.pericolositaIdraulica}" >
							<c:forEach items="${statistica.pericolositaIdraulica}" var="pericolosita" varStatus="pericolositaStatus"> 
								<c:out value="${pericolosita}" />
								<c:if test="${!pericolositaStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Non presente</c:otherwise>
					</c:choose>
				</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Stazione radio base prossima:</span>
				<span class="tmpl_form_fixtext"><%= (statistica.getImpiantoProssimo()!=null) ? statistica.getImpiantoProssimo() : "Nessuna" %></span>
			</div>
		</fieldset>
		
		<fieldset>
			<legend>Regolamento Urbanistico</legend>
			<div>
				<span class="tmpl_form_etichetta">Zona omogenea:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty statistica.zonaOmogenea}" >
							<c:forEach items="${statistica.zonaOmogenea}" var="zonaOmogenea" varStatus="zonaOmogeneaStatus"> 
								<c:out value="${zonaOmogenea}" />
								<c:if test="${!zonaOmogeneaStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Nessuna</c:otherwise>
					</c:choose>
				</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Sub-sistema:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty statistica.subSistema}" >
							<c:forEach items="${statistica.subSistema}" var="subSistema" varStatus="subSistemaStatus"> 
								<c:out value="${subSistema}" />
								<c:if test="${!subSistemaStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Nessuno</c:otherwise>
					</c:choose>
				</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Destinazione d'uso:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty statistica.destinazioneUso}" >
							<c:forEach items="${statistica.destinazioneUso}" var="destinazioneUso" varStatus="destinazioneUsoStatus"> 
								<c:out value="${destinazioneUso}" />
								<c:if test="${!destinazioneUsoStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Nessuna</c:otherwise>
					</c:choose>
				</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Tipo d'intervento:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty statistica.tipoIntervento}" >
							<c:forEach items="${statistica.tipoIntervento}" var="tipoIntervento" varStatus="tipoInterventoStatus"> 
								<c:out value="${tipoIntervento}" />
								<c:if test="${!tipoInterventoStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Nessuno</c:otherwise>
					</c:choose>
				</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Progetto del suolo:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty statistica.progettoSuolo}" >
							<c:forEach items="${statistica.progettoSuolo}" var="progettoSuolo" varStatus="progettoSuoloStatus"> 
								<c:out value="${progettoSuolo}" />
								<c:if test="${!progettoSuoloStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Nessuno</c:otherwise>
					</c:choose>
				</span>
			</div>
			<div>
				<span class="tmpl_form_etichetta">Vincoli:</span>
				<span class="tmpl_form_fixtext">
					<c:choose>
						<c:when test="${!empty statistica.vincoliFormatted}" >
							<c:forEach items="${statistica.vincoliFormatted}" var="vincolo" varStatus="vincoloStatus"> 
								<c:out value="${vincolo}" />
								<c:if test="${!vincoloStatus.last}"><c:out value="," /></c:if>
							</c:forEach>
						</c:when>
						<c:otherwise>Nessuno</c:otherwise>
					</c:choose>
				</span>
			</div>
		</fieldset>
		
		<c:forEach items="${keys}" var="key" varStatus="keysStatus">			
			<fieldset>
				<legend>Statistica area nel raggio di ${key} m</legend>
				<div>
					<span class="tmpl_form_etichetta">Numero residenti:</span>
					<span class="tmpl_form_fixtext"><c:out value="${statistica.statisticheRaggio[key].numResidenti}" /></span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Destinazioni d'uso:</span>
					<span class="tmpl_form_fixtext">
						<c:choose>
							<c:when test="${!empty statistica.statisticheRaggio[key].DU}">
								<c:forEach items="${statistica.statisticheRaggio[key].DU}" var="destinazioneUso" varStatus="destinazioneUsoStatus"> 
									<c:out value="${destinazioneUso}" />
									<c:if test="${!destinazioneUsoStatus.last}"><c:out value="," /></c:if>
								</c:forEach>
							</c:when>
							<c:otherwise><c:out value="Nessuna" /></c:otherwise>
						</c:choose>
					</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Altre stazioni radio base:</span>
					<span class="tmpl_form_fixtext">
						<c:choose>
							<c:when test="${!empty statistica.statisticheRaggio[key].altriImpianti}" >
								<c:forEach items="${statistica.statisticheRaggio[key].altriImpianti}" var="altriImpianti" varStatus="altriImpiantiStatus"> 
									<c:out value="${altriImpianti.codImpianto}" />
									<c:if test="${!altriImpiantiStatus.last}"><c:out value="," /></c:if>
								</c:forEach>
							</c:when>
							<c:otherwise><c:out value="Nessuna" /></c:otherwise>
						</c:choose>
					</span>
				</div>
			</fieldset>
		</c:forEach>
		
		<fieldset>
			<legend>Immagini stazione radio base</legend>
			<div>
				<div style="margin:1em 0 0 1em; cursor:pointer;" onclick="dimensiona();">
					<img src="/tolomeohtdocs/img/servizi/telefoniaMobile/impianti/${impianto.codImpianto}.jpg" title="Stazione radio base ${impianto.codImpianto}. Click per ingrandire e ridurre." alt="Immagine non disponibile" width="95%" style="padding:0.5em; border:1px solid green;" />
				</div>
			</div>
		</fieldset> 
		
		<div class="tmpl_form_hidden">
			<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
			<input type="hidden" name="IDTPN" value="${impianto.IDTPN}"/>
		</div>
		
		<div class="tmpl_stampa_doc">
			<input id="printObjKey" name="printObjKey" value="" type="hidden" class="tmpl_form_hidden"/>
			<input id="stampaPdf" name="P" value="crea pdf" title="Crea documento PDF" accesskey="P" type="submit"/>
		</div>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
