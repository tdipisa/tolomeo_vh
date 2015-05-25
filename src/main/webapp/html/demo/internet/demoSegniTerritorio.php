<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html lang="it">
<head>
<title>I segni del Territorio: mappa interattiva</title>
<meta http-equiv="Content-type" content="text/html; charset=iso-8859-1" >
<meta name="description" content="mappa interattiva de I segni del territorio" >
<meta name="keywords" content="i segni del territorio, comune di prato,prato,cartografia,ctr,mapguide" >
<meta name="generator" content="vim" >
 
<!-- inizio css mappa -->
<link rel="stylesheet" type="text/css" charset="utf-8" href="http://pratomaps.comune.prato.it/js/ext/extJS/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" charset="utf-8" href="http://dvppratomaps.comune.prato.it/css/toloExt-inter.css" />
<!-- fine css mappa -->

<link rel="stylesheet" type="text/css" href="http://www.comune.prato.it/common/css/comune/immagini.css">
<!-- <link rel="stylesheet" type="text/css" href="http://www.comune.prato.it/common/css/comune/liste.css" > -->
<link rel="stylesheet" type="text/css" href="http://segnidelterritorio.comune.prato.it/mycommon/css/gener.css" >
<link rel="stylesheet" type="text/css" href="http://segnidelterritorio.comune.prato.it/mycommon/css/segni.css" >
<link rel="stylesheet" type="text/css" href="http://segnidelterritorio.comune.prato.it/mycommon/css/mappa.css" >

<?php 
	//recupero da querystring i parametri di layerID e featureID
	$lid = $_GET["lid"];
	$fid = $_GET["fid"];
?>

<!-- inizio javascript mappa -->
<script type="text/JavaScript" charset="utf-8" src="http://dvppratomaps.comune.prato.it/js/tolomeoExt/build/toloExt-all-debug.js"></script>
<script type="text/JavaScript" charset="utf-8" src="http://dvppratomaps.comune.prato.it/pratomapsbinj/ToloExtParamsJSServlet?paramPreset=SegniTerritorio"></script>
<script type="text/JavaScript" charset="utf-8" src="http://dvppratomaps.comune.prato.it/js/tolomeoExt/layout/ToloPanelInter.js"></script>

<script type="text/javascript" charset="utf-8" src="http://dvppratomaps.comune.prato.it/js/tolomeoExt/toloStreetviewViewer.js"></script>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<link href="http://code.google.com/apis/maps/documentation/javascript/examples/standard.css" rel="stylesheet" type="text/css" />

<script type="text/JavaScript">
	//<![CDATA[
	function infoHandler(codTPN,IDTPN) {
		tolomeo.api.openURL('http://segnidelterritorio.comune.prato.it/?nav=mapg&hotpoint='+IDTPN,'pannello');
	}
	Ext.onReady(function(){
		tolomeo = new TolomeoExt.ToloPanelInter({
			region: 'center',
			monitorResize: true,
			toolbarOpt: {
				withPanArrows: true,
				withQuery: false,
				withLegenda: false,
				withIdentify: false,
				withNuovo: false,
				withUpdateAlfa: false,
				withAdd: false,
				withSubtract: false,
				withAddSub: false,
				withVertexEdit: false,
				withDragDrop: false,
				withDelete: false,
				withLayerList: false,
				withInfoSelezione: true,
				withAutoIdentify: true,
				defaults: {scale:'medium'},
				iconBasePath: TolomeoExt.Vars.TOLOMEOServer + '/mycommon/img/icone24-default/'
			},
			ricercaPanelOpt: {
				title: 'Trova'
			},
			legendaPanelOpt: {
				title: 'Cartografia storica'
			},
			APIConfig: {
				listeners: {
					'visualize':{fn:this.infoHandler,scope:this}
					<?php if ( isset($lid) && isset($fid) ) { ?>
					,'tocGuiCreate':{
						fn:function() {
							tolomeo.api.zoomToObj(<?php echo $lid ?>, <?php echo $fid ?>, true, null, 500);							
						},
						scope: this
					}
					<?php } ?>
				}
								
			},
			titoloMappa: 'I segni del territorio'
		});

		new Ext.Viewport({
			layout: 'border',
			monitorResize: true,
			items: [
				new Ext.Panel({
					region: 'north',
				    contentEl: 'north',
				    border: false
				}),
				tolomeo,
				new Ext.Panel({
					region: 'south',
				    contentEl: 'south',
				    border: false
				})
			]
	    });	
	    
	    
	});
	//]]>
</script>
<!-- fine javascript mappa -->

 
</head>


<body>
	<div id="north">
		<div class="percorso">
			<a href="#salta" accesskey="0"><img src="http://www.comune.prato.it/common/gif/elemen/salta.gif" title="salta la barra di navigazione" width="10" height="10" alt="salta la barra"></a>
			<a href="http://www.comune.prato.it/"onclick="javascript:this.target='_parent'" title="Accedi alla homepage del sito Web del Comune di Prato">Comune di Prato</a>
			<img src="http://www.comune.prato.it/common/gif/frecce/c_av4p.gif" width="9" height="10" alt=" ">
			<a href="../"  onclick="javascript:this.target='_parent'" title="Vai ala home del servizio"> I segni del territorio</a>
			<img src="http://www.comune.prato.it/common/gif/frecce/c_av4p.gif"  width="9" height="10" alt=" "> Mappa interattiva
		</div>
		
		<div class="intesta">
			<a title="vai alla home del Comune di Prato" href="http://www.comune.prato.it/"><img width="131" height="40" class="imgsx" alt="Comune di Prato" src="http://segnidelterritorio.comune.prato.it/mycommon/img/lcomune.gif"></a>
			<div class="titolo" style="margin-top: 0">I segni del territorio</div>
			<br class="nofloat">
		</div>
	
		<div class="topmain">  
			<img src="../../common/gif/frecce/c_in2p.gif" height="10" width="10" alt=" "/>
			<a href="javascript: history.back();">indietro</a> | 
			<a href="../info/htm/guida.htm" onclick="javascript:this.target='_top'">Guida</a> | 
			<a href="../info/htm/layer.htm"	onclick="javascript:this.target='_top'">Help Layer</a>
  		</div>
	</div>

	<div id="south">
		<div class="copyright">
			<div style="float: left; text-align: left;">&copy; Comune di Prato</div>
			<div style="float: right; text-align: right;"><a href="javascript: history.back();">indietro</a> <a href="#top">inizio pagina</a></div>
			<br class="nofloat" />
		</div>
	</div>
	
</body>
</html>