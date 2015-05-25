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
		/**** Finestra di avviso modifiche importanti ****/
		if (Ext.util.Cookies.get("avviso2.1-1")!="ok") {
			htmlAlert = "<b>18.10.2011 - Sono state aggiunte alcune funzionalità alle mappe interattive del Regolamento Urbanistico. Ecco le novità principali:</b><br/>" +
				"<ul style=\"list-style: disc inside none;\">" +
					"<li>in fondo alla mappa è stata aggiunta la barra di stato;</li>" +
					"<li>una volta scelta la modalità \"selezione\" <img src=\"http://pratomaps.comune.prato.it/img/icone/24-default/sector.gif\" alt=\" \" /> questa rimane attiva fino a quando non si passa ad un'altra modalità (\"panoramica\" o \"misura\");</li>" +
					"<li>quando siamo in modalità \"selezione\" è possibile passare temporaneamente alla modalità \"panoramica\" <img src=\"http://pratomaps.comune.prato.it/img/icone/24-default/hand.gif\" alt=\" \" /> tenendo premuto la barra spaziatrice nella tastiera e spostandosi o zoomando con il mouse;</li>" +
					"<li>è stata aggiunta la scorciatoia da tastiera Ctrl + Alt + A per attivare la modalità \"panoramica\";</li>" +
					"<li>è stata aggiunta la scorciatoia da tastiera Ctrl + Alt + S per attivare la modalità \"selezione\".</li>" +
				"</ul>";
				
			data = new Date()
			giorni = 90;
			data.setTime(data.getTime()+(giorni*24*60*60*1000))
			alertWin = new Ext.Window({
				title: 'Aggiornamento framework cartografico',
				bodyStyle: 'background-color:white; padding:10px;',
				layout:'fit',
		        width: 550,
		        height: 220,
		        cls: 'clearCSS',
				html: htmlAlert,
				//autoScroll: true,
		        forceLayout: true,
		        maximizable: false,
		        bbar: [{
	       			xtype: 'checkbox',
	       			id: 'activateMsg',
                    height: 25,
                    boxLabel: 'Non visualizzare più il messaggio'
            	},{
                    xtype: 'tbfill'
                },{
		        	text: 'OK',
		        	width: 100,
		       		handler: function() {
		       			if(Ext.getCmp("activateMsg").getValue()) {
				       		Ext.util.Cookies.set("avviso2.1-1","ok",data);
		       			}
		            	alertWin.close();
		       		}
		        }]
			}).show();
			//alertWin.setPosition(tolomeo.mapPanel.getPosition());
		}
		/**** Fine finestra di avviso modifiche importanti ****/
