<!--DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"-->
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
 if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110≠1301  USA
 
 Developers Information:
 
 Tolomeo is developed by Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it 
 
 
 Versione in Italiano LGPL
 
 Tolomeo Ë un framework per lo sviluppo di applicazioni per
 visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 
 Tolomeo Copyright 2011 Comune di Prato;
 
 Questo file fa parte di Tolomeo.
 
 Tolomeo Ë un software libero; Ë possibile redistribuirlo e / o 
 modificarlo sotto i termini della GNU Lesser General Public License, 
 come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
  
 Tolomeo Ë distribuito nella speranza che possa essere utile,
 ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT¿ o
 IDONEIT¿ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 
 Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110≠1301 USA
   
 
 Informazioni Sviluppatori:
 
 Tolomeo Ë sviluppato dal Comune di Prato
 
 Alessandro Radaelli
 Federico Nieri
 Mattia Gennari
 
 sit@comune.prato.it
--%>


<html xmlns="http://www.w3.org/1999/xhtml" 
	xml:lang="it" 
	lang="it">
	
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
	<link rel="shortcut icon" type="image/x-icon" href="${applx.urlCss}/img/favicon.ico" />
	<title>Simulatore Tolomeo</title>
	<script type="text/javascript" src="commonintra/js/cookie.js"></script>
  	<link rel="stylesheet" href="/commonintra2-0/css/main.css" type="text/css" media="all" />
	<link rel="stylesheet" href="/commonintra2-0/css/menu.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="/commonintra2-0/css/form.css" type="text/css" media="all" /> 
	<link rel="stylesheet" href="/commonintra2-0/css/tabelle.css" type="text/css" media="all" />
	<link rel="stylesheet" href="/commonintra2-0/css/print.css" type="text/css" media="print"/>
	
	<link href="tolomeohtdocs/css/tolomeoNew.css" type="text/css" rel="stylesheet"/>
	<style type="text/css">
		#tmpl_content {
			margin: 0 !important;
		}
		img.allineamento {
			vertical-align: top;
			border: solid 1px #000000;
		}
		div.frame {
			position:absolute;
			padding-left: 1%;
			border: #0C4E37;
			float: left;
			width: 99%;
		}
		fieldset { margin-top:1%; }
	</style>
	<script type="text/javascript">
		function submit(destinazione) {
			document.form0.action = destinazione;
			document.form0.method = "post";
			document.form0.target = "pannello";
			document.form0.submit();
		}
	</script>
</head>

<body>

<!-- Intestazione/header -->
	<div id="tmpl_header">
		<div id="tmpl_headerwrap">
			<div id="tmpl_procedura">
				<span id="tmpl_procedura_jmpmn"><a href="#tmpl_menu" title="salta al men√π della procedura" accesskey="8">Salta al men√π</a></span>
				<span id="tmpl_procedura_jmpcntnt"><a href="#content" title="salta al contenuto della procedura" accesskey="0">Salta al contenuto</a></span>
				<span id="tmpl_procedura_titolo">Nuovo Sistema Informativo Territoriale</span>
				<span id="tmpl_procedura_sottotitolo">Simulatore Tolomeo</span>
			</div>
		</div>	
		
		<div id="tmpl_utenza">
			<span id="tmpl_utenza_nome">utenza</span>
			<span id="tmpl_utenza_data">
				data e ora
			</span>
		</div>
	</div>
<!-- Fine Intestazione/header -->

<!-- Logout/Percorso -->
<div id="tmpl_barra">
	<div id="tmpl_barrawrap"> 
		<div id="tmpl_percorso">
			<ol title="Percorso di navigazione dalla home page">
				<li><a href="#">home</a></li>
			</ol>
		</div>
	</div>
	<div id="tmpl_logout"><a href="">logout</a></div>
</div>
<!-- Fine Logout/Percorso -->

