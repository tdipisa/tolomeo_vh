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
package it.prato.comune.tolomeo.servizi.pianoPubblicita;

import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.sit.plugin.comunePO.beans.pianoPubblicita.DecodificaBean;
import it.prato.comune.sit.plugin.comunePO.dao.pianoPubblicita.UbicazioneDAO;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * Servlet implementation class for Servlet: ZonaClasseOggetto
 *
 */
 public class ZonaClasseOggettoServlet extends TolomeoServlet {
     
   static final long serialVersionUID = 1L;
   
   public void init(ServletConfig config) throws ServletException {
       super.init(config);
   }
	
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}  	
	
	/* (non-Java-doc)
	 * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
	    LogInterface logger = getLogger(request);
	    Connection conn = null;
        //IOIDBContext context = null;                     
	    SITBeanContext context = null;
	    String comboId = request.getParameter("_id");
		String comboName = request.getParameter("_name");
		String comboValue = request.getParameter("_value");
		
		response.setHeader("Cache-Control","no-cache"); //HTTP 1.1
		response.setHeader("Pragma","no-cache"); //HTTP 1.0
		response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
        response.setContentType("application/x-json; charset=UTF-8");
		
		PrintWriter out = response.getWriter();

						
		try {
		    
		    context = SITBeanContext.getInstance();
		    conn = context.getConnection(logger);
		    UbicazioneDAO ubicazioneDao = new UbicazioneDAO(logger);
		    
    		if(comboName.equals("zona")){
    		    
    		    
    		    List<DecodificaBean> classi = ubicazioneDao.leggiClassiByZona(conn, Long.parseLong(comboValue));    	
    		    String jsonString = getJSONString(classi);
    		    out.print(jsonString);
    		    out.flush();
    		    
    		}else if(comboName.equals("classe")){
    		    
    		    String zona = request.getParameter("zona");    		   
    		    List<DecodificaBean> oggetti = ubicazioneDao.leggiOggettiByClasse(conn, Long.parseLong(zona), Long.parseLong(comboValue), true);        
                String jsonString = getJSONString(oggetti);                
                out.print(jsonString);
                out.flush();
    		    
    		}else if(comboName.equals("oggetto")){
    		    
    		}
		} catch (BasicException be) {
		    
		} catch (SQLException sqle) {
		    
		} finally {
		    context.closeConnection(conn, logger);
		}
		
	}   
	
	private static String getJSONString(List<DecodificaBean> decodifiche){
	    
	    JSONArray comboStore = new JSONArray();
        JSONObject initVal = new JSONObject();
        initVal.put("-1", "Scegli...");        
        comboStore.add(initVal);
        
        for (DecodificaBean decodifica : decodifiche) {
            JSONObject json = new JSONObject();
            json.put("" + decodifica.getId(), decodifica.getDescrizione());   
            comboStore.add(json);
        }
        
       return comboStore.toString();  
	}
	
	@Override
    protected String getDefaultForward() {
        return "";
    }
}
