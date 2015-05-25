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
<%@ include file="../../include/tmplBaseUPPannello.jsp" %>
<%@ include file="include/pageHeader.jsp" %>

	<%@ include file="../../include/tmplMessaggio.jsp" %>
	
	<h2>Livello 3</h2>
	<div style="font-style: italic">La neve attacca anche in città</div>
	
	<h3>Fasi di intervento</h3>

	<ul>
		<li>
			<a href="/tolomeobinj/procivPianoNeve/ElencoItinerariFaseServlet?idFase=A" title="Visualizza itinerari per la fase A" style="font-weight: bold">Fase A</a>
			<div style="font-style: italic; padding-bottom: 1em;">Spalatura viabilità principale individuazione e assegnazione.</div>
		</li>
		<li>
			<a href="/tolomeobinj/procivPianoNeve/ElencoItinerariFaseServlet?idFase=AB" title="Visualizza itinerari per la fase A-B" style="font-weight: bold">Fase A-B</a>
			<div style="font-style: italic; padding-bottom: 1em;">Fase intermedia tra la A e la B.</div>
		</li>
		<li>
			<a href="/tolomeobinj/procivPianoNeve/ElencoItinerariFaseServlet?idFase=B" title="Visualizza itinerari per la fase B" style="font-weight: bold">Fase B</a>
			<div style="font-style: italic; padding-bottom: 1em;">Spalatura strade  principali di quartiere.</div>
		</li>
		<li>
			<a href="/tolomeobinj/procivPianoNeve/ElencoItinerariFaseServlet?idFase=C" title="Visualizza le zone per la fase c" style="font-weight: bold">Fase C</a>
			<div style="font-style: italic; padding-bottom: 1em;">Spalatura strade secondarie.</div>
		</li>
		<li>
			<a href="/tolomeobinj/procivPianoNeve/ElencoItinerariFaseServlet?idFase=D" title="Visualizza i punti sensibili per la fase A" style="font-weight: bold">Fase D</a>
			<div style="font-style: italic; padding-bottom: 1em;">Spalatura punti sensibili.</div>
		</li>
	</ul>
	
	<div class="tmpl_stampa_doc">
		<input id="stampaPdf" name="P" value="Scarica PDF" title="Scarica tutti i PDF" accesskey="P" type="button" onclick="parent.location.href='/html/servizi/procivPianoNeve/PDF_A3.zip'" />
	</div>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>