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
import it.prato.comune.tolomeo.utility.TolomeoApplicationContext;
import it.prato.comune.tolomeo.web.parametri.ParametriLegendaLayer;
import it.prato.comune.tolomeo.web.parametri.ParametriMappa;
import it.prato.comune.tolomeo.web.parametri.ParametriServer;
import it.prato.comune.tolomeo.web.viewer.PGroup;
import it.prato.comune.tolomeo.web.viewer.PInitGroups;
import it.prato.comune.tolomeo.web.viewer.PLayer;
import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringEscapeUtils;

import edu.umn.gis.mapscript.MS_LAYER_TYPE;
import edu.umn.gis.mapscript.classObj;
import edu.umn.gis.mapscript.imageObj;
import edu.umn.gis.mapscript.layerObj;
import edu.umn.gis.mapscript.mapObj;
import edu.umn.gis.mapscript.styleObj;
 
/**
 * Classe di utilità per la gestione della legenda mapserver. Si occupa di generare le icone della legenda, recuperare i valori di scala minima e massima etc.
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class TOCMapserverUti extends TOCServerUtiBase{
	
    private TolomeoApplicationContext context = TolomeoApplicationContext.getInstance();

	/**
	 * Indica che il server è capace di gestire gli stili
	 */
	private static final boolean ISSTYLECAPABLE = false;
    
    private mapObj map = null;
    private String mapFile = null;
    private String legReadPath = null;
    private String legWritePath = null;
    private String nomeMap = null;
    private PInitGroups pg = null;
    private Map<String, PGroup> groupList = null;
    protected ParametriMappa paramMappa = null;
    
    /**
     * Costruttore 
     * 
     * @param pm parametri da preset della mappa per la quale occorre generare la legenda
     * @param logger
     * @throws SITException
     */
    public TOCMapserverUti(ParametriServer ps, ParametriMappa pm, LogInterface logger) {
    
    	super(ps, logger);
    	
    	this.paramMappa = pm;
    	
    	String url = ps.getUrl();
        //recupero parametri mappa e creo oggetto mappa
        int mapPosIni = url.indexOf("map=") + 4;
        int mapPosFine = url.indexOf("&");
        if (mapPosFine == -1) { 
            mapPosFine = url.length();
        } else {
            mapPosFine -= 1;
        }
        mapFile = url.substring(mapPosIni, mapPosFine);
        this.map = new mapObj(mapFile);  
        nomeMap = mapFile.substring(mapFile.lastIndexOf("/")+1,mapFile.length());
        
        //inizializzo i gruppi
        pg = new PInitGroups(map, paramMappa.getLegenda().getAllGroupsList(), "it", true, logger);
        groupList = pg.createGroups();
        
        //setto il path delle immagine della legenda (lettura)
        legReadPath = (String) context.getLegReadPath();
        if (!legReadPath.endsWith("/")) legReadPath += "/";
        legReadPath += nomeMap + "/";
        
        //setto il path delle immagine della legenda (scrittura)
        legWritePath = (String) context.getLegWritePath();
        if (!legWritePath.endsWith("/")) legWritePath += "/";
        legWritePath += nomeMap;
        legWritePath += "/";

    	// TODO fino ad ora era possibile solo un server adesso possono esserci più mapserver, quindi è possibile conflitto nella directory
        createLegendList();
        
        //setto il TOCbean
        toc = new TOCBean();
        
    }
    /*
    public void initCategories() throws SITException {
    	//aggiorna tra le altre cose anche le icone
     //   createLegendList();
        super.initCategories();
    }
    */
          
    // Map<String, String> styles,
    public TOCLayerBean createLayer(ParametriLegendaLayer lay, String SRID) throws SITException {
    	TOCLayerBean layBean = null;
    	
    	layBean = new TOCLayerBean();
    	
        layBean.setCatTreeIdx(lay.getCatTreeIdx());
        layBean.setLayTreeIdx(lay.getLayTreeIdx());
        layBean.setServerID(lay.getServerID());
        layBean.setCodTPN(lay.getCodTPN());
        layBean.setStyleCapable(ISSTYLECAPABLE);
        layBean.setRaster(lay.getRaster());
        layBean.setClickUrl(lay.getClickUrl());
        layBean.setClickTarget(lay.getClickTarget());
        layBean.setToolTip(lay.getToolTip());
        layBean.setItemType(lay.getItemType());
        layBean.setItemIcon(lay.getItemIcon());
        layBean.setExpanded(lay.getExpanded());

        int rnd = + (int) (Math.random() * 100000);
        layBean.setChkBoxId( "ginput_" + lay.getName() + rnd);
        layBean.setNameId("spxg_" + lay.getName() + rnd);

        layBean.setDefaultGroup(lay.getDefaultLayer());
        layBean.setChecked(lay.getDefaultLayer());
        layBean.setWithOpacitySettings(lay.getWithOpacitySettings());
        layBean.setOpacity(lay.getOpacity());
        layBean.setMinScaleMin(-1);
        layBean.setMaxScaleMax(-1);

        if (lay.getItemType().equals("layer")) {
            layBean.setUserSwitchable(lay.getUserSwitchable());
            
    	  //catDescr = cat.addslashes(_p($cat));
	        String layName = lay.getName();
	        PGroup grp = groupList.get(layName);
	        if (grp!=null) {
	        	// layInfo, toc, lay
	        	
	        	layBean.setName(grp.getGroupName());
	            
	            String descr = (lay.getDescrizione()==null || lay.getDescrizione().equals("")) ? StringEscapeUtils.escapeSql(grp.getDescription()) : StringEscapeUtils.escapeSql(lay.getDescrizione());                    
	            layBean.setDescr(descr) ;
	
	            ArrayList<PLayer> glayerList = grp.getLayers();
	            double[] scaleDenom = getLayerScaleDenom(glayerList);
	            layBean.setMinScaleMin(scaleDenom[0]);
	            layBean.setMaxScaleMax(scaleDenom[1]);
	            
	            /*for (PLayer glayer : glayerList) {
	                layBean.setNumClassesGrp(glayer.getClasses().size());
	            }*/
	            // Create CLASS entries for all LAYERS            
	            int count = 0;
	            for (PLayer glayer: glayerList) {
	                
	                layerObj legLayer = map.getLayer(glayer.getLayerIdx());
	                String legLayerName = legLayer.getName();
	                //MS_LAYER_TYPE legLayerType = legLayer.getType();
	                String legIconPath = legLayer.getMetadata().get("LEGENDICON", "");
	                Integer skipLegend = glayer.getSkipLegend();
	                //layBean.setSkipLegend(skipLegend);
	                Integer numClassesLay = glayer.getClasses().size();
	                //layBean.setNumClassesLay(numClassesLay);
	                layBean.setType(legLayer.getType().swigValue());
	                                            
	                // All layers but RASTER layers WITHOUT class definitions
	                if (((legLayer.getType().swigValue() < 3 && skipLegend < 1) || numClassesLay > 0) && skipLegend != 2) {
	
	                    List<String> classes = glayer.getClasses();
	                    int clno = 0;
	                    
	                    for (String cl1: classes) {
	                        legIconPath = legLayer.getClass(clno).getKeyimage(); 
	                        String icoUrl = (legIconPath!=null) ? legIconPath : legReadPath + legLayerName + "_i" + clno + "." + imgExt;
	                        TOCClassBean classBean = new TOCClassBean();
	                        
	                        classBean.setIcoUrl(icoUrl);   		// Url dell'icona
	                        classBean.setIcoW(icoW);       		// Larghezza incona
	                        classBean.setIcoH(icoH);       		// Altezza icona
	                        classBean.setCount(count);         	// numero layer all'interno del gruppo
	                        classBean.setClno(clno);          	// numero classe all'interno del layer
	                        classBean.setNome(cl1);  
	                        classBean.setId("spxg_" + (int) (Math.random() * 100000) + count + clno);
	                        
	                        layBean.getClassi().add(classBean);
	                        clno++;
	                    }
	                }
	                count++;
	            }
        	}
        } else {
            layBean.setUserSwitchable(false);
        }
    	return layBean;
    }
    
    /**
     * Metodo che genera le icone della legenda.
     * 
     */
    private void createLegendList() {
        
        // verifica se esiste la directory
        File dir = new File(legWritePath);
        if (!dir.exists()) {
            if (!dir.mkdirs()) {
        		logger.error("Impossibile creare la directory scrittura legenda (" + legWritePath + ")");
        	}
        }
        
        String imgLogFile = legWritePath + "createimg.log";
        long tsImgLogFile = 0;
        long tsMapFile = 0;
    
        File f = new File(imgLogFile);
        if (f.exists()) {
            tsImgLogFile = f.lastModified();
    
            File f1 = new File(mapFile);
            tsMapFile = f1.lastModified();
        }
    
        //controlla se e' necessario rigenerare le icone (se file .map più recente)
        if ( (!f.exists()) || (tsMapFile>tsImgLogFile)) {
            map.selectOutputFormat(imgFormat);
            PInitGroups pg = new PInitGroups(map, paramMappa.getLegenda().getAllGroupsList(), "it", true, logger);
            List<String> allLayers = pg.getAllLayerNames();
            
            // Define background image for legend icons
            layerObj icoBGLayer = new layerObj(map);
            icoBGLayer.setType(MS_LAYER_TYPE.MS_LAYER_POLYGON);

            // Add class
            classObj bgClass = new classObj(icoBGLayer);
            styleObj bgClStyle = new styleObj(bgClass);
            bgClStyle.getColor().setRGB(255, 255, 255);
            bgClStyle.getOutlinecolor().setRGB(180, 180, 180);

            for (String layName: allLayers) {
                layerObj qLayer = map.getLayerByName(layName);
    
                // All layers but RASTER or ANNOTATION layers        
                int numclasses = qLayer.getNumclasses();
                if (numclasses > 0) {
                    int clno = 0;
                    for (int cl=0; cl < numclasses; cl++) {
                        classObj classe = qLayer.getClass(cl);
                        if ((classe.getKeyimage()==null) || (classe.getKeyimage().equals(""))) {
                            //String clname = (numclasses < 2 ? "" : classe.getName());
                            styleObj clStyle = new styleObj(classe);
    
                            // Set outline for line themes to background color
                            if (qLayer.getType().equals(MS_LAYER_TYPE.MS_LAYER_LINE)) {
                                //clStyle.setColor(value)("outlinecolor", 180, 180, 180);
                                clStyle.getOutlinecolor().setRGB(180, 180, 180);
                            }
                            // set outline to main color if no outline defined (workaround for a bug in the icon creation)
                            if (qLayer.getType().equals(MS_LAYER_TYPE.MS_LAYER_POLYGON)) {
                                if (clStyle.getOutlinecolor()==null) {
                                    //#$clStyle->setcolor("outlinecolor", $clStyle->color);
                                    clStyle.setOutlinecolor(clStyle.getColor());
                                }
                            }

                            imageObj icoImg = classe.createLegendIcon(map, qLayer, icoW, icoH);
                            String imgFile = legWritePath + layName + "_i" + clno + "." + imgFormatExt;
                            icoImg.save(imgFile, map);
                        }
                        if ((classe.getName()!=null) && (!classe.getName().equals(""))) clno++;
                    }
                }
            }
    
            try {

                BufferedWriter out = new BufferedWriter(new FileWriter(imgLogFile));
                Date dt = new Date();
                Format formatter = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss");
                out.write("Icone create il " + formatter.format(dt));
                out.close();
                
            } catch (IOException e) {
            	logger.error("Errore durante generazione file icone legenda!",e);
            }
        }
    }
    
    /**
     * Calcola la scala minima e massima di visualizzazione di un certo layer visualizzato secondo un certo stile
     *
     * @param glayerList
     * @return array di double nel quale il primo elemento è la scala minima, il secondo la massima. Se un valore non è definito viene posto a -1
     */
    public double[] getLayerScaleDenom(ArrayList<PLayer> glayerList) {
    	double[] retVal = new double[2];
    	
    	retVal[0]=Double.MAX_VALUE;
    	retVal[1]=-1;
    	
        for (PLayer glayer: glayerList  ) {
            layerObj tocLayer = map.getLayer(glayer.getLayerIdx());
            retVal[0] = (tocLayer.getMinscaledenom()<retVal[0]) ? tocLayer.getMinscaledenom() : retVal[0];
            retVal[1] = (tocLayer.getMaxscaledenom()>retVal[1]) ? tocLayer.getMaxscaledenom() : retVal[1];
        }
        
        retVal[0] = (retVal[0]==Double.NEGATIVE_INFINITY) ? -1 : retVal[0];
        retVal[1] = (retVal[1]==Double.POSITIVE_INFINITY) ? -1 : retVal[1];
        
        return retVal;
    	
    }
	@Override
	protected double[] getLayerScaleDenom(String layer, String style)
			throws SITException {
		
		double[] retVal = {-1.0, -1.0};

        PGroup grp = groupList.get(layer);
		ArrayList<PLayer> glayerList = grp.getLayers();
        if (grp!=null) {
        	retVal = getLayerScaleDenom(glayerList);
        }
		
		return retVal;
	}
	
	@Override
	protected String getUrlLegendaClasseUnica(ParametriLegendaLayer lay,
			String style) throws SITException {
		
		return "";
	}



}
