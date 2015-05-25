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
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo � un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo � un software libero; � possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo � distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo � sviluppato dal Comune di Prato
 
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

		<form id="gestioneReferente" action="/tolomeobinj/glup/GestioneReferente" method="post">
		<h2>Gestione Ditta</h2>
		<h3><c:out value="${pageTitle}" default="Inserimento/Modifica Referente" /> </h3>
		<fieldset>
			<legend>Dati Referente</legend>
				<div>
					<span class="tmpl_form_etichetta">Ditta :</span>
					<span class="tmpl_form_fixtext">${ditta.descrizione}</span>
				</div>
				<div>
					<label for="nome">Nome *</label>
					<input type="text" id="nome" name="nome" value="${referente.nome}" accesskey="" maxlength="50" tabindex="0" />
				</div>
				<div>
					<label for="cognome">Cognome *</label>
					<input type="text" id="cognome" name="cognome" value="${referente.cognome}" accesskey="" maxlength="50" />
				</div>				
		        <div>
		            <label for="numTel1">N. Ufficio</label>
		            <input type="text" id="numTel1" name="numTel1" value="${referente.numTel1}" accesskey="" maxlength="20" />		            
		        </div>
		        <div>
		            <label for="numTel2">N. Cellulare</label>
		            <input type="text" id="numTel2" name="numTel2" value="${referente.numTel2}" accesskey="" maxlength="20" />		            
		        </div>
		        <div>
		            <label for="fax">N. Fax</label>
		            <input type="text" id="fax" name="fax" value="${referente.fax}" accesskey="" maxlength="20" />		            
		        </div>
		        <div>
		            <label for="fax">Email</label>
		            <input type="text" id="email" name="email" value="${referente.email}" accesskey="" maxlength="50" />		            
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
