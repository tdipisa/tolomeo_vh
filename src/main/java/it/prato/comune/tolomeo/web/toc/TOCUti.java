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
package it.prato.comune.tolomeo.web.toc;

import it.prato.comune.sit.SITException;
import it.prato.comune.tolomeo.web.parametri.Parametri;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaCategoria;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.tolomeo.web.parametri.ParametriServer;
import it.prato.comune.tolomeo.web.toc.geoserver.TOCGeoserverUti;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONObject;

public class TOCUti {

	private final static  String INLINESERVERID = "INLINESERVERID";
	private final static  String CATLAYSEP 		= "####";
	private Parametri 	params;
	private Integer 	nMappa;
	private LogInterface logger;
	private ParametriMappa parametriMappa; 
	
	public TOCUti(Parametri params, Integer nMappa, LogInterface logger) {
		super();
		this.logger = logger;
		this.params = params;
		this.nMappa = nMappa;
		this.parametriMappa = params.getMappe().getMappaList().get(this.nMappa);
		
	}
	
	private Map<ParametriServer, Map<String, ParametriLegendaLayer>> getLayerPerServerList() {
		Map<ParametriServer, Map<String, ParametriLegendaLayer>> retVal = new HashMap<ParametriServer, Map<String, ParametriLegendaLayer>>();
		ParametriServer psInline = null;
		List<ParametriLegendaLayer> allLays = parametriMappa.getLegenda().allLayersList();
		
		if (parametriMappa.getTypeCode()!=null) {
			psInline = new ParametriServer();
			psInline.setAllowServerConnection(parametriMappa.getAllowServerConnection());
			psInline.setNome(parametriMappa.getNome());
			psInline.setNomeCredenziale(parametriMappa.getNomeCredenzialeREST());
			psInline.setServerOpts(parametriMappa.getMapOptions());
			psInline.setTypeCode(parametriMappa.getTypeCode());
			psInline.setTypeDescription(parametriMappa.getTypeDescription());
			psInline.setUrl(parametriMappa.getUrl());
			psInline.setId(INLINESERVERID);
			psInline.setOpacity(parametriMappa.getOpacity());
		}
			
		for (ParametriLegendaLayer pml: allLays) {
			ParametriServer server = (pml.getServerID()!=null) ? params.getServerPool().getServer(pml.getServerID()) : psInline;
			if (!retVal.containsKey(server)) retVal.put(server, new HashMap<String, ParametriLegendaLayer>());
			retVal.get(server).put(pml.getCatTreeIdx()+ CATLAYSEP + pml.getLayTreeIdx(), pml);
		}
		
		return retVal;
	}
	
