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
<%@ page import="it.prato.comune.tolomeo.servizi.shared.beans.*" %>
<%
String IDTPN = (String) request.getParameter("IDTPN");
StringBuffer sez = new StringBuffer();
for (int i=0; i<4-IDTPN.length(); i++) { sez.insert(0,"0"); }
sez.append(IDTPN);
sez.toString();
%>

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>

<style type="text/css">
	body {
		background: none;
		margin: 2%;
	}
	#tabsC {
		float: left;
		width: 100%;
		background: #EDF7E7;
		font-size: 93%;
		line-height: normal;
	}
	#tabsC ul {
		margin: 0;
		list-style: none;
	}
	#tabsC li {
		display: inline;
		margin: 0;
		padding: 0;
	}
	#tabsC a {
		float: left;
		background: url("/tolomeohtdocs/img/servizi/elettorale/tableft.gif") no-repeat left top;
		margin: 0;
		padding: 0 0 0 4px;
		text-decoration: none;
	}
	#tabsC a span {
		float: left;
		display: block;
		background: url("/tolomeohtdocs/img/servizi/elettorale/tabright.gif") no-repeat right top;
		padding: 5px 15px 4px 6px;
		color: #464E42;
	}
	/* Commented Backslash Hack hides rule from IE5-Mac \*/
	#tabsC a span {
		float: none;
	}
</style>

<%--<body id="tmpl_popup" onload="location.href='http://elezioni2009.po-net.prato.it/2009/comunali/prato/risultati/htm/100005<%=sez%>.htm'">--%>
<body>
	<div id="tabsC">
		<ul>
			<li onclick="document.getElementById('tabPage').src='http://elezioni2009.po-net.prato.it/2009/ballottaggio/prato/risultati/htm/100005<%=sez%>.htm'">
				<a href="#"><span>Secondo turno</span></a>
			</li>
			<li onclick="document.getElementById('tabPage').src='http://elezioni2009.po-net.prato.it/2009/comunali/prato/risultati/htm/100005<%=sez%>.htm'">
				<a href="#"><span>Primo turno</span></a>
			</li>
		</ul>
		<iframe style="width: 100%; height: 700px;" src="http://elezioni2009.po-net.prato.it/2009/ballottaggio/prato/risultati/htm/100005<%=sez%>.htm" id="tabPage"></iframe>
	</div>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
