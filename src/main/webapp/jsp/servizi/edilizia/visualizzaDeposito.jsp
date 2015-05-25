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
<%@page import="it.prato.comune.sit.PoligonoDepositiAperto"%>
<% PoligonoDepositiAperto deposito = (PoligonoDepositiAperto)request.getAttribute("deposito"); %>

<%@ include file="../../include/tmplBaseUPPannello.jsp" %>
	
	<script>
		function dimensiona() {
			if (parent.$('sit_over1').style.width == '34%')
				parent.$('sit_over1').style.width='99.5%';
			else
				parent.$('sit_over1').style.width='34%';
		}
	</script>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	
	<fieldset>
		<legend>Deposito a cielo aperto</legend>
		<div>
			<span class="tmpl_form_etichetta">Numero pratica:</span>
			<span class="tmpl_form_fixtext">${deposito.numPratica}</span> 
		</div>
		<div>
			<span class="tmpl_form_etichetta">Note:</span>
			<span class="tmpl_form_fixtext">${deposito.note}</span>
		</div>
	</fieldset>
		
	<div class="tmpl_form_hidden">
		<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
		<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
	</div>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
