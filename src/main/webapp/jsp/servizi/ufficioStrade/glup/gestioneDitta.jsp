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
<script>
	$(function(){
		$("#descrizione").focus();		
		selectProvincia();
		$("#provinciaSuggest").change(function(event){
			$("#provincia").val(event.target.value);			
		});
		$("#provincia").keyup(function(event){			
			event.target.value = event.target.value.toUpperCase();
			selectProvincia();
		})
		$("#via").keypress(function(event){			
			if(event.which == 44){ //virgola
				$("#nciv").select();
				return false;
			}
		})
		$("#gestioneDitta")[0].onreset = function(){setTimeout("selectProvincia()",200);};
    });   
            
    function selectProvincia(){
    	$("#provinciaSuggest option[value=]").attr("selected","selected");
    	$("#provinciaSuggest option[value=" + $("#provincia").val() + "]").attr("selected","selected");
    }
</script>
</head>

<body id="tmpl_popup">	

		<%@ include file="include/pageHeaderGlup.jsp" %>
		<%@ include file="../../../include/tmplMessaggio.jsp" %>

		<h2>Gestione Ditte</h2>
		<h3><c:out value="${pageTitle}" default="Inserimento / Modifica" /></h3>
		
		<form id="gestioneDitta" action="/tolomeobinj/glup/GestioneDitta" method="post">
		
		<fieldset>
			<legend>Dati Ditta</legend>							
				<div>					
					<br />
					<label for="descrizione">Ragione sociale *</label>
					<input type="text" id="descrizione" name="descrizione" value="${ditta.descrizione}" accesskey="" maxlength="50" tabindex="0" size="42" />
					<span class="tmpl_form_nota">max 50 caratteri</span>
				</div>
				<hr style="color: #ccc; background-color: #ccc; height: 1px;" />
				<div style="float: left; margin-right:5px;">										
					<label for="via">Via / Piazza</label>
					<input type="text" id="via" name="via" value="${ditta.via}" accesskey="" maxlength="100" size="30" />					
				</div>
				<div style="clear: none;">										
					<label for="nciv">N. civ.</label>
					<input type="text" id="nciv" name="nciv" value="${ditta.nciv}" accesskey="" maxlength="10" size="6" />									
				</div>
				<div style="float: left; margin-right:5px;">										
					<label for="cap">C.A.P.</label>
					<input type="text" id="cap" name="cap" value="${ditta.cap}" accesskey="" maxlength="5" size="6" />										
				</div>
				<div style="clear: none;">										
					<label for="citta">Citt&agrave;</label>
					<input type="text" id="citta" name="citta" value="${ditta.citta}" accesskey="" maxlength="50" size="30" />										
				</div>
				<div>										
					<label for="provincia">Provincia</label>
					<input type="text" id="provincia" name="provincia" value="${ditta.provincia}" accesskey="" maxlength="2" size="4" />
				</div>
				<div style="clear: both;">																																					
					<select id="provinciaSuggest" name="provinciaSuggest" >
						<option value="">- province -</option>
						<option value="AG">Agrigento (AG)</option>
						<option value="AL">Alessandria (AL)</option>
						<option value="AN">Ancona (AN)</option>
						<option value="AO">Aosta (AO)</option>
						<option value="AR">Arezzo (AR)</option>
						<option value="AP">Ascoli Piceno (AP)</option>
						<option value="AT">Asti (AT)</option>
						<option value="AV">Avellino (AV)</option>
						<option value="BA">Bari (BA)</option>
						<option value="BL">Belluno (BL)</option>
						<option value="BN">Benevento (BN)</option>
						<option value="BG">Bergamo (BG)</option>
						<option value="BI">Biella (BI)</option>
						<option value="BO">Bologna (BO)</option>
						<option value="BZ">Bolzano (BZ)</option>
						<option value="BS">Brescia (BS)</option>
						<option value="BR">Brindisi (BR)</option>
						<option value="CA">Cagliari (CA)</option>
						<option value="CL">Caltanissetta (CL)</option>
						<option value="CB">Campobasso (CB)</option>
						<option value="CI">Carbonia-Iglesias (CI)</option>
						<option value="CE">Caserta (CE)</option>
						<option value="CT">Catania (CT)</option>
						<option value="CZ">Catanzaro (CZ)</option>
						<option value="CH">Chieti (CH)</option>
						<option value="CO">Como (CO)</option>
						<option value="CS">Cosenza (CS)</option>
						<option value="CR">Cremona (CR)</option>
						<option value="KR">Crotone (KR)</option>
						<option value="CN">Cuneo (CN)</option>
						<option value="EN">Enna (EN)</option>
						<option value="FE">Ferrara (FE)</option>
						<option value="FI">Firenze (FI)</option>
						<option value="FG">Foggia (FG)</option>
						<option value="FC">Forlì-Cesena (FC)</option>
						<option value="FR">Frosinone (FR)</option>
						<option value="GE">Genova (GE)</option>
						<option value="GO">Gorizia (GO)</option>
						<option value="GR">Grosseto (GR)</option>
						<option value="IM">Imperia (IM)</option>
						<option value="IS">Isernia (IS)</option>
						<option value="SP">La Spezia (SP)</option>
						<option value="AQ">L"Aquila (AQ)</option>
						<option value="LT">Latina (LT)</option>
						<option value="LE">Lecce (LE)</option>
						<option value="LC">Lecco (LC)</option>
						<option value="LI">Livorno (LI)</option>
						<option value="LO">Lodi (LO)</option>
						<option value="LU">Lucca (LU)</option>
						<option value="MC">Macerata (MC)</option>
						<option value="MN">Mantova (MN)</option>
						<option value="MS">Massa-Carrara (MS)</option>
						<option value="MT">Matera (MT)</option>
						<option value="ME">Messina (ME)</option>
						<option value="MI">Milano (MI)</option>
						<option value="MO">Modena (MO)</option>
						<option value="NA">Napoli (NA)</option>
						<option value="NO">Novara (NO)</option>
						<option value="NU">Nuoro (NU)</option>
						<option value="OT">Olbia-Tempio (OT)</option>
						<option value="OR">Oristano (OR)</option>
						<option value="PD">Padova (PD)</option>
						<option value="PA">Palermo (PA)</option>
						<option value="PR">Parma (PR)</option>
						<option value="PV">Pavia (PV)</option>
						<option value="PG">Perugia (PG)</option>
						<option value="PU">Pesaro e Urbino (PU)</option>
						<option value="PE">Pescara (PE)</option>
						<option value="PC">Piacenza (PC)</option>
						<option value="PI">Pisa (PI)</option>
						<option value="PT">Pistoia (PT)</option>
						<option value="PN">Pordenone (PN)</option>
						<option value="PZ">Potenza (PZ)</option>
						<option value="PO">Prato (PO)</option>
						<option value="RG">Ragusa (RG)</option>
						<option value="RA">Ravenna (RA)</option>
						<option value="RC">Reggio Calabria (RC)</option>
						<option value="RE">Reggio Emilia (RE)</option>
						<option value="RI">Rieti (RI)</option>
						<option value="RN">Rimini (RN)</option>
						<option value="RM">Roma (RM)</option>
						<option value="RO">Rovigo (RO)</option>
						<option value="SA">Salerno (SA)</option>
						<option value="VS">Medio Campidano (VS)</option>
						<option value="SS">Sassari (SS)</option>
						<option value="SV">Savona (SV)</option>
						<option value="SI">Siena (SI)</option>
						<option value="SR">Siracusa (SR)</option>
						<option value="SO">Sondrio (SO)</option>
						<option value="TA">Taranto (TA)</option>
						<option value="TE">Teramo (TE)</option>
						<option value="TR">Terni (TR)</option>
						<option value="TO">Torino (TO)</option>
						<option value="OG">Ogliastra (OG)</option>
						<option value="TP">Trapani (TP)</option>
						<option value="TN">Trento (TN)</option>
						<option value="TV">Treviso (TV)</option>
						<option value="TS">Trieste (TS)</option>
						<option value="UD">Udine (UD)</option>
						<option value="VA">Varese (VA)</option>
						<option value="VE">Venezia (VE)</option>
						<option value="VB">Verbano-Cusio-Ossola (VB)</option>
						<option value="VC">Vercelli (VC)</option>
						<option value="VR">Verona (VR)</option>
						<option value="VV">Vibo Valentia (VV)</option>
						<option value="VI">Vicenza (VI)</option>
						<option value="VT">Viterbo (VT)</option>
					</select>						
					<span class="tmpl_form_nota">
						Lista province "non aggiornata" <br />
						Utilizzarla come suggerimento
					</span>	 
				</div>																		        		        				       
		</fieldset>								
		<div class="tmpl_form_hidden">			
			<input type="hidden" name="idDitta" id="idDitta" value="${ditta.id}" />						
			<input type="hidden" name="operazione" id="operazione" value="${operazione}" />			
		</div>
		
		<%@ include file="../../../include/tmplBottoni.jsp" %>
	</form>

<%@ include file="../../../include/tmplBaseDOWNPannello.jsp" %>
