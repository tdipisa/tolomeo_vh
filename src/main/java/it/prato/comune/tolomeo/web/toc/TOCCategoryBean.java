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

import org.apache.commons.lang.StringEscapeUtils;

/**
 * Classe che contiene la descrizione della categorie della legenda, è contenuta in {@link TOCBean} per descrivere la legenda ed inviare i dati al client. 
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class TOCCategoryBean {

	private ArrayList<TOCLayerBean> layers = new ArrayList<TOCLayerBean>();
	private ArrayList<TOCCategoryBean> categories = null;
	
	private String nome = null;
    private Boolean	hidden = null;
    private Boolean userSwitchable = true;
    private String catDescr = null;
	private String catId = null;
	private Boolean checked = true;
	private String catTreeIdx = null;
	
	private String 	clickUrl 		= null;
	private String 	clickTarget 	= null;
	private Boolean forceClickable 	= null;
	private String 	toolTip 		= null;
	private String  itemType		= null;
	private String  itemIcon		= null;
	
	private Boolean expanded = null;
	

	/**
	 * Costruttore
	 * 
	 */
	public TOCCategoryBean() {

	}

	/** 
	 * Getter elenco layer contenuti nella categoria
	 * 
	 * @return elenco dei layer
	 */
	public ArrayList<TOCLayerBean> getLayers() {
		return layers;
	}


	/**
	 * Setter campo layers
	 * 
	 * @param layers
	 */
	public void setLayers(ArrayList<TOCLayerBean> layers) {
		this.layers = layers;
	}

	/** 
	 * Getter elenco layer contenuti nella categoria
	 * 
	 * @return elenco dei layer
	 */
	public ArrayList<TOCCategoryBean> getCategories() {
		return categories;
	}
	
	/**
	 * Setter campo categories
	 * 
	 * @param layers
	 */
	//public void setCategories(ArrayList<TOCCategoryBean> categories) {
	//	this.categories = categories;
	//}
	
	/**
	 * Aggiunta categoria
	 * 
	 * @param category
	 */
	public void addCategory(TOCCategoryBean category) {
		if (categories==null) categories = new ArrayList<TOCCategoryBean>();
		this.categories.add(category);
	}
	
	/** 
	 * Getter nome della categoria
	 * 
	 * @return nome della categoria
	 */
	public String getNome() {
		return nome;
	}


	/**
	 * Setter campo nome
	 * 
	 * @param nome
	 */
	public void setNome(String nome) {
		this.nome = nome;
	}

	/** 
	 * Getter descrizione della categoria
	 * 
	 * @return descrizione della categoria
	 */
	public String getCatDescr() {
		return catDescr;
	}

	/**
	 * Setter campo catDescr
	 * 
	 * @param catDescr
	 */
	public void setCatDescr(String catDescr) {
		this.catDescr = StringEscapeUtils.escapeHtml(catDescr);
	}

	/** 
	 * Getter id categoria
	 * 
	 * @return id della categoria
	 */
	public String getCatId() {
		return catId;
	}

	/**
	 * Setter campo catId
	 * 
	 * @param catId
	 */
	public void setCatId(String catId) {
		this.catId = catId.replaceAll(" ", "_");
	}

	/** 
	 * Getter stato della categoria (checked o no)
	 * 
	 * @return nome della categoria
	 */
	public Boolean getChecked() {
		return checked;
	}

	/**
	 * Setter campo checked
	 * 
	 * @param checked
	 */
	public void setChecked(Boolean checked) {
		this.checked = checked;
	}

	/**
	 * @return ritorna catTreeIdx, che indica la posizione della categoria corrispondente all'interno del tag legenda 
	 */
	public String getCatTreeIdx() {
		return catTreeIdx;
	}

	/**
	 * @param setta catTreeIdx, che indica la posizione della categoria corrispondente all'interno del tag legenda
	 */
	public void setCatTreeIdx(String catTreeIdx) {
		this.catTreeIdx = catTreeIdx;
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
	 * @return the forceClickable
	 */
	public Boolean getForceClickable() {
		return forceClickable;
	}

	/**
	 * @param forceClickable the forceClickable to set
	 */
	public void setForceClickable(Boolean forceClickable) {
		this.forceClickable = forceClickable;
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
     * 
     * @return if expand on start
     */	
    public Boolean getExpanded() {
        return expanded;
    }
    

    /**
     * 
     * @param expanded the expand to set
     */
    public void setExpanded(Boolean expanded) {
        this.expanded = expanded;
    }

	/**
	 * @param categories the categories to set
	 */
	public void setCategories(ArrayList<TOCCategoryBean> categories) {
		this.categories = categories;
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
    
    		
}
 