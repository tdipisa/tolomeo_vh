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
package it.prato.comune.tolomeo.test;

import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet che richiede alla TolomeoMainServlet la stampa di una mappa
 * 
 * @author Mattia Gennari
 */
public class TestPrintServlet extends TolomeoServlet {

	private static final long serialVersionUID = -6096347001193086197L;
	
	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		LogInterface logger = getLogger(request);
		
		logger.info("Sono entrato nella TestPrintServlet");
		 
		//String urlStr = "http://tolomeo.comune.prato.it/tolomeobinj/TolomeoPrintServlet?paramPreset=PianoPubblicita&printImageSize=300+300&azioniApertura=<azioniApertura><action>ZoomToOgg</action><zoomToCodTPN>-5000</zoomToCodTPN><zoomToIdTPN>1</zoomToIdTPN></azioniApertura>";
		//URL url = new URL(urlStr);
		String proto = request.getProtocol();        
        URL url = new URL (proto.split("/")[0], request.getLocalName(), 80, "/tolomeobinj/TolomeoPrintServlet?paramPreset=PianoPubblicita&printImageSize=300+300&azioniApertura=<azioniApertura><action>ZoomToOgg</action><zoomToCodTPN>-5000</zoomToCodTPN><zoomToIdTPN>1</zoomToIdTPN></azioniApertura>") ; 
		
		HttpURLConnection huc = (HttpURLConnection) url.openConnection () ;
		
		huc.setRequestMethod("GET");		
		huc.setAllowUserInteraction(false);
		
        //Authenticator auth = new SimpleAuthenticator("user","password");
        //Authenticator.setDefault(auth);
        
		huc.connect();
		
		response.setContentType("image/png");
		
		int code = huc.getResponseCode () ; 

		if ((code<200) || (code>300)){ 
			//logger.error("code: " + code + " : " + huc.getResponseMessage());
		} else {
			InputStream is = huc.getInputStream () ; 
			OutputStream out = response.getOutputStream();
	
			byte [] buffer = new byte [4096];
	
			int bytes = 0; 
	
			while (true) { 
				bytes = is.read (buffer) ; 
		
				if (bytes<=0) break; 
				out.write (buffer,0,bytes); 
			} 
			out.close(); 
		} 

		huc.disconnect();
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
