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
package it.prato.comune.tolomeo.servizi.edilizia;
 
import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerDepositiAperto;
import it.prato.comune.sit.PoligonoDepositiAperto;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class GestioneDepositoServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 305364695960068108L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
    	
    	String key = getKey(request);
        String codTPN = request.getParameter("codTPN"); 
        String geoCoord = request.getParameter("geoCoord");
        String geoOp = request.getParameter("geoOp");
        
        String numPratica = request.getParameter("numPratica");
        String note = request.getParameter("note");

        LogInterface logger = getLogger(request);
        SITLayersManager comunePO = getTerritorio(logger);
        
        PoligonoDepositiAperto deposito = null;
		
        //Se sono presenti errori giro la richiesta alla pagina di errore
		if (StringUtils.isEmpty(codTPN)) {
			
			addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} else if (StringUtils.isEmpty(numPratica)) {
			
			addMessaggio(request, Messaggio.ERRORE, "Inserisci il numero pratica del deposito all'aperto!");
			forward(request, response);
            return;

		} else if (StringUtils.isEmpty(geoOp)) {
			
			String errMsg = "Parametro geoOp non valorizzato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} else if (note.length()>4000) {
			
			addMessaggio(request, Messaggio.ERRORE, "Il campo note non può superare 4000 caratteri");
			forward(request, response);
            return;
		}
        
		try {
			
			LayerDepositiAperto depositi = (LayerDepositiAperto) comunePO.getLayerByCodTPN(Integer.parseInt(codTPN));
			
			// Operazione di inserimento
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {

				//controllo il parametro heoCoord poichè ho bisogno della geom
				if (StringUtils.isEmpty(geoCoord)) {
					String errMsg = "Parametro geoCoord non valorizzato";
					logger.error(errMsg);
					addMessaggio(request, Messaggio.ERRORE, errMsg);
					forward(TolomeoServlet.ERROR_PAGE, request, response);
		            return;
				}
				
				//setto la geom e i dati alfanumerici
				deposito = (PoligonoDepositiAperto) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, geoCoord, logger);
				deposito.setNumPratica(numPratica);
				deposito.setNote(note);
						
				//inserisco l'oggetto nel layer specifico
				depositi.appendFeature(deposito);
			
			// Operazione di modifica geometrica
			} else if (geoOp.equals(Parametri.digitizeOperationAdd) || geoOp.equals(Parametri.digitizeOperationSubtract) || 
					geoOp.equals(Parametri.operationFeatureVertexEditing) || geoOp.equals(Parametri.operationFeatureDragDrop)) {

				//controllo il parametro heoCoord poichè ho bisogno della geom
				if (StringUtils.isEmpty(geoCoord)) {
					String errMsg = "Parametro geoCoord non valorizzato";
					logger.error(errMsg);
					addMessaggio(request, Messaggio.ERRORE, errMsg);
					forward(TolomeoServlet.ERROR_PAGE, request, response);
		            return;
				}
				
				//recupero il poligono e intercetto la nuova geometria
				deposito = (PoligonoDepositiAperto) depositi.cercaIDTPN(key);
				
				//modifico la geom
				comunePO.EditManager(Integer.parseInt(codTPN), key, null, geoCoord, geoOp);
			
			// Operazione di modifica alfanumerica
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {

				//recupero il poligono dal layer
				deposito = (PoligonoDepositiAperto) depositi.cercaIDTPN(key);
				
				//setto i campi che lo descrivono
				deposito.setNumPratica(numPratica);
				deposito.setNote(note);
				
				//modifico l'oggetto nel layer specifico
				depositi.modifyFeature(deposito);
			}

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
		request.setAttribute("IDTPN",deposito.getIDTPN());
		forward("/edilizia/VisualizzaDepositoServlet", request, response);
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}
}
