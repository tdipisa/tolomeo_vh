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
package it.prato.comune.tolomeo.servizi.elettorale;
 
import it.prato.comune.sit.LayerElettori;
import it.prato.comune.sit.LayerSezioniElettorali;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PoligonoSezioneElettorale;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.servizi.TolomeoServicesContext;
import it.prato.comune.tolomeo.servizi.elettorale.beans.ListaStatistiche;
import it.prato.comune.tolomeo.servizi.elettorale.beans.Statistica;
import it.prato.comune.tolomeo.servizi.elettorale.model.ElettoraleService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;


public class VisualizzaSezioneServlet extends TolomeoServlet {    

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
		
		if (StringUtils.isEmpty(key)) {
            
			// Se sono presenti errori giro la richiesta alla pagina di errore
			addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} 
       
        LogInterface logger = getLogger(request);
        ListaStatistiche listaStatisticheSezioni = new ListaStatistiche();
        List<Statistica> listaStatisticheConfinanti = new ArrayList<Statistica>();
        
        SITLayersManager comunePO = getTerritorio(logger);
		LayerSezioniElettorali sezioni = LayerSezioniElettorali.getInstance(comunePO);               
        
        // Cerco sezione selezionata
        PoligonoSezioneElettorale sezione = sezioni.cercaSezioneElettorale(Integer.parseInt(key));
        if(sezione == null){
            String errMsg = "Sezione " + key + " non trovata";
            logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
        }
        
        DateType dtVoto = getDataVotazione(request);
        if(dtVoto == null){
            String errMsg = "Data di votazione non trovata";
            logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
        }
        
        ElettoraleService service = new ElettoraleService(logger,LayerElettori.getInstance(comunePO));
        if (!service.connetti()) {            
            String errMsg = "Errore di connessione al database.";
            logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;           
        }
                        
        try {

            Statistica statisticaSelezionata = service.getStatisticheSezione(sezione,dtVoto);
            statisticaSelezionata.setJsonGeometry(sezione.getJSGeometry());                        
            
            // Cerco poligoni confinanti
            List<PoligonoSezioneElettorale> confinanti = null;
        
            try {            
                //confinanti = sezioni.chiInterseca(sezione,0);            
                confinanti = sezioni.chiConfina(sezione);
            } catch(SITException site){
                String errMsg = "Errore nella ricerca delle sezioni confinanti";
                logger.error(errMsg,site);
    			addMessaggio(request, Messaggio.ERRORE, errMsg);
    			forward(TolomeoServlet.ERROR_PAGE, request, response);
    			return;
            }
            
            logger.debug("sezioni confinanti (chiInterseca 0) = " + (confinanti.size()-1));
            
            for(PoligonoSezioneElettorale confinante: confinanti){
                if(!confinante.getNumeroSezione().equals(sezione.getNumeroSezione())){
                    Statistica statisticaConfinante = service.getStatisticheSezione(confinante,dtVoto);
                    statisticaConfinante.setJsonGeometry(confinante.getJSGeometry());
                    listaStatisticheConfinanti.add(statisticaConfinante);
                }
            }
            
            Collections.sort(listaStatisticheConfinanti,new Comparator(){
                public int compare(Object obj1, Object obj2){
                    return ((Statistica)obj2).getTotaleVotantiCamera() - ((Statistica)obj1).getTotaleVotantiCamera();
                }
            });
            
            List<OggettoTerritorio> tutte = new ArrayList<OggettoTerritorio>();
            tutte.add(sezione);
            tutte.addAll(confinanti);
            OggettoTerritorio ingombro = OggettoTerritorio.getUnione(tutte);
            
            listaStatisticheSezioni.setDtVoto(dtVoto);
            listaStatisticheSezioni.setSelezionata(statisticaSelezionata);
            listaStatisticheSezioni.setConfinanti(listaStatisticheConfinanti);
            listaStatisticheSezioni.setJsonGeometryIngombro(ingombro.getJSGeometry());
            
        } catch(Exception e){
                        
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
                                        
        request.setAttribute("sezioni",listaStatisticheSezioni); 
        logger.debug(getCommand(request));
        logger.debug(getForward(request));
        forward(request,response);        
                     		
	}
    
    /**
     * Restituisce la data delle votazioni, necessaria per trovare i votanti in senato.
     * Da vedere come e dove registrarla.
     * 
     * @param request
     * @return
     */
    private DateType getDataVotazione(HttpServletRequest request){
        //return DateType.create(request.getParameter("dt_voto"));
        return TolomeoServicesContext.getInstance().getServizioElettoraleProperties().getDtVoto();
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/servizi/elettorale/visualizzaSezione.jsp";
    }
    
}
