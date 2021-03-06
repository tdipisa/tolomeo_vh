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
<%@page import="it.prato.comune.sit.PoligonoDepositiAperto"%>
<%
	String geoCoord = (String)request.getAttribute("geoCoord");
	PoligonoDepositiAperto deposito = (PoligonoDepositiAperto)request.getAttribute("deposito");
	//String action = (String)request.getAttribute("action");
	//action = (action==null) ? "/tolomeobinj/edilizia/GestioneDepositoServlet" : action;
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>

<script type="text/JavaScript">
	function init() {
		mapOperation();
		document.getElementById("numPratica").focus();
	}
</script>

</head>

<body onload="init();" id="tmpl_popup">	

	<%@ include file="../../include/tmplMessaggio.jsp" %>

	<form action="/tolomeobinj/edilizia/GestioneDepositoServlet" method="post">
	
	<fieldset>
		<legend>Deposito a cielo aperto</legend>
			<div class="tmpl_form_nofloat">
				<label for="numPratica">Numero pratica *</label>
	            <input type="text" id="numPratica" name="numPratica" value="${deposito.numPratica}" accesskey="" maxlength="25" />
	        </div>
	        <div>
	            <label for="note">Note</label>
	            <textarea id="note" name="note" rows="8" cols="50">${deposito.note}</textarea>
	            <span class="tmpl_form_nota">testo massimo 4000 caratteri</span>
	        </div>
	</fieldset>
	
	<div class="tmpl_form_hidden">
		<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
		<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
		<input type="hidden" name="geoCoord" value='<%= request.getParameter("geoCoord") %>'/>
		<input type="hidden" name="geoOp" value="<%= request.getParameter("geoOp") %>"/>
	</div>
	
	<%@ include file="../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
