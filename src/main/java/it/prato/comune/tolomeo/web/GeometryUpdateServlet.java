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
 * File:         GeometryUpdateServlet.java
 * Function:     Servlet di default per aggiornamento geografico oggetti
 * Author:       Alessandro Radaelli
 * Version:      1.0.0
 * CreationDate: 04/09/2007
 * ModifyDate:   
 ***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;


/**
 * Questa classe implementa la servlet di default che viene utilizzata da Tolomeo per l'aggiornamento della geometria di oggetti, 
 * ed e' pensata per essere richiamata via ajax.<br/>
 * 
 * Accetta i seguenti parametri passati in get o post:
 * <ul>
 *  <li>codTPN - codice identificativo (nel package it.prato.comune.sit) del layer sul quale viene fatta l'operazione</li>
 *  <li>key - id dell'oggetto sul quale fare l'operazione. Corrisponde al campo utilizzato in LayerTerritorio.cercaIDTPN nel package  it.prato.comune.sit</li>
 *  <li>geoOp - Codice dell'operazione da effettuare</li> 
 *  <li>geoCoord - Oggetto da aggiungere, sottrarre o modificare con effetto "copertura". Non presente in caso di cancellazione totale. E' rappresentato tramite la stringa JSON corrispondente all'oggetto it.prato.comune.sit.JSGeometry
 *                 nel quale il solo campo significativo e' quello relativo alla geometria</li> 
 * </ul>
 *  
 * Fornisce come risultato (direttamente nella response, essendo fatta per essere chiamata via ajax) una response che contiene la stringa OK.
 * 
 * In caso di errore, oltre a scrive sul log, setta lo status della response a HttpServletResponse.SC_INTERNAL_SERVER_ERROR 
 * e ritorna un messaggio di errore nella response stessa.
 * 
 * 
 * @author Alessandro Radaelli
 *
 */
public class GeometryUpdateServlet extends TolomeoServlet {

	private static final long serialVersionUID = 2279788612630899600L;



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
		LogInterface logger = getLogger(request);

		Integer codTPN = getCodTPN(request);
		String idTPN = getKey(request);
		String szClippingCodTPN = request.getParameter("clippingCodTPN");
		String geoCoord = request.getParameter("geoCoord");
		String geoOp = request.getParameter("geoOp");
		String format = request.getParameter("format");
		String callback = request.getParameter("callback");

		//int clippingCodTPN = 0;        
		SITLayersManager comunePO = null;		
		String risposta = null;

		try {
			
		    comunePO = getTerritorio(logger);
		    comunePO.EditManager ( codTPN,  idTPN,  szClippingCodTPN,  geoCoord,  geoOp );
		    
			/*
            if((szClippingCodTPN != null) && !szClippingCodTPN.equals("")){
                clippingCodTPN = Integer.parseInt(szClippingCodTPN);
            }
            logger.debug("clippingCodTPN = " + clippingCodTPN);
            if (geoOp.equals(Parametri.digitizeOperationSubtract)) {
                // Subtract
                comunePO.modifyDifferenza(codTPN,idTPN, geoCoord);
            } else if (geoOp.equals(Parametri.digitizeOperationAdd)) {
                 // Add
                comunePO.modifyUnione(codTPN,idTPN, geoCoord);
            } else if (geoOp.equals(Parametri.operationFeatureVertexEditing)) {
                // Vertex editing
                comunePO.modify(codTPN,idTPN, geoCoord);
            } else if (geoOp.equals(Parametri.operationFeatureDragDrop)) {
                // DragDrop
                comunePO.modify(codTPN,idTPN, geoCoord);
            } else if (geoOp.equals(Parametri.operationGeometryModify)) {
                // Generica modifica
                comunePO.modify(codTPN,idTPN, geoCoord);
            } else if (geoOp.equals(Parametri.digitizeOperationAddSub)) {
                    // AddSub
                    if(clippingCodTPN != 0){
                        comunePO.modifyAndClipCopertura(codTPN, idTPN, geoCoord, clippingCodTPN);
                    }else{
                        comunePO.modifyCopertura(codTPN,idTPN, geoCoord);
                    }                    
            } else if (geoOp.equals(Parametri.digitizeOperationInsert)) {
                    // Inserimento nuovo
                    comunePO.appendFeature(codTPN, idTPN, geoCoord);
            } else if (geoOp.equals(Parametri.operationFeatureDelete)) {
                    // Cancellazione Feature
                    comunePO.removeFeature(codTPN, idTPN);
            }
        } catch (NumberFormatException e) {
            logger.warn("NumberFormatException in AjaxQueryServlet", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().append(e.getMessage());
            return;*/

		} catch (SITException e) {
			String errMsg = "SITException in AjaxSuggestServlet durante suggerimento di ricerca";
			risposta = new ExtStoreError(e).toJSONString();
			logger.error(errMsg, e);

			//logger.warn("SITException in AjaxQueryServlet", e);
			//response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			//response.getWriter().append(e.getMessage());
			//return;
			
		} finally {
		    
		    if(comunePO != null){
                try {
                    comunePO.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager", e);
                }
            }
			
			if ((format != null ) && (format.equals("ext"))) {

				risposta = "OK";
				
				JSONObject jsonrisposta = SITExtStore.extStoreSingleRecord("{ result: '" + risposta + "'}", null);
				// Rispondo con il risultato
				request.setAttribute("risposta", jsonrisposta.toString());
				request.setAttribute("format", format);
				request.setAttribute("callback", callback);

			} else {
				
				risposta = "KO";
				// In caso di tutto OK risponde OK nella response
				request.setAttribute("risposta", risposta);
				//response.setStatus(HttpServletResponse.SC_OK);
				//response.getWriter().append("OK");
			}
			
			forward(request, response);
		}
	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/tolomeoAjaxStoreResponse.jsp";
	}
}