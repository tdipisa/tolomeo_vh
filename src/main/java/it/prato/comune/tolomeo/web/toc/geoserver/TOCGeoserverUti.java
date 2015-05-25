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
package it.prato.comune.tolomeo.web.toc.geoserver;

import it.prato.comune.sit.OggettoTerritorio;
import it.prato.comune.sit.Punto;
import it.prato.comune.sit.SITException;
import it.prato.comune.sit.ows.WMSCapabilitiesMetadataURLBean;
import it.prato.comune.sit.ows.WMSLayerCapabilitiesAttributionBean;
import it.prato.comune.sit.ows.WMSLayerCapabilitiesBBox;
import it.prato.comune.sit.ows.WMSLayerCapabilitiesBean;
import it.prato.comune.sit.ows.WMSService;
import it.prato.comune.sit.ows.WMSStyleCapabilities;
import it.prato.comune.tolomeo.utility.RESTCredentialsBean;
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayerMetadataURL;
import it.prato.comune.tolomeo.web.parametri.ParametriServer;
import it.prato.comune.tolomeo.web.toc.TOCBean;
import it.prato.comune.tolomeo.web.toc.TOCClassBean;
import it.prato.comune.tolomeo.web.toc.TOCLayerBean;
import it.prato.comune.tolomeo.web.toc.TOCServerUtiBase;
import it.prato.comune.tolomeo.web.toc.TOCStyleBean;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 
/**
 * Classe di utilità per la gestione della legenda geoserver. Si occupa di recuparare le url delle icone della legenda, i valori di scala minima e massima etc.
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class TOCGeoserverUti extends TOCServerUtiBase{

	/**
	 * Indica che il server è capace di gestire gli stili
	 */
	private static final boolean ISSTYLECAPABLE = true;
	
    private TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();
    //private String nomeMap = null;
    private String WMSServiceUrl = "";
    private boolean withREST = false;
    private Map<String, WMSLayerCapabilitiesBean> layerMap = new HashMap<String, WMSLayerCapabilitiesBean>();
    private boolean temporaryNotAvailable=false;
    private Integer maxWidth = null;
    private Integer maxHeight = null;
	/** Formati disponibili per la chiamata GetFeatureInfo. */
	//private final List<String> getFeatureInfoFormats = new ArrayList<String>();
    
	private GeoserverUti gs = null;

    /**
     * Costruttore 
     * 
     * @param pm parametri da preset della mappa per la quale occorre generare la legenda
     * @param logger
     * @throws SITException
     */
    public TOCGeoserverUti(ParametriServer ps, LogInterface logger) throws SITException{
    	
    	super(ps, logger);

        this.withClasseUnica = true;
        
        WMSServiceUrl = ps.getUrl();
        
        boolean withParams = false;
        boolean bService = false;
        if (WMSServiceUrl.indexOf("?")!=-1) {
	        String[] params = WMSServiceUrl.substring( WMSServiceUrl.indexOf("?"), WMSServiceUrl.length()).split("&");
	        
	        
	        for (String p : params) {
	        	String[] p1 = p.split("=");
	        	if ( p1[0].equalsIgnoreCase("SERVICE")  ) {
	        		bService = true;
	        	}
	        }
	        withParams = (params.length!=0);
        }
        if (!bService) WMSServiceUrl += (withParams==false ? "?" : (WMSServiceUrl.endsWith("&") ? "" : "&")) + "SERVICE=WMS";
        
    	withREST=false;
        // Se è consentito al server di connettersi al WMS
        if (ps.getAllowServerConnection()) {
        	
        	try {
	        //Recupero informazioni possibili (info su stili disponibili) dalla getCapabilities
		    	WMSService wms = new WMSService(WMSServiceUrl, logger);
		    	// Trasfomo la lista in mappa per poter ricercare meglio
		    	for (WMSLayerCapabilitiesBean lcb: wms.getCapabilities().getLayers()) {
		    		this.layerMap.put(lcb.getName(), lcb);
		    	}
		    	this.maxHeight = wms.getCapabilities().getMaxHeight();
		    	this.maxWidth  = wms.getCapabilities().getMaxWidth();
		    	
		    	//getFeatureInfoFormats.addAll(wms.getCapabilities().getGetFeatureInfoFormats());
		    	
        	} catch (SITException e) {
        		String msg = "Eccezione collegandosi a " + WMSServiceUrl + ". Errore di configurazione o momentanea indisponibilità del server? Proseguo come se non fosse consentito l'accesso al server (allowServerConnection=false)";
        		temporaryNotAvailable=true;
        		logger.warn(msg, e);
        	}
        	
        	// Se presente la credenziale REST inizializza REST per recupero altre informazioni
            if (ps.getNomeCredenziale()!=null && !ps.getNomeCredenziale().equals("")) {
            	RESTCredentialsBean credential = context.getRestCredential(ps.getNomeCredenziale());
                // verifica se credenziali definite
                if (credential==null) {
                	//  Credenziali non valide
                	String msg = "Credenziale REST chiamata " + ps.getNomeCredenziale() + " non valida. Verificare credenziali nel file di preset e in tolomeo.properties."; 
        			logger.warn(msg);
        			throw new SITException(msg);
                } 
                try {
                	gs = new GeoserverUti(credential.getUrl(), credential.getUser(), credential.getPwd(),logger);
                	withREST=true;
                } catch (SITException e) {
                	String msg = "Errore collegandosi via REST a " + WMSServiceUrl + " con la credenziale chiamata " + ps.getNomeCredenziale() + ". Verificare credenziali nel file di preset e in tolomeo.properties. Proseguo come se non fosse settata"; 
        			logger.warn(msg);
        			temporaryNotAvailable=true;
        			withREST=false;
                }
            	        			
            }
        }
        
        //setto il TOCbean
        toc = new TOCBean();
        
    }
    

    public TOCLayerBean createLayer(ParametriLegendaLayer lay, String SRID) throws SITException {
    //public TOCLayerBean createLayer(ParametriLegendaLayer lay, Map<String, String> styles, String SRID) throws SITException {
    	
    	TOCLayerBean layBean = new TOCLayerBean();
    	
        layBean.setCatTreeIdx(lay.getCatTreeIdx());
        layBean.setLayTreeIdx(lay.getLayTreeIdx());
        layBean.setServerID(lay.getServerID());
        layBean.setHidden(lay.getHidden());
        layBean.setTemporaryNotAvailable(temporaryNotAvailable);
    	layBean.setName(lay.getName());
        layBean.setCodTPN(lay.getCodTPN());
        
        layBean.setStyleCapable(ISSTYLECAPABLE);
        
        layBean.setRaster(lay.getRaster());
        layBean.setClickUrl(lay.getClickUrl());
        layBean.setClickTarget(lay.getClickTarget());
        layBean.setStiliIndipDaScala(lay.getStiliIndipDaScala());
        layBean.setStiliIndipDaPosizione(lay.getStiliIndipDaPosizione());
        layBean.setToolTip(lay.getToolTip());
        layBean.setItemType(lay.getItemType());
        layBean.setItemIcon(lay.getItemIcon());
        layBean.setExpanded(lay.getExpanded());
        
        int rnd = + (int) (Math.random() * 100000);
        layBean.setChkBoxId( "ginput_" + lay.getName() + rnd);
        layBean.setNameId("spxg_" + lay.getName() + rnd);
        
        layBean.setDefaultGroup( (!temporaryNotAvailable) && lay.getDefaultLayer());
        layBean.setChecked(lay.getDefaultLayer());
        
        // Al momento OpacitySettings non è supportata dalla legenda geoserver, quindi viene sempre messo a false
        //layBean.setWithOpacitySettings(lay.getWithOpacitySettings());
        layBean.setWithOpacitySettings(lay.getWithOpacitySettings());
        layBean.setOpacity(lay.getOpacity());
        
    	layBean.setMinScaleMin(-1);
    	layBean.setMaxScaleMax(-1);
        
        if (lay.getItemType().equals("layer")) {
        	
            layBean.setUserSwitchable(lay.getUserSwitchable());
            
        	// Definisco lo stile da utilizzare
        	String actualStyle = lay.getDefaultStyle();
        	actualStyle=lay.getDefaultStyle();
        	layBean.setStyle(actualStyle);
        
        	double[] scaleDenom = getLayerScaleDenom(lay.getName(),actualStyle);
        	layBean.setMinScaleMin(scaleDenom[0]);
        	layBean.setMaxScaleMax(scaleDenom[1]);
        	
        	// se trovo il layer nel getCapabilities inserisco i nomi degli stili possibili ed altre info
        	String descrInCap = null;
        	if (layerMap!=null && layerMap.containsKey(lay.getName())) {
        		WMSLayerCapabilitiesBean layerwms = layerMap.get(lay.getName());
        		descrInCap = layerwms.getTitle();
        		
        		layBean.setLayerAbstract(layerwms.getLayerAbstract());
        	
        		// Inserisco se il loayer è interrogabile
        		layBean.setQueryable(layerwms.isQueryable());
        		
        		layBean.getGetFeatureInfoFormats().clear();
        		if (layerwms.getGetFeatureInfoFormats() != null) {
        			layBean.getGetFeatureInfoFormats().addAll(layerwms.getGetFeatureInfoFormats());
        		}
        		
        		String srid = SRID.toUpperCase();
        	
        		if (layerwms.getBboxMap().containsKey(srid)) {
        			WMSLayerCapabilitiesBBox bbox = layerwms.getBboxMap().get(srid);
        			layBean.setBboxMaxX(bbox.getMaxX());
        			layBean.setBboxMaxY(bbox.getMaxY());
        			layBean.setBboxMinX(bbox.getMinX());
        			layBean.setBboxMinY(bbox.getMinY());
        		} else {
        			// se non presente SRID provo la conversione da latlon
        			WMSLayerCapabilitiesBBox bbox = layerwms.getBboxlatlon();
        		
        			Punto p1 = new Punto(bbox.getMinX(), bbox.getMinY(), bbox.getEpsg());
        			Punto p2 = OggettoTerritorio.trasformaPunto(p1, srid, logger);
        			layBean.setBboxMinX(p2.getX());
        			layBean.setBboxMinY(p2.getY());
        		
        			p1 = new Punto(bbox.getMaxX(), bbox.getMaxY(), bbox.getEpsg());
        			p2 = OggettoTerritorio.trasformaPunto(p1, srid, logger);
        			layBean.setBboxMaxX(p2.getX());
        			layBean.setBboxMaxY(p2.getY());
        		}
        	
	        	for (WMSStyleCapabilities st: layerwms.getStyles()) {
	        		TOCStyleBean tsb = new TOCStyleBean();
	        		tsb.setName(st.getName());
	        		tsb.setTitle(st.getTitle());
	        		tsb.setStyleAbstract(st.getStyleAbstract());
	        		String legGraph = getGetLegendGraphicURL(lay, st.getName());
	        		tsb.setLegendGraphic(legGraph);
	        		layBean.getDefinedStyles().add(tsb);
	        	}
	        	
	        	// Aggiungo attribution
	        	// Da getCapabilities se presente e non definiti su preset
        		if ((lay.getAttribution()==null || lay.getAttribution().equals("")) && 
        				layerwms.getAttribution()!=null) {
        			layBean.setAttribution(layerwms.getAttribution());
        		}
	            
	            // Aggiungo metadata url se presenti
        		// Da getCapabilities se presente e non definiti su preset
	            if ((lay.getMetadataURLList()==null || lay.getMetadataURLList().size()==0) && 
	            		layerwms.getMetadataUrlList()!=null) {
	            	// Da getCapabilities se presente
	            	List<WMSCapabilitiesMetadataURLBean> mdList = layBean.getMetadataUrlList();
	            	mdList.clear();
	            	for (WMSCapabilitiesMetadataURLBean mdBean: layerwms.getMetadataUrlList()) {
	            		mdList.add(mdBean);
	            	}
	            }
	        }
        	
        	// Aggiungo attribution se definita in preset
        	// eventualmente sovrascrivendo quanto presente in getCapabilities
        	if (lay.getAttribution()!=null && !lay.getAttribution().equals("")) {
        		// Da preset se presente
        		WMSLayerCapabilitiesAttributionBean buff = new WMSLayerCapabilitiesAttributionBean();
        		buff.setTitle(lay.getAttribution());
        		layBean.setAttribution(buff);
        	} 
            
            // Aggiungo metadata url da preset se presente
        	//eventualmente sovrascrivendo quanto presente in getCapabilities
        	if (lay.getMetadataURLList()!=null && lay.getMetadataURLList().size()>0) {
        		List<WMSCapabilitiesMetadataURLBean> mdList = layBean.getMetadataUrlList();
        		mdList.clear();
        		for (ParametriLegendaLayerMetadataURL p: lay.getMetadataURLList()) {
        			WMSCapabilitiesMetadataURLBean mdBean = new WMSCapabilitiesMetadataURLBean();
        			mdBean.setFormat(p.getFormat());
        			mdBean.setType(p.getType());
        			mdBean.setUrl(p.getUrl());
        			mdList.add(mdBean);
        		}
        	}
        	
	        String descr = "";
	        if (lay.getDescrizione()!=null && !lay.getDescrizione().equals("")) {
	        	// se definito nel preset viene preso quello
	        	//descr = StringEscapeUtils.escapeSql(lay.getDescrizione());
	        	descr = lay.getDescrizione();
	        } else { // altrimenti
	        	if (descrInCap!=null && !descrInCap.equals("")) {
	        		// se definito in title di getcapabilities ed èstato possibile recuperarlo
	        		descr = descrInCap;
	        	} else {
	        		descr = lay.getName();
	        	}
	        }
        
	        layBean.setDescr(descr) ;
            
	        // Classe unica perchè getLegendGraphic ritorna legenda completa
	        TOCClassBean classBean = new TOCClassBean();
	        
	        classBean.setIcoW(icoW);       	// Larghezza incona
	        classBean.setIcoH(icoH);       	// Altezza icona
	        classBean.setCount(1);         	// numero layer all'interno del gruppo
	        classBean.setClno(0);          	// numero classe all'interno del layer
        
        	// icona legenda da legendGraphic o da preset (per server che non gestiscono getLegendGraphic come geoscopio attuale)
	        String nomeClasse = getUrlLegendaClasseUnica(lay, actualStyle);
	        
	        classBean.setNome(nomeClasse);
	        classBean.setTipoNome(1);
	        classBean.setNomeParamScala("scale");
	        classBean.setId("spxg_classeUnica10" + Math.random());
	        layBean.getClassi().add(classBean);
        } else {
            //layBean.setDescr(StringEscapeUtils.escapeSql(lay.getDescrizione()));
            layBean.setDescr(lay.getDescrizione());
            layBean.setUserSwitchable(false);
        }
    
        return layBean;
    	
    }
    
   /*
    * Calcola la url necessaria per recuparare tramite la getLegendGraphics le icone della legenda
    * 
    * @param baseUrl url del servizio WMS
    * @param layer 	 parametri legenda del layer nel preset
    * @param style 		stile per il quale è richiesta la legenda
    * @return ritorna una stringa contenete il tag html src necessario
    */
   /*private String getTagGraficaLegendaDaWMS( ParametriLegendaLayer layer, String style) {
	   String legGraphic = getGetLegendGraphicURL( layer, style);
	   
	   String nomeStile = (style==null || style.equals("")) ? "Default" : style;
	   
	   return "<img src=\"" + legGraphic + "\" alt=\"Stile applicato: " + nomeStile + "\" title=\"Stile applicato: "  + nomeStile + "\" />";
    }*/
   
   /*
    * Ritorna la url per recuperare la legenda  a partire da un path 
    * 
    * @param iconaLegenda
    * @param layername
    * @param style
    * @return
    */
   /*private String getTagGraficaLegendaDaURL(String iconaLegenda, String layername, String style) {
	   
       //setto il path delle immagine della legenda (lettura)
       String legReadPath = (String)  context.getLegReadPath();
       if (!legReadPath.endsWith("/")) legReadPath += "/";
       
	   String legGraphic = legReadPath + iconaLegenda;
	   String nomeStile = (style==null || style.equals("")) ? "Default" : style;
	   
	   return "<img src=\"" + legGraphic + "\" alt=\"Stile applicato: " + nomeStile + "\" title=\"Stile applicato: "  + nomeStile + "\" />";
   }*/
   
   /**
    * Ritorna la url per recuperare la legenda  a partire da un path 
    * 
    * @param iconaLegenda
    * @param layername
    * @param style
    * @return
    */
   private String getURLLegendaDaURL(String iconaLegenda, String layername, String style) {
	   
       //setto il path delle immagine della legenda (lettura)
       String legReadPath = (String)  context.getLegReadPath();
       if (!legReadPath.endsWith("/")) legReadPath += "/";
       
	   return legReadPath + iconaLegenda;
   }
   
   /**
    * Ritorna la url per richiedere al server la LEGENDGRAPHIC
    * 
    * @param baseUrl
    * @param layerName
    * @param style
    * @return
    */
   private String getGetLegendGraphicURL( ParametriLegendaLayer layer, String style) {
	   String legGraphic = WMSServiceUrl + (WMSServiceUrl.contains("?")? "&" : "?") + "request=GetLegendGraphic&version=1.1.1&format=image/png&sld_version=1.1.0&";
	   legGraphic       += "width="+icoW+"&height="+icoH+"&layer=" + layer.getName() + "&style=" + (style==null ? "" : style);
	   
	   // Aggiunge eventuali parametri aggiuntivi configurati su Tolomeo.properties o file di preset
	   String additionalParams = "";
	   if (layer.getExtraLegendGraphPar()!=null && !layer.getExtraLegendGraphPar().equals("")) {
		   additionalParams = layer.getExtraLegendGraphPar();
	   } else {
		   String extrap = context.getLegExtraGraphParams();
		   if (extrap!=null && !extrap.equals("") ) {
			   additionalParams =  extrap;
		   }
	   }
	   
	   // Aggiunta eventuali parametri extra
	   legGraphic += (!additionalParams.equals("")) ? "&" + additionalParams : "";
	   
	   //Aggiunta parametro di valore casuale per invalidare cache (potrebbe essere cambiato la definizione dello stile
	   legGraphic += "&rnd=" + Math.random();
	   
	   return legGraphic;
   }
   
   /**
    * Calcola la scala minima e massima di visualizzazione di un certo layer visualizzato secondo un certo stile
    * 
    * @param layer nome del layer. Se lo stile non è nullo o vuoto questo parametro viene ignorato
    * @param style nome dello stile, Se definito ha la precedenza sul parametro layer
    * @return array di double nel quale il primo elemento è la scala minima, il secondo la massima. Se un valore non è definito viene posto a -1
    * @throws SITException
    */
   @Override
   protected double[] getLayerScaleDenom(String layer, String style) throws SITException {
	   double denom[] = new double[2];
	   
	   if (withREST) {
		   try {
			   if (style==null || style.equals("")|| style.equals("null")) {
					denom = gs.getLayerScaleDenom(layer);
			   } else {
				   denom = gs.getStyleScaleDenom(style);
			   } 
		       denom[0] = (denom[0]==Double.NEGATIVE_INFINITY) ? -1 : denom[0];
		       denom[1] = (denom[1]==Double.POSITIVE_INFINITY) ? -1 : denom[1];
		       
		       return denom;
		   } catch (UnsupportedEncodingException e) {
			   String msg = "TOCGeoserverUTI: Errore recuperando range di visualizzazione per il layer " + layer + " stile " + style; 
				logger.error(msg, e);
				throw new SITException(msg, e);
			}
	   } else {
		   // se non disponibile REST  
		   if (layerMap!=null && layerMap.containsKey(layer)) {
			   // cerco se definito su layerCapabilities
			   WMSLayerCapabilitiesBean lcb = layerMap.get(layer);
			   denom[0] = (lcb.getMinScaleDenominator()!=null) ? lcb.getMinScaleDenominator() : -1;
			   denom[1] = (lcb.getMaxScaleDenominator()!=null) ? lcb.getMaxScaleDenominator() : -1;
		   } else {
			   // altrimenti setto entrambi a -1 (valore non settato)
			   denom[0] = -1;
			   denom[1] = -1;
		   }
		   return denom;
	   }
	   
   }

	@Override
	protected String getUrlLegendaClasseUnica(ParametriLegendaLayer lay, String style) {
		
			String retVal = "";
		    if (lay.getIconaLegenda()==null || lay.getIconaLegenda().equals("")) {
		    	retVal = getGetLegendGraphicURL( lay, style); 								//getTagGraficaLegendaDaWMS( lay, style);
		    } else {
		    	retVal = getURLLegendaDaURL(lay.getIconaLegenda(), lay.getName(), style);   //getTagGraficaLegendaDaURL( lay.getIconaLegenda(), lay.getName(), style);
		    }
		    
		    return retVal;
	}


	/**
	 * @return the maxWidth
	 */
	public Integer getMaxWidth() {
		return maxWidth;
	}


	/**
	 * @return the maxHeight
	 */
	public Integer getMaxHeight() {
		return maxHeight;
	}
	
	/**
	 * Restituisce i formati disponibili per la chiamata GetFeatureInfo.
	 * 
	 * @return the getFeatureInfoFormats
	 */
//	public final List<String> getGetFeatureInfoFormats() {
//		return getFeatureInfoFormats;
//	}

    
 }
