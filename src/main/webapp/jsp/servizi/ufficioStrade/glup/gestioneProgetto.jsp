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
<%@page import="it.prato.comune.utilita.core.type.DateType"%>

<%@ include file="../../../include/tmplBaseUPHeadPannello.jsp" %>
<%@ include file="include/headGlup.jsp" %>
</head>

<body id="tmpl_popup">	
		<%@ include file="include/pageHeaderGlup.jsp" %>
		<%@ include file="../../../include/tmplMessaggio.jsp" %>

		<h2>Gestione Progetto</h2>		
		<h3><c:out value="${pageTitle}" default="Inserimento/Modifica anagrafica progetto \"${progetto.codice}\" " /></h3>
		
		<form action="/tolomeobinj/glup/GestioneProgetto" method="post">
		
		<fieldset>
			<legend>Dati Progetto</legend>	
				<div>
					<span class="tmpl_form_etichetta">Codice:</span>
					<span class="tmpl_form_fixtext">${progetto.codice}</span>
				</div>
				<%--
				<div class="tmpl_form_nofloat">
					<label for="codice">Codice</label>
		            <input type="text" id="codice" name="codice" value="${progetto.codice}" accesskey="" maxlength="5" />
		        </div>
		        --%>
		        <div>
		            <label for="anno">Anno di riferimento</label>
		            <input type="text" id="anno" name="anno" value="${progetto.anno}" size="5" accesskey="" maxlength="4" />
		        </div>
		        <div>
					<label for="descrizione">Descrizione</label>
		            <input type="text" id="descrizione" name="descrizione" value="${progetto.descrizione}" size="50" accesskey="" maxlength="50" />
		        </div>
		        <div>
		            <label for="idTipoApprovazione">Tipo approvazione *</label>						
					<select id="idTipoApprovazione" name="idTipoApprovazione">
						<option value="">- scegli -</option>						
						<c:forEach items="${tipiApprovazione}" var="tipoApprovazione" varStatus="status">
							<option value="${tipoApprovazione.id}" ${tipoApprovazione.id == progetto.idTipoApprovazione ? "selected=\"selected\"" : ""} >${tipoApprovazione.descrizione}</option>
						</c:forEach>														
					</select>																		
				</div>
				<div>
		            <label for="anno">Numero approvazione *</label>
		            <input type="text" id="numeroApprovazione" name="numeroApprovazione" value="${progetto.numeroApprovazione}" accesskey="" maxlength="9" />
		        </div>
		        <div>
		            <label for="dtApprovazione">Data approvazione *</label>
		            <input type="text" id="dtApprovazione" name="dtApprovazione" value="${progetto.dtApprovazione.formatted}" accesskey="" maxlength="10"/>
		            <span class="tmpl_form_nota">gg/mm/aaaa</span>
		        </div>
		        <div>
		            <label for="idDirLav">Direttore Lavori *</label>						
					<select id="idDirLav" name="idDirLav">
						<option value="">- scegli -</option>
						<c:forEach items="${incaricati}" var="incaricato" varStatus="status">
							<option value="${incaricato.id}" ${incaricato.id == progetto.idDirLav ? "selected=\"selected\"" : ""}>${incaricato.cognome} ${incaricato.nome}</option>
						</c:forEach>
					</select>																		
				</div>
		        <div>
		            <label for="idRup">R. U . P . *</label>						
					<select id="idRup" name="idRup">
						<option value="">- scegli -</option>						
						<c:forEach items="${incaricati}" var="incaricato" varStatus="status">
							<option value="${incaricato.id}" ${incaricato.id == progetto.idRUP ? "selected=\"selected\"" : ""}>${incaricato.cognome} ${incaricato.nome}</option>
						</c:forEach>											
					</select>																		
				</div>
				
		        <div>
		            <label for="note">Note</label>
		            <textarea id="note" name="note" rows="8" cols="50" >${progetto.note}</textarea>
		            <span class="tmpl_form_nota">testo massimo 500 caratteri</span>
		        </div>			
		        	
		</fieldset>								
		<div class="tmpl_form_hidden">
			<input type="hidden" name="idProgetto" id="idProgetto" value="${progetto.id}" />	
			<input type="hidden" name="codice" id="codice" value="${progetto.codice}" />		
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />
			<input type="hidden" name="tipoOperazione" id="tipoOperazione" value="" />
			<input type="hidden" name="codTPN" value="<%= request.getParameter("codTPN") %>"/>
			<input type="hidden" name="IDTPN" value="<%= request.getParameter("IDTPN") %>"/>
			<input type="hidden" name="geoCoord" value='<%= request.getParameter("geoCoord") %>'/>
			<input type="hidden" name="geoOp" value="<%= request.getParameter("geoOp") %>"/>
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
