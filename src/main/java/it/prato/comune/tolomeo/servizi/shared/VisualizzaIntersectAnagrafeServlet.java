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
 
import it.prato.comune.sit.LayerAnagrafe;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PuntoAnagrafe;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaArea;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaCompleta;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaCompletaFasceEta;
import it.prato.comune.tolomeo.servizi.shared.model.IntersectAnagrafeService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servet generica che gestisce la richiesta di intersezione tra un poligono generico e l'anagrafe.<br /><br />
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
public class VisualizzaIntersectAnagrafeServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    @SuppressWarnings("unchecked")
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
              		
        String key = getKey(request);
        String forward = getForward(request);
        String command = getCommand(request);
        boolean perSesso = (StringUtils.isEmpty(request.getParameter("perSesso"))) ? false : true;
        boolean perNazionalita = (StringUtils.isEmpty(request.getParameter("perNazionalita"))) ? false : true;
        int codClassificazione = 0;
        if (request.getParameter("codClassificazione")!=null) codClassificazione = Integer.parseInt(request.getParameter("codClassificazione"));
        int codTPN = getCodTPN(request);
        
        String JSGeometry = null;

        if (StringUtils.isEmpty(key)) {
			
			//recupero la key se la richiesta mi è stata inoltrata da una jsp e poi controllo se è valorizzata
			key = request.getParameter("key");
			
			// Se sono presenti errori giro la richiesta alla pagina di errore
			if (StringUtils.isEmpty(key)) {
				
				addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
	            forward(TolomeoServlet.ERROR_PAGE, request, response);
	            return;
			}
		} 
       
        LogInterface logger = getLogger(request);
        
        StatisticaArea statistica = new StatisticaArea();
        List<PuntoAnagrafe> abitanti = new ArrayList<PuntoAnagrafe>();
        StatisticaCompleta statisticaCompleta = new StatisticaCompleta();
//        List<FasciaEta> abitantiFascieEta = new ArrayList<FasciaEta>();
        StatisticaCompletaFasceEta statisticaCompletaFasceEta = new StatisticaCompletaFasceEta();
        
        SITLayersManager comunePO = getTerritorio(logger);
		LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
        
		// Cerco l'oggetto selezionato
        OggettoTerritorio oggetto = layer.cercaIDTPN(key);
        
        if(oggetto == null){
        	
        	String errMsg = "Oggetto " + key + " non trovato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
        }
        
        IntersectAnagrafeService service = new IntersectAnagrafeService (logger,LayerAnagrafe.getInstance(comunePO));
        
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
        		
        		statistica = service.getStatisticaArea(oggetto);
        		if (statistica.getResidenti()==0) addMessaggio(request, Messaggio.WARNING, "Non sono presenti residenti");
        	
        	//elenco abitanti
        	} else if (command.equalsIgnoreCase("abitanti")) {
        		
            	abitanti = service.getAbitanti(oggetto);
            	if (abitanti.size()==0) addMessaggio(request, Messaggio.WARNING, "Non sono presenti residenti");
        	
            //elenco capi famiglia
        	} else if (command.equalsIgnoreCase("famiglie")) {
        		
            	abitanti = service.getFamiglie(oggetto);
            	if (abitanti.size()==0) addMessaggio(request, Messaggio.WARNING, "Non sono presenti residenti");
            
            //statistica area + elenco abitanti
        	} else if (command.equalsIgnoreCase("statisticaCompletaAbitanti")) {
        		
        		statisticaCompleta = service.getStatisticaCompletaAbitanti(oggetto);
        		if (statisticaCompleta.getAbitanti().size()==0) addMessaggio(request, Messaggio.WARNING, "Non sono presenti residenti");
        	
        	//statistica area + elenco capifamiglia
        	} else if (command.equalsIgnoreCase("statisticaCompletaFamiglie")) {
        		
        		statisticaCompleta = service.getStatisticaCompletaFamiglie(oggetto);
        		if (statisticaCompleta.getAbitanti().size()==0) addMessaggio(request, Messaggio.WARNING, "Non sono presenti residenti");
        	
        	//statistica area + elenco abitanti suddivisi per fascie di età
        	} else if (command.equalsIgnoreCase("statisticaCompletaFasceEta")) {
        		
        		statisticaCompletaFasceEta = service.getStatisticaCompletaFasceEta(oggetto, perSesso, perNazionalita, codClassificazione);
        		if (statisticaCompletaFasceEta.getStatisticaArea().getResidenti()==0) addMessaggio(request, Messaggio.WARNING, "Non sono presenti residenti");
        		
        	} else {
        		
        		statistica = service.getStatisticaArea(oggetto);
        		if (statistica.getResidenti()==0) addMessaggio(request, Messaggio.WARNING, "Non sono presenti residenti");
        	}
        	
        	JSGeometry = oggetto.getJSGeometry();
        	
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
        
        setAfterForward(request, false, JSGeometry);
        
        request.setAttribute("key", key);
        request.setAttribute("codTPN", codTPN);
        request.setAttribute("statistica", statistica);
        request.setAttribute("abitanti", abitanti);
        request.setAttribute("statisticaCompleta", statisticaCompleta);
        request.setAttribute("statisticaCompletaFasceEta", statisticaCompletaFasceEta);
        
        forward(forward,request,response);
	}
	
	protected String getDefaultForward() {
		return null;
	}
}
