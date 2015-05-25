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

import it.prato.comune.menu.core.Ente;
import it.prato.comune.menu.core.MenuBeanContext;
import it.prato.comune.menu.startup.GestioneSessione;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.BasicLogger;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

@Deprecated
public class SessionFilter implements Filter {
		
	private static final String CONFIG_FILE_PATH = "configFilePath";
	private volatile String configFile = null;
		
	public void init(FilterConfig filterCfg) throws ServletException {
		ServletContext servletCtx = null;
		synchronized (filterCfg) {
			servletCtx = filterCfg.getServletContext();
			configFile = servletCtx.getInitParameter(CONFIG_FILE_PATH);
		}
	}
	
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain catenaOperazioni) throws IOException, ServletException {
	    
		if (configFile==null){
			throw new ServletException("Attenzione a livello di context.xml (sta nel servlet container) manca il parametro di nome " + CONFIG_FILE_PATH);
		}
		
		synchronized (this) {
			
			try {					
				HttpServletRequest req = (HttpServletRequest)request;
				TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();

				// ... Istanziazione Logger 
				BasicLogger logger = new BasicLogger(req.getRemoteAddr(),req.getRemoteUser(),(String)context.getProperty("LOG.name"));

				// ... Recupero Parametri
				String idfun = (String)req.getParameter("idfun");//==null?"LOGOUT":(String)req.getParameter("idfun");
				int ente = 1;

				// ... Recupero Sessione
				GestioneSessione gs = new GestioneSessione(idfun,req);			
				
				// ... Se manca la creo 
				if (!gs.exist()) {
					MenuBeanContext menuContext = null;
					Connection conn = null;
					try {

						menuContext = MenuBeanContext.getInstance();
			            conn = menuContext.getConnection(logger);
			            
			            boolean flmsg = true;
			            gs = new GestioneSessione((String) context.getProperty("VH_MENU"),ente,idfun,flmsg,req,conn,logger);
			            
			            // ... Controllo aggiuntivo per dati di Sophia (facoltativo)
			            if (gs.getUtente().getEnte()==Ente.COMUNE_DI_PRATO && gs.getUtente().getMatricola()==null) {
			               //getServletContext().getRequestDispatcher("/jsp/errore.jsp?messaggio=Utente non trovato su Sophia!").forward(req,resp);
			               logger.error("Utente non trovato su Sophia: "+gs.getUtente().getIdUser());
			               //return;
			            }
						
					} catch (SQLException e) {
			            logger.error("Errore acceso al DB: "+e.getMessage(),e);
					} catch (BasicException e) {
			            logger.error("Errore GestioneSessione: "+e.getMessage(),e);
					} finally {
			            if (conn!=null) try { menuContext.closeConnection(conn,logger); } catch (Exception e) { }
					}
				}				
				
			} catch (Exception e) {
				throw new ServletException(e.getMessage());
			} 
		}
		
		catenaOperazioni.doFilter(request,response);
	}
	
	public void destroy() {
		// TODO Auto-generated method stub
		
	}
}
