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
package it.prato.comune.tolomeo.web.viewer;

import it.prato.comune.utilita.logging.interfaces.LogInterface;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringEscapeUtils;

import edu.umn.gis.mapscript.MS_CONNECTION_TYPE;
import edu.umn.gis.mapscript.MS_LAYER_TYPE;
import edu.umn.gis.mapscript.classObj;
import edu.umn.gis.mapscript.hashTableObj;
import edu.umn.gis.mapscript.layerObj;
import edu.umn.gis.mapscript.mapObj;

public class PInitGroups {

	private LogInterface logger = null;
    private mapObj map;
    private List<String> allGroups;
    private String gLanguage;
    private boolean map2unicode;
    private Map<String, List<Integer>> initGroups;
    
    public PInitGroups(mapObj map, List<String> allGroups, String gLanguage, boolean map2unicode, LogInterface logger) {
    	
    	this.logger = logger;
        this.map = map;
        this.allGroups = allGroups;
        this.gLanguage = gLanguage;
        this.map2unicode = map2unicode;

        initGroups = _defineLists();
        
        //_createGroups(initGroups);
        //TODO decidere come ritornare risultato!!!!
    }
    
    public List<String> getAllGroupNames() {
    	
        List<String> groups = new ArrayList<String>();
        
        for (int i=0; i<map.getNumlayers(); i++) {
            String gr = map.getLayer(i).getGroup();
            if (!groups.contains(gr)) {
                groups.add(gr);
            }
        }
        return groups;
    }
    
	public List<String> getAllLayerNames() {
        List<String> layers = new ArrayList<String>();
        
        for (int i=0;i<map.getNumlayers();i++) {
            String lay = map.getLayer(i).getName();
            if ((layers!=null) && (!layers.contains(lay))) {
                layers.add(lay);
            }
        }
        return layers;
    }
    
    private List<Integer> getLayersIndexByGroup(String groupName) {
        List<Integer> layers = new ArrayList<Integer>();
        
        for (int i=0;i<map.getNumlayers();i++) {
            String gr = map.getLayer(i).getGroup();
            if ((gr!=null) && (gr.equals(groupName))) {
                layers.add(i);
            }
        }
        return layers;       
        
    }
        
    private Map<String, List<Integer>> _defineLists() {

        List<String> groupOrder = allGroups;
        
        List<String> mapGroupsNames = getAllGroupNames();
        List<String> mapLayers    = getAllLayerNames();
        Map<String, List<Integer>> mapGroups = new HashMap<String, List<Integer>>();
        Map<String, List<Integer>> initGroups = new HashMap<String, List<Integer>>();
        
        // Create array for groups in map file
        for (String mgn: mapGroupsNames) {
            mapGroups.put(mgn, getLayersIndexByGroup(mgn));
        }
        
        //Add layers as groups if not assigned to any group
        for (String l: mapLayers) {  
        //foreach($mapLayers as $l) {
            layerObj layer = map.getLayerByName(l);
            int layIdx = layer.getIndex();
            String layGrp = layer.getGroup();
            if ((layGrp==null) || (layGrp.equals(""))) {
                List<Integer> idxArr = new ArrayList<Integer>();
                idxArr.add(layIdx);
                mapGroups.put(l, idxArr);
            }
        }
        
        // Sort group array according to order of $groupOrder
        for (String g: groupOrder) {
        //foreach($groupOrder as $g) {
            List<Integer> currGroup = mapGroups.get(g);
            if ((currGroup!=null) && (currGroup.size() > 0)) {
                initGroups.put(g, currGroup);
            } else {
                //error_log("Could not create group '$g' defined in groupOrder in 'config.ini'. Check if name is correct.", 0);
            }
        }
        
        return initGroups;
    }   
   
