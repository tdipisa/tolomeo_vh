<%--
Tolomeo is a developing framework for visualization, editing,  
geoprocessing and decisional support application based on    cartography.

Tolomeo Copyright 2011 Comune di Prato;

This file is part of Tolomeo.

Tolomeo is free software; you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.

Tolomeo is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with Tolomeo; if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA

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
modificarlo sotto i termini della GNU Lesser General Public License come pubblicato  dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 
Tolomeo è distribuito nella speranza che possa essere utile,
ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.

Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
  

Informazioni Sviluppatori:

Tolomeo è sviluppato dal Comune di Prato

Alessandro Radaelli
Federico Nieri
Mattia Gennari

sit@comune.prato.it
--%>

<%@page import="it.prato.comune.sit.plugin.comunePO.poliziaMunicipale.PuntoSinistro"%>
<%
	PuntoSinistro sinistro = (PuntoSinistro) request.getAttribute("sinistro");
    Integer anno           = (Integer) request.getAttribute("anno");
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>

	
	<script type="text/JavaScript">
		function init() {
			mapOperation();
			document.getElementById("numeroSinistro").focus();
		}
	</script>

</head>

<body onload="init();" id="tmpl_popup">
			
	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="/tolomeobinj/poliziaMunicipale/GestioneSinistroServlet" method="post">

	<fieldset class="tmpl_form_float">
		<legend>Sinistro</legend>
			<div>
	            <span class="tmpl_form_etichetta" style="float: left; line-height: 23px; padding-right: 2%; text-align: left; width: 20%;">Anno </span>
				<span class="tmpl_form_fixtext">${anno}</span>
				<br style="clear: both" />
	            <span class="tmpl_form_nota">per cambiare anno selezionare il layer corretto dal menù in alto e ripetere l'operazione di inserimento o modifica...</span>
	        </div>
	      	<div>
	            <label for="numeroSinistro">Numero </label>
	            <c:choose>
	            	<c:when test="${sinistro.szNSinistro == null}">
						<input type="text" name="numeroSinistro" value="" id="numeroSinistro" title="Numero sinistro stradale" size="12" maxlength="8" accesskey="" />
					</c:when>
					<c:otherwise>
						<input type="text" name="numeroSinistro" value="${sinistro.szNSinistro}" id="numeroSinistro" title="Numero sinistro stradale" size="12" maxlength="8" accesskey="" />
					</c:otherwise>
				</c:choose>
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