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

<%@ include file="../../../include/tmplBaseUPHeadPannello.jsp" %>
<%@ include file="include/headGlup.jsp" %>
<script type="text/javascript">
	  
	var myOptgroup;
	var referenteSelectedIndex = 0;
	function onDittaChange(idDitta){  
		// se la ditta è quella vuota setto idDitta = 0 così che il filtro non la trovi 
		if(idDitta == "") idDitta = 0;        
		$("#idReferenteLavori").find("optgroup").remove().end().append(myOptgroup.filter("#" + idDitta));
   	}
   	
   	$(function(){
   		referenteSelectedIndex = $("#idReferenteLavori")[0].selectedIndex;
    	myOptgroup = $("#idReferenteLavori optgroup");
     	$("#idDittaLavori").change(function (event){onDittaChange(event.target.value)});     	     	
     	onDittaChange($("#idDittaLavori").val());  
     	$("#gestioneCantiere")[0].onreset = onResetForm;     	
    });   
    
    function onResetForm(){
    	var oldOnReset = this.onreset;
    	this.onreset = null;    	
    	$("#idReferenteLavori").find("optgroup").remove().end().append(myOptgroup); 
    	$("#idReferenteLavori")[0].options[referenteSelectedIndex].selected = true;   	
    	this.reset();    	
    	onDittaChange($("#idDittaLavori").val());
    	this.onreset = oldOnReset;
    	return false;    	
    }   
        
</script>

</head>

