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

import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.MetadatoRicerche;
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

import org.apache.commons.lang.StringUtils;


/**
 * Questa classe implementa la servlet di default che viene utilizzata da Tolomeo per il suggerimento durante la ricerca di oggetti (funzionalità query), 
 * ed e' pensata per essere richiamata via ajax.<br/>
 * 
 * Accetta i seguenti parametri passati in get o post:
 * <ul>
 *  <li>codTPN - codice identificativo (nel package it.prato.comune.sit) del layer sul quale viene fatta l'interrogazione</li>
 *  <li>idRicerca - id della ricerca da effettuare (secondo quanto definito nel package it.prato.comune.sit</li>
 *  <li>campoRicerca0....camporicercaN - valori dei campi che definiscono il criterio di ricerca</li> 
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
public class AjaxSuggestServlet extends TolomeoServlet {

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
        Integer codTPN        = getCodTPN(request);
        String szIdRicerca    = request.getParameter("idRicerca");
        String szNCampo       = request.getParameter("idCampo");
        String srid           = request.getParameter("SRID");
        String withGeometry   = request.getParameter("withGeom");
        boolean bWithGeometry = (withGeometry!=null) ? (withGeometry.toUpperCase().equals("S") || withGeometry.toUpperCase().equals("Y") || withGeometry.toUpperCase().equals("TRUE")) ? true: false  : true;
        String format         = request.getParameter("format");
        String callback       = request.getParameter("callback");
        String risposta       = "";
        
        logger.debug("AjaxSuggestServlet ricerca id: " + szIdRicerca);
        
        Integer idRicerca = null;
        if (StringUtils.isNotEmpty(szIdRicerca)) {
        	idRicerca = new Integer(szIdRicerca);
        } else {
        	logger.warn("L'id ricerca passato e' nullo o vuoto");
        }
        
        int nCampo = 0;
        if (StringUtils.isNotEmpty(szNCampo)) {
        	nCampo = Integer.parseInt(szNCampo);
        } else {
        	logger.warn("L'nCampo passato e' nullo o vuoto");
        }
        
        // Recupero l'oggetto Territorio
        SITLayersManager comunePO = null;
        
        try {
	        comunePO = getTerritorio(logger);        
	        // Recupero il layer identificato da codTPN
	        LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
	        
	        if (layer != null) {
	        	
		        if (layer.getRicerche().containsKey(idRicerca)) {
		        	
		            // Recupero il metadato relativo alla ricerca che devo eseguire
		            MetadatoRicerche mr = layer.getRicerche().get(idRicerca);
		            if(mr != null) {
			            // Utilizzando i valori contenuti nel metadato recupero valori per i parametri di ricerca
			            Object[] valori = new Object[mr.getNomiCampi().length];
			            Object[] chiavi = new Object[mr.getNomiCampi().length];
			            String[] nomiCampi = mr.getNomiCampi();
			            
			            for (int i=0; i< nomiCampi.length; i++) {
			                if (i!=nCampo) {                    
			                    valori[i] = request.getParameter("campoRicerca" + i);
			                    chiavi[i] = request.getParameter("campoRicercaChiave" + i);
			                } else {
			                    valori[i] = request.getParameter("q");
			                    chiavi[i] = null;
			                }
			            }
			            
			            try {
			            	logger.debug("Inizio suggerimenti per la ricerca...");
			            	
			                // Eseguo la ricerca
			                if ((format!=null) && (format.equals("ext"))) {
			                	risposta = SITExtStore.extStoreFromJSGeometryArrayList(layer.ricercaSuggest2 ( idRicerca, nCampo, bWithGeometry, valori, chiavi), null).toString();
			                } else {
			                    risposta = layer.ricercaSuggest(idRicerca, nCampo, valori);                    
			                }
			                
			            } catch (SITException e) {        	
							// Segnalazione eventuali errori
			            	String errMsg = "SITException in AjaxSuggestServlet durante suggerimento di ricerca";
			            	risposta = new ExtStoreError(e).toJSONString();
							logger.error(errMsg, e);
							/*
							response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
							response.getWriter().append(e.getMessage());
							*/
			            }
			            
		            } else {
		            	String errMsg = "Il metadato ricerche per la ricerca " + idRicerca + " del layer " + layer.getNome() + " (cod. " + codTPN + ") è nullo";
		            	risposta = new ExtStoreError(errMsg,null).toJSONString() ;
		            	logger.error(errMsg);
		            }
		            
		        } else {
		            String errMsg = "La ricerca definita sul file di preset con id " + idRicerca + " per il layer " + layer.getNome() + " (cod. " + codTPN + ") risulta inesistente. \n Controllare i parametri nel file di preset e la correttezza della classe " + layer.getClass();
		            risposta = new ExtStoreError(errMsg,null).toJSONString();
		            logger.error(errMsg);
		            /*
		            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		            response.getWriter().append(errMsg);
		            */
		        }
		        
	        } else {
	        	String errMsg = "Non è possibile effettuare i suggerimenti per la ricerca perchè il layer con codice " + codTPN + " è nullo";
	        	risposta = new ExtStoreError(errMsg,null).toJSONString();
	            logger.error(errMsg);
	        }
        } catch (RuntimeException e) {        	
        	String errMsg = "Eccezione " + e.getMessage();
        	risposta = new ExtStoreError(e).toJSONString();
			logger.error(errMsg, e);
        }
        finally {
        	
            if(comunePO != null){
                try {
                    comunePO.dispose();
                } catch (SITException e) {
                    logger.error("Impossibile fare il dispose del LayersManager", e);
                }
            }
        	
            // Rispondo con il risultato
            request.setAttribute("suggest", risposta);
            request.setAttribute("format", format);
            request.setAttribute("callback", callback);
            forward(request, response);
                    	
        }
    }

    @Override
    protected String getDefaultForward() {
        return "/jsp/tolomeoAjaxSuggest.jsp";
    }
}