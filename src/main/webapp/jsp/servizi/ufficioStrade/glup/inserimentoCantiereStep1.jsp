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
<%@ page import="java.util.List" %>

<%@ include file="../../../include/tmplBaseUPHeadPannello.jsp" %>
<%@ include file="include/headGlup.jsp" %>
</head>
	
<body id="tmpl_popup">
	<%@ include file="include/pageHeaderGlup.jsp" %>
	<%@ include file="../../../include/tmplMessaggio.jsp" %>

	<h2>Gestione Cantiere</h2>
	<h3>Inserimento - STEP 1</h3>
	<form action="/tolomeobinj/glup/GestioneCantiere" method="post">		
		<fieldset>
			<legend>Scegli il progetto</legend>
			<div class="tmpl_form_nofloat">
				<label for="codiceRicerca">Codice</label>
	            <input type="text" id="codiceRicerca" name="codice" value="" accesskey="" maxlength="5" /> 	            
	            
	            <input type="hidden" name="operazione" value="I" />
	            <input type="hidden" name="tipoOperazione" value="" />
	            <input type="hidden" name="step" value="2" />
	            <input type="hidden" name="codTPN" value="${param.codTPN}" />
				<input type="hidden" name="IDTPN" value="${param.IDTPN}" />
				<input type="hidden" name="geoCoord" value='${param.geoCoord}' />
				<input type="hidden" name="geoOp" value="${param.geoOp}" />
	        </div>	
	        <div>		
	        	<span class="tmpl_form_nota">E' possibile digitare "nnn" per un codice "Pnnn"</span>
	        </div>	        	       
		</fieldset>	
		<%@ include file="../../../include/tmplBottoni.jsp" %>
		<%-- 
		<div class="tmpl_bottoni">
			<label><input class="next" name="I" value="Successivo" title="cerca" type="submit"/></label>
			<label><input class="next" name="I" value="Successivo" title="cerca" type="submit" onclick="this.form"/></label>			        
	    </div>
	    --%>	
	</form>
	<%-- 
	<form action="/tolomeobinj/glup/GestioneProgetto" method="post">		
		<fieldset>
			<legend>Nuovo</legend>
			<div class="tmpl_form_nofloat">
				<label for="codiceRicerca">Codice</label>
	            <input type="text" id="codiceRicerca" name="codice" value="" accesskey="" maxlength="5" />
	            <div class="tmpl_bottoni" style="margin-top: 2em;"> 
	            	<label><input class="inserisci" name="I" value=" crea" title="Crea nuovo progetto" type="submit" /></label>
	            </div>
	            <input type="hidden" name="operazione" value="I" />
	        </div>
		</fieldset>		
	</form>
	--%>	

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
