/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License 
 * as published by the Free Software Foundation; either version 3 of the License, 
 * or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or 
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; 
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
 * 
 * Developers Information:
 * 
 * Tolomeo is developed by Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it 
 * 
 * 
 * Versione in Italiano LGPL
 * 
 * Tolomeo è un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo è un software libero; è possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o
 * IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo è sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
package it.prato.comune.tolomeo.servizi.shared;
 
import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PuntoAnagrafe;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaArea;
import it.prato.comune.tolomeo.servizi.shared.model.IntersectAnagrafeService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servet generica che gestisce la richiesta di intersezione tra un poligono generico e l'anagrafe creando un report csv.<br /><br />
 * I parametri che vengono gestiti sono:
 * <ul>
 * 	<li><code>forward</code> - a chi inoltrare la risposta</li>
 * 	<li><code>command</code> - il tipo di estrazione da eseguire, che può essere:</li>
 * 		<ul>
 *			<li><code>statisticaArea</code> - la sola statistica dell'area;</li>
 *			<li><code>abitanti</code> - tutti gli abitanti nell'area;</li>
 *			<li><code>famiglie</code> - i soli capi famiglia residenti nell'area;</li>
 *			<li><code>statisticaCompletaAbitanti</code> - la statistica dell'area e tutti gli abitanti residenti nella stessa;</li>
 *			<li><code>statisticaCompletaFamiglie</code> - la statistica dell'area e i soli capi famiglia residenti nella stessa.</li>
 *			<li><code>statisticaFascieEta</code> - la statistica dell'area e gli abitanti residenti nella stessa sudivisi per fascia di età.</li>
 *		</ul>
 * </ul>
 *
 * @author bf1f
 *
 */
public class CreaReportAnagrafeServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    @SuppressWarnings("unchecked")
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
        
        LogInterface logger = getLogger(request);
        
        int codTPN = getCodTPN(request);
        String key = getKey(request);
//        String forward = getForward(request);
        String command = getCommand(request);
//        boolean perSesso       = (StringUtils.isEmpty(request.getParameter("perSesso"))) ? false : true;
//        int codClassificazione = (request.getParameter("codClassificazione")!=null) ? Integer.parseInt(request.getParameter("codClassificazione")) : 0;
        
        SITLayersManager comunePO = getTerritorio(logger);
		LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
		OggettoTerritorio oggetto = null;
		List<OggettoTerritorio> oggetti = null;
