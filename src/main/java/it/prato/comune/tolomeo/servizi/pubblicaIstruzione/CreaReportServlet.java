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
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.pubblicaIstruzione.LayerPlessiInfanzia;
import it.prato.comune.sit.pubblicaIstruzione.LayerPlessiPrimarie;
import it.prato.comune.sit.pubblicaIstruzione.LayerPlessiSecondariePG;
import it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoInfanzia;
import it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoPrimaria;
import it.prato.comune.sit.pubblicaIstruzione.PoligonoPlessoSecondariaPG;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.StatisticaPlessoInfanzia;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.StatisticaPlessoPrimaria;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans.StatisticaPlessoSecondariaPG;
import it.prato.comune.tolomeo.servizi.pubblicaIstruzione.model.PlessiScuoleService;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet che recupera la statistica per tutti i plessi scolastici creando un report e restituendolo in csv.
 * 
 * @author Mattia Gennari
 */
public class CreaReportServlet extends TolomeoServlet {

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

		LogInterface logger = getLogger(request);
		SITLayersManager comunePO = getTerritorio(logger);
		
		Integer codTPN = getCodTPN(request);
		String key     = getKey(request);
		Integer grado  = (request.getParameter("grado")!=null) ? Integer.parseInt(request.getParameter("grado")) : -1;
		
		response.setCharacterEncoding("iso-8859-15");
		response.setContentType("application/vnd.ms-excel");
		PrintWriter print = response.getWriter();
		String SEP = ";";

		PlessiScuoleService service = new PlessiScuoleService(logger, LayerAnagrafe.getInstance(comunePO));