<div id="tmpl_main">
	<!-- Content -->
	<div id="tmpl_mainwrap">		
		<div id="tmpl_content">
		
	 		<!-- Pulsantiera -->
	 		<div id="tmpl_naviga">
	 			<span id="tmpl_bottone_indietro"><a href="javascript:history.back();" title="Torna alla pagina precedente">Indietro</a></span>
	 			<span id="tmpl_bottone_stampa"><a href="javascript:window.print();" title="Stampa la pagina corrente">Stampa</a></span>
	 			<span id="tmpl_bottone_help"><a href="" target="blank" title="Si aprir√† una nuova finestra con l'help della funzione">Help</a></span>
	 		</div>
	 		<!-- Fine Pulsantiera -->
		 		
			<!-- form pulsanti -->
			<form action="" name="form0" method="post" id="form0">
				
				<fieldset>
					<legend></legend>
					
					<div class="tmpl_form_hidden" style="display: none !important;">
						<input type="hidden" name="vie" id="vie" value="" />
						<input type="hidden" name="geoCoord" id="geoCoord" value="" />						
						<input type="hidden" name="geoOp" id="geoOp" value="" />
						<input type="hidden" name="geoChiave" id="geoChiave" value="" />
						<input type="hidden" name="selezionato" id="selezionato" value="" />
						<input type="hidden" name="idObj" id="idObj" value="" />
						
						<input type="hidden" name="clippingCodTPN" id="clippingCodTPN" value="" />
					</div>
					
					<div class="tmpl_form_nofloat">
						Layer: 
						<select onchange="" name="codTPN" id="codTPN">
							<option value="-500">Vie</option>
							<option value="-600">Civici</option>
						</select>
						
						<a href="#" onclick="submit('/tolomeobinj/prociv/VisualizzaZonaRaccoltaServlet?IDTPN=NOME14');"><img class="allineamento" title="Info su un oggetto cartografico" alt="Info su un oggetto cartografico" id="visualizza" src="/tolomeohtdocs/img/icone_on/info.gif" /></a>		
						<a href="#" onclick="submit('pippo.html');"><img class="allineamento" title="Inserimento di un nuovo oggetto cartografico" alt="Inserimento di un nuovo oggetto cartografico" id="nuovo" src="/tolomeohtdocs/img/icone_on/nuovo.gif" /></a>
						<a href="#" onclick="submit('pippo.html');"><img class="allineamento" title="Modifica dei dati di un oggetto cartografico" alt="Modifica dei dati di un oggetto cartografico" id="apri" src="/tolomeohtdocs/img/icone_on/apri.gif" /></a>
						<a href="#" onclick="submit('pippo.html');"><img class="allineamento" title="Modifica vertici" alt="Modifica vertici" id="modificavertici" src="/tolomeohtdocs/img/icone_on/poligonovertici.gif" /></a>
						<a href="#" onclick="submit('pippo.html');"><img class="allineamento" title="Aggiunta di un poligono ad oggetto cartografico" alt="Aggiunta di un poligono ad oggetto cartografico" id="poligono" src="/tolomeohtdocs/img/icone_on/poligono.gif" /></a>
						<a href="#" onclick="submit('pippo.html');"><img class="allineamento" title="Rimozione di un poligono da un oggetto cartografico" alt="Rimozione di un poligono da un oggetto cartografico" id="poligonodelete" src="/tolomeohtdocs/img/icone_on/poligonodelete.gif" /></a>
						<a href="#" onclick="submit('pippo.html');"><img class="allineamento" title="Cancellazione di un oggetto cartografico" alt="Cancellazione di un oggetto cartografico" id="elimina" src="/tolomeohtdocs/img/icone_on/elimina.gif" /></a>
					</div>
				</fieldset>
		
			</form>
		      
		       <div class="frame">
		         <iframe scrolling="auto" id="pannello" name="pannello" src="" width="98%" height="550px"></iframe>
		       </div>
		
			</div>
	</div>
</div>

</body>
</html>
