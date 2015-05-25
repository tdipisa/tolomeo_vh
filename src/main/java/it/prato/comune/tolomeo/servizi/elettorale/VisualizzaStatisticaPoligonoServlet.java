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
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PoligonoPoligoniUtGenerici;
import it.prato.comune.sit.PoligonoSezioneElettorale;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.servizi.TolomeoServicesContext;
import it.prato.comune.tolomeo.servizi.elettorale.beans.Statistica;
import it.prato.comune.tolomeo.servizi.elettorale.model.ElettoraleService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;


public class VisualizzaStatisticaPoligonoServlet extends TolomeoServlet {    

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
        Statistica statistica = null;
        
        SITLayersManager comunePO = getTerritorio(logger);
		LayerTerritorio layer = comunePO.getLayerByCodTPN(getCodTPN(request));               
        
		OggettoTerritorio oggetto = layer.cercaIDTPN(key);        
        
        if(oggetto == null){
            String errMsg = "Oggetto " + key + " non trovata";
            logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
        }
        
        PoligonoPoligoniUtGenerici poligono = null;
        
        if(PoligonoPoligoniUtGenerici.class.isAssignableFrom(oggetto.getClass())){
            poligono = (PoligonoPoligoniUtGenerici)oggetto;
        }else{
            String errMsg = "La chiave " + key + " non corrisponde ad un oggetto di tipo poligono";
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

            statistica = service.getStatistichePoligono(poligono, dtVoto);
            statistica.setNumeroSezione(poligono.getID());
            statistica.setJsonGeometry(poligono.getJSGeometry());        
            
            request.setAttribute("statisticaPoligono",statistica);
            
            // PROVO CON SIMULAZIONE
            List<PoligonoSezioneElettorale> sezioniSottese = getSezioniSottese(comunePO,poligono,logger);
            List<Statistica> statisticheSezioni            = getStatisticheSezioniSottese(sezioniSottese, poligono, service, dtVoto, logger);
            List<Statistica> statistichePoligonoPerSezione = getStatistichePoligonoPerSezione(sezioniSottese,poligono,service,dtVoto,logger);
            
            request.setAttribute("statisticheSezioni",statisticheSezioni);
            request.setAttribute("statistichePoligonoPerSezione",statistichePoligonoPerSezione);            
                                    
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
        return "/jsp/servizi/elettorale/visualizzaStatisticaPoligono.jsp";
    }
    
    private List<PoligonoSezioneElettorale> getSezioniSottese(SITLayersManager comunePO, PoligonoPoligoniUtGenerici poligono, LogInterface logger) throws SITException {
                
        // Cerco sezioni sottese dal poligono        
        LayerSezioniElettorali sezioni = LayerSezioniElettorali.getInstance(comunePO); 
        
        List<PoligonoSezioneElettorale> sottese = null;
    
        try {            
            //confinanti = sezioni.chiInterseca(sezione,0);            
            sottese = sezioni.chiInterseca(poligono);
        } catch(Exception site){
            String errMsg = "Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID();
            logger.error(errMsg,site);            
            throw new SITException("Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID(),site);
        }
        
        return sottese;
        
    }
    
    private List<Statistica> getStatisticheSezioniSottese(List<PoligonoSezioneElettorale> sezioniSottese, PoligonoPoligoniUtGenerici poligono, ElettoraleService service, DateType dtVoto, LogInterface logger) throws SITException{
        
        List<Statistica> listaStatisticheSottese = new ArrayList<Statistica>();
                            
        for(PoligonoSezioneElettorale sottesa: sezioniSottese){
            
            Statistica statisticaSezioneSottesa = service.getStatisticheSezione(sottesa,dtVoto);
            statisticaSezioneSottesa.setJsonGeometry(sottesa.getJSGeometry());
            listaStatisticheSottese.add(statisticaSezioneSottesa);
            
        }
        
        Collections.sort(listaStatisticheSottese,new Comparator(){
            public int compare(Object obj1, Object obj2){
                return ((Statistica)obj2).getTotaleVotantiCamera() - ((Statistica)obj1).getTotaleVotantiCamera();
            }
        });
                        
        return listaStatisticheSottese;
    }
    
    private List<Statistica> getStatistichePoligonoPerSezione(List<PoligonoSezioneElettorale> sezioniSottese, PoligonoPoligoniUtGenerici poligono, ElettoraleService service, DateType dtVoto, LogInterface logger) throws SITException{
        
        List<Statistica> listaStatisticheSottese = new ArrayList<Statistica>();
                            
        for(PoligonoSezioneElettorale sottesa: sezioniSottese){
            PoligonoSezioneElettorale intersezioneSottesa = null;
            try {
                intersezioneSottesa = (PoligonoSezioneElettorale)sottesa.getLayer().creaNuovoOggettoTerritorio();
            } catch (IOException ioe) {
                String msg = "Impossibile creare nuovo oggetto dalla sezione sottesa " + sottesa.getNumeroSezione();
                logger.error(msg);
                throw new SITException(msg,ioe);
            }
            intersezioneSottesa.setGeometryAttributeWKT(sottesa.getGeometryAttributeWKT());
            intersezioneSottesa.setIDTPN(sottesa.getIDTPN());            
            intersezioneSottesa.intersezione(poligono);
            Statistica statisticaIntersezioneSottesa = service.getStatistichePoligono(intersezioneSottesa, dtVoto);
            statisticaIntersezioneSottesa.setNumeroSezione(""+sottesa.getNumeroSezione());            
            statisticaIntersezioneSottesa.setJsonGeometry(intersezioneSottesa.getJSGeometry());
            listaStatisticheSottese.add(statisticaIntersezioneSottesa);
            
        }
                                       
        return listaStatisticheSottese;
    }
    
}
