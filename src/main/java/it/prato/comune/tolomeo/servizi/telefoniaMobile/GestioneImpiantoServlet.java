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
package it.prato.comune.tolomeo.servizi.telefoniaMobile;

import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerTelefoniaMobile;
import it.prato.comune.sit.PuntoTelefoniaMobile;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITIllegalAttributeException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.servizi.telefoniaMobile.model.TelefoniaMobileService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.core.type.IdType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
public class GestioneImpiantoServlet extends TolomeoServlet {

	private static final long serialVersionUID = -2214008255667686338L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    @SuppressWarnings("unchecked")
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
    	
    	LogInterface logger = getLogger(request);
    	SITLayersManager comunePO = getTerritorio(logger);
    	TelefoniaMobileService service = null;
    	PuntoTelefoniaMobile impianto = null;
    	Boolean errors = false;
    	
    	String key = getKey(request);
    	String codTPN = request.getParameter("codTPN");
        String geoCoord = request.getParameter("geoCoord");
        String geoOp = request.getParameter("geoOp");
        //dati impianto
        String codImpianto = request.getParameter("codiceImpianto");
        String szdataInstallazione = request.getParameter("dataInstallazione");
        DateType dataInstallazione = null;
        String rilevatore = request.getParameter("rilevatore");
        //String indirizzo = request.getParameter("indirizzo");
        IdType viaIDTPN = new IdType(request.getParameter("viaIDTPN"));
        String numAutorizzazione = request.getParameter("numAutorizzazione");
        String tipoAutorizzazione = request.getParameter("tipoAutorizzazione");
        String descLocalizzazione = request.getParameter("descLocalizzazione");
        String suolo = request.getParameter("suolo");
        String note = request.getParameter("note");
        //gestori
    	String[] gestori = request.getParameterValues("gestore");
    	int[] codGestori = null;
    	if (gestori!=null) {
	    	codGestori = new int[gestori.length];
	    	for (int i=0; i<gestori.length; i++) {
	    		if (!StringUtils.isEmpty(gestori[i]))
	    			codGestori[i] = Integer.parseInt(gestori[i]);
	    	}
    	}
    	
