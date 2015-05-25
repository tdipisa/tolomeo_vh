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
<!-- Intestazione/header -->
	<div id="tmpl_header">
		<div id="tmpl_headerwrap">
			<div id="tmpl_procedura">
				<span id="tmpl_procedura_jmpmn"><a href="#tmpl_menu" title="salta al menù della procedura" accesskey="8">Salta al menù</a></span>
				<span id="tmpl_procedura_jmpcntnt"><a href="#content" title="salta al contenuto della procedura" accesskey="0">Salta al contenuto</a></span>
				<span id="tmpl_procedura_titolo">InfoWay</span>
				<span id="tmpl_procedura_sottotitolo">InfoWay</span>
			</div>
		</div>	
		
		<div id="tmpl_utenza">
			<span id="tmpl_utenza_nome">Nome Utente (ID Utente)</span>
			<span id="tmpl_utenza_data">
				<%--  <fmt:formatDate value="<%= new java.util.Date() %>" type="date" dateStyle="full" pattern="EEE dd MMMM yyyy HH:mm:ss" var="dataOra" /><c:out value="${dataOra}" />
			--%>
			</span>
		</div>
	</div>
<!-- Fine Intestazione/header -->

<!-- Logout/Percorso -->
<div id="tmpl_barra">
	<div id="tmpl_barrawrap"> 
		<div id="tmpl_percorso">
			<ol title="Percorso di navigazione dalla home page">
				<%-- <li><a href="<c:out value="${applx.urlHome}" />">home</a></li>
				 <li><c:out value="${menu.currentBarraNav}" /><li> 
				--%>
			</ol>
		</div>
	</div>
	<div id="tmpl_logout"><a href="">logout</a></div>
</div>
<!-- Fine Logout/Percorso -->
