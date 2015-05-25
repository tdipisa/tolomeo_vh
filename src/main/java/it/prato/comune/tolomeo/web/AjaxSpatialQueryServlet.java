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
/**************************************************************
 * Copyright © 2007 Comune di Prato - All Right Reserved
 * Project:      Tolomeo - WebGis con funzioni di editing
 * File:         AjaxSpatialQueryServlet.java
 * Function:     Servlet di default per ricerca oggetti in un punto. Utilizzata per la selezione di oggetti
 * Author:       Alessandro Radaelli
 * Version:      1.0.0
 * CreationDate: 04/09/2007
 * ModifyDate:   
 ***************************************************************/

package it.prato.comune.tolomeo.web;

import it.prato.comune.sit.GetFeatureInfoLayer;
import it.prato.comune.sit.GetFeatureInfoParams;
import it.prato.comune.sit.IGetFeatureInfoLayer;
import it.prato.comune.sit.IGetFeatureInfoObject;
import it.prato.comune.sit.JSGeometryArrayList;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.SITExtStore;
import it.prato.comune.sit.SITLayersManager;
import it.prato.comune.tolomeo.utility.ExtStoreError;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriLegenda;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.utilita.core.type.DateType;
import it.prato.comune.utilita.core.type.TsType;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;

/**
 * Servlet utilizzata per ricavare gli oggetti di un certo layer che sono presenti in un certo punto.<br/>
 * La servlet accetta in ingresso i seguenti parametri passati in get o post:
 * <ul>
 *  <li>coordX - Coordinata X del punto </li>
 *  <li>coordY - Coordinata Y del punto </li>
 *  <li>SRID   - Identificativo del sistema di riferimento nel quale deve essere la risposta e nel quale sono espressi coordX e coordY</li> 
 *  <li>codTPN - Codice identificativo del layer all'interno del quale volgiamo fare la ricerca </li>
 *  <li>range  - Range di tolleranza (espresso nelle coordinate utilizzate, quindi nel caso del Gauss Boaga in metri)</li>
 * </ul>
 * 
 * Fornisce come risultato (direttamente nella response, essendo fatta per essere chiamata via ajax) la stringa JSON che rappresenta un
 * oggetto di tipo {@link it.prato.comune.sit.JSGeometryArray} JSGeometryArray.
 * 
 * In caso di errore, oltre a scrive sul log, setta lo status della response a HttpServletResponse.SC_INTERNAL_SERVER_ERROR 
 * e ritorna un messaggio di errore nella response stessa.
 *
 * @author Alessandro Radaelli
 *
 */
public class AjaxSpatialQueryServlet extends TolomeoServlet {

