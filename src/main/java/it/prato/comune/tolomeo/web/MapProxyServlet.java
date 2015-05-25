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
package it.prato.comune.tolomeo.web;

import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLDecoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet che gestisce la richiesta di stampa del TolomeoExt.
 * Restituisce sul'OutputStrem il report contenete titolo, mappa e descrizione della mappa in visualizzazione.
 * Il report ha i seguenti parametri:
 * <ul>
 *     <li>titolo</li>
 *     <li>descrizione</li>
 *     <li>formato di esportazione (pdf, rtf, docx, ecc...)</li>
 *     <li>formato (A4 o A3)</li>
 *     <li>orientamento (verticale o orizzontale)</li>
 *     <li>urlStemma</li>
 *     <li>scala della mappa</li>
 *     <li>mapx coordinata x del centroide di visualizzazione</li>
 *     <li>mapy coordinata y del centroide di visualizzazione</li>
 *     <li>urlMappa url base della mappa in visualizzazione</li>
 * </ul>
 * 
 * @author Mattia Gennari
 */
@Deprecated
public class MapProxyServlet extends TolomeoServlet {
    /**
     * 
     */
    private static final long serialVersionUID = -6224502317031365306L;

    public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	    // Recupero il logger
        LogInterface logger = getLogger(request);
        
		URI uriMappa          = null;		
		HttpURLConnection huc = null;
		OutputStream out      = null;
		
		String pr = (request.getRequestURL().toString().substring(0, 5).equalsIgnoreCase(("HTTPS"))) ? "https" : "http";
        int localPort = request.getLocalPort();
        String mapUrl = request.getQueryString();
        
        mapUrl = URLDecoder.decode(mapUrl,"UTF-8");
        String regExp = "^([a-zA-Z])+\\:\\/\\/";                
        Pattern pattern = Pattern.compile(regExp);        
        Matcher m = pattern.matcher(mapUrl);
        
        if(!m.find()){
            logger.debug("Protocollo non impostato. Impongo " + pr);
            mapUrl = pr + "://" + mapUrl;
        }
        

        URL url = new URL(mapUrl);

        int portN = url.getPort();                      
        if(portN == -1){            
            if(localPort != -1){
                logger.debug("Porta non impostata. Impongo " + localPort);
                portN = localPort;  
            }
        }
        
        try {
            String host = url.getHost();
            logger.debug("Valore host in urlMappa: " + host);
            host = (host==null || host.equals("")) ? request.getServerName() : host;
            logger.debug("Valore host dopo trasformazione: " + host);
            
            uriMappa = new URI(url.getProtocol(),null,host,portN,url.getPath(),url.getQuery(),null);
            logger.info("URI MAPPA: " + uriMappa);
            
        } catch (URISyntaxException e) {
            logger.error("URI errore di sintassi", e);
            throw new IOException(e.getMessage());
        }
		        
		try {
			huc = (HttpURLConnection) uriMappa.toURL().openConnection();
			huc.setRequestMethod ("GET") ; 
	        huc.setAllowUserInteraction(false);
	        huc.connect();
	        	        
	        response.setContentType(huc.getContentType());
	        int code = huc.getResponseCode();
	        
	        if ((code>=200) && (code<300)){   
	            InputStream is = huc.getInputStream(); 
	            out = response.getOutputStream();
	            byte [] buffer = new byte[4096] ;
	            int bytes = 0; 
	            while (true) {  
	                bytes = is.read (buffer); 
	                if (bytes <= 0) break;       
	                out.write(buffer, 0, bytes);        
	           }  	           
	       	} else {
	       		logger.error("Connessione HTTP per recupero immagine mappa fallita! urlMappa = " + mapUrl);
	       	}
		} catch (Exception e) {
			logger.error("Eccezione durante connessione HTTP verso mapserver! " + huc.getResponseCode() + ":" + huc.getResponseMessage());
		} finally {
		    out.close();
			if (huc!=null){ 
			    huc.disconnect();
			}
		}
				
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}
}