    	//se sono presenti errori giro la richiesta alla pagina di errore
		if (StringUtils.isEmpty(codTPN)) {
			
			addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;

		} else if (StringUtils.isEmpty(geoOp)) {
			
			String errMsg = "Parametro geoOp non valorizzato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		}

		try {
			
			LayerTelefoniaMobile impianti = (LayerTelefoniaMobile) comunePO.getLayerByCodTPN(Integer.parseInt(codTPN));
			service = new TelefoniaMobileService(logger, impianti);
			
			//nell'inserimento creo un nuovo punto geometrico, nella modifica recupero il selezionato
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {
				
				if (StringUtils.isEmpty(geoCoord)) {
					String errMsg = "Parametro geoCoord non valorizzato";
					logger.error(errMsg);
					addMessaggio(request, Messaggio.ERRORE, errMsg);
					forward(TolomeoServlet.ERROR_PAGE, request, response);
		            return;
				}
				impianto = (PuntoTelefoniaMobile) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, geoCoord, logger);
				
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
				
				impianto = (PuntoTelefoniaMobile) impianti.cercaIDTPN(key);
			}
			
			//setto l'impianto
			impianto.setCodImpianto(codImpianto);
			if (!StringUtils.isEmpty(szdataInstallazione)) {
				impianto.setDataInstallazione(new DateType(szdataInstallazione));
			}
			impianto.setRilevatore(rilevatore);
			impianto.setIdVia(viaIDTPN);
			impianto.setNumAutorizzazione(numAutorizzazione);
			impianto.setTipoAutorizzazione(tipoAutorizzazione);
			impianto.setDescLocalizzazione(descLocalizzazione);
			impianto.setSuolo(suolo);
			impianto.setNote(note);
			
			//controllo validità dei parametri recuperati
			if (StringUtils.isEmpty(codImpianto)) {
				addMessaggio(request, Messaggio.ERRORE, "Codice è un campo obbligatorio!");
				errors = true;
			}
			if (!StringUtils.isEmpty(szdataInstallazione)) {
				
				dataInstallazione = new DateType();
				
	    		if (DateType.create(szdataInstallazione) == null) {
	    			addMessaggio(request, Messaggio.ERRORE, "Data non valida");
	    			errors = true;
	    		} else {
	    			dataInstallazione = new DateType(szdataInstallazione);
	    		}
			}
	    	if (StringUtils.isEmpty(rilevatore)) {
	    		addMessaggio(request, Messaggio.ERRORE, "Rilevatore è un campo obbligatorio!");
	    		errors = true;
	    	}
	    	if (descLocalizzazione.length()>500) {
	    		addMessaggio(request, Messaggio.ERRORE, "Descrizione localizzazione non può superare 500 caratteri");
	    		errors = true;
	    	}
	    	if (note.length()>1000) {
	    		addMessaggio(request, Messaggio.ERRORE, "Note non può superare 1000 caratteri");
	    		errors = true;
	    	}
	    	
	    	//se sono presenti errori ricarico i dati per la jsp di inserimento/modifica altrimenti eseguo l'append/modifyFeature
	    	if (errors) {
	    		request.setAttribute("impianto", impianto);
	    		request.setAttribute("errors", errors);
		    	forward("/telefoniaMobile/CaricaDatiImpiantoServlet", request, response);
		        return;
		        
	    	} else {

	    		if (!service.connetti()) {            
	    			String errMsg = "Errore di connessione al database.";
	    			logger.error(errMsg);
	    			addMessaggio(request, Messaggio.ERRORE, errMsg);
	    			forward(TolomeoServlet.ERROR_PAGE, request, response);
	    			return;           
	    		}
	    		
	    		if (geoOp.equals(Parametri.digitizeOperationInsert)) {
						
					service.insertTelefoniaMobile(impianti, impianto, codGestori);
					service.commit();
					
	    		} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
    				
	    			service.modifyTelefoniaMobile(impianti, impianto, codGestori);
    				service.commit();
	    		}
	    	}

		} catch (SITIllegalAttributeException e) {

			String errMsg = "Si è verificata un'eccezione durante l'aggiornamento dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
				
		} catch (SITException e) {
			
			String errMsg = "Si è verificata un'eccezione durante l'aggiornamento dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
			
		} catch(SQLException e) {
			
			String errMsg = "Si è verificata un'eccezione durante l'aggiornamento dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		
		} catch(IOException e) {    

			if (e.getCause().toString().indexOf("java.sql.SQLException") != -1) {
				if (e.getCause().getMessage().indexOf("ORA-00001") != -1) {
					String errMsg = "Il codice " + codImpianto + " è già presente";
					logger.error(errMsg,e);
					addMessaggio(request, Messaggio.ERRORE, errMsg);
					forward(request, response);
		            return;
				}
			} else {
			
				String errMsg = "Si è verificata un'eccezione durante l'aggiornamento dei dati";
	            logger.error(errMsg,e);
	            addMessaggio(request, Messaggio.ERRORE, errMsg);
	            forward(TolomeoServlet.ERROR_PAGE, request, response);
	            return;
			}
			
		} catch(Exception e) {
			
			String errMsg = "Si è verificata un'eccezione durante l'aggiornamento dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
			
		} finally {
			if(service != null) {
                service.disconnetti();
            }
		}
		
		addMessaggio(request, Messaggio.INFORMAZIONE, "Operazione eseguita con successo");
		setAfterForward(request, false, null);
		request.setAttribute("viaIDTPN",viaIDTPN);
		request.setAttribute("impianto",impianto);
		forward("/telefoniaMobile/VisualizzaImpiantoServlet", request, response);
    }
    
	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/telefoniaMobile/gestioneImpianto.jsp";
	}
}
