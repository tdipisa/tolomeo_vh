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
import it.prato.comune.tolomeo.servizi.edilizia.model.EdiliziaService;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class CaricaDatiDepositoServlet extends TolomeoServlet {

	private static final long serialVersionUID = 2137080018341893080L;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
		doPost(request,response);
	}

	@SuppressWarnings("unchecked")
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {

		PoligonoDepositiAperto deposito = (PoligonoDepositiAperto)request.getAttribute("deposito");
		PoligonoDepositiAperto depositoNewGeom = null;
		boolean errors = (request.getAttribute("errors")!=null) ?  (Boolean)request.getAttribute("errors") : false;

		String key = getKey(request);
		String forward = getForward(request);
		Integer codTPN = getCodTPN(request);
		String geoOp = getGeoOp(request);
		String geoCoord = getGeoCoord(request);

		LogInterface logger = getLogger(request);
		SITLayersManager comunePO = getTerritorio(logger);
		//String szJSGeometry = null;
		LayerDepositiAperto depositi = LayerDepositiAperto.getInstance(comunePO);
		EdiliziaService service = new EdiliziaService(logger, depositi);
		List<String> violazioni = new ArrayList<String>();

		//Se sono presenti errori giro la richiesta alla pagina di errore
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
		
			// Operazione di inserimento
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {

				JSGeometry jsGeometry = new JSGeometry(geoCoord,logger);
				depositoNewGeom = (PoligonoDepositiAperto)JSGeometry.jsGeometryToOggettoTerritorio(depositi, jsGeometry, logger);

				addInformazione(request, "Operazione di inserimento");
				violazioni = service.checkDeposito(request, comunePO, depositoNewGeom, depositoNewGeom);
				addButton(request, Input.INSERISCI);
				addButton(request, Input.PULISCI);

			// Operazione di modifica geometrica
			} else if (geoOp.equals(Parametri.digitizeOperationAdd) || geoOp.equals(Parametri.digitizeOperationSubtract) || 
					geoOp.equals(Parametri.operationFeatureVertexEditing) || geoOp.equals(Parametri.operationFeatureDragDrop)) {

				JSGeometry jsGeometry = new JSGeometry(geoCoord,logger);
				deposito = (PoligonoDepositiAperto) depositi.cercaIDTPN(key);
				depositoNewGeom = (PoligonoDepositiAperto)JSGeometry.jsGeometryToOggettoTerritorio(depositi, jsGeometry, logger);

				addInformazione(request, "Operazione di modifica geometrica");
				violazioni = service.checkDeposito(request, comunePO, deposito, depositoNewGeom);
				addButton(request, Input.MODIFICA_OK);

			// Operazione di modifica alfanumerica
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {

				//se durante la modifica sono stati riscontrati errori nella GestioneImpiantoServelet non recupero i dati di quell'impianto ma visualizzo quelli che sono stati inseriti nel form
				if (!errors) deposito = (PoligonoDepositiAperto) depositi.cercaIDTPN(key);

				//deposito.getNumPratica();
				//szJSGeometry = deposito.getJSGeometry();
				
				addInformazione(request, "Operazione di modifica alfanumerica");
				addButton(request, Input.MODIFICA_OK);
				addButton(request, Input.PULISCI);
			}

		} catch (SITException e) {

			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
		}

		for (int i=0; i<violazioni.size(); i++) {
			addWarning(request, violazioni.get(i));
		}
		request.setAttribute("geoCoord", geoCoord); 
		request.setAttribute("deposito", deposito);
		forward(forward, request, response);
	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/edilizia/gestioneDeposito.jsp";
	}
}
