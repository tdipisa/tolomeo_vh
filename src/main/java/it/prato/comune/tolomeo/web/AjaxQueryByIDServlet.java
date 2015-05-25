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
/**************************************************************
 * Copyright © 2007 Comune di Prato - All Right Reserved
 * Project:      Tolomeo - WebGis con funzioni di editing
 * File:         AjaxSpatialQueryServlet.java
 * Function:     Servlet di default per ricerca oggetti in un punto. Utilizzata per la selezione di oggetti
 * Author:       Alessandro Radaelli
 * Version:      1.0.0
 * CreationDate: 04/09/2007
 * ModifyDate:   
 ***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.JSGeometry;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * Servlet utilizzata per ricavare l'oggetto di un certo layer che ha una certa IDTPN.<br/>
 * La servlet accetta in ingresso i seguenti parametri passati in get o post:
 * <ul>
 *  <li>codTPN - Codice identificativo del layer all'interno del quale volgiamo fare la ricerca </li>
 *  <li>IDTPN  - Identificativo dell'oggetto cercato</li>
 *  <li>SRID   - Identificativo del sistema di riferimento nel quale deve essere la risposta</li>
 * </ul>
 * 
 * Fornisce come risultato (direttamente nella response, essendo fatta per essere chiamata via ajax) la stringa JSON che rappresenta un
 * oggetto di tipo {@link it.prato.comune.sit.JSGeometryArray} JSGeometryArray.
 * 
 * In caso di errore, oltre a scrive sul log, setta lo status della response a HttpServletResponse.SC_INTERNAL_SERVER_ERROR 
 * e ritorna un messaggio di errore nella response stessa.
 *
 * @author Alessandro Radaelli
 *
 */
public class AjaxQueryByIDServlet extends TolomeoServlet {

	private static final long serialVersionUID = 6398616900402854756L;


	@Override
	public void init(ServletConfig config) throws ServletException
	{
		super.init(config);           
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		Integer codTPN   = getCodTPN(request);
		String  IDTPN    = getKey(request);
		String  srid     = request.getParameter("SRID");
		String  callback = request.getParameter("callback");
		String  format   = request.getParameter("format");

		LogInterface logger   = getLogger(request);
		SITLayersManager comunePO = null;
		LayerTerritorio layer = null;
		String risposta = null;

		try {
		    
		    comunePO = getTerritorio(logger);
	        layer = comunePO.getLayerByCodTPN(codTPN);
			
			ArrayList<OggettoTerritorio> oggs = new ArrayList<OggettoTerritorio>();
			
			// Divido eventuali id multipli
			String[] IDs = IDTPN.split("\\|\\|");
			
			// per tutti gli id
			for (String id: IDs){
				// Cerco oggetto
				OggettoTerritorio ogg = layer.cercaIDTPN(id);
				if (ogg!=null) oggs.add(ogg);
			}

			// Converto nel formato appropriato e rispondo
			if ((format!=null) && (format.equals("ext"))) {
				risposta = SITExtStore.extStoreSingleRecord( JSGeometry.oggettoTerritorioToJSGeometryArray(oggs, srid, logger).toString(), null).toString();
			} else {
				risposta = JSGeometry.oggettoTerritorioToJSGeometryArray(oggs, srid, logger).toString();                
			}

		} catch (SITException e) {

			String errMsg = "SITException in AjaxQueryByIDServlet durante la ricerca";
        	risposta = new ExtStoreError(e).toJSONString();
            logger.error(errMsg, e);

//          logger.warn("SITException in AjaxQueryByIDServlet", e);
//			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//			response.getWriter().append(e.getMessage());

		} finally {

	        if(comunePO != null){            
                try {
                    comunePO.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager",e);
                }
            }
	        
			request.setAttribute("geometry", risposta);
			request.setAttribute("callback", callback);
			request.setAttribute("format", format);
			forward(request, response);
    			    		 
		}

	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/tolomeoAjaxQueryByID.jsp";
	}
}