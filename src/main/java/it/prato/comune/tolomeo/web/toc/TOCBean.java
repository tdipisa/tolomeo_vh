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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



/**
 * Classe che contiene la descrizione della legenda. La serializzazione in json verrà trasmessa al javascript,per questo motivo la classe presente è 
 * anche la documentazione del protocollo utilizzato  tra server e client nella gestione della legenda 
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class TOCBean {

	private Map<String, TOCServerBean>  server 	= new HashMap<String, TOCServerBean>();
    private List<TOCCategoryBean>  	categories = new ArrayList<TOCCategoryBean>();
    private List<TOCLayerOrderBean>  	layerOrder = new ArrayList<TOCLayerOrderBean>();
    private Boolean orderChangeCapable = false;
    
    /**
     * Costruttore
     */
    public TOCBean() {
        
    }
    
    public String getTOCCATSEPARATOR() {
    	return TOCServerUtiBase.TOCCATSEPARATOR;
    }

    /**
     * Getter delle categorie
     * 
     * @return elenco delle categorie
     */
    public List<TOCCategoryBean> getCategories() {
        return categories;
    }

    /**
     * Setter delle categorie
     * 
     * @param Arraylist delle categorie
     */
    public void setCategories(List<TOCCategoryBean> categories) {
        this.categories = categories;
    }

	/**
	 * @return the orderChangeCapable
	 */
	public Boolean getOrderChangeCapable() {
		return orderChangeCapable;
	}

	/**
	 * @param orderChangeCapable the orderChangeCapable to set
	 */
	public void setOrderChangeCapable(Boolean orderChangeCapable) {
		this.orderChangeCapable = orderChangeCapable;
	}

	/**
	 * @return the server
	 */
	public Map<String, TOCServerBean> getServer() {
		return server;
	}


	/**
     * Restitusce ParametriLegendaCategoria relativo all'indice passato (tenendo conto delle categorie annidate)
     * 
     * @param catIdx
     * @return
     */
    public TOCCategoryBean getCategoria(String catIdx) {
    	String sep =  TOCServerUtiBase.TOCCATSEPARATOR;
    	String[] catIdxs = catIdx.split(sep);
    	List<String> catIdxsArr =new ArrayList<String>( Arrays.asList(catIdxs));
    	
    	return getCategoria(catIdxsArr , this.getCategories());
    }
    
    /**
     * Restitusce ParametriLegendaCategoria relativo all'indice passato (tenendo conto delle categorie annidate)
     * 
     * @param catIdxsArr
     * @param plc
     * @return
     */
    private TOCCategoryBean getCategoria(List<String> catIdxsArr , List<TOCCategoryBean> plc) {
    	
    	int idx = Integer.parseInt(catIdxsArr.remove(0));
    	if (plc.size()<idx) return null;
    	
		if (catIdxsArr.size()==0) return plc.get(idx);
		else {
			return getCategoria( catIdxsArr, plc.get(idx).getCategories());
		}
    	
    }

	/**
	 * @return the layerOrder
	 */
	public List<TOCLayerOrderBean> getLayerOrder() {
		return layerOrder;
	}

	/**
	 * @param layerOrder the layerOrder to set
	 */
	public void setLayerOrder(List<TOCLayerOrderBean> layerOrder) {
		this.layerOrder = layerOrder;
	}
	

    
}