//        String JSGeometry = null;
        final String SEP = ";";
        
        response.setCharacterEncoding("iso-8859-15");
        response.setContentType("application/vnd.ms-excel");
		PrintWriter print = response.getWriter();

		//se IDTPN è valorizzata recupero l'oggetto specifico altrimenti tutti per il dato layer (filtro vuoto)
        if (key.equalsIgnoreCase("null")) {
        	logger.warn("Chiave univoca oggetto non valorizzata! Recupero tutti gli oggetti del layer " + layer.getCodTPN() + " " + layer.getNome());
        	try {
				Filtro filtro = layer.getFiltroVuoto();
				filtro.ResetFiltro();
				layer.setFiltro(filtro);
				oggetti = layer.cercaFiltro();
				
				if(oggetti == null){
					String msg = "Nessun oggetto trovato!";
					logger.error(msg);
					addMessaggio(request, Messaggio.ERRORE, msg);
					forward(TolomeoServlet.ERROR_PAGE, request, response);
					return;
		        }
				
			} catch (SITException e) {
				addMessaggio(request, Messaggio.ERRORE, "Eccezione durante la ricerca!");
				forward(TolomeoServlet.ERROR_PAGE, request, response);
				return;
			}
        } else {
			logger.warn("Chiave univoca valorizzata! Recupero l'oggetto " + key + " del layer " + layer.getCodTPN() + " " + layer.getNome());
			
			//cerco l'oggetto selezionato
	        oggetto = layer.cercaIDTPN(key);
	        
	        if(oggetto == null){
	        	String errMsg = "Oggetto " + key + " non trovato";
				logger.error(errMsg);
				addMessaggio(request, Messaggio.ERRORE, errMsg);
				forward(TolomeoServlet.ERROR_PAGE, request, response);
				return;
	        }
		}

        StatisticaArea statistica = new StatisticaArea();
        List<PuntoAnagrafe> abitanti = new ArrayList<PuntoAnagrafe>();
        //StatisticaCompleta statisticaCompleta = new StatisticaCompleta();
        //List<FasciaEta> abitantiFascieEta = new ArrayList<FasciaEta>();
        //StatisticaCompletaFasceEta statisticaCompletaFasceEta = new StatisticaCompletaFasceEta();

        IntersectAnagrafeService service = new IntersectAnagrafeService (logger,layer);
        
        if (!service.connetti()) {
        	
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
        }
        
        try {
        	
        	//statistica dell'area
        	if (command.equalsIgnoreCase("statisticaArea")) {
        		
        		response.addHeader("Content-Disposition", "attachment;filename=residenti.csv");
        		
        		//statistica per un singolo oggetto del layer
        		if (oggetto!=null) {
        			
        			statistica = service.getStatisticaArea(oggetto);
        			print.println("Oggetto: " + oggetto.getDescrizione());
        			print.println("Num. Residenti;Famiglie;Densità");
        			print.println(
        					statistica.getResidenti() + SEP +
        					statistica.getFamiglie() + SEP +
        					statistica.getDensita() + SEP
        			);
        		}
        		
        		//statistica per ogni oggetto del layer
        		if (oggetti!=null) {
        			
        			Collections.sort(oggetti, new Comparator<OggettoTerritorio>() {
        				public int compare(OggettoTerritorio pa1, OggettoTerritorio pa2){
        					int c = pa1.getDescrizione().compareToIgnoreCase(pa2.getDescrizione());
        					return c;
        				}
        			});
        			
	        		print.println("Oggetto;Num. Residenti;Famiglie;Densità");
	        		for (OggettoTerritorio ogg: oggetti) {
	        			statistica = service.getStatisticaArea(ogg);
	        			print.println(
	        					ogg.getDescrizione() + SEP + 
	        					statistica.getResidenti() + SEP +
	        					statistica.getFamiglie() + SEP +
	        					statistica.getDensita() + SEP
	        			);
					}
        		}
        	
        	//elenco abitanti
        	} else if (command.equalsIgnoreCase("abitanti")) {
        		
            	//abitanti = service.getAbitanti(oggetto);
            	//TODO creare report
        	
            //elenco capi famiglia
        	} else if (command.equalsIgnoreCase("famiglie")) {
        		
            	abitanti = service.getFamiglie(oggetto);
            	
            	response.addHeader("Content-Disposition", "attachment;filename=famiglie.csv");
            	print.println("CODICE FISCALE;COD. PERSONA;COGNOME;NOME;DATA NASCITA;SESSO;CODICE FAMIGLIA;INDIRIZZO");
            	
            	for (int i=0; i<abitanti.size(); i++) {
					print.println(
						abitanti.get(i).getCodiceFiscale() + SEP +
						abitanti.get(i).getCodicePersonale() + SEP +
						abitanti.get(i).getCognome() + SEP +
						abitanti.get(i).getNome() + SEP +
						abitanti.get(i).getDataNascitaDT().getFormatted('/') + SEP +
						abitanti.get(i).getSesso() + SEP +
						abitanti.get(i).getCodiceFamiglia() + SEP +
						abitanti.get(i).getIndirizzo()
					);
				}
            
            //statistica area + elenco abitanti
        	} else if (command.equalsIgnoreCase("statisticaCompletaAbitanti")) {
        		
        		//statisticaCompleta = service.getStatisticaCompletaAbitanti(poligono);
        		//TODO creare report
        	
        	//statistica area + elenco capifamiglia
        	} else if (command.equalsIgnoreCase("statisticaCompletaFamiglie")) {
        		
        		//statisticaCompleta = service.getStatisticaCompletaFamiglie(poligono);
        		//TODO creare report
        	
        	//statistica area + elenco abitanti suddivisi per fascie di età
        	} else if (command.equalsIgnoreCase("statisticaCompletaFascieEta")) {
        		
        		//statisticaCompletaFasceEta = service.getStatisticaCompletaFasceEta(poligono, perSesso, codClassificazione);
        		//TODO creare report
        		
        	} else {
        		
        		//statistica = service.getStatisticaArea(oggetto);
        		//TODO creare report
        	}
        	
        } catch(Exception e) {
                        
            String errMsg = "Si è verificata una eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
             
        } finally {
            
            if(service != null){
                service.disconnetti();
            }
        }
        
        print.flush();
		print.close();
	}
	
	protected String getDefaultForward() {
		return null;
	}
}
