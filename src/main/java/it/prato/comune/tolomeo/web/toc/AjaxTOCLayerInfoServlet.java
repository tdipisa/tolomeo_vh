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
* File:         AjaxTOCServlet.java
* Function:     Servlet per generazione legenda
* Author:       Alessandro Radaelli
* Version:      1.0.0
* CreationDate: 10/11/2007
* ModifyDate:   
***************************************************************/

package it.prato.comune.tolomeo.web.toc;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriServer;
import it.prato.comune.tolomeo.web.toc.geoserver.TOCGeoserverUti;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

/**
 * Servlet utilizzata per generale la legenda<br/>
 * Fornisce come risultato (direttamente nella response, essendo fatta per essere chiamata via ajax) la rappresentazione JSON della classe TOCBean 
 *
 * @author Alessandro Radaelli
 *
 */
public class AjaxTOCLayerInfoServlet extends TolomeoServlet { 

    private static final long serialVersionUID = -7334406694428962811L;

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

        String szUrl           	= request.getParameter("serverurl");
        String layerName		= request.getParameter("layername");
        String callback         = request.getParameter("callback");
        String tocBeanOutString   = "";
        
        LogInterface logger = getLogger(request);
        
        try {
        
        	ParametriServer ps = new ParametriServer();
        	ps.setAllowServerConnection(true);
        	ps.setId("XXXXX");
        	ps.setTypeDescription("WMS");
        	ps.setUrl(szUrl);
        	
        	TOCGeoserverUti tocGsUti = new TOCGeoserverUti(ps, logger);
        	
        	ParametriLegendaLayer lay = new ParametriLegendaLayer();
        	lay.setName(layerName);
        	//????lay.setServerID(serverID);
        	
        	//String styles = null;
        	String SRID = "EPSG:3003";
        	
        	TOCLayerBean tlb = tocGsUti.createLayer(lay, SRID);
        	
        	JSONObject jsToc = SITExtStore.extStoreSingleRecord(tlb, null);
	        tocBeanOutString = jsToc.toString();
	            
	        
        } catch (SITException e) {
    		logger.warn("SITException ",e);
    		tocBeanOutString = new ExtStoreError(e).toJSONString() ;
    	} catch (Exception e) { 
    		logger.error("Exception ",e);
    		tocBeanOutString = new ExtStoreError(e).toJSONString() ;
    	} catch (Throwable e) {
    		logger.error("Exception ",e);
    		//tocBeanOutString = new ExtStoreError(e).toJSONString() ;
    	} finally {
    	    
            request.setAttribute("tocBean", tocBeanOutString);  
            request.setAttribute("callback", callback);
    		try {
    			forward(request, response);
    		} catch (IOException e){
    			logger.warn("IOException ",e);
    		}	        		        	
    		
    	}
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/tolomeoAjaxLegendaExt.jsp";
    }
}