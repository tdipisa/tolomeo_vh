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

import it.prato.comune.sit.ows.WMSCapabilitiesMetadataURLBean;
import it.prato.comune.sit.ows.WMSLayerCapabilitiesAttributionBean;

import java.util.ArrayList;
import java.util.List;


/**
 * Classe che contiene la descrizione dei layer della legenda, è contenuta in {@link TOCCategoryBean} per descrivere la legenda ed inviare i dati al client. 
 * 
 * @author Ing. Alessandro Radaelli
 *
 */
public class TOCLayerBean {

    private ArrayList<TOCClassBean>  classi = new ArrayList<TOCClassBean>();
    
    private String	layerAbstract = null;
    private String 	name = null;
    private Boolean hidden = null;
    private Boolean userSwitchable = true;
    private String 	chkBoxId = null;
    private String 	nameId = null;
    private int 	type=0;
    private boolean defaultGroup = false;
    private boolean visible = true;
    private boolean withOpacitySettings =false;
    private Integer codTPN=0;
    private boolean checked = true;   // utilizzato nella legenda lato javascript per tenere traccia se il layer è selezionato in legenda
    private String 	descr = null;
    private String	style = "";
    private Boolean styleCapable=false;
    private Boolean temporaryNotAvailable=false; 
    
    private double minScaleMin = -1;
    private double maxScaleMax = -1;
    
    private String catTreeIdx = null;
    private String layTreeIdx = null;
    private String serverID = null;
    
    private Double bboxMaxX = null;
    private Double bboxMaxY = null;
    private Double bboxMinX = null;
    private Double bboxMinY = null;
    
	private Boolean raster 			= false;
	private String 	clickUrl 		= null;
	private String 	clickTarget 	= null;
	private Boolean forceClickable 	= null;
	private Boolean stiliIndipDaScala = true;
	private Boolean stiliIndipDaPosizione = true;
	private String 	toolTip 		= null;
	private String  itemType		= null;
	private String 	itemIcon		= null;
	private Boolean parentcategorychecked = false;
	
	private Boolean expanded = null;
	private Float opacity = null;
	
	private List<WMSCapabilitiesMetadataURLBean> metadataUrlList = new ArrayList<WMSCapabilitiesMetadataURLBean>();
	private WMSLayerCapabilitiesAttributionBean attribution = null;
	
	
	/** Indica se il layer è interrogabile o no. */
	private Boolean queryable = false;
	
	/** Formati disponibili per la chiamata GetFeatureInfo. */
	private final List<String> getFeatureInfoFormats = new ArrayList<String>();
    
    //ArrayList<String>
    private List<TOCStyleBean> definedStyles = new ArrayList<TOCStyleBean>();
    
    
    /**
     * Costruttore
     * 
     */
    public TOCLayerBean() {}
    
    /**
     * Getter Classi contenute nel layer
     * 
     * @return
     */
    public ArrayList<TOCClassBean> getClassi() {
        return classi;
    }

    /**
     * Setter classi
     * 
     * @param classi
     */
    public void setClassi(ArrayList<TOCClassBean> classi) {
        this.classi = classi;
    }

    /** 
     * Getter nome del layer
     * 
     * @return
     */
    public String getName() {
        return this.name;
    }
    
    /**
     * Setter nome del layer
     * 
     * @param name
     */
    public void setName(String name) {
    	this.name = name;
    }


    /**
     * Getter descrizione del layer
     * 
     * @return
     */
    public String getDescr() {
        return this.descr;
    }

    /**
     * Setter descrizione
     * 
     * @param descr
     */
    public void setDescr(String descr) {
    	this.descr = descr;
    }
    

    /** 
     * Getter id della checkbox associata al layer
     * 
     * @return
                		layBean.getDefinedS
     */
    public String getChkBoxId() {
        return chkBoxId;
    }


    /**
     * Setter chkBoxId
     * 
     * @param chkBoxId
     */
    public void setChkBoxId(String chkBoxId) {
        this.chkBoxId = chkBoxId;
    }

    /** 
     * Getter tipo di layer (poligono, linea etc.) Vedi file di preset
     * 
     * @return
     */
    public int getType() {
        return type;
    }


