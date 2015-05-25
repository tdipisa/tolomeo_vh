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
 * if not, write to the Free Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110�1301  USA
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
 * Tolomeo � un framework per lo sviluppo di applicazioni per
 * visualizzazione, editing, geoprocessing e supporto alla decisione basate su cartografia.
 * 
 * Tolomeo Copyright 2011 Comune di Prato;
 * 
 * Questo file fa parte di Tolomeo.
 * 
 * Tolomeo � un software libero; � possibile redistribuirlo e / o 
 * modificarlo sotto i termini della GNU Lesser General Public License, 
 * come pubblicato dalla Free Software Foundation, sia la versione 3 della licenza o (a propria scelta) una versione successiva.
 *  
 * Tolomeo � distribuito nella speranza che possa essere utile,
 * ma SENZA ALCUNA GARANZIA, senza neppure la garanzia implicita di COMMERCIABILIT� o
 * IDONEIT� PER UN PARTICOLARE SCOPO. Vedere la GNU Lesser General Public License per ulteriori dettagli.
 * 
 * Si dovrebbe avere ricevuto una copia della GNU Lesser General Public insieme a Tolomeo, in caso contrario, 
 * si scriva alla Free Software  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110�1301 USA
 *   
 * 
 * Informazioni Sviluppatori:
 * 
 * Tolomeo � sviluppato dal Comune di Prato
 * 
 * Alessandro Radaelli
 * Federico Nieri
 * Mattia Gennari
 * 
 * sit@comune.prato.it
 ******************************************************************************/
package it.prato.comune.tolomeo.servizi.pau;
 
import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.sit.beans.pau.CategoriaBean;
import it.prato.comune.sit.beans.pau.TipologiaBean;
import it.prato.comune.sit.dao.pau.CategoriaDAO;
import it.prato.comune.sit.dao.pau.TipologiaDAO;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class GestioneTipologiaServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
        
    	LogInterface logger = getLogger(request);
		
		SITBeanContext sitContext = SITBeanContext.getInstance();
		Connection conn = null;
		TipologiaDAO tipologiaDao = new TipologiaDAO(logger);
		CategoriaDAO categoriaDao = new CategoriaDAO(logger);
        TipologiaBean tipologia = null;
        List<TipologiaBean> tipologie = null;
        List<CategoriaBean> categorie = null;
		
		String op            = request.getParameter("op");
		String idTipologia   = request.getParameter("idTipologia");
		String descTipologia = request.getParameter("descTipologia");
		String idCategoria   = request.getParameter("idCategoria");
		String descCategoria = request.getParameter("descCategoria");
		
        try { 
        	conn = sitContext.getConnection(logger);
        	
        	//visualizzazione dettaglio tipologia
        	if (op.equalsIgnoreCase("visTip")) {
        		
        		tipologia = tipologiaDao.leggiTipologiaById(Long.parseLong(idTipologia), conn);
        		categorie = categoriaDao.leggiCategorieByTipologia(Long.parseLong(idTipologia), conn);
        	
        	//inserimento tipologia
        	} else if (op.equalsIgnoreCase("insTip")) {
        		
        		tipologiaDao.insertTipologia(descTipologia, conn);
        		conn.commit();
        		tipologie = tipologiaDao.leggiTipologie(conn);
        		
        		request.setAttribute("tipologie",tipologie);
        		forward("/jsp/servizi/pau/elencoTipologie.jsp", request, response);
        		return;
        		
        	//modifica tipologia
        	} else if (op.equalsIgnoreCase("modTip")) {
        		
        		tipologiaDao.updateTipologia(Long.parseLong(idTipologia), descTipologia, conn);
        		conn.commit();

        		tipologia = tipologiaDao.leggiTipologiaById(Long.parseLong(idTipologia), conn);
        		categorie = categoriaDao.leggiCategorieByTipologia(Long.parseLong(idTipologia), conn);
        		
        	//elimina tipologia
        	} else if (op.equalsIgnoreCase("delTip")) {
        		
        		tipologiaDao.deleteTipologia(Long.parseLong(idTipologia), conn);
        		conn.commit();
        		tipologie = tipologiaDao.leggiTipologie(conn);
        		
        		request.setAttribute("tipologie",tipologie);
        		forward("/jsp/servizi/pau/elencoTipologie.jsp", request, response);
        		return;
        	
        	//inserimento categoria
        	} else if (op.equalsIgnoreCase("insCat")) {
        		
        		categoriaDao.insertCategoria(descCategoria, Long.parseLong(idTipologia), conn);
        		conn.commit();

        		tipologia = tipologiaDao.leggiTipologiaById(Long.parseLong(idTipologia), conn);
        		categorie = categoriaDao.leggiCategorieByTipologia(Long.parseLong(idTipologia), conn);
        		
        	//modifica categoria
        	} else if (op.equalsIgnoreCase("modCat")) {
        		
        		categoriaDao.updateCategoria(Long.parseLong(idCategoria), descCategoria, conn);
        		conn.commit();

        		tipologia = tipologiaDao.leggiTipologiaById(Long.parseLong(idTipologia), conn);
        		categorie = categoriaDao.leggiCategorieByTipologia(Long.parseLong(idTipologia), conn);
        		
        	//cancellazione categoria
        	} else if (op.equalsIgnoreCase("delCat")) {
        		
        		categoriaDao.deleteCategoria(Long.parseLong(idCategoria), conn);
        		conn.commit();

        		tipologia = tipologiaDao.leggiTipologiaById(Long.parseLong(idTipologia), conn);
        		categorie = categoriaDao.leggiCategorieByTipologia(Long.parseLong(idTipologia), conn);
        		
        	} else {
                addMessaggio(request, Messaggio.ERRORE, "Operazione non prevista!");
                forward(TolomeoServlet.ERROR_PAGE, request, response);
                return;
        	}
			
		} catch (SQLException e) {
        
        	String errMsg = "Si � verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} catch (BasicException e) {
			
			String errMsg = "Si � verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		}
		
        request.setAttribute("tipologia",tipologia);
        request.setAttribute("categorie",categorie);
        forward(request,response);
    }

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/pau/dettaglioTipologia.jsp";
	}
}
