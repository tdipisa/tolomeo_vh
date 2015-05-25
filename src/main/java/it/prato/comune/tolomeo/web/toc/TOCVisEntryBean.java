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

/**
 * Classe utilizzate in {@link TOCVisBean} e che contiene la descrizione del singolo layer ed inviare i dati al client in una chiamata di tipo update=true. 
 *
 * @author Ing. Alessandro Radaelli
 *
 */
public class TOCVisEntryBean {

	private String cat = "";
	private int lay = 0;
	private double minScaleMin = -1;
	private double maxScaleMax = -1;
	private String urlLegendaClasseUnica = "";
	
	/**
	 * Getter numero della categoria, corrisponde alla posizione della categoria di appertenenza di questo layer nel preset
	 * 
	 * @return
	 */
	public String getCat() {
		return cat;
	}
	
	/** 
	 * Setter numero della categoria
	 * 
	 * @param cat
	 */
	public void setCat(String cat) {
		this.cat = cat;
	}
	
	/**
	 * Getter numero del layer, corrisponde alla posizione del layer nel preset
	 * 
	 * @return
	 */
	public int getLay() {
		return lay;
	}
	
	/**
	 * Setter numero del layer
	 * 
	 * @param lay
	 */
	public void setLay(int lay) {
		this.lay = lay;
	}
	
	/**
	 * Getter scala minima di visualizzazione
	 * 
	 * @return
	 */
	public double getMinScaleMin() {
		return minScaleMin;
	}
	
	/**
	 * Setter scala minima di visualizzazione
	 * 
	 * @param minScaleMin
	 */
	public void setMinScaleMin(double minScaleMin) {
		this.minScaleMin = minScaleMin;
	}
	
	/**
	 * Getter scala massima di visualizzazione
	 * 
	 * @return
	 */
	public double getMaxScaleMax() {
		return maxScaleMax;
	}
	
	/** 
	 * Setter scala massima di visualizzazione
	 * 
	 * @param maxScaleMax
	 */
	public void setMaxScaleMax(double maxScaleMax) {
		this.maxScaleMax = maxScaleMax;
	}
	
	/**
	 * Getter url legenda classe unica (principalmente per geoserver)
	 * @return
	 */
	public String getUrlLegendaClasseUnica() {
		return urlLegendaClasseUnica;
	}
	
	/**
	 * Setter url legenda classe unica
	 * 
	 * @param urlLegendaClasseUnica
	 */
	public void setUrlLegendaClasseUnica(String urlLegendaClasseUnica) {
		this.urlLegendaClasseUnica = urlLegendaClasseUnica;
	}
	
}
