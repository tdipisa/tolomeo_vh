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

import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.PoligonoPoligoniUtGenerici;
import it.prato.comune.sit.PoligonoTerritorio;
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
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

/**
 * Servet che riceve la richiesta di visualizzazione della statistica di tutti gli ordini di plessi scolastici per un poligono utente
 * atto a ipotesi e simulazioni e la dispaccia alla jsp idonea.
 * @author Mattia Gennari
 *
 */
public class VisualizzaStatisticaSimulazioneServlet extends TolomeoServlet {    

	private static final long serialVersionUID = -6755844948644136629L;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
		doPost(request,response);
	}

	@SuppressWarnings("unchecked")
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {

		String key = getKey(request);
		String command = getCommand(request);
		String jsonGeometryToExtent = null;

		if (StringUtils.isEmpty(key)) {

			// Se sono presenti errori giro la richiesta alla pagina di errore
			addMessaggio(request, Messaggio.ERRORE, "Chiave univoca non valorizzata");
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;

		} 

		LogInterface logger = getLogger(request);
		StatisticaPlessoInfanzia statisticaPoligonoPlessiInfanzia = new StatisticaPlessoInfanzia();
		StatisticaPlessoPrimaria statisticaPoligonoPlessiPrimarie = new StatisticaPlessoPrimaria();
		StatisticaPlessoSecondariaPG statisticaPoligonoPlessiSecondariePG = new StatisticaPlessoSecondariaPG();

		SITLayersManager comunePO = getTerritorio(logger);
		LayerTerritorio layer = comunePO.getLayerByCodTPN(getCodTPN(request));               

		OggettoTerritorio oggetto = layer.cercaIDTPN(key);        

		if(oggetto == null){
			String errMsg = "Oggetto " + key + " non trovata";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
		}

		PoligonoTerritorio poligono = null;

		if (PoligonoTerritorio.class.isAssignableFrom(oggetto.getClass())) {
			poligono = (PoligonoTerritorio)oggetto;
		} else {
			String errMsg = "La chiave " + key + " non corrisponde ad un oggetto di tipo poligono";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;
		} 

		PlessiScuoleService service = new PlessiScuoleService(logger, layer);
		if (!service.connetti()) {
			String errMsg = "Errore di connessione al database.";
			logger.error(errMsg);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;          
		}

		try {

			// Carico la statistica per il poligono passato relatica a uno specifico ordine di plesso oppure tutti
			if (command.equalsIgnoreCase("simulazioneInfanzia")) {

				statisticaPoligonoPlessiInfanzia = service.getStatisticaPlessoInfanzia(poligono);

			} else if (command.equalsIgnoreCase("simulazionePrimarie")) {

				statisticaPoligonoPlessiPrimarie = service.getStatisticaPlessoPrimariaSenzaCapienze(poligono);

			} else if (command.equalsIgnoreCase("simulazioneSecondariaPG")) {

				statisticaPoligonoPlessiSecondariePG = service.getStatisticaPlessoSecondariaPGSenzaCapienze(poligono);

			} else if (command.equalsIgnoreCase("statisticaPoligono")) {

				statisticaPoligonoPlessiInfanzia     = service.getStatisticaPlessoInfanzia(poligono);
				statisticaPoligonoPlessiPrimarie     = service.getStatisticaPlessoPrimariaSenzaCapienze(poligono);
				statisticaPoligonoPlessiSecondariePG = service.getStatisticaPlessoSecondariaPGSenzaCapienze(poligono);        		
			}

			jsonGeometryToExtent = poligono.getJSGeometry();

		} catch(Exception e) {

			String errMsg = "Si è verificata una eccezione durante il recupero dei dati";
			logger.error(errMsg,e);
			addMessaggio(request, Messaggio.ERRORE, errMsg);
			forward(TolomeoServlet.ERROR_PAGE, request, response);
			return;           

		} finally {

			if(service != null){
				service.disconnetti();
			}
		}

		request.setAttribute("statisticaInfanzia", statisticaPoligonoPlessiInfanzia);
		request.setAttribute("statisticaPrimaria", statisticaPoligonoPlessiPrimarie);
		request.setAttribute("statisticaSecondariaPG", statisticaPoligonoPlessiSecondariePG);

		setAfterForward(request, false, jsonGeometryToExtent);
		forward(request,response);
	}

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/pubblicaIstruzione/visualizzaStatisticaSimulazione.jsp";
	}

	private List<PoligonoPlessoInfanzia> getPlessiInfanziaSottesi(SITLayersManager comunePO, PoligonoPoligoniUtGenerici poligono, LogInterface logger) throws SITException {

		//cerco plessi sottesi dal poligono        
		LayerPlessiInfanzia plessi = LayerPlessiInfanzia.getInstance(comunePO, LayerPlessiInfanzia.SottoTipo.PlessiInfanzia);

		List<PoligonoPlessoInfanzia> sottesi = null;

		try {            
			sottesi = plessi.chiInterseca(poligono);
		} catch(Exception site){
			String errMsg = "Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID();
			logger.error(errMsg,site);            
			throw new SITException("Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID(),site);
		}

		return sottesi;
	}

	private List<PoligonoPlessoPrimaria> getPlessiPrimarieSottesi(SITLayersManager comunePO, PoligonoPoligoniUtGenerici poligono, LogInterface logger) throws SITException {

		//cerco plessi sottesi dal poligono        
		LayerPlessiPrimarie plessi = LayerPlessiPrimarie.getInstance(comunePO, LayerPlessiPrimarie.SottoTipo.PlessiPrimarie);

		List<PoligonoPlessoPrimaria> sottesi = null;

		try {            
			sottesi = plessi.chiInterseca(poligono);
		} catch(Exception site){
			String errMsg = "Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID();
			logger.error(errMsg,site);            
			throw new SITException("Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID(),site);
		}

		return sottesi;
	}

	private List<PoligonoPlessoSecondariaPG> getPlessiSecondariePGSottesi(SITLayersManager comunePO, PoligonoPoligoniUtGenerici poligono, LogInterface logger) throws SITException {

		//cerco plessi sottesi dal poligono        
		LayerPlessiSecondariePG plessi = LayerPlessiSecondariePG.getInstance(comunePO, LayerPlessiSecondariePG.SottoTipo.PlessiSecondariePG); 

		List<PoligonoPlessoSecondariaPG> sottesi = null;

		try {            
			sottesi = plessi.chiInterseca(poligono);
		} catch(Exception site){
			String errMsg = "Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID();
			logger.error(errMsg,site);            
			throw new SITException("Errore nella ricerca delle sezioni sottese dal poligono " + poligono.getID(),site);
		}

		return sottesi;
	}

	private List<StatisticaPlessoInfanzia> getStatistichePlessiInfanziaSottesi(List<PoligonoPlessoInfanzia> plessiSottesi, PoligonoPoligoniUtGenerici poligono, SITLayersManager comunePO, PlessiScuoleService service, LogInterface logger) throws SITException{

		List<StatisticaPlessoInfanzia> listaStatisticheSottesi = new ArrayList<StatisticaPlessoInfanzia>();

		for(PoligonoPlessoInfanzia sotteso: plessiSottesi) {

			StatisticaPlessoInfanzia statisticaPlessoInfanzia = service.getStatisticaPlessoInfanzia(sotteso);
			statisticaPlessoInfanzia.setJsonGeometry(sotteso.getJSGeometry());
			listaStatisticheSottesi.add(statisticaPlessoInfanzia);
		}

		return listaStatisticheSottesi;
	}

	private List<StatisticaPlessoPrimaria> getStatistichePlessiPrimarieSottesi(List<PoligonoPlessoPrimaria> plessiSottesi, PoligonoPoligoniUtGenerici poligono, SITLayersManager comunePO, PlessiScuoleService service, LogInterface logger) throws SITException{

		List<StatisticaPlessoPrimaria> listaStatisticheSottesi = new ArrayList<StatisticaPlessoPrimaria>();

		for(PoligonoPlessoPrimaria sotteso: plessiSottesi) {

			StatisticaPlessoPrimaria statisticaPlessoPrimarie = service.getStatisticaPlessoPrimaria(sotteso);
			statisticaPlessoPrimarie.setJsonGeometry(sotteso.getJSGeometry());
			listaStatisticheSottesi.add(statisticaPlessoPrimarie);
		}

		return listaStatisticheSottesi;
	}

	private List<StatisticaPlessoSecondariaPG> getStatistichePlessiSecondariePGSottesi(List<PoligonoPlessoSecondariaPG> plessiSottesi, PoligonoPoligoniUtGenerici poligono, SITLayersManager comunePO, PlessiScuoleService service, LogInterface logger) throws SITException{

		List<StatisticaPlessoSecondariaPG> listaStatisticheSottesi = new ArrayList<StatisticaPlessoSecondariaPG>();

		for(PoligonoPlessoSecondariaPG sotteso: plessiSottesi) {

			StatisticaPlessoSecondariaPG statisticaPlessoMedia = service.getStatisticaPlessoSecondariaPG(sotteso);
			statisticaPlessoMedia.setJsonGeometry(sotteso.getJSGeometry());
			listaStatisticheSottesi.add(statisticaPlessoMedia);
		}

		return listaStatisticheSottesi;
	}

	private List<StatisticaPlessoInfanzia> getStatistichePoligonoPerPlessoInfanzia(List<PoligonoPlessoInfanzia> plessiSottesi, PoligonoPoligoniUtGenerici poligono, SITLayersManager comunePO, PlessiScuoleService service, LogInterface logger) throws SITException{

		List<StatisticaPlessoInfanzia> listaStatisticheSottesi = new ArrayList<StatisticaPlessoInfanzia>();

		for(PoligonoPlessoInfanzia sotteso: plessiSottesi) {

			PoligonoPlessoInfanzia intersezioneSotteso = null;
			try {
				intersezioneSotteso = (PoligonoPlessoInfanzia)sotteso.getLayer().creaNuovoOggettoTerritorio();
			} catch (IOException ioe) {
				String msg = "Impossibile creare nuovo oggetto dalla sezione sottesa " + sotteso.getCodice();
				logger.error(msg);
				throw new SITException(msg,ioe);
			}
			intersezioneSotteso.setGeometryAttributeWKT(sotteso.getGeometryAttributeWKT());
			intersezioneSotteso.setIDTPN(sotteso.getIDTPN());            
			intersezioneSotteso.intersezione(poligono);
			StatisticaPlessoInfanzia statisticaIntersezioneSotteso = service.getStatisticaPlessoInfanzia(intersezioneSotteso);
			statisticaIntersezioneSotteso.setCodice(intersezioneSotteso.getCodice());
			statisticaIntersezioneSotteso.setJsonGeometry(intersezioneSotteso.getJSGeometry());
			listaStatisticheSottesi.add(statisticaIntersezioneSotteso);
		}

		return listaStatisticheSottesi;
	}

	private List<StatisticaPlessoPrimaria> getStatistichePoligonoPerPlessoPrimarie(List<PoligonoPlessoPrimaria> plessiSottesi, PoligonoPoligoniUtGenerici poligono, SITLayersManager comunePO, PlessiScuoleService service, LogInterface logger) throws SITException{

		List<StatisticaPlessoPrimaria> listaStatisticheSottesi = new ArrayList<StatisticaPlessoPrimaria>();

		for(PoligonoPlessoPrimaria sotteso: plessiSottesi) {

			PoligonoPlessoPrimaria intersezioneSotteso = null;
			try {
				intersezioneSotteso = (PoligonoPlessoPrimaria)sotteso.getLayer().creaNuovoOggettoTerritorio();
			} catch (IOException ioe) {
				String msg = "Impossibile creare nuovo oggetto dalla sezione sottesa " + sotteso.getCodice();
				logger.error(msg);
				throw new SITException(msg,ioe);
			}
			intersezioneSotteso.setGeometryAttributeWKT(sotteso.getGeometryAttributeWKT());
			intersezioneSotteso.setIDTPN(sotteso.getIDTPN());            
			intersezioneSotteso.intersezione(poligono);
			StatisticaPlessoPrimaria statisticaIntersezioneSotteso = service.getStatisticaPlessoPrimaria(intersezioneSotteso);
			statisticaIntersezioneSotteso.setCodice(intersezioneSotteso.getCodice());
			statisticaIntersezioneSotteso.setJsonGeometry(intersezioneSotteso.getJSGeometry());
			listaStatisticheSottesi.add(statisticaIntersezioneSotteso);
		}

		return listaStatisticheSottesi;
	}

	private List<StatisticaPlessoSecondariaPG> getStatistichePoligonoPerPlessoMedia(List<PoligonoPlessoSecondariaPG> plessiSottesi, PoligonoPoligoniUtGenerici poligono, SITLayersManager comunePO, PlessiScuoleService service, LogInterface logger) throws SITException{

		List<StatisticaPlessoSecondariaPG> listaStatisticheSottesi = new ArrayList<StatisticaPlessoSecondariaPG>();

		for(PoligonoPlessoSecondariaPG sotteso: plessiSottesi) {

			PoligonoPlessoSecondariaPG intersezioneSotteso = null;
			try {
				intersezioneSotteso = (PoligonoPlessoSecondariaPG)sotteso.getLayer().creaNuovoOggettoTerritorio();
			} catch (IOException ioe) {
				String msg = "Impossibile creare nuovo oggetto dalla sezione sottesa " + sotteso.getCodice();
				logger.error(msg);
				throw new SITException(msg,ioe);
			}
			intersezioneSotteso.setGeometryAttributeWKT(sotteso.getGeometryAttributeWKT());
			intersezioneSotteso.setIDTPN(sotteso.getIDTPN());            
			intersezioneSotteso.intersezione(poligono);
			StatisticaPlessoSecondariaPG statisticaIntersezioneSotteso = service.getStatisticaPlessoSecondariaPG(intersezioneSotteso);
			statisticaIntersezioneSotteso.setCodice(intersezioneSotteso.getCodice());
			statisticaIntersezioneSotteso.setJsonGeometry(intersezioneSotteso.getJSGeometry());
			listaStatisticheSottesi.add(statisticaIntersezioneSotteso);
		}

		return listaStatisticheSottesi;
	}
}
