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
<%@ include file="include/tmplBaseUP.jsp" %>

<!-- Menu/Content -->	
<div id="tmpl_main">
	<!-- Content -->
	<div id="tmpl_mainwrap">		
		<div id="tmpl_content">
			
		<%@ include file="include/tmplPulsantiera.jsp" %>
		<h1 id="contenuto">${applx.dsProc}</h1>
		
		<%@ include file="include/tmplMessaggio.jsp" %>

		<%-- @ include file="include/tmplTitolo.jsp" --%>
		
		<div id="intro">
			I vari servizi offerti da Tolomeo sfruttano basi cartografiche <br /> 
			e ne permettono l'interazione mediante interfaccia grafica.
		</div>
		
		<!-- Messaggi in homepage: personali, di gruppo, pubblici; da non visualizzare in assenza di messaggi -->
		<c:if test="${!empty gs.messPersonali}">
			<div class="tmpl_avviso" id="tmpl_msgpersonale">	
				<h2>Messaggi personali</h2>
				<ul>
					<c:forEach items="${gs.messPersonali}" var="personalMsg" varStatus="personalMsgStatus">	
						<li><c:out value="${personalMsg.dsLunga}" /></li>
					</c:forEach>
				</ul>
			</div>
		</c:if>
		
		<c:if test="${!empty gs.messGruppo}">
			<div class="tmpl_avviso" id="tmpl_msggruppo">			
				<h2>Messaggi di gruppo</h2>
				<ul>
					<c:forEach items="${gs.messGruppo}" var="groupMsg" varStatus="groupMsgStatus">	
						<li><c:out value="${groupMsg.dsLunga}" /></li>
					</c:forEach>
				</ul>
			</div>
		</c:if>
		
		<c:if test="${!empty gs.messPubblici}">
			<div class="tmpl_avviso" id="tmpl_msgpubblici">		
				<h2>Messaggi pubblici</h2>
				<ul>
					<c:forEach items="${gs.messPubblici}" var="publicMsg" varStatus="publicMsgStatus">	
						<li><c:out value="${publicMsg.dsLunga}" /></li>
					</c:forEach>
				</ul>
			</div>	
		</c:if>
		<!-- Fine Messaggi in homepage -->		

		</div>
	</div>
	<!-- Fine Content -->

	<!-- Menù -->
	<jsp:include page="include/tmplMenu.jsp"></jsp:include>
	<!-- Fine Menù -->
</div>
<!-- Fine Menu/Content -->

<%@ include file="include/tmplBaseDOWN.jsp" %>
