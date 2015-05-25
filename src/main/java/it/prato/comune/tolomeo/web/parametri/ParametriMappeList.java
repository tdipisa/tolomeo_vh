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

public class ParametriMappeList {

	private ArrayList<ParametriMappa> mappaList = new ArrayList<ParametriMappa>();
	private String googleAPIVersion = "3";
	private String googleAPIKey     = "";
	private String SRID             = "EPSG:3003";
	private String units            = "m";
	private Double maxExtentTop     = 4869227.;
	private Double maxExtentBottom  = 4852076.;
	private Double maxExtentLeft    = 1657419.;
	private Double maxExtentRight   = 1676400.;
	private Integer maxScale        = 200;
	private Integer minScale        = 150000;
	private String zoomLevels       = "100000,50000,25000,10000,5000,2000,1000,500,250";
	private Boolean settableZoom    = true;
	private String maxPrintFormat	= "A3";

	public Double getMaxExtentTop() {
		return maxExtentTop;
	}

	public void setMaxExtentTop(Double maxExtentTop) {
		this.maxExtentTop = maxExtentTop;
	}

	public Double getMaxExtentBottom() {
		return maxExtentBottom;
	}

	public void setMaxExtentBottom(Double maxExtentBottom) {
		this.maxExtentBottom = maxExtentBottom;
	}

	public Double getMaxExtentLeft() {
		return maxExtentLeft;
	}

	public void setMaxExtentLeft(Double maxExtentLeft) {
		this.maxExtentLeft = maxExtentLeft;
	}

	public Double getMaxExtentRight() {
		return maxExtentRight;
	}

	public void setMaxExtentRight(Double maxExtentRight) {
		this.maxExtentRight = maxExtentRight;
	}

	public Integer getMaxScale() {
		return maxScale;
	}

	public void setMaxScale(Integer maxScale) {
		this.maxScale = maxScale;
	}

	public Integer getMinScale() {
		return minScale;
	}

	public void setMinScale(Integer minScale) {
		this.minScale = minScale;
	}

	public ArrayList<ParametriMappa> getMappaList() {
		return mappaList;
	}

	public void addMappa(ParametriMappa a) {
		mappaList.add(a);        
	}

	public String getSRID() {
		return SRID;
	}

	public void setSRID(String srid) {
		SRID = srid;
	}

	public String getUnits() {
		return units;
	}

	public void setUnits(String units) {
		this.units = units;
	}

	public String getZoomLevels() {
		return zoomLevels;
	}

	public void setZoomLevels(String zoomLevels) {
		this.zoomLevels = zoomLevels;
	}

	public Boolean getSettableZoom() {
		return settableZoom;
	}

	public void setSettableZoom(Boolean settableZoom) {
		this.settableZoom = settableZoom;
	}

	public String getGoogleAPIVersion() {
		return googleAPIVersion;
	}

	public void setGoogleAPIVersion(String googleAPIVersion) {
		this.googleAPIVersion = googleAPIVersion;
	}    

	public boolean hasMapWithTypeCode(int typeCode) {
		for (ParametriMappa mappa: mappaList) {
			if (mappa.getTypeCode()==typeCode) return true;
		}
		return false;
	}

	public String getGoogleAPIKey() {
		return googleAPIKey;
	}

	public void setGoogleAPIKey(String googleAPIKey) {
		this.googleAPIKey = googleAPIKey;
	}

	/**
	 * @param mappaList the mappaList to set
	 */
	public void setMappaList(ArrayList<ParametriMappa> mappaList) {
		this.mappaList = mappaList;
	}

	/**
	 * @return the maxPrintFormat
	 */
	public String getMaxPrintFormat() {
		return maxPrintFormat;
	}

	/**
	 * @param maxPrintFormat the maxPrintFormat to set
	 */
	public void setMaxPrintFormat(String maxPrintFormat) {
		this.maxPrintFormat = maxPrintFormat;
	}
}
