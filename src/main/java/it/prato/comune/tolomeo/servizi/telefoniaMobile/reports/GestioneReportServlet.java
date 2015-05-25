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
package it.prato.comune.tolomeo.servizi.telefoniaMobile.reports;

import it.prato.comune.sit.LayerTelefoniaMobile;
import it.prato.comune.sit.PuntoTelefoniaMobile;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.beans.SITBeanContext;
import it.prato.comune.sit.beans.telefoniaMobile.GestoreBean;
import it.prato.comune.sit.dao.telefoniaMobile.GestoreDAO;
import it.prato.comune.sit.toponomastica.LayerVieToponomastica;
import it.prato.comune.sit.toponomastica.PoligonoViaToponomastica;
import it.prato.comune.tolomeo.servizi.telefoniaMobile.model.TelefoniaMobileService;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.core.beans.BasicException;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.JasperRunManager;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;

public class GestioneReportServlet extends TolomeoServlet {

	private static final long serialVersionUID = 4089173345400551319L;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
	    doPost(request,response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
		
		OutputStream out = null;
		InputStream reportImpiantoStream = null; 
		Connection conn = null;
		byte[] bytesImpianto = null; 
		
		SITBeanContext sitContext = SITBeanContext.getInstance();
		LogInterface logger = getLogger(request);
		
		try {
			
			GestoreDAO gestoreDAO = new GestoreDAO(logger);
			
			String key = getKey(request);
			SITLayersManager comunePO = getTerritorio(logger);
			LayerTelefoniaMobile impianti = LayerTelefoniaMobile.getInstance(comunePO);
			PuntoTelefoniaMobile impianto = null;
			
			LayerVieToponomastica vie = LayerVieToponomastica.getInstance(comunePO);
			PoligonoViaToponomastica via = null;
			
			TelefoniaMobileService service = new TelefoniaMobileService(logger, impianti);
			List<GestoreBean> gestori = new ArrayList<GestoreBean>();
			ReportImpiantoBean reportImpiantoBean = new ReportImpiantoBean();
			List<ReportImpiantoBean> dati = new ArrayList<ReportImpiantoBean>();
			dati.add(reportImpiantoBean);
			dati.add(null);
			
			//recupero i dati dell'impianto e li setto nel bean report
			impianto = (PuntoTelefoniaMobile) impianti.cercaIDTPN(key);
			reportImpiantoBean.setCodImpianto(impianto.getCodImpianto());
			reportImpiantoBean.setDataInstallazione( (impianto.getDataInstallazione()!=null) ? impianto.getDataInstallazione().getFormatted() : "" );
			reportImpiantoBean.setRilevatore(impianto.getRilevatore());
			via = (PoligonoViaToponomastica) vie.cercaIDTPN(impianto.getIdStrada().toString());
			reportImpiantoBean.setVia(via);
			reportImpiantoBean.setNumAutorizzazione( (impianto.getNumAutorizzazione()!=null) ? impianto.getNumAutorizzazione() : "" );
			reportImpiantoBean.setTipoAutorizzazione( (impianto.getTipoAutorizzazione()!=null) ? impianto.getTipoAutorizzazione() : "" );
			reportImpiantoBean.setDescLocalizzazione( (impianto.getDescLocalizzazione()!=null) ? impianto.getDescLocalizzazione() : "" );
			reportImpiantoBean.setSuolo( (impianto.getSuolo()!=null) ? impianto.getSuolo() : "" );
			reportImpiantoBean.setNote( (impianto.getNote()!=null) ? impianto.getNote() : "" );
			//recupero i gestori associati all'impianto
			try {
				
				conn = sitContext.getConnection(logger);
				gestori = gestoreDAO.leggiGestoriImpianto(Long.parseLong(impianto.getIDTPN()), conn);
		    	reportImpiantoBean.setGestori(gestori);
		    	
			} catch (SQLException e) {
				String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
	            logger.error(errMsg,e);
	            addMessaggio(request, Messaggio.ERRORE, errMsg);
	            forward(TolomeoServlet.ERROR_PAGE, request, response);
	            return;
	            
			} catch (BasicException e) {
				String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
	            logger.error(errMsg,e);
	            addMessaggio(request, Messaggio.ERRORE, errMsg);
	            forward(TolomeoServlet.ERROR_PAGE, request, response);
	            return;
			}
	
	    	//recupero la statistica (inquadramento territoriale, RU, ecc..)
	    	try {
	    		
				reportImpiantoBean.setStatisticaImpianto(service.getStatisticaImpianto(impianto));
				
			} catch (SITException e) {
				String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
	            logger.error(errMsg,e);
	            addMessaggio(request, Messaggio.ERRORE, errMsg);
	            forward(TolomeoServlet.ERROR_PAGE, request, response);
	            return;
			}

			//urlMappa
			String host = request.getServerName();
			int port = request.getServerPort();
			String rep = (port==81 || port==8443) ? "test" : "prod";
			port = (rep.equals("test")) ? 81 : 80;
			//String file = "/tolomeobinj/TolomeoPrintServlet?paramPreset=telefoniaMobile&azioniApertura=<azioniApertura><action>ZoomToOgg</action><zoomToCodTPN>-4200</zoomToCodTPN><zoomToIdTPN>"+impianto.getIDTPN()+"</zoomToIdTPN></azioniApertura>"; 
			String file = "/cgi-bin/mapserv?map=/usr1/"+rep+"/vh/tolomeo/mapfiles/telefoniaMobile.map&mode=map&map_imagetype=agga&map_size=1200+1200&map_resolution=288&scale=2000&mapxy="+impianto.getCentroide().getX()+"+"+impianto.getCentroide().getY()+"&layers=TELEFONIA_MOBILE%20FOTO2009";
			URL urlMappa = new URL("http",host,port,file);
			logger.info("URL mappa impianto report: " + urlMappa);
			reportImpiantoBean.setUrlMappa(urlMappa);
			
			//pathImmagine
			reportImpiantoBean.setPathImg("/tolomeohtdocs/img/servizi/telefoniaMobile/impianti/"+reportImpiantoBean.getCodImpianto()+".jpg");
			
	        Map params = new HashMap();
	        params.put("SUBREPORT_DIR","reports/servizi/telefoniaMobile/");
	        
	        try {
	        	
	        	JasperReport jasperReport = (JasperReport)JRLoader.loadObjectFromLocation("reports/servizi/telefoniaMobile/telefoniaMobile.jasper");
	        	
	        	JRDataSource dataSourceImpianto = new JRBeanCollectionDataSource(dati);
	            
	        	bytesImpianto = JasperRunManager.runReportToPdf(jasperReport, params, dataSourceImpianto);
	        	
	        } catch (JRException ex) {
	            logger.error("Problemi nella creazione del report",ex);
	           	addMessaggio(request, Messaggio.ERRORE, "Problemi nella creazione del report. Se il problema sussiste contattare l'amministratore di sistema");
	            forward(ERROR_PAGE, request, response);
	            return;           
	        } 
	        
	        logger.debug("Creo out!");          
	        out = response.getOutputStream();
	        logger.debug("Creato!");
	        response.setContentType("application/pdf");
	        response.setContentLength(bytesImpianto.length);
	        logger.debug("Scrivo!");
	        out.write(bytesImpianto, 0, bytesImpianto.length);
	        
		} finally {
			
	         if (conn != null) {
	            sitContext.closeConnection(conn,logger);
	         }
	          
	         if (out != null) {
	             try {
	                 out.flush();               
	                 out.close();
	             } catch(Exception e) {
	                 logger.error("Impossibile finalizzare l'OutputStream");
	             }
	         }
	         
	         if (bytesImpianto != null) 	  bytesImpianto = null;
	         if (reportImpiantoStream!= null) reportImpiantoStream.close();
		}
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}
}
