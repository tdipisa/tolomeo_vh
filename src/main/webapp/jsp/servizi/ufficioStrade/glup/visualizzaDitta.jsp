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
		
		<h2>Gestione Ditte</h2>		
		<h3>Dettaglio ditta "${ditta.id}"</h3>

		<form id="formDitta" action="/tolomeobinj/glup/GestioneDitta" method="post">
		
		<fieldset class="tmpl_form_float">
			<legend>Dati Ditta</legend>
				<div>
					<span class="tmpl_form_etichetta">Identificativo ditta:</span>
					<span class="tmpl_form_fixtext">${ditta.id}</span>										
				</div>
				<div>
					<span class="tmpl_form_etichetta">Ragione sociale:</span>
					<span class="tmpl_form_fixtext">${ditta.descrizione}</span>										
				</div>		
				<div>
					<span class="tmpl_form_etichetta">Indirizzo:</span>
					<span class="tmpl_form_fixtext">
						<c:out value="${ditta.indirizzoCompleto}" default="- nessuno -" /><br />						
					</span>										
				</div>			 										        
		</fieldset>		
		<c:choose>									
			<c:when test="${!empty ditta.referenti}">
				<h3>Lista referenti</h3>
				<ul>
				<c:forEach items="${ditta.referenti}" var="referente" varStatus="status">
					<li>				
						<a href="/tolomeobinj/glup/GestioneReferente?operazione=V&idReferente=${referente.id}"><span class="tmpl_form_fixtext">${referente.cognome} ${referente.nome}</span></a>	
					</li>
				</c:forEach>
				</ul>
			</c:when>
			<c:otherwise>
				<h3>Nessun referente per questa ditta</h3>
			</c:otherwise>
		</c:choose>
		
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idDitta" id="idDitta" value="${ditta.id}" />						
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
