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

package it.prato.comune.tolomeo.web.composer;


import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;

import java.io.IOException;

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
public class ComposerServlet extends TolomeoServlet {

	private static final long serialVersionUID = 7658945851540771368L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// Recupero il logger
		// LogInterface logger = getLogger(request);

		request.setAttribute("varName", "TolomeoExt.Vars.paramsJS");

		request.setAttribute("TOLOMEOServer", getTolomeoServer(request));
		request.setAttribute("TOLOMEOContext", request.getContextPath());
        request.setAttribute("TOLOMEOStaticRoot", getTolomeoStaticRoot(request.getContextPath()));

		request.setAttribute("cssDebug", getCSSDebug());
		request.setAttribute("jsDebug", getJSDebug());

		request.setAttribute("googleAPIStato", getGoogleAPIStato());
		request.setAttribute("googleAPIClientID", getGoogleAPIClientID());
						
		forward(request, response);
		
	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/composer/index.jsp";
	}    
}
