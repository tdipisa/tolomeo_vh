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

	<script type="text/JavaScript">
		$(function(){
			mapOperation();
			<c:if test="${!empty deletionRequest}">
			if(deleteConfirm()){
				$("#operazione").val("C");
				$("#formCantiere").submit();
			}			
			</c:if>			
		});
		
		function deleteConfirm(){			
			if(confirm("Il cantiere ${cantiere.id} verrà eliminato definitivamente!\nContinuare?")){
				return true;
			}else{
				$("#operazione").val($("#operazione")[0].defaultValue);
				return false;
			}
		}
		<c:if test="${!empty refreshSelected}">
			self.parent.refreshSelected();
		</c:if>
		var geom = ${cantiere.geometria.JSGeometry};
		
		function showOnMap(){
			//self.parent.tolomeo.api.zoomToExtent(geom.geometry);
			self.parent.tolomeo.api.zoomToObj(-5200,${cantiere.id},true);
		}

		/* DECOMMENTARE SE SI VUOL PASSARE A RICHIESTA AJAX DELLA GEOMETRIA
		function showOnMap(){
			self.parent.zoomToObj(-5200,${cantiere.id},true);
		}
		
		oppure 
		
		function showOnMap(){
			$.getJSON("/tolomeobinj/AjaxQueryByIDServlet",
			{
				codTPN:$('#codTPN').val(),
			 	IDTPN:$('#idCantiere').val()
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

<body id="tmpl_popup">	
		<%@ include file="include/pageHeaderGlup.jsp" %>
		<%@ include file="../../../include/tmplMessaggio.jsp" %>

		<h2>Gestione Cantiere</h2>		
		<h3>Dettaglio cantiere "${cantiere.id}"</h3>
		
		<form id="formCantiere" action="/tolomeobinj/glup/GestioneCantiere" method="post">		
		<fieldset class="tmpl_form_float">
			<legend>Dati Cantiere</legend>
				<c:if test="${!empty cantiere.id}">
					<div>
						<span class="tmpl_form_etichetta">Identificativo cantiere:</span>
						<span class="tmpl_form_fixtext">${cantiere.id}</span>										
					</div>
				</c:if>
				<div>
					<span class="tmpl_form_etichetta">Progetto di appartenenza:</span>
					<span class="tmpl_form_fixtext">${cantiere.progetto.codice}</span>										
				</div>
				<div>
					<span class="tmpl_form_etichetta">Stato cantiere:</span>
					<span class="tmpl_form_fixtext">${cantiere.stato.descrizione}</span> <span class="stato_${cantiere.stato.code}">&nbsp;</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Tipo intervento:</span>
					<span class="tmpl_form_fixtext">${cantiere.tipoIntervento.descrizione}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Ambito intervento:</span>
					<span class="tmpl_form_fixtext">${cantiere.ambitoIntervento.descrizione}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Aperto il:</span>
					<span class="tmpl_form_fixtext"><c:out value="${cantiere.dtApertura.formatted}" default="- non aperto -" /></span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Chiuso il:</span>
					<span class="tmpl_form_fixtext"><c:out value="${cantiere.dtChiusura.formatted}" default="- non chiuso -" /></span>
				</div>	
				<div>				
					<span class="tmpl_form_etichetta">Ordinanza : </span>
					<c:choose>
						<c:when test="${!empty cantiere.numOrdinanza}">
							<a href="http://www.comune.prato.it/servizicomunali/ordinanze/trasporti/archivio/${cantiere.annoOrdinanza}/htm/${cantiere.numOrdinanza}-preview.htm" target="_blank">
							<span class="tmpl_form_fixtext">n. &nbsp;${cantiere.numOrdinanza}&nbsp;  del  &nbsp;${cantiere.annoOrdinanza}</span></a>
						</c:when>
						<c:otherwise>
							<span class="tmpl_form_fixtext">- nessuna -</span>
						</c:otherwise>
					</c:choose>
				</div>											
		        <div>
					<span class="tmpl_form_etichetta">Ditta lavori:</span>
					<c:choose>
			            <c:when test="${empty cantiere.dittaLavori}">
			            	<span class="tmpl_form_fixtext">- nessuna -</span>
			            </c:when>
			            <c:otherwise>
			            	<a href="/tolomeobinj/glup/GestioneDitta?operazione=V&idDitta=${cantiere.dittaLavori.id}"><span class="tmpl_form_fixtext">${cantiere.dittaLavori.descrizione}</span></a>
			            </c:otherwise>
		            </c:choose>					
				</div>
				<div>
					<span class="tmpl_form_etichetta">Referente lavori:</span>
					<c:choose>
			            <c:when test="${empty cantiere.referenteLavori}">
			            	<span class="tmpl_form_fixtext">- nessuno -</span>
			            </c:when>
			            <c:otherwise>
			            	<a href="/tolomeobinj/glup/GestioneReferente?operazione=V&idReferente=${cantiere.referenteLavori.id}"><span class="tmpl_form_fixtext">${cantiere.referenteLavori.cognome} ${cantiere.referenteLavori.nome}</span></a>
			            </c:otherwise>
		            </c:choose>					
				</div>		        				
		        <div>
					<span class="tmpl_form_etichetta">Note:</span><br />
					<span class="tmpl_form_fixtext"><textarea id="note" name="note" rows="8" cols="50" readonly="readonly">${cantiere.note}</textarea></span>
				</div>		        										        
		</fieldset>		
		<c:choose>									
			<c:when test="${!empty cantiere.strade}">
				<h3>Lista vie coinvolte</h3>
				<ul>
				<c:forEach items="${cantiere.strade}" var="strada" varStatus="status">
					<li>						 
						<span class="tmpl_form_fixtext">${strada.descrLunga}</span>	
					</li>
				</c:forEach>
				</ul>
			</c:when>
			<c:otherwise>
				<h3>Nessuna via coinvolta dal cantiere</h3>
			</c:otherwise>
		</c:choose>
		
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idProgetto" id="idProgetto" value="${cantiere.idProgetto}" />
			<input type="hidden" name="idCantiere" id="idCantiere" value="${cantiere.id}" />						
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />
			<input type="hidden" name="codTPN" id="codTPN" value="${codTPN}" />
			<input type="hidden" name="codice" id="codice" value="${cantiere.progetto.codice}" />
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
