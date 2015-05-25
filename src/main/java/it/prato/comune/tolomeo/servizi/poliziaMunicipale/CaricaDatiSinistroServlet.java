/*******************************************************************************
 * Tolomeo is a developing framework for visualization, editing,  
 * geoprocessing and decisional support application based on    cartography.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * This file is part of Tolomeo.
 * 
 * Tolomeo is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
 * 
 * Tolomeo is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License along with Tolomeo; if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110­1301  USA
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
 * modificarlo sotto i termini della GNU Lesser General Public License come pubblicato  dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo è distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILITÀ o IDONEITÀ PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110­1301 USA
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
package it.prato.comune.tolomeo.servizi.poliziaMunicipale;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.plugin.comunePO.poliziaMunicipale.LayerSinistri;
import it.prato.comune.sit.plugin.comunePO.poliziaMunicipale.PuntoSinistro;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class CaricaDatiSinistroServlet extends TolomeoServlet {

	private static final long serialVersionUID = 2137080018341893080L;

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
    	
    	String key     = getKey(request);
    	Integer codTPN = getCodTPN(request);
        String geoOp   = request.getParameter("geoOp");
        
        PuntoSinistro sinistro = (PuntoSinistro)request.getAttribute("sinistro");
        boolean errors = (request.getAttribute("errors")!=null) ? (Boolean)request.getAttribute("errors") : false;
        
        LayerSinistri sinistri = null;
    	String JSGeometry = null;
    	
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
			
			sinistri = (LayerSinistri) comunePO.getLayerByCodTPN(codTPN);
			
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {
				
				addButton(request, Input.INSERISCI);
				
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
				
				//se durante la modifica sono stati riscontrati errori nella GestioneSinistroServelet non recupero i dati di quel sinistro ma visualizzo quelli che sono stati inseriti nel form
				if (!errors) sinistro = (PuntoSinistro) sinistri.cercaIDTPN(key);

				JSGeometry = sinistro.getJSGeometry();
				
				addButton(request, Input.MODIFICA_OK);
			}
		
		} catch (SITException e) {
			
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		}
		
		addButton(request, Input.PULISCI);
		setAfterForward(request, false, JSGeometry);
		request.setAttribute("anno",sinistri.anno);
		request.setAttribute("sinistro",sinistro);
		forward(request, response);
    }
	
	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/poliziaMunicipale/gestioneSinistro.jsp";
	}
}
