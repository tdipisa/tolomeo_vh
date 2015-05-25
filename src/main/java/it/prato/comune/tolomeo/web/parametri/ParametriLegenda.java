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
import java.util.Arrays;
import java.util.List;

/**
 * Classe nella quale viene deserializzato il tag parametriLegenda del file di preset. <br/>
 *  Contiene i parametri della legenda <br/>
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class ParametriLegenda {

    private ArrayList<ParametriLegendaCategoria> categoryList = new ArrayList<ParametriLegendaCategoria>();
    private Boolean conIcone = false; 
    
    // attributo che serve nei casi in cui sia presente una sola classe per ogni layer
    // in modo da inserire l'icona della classe all'altezza del layer. Con questo parametro
    // nel preset si specifica questa necessità.
    private Boolean singleClass = false;
    
    // attributo che indica la mutua esclusività fra le categorie del primo livello.
    // Si trova qui invece che all'interno di categoryList per mantenere una retrocompatibilità
    // con l'xml in quanto, modificare categoryList avrebbe causato pesanti modifiche all'xml
    // stesso.
    private Boolean mutualExclusiveCategories = false;
	 
    
    /**
     * Costruttore
     * 
     */
    public ParametriLegenda() { }
    
    /**
     * Getter lista delle categorie
     * 
     * @return
     */
    public ArrayList<ParametriLegendaCategoria> getCategoryList() {
        return categoryList;
    }
    
    /**
     * Metodo per aggiungere una categoria
     * 
     * @param p
     */
    public void addCategory(ParametriLegendaCategoria p) {
        categoryList.add(p); 
    }

    /**
     * Metodo per recuperare l'elenco di tutti i layer contenuti
     * 
     * @return
     */
    public List<String> getAllGroupsList() {
    	List<String> retVal = new ArrayList<String>();
        
    	for (ParametriLegendaCategoria cat: categoryList) {
    		retVal.addAll(cat.allGroupsList());
        }
        return retVal;
    	
    }
    
    public List<ParametriLegendaLayer> allLayersList() {
    	List<ParametriLegendaLayer> retVal = new ArrayList<ParametriLegendaLayer>();
        
    	for (ParametriLegendaCategoria cat: categoryList) {
    		retVal.addAll(cat.allLayersList());
        }
        return retVal;
    }
    
    /**
     * Metodo per ottenere l'elenco di tutti i layer accesi all'avvio
     * 
     * @return
     */
    public List<String> getDefaultGroupList() {
        
        ArrayList<String> retVal = new ArrayList<String>();
        
        for (ParametriLegendaCategoria cat: categoryList) {
           retVal.addAll(cat.defaultGroupList());
        }
        return retVal;
    }

    /**
     * Metodo per ottenere l'elenco degli stili corrispondenti ad i layer accesi all'avvio
     * 
     * @return
     */
    public List<String> getDefaultGroupStyleList() {
        
        ArrayList<String> retVal = new ArrayList<String>();
        
        for (ParametriLegendaCategoria cat: categoryList) {
            retVal.addAll(cat.defaultGroupStyleList());
        }
        return retVal;
    }
    
    /**
     * Restitusce ParametriLegendaCategoria relativo all'indice passato (tenendo conto delle categorie annidate)
     * 
     * @param catIdx
     * @return
     */
    public ParametriLegendaCategoria getCategoria(String catIdx) {
    	String sep =  TOCServerUtiBase.TOCCATSEPARATOR;
    	String[] catIdxs = catIdx.split(sep);
    	List<String> catIdxsArr =new ArrayList<String>( Arrays.asList(catIdxs));
    	
    	return getCategoria(catIdxsArr , this.getCategoryList());
    	
    }
    
    /**
     * Restitusce ParametriLegendaCategoria relativo all'indice passato (tenendo conto delle categorie annidate)
     * 
     * @param catIdxsArr
     * @param plc
     * @return
     */
    private ParametriLegendaCategoria getCategoria(List<String> catIdxsArr , List<ParametriLegendaCategoria> plc) {
    	
    	int idx = Integer.parseInt(catIdxsArr.remove(0));
    	if (plc.size()<idx) return null;
    	
		if (catIdxsArr.size()==0) return plc.get(idx);
		else {
			return getCategoria( catIdxsArr, plc.get(idx).getCategoryList());
		}
    	
    }

	/**
	 * @return the conIcone
	 */
	public Boolean getConIcone() {
		return conIcone;
	}

	/**
	 * @param conIcone the conIcone to set
	 */
	public void setConIcone(Boolean conIcone) {
		this.conIcone = conIcone;
	}

	/**
	 * @param categoryList the categoryList to set
	 */
	public void setCategoryList(ArrayList<ParametriLegendaCategoria> categoryList) {
		this.categoryList = categoryList;
	}
	
	/**
	 * Restituisce l'oggetto parametri relativo al layer con il codTPN passato.
	 * @param codTPN codTPN del layer da trovare
	 * @return restituisce il layer trovato, null in caso non trovi nessun layer che soddisfa il criterio 
	 */
	public ParametriLegendaLayer findByCodTPN(int codTPN) {
		for (ParametriLegendaLayer pl: allLayersList()) {
			if (pl.getCodTPN()==codTPN) return pl;
		}
		return null;
	}
    
	
	public Boolean getSingleClass(){
       return singleClass;
    }
	
	public void setSingleClass(Boolean singleClass){
		this.singleClass = singleClass;
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
