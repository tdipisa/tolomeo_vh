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
<%@page import="it.prato.comune.sit.beans.telefoniaMobile.*"%>
<%@page import="it.prato.comune.sit.PuntoTelefoniaMobile"%>
<%@page import="java.util.*"%>
<%@page import="it.prato.comune.utilita.core.type.DateType"%>
<% 
List<GestoreBean> gestoriChecked = (ArrayList<GestoreBean>)request.getAttribute("gestoriChecked");
List<GestoreBean> gestoriNotChecked = (ArrayList<GestoreBean>)request.getAttribute("gestoriNotChecked");
PuntoTelefoniaMobile impianto = (PuntoTelefoniaMobile)request.getAttribute("impianto");
PoligonoViaToponomastica via = (PoligonoViaToponomastica)request.getAttribute("via");
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>

	<%@page import="it.prato.comune.sit.toponomastica.PoligonoViaToponomastica"%>
<script type="text/JavaScript">
		function init() {
			mapOperation();
			document.getElementById("codiceImpianto").focus();
		}
	</script>

</head>

<body onload="init();" id="tmpl_popup">	

		<%@ include file="../../include/tmplMessaggio.jsp" %>

		<form action="/tolomeobinj/telefoniaMobile/GestioneImpiantoServlet" method="post">
		
		<fieldset>
			<legend>Stazione radio base</legend>
				<div class="tmpl_form_nofloat">
					<label for="codiceImpianto">Codice *</label>
		            <input type="text" id="codiceImpianto" name="codiceImpianto" value="${impianto.codImpianto}" accesskey="" maxlength="20" />
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="dataInstallazione">Data installazione</label>
		            <input type="text" id="dataInstallazione" name="dataInstallazione" value="<%= (impianto!=null && impianto.getDataInstallazione()!=null) ? impianto.getDataInstallazione().getFormatted() : "" %>" accesskey="" />
		            <span class="tmpl_form_nota">gg/mm/aaaa</span>
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="rilevatore">Rilevatore *</label>
		            <input type="text" id="rilevatore" name="rilevatore" value="${impianto.rilevatore}" accesskey="" />
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="indirizzo">Indirizzo</label>
		            <input type="text" readonly="readonly" id="indirizzo" name="indirizzo" value="${via.nome}" accesskey="" />
		        </div>
		        <div class="tmpl_form_nofloat">
		            <label for="numAutorizzazione">Numero autorizzazione</label>
		            <input type="text" id="numAutorizzazione" name="numAutorizzazione" value="${impianto.numAutorizzazione}" accesskey="" maxlength="32" />
		        </div>
				<div class="tmpl_form_nofloat">
		            <label for="tipoAutorizzazione">Tipo autorizzazione</label>
		            <select id="tipoAutorizzazione" name="tipoAutorizzazione">
		            	<option value="${impianto.tipoAutorizzazione}">${impianto.tipoAutorizzazione}</option>
		            	<option value="Autorizzazione compatibile">Autorizzazione compatibile</option>
		            	<option value="Autorizzazione da rilocare">Autorizzazione da rilocare</option>
		            	<option value="Disponibile">Disponibile</option>
		            </select>
		        </div>
		        <div>
		            <label for="descLocalizzazione">Descrizione localizzazione</label>
		            <textarea id="descLocalizzazione" name="descLocalizzazione" rows="4" cols="50">${impianto.descLocalizzazione}</textarea>
		            <span class="tmpl_form_nota">testo massimo 500 caratteri</span>
		        </div>
		        <div class="tmpl_form_nofloat">
		        	<label for="suolo">Suolo</label>
		            <select id="suolo" name="suolo">
		            	<option value="${impianto.suolo}">${impianto.suolo}</option>
		            	<option value="Pubblico">Pubblico</option>
		            	<option value="Privato">Privato</option>
		            </select>
		        </div>
		        <div>
		            <label for="note">Note</label>
		            <textarea id="note" name="note" rows="8" cols="50">${impianto.note}</textarea>
		            <span class="tmpl_form_nota">testo massimo 1000 caratteri</span>
		        </div>
		        
		        <span>Gestori</span>
	        	<c:if test="${gestoriChecked != null}" >
					<c:forEach items="${gestoriChecked}" var="gestoreChecked" varStatus="gestoreCheckedStatus"> 
						<div class="tmpl_form_nofloat">
				            <input type="checkbox" checked="checked" name="gestore" value="${gestoreChecked.id}" id="gest${gestoreChecked.id}" title="${gestoreChecked.descrizione}" accesskey="" />
				            <label for="gest${gestoreChecked.id}">${gestoreChecked.descrizione}</label>
			        	</div>
					</c:forEach>
				</c:if>
				<c:if test="${gestoriNotChecked != null}" >
					<c:forEach items="${gestoriNotChecked}" var="gestoreNotChecked" varStatus="gestoreNotCheckedStatus"> 
						<div class="tmpl_form_nofloat">
				            <input type="checkbox" name="gestore" value="${gestoreNotChecked.id}" id="gest${gestoreNotChecked.id}" title="${gestoreNotChecked.descrizione}" accesskey="" />
				            <label for="gest${gestoreNotChecked.id}">${gestoreNotChecked.descrizione}</label>
			        	</div>
					</c:forEach>
				</c:if>
		</fieldset>
		
		<div class="tmpl_form_hidden">
			<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
			<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
			<input type="hidden" name="geoCoord" value='<%= request.getParameter("geoCoord") %>'/>
			<input type="hidden" name="geoOp" value="<%= request.getParameter("geoOp") %>"/>
			<input type="hidden" name="viaIDTPN" value="${via.IDTPN}"/>
		</div>
		
		<%@ include file="../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>