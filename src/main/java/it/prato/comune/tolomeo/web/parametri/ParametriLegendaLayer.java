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

import java.util.ArrayList;
import java.util.List;


/**
 * 
 * Classe che contiene la deserializzazione del tag Layer all'interno della legenda nel file di preset. 
 * Contiene le informazioni relative ad un layer all'interno della legenda
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class ParametriLegendaLayer {
    private String name="";
    private Boolean hidden=false;
    private Boolean userSwitchable = true;
    private Integer codTPN=0;
    private Boolean defaultLayer=true;
    private Boolean withOpacitySettings=false;
    private String 	iconaLegenda = null;
    private String descrizione = "";
    private String defaultStyle = "";
    private Integer scalaMinima  = -1;  // Influenza solo lo stato della visualizzazione nella legenda (nero o grigio), non l'effettiva visualizzazione.
    								    // Utilizzato solo nel caso di WMS generico o di GEOSERVER senza REST, cioè nei casi nei quali non è possibile ottenere lo stato di visibilità in funzione della scala. Ignorato negli altri casi 
	private Integer scalaMassima = -1;  // Influenza solo lo stato della visualizzazione nella legenda (nero o grigio), non l'effettiva visualizzazione.
     									// Utilizzato solo nel caso di WMS generico o di GEOSERVER senza REST, cioè nei casi nei quali non è possibile ottenere lo stato di visibilità in funzione della scala. Ignorato negli altri casi
	private String extraLegendGraphPar = null; 	
	private String serverID = null;
	private String catTreeIdx = null;
	private String layTreeIdx = null;
	private Boolean raster 			= false;
	private String 	clickUrl 		= null;
	private String 	clickTarget 	= null;
	private Boolean stiliIndipDaScala = true;
	
	/** Indica se lo stile è indipendente dalla posizione, cioè dalla zona di territorio inquadrata. 
		Questo parametro permette di gestire server che supportano la visualizzazione di legende che comprendono solo i simboli di oggetti presenti nella zona di territorio visualizzata
	*/
	private Boolean stiliIndipDaPosizione = true;

	private String 	toolTip 		= null;
	private Boolean expanded        = false;
	private Float opacity           = 1.0f;
	private String itemType 		= "layer"; 
	private String 	itemIcon		= null;
	private String attribution		= null;
	private List<ParametriLegendaLayerMetadataURL> metadataURLList=new ArrayList<ParametriLegendaLayerMetadataURL>();
	
	/** Se presente indica che il layer è del tipo "autolayer" cioè non è definito a livello di config tolomeo ma viene definito al volo. */ 
	private ParametriLegendaLayerAutoLayer autoLayer = null;
	
    public ParametriLegendaLayer() {

    }

    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public Integer getCodTPN() {
        return codTPN;
    }


    public void setCodTPN(Integer codTPN) {
        this.codTPN = codTPN;
    }

    public Boolean getDefaultLayer() {
        return defaultLayer;
    }

    public void setDefaultLayer(Boolean defaultLayer) {
        this.defaultLayer = defaultLayer;
    }

    public Boolean getWithOpacitySettings() {
        return withOpacitySettings;
    }

    public void setWithOpacitySettings(Boolean withOpacitySettings) {
        this.withOpacitySettings = withOpacitySettings;
    }

    
    public void setDescrizione(String descrizione) {
		this.descrizione = descrizione;
	}

    public String getDescrizione() {
		return descrizione;
	}

    public void setDefaultStyle(String defaultStyle) {
		this.defaultStyle = defaultStyle;
	}

    public String getDefaultStyle() {
		return defaultStyle;
	}

	public Integer getScalaMinima() {
		return scalaMinima;
	}

	public void setScalaMinima(Integer scalaMinima) {
		this.scalaMinima = scalaMinima;
	}

	public Integer getScalaMassima() {
		return scalaMassima;
	}

	public void setScalaMassima(Integer scalaMassima) {
		this.scalaMassima = scalaMassima;
	}

	/**
	 * @return the iconaLegenda
	 */
	public String getIconaLegenda() {
		return iconaLegenda;
	}

	/**
	 * @param iconaLegenda the iconaLegenda to set
	 */
	public void setIconaLegenda(String iconaLegenda) {
		this.iconaLegenda = iconaLegenda;
	}

	/**
	 * Ritorna i parametri aggiuntivi per la richiesta della legendGraphic.
	 * Se non settati la richiesta utilizzerà, se definiti, quelli presenti nel file tolomeo.properties, chiave LEGENDGRAPHIC.EXTRAPARAMS
	 * 
	 * @return the extraLegendGraphPar
	 */
	public String getExtraLegendGraphPar() {
		return extraLegendGraphPar;
	}

	/**
	 * Setta i parametri aggiuntivi per la richiesta della legendGraphic. 
	 * Se non settati la richiesta utilizzerà, se definiti, quelli presenti nel file tolomeo.properties, chiave LEGENDGRAPHIC.EXTRAPARAMS
	 * 
	 * @param extraLegendGraphPar the extraLegendGraphPar to set
	 */
	public void setExtraLegendGraphPar(String extraLegendGraphPar) {
		this.extraLegendGraphPar = extraLegendGraphPar;
	}

	/**
	 * @return the serverID
	 */
	public String getServerID() {
		return serverID;
	}

	/**
	 * @param serverID the serverID to set
	 */
	public void setServerID(String serverID) {
		this.serverID = serverID;
	}

	/**
	 * @return the layTreeIdx
	 */
	public String getLayTreeIdx() {
		return layTreeIdx;
	}

	/**
	 * @param layTreeIdx the layTreeIdx to set
	 */
	public void setLayTreeIdx(String layTreeIdx) {
		this.layTreeIdx = layTreeIdx;
	}

	/**
	 * @return the catTreeIdx
	 */
	public String getCatTreeIdx() {
		return catTreeIdx;
	}

	/**
	 * @param catTreeIdx the catTreeIdx to set
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
	 * @return the raster
	 */
	public Boolean getRaster() {
		return raster;
	}

	/**
	 * @param raster the raster to set
	 */
	public void setRaster(Boolean raster) {
	      
		this.raster = raster;
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
	 * @return the stiliIndipDaScala
	 */
	public Boolean getStiliIndipDaScala() {
		return stiliIndipDaScala;
	}

	/**
	 * @param stiliIndipDaScala the stiliIndipDaScala to set
	 */
	public void setStiliIndipDaScala(Boolean stiliIndipDaScala) {
		this.stiliIndipDaScala = stiliIndipDaScala;
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
     * To get opacity value
     * @return opacity
     */
    public Float getOpacity() {
        return opacity;
    }

    /**
     * To set opacity (from 0.0 to 1.0)
     * @param opacity
     */
    public void setOpacity(Float opacity) {
        this.opacity = opacity;
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
	 * @return the autoLayer
	 */
	public final ParametriLegendaLayerAutoLayer getAutoLayer() {
		return autoLayer;
	}

	/**
	 * @param autoLayer the autoLayer to set
	 */
	public final void setAutoLayer(final ParametriLegendaLayerAutoLayer autoLayer) {
		this.autoLayer = autoLayer;
	}

	/**
	 *  Recupera se lo stile è indipendente dalla posizione, cioè dalla zona di territorio inquadrata. 
		Questo parametro permette di gestire server che supportano la visualizzazione di legende che comprendono solo i simboli di oggetti presenti nella zona di territorio visualizzata.
	 * @return valore attuale
	 */
	public Boolean getStiliIndipDaPosizione() {
		return stiliIndipDaPosizione;
	}

	/**
	 *  Imposta se lo stile è indipendente dalla posizione, cioè dalla zona di territorio inquadrata. 
	 *	Questo parametro permette di gestire server che supportano la visualizzazione di legende che comprendono solo i simboli di oggetti presenti nella zona di territorio visualizzata.
	 * @param stiliIndipDaPosizione valore da impostare
	 */
	public void setStiliIndipDaPosizione(Boolean stiliIndipDaPosizione) {
		this.stiliIndipDaPosizione = stiliIndipDaPosizione;
	}

	/**
	 * @return Imposta attribution 
	 */
	public String getAttribution() {
		return attribution;
	}

	/**
	 * @param Recupera attribution impostata
	 */
	public void setAttribution(String attribution) {
		this.attribution = attribution;
	}

	/**
	 * Recupera metadataURLList.
	 *
	 * @return metadataURLList
	 */
	public final List<ParametriLegendaLayerMetadataURL> getMetadataURLList() {
		return metadataURLList;
	}

	/**
	 * Aggiunge un elemento ParametriLegendaLayerMetadataURL alla lista.
	 * @param metadataURL valore di metadataURL da aggiungere
	 */
	public final void addMetadataURL(ParametriLegendaLayerMetadataURL metadataURL) {
		this.metadataURLList.add(metadataURL);
	}
	
}