	public TOCBean getTocBean () throws SITException{
		
		TOCBean tocBean = new TOCBean();
		Map<ParametriServer, Map<String, ParametriLegendaLayer>> lista = getLayerPerServerList();
		Map<String, TOCLayerBean> layerBeans = new HashMap<String, TOCLayerBean>(); 
		Boolean bOrderChangeCapable = true;
		
		// Scorre la lista dei server e recupera le info mettendole in layerBeans
		for(ParametriServer ps: lista.keySet()) {
		    
			Map<String, ParametriLegendaLayer> layList = lista.get(ps);
			TOCServerUtiBase tocuti = null;
			//Boolean bstyleCapable = null;
			Integer maxHeightPreset = ps.getTileStampaAltezza();
			Integer maxWidthPreset  = ps.getTileStampaLarghezza();
			TOCServerBean tsb = new TOCServerBean();
			
			switch (ps.getTypeCode()) {
			
			case ParametriServer.typeMapserver:
			    
					tocuti = new TOCMapserverUti(ps,parametriMappa, logger);
					bOrderChangeCapable = false;
					//bstyleCapable = false;
					tsb.setTileStampaAltezza(calcMaxDimension(0, maxHeightPreset));
					tsb.setTileStampaLarghezza(calcMaxDimension(0, maxWidthPreset));
					
				break;
				
			case ParametriServer.typeWMS:
				
			    try {
				    
					tocuti = new TOCGeoserverUti(ps, logger);
					//bstyleCapable = true;
					
					Integer maxHeightServer = ((TOCGeoserverUti)tocuti).getMaxHeight();
					Integer maxWidthServer 	= ((TOCGeoserverUti)tocuti).getMaxWidth();
					
					//tsb.getGetFeatureInfoFormats().clear();
					//tsb.getGetFeatureInfoFormats().addAll(((TOCGeoserverUti)tocuti).getGetFeatureInfoFormats());
					
					tsb.setTileStampaAltezza(calcMaxDimension(maxHeightServer, maxHeightPreset));
					tsb.setTileStampaLarghezza(calcMaxDimension(maxWidthServer, maxWidthPreset));
					
				} catch (SITException e) {
					String msg = "Eccezione in TOCUti.getTocBean creando TOCGeoserverUti per il server " + ps.getNome();
					logger.warn(msg, e);
					throw new SITException(msg,e);
				}
			    
				break;
				
			default:
				String msg = "Server " + ps.getNome() + " di tipo " + ps.getTypeDescription() + " non supportato";
				logger.warn(msg);
				throw new SITException(msg);
			}
			
			tocBean.getServer().put(ps.getId(), tsb);
			
			if (tocuti!=null) {
				for (ParametriLegendaLayer lay: layList.values()) {
					TOCLayerBean tocLayBean =null;
					
					try { 
						tocLayBean = tocuti.createLayer(lay, parametriMappa.getSRID());
						//tocLayBean.setStyleCapable(bstyleCapable);
					} catch (SITException e) {
						String msg = "Eccezione in TOCUti.getTocBean creando legenda per il layer " + lay.getName() + "per il server " + ps.getNome();
						logger.warn(msg, e);
						throw new SITException(msg,e);
					}
				
					layerBeans.put(lay.getCatTreeIdx() + CATLAYSEP + lay.getLayTreeIdx(), tocLayBean);
				}
			}
			
		}
		
		// Scorre parametriLegenda compilando tocBean
		for (ParametriLegendaCategoria cat: this.parametriMappa.getLegenda().getCategoryList()) {
			try {
				TOCCategoryBean tocCatBean = createCategoryPriv(cat, layerBeans);
				tocBean.getCategories().add(tocCatBean);
			} catch (SITException e) {
				String msg = "Eccezione in TOCUti.getTocBean creando legenda per la categoria " + cat.getName();
				logger.warn(msg, e);
				throw new SITException(msg,e);
			}
			
		}

		tocBean.setOrderChangeCapable(bOrderChangeCapable);
		return tocBean;		
	}
	
	private Integer calcMaxDimension(Integer maxDimServer, Integer maxDimPreset) {
		
		/*Integer maxHeightServer = ((TOCGeoserverUti)tocuti).getMaxHeight();
		Integer maxWidthServer 	= ((TOCGeoserverUti)tocuti).getMaxWidth();
		Integer maxHeightPreset = ps.getTileStampaAltezza();
		Integer maxWidthPreset  = ps.getTileStampaLarghezza();
		*/
		// Imposto il giusto valore per l'altezza massima tile di stampa
		if (maxDimServer!=null && maxDimServer!=0) {
			// Se maxHeight è definito in capabilities
			if (maxDimPreset!=null && maxDimPreset>0 && maxDimPreset < maxDimServer) {
				// se è definito nel preset ed è minore di quanto dice la capabilities prendi il preset
				return maxDimPreset;	
			} else {
				// altrimenti prendi quello dalla capabilities
				return maxDimServer;	
			}
		} else {
			// se non è definito nella capabilities
			if (maxDimPreset!=null && maxDimPreset>0) {
				// ... ed è definito nel preset prendi il preset
				return maxDimPreset;	
			} else {
				// altrimenti in mancanza di altre indicazioni lascia illimitato
				return 0;	
			}
		}

	}
	
