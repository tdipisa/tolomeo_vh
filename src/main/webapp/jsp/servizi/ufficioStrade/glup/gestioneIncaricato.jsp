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

		<form id="gestioneIncaricato" action="/tolomeobinj/glup/GestioneIncaricato" method="post">
		<h2>Gestione Incaricati</h2>
		<h3><c:out value="${pageTitle}" default="Inserimento/Modifica incaricato" /> </h3>
		
		<fieldset>
			<legend>Dati Incaricato</legend>				
				<div>
					<label for="nome">Nome *</label>
					<input type="text" id="nome" name="nome" value="${incaricato.nome}" accesskey="" maxlength="50" />
				</div>
				<div>
					<label for="cognome">Cognome *</label>
					<input type="text" id="cognome" name="cognome" value="${incaricato.cognome}" accesskey="" maxlength="50" />
				</div>				
		        <div>
		            <label for="numTel1">N. ufficio</label>
		            <input type="text" id="numTel1" name="numTel1" value="${incaricato.numTel1}" accesskey="" maxlength="20" />		            
		        </div>
		        <div>
		            <label for="numTel2">N. cellulare</label>
		            <input type="text" id="numTel2" name="numTel2" value="${incaricato.numTel2}" accesskey="" maxlength="20" />		            
		        </div>
		        <div>
		            <label for="fax">N. fax</label>
		            <input type="text" id="fax" name="fax" value="${incaricato.fax}" accesskey="" maxlength="20" />		            
		        </div>
		        <div>
		            <label for="fax">Email</label>
		            <input type="text" id="email" name="email" value="${incaricato.email}" accesskey="" maxlength="50" />		            
		        </div>		        		        				        
		</fieldset>								
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idIncaricato" id="idIncaricato" value="${incaricato.id}" />						
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />			
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
