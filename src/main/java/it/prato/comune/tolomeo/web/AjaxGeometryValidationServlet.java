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

import it.prato.comune.errors.SITBaseError;
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * Servlet utilizzata per fare la validazione di una geometria su un particolare layer.<br/>
 * La servlet accetta in ingresso i seguenti parametri passati in get o post:
 * <ul>
 *  <li>codTPN - Codice identificativo del layer all'interno del quale volgiamo fare la ricerca </li>
 *  <li>geoCoord - oggetto la cui geometria deve essere validata </li>
 *  <li>geoOp - operazione di editing in corso
 * </ul>
 * 
 * Fornisce come risultato (direttamente nella response, essendo fatta per essere chiamata via ajax) una stringa JSON contenente un array di rappresentazioni 
 * JSON di oggetti SITBaseError in caso di errore, ed un array vuoto nel caso la validazione abbia successo
 * 
 * In caso di errore, oltre a scrive sul log, setta lo status della response a HttpServletResponse.SC_INTERNAL_SERVER_ERROR 
 * e ritorna un messaggio di errore nella response stessa.
 *
 * @author Alessandro Radaelli
 *
 */
public class AjaxGeometryValidationServlet extends TolomeoServlet {

    private static final long serialVersionUID = 6398616900402854756L;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);           
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        Integer codTPN  = getCodTPN(request);
        String geoCoord = request.getParameter("geoCoord");
        //String geoOp    = request.getParameter("geoOp");
        String callback = request.getParameter("callback");
        String format   = request.getParameter("format");
        
        // Recupero oggetto Territorio
        LogInterface logger   = getLogger(request);
        SITLayersManager comunePO = null;
        LayerTerritorio layer = null;
        String risposta = null;
        
        try {
        	
            comunePO = getTerritorio(logger);
            layer = comunePO.getLayerByCodTPN(codTPN);
            
            List<SITBaseError> errors = layer.validateGeometry(geoCoord);
            
            if ((format!=null) && (format.equals("ext"))) {
            	
                SITBaseError sbe = new SITBaseError("");
                JSONArray arr = new JSONArray();
                arr.addAll(errors);
                JSONObject metaData = SITExtStore.extStoreMetadata(sbe, null);
                
                risposta = SITExtStore.extStore(metaData, arr, null).toString();
                
            } else {
            	
                Object[] errStringArray = new String[0];
                
                if (errors!=null) {
                    errStringArray = errors.toArray(new Object[0]);  
                } 
               
                JSONObject jsObj = new JSONObject();
                jsObj.put("errori", errStringArray);
                risposta  = jsObj.toString();    
            }
            
        } catch (SITException e) {
        	
        	String errMsg = "SITException in AjaxGeometryValidationServlet durante la ricerca";
        	risposta = new ExtStoreError(e).toJSONString();
            logger.error(errMsg, e);
        	
//            logger.warn("SITException in AjaxGeometryValidationServlet", e);
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//            response.getWriter().append(e.getMessage());
            
        } finally {
        	            
            if(comunePO != null){            
                try {
                    comunePO.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager",e);
                }
            }
            
        	request.setAttribute("errori", risposta);     
            request.setAttribute("callback", callback);   
            request.setAttribute("format", format);   
            forward(request, response);
                        
        }
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/tolomeoAjaxGeometryValidate.jsp";
    }
}