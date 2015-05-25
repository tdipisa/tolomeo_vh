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
		$("#idReferente").find("optgroup").remove().end().append(myOptgroup.filter("#" + idDitta)).show();
   	}
   	
   	$(function(){
   		referenteSelectedIndex = $("#idReferente")[0].selectedIndex;
    	myOptgroup = $("#idReferente optgroup");
     	$("#idDitta").change(function (event){onDittaChange(event.target.value)});
     	onDittaChange($("#idDitta").val());
     	$("#gestioneAppalto")[0].onreset = onResetForm;
    });      
    
     function onResetForm(){
    	var oldOnReset = this.onreset;
    	this.onreset = null;    	
    	$("#idReferente").find("optgroup").remove().end().append(myOptgroup); 
    	$("#idReferente")[0].options[referenteSelectedIndex].selected = true;   	
    	this.reset();    	
    	onDittaChange($("#idDitta").val());
    	this.onreset = oldOnReset;
    	return false;    	
    } 
        
</script>

</head>

<body id="tmpl_popup">	

		<%@ include file="include/pageHeaderGlup.jsp" %>
		<%@ include file="../../../include/tmplMessaggio.jsp" %>
		
		<h2>Gestione Progetto</h2>		
		<h3><c:out value="${pageTitle}" default="Inserimento/Modifica appalto" /></h3>

		<form id="gestioneAppalto" action="/tolomeobinj/glup/GestioneAppalto" method="post">
		<fieldset>
			<legend>Dati Appalto</legend>
				<div>
					<span class="tmpl_form_etichetta">Progetto : </span>
					<span class="tmpl_form_fixtext">${param.codice}</span>				
				</div>
				<div>
					<label for="numeroAffidamento">N. affidamento *</label>
					<input type="text" id="numeroAffidamento" name="numeroAffidamento" value="${appalto.numeroAffidamento}" accesskey="" maxlength="9" />
				</div>				
		        <div>
		            <label for="dtAffidamento">Data affidamento *</label>
		            <input type="text" id="dtAffidamento" name="dtAffidamento" value="${appalto.dtAffidamento.formatted}" accesskey="" maxlength="10" />
		            <span class="tmpl_form_nota">gg/mm/aaaa</span>
		        </div>		        
		        <div>
		            <label for="idDitta">Ditta *</label>						
					<select id="idDitta" name="idDitta">
						<option value="">- Scegli -</option>						
						<c:forEach items="${ditte}" var="ditta" varStatus="status">
							<option value="${ditta.id}" ${ditta.id == appalto.idDitta ? "selected=\"selected\"" : ""}>${ditta.descrizione}</option>
						</c:forEach>																			
					</select>																		
				</div>
				<div>
		            <label for="idReferente">Referente</label>						
					<select id="idReferente" name="idReferente">																
						<option value="">- Nessuno -</option>																	
						<c:forEach items="${ditte}" var="ditta" varStatus="status">														
							<optgroup label="${ditta.descrizione}" id="${ditta.id}">
								<c:if test="${!empty ditta.referenti}">
									<c:forEach items="${ditta.referenti}" var="referente" varStatus="status">
										<option value="${referente.id}" ${referente.id == appalto.idReferente ? "selected=\"selected\"" : ""} >${referente.cognome} ${referente.nome}</option>
									</c:forEach>
								</c:if>
							</optgroup>
						</c:forEach>
					</select>																		
				</div>					        
		</fieldset>								
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idAppalto" id="idAppalto" value="${appalto.id}" />
			<input type="hidden" name="idProgetto" id="idProgetto" value="${appalto.idProgetto}" />
			<input type="hidden" name="codice" id="codice" value="${param.codice}" />			
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />
			<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
			<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
			<input type="hidden" name="geoCoord" value='<%= request.getParameter("geoCoord") %>'/>
			<input type="hidden" name="geoOp" value="<%= request.getParameter("geoOp") %>"/>
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
