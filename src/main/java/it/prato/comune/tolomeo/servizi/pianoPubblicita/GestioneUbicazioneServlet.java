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
package it.prato.comune.tolomeo.servizi.pianoPubblicita;

import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.sit.plugin.comunePO.beans.pianoPubblicita.DecodificaBean;
import it.prato.comune.sit.plugin.comunePO.beans.pianoPubblicita.PraticaBean;
import it.prato.comune.sit.plugin.comunePO.dao.pianoPubblicita.UbicazioneDAO;
import it.prato.comune.sit.plugin.comunePO.pianoPubblicita.LayerUbicazioni;
import it.prato.comune.sit.plugin.comunePO.pianoPubblicita.PuntoUbicazione;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.utility.Submit;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class GestioneUbicazioneServlet extends TolomeoServlet {

	private static final long serialVersionUID = 1L;
	private static final String TIPO_OPERAZIONE_TERMINA   = "T";
	private static final String PAGE_VISUALIZZA_UBICAZIONE = "/pianoPubblicita/VisualizzaUbicazioneServlet";
	private static final String PAGE_GESTIONE_UBICAZIONE = "/jsp/servizi/pianoPubblicita/gestioneUbicazione.jsp";
	private static final String PAGE_NOTIFICA_UBICAZIONE = "/jsp/servizi/pianoPubblicita/notifica.jsp";

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    @SuppressWarnings("unchecked")
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
    	
    	LogInterface logger = getLogger(request);
    	Connection conn = null;
    	SITBeanContext context = null;
        List<DecodificaBean> classi = new ArrayList<DecodificaBean>();
        List<DecodificaBean> oggetti = new ArrayList<DecodificaBean>();
    	
        String geoOp   = getGeoOp(request);
        String szstep  = request.getParameter("step");
        int step       = StringUtils.isEmpty(szstep) ? 0 : Integer.parseInt(request.getParameter("step"));
        
        PuntoUbicazione ubicazione = (PuntoUbicazione)request.getAttribute("ubicazione");  
    	String JSGeometry = null;
    	
    	String forwardUrl = getDefaultForward();
    	String tipoOperazione = request.getParameter("tipoOperazione");   
		
		try {
			
			context = SITBeanContext.getInstance();
	        conn = context.getConnection(logger);
			
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {
			    
			    if (tipoOperazione != null && tipoOperazione.equals(TIPO_OPERAZIONE_TERMINA)){
	                
	                addInformazione(request, "Inserimento interrotto!");
	                addButton(request, new Submit(Input.CSS_STYLE_GENERICO,"nome","Home","Vai alla home"));
	                forwardUrl = PAGE_NOTIFICA_UBICAZIONE; 
	              
	            } else {
				
    				if (step==0 || step==1) {
    				    
    				    if(!areGeoParamsPresent(request)){
                            forwardUrl = TolomeoServlet.ERROR_PAGE_PANNELLO;
                        }else{                    
                            forwardUrl  = gestioneInserimento(request, conn, logger);
                        }    
    				    
    				} else if (step==2) {
                        
    				    if(!areGeoParamsPresent(request)){
                            forwardUrl = TolomeoServlet.ERROR_PAGE_PANNELLO;
                        }else{
                            forwardUrl  = inserisci(request, conn, logger);
                        }
                        
                    // GESTIONE INSERIMENTO STEP ERRRATO                
                    } else {
                        addErrore(request, "Step di inserimento inesistente");
                    }
	            }								
				
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
				
				//se durante la modifica sono stati riscontrati errori nella GestioneSinistroServelet non recupero i dati di quel sinistro ma visualizzo quelli che sono stati inseriti nel form
				//if (!errors) ubicazione = (PuntoUbicazione) layer.cercaIDTPN(key);
			    			    			    
			    // SE E' RICHIESTA L'INTERRUZIONE DI UNA MODIFICA
			    /*
	            if (tipoOperazione != null && tipoOperazione.equals(TIPO_OPERAZIONE_TERMINA)){
	                
	                String idCarto = getKey(request);
	                addInformazione(request, "Modifica Interrotta!");
	                forwardUrl = PAGE_VISUALIZZA_UBICAZIONE + "?IDTPN=" + idCarto;
	                
	            } else {
	            
	                // GESTIONE MODIFICA         
	                if (step==0 || step==1) {	                   
 
                        forwardUrl  = gestioneModifica(request, conCivilia, logger);                        
	                    
	                } else if (step==2) {
                        
                        if(!areGeoParamsPresent(request)){
                            forwardUrl = TolomeoServlet.ERROR_PAGE_PANNELLO;
                        }else{
                            forwardUrl  = modifica(request, conCivilia, logger);
                            //addButton(request, Input.MODIFICA_OK);
                        }
                
                    } else {
                        addErrore(request, "Step di inserimento inesistente");
                    }	                
        		}
        		*/
        	}
		
		} /*catch (SITException e) {
			
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(super.ERROR_PAGE, request, response);
            return;
            
		} */catch (SQLException e) {
			
			String errMsg = "Si è verificata un'eccezione SQL durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		
		} catch (BasicException e) {
			
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} finally {
			context.closeConnection(conn, logger);
		}

		setAfterForward(request, false, JSGeometry);
		request.setAttribute("ubicazione",ubicazione);
		
		request.setAttribute("classi",classi);
		request.setAttribute("oggetti",oggetti);


		forward(forwardUrl, request, response);
        return;
    }
    
    private String inserisci(HttpServletRequest request, Connection conCivilia, LogInterface logger)  {
        
        String zonaStr = request.getParameter("zona");
        String classeStr = request.getParameter("classe");
        String oggettoStr = request.getParameter("oggetto");
        
        int zona = 0;
        int classe = 0;
        int oggetto = 0;
        
        boolean isError = false;
        
        if(StringUtils.isEmpty(zonaStr) || zonaStr.equals("-1")){
            addErrore(request, "Il codice della zona deve essere valorizzato");
            isError = true;
        } else {
            try {
                zona = Integer.parseInt(zonaStr);
            }catch(NumberFormatException nfe){
                addErrore(request, "Il codice della zona deve essere un valore numerico intero");
                isError = true;
            }
        }
        
        if(StringUtils.isEmpty(classeStr) || classeStr.equals("-1")){
            addErrore(request, "Il codice della classe deve essere valorizzato");
            isError = true;
        } else {
            try {
                classe = Integer.parseInt(classeStr);
            }catch(NumberFormatException nfe){
                addErrore(request, "Il codice della classe deve essere un valore numerico intero");
                isError = true;
            }
        }
        
        if(StringUtils.isEmpty(oggettoStr) || oggettoStr.equals("-1")){
            addErrore(request, "Il codice dell'oggetto deve essere valorizzato");
            isError = true;
        } else {
            try {
                oggetto = Integer.parseInt(oggettoStr);
            }catch(NumberFormatException nfe){
                addErrore(request, "Il codice dell'oggetto deve essere un valore numerico intero");
                isError = true;
            }
        }
                
        if(isError){
            logger.debug("ERRORE ");
            for (Messaggio m: getMessaggioAttribute(request)){
                logger.debug(m.getTipo() + " = " + m.getMess());
            }
            
            return gestioneInserimento(request, conCivilia, logger);
        }
        
        SITLayersManager comunePO = null;
        LayerUbicazioni ubicazioni = null;
        PuntoUbicazione ubicazione = null;
        boolean inserito = false;
        
        try {
            
            comunePO = getTerritorio(logger);
            
            try {
                
                ubicazione = (PuntoUbicazione) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, getGeoCoord(request), logger);        
                
                ubicazione.setCodPrat(zona);
                ubicazione.setCodClasse(classe);
                ubicazione.setCodOggetto(oggetto);
                
                ubicazioni = LayerUbicazioni.getInstance(comunePO);        
                ubicazioni.appendFeature(ubicazione);
                
                inserito = true;
                      
            }catch(IOException ioe){
                String msg = "Errore durante il recupero del LayersManager";
                logger.error(msg,ioe);
                addErrore(request, msg); 
            }catch(SITException site){
                String msg = "Errore durante l'inserimento dei dati";
                logger.error(msg,site);
                addErrore(request, msg); 
            } 
            
        } catch(IOException ioe){            
            String msg = "Errore durante il recupero del LayersManager";
            logger.error(msg,ioe);
            addErrore(request, msg);             
        } finally {
            try {
                comunePO.dispose();
            } catch (SITException e) {
                logger.error("impossibile fare la dispose del LayersManager",e);
            }
        }     

        if(!inserito){
            addWarning(request, "L'inserimento non ha avuto successo!");
            return gestioneInserimento(request, conCivilia, logger);
        }else{         
            addInformazione(request, "Ubicazione correttamente inserita!");
            setAfterForward(request, true, null);
            request.setAttribute("ubicazione", ubicazione);
            return PAGE_VISUALIZZA_UBICAZIONE + "?IDTPN=" + ubicazione.getIDTPN(); 
        }   
        
    }
    
    private String gestioneInserimento(HttpServletRequest request, Connection conCivilia, LogInterface logger) {
        
        UbicazioneDAO ubicazioneDao = new UbicazioneDAO(logger);
        List<PraticaBean> zone = null;
        
        try {
            zone = ubicazioneDao.leggiZone(conCivilia);
            Collections.sort(zone);
        } catch (SQLException e){
            String msg = "Errore durante il recupero delle zone dal Database";
            logger.error(msg,e);
            addErrore(request, msg);
            return PAGE_NOTIFICA_UBICAZIONE;
        }
        
        request.setAttribute("zone",zone);
        
        addButton(request, Input.INSERISCI.onClick("this.form.step.value='2';")); 
        addButton(request, new Submit(Input.CSS_STYLE_TERMINA,"I","Termina","Interrompi l'inserimento").onClick("if(confirm('Interrompere l\\'inserimento?')){/*this.form.operazione.value = this.name;*/this.form.tipoOperazione.value = 'T';return true;}else{return false;};"));
        return PAGE_GESTIONE_UBICAZIONE;
        
    }
    
    private boolean areGeoParamsPresent(HttpServletRequest request){
        
        Integer codTPN = getCodTPN(request);                
        String geoCoord = getGeoCoord(request);
        String geoOp = getGeoOp(request);
        
        boolean present = true;
        // Questo non dovrebbe mai accadere essendo il framework Tolomeo a gestirlo
        if(codTPN == null){
            addErrore(request, "Il codice del layer deve essere valorizzato");               
            present = false;
        }
        
        // Questo non dovrebbe mai accadere essendo il framework Tolomeo a gestirlo
        if(geoCoord == null){
            addErrore(request, "Le coordinate della geometria non sono definite");               
            present = false;
        }
        
        // Questo non dovrebbe mai accadere essendo il framework Tolomeo a gestirlo
        if(geoOp == null){
            addErrore(request, "L'operazione geometrica da eseguire non è definita");               
            present = false;
        }
        
        return present;
    }
	
	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/pianoPubblicita/home.jsp";
	}
}
