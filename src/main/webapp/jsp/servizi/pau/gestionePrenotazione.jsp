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

<% PoligonoPAU poligonoPau = (PoligonoPAU)request.getAttribute("poligonoPau"); %>
<% List<TipologiaBean> tipologie = (List<TipologiaBean>)request.getAttribute("tipologie"); %>
<% List<CategoriaBean> categorie = (List<CategoriaBean>)request.getAttribute("categorie"); %>
<% List<ServizioBean> servizi = (List<ServizioBean>)request.getAttribute("servizi"); %>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>


<%@page import="org.apache.commons.lang.StringUtils"%></head>

<body onload="init();" id="tmpl_popup">	

		<%@ include file="../../include/tmplMessaggio.jsp" %>

		<form action="/tolomeobinj/pau/GestionePrenotazioneServlet" method="post">
		
		<fieldset>
			<legend>Prenotazione Area Urbana</legend>
				<%--
				<div class="tmpl_form_nofloat">
					<label for="idTipologia">Tipologia: *</label>
					<select id="idTipologia" name="idTipologia">
						<option value="">- Scegli -</option>
						<c:forEach items="${tipologie}" var="tipologia" varStatus="tipologiaStatus"> 
				            <option value="${tipologia.idTipologia}">${tipologia.descrizione}</option>
						</c:forEach>
		            </select>
		        </div>
		        --%>
		        <div class="tmpl_form_nofloat">
					<label for="idCategoria">Tipologia: *</label>
					<select id="idCategoria" name="idCategoria">
						<option value="">- Scegli -</option>
						<c:forEach items="${tipologie}" var="tipologia" varStatus="tipologiaStatus">														
							<optgroup label="${tipologia.descrizione}" id="tipo_${tipologia.idTipologia}">
								<c:forEach items="${categorie}" var="categoria" varStatus="categoriaStatus">
									<c:if test="${tipologia.idTipologia==categoria.idTipologia}">
										<option value="${categoria.idCategoria}" ${poligonoPau.idCategoria == categoria.idCategoria ? "selected=\"selected\"" : ""}>${categoria.descrizione}</option>
									</c:if>
								</c:forEach>
							</optgroup>
						</c:forEach>
		            </select>
		        </div>
		        <div class="tmpl_form_nofloat">
					<label for="idServizio">Servizio:</label>
					<select id="idServizio" name="idServizio">
						<option value="">- Scegli -</option>
						<c:forEach items="${servizi}" var="servizio" varStatus="servizioStatus"> 
				            <option value="${servizio.idServizio}" ${poligonoPau.idServizio == servizio.idServizio ? "selected=\"selected\"" : ""}>${servizio.codice} - ${servizio.descrizione}</option>
						</c:forEach>
		            </select>
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="referente">Referente:</label>
		            <input type="text" id="referente" name="referente" value="${poligonoPau.referente}" accesskey="" maxlength="100" />
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="organizzazione">Organizzazione:</label>
		            <input type="text" id="organizzazione" name="organizzazione" value="${poligonoPau.organizzazione}" accesskey="" maxlength="100" />
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="telOrganizzazione">Tel. organizzazione:</label>
		            <input type="text" id="telOrganizzazione" name="telOrganizzazione" value="${poligonoPau.telOrganizzazione}" accesskey="" maxlength="50" />
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="localizzazione">Localizzazione:</label>
		            <input type="text" id="localizzazione" name="localizzazione" value="${poligonoPau.localizzazione}" accesskey="" maxlength="1000" />
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="dataInizio">Data inizio: *</label>
		            <c:choose>									
						<c:when test="${poligonoPau.dataOraInizio != '00010101000000000000'}">
							<input type="text" id="dataInizio" name="dataInizio" value="${poligonoPau.dataOraInizio.formattedDate}" accesskey="" />
						</c:when>
						<c:otherwise>
							<input type="text" id="dataInizio" name="dataInizio" value="" accesskey="" />
						</c:otherwise>
					</c:choose>
		            <span class="tmpl_form_nota">gg/mm/aaaa</span>
		        </div>
		        <div class="tmpl_form_nofloat">
		        	<label for="oraInizioH">Ora inizio: *</label>
					<select name="oraInizioH" id="oraInizioH">
						<c:forEach begin="0" end="23" var="i">   
				            <option value="${i}" ${poligonoPau.dataOraInizio.hour == i ? "selected=\"selected\"" : ""}>${i}</option>
				        </c:forEach>
					</select>:
					<select name="oraInizioM" id="oraInizioM">
						<option value="00" ${poligonoPau.dataOraInizio.minute == 0  ? "selected=\"selected\"" : ""}>00</option>
						<option value="15" ${poligonoPau.dataOraInizio.minute == 15 ? "selected=\"selected\"" : ""}>15</option>
						<option value="30" ${poligonoPau.dataOraInizio.minute == 30 ? "selected=\"selected\"" : ""}>30</option>
						<option value="45" ${poligonoPau.dataOraInizio.minute == 45 ? "selected=\"selected\"" : ""}>45</option>
					</select>
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="dataFine">Data fine: *</label>
		            <c:choose>									
						<c:when test="${poligonoPau.dataOraFine != '00010101000000000000'}">
							<input type="text" id="dataFine" name="dataFine" value="${poligonoPau.dataOraFine.formattedDate}" accesskey="" />
						</c:when>
						<c:otherwise>
							<input type="text" id="dataFine" name="dataFine" value="" accesskey="" />
						</c:otherwise>
					</c:choose>
		            <span class="tmpl_form_nota">gg/mm/aaaa</span>
		        </div>
		        <div class="tmpl_form_nofloat">
		        	<label for="oraFineH">Ora fine: *</label>
					<select name="oraFineH" id="oraFineH">
						<c:forEach begin="0" end="23" var="i">           
				            <option value="${i}" ${poligonoPau.dataOraFine.hour == i ? "selected=\"selected\"" : ""}>${i}</option>
				        </c:forEach>
					</select>:
					<select name="oraFineM" id="oraFineM">
						<option value="00" ${poligonoPau.dataOraFine.minute == 0  ? "selected=\"selected\"" : ""}>00</option>
						<option value="15" ${poligonoPau.dataOraFine.minute == 15 ? "selected=\"selected\"" : ""}>15</option>
						<option value="30" ${poligonoPau.dataOraFine.minute == 30 ? "selected=\"selected\"" : ""}>30</option>
						<option value="45" ${poligonoPau.dataOraFine.minute == 45 ? "selected=\"selected\"" : ""}>45</option>
					</select>
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="descBreve">Descrizione breve: *</label>
		            <input type="text" id="descBreve" name="descBreve" value="${poligonoPau.descBreve}" accesskey="" maxlength="500" />
		        </div>
		        <div>
		            <label for="descEstesa">Descrizione estesa:</label>
		            <textarea id="descEstesa" name="descEstesa" rows="4" cols="50">${poligonoPau.descEstesa}</textarea>
		            <span class="tmpl_form_nota">testo massimo 2000 caratteri</span>
		        </div>
		        <div>
		            <label for="note">Note:</label>
		            <textarea id="note" name="note" rows="4" cols="50">${poligonoPau.descEstesa}</textarea>
		            <span class="tmpl_form_nota">testo massimo 2000 caratteri</span>
		        </div>
		        <div class="tmpl_form_nofloat">
					<label for="priorita">Priorità:</label>
					<select name="priorita" id="priorita">
						<option value="">- Scegli -</option>
						<option value="1" ${poligonoPau.priorita == 1 ? "selected=\"selected\"" : ""}>Alta</option>
						<option value="2" ${poligonoPau.priorita == 2 ? "selected=\"selected\"" : ""}>Media</option>
						<option value="3" ${poligonoPau.priorita == 3 ? "selected=\"selected\"" : ""}>Bassa</option>
					</select>
		        </div>
		        <div class="tmpl_form_nofloat">
					<label for="stato">Stato:</label>
					<select name="stato" id="stato">
						<option value="1" ${poligonoPau.stato == 1 ? "selected=\"selected\"" : ""}>Opzionata</option>
						<option value="2" ${poligonoPau.stato == 2 ? "selected=\"selected\"" : ""}>Prenotata</option>
						<option value="3" ${poligonoPau.stato == 3 ? "selected=\"selected\"" : ""}>Autorizzata</option>
					</select>
		        </div>
		</fieldset>
		
		<div class="tmpl_form_hidden">
			<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
			<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
			<input type="hidden" name="geoCoord" value='<%= StringUtils.isNotEmpty(request.getParameter("geoCoord"))?request.getParameter("geoCoord"):request.getAttribute("geoCoord") %>'/>
			<input type="hidden" name="geoOp" value="<%= request.getParameter("geoOp") %>"/>
		</div>
		
		<%@ include file="../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
