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
package it.prato.comune.tolomeo.servizi;

import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.PratoLogger;
import it.prato.comune.utilita.logging.interfaces.LogInterface;
import it.prato.comune.utilita.logging.uti.LoggingUti;

import java.io.File;
import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class ServicesFilter implements Filter {
		
    private static final String SERVICES_CONFIG_FILE_PATH = "servicesConfigFilePath";
    private volatile String servicesConfigFile = null;
    private boolean caricato = false;
    
    public void init(FilterConfig filterCfg) throws ServletException {
        ServletContext servletCtx = null;
        synchronized (filterCfg) {
            servletCtx = filterCfg.getServletContext();
            servicesConfigFile = servletCtx.getInitParameter(SERVICES_CONFIG_FILE_PATH);
            if (servicesConfigFile==null || servicesConfigFile.trim().equals("")) {
                servicesConfigFile = servletCtx.getRealPath("/WEB-INF/config") + "/services.properties" ;
            }
            
        }
    }
	
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain catenaOperazioni) throws IOException, ServletException {
	    
	    synchronized (this) {
            if(!caricato) {			
            	
            	if (!(new File(servicesConfigFile)).exists())  {
            		caricato = true;
            		
            	} else {
            	
	    			try {				
	    			    
	    			    TolomeoServicesContext context = TolomeoServicesContext.getInstance();  
	    			    context.setConfigFileName(this.servicesConfigFile);                                 
	                    context.setJvm(TolomeoServicesContext.TOMCAT);
	                    
	                    /*
	                     * Inizializza log4j
	                     */
	                    String log4jfile = context.getLog4JPropertiesFile();
	                    System.out.println("LOG4JFILE = " + log4jfile); 
	                    
	                    if (log4jfile != null && log4jfile.trim().length() > 0) {
	                        LoggingUti.configureFromFSPath(log4jfile);
	                    }
	                    
	    	            String loggerName = context.getLogName();
	    	            System.out.println("LOGGER NAME = " + loggerName);
	    	            LogInterface logger = new PratoLogger(loggerName,((HttpServletRequest)request).getRemoteUser(),request.getRemoteAddr());
	    	            
	    	            // ... Preparazione Contesto SIT                  
	                    String sitPropsFile = context.ifRelativeSetAbsolute(context.getStringProperty("SIT.file"));
	                    logger.info("(tolomeobinj/ServicesFilter) Inizializzazione SITBeanContext: " + sitPropsFile);
	                    SITBeanContext sitContext = SITBeanContext.getInstance();
	                    
	                    try{
	                        
	                         sitContext.setConfigFileName(sitPropsFile);
	                         sitContext.setUsePool(true);
	                      
	                    }catch(BasicException be){
	                        
	                         logger.error("Problemi nel settaggio del path del sit",be);
	                         throw new RuntimeException("Problemi nella inizializzazione del sit");
	                      
	                    }
	                      
	                    sitContext.setAnonymousLogger(context.getAnonymousLogger());
	                    sitContext.setJvm(SITBeanContext.TOMCAT);		                    
	                    logger.info("Avviati tutti i servizi di tolomeo");
	                    caricato = true;
	                    
	    			} catch (Exception e) {
	                    
	                    throw new ServletException(e.getMessage(), e);
	                }
            	}
            }
	    }
		catenaOperazioni.doFilter(request,response);
	}
	
	public void destroy() {
		// TODO Auto-generated method stub
		
	}
}
