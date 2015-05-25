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
package it.prato.comune.tolomeo.servizi.fibreOttiche;
 
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.sit.plugin.comunePO.beans.fibreOttiche.NodoBean;
import it.prato.comune.sit.plugin.comunePO.dao.fibreOttiche.NodoDAO;
import it.prato.comune.sit.plugin.comunePO.fibreOttiche.LayerTratte;
import it.prato.comune.sit.plugin.comunePO.fibreOttiche.LayerTratteDiss;
import it.prato.comune.sit.plugin.comunePO.fibreOttiche.LineaTratta;
import it.prato.comune.sit.plugin.comunePO.fibreOttiche.LineaTrattaDiss;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class VisualizzaTrattaServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    @SuppressWarnings("static-access")
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
              
    	LogInterface logger = getLogger(request);
    	SITLayersManager comunePO = getTerritorio(logger);
		SITBeanContext context = SITBeanContext.getInstance();
		Connection conn = null;
		
        String key     = getKey(request);
        Integer codTPN = getCodTPN(request);
        LineaTrattaDiss trattaDiss = (LineaTrattaDiss) request.getAttribute("tratta");
        String JSGeometry = null;
        
        LayerTratteDiss layTratteDiss = (LayerTratteDiss) comunePO.getLayerByCodTPN(codTPN);
        LayerTratte     layTratte     = new LayerTratte().getInstance(comunePO);
        
        NodoDAO nodoDAO = new NodoDAO(logger);
        NodoBean nodo1  = new NodoBean();
        NodoBean nodo2  = new NodoBean();
        
        @SuppressWarnings("unused")
		ArrayList<LineaTratta> listaTratte = new ArrayList<LineaTratta>();
        
        //se la tratta non è presente in request lo cerco tramite la key
        if (trattaDiss == null) {
        	
	        //Se sono presenti errori giro la richiesta alla pagina di errore
			if (StringUtils.isEmpty(key)) {
	            
				addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
	            forward(super.ERROR_PAGE, request, response);
	            return;
			}
	       
	        //cerco tratta
			trattaDiss = (LineaTrattaDiss) layTratteDiss.cercaIDTPN(key);
			
	        if (trattaDiss == null) {
				String errMsg = "tratta " + key + " non trovato";
				logger.error(errMsg);
				addMessaggio(request, Messaggio.ERRORE, errMsg);
				forward(super.ERROR_PAGE, request, response);
				return;
	        }
        }
		
        try {
        	
			JSGeometry = trattaDiss.getJSGeometry();
			
			//cerco nodi associati
			conn = context.getConnection(logger);
			nodo1 = nodoDAO.leggiNodo(conn, trattaDiss.getNodo1());
			nodo2 = nodoDAO.leggiNodo(conn, trattaDiss.getNodo2());
			
			//cerco le singole tratte
			logger.debug("cerco le singole tratte con num tartta " + trattaDiss.getNTratta() + "...");
			listaTratte = layTratte.cercaTrattaByNum(""+trattaDiss.getNTratta());
			logger.debug("tratte trovate: " + listaTratte.size());
			
		} catch (SITException e) {

			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(super.ERROR_PAGE, request, response);
            return;
            
		} catch (SQLException e) {

			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(super.ERROR_PAGE, request, response);
            return;
            
		} catch (BasicException e) {

			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(super.ERROR_PAGE, request, response);
            return;
		
		} finally {
			context.closeConnection(conn, logger);
		}
        
        setAfterForward(request, false, JSGeometry);
        request.setAttribute("trattaDiss",trattaDiss);
        request.setAttribute("nodo1",nodo1);
        request.setAttribute("nodo2",nodo2);
        request.setAttribute("listaTratte",listaTratte);
        forward(request,response);
    }

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/fibreOttiche/visualizzaTratta.jsp";
	}
}
