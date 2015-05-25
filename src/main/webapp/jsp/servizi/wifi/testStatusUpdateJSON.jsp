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
<%
	String withDescr = request.getParameter("description");

	response.setContentType("application/x-json; charset=UTF-8");
	StringBuilder sb = new StringBuilder();
	
	sb.append("[");	
	if (withDescr != null && withDescr.equals("1")) { 	    
	    sb.append("{id:1,status:1,description:\"Cascine di Tavoletta\"},");
	    sb.append("{id:2,status:1,description:\"Parco di Galceti, Villa Fiorelli\"},");
	    sb.append("{id:3,status:1,description:\"Parco di Galceti Hs1\"},");
	    sb.append("{id:4,status:0,description:\"Parco di Galceti Hs2\"},");
	    sb.append("{id:8,status:1,description:\"Piazza della Carceri\"},");
	    sb.append("{id:7,status:1,description:\"Stazione del Serraglio\"},");
	    sb.append("{id:9,status:0,description:\"Piazza Mercatale HS1\"},");
	    sb.append("{id:10,status:1,description:\"Piazza Mercatale HS2\"},");
	    sb.append("{id:11,status:1,description:\"Piazza Mercatale HS3\"},");
	    sb.append("{id:12,status:1,description:\"Piazza San Domenico\"},");
	    sb.append("{id:13,status:1,description:\"Piazza S.Agostino\"},");
	    sb.append("{id:14,status:0,description:\"Piazza del Duomo HS1\"},");
	    sb.append("{id:15,status:1,description:\"Piazza del Duomo HS2\"},");
	    sb.append("{id:16,status:1,description:\"Piazza San Marco\"}");
	} else {
	    sb.append("{id:1,status:1},");
	    sb.append("{id:2,status:1},");
	    sb.append("{id:3,status:1},");
	    sb.append("{id:4,status:0},");
	    sb.append("{id:8,status:1},");
	    sb.append("{id:7,status:1},");
	    sb.append("{id:9,status:0},");
	    sb.append("{id:10,status:1},");
	    sb.append("{id:11,status:1},");
	    sb.append("{id:12,status:1},");
	    sb.append("{id:13,status:1},");
	    sb.append("{id:14,status:0},");
	    sb.append("{id:15,status:1},");
	    sb.append("{id:16,status:1}");	    
	}		
	sb.append("]");
    out.print(sb.toString());
	out.flush();
%>
