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

<%@ include file="../../include/tmplBaseUPHeadPannello.jsp" %>
	
<style type="text/css">
table.resoconto {
	border: none; 
	background: transparent; 
	width: 100%;
}

table.resoconto td{
	border: none; 
	background: transparent; 	
}

table.resoconto tr.totale td{
	border-top: solid 2px black; 
}
</style>
</head>

<body id="tmpl_popup">			
		
		<%@ include file="../../include/tmplMessaggio.jsp" %>		

		<h2>Fabbricati Censimento</h2>
		<h3>Fabbricati da elaborare = ${totaleFabbricati - totaleFabbricatiAssociatiInAuto}</h3>			
										
		<table class="resoconto" >
			<tr>
				<td width="180px;"><span class="tmpl_form_etichetta">Fabbricati assegnati</span></td>
				<td>&nbsp;</td>
				<td width="40px" style="text-align: right;"><span class="tmpl_form_fixtext" style="text-align: right;">${totaleFabbricatiElaboratiAssegnati}</span></td>
			</tr>								
			<tr>
				<td><span class="tmpl_form_etichetta">Fabbricati non assegnati</span></td>
				<td>&nbsp;</td>
				<td style="text-align: right;"><span class="tmpl_form_fixtext">${totaleFabbricatiElaboratiNonAssegnati}</span></td>			
			</tr>
			<tr class="totale">
				<td><span class="tmpl_form_etichetta">Fabbricati elaborati</span></td>
				<td>&nbsp;</td>
				<td style="text-align: right;"><span class="tmpl_form_fixtext">${totaleFabbricatiElaborati}</span></td>				
			</tr>
		</table>					        			           		        		        			

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
