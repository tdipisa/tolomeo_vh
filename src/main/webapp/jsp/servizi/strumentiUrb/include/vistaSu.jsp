	<%
		String uri2 = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort(); 
		String uriContext = uri2 + request.getContextPath();
	%> 
	
	var scala = 0;
	var mapx  = 0;
	var mapy  = 0;
	<c:if test="${ (param.scala!=null) && (param.mapx!=null) && (param.mapy!=null) }">
		scala = ${param.scala};
		mapx  = ${param.mapx};
		mapy  = ${param.mapy};
	</c:if>
	
	//ridefinisco il vh per puntare alle mappe del ruonline da tolomeo...
	vh    = "";
	if (TolomeoExt.Vars.TOLOMEOServer.search("dvptolomeo")!=-1) {
		vh = "http://dvpmappe.comune.prato.it/mappebinj"
	} else if (TolomeoExt.Vars.TOLOMEOServer.search("tolomeo")!=-1) {
		vh = "http://ruonline.comune.prato.it:"+window.location.port+"/mappebinj";
	}
	
	if (scala!=0 && mapx!=0 && mapy!=0)
		tolomeo.api.gotoPosition(mapx, mapy, scala, false);

	function vistaSu(jsp) {
		if (jsp.indexOf("?")<0) { jsp+="?" } else { jsp+="&" }
		var scala = Math.round(tolomeo.api.viewer.pluginGetCurrentZoom());
		var mapx  = tolomeo.api.viewer.pluginGetCurrentX();
		var mapy  = tolomeo.api.viewer.pluginGetCurrentY();
		if (vh == "") {
			window.open("<%= uriContext %>" + jsp + "scala="+scala+"&mapx="+mapx+"&mapy="+mapy);
		} else {
			window.open(vh + jsp + "scala="+scala+"&mapx="+mapx+"&mapy="+mapy);
		}
	}
	
	function vista_su_ps(id) {
		var s = Math.round(tolomeo.api.viewer.pluginGetCurrentZoom());
		var x  = tolomeo.api.viewer.pluginGetCurrentX();
		var y  = tolomeo.api.viewer.pluginGetCurrentY();
		window.open('http://psonline.comune.prato.it/mappa.php?id=' + id + "&s=" + s + "&x=" + x + "&y=" + y);
	}

	//Pulsante vista su
	var toolbar = tolomeo.toolbar;
	var vistaButton = new Ext.Button({
		text: 'Vista su...',
		tooltip: 'Apri le altre mappe con la medesima vista',
		icon: TolomeoExt.Vars.TOLOMEOServer + '/img/icone/24-default/viste.gif',
		scale: 'medium',
		menu: {
			cls: 'clearCSS',
			ignoreParentClicks: true,
			items: [{
				text: 'Regolamento Urbanistico',
				menu: {
					cls: 'clearCSS',
					items: [{
						text: 'Usi del suolo e modalità d\'intervento',
						handler: function(){
		              		vistaSu('/jsp/ru/ruweb/mappa.jsp');
		              	}
					},{
						text: 'Unità Minime di Intervento',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=UMI');
		              	}
					}]
				}
			},{
				text: 'Mappe utili alla progettazione',
				menu: {
					cls: 'clearCSS',
					items: [{
						text: 'Carte della Pericolosità (PS in vigore)',
						menu: {
							cls: 'clearCSS',
							items: [{
								text: 'Tavola Af.7 Carta delle pericolosità geomorfologica',
								handler: function() {
				              		vista_su_ps('af7');
				              	}
							},{
								text: 'Tavola Af.8 Carta delle pericolosità sismica locale (ZMPSL)',
								handler: function() {
									vista_su_ps('af8');
				              	}
							},{
								text: 'Tavola Af.9 Carta delle pericolosità idraulica',
								handler: function() {
				              		vista_su_ps('af9');
				              	}
							},{
								text: 'Tavola Af.11 Carta del P.A.I. (D.P.C.M. 6 Maggio 2005)',
								handler: function() {
									vista_su_ps('af11');
				              	}
							},{
								text: 'Tavola Af.12 Carta delle problematiche idrogeologiche)',
								handler: function() {
									vista_su_ps('af12');
				              	}
							}]
						}
					},{
						text: 'Vincoli sovraordinati (PS in vigore)',
						menu: {
							cls: 'clearCSS',
							items: [{
								text: 'Tavola Vi.1 Beni culturali, paesaggistici e ambientali',
								handler: function() {
				              		vista_su_ps('vi1');
				              	}
							},{
								text: 'Tavola Vi.2 Aree Naturali Protette d\'Interesse Locale, Siti d\'interesse regionale',
								handler: function() {
									vista_su_ps('vi2');
				              	}
							},{
								text: 'Tavola Vi.3 Vincolo idrogeologico, vincoli di tutela dell\'acqua e del suolo',
								handler: function() {
				              		vista_su_ps('vi3');
				              	}
							},{
								text: 'Tavola Vi.4 Distanze di rispetto da strade, autostrade, ferrovie e cimiteri, rete degli elettrodotti',
								handler: function() {
									vista_su_ps('vi4');
				              	}
							}]
						}
					},{
						text: 'Fattibilità delle azioni di piano',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=FattibilitaGeo');
		              	}
					}]
				}
			},{
				text: 'Mappe riferite al precedente Piano Strutturale Secchi 1998',
				menu: {
					cls: 'clearCSS',
					items: [{
						text: 'Vincoli e Salvaguardie',
						handler: function(){
			            	vistaSu('/jsp/ru/mappa.jsp?map=Vincoli');
			            }
					},{
						text: 'Pericolosità geologica e idraulica',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=PericolositaGeo');
		              	}
					},{
						text: 'Geolitologia',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=Geolitologia');
		              	}
					},{
						text: 'Geomorfologia',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=Geomorfologia');
		              	}
					},{
						text: 'Reticolo idrografico: "acque alte" e "acque basse"',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=ReticoloIdrografico');
		              	}
					},{
						text: 'Bacini di drenaggio delle acque superciali',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=BaciniAcqueSup');
		              	}
					},{
						text: 'Bacini di drenaggio delle reti delle fognature',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=BaciniFognature');
		              	}
		            }]
		         }	
			},{
				text: 'Altre mappe informative sul territorio comunale',
				menu: {
					cls: 'clearCSS',
					items: [{
						text: 'Piano di classificazione acustica',
						handler: function(){
			            	vistaSu('/jsp/ru/mappa.jsp?map=ClassificazioneAcustica');
			            }
					},{
						text: 'Licenze edilizie storiche',
						handler: function(){
			            	vistaSu('/jsp/ru/licEdilStoriche/mappa.jsp');
			            }
					},{
						text: 'Aree percorse da incendi',
						handler: function(){
			            	vistaSu('/jsp/ru/mappa.jsp?map=AreeIncendi');
			            }
					},{
						text: 'Aree allagate',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=AreeAllagate');
		              	}
					},/*{
						text: 'Pericolosità e rischio idrauilico',
						handler: function(){
		              		vistaSu('/jsp/servizi/strumentiUrb/rischio/mappa.jsp');
		              	}
					},*/{
						text: 'Opere regimazione idraulica',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=RegIdraulica');
		              	}
					},{
						text: 'Relazioni geologico tecniche (Geoweb)',
						handler: function(){
		              		vistaSu('/jsp/ru/geoweb/mappa.jsp');
		              	}
					
					},{
						text: 'Rilevamenti fotografici',
						handler: function(){
		              		vistaSu('/jsp/ru/rilevamentiFotografici/mappa.jsp');
		              	}
					},{
						text: 'Ortofoto',
						handler: function(){
		              		vistaSu('/jsp/ru/mappa.jsp?map=Ortofoto');
		              	}
					}]
				}
			}]
		}
	})
	toolbar.addLeft('-');
	toolbar.addLeft(vistaButton);