	private static final long serialVersionUID = 7177996731299388440L;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);           
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		// Recupero il logger
		LogInterface logger = getLogger(request);

		// Recupero i parametri
		String coordX                  = request.getParameter("coordX");
		String coordY                  = request.getParameter("coordY");
		String srid                    = request.getParameter("SRID");
		String withGeometry            = request.getParameter("withGeom");
		boolean bWithGeometry          = (withGeometry!=null) ? (withGeometry.toUpperCase().equals("S") || withGeometry.toUpperCase().equals("Y") || withGeometry.toUpperCase().equals("TRUE")) ? true: false  : true;
		String callback                = request.getParameter("callback");
		String format                  = request.getParameter("format");
		ArrayList<Integer> codTPNArray = getCodTPNArray(request);
		String szRange                 = request.getParameter("range");
		TsType dtInizioFiltro          = (StringUtils.isNotEmpty(request.getParameter("dtInizioFiltro"))) ? new TsType(new DateType(request.getParameter("dtInizioFiltro"))) : null;
		TsType dtFineFiltro            = (StringUtils.isNotEmpty(request.getParameter("dtFineFiltro")))   ? new TsType(new DateType(request.getParameter("dtFineFiltro")))   : null;
		
		String selectionMode           = request.getParameter("selectionMode") != null ? request.getParameter("selectionMode") : "default";			

		String bbox			= request.getParameter("bbox");
		String mapwidth     = request.getParameter("mapwidth");
		String mapheight    = request.getParameter("mapheight");
		String x    		= request.getParameter("X");
		String y    		= request.getParameter("Y");
		String szFeatureCount = request.getParameter("featurecount");
		
		String szAdditionalWMSLayer = request.getParameter("additionalWMSLayers");
		
		int featureCount = (szFeatureCount!=null && !szFeatureCount.equals("")) ? Integer.parseInt(szFeatureCount) : 50;
				
		// Se range non presente allora assumo che sia 0
		double range = 0; 
		if (szRange!=null)  {
			try {
				range = Double.parseDouble(szRange);
			} catch (NumberFormatException e) {
				range=0;
			}
		}

		// Recupero oggetto Territorio
		SITLayersManager comunePO = null;
		String risposta     = null;

		try {
		    
		    comunePO = getTerritorio(logger);
		    
			ArrayList<IGetFeatureInfoObject> oggetti = new ArrayList<IGetFeatureInfoObject>();

			// Cerco chi interseca il punto indicato a meno della tolleranza
			GetFeatureInfoParams params = new GetFeatureInfoParams();
			params.setBBox(bbox);
			params.setFeatureCount(featureCount);
			params.setHeight(Integer.parseInt(mapheight));
			params.setWidth(Integer.parseInt(mapwidth));
			params.setRange(range);
			params.setSourceSRID(srid);
			params.setX(new Integer ((int) Math.round(Double.parseDouble(x))));
			params.setY(new Integer ((int) Math.round(Double.parseDouble(y))));
			params.setCoordX(Double.parseDouble(coordX));
			params.setCoordY(Double.parseDouble(coordY));
			//TODO params.setStyle(style);
			
			Parametri paramsTolo = getParametri(request, comunePO, false);
			
			if (codTPNArray != null) {
				
				Map<Integer, JSONObject> additionalWMSMap = new HashMap<Integer, JSONObject>();
					
				if (szAdditionalWMSLayer!=null && !szAdditionalWMSLayer.equals("")) {
                    JSONArray additionalWMSLayer = (JSONArray) JSONSerializer.toJSON(szAdditionalWMSLayer);
                    
                    for (int i=0; i < additionalWMSLayer.size(); i++) {
                    	JSONObject curr = additionalWMSLayer.getJSONObject(i);
                        Integer codTPNWms = (Integer) curr.get("codTPN");
                    	additionalWMSMap.put(codTPNWms, curr);
                    }
				}
				
				for (Integer codTPN: codTPNArray) {
					// Se non è layer inserito lato client elabora, altrimenti c'e' blocco di codice successivo
					if (codTPN < Parametri.CODTPNCLIENTLAYERBASE  
							|| codTPN > Parametri.CODTPNCLIENTLAYERMAX) {
					
						// Utilizza il formato di default inizializzato dal plugin
						// NB Settare tutte le volte perchè il metodo getFeatureInfo, se è null, ne modifica il valore impostando quello di default
						params.setInfoFormat(null); 					
						
						// Recupero il layer identificato da codTPN
						// TODO Da sistemare meglio codice in altra classe e gestire anche altre servlet come la querybyid o la suggest
						IGetFeatureInfoLayer layer = null;
						
						if (((codTPN > Parametri.URLWMSCODTPNBASE) &&
							(codTPN < Parametri.URLWMSCODTPNMAX)) || 
							((codTPN > Parametri.CODTPNAUTOLAYERBASE) &&
							(codTPN < Parametri.CODTPNAUTOLAYERMAX))){
							// Layer WMS aggiunti da URL oppure aggiunti da preset (autoLayers)
							// TODO supporta solo mappa 0
							int nMappa = 0;
							ParametriLegenda pl = paramsTolo.getMappe().getMappaList().get(nMappa).getLegenda();
							ParametriLegendaLayer pll = pl.findByCodTPN(codTPN);
							String serverID = pll.getServerID();
							String url;
							if (serverID!=null && !serverID.equals("")) {
								url = paramsTolo.getServerPool().getServer(serverID).getUrl();
							} else {
								url = paramsTolo.getMappe().getMappaList().get(nMappa).getUrl();
							}
							String infoformat = "application/vnd.ogc.gml";
							if ((codTPN > Parametri.CODTPNAUTOLAYERBASE) &&
									(codTPN < Parametri.CODTPNAUTOLAYERMAX)) {
								infoformat = pll.getAutoLayer().getDefaultInfoFormat();
							}
							GetFeatureInfoLayer l1 = new GetFeatureInfoLayer(url, pll.getDescrizione(), pll.getName(), codTPN, infoformat, logger);
							
							if ((codTPN > Parametri.CODTPNAUTOLAYERBASE) &&
									(codTPN < Parametri.CODTPNAUTOLAYERMAX)) {
								l1.setRegExpToCheckIfDataFound(pll.getAutoLayer().getRegExpToCheckIfDataFound());
								l1.setTextToCheckIfDataFound(pll.getAutoLayer().getTextToCheckIfDataFound());
								l1.setEspressioneIDTPN(pll.getAutoLayer().getEspressioneIDTPN());
								l1.setEspressioneDescrizione(pll.getAutoLayer().getEspressioneDescrizione());
							}
							layer = l1; 
							
						} else {
							layer = comunePO.getGetFeatureInfoLayerByCodTPN(codTPN);
						}
						
						
						if (layer!=null) {
							
							logger.debug("Inizio intersezione nel punto " + Double.parseDouble(coordX) + ", " + Double.parseDouble(coordY) + " per il layer " + layer.getNome());
							
							layer.setFiltroTemporale(dtInizioFiltro, dtFineFiltro);
					
							List<IGetFeatureInfoObject> ogg = layer.getFeatureInfo( params);
			
							oggetti.addAll(ogg);
														
						} else {
							logger.error("Il layer " + codTPN + " e' nullo");
						}
					} else {
					    // INIZIO CASO WMS AGGIUNTI DA UTENTE
			            if ( !selectionMode.equalsIgnoreCase("firstOnTop") || 
			                 oggetti.size() == 0 ) {
			                // Se ci sono layer aggiunti con WMSExplorer o CSWExplorer
			                if (additionalWMSMap.containsKey(codTPN)) {
			                    //JSONArray additionalWMSLayer = (JSONArray) JSONSerializer.toJSON(szAdditionalWMSLayer);
			                    
			                    //for (int i=0; i < additionalWMSLayer.size(); i++) {
			                      //  JSONObject curr = additionalWMSLayer.getJSONObject(i);
		                    	JSONObject curr = additionalWMSMap.get(codTPN);
		                        String url = (String) curr.get("url");
		                        String wmsname = (String) curr.get("wmsname");
		                        Integer codTPNWms = (Integer) curr.get("codTPN");
		                        String descrizione = (String) curr.get("desc");
		                        String infoformat = (String) curr.get("infoformat");
		                    
		                        GetFeatureInfoLayer layer = new GetFeatureInfoLayer(url, descrizione, wmsname, codTPNWms, infoformat, logger);			                        
		                        layer.setEspressioneIDTPN("attributes.get(\"##FID##\")");
		                        layer.setEspressioneDescrizione("\"Descrizione \"+attributes.get(\"##FID##\")");
		                        //layer.setEspressioneNomeOggetto(espressioneNomeOggetto);
		                        
		                        // Utilizza il formato di default inizializzato nel costruttore 
		                        // NB Settare tutte le volte perchè il metodo getFeatureInfo ne modifica il valore
		                        params.setInfoFormat(null);                                             
		                        List<IGetFeatureInfoObject> ogg = layer.getFeatureInfo( params);
		                    
		                        oggetti.addAll(ogg);
		                        /*
		                        if(selectionMode.equalsIgnoreCase("firstOnTop")){
		                            if(ogg.size()>0){
		                                break;
		                            } 
		                        }*/
			                    //}
			                }
			            }
			         // FINE CASO WMS AGGIUNTI DA UTENTE
					}
					
					if(selectionMode.equalsIgnoreCase("firstOnTop")){
                        if(oggetti.size()>0){
                            break;
                        } 
                    }
					
				}
			}
				
			// Converto nel formato appropriato e rispondo
			if ((format!=null) && (format.equals("ext"))) {
				//ret = ExtStoreSingleRecord(JSGeometry.oggettoTerritorioToJSGeometryArray(oggetti, srid, logger), null);
				risposta = SITExtStore.extStoreFromJSGeometryArrayList( JSGeometryArrayList.toJSGeometryArrayList1(oggetti, srid, logger, bWithGeometry), null).toString();
			} else {
				//risposta = JSGeometry.oggettoTerritorioToJSGeometryArray(oggetti, srid, logger).toString();
				String errMsg = "Errore. Formato non più supportato in AjaxSpatialQueryServlet";
	        	risposta = new ExtStoreError(errMsg,null).toJSONString();
	          
			}
			
			logger.info("risposta = " + risposta);

		} catch (SITException e) {

			String errMsg = "SITException in AjaxSpatialQueryServlet durante la ricerca";
        	risposta = new ExtStoreError(e).toJSONString();
            logger.error(errMsg, e);
            
//			logger.error("SITException in AjaxSpatialQueryServlet", e);
//			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//			response.getWriter().append(e.getMessage());
			
		} finally {
			
		    try {
                if(comunePO != null){
                    comunePO.dispose();
                }
            } catch (SITException e) {
                logger.error("Problemi nella dispose del LayersManager",e);
            }
		    
		    request.setAttribute("geometry", risposta);
			request.setAttribute("callback", callback);
			request.setAttribute("format", format);
			forward(request, response);
					    
		}

	}

	protected ArrayList<Integer> getCodTPNArray(HttpServletRequest request){
		
		try {
			String codTPNStr = request.getParameter(PARAM__CODTPN_LAYER);

			if(StringUtils.isEmpty(codTPNStr)){
				getLogger(request).error("codTPN non valorizzato");
				return null;
			}

			String[] buff = codTPNStr.split(",");
			ArrayList<Integer> retVal = new ArrayList<Integer>();

			for (String szCodTPN: buff) {
				retVal.add(Integer.parseInt(szCodTPN));
			}

			return retVal;

		} catch (NumberFormatException e){
			getLogger(request).error("codTPN non numerico");
			return null;
		}
	} 

	@Override
	protected String getDefaultForward() {
		return "/jsp/tolomeoAjaxSpatialQuery.jsp";
	}
}