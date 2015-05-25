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
package it.prato.comune.tolomeo.servizi.gss;
 
import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.asm.PuntoUbicazioni;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.sql.SQLException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;


public class InserisciUbicazioniServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
       
        String idTPN = request.getParameter("idTPN");
        String codTPN = request.getParameter("codTPN");
        String geoCoord = request.getParameter("geoCoord");
        String geoOp = request.getParameter("geoOp");
        
        String rifStrad = request.getParameter("rifStrad");
        String rifCiv= request.getParameter("rifCiv");
        String descrizione= request.getParameter("descrizione");

        LogInterface logger = getLogger(request);
        SITLayersManager comunePO = getTerritorio(logger);
        
        //Se sono presenti errori giro la richiesta alla pagina di errore
		if (StringUtils.isEmpty(codTPN)) {

			addMessaggio(request, Messaggio.ERRORE, "Chiave layer non valorizzata");
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} else if (StringUtils.isEmpty(geoCoord) && (geoOp.equals(Parametri.digitizeOperationInsert))) {
			
			String errMsg = "Parametro geoCoord non valorizzato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
	        
		}  else if (StringUtils.isEmpty(rifStrad)) {
            
            String errMsg = "Parametro rifStrad non valorizzato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
        } else if (StringUtils.isEmpty(rifCiv)) {
            
            String errMsg = "Parametro rifCiv non valorizzato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
        } else if (StringUtils.isEmpty(descrizione)) {
            
            String errMsg = "Parametro descrizione non valorizzato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
        }
        
		try {
			
			LayerTerritorio layer = comunePO.getLayerByCodTPN(Integer.parseInt(codTPN));
			
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {
			    PuntoUbicazioni ubi =(PuntoUbicazioni) JSGeometry.jsGeometryToOggettoTerritorio(comunePO, geoCoord, logger);

			    ubi.setDescrizione(descrizione); 
    			ubi.setRiferimentoCivico(Long.parseLong(rifCiv));
    			ubi.setRiferimentoStradale(Long.parseLong(rifStrad));
    			
    			layer.appendFeature(ubi);
    			
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
			    PuntoUbicazioni ubi = (PuntoUbicazioni) layer.cercaIDTPN(idTPN);
			    
			    ubi.setDescrizione(descrizione);   
                ubi.setRiferimentoCivico(Long.parseLong(rifCiv));
                ubi.setRiferimentoStradale(Long.parseLong(rifStrad));
                layer.modifyFeature(ubi);
			}
			
		} catch (NumberFormatException e) {

			String errMsg = "Si è verificata un'eccezione durante l'inserimento";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} catch (SQLException e) {

			String errMsg = "Si è verificata un'eccezione durante l'inserimento";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
			
		} catch (SITException e) {
			
			if (e.getSQLErrorCode()==1) {
				
				String errMsg = "Identificativo ubicazione duplicato!";
				logger.error(errMsg,e);
				addMessaggio(request, Messaggio.ERRORE, errMsg);
				forward(request, response);
	            return;
	            
			} else {
			
				String errMsg = "Si è verificata un'eccezione durante l'inserimento";
	            logger.error(errMsg,e);
	            addMessaggio(request, Messaggio.ERRORE, errMsg);
	            forward(TolomeoServlet.ERROR_PAGE, request, response);
	            return;
			}
		}
        
		addMessaggio(request, Messaggio.INFORMAZIONE, "Ubicazione inserita correttamente");
		setAfterForward(request, true, null);
		forward("/jsp/servizi/gss/welcome.jsp", request, response);
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}
}
