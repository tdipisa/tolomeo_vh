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
</head>

<body id="tmpl_popup">	

		<%@ include file="include/pageHeaderGlup.jsp" %>
		<%@ include file="../../../include/tmplMessaggio.jsp" %>

		<h2>Gestione Ditta</h2>		
		<h3>Dettaglio referente "${referente.id}"</h3>
		
		<form id="gestioneReferente" action="/tolomeobinj/glup/GestioneReferente" method="post">		
		<fieldset>
			<legend>Dati Referente</legend>	
				<div>
					<span class="tmpl_form_etichetta">Ditta :</span>
					<span class="tmpl_form_fixtext">${ditta.descrizione}</span>
				</div>						
				<div>
					<span class="tmpl_form_etichetta">Nome :</span>
					<span class="tmpl_form_fixtext">${referente.nome}</span>
				</div>
				<div>
					<span class="tmpl_form_etichetta">Cognome :</span>
					<span class="tmpl_form_fixtext">${referente.cognome}</span>
				</div>				
		        <div>
		            <span class="tmpl_form_etichetta">N. Ufficio :</span>
		            <span class="tmpl_form_fixtext"><c:out value="${referente.numTel1}" default="- - - - - - - - - -" /></span>		            
		        </div>
		        <div>
		            <span class="tmpl_form_etichetta">N. Cellulare :</span>
		            <span class="tmpl_form_fixtext"><c:out value="${referente.numTel2}" default="- - - - - - - - - -" /></span>		            
		        </div>
		        <div>
		            <span class="tmpl_form_etichetta">N. Fax :</span>
		            <span class="tmpl_form_fixtext"><c:out value="${referente.fax}" default="- - - - - - - - - -" /></span>		            
		        </div>
		        <div>
		            <span class="tmpl_form_etichetta">Email : </span>
		            <c:choose>
			            <c:when test="${empty referente.email}">
			            	<span class="tmpl_form_fixtext">- - - - - - - - - -</span>
			            </c:when>
			            <c:otherwise>
			            	<a href="mailto:${referente.email}"><span class="tmpl_form_fixtext">${referente.email}</span></a>
			            </c:otherwise>
		            </c:choose>		            		            
		        </div>		        		        				        
		</fieldset>								
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idReferente" id="idReferente" value="${referente.id}" />
			<input type="hidden" name="idDitta" id="idDitta" value="${ditta.id}" />						
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />			
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