    /**
     * Inizializza i gruppi e le proprietà dei layer
     */
	public Map<String, PGroup> createGroups() {
		
	    Map<String, PGroup> grouplist = new HashMap<String, PGroup>();
	    
	    for (String gn: initGroups.keySet()) {

	        List<Integer> layerList = initGroups.get(gn);
	        PGroup group = new PGroup(gn);
	        int i = 1;
	    
	        //ciclo i layers del gruppo corrente
	        for (Integer layIdx: layerList) {

	        	//recupero informazione del layer attraverso il map file
	            layerObj mapLay = map.getLayer(layIdx);
	            String mapLayName = mapLay.getName();
	            MS_LAYER_TYPE mapLayType = mapLay.getType();
	            MS_CONNECTION_TYPE mapLayConnType = mapLay.getConnectiontype();
	            
	            //scrivo le proprietà del layer nell'oggetto glayer
	            PLayer glayer = new PLayer(mapLayName);
	            glayer.setLayerIdx(layIdx);
	            glayer.setLayerType(mapLayType);
	            
	            //recupero le classi del layer
	            int numclasses = mapLay.getNumclasses();
	            List<String> classes = new ArrayList<String>();
	            for (int cl=0; cl<numclasses; cl++) {
	                classObj classe = mapLay.getClass(cl);
	                String className = mapStringEncode(classe.getName());
	                if(className!=null) {
						if (className.length() > 0) {
							className = className.trim();
							classes.add(className.replaceAll("'", "\\'"));
						}
					} else {
						classes.add("");
					}
	            }
	            glayer.setClasses(classes);
	    
	            //check/set labelitems se definite
	            if (mapLay.getLabelitem()!=null) {
	                String labelItem = mapLay.getLabelitem();
	                glayer.setLabelItem(labelItem);
	            }              
	
	            //check for skipLegend
	            //1: only for TOC_TREE, 2: always skip legend
	            String szSkipLegend = _returnMetaData(mapLay, "SKIP_LEGEND");
	            int skipLegend = (szSkipLegend.equals("") ? 0 : new Integer(szSkipLegend).intValue());
	            glayer.setSkipLegend(skipLegend);
	            
	            //layer encoding
	            //ALE non traduco!
	            //glayer.setLayerEncoding(_returnMetaData(mapLay, "LAYER_ENCODING"));                
	            
	            //aggiungo il layer nel gruppo
	            group.addLayer(glayer);
	    
	            //set descrizione layer solo per il primo layer del gruppo
	            if (i == 1) {
	                // Set group description
	                String description = _initDescription(mapLay);
	                group.setDescription(description);
	                i = 0;
	            }
	        }
	        grouplist.put(gn, group);
	    }
	    return grouplist;
	}
        
	/**
	 * Ritorna i metadata del layer
	 */
	private String _returnMetaData(layerObj layer, String metaTag) {
	    
		hashTableObj md = layer.getMetadata();
	    String metaString = md.get(metaTag, "");
	    
	    return metaString;
	}
	
	/**
	 * Metodo che recupera la descrizione del layer passato
	 * @param mapLay
	 * @return
	 */
	private String _initDescription(layerObj mapLay) {
	    
		String metaString = _returnMetaData(mapLay, "DESCRIPTION");
	    String descriptionTag = null;
	    
	    if (!metaString.equals("")) {
	        descriptionTag = mapStringEncode(metaString);
	    } else {
	        descriptionTag = mapLay.getName();
	    }

	    return StringEscapeUtils.escapeHtml(descriptionTag).replaceAll("'", "&rsquo;");
	}

    public String mapStringEncode(String inString) {
        /* PER ADESSO NON TRADUCO. VEDIAMO...
        if (map2unicode) {
            $mapfile_encoding = trim($this->map->getMetaData("MAPFILE_ENCODING"));
            if ($mapfile_encoding) {
                if ($mapfile_encoding != "UTF-8") {
                    $outString = iconv($mapfile_encoding, "UTF-8", $inString);
                } else {
                    $outString = $inString;
                }
            } else {
                $outString = utf8_encode($inString);
            }
        } else {
            $outString = $inString;
        }
        return $outString;
        */
        return inString;
    }
}
