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
<%@page import="java.util.Collections"%>
<%@page import="java.util.ArrayList"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoPubblicita.PuntoUbicazione"%>
<%@page import="java.util.List"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.beans.pianoPubblicita.UbicazioneBean"%>
<%
	PuntoUbicazione ubicazione = (PuntoUbicazione)request.getAttribute("ubicazione"); 
	List<UbicazioneBean> zone  = (List<UbicazioneBean>)request.getAttribute("zone");
	//Collections.sort(zone);
	List<UbicazioneBean> classi  = (List<UbicazioneBean>)request.getAttribute("classi");
	List<UbicazioneBean> oggetti  = (List<UbicazioneBean>)request.getAttribute("oggetti");
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>
 
 	<script src="/js/ext/jquery-ui/js/jquery.js" type="text/JavaScript"></script>
 	<script src="/js/ext/jquery-ui/js/jquery.chainedSelects.js" type="text/JavaScript"></script>
 	
	<script type="text/JavaScript">
		$(function(){
			$('#zona').chainSelect('#classe','/tolomeobinj/pianoPubblicita/ZonaClasseOggettoServlet',
			{ 
				before:function (target) //before request hide the target combobox and display the loading message
				{ 					
					$(target).html(""); //clear old options
					$('#oggetto').html("");
					$('#classeLoading').css("display","inline");
					$('#oggettoLoading').css("display","inline");
					this.timeout = setTimeout("alert('Problemi durante il caricamento dati delle classi!');",5000);
				},
				after:function (target) //after request show the target combobox and hide the loading message
				{ 					
					clearTimeout(this.timeout);				
					$('#classeLoading').css("display","none");
				}
			});
			$('#classe').chainSelect('#oggetto','/tolomeobinj/pianoPubblicita/ZonaClasseOggettoServlet',
			{ 
				before:function (target) 
				{ 
					this.parameters.zona = $('#zona').val();
					$(target).html("");
					$('#oggettoLoading').css("display","inline");
					this.timeout = setTimeout("alert('Problemi durante il caricamento dati degli oggetti!');",5000);
				},
				after:function (target) 
				{ 
					clearTimeout(this.timeout);					
					$('#oggettoLoading').css("display","none");
				}
			});
		});
		
		function init() {
			mapOperation();
			document.getElementById("zona").focus();
		}	

	</script>

</head>

<body onload="init();" id="tmpl_popup">
			
	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form action="/tolomeobinj/pianoPubblicita/GestioneUbicazioneServlet" method="post">
	
	<!-- 
	
<label for="sel1">Bundesland</label><input type="text" id="sel1" size="40"/><br />
<label for="sel2">Stadt</label><input type="text" id="sel2" size="40"/><br />
<label for="sel3">Schule</label><input type="text" id="sel3" size="40"/><br />
	
	
	-->

	<fieldset>
		<legend>Impianto</legend>
<!-- 			
		<label for="zona">Zona</label><input type="text" id="zona" name="zona" size="40"/><br />
		<label for="classe">Classe</label><input type="text" id="classe" name="classe" size="40"/><br />
		<label for="oggetto">Oggetto</label><input type="text" id="oggetto" name="oggetto" size="40"/><br />
-->	
		
	
			<div class="tmpl_form_nofloat">
				<label for="zona">Zona: *</label>
				<select id="zona" name="zona" --onchange="location=this.options[this.selectedIndex].value;"-- >
					<option value="-1">Scegli...</option>
					<c:forEach items="${zone}" var="zona" varStatus="zonaStatus">														
						<option value="${zona.id}">${zona.pratNum1} ${zona.pratNum2} ${zona.pratNum3}</option>
					</c:forEach>
	            </select>
	        </div>
	        <div class="tmpl_form_nofloat">
				<label for="classe">Classe: *</label>				
				<select id="classe" name="classe">
					<option value="-1">Scegli...</option>
					<c:forEach items="${classi}" var="classe" varStatus="classeStatus">														
						<option value="${classe.id}">${classe.descrizione}</option>
					</c:forEach>
	            </select>
	            <span id="classeLoading" style="color: red; display:none;">loading...</span>
	        </div>
	        <div class="tmpl_form_nofloat">
				<label for="oggetto">Oggetto: *</label>				
				<select id="oggetto" name="oggetto">
					<option value="-1">Scegli...</option>
					<c:forEach items="${oggetti}" var="oggetto" varStatus="oggettoStatus">														
						<option value="${oggetti.id}">${oggetto.descrizione}</option>
					</c:forEach>
	            </select>
	            <span id="oggettoLoading" style="color: red; display:none;">loading...</span>
	        </div>
	        	        
	</fieldset>
	
	<div class="tmpl_form_hidden">
		<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
		<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
		<input type="hidden" name="geoCoord" value='<%= request.getParameter("geoCoord") %>'/>
		<input type="hidden" name="geoOp" value="<%= request.getParameter("geoOp") %>"/>
		<input type="hidden" name="tipoOperazione" id="tipoOperazione" value="${tipoOperazione}" />	
		<input type="hidden" name="step" id="step" value="" />
	</div>
	
	<%@ include file="../../include/tmplBottoni.jsp" %>
	
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
