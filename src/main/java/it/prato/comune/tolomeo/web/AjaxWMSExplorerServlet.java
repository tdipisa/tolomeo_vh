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
* File:         AjaxQueryServlet.java
* Function:     Servlet di default per query oggetti secondo criterio
* Author:       Alessandro Radaelli
* Version:      1.0.0
* CreationDate: 04/09/2007
* ModifyDate:   
***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.ows.WMSCapabilitiesBean;
import it.prato.comune.sit.ows.WMSLayerCapabilitiesBean;
import it.prato.comune.sit.ows.WMSService;
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
 * Questa classe implementa la servlet utilizzata da Tolomeo per ricevere le informazioni relative ad un WMS
 *  
 * Fornisce come risultato (direttamente nella response, essendo fatta per essere chiamata via ajax) la stringa JSON che rappresenta uno store extJS contenente le informazioni cercate
 * 
 * In caso di errore, oltre a scrive sul log, setta lo status della response a HttpServletResponse.SC_INTERNAL_SERVER_ERROR 
 * e ritorna un messaggio di errore nella response stessa.
 *         
 * @author Alessandro Radaelli
 * 
 */
public class AjaxWMSExplorerServlet extends TolomeoServlet {

    private static final long serialVersionUID = 7177996731299388440L;


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
        
        // Recupero il logger
        LogInterface logger = getLogger(request);   
        
        // Recupero i parametri
        //Integer codTPN        = getCodTPN(request);
        String callback     = request.getParameter("callback");
        
        String serverUrl 	= request.getParameter("serverUrl");
        
        // Parametri per il paging
        /*
        String page        = request.getParameter("page");
        String start       = request.getParameter("start");
        String limit       = request.getParameter("limit");
        
        Integer ipage        = null;
        Integer istart       = null;
        Integer ilimit       = null;
        
        if (page!=null && !page.equals("") &&
        	start!=null && !start.equals("") && 
        	limit!=null && !limit.equals("")) {
        		ipage = Integer.parseInt(page);
        		istart = Integer.parseInt(start);
        		ilimit = Integer.parseInt(limit);
        }
        */
        String risposta       = "";
        //String urlWMS = "http://web.regione.toscana.it:80/wmsraster/com.rt.wms.RTmap/wms?map=wmsofc&amp;version=1.1.0";
        
        try {
        	
    	    try {
				WMSService wms = new WMSService(serverUrl, logger);
				WMSCapabilitiesBean cap = wms.getCapabilities();
				
				JSONArray arr = new JSONArray();
				List<WMSLayerCapabilitiesBean> layers = cap.getLayers();
				for (WMSLayerCapabilitiesBean l: layers) {
					JSONObject ob = new JSONObject();
					
		    	    ob.put("name", l.getName());
		    	    ob.put("abstract", l.getLayerAbstract());
		    	    ob.put("title", l.getTitle());
		    	    ob.put("maxscaledenom", l.getMaxScaleDenominator());
		    	    ob.put("minscaledenom", l.getMinScaleDenominator());
		    	    //l.getStyles();
		    	    arr.add(ob);
				}
				
				risposta = SITExtStore.extStore(arr, null).toString();	
			} catch (SITException e) {
				String errMsg = "Eccezione " + e.getMessage();
	        	risposta = new ExtStoreError(e).toJSONString();
				logger.error(errMsg, e);
				response.setStatus(500);
			}
    	
        } catch (RuntimeException e) {        	
        	String errMsg = "Eccezione " + e.getMessage();
        	risposta = new ExtStoreError(e).toJSONString();
			logger.error(errMsg, e);
        }
        finally {
            // Rispondo con il risultato
	        request.setAttribute("suggest", risposta);
	        request.setAttribute("callback", callback);
	        forward(request, response);
	                	
        }
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/tolomeoAjaxWMSExplorer.jsp";
    }
}