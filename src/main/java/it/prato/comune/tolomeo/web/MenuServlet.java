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

import it.prato.comune.menu.core.Abilitazione;
import it.prato.comune.menu.core.Application;
import it.prato.comune.menu.core.Function;
import it.prato.comune.menu.core.MenuBeanContext;
import it.prato.comune.menu.core.UserMenu;
import it.prato.comune.menu.startup.GestioneSessione;
import it.prato.comune.tolomeo.utility.FunzionePubblicaBean;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.BasicLogger;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.ArrayUtils;

public class MenuServlet extends TolomeoServlet {

	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, java.io.IOException {
		doPost(req,resp);
	}

	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, java.io.IOException {
		
		TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
		List<FunzionePubblicaBean> funzioniPubbliche = new ArrayList<FunzionePubblicaBean>();

		// ... Istanziazione Logger 
		BasicLogger logger = new BasicLogger(req.getRemoteAddr(),req.getRemoteUser(),(String)context.getProperty("LOG.name"));

		// ... Recupero Parametri
		String idfun = (String)req.getParameter("idfun");//==null?"LOGOUT":(String)req.getParameter("idfun");
		int ente = 1;
		UserMenu menu = null;
		
		// ... Recupero Sessione
		GestioneSessione gs = new GestioneSessione(idfun,req);			
		
		// ... Se manca la creo (primo giro o dopo una sessione scaduta)
		if (!gs.exist()) {
		    
			MenuBeanContext menuContext = null;
			Connection conn = null;
			try {

				menuContext = MenuBeanContext.getInstance();
	            conn = menuContext.getConnection(logger);
	            
	            boolean flmsg = true;
	            gs = new GestioneSessione((String) context.getProperty("VH_MENU"),ente,idfun,flmsg,req,conn,logger);
	            
	            // ... Controllo aggiuntivo per dati di Sophia (facoltativo)
//	            if (gs.getUtente().getEnte()==Ente.COMUNE_DI_PRATO && gs.getUtente().getMatricola()==null) {
//	               getServletContext().getRequestDispatcher("/jsp/errore.jsp?messaggio=Utente non trovato su Sophia!").forward(req,resp);
//	               logger.error("Utente non trovato su Sophia: "+gs.getUtente().getIdUser());
//	               return;
//	            }
	            
	            //... carico le eventuali funzioni pubbliche dal contesto
	            funzioniPubbliche = context.getFunzioniPubbliche(TolomeoApplicationContext.FUNZPUB_PROPERTY_NAME_PREFIX);
	            
	            menu = gs.getMenu();	            	            
	            	            
	            // ridefinisco il menu aggiungendo le funzioni pubbliche
	            if (funzioniPubbliche!=null && funzioniPubbliche.size()>0) {	  
	                
	                if(menu == null)
	                    menu = new UserMenu();
	                
	                //...Recupero o Creo la Tabella HPerm
	                String id = (String)context.getProperty("VH_MENU");
	                
	                HttpSession session = req.getSession(false);
	                HashMap HPerm = (HashMap)session.getAttribute(id+GestioneSessione.HPERM);
	        
	                HPerm = new HashMap();
	                session.setAttribute(id+"HPerm",HPerm);
	                
	                //...aggiungo le funzioni pubbliche a quelle di menu
	                Function[] funzioni = menu.getFunzioni();
	                String[] urls = menu.getUrl();
	                Abilitazione[] abilitazioni = menu.getAbilitazioni();
	                
	                for (int i=funzioniPubbliche.size()-1; i>-1; i--) {
	                    funzioni = (Function[])ArrayUtils.add(funzioni, 0, funzioniPubbliche.get(i).getFunzione());
	                    abilitazioni = (Abilitazione[])ArrayUtils.add(abilitazioni, 0, funzioniPubbliche.get(i).getAbilitazione());
	                    urls = (String[])ArrayUtils.add(urls, 0, funzioniPubbliche.get(i).getUrl());
	                }
	                
	                //...recupero l'applicazione
	                Application appl = gs.getApplicazione();
	                
	                //...setto il menù utente
	                menu.setAbilitazioni(abilitazioni);
	                menu.setFunzioni(funzioni);
	                menu.setUrl(urls);          
	                menu.seek(0);
	                byte[] states = new byte[0];

	                menu.setState(states);
	                menu.setViewState(states);
	                
	                // ... Mette gli oggetti in sessione
	                HPerm.put(GestioneSessione.KP_ENTE,""+ente);
	                HPerm.put(GestioneSessione.KP_DSENTE,"Comune di Prato");
	                HPerm.put(GestioneSessione.KP_UTENTE,gs.getUtente()); 
	                HPerm.put(GestioneSessione.KP_APPLICATION,appl);
	                HPerm.put(GestioneSessione.KP_MENU,menu);
	                HPerm.put(GestioneSessione.KP_MSGPUBLIC,null);
	                HPerm.put(GestioneSessione.KP_MSGGROUP,null);
	                HPerm.put(GestioneSessione.KP_MSGPRIVATE,null);
	                
	                gs = new GestioneSessione(idfun,req);      
	                	                	                  	                
	            }	            	            
				
			} catch (SQLException e) {
	            logger.error("Errore acceso al DB: "+e.getMessage(),e);
			} catch (BasicException e) {
	            logger.error("Errore GestioneSessione: "+e.getMessage(),e);
			} finally {
	            if (conn!=null) try { menuContext.closeConnection(conn,logger); } catch (Exception e) { }
			}
		}			
		
		menu = gs.getMenu();		
		
		// Se il menu è nullo e quindi non ci sono nemmeno funzioni pubbliche controllo se ci sono almeno degli openlinks
        if (menu==null) {
            if(context.getOpenLinks() == null || context.getOpenLinks().size() == 0){
                addMessaggio(req, Messaggio.WARNING, "Utente non abilitato");                
            } else {
                addMessaggio(req, Messaggio.WARNING, "Utente non abilitato a funzioni di menu");                
            }
            getServletContext().getRequestDispatcher("/jsp/home.jsp").forward(req,resp);
            return;
        }
		
		Function funz = gs.getFunzione();
        if (funz==null) {
            gs.cleanHTemp((String)context.getProperty("VH_MENU"));
            if (idfun!=null && idfun.length()>0 && funzioniPubbliche!=null /*&& !idfun.equals("LOGOUT")*/) {
                getServletContext().getRequestDispatcher("/jsp/errore.jsp?messaggio=Codice funzione errato!").forward(req,resp);
                logger.error("Codice Funzione Errato: "+idfun);
                return;
            } else {
                menu.seek(0);               
                getServletContext().getRequestDispatcher("/jsp/home.jsp").forward(req,resp);
                return;
            }
        } else {
            if (funz.getStato()==Function.SOSPESA) {
                //System.out.println("(MenuServlet) --> /jsp/errore.jsp?messaggio=Funzione momentaneamente disabilitata!");
                getServletContext().getRequestDispatcher("/jsp/errore.jsp?messaggio=Funzione momentaneamente disabilitata!").forward(req,resp);
                return;
            }
            String url = menu.getCurrentUrl();
            if (url==null) {
                getServletContext().getRequestDispatcher("/jsp/errore.jsp?messaggio=Nessun url associato alla funzione!").forward(req,resp);
                logger.error("Nessun Url associato alla Funzione: "+idfun);
                return;
            } else {
                if(url.startsWith("http://")){
                    resp.sendRedirect(url);
                }else{
                    forward(url,req,resp);
                }
                return;
            }
        }
        
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}
}
