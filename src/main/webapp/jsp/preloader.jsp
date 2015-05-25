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
<%@ page import="java.util.*,it.prato.comune.tolomeo.web.filter.PreloadFilter" %>

<%@ include file="include/tmplBaseUPHead.jsp" %>
</head>

<body onload="document.getElementById('forwardForm').submit();" id="tmpl_popup">

		<div style="padding-top:1em; margin:0; text-align: center;">
			
			<h3>caricamento in corso...</h3>		
			
			<form id="forwardForm" method="post" action="<%= request.getAttribute(PreloadFilter.ATTR_NAME__REFERER)!=null ? request.getAttribute(PreloadFilter.ATTR_NAME__REFERER) : request.getParameter(PreloadFilter.ATTR_NAME__REFERER) %>">		
			
			<fieldset style="border:none;">
				<img alt=" " src="${applx.urlCss}/img/preloader.gif" style="margin-top: 0.5em; margin-bottom: 0.5em;" />
				<div class="tmpl_form_hidden">
				<%
					Enumeration paramNames = request.getParameterNames();
					while(paramNames.hasMoreElements()){
					    String paramName = (String)paramNames.nextElement();
					    String[] values = request.getParameterValues(paramName);
					    for(int i = 0; i < values.length ; i++){
					    	String m = values[i].replaceAll("\"","\\\\\\\"");
					        out.write("<input type=\"hidden\" id=\"" + (paramName + i) + "\" name=\"" + paramName + "\" value=\"\" />\n");
					        out.write("<script>");
					        out.write((paramName + i) + "=\"" + m + "\";\n");
					        out.write("document.getElementById(\"" + (paramName + i)+ "\").value="+(paramName + i)+";");
					        out.write("</script>\n");
					    }
					} 
				%>
					<input type="hidden" name="<%= PreloadFilter.PARAM_NAME__SKIP_PRELOAD %>" value="true" />
				</div>
			</fieldset>
		
			</form>
		</div>
</body>
</html>
