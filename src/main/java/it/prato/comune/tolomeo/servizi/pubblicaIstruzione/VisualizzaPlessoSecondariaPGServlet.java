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
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
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
 * Tolomeo � un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo � un software libero; � possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo � distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 * IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo � sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
package it.prato.comune.tolomeo.servizi.pubblicaIstruzione;

import it.prato.comune.sit.LayerAnagrafe;
import it.prato.comune.sit.PoligonoTerritorio;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.pubblicaIstruzione.LayerPlessiSecondariePG;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.StatisticaPlessoSecondariaPG;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.model.PlessiScuoleService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servet che riceve la richiesta di visualizzazione della statistica di un plesso scuola secondaria primo grado e la dispaccia
 * alla jsp idonea.
 * @author Mattia Gennari
 *
 */
public class VisualizzaPlessoSecondariaPGServlet extends TolomeoServlet {    

	private static final long serialVersionUID = -972692424902593211L;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
		doPost(request,response);
	}
    
	@SuppressWarnings("unchecked")
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {

		String key = getKey(request);
		Integer codTPN = getCodTPN(request);
		String jsonGeometryToExtent = null;

		// Se sono presenti errori giro la richiesta alla pagina di errore
		if (StringUtils.isEmpty(key)) {

			addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
		}

		LogInterface logger = getLogger(request);

		StatisticaPlessoSecondariaPG statisticaPlesso = new StatisticaPlessoSecondariaPG();

		SITLayersManager comunePO = getTerritorio(logger);
		LayerPlessiSecondariePG plessiSecondariePG = (LayerPlessiSecondariePG) comunePO.getLayerByCodTPN(codTPN);
		LayerAnagrafe anagrafe = LayerAnagrafe.getInstance(comunePO); 

		// Cerco plesso selezionato
		PoligonoTerritorio plessoSecondariaPG = (PoligonoTerritorio) plessiSecondariePG.cercaIDTPN(key);

		if(plessoSecondariaPG == null){

			String errMsg = "Plesso " + key + " non trovato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
		}

		PlessiScuoleService service = new PlessiScuoleService(logger,anagrafe);

		if (!service.connetti()) {

			String errMsg = "Errore di connessione al database.";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;       
		}

		try {

			// Carico le statistiche dei bambini associati al plesso secondaria associato
			statisticaPlesso = service.getStatisticaPlessoSecondariaPG(plessoSecondariaPG);
			statisticaPlesso.setNomeLayer(plessiSecondariePG.getNome());

			jsonGeometryToExtent = plessoSecondariaPG.getJSGeometry();

		} catch(Exception e){

			String errMsg = "Si � verificata una eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;           

		} finally {

			if(service != null){
				service.disconnetti();
			}
		}

		request.setAttribute("statisticaSecondariaPG",statisticaPlesso);
		request.setAttribute("plessoSecondariaPG",plessoSecondariaPG);
		setAfterForward(request, false, jsonGeometryToExtent);
		forward(request,response);
	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/pubblicaIstruzione/visualizzaStatisticaPlessoSecondariaPG.jsp";
	}
}
