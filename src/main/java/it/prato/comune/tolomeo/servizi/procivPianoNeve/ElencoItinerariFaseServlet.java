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
package it.prato.comune.tolomeo.servizi.procivPianoNeve;
 
import it.prato.comune.sit.Filtro;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.LayerItinerari;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.LayerPuntiSensibili;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.LayerZone;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.LineaItinerari;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.PoligonoZone;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class ElencoItinerariFaseServlet extends TolomeoServlet {    

	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
	    super.init(config);
	}
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
      doPost(request,response);
    }

    @SuppressWarnings("static-access")
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, java.io.IOException {
        
    	LogInterface logger = getLogger(request);
    	SITLayersManager comunePO = getTerritorio(logger);
		
        String idFase = (String) request.getParameter("idFase");
        
        LayerItinerari      itinerFaseA  = null;
        LayerItinerari      itinerFaseAB = null;
        LayerItinerari      itinerFaseB  = null;
        LayerZone           itinerFaseC  = null;
        Filtro filtro;
        
        List<LineaItinerari>      listaItinerari      = null;
        List<PoligonoZone>        listaZone           = null;
        
        
        try {
	        
        	if (StringUtils.isNotEmpty(idFase)) {
        		
		        if (StringUtils.equalsIgnoreCase(idFase, "A")) {
		        	
		        	itinerFaseA = LayerItinerari.getInstance(comunePO, LayerItinerari.SottoTipo.FaseA);
		        	
		        	filtro = itinerFaseA.getFiltroVuoto();
					itinerFaseA.setFiltro(filtro);
					listaItinerari = itinerFaseA.cercaFiltro();
					
					itinerFaseA.ordinaByIdItiner(listaItinerari);
					
					request.setAttribute("layerItinerari",itinerFaseA);
					addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
			        request.setAttribute("idFase",idFase);
			        request.setAttribute("listaItinerari",listaItinerari);
			        forward(request,response);
		        	
		        } else if (StringUtils.equalsIgnoreCase(idFase, "AB")) {
		        	
		        	itinerFaseAB = LayerItinerari.getInstance(comunePO, LayerItinerari.SottoTipo.FaseAB);
	
		        	filtro = itinerFaseAB.getFiltroVuoto();
					itinerFaseAB.setFiltro(filtro);
					listaItinerari = itinerFaseAB.cercaFiltro();
					
					itinerFaseAB.ordinaByIdItiner(listaItinerari);
					
					request.setAttribute("layerItinerari",itinerFaseAB);
					addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
			        request.setAttribute("idFase",idFase);
			        request.setAttribute("listaItinerari",listaItinerari);
			        forward(request,response);
		        	
		        } else if (StringUtils.equalsIgnoreCase(idFase, "B")) {
		        	
		        	itinerFaseB = LayerItinerari.getInstance(comunePO, LayerItinerari.SottoTipo.FaseB);
		        	
		        	filtro = itinerFaseB.getFiltroVuoto();
					itinerFaseB.setFiltro(filtro);
					listaItinerari = itinerFaseB.cercaFiltro();
					
					itinerFaseB.ordinaByIdItiner(listaItinerari);
					
					request.setAttribute("layerItinerari",itinerFaseB);
					addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
			        request.setAttribute("idFase",idFase);
			        request.setAttribute("listaItinerari",listaItinerari);
			        forward(request,response);
		        
		        } else if (StringUtils.equalsIgnoreCase(idFase, "C")) {
		        	
		        	itinerFaseC = LayerZone.getInstance(comunePO);
		        	
		        	filtro = itinerFaseC.getFiltroVuoto();
					filtro.ResetFiltro();
					itinerFaseC.setFiltro(filtro);
					listaZone = itinerFaseC.cercaFiltro();
					
					itinerFaseC.ordinaByIdItiner(listaZone);
			        
			        addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga dell'operatore per evidenziare il suo itinerario, fai click per selezionarlo e vederne il dettaglio");
			        request.setAttribute("idFase",idFase);
			        request.setAttribute("layerItinerari",itinerFaseC);
			        request.setAttribute("listaZone",listaZone);
			        forward(request,response);
					
		        } else if (StringUtils.equalsIgnoreCase(idFase, "D")) {
		        	
		        	LayerPuntiSensibili layerPuntiSensibili = LayerPuntiSensibili.getInstance(comunePO);
		            HashMap<Integer, OggettoTerritorio> mapPuntiSensibili = new HashMap<Integer, OggettoTerritorio>();
		            
		        	for (int i=1; i<16; i++) {
		        		OggettoTerritorio tutte = OggettoTerritorio.getUnione(layerPuntiSensibili.cercaPuntiBySquadra(i));
		        		mapPuntiSensibili.put(i, tutte);
		        	};
		        	
		        	addMessaggio(request, Messaggio.INFORMAZIONE, "Soffermati sulla riga della squadra per evidenziare i punti sensibili di competenza, fai click per selezionarli e vederne il dettaglio");
					request.setAttribute("layerPuntiSensibili",layerPuntiSensibili);
					request.setAttribute("mapPuntiSensibili",mapPuntiSensibili);
					forward("/jsp/servizi/procivPianoNeve/elencoSquadre.jsp",request,response);
					
		        } else {
		        	
		        	String errMsg = "E' necessario passare l'identificativo della fase!";
		            addMessaggio(request, Messaggio.ERRORE, errMsg);
		            forward(super.ERROR_PAGE, request, response);
		            return;
		        }
        	}
        	
        } catch (SITException e) {
        	String errMsg = "Si è verificata un'eccezione durante il recupero dei dati";
            logger.error(errMsg,e);
            addMessaggio(request, Messaggio.ERRORE, errMsg);
            forward(super.ERROR_PAGE, request, response);
            return;
		}
        
    }

	@Override
	protected String getDefaultForward() {
		return "/jsp/servizi/procivPianoNeve/elencoItinerariFase.jsp";
	}
}