		try {

			logger.info("codTPN: " + codTPN);
			logger.info("grado : " + grado);
			
			//report plessi infanzia
			if (grado==0) {

				response.addHeader("Content-Disposition", "attachment;filename=plessiInfanzia.csv");

				List<StatisticaPlessoInfanzia> statistichePlessiInfanzia = new ArrayList<StatisticaPlessoInfanzia>();
				LayerPlessiInfanzia layerInfanzia = (LayerPlessiInfanzia) comunePO.getLayerByCodTPN(codTPN);
				List<PoligonoPlessoInfanzia> poligoniInfanzia = null;
				
				Filtro filtro = layerInfanzia.getFiltroVuoto();
				filtro.ResetFiltro();
				layerInfanzia.setFiltro(filtro);
				poligoniInfanzia = layerInfanzia.cercaFiltro();

				for (PoligonoPlessoInfanzia poligonoInfanzia: poligoniInfanzia) {
					statistichePlessiInfanzia.add(service.getStatisticaPlessoInfanzia(poligonoInfanzia));
				}

				int range = 3;

				for (int i=0; i<statistichePlessiInfanzia.size(); i++) {
					StatisticaPlessoInfanzia statisticaPlessoInfanzia = statistichePlessiInfanzia.get(i);
					Integer [] leve = statisticaPlessoInfanzia.getAnniNascita();

					print.println("Plesso: " + statisticaPlessoInfanzia.getNomePlesso() + " (" + statisticaPlessoInfanzia.getCodice() + ")");
					print.println("Leva;Italiani;Stranieri;Tot nell'anno;Classi;Anticipatari italiani;Anticipatari straanieri;Tot anticipatari;Tot globale");
					for (int j=0; j<leve.length; j++) {
						print.println(
								leve[j] + ";" +
								statisticaPlessoInfanzia.getInfanzia(leve[j]).getItaliani() + SEP +
								statisticaPlessoInfanzia.getInfanzia(leve[j]).getStranieri() + SEP +
								statisticaPlessoInfanzia.getTotale(leve[j]) + SEP +
								statisticaPlessoInfanzia.getInfanzia(leve[j]).getClassi() + SEP +
								statisticaPlessoInfanzia.getInfanzia(leve[j]).getAnticipatariItaliani() + SEP +
								statisticaPlessoInfanzia.getInfanzia(leve[j]).getAnticipatariStranieri() + SEP +
								statisticaPlessoInfanzia.getTotaleAnticipatari(leve[j]) + SEP +
								statisticaPlessoInfanzia.getTotaleGlobale(leve[j])
						);
					}
					print.println("");
					print.println("Anno scolastico;Leva;Italiani;Stranieri;Totale");
					for (int j=0; j+(range-1)<leve.length+1; j++) {
						print.println(
								leve[j]+5 + "/" + (leve[j]+5+1) + SEP +
								leve[j] + "-" + (leve[j]+2) + SEP +
								statisticaPlessoInfanzia.getTotaleItalianiRange(statisticaPlessoInfanzia.getInfanziaRange(leve[j], leve[j]+2)) + SEP +
								statisticaPlessoInfanzia.getTotaleStranieriRange(statisticaPlessoInfanzia.getInfanziaRange(leve[j], leve[j]+2)) + SEP +
								statisticaPlessoInfanzia.getTotaleRange(statisticaPlessoInfanzia.getInfanziaRange(leve[j], leve[j]+2)) + SEP
						);
					}
					print.println("");
					print.println("");
				}

			//report plessi primarie
			} else if (grado==1) {

				response.addHeader("Content-Disposition", "attachment;filename=plessiPrimarie.csv");

				List<StatisticaPlessoPrimaria> statistichePlessiPrimarie = new ArrayList<StatisticaPlessoPrimaria>();
				LayerPlessiPrimarie layerPrimarie = (LayerPlessiPrimarie) comunePO.getLayerByCodTPN(codTPN);
				List<PoligonoPlessoPrimaria> poligoniPrimaria = null;
				
				Filtro filtro = layerPrimarie.getFiltroVuoto();
				filtro.ResetFiltro();
				layerPrimarie.setFiltro(filtro);
				poligoniPrimaria = layerPrimarie.cercaFiltro();

				for (PoligonoPlessoPrimaria poligonoPrimaria: poligoniPrimaria) {
					statistichePlessiPrimarie.add(service.getStatisticaPlessoPrimaria(poligonoPrimaria));
				}
				
				for (int i=0; i<statistichePlessiPrimarie.size(); i++) {
					StatisticaPlessoPrimaria statisticaPlessoPrimaria = statistichePlessiPrimarie.get(i);

					print.println("Plesso: " + statisticaPlessoPrimaria.getNomePlesso() + " (" + statisticaPlessoPrimaria.getCodice() + ")");
					//suddivisione per sesso
					print.println("Età;Maschi;Femmine;Totale");
					print.println(
							statisticaPlessoPrimaria.getEtaMin() + "_" + statisticaPlessoPrimaria.getEtaMax() + SEP +
							statisticaPlessoPrimaria.getMaschi() + SEP +
							statisticaPlessoPrimaria.getFemmine() + SEP +
							statisticaPlessoPrimaria.getTotSesso()
					);
					//suddivisione per nazionalità
					print.println("Età;Italiani;Stranieri;Totale");
					print.println(
							statisticaPlessoPrimaria.getEtaMin() + " " + statisticaPlessoPrimaria.getEtaMax() + SEP +
							statisticaPlessoPrimaria.getItaliani() + SEP +
							statisticaPlessoPrimaria.getStranieri() + SEP +
							statisticaPlessoPrimaria.getTotNazionalita()
					);
					//suddivisione per tipo iscrizione
					Integer [] anniScolasticiInf = statisticaPlessoPrimaria.getAnniScolasticiInf();
					print.println("Anno scolastico;Iscrizioni obbligatorie (anni);Iscrizioni facoltative (anni);Totale;Iscrizioni obbligatorie 1a classe;Capienza 1e classi;Differenza");
					for (int j=0; j<anniScolasticiInf.length; j++) {
						print.println(
								anniScolasticiInf[j] + "/" + (anniScolasticiInf[j]+1) + SEP +
								statisticaPlessoPrimaria.getPrimaria(anniScolasticiInf[j]).getIscrizioniObbligatorie() + " (" + (anniScolasticiInf[j]-10) + "-" + (anniScolasticiInf[j]-6) + ");" +
								statisticaPlessoPrimaria.getPrimaria(anniScolasticiInf[j]).getIscrizioniFacoltative() + " (1/1/" + (anniScolasticiInf[j]-5) + "-30/4/" + (anniScolasticiInf[j]-5) + ");" +
								statisticaPlessoPrimaria.getPrimaria(anniScolasticiInf[j]).getTotIscrizioni() + SEP +
								statisticaPlessoPrimaria.getPrimaria(anniScolasticiInf[j]).getIscrizioniObbligatorieClassePrima() + SEP +
								statisticaPlessoPrimaria.getPrimaria(anniScolasticiInf[j]).getCapienzaClassiPrime() + SEP +
								statisticaPlessoPrimaria.getPrimaria(anniScolasticiInf[j]).getDifferenza()
						);
					}
					//suddivisione per anno solare di nascita
					Set<Integer> as = statisticaPlessoPrimaria.getBambiniPerAnnoSolare().keySet(); //anni solari
					Integer[] asOrdered = new Integer[as.size()];
					asOrdered = as.toArray(asOrdered);
					Arrays.sort(asOrdered);
					print.println("Anno solare;Numero bambini");
					for (int j=0; j<asOrdered.length; j++) {
						print.println(
								asOrdered[j] + SEP +
								statisticaPlessoPrimaria.getBambiniPerAnnoSolare().get(asOrdered[j])
						);
					}
					print.println("");
					print.println("");
				}

			//report plessi secondarie primo grado
			} else if (grado==2) {

				response.addHeader("Content-Disposition", "attachment;filename=plessiSecondariaPG.csv");

				List<StatisticaPlessoSecondariaPG> statistichePlessiSecondariePG = new ArrayList<StatisticaPlessoSecondariaPG>();
				LayerPlessiSecondariePG layerSecondariePG = (LayerPlessiSecondariePG) comunePO.getLayerByCodTPN(codTPN);
				List<PoligonoPlessoSecondariaPG> poligoniSecondariaPG = null;
				
				Filtro filtro = layerSecondariePG.getFiltroVuoto();
				filtro.ResetFiltro();
				layerSecondariePG.setFiltro(filtro);
				poligoniSecondariaPG = layerSecondariePG.cercaFiltro();

				for (PoligonoPlessoSecondariaPG poligonoSecondariaPG: poligoniSecondariaPG) {
					statistichePlessiSecondariePG.add(service.getStatisticaPlessoSecondariaPG(poligonoSecondariaPG));
				}

				for (int i=0; i<statistichePlessiSecondariePG.size(); i++) {
					StatisticaPlessoSecondariaPG statisticaPlessoSecondariaPG = statistichePlessiSecondariePG.get(i);

					print.println("Plesso: " + statisticaPlessoSecondariaPG.getNomePlesso() + " (" + statisticaPlessoSecondariaPG.getCodice() + ")");
					//suddivisione per sesso
					print.println("Età;Maschi;Femmine;Totale");
					print.println(
							statisticaPlessoSecondariaPG.getEtaMin() + "_" + statisticaPlessoSecondariaPG.getEtaMax() + SEP +
							statisticaPlessoSecondariaPG.getMaschi() + SEP +
							statisticaPlessoSecondariaPG.getFemmine() + SEP +
							statisticaPlessoSecondariaPG.getTotSesso()
					);
					//suddivisione per nazionalità
					print.println("Età;Italiani;Stranieri;Totale");
					print.println(
							statisticaPlessoSecondariaPG.getEtaMin() + " " + statisticaPlessoSecondariaPG.getEtaMax() + SEP +
							statisticaPlessoSecondariaPG.getItaliani() + SEP +
							statisticaPlessoSecondariaPG.getStranieri() + SEP +
							statisticaPlessoSecondariaPG.getTotNazionalita()
					);
					//suddivisione per tipo iscrizione
					Integer [] anniScolasticiInf = statisticaPlessoSecondariaPG.getAnniScolasticiInf();
					print.println("Anno scolastico;Iscrizioni obbligatorie (anni);Iscrizioni obbligatorie 1a classe;Capienza 1e classi;Differenza");
					for (int j=0; j<anniScolasticiInf.length; j++) {
						print.println(
								anniScolasticiInf[j] + "/" + (anniScolasticiInf[j]+1) + SEP +
								statisticaPlessoSecondariaPG.getSecondariaPG(anniScolasticiInf[j]).getIscrizioniObbligatorie() + " (" + (anniScolasticiInf[j]-13) + "-" + (anniScolasticiInf[j]-11) + ");" +
								statisticaPlessoSecondariaPG.getSecondariaPG(anniScolasticiInf[j]).getIscrizioniObbligatorieClassePrima() + SEP +
								statisticaPlessoSecondariaPG.getSecondariaPG(anniScolasticiInf[j]).getCapienzaClassiPrime() + SEP +
								statisticaPlessoSecondariaPG.getSecondariaPG(anniScolasticiInf[j]).getDifferenza()
						);
					}
					//suddivisione per anno solare di nascita
					Set<Integer> as = statisticaPlessoSecondariaPG.getBambiniPerAnnoSolare().keySet(); //anni solari
					Integer[] asOrdered = new Integer[as.size()];
					asOrdered = as.toArray(asOrdered);
					Arrays.sort(asOrdered);
					print.println("Anno solare;Numero bambini");
					for (int j=0; j<asOrdered.length; j++) {
						print.println(
								asOrdered[j] + SEP +
								statisticaPlessoSecondariaPG.getBambiniPerAnnoSolare().get(asOrdered[j])
						);
					}
					print.println("");
					print.println("");
				}
			} else {
				logger.error("Grado " + grado + " non valido!");
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
