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
package it.prato.comune.tolomeo.servizi.pubblicaIstruzione;

import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.LayerAnagrafe;
import it.prato.comune.sit.PuntoAnagrafe;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.pubblicaIstruzione.LayerPlessiPrimarie;
import it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoPrimaria;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet che recupera la statica per tutti i plessi scolastici creando un report e restituendolo in csv.
 * 
 * @author Mattia Gennari
 */
public class BambiniPlessiReportServlet extends TolomeoServlet {

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		//Integer codTPN = getCodTPN(request);
		//Integer key = getCodTPN(request);
		String [] keys = {"S23","S44","S52","S21","S39","S19"};
		
		LogInterface logger = getLogger(request);
		SITLayersManager comunePO = getTerritorio(logger);
		
		LayerPlessiPrimarie primarie = LayerPlessiPrimarie.getInstance(comunePO, LayerPlessiPrimarie.SottoTipo.PlessiPrimarieElab);
		LayerAnagrafe anagrafi = LayerAnagrafe.getInstance(comunePO);
		
		response.setContentType("application/vnd.ms-excel");
		PrintWriter print = response.getWriter();

		try {

			response.addHeader("Content-Disposition", "attachment;filename=primarie.csv");
			
			for (String key : keys) {
				
				PoligonoPlessoPrimaria plesso = primarie.cercaPlessoPrimaria(key);
		        
				Filtro filtroAnagrafe = anagrafi.getFiltroVuoto();
				filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,"to_date('20000101','YYYYMMDD')",">=");
		        filtroAnagrafe.AndFiltro(LayerAnagrafe.NL_DATANASCITA,"to_date('20041231','YYYYMMDD')","<=");
		        anagrafi.setFiltro(filtroAnagrafe);
		        
				List<PuntoAnagrafe> puntiAnag = anagrafi.chiInterseca(plesso);
				
				print.println("Plesso: " + plesso.getDescrizione());
				print.println("Codice;Cognome;Nome;Data nascita;Indirizzo");
				
				for (PuntoAnagrafe puntoAnag : puntiAnag) {
					print.println(
						puntoAnag.getCodicePersonale() + ";" +
						puntoAnag.getCognome() + ";" +
						puntoAnag.getNome() + ";" +
						puntoAnag.getDataNascitaDT().getFormatted() + ";" +
						puntoAnag.getIndirizzo() 
					);
				}
			}

		} catch (SITException e) {

			String errMsg = "Si è verificata una eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			return;

		} catch (Exception e) {

			String errMsg = "Si è verificata una eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			return;
		}

		print.flush();
		print.close();
	}

	@Override
	protected String getDefaultForward() {
		return null;
	}
}
