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
package it.prato.comune.tolomeo.servizi.pau;

import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerPAU;
import it.prato.comune.sit.PoligonoPAU;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITIllegalAttributeException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.core.type.TsType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class GestionePrenotazioneServlet extends TolomeoServlet {

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
    	
    	LogInterface logger       = getLogger(request);
    	SITLayersManager comunePO       = getTerritorio(logger);
    	PoligonoPAU poligonoPau   = null;
    	Boolean errors            = false;
    	
    	String key      = getKey(request);
    	Integer codTPN  = getCodTPN(request);
        String geoCoord = getGeoCoord(request);
        String geoOp    = getGeoOp(request);
        String idCategoria       = request.getParameter("idCategoria");
        String idServizio        = request.getParameter("idServizio");
        String referente         = request.getParameter("referente");
        String organizzazione    = request.getParameter("organizzazione");
        String telOrganizzazione = request.getParameter("telOrganizzazione");
        String localizzazione    = request.getParameter("localizzazione");
        String dataInizio        = request.getParameter("dataInizio");
        String oraInizioH        = request.getParameter("oraInizioH");
        String oraInizioM        = request.getParameter("oraInizioM");
        String dataFine          = request.getParameter("dataFine");
        String oraFineH          = request.getParameter("oraFineH");
        String oraFineM          = request.getParameter("oraFineM");
        String descBreve         = request.getParameter("descBreve");
        String descEstesa        = request.getParameter("descEstesa");
        String note              = request.getParameter("note");
        String priorita          = request.getParameter("priorita");
        String stato             = request.getParameter("stato");
        TsType dataOraInizio = null;
        TsType dataOraFine   = null;
    	
    	//se sono presenti errori giro la richiesta alla pagina di errore
		if (codTPN==null) {
			
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
			
			LayerPAU layerPau = (LayerPAU) comunePO.getLayerByCodTPN(codTPN);
			
			//nell'inserimento creo un nuovo punto geometrico, nella modifica recupero il selezionato
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {
				
				if (StringUtils.isEmpty(geoCoord)) {
					String errMsg = "Parametro geoCoord non valorizzato";
					logger.error(errMsg);
					addMessaggio(request, Messaggio.ERRORE, errMsg);
					forward(TolomeoServlet.ERROR_PAGE, request, response);
		            return;
				}
				poligonoPau = (PoligonoPAU) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, geoCoord, logger);
				
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
				
				poligonoPau = (PoligonoPAU) layerPau.cercaIDTPN(key);
			
			} else if (geoOp.equals(Parametri.operationFeatureClone)) {
				
				poligonoPau = (PoligonoPAU) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, geoCoord, logger);
			}

			//setto la PAU
			if (StringUtils.isNotEmpty(idCategoria)) poligonoPau.setIdCategoria(Long.parseLong(idCategoria));
			if (StringUtils.isNotEmpty(idServizio))  poligonoPau.setIdServizio(Long.parseLong(idServizio));
			poligonoPau.setReferente(referente);
			poligonoPau.setOrganizzazione(organizzazione);
			poligonoPau.setTelOrganizzazione(telOrganizzazione);
	    	poligonoPau.setLocalizzazione(localizzazione);
	    	if (StringUtils.isEmpty(dataInizio)) poligonoPau.setDataOraInizio(new TsType(TsType.INIZIO_DEI_TEMPI));
	    	if (StringUtils.isEmpty(dataFine))   poligonoPau.setDataOraFine(new TsType(TsType.INIZIO_DEI_TEMPI));
	    	poligonoPau.setDescBreve(descBreve);
	    	poligonoPau.setDescEstesa(descEstesa);
	    	poligonoPau.setNote(note);
	    	if (StringUtils.isNotEmpty(priorita)) poligonoPau.setPriorita(Integer.parseInt(priorita));
	    	if (StringUtils.isNotEmpty(stato))    poligonoPau.setStato(Integer.parseInt(stato));
			
			//controllo validità dei parametri recuperati
			if (StringUtils.isEmpty(idCategoria)) {
				addMessaggio(request, Messaggio.ERRORE, "Seleziona una tipologia/categoria!");
				errors = true;
			}
			if (StringUtils.isEmpty(dataInizio)) {
				logger.debug("Data fine è un campo obbligatorio!");
    			addMessaggio(request, Messaggio.ERRORE, "Data inizio è un campo obbligatorio!");
    			errors = true;
			} else {
	    		if (TsType.create(dataInizio) == null) {
	    			logger.debug("Data inizio non valida");
	    			addMessaggio(request, Messaggio.ERRORE, "Data inizio non valida");
	    			errors = true;
	    		} else {
	    			String [] dataSep = dataInizio.split("/");
	    			dataOraInizio = new TsType(dataSep[2] + dataSep[1] + dataSep[0] + StringUtils.leftPad(oraInizioH, 2, "0") + oraInizioM + "0000");
	    			poligonoPau.setDataOraInizio(dataOraInizio);
	    		}
			}
			if (StringUtils.isEmpty(dataFine)) {
    			addMessaggio(request, Messaggio.ERRORE, "Data fine è un campo obbligatorio!");
    			errors = true;
			} else {
	    		if (TsType.create(dataFine) == null) {
	    			addMessaggio(request, Messaggio.ERRORE, "Data non valida");
	    			errors = true;
	    		} else {
	    			String [] dataSep = dataFine.split("/");
	    			dataOraFine = new TsType(dataSep[2] + dataSep[1] + dataSep[0] + StringUtils.leftPad(oraFineH, 2, "0") + oraFineM + "0000");
	    			poligonoPau.setDataOraFine(dataOraFine);
	    		}
			}
			if (dataOraFine.before(dataOraInizio)) {
				addMessaggio(request, Messaggio.ERRORE, "La data e ora di fine deve essere successiva a quella di inizio!");
	    		errors = true;
			}
	    	if (StringUtils.isEmpty(descBreve)) {
	    		addMessaggio(request, Messaggio.ERRORE, "Descrizione breve è un campo obbligatorio!");
	    		errors = true;
	    	}
	    	if (descEstesa.length()>2000) {
	    		addMessaggio(request, Messaggio.ERRORE, "Descrizione estesa non può superare 2000 caratteri");
	    		errors = true;
	    	}
	    	if (note.length()>2000) {
	    		addMessaggio(request, Messaggio.ERRORE, "Note non può superare 2000 caratteri");
	    		errors = true;
	    	}
	    	
	    	//se sono presenti errori ricarico i dati per la jsp di inserimento/modifica altrimenti eseguo l'append/modifyFeature
	    	if (errors) {
	    		request.setAttribute("poligonoPau", poligonoPau);
	    		request.setAttribute("errors", errors);
		    	forward("/pau/CaricaDatiPrenotazioneServlet", request, response);
		        return;
	    	} else {
	    		//...altrimenti insetrisco/modifico i dati
	    		if (geoOp.equals(Parametri.digitizeOperationInsert) || geoOp.equals(Parametri.operationFeatureClone)) {
					layerPau.appendFeature(poligonoPau);
	    		} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
	    			layerPau.modifyFeature(poligonoPau);
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
			
		} catch(Exception e) {
			
			String errMsg = "Si è verificata un'eccezione durante l'aggiornamento dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		}
		
		addMessaggio(request, Messaggio.INFORMAZIONE, "Operazione eseguita con successo");
		setAfterForward(request, false, null);
		request.setAttribute("poligonoPau",poligonoPau);
		forward("/pau/VisualizzaPrenotazioneServlet", request, response);
    }
    
	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/pau/gestionePrenotazione.jsp";
	}
}
