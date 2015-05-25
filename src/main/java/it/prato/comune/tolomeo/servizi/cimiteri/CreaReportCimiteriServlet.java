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
package it.prato.comune.tolomeo.servizi.cimiteri;

import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.cimiteri.LayerBaciniCimiteri;
import it.prato.comune.sit.cimiteri.PoligonoBaciniCimiteri;
import it.prato.comune.tolomeo.servizi.shared.beans.StatisticaFasceEta;
import it.prato.comune.tolomeo.servizi.shared.model.IntersectAnagrafeService;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet che recupera la statistica per tutti i plessi scolastici creando un report e restituendolo in csv.
 * 
 * @author Mattia Gennari
 */
public class CreaReportCimiteriServlet extends TolomeoServlet {

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

		String tipoReport                 = request.getParameter("tipoReport");
		LogInterface logger               = getLogger(request);
		SITLayersManager ter              = getTerritorio(logger);
		LayerBaciniCimiteri layerCimiteri = LayerBaciniCimiteri.getInstance(ter);
		IntersectAnagrafeService service  = new IntersectAnagrafeService(logger, layerCimiteri);
		
		response.setCharacterEncoding("iso-8859-15");
		response.setContentType("application/vnd.ms-excel");
		PrintWriter print = response.getWriter();
		String SEP = ";";

		try {

			response.addHeader("Content-Disposition", "attachment;filename=reportBaciniCimiteri.csv");

			StatisticaFasceEta statistica = new StatisticaFasceEta();
			HashMap<String, StatisticaFasceEta> listaStatistiche = new HashMap<String, StatisticaFasceEta>();
			List<PoligonoBaciniCimiteri> listaPoligoniCimiteri = null;
			
			//recupero tutti i poligoni del layer
			Filtro filtro = layerCimiteri.getFiltroVuoto();
			filtro.ResetFiltro();
			layerCimiteri.setFiltro(filtro);
			listaPoligoniCimiteri = layerCimiteri.cercaFiltro();
			
			service.connetti();
			
			if (tipoReport.equalsIgnoreCase("singolo")) {
				
				for (PoligonoBaciniCimiteri poligonoCimiteri: listaPoligoniCimiteri) {
					statistica = service.getAbitantiFasceEtaNazio(poligonoCimiteri, 3);
					listaStatistiche.put(poligonoCimiteri.getNome(), statistica);
				}
				
				for (Map.Entry<String, StatisticaFasceEta> entry : listaStatistiche.entrySet()) {
				    String key = entry.getKey();
				    StatisticaFasceEta value = entry.getValue();
				    
				    print.println(key);
				    //scrivo la fascia sul PrintWriter
					scriviStatBacino(value, print, SEP);
				}
				
			} else if (tipoReport.equalsIgnoreCase("totale")) {
				
				//unisco tutti i poligoni
				PoligonoBaciniCimiteri tutti = null;
				tutti = (PoligonoBaciniCimiteri) tutti.getUnione(listaPoligoniCimiteri);
				
				statistica = service.getAbitantiFasceEtaNazio(tutti, 3);
				
				//scrivo la fascia sul PrintWriter
				scriviStatBacino(statistica, print, SEP);
				
			} else {
				logger.error("Non è stato trovato nessun report: " + tipoReport);
			}

		} catch (SITException e) {

			String errMsg = "Si è verificata una eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			return;

		} catch (Exception e) {

			String errMsg = "Si è verificata una eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			return;
			
		} finally {
			
			print.flush();
			print.close();
			service.disconnetti();
		}
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}
	
	/**
	 * 
	 * @param statistica
	 * @param print
	 * @param SEP
	 */
	private void scriviStatBacino(StatisticaFasceEta statistica, PrintWriter print, String SEP) {
		print.println("Età inf" + SEP + "Età sup" + SEP + "Italiani" + SEP + "Stranieri" + SEP + "Tot fascia");
		for (int i=0; i<statistica.getFasceEta().size(); i++) {
			print.println(
				statistica.getFasceEta().get(i).getInterInf()  + SEP +
				statistica.getFasceEta().get(i).getInterSup()  + SEP + 
				statistica.getFasceEta().get(i).getItaliani()  + SEP +
				statistica.getFasceEta().get(i).getStranieri() + SEP +
				statistica.getFasceEta().get(i).getTotFascia() + SEP
			);
		}
		print.println("Totale" + SEP + SEP + statistica.getTotItaliani() + SEP + statistica.getTotStranieri() + SEP + statistica.getTotGlobaleItaStra());
	    print.println("");
	}
}