<body id="tmpl_popup">	

		<%@ include file="include/pageHeaderGlup.jsp" %>
		<%@ include file="../../../include/tmplMessaggio.jsp" %>

		<h2>Gestione Cantiere</h2>
		<h3>${pageTitle}</h3>
		
		<form id="gestioneCantiere" action="/tolomeobinj/glup/GestioneCantiere" method="post">
		<fieldset>
			<legend>Dati Anagrafici</legend>
				<div>
					<span class="tmpl_form_etichetta">Progetto : </span>
					<span class="tmpl_form_fixtext">${codice}</span>				
				</div>
				<div>
		            <label for="idTipoIntervento">Tipo intervento *</label>						
					<select id="idTipoIntervento" name="idTipoIntervento">
						<option value="">- Scegli -</option>						
						<c:forEach items="${tipiIntervento}" var="tipoIntervento" varStatus="status">
							<option value="${tipoIntervento.id}" ${tipoIntervento.id == cantiere.idTipoIntervento ? "selected=\"selected\"" : ""}>${tipoIntervento.descrizione}</option>
						</c:forEach>																			
					</select>																		
				</div>
				<div>
		            <label for="idAmbitoIntervento">Ambito intervento *</label>						
					<select id="idAmbitoIntervento" name="idAmbitoIntervento">
						<option value="">- Scegli -</option>						
						<c:forEach items="${ambitiIntervento}" var="ambitoIntervento" varStatus="status">
							<option value="${ambitoIntervento.id}" ${ambitoIntervento.id == cantiere.idAmbitoIntervento ? "selected=\"selected\"" : ""}>${ambitoIntervento.descrizione}</option>
						</c:forEach>																			
					</select>																		
				</div>     
				<div>					
					<label for="dtApertura">Data apertura</label>					
					<input type="text" id="dtApertura" name="dtApertura" value="${cantiere.dtApertura.formatted}" accesskey="" maxlength="10"/>
		            <span class="tmpl_form_nota">gg/mm/aaaa</span>
				</div>
				<div>					
					<label for="dtApertura">Data chiusura</label>					
					<input type="text" id="dtChiusura" name="dtChiusura" value="${cantiere.dtChiusura.formatted}" accesskey="" maxlength="10"/>
		            <span class="tmpl_form_nota">gg/mm/aaaa</span>
				</div>	
				<div>
					<label for="numOrdinanza">N. ordinanza</label>
					<input type="text" id="numOrdinanza" name="numOrdinanza" value="${cantiere.numOrdinanza}" accesskey="" maxlength="9" />
				</div>				
		        <div>
		            <label for="annoOrdinanza">Anno Ordinanza</label>
		            <input type="text" id="annoOrdinanza" name="annoOrdinanza" value="${cantiere.annoOrdinanza}" size="5" accesskey="" maxlength="4" />
		        </div>				           
		        <div>
		            <label for="idDittaLavori">Ditta Lavori</label>						
					<select id="idDittaLavori" name="idDittaLavori">
						<option value="">- Nessuna -</option>						
						<c:forEach items="${ditte}" var="ditta" varStatus="status">
							<option value="${ditta.id}" ${ditta.id == cantiere.idDittaLavori ? "selected=\"selected\"" : ""}>${ditta.descrizione}</option>
						</c:forEach>																			
					</select>																		
				</div>
				<div>
		            <label for="idReferenteLavori">Referente Lavori</label>						
					<select id="idReferenteLavori" name="idReferenteLavori">																
						<option value="">- Nessuno -</option>																	
						<c:forEach items="${ditte}" var="ditta" varStatus="status">														
							<optgroup label="${ditta.descrizione}" id="${ditta.id}">
								<c:if test="${!empty ditta.referenti}">
									<c:forEach items="${ditta.referenti}" var="referente" varStatus="status">
										<option value="${referente.id}" ${referente.id == cantiere.idReferenteLavori ? "selected=\"selected\"" : ""} >${referente.cognome} ${referente.nome}</option>
									</c:forEach>
								</c:if>
							</optgroup>
						</c:forEach>
					</select>																		
				</div>		
				<div>
		            <label for="note">Note</label>
		            <textarea id="note" name="note" rows="8" cols="50" >${cantiere.note}</textarea>
		            <span class="tmpl_form_nota">testo massimo 500 caratteri</span>
		        </div>					        
		</fieldset>		
		<c:choose>									
			<c:when test="${!empty cantiere.strade}">
				<h3>Lista vie coinvolte</h3>
				<ul>
				<c:forEach items="${cantiere.strade}" var="strada" varStatus="status">
					<li>						 
						<span class="tmpl_form_fixtext">${strada.descrLunga}</span>
						<input type="hidden" name="via" id="via_${strada.codVia6}" value="${strada.codVia6}" />	
					</li>
				</c:forEach>
				</ul>
			</c:when>
			<c:otherwise>
				<h3>Nessuna via coinvolta dal cantiere</h3>
			</c:otherwise>
		</c:choose>
		<!-- VIE COINVOLTE -->
		<%--
		<c:if test="${!empty vie}">	
			<div>
				<span class="tmpl_form_etichetta">Vie coinvolte</span>
			</div>	
			<c:forEach items="${vie}" var="via" varStatus="status">
			<div class="tmpl_form_nofloat">
				<input type="checkbox" name="via" id="via_${via.codVia6}" value="${via.codVia6}" ${fn:contains(vieSelezionate, via.codVia6) ? "checked=\"checked\"" : ""} />
				<label for="via_${via.codVia6}">${via.descrLunga}</label>
			</div>
			</c:forEach>
		</c:if>
		--%>						
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idCantiere" id="idCantiere" value="${cantiere.id}" />
			<input type="hidden" name="idProgetto" id="idProgetto" value="${cantiere.idProgetto}" />
			<input type="hidden" name="step" id="step" value="" />
			<input type="hidden" name="vieSelezionate" id="vieSelezionate" value="${vieSelezionate}" />
			<input type="hidden" name="codice" id="codice" value="${codice}" />			
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />
			<input type="hidden" name="tipoOperazione" id="tipoOperazione" value="${tipoOperazione}" />			
			<input type="hidden" name="codTPN" value="${param.codTPN}" />
			<input type="hidden" name="IDTPN" value="${param.IDTPN}" />
			<input type="hidden" name="geoCoord" value='${param.geoCoord}' />
			<input type="hidden" name="geoOp" value="${param.geoOp}" />
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
