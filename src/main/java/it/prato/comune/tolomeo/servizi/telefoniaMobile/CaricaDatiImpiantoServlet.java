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
package it.prato.comune.tolomeo.servizi.telefoniaMobile;

import it.prato.comune.sit.LayerTelefoniaMobile;
import it.prato.comune.sit.PuntoTelefoniaMobile;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.sit.beans.telefoniaMobile.GestoreBean;
import it.prato.comune.sit.dao.telefoniaMobile.GestoreDAO;
import it.prato.comune.sit.toponomastica.LayerVieToponomastica;
import it.prato.comune.sit.toponomastica.PoligonoViaToponomastica;
import it.prato.comune.tolomeo.utility.Input;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class CaricaDatiImpiantoServlet extends TolomeoServlet {

	private static final long serialVersionUID = 3947230713660906784L;
	
	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    @SuppressWarnings("unchecked")
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
    	
//    	List<Messaggio> messaggi = (ArrayList<Messaggio>)request.getAttribute("messaggi");
//        List<Input> button = (ArrayList<Input>)request.getAttribute("button");
        PuntoTelefoniaMobile impianto = (PuntoTelefoniaMobile)request.getAttribute("impianto");
        boolean errors = (request.getAttribute("errors")!=null) ?  (Boolean)request.getAttribute("errors") : false;
        
    	String key = getKey(request);
    	String forward = getForward(request);
    	String codTPN = request.getParameter("codTPN");
        String geoOp = request.getParameter("geoOp");
        
    	LogInterface logger = getLogger(request);
    	SITLayersManager comunePO = getTerritorio(logger);
    	String JSGeometry = null;
    	
    	LayerVieToponomastica vie = LayerVieToponomastica.getInstance(comunePO);
    	GestoreDAO gestoreDAO = new GestoreDAO(logger);
    	List<GestoreBean> gestoriChecked = new ArrayList<GestoreBean>();
    	List<GestoreBean> gestoriNotChecked = new ArrayList<GestoreBean>();
    	SITBeanContext sitContext = SITBeanContext.getInstance();
    	Connection conn = null;
    	
    	PoligonoViaToponomastica via = null;
    	String selezionato = request.getParameter("selectedList");
    	
    	//Se sono presenti errori giro la richiesta alla pagina di errore
		if (StringUtils.isEmpty(codTPN)) {
			
			addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;

		} else if (StringUtils.isEmpty(geoOp)) {
			
			String errMsg = "Parametro geoOp non valorizzato";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		}
		
		try {
			
			conn = sitContext.getConnection(logger);
			
			LayerTelefoniaMobile impianti = (LayerTelefoniaMobile) comunePO.getLayerByCodTPN(Integer.parseInt(codTPN));
			
			if (geoOp.equals(Parametri.digitizeOperationInsert)) {
				
				String idTPNVia = null;
		    	if (StringUtils.isNotEmpty(selezionato) && selezionato.indexOf("<IDTPN>")!=-1) {
		    		idTPNVia = selezionato.substring(selezionato.indexOf("<IDTPN>") + 7, selezionato.indexOf("</IDTPN>"));
		    		via = (PoligonoViaToponomastica) vie.cercaIDTPN(idTPNVia);
		    	}
		    	
				gestoriNotChecked = gestoreDAO.leggiGestori(conn);
				
				request.setAttribute("gestoriNotChecked",gestoriNotChecked);
				addButton(request, Input.INSERISCI);
				
			} else if (geoOp.equals(Parametri.operationUpdateAlfa)) {
				
				//se durante la modifica sono stati riscontrati errori nella GestioneImpiantoServelet non recupero i dati di quell'impianto ma visualizzo quelli che sono stati inseriti nel form
				if (!errors) impianto = (PuntoTelefoniaMobile) impianti.cercaIDTPN(key);

				impianto.getCodImpianto();
				impianto.getDataInstallazione();
				impianto.getRilevatore();
				impianto.getIdStrada();
				impianto.getNumAutorizzazione();
				impianto.getTipoAutorizzazione();
				impianto.getDescLocalizzazione();
				impianto.getSuolo();
				impianto.getNote();
				
				gestoriChecked = gestoreDAO.leggiGestoriImpianto(Long.parseLong(key), conn);
				gestoriNotChecked = gestoreDAO.leggiGestoriNonAssegnati(Long.parseLong(key), conn);
				
				JSGeometry = impianto.getJSGeometry();
				
				addButton(request, Input.MODIFICA_OK);
				request.setAttribute("gestoriChecked",gestoriChecked);
				request.setAttribute("gestoriNotChecked",gestoriNotChecked);
			}
		
		} catch (SQLException e) {
			
			String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
		
		} catch (BasicException e) {
			
			String errMsg = "Si è verificata un'eccezione durante il recupero della connessione";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
            
		} catch(Exception e) {
			
			String errMsg = "Si è verificata un'eccezione durante l'aggiornamento dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(TolomeoServlet.ERROR_PAGE, request, response);
            return;
	
		} finally {
			if (conn!=null) {
				sitContext.closeConnection(conn, logger);
			}
		}
		
		addButton(request, Input.PULISCI);
		setAfterForward(request, false, JSGeometry);
		request.setAttribute("impianto",impianto);
		request.setAttribute("via", via);
		forward(forward, request, response);
    }
	
	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/telefoniaMobile/gestioneImpianto.jsp";
	}
}
