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
Copyright © 2007 Comune di Prato - All Right Reserved
* Project:      Tolomeo - WebGis con funzioni di editing
* File:         TolomeoMainServlet.java
* Function:     Servlet che genera l'immagine della mappa 
* Author:       Alessandro Radaelli
* Version:      1.0.0
* CreationDate: 04/09/2007
* ModifyDate:   
***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.RettangoloContenitore;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriCustomQuery;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet che genera l'immagine della mappa di un dato preset.
 * Accetta i parametri:
 * <ul>
 * 	<li>paramPreset: il preset della mappa da stampare</li>
 * 	<li>printImageType: il formato dell'immagine (default png)</li>
 * 	<li>printLayers: i layers da visualizzare nella mappa separati da uno spazio "%20" (default tutti i layers)</li>
 *	<li>printImageSize: la dimensione dell'imagine separata dal "+" (default 300+300)</li>
 *	<li>parametri custom query (es: azioniApertura=<azioniApertura><action>ZoomToOgg</action><zoomToCodTPN>CodTPN</zoomToCodTPN><zoomToIdTPN>IdTPN</zoomToIdTPN></azioniApertura>)</li>
 * </ul>
 * @author Alessandro Radaelli
 */
public class TolomeoPrintServlet extends TolomeoServlet {

    private static final long serialVersionUID = 7658945851540771368L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }
 
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        SITLayersManager comunePO = null;        

        String printImageType = request.getParameter("printImageType");
        String printLayers = request.getParameter("printLayers");
        String printImageSize = request.getParameter("printImageSize");
      
        OggettoTerritorio zoomToOgg = null;
        // Recupero il logger
        LogInterface logger = getLogger(request);
        
        try {
                   
            // Recupero oggetto Territorio
            comunePO = getTerritorio(logger);
            
            // Creo l'oggetto parametri a partire dal file xml indicato
            Parametri params = getParametri(request,comunePO, false);
    
            ParametriMappa paramMappa = params.getMappe().getMappaList().get(0);
     
            //Se parametri non passati sostituisco con quelli del file xml
            printImageType = printImageType==null ?  paramMappa.getPrintImageType() : printImageType;
            printImageSize = printImageSize==null ?  paramMappa.getPrintImageSize() : printImageSize;
            printImageSize = printImageSize.replaceAll(" ", "+");
            printLayers    = printLayers==null    ?  paramMappa.getPrintLayers()    : printLayers;
            //request.getLocalName()
            //request.getLocalPort()
            //request.getProtocol()
            String szURL = paramMappa.getUrl();
            szURL += "&layers=" + printLayers + "&mode=map&map_imagetype=" + printImageType ;
            szURL += "&map_size=" + printImageSize ;
            
            for (ParametriCustomQuery cq :paramMappa.getCustomQueryList()) {
                szURL += "&" +  cq.getNome() + "=" + cq.getQuery();
            }
    
            zoomToOgg = getZoomToOggObj(request, params, comunePO);
            if (zoomToOgg!=null) {
                RettangoloContenitore rect = zoomToOgg.getRettContenitore();
                // Se coincidono (punto) allora allargo
                if ( (rect.getXMax()- rect.getXMin()) < 300 ) {
                    rect.setXMax(rect.getXMax()+150);
                    rect.setXMin(rect.getXMin()-150);
                }
                if ( (rect.getYMax()- rect.getYMin()) < 300 ) {
                    rect.setYMax(rect.getYMax()+150);
                    rect.setYMin(rect.getYMin()-150);
                }
                szURL += "&mapext=" + rect.getXMin() + "+" + rect.getYMin() + "+" + rect.getXMax() + "+" + rect.getYMax() ;
            }
            
            URL u =null; 
            if (!szURL.contains("://")) {
                String proto = request.getProtocol();
                
                u = new URL (proto.split("/")[0], request.getLocalName(), request.getLocalPort(), szURL) ; 
                /*
                szURL = request.getProtocol() + szURL;
                szURL = request.getLocalName() + szURL;
                szURL = request.getLocalPort() + szURL;
                
                request.getLocalPort()
                request.getProtocol()
                */
            } else {
                u = new URL (szURL) ; 
            }
            
            OutputStream out = null;
            HttpURLConnection huc = null;
            
            try {
                
                huc = (HttpURLConnection)  u.openConnection () ; 
                huc.setRequestMethod ("GET") ; 
                huc.setAllowUserInteraction(false);
                //Authenticator auth =  new SimpleAuthenticator("aradaelli","aradaelli");
                //Authenticator.setDefault(auth);
                
                huc.connect () ; 
                response.setContentType("image/" + printImageType);
                int code = huc.getResponseCode () ; 
                //if  ((code>=200) && (code<300)){   
                    InputStream is = huc.getInputStream () ; 
                    out = response.getOutputStream();
                    byte []  buffer = new byte [4096] ;
                    int bytes = 0; 
                    while  ( true )  {  
                        bytes = is.read ( buffer ) ; 
                        if  (bytes<= 0)  break;       
                        out.write ( buffer,0,bytes ) ;        
                       
                   }  
                    
               	//} 
            } finally {
                
                if(out != null) {
                    out.close () ;
                }
                
                if(huc != null) {
                    huc.disconnect() ;
                }
                
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

    /*
    public class SimpleAuthenticator extends Authenticator {
    
    	private String username,
                   password;
                      
	    public SimpleAuthenticator(String username,String password) {
	       this.username = username;
	       this.password = password;
	    }
    
	    protected PasswordAuthentication getPasswordAuthentication()
	    {
	       return new PasswordAuthentication(
	              username,password.toCharArray());
	    }
    }
    */
}