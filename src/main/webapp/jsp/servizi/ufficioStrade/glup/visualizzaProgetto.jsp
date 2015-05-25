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
<%@ include file="../../../include/tmplBaseUPHeadPannello.jsp" %>
<%@ include file="include/headGlup.jsp" %>
	<script type="text/JavaScript">
		function init() {
			mapOperation();
		}
		
		/* DECOMMENTARE SE SI VUOL PASSARE A RICHIESTA AJAX DELLA GEOMETRIA
		function showOnMap(idCantiere){
			$.getJSON("/tolomeobinj/AjaxQueryByIDServlet",
			{
				codTPN:$('#codTPN').val(),
			 	IDTPN:idCantiere
			 },
			 function(data,status){
			 	if(status == 'success'){
			 		self.parent.zoomToExtent(data.geometries[0].geometry);
			 	}else{
			 		alert('Problemi nel recupero della geometria!');
			 	}
			 }
			);
		}
		*/
	</script>

</head>

<body onload="init();" id="tmpl_popup">	
		<%@ include file="include/pageHeaderGlup.jsp" %>
		<%@ include file="../../../include/tmplMessaggio.jsp" %>

		<h2>Gestione Progetto</h2>		
		<h3>Dettaglio progetto "${progetto.codice}"</h3>
		
		<form action="/tolomeobinj/glup/GestioneProgetto" method="post">
		
		<fieldset class="tmpl_form_float">
			<legend>Dati Progetto</legend>
				<div>
					<span class="tmpl_form_etichetta">Codice:</span>
					<span class="tmpl_form_fixtext">${progetto.codice}</span>
										
				</div>
				<div>
					<span class="tmpl_form_etichetta">Stato:</span>
					<span class="tmpl_form_fixtext">${progetto.stato.descrizione}</span>  
					<span class="stato_${progetto.stato.code}">&nbsp;</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Anno di riferimento:</span>
					<span class="tmpl_form_fixtext">${progetto.anno}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Descrizione:</span>
					<span class="tmpl_form_fixtext">${progetto.descrizione}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Approvazione:</span>
					<span class="tmpl_form_fixtext"> ${progetto.tipoApprovazione.descrizione} </span>
					<span class="tmpl_form_etichetta"> n.</span>
					<span class="tmpl_form_fixtext"> ${progetto.numeroApprovazione} </span>
					<span class="tmpl_form_etichetta"> del </span>
					<span class="tmpl_form_fixtext"> ${progetto.dtApprovazione.formatted}</span>
				</div>								
		        <div>
					<span class="tmpl_form_etichetta">Direttore lavori:</span>					
					<c:if test="${progetto.dirLav != null}">																		
						<span class="tmpl_form_fixtext"><c:out value="${progetto.dirLav.cognome}" default="- nessuno -" /> ${progetto.dirLav.nome}</span>
					</c:if>
				</div>
		        <div>
					<span class="tmpl_form_etichetta">R. U. P.:</span>
					<c:if test="${progetto.respUnicoProc != null}">																		
						<span class="tmpl_form_fixtext"><c:out value="${progetto.respUnicoProc.cognome}" default="- nessuno -" /> ${progetto.respUnicoProc.nome}</span>
					</c:if>					
				</div>
				<div>
					<span class="tmpl_form_etichetta">Note:</span><br />
					<span class="tmpl_form_fixtext"><textarea id="note" name="note" rows="8" cols="50" readonly="readonly">${progetto.note}</textarea></span>
				</div>						        
		</fieldset>		
		
		<fieldset>
			<legend>Dati Appalto</legend>
			<c:choose>
				<c:when test="${progetto.appalto == null}">					
					<h3>Appalto non inserito</h3>					
				</c:when>
				<c:otherwise>
					<div>
						<span class="tmpl_form_etichetta">Affidamento: </span>
						<span class="tmpl_form_fixtext">Determina </span>
						<span class="tmpl_form_etichetta">n. </span>
						<span class="tmpl_form_fixtext">${progetto.appalto.numeroAffidamento}</span>
						<span class="tmpl_form_etichetta">del</span>
						<span class="tmpl_form_fixtext">${progetto.appalto.dtAffidamento.formatted}</span>
					</div>
					<div>
						<span class="tmpl_form_etichetta">Ditta:</span>
						<c:choose>
				            <c:when test="${empty progetto.appalto.ditta}">
				            	<span class="tmpl_form_fixtext">- nessuna -</span>
				            </c:when>
				            <c:otherwise>
				            	<a href="/tolomeobinj/glup/GestioneDitta?operazione=V&idDitta=${progetto.appalto.ditta.id}"><span class="tmpl_form_fixtext">${progetto.appalto.ditta.descrizione}</span></a>
				            </c:otherwise>
			            </c:choose>	
					</div>
					<div>
						<span class="tmpl_form_etichetta">Referente:</span>
						<c:choose>
				            <c:when test="${empty progetto.appalto.referente}">
				            	<span class="tmpl_form_fixtext">- nessuno -</span>
				            </c:when>
				            <c:otherwise>
				            	<a href="/tolomeobinj/glup/GestioneReferente?operazione=V&idReferente=${progetto.appalto.referente.id}"><span class="tmpl_form_fixtext">${progetto.appalto.referente.cognome} ${progetto.appalto.referente.nome}</span></a>
				            </c:otherwise>
			            </c:choose>							
					</div>		
					<input type="hidden" name="idAppalto" id="idAppalto" value="${progetto.appalto.id}" />			
				</c:otherwise>											
			</c:choose>	
		</fieldset>		
		<c:choose>									
			<c:when test="${!empty progetto.cantieri}">
				<h3>Lista cantieri</h3>
				<ul>
				<c:forEach items="${progetto.cantieri}" var="cantiere" varStatus="status">
					<li><!--  <a href="javascript: showOnMap(${cantiere.id}); void(0);"><img src="/tolomeohtdocs/img/cartina.gif" style="vertical-align:middle; border: 0px;" /></a>  -->
						<a href="/tolomeobinj/glup/GestioneCantiere?operazione=V&idCantiere=${cantiere.id}"><span class="tmpl_form_etichetta">Cantiere: </span> 
						<span class="tmpl_form_fixtext">${cantiere.id}</span></a> -

						<span class="stato_${cantiere.stato.code}">&nbsp;</span>
						<span class="tmpl_form_fixtext">${cantiere.stato.descrizione}</span>  
						
						<c:if test="${!empty cantiere.strade}">
							<ul>
							<c:forEach items="${cantiere.strade}" var="strada" varStatus="status">
								<li>						
									<span class="tmpl_form_fixtext">${strada.descrLunga}</span>
								</li>
							</c:forEach>
							</ul>
						</c:if>
					</li>
				</c:forEach>
				</ul>
			</c:when>
			<c:otherwise>
				<h3>Nessun cantiere ancora associato</h3>
			</c:otherwise>
		</c:choose>
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idProgetto" id="idProgetto" value="${progetto.id}" />					
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />
			<input type="hidden" name="codice" id="codice" value="${progetto.codice}" />
			<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
			<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
			<input type="hidden" name="geoCoord" value='<%= request.getParameter("geoCoord") %>'/>
			<input type="hidden" name="geoOp" value="<%= request.getParameter("geoOp") %>"/>
			<input type="hidden" name="step" value=""/>
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>

