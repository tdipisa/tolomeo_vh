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
		div.tmpl_bottoni input.visualizza {
		    background-image: url("/tolomeohtdocs/img/cartina.gif");
		}
	</style>
	<script type="text/javascript">
	   var disableAll = false;
	   var selected;
	   
	   function highlightGeom(){
			if(disableAll) return;
			api.addHighlighted(this.geom); 
			this.className = "relToHighlightGeom";
		}
		
		function deHighlightGeom(){
			if(disableAll) return;
			api.clearHighLigthed(false); 
			this.className="";
		}
		
		function selectGeom(){
			if(disableAll) return;
			var foglio = document.getElementById('foglio'); 
			var particella = document.getElementById('particella'); 
			foglio.value = this.foglio;
			particella.value = this.particella;
			foglio.readOnly = true;
			particella.readOnly = true;
			 
			selected = this;
			disableAll = true;
		}
		
		function clearAll(){
			disableAll = false;
			if(selected){
				deHighlightGeom.apply(selected);
				selected = null;
			}			
			document.getElementById('foglio').readOnly = false;
			document.getElementById('particella').readOnly = false;
			return true;
		}
		
		function checkSubmission(){
			if(!document.getElementById('foglio').value.trim() || !document.getElementById('particella').value.trim())
			if(confirm("Particella e/o foglio non valorizzati!\nForzare comunque l'aggiornamento?")){
				return true;
			}else{			
				return false;
			}
		}
		
		function centerOnFeature(){
			if(api.selezioneCorrente.getByCodTPN(${param.codTPN})){
			    api.centerOnSelected();			   
			} else {
			    api.clearSelected(false);
				api.addSelected(new parent.JSGeometry('${fabbricatoCensimento.JSGeometry}')); 
				api.centerOnSelected();
			}			
		}
        
	</script>

</head>

<body onload="mapOperation();" onunload="void(0);" id="tmpl_popup">	

		<div style="margin-top: 1em; text-align: right;">
			<a href="/tolomeobinj/censimento/ResocontoFabbricatiServlet" title="Torna al menu principale">Vai al resoconto</a>	
		</div>
		
		<%@ include file="../../include/tmplMessaggio.jsp" %>

		<h2>Gestione Fabbricato</h2>
		<h3>Assegnazione coordinate catastali</h3>
		
		<form id="gestioneFabbricato" action="/tolomeobinj/censimento/GestioneFabbricatiServlet" method="post" onReset="clearAll()" onSubmit="return checkSubmission()" >
		<fieldset>
			<legend>Dati fabbricato</legend>
				<div>
					<span class="tmpl_form_etichetta">Sezione : </span>
					<span class="tmpl_form_fixtext">${fabbricatoCensimento.sezione}</span>				
				</div>
				<div>
					<span class="tmpl_form_etichetta">Codice  : </span>
					<span class="tmpl_form_fixtext">${fabbricatoCensimento.codice}</span>				
				</div>
				<div>					
					<label for="foglio">Foglio</label>					
					<input type="text" id="foglio" name="foglio" value="${fabbricatoCensimento.foglio}" accesskey="" maxlength="10"/>		            
				</div>
				<div>					
					<label for="particella">Particella</label>					
					<input type="text" id="particella" name="particella" value="${fabbricatoCensimento.particella}" accesskey="" maxlength="10"/>
				</div>	
				<div>					
					<label for="note">Note</label>
		            <textarea id="note" name="note" rows="4" cols="50" >${fabbricatoCensimento.note}</textarea>
		            <span class="tmpl_form_nota">testo massimo 500 caratteri</span>
				</div>					        			           		        		        
		</fieldset>	
		<div style="margin-top: 10px;">
			<a href="javascript: centerOnFeature(); void(0);" style="text-decoration: none; border: solid 1px black; padding:4px;" ><img src="/img/icone/16-default/target.gif" style="vertical-align:middle;" /> Centra su mappa</a></span>
		</div>		
		<div>
			<h3>Suggerimenti coordinate</h3>           
        	<c:choose>									
				<c:when test="${!empty particelleIntersecate}">
				<table summary="Statistiche sezioni">
					<caption>Possibili coordinate catastali</caption>
					<thead>					
						<tr>
							<th id="col1">Foglio</th>
							<th id="col2">Particella</th>						
						</tr>			
					</thead>		
					<tbody>
					<c:forEach items="${particelleIntersecate}" var="particella" varStatus="status">			
						<tr id="tr${particella.IDTPN}">
							<td headers="col1"><c:out value="${particella.foglio}" /></td>
							<td headers="col2"><c:out value="${particella.particella}" /></td>				
						</tr>										
						<script>						
							var tr = document.getElementById("tr${particella.IDTPN}");
							tr.geom = new parent.JSGeometry('${particella.JSGeometry}');																		  		
							tr.foglio = ${particella.foglio};
							tr.particella = ${particella.particella};				
							tr.onmouseover = highlightGeom;
							tr.onmouseout  = deHighlightGeom;
							tr.onclick     = selectGeom;
						</script>	
					</c:forEach>
					</tbody>
				</table>
			</c:when>
			<c:otherwise>
				<h3>Nessuna particella intersecata dal fabbricato</h3>
			</c:otherwise>
		</c:choose>    
        </div>									
		<div class="tmpl_form_hidden">			
			<input type="hidden" name="idFabbricato" id="idFabbricato" value="${fabbricatoCensimento.idFabbricato}" />						
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />
			<input type="hidden" name="codTPN" value="${param.codTPN}" />
			<input type="hidden" name="IDTPN" value="${param.IDTPN}" />
			<input type="hidden" name="geoCoord" value='${param.geoCoord}' />
			<input type="hidden" name="geoOp" value="${param.geoOp}" />
		</div>
		
		<%@ include file="../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../include/tmplBaseDOWNPannello.jsp" %>
