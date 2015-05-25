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
 * File:         TolomeoMainServlet.java
 * Function:     Servlet di default per avvio tolomeo
 * Author:       Alessandro Radaelli
 * Version:      1.0.0
 * CreationDate: 04/09/2007
 * ModifyDate:   
 ***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.HelpInfoConfig;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriHelpInfo;
import it.prato.comune.tolomeo.web.parametri.ParametriHelpInfoDetail;
import it.prato.comune.tolomeo.web.parametri.ParametriLayout;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet di default per avvio tolomeo. Provvede a recuperare il parametro che indica quale file xml di preset caricare, da questo crea un oggetto Parametri 
 * {@link Parametri} e lo completa con eventuali valori per i quali e' richiesto il calcolo a runtime. Passa poi il controllo a mappaTolomeo.jsp
 * 
 * Accetta in ingresso il seguente parametro:
 *  - paramPreset. contiene il nome del file di preset. Il nome effettivo su filesystem e' calcolato concatenando il valore della property PRESETFILENAME nel file
 *                 config.properties, paramPreset e ".xml"
 * 
 * @author Alessandro Radaelli
 */
public class TolomeoMainServlet extends TolomeoServlet {

	private static final long serialVersionUID = 7658945851540771368L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

	    SITLayersManager comunePO = null; 
	            
		// Recupero il logger
		LogInterface logger = getLogger(request);
		
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();              

		try {
		    
    		// Recupero oggetto Territorio
    		comunePO = getTerritorio(logger);
    		
    		// Creo l'oggetto parametri a partire dal file xml indicato
    		Parametri params = getParametri(request,comunePO, true);		
    		
    		request.setAttribute("params", params);
    		request.setAttribute("varName", "TolomeoExt.Vars.paramsJS");
    
    		request.setAttribute("TOLOMEOServer", getTolomeoServer(request));
    		request.setAttribute("TOLOMEOContext", request.getContextPath());
            request.setAttribute("TOLOMEOStaticRoot", getTolomeoStaticRoot(request.getContextPath()));                        

    		//request.setAttribute("viewer", viewer);
    		request.setAttribute("cssDebug", getCSSDebug());
    		request.setAttribute("jsDebug", getJSDebug());
    
    		request.setAttribute("googleAPIStato", getGoogleAPIStato());
    		request.setAttribute("googleAPIClientID", getGoogleAPIClientID());
    				
    		String tolomeoLayout = (String) request.getParameter("tolomeoLayout");
    		if (tolomeoLayout==null || tolomeoLayout.equals("")) {
    			tolomeoLayout = "TolomeoExt.ToloPanelIntra";
    		}
    		request.setAttribute("tolomeoLayout", tolomeoLayout);
    		
    		if (request.getParameter("ext")!=null) {
    			forward("/jsp/mappatolomeoExt.jsp", request, response);
    		} else {
    			forward("/jsp/mappa.jsp", request, response);
    		}
		
    	} finally {
    		if(comunePO != null){
                try {
                    comunePO.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager", e);
                }
            }
    	}
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}    
}
