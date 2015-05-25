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
package it.prato.comune.tolomeo.web.parametri;

import it.prato.comune.tolomeo.web.toc.TOCServerUtiBase;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * Classe che contiene la deserializzazione del tag Category all'interno della legenda nel file di preset. 
 * Contiene le informazioni relative ad una categoria all'interno della legenda
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class ParametriLegendaCategoria {

	private String name = null;
	//private List<String> layerNamesList = null;
	private Boolean hidden = false;
	private Boolean userSwitchable = true;
	private ArrayList<ParametriLegendaLayer> layerList=new ArrayList<ParametriLegendaLayer>();
	private ArrayList<ParametriLegendaCategoria> categoryList=null;
	private Boolean defaultCategory = true;
	private Boolean mutualExclusive = false;
	private String catTreeIdx = null;
	private String 	clickUrl 		= null;
	private String 	clickTarget 	= null;
	private String 	toolTip 		= null;
	private Boolean expanded        = false;
	private String itemType 		= "category"; 
	private String itemIcon 		= null; 

	// attributo che indica la mutua esclusività fra le categorie del primo livello.
	// Si trova qui invece che all'interno di categoryList per mantenere una retrocompatibilità
	// con l'xml in quanto, modificare categoryList avrebbe causato pesanti modifiche all'xml
	// stesso.
	private Boolean mutualExclusiveCategories = false;
	

	public ParametriLegendaCategoria() {
		
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	/*
	public List<String> getLayerNamesList() {
		return layerNamesList;
	} */
	public ArrayList<ParametriLegendaLayer> getLayerList() {
		return layerList;
	}
	public void addLayer(ParametriLegendaLayer p) {
		layerList.add(p); 
	}

	public ArrayList<ParametriLegendaCategoria> getCategoryList() {
		return categoryList;
	}
	
	public void addCategory(ParametriLegendaCategoria c) {
		if (categoryList==null) this.categoryList=new ArrayList<ParametriLegendaCategoria>();
		categoryList.add(c); 
	}
	
	public Boolean getDefaultCategory() {
		return defaultCategory;
	}

	public void setDefaultCategory(Boolean defaultCategory) {
		this.defaultCategory = defaultCategory;
	}

	/**
	 * Getter del valore mutualExclusive, che indica se i layer contenuti all'interno della categoria sono mutuamente esclusivi
	 * @return il valore di  mutualExclusive
	 */
	public Boolean getMutualExclusive() {
		return mutualExclusive;
	}

	/**
	 * Setter del valore mutualExclusive, che indica se i layer contenuti all'interno della categoria sono mutuamente esclusivi
	 * 
	 * @param mutualExclusive il valore da settare
	 */
	public void setMutualExclusive(Boolean mutualExclusive) {
		this.mutualExclusive = mutualExclusive;
	}		

	/**
	 * Getter del valore expanded, che indica se la categoria deve essere espansa all'avvio
	 * @return il valore di expanded
	 */
    public Boolean getExpanded() {
        return expanded;
    }

    /**
     * Setter del valore expanded, che indica se la categoria deve essere espansa all'avvio
     * 
     * @param expanded il valore da settare
     */
    public void setExpanded(Boolean expanded) {
        this.expanded = expanded;
    }

    /**
     * Metodo per recuperare l'elenco di tutti i layer contenuti
     * Il nome del metodo non contiene il prefisso get per non essere serializzato json automaticamente
     *
     * @return
     */
    public List<String> allGroupsList() {
    	
        ArrayList<String> retVal =  new ArrayList<String>();
        /*
        for (ParametriLegendaLayer lay: getLayerList()) {
            retVal.add(lay.getName());
        }
    
        if (getCategoryList()!=null) {
	        for (ParametriLegendaCategoria cat: getCategoryList()) {
	        	retVal.addAll(cat.allGroupsList());
	        }
        }*/
        
        List<ParametriLegendaLayer> lays =  allLayersList();
        for (ParametriLegendaLayer l: lays) retVal.add(l.getName());
        
        return retVal;
    }
    
    /** Metodo per recuperare l'elenco di tutti i layer contenuti
    * Il nome del metodo non contiene il prefisso get per non essere serializzato json automaticamente
    *
    * @return
    */
   public List<ParametriLegendaLayer> allLayersList() {
       List<ParametriLegendaLayer> retVal =  new ArrayList<ParametriLegendaLayer>();
       
       for (ParametriLegendaLayer lay: getLayerList()) {
           retVal.add(lay);
       }
   
       if (getCategoryList()!=null) {
	        for (ParametriLegendaCategoria cat: getCategoryList()) {
	        	retVal.addAll(cat.allLayersList());
	        }
       }
       return retVal;
   }
    
    /**
     * Metodo per ottenere l'elenco di tutti i layer accesi all'avvio. 
     * Il nome del metodo non contiene il prefisso get per non essere serializzato json automaticamente
     * 
     * @return
     */
    public List<String> defaultGroupList() {
        
        ArrayList<String> retVal = new ArrayList<String>();
        
        for (ParametriLegendaLayer lay: getLayerList()) {
        	
            if (getDefaultCategory() && lay.getDefaultLayer()) {
                retVal = (retVal==null) ? (new ArrayList<String>()) : retVal;
                retVal.add(lay.getName());
            }
        }
    
        if (getCategoryList()!=null) {
	        for (ParametriLegendaCategoria cat: getCategoryList()) {
	        	retVal.addAll(cat.defaultGroupList());
	        }
        }
        return retVal;
    }

    /**
     * Metodo per ottenere l'elenco degli stili corrispondenti ad i layer accesi all'avvio
     * Il nome del metodo non contiene il prefisso get per non essere serializzato json automaticamente
     * 
     * @return
     */
    public List<String> defaultGroupStyleList() {
        
        ArrayList<String> retVal = new ArrayList<String>();
        
        for (ParametriLegendaLayer lay: getLayerList()) {
            if (getDefaultCategory() && lay.getDefaultLayer()) {
                String stile = (lay.getDefaultStyle()!=null) ? lay.getDefaultStyle() : "";
                retVal.add(stile);
            }
        }
        
        if (getCategoryList()!=null) {
	        for (ParametriLegendaCategoria cat: categoryList) {
	        	retVal.addAll(cat.defaultGroupStyleList());
	        }
        }
        
        return retVal;
    }
    
	public void setTreeIdxs(String catTreeIdx) {
		
		this.catTreeIdx = catTreeIdx;
		if (categoryList!=null) {
			for (int i = 0; i<categoryList.size(); i++) {
				String newCatIdx = catTreeIdx + TOCServerUtiBase.TOCCATSEPARATOR + i; 
				categoryList.get(i).setTreeIdxs(newCatIdx);
			}
		}
		
		if (layerList!=null) {
			for (int i=0; i<layerList.size(); i++) {
				layerList.get(i).setCatTreeIdx(catTreeIdx);
				layerList.get(i).setLayTreeIdx(""+i);
				
			}
		}
		
	}

	/**
	 * @return the catTreeIdx
	 */
	public String getCatTreeIdx() {
		return catTreeIdx;
	}

	/**
	 * @return the hidden
	 */
	public Boolean getHidden() {
		return hidden;
	}

	/**
	 * @param hidden the hidden to set
	 */
	public void setHidden(Boolean hidden) {
		this.hidden = hidden;
	}

	/**
	 * @return the userSwitchable
	 */
	public Boolean getUserSwitchable() {
		return userSwitchable;
	}

	/**
	 * @param userSwitchable the userSwitchable to set
	 */
	public void setUserSwitchable(Boolean userSwitchable) {
		this.userSwitchable = userSwitchable;
	}


	/**
	 * @return the clickUrl
	 */
	public String getClickUrl() {
		return clickUrl;
	}

	/**
	 * @param clickUrl the clickUrl to set
	 */
	public void setClickUrl(String clickUrl) {
		this.clickUrl = clickUrl;
	}

	/**
	 * @return the clickTarget
	 */
	public String getClickTarget() {
		return clickTarget;
	}

	/**
	 * @param clickTarget the clickTarget to set
	 */
	public void setClickTarget(String clickTarget) {
		this.clickTarget = clickTarget;
	}

	/**
	 * @return the toolTip
	 */
	public String getToolTip() {
		return toolTip;
	}

	/**
	 * @param toolTip the toolTip to set
	 */
	public void setToolTip(String toolTip) {
		this.toolTip = toolTip;
	}

	/**
	 * @param layerList the layerList to set
	 */
	public void setLayerList(ArrayList<ParametriLegendaLayer> layerList) {
		this.layerList = layerList;
	}

	/**
	 * @param categoryList the categoryList to set
	 */
	public void setCategoryList(ArrayList<ParametriLegendaCategoria> categoryList) {
		this.categoryList = categoryList;
	}

	/**
	 * Setter per catTreeIdx. Utilizzato quando deserializza da json (altrimenti utilizzare @see {@link ParametriLegendaCategoria#setTreeIdxs(String)}
	 * @param catTreeIdx the catTreeIdx to set
	 */
	public void setCatTreeIdx(String catTreeIdx) {
		this.catTreeIdx = catTreeIdx;
	}

	/**
	 * @return the itemType
	 */
	public String getItemType() {
		return itemType;
	}

	/**
	 * @param itemType the itemType to set
	 */
	public void setItemType(String itemType) {
		this.itemType = itemType;
	}

	/**
	 * @return the itemIcon
	 */
	public String getItemIcon() {
		return itemIcon;
	}

	/**
	 * @param itemIcon the itemIcon to set
	 */
	public void setItemIcon(String itemIcon) {
		this.itemIcon = itemIcon;
	}


	/**
	 * @return the mutualExclusiveCategories
	 */
	public Boolean getMutualExclusiveCategories() {
	        return mutualExclusiveCategories;
	}
	/**
	 * @param mutualExclusiveCategories the mutualExclusiveCategories to set
	 */
	public void setMutualExclusiveCategories(Boolean mutualExclusiveCategories) {
	        this.mutualExclusiveCategories = mutualExclusiveCategories;
	}


}