	public JSONObject jSONGroupVis(String layers[], String stili[], String catIdx[], String layIdx[]) throws SITException {
		
		
		List<String> layersList =   new ArrayList<String>();
		for (int i=0; i<layers.length; i++) {
			layersList.add(catIdx[i]+CATLAYSEP+layIdx[i]);
		}
		TOCVisBean retVal = null;
				
		Map<ParametriServer, Map<String, ParametriLegendaLayer>> lista = getLayerPerServerList();
		//Map<String, TOCLayerBean> layerBeans = new HashMap<String, TOCLayerBean>(); 
		List<TOCVisEntryBean> vis = new ArrayList<TOCVisEntryBean>();
		
		// Scorre la lista dei server e recupera le info mettendole in layerBeans
		for(ParametriServer ps: lista.keySet()) {
			Map<String, ParametriLegendaLayer> layList = lista.get(ps);
			
			Collection<String> laysOnServerToProcess = new ArrayList<String>(layList.keySet());
			laysOnServerToProcess.retainAll(layersList);
			
			if (laysOnServerToProcess.size()>0) {
			
			
				TOCServerUtiBase tocuti = null;
				
				switch (ps.getTypeCode()) {
				case ParametriServer.typeMapserver:
						tocuti = new TOCMapserverUti(ps,parametriMappa, logger);
					break;
				case ParametriServer.typeWMS:
					try {
						tocuti = new TOCGeoserverUti(ps, logger);
					} catch (SITException e) {
						String msg = "Eccezione in TOCUti.jSONGroupVis creando TOCGeoserverUti per il server " + ps.getNome();
						logger.warn(msg, e);
						throw new SITException(msg,e);
					}
					break;
					
				default:
					String msg = "Server " + ps.getNome() + " di tipo " + ps.getTypeDescription() + " non supportato";
					logger.warn(msg);
					throw new SITException(msg);
				}
				
				if (tocuti!=null) {
	
					for(String lay: laysOnServerToProcess) {
						int i = layersList.indexOf(lay);
					//for (int i=0; i<layers.length; i++) {
						int iLayIdx =  Integer.parseInt(layIdx[i] );
						TOCVisEntryBean vb = tocuti.processLayerVis(parametriMappa, catIdx[i], iLayIdx, stili[i] );
						vis.add(vb);
					}
					/*
					
					for (ParametriLegendaLayer lay: layList.values()) {
						TOCLayerBean tocLayBean =null;
						
						try { 
							// TODO METTO styles a null quindi prende stile da preset. va bene se è solo il primo giro, ma qua ci passa nei giri successivi?
							tocLayBean = tocuti.createLayer(lay, null);
						} catch (SITException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					
						layerBeans.put(lay.getCatTreeIdx() + CATLAYSEP + lay.getLayTreeIdx(), tocLayBean);
					}*/
				}
			}
		}
		
		// Scorre parametriLegenda compilando tocBean
		/*
		TOCBean tocBean = new TOCBean();
		for (ParametriLegendaCategoria cat: this.parametriMappa.getLegenda().getCategoryList()) {
			try {
				TOCCategoryBean tocCatBean = createCategoryPriv(cat, layerBeans);
				tocBean.getCategories().add(tocCatBean);
			} catch (SITException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		*/
		retVal = new TOCVisBean(vis);
		return JSONObject.fromObject(retVal);	
	}
	
	private TOCCategoryBean createCategoryPriv(ParametriLegendaCategoria cat, Map<String, TOCLayerBean> layerBeans) throws SITException {
   		
		   
	       TOCCategoryBean newCat = new TOCCategoryBean();
	       
	       String nome = cat.getName();
	       newCat.setNome(nome);
	       newCat.setHidden(cat.getHidden());
	       newCat.setCatDescr(nome);
	       int rnd = (int) (Math.random() * 100000);
	       newCat.setCatId(nome+rnd);
	       newCat.setChecked(cat.getDefaultCategory());      
	       newCat.setCatTreeIdx(cat.getCatTreeIdx());
	       newCat.setToolTip(cat.getToolTip());
	       newCat.setItemType(cat.getItemType());
	       newCat.setItemIcon(cat.getItemIcon());
	       
	       newCat.setClickUrl(cat.getClickUrl());
	       newCat.setClickTarget(cat.getClickTarget());
	       newCat.setExpanded(cat.getExpanded());
	       
	       for (ParametriLegendaLayer pml: cat.getLayerList()) {
	    	   String key = pml.getCatTreeIdx() + CATLAYSEP + pml.getLayTreeIdx();
	    	   TOCLayerBean lb = layerBeans.get(key);
	    	   
	    	   newCat.getLayers().add(lb);	    	   
	       }
	       
	       // categorie annidate
	       ArrayList<ParametriLegendaCategoria> cl1 = cat.getCategoryList();       
	       if (cl1 != null) {
	           for (ParametriLegendaCategoria cat1: cl1) {
	           	newCat.addCategory(createCategoryPriv(cat1, layerBeans));
	           }
	       }
	       
	       if (!cat.getItemType().equalsIgnoreCase("category")) {
	          newCat.setUserSwitchable(false);
	       }
	       
	       return newCat;
	   }

	/**
	 * @return the parametriMappa
	 */
	protected ParametriMappa getParametriMappa() {
		return parametriMappa;
	}
	
}
