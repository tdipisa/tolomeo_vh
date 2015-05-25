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
package it.prato.comune.tolomeo.servizi.pubblicaIstruzione.beans;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

/**
 * 
 * @author Mattia Gennari
 *
 */
public class StatisticaPlessoSecondariaPG {
	
	private String codice;
	private String nomePlesso;
	private String nomeLayer;
	private String jsonGeometry;
	private int etaMin;
	private int etaMax;
	private int maschi;
	private int femmine;
	private int totSesso;
	private int italiani;
	private int stranieri;
	private int totNazionalita;
	
	private HashMap<Integer, SecondariaPG> bambiniPerTipoIscrizione = new HashMap<Integer, SecondariaPG>();
	
	private HashMap<Integer, Integer> bambiniPerAnnoSolare = new HashMap<Integer, Integer>();
	
	/**
	 * Medoto che restituisce il bean <code>SecondariaPG</code> di uno specifico anno scolastico
	 * 
	 * @param annoScolasticoInf rappresenta l'anno inferiore dell'anno scolastico
	 * @return
	 */
	public SecondariaPG getSecondariaPG(int annoScolasticoInf){
		
		Integer asMin = new Integer(annoScolasticoInf);
		
		if(!bambiniPerTipoIscrizione.containsKey(asMin)){
			SecondariaPG media = new SecondariaPG(annoScolasticoInf);       
			this.bambiniPerTipoIscrizione.put(annoScolasticoInf, media);
		}
		
		return (SecondariaPG)bambiniPerTipoIscrizione.get(annoScolasticoInf);
	}
	
	/**
	 * Metodo che addiziona le iscrizioni obbligatorie per uno specifico anno scolastico
	 * @param annoScolasticoInf rappresenta l'anno inferiore dell'anno scolastico
	 */
	public void addIscrizioniObbligatorie(int annoScolasticoInf) {
		getSecondariaPG(annoScolasticoInf).addIscrizioniObbligatorie();
	}

	/**
	 * Metodo che addiziona le iscrizioni obbligatorie solo della classe prima per uno specifico anno scolastic
	 * @param annoScolasticoInf rappresenta l'anno inferiore dell'anno scolastico
	 */
	public void addIscrizioniObbligatorieClassiPrime(int annoScolasticoInf) {
		getSecondariaPG(annoScolasticoInf).addIscrizioniObbligatorieClassePrima();
	}
	
	/**
	 * Restituisce l'array degli anni scolastici (l'anno inferiore) in ordine crescente
	 * 
	 * @return un array di <code>Integer</code> contenente gli anni scolastici in ordine crescente
	 */
	public Integer[] getAnniScolasticiInf() {
		
		Integer[] anni = new Integer[bambiniPerTipoIscrizione.size()];
		
		Set keys = bambiniPerTipoIscrizione.keySet();
		int i = 0;

		for (Iterator iter = keys.iterator(); iter.hasNext();) {
			anni[i] = (Integer) iter.next();
			i++;
		}

		Arrays.sort(anni);
		
		return anni;
	}
	
	/**
	 * Medoto che setta la capienza delle classi prime per i rispettivi anni scolastici
	 * @param annoScolasticoInf rappresenta l'anno inferiore dell'anno scolastico
	 * @param capienzaClassiPrime la capienza per quell'anno
	 */
	public void setCapienzaClassiPrime(int annoScolasticoInf, int capienzaClassiPrime) {
		getSecondariaPG(annoScolasticoInf).setCapienzaClassiPrime(capienzaClassiPrime);
	}
	
	/**
	 * Medoto che ritorna la differenza tra gli iscritti obbligatori nella classi prime e la capienza delle classi prime per i rispettivi anni scolastici
	 * @param annoScolasticoInf rappresenta l'anno inferiore dell'anno scolastico
	 * @return la differenza tra iscritti obbligatori in prima e la capienza
	 */
	public int getDifferenza(int annoScolasticoInf) {
		return getSecondariaPG(annoScolasticoInf).getDifferenza();
	}
	
	//getter e setter
	public String getCodice() {
		return codice;
	}
	public void setCodice(String codice) {
		this.codice = codice;
	}
	public String getJsonGeometry() {
		return jsonGeometry;
	}
	public void setJsonGeometry(String jsonGeometry) {
		this.jsonGeometry = jsonGeometry;
	}
	public String getNomePlesso() {
		return nomePlesso;
	}
	public void setNomePlesso(String nomePlesso) {
		this.nomePlesso = nomePlesso;
	}
	public String getNomeLayer() {
		return nomeLayer;
	}
	public void setNomeLayer(String nomeLayer) {
		this.nomeLayer = nomeLayer;
	}
	public int getEtaMin() {
		return etaMin;
	}
	public void setEtaMin(int etaMin) {
		this.etaMin = etaMin;
	}
	public int getEtaMax() {
		return etaMax;
	}
	public void setEtaMax(int etaMax) {
		this.etaMax = etaMax;
	}
	public void addMaschi() {
		this.maschi++;
	}
	public int getMaschi() {
		return maschi;
	}
	public void setMaschi(int maschi) {
		this.maschi = maschi;
	}
	public void addFemmine() {
		this.femmine++;
	}
	public int getFemmine() {
		return femmine;
	}
	public void setFemmine(int femmine) {
		this.femmine = femmine;
	}
	public int getTotSesso() {
		return (this.maschi + this.femmine);
	}
	public void setTotSesso(int totSesso) {
		this.totSesso = totSesso;
	}
	public void addItaliani() {
		this.italiani++;
	}
	public int getItaliani() {
		return italiani;
	}
	public void setItaliani(int italiani) {
		this.italiani = italiani;
	}
	public void addStranieri() {
		this.stranieri++;
	}
	public int getStranieri() {
		return stranieri;
	}
	public void setStranieri(int stranieri) {
		this.stranieri = stranieri;
	}
	public int getTotNazionalita() {
		return (this.italiani + this.stranieri);
	}
	public void setTotNazionalita(int totNazionalita) {
		this.totNazionalita = totNazionalita;
	}
	
	public HashMap<Integer, Integer> getBambiniPerAnnoSolare() {
		return bambiniPerAnnoSolare;
	}
	public void setBambiniPerAnnoSolare(HashMap<Integer, Integer> bambiniPerAnnoSolare) {
		this.bambiniPerAnnoSolare = bambiniPerAnnoSolare;
	}
}
