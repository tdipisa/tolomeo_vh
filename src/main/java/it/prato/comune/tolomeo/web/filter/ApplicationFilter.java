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
package it.prato.comune.tolomeo.web.filter;

import it.prato.comune.menu.core.ApplicationManagerDAO;
import it.prato.comune.menu.core.MenuBeanContext;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.PratoLogger;
import it.prato.comune.utilita.logging.interfaces.LogInterface;
import it.prato.comune.utilita.logging.uti.LoggingUti;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ApplicationFilter implements Filter {
		
	private static final String CONFIG_FILE_PATH = "configFilePath";
	private volatile String configFile = null;
	private boolean caricato = false;
	private static final MenuBeanContext menuContext = MenuBeanContext.getInstance();
		
	public void init(FilterConfig filterCfg) throws ServletException {
		ServletContext servletCtx = null;
		synchronized (filterCfg) {
			servletCtx = filterCfg.getServletContext();
			configFile = servletCtx.getInitParameter(CONFIG_FILE_PATH);
			if (configFile==null || configFile.trim().equals("")) {
				configFile = servletCtx.getRealPath("/WEB-INF/config") + "/tolomeo.properties" ;
			}
			
		}
	}
	
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain catenaOperazioni) throws IOException, ServletException {
	    
		if (configFile==null){
			throw new ServletException("Attenzione a livello di context.xml (sta nel servlet container) manca il parametro di nome " + CONFIG_FILE_PATH);
		}
		
		synchronized (this) {
			if(!caricato) {
				try {					
					
					TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();       
					/* INIZIO Parte spostata su Context Listener 
					context.setConfigFileName(this.configFile);       

				    	
                    String log4jfile = context.getLog4JPropertiesFile();
                    if (log4jfile != null && log4jfile.trim().length() > 0) {
                        LoggingUti.configureFromFSPath(log4jfile);
                    }
				    */
				    
					// Questa parte non è ststa spostata in context listener perchè utilizza connessione a db quindi è 
					// meglio metterla in una posizione nella quale viene ritentata tutte le volte fino a che non va a buon fine
				    String loggerName = context.getLogName();
				    LogInterface logger = new PratoLogger(loggerName,((HttpServletRequest)request).getRemoteUser(),request.getRemoteAddr());
				    				    
				    // ... Preparazione Contesto Menu
				    String menuPropsFile = context.getMenuPropertiesFile();
				    
				    if(menuPropsFile == null){
				        logger.info("Nessun \"" + TolomeoApplicationContext.PROPERTY_NAME__MENU_PROPERTY_FILE + "\" impostato nel file di configurazione");
				    }else{
				    
    				    logger.info("(tolomeobinj/TolomeoStartupServlet) Inizializzazione MenuContext: " + menuPropsFile);				      				      
    				      
    				    try {
    				         
    				        menuContext.setConfigFileName(menuPropsFile);				         
    				        menuContext.setUsePool(true);
    				      
    				    } catch(BasicException be){
    				         
    				        logger.error("Problemi nel settaggio del path del menu",be);				         
    				        throw new RuntimeException("Problemi nella inizializzazione del menu");
    				      
    				    }
    				      				      
    				    menuContext.setAnonymousLogger(logger);				      
    				    menuContext.setJvm(MenuBeanContext.TOMCAT);
    				    menuContext.setUsePool(true);
    				    menuContext.getProperties().put("applid",(String)context.getProperty("VH_MENU"));
    
    				      
    				    logger.info("Contesto inizializzato!");
    				      				      
    				    Connection menuConn = null;
    				      
    				    try {
    				         
    				        menuConn = menuContext.getConnection(logger);				         
    				        ApplicationManagerDAO.load((String)menuContext.getProperty(MenuBeanContext.ADS_FILE),(String)context.getProperty("VH_MENU"),menuConn,logger);
    				      
    				    } catch (Exception e) {
    				         
    				        logger.error("Errore Caricamento Applicazioni Menu': "+e.getMessage(),e);
    				      
    				    } finally {
    				         
    				        if (menuConn!=null){  
    				            try { 
    				                menuContext.closeConnection(menuConn,logger); 
    				            } catch (Exception e) { }
    				        }
    				    }
				    }

					caricato = true;
					logger.info("Avviati tutti i contesti di tolomeo");
					
				} catch (Exception e) {
					
					throw new ServletException(e.getMessage(), e);
				} 
				
			}
		}
		
		// Filtraggio servlet editing se in readonly
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
		HttpServletRequest req = (HttpServletRequest) request;
		
		if (context.isModeForbiddenUrl(req.getRequestURL().toString())) {
			HttpServletResponse r = (HttpServletResponse) response;
			r.sendError(HttpServletResponse.SC_FORBIDDEN, "Accesso non consertito. Verificare impostazione parametro mode su tolomeo.properties ");
			return;
		} 
				
		catenaOperazioni.doFilter(request,response);
		
	}
	
	public void destroy() {
		// TODO Auto-generated method stub
		
	}
}