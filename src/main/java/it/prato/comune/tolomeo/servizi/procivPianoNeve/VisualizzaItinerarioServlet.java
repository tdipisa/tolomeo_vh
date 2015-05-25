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
 
import it.prato.comune.sit.LayerTerritorio;
import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.LayerPuntiSensibili;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.LayerZone;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.LineaItinerari;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.PoligonoZone;
import it.prato.comune.sit.plugin.comunePO.pianoNeve.PuntoPuntiSensibili;
import it.prato.comune.tolomeo.utility.Messaggio;
import it.prato.comune.tolomeo.web.TolomeoServlet;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

public class VisualizzaItinerarioServlet extends TolomeoServlet {    

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
		
        String key     = getKey(request);
        Integer codTPN = getCodTPN(request);
        String idFase  = (String) request.getParameter("idFase");
        String szsquadra  = (String) request.getParameter("squadra");
        Integer squadra = null;
        
        squadra = (StringUtils.isNotEmpty(szsquadra)) ? Integer.parseInt(szsquadra) : 0;
        
        try {
	        if (StringUtils.isNotEmpty(idFase)) {
	    		
	        	request.setAttribute("idFase",idFase);
	        	
	        	//...nelle fasi A, AB e B uso il layer lineare
		        if (StringUtils.equalsIgnoreCase(idFase, "A") || 
		        	StringUtils.equalsIgnoreCase(idFase, "B") ||
		        	StringUtils.equalsIgnoreCase(idFase, "AB") ) {
		        	
		        	LayerTerritorio layer = comunePO.getLayerByCodTPN(codTPN);
		        	LineaItinerari itinerario = (LineaItinerari) layer.cercaIDTPN(key);
		        	
		        	request.setAttribute("itinerario",itinerario);
		        	setAfterForward(request, false, itinerario.getJSGeometry());
		            forward(request,response);
		        
		        //...nella fase C uso il layer poligonale
		        } else if (StringUtils.equalsIgnoreCase(idFase, "C")) {
		        	
		        	LayerZone layer = LayerZone.getInstance(comunePO);
		        	PoligonoZone zona = (PoligonoZone) layer.cercaIDTPN(key);
		    		
		    		request.setAttribute("zona",zona);
		    		setAfterForward(request, false, zona.getJSGeometry());
		    		forward(request,response);
		        
		        //...nella fase D uso il layer puntuale
	        	} else if (StringUtils.equalsIgnoreCase(idFase, "D")) {
	        	
		        	LayerPuntiSensibili layer = LayerPuntiSensibili.getInstance(comunePO);
		        	      	
		        	PuntoPuntiSensibili puntoSensibile = null;
		        	List<PuntoPuntiSensibili> listaPuntiPerSquadra = null; 
		        	
		        	//...nel caso venga passata la squadra recupero i la lista dei punti assegnati alla squadra, altrimenti recupero il dettaglio del punto selezionato...
		        	if (squadra == null || squadra == 0) {
		        		
		        		puntoSensibile = (PuntoPuntiSensibili) layer.cercaIDTPN(key);
		        		
		        		request.setAttribute("puntoSensibile",puntoSensibile);
		        		setAfterForward(request, false, puntoSensibile.getJSGeometry());
		        		forward("/jsp/servizi/procivPianoNeve/visualizzaPuntoSensibile.jsp",request,response);
		        		
		        	} else {
		        		
		        		listaPuntiPerSquadra = layer.cercaPuntiBySquadra(squadra);
		        		layer.ordinaByPriorita(listaPuntiPerSquadra);
		        		
		        		PuntoPuntiSensibili pTmp = (PuntoPuntiSensibili)layer.cercaIDTPN(listaPuntiPerSquadra.get(0).getIDTPN());
		        		List<PuntoPuntiSensibili> listaPerIngombro = new ArrayList<PuntoPuntiSensibili>();
		        		listaPerIngombro.add(pTmp);
		        		listaPerIngombro.addAll(listaPuntiPerSquadra);
		        		OggettoTerritorio tutte = OggettoTerritorio.getUnione(listaPerIngombro);
		        		
		        		request.setAttribute("listaPuntiPerSquadra",listaPuntiPerSquadra);
		        		setAfterForward(request, false, tutte.getJSGeometry());
		        		forward("/jsp/servizi/procivPianoNeve/visualizzaPuntiSquadra.jsp",request,response);
		        		
		        	}
	        	
	        	} else {
	
	        		String errMsg = "La fase " + idFase + " non e' valida!";
		            addMessaggio(request, Messaggio.ERRORE, errMsg);
		            forward(super.ERROR_PAGE, request, response);
		            return;
	        	}
		        
	        } else {
	        	
	        	String errMsg = "E' necessario passare l'identificativo della fase!";
	            addMessaggio(request, Messaggio.ERRORE, errMsg);
	            forward(super.ERROR_PAGE, request, response);
	            return;
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
		return "/jsp/servizi/procivPianoNeve/visualizzaItinerario.jsp";
	}
}