    /**
     * Setter tipo di layer
     * 
     * @param type
     */
    public void setType(int type) {
        this.type = type;
    }


    /**
     * Getter  stato iniziale
     * 
     * @return
     */
    public boolean isDefaultGroup() {
        return defaultGroup;
    }
    
    /** 
     * Setter stati iniziale
     * 
     * @param defaultGroup
     */
    public void setDefaultGroup(boolean defaultGroup) {
    	this.defaultGroup =defaultGroup;
    }

    /**
     * Getter stato di visibilità
     * 
     * @return
     */
    public boolean isVisible() {
        return visible;
    }

    /**
     * Getter nameId
     * 
     * @return
     */
    public String getNameId() {
        return nameId;
    }
    
    /**
     * Setter nameID
     * 
     * @param nameId
     */
    public void setNameId(String nameId) {
    	this.nameId = nameId;
    }

    /**
     * Getter flag che indica se il layer deve riportare lo slider per regolarne la trasparenza
     * 
     * @return
     */
    public boolean isWithOpacitySettings() {
        return withOpacitySettings;
    }

    /**
     * Setter flag con trasparenza
     * 
     * @param withOpacitySettings
     */
    public void setWithOpacitySettings(boolean withOpacitySettings) {
        this.withOpacitySettings = withOpacitySettings;
    }

    /**
     * Getter codTPN
     * 
     * @return
     */
    public Integer getCodTPN() {
        return codTPN;
    }

    /**
     * Setter codTPN
     * 
     * @param codTPN
     */
    public void setCodTPN(Integer codTPN) {
        this.codTPN = codTPN;
    }

    /**
     * Getter campo checked
     * 
     * @return
     */
    public boolean isChecked() {
        return checked;
    }

    /**
     * Setter campo checked
     * 
     * @param checked
     */
    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    /**
     * Getter minima scala di visualizzazione
     * 
     * @return
     */
	public double getMinScaleMin() {
		return minScaleMin;
	}

	/**
	 * Setter minima scala di visualizzazione
	 * 
	 * @param minScaleMin
	 */
	public void setMinScaleMin(double minScaleMin) {
		this.minScaleMin = minScaleMin;
	}

	/**
	 * Getter massima scala di visualizzazione
	 * 
	 * @return
	 */
	public double getMaxScaleMax() {
		return maxScaleMax;
	}

	/**
	 * Setter massima scala di visualizzazione
	 * 
	 * @param maxScaleMax
	 */
	public void setMaxScaleMax(double maxScaleMax) {
		this.maxScaleMax = maxScaleMax;
	}

	public List<TOCStyleBean> getDefinedStyles() {
		return definedStyles;
	}

	/**
	 * Setter valore style
	 * 
	 * @param style the style to set
	 */
	public void setStyle(String style) {
		this.style = style;
	}

	/**
	 * Getter 
	 * 
	 * @return the style
	 */
	public String getStyle() {
		return style;
	}

	/**
	 * @return ritorna catTreeIdx, che indica la posizione della categoria corrispondente all'interno del tag legenda
	 */
	public String getCatTreeIdx() {
		return catTreeIdx;
	}

	/**
	 * @return setta catTreeIdx, che indica la posizione della categoria corrispondente all'interno del tag legenda
	 */
	public void setCatTreeIdx(String catTreeIdx) {
		this.catTreeIdx = catTreeIdx;
	}

	/**
	 * @return ritorna layTreeIdx, che indica la posizione del layer corrispondente all'interno del tag legenda
	 */
	public String getLayTreeIdx() {
		return layTreeIdx;
	}

