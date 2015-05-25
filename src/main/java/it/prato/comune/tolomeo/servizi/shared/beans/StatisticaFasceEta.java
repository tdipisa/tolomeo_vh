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
package it.prato.comune.tolomeo.servizi.shared.beans;

import java.util.List;

public class StatisticaFasceEta {

	private List<FasciaEta> fasceEta;
	private int totMaschi = 0;
	private int totFemmine = 0;
	private int totItaliani = 0;
	private int totStranieri = 0;
	private int totGlobale = 0;
	
	public List<FasciaEta> getFasceEta() {
		return fasceEta;
	}
	public void setFasceEta(List<FasciaEta> fascieEta) {
		
		this.fasceEta = fascieEta;
		resetStatistica();
		
		for (FasciaEta fasciaEta : fascieEta) {
			addMaschi(fasciaEta.getMaschi());
			addFemmine(fasciaEta.getFemmine());
			addStranieri(fasciaEta.getStranieri());
			addItaliani(fasciaEta.getItaliani());	
			setTotGlobale(this.totGlobale + fasciaEta.getTotFascia());
		}
	}
	
	private void resetStatistica(){
		setTotMaschi(0);
		setTotFemmine(0);
		setTotItaliani(0);
		setTotStranieri(0);
		setTotGlobale(0);
	}
	
	/**
	 * Incrementa il numero dei maschi
	 * @param maschi
	 */
	public void addMaschi(int maschi) {
		this.totMaschi += maschi;
	}
	public int getTotMaschi() {
		return totMaschi;
	}
	public void setTotMaschi(int totMaschi) {
		this.totMaschi = totMaschi;
	}
	/**
	 * Incrementa il numero delle femmine
	 * @param maschi
	 */
	public void addFemmine(int femmine) {
		this.totFemmine += femmine;
	}
	public int getTotFemmine() {
		return totFemmine;
	}
	public void setTotFemmine(int totFemmine) {
		this.totFemmine = totFemmine;
	}
	/**
	 * Incrementa il numero degli italiani
	 * @param italiani
	 */
	public void addItaliani(int italiani) {
		this.totItaliani += italiani;
	}
	public int getTotItaliani() {
		return totItaliani;
	}
	public void setTotItaliani(int totItaliani) {
		this.totItaliani = totItaliani;
	}
	/**
	 * Incrementa il numero delle femmine
	 * @param maschi
	 */
	public void addStranieri(int stranieri) {
		this.totStranieri += stranieri;
	}
	public int getTotStranieri() {
		return totStranieri;
	}
	public void setTotStranieri(int totStranieri) {
		this.totStranieri = totStranieri;
	}
	public int getTotGlobale() {
		return Math.max(Math.max(getTotGlobaleMaschiFemmine(), getTotGlobaleItaStra()),this.totGlobale);
	}
	public int getTotGlobaleMaschiFemmine() {
		return totMaschi + totFemmine;
	}
	public int getTotGlobaleItaStra() {
		return totItaliani + totStranieri;
	}
	
	private void setTotGlobale(int totGlobale) {
		this.totGlobale = totGlobale;
	}
	
}
