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
<%@page import="it.prato.comune.sit.plugin.comunePO.pianoPubblicita.PuntoUbicazione"%>
<%@page import="java.util.List"%>
<%@page import="it.prato.comune.sit.plugin.comunePO.beans.pianoPubblicita.UbicazioneBean"%>
<%
	PuntoUbicazione ubicazione    = (PuntoUbicazione)request.getAttribute("ubicazione");
	UbicazioneBean ubicazioneInfo = (UbicazioneBean)request.getAttribute("ubicazioneInfo");
	
%>
<%@ include file="../../include/tmplBaseUPPannello.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<form>
	<fieldset>
		<legend>Impianto</legend>
		<div>
			<span class="tmpl_form_etichetta">Pratica/Zona:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.pratNum1} ${ubicazioneInfo.pratNum2} ${ubicazioneInfo.pratNum3}</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Codice:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.codClasse} ${ubicazioneInfo.codOggetto}</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Classe:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.descClasse}</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Oggetto:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.descOggetto}</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">N. esemplari :</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.numeroEsemplari}</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">N. facce:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.numeroFacce}</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Spessore:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.spessore} m</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Superficie:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.superficie} m<sup>2</sup></span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Base:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.base} m</span>
		</div>
		<div>
			<span class="tmpl_form_etichetta">Altezza:</span>
			<span class="tmpl_form_fixtext">${ubicazioneInfo.altezza} m</span>
		</div>
	</fieldset>
	</form>
	
	<div>
		<a href="http://ied.comune.prato.it/iedbinj/servlet/RicercaPratiche?tipoRicerca=L&classeTerritoriale=${ubicazioneInfo.codClasse}&oggettoTerritoriale=${ubicazioneInfo.codOggetto}" onclick="window.open('http://ied.comune.prato.it/iedbinj/servlet/RicercaPratiche?tipoRicerca=L&classeTerritoriale=${ubicazioneInfo.codClasse}&oggettoTerritoriale=${ubicazioneInfo.codOggetto}','_blank'); return false;">Visualizza dati autorizzazione</a>
	</div>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