	/**
	 * @param setta layTreeIdx, che indica la posizione del layer corrispondente all'interno del tag legenda
	 */
	public void setLayTreeIdx(String catLayIdx) {
		this.layTreeIdx = catLayIdx;
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
	 * @return the styleCapable
	 */
	public Boolean getStyleCapable() {
		return styleCapable;
	}

	/**
	 * @param styleCapable the styleCapable to set
	 */
	public void setStyleCapable(Boolean styleCapable) {
		this.styleCapable = styleCapable;
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
	 * @return the temporaryNotAvailable
	 */
	public Boolean getTemporaryNotAvailable() {
		return temporaryNotAvailable;
	}

	/**
	 * @param temporaryNotAvailable the temporaryNotAvailable to set
	 */
	public void setTemporaryNotAvailable(Boolean temporaryNotAvailable) {
		this.temporaryNotAvailable = temporaryNotAvailable;
	}

	/**
	 * @return the bboxMaxX
	 */
	public Double getBboxMaxX() {
		return bboxMaxX;
	}

	/**
	 * @param bboxMaxX the bboxMaxX to set
	 */
	public void setBboxMaxX(Double bboxMaxX) {
		this.bboxMaxX = bboxMaxX;
	}

	/**
	 * @return the bboxMaxY
	 */
	public Double getBboxMaxY() {
		return bboxMaxY;
	}

	/**
	 * @param bboxMaxY the bboxMaxY to set
	 */
	public void setBboxMaxY(Double bboxMaxY) {
		this.bboxMaxY = bboxMaxY;
	}

	/**
	 * @return the bboxMinX
	 */
	public Double getBboxMinX() {
		return bboxMinX;
	}

	/**
	 * @param bboxMinX the bboxMinX to set
	 */
	public void setBboxMinX(Double bboxMinX) {
		this.bboxMinX = bboxMinX;
	}

	/**
	 * @return the bboxMinY
	 */
	public Double getBboxMinY() {
		return bboxMinY;
	}

	/**
	 * @param bboxMinY the bboxMinY to set
	 */
	public void setBboxMinY(Double bboxMinY) {
		this.bboxMinY = bboxMinY;
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
	 * @return the layerAbstract
	 */
	public String getLayerAbstract() {
		return layerAbstract;
	}

	/**
	 * @param layerAbstract the layerAbstract to set
	 */
	public void setLayerAbstract(String layerAbstract) {
		this.layerAbstract = layerAbstract;
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

    public Float getOpacity() {
        return opacity;
    }

    public void setOpacity(Float opacity) {
        this.opacity = opacity;
    }

	/**
	 * @return the parentcategorychecked
	 */
	public Boolean getParentcategorychecked() {
		return parentcategorychecked;
	}

	/**
	 * @param parentcategorychecked the parentcategorychecked to set
	 */
	public void setParentcategorychecked(Boolean parentcategorychecked) {
		this.parentcategorychecked = parentcategorychecked;
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
	 * Indica se il layer è interrogabile o no.
	 * @return true se è interrogabile
	 */
	public final Boolean getQueryable() {
		return queryable;
	}

	/**
	 * Imposta se il layer è interrogabile o no.
	 * @param queryable valore da impostare
	 */
	public void setQueryable(final Boolean queryable) {
		this.queryable = queryable;
	}

	/**
	 * Restituisce i formati disponibili per la chiamata GetFeatureInfo.
	 * 
	 * @return the getFeatureInfoFormats
	 */
	public final List<String> getGetFeatureInfoFormats() {
		return getFeatureInfoFormats;
	}

	/**
	 * @return the stiliIndipDaPosizione
	 */
	public Boolean getStiliIndipDaPosizione() {
		return stiliIndipDaPosizione;
	}

	/**
	 * @param stiliIndipDaPosizione the stiliIndipDaPosizione to set
	 */
	public void setStiliIndipDaPosizione(Boolean stiliIndipDaPosizione) {
		this.stiliIndipDaPosizione = stiliIndipDaPosizione;
	}

	/**
	 * Recupera attribuzione.
	 * 
	 * @return attribuzione
	 */
	public final WMSLayerCapabilitiesAttributionBean getAttribution() {
		return attribution;
	}

	/**
	 * Imposta attribuzione
	 * @param attributionattribuzione da impostare
	 */
	public final void setAttribution(final WMSLayerCapabilitiesAttributionBean attribution) {
		this.attribution = attribution;
	}

	/**
	 * Recupera lista metadati
	 * @return metadataUrlList
	 */
	public final List<WMSCapabilitiesMetadataURLBean> getMetadataUrlList() {
		return metadataUrlList;
	}
	
	
        
}
